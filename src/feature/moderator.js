const chalk = require('chalk');
const { Permissions } = require('discord.js');
const _ = require('lodash');

const { createRemoveAffiliateLinksEmbed } = require('../lib/embed');
const {
  generateLogMessage,
  getTextBasedChannel,
} = require('../lib/utilities');

/**
 * Check regex channels.
 *
 * @param {Message}  message    - Message object.
 * @param {object[]} regexRules - Regex rules from configuration.
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

  if (
    match === false
    && hasExcludedRoles === false
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    // Send direct message.
    if (_.isString(directMessage) && !_.isEmpty(directMessage)) {
      await message.member.createDM().then(async (dmChannel) => {
        await dmChannel.send({
          content: directMessage,
        }).then(() => {
          generateLogMessage(
            [
              'Sent direct message to',
              chalk.green(message.member.toString()),
              'because member did not follow regex rules',
            ].join(' '),
            30,
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

    // Delete message.
    await message.delete().catch((error) => generateLogMessage(
      'Failed to delete message',
      10,
      error,
    ));
  }
}

/**
 * Remove affiliate links.
 *
 * @param {Message} message        - Discord message object.
 * @param {object}  affiliateLinks - Affiliate link regex from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function removeAffiliateLinks(message, affiliateLinks) {
  const websites = [];
  const theMessage = message.reactions.message.toString() || message.toString();
  const links = _.get(affiliateLinks, 'links');
  const channelId = _.get(affiliateLinks, 'channel-id');
  const directMessage = _.get(affiliateLinks, 'direct-message');
  const excludedRoles = _.get(affiliateLinks, 'excluded-roles');
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => message.member.roles.cache.has(excludedRole.id) === true);

  const channel = getTextBasedChannel(message.guild, channelId);

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
    30,
  );

  if (!_.isUndefined(channel)) {
    await channel.send({
      embeds: [
        createRemoveAffiliateLinksEmbed(
          message.author.toString(),
          message.channel.toString(),
          message.id,
          theMessage,
          message.attachments,
          message.url,
          websites,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send remove affiliate links embed',
      10,
      error,
    ));
  }

  if (
    hasExcludedRoles === false
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    if (_.isString(directMessage) && !_.isEmpty(directMessage)) {
      await message.member.createDM().then(async (dmChannel) => {
        await dmChannel.send({
          content: directMessage,
        }).then(() => {
          generateLogMessage(
            [
              'Sent direct message to',
              chalk.green(message.member.toString()),
              'because member sent affiliate links',
            ].join(' '),
            30,
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
  checkRegexChannels,
  removeAffiliateLinks,
};
