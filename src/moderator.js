const chalk = require('chalk');
const luxon = require('luxon');
const schedule = require('node-schedule');
const _ = require('lodash');

const {
  createRemoveAffiliateLinksEmbed,
  createSuspiciousWordsEmbed,
} = require('./embed');
const { generateLogMessage } = require('./utilities');

/**
 * Anti-raid auto-ban.
 *
 * @param {module:"discord.js".GuildMember} member  - Member information.
 * @param {object}                          banList - Banned users from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidAutoBan(member, banList) {
  const userAvatar = member.user.avatar;
  const userUsername = member.user.username;
  const avatars = _.get(banList, 'avatar');
  const usernames = _.get(banList, 'username');

  // If user has a banned avatar hash (and configuration is set).
  if (_.isArray(avatars) && !_.isEmpty(avatars) && _.every(avatars, (avatar) => _.isString(avatar) && !_.isEmpty(avatar))) {
    if (userAvatar && _.includes(avatars, userAvatar)) {
      await member.ban(
        {
          reason: `Member was detected with a banned avatar hash (${userAvatar})`,
        },
      ).then(() => {
        generateLogMessage(
          [
            chalk.red(member.toString()),
            'was automatically banned by avatar hash',
          ].join(' '),
          40,
        );
      }).catch((error) => generateLogMessage(
        'Failed to ban member',
        10,
        error,
      ));

      // No need to ban twice.
      return;
    }
  }

  // If user has a banned username (and configuration is set).
  if (_.isArray(usernames) && !_.isEmpty(usernames) && _.every(usernames, (username) => _.isString(username) && !_.isEmpty(username))) {
    if (_.includes(usernames, userUsername)) {
      await member.ban(
        {
          reason: `Member was detected with a banned username (${userUsername})`,
        },
      ).then(() => {
        generateLogMessage(
          [
            chalk.red(member.toString()),
            'was automatically banned by username',
          ].join(' '),
          40,
        );
      }).catch((error) => generateLogMessage(
        'Failed to ban member',
        10,
        error,
      ));
    }
  }
}

/**
 * Anti-raid auto-kick.
 *
 * @param {module:"discord.js".GuildMember} member   - Member information.
 * @param {object}                          settings - Anti-raid settings from configuration.
 * @param {object}                          storage  - Anti-raid session storage.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidAutoKick(member, settings, storage) {
  const userCreatedTimestamp = member.user.createdTimestamp;
  const userAge = Date.now() - userCreatedTimestamp;
  const minimumAge = _.get(settings, 'minimum-age');
  const message = _.get(settings, 'message');

  // Member does not meet minimum age requirements and is not excluded from auto-kick.
  if (_.isFinite(minimumAge) && !(userAge >= minimumAge) && !_.includes(storage.whitelist, member.id)) {
    // Set a tracker if anti-raid DM never sent to user.
    if (_.get(storage, `dmTracker[${member.id}]`) === undefined) {
      _.set(storage, `dmTracker[${member.id}]`, false);
    }

    // If bot has never sent an anti-raid DM to user (and message is set).
    if (_.isString(message) && !_.isEmpty(message) && _.get(storage, `dmTracker[${member.id}]`) === false) {
      await member.createDM().then(async (dmChannel) => {
        await dmChannel.send(message).then(() => {
          _.set(storage, `dmTracker[${member.id}]`, true);

          generateLogMessage(
            [
              'Sent direct message to',
              chalk.green(member.toString()),
              'because member did not meet minimum age requirements',
            ].join(' '),
            40,
          );
        }).catch((error) => generateLogMessage(
          'Failed to send direct message',
          10,
          error,
        ));
      }).catch((error) => generateLogMessage(
        'Failed to create direct message channel',
        10,
        error,
      ));
    }

    // Kick member after sending anti-raid message to user.
    await member.kick('Member does not meet minimum age requirements').then(() => {
      generateLogMessage(
        [
          chalk.red(member.toString()),
          'was automatically kicked because member does not meet minimum age requirements',
        ].join(' '),
        40,
      );
    }).catch((error) => generateLogMessage(
      'Failed to kick member',
      10,
      error,
    ));
  }
}

/**
 * Anti-raid scanner.
 *
 * @param {module:"discord.js".Guild} guild           - Discord guild.
 * @param {object}                    scannerSettings - User scanner settings from configuration.
 * @param {TextBasedChannel}          sendToChannel   - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidScanner(guild, scannerSettings, sendToChannel) {
  const message = _.get(scannerSettings, 'message');
  const whitelistedAvatars = _.get(scannerSettings, 'whitelisted-avatars');

  let lastSentMessage = 0;

  if (!guild || !message || !sendToChannel) {
    return;
  }

  schedule.scheduleJob('* * * * *', () => {
    const guildMembers = guild.members.cache.array();
    const nowInSeconds = luxon.DateTime.now().toSeconds();
    const finalList = [];

    let avatars = {};

    generateLogMessage(
      `Initiating user scanner for the ${guild.name} guild`,
      40,
    );

    // Remap users based on their avatar.
    _.forEach(guildMembers, (guildMember) => {
      const { avatar } = guildMember.user;

      if (avatar !== null && !_.includes(whitelistedAvatars, avatar)) {
        // Create entry for avatar hash if it does not exist.
        if (avatars[avatar] === undefined) {
          avatars[avatar] = [];
        }

        avatars[avatar].push(guildMember.toString());
      }
    });

    /**
     * Convert object to array for loop later.
     *
     * @type {[string, string[]][]}
     */
    avatars = Object.entries(avatars);

    _.forEach(avatars, (avatar) => {
      const ids = avatar[1];

      if (_.size(ids) > 1) {
        finalList.push(...ids);
      }
    });

    if (_.size(finalList)) {
      generateLogMessage(
        `Duplicate users have been detected for the ${guild.name} guild`,
        40,
      );

      // If a message was sent less than 10 minutes ago, it will skip.
      if ((nowInSeconds - lastSentMessage) > 600) {
        sendToChannel.send(message).then(() => {
          lastSentMessage = nowInSeconds;
        }).catch((error) => generateLogMessage(
          'Failed to send message',
          10,
          error,
        ));
      }
    }
  });
}

/**
 * Check regex channels.
 *
 * @param {module:"discord.js".Message} message    - Message object.
 * @param {object[]}                    regexRules - Regex rules from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function checkRegexChannels(message, regexRules) {
  const isTextBasedChannel = message.channel.isText();
  const regexRule = _.find(regexRules, { 'channel-id': message.channel.id });
  const regexRuleName = _.get(regexRule, 'name', 'Unknown');
  const regexRulePattern = _.get(regexRule, 'regex.pattern', '(?:)');
  const regexRuleFlags = _.get(regexRule, 'regex.flags', 'g');
  const excludedRoles = _.get(regexRule, 'exclude-roles', []);
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => message.member.roles.cache.has(excludedRole.id));

  let match;

  if (!isTextBasedChannel || !regexRule) {
    return;
  }

  try {
    match = new RegExp(regexRulePattern, regexRuleFlags).test(message.toString());
  } catch (error) {
    generateLogMessage(
      [
        '"regex.pattern" or "regex.flags" for',
        chalk.red(regexRuleName),
        'is invalid',
      ].join(' '),
      10,
      error,
    );

    return;
  }

  if (!match && !hasExcludedRoles && !message.member.hasPermission('ADMINISTRATOR')) {
    await message.delete().catch((error) => generateLogMessage(
      'Failed to delete message',
      10,
      error,
    ));
  }
}

/**
 * Detects suspicious words.
 *
 * @param {module:"discord.js".Message} message         - Message object.
 * @param {object[]}                    suspiciousWords - Suspicious words from configuration.
 * @param {TextChannel}                 sendToChannel   - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function detectSuspiciousWords(message, suspiciousWords, sendToChannel) {
  const categories = [];
  const theMessage = message.reactions.message.toString() || message.toString();
  const theMessageClean = theMessage
    .replace(/[.,\\/<>@#!?$%^&*;:{}=+|\-_'“"”`~[\]()]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .toLowerCase();

  // If suspicious words is not configured properly.
  if (!_.isArray(suspiciousWords) || _.isEmpty(suspiciousWords) || !_.every(suspiciousWords, _.isPlainObject)) {
    return;
  }

  // Check for suspicious words.
  _.forEach(suspiciousWords, (suspiciousWord) => {
    const category = _.get(suspiciousWord, 'category', 'Unknown');
    const words = _.get(suspiciousWord, 'words', []);

    if (_.isArray(words) && !_.isEmpty(words) && _.every(words, (word) => _.isString(word) && !_.isEmpty(word))) {
      if (new RegExp(`(?:[\\s]|^)(${words.join('|')})(?=[\\s]|$)`).test(theMessageClean)) {
        categories.push(category);
      }
    }
  });

  // If no suspicious words detected.
  if (!_.size(categories)) {
    return;
  }

  generateLogMessage(
    [
      'Message sent by',
      chalk.yellow(message.author.toString()),
      'in',
      chalk.yellow(message.channel.toString()),
      'includes suspicious words',
    ].join(' '),
    40,
  );

  await sendToChannel.send(createSuspiciousWordsEmbed(
    message.author.toString(),
    message.channel.toString(),
    message.id,
    theMessage,
    message.attachments,
    message.url,
    categories,
  )).catch((error) => generateLogMessage(
    'Failed to send suspicious words embed',
    10,
    error,
  ));
}

/**
 * Remove affiliate links.
 *
 * @param {module:"discord.js".Message} message        - Discord message object.
 * @param {object}                      affiliateLinks - Affiliate link regex from configuration.
 * @param {TextChannel}                 sendToChannel  - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function removeAffiliateLinks(message, affiliateLinks, sendToChannel) {
  const websites = [];
  const theMessage = message.reactions.message.toString() || message.toString();
  const links = _.get(affiliateLinks, 'links', []);
  const excludedRoles = _.get(affiliateLinks, 'excluded-roles', []);
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => message.member.roles.cache.has(excludedRole.id));

  // Scan through list of affiliate links.
  _.forEach(links, (link) => {
    const website = _.get(link, 'website', 'Unknown');
    const regexPattern = _.get(link, 'regex.pattern', '(?:)');
    const regexFlags = _.get(link, 'regex.flags', 'g');

    let match;

    try {
      match = new RegExp(regexPattern, regexFlags).test(theMessage);
    } catch (error) {
      generateLogMessage(
        [
          '"regex.pattern" or "regex.flags" for',
          chalk.red(website),
          'is invalid',
        ].join(' '),
        10,
        error,
      );

      return;
    }

    if (match) {
      websites.push(website);
    }
  });

  // If no websites detected.
  if (!_.size(websites)) {
    return;
  }

  generateLogMessage(
    [
      'Message sent by',
      chalk.yellow(message.author.toString()),
      'in',
      chalk.yellow(message.channel.toString()),
      'includes affiliate links',
    ].join(' '),
    40,
  );

  await sendToChannel.send(createRemoveAffiliateLinksEmbed(
    message.author.toString(),
    message.channel.toString(),
    message.id,
    theMessage,
    message.attachments,
    message.url,
    websites,
  )).catch((error) => generateLogMessage(
    'Failed to send remove affiliate links embed',
    10,
    error,
  ));

  if (!hasExcludedRoles && !message.member.hasPermission('ADMINISTRATOR')) {
    await message.delete().catch((error) => generateLogMessage(
      'Failed to delete message',
      10,
      error,
    ));
  }
}

module.exports = {
  antiRaidAutoBan,
  antiRaidAutoKick,
  antiRaidScanner,
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
};
