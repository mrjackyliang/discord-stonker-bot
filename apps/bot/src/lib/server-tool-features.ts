import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  ChannelType,
  Events,
  GatewayIntentBits,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { z } from 'zod';

import { registerApplicationCommands } from './application-commands.js';
import { timeFeatureHandler } from './debug-timing.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_IDENTIFIER_LIST_SEPARATOR,
} from './regex.js';

import type {
  Lib_ServerToolFeatures_CompileServerTools_Configuration,
  Lib_ServerToolFeatures_CompileServerTools_Parsed,
  Lib_ServerToolFeatures_CompileServerTools_Returns,
  Lib_ServerToolFeatures_CompileServerTools_ToolConfiguration,
  Lib_ServerToolFeatures_CompileServerTools_ToolKeys,
  Lib_ServerToolFeatures_CompileServerTools_Tools,
  Lib_ServerToolFeatures_CreateCommandData_Commands,
  Lib_ServerToolFeatures_CreateCommandData_Returns,
  Lib_ServerToolFeatures_CreateCommandData_Runtime,
  Lib_ServerToolFeatures_CreateRegistration_Returns,
  Lib_ServerToolFeatures_CreateRegistration_Runtime,
  Lib_ServerToolFeatures_FindDuplicateMemberNames_Entries,
  Lib_ServerToolFeatures_FindDuplicateMemberNames_Group,
  Lib_ServerToolFeatures_FindDuplicateMemberNames_Groups,
  Lib_ServerToolFeatures_FindDuplicateMemberNames_NormalizedName,
  Lib_ServerToolFeatures_FindDuplicateMemberNames_Returns,
  Lib_ServerToolFeatures_FormatConfigurationError_Error,
  Lib_ServerToolFeatures_FormatConfigurationError_Messages,
  Lib_ServerToolFeatures_FormatConfigurationError_Returns,
  Lib_ServerToolFeatures_GetCommandToolKey_CommandName,
  Lib_ServerToolFeatures_GetCommandToolKey_Returns,
  Lib_ServerToolFeatures_GetEnabledFeature_Features,
  Lib_ServerToolFeatures_GetEnabledFeature_RawFeature,
  Lib_ServerToolFeatures_GetEnabledFeature_Returns,
  Lib_ServerToolFeatures_GetEnabledFeature_Settings,
  Lib_ServerToolFeatures_HandleBulkBan_BotMember,
  Lib_ServerToolFeatures_HandleBulkBan_Confirmed,
  Lib_ServerToolFeatures_HandleBulkBan_DeleteMessageSeconds,
  Lib_ServerToolFeatures_HandleBulkBan_Identifiers,
  Lib_ServerToolFeatures_HandleBulkBan_Interaction,
  Lib_ServerToolFeatures_HandleBulkBan_Invoker,
  Lib_ServerToolFeatures_HandleBulkBan_RawIdentifiers,
  Lib_ServerToolFeatures_HandleBulkBan_Results,
  Lib_ServerToolFeatures_HandleBulkBan_Returns,
  Lib_ServerToolFeatures_HandleBulkBan_Separator,
  Lib_ServerToolFeatures_HandleBulkBan_SucceededCount,
  Lib_ServerToolFeatures_HandleBulkBan_TargetMember,
  Lib_ServerToolFeatures_HandleBulkBan_TargetMembers,
  Lib_ServerToolFeatures_HandleBulkBan_Tasks,
  Lib_ServerToolFeatures_HandleCommand_GuildIdentifier,
  Lib_ServerToolFeatures_HandleCommand_Interaction,
  Lib_ServerToolFeatures_HandleCommand_Invoker,
  Lib_ServerToolFeatures_HandleCommand_Response,
  Lib_ServerToolFeatures_HandleCommand_Returns,
  Lib_ServerToolFeatures_HandleCommand_Runtime,
  Lib_ServerToolFeatures_HandleCommand_ToolKey,
  Lib_ServerToolFeatures_HandleDuplicates_Entries,
  Lib_ServerToolFeatures_HandleDuplicates_Groups,
  Lib_ServerToolFeatures_HandleDuplicates_Guild,
  Lib_ServerToolFeatures_HandleDuplicates_Lines,
  Lib_ServerToolFeatures_HandleDuplicates_Returns,
  Lib_ServerToolFeatures_HandleEmojis_Guild,
  Lib_ServerToolFeatures_HandleEmojis_Names,
  Lib_ServerToolFeatures_HandleEmojis_Returns,
  Lib_ServerToolFeatures_HandleMembers_Guild,
  Lib_ServerToolFeatures_HandleMembers_Returns,
  Lib_ServerToolFeatures_HandleRole_Action,
  Lib_ServerToolFeatures_HandleRole_BotMember,
  Lib_ServerToolFeatures_HandleRole_Confirmed,
  Lib_ServerToolFeatures_HandleRole_Interaction,
  Lib_ServerToolFeatures_HandleRole_Invoker,
  Lib_ServerToolFeatures_HandleRole_Returns,
  Lib_ServerToolFeatures_HandleRole_Role,
  Lib_ServerToolFeatures_HandleRole_TargetMember,
  Lib_ServerToolFeatures_HandleRole_TargetUser,
  Lib_ServerToolFeatures_HandleVoice_Action,
  Lib_ServerToolFeatures_HandleVoice_ChannelOption,
  Lib_ServerToolFeatures_HandleVoice_Confirmed,
  Lib_ServerToolFeatures_HandleVoice_Interaction,
  Lib_ServerToolFeatures_HandleVoice_Returns,
  Lib_ServerToolFeatures_HandleVoice_TargetChannel,
  Lib_ServerToolFeatures_HandleVoice_TargetMember,
  Lib_ServerToolFeatures_HandleVoice_TargetUser,
  Lib_ServerToolFeatures_HasConfiguredRole_AllowedRoleIdentifiers,
  Lib_ServerToolFeatures_HasConfiguredRole_Invoker,
  Lib_ServerToolFeatures_HasConfiguredRole_Returns,
  Lib_ServerToolFeatures_HasRequiredDiscordPermission_Invoker,
  Lib_ServerToolFeatures_HasRequiredDiscordPermission_Returns,
  Lib_ServerToolFeatures_HasRequiredDiscordPermission_ToolKey,
  Lib_ServerToolFeatures_IsRecord_TypeGuard,
  Lib_ServerToolFeatures_IsRecord_Value,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_ActiveFeatureKeys,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_ConfigurationErrors,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_Feature,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_Intents,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_MemberIntentRequired,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_Runtime,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_Settings,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_VoiceIntentRequired,
  Lib_ServerToolFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_ServerToolFeatures_RecordConfigurationError_Error,
  Lib_ServerToolFeatures_RecordConfigurationError_Message,
  Lib_ServerToolFeatures_RecordConfigurationError_Returns,
} from '../types/lib/server-tool-features.d.ts';

/**
 * Server Tool Features - Tool Schema.
 *
 * Preserves trusted-role policy while ignoring retired prefix-command display data.
 * Every enabled tool requires at least one explicit operator-managed role.
 *
 * @since 4.0.0
 */
const toolSchema = z.object({
  'allowed-roles': z.array(z.object({
    'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).min(1).max(25),
  'base-commands': z.array(z.string().trim().min(1).max(100)).max(25).optional(),
  'delete-message': z.boolean().optional(),
});

/**
 * Server Tool Features - Server Tools Schema.
 *
 * Validates the six archived capabilities as independently enabled slash commands.
 * Empty configurations fail closed instead of registering an unrestricted command set.
 *
 * @since 4.0.0
 */
export const serverToolsSchema = z.object({
  'bulk-ban': toolSchema.optional(),
  'fetch-duplicates': toolSchema.optional(),
  'fetch-emojis': toolSchema.optional(),
  'fetch-members': toolSchema.optional(),
  'role-manager': toolSchema.optional(),
  'voice-tools': toolSchema.optional(),
}).refine(
  (configuration) => Object.values(configuration).some((value) => value !== undefined),
  'At least one server tool is required.',
);

/**
 * Server Tool Features - Compile Server Tools.
 *
 * Converts validated role policies into immutable lookup sets for each command.
 * Legacy command aliases are accepted for migration but never registered at runtime.
 *
 * @param {Lib_ServerToolFeatures_CompileServerTools_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_CompileServerTools_Returns}
 *
 * @since 4.0.0
 */
function compileServerTools(
  configuration: Lib_ServerToolFeatures_CompileServerTools_Configuration,
): Lib_ServerToolFeatures_CompileServerTools_Returns {
  const parsed: Lib_ServerToolFeatures_CompileServerTools_Parsed = serverToolsSchema.parse(configuration);
  const tools: Lib_ServerToolFeatures_CompileServerTools_Tools = {};
  const toolKeys: Lib_ServerToolFeatures_CompileServerTools_ToolKeys = [
    'bulk-ban',
    'fetch-duplicates',
    'fetch-emojis',
    'fetch-members',
    'role-manager',
    'voice-tools',
  ];

  for (const toolKey of toolKeys) {
    const toolConfiguration: Lib_ServerToolFeatures_CompileServerTools_ToolConfiguration = parsed[toolKey];

    if (toolConfiguration !== undefined) {
      Reflect.set(
        tools,
        toolKey,
        new Set(toolConfiguration['allowed-roles'].map((role) => role['role-id'])),
      );
    }
  }

  return {
    tools,
  };
}
/**
 * Server Tool Features - Create Command Data.
 *
 * Builds guild-only application commands for the configured capability subset.
 * Discord permissions provide the first authorization gate before role-policy checks.
 *
 * @param {Lib_ServerToolFeatures_CreateCommandData_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_CreateCommandData_Returns}
 *
 * @since 4.0.0
 */
export function createCommandData(
  runtime: Lib_ServerToolFeatures_CreateCommandData_Runtime,
): Lib_ServerToolFeatures_CreateCommandData_Returns {
  const commands: Lib_ServerToolFeatures_CreateCommandData_Commands = [];

  if (runtime['tools']['fetch-members'] !== undefined) {
    commands.push({
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
      description: 'Show the server member count and current cache coverage.',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'stonker-members',
    });
  }

  if (runtime['tools']['fetch-emojis'] !== undefined) {
    commands.push({
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
      description: 'Show a bounded summary of server emojis.',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'stonker-emojis',
    });
  }

  if (runtime['tools']['fetch-duplicates'] !== undefined) {
    commands.push({
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
      description: 'Find duplicate display names in the current member cache.',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'stonker-duplicates',
    });
  }

  if (runtime['tools']['role-manager'] !== undefined) {
    commands.push({
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
      description: 'Add or remove one manageable server role.',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'stonker-role',
      options: [
        {
          choices: [
            {
              name: 'Add',
              value: 'add',
            },
            {
              name: 'Remove',
              value: 'remove',
            },
          ],
          description: 'Role action.',
          name: 'action',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          description: 'Server member to update.',
          name: 'member',
          required: true,
          type: ApplicationCommandOptionType.User,
        },
        {
          description: 'Server role to add or remove.',
          name: 'role',
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
        {
          description: 'Confirm this role change.',
          name: 'confirm',
          required: true,
          type: ApplicationCommandOptionType.Boolean,
        },
      ],
    });
  }

  if (runtime['tools']['voice-tools'] !== undefined) {
    commands.push({
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.MoveMembers,
      description: 'Move or disconnect one member in voice.',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'stonker-voice',
      options: [
        {
          choices: [
            {
              name: 'Disconnect',
              value: 'disconnect',
            },
            {
              name: 'Move',
              value: 'move',
            },
          ],
          description: 'Voice action.',
          name: 'action',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          description: 'Server member to update.',
          name: 'member',
          required: true,
          type: ApplicationCommandOptionType.User,
        },
        {
          description: 'Confirm this voice action.',
          name: 'confirm',
          required: true,
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          channelTypes: [
            ChannelType.GuildVoice,
            ChannelType.GuildStageVoice,
          ],
          description: 'Destination voice channel for a move.',
          name: 'channel',
          required: false,
          type: ApplicationCommandOptionType.Channel,
        },
      ],
    });
  }

  if (runtime['tools']['bulk-ban'] !== undefined) {
    commands.push({
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.BanMembers,
      description: 'Ban up to 25 validated Discord user IDs.',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'stonker-bulk-ban',
      options: [
        {
          description: 'Comma- or space-separated Discord user IDs.',
          maxLength: 525,
          name: 'user-ids',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          description: 'Confirm this bounded bulk ban.',
          name: 'confirm',
          required: true,
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          description: 'Seconds of message history to remove.',
          maxValue: 604_800,
          minValue: 0,
          name: 'delete-message-seconds',
          required: false,
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    });
  }

  return commands;
}

/**
 * Server Tool Features - Create Registration.
 *
 * Registers guild commands after readiness and routes only cached-guild interactions.
 * Command failures remain isolated and receive a private bounded response.
 *
 * @param {Lib_ServerToolFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_ServerToolFeatures_CreateRegistration_Runtime,
): Lib_ServerToolFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    registerApplicationCommands(client, guildIdentifier, createCommandData(runtime));

    client.on(Events.InteractionCreate, (interaction) => {
      if (
        interaction.isChatInputCommand() === false
        || interaction.inCachedGuild() === false
        || interaction['guildId'] !== guildIdentifier
      ) {
        return;
      }

      void timeFeatureHandler('server-tool', Events.InteractionCreate, guildIdentifier, () => handleCommand(interaction, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'server_tool_command_failed', {
          commandName: interaction['commandName'],
          error: getErrorMessage(error),
          guildIdentifier,
          userIdentifier: interaction['user']['id'],
        });

        if (interaction['deferred'] === true || interaction['replied'] === true) {
          void interaction.editReply('The command could not be completed. Review the bot logs.');
        } else {
          void interaction.reply({
            content: 'The command could not be completed. Review the bot logs.',
            flags: MessageFlags.Ephemeral,
          });
        }

        return;
      });

      return;
    });

    return;
  };
}

/**
 * Server Tool Features - Find Duplicate Member Names.
 *
 * Groups Unicode-normalized display names and returns only true duplicates.
 * Identifiers stay opaque and ordering remains deterministic for tests and replies.
 *
 * @param {Lib_ServerToolFeatures_FindDuplicateMemberNames_Entries} entries - Entries.
 *
 * @returns {Lib_ServerToolFeatures_FindDuplicateMemberNames_Returns}
 *
 * @since 4.0.0
 */
export function findDuplicateMemberNames(
  entries: Lib_ServerToolFeatures_FindDuplicateMemberNames_Entries,
): Lib_ServerToolFeatures_FindDuplicateMemberNames_Returns {
  const groups: Lib_ServerToolFeatures_FindDuplicateMemberNames_Groups = new Map();

  for (const entry of entries) {
    const normalizedName: Lib_ServerToolFeatures_FindDuplicateMemberNames_NormalizedName = entry['displayName']
      .normalize('NFKC')
      .trim()
      .toLocaleLowerCase('en-US');
    const group: Lib_ServerToolFeatures_FindDuplicateMemberNames_Group = groups.get(normalizedName);

    if (group === undefined) {
      groups.set(normalizedName, {
        displayName: entry['displayName'],
        identifiers: [entry['identifier']],
      });
    } else {
      group['identifiers'].push(entry['identifier']);
    }
  }

  return [...groups.values()]
    .filter((group) => group['identifiers'].length > 1)
    .sort((left, right) => left['displayName'].localeCompare(right['displayName'], 'en-US'));
}

/**
 * Server Tool Features - Format Configuration Error.
 *
 * Produces path-focused diagnostics without reflecting imported command text.
 * Unexpected failures use the shared bounded error conversion.
 *
 * @param {Lib_ServerToolFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_ServerToolFeatures_FormatConfigurationError_Error,
): Lib_ServerToolFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_ServerToolFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
      if (issue['path'].length === 0) {
        return issue['message'];
      }

      return `${issue['path'].join('.')}: ${issue['message']}`;
    });

    return messages.join('; ').slice(0, 1_000);
  }

  return getErrorMessage(error).slice(0, 1_000);
}

/**
 * Server Tool Features - Get Command Tool Key.
 *
 * Maps fixed application-command names back to the archived capability switches.
 * Unknown interactions are ignored without producing a public response.
 *
 * @param {Lib_ServerToolFeatures_GetCommandToolKey_CommandName} commandName - Command name.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_GetCommandToolKey_Returns}
 *
 * @since 4.0.0
 */
function getCommandToolKey(
  commandName: Lib_ServerToolFeatures_GetCommandToolKey_CommandName,
): Lib_ServerToolFeatures_GetCommandToolKey_Returns {
  switch (commandName) {
    case 'stonker-bulk-ban': {
      return 'bulk-ban';
    }

    case 'stonker-duplicates': {
      return 'fetch-duplicates';
    }

    case 'stonker-emojis': {
      return 'fetch-emojis';
    }

    case 'stonker-members': {
      return 'fetch-members';
    }

    case 'stonker-role': {
      return 'role-manager';
    }

    case 'stonker-voice': {
      return 'voice-tools';
    }

    default: {
      return undefined;
    }
  }
}

/**
 * Server Tool Features - Get Enabled Feature.
 *
 * Reads the database-backed switch without trusting surrounding JSON values.
 * Missing and disabled settings register no application commands or extra intents.
 *
 * @param {Lib_ServerToolFeatures_GetEnabledFeature_Settings} settings - Settings.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_ServerToolFeatures_GetEnabledFeature_Settings,
): Lib_ServerToolFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_ServerToolFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_ServerToolFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_ServerToolFeatures_GetEnabledFeature_RawFeature = features['server-tools'];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Server Tool Features - Handle Bulk Ban.
 *
 * Validates the complete bounded target set before starting any ban request.
 * Hierarchy checks apply to every current member and confirmations are mandatory.
 *
 * @param {Lib_ServerToolFeatures_HandleBulkBan_Interaction} interaction - Interaction.
 * @param {Lib_ServerToolFeatures_HandleBulkBan_Invoker}     invoker     - Invoker.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleBulkBan_Returns}
 *
 * @since 4.0.0
 */
async function handleBulkBan(
  interaction: Lib_ServerToolFeatures_HandleBulkBan_Interaction,
  invoker: Lib_ServerToolFeatures_HandleBulkBan_Invoker,
): Lib_ServerToolFeatures_HandleBulkBan_Returns {
  const confirmed: Lib_ServerToolFeatures_HandleBulkBan_Confirmed = interaction['options'].getBoolean(
    'confirm',
    true,
  );

  if (confirmed === false) {
    return 'No members were banned because confirmation was false.';
  }

  const rawIdentifiers: Lib_ServerToolFeatures_HandleBulkBan_RawIdentifiers = interaction['options'].getString(
    'user-ids',
    true,
  );
  const separator: Lib_ServerToolFeatures_HandleBulkBan_Separator = new RegExp(
    LIB_REGEX_PATTERN_IDENTIFIER_LIST_SEPARATOR,
    'u',
  );
  const identifiers: Lib_ServerToolFeatures_HandleBulkBan_Identifiers = [...new Set(
    rawIdentifiers.split(separator).filter((identifier) => identifier !== ''),
  )];
  const deleteMessageSeconds: Lib_ServerToolFeatures_HandleBulkBan_DeleteMessageSeconds = interaction[
    'options'
  ].getInteger('delete-message-seconds') ?? 0;

  if (identifiers.length === 0 || identifiers.length > 25) {
    return 'Provide between 1 and 25 unique Discord user IDs.';
  }

  if (
    identifiers.some(
      (identifier) => new RegExp(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER, 'u').test(identifier) === false,
    ) === true
  ) {
    return 'Every target must be a valid Discord user ID.';
  }

  if (
    identifiers.includes(invoker['id']) === true
    || identifiers.includes(interaction['guild']['ownerId']) === true
    || identifiers.includes(interaction['client']['user']['id']) === true
  ) {
    return 'The invoker, server owner, and bot cannot be bulk-ban targets.';
  }

  const botMember: Lib_ServerToolFeatures_HandleBulkBan_BotMember = interaction['guild']['members']['me'];

  if (botMember === null || botMember['permissions'].has(PermissionFlagsBits.BanMembers) === false) {
    return 'The bot does not currently have permission to ban members.';
  }

  const targetMembers: Lib_ServerToolFeatures_HandleBulkBan_TargetMembers = [];

  for (const identifier of identifiers) {
    const targetMember: Lib_ServerToolFeatures_HandleBulkBan_TargetMember = await interaction['guild']['members']
      .fetch(identifier)
      .catch(() => undefined);

    if (targetMember === undefined) {
      continue;
    }

    if (
      targetMember['roles']['highest']['position'] >= botMember['roles']['highest']['position']
      || (
        invoker['id'] !== interaction['guild']['ownerId']
        && targetMember['roles']['highest']['position'] >= invoker['roles']['highest']['position']
      )
    ) {
      return `Target ${identifier} is above a manageable role boundary; no bans were started.`;
    }

    targetMembers.push(targetMember);
  }

  const tasks: Lib_ServerToolFeatures_HandleBulkBan_Tasks = identifiers.map((identifier) => interaction[
    'guild'
  ]['members'].ban(identifier, {
    deleteMessageSeconds,
    reason: `Confirmed Stonker bulk ban by ${invoker['id']}`,
  }));
  const results: Lib_ServerToolFeatures_HandleBulkBan_Results = await Promise.allSettled(tasks);
  const succeededCount: Lib_ServerToolFeatures_HandleBulkBan_SucceededCount = results.filter(
    (result) => result['status'] === 'fulfilled',
  ).length;

  writeLog('info', 'bot', 'server_tool_bulk_ban_completed', {
    failedCount: results.length - succeededCount,
    invokerIdentifier: invoker['id'],
    requestedCount: identifiers.length,
    succeededCount,
  });

  return `Bulk ban complete: ${succeededCount} succeeded, ${results.length - succeededCount} failed.`;
}

/**
 * Server Tool Features - Handle Command.
 *
 * Applies Discord permission and configured-role checks before command dispatch.
 * Every response is private so member inventories and failures stay operator-only.
 *
 * @param {Lib_ServerToolFeatures_HandleCommand_Interaction}     interaction     - Interaction.
 * @param {Lib_ServerToolFeatures_HandleCommand_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ServerToolFeatures_HandleCommand_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleCommand_Returns}
 *
 * @since 4.0.0
 */
async function handleCommand(
  interaction: Lib_ServerToolFeatures_HandleCommand_Interaction,
  guildIdentifier: Lib_ServerToolFeatures_HandleCommand_GuildIdentifier,
  runtime: Lib_ServerToolFeatures_HandleCommand_Runtime,
): Lib_ServerToolFeatures_HandleCommand_Returns {
  const toolKey: Lib_ServerToolFeatures_HandleCommand_ToolKey = getCommandToolKey(interaction['commandName']);

  if (toolKey === undefined || interaction['guild']['id'] !== guildIdentifier) {
    return;
  }

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  const invoker: Lib_ServerToolFeatures_HandleCommand_Invoker = interaction['member'];

  if (
    hasConfiguredRole(invoker, runtime['tools'][toolKey] ?? new Set()) === false
    || hasRequiredDiscordPermission(invoker, toolKey) === false
  ) {
    await interaction.editReply('You do not have both the configured trusted role and required Discord permission.');

    return;
  }

  let response: Lib_ServerToolFeatures_HandleCommand_Response = 'Unsupported server tool.';

  switch (toolKey) {
    case 'bulk-ban': {
      response = await handleBulkBan(interaction, invoker);
      break;
    }

    case 'fetch-duplicates': {
      response = handleDuplicates(interaction['guild']);
      break;
    }

    case 'fetch-emojis': {
      response = await handleEmojis(interaction['guild']);
      break;
    }

    case 'fetch-members': {
      response = handleMembers(interaction['guild']);
      break;
    }

    case 'role-manager': {
      response = await handleRole(interaction, invoker);
      break;
    }

    case 'voice-tools': {
      response = await handleVoice(interaction);
      break;
    }

    default: {
      break;
    }
  }

  await interaction.editReply(response.slice(0, 2_000));

  return;
}
/**
 * Server Tool Features - Handle Duplicates.
 *
 * Reports duplicate display names only from the currently available member cache.
 * The response always states cache coverage so it cannot imply a complete census.
 *
 * @param {Lib_ServerToolFeatures_HandleDuplicates_Guild} guild - Guild.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleDuplicates_Returns}
 *
 * @since 4.0.0
 */
function handleDuplicates(
  guild: Lib_ServerToolFeatures_HandleDuplicates_Guild,
): Lib_ServerToolFeatures_HandleDuplicates_Returns {
  const entries: Lib_ServerToolFeatures_HandleDuplicates_Entries = guild['members']['cache'].map((member) => ({
    displayName: member['displayName'],
    identifier: member['id'],
  }));
  const groups: Lib_ServerToolFeatures_HandleDuplicates_Groups = findDuplicateMemberNames(entries);
  const lines: Lib_ServerToolFeatures_HandleDuplicates_Lines = groups.slice(0, 20).map(
    (group) => `${group['displayName'].slice(0, 80)}: ${group['identifiers'].length} cached members`,
  );

  if (lines.length === 0) {
    lines.push('No duplicate display names were found in the current cache.');
  }

  return [
    `Cache coverage: ${guild['members']['cache']['size']} of ${guild['memberCount']} server members.`,
    ...lines,
  ].join('\n');
}

/**
 * Server Tool Features - Handle Emojis.
 *
 * Fetches the current server emoji collection and returns a bounded name summary.
 * Emoji assets are never downloaded or attached by this command.
 *
 * @param {Lib_ServerToolFeatures_HandleEmojis_Guild} guild - Guild.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleEmojis_Returns}
 *
 * @since 4.0.0
 */
async function handleEmojis(
  guild: Lib_ServerToolFeatures_HandleEmojis_Guild,
): Lib_ServerToolFeatures_HandleEmojis_Returns {
  await guild['emojis'].fetch();

  const names: Lib_ServerToolFeatures_HandleEmojis_Names = guild['emojis']['cache'].map(
    (emoji) => emoji['name'] ?? emoji['id'],
  ).sort((left, right) => left.localeCompare(right, 'en-US'));

  return [
    `Server emojis: ${names.length}.`,
    (names.length === 0) ? 'No custom emojis are configured.' : names.slice(0, 50).join(', '),
    (names.length > 50) ? `${names.length - 50} more omitted.` : '',
  ].filter((line) => line !== '').join('\n');
}

/**
 * Server Tool Features - Handle Members.
 *
 * Reports Discord's server member count beside the local cache size.
 * The command never triggers an unbounded fetch for a large server.
 *
 * @param {Lib_ServerToolFeatures_HandleMembers_Guild} guild - Guild.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleMembers_Returns}
 *
 * @since 4.0.0
 */
function handleMembers(
  guild: Lib_ServerToolFeatures_HandleMembers_Guild,
): Lib_ServerToolFeatures_HandleMembers_Returns {
  return `Server members: ${guild['memberCount']}. Cached members: ${guild['members']['cache']['size']}.`;
}

/**
 * Server Tool Features - Handle Role.
 *
 * Validates confirmation, hierarchy, managed state, and bot capability before mutation.
 * Repeated requests are idempotent when the target already has the desired state.
 *
 * @param {Lib_ServerToolFeatures_HandleRole_Interaction} interaction - Interaction.
 * @param {Lib_ServerToolFeatures_HandleRole_Invoker}     invoker     - Invoker.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleRole_Returns}
 *
 * @since 4.0.0
 */
async function handleRole(
  interaction: Lib_ServerToolFeatures_HandleRole_Interaction,
  invoker: Lib_ServerToolFeatures_HandleRole_Invoker,
): Lib_ServerToolFeatures_HandleRole_Returns {
  const confirmed: Lib_ServerToolFeatures_HandleRole_Confirmed = interaction['options'].getBoolean('confirm', true);

  if (confirmed === false) {
    return 'No role was changed because confirmation was false.';
  }

  const targetUser: Lib_ServerToolFeatures_HandleRole_TargetUser = interaction['options'].getUser('member', true);
  const targetMember: Lib_ServerToolFeatures_HandleRole_TargetMember = await interaction['guild']['members'].fetch(
    targetUser['id'],
  );
  const role: Lib_ServerToolFeatures_HandleRole_Role = interaction['options'].getRole('role', true);
  const action: Lib_ServerToolFeatures_HandleRole_Action = interaction['options'].getString('action', true);
  const botMember: Lib_ServerToolFeatures_HandleRole_BotMember = interaction['guild']['members']['me'];

  if (
    botMember === null
    || botMember['permissions'].has(PermissionFlagsBits.ManageRoles) === false
    || role['id'] === interaction['guild']['id']
    || role['managed'] === true
    || role['position'] >= botMember['roles']['highest']['position']
    || (
      invoker['id'] !== interaction['guild']['ownerId']
      && role['position'] >= invoker['roles']['highest']['position']
    )
    || (
      invoker['id'] !== interaction['guild']['ownerId']
      && targetMember['roles']['highest']['position'] >= invoker['roles']['highest']['position']
    )
  ) {
    return 'That member or role is outside the manageable hierarchy.';
  }

  if (action === 'add') {
    if (targetMember['roles']['cache'].has(role['id']) === true) {
      return 'The member already has that role.';
    }

    await targetMember['roles'].add(role, `Confirmed Stonker role action by ${invoker['id']}`);

    return `Added ${role['name']} to ${targetUser['username']}.`;
  }

  if (targetMember['roles']['cache'].has(role['id']) === false) {
    return 'The member does not have that role.';
  }

  await targetMember['roles'].remove(role, `Confirmed Stonker role action by ${invoker['id']}`);

  return `Removed ${role['name']} from ${targetUser['username']}.`;
}

/**
 * Server Tool Features - Handle Voice.
 *
 * Moves or disconnects one connected member after an explicit confirmation.
 * The destination must be a current server voice-based channel.
 *
 * @param {Lib_ServerToolFeatures_HandleVoice_Interaction} interaction - Interaction.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HandleVoice_Returns}
 *
 * @since 4.0.0
 */
async function handleVoice(
  interaction: Lib_ServerToolFeatures_HandleVoice_Interaction,
): Lib_ServerToolFeatures_HandleVoice_Returns {
  const confirmed: Lib_ServerToolFeatures_HandleVoice_Confirmed = interaction['options'].getBoolean('confirm', true);

  if (confirmed === false) {
    return 'No voice state was changed because confirmation was false.';
  }

  const targetUser: Lib_ServerToolFeatures_HandleVoice_TargetUser = interaction['options'].getUser('member', true);
  const targetMember: Lib_ServerToolFeatures_HandleVoice_TargetMember = await interaction['guild']['members'].fetch(
    targetUser['id'],
  );
  const action: Lib_ServerToolFeatures_HandleVoice_Action = interaction['options'].getString('action', true);
  const channelOption: Lib_ServerToolFeatures_HandleVoice_ChannelOption = interaction['options'].getChannel('channel');
  const targetChannel: Lib_ServerToolFeatures_HandleVoice_TargetChannel = channelOption;

  if (targetMember['voice']['channelId'] === null) {
    return 'The selected member is not connected to voice.';
  }

  if (action === 'disconnect') {
    await targetMember['voice'].disconnect('Confirmed Stonker voice action');

    return `Disconnected ${targetUser['username']} from voice.`;
  }

  if (
    targetChannel === null
    || targetChannel['guild']['id'] !== interaction['guild']['id']
    || targetChannel.isVoiceBased() === false
  ) {
    return 'Choose a destination voice channel for a move.';
  }

  await targetMember['voice'].setChannel(targetChannel, 'Confirmed Stonker voice action');

  return `Moved ${targetUser['username']} to ${targetChannel['name']}.`;
}

/**
 * Server Tool Features - Has Configured Role.
 *
 * Requires one exact trusted-role match from validated module configuration.
 * Server ownership does not silently bypass the explicit operator policy.
 *
 * @param {Lib_ServerToolFeatures_HasConfiguredRole_Invoker}                invoker                - Invoker.
 * @param {Lib_ServerToolFeatures_HasConfiguredRole_AllowedRoleIdentifiers} allowedRoleIdentifiers - Allowed role identifiers.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HasConfiguredRole_Returns}
 *
 * @since 4.0.0
 */
function hasConfiguredRole(
  invoker: Lib_ServerToolFeatures_HasConfiguredRole_Invoker,
  allowedRoleIdentifiers: Lib_ServerToolFeatures_HasConfiguredRole_AllowedRoleIdentifiers,
): Lib_ServerToolFeatures_HasConfiguredRole_Returns {
  return invoker['roles']['cache'].some((role) => allowedRoleIdentifiers.has(role['id']) === true);
}

/**
 * Server Tool Features - Has Required Discord Permission.
 *
 * Applies the current Discord permission corresponding to each command family.
 * This gate supplements the configured trusted role instead of replacing it.
 *
 * @param {Lib_ServerToolFeatures_HasRequiredDiscordPermission_Invoker} invoker - Invoker.
 * @param {Lib_ServerToolFeatures_HasRequiredDiscordPermission_ToolKey} toolKey - Tool key.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_HasRequiredDiscordPermission_Returns}
 *
 * @since 4.0.0
 */
function hasRequiredDiscordPermission(
  invoker: Lib_ServerToolFeatures_HasRequiredDiscordPermission_Invoker,
  toolKey: Lib_ServerToolFeatures_HasRequiredDiscordPermission_ToolKey,
): Lib_ServerToolFeatures_HasRequiredDiscordPermission_Returns {
  switch (toolKey) {
    case 'bulk-ban': {
      return invoker['permissions'].has(PermissionFlagsBits.BanMembers);
    }

    case 'role-manager': {
      return invoker['permissions'].has(PermissionFlagsBits.ManageRoles);
    }

    case 'voice-tools': {
      return invoker['permissions'].has(PermissionFlagsBits.MoveMembers);
    }

    default: {
      return invoker['permissions'].has(PermissionFlagsBits.ManageGuild);
    }
  }
}

/**
 * Server Tool Features - Is Record.
 *
 * Narrows untrusted settings before feature state properties are read.
 * Arrays and null do not qualify as configuration maps.
 *
 * @param {Lib_ServerToolFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_ServerToolFeatures_IsRecord_Value,
): value is Lib_ServerToolFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Server Tool Features - Prepare Server Tool Features.
 *
 * Compiles the optional module and derives only the Gateway intents it needs.
 * Invalid tool configuration remains isolated from every other feature module.
 *
 * @param {Lib_ServerToolFeatures_PrepareServerToolFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareServerToolFeatures(
  settings: Lib_ServerToolFeatures_PrepareServerToolFeatures_Settings,
): Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns {
  let runtime: Lib_ServerToolFeatures_PrepareServerToolFeatures_Runtime = undefined;
  const activeFeatureKeys: Lib_ServerToolFeatures_PrepareServerToolFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_ServerToolFeatures_PrepareServerToolFeatures_ConfigurationErrors = [];
  const feature: Lib_ServerToolFeatures_PrepareServerToolFeatures_Feature = getEnabledFeature(settings);

  if (feature !== undefined) {
    try {
      runtime = compileServerTools(feature['configuration']);

      activeFeatureKeys.push('server-tools');
    } catch (error) {
      recordConfigurationError(error, configurationErrors);
    }
  }

  const intents: Lib_ServerToolFeatures_PrepareServerToolFeatures_Intents = [];
  const memberIntentRequired: Lib_ServerToolFeatures_PrepareServerToolFeatures_MemberIntentRequired = (
    runtime !== undefined
    && (
      runtime['tools']['bulk-ban'] !== undefined
      || runtime['tools']['fetch-duplicates'] !== undefined
      || runtime['tools']['fetch-members'] !== undefined
      || runtime['tools']['role-manager'] !== undefined
      || runtime['tools']['voice-tools'] !== undefined
    )
  );
  const voiceIntentRequired: Lib_ServerToolFeatures_PrepareServerToolFeatures_VoiceIntentRequired = (
    runtime !== undefined
    && runtime['tools']['voice-tools'] !== undefined
  );

  if (memberIntentRequired === true) {
    intents.push(GatewayIntentBits.GuildMembers);
  }

  if (voiceIntentRequired === true) {
    intents.push(GatewayIntentBits.GuildVoiceStates);
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: createRegistration((runtime === undefined) ? {
      tools: {},
    } : runtime),
  };
}

/**
 * Server Tool Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one bounded startup warning.
 * A rejected command module cannot affect Gateway connection admission.
 *
 * @param {Lib_ServerToolFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_ServerToolFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_ServerToolFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  error: Lib_ServerToolFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_ServerToolFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_ServerToolFeatures_RecordConfigurationError_Returns {
  const message: Lib_ServerToolFeatures_RecordConfigurationError_Message = `server-tools: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'server_tool_feature_configuration_rejected', {
    featureKey: 'server-tools',
    message,
  });

  return;
}
