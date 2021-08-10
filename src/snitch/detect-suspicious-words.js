const chalk = require('chalk');
const _ = require('lodash');

const { createSuspiciousWordsEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Detect suspicious words.
 *
 * @param {Message}     message         - Message object.
 * @param {object[]}    suspiciousWords - Suspicious words from configuration.
 * @param {TextChannel} sendToChannel   - Send message to channel.
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
    30,
  );

  await sendToChannel.send({
    embeds: [
      createSuspiciousWordsEmbed(
        message.author.toString(),
        message.channel.toString(),
        message.id,
        theMessage,
        message.attachments,
        message.url,
        categories,
      ),
    ],
  }).catch((error) => generateLogMessage(
    'Failed to send suspicious words embed',
    10,
    error,
  ));
}

module.exports = {
  detectSuspiciousWords,
};
