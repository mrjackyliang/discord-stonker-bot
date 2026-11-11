import {
  flattenFeatureConfiguration,
  inflateFeatureConfiguration,
} from './feature-storage.js';

import type {
  Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Pool,
  Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Result,
  Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Returns,
  Lib_ConfigurationDatabase_EnsureDiscordServer_FallbackName,
  Lib_ConfigurationDatabase_EnsureDiscordServer_GuildIdentifier,
  Lib_ConfigurationDatabase_EnsureDiscordServer_Name,
  Lib_ConfigurationDatabase_EnsureDiscordServer_Pool,
  Lib_ConfigurationDatabase_EnsureDiscordServer_Returns,
  Lib_ConfigurationDatabase_GetGuildFeature_Configuration,
  Lib_ConfigurationDatabase_GetGuildFeature_FeatureKey,
  Lib_ConfigurationDatabase_GetGuildFeature_FeatureResult,
  Lib_ConfigurationDatabase_GetGuildFeature_FeatureRowResult,
  Lib_ConfigurationDatabase_GetGuildFeature_GuildIdentifier,
  Lib_ConfigurationDatabase_GetGuildFeature_Pool,
  Lib_ConfigurationDatabase_GetGuildFeature_Returns,
  Lib_ConfigurationDatabase_GetGuildFeature_ValueResult,
  Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_GuildIdentifier,
  Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Pool,
  Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Result,
  Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Returns,
  Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_SecretKeys,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Configuration,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentFeatureEnabled,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentFeatureKey,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentRows,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureResult,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Features,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_GuildIdentifier,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Pool,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Returns,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerResult,
  Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRowResult,
  Lib_ConfigurationDatabase_IsRecord_Record,
  Lib_ConfigurationDatabase_IsRecord_Value,
  Lib_ConfigurationDatabase_ListDiscordResources_ChannelResult,
  Lib_ConfigurationDatabase_ListDiscordResources_GuildIdentifier,
  Lib_ConfigurationDatabase_ListDiscordResources_Pool,
  Lib_ConfigurationDatabase_ListDiscordResources_Returns,
  Lib_ConfigurationDatabase_ListDiscordResources_RoleResult,
  Lib_ConfigurationDatabase_ListDiscordServers_Pool,
  Lib_ConfigurationDatabase_ListDiscordServers_Result,
  Lib_ConfigurationDatabase_ListDiscordServers_Returns,
  Lib_ConfigurationDatabase_ListGuildFeatureStates_GuildIdentifier,
  Lib_ConfigurationDatabase_ListGuildFeatureStates_Pool,
  Lib_ConfigurationDatabase_ListGuildFeatureStates_Result,
  Lib_ConfigurationDatabase_ListGuildFeatureStates_Returns,
  Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entries,
  Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Pool,
  Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Returns,
  Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Servers,
  Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Settings,
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Client,
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_GuildIdentifier,
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Pool,
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Returns,
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Revision,
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Settings,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Client,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentResult,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentRevision,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentRow,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Input,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Pool,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Result,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Returns,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_RowResult,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Client,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_CurrentResult,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_CurrentRow,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Enabled,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_FeatureKey,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_GuildIdentifier,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Pool,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Returns,
  Lib_ConfigurationDatabase_SyncDiscordServers_Client,
  Lib_ConfigurationDatabase_SyncDiscordServers_Pool,
  Lib_ConfigurationDatabase_SyncDiscordServers_Returns,
  Lib_ConfigurationDatabase_SyncDiscordServers_Servers,
  Lib_ConfigurationDatabase_WriteFeatureRows_Client,
  Lib_ConfigurationDatabase_WriteFeatureRows_Configuration,
  Lib_ConfigurationDatabase_WriteFeatureRows_FeatureKey,
  Lib_ConfigurationDatabase_WriteFeatureRows_GuildIdentifier,
  Lib_ConfigurationDatabase_WriteFeatureRows_Returns,
  Lib_ConfigurationDatabase_WriteFeatureRows_Rows,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_Client,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_Core,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_CoreValue,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_Entry,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_EntryFeatureKey,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_EntryRawFeature,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_Features,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_FeaturesValue,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_GuildIdentifier,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_RawTimeZone,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_Returns,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionResult,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionRowResult,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_Settings,
  Lib_ConfigurationDatabase_WriteGuildConfiguration_TimeZone,
} from '../types/lib/configuration-database.d.ts';

/**
 * Configuration Database - Ensure Discord Server.
 *
 * Creates the durable server registry row used by configuration and access scopes.
 * A temporary name is replaced when the Gateway later reports Discord metadata.
 *
 * @param {Lib_ConfigurationDatabase_EnsureDiscordServer_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_EnsureDiscordServer_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_EnsureDiscordServer_Name}            [name]          - Name.
 *
 * @returns {Lib_ConfigurationDatabase_EnsureDiscordServer_Returns}
 *
 * @since 4.0.0
 */
export async function ensureDiscordServer(
  pool: Lib_ConfigurationDatabase_EnsureDiscordServer_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_EnsureDiscordServer_GuildIdentifier,
  name?: Lib_ConfigurationDatabase_EnsureDiscordServer_Name,
): Lib_ConfigurationDatabase_EnsureDiscordServer_Returns {
  const fallbackName: Lib_ConfigurationDatabase_EnsureDiscordServer_FallbackName = `Discord server ${guildIdentifier.slice(-4)}`;

  await pool.query(
    'INSERT INTO discord_servers (guild_id, name) VALUES ($1, $2) ON CONFLICT (guild_id) DO UPDATE SET name = CASE WHEN $3::boolean THEN EXCLUDED.name ELSE discord_servers.name END, updated_at = NOW()',
    [
      guildIdentifier,
      name ?? fallbackName,
      name !== undefined,
    ],
  );

  await pool.query(
    'INSERT INTO guild_profiles (guild_id) VALUES ($1) ON CONFLICT (guild_id) DO NOTHING',
    [guildIdentifier],
  );

  return;
}

/**
 * Configuration Database - Count Enabled Guild Features.
 *
 * Counts the features turned on in every server, for the server list.
 * Servers without any enabled feature are left out of the map.
 *
 * @param {Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Pool} pool - Pool.
 *
 * @returns {Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Returns}
 *
 * @since 4.0.0
 */
export async function countEnabledGuildFeatures(
  pool: Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Pool,
): Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Returns {
  const result: Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Result = await pool.query(
    'SELECT guild_id, COUNT(*)::text AS enabled_count FROM guild_features WHERE enabled = TRUE GROUP BY guild_id',
  );

  return new Map(result.rows.map((row) => [
    row['guild_id'],
    Number.parseInt(row['enabled_count'], 10),
  ]));
}

/**
 * Configuration Database - Get Guild Feature.
 *
 * Reads one feature's switch, revision, and configuration for one server.
 * A feature that was never set up returns undefined.
 *
 * @param {Lib_ConfigurationDatabase_GetGuildFeature_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_GetGuildFeature_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_GetGuildFeature_FeatureKey}      featureKey      - Feature key.
 *
 * @returns {Lib_ConfigurationDatabase_GetGuildFeature_Returns}
 *
 * @since 4.0.0
 */
export async function getGuildFeature(
  pool: Lib_ConfigurationDatabase_GetGuildFeature_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_GetGuildFeature_GuildIdentifier,
  featureKey: Lib_ConfigurationDatabase_GetGuildFeature_FeatureKey,
): Lib_ConfigurationDatabase_GetGuildFeature_Returns {
  const featureResult: Lib_ConfigurationDatabase_GetGuildFeature_FeatureResult = await pool.query(
    'SELECT enabled, revision::text, updated_at FROM guild_features WHERE guild_id = $1 AND feature_key = $2',
    [
      guildIdentifier,
      featureKey,
    ],
  );
  const featureRow: Lib_ConfigurationDatabase_GetGuildFeature_FeatureRowResult = featureResult.rows[0];

  if (featureRow === undefined) {
    return undefined;
  }

  const valueResult: Lib_ConfigurationDatabase_GetGuildFeature_ValueResult = await pool.query(
    'SELECT value_path, value_type, value_text FROM guild_feature_values WHERE guild_id = $1 AND feature_key = $2 ORDER BY value_path',
    [
      guildIdentifier,
      featureKey,
    ],
  );
  const configuration: Lib_ConfigurationDatabase_GetGuildFeature_Configuration = (valueResult.rows.length === 0) ? null : inflateFeatureConfiguration(valueResult.rows.map((row) => ({
    path: row['value_path'],
    type: row['value_type'],
    value: row['value_text'] ?? undefined,
  })));

  return {
    configuration,
    enabled: featureRow['enabled'],
    revision: Number.parseInt(featureRow['revision'], 10),
    updatedAt: featureRow['updated_at'].toISOString(),
  };
}

/**
 * Configuration Database - Get Guild Secret Ciphertexts.
 *
 * Loads the stored ciphertext of the named secrets for one server.
 * Names without a stored secret are left out of the map.
 *
 * @param {Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_SecretKeys}      secretKeys      - Secret keys.
 *
 * @returns {Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Returns}
 *
 * @since 4.0.0
 */
export async function getGuildSecretCiphertexts(
  pool: Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_GuildIdentifier,
  secretKeys: Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_SecretKeys,
): Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Returns {
  if (secretKeys.length === 0) {
    return new Map();
  }

  const result: Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Result = await pool.query(
    'SELECT secret_key, ciphertext FROM guild_secrets WHERE guild_id = $1 AND secret_key = ANY($2::text[])',
    [
      guildIdentifier,
      secretKeys,
    ],
  );

  return new Map(result.rows.map((row) => [
    row['secret_key'],
    row['ciphertext'],
  ]));
}

/**
 * Configuration Database - Get Normalized Guild Settings.
 *
 * Reassembles the compatibility object consumed by feature runtimes from
 * normalized server, feature, and typed-value rows.
 *
 * @param {Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_GetNormalizedGuildSettings_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Returns}
 *
 * @since 4.0.0
 */
export async function getNormalizedGuildSettings(
  pool: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_GuildIdentifier,
): Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Returns {
  const serverResult: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerResult = await pool.query(
    'SELECT profile.time_zone FROM discord_servers AS server INNER JOIN guild_profiles AS profile ON profile.guild_id = server.guild_id WHERE server.guild_id = $1',
    [guildIdentifier],
  );
  const serverRow: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRowResult = serverResult.rows[0];

  if (serverRow === undefined) {
    return undefined;
  }

  const featureResult: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureResult = await pool.query(
    'SELECT feature.feature_key, feature.enabled, value.value_path, value.value_type, value.value_text FROM guild_features AS feature LEFT JOIN guild_feature_values AS value ON value.guild_id = feature.guild_id AND value.feature_key = feature.feature_key WHERE feature.guild_id = $1 ORDER BY feature.feature_key, value.value_path',
    [guildIdentifier],
  );
  const features: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Features = {};
  let currentFeatureKey: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentFeatureKey = undefined;
  let currentFeatureEnabled: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentFeatureEnabled = false;
  let currentRows: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentRows = [];

  for (const row of featureResult.rows) {
    if (currentFeatureKey !== undefined && currentFeatureKey !== row['feature_key']) {
      const configuration: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Configuration = inflateFeatureConfiguration(
        currentRows,
      );

      Reflect.set(features, currentFeatureKey, {
        configuration,
        enabled: currentFeatureEnabled,
      });

      currentRows = [];
    }

    currentFeatureKey = row['feature_key'];
    currentFeatureEnabled = row['enabled'];

    if (
      row['value_path'] !== null
      && row['value_type'] !== null
    ) {
      currentRows.push({
        path: row['value_path'],
        type: row['value_type'],
        value: row['value_text'] ?? undefined,
      });
    }
  }

  if (currentFeatureKey !== undefined) {
    const configuration: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Configuration = inflateFeatureConfiguration(
      currentRows,
    );

    Reflect.set(features, currentFeatureKey, {
      configuration,
      enabled: currentFeatureEnabled,
    });
  }

  return {
    core: {
      'time-zone': serverRow['time_zone'],
    },
    features,
    schemaVersion: 2,
  };
}

/**
 * Configuration Database - List Discord Servers.
 *
 * Returns stable Gateway metadata for the server switcher even while the bot is stopped.
 * Available servers sort before installations not present at the latest ready event.
 *
 * @param {Lib_ConfigurationDatabase_ListDiscordServers_Pool} pool - Pool.
 *
 * @returns {Lib_ConfigurationDatabase_ListDiscordServers_Returns}
 *
 * @since 4.0.0
 */
export async function listDiscordServers(
  pool: Lib_ConfigurationDatabase_ListDiscordServers_Pool,
): Lib_ConfigurationDatabase_ListDiscordServers_Returns {
  const result: Lib_ConfigurationDatabase_ListDiscordServers_Result = await pool.query(
    'SELECT guild_id, name, icon_hash, available, last_seen_at FROM discord_servers ORDER BY available DESC, LOWER(name), guild_id',
  );

  return result.rows.map((row) => ({
    available: row['available'],
    guildIdentifier: row['guild_id'],
    iconHash: row['icon_hash'] ?? undefined,
    lastSeenAt: (row['last_seen_at'] === null) ? undefined : row['last_seen_at'].toISOString(),
    name: row['name'],
  }));
}

/**
 * Configuration Database - List Discord Resources.
 *
 * Returns the channels and roles the Gateway last saw, so feature forms can offer pickers.
 * Ones the bot can no longer see stay listed as unavailable for older configurations.
 *
 * @param {Lib_ConfigurationDatabase_ListDiscordResources_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_ListDiscordResources_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_ConfigurationDatabase_ListDiscordResources_Returns}
 *
 * @since 4.0.0
 */
export async function listDiscordResources(
  pool: Lib_ConfigurationDatabase_ListDiscordResources_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_ListDiscordResources_GuildIdentifier,
): Lib_ConfigurationDatabase_ListDiscordResources_Returns {
  const channelResult: Lib_ConfigurationDatabase_ListDiscordResources_ChannelResult = await pool.query(
    'SELECT channel_id, name, channel_type, available FROM discord_channels WHERE guild_id = $1 ORDER BY available DESC, LOWER(name), channel_id',
    [guildIdentifier],
  );
  const roleResult: Lib_ConfigurationDatabase_ListDiscordResources_RoleResult = await pool.query(
    'SELECT role_id, name, role_position, available FROM discord_roles WHERE guild_id = $1 ORDER BY available DESC, role_position DESC, LOWER(name), role_id',
    [guildIdentifier],
  );

  return {
    channels: channelResult.rows.map((row) => ({
      available: row['available'],
      id: row['channel_id'],
      name: row['name'],
      type: row['channel_type'],
    })),
    roles: roleResult.rows.map((row) => ({
      available: row['available'],
      id: row['role_id'],
      name: row['name'],
      position: row['role_position'],
    })),
  };
}

/**
 * Configuration Database - List Guild Feature States.
 *
 * Lists every stored feature of one server with its switch, revision, and last change.
 * Features never saved have no entry.
 *
 * @param {Lib_ConfigurationDatabase_ListGuildFeatureStates_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_ListGuildFeatureStates_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_ConfigurationDatabase_ListGuildFeatureStates_Returns}
 *
 * @since 4.0.0
 */
export async function listGuildFeatureStates(
  pool: Lib_ConfigurationDatabase_ListGuildFeatureStates_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_ListGuildFeatureStates_GuildIdentifier,
): Lib_ConfigurationDatabase_ListGuildFeatureStates_Returns {
  const result: Lib_ConfigurationDatabase_ListGuildFeatureStates_Result = await pool.query(
    'SELECT feature.feature_key, feature.enabled, feature.revision::text AS revision, feature.updated_at, EXISTS (SELECT 1 FROM guild_feature_values AS value WHERE value.guild_id = feature.guild_id AND value.feature_key = feature.feature_key) AS configured FROM guild_features AS feature WHERE feature.guild_id = $1',
    [guildIdentifier],
  );

  return new Map(result.rows.map((row) => [
    row['feature_key'],
    {
      configured: row['configured'],
      enabled: row['enabled'],
      revision: Number.parseInt(row['revision'], 10),
      updatedAt: row['updated_at'].toISOString(),
    },
  ]));
}

/**
 * Configuration Database - List Normalized Guild Settings.
 *
 * Loads every known server configuration for multi-server Gateway and worker startup.
 * Servers without feature rows remain represented by an empty compatibility object.
 *
 * @param {Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Pool} pool - Pool.
 *
 * @returns {Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Returns}
 *
 * @since 4.0.0
 */
export async function listNormalizedGuildSettings(
  pool: Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Pool,
): Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Returns {
  const servers: Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Servers = await listDiscordServers(pool);
  const entries: Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entries = [];

  for (const server of servers) {
    const settings: Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Settings = await getNormalizedGuildSettings(
      pool,
      server['guildIdentifier'],
    );

    if (settings !== undefined) {
      entries.push({
        guildIdentifier: server['guildIdentifier'],
        settings,
      });
    }
  }

  return entries;
}

/**
 * Configuration Database - Replace Guild Configuration.
 *
 * Converts a legacy compatibility object into normalized profile and feature rows.
 * This remains only as a migration boundary; the panel never exposes the object directly.
 *
 * @param {Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_ReplaceGuildConfiguration_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Settings}        settings        - Settings.
 *
 * @returns {Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Returns}
 *
 * @since 4.0.0
 */
export async function replaceGuildConfiguration(
  pool: Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_ReplaceGuildConfiguration_GuildIdentifier,
  settings: Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Settings,
): Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Returns {
  const client: Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const revision: Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Revision = await writeGuildConfiguration(
      client,
      guildIdentifier,
      settings,
    );

    await client.query('COMMIT');

    return revision;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Configuration Database - Write Guild Configuration.
 *
 * Replaces normalized profile and feature rows on a caller-owned transaction.
 * Legacy import can therefore combine configuration and credential writes atomically.
 *
 * @param {Lib_ConfigurationDatabase_WriteGuildConfiguration_Client}          client          - Client.
 * @param {Lib_ConfigurationDatabase_WriteGuildConfiguration_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_WriteGuildConfiguration_Settings}        settings        - Settings.
 *
 * @returns {Lib_ConfigurationDatabase_WriteGuildConfiguration_Returns}
 *
 * @since 4.0.0
 */
export async function writeGuildConfiguration(
  client: Lib_ConfigurationDatabase_WriteGuildConfiguration_Client,
  guildIdentifier: Lib_ConfigurationDatabase_WriteGuildConfiguration_GuildIdentifier,
  settings: Lib_ConfigurationDatabase_WriteGuildConfiguration_Settings,
): Lib_ConfigurationDatabase_WriteGuildConfiguration_Returns {
  await ensureDiscordServer(client, guildIdentifier);

  const coreValue: Lib_ConfigurationDatabase_WriteGuildConfiguration_CoreValue = settings['core'];
  const core: Lib_ConfigurationDatabase_WriteGuildConfiguration_Core = (isRecord(coreValue) === true) ? coreValue : {};
  const rawTimeZone: Lib_ConfigurationDatabase_WriteGuildConfiguration_RawTimeZone = core['time-zone'];
  const timeZone: Lib_ConfigurationDatabase_WriteGuildConfiguration_TimeZone = (
    typeof rawTimeZone === 'string'
    && rawTimeZone.trim() !== ''
  ) ? rawTimeZone.trim() : 'UTC';
  const revisionResult: Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionResult = await client.query(
    'UPDATE guild_profiles SET time_zone = $2, revision = revision + 1, updated_at = NOW() WHERE guild_id = $1 RETURNING revision::text',
    [
      guildIdentifier,
      timeZone,
    ],
  );

  await client.query(
    'DELETE FROM guild_features WHERE guild_id = $1',
    [guildIdentifier],
  );

  const featuresValue: Lib_ConfigurationDatabase_WriteGuildConfiguration_FeaturesValue = settings['features'];
  const features: Lib_ConfigurationDatabase_WriteGuildConfiguration_Features = (isRecord(featuresValue) === true) ? featuresValue : {};

  for (const entry of Object.entries(features)) {
    const typedEntry: Lib_ConfigurationDatabase_WriteGuildConfiguration_Entry = entry;
    const featureKey: Lib_ConfigurationDatabase_WriteGuildConfiguration_EntryFeatureKey = typedEntry[0];
    const rawFeature: Lib_ConfigurationDatabase_WriteGuildConfiguration_EntryRawFeature = typedEntry[1];

    if (featureKey === 'x-feeds' || isRecord(rawFeature) === false) {
      continue;
    }

    await client.query(
      'INSERT INTO guild_features (guild_id, feature_key, enabled) VALUES ($1, $2, $3)',
      [
        guildIdentifier,
        featureKey,
        rawFeature['enabled'] === true,
      ],
    );

    await writeFeatureRows(
      client,
      guildIdentifier,
      featureKey as Lib_ConfigurationDatabase_WriteFeatureRows_FeatureKey,
      rawFeature['configuration'] ?? {},
    );
  }

  await client.query(
    'UPDATE bot_runtime_control SET generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE',
  );

  const revisionRow: Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionRowResult = revisionResult.rows[0];

  if (revisionRow === undefined) {
    throw new Error('PostgreSQL did not return a guild profile revision.');
  }

  return Number.parseInt(revisionRow['revision'], 10);
}

/**
 * Configuration Database - Save Guild Feature Configuration.
 *
 * Replaces one feature's configuration and stores its new secrets in a single transaction.
 * Saves to one server run one at a time, so a stale revision is always caught.
 * Secrets no feature references any more are deleted.
 *
 * @param {Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Pool}  pool  - Pool.
 * @param {Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Input} input - Input.
 *
 * @returns {Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Returns}
 *
 * @since 4.0.0
 */
export async function saveGuildFeatureConfiguration(
  pool: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Pool,
  input: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Input,
): Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Returns {
  const client: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'SELECT guild_id FROM discord_servers WHERE guild_id = $1 FOR UPDATE',
      [input['guildIdentifier']],
    );

    const currentResult: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentResult = await client.query(
      'SELECT revision::text FROM guild_features WHERE guild_id = $1 AND feature_key = $2 FOR UPDATE',
      [
        input['guildIdentifier'],
        input['featureKey'],
      ],
    );
    const currentRow: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentRow = currentResult.rows[0];
    const currentRevision: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentRevision = (currentRow === undefined) ? 0 : Number.parseInt(currentRow['revision'], 10);

    if (currentRevision !== input['expectedRevision']) {
      await client.query('ROLLBACK');

      return {
        revision: currentRevision,
        status: 'revision-conflict',
      };
    }

    const result: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Result = await client.query(
      'INSERT INTO guild_features (guild_id, feature_key, enabled, revision, updated_at) VALUES ($1, $2, FALSE, 1, NOW()) ON CONFLICT (guild_id, feature_key) DO UPDATE SET revision = guild_features.revision + 1, updated_at = NOW() RETURNING revision::text',
      [
        input['guildIdentifier'],
        input['featureKey'],
      ],
    );

    await client.query(
      'DELETE FROM guild_feature_values WHERE guild_id = $1 AND feature_key = $2',
      [
        input['guildIdentifier'],
        input['featureKey'],
      ],
    );

    await writeFeatureRows(client, input['guildIdentifier'], input['featureKey'], input['configuration']);

    await client.query(
      'DELETE FROM removed_secrets WHERE kind = \'feature-secrets\' AND guild_id = $1 AND feature_key = $2',
      [
        input['guildIdentifier'],
        input['featureKey'],
      ],
    );

    for (const secret of input['secrets']) {
      await client.query(
        'INSERT INTO guild_secrets (guild_id, secret_key, ciphertext, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (guild_id, secret_key) DO UPDATE SET ciphertext = EXCLUDED.ciphertext, updated_at = NOW()',
        [
          input['guildIdentifier'],
          secret['key'],
          secret['ciphertext'],
        ],
      );
    }

    await client.query(
      'DELETE FROM guild_secrets WHERE guild_id = $1 AND secret_key NOT IN (SELECT value_text FROM guild_feature_values WHERE guild_id = $1 AND value_type = \'string\' AND value_text IS NOT NULL AND value_path LIKE \'%/$secret\')',
      [input['guildIdentifier']],
    );

    await client.query(
      'UPDATE bot_runtime_control SET generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE',
    );

    const row: Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_RowResult = result.rows[0];

    if (row === undefined) {
      throw new Error('PostgreSQL did not return a feature revision.');
    }

    await client.query('COMMIT');

    return {
      revision: Number.parseInt(row['revision'], 10),
      status: 'saved',
    };
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Configuration Database - Set Normalized Guild Feature Enabled.
 *
 * Turns one feature on or off without touching its configuration or revision.
 * The bot reloads only when the switch actually changes.
 *
 * @param {Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Pool}            pool            - Pool.
 * @param {Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_FeatureKey}      featureKey      - Feature key.
 * @param {Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Enabled}         enabled         - Enabled.
 *
 * @returns {Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Returns}
 *
 * @since 4.0.0
 */
export async function setNormalizedGuildFeatureEnabled(
  pool: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Pool,
  guildIdentifier: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_GuildIdentifier,
  featureKey: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_FeatureKey,
  enabled: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Enabled,
): Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Returns {
  const client: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currentResult: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_CurrentResult = await client.query(
      'SELECT enabled FROM guild_features WHERE guild_id = $1 AND feature_key = $2 FOR UPDATE',
      [
        guildIdentifier,
        featureKey,
      ],
    );
    const currentRow: Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_CurrentRow = currentResult.rows[0];

    if (currentRow === undefined || currentRow['enabled'] === enabled) {
      await client.query('ROLLBACK');

      return (currentRow === undefined) ? 'missing' : 'unchanged';
    }

    await client.query(
      'UPDATE guild_features SET enabled = $3, updated_at = NOW() WHERE guild_id = $1 AND feature_key = $2',
      [
        guildIdentifier,
        featureKey,
        enabled,
      ],
    );

    await client.query(
      'UPDATE bot_runtime_control SET generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE',
    );

    await client.query('COMMIT');

    return 'changed';
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Configuration Database - Sync Discord Servers.
 *
 * Records every server visible to the current bot account and marks prior
 * installations unavailable without deleting their retained configuration.
 *
 * @param {Lib_ConfigurationDatabase_SyncDiscordServers_Pool}    pool    - Pool.
 * @param {Lib_ConfigurationDatabase_SyncDiscordServers_Servers} servers - Servers.
 *
 * @returns {Lib_ConfigurationDatabase_SyncDiscordServers_Returns}
 *
 * @since 4.0.0
 */
export async function syncDiscordServers(
  pool: Lib_ConfigurationDatabase_SyncDiscordServers_Pool,
  servers: Lib_ConfigurationDatabase_SyncDiscordServers_Servers,
): Lib_ConfigurationDatabase_SyncDiscordServers_Returns {
  const client: Lib_ConfigurationDatabase_SyncDiscordServers_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE discord_servers SET available = FALSE, updated_at = NOW()',
    );

    await client.query(
      'UPDATE discord_channels SET available = FALSE, updated_at = NOW()',
    );

    await client.query(
      'UPDATE discord_roles SET available = FALSE, updated_at = NOW()',
    );

    for (const server of servers) {
      await client.query(
        'INSERT INTO discord_servers (guild_id, name, icon_hash, available, joined_at, last_seen_at, updated_at) VALUES ($1, $2, $3, TRUE, NOW(), NOW(), NOW()) ON CONFLICT (guild_id) DO UPDATE SET name = EXCLUDED.name, icon_hash = EXCLUDED.icon_hash, available = TRUE, last_seen_at = NOW(), updated_at = NOW()',
        [
          server['guildIdentifier'],
          server['name'],
          server['iconHash'] ?? null,
        ],
      );

      await client.query(
        'INSERT INTO guild_profiles (guild_id) VALUES ($1) ON CONFLICT (guild_id) DO NOTHING',
        [server['guildIdentifier']],
      );

      for (const channel of server['channels']) {
        await client.query(
          'INSERT INTO discord_channels (guild_id, channel_id, name, channel_type, available, updated_at) VALUES ($1, $2, $3, $4, TRUE, NOW()) ON CONFLICT (guild_id, channel_id) DO UPDATE SET name = EXCLUDED.name, channel_type = EXCLUDED.channel_type, available = TRUE, updated_at = NOW()',
          [
            server['guildIdentifier'],
            channel['channelIdentifier'],
            channel['name'],
            channel['type'],
          ],
        );
      }

      for (const role of server['roles']) {
        await client.query(
          'INSERT INTO discord_roles (guild_id, role_id, name, role_position, available, updated_at) VALUES ($1, $2, $3, $4, TRUE, NOW()) ON CONFLICT (guild_id, role_id) DO UPDATE SET name = EXCLUDED.name, role_position = EXCLUDED.role_position, available = TRUE, updated_at = NOW()',
          [
            server['guildIdentifier'],
            role['roleIdentifier'],
            role['name'],
            role['position'],
          ],
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }

  return;
}

/**
 * Configuration Database - Write Feature Rows.
 *
 * Inserts a prevalidated feature configuration as normalized path/value rows.
 * The caller owns the surrounding transaction and any prior-row deletion.
 *
 * @param {Lib_ConfigurationDatabase_WriteFeatureRows_Client}          client          - Client.
 * @param {Lib_ConfigurationDatabase_WriteFeatureRows_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ConfigurationDatabase_WriteFeatureRows_FeatureKey}      featureKey      - Feature key.
 * @param {Lib_ConfigurationDatabase_WriteFeatureRows_Configuration}   configuration   - Configuration.
 *
 * @returns {Lib_ConfigurationDatabase_WriteFeatureRows_Returns}
 *
 * @since 4.0.0
 */
async function writeFeatureRows(
  client: Lib_ConfigurationDatabase_WriteFeatureRows_Client,
  guildIdentifier: Lib_ConfigurationDatabase_WriteFeatureRows_GuildIdentifier,
  featureKey: Lib_ConfigurationDatabase_WriteFeatureRows_FeatureKey,
  configuration: Lib_ConfigurationDatabase_WriteFeatureRows_Configuration,
): Lib_ConfigurationDatabase_WriteFeatureRows_Returns {
  const rows: Lib_ConfigurationDatabase_WriteFeatureRows_Rows = flattenFeatureConfiguration(configuration);

  for (const row of rows) {
    await client.query(
      'INSERT INTO guild_feature_values (guild_id, feature_key, value_path, value_type, value_text, updated_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [
        guildIdentifier,
        featureKey,
        row['path'],
        row['type'],
        row['value'] ?? null,
      ],
    );
  }

  return;
}

/**
 * Configuration Database - Is Record.
 *
 * Narrows migration objects before their keys become normalized rows.
 * Arrays are rejected because feature maps require named properties.
 *
 * @param {Lib_ConfigurationDatabase_IsRecord_Value} value - Value.
 *
 * @returns {Lib_ConfigurationDatabase_IsRecord_Returns}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_ConfigurationDatabase_IsRecord_Value,
): value is Lib_ConfigurationDatabase_IsRecord_Record {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}
