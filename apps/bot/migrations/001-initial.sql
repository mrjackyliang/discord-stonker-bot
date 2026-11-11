-- Background jobs the worker runs once each, with retries.
CREATE TABLE jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  completed_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dedupe_key TEXT,
  CONSTRAINT jobs_attempts_check CHECK (attempts >= 0),
  CONSTRAINT jobs_payload_object_check CHECK (jsonb_typeof(payload) = 'object'),
  CONSTRAINT jobs_status_check CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  CONSTRAINT jobs_dedupe_key_check CHECK (
    dedupe_key IS NULL
    OR CHAR_LENGTH(dedupe_key) BETWEEN 1 AND 512
  )
);

CREATE INDEX jobs_available_index
  ON jobs (available_at, id)
  WHERE status = 'pending';

CREATE INDEX jobs_stale_running_index
  ON jobs (locked_at, id)
  WHERE status = 'running';

CREATE UNIQUE INDEX jobs_dedupe_key_unique_index
  ON jobs (dedupe_key)
  WHERE dedupe_key IS NOT NULL;

CREATE TABLE scheduler_cursors (
  scheduler_key TEXT PRIMARY KEY,
  scanned_through TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT scheduler_cursors_key_check CHECK (
    CHAR_LENGTH(scheduler_key) BETWEEN 1 AND 128
  )
);

CREATE TABLE audit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  guild_id TEXT NOT NULL,
  actor_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT audit_events_event_data_object_check CHECK (jsonb_typeof(event_data) = 'object')
);

CREATE INDEX audit_events_guild_created_index
  ON audit_events (guild_id, created_at DESC);

-- What the bot, the control panel, and the worker report about themselves.
CREATE TABLE runtime_heartbeats (
  component TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT runtime_heartbeats_component_check CHECK (component IN ('bot', 'web', 'worker')),
  CONSTRAINT runtime_heartbeats_details_object_check CHECK (jsonb_typeof(details) = 'object')
);

CREATE TABLE runtime_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  component TEXT NOT NULL,
  level TEXT NOT NULL,
  event TEXT NOT NULL,
  context JSONB NOT NULL DEFAULT '{}'::JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT runtime_logs_component_check CHECK (component IN ('bot', 'web', 'worker')),
  CONSTRAINT runtime_logs_level_check CHECK (level IN ('debug', 'info', 'warn', 'error')),
  CONSTRAINT runtime_logs_event_check CHECK (CHAR_LENGTH(event) BETWEEN 1 AND 160),
  CONSTRAINT runtime_logs_context_object_check CHECK (jsonb_typeof(context) = 'object')
);

CREATE INDEX runtime_logs_component_id_index
  ON runtime_logs (component, id DESC);

CREATE INDEX runtime_logs_occurred_index
  ON runtime_logs (occurred_at);

-- Debug logging is one switch for the bot, the control panel, and the worker. Each process
-- reads it every few seconds, so a change reaches all three without a restart.
CREATE TABLE runtime_settings (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE,
  debug_logging BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT runtime_settings_singleton_check CHECK (singleton = TRUE)
);

INSERT INTO runtime_settings (singleton)
VALUES (TRUE)
ON CONFLICT (singleton) DO NOTHING;

-- Whether the bot should be connected, and the Bot Token it signs in with.
CREATE TABLE bot_runtime_control (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE,
  desired_state TEXT NOT NULL DEFAULT 'stopped',
  discord_token_ciphertext TEXT,
  generation BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  discord_application_id TEXT,
  CONSTRAINT bot_runtime_control_singleton_check CHECK (singleton = TRUE),
  CONSTRAINT bot_runtime_control_desired_state_check CHECK (desired_state IN ('running', 'stopped')),
  CONSTRAINT bot_runtime_control_generation_check CHECK (generation >= 0),
  CONSTRAINT bot_runtime_control_discord_application_id_check CHECK (
    discord_application_id IS NULL
    OR discord_application_id ~ '^[0-9]{17,20}$'
  )
);

INSERT INTO bot_runtime_control (singleton)
VALUES (TRUE)
ON CONFLICT (singleton) DO NOTHING;

-- Discord servers, channels, and roles the bot has seen.
CREATE TABLE discord_servers (
  guild_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_hash TEXT,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT discord_servers_guild_id_check CHECK (guild_id ~ '^[0-9]{17,20}$'),
  CONSTRAINT discord_servers_name_check CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 100),
  CONSTRAINT discord_servers_icon_hash_check CHECK (
    icon_hash IS NULL
    OR CHAR_LENGTH(icon_hash) BETWEEN 1 AND 256
  )
);

CREATE TABLE discord_channels (
  guild_id TEXT NOT NULL REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  name TEXT NOT NULL,
  channel_type INTEGER NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, channel_id),
  CONSTRAINT discord_channels_channel_id_check CHECK (channel_id ~ '^[0-9]{17,20}$'),
  CONSTRAINT discord_channels_name_check CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 100)
);

CREATE INDEX discord_channels_guild_name_index
  ON discord_channels (guild_id, available DESC, LOWER(name), channel_id);

CREATE TABLE discord_roles (
  guild_id TEXT NOT NULL REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  role_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role_position INTEGER NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, role_id),
  CONSTRAINT discord_roles_role_id_check CHECK (role_id ~ '^[0-9]{17,20}$'),
  CONSTRAINT discord_roles_name_check CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 100),
  CONSTRAINT discord_roles_position_check CHECK (role_position >= 0)
);

CREATE INDEX discord_roles_guild_position_index
  ON discord_roles (guild_id, available DESC, role_position DESC, LOWER(name), role_id);

-- Each server's settings: its time zone, each feature's switch, and each feature's settings
-- stored one value per JSON Pointer path. Secrets are sealed with the credential key.
CREATE TABLE guild_profiles (
  guild_id TEXT PRIMARY KEY REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  time_zone TEXT NOT NULL DEFAULT 'UTC',
  revision BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guild_profiles_time_zone_check CHECK (CHAR_LENGTH(time_zone) BETWEEN 1 AND 100),
  CONSTRAINT guild_profiles_revision_check CHECK (revision > 0)
);

CREATE TABLE guild_features (
  guild_id TEXT NOT NULL REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  revision BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, feature_key),
  CONSTRAINT guild_features_key_check CHECK (feature_key ~ '^[a-z][a-z0-9-]{0,99}$'),
  CONSTRAINT guild_features_revision_check CHECK (revision > 0)
);

CREATE TABLE guild_feature_values (
  guild_id TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  value_path TEXT NOT NULL,
  value_type TEXT NOT NULL,
  value_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, feature_key, value_path),
  FOREIGN KEY (guild_id, feature_key)
    REFERENCES guild_features (guild_id, feature_key)
    ON DELETE CASCADE,
  CONSTRAINT guild_feature_values_path_check CHECK (
    CHAR_LENGTH(value_path) BETWEEN 1 AND 2048
    AND LEFT(value_path, 1) = '$'
  ),
  CONSTRAINT guild_feature_values_type_check CHECK (
    value_type IN ('array', 'boolean', 'null', 'number', 'object', 'string')
  ),
  CONSTRAINT guild_feature_values_text_check CHECK (
    (value_type IN ('array', 'null', 'object') AND value_text IS NULL)
    OR (value_type IN ('boolean', 'number', 'string') AND value_text IS NOT NULL)
  )
);

CREATE TABLE guild_secrets (
  guild_id TEXT NOT NULL,
  secret_key TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, secret_key),
  CONSTRAINT guild_secrets_key_check CHECK (CHAR_LENGTH(secret_key) BETWEEN 1 AND 512),
  CONSTRAINT guild_secrets_ciphertext_check CHECK (CHAR_LENGTH(ciphertext) BETWEEN 1 AND 4096)
);

CREATE TABLE legacy_imports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  guild_id TEXT NOT NULL,
  report JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT legacy_imports_report_object_check CHECK (jsonb_typeof(report) = 'object')
);

CREATE INDEX legacy_imports_guild_created_index
  ON legacy_imports (guild_id, created_at DESC);

CREATE TABLE rss_feed_cursors (
  guild_id TEXT NOT NULL,
  feed_key TEXT NOT NULL,
  etag TEXT,
  last_modified TEXT,
  seen_items JSONB NOT NULL DEFAULT '[]'::JSONB,
  initialized BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, feed_key),
  CONSTRAINT rss_feed_cursors_feed_key_check CHECK (
    CHAR_LENGTH(feed_key) BETWEEN 1 AND 128
  ),
  CONSTRAINT rss_feed_cursors_etag_check CHECK (
    etag IS NULL
    OR CHAR_LENGTH(etag) <= 1024
  ),
  CONSTRAINT rss_feed_cursors_last_modified_check CHECK (
    last_modified IS NULL
    OR CHAR_LENGTH(last_modified) <= 256
  ),
  CONSTRAINT rss_feed_cursors_seen_items_array_check CHECK (
    jsonb_typeof(seen_items) = 'array'
  )
);

-- Each server's invite page and the images uploaded for it.
CREATE TABLE guild_invite_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guild_invite_images_content_type_check CHECK (
    content_type IN ('image/gif', 'image/jpeg', 'image/png', 'image/webp')
  ),
  CONSTRAINT guild_invite_images_size_check CHECK (OCTET_LENGTH(data) BETWEEN 1 AND 2097152)
);

CREATE INDEX guild_invite_images_guild_index
  ON guild_invite_images (guild_id, created_at);

CREATE TABLE guild_invite_pages (
  guild_id TEXT PRIMARY KEY REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  accent_color TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT 'server',
  logo_image_id UUID REFERENCES guild_invite_images (id) ON DELETE SET NULL,
  banner_image_id UUID REFERENCES guild_invite_images (id) ON DELETE SET NULL,
  show_member_count BOOLEAN NOT NULL DEFAULT TRUE,
  show_boost_tier BOOLEAN NOT NULL DEFAULT FALSE,
  button_label TEXT NOT NULL,
  footer_text TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'system',
  revision BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guild_invite_pages_title_check CHECK (CHAR_LENGTH(title) BETWEEN 1 AND 100),
  CONSTRAINT guild_invite_pages_description_check CHECK (CHAR_LENGTH(description) <= 300),
  CONSTRAINT guild_invite_pages_accent_color_check CHECK (accent_color ~ '^#[0-9a-f]{6}$'),
  CONSTRAINT guild_invite_pages_logo_check CHECK (logo IN ('custom', 'none', 'server')),
  CONSTRAINT guild_invite_pages_button_label_check CHECK (CHAR_LENGTH(button_label) BETWEEN 1 AND 40),
  CONSTRAINT guild_invite_pages_footer_text_check CHECK (CHAR_LENGTH(footer_text) <= 500),
  CONSTRAINT guild_invite_pages_theme_check CHECK (theme IN ('dark', 'light', 'system')),
  CONSTRAINT guild_invite_pages_revision_check CHECK (revision > 0)
);

-- Control panel accounts, their server access, and how they sign in.
CREATE TABLE panel_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  all_guilds BOOLEAN NOT NULL DEFAULT FALSE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT panel_users_username_check CHECK (
    username ~ '^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$'
  ),
  CONSTRAINT panel_users_password_hash_check CHECK (
    CHAR_LENGTH(password_hash) BETWEEN 20 AND 512
  ),
  CONSTRAINT panel_users_role_check CHECK (
    role IN ('owner', 'administrator', 'operator', 'viewer')
  )
);

CREATE UNIQUE INDEX panel_users_username_unique_index
  ON panel_users (LOWER(username));

CREATE UNIQUE INDEX panel_users_single_owner_index
  ON panel_users ((role))
  WHERE role = 'owner';

CREATE TABLE panel_user_guild_access (
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  guild_id TEXT NOT NULL REFERENCES discord_servers (guild_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, guild_id)
);

CREATE TABLE panel_setup_claims (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT panel_setup_claims_singleton_check CHECK (singleton = TRUE),
  CONSTRAINT panel_setup_claims_code_hash_check CHECK (code_hash ~ '^[a-f0-9]{64}$')
);

CREATE TABLE panel_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  csrf_token_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  CONSTRAINT panel_sessions_token_hash_check CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT panel_sessions_csrf_hash_check CHECK (csrf_token_hash ~ '^[a-f0-9]{64}$')
);

CREATE INDEX panel_sessions_user_index
  ON panel_sessions (user_id, expires_at DESC);

CREATE TABLE panel_sign_in_challenges (
  challenge_hash TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  failures INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT panel_sign_in_challenges_hash_check CHECK (challenge_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT panel_sign_in_challenges_failures_check CHECK (failures >= 0)
);

CREATE INDEX panel_sign_in_challenges_expires_index
  ON panel_sign_in_challenges (expires_at);

CREATE TABLE panel_passkeys (
  credential_id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  public_key BYTEA NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  transports TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  device_type TEXT NOT NULL,
  backed_up BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  rp_id TEXT,
  CONSTRAINT panel_passkeys_name_check CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 100),
  CONSTRAINT panel_passkeys_counter_check CHECK (counter >= 0)
);

CREATE INDEX panel_passkeys_user_index
  ON panel_passkeys (user_id, created_at);

CREATE TABLE panel_webauthn_ceremonies (
  id_hash TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  user_id BIGINT REFERENCES panel_users (id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  name TEXT,
  rp_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT panel_webauthn_ceremonies_id_hash_check CHECK (id_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT panel_webauthn_ceremonies_kind_check CHECK (kind IN ('authentication', 'registration')),
  CONSTRAINT panel_webauthn_ceremonies_name_check CHECK (
    name IS NULL
    OR CHAR_LENGTH(name) BETWEEN 1 AND 80
  )
);

CREATE INDEX panel_webauthn_ceremonies_expires_index
  ON panel_webauthn_ceremonies (expires_at);

CREATE TABLE panel_totp_credentials (
  user_id BIGINT PRIMARY KEY REFERENCES panel_users (id) ON DELETE CASCADE,
  secret_ciphertext TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_step BIGINT,
  CONSTRAINT panel_totp_credentials_last_used_step_check CHECK (
    last_used_step IS NULL
    OR last_used_step >= 0
  )
);

CREATE TABLE panel_totp_enrollments (
  user_id BIGINT PRIMARY KEY REFERENCES panel_users (id) ON DELETE CASCADE,
  secret_ciphertext TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE panel_recovery_codes (
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, code_hash),
  CONSTRAINT panel_recovery_codes_hash_check CHECK (code_hash ~ '^[a-f0-9]{64}$')
);

CREATE TABLE panel_api_tokens (
  id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  scopes TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  CONSTRAINT panel_api_tokens_id_check CHECK (id ~ '^tok-[a-f0-9]{16}$'),
  CONSTRAINT panel_api_tokens_name_check CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 80),
  CONSTRAINT panel_api_tokens_hash_check CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT panel_api_tokens_scopes_check CHECK (
    CARDINALITY(scopes) BETWEEN 1 AND 4
    AND scopes <@ ARRAY['bot:control', 'features:read', 'features:write', 'logs:read']::TEXT[]
  )
);

CREATE UNIQUE INDEX panel_api_tokens_user_name_unique_index
  ON panel_api_tokens (user_id, LOWER(name));

-- Notification destinations: where alerts go and which events each one hears about. Secret
-- fields are sealed with the credential key in one value, and their names stay readable so a
-- lost key can say which ones to enter again.
CREATE TABLE notification_targets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]'::JSONB,
  settings JSONB NOT NULL DEFAULT '{}'::JSONB,
  secret_fields JSONB NOT NULL DEFAULT '[]'::JSONB,
  missing_secrets JSONB NOT NULL DEFAULT '[]'::JSONB,
  secrets_ciphertext TEXT,
  last_attempt_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notification_targets_name_check CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 80),
  CONSTRAINT notification_targets_service_check CHECK (service IN ('apprise', 'discord', 'email', 'gotify', 'matrix', 'ntfy', 'ntfy-reverse-proxy', 'pushover', 'slack', 'telegram', 'webhook')),
  CONSTRAINT notification_targets_events_check CHECK (jsonb_typeof(events) = 'array'),
  CONSTRAINT notification_targets_settings_check CHECK (jsonb_typeof(settings) = 'object'),
  CONSTRAINT notification_targets_secret_fields_check CHECK (jsonb_typeof(secret_fields) = 'array'),
  CONSTRAINT notification_targets_missing_secrets_check CHECK (jsonb_typeof(missing_secrets) = 'array')
);

CREATE UNIQUE INDEX notification_targets_name_unique_index
  ON notification_targets (LOWER(name));

-- A lost credential key takes the secrets it sealed. The check value catches a key that
-- belongs to another database, and each removed secret stays listed until it is entered
-- again or the notice is dismissed. A destination's notice item goes away with the
-- destination.
CREATE TABLE credential_key_check (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE,
  ciphertext TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT credential_key_check_singleton_check CHECK (singleton = TRUE)
);

CREATE TABLE removed_secrets (
  id BIGSERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  user_id BIGINT REFERENCES panel_users (id) ON DELETE CASCADE,
  guild_id TEXT,
  feature_key TEXT,
  removed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notification_id TEXT REFERENCES notification_targets (id) ON DELETE CASCADE,
  CONSTRAINT removed_secrets_kind_check CHECK (kind IN ('authenticator', 'bot-token', 'feature-secrets', 'notification')),
  CONSTRAINT removed_secrets_owner_check CHECK (
    (kind = 'authenticator' AND user_id IS NOT NULL AND guild_id IS NULL AND feature_key IS NULL AND notification_id IS NULL)
    OR (kind = 'bot-token' AND user_id IS NULL AND guild_id IS NULL AND feature_key IS NULL AND notification_id IS NULL)
    OR (kind = 'feature-secrets' AND user_id IS NULL AND guild_id IS NOT NULL AND feature_key IS NOT NULL AND notification_id IS NULL)
    OR (kind = 'notification' AND user_id IS NULL AND guild_id IS NULL AND feature_key IS NULL AND notification_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX removed_secrets_unique_index
  ON removed_secrets (kind, COALESCE(user_id, 0), COALESCE(guild_id, ''), COALESCE(feature_key, ''), COALESCE(notification_id, ''));

-- A lost-key notice is personal UI state. Keep the underlying recovery record until the
-- secret is restored, while remembering which signed-in users chose to hide that notice.
CREATE TABLE removed_secret_dismissals (
  removed_secret_id BIGINT NOT NULL REFERENCES removed_secrets (id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES panel_users (id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (removed_secret_id, user_id)
);

CREATE INDEX removed_secret_dismissals_user_index
  ON removed_secret_dismissals (user_id);
