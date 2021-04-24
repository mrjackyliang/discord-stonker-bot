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
 * Automatic ban.
 *
 * @param {module:"discord.js".GuildMember} member      - Member information.
 * @param {object}                          bannedUsers - Banned users from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function automaticBan(member, bannedUsers) {
  const avatars = _.get(bannedUsers, 'avatar');
  const usernames = _.get(bannedUsers, 'username');

  // If member has a banned avatar.
  if (!_.isEmpty(avatars) && _.isArray(avatars) && _.every(avatars, (avatar) => _.isString(avatar) && !_.isEmpty(avatar))) {
    const userAvatar = member.user.avatar;

    // If user has a banned avatar hash.
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

  // If user has a banned username.
  if (!_.isEmpty(usernames) && _.isArray(usernames) && _.every(usernames, (username) => _.isString(username) && !_.isEmpty(username))) {
    const userUsername = member.user.username;

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
  if (_.isEmpty(suspiciousWords) || !_.isArray(suspiciousWords) || !_.every(suspiciousWords, _.isPlainObject)) {
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
  if (!categories.length) {
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
    const regexPattern = _.get(link, 'regex-pattern', '(?:)');
    const regexFlags = _.get(link, 'regex-flags', 'g');

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
  if (!websites.length) {
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

/**
 * User scanner.
 *
 * @param {module:"discord.js".Guild} guild         - Discord guild.
 * @param {string}                    message       - Message to send when duplicate users detected.
 * @param {TextBasedChannel}          sendToChannel - User scanner settings from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userScanner(guild, message, sendToChannel) {
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

      if (avatar !== null) {
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

      if (ids.length > 1) {
        finalList.push(...ids);
      }
    });

    if (finalList.length) {
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

module.exports = {
  automaticBan,
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
  userScanner,
};
