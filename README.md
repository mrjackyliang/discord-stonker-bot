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
    - `https://discord.com/oauth2/authorize?client_id=CLIENT_ID_HERE&scope=bot&permissions=290712644`

## Bot Configuration
In the project folder, you will find a `config-sample.json` file. Each section enables a feature and must be configured correctly. All fields required unless marked as _optional_.

1. [Base Settings](#1-base-settings)
2. [Notifications](#2-notifications)
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
13. [Stocktwits Trending](#13-stocktwits-trending)
14. [Toggle Preset Permissions](#14-toggle-preset-permissions)

### 1. Base Settings
For Stonker Bot to start, these settings should be filled. The `bot-prefix` is limited to 3 characters because ease-of-use reasons.

| __Key__                   | __Type__ | __Description__                                        | __Accepted Values__                                                                                                                                                          |
|---------------------------|----------|--------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings`                | `object` |                                                        |                                                                                                                                                                              |
| `settings.client-token`   | `string` | Bot token used to login to the application             | Bot token found in [Discord Developer Portal](https://discord.com/developers/applications) after [creating and adding a Discord application](#configure-discord-application) |
| `settings.guild-id`       | `string` | The guild this bot will connect to                     | Discord guild ID                                                                                                                                                             |
| `settings.log-channel-id` | `string` | Channel used for logging messages                      | Discord channel ID (required for `snitch` and `all` modes)                                                                                                                   |
| `settings.log-level`      | `number` | Verbosity level configured for logging                 | `10` (error), `20` (warning), `30` (information), or `40` (debug)                                                                                                            |
| `settings.mode`           | `string` | Mode that the bot will work on                         | `feature`, `snitch`, or `all`                                                                                                                                                |
| `settings.bot-prefix`     | `string` | Prefixed character for executing a Stonker Bot command | Maximum 3 characters allowed (required for `feature` and `all` modes)                                                                                                        |
| `settings.time-zone`      | `string` | Preferred time zone                                    | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                     |

```json
{
    "settings": {
        "client-token": "",
        "guild-id": "",
        "log-channel-id": "000000000000000000",
        "log-level": 30,
        "mode": "all",
        "bot-prefix": "!",
        "time-zone": "Etc/UTC"
    }
}
```

### 2. Notifications
Get notifications from user actions surrounding your server. When a nickname change, username change, deleted message, or edited message is detected, a notification will be sent to the log channel specified in the [base settings](#1-base-settings).

_This feature will work under `snitch` and `all` modes only._

| __Key__                              | __Type__  | __Description__                             | __Accepted Values__ |
|--------------------------------------|-----------|---------------------------------------------|---------------------|
| `notifications`                      | `object`  |                                             |                     |
| `notifications.change-nickname`      | `boolean` | Notify when a member changes their nickname | `true` or `false`   |
| `notifications.change-username`      | `boolean` | Notify when a member changes their username | `true` or `false`   |
| `notifications.delete-bulk-messages` | `boolean` | Notify when bulk messages are deleted       | `true` or `false`   |
| `notifications.delete-message`       | `boolean` | Notify when a message is deleted            | `true` or `false`   |
| `notifications.includes-link`        | `boolean` | Notify when a message includes links        | `true` or `false`   |
| `notifications.update-message`       | `boolean` | Notify when a message is edited             | `true` or `false`   |
| `notifications.upload-attachment`    | `boolean` | Notify when an attachment is uploaded       | `true` or `false`   |

```json
{
    "notifications": {
        "change-nickname": true,
        "change-username": true,
        "delete-bulk-messages": true,
        "delete-message": true,
        "includes-link": true,
        "update-message": true,
        "upload-attachment": true
    }
}
```

### 3. Commands
Allow members with certain roles to use commands provided by the Stonker Bot. If this is not configured, only server owners and administrators are able to use these commands.

_This feature will work under `feature` and `all` modes only._

| __Key__                                        | __Type__   | __Description__                            | __Accepted Values__ |
|------------------------------------------------|------------|--------------------------------------------|---------------------|
| `commands`                                     | `object`   |                                            |                     |
| `commands.fetch-members`                       | `object[]` |                                            |                     |
| `commands.fetch-members[x].description`        | `string`   | Description of the allowed role (optional) |                     |
| `commands.fetch-members[x].id`                 | `string`   | Allowed role                               | Discord role ID     |
| `commands.find-duplicate-users`                | `object[]` |                                            |                     |
| `commands.find-duplicate-users[x].description` | `string`   | Description of the allowed role (optional) |                     |
| `commands.find-duplicate-users[x].id`          | `string`   | Allowed role                               | Discord role ID     |
| `commands.help`                                | `object[]` |                                            |                     |
| `commands.help[x].description`                 | `string`   | Description of the allowed role (optional) |                     |
| `commands.help[x].id`                          | `string`   | Allowed role                               | Discord role ID     |
| `commands.role`                                | `object[]` |                                            |                     |
| `commands.role[x].description`                 | `string`   | Description of the allowed role (optional) |                     |
| `commands.role[x].id`                          | `string`   | Allowed role                               | Discord role ID     |
| `commands.toggle-perms`                        | `object[]` |                                            |                     |
| `commands.toggle-perms[x].description`         | `string`   | Description of the allowed role (optional) |                     |
| `commands.toggle-perms[x].id`                  | `string`   | Allowed role                               | Discord role ID     |
| `commands.voice`                               | `object[]` |                                            |                     |
| `commands.voice[x].description`                | `string`   | Description of the allowed role (optional) |                     |
| `commands.voice[x].id`                         | `string`   | Allowed role                               | Discord role ID     |

```json
{
    "commands": {
        "fetch-members": [
            {
                "description": "Sample role",
                "id": "000000000000000000"
            }
        ],
        "find-duplicate-users": [
            {
                "description": "Sample role",
                "id": "000000000000000000"
            }
        ],
        "help": [
            {
                "description": "Sample role",
                "id": "000000000000000000"
            }
        ],
        "role": [
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
        "voice": [
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

_This feature will work under `feature` and `all` modes only._

| __Key__                                         | __Type__   | __Description__                                       | __Accepted Values__                                                                                         |
|-------------------------------------------------|------------|-------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `anti-raid`                                     | `object`   |                                                       |                                                                                                             |
| `anti-raid.auto-ban`                            | `object`   |                                                       |                                                                                                             |
| `anti-raid.auto-ban.avatar`                     | `string[]` | List of banned avatar hashes                          | File name of avatar (without file extension)                                                                |
| `anti-raid.auto-ban.username`                   | `string[]` | List of banned usernames                              | Username of user                                                                                            |
| `anti-raid.monitor`                             | `object`   |                                                       |                                                                                                             |
| `anti-raid.monitor.guild-join`                  | `object`   |                                                       |                                                                                                             |
| `anti-raid.monitor.guild-join.channel-id`       | `string`   | Channel to post in when a user joins a guild          | Discord channel ID                                                                                          |
| `anti-raid.monitor.guild-leave`                 | `object`   |                                                       |                                                                                                             |
| `anti-raid.monitor.guild-leave.channel-id`      | `string`   | Channel to post in when a user leaves a guild         | Discord channel ID                                                                                          |
| `anti-raid.verify`                              | `object`   |                                                       |                                                                                                             |
| `anti-raid.verify.channel-id`                   | `string`   | Channel to post the verification message              | Discord channel ID                                                                                          |
| `anti-raid.verify.verified-role-id`             | `string`   | Role to assign when a user completes verification     | Discord role ID                                                                                             |
| `anti-raid.verify.messages`                     | `object`   |                                                       |                                                                                                             |
| `anti-raid.verify.messages.welcome`             | `object`   |                                                       |                                                                                                             |
| `anti-raid.verify.messages.welcome.normal`      | `string`   | Message sent when normal user joins                   | Cannot be empty and cannot exceed 2000 characters. Variables include `%MEMBER_MENTION%` and `%MEMBER_CODE%` |
| `anti-raid.verify.messages.welcome.suspicious`  | `string`   | Message sent when suspicious user joins               | Cannot be empty and cannot exceed 2000 characters. Variables include `%MEMBER_MENTION%` and `%MEMBER_CODE%` |
| `anti-raid.verify.messages.valid`               | `object`   |                                                       |                                                                                                             |
| `anti-raid.verify.messages.valid.normal`        | `string`   | Message sent when normal user enters valid code       | Cannot be empty and cannot exceed 2000 characters. Variables include `%MEMBER_MENTION%` and `%MEMBER_CODE%` |
| `anti-raid.verify.messages.valid.suspicious`    | `string`   | Message sent when suspicious user enters valid code   | Cannot be empty and cannot exceed 2000 characters. Variables include `%MEMBER_MENTION%` and `%MEMBER_CODE%` |
| `anti-raid.verify.messages.invalid`             | `object`   |                                                       |                                                                                                             |
| `anti-raid.verify.messages.invalid.normal`      | `string`   | Message sent when normal user enters invalid code     | Cannot be empty and cannot exceed 2000 characters. Variables include `%MEMBER_MENTION%` and `%MEMBER_CODE%` |
| `anti-raid.verify.messages.invalid.suspicious`  | `string`   | Message sent when suspicious user enters invalid code | Cannot be empty and cannot exceed 2000 characters. Variables include `%MEMBER_MENTION%` and `%MEMBER_CODE%` |
| `anti-raid.verify.minimum-age`                  | `number`   | Minimum age required to show `normal` message         | Calculate the [time in seconds](https://www.calculateme.com/time/days/to-seconds/)                          |
| `anti-raid.verify.exclude-roles`                | `object[]` |                                                       |                                                                                                             |
| `anti-raid.verify.exclude-roles[x].description` | `string`   | Description of the excluded role (optional)           |                                                                                                             |
| `anti-raid.verify.exclude-roles[x].id`          | `string`   | Excluded role                                         | Discord role ID                                                                                             |

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
        "monitor": {
            "guild-join": {
                "channel-id": "000000000000000000"
            },
            "guild-leave": {
                "channel-id": "000000000000000000"
            }
        },
        "verify": {
            "channel-id": "000000000000000000",
            "verified-role-id": "000000000000000000",
            "messages": {
                "welcome": {
                    "normal": "Hey %MEMBER_MENTION%! Type `%MEMBER_CODE%` to verify.",
                    "suspicious": "Hey %MEMBER_MENTION%! Please contact the server owner to verify."
                },
                "valid": {
                    "normal": "%MEMBER_MENTION%, you have been verified.",
                    "suspicious": "%MEMBER_MENTION%, you have been manually verified."
                },
                "invalid": {
                    "normal": "Oops, %MEMBER_MENTION%! Invalid code. Type `%MEMBER_CODE%` to verify.",
                    "suspicious": "Oops, %MEMBER_MENTION%! Invalid code. Please contact the server owner to verify."
                }
            },
            "minimum-age": 86400,
            "exclude-roles": [
                {
                    "description": "Sample role",
                    "id": "000000000000000000"
                }
            ]
        }
    }
}
```

### 5. Scheduled Posts
You can schedule messages to be sent out to a specific text-based channel. No more inconsistently timed messages! You are also able to skip certain dates from posting (like a holiday, for instance).

_This feature will work under `feature` and `all` modes only._

| __Key__                                     | __Type__             | __Description__                             | __Accepted Values__                                                                                      |
|---------------------------------------------|----------------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `schedule-posts`                            | `object[]`           |                                             |                                                                                                          |
| `schedule-posts[x].name`                    | `string`             | Name of the scheduled post                  |                                                                                                          |
| `schedule-posts[x].channel-id`              | `string`             | Channel used to send scheduled post         | Discord channel ID                                                                                       |
| `schedule-posts[x].message`                 | `string` or `object` | Message content                             | Cannot be empty and cannot exceed 2000 characters                                                        |
| `schedule-posts[x].reactions`               | `string[]`           | Reactions for scheduled post (optional)     | Unicode emojis or a custom emoji identifier string (`<:name:id>` for static, `<a:name:id>` for animated) |
| `schedule-posts[x].send-every`              | `object`             |                                             |                                                                                                          |
| `schedule-posts[x].send-every.time-zone`    | `string`             | Send post on time zone                      | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |
| `schedule-posts[x].send-every.days-of-week` | `number[]`           | Send post during day of week                | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), `6` (Saturday) |
| `schedule-posts[x].send-every.hour`         | `number`             | Send post on hour of day                    | From `0` to `23`                                                                                         |
| `schedule-posts[x].send-every.minute`       | `number`             | Send post on minute of day                  | From `0` to `59`                                                                                         |
| `schedule-posts[x].send-every.second`       | `number`             | Send post on second of day                  | From `0` to `59`                                                                                         |
| `schedule-posts[x].skip-days`               | `string[]`           | Don't post during specified days (optional) | Date format is `YYYY-MM-DD`                                                                              |

```json
{
    "schedule-posts": [
        {
            "name": "Sample",
            "channel-id": "000000000000000000",
            "message": "This is a sample scheduled post",
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

_This feature will work under `feature` and `all` modes only._

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

_This feature can be extended with the [delete message](#2-notifications) notification and will work under `feature` and `all` modes only._

| __Key__                                       | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|-----------------------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `regex-rules`                                 | `object[]` |                                             |                                                                                                                                                                     |
| `regex-rules[x].name`                         | `string`   | Name of the regex restriction               |                                                                                                                                                                     |
| `regex-rules[x].channel-id`                   | `string`   | Channel under regex restriction             | Discord channel ID                                                                                                                                                  |
| `regex-rules[x].regex`                        | `object`   |                                             |                                                                                                                                                                     |
| `regex-rules[x].regex.pattern`                | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `regex-rules[x].regex.flags`                  | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `regex-rules[x].direct-message`               | `string`   | Direct message content (optional)           | Cannot be empty and cannot exceed 2000 characters                                                                                                                   |
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

_This feature will work under `snitch` and `all` modes only._

| __Key__                        | __Type__   | __Description__                          |
|--------------------------------|------------|------------------------------------------|
| `suspicious-words`             | `object[]` |                                          |
| `suspicious-words[x].category` | `string`   | Category that the word is detected under |
| `suspicious-words[x].words`    | `string[]` | List of suspicious words to detect       |

```json
{
    "suspicious-words": [
        {
            "category": "Sample",
            "words": [
                "suspicious",
                "really suspicious"
            ]
        }
    ]
}
```

### 9. Role Manager
Add or remove selected roles from members if it meets a condition (`yes-to-yes`, `no-to-no`, `yes-to-no`, or `no-to-yes`).

Useful for many scenarios like when members lose a Premium role or when they get muted, and you need to remove _write access_ roles.

_This feature will work under `feature` and `all` modes only._

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

_This feature will work under `feature` and `all` modes only._

| __Key__                        | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|--------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-reply`                   | `object[]` |                                             |                                                                                                                                                                     |
| `auto-reply[x].name`           | `string`   | Name of the auto-reply task                 |                                                                                                                                                                     |
| `auto-reply[x].channel-ids`    | `string[]` | Channels monitored for the reply (optional) | Discord channel IDs                                                                                                                                                 |
| `auto-reply[x].tag-author`     | `boolean`  | Tag the author when replying                | `true` or `false`                                                                                                                                                   |
| `auto-reply[x].regex`          | `object`   |                                             |                                                                                                                                                                     |
| `auto-reply[x].regex.pattern`  | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `auto-reply[x].regex.flags`    | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `auto-reply[x].messages`       | `string[]` | Message contents                            | Cannot be empty and cannot exceed 2000 characters (lesser characters if tagging author)                                                                             |

```json
{
    "auto-reply": [
        {
            "name": "Sample",
            "channel-ids": [
                "000000000000000000"
            ],
            "tag-author": true,
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

_This feature will work under `feature` and `all` modes only._

| __Key__                                          | __Type__   | __Description__                                   | __Accepted Values__                                                                                                                                                                               |
|--------------------------------------------------|------------|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `message-copier`                                 | `object[]` |                                                   |                                                                                                                                                                                                   |
| `message-copier[x].name`                         | `string`   | Name of the message copier task                   |                                                                                                                                                                                                   |
| `message-copier[x].channel-id`                   | `string`   | The channel that the message should be posted to  | Discord channel ID                                                                                                                                                                                |
| `message-copier[x].regex`                        | `object`   |                                                   |                                                                                                                                                                                                   |
| `message-copier[x].regex.pattern`                | `string`   | Regex pattern for matching message content        | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                               |
| `message-copier[x].regex.flags`                  | `string`   | Regex flags                                       | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                             |
| `message-copier[x].remove-mentions`              | `boolean`  | Remove all mentions from the original message     | `true` or `false`                                                                                                                                                                                 |
| `message-copier[x].replacements`                 | `object[]` |                                                   |                                                                                                                                                                                                   |
| `message-copier[x].replacements[x].pattern`      | `string`   | Regex pattern for replacing message content       | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern)                               |
| `message-copier[x].replacements[x].flags`        | `string`   | Regex flags                                       | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)                                             |
| `message-copier[x].replacements[x].replace-with` | `string`   | Replace matched content with                      | Read [Using a regular expression to change data format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_a_regular_expression_to_change_data_format) |
| `message-copier[x].format`                       | `string`   | Format the copied message                         | Messages exceeding 2000 characters will fail to send. Variables include `%AUTHOR_MENTION%`, `%AUTHOR_TAG%`, `%MESSAGE_CONTENT%`, and `%MESSAGE_URL%`.                                             |
| `message-copier[x].allowed-users`                | `string[]` | Only copy messages sent by these users (optional) | Discord user IDs                                                                                                                                                                                  |

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
            "allowed-users": [
                "000000000000000000"
            ]
        }
    ]
}
```

### 12. Remove Affiliate Links
Easily remove affiliate links posted in channels, many of them unauthorized and undetected. This feature automatically removes affiliate links and logs the message.

_This feature can be extended with the [delete message](#2-notifications) notification and will work under `feature` and `all` modes only._

| __Key__                                         | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|-------------------------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `affiliate-links`                               | `object`   |                                             |                                                                                                                                                                     |
| `affiliate-links.links`                         | `object[]` |                                             |                                                                                                                                                                     |
| `affiliate-links.links[x].website`              | `string`   | Name of the website                         |                                                                                                                                                                     |
| `affiliate-links.links[x].regex.pattern`        | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `affiliate-links.links[x].regex.flags`          | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `affiliate-links.channel-id`                    | `string`   | Channel used to report affiliate links      | Discord channel ID                                                                                                                                                  |
| `affiliate-links.direct-message`                | `string`   | Direct message warning (optional)           | Cannot be empty and cannot exceed 2000 characters                                                                                                                   |
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

### 13. Stocktwits Trending
Get the latest trending tickers pulled in from Stocktwits automatically. Schedule multiple retrievals throughout the day and set your own message.

_This feature will work under `feature` and `all` modes only._

| __Key__                                 | __Type__   | __Description__                             | __Accepted Values__                                                                                      |
|-----------------------------------------|------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `stocktwits`                            | `object[]` |                                             |                                                                                                          |
| `stocktwits[x].name`                    | `string`   | Name of the Stocktwits post                 |                                                                                                          |
| `stocktwits[x].channel-id`              | `string`   | Channel used to send Stocktwits post        | Discord channel ID                                                                                       |
| `stocktwits[x].message`                 | `string`   | Message content                             | Cannot be empty and cannot exceed 2000 characters                                                        |
| `stocktwits[x].limit`                   | `number`   | The amount of tickers in a post             | Cannot exceed 25 tickers                                                                                 |
| `stocktwits[x].send-every`              | `object`   |                                             |                                                                                                          |
| `stocktwits[x].send-every.time-zone`    | `string`   | Send post on time zone                      | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |
| `stocktwits[x].send-every.days-of-week` | `number[]` | Send post during day of week                | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), `6` (Saturday) |
| `stocktwits[x].send-every.hour`         | `number`   | Send post on hour of day                    | From `0` to `23`                                                                                         |
| `stocktwits[x].send-every.minute`       | `number`   | Send post on minute of day                  | From `0` to `59`                                                                                         |
| `stocktwits[x].send-every.second`       | `number`   | Send post on second of day                  | From `0` to `59`                                                                                         |
| `stocktwits[x].skip-days`               | `string[]` | Don't post during specified days (optional) | Date format is `YYYY-MM-DD`                                                                              |

```json
{
    "stocktwits": [
        {
            "name": "Sample",
            "channel-id": "000000000000000000",
            "message": "This is a sample Stocktwits post",
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

_This feature will work under `feature` and `all` modes only._

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
