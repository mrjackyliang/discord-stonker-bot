# discord-stonker-bot-app-bot

## 4.0.0 - 2026-11-01

### UPDATED
- The project is now called Stonker Bot for Discord, while the repository keeps its `discord-stonker-bot` name.
- Settings move from `config.json` into the control panel, where each feature is set up and switched on for each Discord server. A 3.x `config.json` can be brought in from the Backup page, and any feature it can't fully import stays off until it's fixed.
- The bot asks Discord only for the Gateway intents its enabled features need and never for the Presence intent, instead of always requesting 12 intents, including all three privileged ones.
- Anti-Raid also matches display names, ignores letter case and styled letters, and reports each ban in an alert channel, which is now required.
- Auto Replies send text-only responses that don't ping anyone, and they skip messages that were deleted.
- Event Broadcasts (previously Broadcast Alerts) announce Discord scheduled events in a channel instead of on Twitter, and each rule needs a channel.
- Thread Bumping (previously Bump Threads) reopens a thread as soon as Discord archives it, instead of checking every second, and checks the thread's parent channel first.
- Suspicious Words (previously Detect Suspicious Words) has new cleanup rules for messages and phrases, and a new alert embed.
- Impersonator Alerts compare lowercased usernames and display names, and send one alert per event.
- Message Copiers use only the first matching rule and share files as links instead of uploading them.
- Message Proxies forward bot messages only, use only the first matching rule, and never ping anyone or use text-to-speech.
- Regex Rules send text-only direct messages, and administrators are no longer skipped.
- Affiliate Cleanup (previously Remove Affiliate Links) no longer skips administrators and runs its steps in order.
- Role Messages post plain text, with the footer as a second line.
- RSS Feeds read RSS and Atom from HTTPS addresses only, skip the backlog on the first check, remember posted items across restarts, and post up to 20 items per fetch.
- Scammer Alerts check message text instead of usernames on join.
- Scheduled Posts (previously Schedule Posts) are text-only, follow an IANA time zone that defaults to UTC, catch up on times missed in the last 24 hours from a queue kept in the database, and default seconds to 0.
- Server Tools are six slash commands that need a trusted role and the matching Discord permission, ask for confirmation before changing anything, reply only to the person who ran them, and cap bulk bans at 25 users.
- Audit Notifications (previously Snitch) post plain text without message content, show link hosts instead of full URLs, and no longer report bulk deletes.
- Role Synchronization (previously Sync Roles) reacts only to role changes, applies combined changes together, and refuses rules that form a cycle.
- Permission Toggles (previously Toggle Permissions) replace channel overwrites on a required schedule, and each rule needs a `target-type`.
- Web Applications run on the control panel's port, accept only signed webhooks, and limit invites to five per address every ten minutes, created after the reCAPTCHA check. The invite page is built in a designer with a title, description, accent color, logo, banner, member count and boost tier, button label, footer, and theme, with a live preview, and links pasted in Discord show a preview card with the page's title, description, banner, and accent color.

### ADDED
- A single-image s6 appliance that runs the Discord connection, control panel, worker, and an embedded PostgreSQL database as separate services, backed by one persistent data volume.
- The image's runtime: pinned Debian Trixie with PostgreSQL 17, the Discord connection, control panel, worker, and migrations each supervised on their own, configurable PUID, PGID, and time zone settings, health checks at `/health` and `/ready`, and the same multi-architecture image on Docker Hub and GitHub Container Registry.
- The Compose network has IPv6, so the control panel sees each IPv6 visitor's own address.
- A control panel built in React with System, Light, and Dark themes. A server switcher picks the Discord server; Overview shows the bot's status with start, stop, and restart, and marks a service Not responding when its heartbeat stops; Features shows every module as a card with its own icon and switch; and each feature's editor is built from that feature's own settings rules, so rows can be added, removed, and reordered, optional settings can be added, and secrets stay write-only. Logs stream live for the bot, web, and worker processes, and Connection, Backup, Users, Access tokens, and Security pages cover the rest. Every console page has its own address, so browser history, refreshes, bookmarks, and sign-in returns keep the requested page open.
- Start, stop, and restart controls for the bot's Discord connection that don't restart the container.
- The first account is created on the setup page with a one-time code printed in the container log, so nobody else who reaches a new container can claim it first. Sign-in asks for the authenticator or recovery code only after the username and password pass, and too many failed attempts from one address, or one IPv6 /56 network, are refused for 15 minutes. The Security page can change the username and password, and asks for the password before the authenticator, recovery codes, or passkeys change. Passkeys sign in without typing a username.
- A strength meter sits under every field that sets a password. It rates the password from Weak to Strong and points out common words, runs such as 1234, repeated characters, years, and the username. Any password of 12 or more characters is still accepted.
- Owner, Administrator, Operator, and Viewer roles, each limited to the Discord servers it's given, so several people can share one control panel and one bot can serve several servers. Feature secrets are stored encrypted.
- The Users page lists everyone who can sign in, with when they last signed in, their server access, whether two-factor sign-in is on, and their role, and narrows the list by server, 2FA, or role. Edit changes a user's role and server access, and on Save can also set a new password, turn off two-factor sign-in, or suspend the account. Delete removes the user. The owner and your own account can't be changed there, and an administrator limited to some servers can only grant those servers.
- Saving a feature stores its settings and secrets together, refuses a save made from an older copy, checks secrets with their real values, removes secrets nothing uses anymore, and reloads the bot only once. Turning a feature on or off without changing anything doesn't reload the bot.
- The web service works out its own address from each request and trusts `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto` only from private and local addresses, so no public URL has to be set.
- A JSON API under `/api/v1` for everything the control panel does, and personal access tokens for scripts. Each token has a friendly name, the scopes it may use (`bot:control`, `features:read`, `features:write`, `logs:read`), and an optional expiry, all editable later. A token acts as the user who made it, limited to its scopes, and stops working when that user is suspended or deleted. Tokens can never manage sign-in, tokens, or users.
- The Notifications page sends alerts to ntfy, Reverse Proxy for ntfy, Telegram, Discord, Slack, Gotify, Pushover, Matrix, email, Apprise, or a webhook when the bot can't sign in, loses its connection to Discord and comes back, or a message, permission change, or RSS feed check gives up. It can also report locked sign-ins and secrets removed with a lost key. Each destination has a Send test button, secret fields are sealed with the credential key and never shown again, and only people who can change settings manage notifications.
- The Backup page for Owners and Administrators. After a five-minute, one-use confirmation with a password plus an authenticator code when enabled, or a passkey, it exports selected Connection, all-server Features with secrets, Notifications with secrets, and Access tokens as stored hashes, or imports an export file or older `config.json` through Source, Settings, Review, and Importing while never moving users, passwords, sign-in security, sessions, logs, or Discord runtime data.
- When the credential key is missing, the appliance makes a new one and removes only the secrets the old key sealed: the Bot Token, feature secrets, and authenticator apps. The container log and a control panel notice list each one to enter again, while feature settings, users, passkeys, sessions, and tokens stay. A key file from another database stops startup with a message that says how to fix it.
- Debug logging on the Logs page. While it's on, the bot, the control panel, and the worker add debug entries for Discord Gateway connects, drops, and resumes with their close codes, Discord rate limits with the route and the wait, database queries that take a quarter second or more, and feature handlers and jobs that fail or run slow. The control panel switches at once, the other two within a few seconds, and the switch stays on after a restart.

### REMOVED
- Twitter and X are gone. Importing a `config.json` skips its `twitter-feeds` and `x-feeds` sections, the `settings.twitter` credentials, and `twitter-account` copier destinations.
- API Fetch is gone. Importing a `config.json` skips its `api-fetch` section.
- Prefix commands such as `!ban` are gone, replaced by slash commands.
- The web helpers no longer run their own HTTP and HTTPS servers.
- Custom `invites.ejs` templates are gone. The invite page designer replaces them.
- Permission Toggles can no longer be run by a command. They run only on their schedule.

## 3.4.3 - 2023-02-11

### UPDATED
- Dependencies are now pinned to exact versions and updated by hand with each release, due to unknown incompatibilities.
- The Map Webhooks documentation now says unsupported variable values are returned as a string value instead of a stringified value.

### ADDED
- Toggle Permissions can now change permissions on forum channels.

## 3.4.2 - 2022-12-04

### UPDATED
- The `.editorconfig` file no longer forces object literals to wrap onto separate lines.
- Downgraded `discord-api-types` to `0.37.14` because of a compiler type mismatch.

### FIXED
- Re-added the `xml2js` types, which were dropped in 3.4.0.

### REMOVED
- The `skipLibCheck` compiler option is gone now that `discord-api-types` is downgraded.

## 3.4.1 - 2022-11-09

### FIXED
- The Invite Generator template loads again; it failed because `__dirname` is not supported natively in ESM.

## 3.4.0 - 2022-11-09

### UPDATED
- Switched the project to ES modules and moved the ECMAScript version to 2022.
- Permission flags in the configuration file are now PascalCase (for example, `ViewChannel` instead of `VIEW_CHANNEL`) because of a `discord.js` upgrade.
- TypeScript builds no longer check `config.json` for inconsistencies, since the file is now loaded at runtime.
- Message embed fields now set their `inline` property explicitly.
- Log messages now show Discord objects (such as `Guild` or `TextChannel`) as an object with only their ID instead of the entire object.
- Channel detection now checks each channel's type instead of guessing whether a channel is acceptable from its features.
- Webhook requests to Discord now copy the form data before sending it, so it can be referenced if something goes wrong.
- Webhook requests to Discord now go through one queue for the whole bot to prevent 429 errors.

### FIXED
- Output messages are no longer printed when `log-level` is set below `30`.
- Broadcast Alerts' skipped and continued task log messages now show the current user ID instead of the entire instance.
- Calling `toString()` on a channel now returns the right type, following [this issue](https://github.com/discordjs/discord.js/pull/7836).
- The Impersonator Alerts log message for a failed regex rule match now uses the cleaned nickname or username.
- Server Tools replies no longer fail at times when the command message is deleted before the reply is sent.

### ADDED
- Scammer Alerts notifies a channel when a member whose username matches a configured pattern joins the server.
- Threads and invites now stay cached for up to 30 days.
- A helper function converts scheduled event entity types and statuses into the names Broadcast Alerts settings use, such as `VOICE` and `SCHEDULED`.

### REMOVED
- Detection of member mentions in the nickname format `<@!12345>` is gone because of [this issue](https://github.com/discord/discord-api-docs/issues/4734).
- The Message Proxy invoke log no longer includes the unneeded `message.member` detail.

## 3.3.1 - 2022-10-24

### UPDATED
- RSS feed items now need both a title and a link to be posted.
- Improved debugging for RSS feeds that follow redirects.

### FIXED
- The RSS feed check for already-sent items compared titles instead of links.

## 3.3.0 - 2022-10-21

### UPDATED
- Item links from RSS feed sources with `follow-redirects` enabled are now throttled so they are not flagged as automated queries.

### FIXED
- Removing the source from Google News RSS feed item titles was missing the additional space after the separator dash.

### ADDED
- RSS Feeds can limit a source to items whose links match an allowed list.
- Messages routed through Message Proxy can now include the current year with the `%YEAR%` variable.
- Sent RSS feed items are now also tracked by title, since some feeds change an item's URL after it is published.

## 3.2.1 - 2022-10-13

### UPDATED
- Invite Generator now responds with JSON: the invite code and URL on success, or an error message.
- Improved the code structure of the Invite Generator templates.
- The Invite Generator template now loads jQuery `v3.6.1` instead of `v3.6.0`.

### ADDED
- Invite Generator templates now receive the guild's member count and premium tier as variables.

## 3.2.0 - 2022-10-10

### UPDATED
- The Discord Stonker Bot activity status now uses an extra pipe (`||`) between the version and the link.
- The Invite Generator page now loads jQuery from a protocol-relative URL instead of an HTTPS URL.
- Invite Generator error messages are shorter and simpler.
- Message Proxy's `print-payload` is now `true` instead of `false` in the sample configuration.
- The Detect Suspicious Words documentation now shows how numbers in words are converted, for example `he110` to `hello`.

### FIXED
- The Stonker Bot package version no longer shows as `undefined` in some deployments; it is now read from `package.json`.
- Anti-Raid Membership Gate, RSS Feeds, and Twitter Feeds payloads no longer fail to send when the guild name, item title, or tweet text contains special characters that need escaping.
- Message Proxy no longer fails to send when a message has invalid embeds created from video links; those empty embeds are now dropped.

### ADDED
- Invite Generator can now use a custom page template, created by renaming `invites-sample.ejs` to `invites.ejs`.

### REMOVED
- Invite Generator settings for design, images, error postfix, and injected code are gone, since the page can now use a custom template.
- Map Webhooks no longer has replacements (originally built for rewriting incoming Discord webhooks), since Message Proxy now covers that.

## 3.1.5 - 2022-10-06

### UPDATED
- The bot's activity status and startup message now include the package version.
- Reduced the number of separate modules by moving the Message Proxy and Twitter Feeds code into existing ones.

### ADDED
- Google News items fetched through RSS Feeds now have the source removed from their titles automatically.

## 3.1.4 - 2022-10-02

### ADDED
- Twitter Feeds can include the tweet text in messages with the `%TWEET_TEXT%` variable.

## 3.1.3 - 2022-09-28

### UPDATED
- Message Proxy now leaves out `null` values when rebuilding the `payload_json`.

### FIXED
- Output logs from `generateOutputMessage` no longer double-escape line breaks, now that they skip `util.inspect`.

## 3.1.2 - 2022-09-27

### UPDATED
- Message Proxy now prints the payload both before and after replacements when `print-payload` is on.
- Message Proxy now rebuilds embeds before sending, which makes them easier to modify with regular expressions.

## 3.1.1 - 2022-09-26

### UPDATED
- Regular expression examples in the documentation and sample configuration now use `(.+)` instead of the non-capturing group `(?:)`.

### ADDED
- Message Proxy can replace part or all of a payload using regular expression replacements.
- A new log function prints outputs in full, such as the Message Proxy payload when `print-payload` is on.

### REMOVED
- Message Proxy no longer has webhook avatar URL and username settings, since replacements can now change them with regular expressions.

## 3.1.0 - 2022-09-23

### UPDATED
- The regular expressions that detect ISO dates, Discord webhook links, member IDs, emojis, and suspicious words are simplified (for example, `[0-9]` is now `\d`).
- Simplified the logic of functions that use lodash `_.every`.

### ADDED
- Message Proxy forwards the content, attachments, and embeds of bot messages in a channel to a Discord webhook, so third-party bots can be kept away from the primary server.

## 3.0.11 - 2022-06-15

### UPDATED
- Finnhub Earnings call times again read Before Market Open, During Market Hour, and After Market Close.

### FIXED
- Toggle Permissions now recognizes categories (`CategoryChannel`) as channels whose permissions can be overwritten.

## 3.0.10 - 2022-06-14

### UPDATED
- Server Tools once again replies to the command message even when it deletes that message, reverting the 3.0.9 change.

### FIXED
- The bot no longer shuts down when `node-cron` `3.0.1` is installed; the package is now pinned to `3.0.0`.
- Text in Voice channels are no longer marked as invalid.

## 3.0.9 - 2022-06-12

### UPDATED
- The bot now supports Discord's Text in Voice feature.
- Auto Replies now responds using only the first matching rule, so channel-restricted replies should be listed before server-wide ones.
- When Server Tools deletes the command message, its response is no longer sent as a reply to it.

### FIXED
- Map Webhooks no longer converts escaped double-backslashes into double double-quotes.

### ADDED
- Detect Suspicious Words now converts `9` to `q` and latinizes the message text before matching.
- Impersonator Alerts now converts non-Latin characters to Latin ones before matching nicknames and usernames.

### REMOVED
- Emoji names, member user tags, and nicknames in Server Tools results are no longer normalized.

## 3.0.8 - 2022-06-02

### UPDATED
- Scheduled `node-cron` tasks now always skip missed executions.
- Finnhub Earnings in API Fetch now uses shorter call time labels (Before Open, During Market, and After Close).
- Finnhub Earnings sorts more strictly now that `sortIso` (previously `isoDate`) holds the full ISO date and time.

### FIXED
- Finnhub Earnings dates are no longer displayed in the configured time zone.

## 3.0.7 - 2022-05-23

### UPDATED
- Log messages for functions and events that run or fail to run now include the relevant variables for troubleshooting.

### FIXED
- The bot now exits with an error when the guild is unavailable at startup, instead of failing to initialize its startup features.

## 3.0.6 - 2022-05-22

### FIXED
- Map Webhooks now handles double quotes in incoming values.

## 3.0.5 - 2022-05-22

### UPDATED
- The Map Webhooks success response now names the webhook that was processed.

### FIXED
- Map Webhooks now escapes backslashes, forward slashes, backspaces, form feeds, new lines, carriage returns, and tabs in incoming values, fixing more parse errors from reserved characters.

## 3.0.4 - 2022-05-22

### FIXED
- Map Webhooks no longer fails to parse strings with reserved characters, a follow-up to the 3.0.3 fix that drops its backspace and form feed escaping.

## 3.0.3 - 2022-05-22

### FIXED
- Map Webhooks no longer fails to parse strings that contain reserved characters such as new lines and tabs.

## 3.0.2 - 2022-05-22

### UPDATED
- Requests sent through `axios` now use a random user agent.
- Feeds fetched through `rss-parser` now use a random user agent unless one is defined.

### FIXED
- The bot no longer crashes when Twitter credentials are missing from the configuration.
- Random picks now fall back to the first element of the array when the `lodash` `_.sample` function returns `undefined`.
- Toggle Permissions no longer fails at random when `guild.me` does not exist.

### ADDED
- RSS Feeds can now set a custom user agent for each feed.

## 3.0.1 - 2022-05-22

### UPDATED
- Finnhub Earnings now sorts its feed and its command separately, posting feed updates in date order and listing the newest dates first for the command.

### ADDED
- Stocktwits Trending now has a `limit` option (from `1` to `30`) for how many symbols to fetch.

### REMOVED
- Stocktwits Trending no longer caps results at 15 tickers; it fetches 30 unless `limit` is set.

## 3.0.0 - 2022-05-22

### UPDATED
- The HTTP port and HTTPS port settings (with the HTTPS key, certificate, and CA) moved into Web Applications.
- Commands are now Server Tools.
- API Fetch commands now use plain-text base commands instead of regular expressions, for easier configuration.
- The RSS Feeds fetch schedule now uses recurrence rules (`fetch-on`) instead of cron intervals, for easier configuration.
- Schedule Posts now numbers months `1-12` instead of `0-11`.
- Most message settings in the configuration now accept full message objects instead of plain text, for further customization.
- Logged errors now include the whole serialized error object instead of only its stack trace.
- Detect Suspicious Words now normalizes the message text before checking it, which improves detection.
- Web Applications now checks that no two routes use the same path and method.
- The Web Applications server now checks that the HTTPS key, certificate, and CA files exist before starting.
- Fetch Duplicates in Server Tools now replies with text files holding a table-formatted list and an inline mentions list.
- Fetch Members in Server Tools now replies with text files holding a table-formatted list and an inline mentions list.

### FIXED
- Sync Roles (previously Role Sync) no longer races with third-party bots that change roles; it now waits for a set `timeout` after the last role change.
- Regular expression settings in the configuration file now have the `description` field they were missing.
- Impersonator Alerts no longer runs when a member has not changed their nickname or username.
- The Invite Generator documentation now lists the correct setting types and descriptions.
- The reCAPTCHA on the Invite Generator page no longer shifts to the left when an error message appears.

### ADDED
- Snitch can now report when a member joins the guild.
- Snitch can now report when a member leaves the guild.
- Snitch can now report when a member's roles change.
- Fetch Emojis in Server Tools lists the server's emojis, filtered to all, animated, or static ones.
- Web Applications runs the bot's own HTTP or HTTPS server to connect external applications and traffic to the Discord server.
- Map Webhooks, part of Web Applications, converts incoming JSON webhooks into Discord messages.
- Finnhub Earnings in API Fetch posts earnings calendar updates from Finnhub to a channel and can also be run as a command.
- Twitter Feeds posts tweets from chosen Twitter users to a channel or thread, with options to leave out retweets and replies.
- Broadcast Alerts posts Discord scheduled events to Twitter, filtered by event status, entity type, and creator.
- Server Tools (previously Commands) can use custom base commands.
- Server Tools (previously Commands) can be set to delete or keep the command messages.
- API Fetch commands can send a custom message when a member without permission runs them.
- The Anti-Raid Membership Gate can assign multiple roles when a member is verified.
- Schedule Posts can show the current year with the `%YEAR%` variable.
- Role Messages can show the current year with the `%YEAR%` variable.
- Message Copier can now send copied messages to Discord webhooks or Twitter.
- Toggle Permissions can now change permissions on a schedule.
- RSS Feeds can now follow redirects and remove parameters from item links.
- The Invite Generator page can now add a custom postfix message to the errors users see.
- The configuration file is now strictly type-checked, and errors explain which settings are invalid.

### REMOVED
- The bot prefix setting is gone, replaced by custom base commands.
- Server Tools (previously Commands) no longer includes the Help Menu command.
- Server Tools (previously Commands) no longer includes the Toggle Permissions command, which is moving into its own standalone module.
- The Anti-Raid Monitor is gone, replaced by the Snitch guild join and guild leave notifications.
- Schedule Posts can no longer target specific years, because the bot moved off the unmaintained `node-schedule`.

## 2.3.0 - 2022-04-01

### UPDATED
- The Remove Affiliate Links configuration key is now `remove-affiliate-links` instead of `affiliate-links`.
- The role manager configuration, now called Role Sync, uses `role-sync` instead of `roles`; the `role-manager` command settings are unchanged.
- The invalid toggle group embed for `togglePerms` now shows the first 10 groups as examples instead of 15.
- Loops that used `_.map` and returned `void[]` now use `_.forEach`.
- The separate `messageCreate` event handlers are combined into one function.

### ADDED
- Role Messages sends a message to a channel when a role is added to or removed from a member.
- The Regex Rules documentation now notes that only the first matching rule runs, so channel rules should come before server-wide rules.
- The invalid toggle group embed for `togglePerms` now notes that only the first 10 toggle groups are shown and points to the configuration for the rest.

### REMOVED
- Impersonator Alerts no longer supports `%MEMBER_USER_ID%`, since the user mention already includes the ID.

## 2.2.0 - 2022-03-30

### ADDED
- Regex Rules can now remove messages that match the regular expression, not just ones that don't, with the new `match` option.

### REMOVED
- Caught `error` values no longer have an explicit `any` type.

## 2.1.1 - 2022-03-28

### UPDATED
- Errors for invalid regular expressions in the configuration now share one format.

### ADDED
- Impersonator Alerts posts an alert in a chosen channel, tagging the listed user, when a member's nickname or username matches that user's regular expression. Names are checked when members join and when they change their nickname or username.

### REMOVED
- The Snitch Notifications detectors for nickname and username changes are gone; they moved to Impersonator Alerts.

## 2.1.0 - 2022-03-25

### FIXED
- An invalid regular expression in the `etherscanGasOracle` or `stocktwitsTrending` configuration no longer crashes the bot.

### ADDED
- Snitch Notifications can detect impersonators: when a new nickname or username matches a detector's regular expression, the notification tags that detector's user with a custom message.
- The includes-link notification can now skip messages whose links match an `exclude-links` pattern, such as Tenor GIF links.

## 2.0.5 - 2022-03-25

### UPDATED
- Configurations from earlier versions are not compatible with this version, so review your configuration before upgrading.
- The channels for Snitch Notifications are now wrapped in a `channel` object.
- The channels for Toggle Preset Permissions are now wrapped in a `channel` object.
- The Toggle Preset Permissions wrapper for channel permissions is now named `permissions` instead of `channel-perms`.

## 2.0.4 - 2022-03-24

### UPDATED
- Configurations from earlier versions are not compatible with this version, so review your configuration before upgrading.
- The `channel-id`, `role-id`, `thread-id`, `user-id`, `avatar-hash`, and `username` values now sit in configuration objects with an optional `description`.
- The `format` value in Message Copier is now named `message`.

### FIXED
- The `invite-generator` section in the sample configuration now follows the same order as the README.

## 2.0.3 - 2022-03-21

### UPDATED
- The repeat message tracker, which catches the extra update Discord sends when it creates link embeds, now covers all created and edited messages.
- The `StoredMessage` type now uses a more unique ID that combines the guild, channel, and message IDs.

### FIXED
- Remove Affiliate Links no longer handles the same message twice when Discord sends a repeat update for it.
- The web server no longer accepts the reserved port `0`.

### ADDED
- The README's configuration tables now have a Required column that shows which settings the bot needs to start.

## 2.0.2 - 2022-01-13

### FIXED
- Message Copier no longer pushes leftover message content into later copied messages.

## 2.0.1 - 2022-01-12

### UPDATED
- The dependencies listed in `package.json` are upgraded, including `discord.js` 13.5.1 and ESLint 8.
- Message cache sweeping now uses `Sweepers` instead of the `LimitedCollection` class from the `discord.js` library.
- The code now uses the `TextBasedChannel` type from the `discord.js` library instead of `TextBasedChannels`.
- Embed `setFooter` calls now pass an object instead of a string.
- The `failed` parameter of the `generateServerMessage` function is now required.
- The deprecated `String.prototype.substr` call is now `String.prototype.substring`.
- The `prefer-regex-literals` ESLint rule is turned off.

### ADDED
- The Etherscan Gas Oracle in API Fetch can now use an optional Etherscan API key (`api-key`).
- Catch errors now have an explicit `any` type.

## 2.0.0 - 2021-12-08

### UPDATED
- The `.editorconfig` and `.eslintrc.json` settings are adjusted, and ESLint no longer sets the `es2020` environment.
- The `message` setting for Scheduled Posts is now named `payload`.
- Log messages now include the function name and related details, such as the channel or payload.
- The `createReoccurringSchedule` function now relies on the `RecurrenceSegment` type instead of its own checks, so `send-every` values can now be lists.

### FIXED
- The `splitStringChunks` function now declares its `string[]` return type.
- Message Copier errors now refer to `replacements[key]` instead of the old `replace-text[key]`.

### ADDED
- API Fetch can post Etherscan gas prices to a channel as a live feed whenever they change.
- API Fetch has a Stocktwits command that replies with the top trending symbols when a message matches its regular expression.
- Message Copier messages can now include `%CHANNEL_MENTION%` and `%MESSAGE_EXCERPT%` (up to the first 500 characters of the message).
- Invite Generator now has `max-age` and `max-uses` options for the invites it creates.
- RSS Feeds now strip `siteid` from item links.

### REMOVED
- The commas between members in the list members embed are gone, so the list can be pasted into the `bulk-ban` command.

## 1.9.6 - 2021-10-14

### UPDATED
- JSON in the sample configuration and the README examples now uses 2-space indentation.

### FIXED
- Normal server messages now print with `console.log` instead of `console.error`.

### ADDED
- The Invite Generator page path can now be set with `invite-generator.path`, such as `/invite`.

### REMOVED
- The `express.js` default `GET` response at `/` is gone.

## 1.9.5 - 2021-10-14

### UPDATED
- The project configuration files (`.editorconfig`, `.eslintrc.json`, `.gitignore`, `tsconfig.json`) are adjusted, with 2-space indentation as the new default.
- The `invites.ts` module is now named `invite.ts`.
- The `generateServerMessage` function now handles exit codes and other server messages, not just startup failures.
- The `client.on` ready event now wraps its work in `try` / `catch`.
- Embed field names (`addMessageFields`, `fetchMembers`) and `string[].join(' ')` calls are organized more consistently.
- The `createMemberMonitorEmbed` function now accepts a `GuildMemberRoleManager` instead of a `Role` collection.
- Unmuting a stage channel now shows the title **Invite to Speak** instead of **Unmute**.
- The `generateLogMessage` function now logs `error.stack` messages at the same priority as the message they belong to.
- The `getTextBasedChannel` function now relies on `TextChannel`, `NewsChannel`, and `ThreadChannel` instead of `TextBasedChannels`.
- The code now uses `*.fetch` or `*.resolve` instead of `*.cache` collections wherever an alternative exists.
- The `DuplicateUsers` type is now `DuplicateMembers`.
- The `!fetch-duplicates` command title now shows an ellipsis before the last 8 characters of the avatar hash.
- Commands now rely more on asynchronous methods to make fetching easier.
- The `!bulk-ban` command now accepts both member IDs and member tags.
- The `!help-menu` command now lists long-hand, regular, or short-hand commands to match the form you used; for example, `!hm` shows commands like `!bb`.
- The `express` server configuration now lives in its own module (`server.ts`).

### FIXED
- The `voiceTools` command no longer mistakes a missing `guild.me` for a failed `!guild.me.permissions.has` check.
- The `stocktwits` catch handler now returns `generateLogMessage` directly instead of wrapping it in a block.

### ADDED
- The `generateServerMessage` function prints server status messages and can stop the process with an exit code.
- The `commandNoResults` function in `commands.ts` sends the no-results embed for commands.
- The `commandError` function in `commands.ts` sends the error embed for commands.

### REMOVED
- The `generateServerFailedMessage` function is gone, replaced by `generateServerMessage`.
- Caught exceptions are no longer typed as `Error`.
- The `userChangeUsername` function no longer accepts the `PartialUser` type for `newUser`.

## 1.9.3 - 2021-10-05

### UPDATED
- The TypeScript config now turns on `noImplicitAny`, `noImplicitReturns`, and `noUnusedLocals`.
- The `.editorconfig` and `.eslintrc.json` settings are adjusted, and ESLint now ignores the `build` folder.
- Types are improved, with optional configuration settings now marked as optional.
- The `format` option for `messageCopier` can now be left undefined; the message text is then copied with only the replacements applied.
- The `createReoccurringSchedule` function now accepts an undefined `ReoccurringSchedule`.
- No-permission errors for commands now come from a separate function.
- Commands now delete their command message through a separate function.
- The README is revised, with reworded feature descriptions.

### FIXED
- TypeScript builds produce output again; the `noEmit` option had stopped the compiler from writing any files.

### ADDED
- The `messageCopier` can now delete the original message when copying it, using `delete-message`.
- A `HelpMenuEmbedCommands` type now describes the commands in the help menu embed.

### REMOVED
- ESLint no longer requires default exports in TypeScript files, and modules now use named exports.
- The `inviteGenerator` no longer detects the visitor's remote IP address, because the results were inconsistent.

## 1.9.0 - 2021-09-18

### UPDATED
- The `.editorconfig` file has new HTML settings for child-tag indentation and text wrapping.
- The `built/` entry in `.gitignore` is now `build/`, matching the new build output folder.
- The bot's invite permissions are now `292348488773` instead of `17470581828`, adding Create Invite and Send Messages in Threads.
- All commands now process messages the same way, and their errors and examples show the command as it was typed.
- The `toggle-perms` command now lists the first 15 toggle groups, up from 10, when the group given is invalid.
- The `createReoccurringSchedule` function now accepts a single object.

### ADDED
- ESLint now supports TypeScript imports through `plugin:import/typescript`.
- Stonker Bot can now launch HTTP and HTTPS web servers, set with `server-http-port`, `server-https-port`, and the HTTPS key, certificate, and CA settings.
- Each command now has long-hand and short-hand forms, such as `bulk-ban`, `ban`, and `bb`.
- Scheduled Posts can now set a `year`, `month`, and `date` to send on.
- Stocktwits posts can now set a `year`, `month`, and `date` to send on.
- Stonker Bot can now generate server invites.
- Invite Generator serves a web page where visitors pass a Google reCAPTCHA check to get a single-use server invite, with a customizable design and code injection.

### REMOVED
- The test module (`jasmine` and the `npm test` script) is gone.
- The dependencies recommended by `discord.js` (`bufferutil`, `utf-8-validate`, `zlib-sync`) are gone because of system incompatibilities.
- Commands no longer take a `botPrefix` argument.

## 1.8.5 - 2021-09-04

### UPDATED
- The `find-duplicate-users` command is now named `fetch-duplicates`.
- Bump Threads now un-archives a thread as soon as it is archived, including threads that used to come back as `undefined`.
- The type definitions for the `luxon` package are now 2.0.2.
- The bot's invite permissions are now `17470581828` instead of `290712644`, adding Manage Threads.
- **Stocktwits Trending** is now called **Stocktwits**.
- Commands now log missing-property errors instead of using `throw`, since no `try catch` was in place to catch them.
- Command descriptions and examples in the help menu are reworded.
- Regex Channels (`checkRegexChannels`) now also checks edited messages.

### FIXED
- Calls no longer mix `await` with `.then()`.
- The `voice` command now recognizes voice and stage channels.
- Embeds that use `generateColor` now use the predefined `EmbedStatus` TypeScript type.

### ADDED
- Snitch Notifications can now send each type of notification to its own channel.
- A `bulk-ban` command bans every member tagged in the command.
- Message Copier has an `include-attachments` option to choose whether attachments are copied.
- Message Copier can now ignore certain users or channels with `disallowed-users` and `disallowed-channels`.
- Tests can now run with `jasmine` through `npm test`.

### REMOVED
- Selecting a mode and a log channel is no longer required, and the `mode` and `log-channel-id` settings are gone.
- The `createReoccurringSchedule` function is no longer exported.

## 1.8.0 - 2021-08-16

### UPDATED
- The JavaScript version in the ESLint configuration is now `11` (ECMAScript 2020).
- The project is now written in TypeScript.
- The order of the `settings` options in the sample configuration is rearranged.
- The membership gate's `verified-role-id` setting is now named `role-id`.

### ADDED
- A `/built` entry in `.gitignore` keeps the compiled TypeScript output out of git.
- The membership gate can now post a custom message in a channel once a member completes verification.
- Detect Suspicious Words can now send its notifications to a text-based channel of your choice.
- Message Copier now copies attachments along with the message.
- A thread bumper (`threads.bumper`) regularly posts and deletes a message in each listed thread so threads never expire, even without a boosted server.

### REMOVED
- The code no longer uses the `lodash` version of `_.isUndefined`.

## 1.7.5 - 2021-08-10

### UPDATED
- Stonker Bot now supports Discord API v9 through `discord.js v13`.
- The ESLint `ecmaVersion` is now `2020`.
- Dependencies are upgraded, and the bot now requires Node.js 16.6.0 or later and npm 7 or later.
- The code now uses nullish coalescing operators (`??` instead of `||`).

### FIXED
- Commands no longer use an unneeded `await` on `_.map()`.

### ADDED
- Anti-Raid has a membership gate that gives members a verified role once they complete Discord's membership screening.
- The `message-copier` can now copy messages only from allowed channels, set with `allowed-channels`.
- The `stocktwits` feature can now post trending tickers as text with `%TICKERS%`, as an embed with `show-embed`, or both.

### REMOVED
- The Anti-Raid verification gate, where new members typed a code in a channel to get verified, is gone.
- Plain string messages are no longer supported in `schedulePost`; the `message` must now be an object, such as one with `content`.

## 1.7.2 - 2021-08-03

### UPDATED
- Message Copier now accepts text replacements and a custom message format, replacing the `prefix`, `suffix`, and `remove-mentions` options.
- The server's startup checks now validate `bot-prefix` only in the `feature` and `all` modes, and the `guild-id` error now also covers an unavailable guild.

### FIXED
- Skipped scheduled posts are now logged as info messages instead of warnings.

### ADDED
- The packages recommended by `discord.js` (`bufferutil`, `utf-8-validate`, `zlib-sync`) are now installed with the bot.
- RSS Feeds can post new entries from an RSS feed to a channel on a cron interval, with a custom message that can include `%ITEM_TITLE%` and `%ITEM_LINK%`.

## 1.7.1 - 2021-07-05

### UPDATED
- The `detectSuspiciousWords` feature is now part of `snitch` mode, so it runs only in the `snitch` and `all` modes.
- The `feature` mode no longer needs a log channel ID at startup; `log-channel-id` is only required for the `snitch` and `all` modes.
- Bulk message deletions now check the `delete-bulk-messages` setting before looping through the messages.

### FIXED
- The `getTextBasedChannel` function now documents its return type as `TextBasedChannel` instead of `GuildChannel`.
- The `toggle-perms` command now uses `message.guild` instead of the longer `message.channel.guild`.

### ADDED
- Message Copier copies messages that match a regular expression into another channel, with options to remove mentions, add a prefix or suffix, and limit copying to certain users.
- Reports of detected affiliate links now go to a channel of your choice, set with `affiliate-links.channel-id`.

### REMOVED
- Anti-Raid auto-verify and its `trusted-age` setting are gone because auto-verify accidentally bypassed membership screening.
- Anti-Raid verification no longer checks whether a member has an avatar; account age alone decides whether they get the normal or suspicious messages.
- Anti-Raid verification no longer reads `O` and `o` as `0` in verification codes.

## 1.7.0 - 2021-06-26

### UPDATED
- Renamed `scheduler.js` to `content.js`.
- Switched line breaks from `\r\n` to `\n`.
- The verification code a member types is no longer lowercased.
- The `O` (capital letter `o`) in a verification code is now converted to `0`.

### FIXED
- Corrected grammar in `README.md`.

### ADDED
- Scheduled content posts now run through a shared `createReoccurringSchedule` helper.
- Stocktwits Trending (`stocktwitsTrending`) posts trending tickers from Stocktwits to a channel on a schedule, up to 25 tickers per post.
- The `axios` package retrieves remote content such as Stocktwits data.
- Anti-Raid verify now accepts secret codes (`secret-codes`) for manually verifying a member.

## 1.6.9 - 2021-06-20

### UPDATED
- Anti-Raid verify now sends its messages only as direct messages.
- All Anti-Raid verify messages now support the `%MEMBER_CODE%` variable.
- Members can now type `o` instead of `0` when asking for their unlock code.
- The Anti-Raid auto-ban reason now matches the log message format.

### ADDED
- Anti-Raid auto-verify gives the verified role to members whose accounts are at least `trusted-age` seconds old as soon as they join.
- Anti-Raid verify now checks whether a member has an avatar, and members without one get the `suspicious` messages.

### REMOVED
- The Anti-Raid verify notice sent when members join the server is gone.

## 1.6.8 - 2021-05-30

### UPDATED
- Anti-Raid verify now sends the `welcome` message to members who type `verify` in the verify channel.

## 1.6.7 - 2021-05-30

### UPDATED
- Anti-Raid verify messages are now grouped by type (`welcome`, `valid`, `invalid`), each with a `normal` and a `suspicious` version.
- Moved the Anti-Raid functions into their own file, `anti-raid.js`.
- `hasPermission()` calls now use `permissions.has()`.
- The `!voice` command now has partial support for controlling stage channels.

### FIXED
- The `!voice` command no longer accepts channels that are not voice or stage channels and then marks the results as complete.
- The README's Anti-Raid verify section now lists the `exclude-roles` option.

### ADDED
- Anti-Raid verify has a `minimum-age` setting (in seconds); members whose accounts are younger get the `suspicious` messages.

## 1.6.5 - 2021-05-27

### UPDATED
- The bot now loads only the `discord.js` classes it uses instead of the entire library.
- The bot now loads only the `luxon` classes it uses instead of the entire library.
- In `all` mode, `snitch` now starts before `feature`, because snitch messages were being sent last due to `await`.
- Message fields now split text with `splitStringChunks` at 1020 characters max, up from 1000.
- Command detection now checks for the bot prefix first and reads the message text only once, in an attempt to speed up handling.
- `antiRaidVerifyNotice` now runs before `antiRaidAutoBan` when a member joins.

### FIXED
- The `userUploadAttachment` function now catches errors when sending instead of crashing at the function level.

### ADDED
- The bot now declares `discord.js` intents for web-socket support.
- An includes-link notification (`notifications.includes-link`) alerts the log channel when a new or edited message contains links.
- The `autoReply` feature now supports multiple channels per rule through `channel-ids`, which replaces `channel-id`.
- `antiRaidVerifyNotice` now sends the `suspicious` message to members whose accounts were created less than 7 days ago.

### REMOVED
- The Anti-Raid scanner is gone.

## 1.6.0 - 2021-05-19

### UPDATED
- The role embed now supports removing roles as well as adding them.
- The `remove-roles` feature is now the `roles` feature (Role Manager), which can add roles as well as remove them using `yes-to-yes`, `no-to-no`, `yes-to-no`, or `no-to-yes` conditions.
- The `!add-role` command is now `!role` and can remove roles as well as add them.
- Member and user event tasks now check that the guild is available before running.
- The README now shows the emoji identifier string for both static and animated custom emojis.
- Renamed the conflicting `fetchMembers` variables (`member` to `theMember` and `role` to `theRole`).
- Command messages that pass validation are now deleted to keep the channel clean.

### FIXED
- Members can now verify through the Anti-Raid verification gate even when the bot lacks the __Manage Messages__ permission.

### ADDED
- Scheduled posts now write a success log message for each emoji the bot reacts with.

## 1.5.5 - 2021-05-17

### UPDATED
- Split `snitcher.js` into separate files, one for each notification.
- JSDoc types now use `module:"discord.js".TextBasedChannelFields` instead of `TextBasedChannel`.
- Scheduled post reactions can now use custom emojis through the emoji identifier string.

### ADDED
- The bot can now start in `feature` mode, `snitch` mode, or `all` mode (`settings.mode`); `snitch` runs only the notifications and `feature` runs everything else.
- The `delete-bulk-messages` notification covers messages removed in a bulk delete, separate from `delete-message`.
- A `generateServerFailedMessage` function prints the error when the server fails to start.

### REMOVED
- The `axios` dependency is gone.
- The `getGoogleCloudStorageObjects` feature, which fetched attachments so they got cached, is gone.
- The `clientStatus` field in `createMemberMonitorEmbed` is gone.

## 1.5.3 - 2021-05-15

### UPDATED
- `discord.js` is now `12.5.3`.
- `displayAvatarURL` calls now request higher quality profile pictures (up to 4096 pixels, animated when available).
- The `%MEMBER_DISCRIMINATOR%` variable is now `%MEMBER_CODE%`.
- Anti-Raid verify now requires the first 4 digits and last 4 digits of the member's Discord ID instead of their discriminator.
- Simplified how `antiRaidVerifyNotice` generates the instructions message.
- The `voice` command now accepts `stage` channels, ready for when `discord.js` supports them.
- The `schedulePost` function now passes the message straight into `TextChannel.send`, so a scheduled post can be an object as well as a string.

### FIXED
- Toggle groups in the `togglePerms` error message now display correctly.
- Lowered the `addMessageFields` character limit to `1000` per field.

## 1.5.2 - 2021-05-11

### UPDATED
- The Anti-Raid verify channel no longer runs verification for members with excluded roles (`exclude-roles`), administrators, or server owners.

## 1.5.1 - 2021-05-11

### UPDATED
- Messages that members post in the Anti-Raid verify channel are now deleted automatically.

### ADDED
- Anti-Raid verify now replies with a `valid` or `invalid` message after a member enters a code (`anti-raid.verify.messages`).

### REMOVED
- The `%MEMBER_USERNAME%` variable in Anti-Raid verify messages is gone.

## 1.5.0 - 2021-05-10

### UPDATED
- Bot permissions change from `290712646` to `290712644`, dropping Kick Members.
- Reworded the startup errors shown when `settings.bot-prefix` or `settings.time-zone` is not configured.
- Reworded the block comments that describe functions.

### ADDED
- An Anti-Raid verification gate posts a message in the verify channel when a member joins and gives them the verified role once they type their Discord discriminator there (`anti-raid.verify`).

### REMOVED
- The `whitelist` command is gone.
- The Anti-Raid automatic kicker (`anti-raid.auto-kick`) is gone.
- The pause execution function is gone.
- The bot session storage is gone.
- The member monitor embed no longer shows client statuses.

## 1.4.5 - 2021-05-08

### FIXED
- The `guildMemberAdd` and `guildMemberRemove` events now pause briefly before running, because `member.presence.clientStatus` is often `null` at first.
- The __Additional Information__ field title in `createMemberMonitorEmbed` is now bold.

### ADDED
- A pause execution function (`pauseExecution`) waits a set number of milliseconds.

## 1.4.4 - 2021-05-08

### UPDATED
- The `whitelist` command now accepts only user IDs.

### FIXED
- The `message` event now ignores `system` messages, which caused a `removeAffiliateLinks` error.

## 1.4.3 - 2021-05-08

### UPDATED
- Enforced type checking in the `userUpdate` client event.
- Event log messages now use priority `30` (info) instead of `40` (debug).
- Anti-Raid auto-ban now checks the avatar hash and username in one combined step.
- `auto-kick.minimum-age` is now set in seconds instead of milliseconds.
- `utilities` now requires the `luxon` library instead of `DateTime`.
- The `createWhitelistEmbed` message now shows the user ID as text instead of tagging the user.
- The member monitor embed now shows how long a departing member stayed in the guild and which roles they had.

### FIXED
- Anti-Raid monitor no longer posts a guild leave message before the matching guild join message, because the join message now goes out before auto-ban or auto-kick runs.
- The Anti-Raid scanner no longer spams the logs when duplicate users are detected; it now logs only when it sends an alert.

### ADDED
- A `settings.time-zone` option sets the time zone for embeds and logs.
- Anti-Raid auto-kick has a `skip-app-client` option that skips the kick for members using the Discord desktop or mobile app.
- A readable time duration generator shows durations as plain text, such as "1 year and 2 months".
- The `whitelist` command now writes a log message when a user is whitelisted.
- The bot now checks `settings.time-zone` at startup and refuses to start when it is missing or empty.

## 1.4.1 - 2021-05-07

### UPDATED
- Anti-Raid monitor now writes a debug log message when a user joins or leaves the guild.

## 1.4.0 - 2021-05-07

### UPDATED
- Simplified the `antiRaidScanner` argument names.
- The excluded roles check in `checkRegexChannels` and `removeAffiliateLinks` now uses a strict `=== true` comparison.

### ADDED
- Anti-Raid monitor posts an embed to a set channel whenever a user joins or leaves the guild (`anti-raid.monitor`).

## 1.3.2 - 2021-05-05

### UPDATED
- The Toggle Preset Permissions success message is now logged at `debug` level.

### FIXED
- The `fetchMembers` `string` route now captures quoted search text correctly.
- Scheduled posts without `reactions` or `skipDays` now schedule properly.

## 1.3.1 - 2021-05-05

### UPDATED
- Logic statements now use strict type checks (such as `_.isUndefined` and `=== true`) instead of loose truthy checks.
- Revamped the project README with linked setup steps and a final step to start the bot with `npm start`.

### ADDED
- Anti-Raid auto-kick can now kick members who have no avatar when `force-avatar` is `true`.
- Regex Channels can send a direct message (`direct-message`) to members whose messages are deleted for not matching.
- The Remove Affiliate Links feature can send a direct message (`direct-message`) to members whose affiliate links are removed.

## 1.3.0 - 2021-05-02

### UPDATED
- The bot and the Anti-Raid scanner now support only a single guild, set with `settings.guild-id`.
- Increased `max_line_length` in `.editorconfig` to `200`.
- The bot's default permissions are now `290712646` instead of `290679878`, adding Attach Files.
- The `getTextBasedChannel` function now finds channels in the `guild` instead of the `client`.
- Simplified how `createHelpMenuEmbed` generates its command list.
- Renamed `snooper.js` to `snitcher.js`.
- Switched uses of `message.content` to `message.toString()`.
- The `messageDelete` and `messageDeleteBulk` events now share one handler instead of duplicate code.

### FIXED
- The Anti-Raid scanner now checks that `anti-raid.scanner.message` is a non-empty string before it runs.
- Anti-Raid auto-kick now skips members who match the auto-ban lists, so banned users no longer get its direct message.

### ADDED
- The Anti-Raid scanner's `message-interval` option sets how many seconds to wait between alerts, replacing the fixed 10 minutes.
- Attachment fields can now use a custom field title.
- An upload attachment notification (`notifications.upload-attachment`) re-posts attachments from new messages to the log channel.
- An "Attachment Uploaded" embed goes with each re-posted attachment, showing who sent it, where, and a link to the original.

### REMOVED
- Attachment caching no longer fetches each attachment's `proxyURL`.

## 1.2.1 - 2021-04-30

### UPDATED
- Improved the naming of parameters and variables inside functions.
- The Anti-Raid auto-kick direct message tracker now stores a `boolean` instead of a `number`.
- The `addRole` function now builds `commandArguments` directly instead of storing the `messageText` result first.
- Replaced object destructuring in the `fetchMembers` loop with separate constants.

### FIXED
- The `!help` menu now gives the correct description for the `!fetch-members` command.

### ADDED
- A `!whitelist` command temporarily excludes a user from Anti-Raid auto-kicks.
- The `!whitelist` command confirms a successful whitelist with an embed.
- A bot session storage keeps temporary data, such as the whitelist, in memory until the bot restarts.

### REMOVED
- The avatar check in Anti-Raid auto-kick is gone, so accounts below the minimum age are kicked whether or not they have an avatar.

## 1.2.0 - 2021-04-29

### UPDATED
- The `funding` link in `package.json` now uses HTTPS.
- The configuration file has a new layout: `features` becomes `notifications` (keys drop the `-notification` suffix), each command's allowed roles move under `commands`, and `banned-users` and `user-scanners` move under `anti-raid` as `auto-ban` and `scanners`. `toggle-perms` is now a plain list of permission groups.
- Reorganized checks so `_.isEmpty` runs after `_.isArray` or `_.isString`.
- Routed `x.length` checks to the `lodash` version.
- Renamed the `automaticBan` function to `antiRaidAutoBan`.
- Renamed the `userScanner` function to `antiRaidScanner`.
- The `removeAffiliateLinks` function now reads each link's pattern and flags from a `regex` object.

### ADDED
- A README now covers installing dependencies, creating and adding the Discord application, and every configuration section.
- Anti-Raid auto-kick removes members whose accounts are younger than `anti-raid.auto-kick.minimum-age` and who have no avatar, after sending them a direct message.

## 1.1.1 - 2021-04-24

### UPDATED
- The bot now requires the entire `luxon` library instead of just `DateTime`.
- Renamed the `launchHelpMenu` function to `help`.
- Changed the line spacing of the example `id` commands in the `togglePerms` error message.
- Renamed the `autoResponder` function to `autoReply`.

### FIXED
- The `addRole` function now skips members who already have the role being added.

### ADDED
- The user scanner now writes an `init` debug log message when it starts each scan.
- The user scanner now writes a `detect` debug log message when it finds duplicate users.
- `addAttachmentFields` now has a precise JSDoc param type for its attachments (`Collection<Snowflake, MessageAttachment>`).

## 1.1.0 - 2021-04-21

### UPDATED
- The license copyright year is now 2021.
- Increased the message cache lifetime from `14` days to `30` days.
- Routed `Array.prototype.includes` calls to the `lodash` version.
- Routed `Object.prototype.forEach` calls to the `lodash` version.
- Routed `String.prototype.replace` calls to the `lodash` version.
- Simplified the use of variables in `commands.js`.
- Revised the `findDuplicateUsers` message title.
- Attachment fields for updated or deleted messages now show the original link with an alternative link beside it.
- The `voice` command titles no longer end with an ellipsis while in progress ("Disconnecting", "Unmuting").

### FIXED
- The `voice` command no longer reports failure when it succeeds.
- The `logger` function for the `voice` command now uses the right colors and priority: green at debug level for successes, red at error level for failures.

### ADDED
- An `add-role` command adds a role to everyone, to members with no roles, or to members who have a given role.
- The help menu now includes instructions for `add-role`.
- A user scanner checks the server every minute for members who share an avatar and posts an alert message to a set channel, at most once every 10 minutes.
- The `scheduler` keyword is now listed in `package.json`.
- The `auto-reply` keyword is now listed in `package.json`.
- Attachment caching now also caches each attachment's `proxyURL`.

## 1.0.0 - 2021-04-19

### ADDED
- Initial release of Stonker Bot for Discord, a bot for finance-related servers that posts nickname change, username change, edited message, and deleted message notifications to a log channel. It also sends scheduled posts, auto-replies to messages that match a pattern, deletes messages that break a channel's regex rule or contain affiliate links, reports suspicious words, removes roles based on other roles, and bans users with a listed avatar hash or username when they join.
- Members with allowed roles and administrators can use `!help`, `!fetch-members` (search members by avatar, role, text, or username), `!find-duplicate-users` (list members who share an avatar), `!toggle-perms` (switch preset channel permissions on or off), and `!voice` (disconnect or unmute everyone in a voice channel).
- Attachment caching fetches each attachment in new and edited messages right away so it gets cached.
