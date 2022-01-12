import axios from 'axios';
import { Guild, Message, Permissions } from 'discord.js';
import _ from 'lodash';
import { scheduleJob } from 'node-schedule';

import { ApiFetchSettings } from '../types';
import { generateLogMessage, getTextBasedChannel } from '../lib/utilities';

const apiCache = {
  etherscanGasOracle: {
    content: null,
  },
  stocktwitsTrending: {
    content: null,
  },
};

/**
 * Etherscan gas oracle.
 *
 * @param {Guild}            guild    - Discord guild.
 * @param {ApiFetchSettings} settings - API fetch settings.
 * @param {Message}          message  - Message object.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export function etherscanGasOracle(guild: Guild, settings: ApiFetchSettings, message?: Message): void {
  const settingsApiKey = _.get(settings, 'settings.api-key');
  const feedChannelId = _.get(settings, 'feed.channel-id');
  const feedChannel = getTextBasedChannel(guild, feedChannelId);
  const commandRegexPattern = _.get(settings, 'command.regex.pattern');
  const commandRegexFlags = _.get(settings, 'command.regex.flags');
  const commandAllowedRoles = _.get(settings, 'command.allowed-roles');

  if (!feedChannel && (!commandRegexPattern || !commandRegexFlags)) {
    return;
  }

  // Cache and update feed.
  if (_.get(apiCache, 'etherscanGasOracle.content') === null) {
    /**
     * Etherscan API (Unauthenticated).
     * Unauthenticated allows 1 call/5 seconds, up to 17,280 calls/day.
     *
     * Used: 1 call/10 seconds, 8,640 API calls/day.
     */
    scheduleJob('0/10 * * * * *', () => {
      const apiKeyParam = settingsApiKey ? `&apikey=${settingsApiKey}` : '';

      axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle${apiKeyParam}`).then((response) => {
        const data = _.get(response, 'data');
        const status = _.get(data, 'status');
        const result = _.get(data, 'result');

        // Status with "1" means OK.
        if (status === '1') {
          const content = {
            slow: _.get(result, 'SafeGasPrice'),
            average: _.get(result, 'ProposeGasPrice'),
            fast: _.get(result, 'FastGasPrice'),
          };

          // Prevents bot from spamming same item after reboot.
          if (_.get(apiCache, 'etherscanGasOracle.content') === null) {
            _.set(apiCache, 'etherscanGasOracle.content', content);
          }

          // If there are updates.
          if (!_.isEqual(_.get(apiCache, 'etherscanGasOracle.content'), content)) {
            _.set(apiCache, 'etherscanGasOracle.content', content);

            // If feed channel is set.
            if (feedChannel) {
              const payload = {
                content: `**${content.slow} Gwei** (slow), **${content.average} Gwei** (average), **${content.fast} Gwei** (fast)`,
              };

              feedChannel.send(payload).catch((error: any) => generateLogMessage(
                [
                  'Failed to send message',
                  `(function: etherscanGasOracle, channel: ${feedChannel.toString()}, payload: ${JSON.stringify(payload)})`,
                ].join(' '),
                10,
                error,
              ));
            }
          }
        } else {
          generateLogMessage(
            [
              'Failed to fetch content',
              `(function: etherscanGasOracle, data: ${JSON.stringify(data)})`,
            ].join(' '),
            10,
          );
        }
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to contact API',
          '(function: etherscanGasOracle)',
        ].join(' '),
        10,
        error,
      ));
    });
  }

  // Fetch command.
  if (message && commandRegexPattern && commandRegexFlags) {
    const {
      channel,
      id,
      member,
    } = message;

    if (!channel || !member) {
      return;
    }

    if (
      new RegExp(commandRegexPattern, commandRegexFlags).test(message.toString())
      && (
        _.some(commandAllowedRoles, (commandAllowedRole) => member.roles.resolve(commandAllowedRole.id) !== null)
        || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      )
    ) {
      const content = _.get(apiCache, 'etherscanGasOracle.content');
      const slowFee = _.get(content, 'slow');
      const averageFee = _.get(content, 'average');
      const fastFee = _.get(content, 'fast');

      // Only show the latest cached content.
      if (content !== null) {
        const payload = {
          content: `The average gas prices are **${slowFee} Gwei** (slow), **${averageFee} Gwei** (average), **${fastFee} Gwei** (fast)`,
          reply: {
            messageReference: id,
          },
        };

        channel.send(payload).catch((error: any) => generateLogMessage(
          [
            'Failed to send message',
            `(function: etherscanGasOracle, channel: ${channel.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      } else {
        const payload = {
          content: 'Failed to retrieve gas prices. Please try again later.',
          reply: {
            messageReference: id,
          },
        };

        channel.send(payload).catch((error: any) => generateLogMessage(
          [
            'Failed to send message',
            `(function: etherscanGasOracle, channel: ${channel.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      }
    }
  }
}

/**
 * Stocktwits trending.
 *
 * @param {Guild}            guild    - Discord guild.
 * @param {ApiFetchSettings} settings - API fetch settings.
 * @param {Message}          message  - Message object.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function stocktwitsTrending(guild: Guild, settings: ApiFetchSettings, message?: Message): void {
  const feedChannelId = _.get(settings, 'feed.channel-id');
  const feedChannel = getTextBasedChannel(guild, feedChannelId);
  const commandRegexPattern = _.get(settings, 'command.regex.pattern');
  const commandRegexFlags = _.get(settings, 'command.regex.flags');
  const commandAllowedRoles = _.get(settings, 'command.allowed-roles');

  if (!feedChannel && (!commandRegexPattern || !commandRegexFlags)) {
    return;
  }

  // Cache and update feed.
  if (_.get(apiCache, 'stocktwitsTrending.content') === null) {
    /**
     * Stocktwits API (Unauthenticated).
     * Unauthenticated allows 200 requests/hour, up to 4,800 calls/day.
     *
     * Used: 1 call/20 seconds, 4,320 calls/day.
     */
    scheduleJob('0/20 * * * * *', () => {
      axios.get('https://api.stocktwits.com/api/2/trending/symbols.json?limit=15').then((response) => {
        const data = _.get(response, 'data');
        const status = _.get(data, 'response.status');
        const symbols = _.get(data, 'symbols');
        const sortedSymbols = _.orderBy(symbols, ['watchlist_count'], ['desc']);

        // Status with 200 means OK.
        if (status === 200) {
          const content = {
            symbols: _.map(sortedSymbols, (sortedSymbol) => ({
              symbol: sortedSymbol.symbol,
            })),
          };

          // Prevents bot from spamming same item after reboot.
          if (_.get(apiCache, 'stocktwitsTrending.content') === null) {
            _.set(apiCache, 'stocktwitsTrending.content', content);
          }

          // If there are updates.
          if (!_.isEqual(_.get(apiCache, 'stocktwitsTrending.content'), content)) {
            _.set(apiCache, 'stocktwitsTrending.content', content);

            // If feed channel is set.
            if (feedChannel) {
              const payload = {
                content: _.map(content.symbols, (symbol) => `**${symbol.symbol}**`).join(', '),
              };

              feedChannel.send(payload).catch((error: any) => generateLogMessage(
                [
                  'Failed to send message',
                  `(function: stocktwitsTrending, channel: ${feedChannel.toString()}, payload: ${JSON.stringify(payload)})`,
                ].join(' '),
                10,
                error,
              ));
            }
          }
        } else {
          generateLogMessage(
            [
              'Failed to fetch content',
              `(function: stocktwitsTrending, data: ${JSON.stringify(data)})`,
            ].join(' '),
            10,
          );
        }
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to contact API',
          '(function: stocktwitsTrending)',
        ].join(' '),
        10,
        error,
      ));
    });
  }

  // Fetch command.
  if (message && commandRegexPattern && commandRegexFlags) {
    const {
      channel,
      id,
      member,
    } = message;

    if (!channel || !member) {
      return;
    }

    if (
      new RegExp(commandRegexPattern, commandRegexFlags).test(message.toString())
      && (
        _.some(commandAllowedRoles, (commandAllowedRole) => member.roles.resolve(commandAllowedRole.id) !== null)
        || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      )
    ) {
      const content = _.get(apiCache, 'stocktwitsTrending.content');

      // Only show the latest cached content.
      if (content !== null) {
        const payload = {
          content: `The top trending symbols are ${_.map(content.symbols, (symbol) => `**${symbol.symbol}**`).join(', ')}`,
          reply: {
            messageReference: id,
          },
        };

        channel.send(payload).catch((error: any) => generateLogMessage(
          [
            'Failed to send message',
            `(function: etherscanGasOracle, channel: ${channel.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      } else {
        const payload = {
          content: 'Failed to retrieve top trending symbols. Please try again later.',
          reply: {
            messageReference: id,
          },
        };

        channel.send(payload).catch((error: any) => generateLogMessage(
          [
            'Failed to send message',
            `(function: etherscanGasOracle, channel: ${channel.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      }
    }
  }
}
