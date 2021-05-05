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
4. When the application is created, click the __Bot__ menu item
5. Click __Add Bot__ and then click __Yes, do it!__
6. Under __Privileged Gateway Intents__, turn on these options:
    - __PRESENCE INTENT__
    - __SERVER MEMBERS INTENT__
7. Click the __General Information__ menu item
8. Under __Client ID__, click __Copy__
9. Replace the `CLIENT_ID_HERE` below and visit link to add bot into server:
    - `https://discord.com/oauth2/authorize?client_id=CLIENT_ID_HERE&scope=bot&permissions=290712646`

## Bot Configuration
In the project folder, you will find a `config-sample.json` file. Each section enables a feature and must be configured correctly. All fields are required unless marked as _optional_.

1. [Base Settings](#1-base-settings)
2. [Notifications](#2-notifications)
3. [Commands](#3-commands)
4. [Anti-Raid](#4-anti-raid)
5. [Scheduled Posts](#5-scheduled-posts)
6. [Regex Channels](#6-regex-channels)
7. [Detect Suspicious Words](#7-detect-suspicious-words)
8. [Remove Member Roles](#8-remove-member-roles)
9. [Auto Reply](#9-auto-reply)
10. [Remove Affiliate Links](#10-remove-affiliate-links)
11. [Toggle Preset Permissions](#11-toggle-preset-permissions)

### 1. Base Settings
This section is required for Stonker Bot to start. A text-based channel ID for `log-channel-id` is required. The `bot-prefix` is limited to 3 characters because ease-of-use reasons.

| __Key__                   | __Type__ | __Description__                                        | __Accepted Values__                                                                                                                                                          |
|---------------------------|----------|--------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings`                | `object` |                                                        |                                                                                                                                                                              |
| `settings.client-token`   | `string` | Bot token used to login to the application             | Bot token found in [Discord Developer Portal](https://discord.com/developers/applications) after [creating and adding a Discord application](#configure-discord-application) |
| `settings.guild-id`       | `string` | The guild this bot will connect to                     | Discord guild ID                                                                                                                                                             |
| `settings.log-channel-id` | `string` | Channel used for logging messages                      | Discord channel ID                                                                                                                                                           |
| `settings.log-level`      | `number` | Verbosity level configured for logging                 | `10` (error), `20` (warning), `30` (information), or `40` (debug)                                                                                                            |
| `settings.bot-prefix`     | `string` | Prefixed character for executing a Stonker Bot command | Maximum 3 characters allowed                                                                                                                                                 |

```json
{
    "settings": {
        "client-token": "",
        "guild-id": "",
        "log-channel-id": "000000000000000000",
        "log-level": 30,
        "bot-prefix": "!"
    }
}
```

### 2. Notifications
Get notifications from user actions surrounding your server. When a nickname change, username change, deleted message, or edited message is detected, a notification will be sent to the log channel specified in the [base settings](#1-base-settings).

| __Key__                           | __Type__  | __Description__                             | __Accepted Values__ |
|-----------------------------------|-----------|---------------------------------------------|---------------------|
| `notifications`                   | `object`  |                                             |                     |
| `notifications.change-nickname`   | `boolean` | Notify when a member changes their nickname | `true` or `false`   |
| `notifications.change-username`   | `boolean` | Notify when a member changes their username | `true` or `false`   |
| `notifications.delete-message`    | `boolean` | Notify when a message is deleted            | `true` or `false`   |
| `notifications.update-message`    | `boolean` | Notify when a message is edited             | `true` or `false`   |
| `notifications.upload-attachment` | `boolean` | Notify when an attachment is uploaded       | `true` or `false`   |

```json
{
    "notifications": {
        "change-nickname": true,
        "change-username": true,
        "delete-message": true,
        "update-message": true,
        "upload-attachment": true
    }
}
```

### 3. Commands
Allow members with certain roles to use commands provided by the Stonker Bot. If this is not configured, only server owners and administrators are able to use these commands.

| __Key__                                        | __Type__   | __Description__                            | __Accepted Values__ |
|------------------------------------------------|------------|--------------------------------------------|---------------------|
| `commands`                                     | `object`   |                                            |                     |
| `commands.add-role`                            | `object[]` |                                            |                     |
| `commands.add-role[x].description`             | `string`   | Description of the allowed role (optional) |                     |
| `commands.add-role[x].id`                      | `string`   | Allowed role                               | Discord role ID     |
| `commands.fetch-members`                       | `object[]` |                                            |                     |
| `commands.fetch-members[x].description`        | `string`   | Description of the allowed role (optional) |                     |
| `commands.fetch-members[x].id`                 | `string`   | Allowed role                               | Discord role ID     |
| `commands.find-duplicate-users`                | `object[]` |                                            |                     |
| `commands.find-duplicate-users[x].description` | `string`   | Description of the allowed role (optional) |                     |
| `commands.find-duplicate-users[x].id`          | `string`   | Allowed role                               | Discord role ID     |
| `commands.help`                                | `object[]` |                                            |                     |
| `commands.help[x].description`                 | `string`   | Description of the allowed role (optional) |                     |
| `commands.help[x].id`                          | `string`   | Allowed role                               | Discord role ID     |
| `commands.toggle-perms`                        | `object[]` |                                            |                     |
| `commands.toggle-perms[x].description`         | `string`   | Description of the allowed role (optional) |                     |
| `commands.toggle-perms[x].id`                  | `string`   | Allowed role                               | Discord role ID     |
| `commands.voice`                               | `object[]` |                                            |                     |
| `commands.voice[x].description`                | `string`   | Description of the allowed role (optional) |                     |
| `commands.voice[x].id`                         | `string`   | Allowed role                               | Discord role ID     |
| `commands.whitelist`                           | `object[]` |                                            |                     |
| `commands.whitelist[x].description`            | `string`   | Description of the allowed role (optional) |                     |
| `commands.whitelist[x].id`                     | `string`   | Allowed role                               | Discord role ID     |

```json
{
    "commands": {
        "add-role": [
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
        ],
        "whitelist": [
            {
                "description": "Sample role",
                "id": "000000000000000000"
            }
        ]
    }
}
```

### 4. Anti-Raid
A set of tools to ban or kick members that could potentially be marked as a bot. You can automatically ban, kick, and scan the server for potential bots.

- Automatically ban a user based on their avatar hash or username
- Automatically kick a user (and send a direct message) if they don't meet the minimum age criteria
- Automatically scan and send a message if potential raid bots have entered your server

| __Key__                                     | __Type__   | __Description__                                     | __Accepted Values__                                                                          |
|---------------------------------------------|------------|-----------------------------------------------------|----------------------------------------------------------------------------------------------|
| `anti-raid`                                 | `object`   |                                                     |                                                                                              |
| `anti-raid.auto-ban`                        | `object`   |                                                     |                                                                                              |
| `anti-raid.auto-ban.avatar`                 | `string[]` | List of banned avatar hashes                        | File name of avatar (without file extension)                                                 |
| `anti-raid.auto-ban.username`               | `string[]` | List of banned usernames                            | Username of user                                                                             |
| `anti-raid.auto-kick`                       | `object`   |                                                     |                                                                                              |
| `anti-raid.auto-kick.minimum-age`           | `number`   | Minimum age a user must have before joining server  | Calculate the [time in milliseconds](https://www.calculateme.com/time/days/to-milliseconds/) |
| `anti-raid.auto-kick.force-avatar`          | `boolean`  | If a user must have an avatar before joining server | `true` or `false`                                                                            |
| `anti-raid.auto-kick.direct-message`        | `string`   | Direct message content (optional)                   | Cannot be empty and cannot exceed 2000 characters                                            |
| `anti-raid.scanner`                         | `object`   |                                                     |                                                                                              |
| `anti-raid.scanner.channel-id`              | `string`   | Channel to post in when duplicate users are found   | Discord channel ID                                                                           |
| `anti-raid.scanner.message`                 | `string`   | Message content                                     | Cannot be empty and cannot exceed 2000 characters                                            |
| `anti-raid.scanner.message-interval`        | `number`   | Alert interval when duplicate users are found       | Calculate the [time in seconds](https://www.calculateme.com/time/minutes/to-seconds/)        |
| `anti-raid.scanner.whitelisted-avatars`     | `string[]` | List of whitelisted avatar hashes                   | File name of avatar (without file extension)                                                 |

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
        "auto-kick": {
            "minimum-age": 0,
            "force-avatar": true,
            "direct-message": "Failed to join server. Please contact server owner for assistance."
        },
        "scanner": {
            "channel-id": "000000000000000000",
            "message": "Raid Alert! Please run the `!find-duplicate-users` command.",
            "message-interval": 0,
            "whitelisted-avatars": [
                "00000000000000000000000000000000"
            ]
        }
    }
}
```

### 5. Scheduled Posts
You can schedule messages to be sent out to a specific text-based channel. No more inconsistently timed messages! You are also able to skip certain dates from posting (like a holiday, for instance).

| __Key__                                     | __Type__   | __Description__                             | __Accepted Values__                                                                                      |
|---------------------------------------------|------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `schedule-posts`                            | `object[]` |                                             |                                                                                                          |
| `schedule-posts[x].name`                    | `string`   | Name of the scheduled post                  |                                                                                                          |
| `schedule-posts[x].channel-id`              | `string`   | Channel used to send scheduled post         | Discord channel ID                                                                                       |
| `schedule-posts[x].message`                 | `string`   | Message content                             | Cannot be empty and cannot exceed 2000 characters                                                        |
| `schedule-posts[x].reactions`               | `string[]` | Reactions for scheduled post (optional)     | Unicode emojis (custom emojis not supported)                                                             |
| `schedule-posts[x].send-every`              | `object`   |                                             |                                                                                                          |
| `schedule-posts[x].send-every.time-zone`    | `string`   | Send post on time zone                      | More time zones found in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |
| `schedule-posts[x].send-every.days-of-week` | `number[]` | Send post during day of week                | `0` (Sunday), `1` (Monday), `2` (Tuesday), `3` (Wednesday), `4` (Thursday), `5` (Friday), `6` (Saturday) |
| `schedule-posts[x].send-every.hour`         | `number`   | Send post on hour of day                    | From `0` to `23`                                                                                         |
| `schedule-posts[x].send-every.minute`       | `number`   | Send post on minute of day                  | From `0` to `59`                                                                                         |
| `schedule-posts[x].send-every.second`       | `number`   | Send post on second of day                  | From `0` to `59`                                                                                         |
| `schedule-posts[x].skip-days`               | `string[]` | Don't post during specified days (optional) | Date format is `YYYY-MM-DD`                                                                              |

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

### 6. Regex Channels
Restrict a specific format in a particular channel. If the message doesn't match the regular expression, the message will be deleted (unless member is a server owner, administrator, or listed under excluded roles).

_This feature can be extended with the [delete message](#2-notifications) notification._

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

### 7. Detect Suspicious Words
Detect words in a message that may require attention. Useful when a member mentions a person of interest (without tagging them) or detection of vulgar language that often does not require warnings or deletion.

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

### 8. Remove Member Roles
Clear selected roles from members if it meets a condition (`if-roles` or `if-no-roles`). Useful when a member has _write access roles_ but is Muted (`if-roles`) or if a member loses their Premium status and alert roles should be removed (`if-no-roles`).

| __Key__                                    | __Type__   | __Description__                               | __Accepted Values__          |
|--------------------------------------------|------------|-----------------------------------------------|------------------------------|
| `remove-roles`                             | `object[]` |                                               |                              |
| `remove-roles[x].name`                     | `string`   | Name of the role removal task                 |                              |
| `remove-roles[x].type`                     | `string`   | Condition to remove roles                     | `if-roles` or `if-not-roles` |
| `remove-roles[x].to-detect`                | `object[]` |                                               |                              |
| `remove-roles[x].to-detect[x].description` | `string`   | Description of the roles to detect (optional) |                              |
| `remove-roles[x].to-detect[x].id`          | `string`   | Role to detect                                | Discord role ID              |
| `remove-roles[x].to-remove`                | `object[]` |                                               |                              |
| `remove-roles[x].to-remove[x].description` | `string`   | Description of the roles to remove (optional) |                              |
| `remove-roles[x].to-remove[x].id`          | `string`   | Role to remove                                | Discord role ID              |

```json
{
    "remove-roles": [
        {
            "name": "Remove Sample 2 role if member has Sample 1 role",
            "type": "if-roles",
            "to-detect": [
                {
                    "description": "Sample 1 role",
                    "id": "000000000000000000"
                }
            ],
            "to-remove": [
                {
                    "description": "Sample 2 role",
                    "id": "000000000000000000"
                }
            ]
        },
        {
            "name": "Remove Sample 2 role if member does not have Sample 1 role",
            "type": "if-no-roles",
            "to-detect": [
                {
                    "description": "Sample 1 role",
                    "id": "000000000000000000"
                }
            ],
            "to-remove": [
                {
                    "description": "Sample 2 role",
                    "id": "000000000000000000"
                }
            ]
        }
    ]
}
```

### 9. Auto Reply
Reply to a message without requiring human interaction. Great for automated customer service or surprise members with hidden Easter eggs!

| __Key__                       | __Type__   | __Description__                            | __Accepted Values__                                                                                                                                                 |
|-------------------------------|------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-reply`                  | `object[]` |                                            |                                                                                                                                                                     |
| `auto-reply[x].name`          | `string`   | Name of the auto-reply task                |                                                                                                                                                                     |
| `auto-reply[x].channel-id`    | `string`   | Channel monitored for the reply (optional) | Discord channel ID                                                                                                                                                  |
| `auto-reply[x].tag-author`    | `boolean`  | Tag the author when replying               | `true` or `false`                                                                                                                                                   |
| `auto-reply[x].regex`         | `object`   |                                            |                                                                                                                                                                     |
| `auto-reply[x].regex.pattern` | `string`   | Regex pattern for matching message content | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `auto-reply[x].regex.flags`   | `string`   | Regex flags                                | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `auto-reply[x].messages`      | `string[]` | Message contents                           | Cannot be empty and cannot exceed 2000 characters (lesser characters if tagging author)                                                                             |

```json
{
    "auto-reply": [
        {
            "name": "Sample",
            "channel-id": "000000000000000000",
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

### 10. Remove Affiliate Links
Affiliate links are commonly posted in channels, many of them unauthorized and undetected. This feature automatically removes affiliate links and logs the message.

_This feature can be extended with the [delete message](#2-notifications) notification._

| __Key__                                         | __Type__   | __Description__                             | __Accepted Values__                                                                                                                                                 |
|-------------------------------------------------|------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `affiliate-links`                               | `object`   |                                             |                                                                                                                                                                     |
| `affiliate-links.links`                         | `object[]` |                                             |                                                                                                                                                                     |
| `affiliate-links.links[x].website`              | `string`   | Name of the website                         |                                                                                                                                                                     |
| `affiliate-links.links[x].regex.pattern`        | `string`   | Regex pattern for matching message content  | Read [Writing a regular expression pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#writing_a_regular_expression_pattern) |
| `affiliate-links.links[x].regex.flags`          | `string`   | Regex flags                                 | Read [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)               |
| `affiliate-links.direct-message`                | `string`   | Direct message content (optional)           | Cannot be empty and cannot exceed 2000 characters                                                                                                                   |
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

### 11. Toggle Preset Permissions
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
