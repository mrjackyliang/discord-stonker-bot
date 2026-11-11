# VISION.md

## Purpose

### Problem Statement

Active Discord communities often combine high message volume, time-sensitive
information, impersonation and scam risk, repetitive moderation, scheduled content, and
several external feeds. Single-purpose bots handle isolated pieces, which leaves server
operators coordinating overlapping tools and inconsistent configuration.

The current Stonker Bot for Discord proves that these needs belong together, but it grew into
one large configuration and event surface spanning 22 feature groups. Its replacement
should retain the useful community knowledge while making features modular, testable,
observable, and safe to operate in a container.

### Target Audience

- **Community operators** - Administrators who need dependable moderation, content
  organization, alerts, and scheduled information in an active Discord server.
- **Moderators** - Trusted users who need focused tools for raids, impersonation,
  suspicious behavior, roles, messages, threads, and voice channels.
- **Self-hosters** - Operators who want a documented Docker deployment with explicit
  configuration, health reporting, and predictable upgrades.
- **Contributors** - Developers who need feature boundaries clear enough to change one
  capability without understanding the entire bot.

### Value Proposition

Stonker Bot for Discord will be a modular, self-hosted, all-purpose operations bot designed
around the needs of active Discord communities. It will combine safety, moderation,
content automation, and optional integrations in one observable service without treating
every legacy feature as mandatory or coupling every event to one monolithic initializer.

## Product Direction

### Principles

- **Community safety first** - Anti-raid, impersonation, scam, and permission behavior
  must fail predictably and explain actions to authorized operators.
- **Modular by configuration** - A disabled capability should not register handlers,
  request privileges, start schedules, or initialize third-party clients.
- **Least privilege** - Discord intents, bot permissions, API credentials, and container
  privileges should match the enabled capabilities.
- **Operator clarity** - Startup validation, structured logs, health state, and error
  messages should identify the affected feature without exposing secrets or member data.
- **Respect Discord as the interface** - Prefer native interactions, embeds, threads,
  permissions, and application commands over parallel interfaces without a clear need.
- **Deliberate compatibility** - Preserve a legacy behavior only after its user value,
  safety, and migration cost are understood.

### Scope

#### Legacy Capability Inventory

The rewrite must triage, not automatically port, the existing groups:

- **Community safety:** anti-raid, impersonator alerts, scammer alerts, suspicious-word
  detection, regex rules, and member or message audit notifications.
- **Moderation and server operations:** bulk actions, duplicate detection, emoji and
  member lookup, role management, permission toggles, voice tools, and thread bumping.
- **Content automation:** scheduled posts, RSS feeds, auto replies, role messages,
  message copying or proxying, affiliate cleanup, and broadcast alerts.
- **Web helpers and integrations:** invite generation, webhook mapping, and reusable X
  feed routing, each of which must justify a separate HTTP or third-party surface.

#### Initial Rewrite Scope

- A clean Nova Discord bot workspace with Docker packaging.
- Typed, validated runtime configuration with clear feature-level enablement.
- A small event and command kernel with explicit module registration.
- Structured logging, graceful shutdown, readiness, and liveness behavior.
- A documented legacy feature matrix that marks each capability retain, redesign,
  replace, defer, or remove before it is implemented.
- Representative safety and content modules that prove the architecture before breadth.
- Operator alerts through ntfy, Telegram, Discord, email, and other services when the
  bot can't sign in, drops off Discord, comes back, or a job gives up.

### Explicit Non-Goals

- Porting all 22 legacy configuration sections line by line.
- Preserving old configuration keys when a clearer migration can be documented.
- Requesting every privileged gateway intent for features that are not enabled.
- Recreating the existing Express or EJS helpers before their use cases are re-approved.
- Shipping social integrations whose APIs, terms, or maintenance burden have not been
  re-evaluated.
- Market data, such as gas prices, earnings calendars, or trending symbols.
- Supporting hosted multi-tenant bot operation in the initial self-hosted architecture.

## Product Design

### Core Capabilities

The initial product combines a modular event and command kernel, typed feature
configuration, community-safety and content modules, external provider adapters,
structured operations with operator alerts, and a reproducible self-hosted appliance.

### User Experience

Discord remains the primary user interface. Operators receive actionable startup and
health information, while members and moderators interact through native Discord
commands, components, permissions, messages, and threads.

## Positioning

### Differentiators

| Stonker Bot for Discord                                      | Generic bot collections                                    |
|--------------------------------------------------------------|------------------------------------------------------------|
| One modular operating model for a whole community            | Separate bots with unrelated permissions and configuration |
| Safety and impersonation workflows treated as core concerns  | General moderation features without safety workflows       |
| Capabilities register only when explicitly enabled           | Broad permissions and handlers commonly enabled by default |
| Legacy breadth is curated through an explicit feature matrix | Feature count is treated as the primary measure of value   |

## Risks and Future

### Open Questions

The migration workshop should decide:

- Which legacy capabilities are still used and who depends on each one.
- Whether the first release targets one configured guild or a multi-guild architecture.
- Which interactions become application commands, message components, or scheduled jobs.
- The configuration format, persistence needs, and migration path from `config.json`.
- Which RSS, webhook, and social providers remain viable.
- Whether any web surface survives and, if so, whether it belongs beside the bot process.
- The minimum privileged intents and Discord permissions for each retained module.

## Marketing Copy

### Tagline

Run a safer, sharper community from one focused Discord bot.

### Elevator Pitch

Stonker Bot for Discord is a self-hosted, all-purpose operations bot for Discord communities.
It brings moderation, community safety, content automation, and optional integrations into
a modular service that operators can understand. The Nova rewrite favors least privilege,
observable behavior, and a focused capability set over a sprawling configuration file.

### Key Features

- **Community safety modules** - Coordinate raid, impersonation, scam, and suspicious
  activity workflows with explicit operator controls.
- **Practical moderation tools** - Give trusted roles focused actions for recurring
  server-management work.
- **Content automation** - Schedule and route approved content without assembling
  several unrelated bots.
- **Optional integrations** - Add selected, supportable feeds, such as RSS, without
  making external APIs a requirement for the core bot.
- **Container-native operation** - Deploy a health-aware bot through a reproducible
  Docker image with externalized state and secrets.
- **Operator alerts** - Tell operators through ntfy, Telegram, Discord, email, and other
  services when the bot can't sign in, drops off Discord, comes back, or a job gives up.

## Glossary

| Term                     | Definition                                                                                                              |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Capability               | One independently enabled unit of bot behavior, such as RSS delivery or impersonation alerts.                           |
| Feature matrix           | The migration inventory classifying each legacy capability as retain, redesign, replace, defer, or remove.              |
| Operator                 | A person responsible for configuring, deploying, and supervising the bot.                                               |
| Trusted role             | A Discord role explicitly authorized to invoke a privileged bot action.                                                 |
| Event kernel             | The small layer that starts the client and registers enabled commands, events, and jobs.                                |
| Notification destination | One place operator alerts go, such as an ntfy topic, a Discord webhook, or an email inbox, with the events it receives. |
| Legacy bot               | Archived behavior and migration fixtures retained where useful; removed provider code remains in Git history.           |

## Additional Vision Notes

### Current Context

> This is the product direction for the ground-up Nova rewrite. The legacy bot is a
> behavior inventory, not the architecture of the replacement.
