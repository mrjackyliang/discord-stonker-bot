Discord Stonker Bot
====================

[![GitHub Releases](https://img.shields.io/github/v/release/mrjackyliang/discord-stonker-bot?style=flat-square&color=blue&sort=semver)](https://github.com/mrjackyliang/discord-stonker-bot/releases)
[![GitHub Top Languages](https://img.shields.io/github/languages/top/mrjackyliang/discord-stonker-bot?style=flat-square&color=success)](https://github.com/mrjackyliang/discord-stonker-bot)
[![GitHub License](https://img.shields.io/github/license/mrjackyliang/discord-stonker-bot?style=flat-square&color=yellow)](https://github.com/mrjackyliang/discord-stonker-bot/blob/master/LICENSE)
[![Become a GitHub Sponsor](https://img.shields.io/badge/sponsor-github-black?style=flat-square&color=orange)](https://github.com/sponsors/mrjackyliang)

A utility bot built for finance-related Discord servers. This bot adds a suite of features designed to enhance the experience of your Discord such as auto-reply, anti-raid, voice commands and more.

To use this Discord bot, you would need to:
1. Install the [dependencies](#install-dependencies)
2. Configure the [Discord Application](#configure-discord-application)
3. Configure the [Stonker Bot](#bot-configuration)
4. Start the bot using `npm start`

## Install Dependencies
Before configuring and starting the bot, make sure to install the dependencies and required packages.

1. Install [Homebrew](https://brew.sh) and run `brew install node`
2. Tap into the bot directory with `cd discord-stonker-bot`
3. Install dependencies by running `npm install`

## Configure Discord Application
Here are the instructions on how you can create an application and connect this bot to your Discord server. Simply follow the directions below:

1. First go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. In the top right corner, click __New Application__
3. Under the __Name__ field, type "Stonker Bot"
4. Once the application initializes, click the __Bot__ menu item
5. Click __Add Bot__ and then click __Yes, do it!__
6. Under __Privileged Gateway Intents__, turn on these options:
    - __PRESENCE INTENT__
    - __SERVER MEMBERS INTENT__
7. Click the __General Information__ menu item
8. Under __Client ID__, click __Copy__
9. Replace the `CLIENT_ID_HERE` below and visit link to add bot into server:
    - `https://discord.com/oauth2/authorize?client_id=CLIENT_ID_HERE&scope=bot&permissions=292348488773`

## Bot Configuration
In the project folder, you will find a `config-sample.json` file. Each section enables a feature and must be configured correctly. If you wish to disable a feature, you may omit the section from the configuration.

1. [Base Settings](#1-base-settings)
2. [Snitch Notifications](#2-snitch-notifications)
3. [Commands](#3-commands)
4. [API Fetch](#4-api-fetch)
5. [Anti-Raid](#5-anti-raid)
6. [Scheduled Posts](#6-scheduled-posts)
7. [RSS Feeds](#7-rss-feeds)
8. [Regex Channels](#8-regex-channels)
9. [Detect Suspicious Words](#9-detect-suspicious-words)
10. [Role Manager](#10-role-manager)
11. [Auto Reply](#11-auto-reply)
12. [Message Copier](#12-message-copier)
13. [Remove Affiliate Links](#13-remove-affiliate-links)
14. [Toggle Preset Permissions](#14-toggle-preset-permissions)
15. [Bump Threads](#15-bump-threads)
16. [Invite Generator](#16-invite-generator)

### 1. Base Settings
For Stonker Bot to start, these settings should be filled.

| __Key__                      | __Type__ | __Description__                                        | __Required__ | __Accepted Values__                                                                                                                                                          |
|------------------------------|----------|--------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings`                   | `object` |                                                        | no           |                                                                                                                                                                              |
| `settings.client-token`      | `string` | Bot token used to login to the application             | yes          | Bot token found in [Discord Developer Portal](https://discord.com/developers/applications) after [creating and adding a Discord application](#configure-discord-application) |
| `settings.guild-id`          | `string` | The guild this bot will connect to                     | yes          | Discord guild ID                                                                                                                                                             |
| `settings.bot-prefix`        | `string` | Prefixed character for executing a Stonker Bot command | no           | Maximum 3 characters allowed. Required to enable [Commands](#3-commands).                                                                                                    |
| `settings.server-http-port`  | `number` | Web server HTTP port for external requests             | no           | From `1` to `65535`                                                                                                                                                          |
| `settings.server-https-port` | `number` | Web server HTTPS port for external requests            | no           | From `1` to `65535`                                                                                                                                                          |
| `settings.server-https-key`  | `string` | Private key for HTTPS server                           | no           | Absolute file path for the private key in PEM format. Required if `settings.server-https-port` is set.                                                                       |
| `settings.server-https-cert` | `string` | Certificate for HTTPS server                           | no           | Absolute file path for the cert chain in PEM format. Required if `settings.server-https-port` is set.                                                                        |
| `settings.server-https-ca`   | `string` | Certificate authority for HTTPS server                 | no           | Absolute file path for the CA certificate in PEM format. Required if `settings.server-https-port` is set.                                                                    |
| `settings.time-zone`         | `string` | Preferred time zone                                    | yes          | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                     |
| `settings.log-level`         | `number` | Verbosity level configured for logging                 | yes          | `10` (error), `20` (warning), `30` (information), or `40` (debug)                                                                                                            |

```json
{
  "settings": {
    "client-token": "",
    "guild-id": "",
    "bot-prefix": "!",
    "server-http-port": 8080,
    "server-https-port": 8443,
    "server-https-key": "",
    "server-https-cert": "",
    "server-https-ca": "",
    "time-zone": "Etc/UTC",
    "log-level": 30
  }
}
```

### 2. Snitch Notifications
Get notifications from user actions surrounding your server. A notification will be sent to a specified channel when a user is updated, message includes media, or when a message is updated or deleted.

| __Key__                               | __Type__ | __Description__                             | __Required__ | __Accepted Values__ |
|---------------------------------------|----------|---------------------------------------------|--------------|---------------------|
| `snitch`                              | `object` |                                             | no           |                     |
| `snitch.change-nickname`              | `object` | Notify when a member changes their nickname | no           |                     |
| `snitch.change-nickname.channel-id`   | `string` |                                             | no           | Discord channel ID  |
| `snitch.change-username`              | `object` | Notify when a member changes their username | no           |                     |
| `snitch.change-username.channel-id`   | `string` |                                             | no           | Discord channel ID  |
| `snitch.delete-message`               | `object` | Notify when a message is deleted            | no           |                     |
| `snitch.delete-message.channel-id`    | `string` |                                             | no           | Discord channel ID  |
| `snitch.includes-link`                | `object` | Notify when a message includes links        | no           |                     |
| `snitch.includes-link.channel-id`     | `string` |                                             | no           | Discord channel ID  |
| `snitch.update-message`               | `object` | Notify when a message is edited             | no           |                     |
| `snitch.update-message.channel-id`    | `string` |                                             | no           | Discord channel ID  |
| `snitch.upload-attachment`            | `object` | Notify when an attachment is uploaded       | no           |                     |
| `snitch.upload-attachment.channel-id` | `string` |                                             | no           | Discord channel ID  |

```json
{
  "snitch": {
    "change-nickname": {
      "channel-id": "000000000000000000"
    },
    "change-username": {
      "channel-id": "000000000000000000"
    },
    "delete-message": {
      "channel-id": "000000000000000000"
    },
    "includes-link": {
      "channel-id": "000000000000000000"
    },
    "update-message": {
      "channel-id": "000000000000000000"
    },
    "upload-attachment": {
      "channel-id": "000000000000000000"
    }
  }
}
```

### 3. Commands
Allow members with certain roles to use commands provided by the Stonker Bot. If this is not configured, only server owners and administrators are able to use these commands.

| __Key__                                    | __Type__   | __Description__                 | __Required__ | __Accepted Values__ |
|--------------------------------------------|------------|---------------------------------|--------------|---------------------|
| `commands`                                 | `object`   |                                 | no           |                     |
| `commands.bulk-ban`                        | `object[]` |                                 | no           |                     |
| `commands.bulk-ban[x].description`         | `string`   | Description of the allowed role | no           |                     |
| `commands.bulk-ban[x].id`                  | `string`   | Allowed role                    | no           | Discord role ID     |
| `commands.fetch-duplicates`                | `object[]` |                                 | no           |                     |
| `commands.fetch-duplicates[x].description` | `string`   | Description of the allowed role | no           |                     |
| `commands.fetch-duplicates[x].id`          | `string`   | Allowed role                    | no           | Discord role ID     |
| `commands.fetch-members`                   | `object[]` |                                 | no           |                     |
| `commands.fetch-members[x].description`    | `string`   | Description of the allowed role | no           |                     |
| `commands.fetch-members[x].id`             | `string`   | Allowed role                    | no           | Discord role ID     |
| `commands.help-menu`                       | `object[]` |                                 | no           |                     |
| `commands.help-menu[x].description`        | `string`   | Description of the allowed role | no           |                     |
| `commands.help-menu[x].id`                 | `string`   | Allowed role                    | no           | Discord role ID     |
| `commands.role-manager`                    | `object[]` |                                 | no           |                     |
| `commands.role-manager[x].description`     | `string`   | Description of the allowed role | no           |                     |
| `commands.role-manager[x].id`              | `string`   | Allowed role                    | no           | Discord role ID     |
| `commands.toggle-perms`                    | `object[]` |                                 | no           |                     |
| `commands.toggle-perms[x].description`     | `string`   | Description of the allowed role | no           |                     |
| `commands.toggle-perms[x].id`              | `string`   | Allowed role                    | no           | Discord role ID     |
| `commands.voice-tools`                     | `object[]` |                                 | no           |                     |
| `commands.voice-tools[x].description`      | `string`   | Description of the allowed role | no           |                     |
| `commands.voice-tools[x].id`               | `string`   | Allowed role                    | no           | Discord role ID     |

```json
{
  "commands": {
    "bulk-ban": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ],
    "fetch-duplicates": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ],
    "fetch-members": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ],
    "help-menu": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ],
    "role-manager": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ],
    "toggle-perms": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ],
    "voice-tools": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ]
  }
}
```

### 4. API Fetch
Retrieve updated information through a live feed and via a customizable keyword (like a command). Current APIs available are Etherscan and Stocktwits.

| __Key__                                                                      | __Type__   | __Description__                            | __Required__ | __Accepted Values__                                                                                                                                                 |
|------------------------------------------------------------------------------|------------|--------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `api-fetch`                                                                  | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle`                                             | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.settings`                                    | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.settings.api-key`                            | `string`   | API key to access Etherscan API            | no           | [Signup for an Etherscan API Key](https://etherscan.io/register)                                                                                                    |
| `api-fetch.etherscan-gas-oracle.feed`                                        | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.feed.channel-id`                             | `string`   | Channel used to send Etherscan API updates | no           | Discord channel ID                                                                                                                                                  |
| `api-fetch.etherscan-gas-oracle.command`                                     | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.command.regex`                               | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.command.regex.pattern`                       | `string`   | Regex pattern for matching message content | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `api-fetch.etherscan-gas-oracle.command.regex.flags`                         | `string`   | Regex flags                                | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `api-fetch.etherscan-gas-oracle.command.allowed-roles`                       | `object[]` |                                            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.command.allowed-roles[x].description`        | `string`   | Description of the allowed role            | no           |                                                                                                                                                                     |
| `api-fetch.etherscan-gas-oracle.command.allowed-roles[x].id`                 | `string`   | Allowed role                               | no           | Discord role ID                                                                                                                                                     |
| `api-fetch.stocktwits-trending`                                              | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.stocktwits-trending.feed`                                         | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.stocktwits-trending.feed.channel-id`                              | `string`   | Channel used to send Etherscan API updates | no           | Discord channel ID                                                                                                                                                  |
| `api-fetch.stocktwits-trending.command`                                      | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.stocktwits-trending.command.regex`                                | `object`   |                                            | no           |                                                                                                                                                                     |
| `api-fetch.stocktwits-trending.command.regex.pattern`                        | `string`   | Regex pattern for matching message content | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `api-fetch.stocktwits-trending.command.regex.flags`                          | `string`   | Regex flags                                | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `api-fetch.stocktwits-trending.command.allowed-roles`                        | `object[]` |                                            | no           |                                                                                                                                                                     |
| `api-fetch.stocktwits-trending.command.allowed-roles[x].description`         | `string`   | Description of the allowed role            | no           |                                                                                                                                                                     |
| `api-fetch.stocktwits-trending.command.allowed-roles[x].id`                  | `string`   | Allowed role                               | no           | Discord role ID                                                                                                                                                     |

```json
{
  "api-fetch": {
    "etherscan-gas-oracle": {
      "settings": {
        "api-key": ""
      },
      "feed": {
        "channel-id": ""
      },
      "command": {
        "regex": {
          "pattern": "(?:)",
          "flags": "g"
        },
        "allowed-roles": [
          {
            "description": "Sample role",
            "id": "000000000000000000"
          }
        ]
      }
    },
    "stocktwits-trending": {
      "feed": {
        "channel-id": ""
      },
      "command": {
        "regex": {
          "pattern": "(?:)",
          "flags": "g"
        },
        "allowed-roles": [
          {
            "description": "Sample role",
            "id": "000000000000000000"
          }
        ]
      }
    }
  }
}
```

### 5. Anti-Raid
A set of tools to ban members (based on their avatar hash or username), and helps automate the membership gate for those that just joined the server.

| __Key__                                    | __Type__   | __Description__                                   | __Required__ | __Accepted Values__                                                                    |
|--------------------------------------------|------------|---------------------------------------------------|--------------|----------------------------------------------------------------------------------------|
| `anti-raid`                                | `object`   |                                                   | no           |                                                                                        |
| `anti-raid.auto-ban`                       | `object`   |                                                   | no           |                                                                                        |
| `anti-raid.auto-ban.avatar`                | `string[]` | List of banned avatar hashes                      | no           | File name of avatar (without file extension)                                           |
| `anti-raid.auto-ban.username`              | `string[]` | List of banned usernames                          | no           | Username of user                                                                       |
| `anti-raid.membership-gate`                | `object`   |                                                   | no           |                                                                                        |
| `anti-raid.membership-gate.role-id`        | `string`   | Role to assign when a user passes the gate        | no           | Discord role ID                                                                        |
| `anti-raid.membership-gate.channel-id`     | `string`   | Where to send message when a user passes the gate | no           | Discord channel ID                                                                     |
| `anti-raid.membership-gate.message`        | `string`   | Message to send when a user passes the gate       | no           | Cannot exceed 2000 characters. Variables include `%GUILD_NAME%` and `%MEMBER_MENTION%` |
| `anti-raid.monitor`                        | `object`   |                                                   | no           |                                                                                        |
| `anti-raid.monitor.guild-join`             | `object`   |                                                   | no           |                                                                                        |
| `anti-raid.monitor.guild-join.channel-id`  | `string`   | Channel to post in when a user joins a guild      | no           | Discord channel ID                                                                     |
| `anti-raid.monitor.guild-leave`            | `object`   |                                                   | no           |                                                                                        |
| `anti-raid.monitor.guild-leave.channel-id` | `string`   | Channel to post in when a user leaves a guild     | no           | Discord channel ID                                                                     |

```json
{
  "anti-raid": {
    "auto-ban": {
      "avatar": [
        "00000000000000000000000000000000"
      ],
      "username": [
        "Bad User"
      ]
    },
    "membership-gate": {
      "role-id": "000000000000000000",
      "channel-id": "000000000000000000",
      "message": "Welcome to %GUILD_NAME%! Thank you for verifying, %MEMBER_MENTION%."
    },
    "monitor": {
      "guild-join": {
        "channel-id": "000000000000000000"
      },
      "guild-leave": {
        "channel-id": "000000000000000000"
      }
    }
  }
}
```

### 6. Scheduled Posts
You can schedule messages to be sent out to a specific text-based channel. No more inconsistently timed messages! You are also able to skip certain dates from posting (like a holiday, for instance) and even send on a specific day.

| __Key__                                     | __Type__   | __Description__                     | __Required__ | __Accepted Values__                                                                                                                                       |
|---------------------------------------------|------------|-------------------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `schedule-posts`                            | `object[]` |                                     | no           |                                                                                                                                                           |
| `schedule-posts[x].name`                    | `string`   | Name of the scheduled post          | no           |                                                                                                                                                           |
| `schedule-posts[x].channel-id`              | `string`   | Channel used to send scheduled post | no           | Discord channel ID                                                                                                                                        |
| `schedule-posts[x].payload`                 | `object`   | Message content                     | no           | Cannot be empty. Must follow the `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions) |
| `schedule-posts[x].reactions`               | `string[]` | Reactions for scheduled post        | no           | Unicode emojis or a custom emoji identifier string (`<:name:id>` for static, `<a:name:id>` for animated)                                                  |
| `schedule-posts[x].send-every`              | `object`   |                                     | no           |                                                                                                                                                           |
| `schedule-posts[x].send-every.time-zone`    | `string`   | Send post on time zone              | no           | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                  |
| `schedule-posts[x].send-every.days-of-week` | `number[]` | Send post during day of week        | no           | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), `6` (Saturday)                                                  |
| `schedule-posts[x].send-every.year`         | `number[]` | Send post on year                   | no           | Four-digit year                                                                                                                                           |
| `schedule-posts[x].send-every.month`        | `number[]` | Send post on month                  | no           | From `0` to `11`                                                                                                                                          |
| `schedule-posts[x].send-every.date`         | `number[]` | Send post on date                   | no           | From `1` to `31`                                                                                                                                          |
| `schedule-posts[x].send-every.hour`         | `number[]` | Send post on hour of day            | no           | From `0` to `23`                                                                                                                                          |
| `schedule-posts[x].send-every.minute`       | `number[]` | Send post on minute of day          | no           | From `0` to `59`                                                                                                                                          |
| `schedule-posts[x].send-every.second`       | `number[]` | Send post on second of day          | no           | From `0` to `59`                                                                                                                                          |
| `schedule-posts[x].skip-days`               | `string[]` | Don't post during specified days    | no           | Date format is `YYYY-MM-DD`                                                                                                                               |

```json
{
  "schedule-posts": [
    {
      "name": "Sample",
      "channel-id": "000000000000000000",
      "payload": {
        "content": "This is a sample scheduled post"
      },
      "reactions": [
        "🟢",
        "🟡",
        "🔴"
      ],
      "send-every": {
        "time-zone": "Etc/UTC",
        "days-of-week": [
          0,
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "year": [
          2020
        ],
        "month": [
          0
        ],
        "date": [
          1
        ],
        "hour": [
          0
        ],
        "minute": [
          0
        ],
        "second": [
          0
        ]
      },
      "skip-days": [
        "2021-01-01",
        "2021-02-01"
      ]
    }
  ]
}
```

### 7. RSS Feeds
Get updates from external RSS feeds. Customize the message when a new RSS update is detected (add notifications, custom text) and set cron time intervals!

| __Key__                   | __Type__   | __Description__                        | __Required__ | __Accepted Values__                                                                                   |
|---------------------------|------------|----------------------------------------|--------------|-------------------------------------------------------------------------------------------------------|
| `rss-feeds`               | `object[]` |                                        | no           |                                                                                                       |
| `rss-feeds[x].name`       | `string`   | Name of the RSS feed task              | no           |                                                                                                       |
| `rss-feeds[x].channel-id` | `string`   | Channel to send RSS feed updates       | no           | Discord channel ID                                                                                    |
| `rss-feeds[x].interval`   | `string`   | Cron-based interval timing             | no           | Generate an expression from the [Cron Expression Generator](http://crontab.cronhub.io/)               |
| `rss-feeds[x].url`        | `string`   | Link of the RSS feed                   | no           |                                                                                                       |
| `rss-feeds[x].message`    | `string`   | Customized message for RSS feed update | no           | Cannot be empty and cannot exceed 2000 characters. Variables include `%ITEM_TITLE%` and `%ITEM_LINK%` |

```json
{
  "rss-feeds": [
    {
      "name": "Sample",
      "channel-id": "000000000000000000",
      "interval": "* * * * *",
      "url": "https://www.example.com/feed",
      "message": "Sample: %ITEM_TITLE% - %ITEM_LINK%"
    }
  ]
}
```

### 8. Regex Channels
Restrict a specific format in a particular channel. If the message doesn't match the regular expression, the message will be deleted (unless member is a server owner, administrator, or listed under excluded roles).

_This feature can be extended with the [delete message](#2-snitch-notifications) notification._

| __Key__                                       | __Type__   | __Description__                            | __Required__ | __Accepted Values__                                                                                                                                                 |
|-----------------------------------------------|------------|--------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `regex-rules`                                 | `object[]` |                                            | no           |                                                                                                                                                                     |
| `regex-rules[x].name`                         | `string`   | Name of the regex restriction              | no           |                                                                                                                                                                     |
| `regex-rules[x].channel-id`                   | `string`   | Channel under regex restriction            | no           | Discord channel ID                                                                                                                                                  |
| `regex-rules[x].regex`                        | `object`   |                                            | no           |                                                                                                                                                                     |
| `regex-rules[x].regex.pattern`                | `string`   | Regex pattern for matching message content | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `regex-rules[x].regex.flags`                  | `string`   | Regex flags                                | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `regex-rules[x].direct-message`               | `string`   | Direct message content                     | no           | Cannot exceed 2000 characters                                                                                                                                       |
| `regex-rules[x].exclude-roles`                | `object[]` |                                            | no           |                                                                                                                                                                     |
| `regex-rules[x].exclude-roles[x].description` | `string`   | Description of the excluded role           | no           |                                                                                                                                                                     |
| `regex-rules[x].exclude-roles[x].id`          | `string`   | Excluded role                              | no           | Discord role ID                                                                                                                                                     |

```json
{
  "regex-rules": [
    {
      "name": "Sample Regex",
      "channel-id": "000000000000000000",
      "regex": {
        "pattern": "(?:)",
        "flags": "g"
      },
      "direct-message": "This type of text is not allowed in this channel!",
      "exclude-roles": [
        {
          "description": "Sample role",
          "id": "000000000000000000"
        }
      ]
    }
  ]
}
```

### 9. Detect Suspicious Words
Detect words in a message that may require attention. Useful when a member mentions a person of interest (without tagging them) or detection of vulgar language that often do not require warnings or deletion.

| __Key__                                   | __Type__   | __Description__                          | __Required__ | __Accepted Values__ |
|-------------------------------------------|------------|------------------------------------------|--------------|---------------------|
| `suspicious-words`                        | `object`   |                                          | no           |                     |
| `suspicious-words.channel-id`             | `string`   | Channel used to report suspicious words  | no           | Discord channel ID  |
| `suspicious-words.categories`             | `object[]` |                                          | no           |                     |
| `suspicious-words.categories[x].category` | `string`   | Category that the word is detected under | no           |                     |
| `suspicious-words.categories[x].words`    | `string[]` | List of suspicious words to detect       | no           |                     |

```json
{
  "suspicious-words": {
    "channel-id": "000000000000000000",
    "categories": [
      {
        "category": "Sample",
        "words": [
          "suspicious",
          "really suspicious"
        ]
      }
    ]
  }
}
```

### 10. Role Manager
Add or remove selected roles from members if it meets a condition (`yes-to-yes`, `no-to-no`, `yes-to-no`, or `no-to-yes`).

Useful for many scenarios like when members lose a Premium role or when members get muted (_removing_ write access roles).

| __Key__                             | __Type__   | __Description__                    | __Required__ | __Accepted Values__                                   |
|-------------------------------------|------------|------------------------------------|--------------|-------------------------------------------------------|
| `roles`                             | `object[]` |                                    | no           |                                                       |
| `roles[x].name`                     | `string`   | Name of the role task              | no           |                                                       |
| `roles[x].type`                     | `string`   | Condition to remove roles          | no           | `yes-to-yes`, `no-to-no`, `yes-to-no`, or `no-to-yes` |
| `roles[x].before`                   | `object[]` |                                    | no           |                                                       |
| `roles[x].before[x].description`    | `string`   | Description of the roles before    | no           |                                                       |
| `roles[x].before[x].id`             | `string`   | Role before                        | no           | Discord role ID                                       |
| `roles[x].after`                    | `object[]` |                                    | no           |                                                       |
| `roles[x].after[x].description`     | `string`   | Description of the roles after     | no           |                                                       |
| `roles[x].after[x].id`              | `string`   | Role after                         | no           | Discord role ID                                       |
| `roles[x].to-add`                   | `object[]` |                                    | no           |                                                       |
| `roles[x].to-add[x].description`    | `string`   | Description of the roles to add    | no           |                                                       |
| `roles[x].to-add[x].id`             | `string`   | Role to add                        | no           | Discord role ID                                       |
| `roles[x].to-remove`                | `object[]` |                                    | no           |                                                       |
| `roles[x].to-remove[x].description` | `string`   | Description of the roles to remove | no           |                                                       |
| `roles[x].to-remove[x].id`          | `string`   | Role to remove                     | no           | Discord role ID                                       |

```json
{
  "roles": [
    {
      "name": "Remove B role if member is A",
      "type": "yes-to-yes",
      "before": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "after": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "to-remove": [
        {
          "description": "B role",
          "id": "000000000000000000"
        }
      ]
    },
    {
      "name": "Remove B role if member is not A",
      "type": "no-to-no",
      "before": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "after": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "to-remove": [
        {
          "description": "B role",
          "id": "000000000000000000"
        }
      ]
    },
    {
      "name": "Add B role if member went from A to not A",
      "type": "yes-to-no",
      "before": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "after": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "to-add": [
        {
          "description": "B role",
          "id": "000000000000000000"
        }
      ]
    },
    {
      "name": "Remove B role if member went from not A to A",
      "type": "no-to-yes",
      "before": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "after": [
        {
          "description": "A role",
          "id": "000000000000000000"
        }
      ],
      "to-remove": [
        {
          "description": "B role",
          "id": "000000000000000000"
        }
      ]
    }
  ]
}
```

### 11. Auto Reply
Reply to a message without requiring human interaction. Great for automated customer service or surprise members with hidden Easter eggs!

| __Key__                       | __Type__   | __Description__                            | __Required__ | __Accepted Values__                                                                                                                                                 |
|-------------------------------|------------|--------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-reply`                  | `object[]` |                                            | no           |                                                                                                                                                                     |
| `auto-reply[x].name`          | `string`   | Name of the auto-reply task                | no           |                                                                                                                                                                     |
| `auto-reply[x].channel-ids`   | `string[]` | Channels monitored for the reply           | no           | Discord channel IDs                                                                                                                                                 |
| `auto-reply[x].reply`         | `boolean`  | Reply to the author                        | no           | `true` or `false`                                                                                                                                                   |
| `auto-reply[x].regex`         | `object`   |                                            | no           |                                                                                                                                                                     |
| `auto-reply[x].regex.pattern` | `string`   | Regex pattern for matching message content | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `auto-reply[x].regex.flags`   | `string`   | Regex flags                                | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `auto-reply[x].messages`      | `string[]` | Message contents                           | no           | Cannot be empty and cannot exceed 2000 characters (lesser characters if tagging author)                                                                             |

```json
{
  "auto-reply": [
    {
      "name": "Sample",
      "channel-ids": [
        "000000000000000000"
      ],
      "reply": true,
      "regex": {
        "pattern": "(?:)",
        "flags": "gi"
      },
      "messages": [
        "reply 1",
        "reply 2"
      ]
    }
  ]
}
```

### 12. Message Copier
Automatically copy the original message that matches the regular expression into another channel. A powerful utility to organize content in Discord.

| __Key__                                          | __Type__   | __Description__                                  | __Required__ | __Accepted Values__                                                                                                                                                                               |
|--------------------------------------------------|------------|--------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `message-copier`                                 | `object[]` |                                                  | no           |                                                                                                                                                                                                   |
| `message-copier[x].name`                         | `string`   | Name of the message copier task                  | no           |                                                                                                                                                                                                   |
| `message-copier[x].channel-id`                   | `string`   | The channel that the message should be posted to | no           | Discord channel ID                                                                                                                                                                                |
| `message-copier[x].regex`                        | `object`   |                                                  | no           |                                                                                                                                                                                                   |
| `message-copier[x].regex.pattern`                | `string`   | Regex pattern for matching message content       | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                               |
| `message-copier[x].regex.flags`                  | `string`   | Regex flags                                      | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                             |
| `message-copier[x].replacements`                 | `object[]` |                                                  | no           |                                                                                                                                                                                                   |
| `message-copier[x].replacements[x].pattern`      | `string`   | Regex pattern for replacing message content      | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                               |
| `message-copier[x].replacements[x].flags`        | `string`   | Regex flags                                      | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                             |
| `message-copier[x].replacements[x].replace-with` | `string`   | Replace matched content with                     | no           | Read [Using a regular expression to change data format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_a_regular_expression_to_change_data_format) |
| `message-copier[x].format`                       | `string`   | Format the copied message                        | no           | Cannot exceed 2000 characters. Variables include `%AUTHOR_MENTION%`, `%AUTHOR_TAG%`, `%CHANNEL_MENTION%`, `%MESSAGE_CONTENT%`, `%MESSAGE_EXCERPT%`, and `%MESSAGE_URL%`.                          |
| `message-copier[x].include-attachments`          | `boolean`  | Include attachments when copying message         | no           | `true` or `false`                                                                                                                                                                                 |
| `message-copier[x].delete-message`               | `boolean`  | Delete original message when copying message     | no           | `true` or `false`                                                                                                                                                                                 |
| `message-copier[x].allowed-users`                | `string[]` | Only copy messages sent by these users           | no           | Discord user IDs                                                                                                                                                                                  |
| `message-copier[x].allowed-channels`             | `string[]` | Only copy messages sent in these channels        | no           | Discord channel IDs                                                                                                                                                                               |
| `message-copier[x].disallowed-users`             | `string[]` | Do not copy messages sent by these users         | no           | Discord user IDs                                                                                                                                                                                  |
| `message-copier[x].disallowed-channels`          | `string[]` | Do not copy messages sent in these channels      | no           | Discord channel IDs                                                                                                                                                                               |

```json
{
  "message-copier": [
    {
      "name": "Sample",
      "channel-id": "000000000000000000",
      "regex": {
        "pattern": "(?:)",
        "flags": "g"
      },
      "replacements": [
        {
          "pattern": "",
          "flags": "",
          "replace-with": ""
        }
      ],
      "format": "Author Mention: %AUTHOR_MENTION%\nAuthor Tag: %AUTHOR_TAG%\nChannel Mention: %CHANNEL_MENTION%\nMessage Content: %MESSAGE_CONTENT%\nMessage Excerpt: %MESSAGE_EXCERPT%\nMessage URL: %MESSAGE_URL%",
      "include-attachments": true,
      "delete-message": false,
      "allowed-users": [
        "000000000000000000"
      ],
      "allowed-channels": [
        "000000000000000000"
      ],
      "disallowed-users": [
        "000000000000000000"
      ],
      "disallowed-channels": [
        "000000000000000000"
      ]
    }
  ]
}
```

### 13. Remove Affiliate Links
Easily remove affiliate links posted in channels, many of them unauthorized and undetected. This feature automatically removes affiliate links and logs the message.

_This feature can be extended with the [delete message](#2-snitch-notifications) notification._

| __Key__                                         | __Type__   | __Description__                            | __Required__ | __Accepted Values__                                                                                                                                                 |
|-------------------------------------------------|------------|--------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `affiliate-links`                               | `object`   |                                            | no           |                                                                                                                                                                     |
| `affiliate-links.links`                         | `object[]` |                                            | no           |                                                                                                                                                                     |
| `affiliate-links.links[x].website`              | `string`   | Name of the website                        | no           |                                                                                                                                                                     |
| `affiliate-links.links[x].regex.pattern`        | `string`   | Regex pattern for matching message content | no           | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `affiliate-links.links[x].regex.flags`          | `string`   | Regex flags                                | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `affiliate-links.channel-id`                    | `string`   | Channel used to report affiliate links     | no           | Discord channel ID                                                                                                                                                  |
| `affiliate-links.direct-message`                | `string`   | Direct message warning                     | no           | Cannot exceed 2000 characters                                                                                                                                       |
| `affiliate-links.excluded-roles`                | `object[]` |                                            | no           |                                                                                                                                                                     |
| `affiliate-links.excluded-roles[x].description` | `string`   | Description of the excluded role           | no           |                                                                                                                                                                     |
| `affiliate-links.excluded-roles[x].id`          | `string`   | Excluded role                              | no           | Discord role ID                                                                                                                                                     |

```json
{
  "affiliate-links": {
    "links": [
      {
        "website": "Affiliate Company",
        "regex": {
          "pattern": "(?:)",
          "flags": "gi"
        }
      }
    ],
    "channel-id": "000000000000000000",
    "direct-message": "Please do not send affiliate links!",
    "excluded-roles": [
      {
        "description": "Sample role",
        "id": "000000000000000000"
      }
    ]
  }
}
```

### 14. Toggle Preset Permissions
Configure channel permissions with a single command without touching them! Great for quickly showing and hiding channels for special events.

| __Key__                                                      | __Type__   | __Description__                | __Required__ | __Accepted Values__                                                                                                                                                    |
|--------------------------------------------------------------|------------|--------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `toggle-perms`                                               | `object[]` |                                | no           |                                                                                                                                                                        |
| `toggle-perms[x].name`                                       | `string`   | Toggle group name              | no           |                                                                                                                                                                        |
| `toggle-perms[x].id`                                         | `string`   | Toggle group identifier        | no           |                                                                                                                                                                        |
| `toggle-perms[x].on`                                         | `object[]` |                                | no           |                                                                                                                                                                        |
| `toggle-perms[x].on[x].description`                          | `string`   | Toggle on channel description  | no           |                                                                                                                                                                        |
| `toggle-perms[x].on[x].channel-id`                           | `string`   | Toggle on channel ID           | no           | Discord channel ID                                                                                                                                                     |
| `toggle-perms[x].on[x].channel-perms`                        | `object[]` | Toggle on channel permissions  | no           |                                                                                                                                                                        |
| `toggle-perms[x].on[x].channel-perms[x].description`         | `string`   | Description of user or role    | no           |                                                                                                                                                                        |
| `toggle-perms[x].on[x].channel-perms[x].user-or-role-id`     | `string`   | User or role                   | no           | Discord user or role ID                                                                                                                                                |
| `toggle-perms[x].on[x].channel-perms[x].user-or-role-perms`  | `object`   | User or role permissions       | no           | Review the [permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). Set flags to `true` (green), `null` (gray), `false` (red) |
| `toggle-perms[x].off`                                        | `object[]` |                                | no           |                                                                                                                                                                        |
| `toggle-perms[x].off[x].description`                         | `string`   | Toggle off channel description | no           |                                                                                                                                                                        |
| `toggle-perms[x].off[x].channel-id`                          | `string`   | Toggle off channel ID          | no           | Discord channel ID                                                                                                                                                     |
| `toggle-perms[x].off[x].channel-perms`                       | `object[]` | Toggle off channel permissions | no           |                                                                                                                                                                        |
| `toggle-perms[x].off[x].channel-perms[x].description`        | `string`   | Description of user or role    | no           |                                                                                                                                                                        |
| `toggle-perms[x].off[x].channel-perms[x].user-or-role-id`    | `string`   | User or role                   | no           | Discord user or role ID                                                                                                                                                |
| `toggle-perms[x].off[x].channel-perms[x].user-or-role-perms` | `object`   | User or role permissions       | no           | Review the [permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). Set flags to `true` (green), `null` (gray), `false` (red) |

```json
{
  "toggle-perms": [
    {
      "name": "Sample",
      "id": "sample",
      "on": [
        {
          "description": "#sample-channel",
          "channel-id": "000000000000000000",
          "channel-perms": [
            {
              "description": "Sample role",
              "user-or-role-id": "000000000000000000",
              "user-or-role-perms": {
                "SEND_MESSAGES": false
              }
            }
          ]
        }
      ],
      "off": [
        {
          "description": "#sample-channel",
          "channel-id": "000000000000000000",
          "channel-perms": [
            {
              "description": "Sample role",
              "user-or-role-id": "000000000000000000",
              "user-or-role-perms": {
                "SEND_MESSAGES": false
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 15. Bump Threads
Stretch the world of threads and make them like sub-channels! Create threads that never expire, even if you don't have _boosted_ servers.

| __Key__                      | __Type__   | __Description__            | __Required__ | __Accepted Values__ |
|------------------------------|------------|----------------------------|--------------|---------------------|
| `bump-threads`               | `object[]` |                            | no           |                     |
| `bump-threads[x].name`       | `string`   | Bump thread channel name   | no           |                     |
| `bump-threads[x].channel-id` | `string`   | Bump thread parent channel | no           | Discord channel ID  |
| `bump-threads[x].thread-id`  | `string`   | Bump thread channel        | no           | Discord thread ID   |

```json
{
  "bump-threads": [
    {
      "name": "#sample-channel",
      "channel-id": "000000000000000000",
      "thread-id": "000000000000000000"
    }
  ]
}
```

### 16. Invite Generator
A membership invite gate to protect your Discord server from being raided and spammed on. Authentication is made from Google's reCAPTCHA service. Customization includes the page design and code injection.

| __Key__                                       | __Type__ | __Description__                              | __Required__ | __Accepted Values__                                                                                                           |
|-----------------------------------------------|----------|----------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------|
| `invite-generator`                            | `object` |                                              | no           |                                                                                                                               |
| `invite-generator.path`                       | `string` | Path used to access invite generator         | no           | Paths begin with `/`. For example, a URL of `https://www.example.com/invite` would have a path of `/invite`                   |
| `invite-generator.options`                    | `object` | Options for the invite generator             | no           |                                                                                                                               |
| `invite-generator.options.max-age`            | `number` | Maximum time limit for the invite            | no           | Time in seconds (e.g. 1 minute equals `60`)                                                                                   |
| `invite-generator.options.max-uses`           | `number` | Maximum uses for the invite                  | no           | Time in seconds (e.g. 1 minute equals `60`)                                                                                   |
| `invite-generator.design`                     | `object` |                                              | no           |                                                                                                                               |
| `invite-generator.design.logo-url`            | `string` | Link to an image used for the front page     | no           | Square image with size dimensions of `300 x 300` or larger                                                                    |
| `invite-generator.design.favicon-url`         | `object` | Link to an image used for the favicon        | no           | `.png` extensions only                                                                                                        |
| `invite-generator.design.background-color`    | `object` | Color for background                         | no           | Read [CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)                                          |
| `invite-generator.design.link-color`          | `object` | Color for links                              | no           | Read [CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)                                          |
| `invite-generator.design.text-color`          | `object` | Color for text                               | no           | Read [CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)                                          |
| `invite-generator.inject-code`                | `object` |                                              | no           |                                                                                                                               |
| `invite-generator.inject-code.header`         | `object` | Unescaped code between the `head` tags       | no           | Double-quote escaped HTML code                                                                                                |
| `invite-generator.inject-code.submit-success` | `object` | Unescaped code when user passes verification | no           | Double-quote escaped HTML code. Available variables are `success` (Discord invite url)                                        |
| `invite-generator.inject-code.submit-fail`    | `object` | Unescaped code when user fails verification  | no           | Double-quote escaped HTML code. Available variables are `fail` (The [jqXHR Object](https://api.jquery.com/jquery.ajax#jqXHR)) |
| `invite-generator.recaptcha`                  | `object` |                                              | no           |                                                                                                                               |
| `invite-generator.recaptcha.site-key`         | `object` | Google reCAPTCHA v2 Checkbox Site Key        | no           | [Sign-up](https://www.google.com/recaptcha/admin/create) for a reCAPTCHA v2 checkbox                                          |
| `invite-generator.recaptcha.secret-key`       | `object` | Google reCAPTCHA v2 Checkbox Secret Key      | no           | [Sign-up](https://www.google.com/recaptcha/admin/create) for a reCAPTCHA v2 checkbox                                          |

```json
{
  "invite-generator": {
    "path": "/invite",
    "options": {
      "max-age": 120,
      "max-uses": 1
    },
    "design": {
      "logo-url": "",
      "favicon-url": "",
      "background-color": "",
      "link-color": "",
      "text-color": ""
    },
    "inject-code": {
      "header": "",
      "submit-success": "",
      "submit-fail": ""
    },
    "recaptcha": {
      "site-key": "",
      "secret-key": ""
    }
  }
}
```
