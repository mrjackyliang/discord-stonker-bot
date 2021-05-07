const chalk = require('chalk');
const luxon = require('luxon');
const schedule = require('node-schedule');
const _ = require('lodash');

const {
  createMemberMonitorEmbed,
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
    if (userAvatar !== null && _.includes(avatars, userAvatar)) {
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
  const memberUserAvatar = member.user.avatar;
  const memberUserCreatedTimestamp = member.user.createdTimestamp;
  const userAge = Date.now() - memberUserCreatedTimestamp;
  const minimumAge = _.get(settings, 'minimum-age');
  const forceAvatar = _.get(settings, 'force-avatar');
  const directMessage = _.get(settings, 'direct-message');

  // Set a direct message tracker.
  if (_.get(storage, `dmTracker[${member.id}]`) === undefined) {
    _.set(storage, `dmTracker[${member.id}]`, false);
  }

  // Member does not meet minimum age requirements or does not have an avatar and is not excluded from auto-kick.
  if (
    (_.isFinite(minimumAge) && !(userAge >= minimumAge) && !_.includes(storage.whitelist, member.id))
    || (forceAvatar === true && memberUserAvatar === null && !_.includes(storage.whitelist, member.id))
  ) {
    // If user has never been sent an anti-raid direct message before.
    if (
      _.isString(directMessage)
      && !_.isEmpty(directMessage)
      && _.get(storage, `dmTracker[${member.id}]`) === false
    ) {
      await member.createDM().then(async (dmChannel) => {
        await dmChannel.send(directMessage).then(() => {
          _.set(storage, `dmTracker[${member.id}]`, true);

          generateLogMessage(
            [
              'Sent direct message to',
              chalk.green(member.toString()),
              'because member was kicked by anti-raid detection',
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

    // Kick member because member does not meet minimum age requirements.
    if (_.isFinite(minimumAge) && !(userAge >= minimumAge) && !_.includes(storage.whitelist, member.id)) {
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

      // No need to kick twice.
      return;
    }

    // Kick member because member does not have avatar.
    if (forceAvatar === true && memberUserAvatar === null && !_.includes(storage.whitelist, member.id)) {
      await member.kick('Member does not have avatar').then(() => {
        generateLogMessage(
          [
            chalk.red(member.toString()),
            'was automatically kicked because member does not have avatar',
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
}

/**
 * Anti-raid monitor.
 *
 * @param {module:"discord.js".GuildMember} member        - Member information.
 * @param {"join"|"leave"}                  mode          - Whether a user joined or left a guild.
 * @param {TextBasedChannel}                sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidMonitor(member, mode, sendToChannel) {
  if (_.isUndefined(sendToChannel)) {
    return;
  }

  sendToChannel.send(createMemberMonitorEmbed(
    mode,
    member.user,
  )).catch((error) => generateLogMessage(
    'Failed to send member monitor embed',
    10,
    error,
  ));
}

/**
 * Anti-raid scanner.
 *
 * @param {module:"discord.js".Guild} guild         - Discord guild.
 * @param {object}                    settings      - User scanner settings from configuration.
 * @param {TextBasedChannel}          sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidScanner(guild, settings, sendToChannel) {
  const message = _.get(settings, 'message');
  const messageInterval = _.get(settings, 'message-interval');
  const whitelistedAvatars = _.get(settings, 'whitelisted-avatars');

  let lastSentMessage = 0;

  if (_.isUndefined(guild) || !_.isString(message) || _.isEmpty(message) || !_.isFinite(messageInterval) || _.isUndefined(sendToChannel)) {
    return;
  }

  schedule.scheduleJob('* * * * *', () => {
    const guildMembers = guild.members.cache.array();
    const nowInSeconds = luxon.DateTime.now().toSeconds();
    const finalList = [];

    let avatars = {};

    generateLogMessage(
      `Scanning for duplicate members in the ${guild.name} guild`,
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

    if (_.size(finalList) > 0) {
      generateLogMessage(
        `Duplicate members have been detected in the ${guild.name} guild`,
        40,
      );

      // Skip message alert if sent recently.
      if ((nowInSeconds - lastSentMessage) > messageInterval) {
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
  const regexRulePattern = _.get(regexRule, 'regex.pattern');
  const regexRuleFlags = _.get(regexRule, 'regex.flags');
  const directMessage = _.get(regexRule, 'direct-message');
  const excludedRoles = _.get(regexRule, 'exclude-roles');
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => message.member.roles.cache.has(excludedRole.id) === true);

  let match;

  if (_.isUndefined(isTextBasedChannel) || _.isUndefined(regexRule)) {
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

  if (match === false && hasExcludedRoles === false && !message.member.hasPermission('ADMINISTRATOR')) {
    if (_.isString(directMessage) && !_.isEmpty(directMessage)) {
      await message.member.createDM().then(async (dmChannel) => {
        await dmChannel.send(directMessage).then(() => {
          generateLogMessage(
            [
              'Sent direct message to',
              chalk.green(message.member.toString()),
              'because member did not follow regex rules',
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
      if (new RegExp(`(?:[\\s]|^)(${words.join('|')})(?=[\\s]|$)`).test(theMessageClean) === true) {
        categories.push(category);
      }
    }
  });

  // If no suspicious words detected.
  if (_.size(categories) < 1) {
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
  const links = _.get(affiliateLinks, 'links');
  const directMessage = _.get(affiliateLinks, 'direct-message');
  const excludedRoles = _.get(affiliateLinks, 'excluded-roles');
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => message.member.roles.cache.has(excludedRole.id) === true);

  // Scan through list of affiliate links.
  _.forEach(links, (link) => {
    const website = _.get(link, 'website', 'Unknown');
    const regexPattern = _.get(link, 'regex.pattern');
    const regexFlags = _.get(link, 'regex.flags');

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

    if (match === true) {
      websites.push(website);
    }
  });

  // If no websites detected.
  if (_.size(websites) < 1) {
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

  if (hasExcludedRoles === false && !message.member.hasPermission('ADMINISTRATOR')) {
    if (_.isString(directMessage) && !_.isEmpty(directMessage)) {
      await message.member.createDM().then(async (dmChannel) => {
        await dmChannel.send(directMessage).then(() => {
          generateLogMessage(
            [
              'Sent direct message to',
              chalk.green(message.member.toString()),
              'because member sent affiliate links',
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
  antiRaidMonitor,
  antiRaidScanner,
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
};
