import chalk from 'chalk';
import {
  Client,
  Intents,
  Options,
  Sweepers,
} from 'discord.js';
import _ from 'lodash';
import { TwitterApi } from 'twitter-api-v2';

import config from '../config.json';

import { generateServerMessage, getCollectionItems, isTimeZoneValid } from './lib/utility';
import { initialize } from './modules/initialize';
import {
  SettingsDiscordGuildGuildId,
  SettingsDiscordToken,
  SettingsLogLevel,
  SettingsTimeZone,
  SettingsTwitter,
  SettingsTwitterAccessToken,
  SettingsTwitterAccessTokenSecret,
  SettingsTwitterApiKey,
  SettingsTwitterApiKeySecret,
} from './types';

/**
 * Config.
 *
 * @since 1.0.0
 */
const configSettingsDiscordToken = <SettingsDiscordToken>_.get(config, ['settings', 'discord', 'token']);
const configSettingsDiscordGuildGuildId = <SettingsDiscordGuildGuildId>_.get(config, ['settings', 'discord', 'guild', 'guild-id']);
const configSettingsTwitter = <SettingsTwitter>_.get(config, ['settings', 'twitter']);
const configSettingsTwitterApiKey = <SettingsTwitterApiKey>_.get(config, ['settings', 'twitter', 'api-key']);
const configSettingsTwitterApiKeySecret = <SettingsTwitterApiKeySecret>_.get(config, ['settings', 'twitter', 'api-key-secret']);
const configSettingsTwitterAccessToken = <SettingsTwitterAccessToken>_.get(config, ['settings', 'twitter', 'access-token']);
const configSettingsTwitterAccessTokenSecret = <SettingsTwitterAccessTokenSecret>_.get(config, ['settings', 'twitter', 'access-token-secret']);
const configSettingsTimeZone = <SettingsTimeZone>_.get(config, ['settings', 'time-zone']);
const configSettingsLogLevel = <SettingsLogLevel>_.get(config, ['settings', 'log-level']);

// If "settings.discord.token" is not configured properly.
if (
  !_.isString(configSettingsDiscordToken)
  || _.isEmpty(configSettingsDiscordToken)
) {
  generateServerMessage('"settings.discord.token" is not configured properly');

  process.exit(1);
}

// If "settings.twitter" is not configured properly.
if (
  configSettingsTwitter !== undefined
  && (
    configSettingsTwitterApiKey === undefined
    || configSettingsTwitterApiKeySecret === undefined
    || configSettingsTwitterAccessToken === undefined
    || configSettingsTwitterAccessTokenSecret === undefined
  )
) {
  generateServerMessage('"settings.twitter" is not configured properly');

  process.exit(1);
}

// If "settings.twitter.api-key" is not configured properly.
if (
  configSettingsTwitterApiKey !== undefined
  && (
    !_.isString(configSettingsTwitterApiKey)
    || _.isEmpty(configSettingsTwitterApiKey)
  )
) {
  generateServerMessage('"settings.twitter.api-key" is not configured properly');

  process.exit(1);
}

// If "settings.twitter.api-key-secret" is not configured properly.
if (
  configSettingsTwitterApiKeySecret !== undefined
  && (
    !_.isString(configSettingsTwitterApiKeySecret)
    || _.isEmpty(configSettingsTwitterApiKeySecret)
  )
) {
  generateServerMessage('"settings.twitter.api-key-secret" is not configured properly');

  process.exit(1);
}

// If "settings.twitter.access-token" is not configured properly.
if (
  configSettingsTwitterAccessToken !== undefined
  && (
    !_.isString(configSettingsTwitterAccessToken)
    || _.isEmpty(configSettingsTwitterAccessToken)
  )
) {
  generateServerMessage('"settings.twitter.access-token" is not configured properly');

  process.exit(1);
}

// If "settings.twitter.access-token-secret" is not configured properly.
if (
  configSettingsTwitterAccessTokenSecret !== undefined
  && (
    !_.isString(configSettingsTwitterAccessTokenSecret)
    || _.isEmpty(configSettingsTwitterAccessTokenSecret)
  )
) {
  generateServerMessage('"settings.twitter.access-token-secret" is not configured properly');

  process.exit(1);
}

/**
 * Discord client.
 *
 * @since 1.0.0
 */
const discordClient = new Client({
  makeCache: Options.cacheWithLimits({
    MessageManager: {
      sweepFilter: Sweepers.filterByLifetime({
        lifetime: 2592000, // 30 days in seconds.
        getComparisonTimestamp: (message) => {
          const messageCreatedTimestamp = message.createdTimestamp;
          const messageEditedTimestamp = message.editedTimestamp;

          return messageEditedTimestamp ?? messageCreatedTimestamp;
        },
      }),
      sweepInterval: 60, // 1 minute in seconds.
    },
  }),
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

/**
 * Twitter client.
 *
 * @since 1.0.0
 */
let twitterClient: TwitterApi | undefined;

if (
  _.isString(configSettingsTwitterApiKey)
  && _.isString(configSettingsTwitterApiKeySecret)
  && _.isString(configSettingsTwitterAccessToken)
  && _.isString(configSettingsTwitterAccessTokenSecret)
) {
  twitterClient = new TwitterApi({
    appKey: configSettingsTwitterApiKey,
    appSecret: configSettingsTwitterApiKeySecret,
    accessToken: configSettingsTwitterAccessToken,
    accessSecret: configSettingsTwitterAccessTokenSecret,
  });
}

/**
 * Discord client login.
 *
 * @since 1.0.0
 */
discordClient.login(configSettingsDiscordToken).catch((error: Error) => {
  const errorMessage = error.message;

  generateServerMessage(
    errorMessage.replace(/\.$/, ''),
    error,
  );

  process.exit(1);
});

/**
 * Discord client on "ready".
 *
 * @since 1.0.0
 */
discordClient.on('ready', () => {
  // If "settings.discord.guild.guild-id" is not configured properly.
  if (
    !_.isString(configSettingsDiscordGuildGuildId)
    || _.isEmpty(configSettingsDiscordGuildGuildId)
  ) {
    generateServerMessage('"settings.discord.guild.guild-id" is not configured properly');

    process.exit(1);
  }

  // If "settings.time-zone" is not configured properly.
  if (
    !_.isString(configSettingsTimeZone)
    || _.isEmpty(configSettingsTimeZone)
    || !isTimeZoneValid(configSettingsTimeZone)
  ) {
    generateServerMessage('"settings.time-zone" is not configured properly');

    process.exit(1);
  }

  // If "settings.log-level" is not configured properly.
  if (
    !_.isNumber(configSettingsLogLevel)
    || (
      configSettingsLogLevel !== 10
      && configSettingsLogLevel !== 20
      && configSettingsLogLevel !== 30
      && configSettingsLogLevel !== 40
    )
  ) {
    generateServerMessage('"settings.log-level" is not configured properly');

    process.exit(1);
  }

  const discordClientGuilds = discordClient.guilds;
  const discordClientUser = discordClient.user;

  const guild = discordClientGuilds.resolve(configSettingsDiscordGuildGuildId);

  if (discordClientUser === null) {
    generateServerMessage('Failed to access client user');

    process.exit(1);
  }

  if (guild === null) {
    generateServerMessage('Failed to access guild');

    process.exit(1);
  }

  const discordClientUserTag = discordClientUser.tag;

  const guildAvailable = guild.available;
  const guildChannelsCache = guild.channels.cache;
  const guildMembersCache = guild.members.cache;
  const guildName = guild.name;

  const guildChannels = getCollectionItems(guildChannelsCache);
  const guildMembers = getCollectionItems(guildMembersCache);

  if (!guildAvailable) {
    generateServerMessage('Guild is not available');

    process.exit(1);
  }

  if (discordClientUser.presence.status !== 'online') {
    discordClientUser.setStatus('online');
  }

  discordClientUser.setActivity({
    name: 'Discord Stonker Bot | Fork or contribute at https://liang.nyc/dsb',
    type: 'PLAYING',
  });

  generateServerMessage(
    [
      chalk.green('Server is ready!'),
      'Logged in as',
      discordClientUserTag,
    ].join(' '),
  );

  generateServerMessage(
    [
      guildName,
      'has',
      guildMembers.length,
      ...(guildMembers.length === 1) ? ['member and'] : ['members and'],
      _.filter(guildChannels, (guildChannel) => (guildChannel.isText() && !guildChannel.isThread()) || guildChannel.isVoice()).length,
      ...(guildChannels.length === 1) ? ['channel'] : ['channels'],
    ].join(' '),
  );

  /**
   * Initialize.
   *
   * @since 1.0.0
   */
  initialize(
    discordClient,
    twitterClient,
    guild,
  );
});

/**
 * Process on "SIGINT".
 *
 * @since 1.0.0
 */
process.on('SIGINT', () => {
  const discordClientUser = discordClient.user;

  if (discordClientUser === null) {
    generateServerMessage('Failed to access client user');

    process.exit(1);
  }

  if (discordClientUser.presence.status !== 'invisible') {
    discordClientUser.setStatus('invisible');
  }

  generateServerMessage('Stopping server');

  discordClient.destroy();

  process.exit(0);
});
