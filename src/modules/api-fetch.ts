import axios from 'axios';
import { MessageOptions } from 'discord.js';
import _ from 'lodash';
import cron from 'node-cron';
import numeral from 'numeral';

import { createEarningsTableAttachment } from '../lib/attachment';
import {
  fetchFormattedDate,
  generateLogMessage,
  getTextBasedChannel,
  memberHasPermissions,
} from '../lib/utility';
import {
  EtherscanGasOracleGuild,
  EtherscanGasOracleMessage,
  EtherscanGasOracleReplaceVariablesConfigPayload,
  EtherscanGasOracleReplaceVariablesReturns,
  EtherscanGasOracleReturns,
  EtherscanGasOracleSettings,
  EtherscanGasOracleSettingsChannelChannelId,
  EtherscanGasOracleSettingsCommandAllowedRoleRoleId,
  EtherscanGasOracleSettingsCommandAllowedRoles,
  EtherscanGasOracleSettingsCommandBaseCommands,
  EtherscanGasOracleSettingsCommandNoPermsPayload,
  EtherscanGasOracleSettingsSettingsApiKey,
  FinnhubEarningsCalculateSurpriseActual,
  FinnhubEarningsCalculateSurpriseEstimate,
  FinnhubEarningsCalculateSurpriseReturns,
  FinnhubEarningsFormatEpsEarningsPerShare,
  FinnhubEarningsFormatEpsReturns,
  FinnhubEarningsFormatRevenueReturns,
  FinnhubEarningsFormatRevenueRevenue,
  FinnhubEarningsGuild,
  FinnhubEarningsMessage,
  FinnhubEarningsReplaceVariablesConfigPayload,
  FinnhubEarningsReplaceVariablesReturns,
  FinnhubEarningsReturns,
  FinnhubEarningsSettings,
  FinnhubEarningsSettingsChannelChannelId,
  FinnhubEarningsSettingsCommandAllowedRoleRoleId,
  FinnhubEarningsSettingsCommandAllowedRoles,
  FinnhubEarningsSettingsCommandBaseCommands,
  FinnhubEarningsSettingsCommandNoPermsPayload,
  FinnhubEarningsSettingsSettingsApiKey,
  StocktwitsTrendingGuild,
  StocktwitsTrendingMessage,
  StocktwitsTrendingReplaceVariablesConfigPayload,
  StocktwitsTrendingReplaceVariablesReturns,
  StocktwitsTrendingReturns,
  StocktwitsTrendingSettings,
  StocktwitsTrendingSettingsChannelChannelId,
  StocktwitsTrendingSettingsCommandAllowedRoleRoleId,
  StocktwitsTrendingSettingsCommandAllowedRoles,
  StocktwitsTrendingSettingsCommandBaseCommands,
  StocktwitsTrendingSettingsCommandNoPermsPayload,
  StocktwitsTrendingSettingsSettingsLimit,
} from '../types';
import {
  ApiEtherscanGasOracle,
  ApiEtherscanGasOracleResult,
  ApiEtherscanGasOracleResultFastGasPrice,
  ApiEtherscanGasOracleResultProposeGasPrice,
  ApiEtherscanGasOracleResultSafeGasPrice,
  ApiEtherscanGasOracleStatus,
  ApiFinnhubEarnings,
  ApiFinnhubEarningsEvents,
  ApiStocktwitsTrending,
  ApiStocktwitsTrendingResponseStatus,
  ApiStocktwitsTrendingSymbols,
} from '../types/api';
import { MemoryEtherscanGasOracle, MemoryFinnhubEarnings, MemoryStocktwitsTrending } from '../types/memory';

/**
 * Memory.
 *
 * @since 1.0.0
 */
let memoryEtherscanGasOracle: MemoryEtherscanGasOracle = null;
let memoryFinnhubEarnings: MemoryFinnhubEarnings = null;
let memoryStocktwitsTrending: MemoryStocktwitsTrending = null;

/**
 * Etherscan gas oracle.
 *
 * @param {EtherscanGasOracleMessage}  message  - Message.
 * @param {EtherscanGasOracleGuild}    guild    - Guild.
 * @param {EtherscanGasOracleSettings} settings - Settings.
 *
 * @returns {EtherscanGasOracleReturns}
 *
 * @since 1.0.0
 */
export function etherscanGasOracle(message: EtherscanGasOracleMessage, guild: EtherscanGasOracleGuild, settings: EtherscanGasOracleSettings): EtherscanGasOracleReturns {
  const guildRoles = guild.roles;

  const settingsSettingsApiKey = <EtherscanGasOracleSettingsSettingsApiKey>_.get(settings, ['settings', 'api-key']);
  const settingsChannelChannelId = <EtherscanGasOracleSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);
  const settingsCommandBaseCommands = <EtherscanGasOracleSettingsCommandBaseCommands>_.get(settings, ['command', 'base-commands']);
  const settingsCommandAllowedRoles = <EtherscanGasOracleSettingsCommandAllowedRoles>_.get(settings, ['command', 'allowed-roles']);
  const settingsCommandNoPermsPayload = <EtherscanGasOracleSettingsCommandNoPermsPayload>_.get(settings, ['command', 'no-perms-payload']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  /**
   * Etherscan gas oracle - Replace variables.
   *
   * @param {EtherscanGasOracleReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {EtherscanGasOracleReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: EtherscanGasOracleReplaceVariablesConfigPayload): EtherscanGasOracleReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    return JSON.parse(editedPayload);
  };

  const allowedRoleIds = _.map(settingsCommandAllowedRoles, (settingsCommandAllowedRole) => <EtherscanGasOracleSettingsCommandAllowedRoleRoleId>_.get(settingsCommandAllowedRole, ['role-id']));

  let payload: MessageOptions = {};

  // If "api-fetch.etherscan-gas-oracle" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle" is not configured',
        `(function: etherscanGasOracle, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "api-fetch.etherscan-gas-oracle.channel.channel-id" and "api-fetch.etherscan-gas-oracle.command.base-commands" is not configured properly.
  if (
    settingsChannelChannelId === undefined
    && settingsCommandBaseCommands === undefined
  ) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle.channel.channel-id" and "api-fetch.etherscan-gas-oracle.command.base-commands" is not configured properly',
        `(function: etherscanGasOracle, channel id: ${JSON.stringify(settingsChannelChannelId)}, base commands: ${JSON.stringify(settingsCommandBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.etherscan-gas-oracle.settings.api-key" is not configured properly.
  if (
    settingsSettingsApiKey !== undefined
    && (
      !_.isString(settingsSettingsApiKey)
      || _.isEmpty(settingsSettingsApiKey)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle.settings.api-key" is not configured properly',
        `(function: etherscanGasOracle, api key: ${JSON.stringify(settingsSettingsApiKey)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.etherscan-gas-oracle.channel.channel-id" is not configured properly.
  if (
    settingsChannelChannelId !== undefined
    && (
      channel === undefined
      || channel === null
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle.channel.channel-id" is not configured properly',
        `(function: etherscanGasOracle, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.etherscan-gas-oracle.command.base-commands" is not configured properly.
  if (
    settingsCommandBaseCommands !== undefined
    && (
      !_.isArray(settingsCommandBaseCommands)
      || _.isEmpty(settingsCommandBaseCommands)
      || !_.every(settingsCommandBaseCommands, (settingsCommandBaseCommand) => _.isString(settingsCommandBaseCommand) && !_.isEmpty(settingsCommandBaseCommand))
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle.command.base-commands" is not configured properly',
        `(function: etherscanGasOracle, base commands: ${JSON.stringify(settingsCommandBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.etherscan-gas-oracle.command.allowed-roles" is not configured properly.
  if (
    settingsCommandAllowedRoles !== undefined
    && (
      !_.isArray(settingsCommandAllowedRoles)
      || _.isEmpty(settingsCommandAllowedRoles)
      || !_.every(settingsCommandAllowedRoles, (settingsCommandAllowedRole) => _.isPlainObject(settingsCommandAllowedRole) && !_.isEmpty(settingsCommandAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && guildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle.command.allowed-roles" is not configured properly',
        `(function: etherscanGasOracle, allowed roles: ${JSON.stringify(settingsCommandAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.etherscan-gas-oracle.command.no-perms-payload" is not configured properly.
  if (
    settingsCommandNoPermsPayload !== undefined
    && (
      !_.isPlainObject(settingsCommandNoPermsPayload)
      || _.isEmpty(settingsCommandNoPermsPayload)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.etherscan-gas-oracle.command.no-perms-payload" is not configured properly',
        `(function: etherscanGasOracle, no perms payload: ${JSON.stringify(settingsCommandNoPermsPayload)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Cache and update feed.
  if (memoryEtherscanGasOracle === null) {
    /**
     * Etherscan API (Unauthenticated).
     * Unauthenticated allows 1 call/5 seconds, up to 17,280 calls/day.
     *
     * Used: 1 call/10 seconds, 8,640 API calls/day.
     *
     * @since 1.0.0
     */
    cron.schedule('0/10 * * * * *', () => {
      const apiKeyParameter = (settingsSettingsApiKey !== undefined) ? `&apikey=${settingsSettingsApiKey}` : '';

      axios.get<ApiEtherscanGasOracle>(`https://api.etherscan.io/api?module=gastracker&action=gasoracle${apiKeyParameter}`).then((getResponse) => {
        const getResponseData = getResponse.data;

        const getResponseDataStatus = <ApiEtherscanGasOracleStatus>_.get(getResponseData, ['status']);
        const getResponseDataResult = <ApiEtherscanGasOracleResult>_.get(getResponseData, ['result']);

        generateLogMessage(
          [
            'Contacted API',
            `(function: etherscanGasOracle, data: ${JSON.stringify(getResponseData)})`,
          ].join(' '),
          40,
        );

        // Status with "1" means OK.
        if (getResponseDataStatus === '1') {
          const content = {
            slow: <ApiEtherscanGasOracleResultSafeGasPrice>_.get(getResponseDataResult, ['SafeGasPrice']),
            average: <ApiEtherscanGasOracleResultProposeGasPrice>_.get(getResponseDataResult, ['ProposeGasPrice']),
            fast: <ApiEtherscanGasOracleResultFastGasPrice>_.get(getResponseDataResult, ['FastGasPrice']),
          };

          generateLogMessage(
            [
              'Fetched API content',
              `(function: etherscanGasOracle, content: ${JSON.stringify(content)})`,
            ].join(' '),
            40,
          );

          // Prevent possible duplicate responses after bot reboot.
          if (memoryEtherscanGasOracle === null) {
            memoryEtherscanGasOracle = content;
          }

          // If there are updates.
          if (!_.isEqual(memoryEtherscanGasOracle, content)) {
            memoryEtherscanGasOracle = content;

            if (channel) {
              const contentSlow = content.slow;
              const contentAverage = content.average;
              const contentFast = content.fast;

              payload = {
                content: `**${contentSlow} Gwei** (slow), **${contentAverage} Gwei** (average), **${contentFast} Gwei** (fast)`,
              };

              channel.send(payload).then((sendResponse) => {
                const sendResponseUrl = sendResponse.url;

                generateLogMessage(
                  [
                    'Sent message',
                    `(function: etherscanGasOracle, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
                  ].join(' '),
                  40,
                );
              }).catch((error: Error) => generateLogMessage(
                [
                  'Failed to send message',
                  `(function: etherscanGasOracle, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
                ].join(' '),
                10,
                error,
              ));
            }
          }
        } else {
          generateLogMessage(
            [
              'Failed to fetch API content',
              `(function: etherscanGasOracle, data: ${JSON.stringify(getResponseData)})`,
            ].join(' '),
            10,
          );
        }
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to contact API',
          '(function: etherscanGasOracle)',
        ].join(' '),
        10,
        error,
      ));
    }, {
      scheduled: true,
    });
  }

  // Fetch command.
  if (
    message !== undefined
    && settingsCommandBaseCommands !== undefined
  ) {
    if (message.member === null) {
      generateLogMessage(
        [
          'Failed to process command',
          '(function: etherscanGasOracle)',
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Processed command',
        '(function: etherscanGasOracle)',
      ].join(' '),
      40,
    );

    const messageChannel = message.channel;
    const messageContent = message.content;
    const messageMember = message.member;

    if (!settingsCommandBaseCommands.includes(messageContent)) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: etherscanGasOracle, specified base commands: ${JSON.stringify(settingsCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: etherscanGasOracle, specified base commands: ${JSON.stringify(settingsCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
      ].join(' '),
      40,
    );

    if (!memberHasPermissions(messageMember, settingsCommandAllowedRoles)) {
      if (settingsCommandNoPermsPayload !== undefined) {
        payload = replaceVariables(settingsCommandNoPermsPayload);
      } else {
        payload = {
          content: 'You do not have sufficient permissions.',
        };
      }

      _.assign(payload, {
        reply: {
          messageReference: message,
        },
      });
    } else if (memoryEtherscanGasOracle !== null) {
      const memoryEtherscanGasOracleSlow = memoryEtherscanGasOracle.slow;
      const memoryEtherscanGasOracleAverage = memoryEtherscanGasOracle.average;
      const memoryEtherscanGasOracleFast = memoryEtherscanGasOracle.fast;

      payload = {
        content: `The average gas prices are **${memoryEtherscanGasOracleSlow} Gwei** (slow), **${memoryEtherscanGasOracleAverage} Gwei** (average), **${memoryEtherscanGasOracleFast} Gwei** (fast)`,
        reply: {
          messageReference: message,
        },
      };
    } else {
      payload = {
        content: 'Failed to retrieve gas prices. Please try again later.',
        reply: {
          messageReference: message,
        },
      };
    }

    messageChannel.send(payload).then((sendResponse) => {
      const sendResponseUrl = sendResponse.url;

      generateLogMessage(
        [
          'Sent message',
          `(function: etherscanGasOracle, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        40,
      );
    }).catch((error: Error) => generateLogMessage(
      [
        'Failed to send message',
        `(function: etherscanGasOracle, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      10,
      error,
    ));
  }
}

/**
 * Finnhub earnings.
 *
 * @param {FinnhubEarningsMessage}  message  - Message.
 * @param {FinnhubEarningsGuild}    guild    - Guild.
 * @param {FinnhubEarningsSettings} settings - Settings.
 *
 * @returns {FinnhubEarningsReturns}
 *
 * @since 1.0.0
 */
export function finnhubEarnings(message: FinnhubEarningsMessage, guild: FinnhubEarningsGuild, settings: FinnhubEarningsSettings): FinnhubEarningsReturns {
  const guildRoles = guild.roles;

  const settingsSettingsApiKey = <FinnhubEarningsSettingsSettingsApiKey>_.get(settings, ['settings', 'api-key']);
  const settingsChannelChannelId = <FinnhubEarningsSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);
  const settingsCommandBaseCommands = <FinnhubEarningsSettingsCommandBaseCommands>_.get(settings, ['command', 'base-commands']);
  const settingsCommandAllowedRoles = <FinnhubEarningsSettingsCommandAllowedRoles>_.get(settings, ['command', 'allowed-roles']);
  const settingsCommandNoPermsPayload = <FinnhubEarningsSettingsCommandNoPermsPayload>_.get(settings, ['command', 'no-perms-payload']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  /**
   * Finnhub earnings - Calculate surprise.
   *
   * @param {FinnhubEarningsCalculateSurpriseEstimate} estimate - Estimate.
   * @param {FinnhubEarningsCalculateSurpriseActual}   actual   - Actual.
   *
   * @returns {FinnhubEarningsCalculateSurpriseReturns}
   *
   * @since 1.0.0
   */
  const calculateSurprise = (estimate: FinnhubEarningsCalculateSurpriseEstimate, actual: FinnhubEarningsCalculateSurpriseActual): FinnhubEarningsCalculateSurpriseReturns => {
    let surprise = (actual - estimate) / estimate;

    if (estimate === 0) {
      surprise = actual;
    }

    if (estimate < 0) {
      surprise = (estimate * -1) + actual;
    }

    return numeral(surprise).format('0,0.00%').replace(/\.00/g, '');
  };
  /**
   * Finnhub earnings - Format eps.
   *
   * @param {FinnhubEarningsFormatEpsEarningsPerShare} earningsPerShare - Earnings per share.
   *
   * @returns {FinnhubEarningsFormatEpsReturns}
   *
   * @since 1.0.0
   */
  const formatEps = (earningsPerShare: FinnhubEarningsFormatEpsEarningsPerShare): FinnhubEarningsFormatEpsReturns => numeral(earningsPerShare).format('$0,0.00');
  /**
   * Finnhub earnings - Format revenue.
   *
   * @param {FinnhubEarningsFormatRevenueRevenue} revenue - Revenue.
   *
   * @returns {FinnhubEarningsFormatRevenueReturns}
   *
   * @since 1.0.0
   */
  const formatRevenue = (revenue: FinnhubEarningsFormatRevenueRevenue): FinnhubEarningsFormatRevenueReturns => numeral(revenue).format('$0,0.00a').replace(/\.00/g, '').toUpperCase();
  /**
   * Finnhub earnings - Replace variables.
   *
   * @param {FinnhubEarningsReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {FinnhubEarningsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: FinnhubEarningsReplaceVariablesConfigPayload): FinnhubEarningsReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    return JSON.parse(editedPayload);
  };

  const allowedRoleIds = _.map(settingsCommandAllowedRoles, (settingsCommandAllowedRole) => <FinnhubEarningsSettingsCommandAllowedRoleRoleId>_.get(settingsCommandAllowedRole, ['role-id']));

  let payload: MessageOptions = {};

  // If "api-fetch.finnhub-earnings" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings" is not configured',
        `(function: finnhubEarnings, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "api-fetch.finnhub-earnings.channel.channel-id" and "api-fetch.finnhub-earnings.command.base-commands" is not configured properly.
  if (
    settingsChannelChannelId === undefined
    && settingsCommandBaseCommands === undefined
  ) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings.channel.channel-id" and "api-fetch.finnhub-earnings.command.base-commands" is not configured properly',
        `(function: finnhubEarnings, channel id: ${JSON.stringify(settingsChannelChannelId)}, base commands: ${JSON.stringify(settingsCommandBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.finnhub-earnings.settings.api-key" is not configured properly.
  if (
    !_.isString(settingsSettingsApiKey)
    || _.isEmpty(settingsSettingsApiKey)
  ) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings.settings.api-key" is not configured properly',
        `(function: finnhubEarnings, api key: ${JSON.stringify(settingsSettingsApiKey)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.finnhub-earnings.channel.channel-id" is not configured properly.
  if (
    settingsChannelChannelId !== undefined
    && (
      channel === undefined
      || channel === null
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings.channel.channel-id" is not configured properly',
        `(function: finnhubEarnings, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.finnhub-earnings.command.base-commands" is not configured properly.
  if (
    settingsCommandBaseCommands !== undefined
    && (
      !_.isArray(settingsCommandBaseCommands)
      || _.isEmpty(settingsCommandBaseCommands)
      || !_.every(settingsCommandBaseCommands, (settingsCommandBaseCommand) => _.isString(settingsCommandBaseCommand) && !_.isEmpty(settingsCommandBaseCommand))
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings.command.base-commands" is not configured properly',
        `(function: finnhubEarnings, base commands: ${JSON.stringify(settingsCommandBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.finnhub-earnings.command.allowed-roles" is not configured properly.
  if (
    settingsCommandAllowedRoles !== undefined
    && (
      !_.isArray(settingsCommandAllowedRoles)
      || _.isEmpty(settingsCommandAllowedRoles)
      || !_.every(settingsCommandAllowedRoles, (settingsCommandAllowedRole) => _.isPlainObject(settingsCommandAllowedRole) && !_.isEmpty(settingsCommandAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && guildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings.command.allowed-roles" is not configured properly',
        `(function: finnhubEarnings, allowed roles: ${JSON.stringify(settingsCommandAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.finnhub-earnings.command.no-perms-payload" is not configured properly.
  if (
    settingsCommandNoPermsPayload !== undefined
    && (
      !_.isPlainObject(settingsCommandNoPermsPayload)
      || _.isEmpty(settingsCommandNoPermsPayload)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.finnhub-earnings.command.no-perms-payload" is not configured properly',
        `(function: finnhubEarnings, no perms payload: ${JSON.stringify(settingsCommandNoPermsPayload)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Cache and update feed.
  if (memoryFinnhubEarnings === null) {
    /**
     * Finnhub API (Free).
     * Free plan allows 1 call/1 second, up to 86,400 calls/day.
     *
     * Used: 1 call/10 seconds, 8,640 API calls/day.
     *
     * @since 1.0.0
     */
    cron.schedule('0/10 * * * * *', () => {
      axios.get<ApiFinnhubEarnings>(`https://finnhub.io/api/v1/calendar/earnings?token=${settingsSettingsApiKey}`).then((getResponse) => {
        const getResponseData = getResponse.data;

        const getResponseDataEarningsCalendar = <ApiFinnhubEarningsEvents>_.get(getResponseData, ['earningsCalendar']);

        generateLogMessage(
          [
            'Contacted API',
            `(function: finnhubEarnings, data: ${JSON.stringify(getResponseData)})`,
          ].join(' '),
          40,
        );

        if (getResponseDataEarningsCalendar !== undefined) {
          const filteredEarnings = _.filter(getResponseDataEarningsCalendar, (getResponseDataEarningCalendar) => {
            const getResponseDataEarningCalendarEpsActual = getResponseDataEarningCalendar.epsActual;
            const getResponseDataEarningCalendarEpsEstimate = getResponseDataEarningCalendar.epsEstimate;
            const getResponseDataEarningCalendarRevenueActual = getResponseDataEarningCalendar.revenueActual;
            const getResponseDataEarningCalendarRevenueEstimate = getResponseDataEarningCalendar.revenueEstimate;

            return getResponseDataEarningCalendarEpsActual !== null || getResponseDataEarningCalendarEpsEstimate !== null || getResponseDataEarningCalendarRevenueActual !== null || getResponseDataEarningCalendarRevenueEstimate !== null;
          });
          const content = {
            earnings: _.map(filteredEarnings, (filteredEarning) => {
              const filteredEarningDate = filteredEarning.date;
              const filteredEarningEpsActual = filteredEarning.epsActual;
              const filteredEarningEpsEstimate = filteredEarning.epsEstimate;
              const filteredEarningHour = filteredEarning.hour;
              const filteredEarningQuarter = filteredEarning.quarter;
              const filteredEarningRevenueActual = filteredEarning.revenueActual;
              const filteredEarningRevenueEstimate = filteredEarning.revenueEstimate;
              const filteredEarningSymbol = filteredEarning.symbol;
              const filteredEarningYear = filteredEarning.year;

              let earningsCallTime = null;

              switch (filteredEarningHour) {
                case 'bmo':
                  earningsCallTime = 'Before Market Open';
                  break;
                case 'amc':
                  earningsCallTime = 'After Market Close';
                  break;
                case 'dmh':
                  earningsCallTime = 'During Market Hour';
                  break;
                default:
                  break;
              }

              return {
                isoDate: filteredEarningDate,
                date: fetchFormattedDate('iso', filteredEarningDate, 'config', 'DDDD'),
                symbol: filteredEarningSymbol,
                fiscalQuarter: `${filteredEarningYear} Q${filteredEarningQuarter}`,
                callTime: earningsCallTime,
                epsEstimate: (filteredEarningEpsEstimate !== null) ? formatEps(filteredEarningEpsEstimate) : null,
                epsActual: (filteredEarningEpsActual !== null) ? formatEps(filteredEarningEpsActual) : null,
                epsSurprise: (filteredEarningEpsEstimate !== null && filteredEarningEpsActual !== null) ? calculateSurprise(filteredEarningEpsEstimate, filteredEarningEpsActual) : null,
                revenueEstimate: (filteredEarningRevenueEstimate !== null) ? formatRevenue(filteredEarningRevenueEstimate) : null,
                revenueActual: (filteredEarningRevenueActual !== null) ? formatRevenue(filteredEarningRevenueActual) : null,
                revenueSurprise: (filteredEarningRevenueEstimate !== null && filteredEarningRevenueActual !== null) ? calculateSurprise(filteredEarningRevenueEstimate, filteredEarningRevenueActual) : null,
              };
            }),
          };

          generateLogMessage(
            [
              'Fetched API content',
              `(function: finnhubEarnings, content: ${JSON.stringify(content)})`,
            ].join(' '),
            40,
          );

          // Prevent possible duplicate responses after bot reboot.
          if (memoryFinnhubEarnings === null) {
            memoryFinnhubEarnings = content;
          }

          // If there are updates.
          if (!_.isEqual(memoryFinnhubEarnings, content)) {
            const newContent = content.earnings;
            const oldContent = memoryFinnhubEarnings.earnings;
            const earnings = _.differenceWith(newContent, oldContent, _.isEqual);
            const sortedEarnings = _.orderBy(earnings, ['isoDate'], ['asc']);

            memoryFinnhubEarnings = content;

            if (channel) {
              sortedEarnings.forEach((sortedEarning) => {
                const earningDate = sortedEarning.date;
                const earningSymbol = sortedEarning.symbol;
                const earningFiscalQuarter = sortedEarning.fiscalQuarter;
                const earningCallTime = sortedEarning.callTime;
                const earningEpsEstimate = sortedEarning.epsEstimate;
                const earningEpsActual = sortedEarning.epsActual;
                const earningEpsSurprise = sortedEarning.epsSurprise;
                const earningRevenueEstimate = sortedEarning.revenueEstimate;
                const earningRevenueActual = sortedEarning.revenueActual;
                const earningRevenueSurprise = sortedEarning.revenueSurprise;

                payload = {
                  content: [
                    `**${earningSymbol} ${earningFiscalQuarter} Earnings (${(earningEpsActual !== null || earningRevenueActual !== null) ? 'ACTUAL' : 'ESTIMATED'} REPORT)**`,
                    `__Reporting on ${earningDate}__${(earningCallTime !== null) ? ` :: __${earningCallTime.toUpperCase()}S__` : ''}`,
                    ...(earningEpsEstimate !== null || earningEpsActual !== null || earningEpsSurprise !== null) ? [
                      `**EPS:** ${[
                        ...(earningEpsEstimate !== null) ? [`\`${earningEpsEstimate}\` (estimate)`] : [],
                        ...(earningEpsActual !== null) ? [`\`${earningEpsActual}\` (actual)`] : [],
                        ...(earningEpsSurprise !== null) ? [`\`${earningEpsSurprise}\` (surprise)`] : [],
                      ].join(', ')}`,
                    ] : [],
                    ...(earningRevenueEstimate !== null || earningRevenueActual !== null || earningRevenueSurprise !== null) ? [
                      `**Revenue:** ${[
                        ...(earningRevenueEstimate !== null) ? [`\`${earningRevenueEstimate}\` (estimate)`] : [],
                        ...(earningRevenueActual !== null) ? [`\`${earningRevenueActual}\` (actual)`] : [],
                        ...(earningRevenueSurprise !== null) ? [`\`${earningRevenueSurprise}\` (surprise)`] : [],
                      ].join(', ')}`,
                    ] : [],
                  ].join('\n'),
                };

                channel.send(payload).then((sendResponse) => {
                  const sendResponseUrl = sendResponse.url;

                  generateLogMessage(
                    [
                      'Sent message',
                      `(function: finnhubEarnings, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
                    ].join(' '),
                    40,
                  );
                }).catch((error: Error) => generateLogMessage(
                  [
                    'Failed to send message',
                    `(function: finnhubEarnings, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
                  ].join(' '),
                  10,
                  error,
                ));
              });
            }
          }
        } else {
          generateLogMessage(
            [
              'Failed to fetch API content',
              `(function: finnhubEarnings, data: ${JSON.stringify(getResponseData)})`,
            ].join(' '),
            10,
          );
        }
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to contact API',
          '(function: finnhubEarnings)',
        ].join(' '),
        10,
        error,
      ));
    }, {
      scheduled: true,
    });
  }

  // Fetch command.
  if (
    message !== undefined
    && settingsCommandBaseCommands !== undefined
  ) {
    if (message.member === null) {
      generateLogMessage(
        [
          'Failed to process command',
          '(function: finnhubEarnings)',
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Processed command',
        '(function: finnhubEarnings)',
      ].join(' '),
      40,
    );

    const messageChannel = message.channel;
    const messageContent = message.content;
    const messageMember = message.member;

    if (!settingsCommandBaseCommands.includes(messageContent)) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: finnhubEarnings, specified base commands: ${JSON.stringify(settingsCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: finnhubEarnings, specified base commands: ${JSON.stringify(settingsCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
      ].join(' '),
      40,
    );

    if (!memberHasPermissions(messageMember, settingsCommandAllowedRoles)) {
      if (settingsCommandNoPermsPayload !== undefined) {
        payload = replaceVariables(settingsCommandNoPermsPayload);
      } else {
        payload = {
          content: 'You do not have sufficient permissions.',
        };
      }

      _.assign(payload, {
        reply: {
          messageReference: message,
        },
      });
    } else if (memoryFinnhubEarnings !== null) {
      const sortedEarnings = _.orderBy(memoryFinnhubEarnings.earnings, ['isoDate', 'symbol'], ['desc', 'asc']);

      payload = {
        content: 'Here are the latest earnings information up to today:',
        files: [
          createEarningsTableAttachment(
            sortedEarnings,
          ),
        ],
        reply: {
          messageReference: message,
        },
      };
    } else {
      payload = {
        content: 'Failed to retrieve latest earnings data. Please try again later.',
        reply: {
          messageReference: message,
        },
      };
    }

    messageChannel.send(payload).then((sendResponse) => {
      const sendResponseUrl = sendResponse.url;

      generateLogMessage(
        [
          'Sent message',
          `(function: finnhubEarnings, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        40,
      );
    }).catch((error: Error) => generateLogMessage(
      [
        'Failed to send message',
        `(function: finnhubEarnings, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      10,
      error,
    ));
  }
}

/**
 * Stocktwits trending.
 *
 * @param {StocktwitsTrendingMessage}  message  - Message.
 * @param {StocktwitsTrendingGuild}    guild    - Guild.
 * @param {StocktwitsTrendingSettings} settings - Settings.
 *
 * @returns {StocktwitsTrendingReturns}
 *
 * @since 1.0.0
 */
export function stocktwitsTrending(message: StocktwitsTrendingMessage, guild: StocktwitsTrendingGuild, settings: StocktwitsTrendingSettings): StocktwitsTrendingReturns {
  const guildRoles = guild.roles;

  const settingsSettingsLimit = <StocktwitsTrendingSettingsSettingsLimit>_.get(settings, ['settings', 'limit']);
  const settingsChannelChannelId = <StocktwitsTrendingSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);
  const settingsCommandBaseCommands = <StocktwitsTrendingSettingsCommandBaseCommands>_.get(settings, ['command', 'base-commands']);
  const settingsCommandAllowedRoles = <StocktwitsTrendingSettingsCommandAllowedRoles>_.get(settings, ['command', 'allowed-roles']);
  const settingsCommandNoPermsPayload = <StocktwitsTrendingSettingsCommandNoPermsPayload>_.get(settings, ['command', 'no-perms-payload']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  /**
   * Stocktwits trending - Replace variables.
   *
   * @param {StocktwitsTrendingReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {StocktwitsTrendingReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: StocktwitsTrendingReplaceVariablesConfigPayload): StocktwitsTrendingReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    return JSON.parse(editedPayload);
  };

  const allowedRoleIds = _.map(settingsCommandAllowedRoles, (settingsCommandAllowedRole) => <StocktwitsTrendingSettingsCommandAllowedRoleRoleId>_.get(settingsCommandAllowedRole, ['role-id']));

  let payload: MessageOptions = {};

  // If "api-fetch.stocktwits-trending" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending" is not configured',
        `(function: stocktwitsTrending, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "api-fetch.stocktwits-trending.settings.limit" is not configured properly.
  if (
    settingsSettingsLimit !== undefined
    && (
      !_.isNumber(settingsSettingsLimit)
      || !_.inRange(settingsSettingsLimit, 1, 31)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending.settings.limit" is not configured properly',
        `(function: stocktwitsTrending, limit: ${JSON.stringify(settingsSettingsLimit)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.stocktwits-trending.channel.channel-id" and "api-fetch.stocktwits-trending.command.base-commands" is not configured properly.
  if (
    settingsChannelChannelId === undefined
    && settingsCommandBaseCommands === undefined
  ) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending.channel.channel-id" and "api-fetch.stocktwits-trending.command.base-commands" is not configured properly',
        `(function: stocktwitsTrending, channel id: ${JSON.stringify(settingsChannelChannelId)}, base commands: ${JSON.stringify(settingsCommandBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.stocktwits-trending.channel.channel-id" is not configured properly.
  if (
    settingsChannelChannelId !== undefined
    && (
      channel === undefined
      || channel === null
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending.channel.channel-id" is not configured properly',
        `(function: stocktwitsTrending, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.stocktwits-trending.command.base-commands" is not configured properly.
  if (
    settingsCommandBaseCommands !== undefined
    && (
      !_.isArray(settingsCommandBaseCommands)
      || _.isEmpty(settingsCommandBaseCommands)
      || !_.every(settingsCommandBaseCommands, (settingsCommandBaseCommand) => _.isString(settingsCommandBaseCommand) && !_.isEmpty(settingsCommandBaseCommand))
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending.command.base-commands" is not configured properly',
        `(function: stocktwitsTrending, base commands: ${JSON.stringify(settingsCommandBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.stocktwits-trending.command.allowed-roles" is not configured properly.
  if (
    settingsCommandAllowedRoles !== undefined
    && (
      !_.isArray(settingsCommandAllowedRoles)
      || _.isEmpty(settingsCommandAllowedRoles)
      || !_.every(settingsCommandAllowedRoles, (settingsCommandAllowedRole) => _.isPlainObject(settingsCommandAllowedRole) && !_.isEmpty(settingsCommandAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && guildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending.command.allowed-roles" is not configured properly',
        `(function: stocktwitsTrending, allowed roles: ${JSON.stringify(settingsCommandAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "api-fetch.stocktwits-trending.command.no-perms-payload" is not configured properly.
  if (
    settingsCommandNoPermsPayload !== undefined
    && (
      !_.isPlainObject(settingsCommandNoPermsPayload)
      || _.isEmpty(settingsCommandNoPermsPayload)
    )
  ) {
    generateLogMessage(
      [
        '"api-fetch.stocktwits-trending.command.no-perms-payload" is not configured properly',
        `(function: stocktwitsTrending, no perms payload: ${JSON.stringify(settingsCommandNoPermsPayload)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Cache and update feed.
  if (memoryStocktwitsTrending === null) {
    /**
     * Stocktwits API (Unauthenticated).
     * Unauthenticated allows 200 requests/hour, up to 4,800 calls/day.
     *
     * Used: 1 call/20 seconds, 4,320 calls/day.
     *
     * @since 1.0.0
     */
    cron.schedule('0/20 * * * * *', () => {
      const limitParameter = (settingsSettingsLimit !== undefined) ? settingsSettingsLimit : 30;

      axios.get<ApiStocktwitsTrending>(`https://api.stocktwits.com/api/2/trending/symbols.json?limit=${limitParameter}`).then((getResponse) => {
        const getResponseData = getResponse.data;

        const getResponseDataResponseStatus = <ApiStocktwitsTrendingResponseStatus>_.get(getResponseData, ['response', 'status']);
        const getResponseDataSymbols = <ApiStocktwitsTrendingSymbols>_.get(getResponseData, ['symbols']);

        generateLogMessage(
          [
            'Contacted API',
            `(function: stocktwitsTrending, data: ${JSON.stringify(getResponseData)})`,
          ].join(' '),
          40,
        );

        if (
          getResponseDataResponseStatus === 200
          && getResponseDataSymbols !== undefined
        ) {
          const sortedSymbols = _.orderBy(getResponseDataSymbols, ['watchlist_count'], ['desc']);
          const content = {
            symbols: _.map(sortedSymbols, (sortedSymbol) => sortedSymbol.symbol),
          };

          generateLogMessage(
            [
              'Fetched API content',
              `(function: stocktwitsTrending, content: ${JSON.stringify(content)})`,
            ].join(' '),
            40,
          );

          // Prevent possible duplicate responses after bot reboot.
          if (memoryStocktwitsTrending === null) {
            memoryStocktwitsTrending = content;
          }

          // If there are updates.
          if (!_.isEqual(memoryStocktwitsTrending, content)) {
            memoryStocktwitsTrending = content;

            if (channel) {
              const contentSymbols = content.symbols;

              payload = {
                content: _.map(contentSymbols, (contentSymbol) => `**${contentSymbol}**`).join(', '),
              };

              channel.send(payload).then((sendResponse) => {
                const sendResponseUrl = sendResponse.url;

                generateLogMessage(
                  [
                    'Sent message',
                    `(function: stocktwitsTrending, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
                  ].join(' '),
                  40,
                );
              }).catch((error: Error) => generateLogMessage(
                [
                  'Failed to send message',
                  `(function: stocktwitsTrending, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
                ].join(' '),
                10,
                error,
              ));
            }
          }
        } else {
          generateLogMessage(
            [
              'Failed to fetch API content',
              `(function: stocktwitsTrending, data: ${JSON.stringify(getResponseData)})`,
            ].join(' '),
            10,
          );
        }
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to contact API',
          '(function: stocktwitsTrending)',
        ].join(' '),
        10,
        error,
      ));
    }, {
      scheduled: true,
    });
  }

  // Fetch command.
  if (
    message !== undefined
    && settingsCommandBaseCommands !== undefined
  ) {
    if (message.member === null) {
      generateLogMessage(
        [
          'Failed to process command',
          '(function: stocktwitsTrending)',
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Processed command',
        '(function: stocktwitsTrending)',
      ].join(' '),
      40,
    );

    const messageChannel = message.channel;
    const messageContent = message.content;
    const messageMember = message.member;

    if (!settingsCommandBaseCommands.includes(messageContent)) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: stocktwitsTrending, specified base commands: ${JSON.stringify(settingsCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: stocktwitsTrending, specified base commands: ${JSON.stringify(settingsCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
      ].join(' '),
      40,
    );

    if (!memberHasPermissions(messageMember, settingsCommandAllowedRoles)) {
      if (settingsCommandNoPermsPayload !== undefined) {
        payload = replaceVariables(settingsCommandNoPermsPayload);
      } else {
        payload = {
          content: 'You do not have sufficient permissions.',
        };
      }

      _.assign(payload, {
        reply: {
          messageReference: message,
        },
      });
    } else if (memoryStocktwitsTrending !== null) {
      const cacheSymbols = memoryStocktwitsTrending.symbols;

      payload = {
        content: `The top trending symbols are ${_.map(cacheSymbols, (cacheSymbol) => `**${cacheSymbol}**`).join(', ')}`,
        reply: {
          messageReference: message,
        },
      };
    } else {
      payload = {
        content: 'Failed to retrieve top trending symbols. Please try again later.',
        reply: {
          messageReference: message,
        },
      };
    }

    messageChannel.send(payload).then((sendResponse) => {
      const sendResponseUrl = sendResponse.url;

      generateLogMessage(
        [
          'Sent message',
          `(function: stocktwitsTrending, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        40,
      );
    }).catch((error: Error) => generateLogMessage(
      [
        'Failed to send message',
        `(function: stocktwitsTrending, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      10,
      error,
    ));
  }
}
