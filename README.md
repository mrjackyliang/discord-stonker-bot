Discord Stonker Bot
====================

[![GitHub Releases](https://img.shields.io/github/v/release/mrjackyliang/discord-stonker-bot?style=flat-square&color=blue&sort=semver)](https://github.com/mrjackyliang/discord-stonker-bot/releases)
[![GitHub Top Languages](https://img.shields.io/github/languages/top/mrjackyliang/discord-stonker-bot?style=flat-square&color=success)](https://github.com/mrjackyliang/discord-stonker-bot)
[![GitHub License](https://img.shields.io/github/license/mrjackyliang/discord-stonker-bot?style=flat-square&color=yellow)](https://github.com/mrjackyliang/discord-stonker-bot/blob/master/LICENSE)
[![Become a GitHub Sponsor](https://img.shields.io/badge/sponsor-github-black?style=flat-square&color=orange)](https://github.com/sponsors/mrjackyliang)

An advanced business-ready bot built for finance-related Discord servers. This bot adds a suite of features designed to enhance the experience of your server such as content organization, impersonator detection, bumping threads, and more.

**This project is largely sponsored by and actively used in [Low Key Stonks](https://liang.nyc/lowkeystonks). If you are seeking for a Discord server stewardship, feel free to [contact me](https://www.mrjackyliang.com/contact).**

To use this Discord bot, you would need to:
1. Install the [dependencies](#install-dependencies)
2. Configure the [Discord application](#configure-discord-application)
3. Configure the [Twitter application](#configure-twitter-application) (optional)
4. Configure the [Stonker Bot](#bot-configuration)
5. Start the bot using `npm start`

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
   - If applicable, select a team under the __Team__ dropdown
4. Click __Create__ to create the application
5. Once the application is created, click the __Bot__ menu item on the left
6. Click __Add Bot__ in the top right corner and then click __Yes, do it!__
7. Under __Privileged Gateway Intents__, turn on these options:
    - __PRESENCE INTENT__
    - __SERVER MEMBERS INTENT__
    - __MESSAGE CONTENT INTENT__
8. Click the __General Information__ menu item
9. Under __Application ID__, click __Copy__
10. Replace the `APP_ID_HERE` below with the application ID you just copied then visit that link to add the bot into your server:
     - `https://discord.com/oauth2/authorize?client_id=APP_ID_HERE&scope=bot&permissions=292348488773`

## Configure Twitter Application
Here are the instructions on how you can create an application and enable Twitter features on this bot. Simply follow the directions below:

1. First go to [Twitter Developers](https://developer.twitter.com/portal/dashboard)
2. In the middle, click __+ Create Project__
3. Under the __Project name__ field, type "Stonker", then click __Next__
4. Under the __Select a use case__ field, select "Build customized solutions in-house", then click __Next__
5. Under the __Project description__ field, type "For use with Stonker projects", then click __Next__
6. Under the __App name__ field, type "Stonker Bot", then click __Next__
7. Click __App settings__
8. Under __User authentication settings__, click __Set up__
9. Enable the __OAuth 1.0a__ section
10. Under __OAUTH 1.0A SETTINGS__ > __App permissions__, select __Read and write__
11. Under __Callback URI / Redirect URL__, type "http://localhost"
12. Under __Website URL__, type in "http://www.example.com"
13. Click __Save__ and then click __Yes__

## Bot Configuration
In the project folder, you will find a `config-sample.json` file. Each section enables a feature and must be configured correctly. If you wish to disable a feature, you may omit the section from the configuration.

__NOTE:__ It is recommended that you configure the bot with a freshly made `config.json` file instead of copying directly from `config-sample.json`.

1. [Base Settings](#1-base-settings)
2. [Snitch Notifications](#2-snitch-notifications)
3. [Server Tools](#3-server-tools)
4. [Web Applications](#4-web-applications)
5. [API Fetch](#5-api-fetch)
6. [Anti-Raid](#6-anti-raid)
7. [Schedule Posts](#7-schedule-posts)
8. [RSS Feeds](#8-rss-feeds)
9. [Regex Rules](#9-regex-rules)
10. [Detect Suspicious Words](#10-detect-suspicious-words)
11. [Sync Roles](#11-sync-roles)
12. [Role Messages](#12-role-messages)
13. [Auto Replies](#13-auto-replies)
14. [Message Copiers](#14-message-copiers)
15. [Message Proxies](#15-message-proxies)
16. [Remove Affiliates](#16-remove-affiliates)
17. [Toggle Permissions](#17-toggle-permissions)
18. [Bump Threads](#18-bump-threads)
19. [Impersonator Alerts](#19-impersonator-alerts)
20. [Scammer Alerts](#20-scammer-alerts)
21. [Twitter Feeds](#21-twitter-feeds)
22. [Broadcast Alerts](#22-broadcast-alerts)

### 1. Base Settings
For Stonker Bot to start, the required settings should be filled.

| __Key__                                | __Type__ | __Description__                                         | __Required__ | __Accepted Values__                                                                                                                                                           |
|----------------------------------------|----------|---------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings`                             | `object` |                                                         | yes          |                                                                                                                                                                               |
| `settings.discord`                     | `object` |                                                         | yes          |                                                                                                                                                                               |
| `settings.discord.token`               | `string` | Token used to login to the Discord application          | yes          | Token found in [Discord Developer Portal](https://discord.com/developers/applications) after [configuring the Discord application](#configure-discord-application)            |
| `settings.discord.guild`               | `object` |                                                         | yes          |                                                                                                                                                                               |
| `settings.discord.guild.description`   | `string` | Description of the guild                                | no           |                                                                                                                                                                               |
| `settings.discord.guild.guild-id`      | `string` | Guild                                                   | yes          | Discord guild ID                                                                                                                                                              |
| `settings.twitter`                     | `object` |                                                         | no           |                                                                                                                                                                               |
| `settings.twitter.api-key`             | `string` | API key used to login to the Twitter application        | yes          | API key found in [Twitter Developers](https://developer.twitter.com/portal/dashboard) after [configuring the Twitter application](#configure-twitter-application)             |
| `settings.twitter.api-key-secret`      | `string` | API key secret used to login to the Twitter application | yes          | API key secret found in [Twitter Developers](https://developer.twitter.com/portal/dashboard) after [configuring the Twitter application](#configure-twitter-application)      |
| `settings.twitter.access-token`        | `string` | Access token used to login to the Twitter user          | yes          | Access token found in [Twitter Developers](https://developer.twitter.com/portal/dashboard) after [configuring the Twitter application](#configure-twitter-application)        |
| `settings.twitter.access-token-secret` | `string` | Access token secret used to login to the Twitter user   | yes          | Access token secret found in [Twitter Developers](https://developer.twitter.com/portal/dashboard) after [configuring the Twitter application](#configure-twitter-application) |
| `settings.time-zone`                   | `string` | Preferred time zone                                     | yes          | Time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                           |
| `settings.log-level`                   | `number` | Verbosity level for logged messages                     | yes          | `10` (error), `20` (warning), `30` (information), or `40` (debug)                                                                                                             |

```json
{
  "settings": {
    "discord": {
      "token": "",
      "guild": {
        "description": "",
        "guild-id": ""
      }
    },
    "twitter": {
      "api-key": "",
      "api-key-secret": "",
      "access-token": "",
      "access-token-secret": ""
    },
    "time-zone": "Etc/UTC",
    "log-level": 30
  }
}
```

### 2. Snitch Notifications
Get notifications from user actions surrounding your server. You can pick between receiving notifications related to user changes, when a message status changes, or when a message includes a link or attachment.

__NOTE:__ Only messages cached (during the current session or last edited within 30 days) will be tracked. To preserve cached events, you may create multiple configurable bot instances.

| __Key__                                                    | __Type__   | __Description__                                                     | __Required__ | __Accepted Values__                                                                                                                                                 |
|------------------------------------------------------------|------------|---------------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `snitch`                                                   | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.change-nickname`                                   | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.change-nickname.channel`                           | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.change-nickname.channel.description`               | `string`   | Description of the channel used to report nickname changes          | no           |                                                                                                                                                                     |
| `snitch.change-nickname.channel.channel-id`                | `string`   | Channel used to report nickname changes                             | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.change-username`                                   | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.change-username.channel`                           | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.change-username.channel.description`               | `string`   | Description of the channel used to report username changes          | no           |                                                                                                                                                                     |
| `snitch.change-username.channel.channel-id`                | `string`   | Channel used to report username changes                             | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.delete-message`                                    | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.delete-message.channel`                            | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.delete-message.channel.description`                | `string`   | Description of the channel used to report deleted messages          | no           |                                                                                                                                                                     |
| `snitch.delete-message.channel.channel-id`                 | `string`   | Channel used to report deleted messages                             | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.guild-join`                                        | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.guild-join.channel`                                | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.guild-join.channel.description`                    | `string`   | Description of the channel used to report guild member join         | no           |                                                                                                                                                                     |
| `snitch.guild-join.channel.channel-id`                     | `string`   | Channel used to report guild member join                            | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.guild-leave`                                       | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.guild-leave.channel`                               | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.guild-leave.channel.description`                   | `string`   | Description of the channel used to report guild member leave        | no           |                                                                                                                                                                     |
| `snitch.guild-leave.channel.channel-id`                    | `string`   | Channel used to report guild member leave                           | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.includes-link`                                     | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.includes-link.channel`                             | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.includes-link.channel.description`                 | `string`   | Description of the channel used to report messages with links       | no           |                                                                                                                                                                     |
| `snitch.includes-link.channel.channel-id`                  | `string`   | Channel used to report messages with links                          | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.includes-link.excluded-links`                      | `object[]` |                                                                     | no           |                                                                                                                                                                     |
| `snitch.includes-link.excluded-links[x].name`              | `string`   | Name of the excluded link                                           | no           |                                                                                                                                                                     |
| `snitch.includes-link.excluded-links[x].regex`             | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.includes-link.excluded-links[x].regex.description` | `string`   | Description of the excluded link regex                              | no           |                                                                                                                                                                     |
| `snitch.includes-link.excluded-links[x].regex.pattern`     | `string`   | Regex pattern                                                       | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `snitch.includes-link.excluded-links[x].regex.flags`       | `string`   | Regex flags                                                         | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `snitch.role-change`                                       | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.role-change.channel`                               | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.role-change.channel.description`                   | `string`   | Description of the channel used to report guild member role change  | no           |                                                                                                                                                                     |
| `snitch.role-change.channel.channel-id`                    | `string`   | Channel used to report guild member role change                     | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.update-message`                                    | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.update-message.channel`                            | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.update-message.channel.description`                | `string`   | Description of the channel used to report edited messages           | no           |                                                                                                                                                                     |
| `snitch.update-message.channel.channel-id`                 | `string`   | Channel used to report edited messages                              | yes          | Discord channel ID                                                                                                                                                  |
| `snitch.upload-attachment`                                 | `object`   |                                                                     | no           |                                                                                                                                                                     |
| `snitch.upload-attachment.channel`                         | `object`   |                                                                     | yes          |                                                                                                                                                                     |
| `snitch.upload-attachment.channel.description`             | `string`   | Description of the channel used to report messages with attachments | no           |                                                                                                                                                                     |
| `snitch.upload-attachment.channel.channel-id`              | `string`   | Channel used to report messages with attachments                    | yes          | Discord channel ID                                                                                                                                                  |

```json
{
  "snitch": {
    "change-nickname": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "change-username": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "delete-message": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "guild-join": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "guild-leave": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "includes-link": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "excluded-links": [
        {
          "name": "Sample",
          "regex": {
            "description": "Sample regex",
            "pattern": "(.+)",
            "flags": "g"
          }
        }
      ]
    },
    "role-change": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "update-message": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    "upload-attachment": {
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    }
  }
}
```

### 3. Server Tools
Easily manage your Discord server with these tools. Fetch information, manage roles, voice and stage channel controls, and ban multiple users with one command.

| __Key__                                                      | __Type__   | __Description__                  | __Required__ | __Accepted Values__                                         |
|--------------------------------------------------------------|------------|----------------------------------|--------------|-------------------------------------------------------------|
| `server-tools`                                               | `object`   |                                  | no           |                                                             |
| `server-tools.bulk-ban`                                      | `object`   |                                  | no           |                                                             |
| `server-tools.bulk-ban.base-commands`                        | `string[]` | Keywords to initiate command     | yes          | If there are prefixes, it is recommended to keep them exact |
| `server-tools.bulk-ban.delete-message`                       | `boolean`  | Delete message when command runs | no           | `true` or `false`                                           |
| `server-tools.bulk-ban.allowed-roles`                        | `object[]` |                                  | no           |                                                             |
| `server-tools.bulk-ban.allowed-roles[x].description`         | `string`   | Description of the allowed role  | no           |                                                             |
| `server-tools.bulk-ban.allowed-roles[x].role-id`             | `string`   | Allowed role                     | yes          | Discord role ID                                             |
| `server-tools.fetch-duplicates`                              | `object`   |                                  | no           |                                                             |
| `server-tools.fetch-duplicates.base-commands`                | `string[]` | Keywords to initiate command     | yes          | If there are prefixes, it is recommended to keep them exact |
| `server-tools.fetch-duplicates.delete-message`               | `boolean`  | Delete message when command runs | no           | `true` or `false`                                           |
| `server-tools.fetch-duplicates.allowed-roles`                | `object[]` |                                  | no           |                                                             |
| `server-tools.fetch-duplicates.allowed-roles[x].description` | `string`   | Description of the allowed role  | no           |                                                             |
| `server-tools.fetch-duplicates.allowed-roles[x].role-id`     | `string`   | Allowed role                     | yes          | Discord role ID                                             |
| `server-tools.fetch-emojis`                                  | `object`   |                                  | no           |                                                             |
| `server-tools.fetch emojis.base-commands`                    | `string[]` | Keywords to initiate command     | yes          | If there are prefixes, it is recommended to keep them exact |
| `server-tools.fetch-emojis.delete-message`                   | `boolean`  | Delete message when command runs | no           | `true` or `false`                                           |
| `server-tools.fetch-emojis.allowed-roles`                    | `object[]` |                                  | no           |                                                             |
| `server-tools.fetch-emojis.allowed-roles[x].description`     | `string`   | Description of the allowed role  | no           |                                                             |
| `server-tools.fetch-emojis.allowed-roles[x].role-id`         | `string`   | Allowed role                     | yes          | Discord role ID                                             |
| `server-tools.fetch-members`                                 | `object`   |                                  | no           |                                                             |
| `server-tools.fetch-members.base-commands`                   | `string[]` | Keywords to initiate command     | yes          | If there are prefixes, it is recommended to keep them exact |
| `server-tools.fetch-members.delete-message`                  | `boolean`  | Delete message when command runs | no           | `true` or `false`                                           |
| `server-tools.fetch-members.allowed-roles`                   | `object[]` |                                  | no           |                                                             |
| `server-tools.fetch-members.allowed-roles[x].description`    | `string`   | Description of the allowed role  | no           |                                                             |
| `server-tools.fetch-members.allowed-roles[x].role-id`        | `string`   | Allowed role                     | yes          | Discord role ID                                             |
| `server-tools.role-manager`                                  | `object`   |                                  | no           |                                                             |
| `server-tools.role-manager.base-commands`                    | `string[]` | Keywords to initiate command     | yes          | If there are prefixes, it is recommended to keep them exact |
| `server-tools.role-manager.delete-message`                   | `boolean`  | Delete message when command runs | no           | `true` or `false`                                           |
| `server-tools.role-manager.allowed-roles`                    | `object[]` |                                  | no           |                                                             |
| `server-tools.role-manager.allowed-roles[x].description`     | `string`   | Description of the allowed role  | no           |                                                             |
| `server-tools.role-manager.allowed-roles[x].role-id`         | `string`   | Allowed role                     | yes          | Discord role ID                                             |
| `server-tools.voice-tools`                                   | `object`   |                                  | no           |                                                             |
| `server-tools.voice-tools.base-commands`                     | `string[]` | Keywords to initiate command     | yes          | If there are prefixes, it is recommended to keep them exact |
| `server-tools.voice-tools.delete-message`                    | `boolean`  | Delete message when command runs | no           | `true` or `false`                                           |
| `server-tools.voice-tools.allowed-roles`                     | `object[]` |                                  | no           |                                                             |
| `server-tools.voice-tools.allowed-roles[x].description`      | `string`   | Description of the allowed role  | no           |                                                             |
| `server-tools.voice-tools.allowed-roles[x].role-id`          | `string`   | Allowed role                     | yes          | Discord role ID                                             |

```json
{
  "server-tools": {
    "bulk-ban": {
      "base-commands": [
        "!ban"
      ],
      "delete-message": true,
      "allowed-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ]
    },
    "fetch-duplicates": {
      "base-commands": [
        "!duplicates"
      ],
      "delete-message": true,
      "allowed-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ]
    },
    "fetch-emojis": {
      "base-commands": [
        "!emojis"
      ],
      "delete-message": true,
      "allowed-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ]
    },
    "fetch-members": {
      "base-commands": [
        "!members"
      ],
      "delete-message": true,
      "allowed-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ]
    },
    "role-manager": {
      "base-commands": [
        "!role"
      ],
      "delete-message": true,
      "allowed-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ]
    },
    "voice-tools": {
      "base-commands": [
        "!voice"
      ],
      "delete-message": true,
      "allowed-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ]
    }
  }
}
```

### 4. Web Applications
Connect external applications and traffic into your Discord server. To enable web applications, at least one server (HTTP or HTTPS) must be configured.

1. [Invite Generator](#41-invite-generator)
2. [Map Webhooks](#42-map-webhooks)

__NOTE:__ During reboots, all web applications will be taken offline. To increase uptime, you may create multiple configurable bot instances.

| __Key__                              | __Type__ | __Description__                        | __Required__ | __Accepted Values__                                            |
|--------------------------------------|----------|----------------------------------------|--------------|----------------------------------------------------------------|
| `web-applications`                   | `object` |                                        | no           |                                                                |
| `web-applications.http-server`       | `object` |                                        | no           |                                                                |
| `web-applications.http-server.port`  | `number` | Web server HTTP port                   | yes          | From `1` to `65535`                                            |
| `web-applications.https-server`      | `object` |                                        | no           |                                                                |
| `web-applications.https-server.port` | `number` | Web server HTTPS port                  | yes          | From `1` to `65535`                                            |
| `web-applications.https-server.key`  | `string` | Path to the private key file           | yes          | Absolute file path for the private key in PEM format           |
| `web-applications.https-server.cert` | `string` | Path to the certificate chain file     | yes          | Absolute file path for the certificate chain in PEM format     |
| `web-applications.https-server.ca`   | `string` | Path to the certificate authority file | yes          | Absolute file path for the certificate authority in PEM format |

```json
{
  "web-applications": {
    "http-server": {
      "port": 8080
    },
    "https-server": {
      "port": 8443,
      "key": "",
      "cert": "",
      "ca": ""
    }
  }
}
```

#### 4.1. Invite Generator
A membership invite gate to protect your Discord server from being raided and spammed on. Authentication is made from Google's reCAPTCHA service. To customize the invite generator webpage, rename the `invites-sample.ejs` file to `invites.ejs` and begin editing.

| __Key__                                                  | __Type__ | __Description__                         | __Required__ | __Accepted Values__                                                                                         |
|----------------------------------------------------------|----------|-----------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------|
| `web-applications.invite-generator`                      | `object` |                                         | no           |                                                                                                             |
| `web-applications.invite-generator.options`              | `object` |                                         | yes          |                                                                                                             |
| `web-applications.invite-generator.options.path`         | `string` | Path for accessing invite generator     | yes          | Paths begin with `/`. For example, a URL of `https://www.example.com/invite` would have a path of `/invite` |
| `web-applications.invite-generator.options.max-age`      | `number` | Invite maximum age                      | no           | Time in seconds (e.g. 1 minute equals `60`)                                                                 |
| `web-applications.invite-generator.options.max-uses`     | `number` | Invite maximum uses                     | no           | Whole numbers                                                                                               |
| `web-applications.invite-generator.recaptcha`            | `object` |                                         | yes          |                                                                                                             |
| `web-applications.invite-generator.recaptcha.site-key`   | `string` | Google reCAPTCHA v2 checkbox site key   | yes          | [Sign-up](https://www.google.com/recaptcha/admin/create) for a reCAPTCHA v2 checkbox                        |
| `web-applications.invite-generator.recaptcha.secret-key` | `string` | Google reCAPTCHA v2 checkbox secret key | yes          | [Sign-up](https://www.google.com/recaptcha/admin/create) for a reCAPTCHA v2 checkbox                        |

```json
{
  "web-applications": {
    "invite-generator": {
      "options": {
        "path": "/invite",
        "max-age": 120,
        "max-uses": 1
      },
      "recaptcha": {
        "site-key": "",
        "secret-key": ""
      }
    }
  }
}
```

#### 4.2. Map Webhooks
Convert external webhooks (JSON-based) and send them as Discord messages. Use Discord as a back-office and stick to one platform!

| __Key__                                                         | __Type__   | __Description__                                         | __Required__ | __Accepted Values__                                                                                                                                                                                                                                                                          |
|-----------------------------------------------------------------|------------|---------------------------------------------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `web-applications.map-webhooks`                                 | `object[]` |                                                         | no           |                                                                                                                                                                                                                                                                                              |
| `web-applications.map-webhooks[x].name`                         | `string`   | Name of the event                                       | no           |                                                                                                                                                                                                                                                                                              |
| `web-applications.map-webhooks[x].path`                         | `string`   | Path for sending webhooks to                            | yes          | Paths begin with `/`. For example, a URL of `https://www.example.com/webhooks/sample` would have a path of `/webhooks/sample`                                                                                                                                                                |
| `web-applications.map-webhooks[x].variables`                    | `object[]` |                                                         | yes          |                                                                                                                                                                                                                                                                                              |
| `web-applications.map-webhooks[x].variables[x].id`              | `string`   | Variable identifier                                     | yes          | Capital letters and underscores. Underscores are not allowed in the beginning or end of the identifier                                                                                                                                                                                       |
| `web-applications.map-webhooks[x].variables[x].type`            | `string`   | Variable type                                           | yes          | `string`, `boolean`, `ts-seconds`, `ts-millis`, `usd-dollars`, or `usd-cents`                                                                                                                                                                                                                |
| `web-applications.map-webhooks[x].variables[x].path`            | `string`   | Variable path                                           | yes          | Access the value from the `path` of the object. If the value is not supported, it will return a stringified value                                                                                                                                                                            |
| `web-applications.map-webhooks[x].payload`                      | `object`   | Message content to send for each webhook request        | yes          | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%YEAR%`. To access incoming variables, define them like `@SAMPLE@`. `SAMPLE` is the value of `web-applications.map-webhooks[x].variables[x].id` |
| `web-applications.map-webhooks[x].channel`                      | `object`   |                                                         | yes          |                                                                                                                                                                                                                                                                                              |
| `web-applications.map-webhooks[x].channel.description`          | `string`   | Description of the channel used to send message content | no           |                                                                                                                                                                                                                                                                                              |
| `web-applications.map-webhooks[x].channel.channel-id`           | `string`   | Channel used to send message content                    | yes          | Discord channel ID                                                                                                                                                                                                                                                                           |

```json
{
  "web-applications": {
    "map-webhooks": [
      {
        "name": "Sample",
        "path": "/webhooks/sample",
        "variables": [
          {
            "id": "SAMPLE_TEXT",
            "type": "string",
            "path": "path.to[0].sample-text"
          },
          {
            "id": "SAMPLE_TOGGLE",
            "type": "boolean",
            "path": "path.to[1].sample-toggle"
          },
          {
            "id": "SAMPLE_SECONDS",
            "type": "ts-seconds",
            "path": "path.to[2].sample-seconds"
          },
          {
            "id": "SAMPLE_MILLIS",
            "type": "ts-millis",
            "path": "path.to[3].sample-millis"
          },
          {
            "id": "SAMPLE_USD_DOLLARS",
            "type": "usd-dollars",
            "path": "path.to[4].sample-dollars"
          },
          {
            "id": "SAMPLE_USD_CENTS",
            "type": "usd-cents",
            "path": "path.to[5].sample-cents"
          }
        ],
        "payload": {
          "content": "@SAMPLE_TEXT@ - @SAMPLE_TOGGLE@ - @SAMPLE_SECONDS@ - @SAMPLE_MILLIS@ - @SAMPLE_USD_DOLLARS@ - @SAMPLE_USD_CENTS@",
          "footer": {
            "text": "Copyright © %YEAR% Your Company"
          }
        },
        "channel": {
          "description": "Sample channel",
          "channel-id": "000000000000000000"
        }
      }
    ]
  }
}
```

### 5. API Fetch
Retrieve updated information through a live feed and via a customizable keyword (like a command). Current APIs available are Etherscan, Finnhub, and Stocktwits.

| __Key__                                                               | __Type__   | __Description__                                           | __Required__ | __Accepted Values__                                                                                                                                  |
|-----------------------------------------------------------------------|------------|-----------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `api-fetch`                                                           | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle`                                      | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.settings`                             | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.settings.api-key`                     | `string`   | API key to access the Etherscan API                       | no           | [Sign up for an Etherscan API Key](https://etherscan.io/register)                                                                                    |
| `api-fetch.etherscan-gas-oracle.channel`                              | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.channel.description`                  | `string`   | Description of the channel used to send API updates       | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.channel.channel-id`                   | `string`   | Channel used to send API updates                          | yes          | Discord channel ID                                                                                                                                   |
| `api-fetch.etherscan-gas-oracle.command`                              | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.command.base-commands`                | `string[]` | Keywords to initiate command                              | yes          | If there are prefixes, it is recommended to keep them exact                                                                                          |
| `api-fetch.etherscan-gas-oracle.command.allowed-roles`                | `object[]` |                                                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.command.allowed-roles[x].description` | `string`   | Description of the allowed role                           | no           |                                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.command.allowed-roles[x].role-id`     | `string`   | Allowed role                                              | yes          | Discord role ID                                                                                                                                      |
| `api-fetch.etherscan-gas-oracle.command.no-perms-payload`             | `object`   | Message content to send if user does not have permissions | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%YEAR%` |
| `api-fetch.finnhub-earnings`                                          | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.settings`                                 | `object`   |                                                           | yes          |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.settings.api-key`                         | `string`   | API key to access the Finnhub API                         | yes          | [Sign up for a Finnhub API Key](https://finnhub.io/register)                                                                                         |
| `api-fetch.finnhub-earnings.channel`                                  | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.channel.description`                      | `string`   | Description of the channel used to send API updates       | no           |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.channel.channel-id`                       | `string`   | Channel used to send API updates                          | yes          | Discord channel ID                                                                                                                                   |
| `api-fetch.finnhub-earnings.command`                                  | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.command.base-commands`                    | `string[]` | Keywords to initiate command                              | yes          | If there are prefixes, it is recommended to keep them exact                                                                                          |
| `api-fetch.finnhub-earnings.command.allowed-roles`                    | `object[]` |                                                           | no           |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.command.allowed-roles[x].description`     | `string`   | Description of the allowed role                           | no           |                                                                                                                                                      |
| `api-fetch.finnhub-earnings.command.allowed-roles[x].role-id`         | `string`   | Allowed role                                              | yes          | Discord role ID                                                                                                                                      |
| `api-fetch.finnhub-earnings.command.no-perms-payload`                 | `object`   | Message content to send if user does not have permissions | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%YEAR%` |
| `api-fetch.stocktwits-trending`                                       | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.settings`                              | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.settings.limit`                        | `number`   | Symbols to retrieve for each retrieval                    | no           | From `1` to `30`                                                                                                                                     |
| `api-fetch.stocktwits-trending.channel`                               | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.channel.description`                   | `string`   | Description of the channel used to send API updates       | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.channel.channel-id`                    | `string`   | Channel used to send API updates                          | yes          | Discord channel ID                                                                                                                                   |
| `api-fetch.stocktwits-trending.command`                               | `object`   |                                                           | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.command.base-commands`                 | `string[]` | Keywords to initiate command                              | yes          | If there are prefixes, it is recommended to keep them exact                                                                                          |
| `api-fetch.stocktwits-trending.command.allowed-roles`                 | `object[]` |                                                           | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.command.allowed-roles[x].description`  | `string`   | Description of the allowed role                           | no           |                                                                                                                                                      |
| `api-fetch.stocktwits-trending.command.allowed-roles[x].role-id`      | `string`   | Allowed role                                              | yes          | Discord role ID                                                                                                                                      |
| `api-fetch.stocktwits-trending.command.no-perms-payload`              | `object`   | Message content to send if user does not have permissions | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%YEAR%` |

```json
{
  "api-fetch": {
    "etherscan-gas-oracle": {
      "settings": {
        "api-key": ""
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "command": {
        "base-commands": [
          "!gas"
        ],
        "allowed-roles": [
          {
            "description": "Sample role",
            "role-id": "000000000000000000"
          }
        ],
        "no-perms-payload": {
          "content": "You do not have sufficient permissions.",
          "footer": {
            "text": "Copyright © %YEAR% Your Company"
          }
        }
      }
    },
    "finnhub-earnings": {
      "settings": {
        "api-key": ""
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "command": {
        "base-commands": [
          "!earnings"
        ],
        "allowed-roles": [
          {
            "description": "Sample role",
            "role-id": "000000000000000000"
          }
        ],
        "no-perms-payload": {
          "content": "You do not have sufficient permissions.",
          "footer": {
            "text": "Copyright © %YEAR% Your Company"
          }
        }
      }
    },
    "stocktwits-trending": {
      "settings": {
        "limit": 30
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "command": {
        "base-commands": [
          "!trending"
        ],
        "allowed-roles": [
          {
            "description": "Sample role",
            "role-id": "000000000000000000"
          }
        ],
        "no-perms-payload": {
          "content": "You do not have sufficient permissions.",
          "footer": {
            "text": "Copyright © %YEAR% Your Company"
          }
        }
      }
    }
  }
}
```

### 6. Anti-Raid
A set of tools to ban members (based on their avatar or username), and helps automate the membership gate for those that just joined the server.

__NOTE:__ Anti-raid will not auto ban or assign roles during restarts. To increase uptime, you may create multiple configurable bot instances.

| __Key__                                          | __Type__   | __Description__                                              | __Required__ | __Accepted Values__                                                                                                                                                                          |
|--------------------------------------------------|------------|--------------------------------------------------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `anti-raid`                                      | `object`   |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.auto-ban`                             | `object`   |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.auto-ban.avatars`                     | `object[]` |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.auto-ban.avatars[x].description`      | `string`   | Description of the banned avatar                             | no           |                                                                                                                                                                                              |
| `anti-raid.auto-ban.avatars[x].avatar`           | `string`   | Banned avatar                                                | yes          | File name of avatar (without the file extension)                                                                                                                                             |
| `anti-raid.auto-ban.usernames`                   | `object[]` |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.auto-ban.usernames[x].description`    | `string`   | Description of the banned username                           | no           |                                                                                                                                                                                              |
| `anti-raid.auto-ban.usernames[x].username`       | `string`   | Banned username                                              | yes          | Username (do not include the discriminator)                                                                                                                                                  |
| `anti-raid.membership-gate`                      | `object`   |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.membership-gate.roles`                | `object`   |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.membership-gate.roles[x].description` | `string`   | Description of the role assigned to verified member          | no           |                                                                                                                                                                                              |
| `anti-raid.membership-gate.roles[x].role-id`     | `string`   | Role assigned to verified member                             | yes          | Discord role ID                                                                                                                                                                              |
| `anti-raid.membership-gate.payload`              | `object`   | Message content to send when user passes the membership gate | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%GUILD_NAME%`, `%MEMBER_MENTION%`, and `%YEAR%` |
| `anti-raid.membership-gate.channel`              | `object`   |                                                              | no           |                                                                                                                                                                                              |
| `anti-raid.membership-gate.channel.description`  | `string`   | Description of the channel used to send message content      | no           |                                                                                                                                                                                              |
| `anti-raid.membership-gate.channel.channel-id`   | `string`   | Channel used to send message content                         | yes          | Discord channel ID                                                                                                                                                                           |

```json
{
  "anti-raid": {
    "auto-ban": {
      "avatars": [
        {
          "description": "Sample avatar",
          "avatar": "00000000000000000000000000000000"
        }
      ],
      "usernames": [
        {
          "description": "Sample username",
          "username": "Bad User"
        }
      ]
    },
    "membership-gate": {
      "roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ],
      "payload": {
        "content": "Welcome to %GUILD_NAME%! Thank you for verifying, %MEMBER_MENTION%.",
        "footer": {
          "text": "Copyright © %YEAR% Your Company"
        }
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    }
  }
}
```

### 7. Schedule Posts
You can schedule messages to be sent out to a specific text-based channel. No more inconsistently timed messages! You are also able to skip specific dates from posting (like a holiday, for instance) and even send on a specific day.

| __Key__                                  | __Type__   | __Description__                                         | __Required__ | __Accepted Values__                                                                                                                                  |
|------------------------------------------|------------|---------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `schedule-posts`                         | `object[]` |                                                         | no           |                                                                                                                                                      |
| `schedule-posts[x].name`                 | `string`   | Name of the event                                       | no           |                                                                                                                                                      |
| `schedule-posts[x].payload`              | `object`   | Message content to send when time ticks                 | yes          | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%YEAR%` |
| `schedule-posts[x].reactions`            | `string[]` | Message reactions                                       | no           | Unicode emojis or a custom emoji identifier string (`<:sample:000000000000000000>` for static, `<a:sample:000000000000000000>` for animated)         |
| `schedule-posts[x].channel`              | `object`   |                                                         | no           |                                                                                                                                                      |
| `schedule-posts[x].channel.description`  | `string`   | Description of the channel used to send message content | no           |                                                                                                                                                      |
| `schedule-posts[x].channel.channel-id`   | `string`   | Channel used to send message content                    | yes          | Discord channel ID                                                                                                                                   |
| `schedule-posts[x].send-on`              | `object`   |                                                         | no           |                                                                                                                                                      |
| `schedule-posts[x].send-on.time-zone`    | `string`   | Send on time zone                                       | no           | Time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                  |
| `schedule-posts[x].send-on.days-of-week` | `number[]` | Send on day of week                                     | no           | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), and `6` (Saturday)                                         |
| `schedule-posts[x].send-on.months`       | `number[]` | Send on month                                           | no           | From `1` to `12`                                                                                                                                     |
| `schedule-posts[x].send-on.dates`        | `number[]` | Send on date                                            | no           | From `1` to `31`                                                                                                                                     |
| `schedule-posts[x].send-on.hours`        | `number[]` | Send on hour of day                                     | no           | From `0` to `23`                                                                                                                                     |
| `schedule-posts[x].send-on.minutes`      | `number[]` | Send on minute of hour                                  | no           | From `0` to `59`                                                                                                                                     |
| `schedule-posts[x].send-on.seconds`      | `number[]` | Send on second of minute                                | no           | From `0` to `59`                                                                                                                                     |
| `schedule-posts[x].skip-dates`           | `string[]` | Skip on specified dates                                 | no           | Date format is `YYYY-MM-DD`                                                                                                                          |

```json
{
  "schedule-posts": [
    {
      "name": "Sample",
      "payload": {
        "content": "This is a sample scheduled post",
        "footer": {
          "text": "Copyright © %YEAR% Your Company"
        }
      },
      "reactions": [
        "🟢",
        "🟡",
        "🔴"
      ],
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "send-on": {
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
        "months": [
          1
        ],
        "dates": [
          1
        ],
        "hours": [
          0
        ],
        "minutes": [
          0
        ],
        "seconds": [
          0
        ]
      },
      "skip-dates": [
        "2021-01-01",
        "2021-02-01"
      ]
    }
  ]
}
```

### 8. RSS Feeds
Sends out messages when an update from external RSS feeds are detected. Control how often you want the bot to fetch updates. You may also choose to have links resolved to their final destination and have parameters removed as well.

__NOTE:__ For Google News RSS Feeds, the source will be stripped from the title automatically.

| __Key__                              | __Type__   | __Description__                                         | __Required__ | __Accepted Values__                                                                                                                                                          |
|--------------------------------------|------------|---------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `rss-feeds`                          | `object[]` |                                                         | no           |                                                                                                                                                                              |
| `rss-feeds[x].name`                  | `string`   | Name of the event                                       | no           |                                                                                                                                                                              |
| `rss-feeds[x].url`                   | `string`   | Link to RSS feed                                        | yes          | Fully qualified URL                                                                                                                                                          |
| `rss-feeds[x].user-agent`            | `string`   | User agent to use when retrieving RSS feed              | no           | Most popular user agents found in [Tech Blog (wh)](https://techblog.willshouse.com/2012/01/03/most-common-user-agents/)                                                      |
| `rss-feeds[x].follow-redirects`      | `boolean`  | Follow redirects for each RSS update                    | no           | `true` or `false`                                                                                                                                                            |
| `rss-feeds[x].remove-parameters`     | `boolean`  | Remove all parameters for each RSS update               | no           | `true` or `false`                                                                                                                                                            |
| `rss-feeds[x].allowed-urls`          | `string[]` | Allow only URLs you specify to be sent                  | no           | Partial URL beginning with. For example, `https://www.example.com/news/example.html` is allowed if `https://www.example.com/news/` is specified                              |
| `rss-feeds[x].payload`               | `object`   | Message content to send for each RSS update             | yes          | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%ITEM_LINK%` and `%ITEM_TITLE%` |
| `rss-feeds[x].channel`               | `object`   |                                                         | yes          |                                                                                                                                                                              |
| `rss-feeds[x].channel.description`   | `string`   | Description of the channel used to send message content | no           |                                                                                                                                                                              |
| `rss-feeds[x].channel.channel-id`    | `string`   | Channel used to send message content                    | yes          | Discord channel ID                                                                                                                                                           |
| `rss-feeds[x].fetch-on`              | `object`   |                                                         | no           |                                                                                                                                                                              |
| `rss-feeds[x].fetch-on.time-zone`    | `string`   | Fetch on time zone                                      | no           | Time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                          |
| `rss-feeds[x].fetch-on.days-of-week` | `number[]` | Fetch on day of week                                    | no           | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), and `6` (Saturday)                                                                 |
| `rss-feeds[x].fetch-on.months`       | `number[]` | Fetch on month                                          | no           | From `1` to `12`                                                                                                                                                             |
| `rss-feeds[x].fetch-on.dates`        | `number[]` | Fetch on date                                           | no           | From `1` to `31`                                                                                                                                                             |
| `rss-feeds[x].fetch-on.hours`        | `number[]` | Fetch on hour of day                                    | no           | From `0` to `23`                                                                                                                                                             |
| `rss-feeds[x].fetch-on.minutes`      | `number[]` | Fetch on minute of hour                                 | no           | From `0` to `59`                                                                                                                                                             |
| `rss-feeds[x].fetch-on.seconds`      | `number[]` | Fetch on second of minute                               | no           | From `0` to `59`                                                                                                                                                             |

```json
{
  "rss-feeds": [
    {
      "name": "Sample",
      "url": "https://www.example.com/feed",
      "user-agent": "stonker-bot",
      "follow-redirects": true,
      "remove-parameters": true,
      "allowed-urls": [
        "https://www.example.com/news/"
      ],
      "payload": {
        "content": "Sample: %ITEM_TITLE% - %ITEM_LINK%"
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "fetch-on": {
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
        "months": [
          1
        ],
        "dates": [
          1
        ],
        "hours": [
          0
        ],
        "minutes": [
          0
        ],
        "seconds": [
          0
        ]
      }
    }
  ]
}
```

### 9. Regex Rules
Restrict a specific format and disallow specific text in a channel or the entire server. If the message matches or does not match the regular expression, the message will be deleted (unless member is a server owner, administrator, or listed under excluded roles).

_This feature can be extended with the [delete message](#2-snitch-notifications) notification._

__NOTE:__ Please prioritize channel restrictions before server-wide restrictions because only the first match will be considered.

| __Key__                                        | __Type__   | __Description__                                                | __Required__ | __Accepted Values__                                                                                                                                                 |
|------------------------------------------------|------------|----------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `regex-rules`                                  | `object[]` |                                                                | no           |                                                                                                                                                                     |
| `regex-rules[x].name`                          | `string`   | Name of the event                                              | no           |                                                                                                                                                                     |
| `regex-rules[x].channel`                       | `object`   |                                                                | no           |                                                                                                                                                                     |
| `regex-rules[x].channel.description`           | `string`   | Description of the channel used to apply regex restrictions on | no           |                                                                                                                                                                     |
| `regex-rules[x].channel.channel-id`            | `string`   | Channel used to apply regex restrictions on                    | yes          | Discord channel ID                                                                                                                                                  |
| `regex-rules[x].match`                         | `boolean`  | When text matches or does not match the regex                  | yes          | `true` or `false`                                                                                                                                                   |
| `regex-rules[x].regex`                         | `object`   |                                                                | yes          |                                                                                                                                                                     |
| `regex-rules[x].regex.description`             | `string`   | Description of the match regex                                 | no           |                                                                                                                                                                     |
| `regex-rules[x].regex.pattern`                 | `string`   | Regex pattern                                                  | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `regex-rules[x].regex.flags`                   | `string`   | Regex flags                                                    | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `regex-rules[x].excluded-roles`                | `object[]` |                                                                | no           |                                                                                                                                                                     |
| `regex-rules[x].excluded-roles[x].description` | `string`   | Description of the excluded role                               | no           |                                                                                                                                                                     |
| `regex-rules[x].excluded-roles[x].role-id`     | `string`   | Excluded role                                                  | yes          | Discord role ID                                                                                                                                                     |
| `regex-rules[x].direct-message-payload`        | `object`   | Message content to send when user does not follow regex rule   | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions)                                            |

```json
{
  "regex-rules": [
    {
      "name": "Sample",
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "match": false,
      "regex": {
        "description": "Sample regex",
        "pattern": "(.+)",
        "flags": "g"
      },
      "excluded-roles": [
        {
          "description": "Sample role",
          "role-id": "000000000000000000"
        }
      ],
      "direct-message-payload": {
        "content": "This type of text is not allowed in this channel!"
      }
    }
  ]
}
```

### 10. Detect Suspicious Words
Detect words in a message that may require attention. Useful when a member mentions a person of interest (without tagging them) or detection of vulgar language that often do not require warnings or deletion.

| __Key__                                          | __Type__   | __Description__                                            | __Required__ | __Accepted Values__                                                                                                          |
|--------------------------------------------------|------------|------------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------|
| `detect-suspicious-words`                        | `object`   |                                                            | no           |                                                                                                                              |
| `detect-suspicious-words.categories`             | `object[]` |                                                            | yes          |                                                                                                                              |
| `detect-suspicious-words.categories[x].category` | `string`   | Name of the category                                       | no           |                                                                                                                              |
| `detect-suspicious-words.categories[x].words`    | `string[]` | List of suspicious words                                   | yes          | Alphabetical variants only. Non-alphabetical conversion will be attempted. For example, "he110" will be converted to "hello" |
| `detect-suspicious-words.channel`                | `object`   |                                                            | yes          |                                                                                                                              |
| `detect-suspicious-words.channel.description`    | `string`   | Description of the channel used to report suspicious words | no           |                                                                                                                              |
| `detect-suspicious-words.channel.channel-id`     | `string`   | Channel used to report suspicious words                    | yes          | Discord channel ID                                                                                                           |

```json
{
  "detect-suspicious-words": {
    "categories": [
      {
        "category": "Sample",
        "words": [
          "suspicious",
          "really suspicious"
        ]
      }
    ],
    "channel": {
      "description": "Sample channel",
      "channel-id": "000000000000000000"
    }
  }
}
```

### 11. Sync Roles
Add or remove selected roles from members automatically if a user has or does not have "some" roles. Useful for many scenarios, for example, when members lose a premium role (e.g. _removing_ premium add-on roles) or when members get muted (e.g. _removing_ roles purposely designed to enable sending of messages, speaking in voice channels, or creating new reactions).

__NOTE:__ Please prioritize role removals before role additions due to how Discord processes role changes.

| __Key__                                               | __Type__   | __Description__                                  | __Required__ | __Accepted Values__                         |
|-------------------------------------------------------|------------|--------------------------------------------------|--------------|---------------------------------------------|
| `sync-roles`                                          | `object`   |                                                  | no           |                                             |
| `sync-roles.timeout`                                  | `number`   | Time to wait after the last role change          | yes          | Time in seconds (e.g. 1 minute equals `60`) |
| `sync-roles.events`                                   | `object[]` |                                                  | yes          |                                             |
| `sync-roles.events[x].name`                           | `string`   | Name of the event                                | no           |                                             |
| `sync-roles.events[x].some-roles`                     | `object[]` |                                                  | yes          |                                             |
| `sync-roles.events[x].some-roles[x].description`      | `string`   | Description of the role                          | no           |                                             |
| `sync-roles.events[x].some-roles[x].role-id`          | `string`   | Role                                             | yes          | Discord role ID                             |
| `sync-roles.events[x].has-some-roles`                 | `boolean`  | When user has or does not have some of the roles | yes          | `true` or `false`                           |
| `sync-roles.events[x].to-add-roles`                   | `object[]` |                                                  | no           |                                             |
| `sync-roles.events[x].to-add-roles[x].description`    | `string`   | Description of the role to add                   | no           |                                             |
| `sync-roles.events[x].to-add-roles[x].role-id`        | `string`   | Role to add                                      | yes          | Discord role ID                             |
| `sync-roles.events[x].to-remove-roles`                | `object[]` |                                                  | no           |                                             |
| `sync-roles.events[x].to-remove-roles[x].description` | `string`   | Description of the role to remove                | no           |                                             |
| `sync-roles.events[x].to-remove-roles[x].role-id`     | `string`   | Role to remove                                   | yes          | Discord role ID                             |

```json
{
  "sync-roles": {
    "timeout": 1,
    "events": [
      {
        "name": "Sample",
        "some-roles": [
          {
            "description": "A role",
            "role-id": "000000000000000000"
          }
        ],
        "has-some-roles": true,
        "to-remove-roles": [
          {
            "description": "B role",
            "role-id": "000000000000000000"
          }
        ]
      },
      {
        "name": "Sample",
        "some-roles": [
          {
            "description": "A role",
            "role-id": "000000000000000000"
          }
        ],
        "has-some-roles": false,
        "to-add-roles": [
          {
            "description": "B role",
            "role-id": "000000000000000000"
          }
        ]
      }
    ]
  }
}
```

### 12. Role Messages
Sends out messages when a role is added to or removed from a user. Perfect for social proof, welcoming new members, and internal analytics!

| __Key__                                | __Type__   | __Description__                                                  | __Required__ | __Accepted Values__                                                                                                                                                         |
|----------------------------------------|------------|------------------------------------------------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `role-messages`                        | `object[]` |                                                                  | no           |                                                                                                                                                                             |
| `role-messages[x].name`                | `string`   | Name of the event                                                | no           |                                                                                                                                                                             |
| `role-messages[x].role`                | `object`   |                                                                  | yes          |                                                                                                                                                                             |
| `role-messages[x].role.description`    | `string`   | Description of the role                                          | no           |                                                                                                                                                                             |
| `role-messages[x].role.role-id`        | `string`   | Role                                                             | yes          | Discord role ID                                                                                                                                                             |
| `role-messages[x].direction`           | `string`   | When user obtains a role or relinquishes a role                  | yes          | `add` or `remove`                                                                                                                                                           |
| `role-messages[x].payload`             | `object`   | Message content to send when user obtains or relinquishes a role | yes          | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%MEMBER_MENTION%` and `%YEAR%` |
| `role-messages[x].channel`             | `object`   |                                                                  | yes          |                                                                                                                                                                             |
| `role-messages[x].channel.description` | `string`   | Description of the channel used to send message content          | no           |                                                                                                                                                                             |
| `role-messages[x].channel.channel-id`  | `string`   | Channel used to send message content                             | yes          | Discord channel ID                                                                                                                                                          |

```json
{
  "role-messages": [
    {
      "name": "Sample",
      "role": {
        "description": "Sample role",
        "role-id": "000000000000000000"
      },
      "direction": "add",
      "payload": {
        "content": "%MEMBER_MENTION% has obtained a role.",
        "footer": {
          "text": "Copyright © %YEAR% Your Company"
        }
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    },
    {
      "name": "Sample",
      "role": {
        "description": "Sample role",
        "role-id": "000000000000000000"
      },
      "direction": "remove",
      "payload": {
        "content": "%MEMBER_MENTION% has relinquished a role.",
        "footer": {
          "text": "Copyright © %YEAR% Your Company"
        }
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    }
  ]
}
```

### 13. Auto Replies
Reply to a message without requiring human interaction. Great for automated customer service or to plant hidden Easter eggs!

__NOTE:__ Please prioritize channel-restricted replies before server-wide replies because only the first match will be considered.

| __Key__                                   | __Type__   | __Description__                                                                             | __Required__ | __Accepted Values__                                                                                                                                                 |
|-------------------------------------------|------------|---------------------------------------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-replies`                            | `object[]` |                                                                                             | no           |                                                                                                                                                                     |
| `auto-replies[x].name`                    | `string`   | Name of the event                                                                           | no           |                                                                                                                                                                     |
| `auto-replies[x].channels`                | `object[]` |                                                                                             | no           |                                                                                                                                                                     |
| `auto-replies[x].channels[x].description` | `string`   | Description of the channel used to detect reply-able messages                               | no           |                                                                                                                                                                     |
| `auto-replies[x].channels[x].channel-id`  | `string`   | Channel used to detect reply-able messages                                                  | yes          | Discord channel ID                                                                                                                                                  |
| `auto-replies[x].regex`                   | `object`   |                                                                                             | yes          |                                                                                                                                                                     |
| `auto-replies[x].regex.description`       | `string`   | Description of the reply-able regex                                                         | no           |                                                                                                                                                                     |
| `auto-replies[x].regex.pattern`           | `string`   | Regex pattern                                                                               | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `auto-replies[x].regex.flags`             | `string`   | Regex flags                                                                                 | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `auto-replies[x].payloads`                | `object[]` | Message content to send if reply-able messages are detected (one will be randomly selected) | yes          | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions)                                            |
| `auto-replies[x].reply`                   | `boolean`  | Reply to message author                                                                     | no           | `true` or `false`                                                                                                                                                   |

```json
{
  "auto-replies": [
    {
      "name": "Sample",
      "channels": [
        {
          "description": "Sample channel",
          "channel-id": "000000000000000000"
        }
      ],
      "regex": {
        "description": "Sample regex",
        "pattern": "(.+)",
        "flags": "gi"
      },
      "payloads": [
        {
          "content": "reply 1"
        },
        {
          "content": "reply 2"
        }
      ],
      "reply": true
    }
  ]
}
```

### 14. Message Copiers
Automatically copy the original message that matches the regular expression (in addition to the allowed/disallowed users or channels to copy from) into another channel, another Discord server channel, or a Twitter account. A powerful utility to route content in Discord.

__NOTE:__ Only 1 to 4 images (JPE, JPG, JPEG, PNG, WEBP) _or_ 1 animated image (GIF) is allowed per tweet. Images first, then GIFs. If both limits are not respected, no attachments will be uploaded to Twitter.

__NOTE:__ Message edits, deletions, and replies will not be passed onto their offsets.

| __Key__                                                  | __Type__   | __Description__                                                        | __Required__                               | __Accepted Values__                                                                                                                                                                                    |
|----------------------------------------------------------|------------|------------------------------------------------------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `message-copiers`                                        | `object[]` |                                                                        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].name`                                | `string`   | Name of the event                                                      | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].regex`                               | `object`   |                                                                        | yes                                        |                                                                                                                                                                                                        |
| `message-copiers[x].regex.description`                   | `string`   | Description of the message copier regex                                | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].regex.pattern`                       | `string`   | Regex pattern                                                          | yes                                        | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                                    |
| `message-copiers[x].regex.flags`                         | `string`   | Regex flags                                                            | no                                         | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                                  |
| `message-copiers[x].allowed-users`                       | `object[]` |                                                                        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].allowed-users[x].description`        | `string`   | Description of the allowed user (only copy messages sent by)           | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].allowed-users[x].user-id`            | `string`   | Allowed user (only copy messages sent by)                              | yes                                        | Discord user ID                                                                                                                                                                                        |
| `message-copiers[x].allowed-channels`                    | `object[]` |                                                                        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].allowed-channels[x].description`     | `string`   | Description of the allowed channel (only copy messages sent in)        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].allowed-channels[x].channel-id`      | `string`   | Allowed channel (only copy messages sent in)                           | yes                                        | Discord channel ID                                                                                                                                                                                     |
| `message-copiers[x].disallowed-users`                    | `object[]` |                                                                        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].disallowed-users[x].description`     | `string`   | Description of the disallowed user (only copy messages not sent by)    | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].disallowed-users[x].user-id`         | `string`   | Disallowed user (only copy messages not sent by)                       | yes                                        | Discord user ID                                                                                                                                                                                        |
| `message-copiers[x].disallowed-channels`                 | `object[]` |                                                                        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].disallowed-channels[x].description`  | `string`   | Description of the disallowed channel (only copy messages not sent in) | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].disallowed-channels[x].channel-id`   | `string`   | Disallowed channel (only copy messages not sent in)                    | yes                                        | Discord channel ID                                                                                                                                                                                     |
| `message-copiers[x].replacements`                        | `object[]` |                                                                        | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].replacements[x].description`         | `string`   | Description of the replacement regex                                   | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].replacements[x].pattern`             | `string`   | Regex pattern                                                          | yes                                        | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                                    |
| `message-copiers[x].replacements[x].flags`               | `string`   | Regex flags                                                            | no                                         | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                                  |
| `message-copiers[x].replacements[x].replace-with`        | `string`   | Replace with                                                           | yes                                        | Read [Using a regular expression to change data format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_a_regular_expression_to_change_data_format)      |
| `message-copiers[x].message`                             | `string`   | Message content to send when message copier runs                       | no                                         | 2000 characters maximum (280 characters maximum for Twitter). Variables include `%CHANNEL_MENTION%`, `%MEMBER_MENTION%`, `%MEMBER_TAG%`, `%MESSAGE_CONTENT%`, `%MESSAGE_EXCERPT%`, and `%MESSAGE_URL%` |
| `message-copiers[x].include-attachments`                 | `boolean`  | Include attachments                                                    | no                                         | `true` or `false`                                                                                                                                                                                      |
| `message-copiers[x].destinations`                        | `object`   |                                                                        | yes                                        |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].description`         | `string`   | Description of the destination method                                  | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].method`              | `string`   | Destination method                                                     | yes                                        | `discord-channel` `discord-webhook` or `twitter-account`                                                                                                                                               |
| `message-copiers[x].destinations[x].channel`             | `object`   |                                                                        | no (yes, if `method` is `discord-channel`) |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].channel.description` | `string`   | Description of the channel used to send message content                | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].channel.channel-id`  | `string`   | Channel used to send message content                                   | yes                                        | Discord channel ID                                                                                                                                                                                     |
| `message-copiers[x].destinations[x].webhook`             | `object`   |                                                                        | no (yes, if `method` is `discord-webhook`) |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].webhook.description` | `string`   | Description of the webhook                                             | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].webhook.username`    | `string`   | Webhook default username                                               | no                                         |                                                                                                                                                                                                        |
| `message-copiers[x].destinations[x].webhook.avatar-url`  | `string`   | Webhook default avatar URL                                             | no                                         | Fully qualified URL                                                                                                                                                                                    |
| `message-copiers[x].destinations[x].webhook.url`         | `string`   | Link to webhook                                                        | yes                                        | Discord webhook link                                                                                                                                                                                   |

```json
{
  "message-copiers": [
    {
      "name": "Sample",
      "regex": {
        "description": "Sample regex",
        "pattern": "(.+)",
        "flags": "g"
      },
      "allowed-users": [
        {
          "description": "Sample user",
          "user-id": "000000000000000000"
        }
      ],
      "allowed-channels": [
        {
          "description": "Sample channel",
          "channel-id": "000000000000000000"
        }
      ],
      "disallowed-users": [
        {
          "description": "Sample user",
          "user-id": "000000000000000000"
        }
      ],
      "disallowed-channels": [
        {
          "description": "Sample channel",
          "channel-id": "000000000000000000"
        }
      ],
      "replacements": [
        {
          "description": "Sample regex",
          "pattern": "(.+)",
          "flags": "g",
          "replace-with": "$1"
        }
      ],
      "message": "Channel Mention: %CHANNEL_MENTION%\nMember Mention: %MEMBER_MENTION%\nMember Tag: %MEMBER_TAG%\nMessage Content: %MESSAGE_CONTENT%\nMessage Excerpt: %MESSAGE_EXCERPT%\nMessage URL: %MESSAGE_URL%",
      "include-attachments": true,
      "destinations": [
        {
          "description": "Send to Discord channel",
          "method": "discord-channel",
          "channel": {
            "description": "Sample channel",
            "channel-id": "000000000000000000"
          }
        },
        {
          "description": "Send to Discord webhook",
          "method": "discord-webhook",
          "webhook": {
            "description": "Sample webhook",
            "username": "Author",
            "avatar-url": "https://example.com/example.jpg",
            "url": "https://discord.com/api/webhooks/000000000000000000/ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyzZ1234567890"
          }
        },
        {
          "description": "Send to Twitter account",
          "method": "twitter-account"
        }
      ]
    }
  ]
}
```

### 15. Message Proxies
Allows you to containerize third-party Discord bots away from the primary Discord server. Forward bot messages via webhooks. Designed for corporate environments and greatly enhances security measures.

__NOTE:__ Replacements will expose the entire payload using regular expression. Please use with caution.

__NOTE:__ Message edits and deletions will not be passed onto their offsets.

| __Key__                                           | __Type__   | __Description__                                              | __Required__ | __Accepted Values__                                                                                                                                                                                                           |
|---------------------------------------------------|------------|--------------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `message-proxies`                                 | `object[]` |                                                              | no           |                                                                                                                                                                                                                               |
| `message-proxies[x].name`                         | `string`   | Name of the event                                            | no           |                                                                                                                                                                                                                               |
| `message-proxies[x].channel`                      | `object`   |                                                              | yes          |                                                                                                                                                                                                                               |
| `message-proxies[x].channel.description`          | `string`   | Description of the channel used to detect bot messages       | no           |                                                                                                                                                                                                                               |
| `message-proxies[x].channel.channel-id`           | `string`   | Channel used to detect bot messages                          | yes          | Discord channel ID                                                                                                                                                                                                            |
| `message-proxies[x].replacements`                 | `object[]` |                                                              | no           |                                                                                                                                                                                                                               |
| `message-proxies[x].replacements[x].description`  | `string`   | Description of the replacement regex                         | no           |                                                                                                                                                                                                                               |
| `message-proxies[x].replacements[x].pattern`      | `string`   | Regex pattern                                                | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                                                           |
| `message-proxies[x].replacements[x].flags`        | `string`   | Regex flags                                                  | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                                                         |
| `message-proxies[x].replacements[x].replace-with` | `string`   | Replace with                                                 | yes          | Read [Using a regular expression to change data format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_a_regular_expression_to_change_data_format). Variables include `%YEAR%` |
| `message-proxies[x].print-payload`                | `boolean`  | Print the "payload_json" value before and after replacements | no           | `true` or `false`                                                                                                                                                                                                             |
| `message-proxies[x].webhook`                      | `object`   |                                                              | yes          |                                                                                                                                                                                                                               |
| `message-proxies[x].webhook.description`          | `string`   | Description of the webhook                                   | no           |                                                                                                                                                                                                                               |
| `message-proxies[x].webhook.webhook-url`          | `string`   | Link to webhook                                              | yes          | Discord webhook link                                                                                                                                                                                                          |

```json
{
  "message-proxies": [
    {
      "name": "Sample",
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "replacements": [
        {
          "description": "Sample regex",
          "pattern": "(.+)",
          "flags": "g",
          "replace-with": "$1"
        }
      ],
      "print-payload": true,
      "webhook": {
        "description": "Sample webhook",
        "webhook-url": "https://discord.com/api/webhooks/000000000000000000/ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyzZ1234567890"
      }
    }
  ]
}
```

### 16. Remove Affiliates
Easily remove content used to advertise for self gain, many of them unauthorized and undetected. This feature will automatically remove them, send a direct message to the user, and logs the message.

_This feature can be extended with the [delete message](#2-snitch-notifications) notification._

| __Key__                                            | __Type__   | __Description__                                           | __Required__ | __Accepted Values__                                                                                                                                                 |
|----------------------------------------------------|------------|-----------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `remove-affiliates`                                | `object`   |                                                           | no           |                                                                                                                                                                     |
| `remove-affiliates.platforms`                      | `object[]` |                                                           | yes          |                                                                                                                                                                     |
| `remove-affiliates.platforms[x].platform`          | `string`   | Name of the platform                                      | no           |                                                                                                                                                                     |
| `remove-affiliates.platforms[x].regex.description` | `string`   | Description of the platform regex                         | no           |                                                                                                                                                                     |
| `remove-affiliates.platforms[x].regex.pattern`     | `string`   | Regex pattern                                             | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `remove-affiliates.platforms[x].regex.flags`       | `string`   | Regex flags                                               | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `remove-affiliates.excluded-roles`                 | `object[]` |                                                           | no           |                                                                                                                                                                     |
| `remove-affiliates.excluded-roles[x].description`  | `string`   | Description of the excluded role                          | no           |                                                                                                                                                                     |
| `remove-affiliates.excluded-roles[x].role-id`      | `string`   | Excluded role                                             | yes          | Discord role ID                                                                                                                                                     |
| `remove-affiliates.channel`                        | `object`   |                                                           | no           |                                                                                                                                                                     |
| `remove-affiliates.channel.description`            | `string`   | Description of the channel used to report affiliate posts | no           |                                                                                                                                                                     |
| `remove-affiliates.channel.channel-id`             | `string`   | Channel used to report affiliate posts                    | yes          | Discord channel ID                                                                                                                                                  |
| `remove-affiliates.direct-message-payload`         | `object`   | Message content to send when user posts an affiliate      | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions)                                            |

```json
{
  "remove-affiliates": {
    "platforms": [
      {
        "platform": "Sample",
        "regex": {
          "description": "Sample regex",
          "pattern": "(.+)",
          "flags": "gi"
        }
      }
    ],
    "excluded-roles": [
      {
        "description": "Sample role",
        "role-id": "000000000000000000"
      }
    ],
    "channel": {
      "description": "Sample channel",
      "channel-id": "000000000000000000"
    },
    "direct-message-payload": {
      "content": "Please do not send affiliate content!"
    }
  }
}
```

### 17. Toggle Permissions
Configure channel and category permissions automatically through a scheduler or manually through a command! Great for showing and hiding channels during special events!

_This feature can be extended with [Schedule Posts](#7-schedule-posts)._

| __Key__                                                        | __Type__   | __Description__                                          | __Required__ | __Accepted Values__                                                                                                                                                                                                                                                           |
|----------------------------------------------------------------|------------|----------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `toggle-perms`                                                 | `object[]` |                                                          | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].name`                                         | `string`   | Name of the event                                        | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].command`                                      | `object`   |                                                          | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].command.base-commands`                        | `string[]` | Keywords to initiate command                             | yes          | If there are prefixes, it is recommended to keep them exact                                                                                                                                                                                                                   |
| `toggle-perms[x].command.allowed-roles`                        | `object[]` |                                                          | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].command.allowed-roles[x].description`         | `string`   | Description of the allowed role                          | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].command.allowed-roles[x].role-id`             | `string`   | Allowed role                                             | yes          | Discord role ID                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggle-on`                                    | `object`   |                                                          | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggle-on.time-zone`                          | `string`   | Toggle on time zone                                      | no           | Time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                                                                                                                           |
| `toggle-perms[x].toggle-on.days-of-week`                       | `number[]` | Toggle on day of week                                    | no           | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), and `6` (Saturday)                                                                                                                                                                  |
| `toggle-perms[x].toggle-on.months`                             | `number[]` | Toggle on month                                          | no           | From `1` to `12`                                                                                                                                                                                                                                                              |
| `toggle-perms[x].toggle-on.dates`                              | `number[]` | Toggle on date                                           | no           | From `1` to `31`                                                                                                                                                                                                                                                              |
| `toggle-perms[x].toggle-on.hours`                              | `number[]` | Toggle on hour of day                                    | no           | From `0` to `23`                                                                                                                                                                                                                                                              |
| `toggle-perms[x].toggle-on.minutes`                            | `number[]` | Toggle on minute of hour                                 | no           | From `0` to `59`                                                                                                                                                                                                                                                              |
| `toggle-perms[x].toggle-on.seconds`                            | `number[]` | Toggle on second of minute                               | no           | From `0` to `59`                                                                                                                                                                                                                                                              |
| `toggle-perms[x].skip-dates`                                   | `string[]` | Skip on specified dates                                  | no           | Date format is `YYYY-MM-DD`                                                                                                                                                                                                                                                   |
| `toggle-perms[x].toggles`                                      | `object[]` |                                                          | yes          |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggles[x].description`                       | `string`   | Description of the toggle                                | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggles[x].channel`                           | `object`   |                                                          | yes          |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggles[x].channel.description`               | `string`   | Description of the channel used to toggle permissions on | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggles[x].channel.channel-id`                | `string`   | Channel used to toggle permissions on                    | yes          | Discord channel ID                                                                                                                                                                                                                                                            |
| `toggle-perms[x].toggles[x].permissions`                       | `object[]` |                                                          | yes          |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggles[x].permissions[x].description`        | `string`   | Description of the user or role                          | no           |                                                                                                                                                                                                                                                                               |
| `toggle-perms[x].toggles[x].permissions[x].user-or-role-id`    | `string`   | User or role                                             | yes          | Discord user or role ID                                                                                                                                                                                                                                                       |
| `toggle-perms[x].toggles[x].permissions[x].user-or-role-perms` | `object`   | User or role permissions                                 | yes          | Review the [permission flags](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags). Permission flags should be set to pascal case (e.g. `SEND_MESSAGES` to `SendMessages`). Set flags to `true` (green), `null` (gray), `false` (red) |

```json
{
  "toggle-perms": [
    {
      "name": "Sample",
      "command": {
        "base-commands": [
          "!sample-on"
        ],
        "allowed-roles": [
          {
            "description": "Sample role",
            "role-id": "000000000000000000"
          }
        ]
      },
      "toggle-on": {
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
        "months": [
          1
        ],
        "dates": [
          1
        ],
        "hours": [
          0
        ],
        "minutes": [
          0
        ],
        "seconds": [
          0
        ]
      },
      "skip-dates": [
        "2021-01-01",
        "2021-02-01"
      ],
      "toggles": [
        {
          "description": "Allow view channel and send messages for Sample channel",
          "channel": {
            "description": "Sample channel",
            "channel-id": "000000000000000000"
          },
          "permissions": [
            {
              "description": "Sample role",
              "user-or-role-id": "000000000000000000",
              "user-or-role-perms": {
                "ViewChannel": true,
                "SendMessages": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 18. Bump Threads
Stretch the world of threads and make them like sub-channels! Create threads that _never_ archive, even if you don't have _boosted_ servers.

__NOTE:__ If threads are un-archived immediately after bot startup and one or more features send messages through threads, please restart the bot again to ensure proper operation.

| __Key__                               | __Type__   | __Description__                                   | __Required__ | __Accepted Values__ |
|---------------------------------------|------------|---------------------------------------------------|--------------|---------------------|
| `bump-threads`                        | `object[]` |                                                   | no           |                     |
| `bump-threads[x].name`                | `string`   | Name of the event                                 | no           |                     |
| `bump-threads[x].channel`             | `object`   |                                                   | yes          |                     |
| `bump-threads[x].channel.description` | `string`   | Description of the channel used to bump thread in | no           |                     |
| `bump-threads[x].channel.channel-id`  | `string`   | Channel used to bump thread in                    | yes          | Discord channel ID  |
| `bump-threads[x].thread`              | `object`   |                                                   | yes          |                     |
| `bump-threads[x].thread.description`  | `string`   | Description of the thread to bump                 | no           |                     |
| `bump-threads[x].thread.thread-id`    | `string`   | Thread to bump                                    | yes          | Discord thread ID   |

```json
{
  "bump-threads": [
    {
      "name": "Sample",
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      },
      "thread": {
        "description": "Sample thread",
        "thread-id": "000000000000000000"
      }
    }
  ]
}
```

### 19. Impersonator Alerts
Get notifications when your Discord identity or entity (e.g. your company's name) is being used without your knowledge (especially when scams and fraudulent activity is on the rise).

| __Key__                                             | __Type__   | __Description__                                                       | __Required__ | __Accepted Values__                                                                                                                                                 |
|-----------------------------------------------------|------------|-----------------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `impersonator-alerts`                               | `object`   |                                                                       | no           |                                                                                                                                                                     |
| `impersonator-alerts.entities`                      | `object[]` |                                                                       | yes          |                                                                                                                                                                     |
| `impersonator-alerts.entities[x].name`              | `string`   | Name of the entity                                                    | no           |                                                                                                                                                                     |
| `impersonator-alerts.entities[x].user`              | `object`   |                                                                       | no           |                                                                                                                                                                     |
| `impersonator-alerts.entities[x].user.description`  | `string`   | Description of the tracked user                                       | no           |                                                                                                                                                                     |
| `impersonator-alerts.entities[x].user.user-id`      | `string`   | Tracked user                                                          | yes          | Discord user ID                                                                                                                                                     |
| `impersonator-alerts.entities[x].regex`             | `object`   |                                                                       | yes          |                                                                                                                                                                     |
| `impersonator-alerts.entities[x].regex.description` | `string`   | Description of the nickname or username regex                         | no           |                                                                                                                                                                     |
| `impersonator-alerts.entities[x].regex.pattern`     | `string`   | Regex pattern                                                         | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `impersonator-alerts.entities[x].regex.flags`       | `string`   | Regex flags                                                           | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `impersonator-alerts.entities[x].payload`           | `object`   | Message content to send when there are matched nicknames or usernames | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%MEMBER_USER_MENTION%` |
| `impersonator-alerts.channel`                       | `object`   |                                                                       | yes          |                                                                                                                                                                     |
| `impersonator-alerts.channel.description`           | `string`   | Description of the channel used to send impersonator alerts           | no           |                                                                                                                                                                     |
| `impersonator-alerts.channel.channel-id`            | `string`   | Channel used to send impersonator alerts                              | yes          | Discord channel ID                                                                                                                                                  |

```json
{
  "impersonator-alerts": {
    "entities": [
      {
        "name": "Sample",
        "user": {
          "description": "Sample user",
          "user-id": "000000000000000000"
        },
        "regex": {
          "description": "Sample regex",
          "pattern": "(.+)",
          "flags": "g"
        },
        "payload": {
          "content": "An impersonator may have been detected. The offending user is %MEMBER_USER_MENTION%."
        }
      }
    ],
    "channel": {
      "description": "Sample channel",
      "channel-id": "000000000000000000"
    }
  }
}
```

### 20. Scammer Alerts
Get notifications when unwanted users (known primarily as scammers or spammers) enter your Discord server.

| __Key__                                        | __Type__   | __Description__                                                       | __Required__ | __Accepted Values__                                                                                                                                                 |
|------------------------------------------------|------------|-----------------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `scammer-alerts`                               | `object`   |                                                                       | no           |                                                                                                                                                                     |
| `scammer-alerts.entities`                      | `object[]` |                                                                       | yes          |                                                                                                                                                                     |
| `scammer-alerts.entities[x].name`              | `string`   | Name of the entity                                                    | no           |                                                                                                                                                                     |
| `scammer-alerts.entities[x].regex`             | `object`   |                                                                       | yes          |                                                                                                                                                                     |
| `scammer-alerts.entities[x].regex.description` | `string`   | Description of the nickname or username regex                         | no           |                                                                                                                                                                     |
| `scammer-alerts.entities[x].regex.pattern`     | `string`   | Regex pattern                                                         | yes          | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `scammer-alerts.entities[x].regex.flags`       | `string`   | Regex flags                                                           | no           | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `scammer-alerts.entities[x].payload`           | `object`   | Message content to send when there are matched nicknames or usernames | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%MEMBER_USER_MENTION%` |
| `scammer-alerts.channel`                       | `object`   |                                                                       | yes          |                                                                                                                                                                     |
| `scammer-alerts.channel.description`           | `string`   | Description of the channel used to send scammer alerts                | no           |                                                                                                                                                                     |
| `scammer-alerts.channel.channel-id`            | `string`   | Channel used to send scammer alerts                                   | yes          | Discord channel ID                                                                                                                                                  |

```json
{
  "scammer-alerts": {
    "entities": [
      {
        "name": "Sample",
        "regex": {
          "description": "Sample regex",
          "pattern": "(.+)",
          "flags": "g"
        },
        "payload": {
          "content": "A scammer may have been detected. The offending user is %MEMBER_USER_MENTION%."
        }
      }
    ],
    "channel": {
      "description": "Sample channel",
      "channel-id": "000000000000000000"
    }
  }
}
```

### 21. Twitter Feeds
Receive tweets from other users on Twitter and send them directly to your channel or threads. Optionally exclude retweets and replies as well.

__NOTE:__ To ensure feed availability even when the user protects their tweets, it is recommended that you follow the Twitter handle.

| __Key__                                | __Type__   | __Description__                                         | __Required__ | __Accepted Values__                                                                                                                                                           |
|----------------------------------------|------------|---------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `twitter-feeds`                        | `object[]` |                                                         | no           |                                                                                                                                                                               |
| `twitter-feeds[x].name`                | `string`   | Name of the event                                       | no           |                                                                                                                                                                               |
| `twitter-feeds[x].twitter-id`          | `string`   | User ID                                                 | yes          | Visit [Find Twitter ID](https://tools.codeofaninja.com/find-twitter-id)                                                                                                       |
| `twitter-feeds[x].exclude-retweets`    | `boolean`  | Exclude retweets                                        | no           | `true` or `false`                                                                                                                                                             |
| `twitter-feeds[x].exclude-replies`     | `boolean`  | Exclude replies                                         | no           | `true` or `false`                                                                                                                                                             |
| `twitter-feeds[x].payload`             | `object`   | Message content to send for each Twitter feed update    | no           | `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions). Variables include `%TWEET_TEXT%` and `%TWEET_LINK%` |
| `twitter-feeds[x].channel`             | `object`   |                                                         | yes          |                                                                                                                                                                               |
| `twitter-feeds[x].channel.description` | `string`   | Description of the channel used to send message content | no           |                                                                                                                                                                               |
| `twitter-feeds[x].channel.channel-id`  | `string`   | Channel used to send message content                    | yes          | Discord channel ID                                                                                                                                                            |

```json
{
  "twitter-feeds": [
    {
      "name": "Sample",
      "twitter-id": "000000",
      "exclude-retweets": false,
      "exclude-replies": false,
      "payload": {
        "content": "Sample: %TWEET_TEXT% - %TWEET_LINK%"
      },
      "channel": {
        "description": "Sample channel",
        "channel-id": "000000000000000000"
      }
    }
  ]
}
```

### 22. Broadcast Alerts
Automatically send Discord events to Twitter. Event broadcast alerts are determined by the status, the entity types, and the creator.

| __Key__                                   | __Type__   | __Description__                                   | __Required__ | __Accepted Values__                                                                                                                                                     |
|-------------------------------------------|------------|---------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `broadcast-alerts`                        | `object[]` |                                                   | no           |                                                                                                                                                                         |
| `broadcast-alerts[x].name`                | `string`   | Name of the event                                 | no           |                                                                                                                                                                         |
| `broadcast-alerts[x].status`              | `string`   | Event status                                      | yes          | `SCHEDULED`, `UPDATED`, `ACTIVE`, `COMPLETED`, or `CANCELED`                                                                                                            |
| `broadcast-alerts[x].entity-types`        | `string[]` | Event entity types                                | yes          | `STAGE_INSTANCE`, `VOICE`, and `EXTERNAL`                                                                                                                               |
| `broadcast-alerts[x].creator`             | `object`   |                                                   | yes          |                                                                                                                                                                         |
| `broadcast-alerts[x].creator.description` | `string`   | Description of the event creator                  | no           |                                                                                                                                                                         |
| `broadcast-alerts[x].creator.user-id`     | `string`   | Event creator                                     | yes          | Discord user ID                                                                                                                                                         |
| `broadcast-alerts[x].message`             | `string`   | Message content to send when broadcast alert runs | yes          | 280 characters maximum. Variables include `%CHANNEL_TAG%`, `%CREATOR_TAG%`, `%EVENT_DESCRIPTION%`, `%EVENT_NAME%`, `%LOCATION%`, `%SCHEDULED_TIME%`, and `%USER_COUNT%` |

```json
{
  "broadcast-alerts": [
    {
      "name": "Sample",
      "status": "SCHEDULED",
      "entity-types": [
        "STAGE_INSTANCE",
        "VOICE",
        "EXTERNAL"
      ],
      "creator": {
        "description": "Sample user",
        "user-id": "000000000000000000"
      },
      "message": "Event scheduled\nName: %EVENT_NAME%\nDescription: %EVENT_DESCRIPTION%\nCreator Tag: %CREATOR_TAG%\nTime: %SCHEDULED_TIME%\nChannel Tag: %CHANNEL_TAG%\nLocation: %LOCATION%\nUser Count: %USER_COUNT%"
    },
    {
      "name": "Sample",
      "status": "UPDATED",
      "entity-types": [
        "STAGE_INSTANCE",
        "VOICE",
        "EXTERNAL"
      ],
      "creator": {
        "description": "Sample user",
        "user-id": "000000000000000000"
      },
      "message": "Event updated\nName: %EVENT_NAME%\nDescription: %EVENT_DESCRIPTION%\nCreator Tag: %CREATOR_TAG%\nTime: %SCHEDULED_TIME%\nChannel Tag: %CHANNEL_TAG%\nLocation: %LOCATION%\nUser Count: %USER_COUNT%"
    },
    {
      "name": "Sample",
      "status": "ACTIVE",
      "entity-types": [
        "STAGE_INSTANCE",
        "VOICE",
        "EXTERNAL"
      ],
      "creator": {
        "description": "Sample user",
        "user-id": "000000000000000000"
      },
      "message": "Event active\nName: %EVENT_NAME%\nDescription: %EVENT_DESCRIPTION%\nCreator Tag: %CREATOR_TAG%\nTime: %SCHEDULED_TIME%\nChannel Tag: %CHANNEL_TAG%\nLocation: %LOCATION%\nUser Count: %USER_COUNT%"
    },
    {
      "name": "Sample",
      "status": "COMPLETED",
      "entity-types": [
        "STAGE_INSTANCE",
        "VOICE",
        "EXTERNAL"
      ],
      "creator": {
        "description": "Sample user",
        "user-id": "000000000000000000"
      },
      "message": "Event completed\nName: %EVENT_NAME%\nDescription: %EVENT_DESCRIPTION%\nCreator Tag: %CREATOR_TAG%\nTime: %SCHEDULED_TIME%\nChannel Tag: %CHANNEL_TAG%\nLocation: %LOCATION%\nUser Count: %USER_COUNT%"
    },
    {
      "name": "Sample",
      "status": "CANCELED",
      "entity-types": [
        "STAGE_INSTANCE",
        "VOICE",
        "EXTERNAL"
      ],
      "creator": {
        "description": "Sample user",
        "user-id": "000000000000000000"
      },
      "message": "Event canceled\nName: %EVENT_NAME%\nDescription: %EVENT_DESCRIPTION%\nCreator Tag: %CREATOR_TAG%\nTime: %SCHEDULED_TIME%\nChannel Tag: %CHANNEL_TAG%\nLocation: %LOCATION%\nUser Count: %USER_COUNT%"
    }
  ]
}
```
