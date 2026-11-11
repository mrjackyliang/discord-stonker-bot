import {
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
} from 'discord.js';

import { prepareAntiRaidFeatures } from './lib/anti-raid-features.js';
import { prepareAuditFeatures } from './lib/audit-features.js';
import {
  listNormalizedGuildSettings,
  syncDiscordServers,
} from './lib/configuration-database.js';
import {
  decryptDiscordToken,
  decryptSecret,
  readCredentialKey,
} from './lib/credential-vault.js';
import {
  createDatabasePool,
  getBotRuntimeControl,
  getGuildSecrets,
  recordHeartbeat,
  saveDiscordApplicationIdentifier,
} from './lib/database.js';
import { followDebugLogging } from './lib/debug-logging.js';
import { timedPool, watchDiscordDebug } from './lib/debug-timing.js';
import { prepareGatewayFeatures } from './lib/gateway-features.js';
import { prepareImpersonatorFeatures } from './lib/impersonator-features.js';
import {
  configureLogPersistence,
  getErrorMessage,
  writeLog,
} from './lib/logger.js';
import { prepareMessageFeatures } from './lib/message-features.js';
import { prepareMessageRoutingFeatures } from './lib/message-routing-features.js';
import {
  notifyBotSignInFailed,
  stopGatewayWatch,
  watchGatewayConnection,
} from './lib/notifier.js';
import { prepareRoleSyncFeatures } from './lib/role-sync-features.js';
import {
  readRuntimeConfiguration,
  sleep,
} from './lib/runtime.js';
import { prepareScammerFeatures } from './lib/scammer-features.js';
import { prepareServerToolFeatures } from './lib/server-tool-features.js';

import type {
  Index_CompleteGatewayConnection_Client,
  Index_CompleteGatewayConnection_ClientReadyPromise,
  Index_CompleteGatewayConnection_DiscordToken,
  Index_CompleteGatewayConnection_Returns,
  Index_ConnectGateway_ActiveFeatureKeys,
  Index_ConnectGateway_AntiRaidFeatures,
  Index_ConnectGateway_AuditFeatures,
  Index_ConnectGateway_Client,
  Index_ConnectGateway_ConfigurationErrors,
  Index_ConnectGateway_CredentialKey,
  Index_ConnectGateway_DiscordToken,
  Index_ConnectGateway_EncryptedGuildSecrets,
  Index_ConnectGateway_GatewayFeatures,
  Index_ConnectGateway_GuildRuntimes,
  Index_ConnectGateway_GuildSecretResolver,
  Index_ConnectGateway_GuildSettings,
  Index_ConnectGateway_GuildSettingsEntries,
  Index_ConnectGateway_ImpersonatorFeatures,
  Index_ConnectGateway_Intents,
  Index_ConnectGateway_MessageFeatures,
  Index_ConnectGateway_MessageRoutingFeatures,
  Index_ConnectGateway_Pool,
  Index_ConnectGateway_ReadyUserTag,
  Index_ConnectGateway_Returns,
  Index_ConnectGateway_RoleSyncFeatures,
  Index_ConnectGateway_RuntimeControl,
  Index_ConnectGateway_ScammerFeatures,
  Index_ConnectGateway_ServerToolFeatures,
  Index_ConnectGateway_SynchronizeRegistry,
  Index_ConnectGateway_TimeoutPromise,
  Index_ConnectGateway_TimeoutTimer,
  Index_CreateGuildSecretResolver_Ciphertext,
  Index_CreateGuildSecretResolver_Ciphertexts,
  Index_CreateGuildSecretResolver_CredentialKey,
  Index_CreateGuildSecretResolver_EncryptedSecrets,
  Index_CreateGuildSecretResolver_GuildIdentifier,
  Index_CreateGuildSecretResolver_Purpose,
  Index_CreateGuildSecretResolver_Returns,
  Index_DisconnectGateway_Client,
  Index_DisconnectGateway_Returns,
  Index_Main_Configuration,
  Index_Main_CredentialKey,
  Index_Main_Lifecycle,
  Index_Main_Pool,
  Index_Main_RequestShutdown,
  Index_Main_Returns,
  Index_Main_RuntimeControl,
  Index_Main_ShutdownRequested,
  Index_Main_StopDebugLogging,
  Index_PublishHeartbeat_CurrentTime,
  Index_PublishHeartbeat_Details,
  Index_PublishHeartbeat_Force,
  Index_PublishHeartbeat_Lifecycle,
  Index_PublishHeartbeat_Pool,
  Index_PublishHeartbeat_Returns,
  Index_PublishHeartbeat_Status,
  Index_ReconcileGateway_Configured,
  Index_ReconcileGateway_Connection,
  Index_ReconcileGateway_CredentialKey,
  Index_ReconcileGateway_Lifecycle,
  Index_ReconcileGateway_NextLifecycle,
  Index_ReconcileGateway_Pool,
  Index_ReconcileGateway_Returns,
  Index_ReconcileGateway_RuntimeControl,
  Index_Run_Returns,
  Index_SynchronizeDiscordRegistry_ApplicationIdentifier,
  Index_SynchronizeDiscordRegistry_Client,
  Index_SynchronizeDiscordRegistry_DiscordServers,
  Index_SynchronizeDiscordRegistry_Pool,
  Index_SynchronizeDiscordRegistry_Returns,
  Index_WaitForClientReady_Client,
  Index_WaitForClientReady_Returns,
} from './types/index.d.ts';

/**
 * Index - Gateway Start Timeout Milliseconds.
 *
 * Bounds authentication and guild verification so a network problem cannot
 * prevent later stop or restart requests from reaching the reconciliation loop.
 *
 * @since 4.0.0
 */
const GATEWAY_START_TIMEOUT_MILLISECONDS = 15_000;

/**
 * Index - Heartbeat Interval Milliseconds.
 *
 * Refreshes stable lifecycle states without writing on every database poll.
 * Operators can distinguish a current idle state from a stale process record.
 *
 * @since 4.0.0
 */
const HEARTBEAT_INTERVAL_MILLISECONDS = 30_000;

/**
 * Index - Synchronize Discord Registry.
 *
 * Persists the application identifier plus every visible server, text channel,
 * and assignable role. The panel consumes this cache without requiring broad
 * member enumeration or exposing manual identifier fields.
 *
 * @param {Index_SynchronizeDiscordRegistry_Client} client - Client.
 * @param {Index_SynchronizeDiscordRegistry_Pool}   pool   - Pool.
 *
 * @returns {Index_SynchronizeDiscordRegistry_Returns}
 *
 * @since 4.0.0
 */
async function synchronizeDiscordRegistry(
  client: Index_SynchronizeDiscordRegistry_Client,
  pool: Index_SynchronizeDiscordRegistry_Pool,
): Index_SynchronizeDiscordRegistry_Returns {
  if (client.user === null) {
    throw new Error('Discord registry synchronization requires a ready bot user.');
  }

  const applicationIdentifier: Index_SynchronizeDiscordRegistry_ApplicationIdentifier = (
    client.application === null
  ) ? client.user.id : client.application.id;
  const discordServers: Index_SynchronizeDiscordRegistry_DiscordServers = client.guilds.cache.map((guild) => {
    return {
      channels: guild.channels.cache.filter((channel) => (
        channel.isTextBased()
        || channel.type === ChannelType.GuildForum
        || channel.type === ChannelType.GuildMedia
      )).map((channel) => ({
        channelIdentifier: channel.id,
        name: channel.name,
        type: channel.type,
      })),
      guildIdentifier: guild.id,
      iconHash: guild.icon ?? undefined,
      name: guild.name,
      roles: guild.roles.cache.filter((role) => role.id !== guild.id).map((role) => ({
        name: role.name,
        position: role.position,
        roleIdentifier: role.id,
      })),
    };
  });

  await Promise.all([
    saveDiscordApplicationIdentifier(pool, applicationIdentifier),
    syncDiscordServers(pool, discordServers),
  ]);

  return;
}

/**
 * Index - Complete Gateway Connection.
 *
 * Performs the asynchronous Discord handshake while the caller owns timeout
 * enforcement, server synchronization, and client cleanup.
 *
 * @param {Index_CompleteGatewayConnection_Client}       client       - Client.
 * @param {Index_CompleteGatewayConnection_DiscordToken} discordToken - Discord token.
 *
 * @returns {Index_CompleteGatewayConnection_Returns}
 *
 * @since 4.0.0
 */
async function completeGatewayConnection(
  client: Index_CompleteGatewayConnection_Client,
  discordToken: Index_CompleteGatewayConnection_DiscordToken,
): Index_CompleteGatewayConnection_Returns {
  const clientReadyPromise: Index_CompleteGatewayConnection_ClientReadyPromise = waitForClientReady(client);

  await client.login(discordToken);

  await clientReadyPromise;

  if (client.user === null) {
    throw new Error('Discord login completed without a ready bot user.');
  }

  return client.user.tag;
}

/**
 * Index - Connect Gateway.
 *
 * Decrypts the configured token only in bot-process memory, logs in, and
 * compiles every configured server before reporting a ready connection.
 *
 * @param {Index_ConnectGateway_RuntimeControl} runtimeControl - Runtime control.
 * @param {Index_ConnectGateway_CredentialKey}  credentialKey  - Credential key.
 * @param {Index_ConnectGateway_Pool}           pool           - Pool.
 *
 * @returns {Index_ConnectGateway_Returns}
 *
 * @since 4.0.0
 */
async function connectGateway(
  runtimeControl: Index_ConnectGateway_RuntimeControl,
  credentialKey: Index_ConnectGateway_CredentialKey,
  pool: Index_ConnectGateway_Pool,
): Index_ConnectGateway_Returns {
  if (runtimeControl['discordTokenCiphertext'] === undefined) {
    throw new Error('Discord configuration is incomplete.');
  }

  const guildSettingsEntries: Index_ConnectGateway_GuildSettingsEntries = await listNormalizedGuildSettings(pool);
  const guildRuntimes: Index_ConnectGateway_GuildRuntimes = [];
  const intents: Index_ConnectGateway_Intents = [GatewayIntentBits.Guilds];
  const activeFeatureKeys: Index_ConnectGateway_ActiveFeatureKeys = [];
  const configurationErrors: Index_ConnectGateway_ConfigurationErrors = [];

  for (const guildSettingsEntry of guildSettingsEntries) {
    const guildSettings: Index_ConnectGateway_GuildSettings = guildSettingsEntry['settings'];
    const encryptedGuildSecrets: Index_ConnectGateway_EncryptedGuildSecrets = await getGuildSecrets(
      pool,
      guildSettingsEntry['guildIdentifier'],
    );
    const guildSecretResolver: Index_ConnectGateway_GuildSecretResolver = createGuildSecretResolver(
      encryptedGuildSecrets,
      guildSettingsEntry['guildIdentifier'],
      credentialKey,
    );
    const antiRaidFeatures: Index_ConnectGateway_AntiRaidFeatures = prepareAntiRaidFeatures(guildSettings);
    const auditFeatures: Index_ConnectGateway_AuditFeatures = prepareAuditFeatures(guildSettings);
    const gatewayFeatures: Index_ConnectGateway_GatewayFeatures = prepareGatewayFeatures(guildSettings);
    const impersonatorFeatures: Index_ConnectGateway_ImpersonatorFeatures = prepareImpersonatorFeatures(guildSettings);
    const messageFeatures: Index_ConnectGateway_MessageFeatures = prepareMessageFeatures(guildSettings);
    const messageRoutingFeatures: Index_ConnectGateway_MessageRoutingFeatures = prepareMessageRoutingFeatures(
      guildSettings,
      guildSecretResolver,
    );
    const roleSyncFeatures: Index_ConnectGateway_RoleSyncFeatures = prepareRoleSyncFeatures(guildSettings);
    const scammerFeatures: Index_ConnectGateway_ScammerFeatures = prepareScammerFeatures(guildSettings);
    const serverToolFeatures: Index_ConnectGateway_ServerToolFeatures = prepareServerToolFeatures(guildSettings);

    intents.push(
      ...antiRaidFeatures['intents'],
      ...auditFeatures['intents'],
      ...gatewayFeatures['intents'],
      ...impersonatorFeatures['intents'],
      ...messageFeatures['intents'],
      ...messageRoutingFeatures['intents'],
      ...roleSyncFeatures['intents'],
      ...scammerFeatures['intents'],
      ...serverToolFeatures['intents'],
    );

    activeFeatureKeys.push(
      ...antiRaidFeatures['activeFeatureKeys'],
      ...auditFeatures['activeFeatureKeys'],
      ...gatewayFeatures['activeFeatureKeys'],
      ...impersonatorFeatures['activeFeatureKeys'],
      ...messageFeatures['activeFeatureKeys'],
      ...messageRoutingFeatures['activeFeatureKeys'],
      ...roleSyncFeatures['activeFeatureKeys'],
      ...scammerFeatures['activeFeatureKeys'],
      ...serverToolFeatures['activeFeatureKeys'],
    );

    configurationErrors.push(
      ...[
        ...antiRaidFeatures['configurationErrors'],
        ...auditFeatures['configurationErrors'],
        ...gatewayFeatures['configurationErrors'],
        ...impersonatorFeatures['configurationErrors'],
        ...messageFeatures['configurationErrors'],
        ...messageRoutingFeatures['configurationErrors'],
        ...roleSyncFeatures['configurationErrors'],
        ...scammerFeatures['configurationErrors'],
        ...serverToolFeatures['configurationErrors'],
      ].map((error) => `${guildSettingsEntry['guildIdentifier']}: ${error}`),
    );

    guildRuntimes.push({
      antiRaidFeatures,
      auditFeatures,
      gatewayFeatures,
      guildIdentifier: guildSettingsEntry['guildIdentifier'],
      impersonatorFeatures,
      messageFeatures,
      messageRoutingFeatures,
      roleSyncFeatures,
      scammerFeatures,
      serverToolFeatures,
    });
  }

  const client: Index_ConnectGateway_Client = new Client({
    intents: [...new Set(intents)],
    shardCount: 1,
  });
  const discordToken: Index_ConnectGateway_DiscordToken = decryptDiscordToken(
    runtimeControl['discordTokenCiphertext'],
    credentialKey,
  );
  let timeoutTimer: Index_ConnectGateway_TimeoutTimer = undefined;
  const timeoutPromise: Index_ConnectGateway_TimeoutPromise = new Promise((_resolve, reject) => {
    timeoutTimer = setTimeout(() => {
      reject(new Error('Discord Gateway startup timed out.'));

      return;
    }, GATEWAY_START_TIMEOUT_MILLISECONDS);

    return;
  });

  watchDiscordDebug(client);

  for (const guildRuntime of guildRuntimes) {
    guildRuntime['antiRaidFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['auditFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['gatewayFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['impersonatorFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['messageFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['messageRoutingFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['roleSyncFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['scammerFeatures'].register(client, guildRuntime['guildIdentifier']);

    guildRuntime['serverToolFeatures'].register(client, guildRuntime['guildIdentifier']);
  }

  try {
    const readyUserTag: Index_ConnectGateway_ReadyUserTag = await Promise.race([
      completeGatewayConnection(client, discordToken),
      timeoutPromise,
    ]);

    await synchronizeDiscordRegistry(client, pool);

    /**
     * Index - Connect Gateway - Synchronize Registry.
     *
     * Refreshes operator-facing Discord names after a guild resource changes.
     * Failures stay observable without disconnecting the active gateway.
     *
     * @returns {void}
     */
    const synchronizeRegistry: Index_ConnectGateway_SynchronizeRegistry = () => {
      void synchronizeDiscordRegistry(client, pool).catch((error) => {
        writeLog('error', 'bot', 'server_registry_sync_failed', {
          error: getErrorMessage(error),
        });

        return;
      });

      return;
    };

    client.on(Events.ChannelCreate, synchronizeRegistry);
    client.on(Events.ChannelDelete, synchronizeRegistry);
    client.on(Events.ChannelUpdate, synchronizeRegistry);
    client.on(Events.GuildCreate, synchronizeRegistry);
    client.on(Events.GuildDelete, synchronizeRegistry);
    client.on(Events.GuildUpdate, synchronizeRegistry);
    client.on(Events.GuildRoleCreate, synchronizeRegistry);
    client.on(Events.GuildRoleDelete, synchronizeRegistry);
    client.on(Events.GuildRoleUpdate, synchronizeRegistry);

    watchGatewayConnection(client, pool);

    return {
      activeFeatureKeys: [...new Set(activeFeatureKeys)],
      client,
      configurationErrors,
      guildCount: client.guilds.cache.size,
      userTag: readyUserTag,
    };
  } catch (error) {
    client.destroy();

    throw error;
  } finally {
    if (timeoutTimer !== undefined) {
      clearTimeout(timeoutTimer);
    }
  }
}

/**
 * Index - Create Guild Secret Resolver.
 *
 * Indexes encrypted rows while deferring decryption until an enabled module
 * requests one exact purpose-bound key during configuration compilation.
 *
 * @param {Index_CreateGuildSecretResolver_EncryptedSecrets} encryptedSecrets - Encrypted secrets.
 * @param {Index_CreateGuildSecretResolver_GuildIdentifier}  guildIdentifier  - Guild identifier.
 * @param {Index_CreateGuildSecretResolver_CredentialKey}    credentialKey    - Credential key.
 *
 * @returns {Index_CreateGuildSecretResolver_Returns}
 *
 * @since 4.0.0
 */
function createGuildSecretResolver(
  encryptedSecrets: Index_CreateGuildSecretResolver_EncryptedSecrets,
  guildIdentifier: Index_CreateGuildSecretResolver_GuildIdentifier,
  credentialKey: Index_CreateGuildSecretResolver_CredentialKey,
): Index_CreateGuildSecretResolver_Returns {
  const ciphertexts: Index_CreateGuildSecretResolver_Ciphertexts = {};

  for (const encryptedSecret of encryptedSecrets) {
    Reflect.set(ciphertexts, encryptedSecret['key'], encryptedSecret['ciphertext']);
  }

  return (secretKey) => {
    const ciphertext: Index_CreateGuildSecretResolver_Ciphertext = ciphertexts[secretKey];

    if (ciphertext === undefined) {
      return undefined;
    }

    const purpose: Index_CreateGuildSecretResolver_Purpose = `guild-secret:${guildIdentifier}:${secretKey}`;

    return decryptSecret(ciphertext, purpose, credentialKey);
  };
}

/**
 * Index - Disconnect Gateway.
 *
 * Tears down the current Discord session without stopping the supervised bot
 * service, allowing the panel to start it again inside the same appliance.
 *
 * @param {Index_DisconnectGateway_Client} client - Client.
 *
 * @returns {Index_DisconnectGateway_Returns}
 *
 * @since 4.0.0
 */
function disconnectGateway(client: Index_DisconnectGateway_Client): Index_DisconnectGateway_Returns {
  if (client !== undefined) {
    stopGatewayWatch(client);

    client.destroy();
  }

  return;
}

/**
 * Index - Main.
 *
 * Reconciles PostgreSQL lifecycle requests while s6 supervises the isolated bot
 * process. Missing or rejected credentials leave the Gateway safely idle.
 *
 * @returns {Index_Main_Returns}
 *
 * @since 4.0.0
 */
async function main(): Index_Main_Returns {
  const configuration: Index_Main_Configuration = readRuntimeConfiguration();
  const pool: Index_Main_Pool = timedPool(createDatabasePool(configuration['database'], 'stonker-bot'), 'bot');

  configureLogPersistence(pool);

  const stopDebugLogging: Index_Main_StopDebugLogging = followDebugLogging(pool, 'bot');
  const credentialKey: Index_Main_CredentialKey = await readCredentialKey(
    configuration['bot']['credentialKeyFile'],
  );
  let lifecycle: Index_Main_Lifecycle = {
    activeFeatureKeys: [],
    appliedGeneration: undefined,
    attemptedGeneration: undefined,
    client: undefined,
    configurationErrors: [],
    guildCount: 0,
    lastHeartbeatAt: 0,
    status: undefined,
    userTag: undefined,
  };
  let shutdownRequested: Index_Main_ShutdownRequested = false;

  /**
   * Index - Main - Request Shutdown.
   *
   * Marks the reconciliation loop for an orderly stop after the current bounded
   * operation, preserving one cleanup path for both container signals.
   *
   * @returns {void}
   *
   * @since 4.0.0
   */
  const requestShutdown: Index_Main_RequestShutdown = () => {
    shutdownRequested = true;

    return;
  };

  process.once('SIGINT', requestShutdown);
  process.once('SIGTERM', requestShutdown);

  try {
    while (shutdownRequested === false) {
      const runtimeControl: Index_Main_RuntimeControl = await getBotRuntimeControl(pool);

      lifecycle = await reconcileGateway(
        pool,
        credentialKey,
        lifecycle,
        runtimeControl,
      );

      if (shutdownRequested === false) {
        await sleep(configuration['bot']['controlPollIntervalMilliseconds']);
      }
    }
  } finally {
    process.off('SIGINT', requestShutdown);
    process.off('SIGTERM', requestShutdown);

    stopDebugLogging();

    disconnectGateway(lifecycle['client']);

    await pool.end();
  }

  writeLog('info', 'bot', 'service_stopped');

  return;
}

/**
 * Index - Publish Heartbeat.
 *
 * Writes state transitions immediately and throttles unchanged status updates.
 * The panel receives fresh health data without a write on every control poll.
 *
 * @param {Index_PublishHeartbeat_Pool}      pool      - Pool.
 * @param {Index_PublishHeartbeat_Lifecycle} lifecycle - Lifecycle.
 * @param {Index_PublishHeartbeat_Status}    status    - Status.
 * @param {Index_PublishHeartbeat_Details}   details   - Details.
 * @param {Index_PublishHeartbeat_Force}     force     - Force.
 *
 * @returns {Index_PublishHeartbeat_Returns}
 *
 * @since 4.0.0
 */
async function publishHeartbeat(
  pool: Index_PublishHeartbeat_Pool,
  lifecycle: Index_PublishHeartbeat_Lifecycle,
  status: Index_PublishHeartbeat_Status,
  details: Index_PublishHeartbeat_Details,
  force: Index_PublishHeartbeat_Force,
): Index_PublishHeartbeat_Returns {
  const currentTime: Index_PublishHeartbeat_CurrentTime = Date.now();

  if (
    force === false
    && lifecycle['status'] === status
    && currentTime - lifecycle['lastHeartbeatAt'] < HEARTBEAT_INTERVAL_MILLISECONDS
  ) {
    return lifecycle;
  }

  await recordHeartbeat(pool, 'bot', status, details);

  return {
    ...lifecycle,
    lastHeartbeatAt: currentTime,
    status,
  };
}

/**
 * Index - Reconcile Gateway.
 *
 * Applies one durable lifecycle generation exactly once. Failed starts stay
 * idle until configuration changes or an operator requests another attempt.
 *
 * @param {Index_ReconcileGateway_Pool}           pool           - Pool.
 * @param {Index_ReconcileGateway_CredentialKey}  credentialKey  - Credential key.
 * @param {Index_ReconcileGateway_Lifecycle}      lifecycle      - Lifecycle.
 * @param {Index_ReconcileGateway_RuntimeControl} runtimeControl - Runtime control.
 *
 * @returns {Index_ReconcileGateway_Returns}
 *
 * @since 4.0.0
 */
async function reconcileGateway(
  pool: Index_ReconcileGateway_Pool,
  credentialKey: Index_ReconcileGateway_CredentialKey,
  lifecycle: Index_ReconcileGateway_Lifecycle,
  runtimeControl: Index_ReconcileGateway_RuntimeControl,
): Index_ReconcileGateway_Returns {
  const configured: Index_ReconcileGateway_Configured = runtimeControl['discordTokenCiphertext'] !== undefined;

  if (runtimeControl['desiredState'] === 'stopped') {
    if (lifecycle['client'] !== undefined) {
      disconnectGateway(lifecycle['client']);

      writeLog('info', 'bot', 'gateway_stopped', {
        generation: runtimeControl['generation'],
      });
    }

    const nextLifecycle: Index_ReconcileGateway_NextLifecycle = {
      ...lifecycle,
      activeFeatureKeys: [],
      appliedGeneration: undefined,
      attemptedGeneration: runtimeControl['generation'],
      client: undefined,
      configurationErrors: [],
      guildCount: 0,
      userTag: undefined,
    };

    return publishHeartbeat(pool, nextLifecycle, 'stopped', {
      configured,
      generation: runtimeControl['generation'],
    }, lifecycle['status'] !== 'stopped');
  }

  if (configured === false) {
    disconnectGateway(lifecycle['client']);

    const nextLifecycle: Index_ReconcileGateway_NextLifecycle = {
      ...lifecycle,
      activeFeatureKeys: [],
      appliedGeneration: undefined,
      attemptedGeneration: runtimeControl['generation'],
      client: undefined,
      configurationErrors: [],
      guildCount: 0,
      userTag: undefined,
    };

    return publishHeartbeat(pool, nextLifecycle, 'configuration_required', {
      configured: false,
      generation: runtimeControl['generation'],
      resolution: 'Add the bot token on the Connection page.',
    }, lifecycle['status'] !== 'configuration_required');
  }

  if (
    lifecycle['client'] !== undefined
    && lifecycle['appliedGeneration'] === runtimeControl['generation']
  ) {
    return publishHeartbeat(pool, lifecycle, 'ready', {
      activeFeatures: lifecycle['activeFeatureKeys'],
      configurationErrors: lifecycle['configurationErrors'],
      generation: runtimeControl['generation'],
      guildCount: lifecycle['guildCount'],
      shardCount: 1,
      userTag: lifecycle['userTag'],
    }, false);
  }

  if (
    lifecycle['client'] === undefined
    && lifecycle['attemptedGeneration'] === runtimeControl['generation']
  ) {
    return publishHeartbeat(pool, lifecycle, 'failed', {
      generation: runtimeControl['generation'],
      resolution: 'Check the bot token on the Connection page, then restart the bot.',
    }, false);
  }

  disconnectGateway(lifecycle['client']);

  let nextLifecycle: Index_ReconcileGateway_NextLifecycle = {
    ...lifecycle,
    activeFeatureKeys: [],
    appliedGeneration: undefined,
    attemptedGeneration: runtimeControl['generation'],
    client: undefined,
    configurationErrors: [],
    guildCount: 0,
    userTag: undefined,
  };

  nextLifecycle = await publishHeartbeat(pool, nextLifecycle, 'starting', {
    generation: runtimeControl['generation'],
  }, true);

  try {
    const connection: Index_ReconcileGateway_Connection = await connectGateway(
      runtimeControl,
      credentialKey,
      pool,
    );

    nextLifecycle = {
      ...nextLifecycle,
      activeFeatureKeys: connection['activeFeatureKeys'],
      appliedGeneration: runtimeControl['generation'],
      client: connection['client'],
      configurationErrors: connection['configurationErrors'],
      guildCount: connection['guildCount'],
      userTag: connection['userTag'],
    };

    writeLog('info', 'bot', 'gateway_ready', {
      activeFeatures: connection['activeFeatureKeys'],
      configurationErrors: connection['configurationErrors'],
      generation: runtimeControl['generation'],
      guildCount: connection['guildCount'],
      shardCount: 1,
      userTag: connection['userTag'],
    });

    return publishHeartbeat(pool, nextLifecycle, 'ready', {
      activeFeatures: connection['activeFeatureKeys'],
      configurationErrors: connection['configurationErrors'],
      generation: runtimeControl['generation'],
      guildCount: connection['guildCount'],
      shardCount: 1,
      userTag: connection['userTag'],
    }, true);
  } catch (error) {
    writeLog('error', 'bot', 'gateway_start_failed', {
      error: getErrorMessage(error),
      generation: runtimeControl['generation'],
      resolution: 'Update the Bot Token in the control panel and request a restart.',
    });

    await notifyBotSignInFailed(pool, runtimeControl['generation'], getErrorMessage(error)).catch((notifyError) => {
      writeLog('error', 'bot', 'notification_queue_failed', {
        error: getErrorMessage(notifyError),
      });

      return;
    });

    return publishHeartbeat(pool, nextLifecycle, 'failed', {
      generation: runtimeControl['generation'],
      resolution: 'Check the bot token on the Connection page, then restart the bot.',
    }, true);
  }
}

/**
 * Index - Run.
 *
 * Converts unexpected service failures into a supervised process exit.
 * s6 restarts only this bot service while the panel and database stay online.
 *
 * @returns {Index_Run_Returns}
 *
 * @since 4.0.0
 */
async function run(): Index_Run_Returns {
  try {
    await main();
  } catch (error) {
    writeLog('error', 'bot', 'service_failed', {
      error: getErrorMessage(error),
    });

    process.exitCode = 1;
  }

  return;
}

/**
 * Index - Wait For Client Ready.
 *
 * Registers the ready listener before login so a fast Gateway handshake cannot
 * race startup or allow guild verification to run against incomplete state.
 *
 * @param {Index_WaitForClientReady_Client} client - Client.
 *
 * @returns {Index_WaitForClientReady_Returns}
 *
 * @since 4.0.0
 */
function waitForClientReady(client: Index_WaitForClientReady_Client): Index_WaitForClientReady_Returns {
  return new Promise<void>((resolveReady) => {
    client.once(Events.ClientReady, () => {
      resolveReady();

      return;
    });

    return;
  });
}

await run();
