# Stonker Bot for Discord appliance

The bot ships as one Docker image and one container. The runtime uses the pinned Debian Trixie slim base, and s6-overlay keeps each responsibility in a separate process:

```text
s6 (PID 1)
├── PostgreSQL 17
├── schema migration (one-shot startup job)
├── Discord Gateway bot
├── web service (control panel, its JSON API, and the public pages)
└── durable background worker
```

The bot, the web service, the worker, and PostgreSQL don't share an application process. PostgreSQL, the web service, and the worker are critical: if one of them exits with an error, the whole appliance stops and Docker restarts the container. If the bot exits, s6 restarts only the bot, so you can still use the control panel to fix its settings.

## Configure

Work from the repository root. If `apps/bot/.env` doesn't exist, copy `apps/bot/.env.sample` to it, then set the database password:

```dotenv
POSTGRES_PASSWORD="use-a-unique-password-of-at-least-16-characters"
```

That's the only required value. There's no admin username, password, or Discord token to put in a file. Set other Compose settings, such as `WEB_PORT`, `PUID`, `PGID`, and `TZ`, in the root `.env` next to `compose.yml`, because the `environment` block in `compose.yml` takes priority over `apps/bot/.env`.

Start the appliance:

```sh
docker compose up --build --detach
docker compose ps
```

## First run

While no account exists, the web service prints a one-time setup code to the container log each time it starts:

```sh
docker compose logs app | grep setup_code_issued
```

The `setupCode` field holds a code like `K7Q2M-XR9TD-P4W8N`. It works for 30 minutes and only once, and each restart prints a new one, so the last matching line is the current code. The code never appears on the control panel's Logs page.

Open `http://<docker-host>:22604/`. The **Set up your account** screen asks for the code (letter case, spaces, and dashes don't matter), a username, and a password of at least 12 characters. That creates the owner account, which can do everything on every server, and signs you in.

Then, in the control panel:

1. Open **Connection** and paste the Bot Token from your application's **Bot** page in the Discord Developer Portal. It's not the Application ID, Public Key, or Client Secret. The appliance encrypts the token before storing it and never shows it again.
2. Select **Start**. The status moves to **Online**, or to **Stopped by an error** with a hint to check the token.
3. Use the **Invite link** under **Add the bot to a server** to add the bot to your Discord server. The server then shows up in the server menu.
4. Set up features under **Features**, and turn each one on with its switch.

Use **Start**, **Stop**, and **Restart** to control the Gateway without restarting the container, the web service, the worker, or PostgreSQL. Saving a new token, saving or switching a feature, and importing settings all make a running bot reconnect on its own. If the token is missing or Discord rejects it, the bot stays idle and shows the problem in the control panel; it doesn't put the appliance into a restart loop.

Feature settings are stored per Discord server in PostgreSQL, keyed by the server's ID, and one bot can serve several servers.

The appliance always requests the Discord `Guilds` Gateway intent and adds other intents only for enabled, valid features. Message-processing features need the privileged **Message Content Intent**, and member features, such as role messages, need the privileged **Server Members Intent**; turn on the matching switch on the application's **Bot** page before turning on those features. Scheduled posts use Discord's REST API from the worker and don't add a Gateway intent.

Scheduled posts run in their configured IANA time zone. Due work goes into PostgreSQL with a fixed deduplication key, and the scheduler cursor moves forward in the same transaction. After worker downtime, the appliance replays at most the previous 24 hours; while the bot is stopped on purpose, the cursor moves forward without queueing messages, so old announcements aren't dumped into the server on the next start.

## Accounts and access

- **Roles** — The owner and administrators add users on **Users** with a role: administrator (everything, including users), operator (features, the bot token, imports, and starting or stopping the bot), or viewer (read-only). Each user sees all servers or only chosen ones.
- **Sign-in** — Username and password, with an optional authenticator app (6-digit codes plus 10 one-time recovery codes) and passkeys. Changing sign-in settings asks for the current password.
- **Limits** — 10 failed sign-in attempts from one address in 15 minutes pause sign-in from that address for up to 15 minutes. Setup codes have their own count.
- **Sessions** — A browser session lasts 24 hours and is stored in PostgreSQL, so restarts don't sign anyone out. The session cookie is HttpOnly and SameSite=Strict, and it's marked Secure when the browser uses HTTPS.
- **Access tokens** — Scripts call the JSON API under `/api/v1` with a personal `dsb_` token in an `Authorization: Bearer` header. Each token acts as its owner, limited to the scopes `bot:control`, `features:read`, `features:write`, and `logs:read`, and it stops working when its owner is suspended or deleted.

Nobody can reset the owner's password or two-factor sign-in from the control panel, so keep the owner's recovery codes somewhere safe, or add a passkey.

## Storage

Compose mounts one named volume, `stonker-data`, at `/data`. “Local Docker volume” means Docker manages the database files on the same machine as the container; it doesn't mean the data is temporary. `docker compose down` keeps it, while `docker compose down --volumes` deletes it for good.

On first boot, the migration job creates `/data/secrets/credential.key`, 32 random bytes with owner-only permissions, while `prepare-postgres` only fixes the owner and permissions of an existing key file and checks its size. The key encrypts the Bot Token, every feature secret (webhook URLs, API keys, signing secrets), and every authenticator app secret. Passwords, passkeys, recovery codes, sessions, and access tokens are stored as hashes or public keys and don't depend on the key.

If the key file is missing when the database already holds secrets, the migration job makes a new key and removes what the old one sealed: the Bot Token, every feature secret, and each authenticator app, which is turned off along with its recovery codes. Feature settings, users, passwords, passkeys, sessions, and access tokens stay. The job logs one `credential_key_replaced` warning (component `migration`, the sentence in `context.message`) that names each removed secret:

```text
No credential key was found at /data/secrets/credential.key, so Stonker Bot for Discord made a new one. These saved secrets were locked with the old key and were removed: the Bot Token, the <Feature> secrets for <Server>, the authenticator app for <username>. Enter them again in the control panel.
```

The control panel then shows **Saved secrets were removed** at the top of every page, with one link per secret (**Enter the Bot Token**, `Enter the <Feature> secrets for <Server>`, **Set up the authenticator app**) and a **Dismiss** button. Entering a secret again takes it off the notice, and **Dismiss** hides the notice while anything not entered again stays removed. When nothing depended on the old key, such as on a fresh install, there's no warning and no notice.

A key file that belongs to another database stops startup instead. The migration job fails with `migration_failed`, so the bot, the web service, and the worker don't start, and every start fails the same way until the key is fixed:

```text
The credential key at /data/secrets/credential.key doesn't belong to this database. Put back the key file this database was created with, or delete /data/secrets/credential.key and restart to make a new key, then enter the saved secrets again.
```

A database dump doesn't contain the key. A new container makes its own key on its first start, and a dump restored into it brings back the old database's key check, so the next start stops with that message. Copy `credential.key` from the old install over `/data/secrets/credential.key` and restart, or delete the new key file to start with a new key and enter the secrets again.

PostgreSQL data files should stay on storage with local filesystem behavior. Back up to a NAS or other remote system with `pg_dump` instead of placing the live PostgreSQL data directory on NFS or SMB:

```sh
docker compose exec --no-TTY --user "${PUID:-1000}:${PGID:-1000}" app sh -c \
  'pg_dump --host=/run/postgresql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=custom' \
  > stonker.dump
```

Store the dump away from the Docker host, keep a copy of `credential.key` with it, and test a restore separately.

## Network and access

The control panel listens on `127.0.0.1` on the Docker host by default, and PostgreSQL is reachable only inside the container. Keep that default for local administration. For remote access, put a TLS reverse proxy or a private VPN in front of the panel; don't expose its plain HTTP port directly.

There's no public-URL setting. The web service reads each request's own address, and it believes `X-Forwarded-For`, `X-Forwarded-Proto`, and `X-Forwarded-Host` only from loopback and private addresses: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `::1`, and `fc00::/7`. A reverse proxy on the same host or Docker network needs no configuration. A request that arrives over HTTPS, directly or through such a proxy, gets Secure cookies.

Passkeys need HTTPS and a domain name, or `localhost`, and each passkey works only at the hostname it was added on. Password and authenticator sign-in work at any address.

Public paths that answer without signing in:

- `/health` and `/ready` — liveness and readiness.
- `/invite` or `/join` (and sub-paths you configure) — the invite page from the Web applications feature, with reCAPTCHA and a limit of 5 invites per 10 minutes per address.
- `/webhooks/…` — signed webhook routes.
- `/media/…`, `/assets/…`, and `/favicon.svg` — invite page images and the built page files.

Invite and webhook paths answer only while an enabled Web applications feature uses them. Every path under `/api/v1` also allows 300 requests per minute per address.

The container uses a read-only root filesystem. Only `/data`, `/run`, and `/tmp` are writable. s6 starts as root so it can prepare the mounted volume, PostgreSQL runs under its own system account, and every Node.js process uses the numeric `PUID` and `PGID` identity (both default to `1000`). Set `TZ` to an installed IANA time zone when `UTC` isn't right.

## Operations

Follow the structured application and PostgreSQL logs:

```sh
docker compose logs --follow app
```

Every service writes one JSON line per event. The control panel's **Logs** page shows the same bot, web, and worker events, with filters and a live view.

The public liveness and readiness routes are `/health` and `/ready`. Docker checks `/ready` automatically. Readiness depends on the web service and PostgreSQL, so a stopped or misconfigured Discord Gateway doesn't make the container unhealthy. The Overview page shows the latest bot, web, and worker heartbeats stored in PostgreSQL.

The bot always runs with `shardCount: 1`, even for a server with 50,000 to 100,000 members. Discord shards split a bot's list of servers; they don't split one large server across workers. Revisit sharding only if this installation grows across many servers and Discord requires it.
