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
In the project folder, you will find a `config-sample.json` file. Each section enables a feature and must be configured correctly. All fields required unless marked as _optional_.

1. [Base Settings](#1-base-settings)
2. [Snitch Notifications](#2-snitch-notifications)
3. [Commands](#3-commands)
4. [Anti-Raid](#4-anti-raid)
5. [Scheduled Posts](#5-scheduled-posts)
6. [RSS Feeds](#6-rss-feeds)
7. [Regex Channels](#7-regex-channels)
8. [Detect Suspicious Words](#8-detect-suspicious-words)
9. [Role Manager](#9-role-manager)
10. [Auto Reply](#10-auto-reply)
11. [Message Copier](#11-message-copier)
12. [Remove Affiliate Links](#12-remove-affiliate-links)
13. [Stocktwits](#13-stocktwits)
14. [Toggle Preset Permissions](#14-toggle-preset-permissions)
15. [Bump Threads](#15-bump-threads)
16. [Invite Generator](#16-invite-generator)

### 1. Base Settings
For Stonker Bot to start, these settings should be filled. The `bot-prefix` is limited to 3 characters because ease-of-use reasons.

| __Key__                      | __Type__ | __Description__                                        | __Accepted Values__                                                                                                                                                          |
|------------------------------|----------|--------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings`                   | `object` |                                                        |                                                                                                                                                                              |
| `settings.client-token`      | `string` | Bot token used to login to the application             | Bot token found in [Discord Developer Portal](https://discord.com/developers/applications) after [creating and adding a Discord application](#configure-discord-application) |
| `settings.guild-id`          | `string` | The guild this bot will connect to                     | Discord guild ID                                                                                                                                                             |
| `settings.bot-prefix`        | `string` | Prefixed character for executing a Stonker Bot command | Maximum 3 characters allowed (required for commands)                                                                                                                         |
| `settings.server-http-port`  | `number` | Web server HTTP port for external requests             | From `0` to `65535`                                                                                                                                                          |
| `settings.server-https-port` | `number` | Web server HTTPS port for external requests            | From `0` to `65535`                                                                                                                                                          |
| `settings.server-https-key`  | `string` | Private key for HTTPS server                           | Required for enabling the HTTPS port                                                                                                                                         |
| `settings.server-https-cert` | `string` | Certificate for HTTPS server                           | Required for enabling the HTTPS port                                                                                                                                         |
| `settings.server-https-ca`   | `string` | Certificate authority for HTTPS server                 | Required for enabling the HTTPS port                                                                                                                                         |
| `settings.time-zone`         | `string` | Preferred time zone                                    | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                     |
| `settings.log-level`         | `number` | Verbosity level configured for logging                 | `10` (error), `20` (warning), `30` (information), or `40` (debug)                                                                                                            |

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
Get notifications from user actions surrounding your server. When a nickname change, username change, deleted message, or edited message is detected, a notification will be sent to the log channel specified in the [base settings](#1-base-settings).

| __Key__                               | __Type__ | __Description__                             | __Accepted Values__ |
|---------------------------------------|----------|---------------------------------------------|---------------------|
| `snitch`                              | `object` |                                             |                     |
| `snitch.change-nickname`              | `object` | Notify when a member changes their nickname |                     |
| `snitch.change-nickname.channel-id`   | `string` |                                             | Discord channel ID  |
| `snitch.change-username`              | `object` | Notify when a member changes their username |                     |
| `snitch.change-username.channel-id`   | `string` |                                             | Discord channel ID  |
| `snitch.delete-message`               | `object` | Notify when a message is deleted            |                     |
| `snitch.delete-message.channel-id`    | `string` |                                             | Discord channel ID  |
| `snitch.includes-link`                | `object` | Notify when a message includes links        |                     |
| `snitch.includes-link.channel-id`     | `string` |                                             | Discord channel ID  |
| `snitch.update-message`               | `object` | Notify when a message is edited             |                     |
| `snitch.update-message.channel-id`    | `string` |                                             | Discord channel ID  |
| `snitch.upload-attachment`            | `object` | Notify when an attachment is uploaded       |                     |
| `snitch.upload-attachment.channel-id` | `string` |                                             | Discord channel ID  |

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

| __Key__                                    | __Type__   | __Description__                            | __Accepted Values__ |
|--------------------------------------------|------------|--------------------------------------------|---------------------|
| `commands`                                 | `object`   |                                            |                     |
| `commands.bulk-ban`                        | `object[]` |                                            |                     |
| `commands.bulk-ban[x].description`         | `string`   | Description of the allowed role (optional) |                     |
| `commands.bulk-ban[x].id`                  | `string`   | Allowed role                               | Discord role ID     |
| `commands.fetch-duplicates`                | `object[]` |                                            |                     |
| `commands.fetch-duplicates[x].description` | `string`   | Description of the allowed role (optional) |                     |
| `commands.fetch-duplicates[x].id`          | `string`   | Allowed role                               | Discord role ID     |
| `commands.fetch-members`                   | `object[]` |                                            |                     |
| `commands.fetch-members[x].description`    | `string`   | Description of the allowed role (optional) |                     |
| `commands.fetch-members[x].id`             | `string`   | Allowed role                               | Discord role ID     |
| `commands.help-menu`                       | `object[]` |                                            |                     |
| `commands.help-menu[x].description`        | `string`   | Description of the allowed role (optional) |                     |
| `commands.help-menu[x].id`                 | `string`   | Allowed role                               | Discord role ID     |
| `commands.role-manager`                    | `object[]` |                                            |                     |
| `commands.role-manager[x].description`     | `string`   | Description of the allowed role (optional) |                     |
| `commands.role-manager[x].id`              | `string`   | Allowed role                               | Discord role ID     |
| `commands.toggle-perms`                    | `object[]` |                                            |                     |
| `commands.toggle-perms[x].description`     | `string`   | Description of the allowed role (optional) |                     |
| `commands.toggle-perms[x].id`              | `string`   | Allowed role                               | Discord role ID     |
| `commands.voice-tools`                     | `object[]` |                                            |                     |
| `commands.voice-tools[x].description`      | `string`   | Description of the allowed role (optional) |                     |
| `commands.voice-tools[x].id`               | `string`   | Allowed role                               | Discord role ID     |

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

### 4. Anti-Raid
A set of tools to ban members (based on their avatar hash or username), and helps implement a verification gate for those that just joined the server.

| __Key__                                    | __Type__   | __Description__                                              | __Accepted Values__                                                                    |
|--------------------------------------------|------------|--------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `anti-raid`                                | `object`   |                                                              |                                                                                        |
| `anti-raid.auto-ban`                       | `object`   |                                                              |                                                                                        |
| `anti-raid.auto-ban.avatar`                | `string[]` | List of banned avatar hashes                                 | File name of avatar (without file extension)                                           |
| `anti-raid.auto-ban.username`              | `string[]` | List of banned usernames                                     | Username of user                                                                       |
| `anti-raid.membership-gate`                | `object`   |                                                              |                                                                                        |
| `anti-raid.membership-gate.role-id`        | `string`   | Role to assign when a user passes the gate                   | Discord role ID                                                                        |
| `anti-raid.membership-gate.channel-id`     | `string`   | Where to send message when a user passes the gate (optional) | Discord channel ID                                                                     |
| `anti-raid.membership-gate.message`        | `string`   | Message to send when a user passes the gate (optional)       | Cannot exceed 2000 characters. Variables include `%GUILD_NAME%` and `%MEMBER_MENTION%` |
| `anti-raid.monitor`                        | `object`   |                                                              |                                                                                        |
| `anti-raid.monitor.guild-join`             | `object`   |                                                              |                                                                                        |
| `anti-raid.monitor.guild-join.channel-id`  | `string`   | Channel to post in when a user joins a guild                 | Discord channel ID                                                                     |
| `anti-raid.monitor.guild-leave`            | `object`   |                                                              |                                                                                        |
| `anti-raid.monitor.guild-leave.channel-id` | `string`   | Channel to post in when a user leaves a guild                | Discord channel ID                                                                     |

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

### 5. Scheduled Posts
You can schedule messages to be sent out to a specific text-based channel. No more inconsistently timed messages! You are also able to skip certain dates from posting (like a holiday, for instance).

| __Key__                                     | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                       |
|---------------------------------------------|------------|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `schedule-posts`                            | `object[]` |                                             |                                                                                                                                                           |
| `schedule-posts[x].name`                    | `string`   | Name of the scheduled post                  |                                                                                                                                                           |
| `schedule-posts[x].channel-id`              | `string`   | Channel used to send scheduled post         | Discord channel ID                                                                                                                                        |
| `schedule-posts[x].message`                 | `object`   | Message content                             | Cannot be empty. Must follow the `BaseMessageOptions` in [discord.js Documentation](https://discord.js.org/#/docs/main/stable/typedef/BaseMessageOptions) |
| `schedule-posts[x].reactions`               | `string[]` | Reactions for scheduled post (optional)     | Unicode emojis or a custom emoji identifier string (`<:name:id>` for static, `<a:name:id>` for animated)                                                  |
| `schedule-posts[x].send-every`              | `object`   |                                             |                                                                                                                                                           |
| `schedule-posts[x].send-every.time-zone`    | `string`   | Send post on time zone (optional)           | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                  |
| `schedule-posts[x].send-every.days-of-week` | `number[]` | Send post during day of week (optional)     | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), `6` (Saturday)                                                  |
| `schedule-posts[x].send-every.year`         | `number`   | Send post on year (optional)                |                                                                                                                                                           |
| `schedule-posts[x].send-every.month`        | `number`   | Send post on month (optional)               | From `0` to `11`                                                                                                                                          |
| `schedule-posts[x].send-every.date`         | `number`   | Send post on date (optional)                | From `1` to `31`                                                                                                                                          |
| `schedule-posts[x].send-every.hour`         | `number`   | Send post on hour of day (optional)         | From `0` to `23`                                                                                                                                          |
| `schedule-posts[x].send-every.minute`       | `number`   | Send post on minute of day (optional)       | From `0` to `59`                                                                                                                                          |
| `schedule-posts[x].send-every.second`       | `number`   | Send post on second of day (optional)       | From `0` to `59`                                                                                                                                          |
| `schedule-posts[x].skip-days`               | `string[]` | Don't post during specified days (optional) | Date format is `YYYY-MM-DD`                                                                                                                               |

```json
{
    "schedule-posts": [
        {
            "name": "Sample",
            "channel-id": "000000000000000000",
            "message": {
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
                "year": 2020,
                "month": 0,
                "date": 1,
                "hour": 0,
                "minute": 0,
                "second": 0
            },
            "skip-days": [
                "2021-01-01",
                "2021-02-01"
            ]
        }
    ]
}
```

### 6. RSS Feeds
Get updates from external RSS feeds. Customize the message when a new RSS update is detected (add notifications, custom text) and set cron time intervals!

| __Key__                   | __Type__   | __Description__                        | __Accepted Values__                                                                                   |
|---------------------------|------------|----------------------------------------|-------------------------------------------------------------------------------------------------------|
| `rss-feeds`               | `object[]` |                                        |                                                                                                       |
| `rss-feeds[x].name`       | `string`   | Name of the RSS feed task              |                                                                                                       |
| `rss-feeds[x].channel-id` | `string`   | Channel to send RSS feed updates       | Discord channel ID                                                                                    |
| `rss-feeds[x].interval`   | `string`   | Cron-based interval timing             | Generate an expression from the [Cron Expression Generator](http://crontab.cronhub.io/)               |
| `rss-feeds[x].url`        | `string`   | Link of the RSS feed                   |                                                                                                       |
| `rss-feeds[x].message`    | `string`   | Customized message for RSS feed update | Cannot be empty and cannot exceed 2000 characters. Variables include `%ITEM_TITLE%` and `%ITEM_LINK%` |

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

### 7. Regex Channels
Restrict a specific format in a particular channel. If the message doesn't match the regular expression, the message will be deleted (unless member is a server owner, administrator, or listed under excluded roles).

_This feature can be extended with the [delete message](#2-snitch-notifications) notification._

| __Key__                                       | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|-----------------------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `regex-rules`                                 | `object[]` |                                             |                                                                                                                                                                     |
| `regex-rules[x].name`                         | `string`   | Name of the regex restriction               |                                                                                                                                                                     |
| `regex-rules[x].channel-id`                   | `string`   | Channel under regex restriction             | Discord channel ID                                                                                                                                                  |
| `regex-rules[x].regex`                        | `object`   |                                             |                                                                                                                                                                     |
| `regex-rules[x].regex.pattern`                | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `regex-rules[x].regex.flags`                  | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `regex-rules[x].direct-message`               | `string`   | Direct message content (optional)           | Cannot exceed 2000 characters                                                                                                                                       |
| `regex-rules[x].exclude-roles`                | `object[]` |                                             |                                                                                                                                                                     |
| `regex-rules[x].exclude-roles[x].description` | `string`   | Description of the excluded role (optional) |                                                                                                                                                                     |
| `regex-rules[x].exclude-roles[x].id`          | `string`   | Excluded role                               | Discord role ID                                                                                                                                                     |

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

### 8. Detect Suspicious Words
Detect words in a message that may require attention. Useful when a member mentions a person of interest (without tagging them) or detection of vulgar language that often does not require warnings or deletion.

| __Key__                                   | __Type__   | __Description__                          | __Accepted Values__ |
|-------------------------------------------|------------|------------------------------------------|---------------------|
| `suspicious-words`                        | `object`   |                                          |                     |
| `suspicious-words.channel-id`             | `string`   | Channel used to report suspicious words  | Discord channel ID  |
| `suspicious-words.categories`             | `object[]` |                                          |                     |
| `suspicious-words.categories[x].category` | `string`   | Category that the word is detected under |                     |
| `suspicious-words.categories[x].words`    | `string[]` | List of suspicious words to detect       |                     |

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

### 9. Role Manager
Add or remove selected roles from members if it meets a condition (`yes-to-yes`, `no-to-no`, `yes-to-no`, or `no-to-yes`).

Useful for many scenarios like when members lose a Premium role or when they get muted, and you need to remove _write access_ roles.

| __Key__                             | __Type__   | __Description__                               | __Accepted Values__                                   |
|-------------------------------------|------------|-----------------------------------------------|-------------------------------------------------------|
| `roles`                             | `object[]` |                                               |                                                       |
| `roles[x].name`                     | `string`   | Name of the role task                         |                                                       |
| `roles[x].type`                     | `string`   | Condition to remove roles                     | `yes-to-yes`, `no-to-no`, `yes-to-no`, or `no-to-yes` |
| `roles[x].before`                   | `object[]` |                                               |                                                       |
| `roles[x].before[x].description`    | `string`   | Description of the roles before (optional)    |                                                       |
| `roles[x].before[x].id`             | `string`   | Role before                                   | Discord role ID                                       |
| `roles[x].after`                    | `object[]` |                                               |                                                       |
| `roles[x].after[x].description`     | `string`   | Description of the roles after (optional)     |                                                       |
| `roles[x].after[x].id`              | `string`   | Role after                                    | Discord role ID                                       |
| `roles[x].to-add`                   | `object[]` |                                               |                                                       |
| `roles[x].to-add[x].description`    | `string`   | Description of the roles to add (optional)    |                                                       |
| `roles[x].to-add[x].id`             | `string`   | Role to add                                   | Discord role ID                                       |
| `roles[x].to-remove`                | `object[]` |                                               |                                                       |
| `roles[x].to-remove[x].description` | `string`   | Description of the roles to remove (optional) |                                                       |
| `roles[x].to-remove[x].id`          | `string`   | Role to remove                                | Discord role ID                                       |

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

### 10. Auto Reply
Reply to a message without requiring human interaction. Great for automated customer service or surprise members with hidden Easter eggs!

| __Key__                       | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|-------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-reply`                  | `object[]` |                                             |                                                                                                                                                                     |
| `auto-reply[x].name`          | `string`   | Name of the auto-reply task                 |                                                                                                                                                                     |
| `auto-reply[x].channel-ids`   | `string[]` | Channels monitored for the reply (optional) | Discord channel IDs                                                                                                                                                 |
| `auto-reply[x].reply`         | `boolean`  | Reply to the author                         | `true` or `false`                                                                                                                                                   |
| `auto-reply[x].regex`         | `object`   |                                             |                                                                                                                                                                     |
| `auto-reply[x].regex.pattern` | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `auto-reply[x].regex.flags`   | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `auto-reply[x].messages`      | `string[]` | Message contents                            | Cannot be empty and cannot exceed 2000 characters (lesser characters if tagging author)                                                                             |

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

### 11. Message Copier
Automatically copy the original message that matches the regular expression into another channel.

| __Key__                                          | __Type__   | __Description__                                        | __Accepted Values__                                                                                                                                                                               |
|--------------------------------------------------|------------|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `message-copier`                                 | `object[]` |                                                        |                                                                                                                                                                                                   |
| `message-copier[x].name`                         | `string`   | Name of the message copier task                        |                                                                                                                                                                                                   |
| `message-copier[x].channel-id`                   | `string`   | The channel that the message should be posted to       | Discord channel ID                                                                                                                                                                                |
| `message-copier[x].regex`                        | `object`   |                                                        |                                                                                                                                                                                                   |
| `message-copier[x].regex.pattern`                | `string`   | Regex pattern for matching message content             | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                               |
| `message-copier[x].regex.flags`                  | `string`   | Regex flags                                            | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                             |
| `message-copier[x].remove-mentions`              | `boolean`  | Remove all mentions from the original message          | `true` or `false`                                                                                                                                                                                 |
| `message-copier[x].replacements`                 | `object[]` |                                                        |                                                                                                                                                                                                   |
| `message-copier[x].replacements[x].pattern`      | `string`   | Regex pattern for replacing message content            | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                               |
| `message-copier[x].replacements[x].flags`        | `string`   | Regex flags                                            | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                             |
| `message-copier[x].replacements[x].replace-with` | `string`   | Replace matched content with                           | Read [Using a regular expression to change data format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_a_regular_expression_to_change_data_format) |
| `message-copier[x].format`                       | `string`   | Format the copied message                              | Cannot exceed 2000 characters. Variables include `%AUTHOR_MENTION%`, `%AUTHOR_TAG%`, `%MESSAGE_CONTENT%`, and `%MESSAGE_URL%`.                                                                    |
| `message-copier[x].include-attachments`          | `boolean`  | Include attachments when copying message               | `true` or `false`                                                                                                                                                                                 |
| `message-copier[x].allowed-users`                | `string[]` | Only copy messages sent by these users (optional)      | Discord user IDs                                                                                                                                                                                  |
| `message-copier[x].allowed-channels`             | `string[]` | Only copy messages sent in these channels (optional)   | Discord channel IDs                                                                                                                                                                               |
| `message-copier[x].disallowed-users`             | `string[]` | Do not copy messages sent by these users (optional)    | Discord user IDs                                                                                                                                                                                  |
| `message-copier[x].disallowed-channels`          | `string[]` | Do not copy messages sent in these channels (optional) | Discord channel IDs                                                                                                                                                                               |

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
            "format": "Author Mention: %AUTHOR_MENTION%\nAuthor Tag: %AUTHOR_TAG%\nMessage Content: %MESSAGE_CONTENT%\nMessage URL: %MESSAGE_URL%",
            "include-attachments": true,
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

### 12. Remove Affiliate Links
Easily remove affiliate links posted in channels, many of them unauthorized and undetected. This feature automatically removes affiliate links and logs the message.

_This feature can be extended with the [delete message](#2-snitch-notifications) notification._

| __Key__                                         | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|-------------------------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `affiliate-links`                               | `object`   |                                             |                                                                                                                                                                     |
| `affiliate-links.links`                         | `object[]` |                                             |                                                                                                                                                                     |
| `affiliate-links.links[x].website`              | `string`   | Name of the website                         |                                                                                                                                                                     |
| `affiliate-links.links[x].regex.pattern`        | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `affiliate-links.links[x].regex.flags`          | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `affiliate-links.channel-id`                    | `string`   | Channel used to report affiliate links      | Discord channel ID                                                                                                                                                  |
| `affiliate-links.direct-message`                | `string`   | Direct message warning (optional)           | Cannot exceed 2000 characters                                                                                                                                       |
| `affiliate-links.excluded-roles`                | `object[]` |                                             |                                                                                                                                                                     |
| `affiliate-links.excluded-roles[x].description` | `string`   | Description of the excluded role (optional) |                                                                                                                                                                     |
| `affiliate-links.excluded-roles[x].id`          | `string`   | Excluded role                               | Discord role ID                                                                                                                                                     |

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

### 13. Stocktwits
Get the latest trending tickers pulled in from Stocktwits automatically. Schedule multiple retrievals throughout the day and set your own message.

| __Key__                                 | __Type__   | __Description__                             | __Accepted Values__                                                                                               |
|-----------------------------------------|------------|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `stocktwits`                            | `object[]` |                                             |                                                                                                                   |
| `stocktwits[x].name`                    | `string`   | Name of the Stocktwits post                 |                                                                                                                   |
| `stocktwits[x].channel-id`              | `string`   | Channel used to send Stocktwits post        | Discord channel ID                                                                                                |
| `stocktwits[x].message`                 | `string`   | Message content                             | Cannot be empty if `show-embed` is set to false and cannot exceed 2000 characters. Variables include `%TICKERS%`. |
| `stocktwits[x].show-embed`              | `boolean`  | Show tickers in addition to a message       | `true` or `false`                                                                                                 |
| `stocktwits[x].limit`                   | `number`   | The amount of tickers in a post             | Cannot exceed 25 tickers                                                                                          |
| `stocktwits[x].send-every`              | `object`   |                                             |                                                                                                                   |
| `stocktwits[x].send-every.time-zone`    | `string`   | Send post on time zone (optional)           | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)          |
| `stocktwits[x].send-every.days-of-week` | `number[]` | Send post during day of week (optional)     | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), `6` (Saturday)          |
| `stocktwits[x].send-every.year`         | `number`   | Send post on year (optional)                |                                                                                                                   |
| `stocktwits[x].send-every.month`        | `number`   | Send post on month (optional)               | From `0` to `11`                                                                                                  |
| `stocktwits[x].send-every.date`         | `number`   | Send post on date (optional)                | From `1` to `31`                                                                                                  |
| `stocktwits[x].send-every.hour`         | `number`   | Send post on hour of day (optional)         | From `0` to `23`                                                                                                  |
| `stocktwits[x].send-every.minute`       | `number`   | Send post on minute of day (optional)       | From `0` to `59`                                                                                                  |
| `stocktwits[x].send-every.second`       | `number`   | Send post on second of day (optional)       | From `0` to `59`                                                                                                  |
| `stocktwits[x].skip-days`               | `string[]` | Don't post during specified days (optional) | Date format is `YYYY-MM-DD`                                                                                       |

```json
{
    "stocktwits": [
        {
            "name": "Sample",
            "channel-id": "000000000000000000",
            "message": "This is a sample Stocktwits post - %TICKERS%",
            "show-embed": true,
            "limit": 24,
            "send-every": {
                "time-zone": "Etc/UTC",
                "days-of-week": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "year": 2020,
                "month": 0,
                "date": 1,
                "hour": 0,
                "minute": 0,
                "second": 0
            },
            "skip-days": [
                "2021-01-01",
                "2021-02-01"
            ]
        }
    ]
}
```

### 14. Toggle Preset Permissions
Configure channel permissions with a single command without touching them! Great for quickly enabling and disabling features during special events.

| __Key__                                                      | __Type__   | __Description__                            | __Accepted Values__                                                                                                                                                    |
|--------------------------------------------------------------|------------|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `toggle-perms`                                               | `object[]` |                                            |                                                                                                                                                                        |
| `toggle-perms[x].name`                                       | `string`   | Toggle group name                          |                                                                                                                                                                        |
| `toggle-perms[x].id`                                         | `string`   | Toggle group identifier                    |                                                                                                                                                                        |
| `toggle-perms[x].on`                                         | `object[]` |                                            |                                                                                                                                                                        |
| `toggle-perms[x].on[x].description`                          | `string`   | Toggle on channel description (optional)   |                                                                                                                                                                        |
| `toggle-perms[x].on[x].channel-id`                           | `string`   | Toggle on channel ID                       | Discord channel ID                                                                                                                                                     |
| `toggle-perms[x].on[x].channel-perms`                        | `object[]` | Toggle on channel permissions              |                                                                                                                                                                        |
| `toggle-perms[x].on[x].channel-perms[x].description`         | `string`   | Description of user or role (optional)     |                                                                                                                                                                        |
| `toggle-perms[x].on[x].channel-perms[x].user-or-role-id`     | `string`   | User or role                               | Discord user or role ID                                                                                                                                                |
| `toggle-perms[x].on[x].channel-perms[x].user-or-role-perms`  | `object`   | User or role permissions                   | Review the [permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). Set flags to `true` (green), `null` (gray), `false` (red) |
| `toggle-perms[x].off`                                        | `object[]` |                                            |                                                                                                                                                                        |
| `toggle-perms[x].off[x].description`                         | `string`   | Toggle off channel description (optional)  |                                                                                                                                                                        |
| `toggle-perms[x].off[x].channel-id`                          | `string`   | Toggle off channel ID                      | Discord channel ID                                                                                                                                                     |
| `toggle-perms[x].off[x].channel-perms`                       | `object[]` | Toggle off channel permissions             |                                                                                                                                                                        |
| `toggle-perms[x].off[x].channel-perms[x].description`        | `string`   | Description of user or role (optional)     |                                                                                                                                                                        |
| `toggle-perms[x].off[x].channel-perms[x].user-or-role-id`    | `string`   | User or role                               | Discord user or role ID                                                                                                                                                |
| `toggle-perms[x].off[x].channel-perms[x].user-or-role-perms` | `object`   | User or role permissions                   | Review the [permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS). Set flags to `true` (green), `null` (gray), `false` (red) |

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
Stretch the world of threads and make them like sub-channels! Create threads that never expire, even if you don't have boosted servers.

| __Key__                      | __Type__   | __Description__            | __Accepted Values__ |
|------------------------------|------------|----------------------------|---------------------|
| `bump-threads`               | `object[]` |                            |                     |
| `bump-threads[x].name`       | `string`   | Bump thread channel name   |                     |
| `bump-threads[x].channel-id` | `string`   | Bump thread parent channel | Discord channel ID  |
| `bump-threads[x].thread-id`  | `string`   | Bump thread channel        | Discord thread ID   |

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

| __Key__                                       | __Type__ | __Description__                              | __Accepted Values__                                                                                                           |
|-----------------------------------------------|----------|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `invite-generator`                            | `object` |                                              |                                                                                                                               |
| `invite-generator.design`                     | `object` |                                              |                                                                                                                               |
| `invite-generator.design.logo-url`            | `string` | Link to an image used for the front page     | Square image with size dimensions of `300 x 300` or larger                                                                    |
| `invite-generator.design.favicon-url`         | `object` | Link to an image used for the favicon        | `.png` extensions only                                                                                                        |
| `invite-generator.design.background-color`    | `object` | Color for background                         | Read [CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)                                          |
| `invite-generator.design.link-color`          | `object` | Color for links                              | Read [CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)                                          |
| `invite-generator.design.text-color`          | `object` | Color for text                               | Read [CSS Legal Color Values](https://www.w3schools.com/cssref/css_colors_legal.asp)                                          |
| `invite-generator.inject-code`                | `object` |                                              |                                                                                                                               |
| `invite-generator.inject-code.header`         | `object` | Unescaped code between the `head` tags       | Double-quote escaped HTML code                                                                                                |
| `invite-generator.inject-code.submit-success` | `object` | Unescaped code when user passes verification | Double-quote escaped HTML code. Available variables are `success` (Discord invite url)                                        |
| `invite-generator.inject-code.submit-fail`    | `object` | Unescaped code when user fails verification  | Double-quote escaped HTML code. Available variables are `fail` (The [jqXHR Object](https://api.jquery.com/jquery.ajax#jqXHR)) |
| `invite-generator.recaptcha`                  | `object` |                                              |                                                                                                                               |
| `invite-generator.recaptcha.site-key`         | `object` | Google reCAPTCHA v2 Checkbox Site Key        | [Sign-up](https://www.google.com/recaptcha/admin/create) for a reCAPTCHA v2 checkbox                                          |
| `invite-generator.recaptcha.secret-key`       | `object` | Google reCAPTCHA v2 Checkbox Secret Key      | [Sign-up](https://www.google.com/recaptcha/admin/create) for a reCAPTCHA v2 checkbox                                          |

```json
{
    "invite-generator": {
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
