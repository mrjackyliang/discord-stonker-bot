import {
  Message,
  PartialMessage,
  Permissions,
} from 'discord.js';
import _ from 'lodash';

import { createRemoveAffiliateLinksEmbed, createSuspiciousWordsEmbed } from '../lib/embed';
import {
  generateLogMessage,
  getTextBasedChannel,
} from '../lib/utilities';
import { AffiliateLinks, RegexRules, SuspiciousWords } from '../types';

/**
 * Check regex channels.
 *
 * @param {Message|PartialMessage} message    - Message object.
 * @param {RegexRules}             regexRules - Regex rules from configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function checkRegexChannels(message: Message | PartialMessage, regexRules: RegexRules): void {
  if (!message.member) {
    return;
  }

  const {
    channel,
    member,
    reactions,
    url,
  } = message;
  const theMessage = reactions.message.toString() ?? message.toString();
  const isTextBasedChannel = channel.isText();
  const regexRule = _.find(regexRules, { 'channel-id': channel.id });
  const regexRuleName = _.get(regexRule, 'name', 'Unknown');
  const regexRulePattern = _.get(regexRule, 'regex.pattern');
  const regexRuleFlags = _.get(regexRule, 'regex.flags');
  const directMessage = _.get(regexRule, 'direct-message');
  const excludedRoles = _.get(regexRule, 'exclude-roles');
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => member.roles.resolve(excludedRole.id) !== null);

  let match;

  if (!isTextBasedChannel || regexRule === undefined) {
    return;
  }

  try {
    match = new RegExp(regexRulePattern, regexRuleFlags).test(theMessage);
  } catch (error) {
    generateLogMessage(
      [
        '"regex.pattern" or "regex.flags" is invalid',
        `(function: checkRegexChannels, name: ${regexRuleName}, pattern: ${regexRulePattern}, flags: ${regexRuleFlags})`,
      ].join(' '),
      10,
      error,
    );

    return;
  }

  if (
    !match
    && !hasExcludedRoles
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    // Send direct message.
    if (_.isString(directMessage) && !_.isEmpty(directMessage)) {
      const payload = {
        content: directMessage,
      };

      member.createDM().then((dmChannel) => {
        dmChannel.send(payload).then(() => {
          generateLogMessage(
            [
              'Sent direct message',
              `(function: checkRegexChannels, name: ${regexRuleName}, member: ${member.toString()})`,
            ].join(' '),
            30,
          );
        }).catch((error) => generateLogMessage(
          [
            'Failed to send direct message',
            `(function: checkRegexChannels, name: ${regexRuleName}, member: ${member.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      }).catch((error) => generateLogMessage(
        [
          'Failed to create direct message channel',
          `(function: checkRegexChannels, name: ${regexRuleName}, member: ${member.toString()})`,
        ].join(' '),
        10,
        error,
      ));
    }

    // Delete message.
    message.delete().catch((error) => generateLogMessage(
      [
        'Failed to delete message',
        `(function: checkRegexChannels, message url: ${url})`,
      ].join(' '),
      10,
      error,
    ));
  }
}

/**
 * Detect suspicious words.
 *
 * @param {Message|PartialMessage}    message         - Message object.
 * @param {SuspiciousWords|undefined} suspiciousWords - Suspicious words from configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function detectSuspiciousWords(message: Message | PartialMessage, suspiciousWords: SuspiciousWords | undefined): void {
  if (!message.author || !message.guild) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    guild,
    id,
    reactions,
    url,
  } = message;
  const channelId = _.get(suspiciousWords, 'channel-id');
  const categories = _.get(suspiciousWords, 'categories');
  const sendToChannel = getTextBasedChannel(guild, channelId);
  const detectedCategories: string[] = [];
  const theMessage = reactions.message.toString() ?? message.toString();
  const theMessageCleaned = theMessage
    .replace(/[.,\\/<>@#!?$%^&*;:{}=+|\-_'“"”`~[\]()]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .toLowerCase();

  // If suspicious words is not configured properly.
  if (!sendToChannel || !_.isArray(categories) || _.isEmpty(categories) || !_.every(categories, _.isPlainObject)) {
    return;
  }

  // Check for suspicious words.
  _.forEach(categories, (category) => {
    const categoryCategory = _.get(category, 'category', 'Unknown');
    const categoryWords = _.get(category, 'words');

    if (_.isArray(categoryWords) && !_.isEmpty(categoryWords) && _.every(categoryWords, (categoryWord) => _.isString(categoryWord) && !_.isEmpty(categoryWord))) {
      if (new RegExp(`(?:[\\s]|^)(${categoryWords.join('|')})(?=[\\s]|$)`).test(theMessageCleaned)) {
        detectedCategories.push(categoryCategory);
      }
    }
  });

  // If no suspicious words detected.
  if (_.size(detectedCategories) < 1) {
    return;
  }

  generateLogMessage(
    [
      'Message includes suspicious words',
      `(function: detectSuspiciousWords, author: ${author.toString()}, categories: ${JSON.stringify(detectedCategories)}, message id: ${id})`,
    ].join(' '),
    30,
  );

  if (sendToChannel) {
    sendToChannel.send({
      embeds: [
        createSuspiciousWordsEmbed(
          author.toString(),
          channel.toString(),
          id,
          theMessage,
          attachments,
          url,
          detectedCategories,
        ),
      ],
    }).catch((error) => generateLogMessage(
      [
        'Failed to send embed',
        `(function: detectSuspiciousWords, channel: ${sendToChannel.toString()})`,
      ].join(' '),
      10,
      error,
    ));
  }
}

/**
 * Remove affiliate links.
 *
 * @param {Message|PartialMessage} message        - Discord message object.
 * @param {AffiliateLinks}         affiliateLinks - Affiliate link regex from configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function removeAffiliateLinks(message: Message | PartialMessage, affiliateLinks: AffiliateLinks): void {
  if (!message.author || !message.guild || !message.member) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    id,
    guild,
    member,
    reactions,
    url,
  } = message;
  const websites: string[] = [];
  const theMessage = reactions.message.toString() ?? message.toString();
  const links = _.get(affiliateLinks, 'links');
  const channelId = _.get(affiliateLinks, 'channel-id');
  const directMessage = _.get(affiliateLinks, 'direct-message');
  const excludedRoles = _.get(affiliateLinks, 'excluded-roles');
  const hasExcludedRoles = _.some(excludedRoles, (excludedRole) => member.roles.resolve(excludedRole.id) !== null);

  const sendToChannel = getTextBasedChannel(guild, channelId);

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
          '"regex.pattern" or "regex.flags" is invalid',
          `(function: removeAffiliateLinks, website: ${website}, pattern: ${regexPattern}, flags: ${regexFlags})`,
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
  if (_.size(websites) < 1) {
    return;
  }

  generateLogMessage(
    [
      'Message includes affiliate links',
      `(function: removeAffiliateLinks, author: ${author.toString()}, websites: ${JSON.stringify(websites)}, message id: ${id})`,
    ].join(' '),
    30,
  );

  if (sendToChannel) {
    sendToChannel.send({
      embeds: [
        createRemoveAffiliateLinksEmbed(
          author.toString(),
          channel.toString(),
          id,
          theMessage,
          attachments,
          url,
          websites,
        ),
      ],
    }).catch((error) => generateLogMessage(
      [
        'Failed to send embed',
        `(function: removeAffiliateLinks, channel: ${sendToChannel.toString()})`,
      ].join(' '),
      10,
      error,
    ));
  }

  if (
    !hasExcludedRoles
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    if (_.isString(directMessage) && !_.isEmpty(directMessage)) {
      const payload = {
        content: directMessage,
      };

      member.createDM().then((dmChannel) => {
        dmChannel.send(payload).then(() => {
          generateLogMessage(
            [
              'Sent direct message',
              `(function: removeAffiliateLinks, websites: ${JSON.stringify(websites)}, member: ${member.toString()})`,
            ].join(' '),
            30,
          );
        }).catch((error) => generateLogMessage(
          [
            'Failed to send direct message',
            `(function: removeAffiliateLinks, websites: ${JSON.stringify(websites)}, member: ${member.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      }).catch((error) => generateLogMessage(
        [
          'Failed to create direct message channel',
          `(function: removeAffiliateLinks, websites: ${JSON.stringify(websites)}, member: ${member.toString()})`,
        ].join(' '),
        10,
        error,
      ));
    }

    message.delete().catch((error) => generateLogMessage(
      [
        'Failed to delete message',
        `(function: removeAffiliateLinks, message url: ${url})`,
      ].join(' '),
      10,
      error,
    ));
  }
}
