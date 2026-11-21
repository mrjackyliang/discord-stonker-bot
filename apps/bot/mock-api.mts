import {
  createHash,
  randomBytes,
  randomUUID,
} from 'node:crypto';
import { readFileSync } from 'node:fs';

import {
  Secret,
  TOTP,
} from 'otpauth';
import { toDataURL } from 'qrcode';

import {
  administratorUsernamePattern,
  featurePathPattern,
  hexColorPattern,
  inviteImagesPathPattern,
  mediaPathPattern,
  notificationPathPattern,
  separatorsPattern,
  serverPathPattern,
  tokenPathPattern,
  totpCodePattern,
  userPathPattern,
} from './src/web/regex.js';

import type {
  MockApi_AddServerUrl_Returns,
  MockApi_AgoIso_Minutes,
  MockApi_AgoIso_Returns,
  MockApi_ApplyMockBackup_Document,
  MockApi_ApplyMockBackup_Existing,
  MockApi_ApplyMockBackup_Feature,
  MockApi_ApplyMockBackup_FeatureKey,
  MockApi_ApplyMockBackup_Hashes,
  MockApi_ApplyMockBackup_Id,
  MockApi_ApplyMockBackup_Ids,
  MockApi_ApplyMockBackup_ImportedSections,
  MockApi_ApplyMockBackup_Modules,
  MockApi_ApplyMockBackup_Names,
  MockApi_ApplyMockBackup_Next,
  MockApi_ApplyMockBackup_Preview,
  MockApi_ApplyMockBackup_Result,
  MockApi_ApplyMockBackup_Returns,
  MockApi_ApplyMockBackup_SecretEntry,
  MockApi_ApplyMockBackup_Secrets,
  MockApi_ApplyMockBackup_Source,
  MockApi_ApplyMockBackup_State,
  MockApi_ApplyMockBackup_States,
  MockApi_ApplyMockBackup_Summary,
  MockApi_ApplyMockBackup_UsedIds,
  MockApi_ApplyMockBackup_User,
  MockApi_BackupGrants,
  MockApi_BackupPasskeyCeremonies,
  MockApi_BlankSecrets_Entry,
  MockApi_BlankSecrets_Returns,
  MockApi_BlankSecrets_Value,
  MockApi_Bot,
  MockApi_BotResource_Returns,
  MockApi_BotTimer,
  MockApi_Channels,
  MockApi_ClubId,
  MockApi_CollectReferences_Path,
  MockApi_CollectReferences_Returns,
  MockApi_CollectReferences_Value,
  MockApi_ConsumeBackupGrant_Key,
  MockApi_ConsumeBackupGrant_Purpose,
  MockApi_ConsumeBackupGrant_Record,
  MockApi_ConsumeBackupGrant_Returns,
  MockApi_ConsumeBackupGrant_SessionId,
  MockApi_ConsumeBackupGrant_Value,
  MockApi_CreateMockBackupDocument_Document,
  MockApi_CreateMockBackupDocument_Key,
  MockApi_CreateMockBackupDocument_Returns,
  MockApi_CreateMockBackupDocument_Secret,
  MockApi_CreateMockBackupDocument_SecretEntry,
  MockApi_CreateMockBackupDocument_Secrets,
  MockApi_CreateMockBackupDocument_Sections,
  MockApi_CreateMockBackupDocument_State,
  MockApi_CreateMockBackupDocument_Store,
  MockApi_CreateMockBackupDocument_User,
  MockApi_CsrfValid_Request,
  MockApi_CsrfValid_Returns,
  MockApi_CsrfValid_Session,
  MockApi_DebugLogging,
  MockApi_DesignerResponse_Origin,
  MockApi_DesignerResponse_Page,
  MockApi_DesignerResponse_Path,
  MockApi_DesignerResponse_Returns,
  MockApi_DesignerResponse_Server,
  MockApi_Digest_Returns,
  MockApi_Digest_Value,
  MockApi_EditableBy_Manager,
  MockApi_EditableBy_Returns,
  MockApi_EditableBy_User,
  MockApi_EmptyBackupSummary_Returns,
  MockApi_EnsureFeatures_Returns,
  MockApi_EscapeHtml_Returns,
  MockApi_EscapeHtml_Value,
  MockApi_Examples,
  MockApi_FallbackCatalog,
  MockApi_FallbackConfigurations,
  MockApi_FallbackEditors,
  MockApi_FallbackModules_Returns,
  MockApi_FallbackNoticeShown,
  MockApi_FeatureDetail_Editor,
  MockApi_FeatureDetail_Entry,
  MockApi_FeatureDetail_Modules,
  MockApi_FeatureDetail_Returns,
  MockApi_FeatureDetail_Saved,
  MockApi_FeatureDetail_ServerId,
  MockApi_FeatureDetail_State,
  MockApi_FeatureDetail_Store,
  MockApi_FeatureDisplayName_Feature,
  MockApi_FeatureDisplayName_FeatureKey,
  MockApi_FeatureDisplayName_Modules,
  MockApi_FeatureDisplayName_Returns,
  MockApi_FeaturesReady,
  MockApi_FeatureStates,
  MockApi_FeatureSummary_Entry,
  MockApi_FeatureSummary_Returns,
  MockApi_FeatureSummary_ServerId,
  MockApi_FeatureSummary_State,
  MockApi_FieldIssue_Field,
  MockApi_FieldIssue_Message,
  MockApi_FieldIssue_Returns,
  MockApi_HandlePublic_Address,
  MockApi_HandlePublic_Available,
  MockApi_HandlePublic_BannerUrl,
  MockApi_HandlePublic_Body,
  MockApi_HandlePublic_Data,
  MockApi_HandlePublic_Description,
  MockApi_HandlePublic_Head,
  MockApi_HandlePublic_Html,
  MockApi_HandlePublic_Image,
  MockApi_HandlePublic_LogoUrl,
  MockApi_HandlePublic_MediaMatch,
  MockApi_HandlePublic_Method,
  MockApi_HandlePublic_Origin,
  MockApi_HandlePublic_Page,
  MockApi_HandlePublic_PreviewImage,
  MockApi_HandlePublic_Recent,
  MockApi_HandlePublic_Request,
  MockApi_HandlePublic_Response,
  MockApi_HandlePublic_Returns,
  MockApi_HandlePublic_Server,
  MockApi_HandlePublic_StatsParts,
  MockApi_HandlePublic_Template,
  MockApi_HandlePublic_TwitterCard,
  MockApi_HandlePublic_Url,
  MockApi_HandleRequest_Access,
  MockApi_HandleRequest_AccessInput,
  MockApi_HandleRequest_AccessInput_AccessRole,
  MockApi_HandleRequest_AccessInput_AllServers,
  MockApi_HandleRequest_AccessInput_Issues,
  MockApi_HandleRequest_AccessInput_Returns,
  MockApi_HandleRequest_AccessInput_Role,
  MockApi_HandleRequest_AccessInput_ServerIds,
  MockApi_HandleRequest_Action,
  MockApi_HandleRequest_After,
  MockApi_HandleRequest_Allowed,
  MockApi_HandleRequest_BannerImageId,
  MockApi_HandleRequest_Binding,
  MockApi_HandleRequest_Body,
  MockApi_HandleRequest_Candidate,
  MockApi_HandleRequest_CeremonyId,
  MockApi_HandleRequest_CeremonyIdInput,
  MockApi_HandleRequest_ChallengeUser,
  MockApi_HandleRequest_CheckPassword,
  MockApi_HandleRequest_CheckPassword_Field,
  MockApi_HandleRequest_CheckPassword_Returns,
  MockApi_HandleRequest_ClaimUsername,
  MockApi_HandleRequest_ClaimUsernameIssue,
  MockApi_HandleRequest_Code,
  MockApi_HandleRequest_Component,
  MockApi_HandleRequest_Configuration,
  MockApi_HandleRequest_ContentType,
  MockApi_HandleRequest_ContentTypeHeader,
  MockApi_HandleRequest_Created,
  MockApi_HandleRequest_CurrentChallenge,
  MockApi_HandleRequest_Cursor,
  MockApi_HandleRequest_CursorStart,
  MockApi_HandleRequest_Document,
  MockApi_HandleRequest_Entry,
  MockApi_HandleRequest_FeatureMatch,
  MockApi_HandleRequest_Field,
  MockApi_HandleRequest_FoundNotification,
  MockApi_HandleRequest_FoundToken,
  MockApi_HandleRequest_FreshSecrets,
  MockApi_HandleRequest_Image,
  MockApi_HandleRequest_ImageChecks,
  MockApi_HandleRequest_ImageId,
  MockApi_HandleRequest_Index,
  MockApi_HandleRequest_IsSession,
  MockApi_HandleRequest_Issues,
  MockApi_HandleRequest_IsTotpCode,
  MockApi_HandleRequest_Items,
  MockApi_HandleRequest_KeepAlive,
  MockApi_HandleRequest_Key,
  MockApi_HandleRequest_LastItem,
  MockApi_HandleRequest_LastMatching,
  MockApi_HandleRequest_LastMatchingId,
  MockApi_HandleRequest_LevelParam,
  MockApi_HandleRequest_LoginPassword,
  MockApi_HandleRequest_LoginUser,
  MockApi_HandleRequest_LoginUsername,
  MockApi_HandleRequest_Logo,
  MockApi_HandleRequest_LogoImageId,
  MockApi_HandleRequest_Matching,
  MockApi_HandleRequest_Message,
  MockApi_HandleRequest_Method,
  MockApi_HandleRequest_MinimumLevel,
  MockApi_HandleRequest_Modules,
  MockApi_HandleRequest_NewImageId,
  MockApi_HandleRequest_NewToken,
  MockApi_HandleRequest_NextUsername,
  MockApi_HandleRequest_NextUsernameIssue,
  MockApi_HandleRequest_Node,
  MockApi_HandleRequest_Notification,
  MockApi_HandleRequest_NotificationInput,
  MockApi_HandleRequest_NotificationInput_Clearable,
  MockApi_HandleRequest_NotificationInput_ClearSecretKeys,
  MockApi_HandleRequest_NotificationInput_ClearSecrets,
  MockApi_HandleRequest_NotificationInput_Events,
  MockApi_HandleRequest_NotificationInput_Existing,
  MockApi_HandleRequest_NotificationInput_ExistingId,
  MockApi_HandleRequest_NotificationInput_InvalidIndex,
  MockApi_HandleRequest_NotificationInput_Key,
  MockApi_HandleRequest_NotificationInput_Missing,
  MockApi_HandleRequest_NotificationInput_Name,
  MockApi_HandleRequest_NotificationInput_Replaced,
  MockApi_HandleRequest_NotificationInput_Required,
  MockApi_HandleRequest_NotificationInput_Returns,
  MockApi_HandleRequest_NotificationInput_Saved,
  MockApi_HandleRequest_NotificationInput_Secret,
  MockApi_HandleRequest_NotificationInput_Secrets,
  MockApi_HandleRequest_NotificationInput_Service,
  MockApi_HandleRequest_NotificationInput_Settings,
  MockApi_HandleRequest_NotificationInput_Value,
  MockApi_HandleRequest_NotificationInput_Values,
  MockApi_HandleRequest_NotificationInputValue,
  MockApi_HandleRequest_NotificationMatch,
  MockApi_HandleRequest_Page,
  MockApi_HandleRequest_PageLogo,
  MockApi_HandleRequest_PageTheme,
  MockApi_HandleRequest_Parsed,
  MockApi_HandleRequest_Passkey,
  MockApi_HandleRequest_PasskeyId,
  MockApi_HandleRequest_PasskeyName,
  MockApi_HandleRequest_PasswordProblem,
  MockApi_HandleRequest_Path,
  MockApi_HandleRequest_PendingPasskeyName,
  MockApi_HandleRequest_Plaintext,
  MockApi_HandleRequest_Pointer,
  MockApi_HandleRequest_Poll,
  MockApi_HandleRequest_Principal,
  MockApi_HandleRequest_Problems,
  MockApi_HandleRequest_Purpose,
  MockApi_HandleRequest_Raw,
  MockApi_HandleRequest_RecoveryCode,
  MockApi_HandleRequest_Referenced,
  MockApi_HandleRequest_Request,
  MockApi_HandleRequest_Requested,
  MockApi_HandleRequest_RequirePermission,
  MockApi_HandleRequest_RequirePermission_Permission,
  MockApi_HandleRequest_RequirePermission_Returns,
  MockApi_HandleRequest_RequireScope,
  MockApi_HandleRequest_RequireScope_Returns,
  MockApi_HandleRequest_RequireScope_Scope,
  MockApi_HandleRequest_RequireSession,
  MockApi_HandleRequest_RequireSession_Returns,
  MockApi_HandleRequest_Resolve,
  MockApi_HandleRequest_Resolve_Key,
  MockApi_HandleRequest_Resolve_Returns,
  MockApi_HandleRequest_Response,
  MockApi_HandleRequest_Rest,
  MockApi_HandleRequest_Result,
  MockApi_HandleRequest_Returns,
  MockApi_HandleRequest_Saved,
  MockApi_HandleRequest_Search,
  MockApi_HandleRequest_SecretValues,
  MockApi_HandleRequest_Selected,
  MockApi_HandleRequest_Server,
  MockApi_HandleRequest_ServerId,
  MockApi_HandleRequest_ServerMatch,
  MockApi_HandleRequest_SessionId,
  MockApi_HandleRequest_Signature,
  MockApi_HandleRequest_Signatures,
  MockApi_HandleRequest_Source,
  MockApi_HandleRequest_State,
  MockApi_HandleRequest_Store,
  MockApi_HandleRequest_Target,
  MockApi_HandleRequest_Text,
  MockApi_HandleRequest_Text_Key,
  MockApi_HandleRequest_Text_Returns,
  MockApi_HandleRequest_Theme,
  MockApi_HandleRequest_Token,
  MockApi_HandleRequest_TokenInput,
  MockApi_HandleRequest_TokenInput_ExceptId,
  MockApi_HandleRequest_TokenInput_Grantable,
  MockApi_HandleRequest_TokenInput_Name,
  MockApi_HandleRequest_TokenInput_Returns,
  MockApi_HandleRequest_TokenInput_Scopes,
  MockApi_HandleRequest_TokenInput_Ungrantable,
  MockApi_HandleRequest_TokenInputValue,
  MockApi_HandleRequest_TokenMatch,
  MockApi_HandleRequest_TokenPlaintext,
  MockApi_HandleRequest_TotpSecret,
  MockApi_HandleRequest_TotpUri,
  MockApi_HandleRequest_UnknownKeys,
  MockApi_HandleRequest_UploadRoute,
  MockApi_HandleRequest_Url,
  MockApi_HandleRequest_User,
  MockApi_HandleRequest_UserMatch,
  MockApi_HandleRequest_Username,
  MockApi_HandleRequest_UsernameProblem,
  MockApi_HandleRequest_VisibleSecret,
  MockApi_Images,
  MockApi_InviteAttempts,
  MockApi_InvitePageFor_Created,
  MockApi_InvitePageFor_Existing,
  MockApi_InvitePageFor_Returns,
  MockApi_InvitePageFor_Server,
  MockApi_InvitePages,
  MockApi_InvitePathFor_Configuration,
  MockApi_InvitePathFor_Generator,
  MockApi_InvitePathFor_Options,
  MockApi_InvitePathFor_Path,
  MockApi_InvitePathFor_Returns,
  MockApi_InvitePathFor_ServerId,
  MockApi_IsRecord_TypeGuard,
  MockApi_IsRecord_Value,
  MockApi_IssueBackupGrant_ExpiresAt,
  MockApi_IssueBackupGrant_Grant,
  MockApi_IssueBackupGrant_Purpose,
  MockApi_IssueBackupGrant_Returns,
  MockApi_IssueBackupGrant_SessionId,
  MockApi_KeyReplaced,
  MockApi_LegacyWarningLabel_Returns,
  MockApi_LegacyWarningLabel_Warning,
  MockApi_LevelOrder,
  MockApi_LiveEvents,
  MockApi_LoadModules_BlankSecretReferences,
  MockApi_LoadModules_Catalog,
  MockApi_LoadModules_CatalogModule,
  MockApi_LoadModules_Editor,
  MockApi_LoadModules_EditorModule,
  MockApi_LoadModules_ErrorMessage,
  MockApi_LoadModules_GetFeatureCatalog,
  MockApi_LoadModules_GetFeatureEditor,
  MockApi_LoadModules_GetFeatureExample,
  MockApi_LoadModules_ImportLegacyConfiguration,
  MockApi_LoadModules_ImportModule,
  MockApi_LoadModules_Issues,
  MockApi_LoadModules_LegacyResult,
  MockApi_LoadModules_Returns,
  MockApi_LoadModules_SecretsModule,
  MockApi_LoadModules_ValidateFeatureConfiguration,
  MockApi_LoadModules_ValidationModule,
  MockApi_Logs,
  MockApi_LogSequence,
  MockApi_LoungeIcon,
  MockApi_LoungeId,
  MockApi_MatchesLogFilters_Component,
  MockApi_MatchesLogFilters_Entry,
  MockApi_MatchesLogFilters_MinimumLevel,
  MockApi_MatchesLogFilters_Needle,
  MockApi_MatchesLogFilters_Returns,
  MockApi_MatchesLogFilters_Search,
  MockApi_MediaUrl_ImageId,
  MockApi_MediaUrl_Returns,
  MockApi_Minute,
  MockApi_MockApi_ErrorMessage,
  MockApi_MockApi_LiveTimer,
  MockApi_MockApi_Next,
  MockApi_MockApi_Request,
  MockApi_MockApi_Response,
  MockApi_MockApi_Returns,
  MockApi_MockPassword,
  MockApi_NewRecoveryCodes_Code,
  MockApi_NewRecoveryCodes_Returns,
  MockApi_NormalizeCode_Returns,
  MockApi_NormalizeCode_Value,
  MockApi_NotificationEvents,
  MockApi_NotificationFields,
  MockApi_Notifications,
  MockApi_NowIso_Returns,
  MockApi_Owner,
  MockApi_ParseMockBackupSource_Document,
  MockApi_ParseMockBackupSource_Returns,
  MockApi_ParseMockBackupSource_Source,
  MockApi_ParseMockBackupSource_Value,
  MockApi_PasskeyCeremonies,
  MockApi_PasskeysByUser,
  MockApi_PasswordIssue_Returns,
  MockApi_PasswordIssue_Value,
  MockApi_PendingChallenge,
  MockApi_PermissionMessages,
  MockApi_PermissionsOf_Returns,
  MockApi_PermissionsOf_User,
  MockApi_PrepareFeatures_Configuration,
  MockApi_PrepareFeatures_Example,
  MockApi_PrepareFeatures_ExampleText,
  MockApi_PrepareFeatures_Imported,
  MockApi_PrepareFeatures_ImportedFeature,
  MockApi_PrepareFeatures_ImportedFeatures,
  MockApi_PrepareFeatures_LoungeOn,
  MockApi_PrepareFeatures_Modules,
  MockApi_PrepareFeatures_Returns,
  MockApi_PreviewMockBackup_CurrentFeatures,
  MockApi_PreviewMockBackup_Document,
  MockApi_PreviewMockBackup_Enabled,
  MockApi_PreviewMockBackup_FeaturesRequiringFixes,
  MockApi_PreviewMockBackup_FileFeaturesPlural,
  MockApi_PreviewMockBackup_FilePlural,
  MockApi_PreviewMockBackup_FileServersPlural,
  MockApi_PreviewMockBackup_FileState,
  MockApi_PreviewMockBackup_FileToken,
  MockApi_PreviewMockBackup_Hashes,
  MockApi_PreviewMockBackup_HereFeaturesPlural,
  MockApi_PreviewMockBackup_HerePlural,
  MockApi_PreviewMockBackup_HereServersPlural,
  MockApi_PreviewMockBackup_HereState,
  MockApi_PreviewMockBackup_HereToken,
  MockApi_PreviewMockBackup_Invalid,
  MockApi_PreviewMockBackup_Modules,
  MockApi_PreviewMockBackup_Names,
  MockApi_PreviewMockBackup_OwnTokens,
  MockApi_PreviewMockBackup_Recognized,
  MockApi_PreviewMockBackup_RecognizedPlural,
  MockApi_PreviewMockBackup_Result,
  MockApi_PreviewMockBackup_Returns,
  MockApi_PreviewMockBackup_Sections,
  MockApi_PreviewMockBackup_Source,
  MockApi_PreviewMockBackup_Summary,
  MockApi_PreviewMockBackup_Unsupported,
  MockApi_PreviewMockBackup_User,
  MockApi_PreviewMockBackup_Warnings,
  MockApi_PrincipalOf_Authorization,
  MockApi_PrincipalOf_Request,
  MockApi_PrincipalOf_Returns,
  MockApi_PrincipalOf_Session,
  MockApi_PrincipalOf_Token,
  MockApi_PrincipalOf_User,
  MockApi_ReadCookies_Entry,
  MockApi_ReadCookies_Request,
  MockApi_ReadCookies_Returns,
  MockApi_ReadPointer_Current,
  MockApi_ReadPointer_Pointer,
  MockApi_ReadPointer_Returns,
  MockApi_ReadPointer_Value,
  MockApi_ReadRaw_Chunks,
  MockApi_ReadRaw_Request,
  MockApi_ReadRaw_Returns,
  MockApi_RecaptchaTestSiteKey,
  MockApi_RemovedSecrets,
  MockApi_RolePermissions,
  MockApi_RoleRank,
  MockApi_Roles,
  MockApi_ScopeOrder,
  MockApi_SecretKeys,
  MockApi_SecretsFor_Created,
  MockApi_SecretsFor_Existing,
  MockApi_SecretsFor_Returns,
  MockApi_SecretsFor_ServerId,
  MockApi_SecretStores,
  MockApi_SeedAccounts_AllServers,
  MockApi_SeedAccounts_Claimed,
  MockApi_SeedAccounts_Enabled,
  MockApi_SeedAccounts_LastSignIn,
  MockApi_SeedAccounts_Returns,
  MockApi_SeedAccounts_Role,
  MockApi_SeedAccounts_Seeds,
  MockApi_SeedAccounts_ServerIds,
  MockApi_SeedAccounts_TotpEnabled,
  MockApi_SeedAccounts_Username,
  MockApi_SeedLogs_Entries,
  MockApi_SeedLogs_Returns,
  MockApi_SendEmpty_Response,
  MockApi_SendEmpty_Returns,
  MockApi_SendEmpty_Status,
  MockApi_SendError_Code,
  MockApi_SendError_Message,
  MockApi_SendError_Response,
  MockApi_SendError_Returns,
  MockApi_SendError_Status,
  MockApi_SendIssues_Code,
  MockApi_SendIssues_FirstIssue,
  MockApi_SendIssues_Issues,
  MockApi_SendIssues_Response,
  MockApi_SendIssues_Returns,
  MockApi_SendIssues_Status,
  MockApi_SendJson_Body,
  MockApi_SendJson_Response,
  MockApi_SendJson_Returns,
  MockApi_SendJson_Status,
  MockApi_Servers,
  MockApi_ServerVisible_Returns,
  MockApi_ServerVisible_ServerId,
  MockApi_ServerVisible_User,
  MockApi_Sessions,
  MockApi_SetBotStatus_Delay,
  MockApi_SetBotStatus_Next,
  MockApi_SetBotStatus_Returns,
  MockApi_SetBotStatus_Status,
  MockApi_SetupCode,
  MockApi_SignOutUser_Returns,
  MockApi_SignOutUser_Session,
  MockApi_SignOutUser_SessionId,
  MockApi_SignOutUser_UserId,
  MockApi_SnowflakeAt_Returns,
  MockApi_SnowflakeAt_Time,
  MockApi_StartedAt,
  MockApi_StartSession_CsrfToken,
  MockApi_StartSession_Response,
  MockApi_StartSession_Returns,
  MockApi_StartSession_SessionId,
  MockApi_StartSession_SignedIn,
  MockApi_StartSession_Status,
  MockApi_StartSession_User,
  MockApi_StateOf_Created,
  MockApi_StateOf_Existing,
  MockApi_StateOf_FeatureKey,
  MockApi_StateOf_Returns,
  MockApi_StateOf_ServerId,
  MockApi_StateOf_States,
  MockApi_StatesFor_Created,
  MockApi_StatesFor_Existing,
  MockApi_StatesFor_Returns,
  MockApi_StatesFor_ServerId,
  MockApi_StringList_Returns,
  MockApi_StringList_Value,
  MockApi_TokenResource_Returns,
  MockApi_TokenResource_Token,
  MockApi_Tokens,
  MockApi_UserIdFor_Returns,
  MockApi_UserIdFor_Sequence,
  MockApi_UsernameIssue_Returns,
  MockApi_UsernameIssue_Value,
  MockApi_UserResource_Manager,
  MockApi_UserResource_Returns,
  MockApi_UserResource_User,
  MockApi_Users,
  MockApi_UserSequence,
  MockApi_ViteServer,
  MockApi_WriteLiveLog_Pick,
  MockApi_WriteLiveLog_Returns,
  MockApi_WriteLog_Component,
  MockApi_WriteLog_Context,
  MockApi_WriteLog_Event,
  MockApi_WriteLog_Level,
  MockApi_WriteLog_MinutesAgo,
  MockApi_WriteLog_Returns,
} from './src/types/mock-api.d.ts';

// Each service's fields: [key, message when missing, secret, required].

/**
 * Mock API - Notification Fields.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationFields: MockApi_NotificationFields = {
  'apprise': [
    [
      'url',
      'Enter the Apprise URL.',
      true,
      true,
    ],
    [
      'urls',
      '',
      true,
      false,
    ],
  ],
  'discord': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'email': [
    [
      'host',
      'Enter the SMTP server.',
      false,
      true,
    ],
    [
      'port',
      'Enter a port number.',
      false,
      true,
    ],
    [
      'security',
      'Choose STARTTLS, TLS, or none.',
      false,
      true,
    ],
    [
      'username',
      '',
      false,
      false,
    ],
    [
      'password',
      '',
      true,
      false,
    ],
    [
      'from',
      'Enter the address to send from.',
      false,
      true,
    ],
    [
      'to',
      'Enter the address to send to.',
      false,
      true,
    ],
  ],
  'gotify': [
    [
      'url',
      'Enter the server URL.',
      false,
      true,
    ],
    [
      'token',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'matrix': [
    [
      'homeserverUrl',
      'Enter the homeserver URL.',
      false,
      true,
    ],
    [
      'roomId',
      'Enter the room ID.',
      false,
      true,
    ],
    [
      'accessToken',
      'Enter the access token.',
      true,
      true,
    ],
  ],
  'ntfy': [
    [
      'url',
      'Enter the topic URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'ntfy-reverse-proxy': [
    [
      'url',
      'Enter the context URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'pushover': [
    [
      'userKey',
      'Enter the user key.',
      true,
      true,
    ],
    [
      'appToken',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'slack': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'telegram': [
    [
      'botToken',
      'Enter the bot token.',
      true,
      true,
    ],
    [
      'chatId',
      'Enter the chat ID.',
      false,
      true,
    ],
  ],
  'webhook': [
    [
      'url',
      'Enter the URL.',
      true,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
};

/**
 * Mock API - Notification Events.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationEvents: MockApi_NotificationEvents = [
  {
    defaultEnabled: true,
    description: 'The app started without its key and removed what it locked.',
    key: 'secrets-removed',
    label: 'Saved secrets were removed',
  },
  {
    defaultEnabled: true,
    description: 'Ten failed sign-ins from one address paused sign-in from it.',
    key: 'sign-in-locked',
    label: 'Sign-in locked',
  },
  {
    defaultEnabled: true,
    description: 'Discord refused the Bot Token, or the bot couldn\'t start.',
    key: 'bot-sign-in-failed',
    label: 'Bot can\'t sign in',
  },
  {
    defaultEnabled: true,
    description: 'The bot lost its connection to Discord.',
    key: 'bot-disconnected',
    label: 'Bot disconnected',
  },
  {
    defaultEnabled: true,
    description: 'The bot is back on Discord after a drop.',
    key: 'bot-reconnected',
    label: 'Bot reconnected',
  },
  {
    defaultEnabled: true,
    description: 'A scheduled post, feed delivery, or webhook failed on every try.',
    key: 'job-failed',
    label: 'Job gave up',
  },
];

/**
 * Mock API - Setup Code.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const setupCode: MockApi_SetupCode = 'K7Q2M-XR9TD-P4W8N';

/**
 * Mock API - Mock Password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const mockPassword: MockApi_MockPassword = 'mock password 123';

/**
 * Mock API - Minute.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const minute: MockApi_Minute = 60 * 1000;

/**
 * Mock API - Started At.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const startedAt: MockApi_StartedAt = Date.now();

/**
 * Mock API - Level Order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const levelOrder: MockApi_LevelOrder = [
  'debug',
  'info',
  'warn',
  'error',
];

/**
 * Mock API - Scope Order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const scopeOrder: MockApi_ScopeOrder = [
  'bot:control',
  'features:read',
  'features:write',
  'logs:read',
];

/**
 * Mock API - Role Permissions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rolePermissions: MockApi_RolePermissions = {
  administrator: [
    'bot:control',
    'configuration:write',
    'users:manage',
  ],
  operator: [
    'bot:control',
    'configuration:write',
  ],
  owner: [
    'bot:control',
    'configuration:write',
    'users:manage',
  ],
  viewer: [],
};

/**
 * Mock API - Permission Messages.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const permissionMessages: MockApi_PermissionMessages = {
  'bot:control': 'Your role can\'t start or stop the bot.',
  'configuration:write': 'Your role can\'t change settings.',
  'users:manage': 'Your role can\'t manage users.',
};

// Google's published reCAPTCHA v2 test key: the box always passes and says it's for testing.

/**
 * Mock API - Recaptcha Test Site Key.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const recaptchaTestSiteKey: MockApi_RecaptchaTestSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

/**
 * Mock API - Lounge Icon.
 *
 * The Stonker Lounge server's icon: Lucide's sofa on the purple tile.
 * Lucide Icons v1.61.0 - ISC License, Copyright (c) 2026 Lucide Icons and Contributors.
 *
 * @since 4.0.0
 */
const loungeIcon: MockApi_LoungeIcon = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#6250d9"/><g transform="translate(14 14) scale(1.5)" fill="none" stroke="#fff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></g></svg>').toString('base64')}`;

/**
 * Mock API - Servers.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const servers: MockApi_Servers = [
  {
    available: true,
    boostTier: 2,
    iconUrl: loungeIcon,
    id: '1197999049190674442',
    memberCount: 1204,
    name: 'Stonker Lounge',
  },
  {
    available: true,
    boostTier: 0,
    iconUrl: null,
    id: '1215553108329484288',
    memberCount: 86,
    name: 'Book Club',
  },
];

/**
 * Mock API - Lounge ID.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const loungeId: MockApi_LoungeId = '1197999049190674442';

/**
 * Mock API - Club ID.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const clubId: MockApi_ClubId = '1215553108329484288';

/**
 * Mock API - Channels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const channels: MockApi_Channels = {
  [clubId]: [
    {
      available: true,
      id: '1215553108786663424',
      name: 'club-chat',
      type: 0,
    },
    {
      available: true,
      id: '1215553108786663425',
      name: 'reading-list',
      type: 0,
    },
    {
      available: true,
      id: '1215553108786663426',
      name: 'book-ideas',
      type: 15,
    },
    {
      available: true,
      id: '1215553108786663427',
      name: 'club-alerts',
      type: 0,
    },
  ],
  [loungeId]: [
    {
      available: true,
      id: '1197999049811439729',
      name: 'general',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326487',
      name: 'mod-log',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326486',
      name: 'rules',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326490',
      name: 'announcements',
      type: 5,
    },
    {
      available: true,
      id: '1209383231867326491',
      name: 'memes',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326492',
      name: 'off-topic',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326493',
      name: 'welcome',
      type: 0,
    },
    {
      available: false,
      id: '1209383231867326499',
      name: 'old-news',
      type: 0,
    },
  ],
};

/**
 * Mock API - Roles.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const roles: MockApi_Roles = {
  [clubId]: [
    {
      available: true,
      id: '1215553108329484289',
      name: 'Club Lead',
      position: 3,
    },
    {
      available: true,
      id: '1215553108329484290',
      name: 'Reader',
      position: 2,
    },
    {
      available: true,
      id: '1215553108329484291',
      name: 'Guest',
      position: 1,
    },
  ],
  [loungeId]: [
    {
      available: true,
      id: '1209383231867327001',
      name: 'Admin',
      position: 9,
    },
    {
      available: true,
      id: '1209383231867327002',
      name: 'Moderator',
      position: 8,
    },
    {
      available: true,
      id: '1209383231867327003',
      name: 'Verified',
      position: 5,
    },
    {
      available: true,
      id: '1209383231867327004',
      name: 'Member',
      position: 4,
    },
    {
      available: true,
      id: '1209383231867327005',
      name: 'Muted',
      position: 2,
    },
    {
      available: false,
      id: '1209383231867327006',
      name: 'Retired Booster',
      position: 1,
    },
  ],
};

/**
 * Mock API - Owner.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let owner: MockApi_Owner = null;

/**
 * Mock API - User Sequence.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let userSequence: MockApi_UserSequence = 20;

/**
 * Mock API - Users.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const users: MockApi_Users = [];

// Each account's saved passkeys; ones added in the mock are kept until it restarts.

/**
 * Mock API - Passkeys By User.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeysByUser: MockApi_PasskeysByUser = new Map();

/**
 * Mock API - Passkey Ceremonies.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeyCeremonies: MockApi_PasskeyCeremonies = new Map();

/**
 * Mock API - Backup Grants.
 *
 * Stores only fresh-authentication grant digests for the mock process lifetime.
 * Raw grants are returned once and are never retained here.
 *
 * @since 4.0.0
 */
const backupGrants: MockApi_BackupGrants = new Map();

/**
 * Mock API - Backup Passkey Ceremonies.
 *
 * Keeps short-lived passkey bindings separate from account-management ceremonies.
 * Each binding expires after the same five-minute confirmation window.
 *
 * @since 4.0.0
 */
const backupPasskeyCeremonies: MockApi_BackupPasskeyCeremonies = new Map();

/**
 * Mock API - Tokens.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const tokens: MockApi_Tokens = [];

/**
 * Mock API - Sessions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const sessions: MockApi_Sessions = new Map();

/**
 * Mock API - Pending Challenge.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let pendingChallenge: MockApi_PendingChallenge = null;

// MOCK_KEY_REPLACED=true starts as if the credential key had been lost, to show the notice.

/**
 * Mock API - Key Replaced.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const keyReplaced: MockApi_KeyReplaced = process.env['MOCK_KEY_REPLACED'] === 'true';

/**
 * Mock API - Bot.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const bot: MockApi_Bot = {
  activeFeatures: [],
  applicationId: '1205206968699592503',
  configurationErrors: [],
  desiredState: 'running',
  resolution: null,
  status: 'ready',
  tokenConfigured: keyReplaced === false,
  userTag: 'stonker-bot',
};

/**
 * Mock API - Debug Logging.
 *
 * The one Debug logging switch the bot, the control panel, and the worker share.
 * It starts off, as it does in a new container.
 *
 * @since 4.0.0
 */
let debugLogging: MockApi_DebugLogging = false;

/**
 * Mock API - Removed Secrets.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let removedSecrets: MockApi_RemovedSecrets = (keyReplaced === true) ? [
  {
    kind: 'bot-token',
    removedAt: new Date().toISOString(),
  },
  {
    featureKey: 'message-copiers',
    featureName: 'Message copiers',
    kind: 'feature-secrets',
    removedAt: new Date().toISOString(),
    serverId: '1197999049190674442',
    serverName: 'Stonker Lounge',
  },
] : [];

/**
 * Mock API - Bot Timer.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let botTimer: MockApi_BotTimer = undefined;

/**
 * Mock API - Notifications.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notifications: MockApi_Notifications = [
  {
    createdAt: new Date(startedAt - (45 * 24 * 60 * minute)).toISOString(),
    events: [
      'secrets-removed',
      'sign-in-locked',
      'bot-sign-in-failed',
      'bot-disconnected',
      'bot-reconnected',
      'job-failed',
    ],
    id: 'ntf-3e5a7c9b1d2f4a60',
    lastAttemptAt: new Date(startedAt - (2 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'My phone',
    secrets: {},
    secretsMissing: [],
    service: 'ntfy',
    settings: { url: 'https://ntfy.sh/stonker-bot-alerts' },
    updatedAt: new Date(startedAt - (45 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (20 * 24 * 60 * minute)).toISOString(),
    events: [
      'bot-disconnected',
      'bot-reconnected',
      'job-failed',
    ],
    id: 'ntf-7d1f3b5a9c2e4f68',
    lastAttemptAt: new Date(startedAt - (26 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'Mod alerts',
    secrets: { webhookUrl: true },
    secretsMissing: [],
    service: 'discord',
    settings: {},
    updatedAt: new Date(startedAt - (20 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (6 * 24 * 60 * minute)).toISOString(),
    events: [
      'secrets-removed',
      'bot-sign-in-failed',
      'bot-disconnected',
    ],
    id: 'ntf-9b2d4f6a8c0e1a35',
    lastAttemptAt: new Date(startedAt - (3 * 24 * 60 * minute)).toISOString(),
    lastError: 'HTTP 502: Bad Gateway',
    name: 'Homelab alerts',
    secrets: { token: true },
    secretsMissing: [],
    service: 'ntfy-reverse-proxy',
    settings: { url: 'https://alerts.ntfy.example.com' },
    updatedAt: new Date(startedAt - (6 * 24 * 60 * minute)).toISOString(),
  },
];

// A lost key removes every destination's saved secrets, as the server does, and pauses
// those destinations until the secrets are entered again.
if (keyReplaced === true) {
  for (const notification of [...notifications].sort((left, right) => left['name'].localeCompare(right['name']))) {
    const secretKeys: MockApi_SecretKeys = Object.keys(notification['secrets']).sort();

    if (secretKeys.length === 0) {
      continue;
    }

    notification.secrets = {};
    notification.secretsMissing = secretKeys;
    removedSecrets.push({
      kind: 'notification',
      name: notification['name'],
      notificationId: notification['id'],
      removedAt: new Date().toISOString(),
    });
  }
}

/**
 * Mock API - Logs.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logs: MockApi_Logs = [];

/**
 * Mock API - Log Sequence.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let logSequence: MockApi_LogSequence = 41_000;

/**
 * Mock API - Feature States.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureStates: MockApi_FeatureStates = new Map();

/**
 * Mock API - Secret Stores.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const secretStores: MockApi_SecretStores = new Map();

/**
 * Mock API - Examples.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const examples: MockApi_Examples = new Map();

/**
 * Mock API - Features Ready.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let featuresReady: MockApi_FeaturesReady = null;

/**
 * Mock API - Vite Server.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let viteServer: MockApi_ViteServer = null;

/**
 * Mock API - Fallback Notice Shown.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let fallbackNoticeShown: MockApi_FallbackNoticeShown = false;

/**
 * Mock API - Invite Pages.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const invitePages: MockApi_InvitePages = new Map();

/**
 * Mock API - Images.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const images: MockApi_Images = new Map();

/**
 * Mock API - Invite Attempts.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const inviteAttempts: MockApi_InviteAttempts = new Map();

// Small helpers.

/**
 * Mock API - Now Iso.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NowIso_Returns}
 *
 * @since 4.0.0
 */
const nowIso = (): MockApi_NowIso_Returns => new Date().toISOString();

/**
 * Mock API - Ago Iso.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_AgoIso_Returns}
 *
 * @since 4.0.0
 */
const agoIso = (minutes: MockApi_AgoIso_Minutes): MockApi_AgoIso_Returns => new Date(Date.now() - (minutes * minute)).toISOString();

// snowflakeAt makes a Discord ID for a moment the way Discord does, milliseconds since 2015 in the
// high bits, so message and user IDs look real and sort by time.

/**
 * Mock API - Snowflake At.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SnowflakeAt_Returns}
 *
 * @since 4.0.0
 */
const snowflakeAt = (time: MockApi_SnowflakeAt_Time): MockApi_SnowflakeAt_Returns => String((BigInt(time - 1_420_070_400_000) * 4_194_304n) + BigInt(Math.floor(Math.random() * 4_194_304)));

/**
 * Mock API - Is Record.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
const isRecord = (value: MockApi_IsRecord_Value): value is MockApi_IsRecord_TypeGuard => (
  typeof value === 'object'
  && value !== null
  && Array.isArray(value) === false
);

/**
 * Mock API - Digest.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_Digest_Returns}
 *
 * @since 4.0.0
 */
const digest = (value: MockApi_Digest_Value): MockApi_Digest_Returns => createHash('sha256').update(value).digest('hex');

/**
 * Mock API - User ID For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_UserIdFor_Returns}
 *
 * @since 4.0.0
 */
const userIdFor = (sequence: MockApi_UserIdFor_Sequence): MockApi_UserIdFor_Returns => String(sequence);

/**
 * Mock API - Permissions Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_PermissionsOf_Returns}
 *
 * @since 4.0.0
 */
const permissionsOf = (user: MockApi_PermissionsOf_User): MockApi_PermissionsOf_Returns => rolePermissions[user['role']];

/**
 * Mock API - Server Visible.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ServerVisible_Returns}
 *
 * @since 4.0.0
 */
const serverVisible = (user: MockApi_ServerVisible_User, serverId: MockApi_ServerVisible_ServerId): MockApi_ServerVisible_Returns => user['allServers'] || user['serverIds'].includes(serverId);

// Codes are compared like the server does: any letter case, with or without spaces and dashes.

/**
 * Mock API - Normalize Code.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NormalizeCode_Returns}
 *
 * @since 4.0.0
 */
const normalizeCode = (value: MockApi_NormalizeCode_Value): MockApi_NormalizeCode_Returns => value.toUpperCase().replace(new RegExp(separatorsPattern, 'gu'), '');

// Usernames follow the rule every appliance shares: 3 to 64 characters, starting with a letter or number.

/**
 * Mock API - Username Issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_UsernameIssue_Returns}
 *
 * @since 4.0.0
 */
const usernameIssue = (value: MockApi_UsernameIssue_Value): MockApi_UsernameIssue_Returns => {
  if (value === '') {
    return 'Enter a username.';
  }

  return (new RegExp(administratorUsernamePattern, 'u').test(value) === true) ? '' : 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.';
};

/**
 * Mock API - Password Issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_PasswordIssue_Returns}
 *
 * @since 4.0.0
 */
const passwordIssue = (value: MockApi_PasswordIssue_Value): MockApi_PasswordIssue_Returns => {
  if (typeof value !== 'string' || value.length < 12) {
    return 'Use at least 12 characters.';
  }

  return (value.length > 1024) ? 'Use 1024 characters or fewer.' : '';
};

// newRecoveryCodes makes ten codes the way the server does: ten characters without look-alikes, split 5-5.

/**
 * Mock API - New Recovery Codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NewRecoveryCodes_Returns}
 *
 * @since 4.0.0
 */
const newRecoveryCodes = (): MockApi_NewRecoveryCodes_Returns => Array.from({ length: 10 }, () => {
  const code: MockApi_NewRecoveryCodes_Code = [...randomBytes(10)].map((byte) => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.charAt(byte % 32)).join('');

  return `${code.slice(0, 5)}-${code.slice(5)}`;
});

/**
 * Mock API - Add Server URL.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_AddServerUrl_Returns}
 *
 * @since 4.0.0
 */
const addServerUrl = (): MockApi_AddServerUrl_Returns => ((bot['applicationId'] === null) ? null : `https://discord.com/oauth2/authorize?client_id=${bot['applicationId']}&integration_type=0&scope=bot%20applications.commands`);

// Logs.

/**
 * Mock API - Write Log.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_WriteLog_Returns}
 *
 * @since 4.0.0
 */
const writeLog = (component: MockApi_WriteLog_Component, level: MockApi_WriteLog_Level, event: MockApi_WriteLog_Event, context: MockApi_WriteLog_Context = {}, minutesAgo: MockApi_WriteLog_MinutesAgo = 0): MockApi_WriteLog_Returns => {
  logSequence += 1;
  logs.push({
    component,
    context,
    event,
    id: String(logSequence),
    level,
    occurredAt: agoIso(minutesAgo),
  });

  logs.splice(0, Math.max(0, logs.length - 3000));

  return;
};

/**
 * Mock API - Seed Logs.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SeedLogs_Returns}
 *
 * @since 4.0.0
 */
const seedLogs = (): MockApi_SeedLogs_Returns => {
  // Real events from the bot, worker, and web processes, with the fields they log.
  const entries: MockApi_SeedLogs_Entries = [
    [
      'web',
      'info',
      'web_ready',
      {
        host: '::',
        port: 22604,
      },
      190,
    ],
    [
      'worker',
      'info',
      'worker_ready',
      { workerIdentifier: '3f9c2a7b1d04' },
      189,
    ],
    [
      'bot',
      'info',
      'gateway_ready',
      {
        activeFeatures: [
          'auto-replies',
          'message-copiers',
          'rss-feeds',
          'scammer-alerts',
          'schedule-posts',
          'sync-roles',
        ],
        configurationErrors: [],
        generation: 1,
        guildCount: 2,
        shardCount: 1,
        userTag: 'stonker-bot',
      },
      188,
    ],
    [
      'bot',
      'info',
      'application_commands_registered',
      {
        commandCount: 6,
        guildIdentifier: loungeId,
      },
      187,
    ],
    [
      'worker',
      'info',
      'rss_feed_processed',
      {
        discoveredCount: 3,
        enqueuedCount: 1,
        feedKey: 'community-news',
        guildIdentifier: loungeId,
        name: 'Reviewed community news feed',
      },
      120,
    ],
    [
      'bot',
      'info',
      'message_copier_delivered',
      {
        destinationKind: 'webhook',
        messageIdentifier: snowflakeAt(Date.now() - (95 * minute)),
        ruleName: 'Copy reviewed announcements',
      },
      95,
    ],
    [
      'bot',
      'error',
      'message_copier_delivery_failed',
      {
        destinationKind: 'webhook',
        messageIdentifier: snowflakeAt(Date.now() - (94 * minute)),
        ruleName: 'Copy reviewed announcements',
      },
      94,
    ],
    [
      'worker',
      'info',
      'discord_message_delivered',
      {
        channelIdentifier: '1209383231867326490',
        messageIdentifier: snowflakeAt(Date.now() - (60 * minute)),
        ruleName: 'Weekday morning reminder',
      },
      60,
    ],
    [
      'bot',
      'info',
      'auto_reply_sent',
      {
        messageIdentifier: snowflakeAt(Date.now() - (41 * minute)),
        ruleName: 'Help and command discovery',
      },
      41,
    ],
    [
      'bot',
      'info',
      'role_sync_reconciled',
      {
        addedRoleIdentifiers: ['1209383231867327003'],
        removedRoleIdentifiers: [],
        userIdentifier: snowflakeAt(Date.UTC(2022, 8, 3, 14, 20)),
      },
      33,
    ],
    [
      'bot',
      'info',
      'scammer_alert_sent',
      {
        messageIdentifier: snowflakeAt(Date.now() - (12 * minute)),
        ruleName: 'Giveaway scams',
        userIdentifier: snowflakeAt(Date.now() - (2 * 24 * 60 * minute)),
      },
      12,
    ],
    [
      'worker',
      'info',
      'notification_delivered',
      {
        event: 'bot-reconnected',
        targetId: 'ntf-7d1f3b5a9c2e4f68',
      },
      5,
    ],
  ];

  for (const entry of entries) {
    writeLog(entry[0], entry[1], entry[2], entry[3], entry[4]);
  }

  return;
};

// The live feed: the bot and worker keep writing while the console is open.

/**
 * Mock API - Live Events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const liveEvents: MockApi_LiveEvents = [
  [
    'bot',
    'info',
    'message_copier_delivered',
    () => ({
      destinationKind: 'webhook',
      messageIdentifier: snowflakeAt(Date.now()),
      ruleName: 'Copy reviewed announcements',
    }),
  ],
  [
    'bot',
    'info',
    'auto_reply_sent',
    () => ({
      messageIdentifier: snowflakeAt(Date.now()),
      ruleName: 'Help and command discovery',
    }),
  ],
  [
    'bot',
    'info',
    'configured_thread_unarchived',
    () => ({
      ruleName: 'Daily discussion',
      threadIdentifier: '1209383231867326495',
    }),
  ],
  [
    'worker',
    'info',
    'rss_feed_not_modified',
    () => ({
      feedKey: 'community-news',
      guildIdentifier: loungeId,
      name: 'Reviewed community news feed',
    }),
  ],
  [
    'bot',
    'info',
    'impersonator_alert_sent',
    () => ({
      ruleName: 'Protect staff names',
      userIdentifier: snowflakeAt(Date.now() - (Math.floor(Math.random() * 30) * 24 * 60 * minute)),
    }),
  ],
];

/**
 * Mock API - Write Live Log.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_WriteLiveLog_Returns}
 *
 * @since 4.0.0
 */
const writeLiveLog = (): MockApi_WriteLiveLog_Returns => {
  if (bot['desiredState'] !== 'running' || bot['status'] !== 'ready') {
    return;
  }

  const pick: MockApi_WriteLiveLog_Pick = liveEvents[Math.floor(Math.random() * liveEvents.length)];

  if (pick !== undefined) {
    writeLog(pick[0], pick[1], pick[2], pick[3]());
  }

  return;
};

/**
 * Mock API - Matches Log Filters.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_MatchesLogFilters_Returns}
 *
 * @since 4.0.0
 */
const matchesLogFilters = (entry: MockApi_MatchesLogFilters_Entry, component: MockApi_MatchesLogFilters_Component, minimumLevel: MockApi_MatchesLogFilters_MinimumLevel, search: MockApi_MatchesLogFilters_Search): MockApi_MatchesLogFilters_Returns => {
  if (entry['component'] !== component || levelOrder.indexOf(entry['level']) < levelOrder.indexOf(minimumLevel)) {
    return false;
  }

  if (search === '') {
    return true;
  }

  const needle: MockApi_MatchesLogFilters_Needle = search.toLowerCase();

  return entry['event'].toLowerCase().includes(needle) || JSON.stringify(entry['context']).toLowerCase().includes(needle);
};

// Users and tokens.

/**
 * Mock API - Seed Accounts.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SeedAccounts_Returns}
 *
 * @since 4.0.0
 */
const seedAccounts = (claimed: MockApi_SeedAccounts_Claimed): MockApi_SeedAccounts_Returns => {
  const seeds: MockApi_SeedAccounts_Seeds = [
    [
      'avery',
      'administrator',
      true,
      [],
      true,
      true,
      130,
    ],
    [
      'riley',
      'administrator',
      false,
      [clubId],
      true,
      false,
      2_900,
    ],
    [
      'jordan',
      'operator',
      true,
      [],
      true,
      true,
      45,
    ],
    [
      'sam',
      'viewer',
      false,
      [loungeId],
      true,
      false,
      null,
    ],
    [
      'casey',
      'operator',
      false,
      [loungeId],
      false,
      false,
      20_000,
    ],
  ];

  users.push(claimed);

  // The owner has two saved passkeys, so the Sign-in and security page shows a realistic list.
  passkeysByUser.set(claimed['id'], [
    {
      createdAt: agoIso(38 * 24 * 60),
      hostname: 'bot.example.com',
      id: 'pk-wE5rT8yU1iO4pA7s',
      lastUsedAt: agoIso(90),
      name: 'MacBook Pro',
    },
    {
      createdAt: agoIso(12 * 24 * 60),
      hostname: 'bot.example.com',
      id: 'pk-dF2gH6jK9lZ3xC5v',
      lastUsedAt: agoIso(3 * 24 * 60),
      name: 'iPhone',
    },
  ]);

  seeds.forEach((seed, index) => {
    const username: MockApi_SeedAccounts_Username = seed[0];
    const role: MockApi_SeedAccounts_Role = seed[1];
    const allServers: MockApi_SeedAccounts_AllServers = seed[2];
    const serverIds: MockApi_SeedAccounts_ServerIds = seed[3];
    const enabled: MockApi_SeedAccounts_Enabled = seed[4];
    const totpEnabled: MockApi_SeedAccounts_TotpEnabled = seed[5];
    const lastSignIn: MockApi_SeedAccounts_LastSignIn = seed[6];

    users.push({
      allServers,
      createdAt: agoIso(40_000 - (index * 5_000)),
      enabled,
      id: userIdFor(index + 2),
      lastSignInAt: (lastSignIn === null) ? null : agoIso(lastSignIn),
      password: mockPassword,
      recoveryCodes: (totpEnabled === true) ? newRecoveryCodes() : [],
      role,
      serverIds,
      totpEnabled,
      totpPending: false,
      username,
    });

    return;
  });

  tokens.push(
    {
      createdAt: agoIso(30 * 24 * 60),
      expiresAt: null,
      hash: digest(`dsb_${'grafana'.repeat(6)}a`),
      id: 'tok-3f9a1c2b7d4e5f60',
      lastUsedAt: agoIso(4),
      name: 'Grafana dashboard',
      scopes: [
        'features:read',
        'logs:read',
      ],
      userId: claimed['id'],
    },
    {
      createdAt: agoIso(9 * 24 * 60),
      expiresAt: new Date(Date.now() + (81 * 24 * 60 * minute)).toISOString(),
      hash: digest(`dsb_${'deploys'.repeat(6)}a`),
      id: 'tok-8b2e4d6f1a3c5e70',
      lastUsedAt: null,
      name: 'Deploy script',
      scopes: [
        'bot:control',
        'features:read',
        'features:write',
      ],
      userId: claimed['id'],
    },
  );

  return;
};

// editableBy says whether a manager may change an account: never the owner or themself,
// and a manager limited to some servers only reaches people inside them.

/**
 * Mock API - Editable By.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_EditableBy_Returns}
 *
 * @since 4.0.0
 */
const editableBy = (manager: MockApi_EditableBy_Manager, user: MockApi_EditableBy_User): MockApi_EditableBy_Returns => (
  user['role'] !== 'owner'
  && user['id'] !== manager['id']
  && (
    manager['allServers'] === true
    || (
      user['allServers'] === false
      && user['serverIds'].every((serverId) => manager['serverIds'].includes(serverId))
    )
  )
);

/**
 * Mock API - User Resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_UserResource_Returns}
 *
 * @since 4.0.0
 */
const userResource = (user: MockApi_UserResource_User, manager: MockApi_UserResource_Manager): MockApi_UserResource_Returns => ({
  allServers: user['allServers'],
  createdAt: user['createdAt'],
  editable: editableBy(manager, user),
  enabled: user['enabled'],
  id: user['id'],
  lastSignInAt: user['lastSignInAt'],
  passkeys: (passkeysByUser.get(user['id']) ?? []).length,
  role: user['role'],
  serverIds: (user['allServers'] === true) ? [] : user['serverIds'],
  twoFactor: user['totpEnabled'],
  username: user['username'],
});

/**
 * Mock API - Token Resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_TokenResource_Returns}
 *
 * @since 4.0.0
 */
const tokenResource = (token: MockApi_TokenResource_Token): MockApi_TokenResource_Returns => ({
  createdAt: token['createdAt'],
  expiresAt: token['expiresAt'],
  id: token['id'],
  lastUsedAt: token['lastUsedAt'],
  name: token['name'],
  scopes: token['scopes'],
});

/**
 * Mock API - Role Rank.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const roleRank: MockApi_RoleRank = {
  administrator: 1,
  operator: 2,
  owner: 0,
  viewer: 3,
};

// Features.

// Hand-made editors for three features, used while the real editor module can't load.

/**
 * Mock API - Fallback Editors.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackEditors: MockApi_FallbackEditors = {
  'bump-threads': {
    'items': {
      properties: {
        channel: {
          properties: {
            'channel-id': {
              'title': 'Channel ID',
              'type': 'string',
              'x-widget': 'channel',
            },
            'description': {
              title: 'Description',
              type: 'string',
            },
          },
          required: ['channel-id'],
          title: 'Channel',
          type: 'object',
        },
        name: {
          maxLength: 100,
          minLength: 1,
          title: 'Name',
          type: 'string',
        },
        thread: {
          properties: {
            'description': {
              title: 'Description',
              type: 'string',
            },
            'thread-id': {
              'title': 'Thread ID',
              'type': 'string',
              'x-widget': 'discord-id',
            },
          },
          required: ['thread-id'],
          title: 'Thread',
          type: 'object',
        },
      },
      required: [
        'name',
        'channel',
        'thread',
      ],
      type: 'object',
    },
    'type': 'array',
    'x-item-label': 'Thread',
    'x-item-title-key': 'name',
  },
  'message-copiers': {
    'items': {
      properties: {
        'destinations': {
          'items': {
            'oneOf': [
              {
                properties: {
                  channel: {
                    'properties': {
                      'channel-id': {
                        'title': 'Channel ID',
                        'type': 'string',
                        'x-widget': 'channel',
                      },
                    },
                    'required': ['channel-id'],
                    'title': 'Channel',
                    'type': 'object',
                    'x-inline': true,
                  },
                  description: {
                    title: 'Description',
                    type: 'string',
                  },
                  method: {
                    const: 'discord-channel',
                    type: 'string',
                  },
                },
                required: [
                  'method',
                  'channel',
                ],
                title: 'Discord channel',
                type: 'object',
              },
              {
                properties: {
                  description: {
                    title: 'Description',
                    type: 'string',
                  },
                  method: {
                    const: 'discord-webhook',
                    type: 'string',
                  },
                  webhook: {
                    properties: {
                      'avatar-url': {
                        'format': 'uri',
                        'title': 'Avatar URL',
                        'type': 'string',
                        'x-widget': 'url',
                      },
                      'url': {
                        'properties': {
                          $secret: {
                            type: 'string',
                          },
                        },
                        'required': ['$secret'],
                        'title': 'URL',
                        'type': 'object',
                        'x-widget': 'secret',
                      },
                      'username': {
                        title: 'Username',
                        type: 'string',
                      },
                    },
                    required: ['url'],
                    title: 'Webhook',
                    type: 'object',
                  },
                },
                required: [
                  'method',
                  'webhook',
                ],
                title: 'Discord webhook',
                type: 'object',
              },
            ],
            'x-discriminator': 'method',
          },
          'minItems': 1,
          'title': 'Destinations',
          'type': 'array',
          'x-item-label': 'Destination',
        },
        'include-attachments': {
          default: false,
          title: 'Include attachments',
          type: 'boolean',
        },
        'message': {
          'maxLength': 2000,
          'title': 'Message',
          'type': 'string',
          'x-variables': [
            {
              description: 'Message text',
              token: '%MESSAGE_CONTENT%',
            },
            {
              description: 'Message link',
              token: '%MESSAGE_URL%',
            },
            {
              description: 'Member name',
              token: '%MEMBER_TAG%',
            },
          ],
          'x-widget': 'variables',
        },
        'name': {
          title: 'Name',
          type: 'string',
        },
        'regex': {
          properties: {
            flags: {
              'title': 'Flags',
              'type': 'string',
              'x-widget': 'pattern',
            },
            pattern: {
              'title': 'Pattern',
              'type': 'string',
              'x-widget': 'pattern',
            },
          },
          required: ['pattern'],
          title: 'Match',
          type: 'object',
        },
      },
      required: [
        'name',
        'regex',
        'destinations',
      ],
      type: 'object',
    },
    'type': 'array',
    'x-item-label': 'Copier',
    'x-item-title-key': 'name',
  },
  'remove-affiliates': {
    'properties': {
      'channel': {
        'properties': {
          'channel-id': {
            'title': 'Channel ID',
            'type': 'string',
            'x-widget': 'channel',
          },
        },
        'required': ['channel-id'],
        'title': 'Monitored channel',
        'type': 'object',
        'x-inline': true,
      },
      'direct-message-payload': {
        properties: {
          content: {
            'maxLength': 2000,
            'title': 'Content',
            'type': 'string',
            'x-widget': 'textarea',
          },
        },
        title: 'Member notice',
        type: 'object',
      },
      'excluded-roles': {
        'items': {
          properties: {
            'role-id': {
              'title': 'Role ID',
              'type': 'string',
              'x-widget': 'role',
            },
          },
          required: ['role-id'],
          type: 'object',
        },
        'title': 'Exempt roles',
        'type': 'array',
        'x-item-key': 'role-id',
        'x-widget': 'role-list',
      },
      'platforms': {
        'items': {
          properties: {
            platform: {
              title: 'Platform',
              type: 'string',
            },
            regex: {
              properties: {
                flags: {
                  'title': 'Flags',
                  'type': 'string',
                  'x-widget': 'pattern',
                },
                pattern: {
                  'title': 'Pattern',
                  'type': 'string',
                  'x-widget': 'pattern',
                },
              },
              required: ['pattern'],
              title: 'Match',
              type: 'object',
            },
          },
          required: [
            'platform',
            'regex',
          ],
          type: 'object',
        },
        'title': 'Link patterns',
        'type': 'array',
        'x-item-label': 'Platform',
        'x-item-title-key': 'platform',
      },
    },
    'required': [
      'channel',
      'platforms',
    ],
    'type': 'object',
    'x-sections': [
      {
        description: 'Clean up links in this Discord channel.',
        key: 'channel',
        title: 'Monitored channel',
      },
      {
        description: 'Recognize affiliate and campaign parameters by platform.',
        key: 'platforms',
        title: 'Link patterns',
      },
      {
        description: 'Explain privately why the member should post a clean link.',
        key: 'direct-message-payload',
        title: 'Member notice',
      },
      {
        description: 'Members with any of these roles can post affiliate links.',
        key: 'excluded-roles',
        title: 'Exempt roles',
      },
    ],
  },
};

/**
 * Mock API - Fallback Catalog.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackCatalog: MockApi_FallbackCatalog = [
  [
    'anti-raid',
    'safety',
    'Anti-raid',
    'Ban known raid accounts on join and give screened members their roles.',
  ],
  [
    'auto-replies',
    'community',
    'Auto replies',
    'Reply to matching member messages with configured responses.',
  ],
  [
    'broadcast-alerts',
    'community',
    'Event broadcasts',
    'Announce Discord scheduled-event lifecycle changes.',
  ],
  [
    'bump-threads',
    'automation',
    'Thread bumping',
    'Keep selected active threads discoverable.',
  ],
  [
    'detect-suspicious-words',
    'safety',
    'Suspicious words',
    'Alert moderators when configured suspicious phrases appear.',
  ],
  [
    'impersonator-alerts',
    'safety',
    'Impersonator alerts',
    'Detect names that may impersonate trusted identities.',
  ],
  [
    'message-copiers',
    'automation',
    'Message copiers',
    'Copy matching messages to approved destinations.',
  ],
  [
    'message-proxies',
    'automation',
    'Message proxies',
    'Re-publish bot messages through configured webhooks.',
  ],
  [
    'regex-rules',
    'moderation',
    'Regex rules',
    'Remove messages that break configured pattern rules.',
  ],
  [
    'remove-affiliates',
    'moderation',
    'Affiliate cleanup',
    'Remove affiliate and campaign-tracking links.',
  ],
  [
    'role-messages',
    'community',
    'Role messages',
    'Send messages when members gain or lose roles.',
  ],
  [
    'rss-feeds',
    'integrations',
    'RSS feeds',
    'Post new items from RSS feeds.',
  ],
  [
    'scammer-alerts',
    'safety',
    'Scammer alerts',
    'Alert moderators about likely scam messages.',
  ],
  [
    'schedule-posts',
    'automation',
    'Scheduled posts',
    'Post messages on a schedule.',
  ],
  [
    'server-tools',
    'moderation',
    'Server tools',
    'Slash commands for bulk moderation work.',
  ],
  [
    'snitch',
    'moderation',
    'Audit notifications',
    'Report member and message changes to moderators.',
  ],
  [
    'sync-roles',
    'moderation',
    'Role synchronization',
    'Keep related roles in step.',
  ],
  [
    'toggle-perms',
    'moderation',
    'Permission toggles',
    'Change channel permissions on a schedule.',
  ],
  [
    'web-applications',
    'web',
    'Web applications',
    'Serve the invite page and signed webhooks.',
  ],
].map((catalogEntry) => ({
  category: catalogEntry[1] ?? 'automation',
  description: catalogEntry[3] ?? '',
  key: catalogEntry[0] ?? '',
  name: catalogEntry[2] ?? '',
}));

/**
 * Mock API - Fallback Configurations.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackConfigurations: MockApi_FallbackConfigurations = {
  'bump-threads': [{
    channel: { 'channel-id': '1197999049811439729' },
    name: 'Daily discussion',
    thread: { 'thread-id': '000000000000000000' },
  }],
  'message-copiers': [{
    'destinations': [
      {
        channel: { 'channel-id': '1197999049811439729' },
        description: 'Publish to general',
        method: 'discord-channel',
      },
      {
        description: 'Publish to the partner server',
        method: 'discord-webhook',
        webhook: {
          url: { $secret: 'message-copiers.0.destinations.1.webhook.url' },
          username: 'Stonker Announcements',
        },
      },
    ],
    'include-attachments': true,
    'message': [
      '%MESSAGE_CONTENT%',
      '',
      'Source: %MESSAGE_URL%',
    ].join('\n'),
    'name': 'Copy reviewed announcements',
    'regex': {
      flags: 'i',
      pattern: '^\\[ANNOUNCEMENT\\]\\s+(.+)$',
    },
  }],
  'web-applications': {
    'invite-generator': {
      options: {
        'max-age': 300,
        'max-uses': 1,
        'path': '/invite',
      },
      recaptcha: {
        'secret-key': { $secret: 'web-applications.invite-generator.recaptcha.secret-key' },
        'site-key': recaptchaTestSiteKey,
      },
    },
  },
  'remove-affiliates': {
    'channel': { 'channel-id': '1197999049811439729' },
    'direct-message-payload': { content: 'Your post contained an affiliate link. Please share a clean link instead.' },
    'excluded-roles': [{ 'role-id': '1209383231867327002' }],
    'platforms': [{
      platform: 'Amazon associate tags',
      regex: {
        flags: 'i',
        pattern: 'https?://(?:www\\.)?amazon\\.[^/\\s]+/[^\\s]*[?&]tag=[^\\s&#]+',
      },
    }],
  },
};

// blankSecrets empties every secret reference, like the server's example values.

/**
 * Mock API - Blank Secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_BlankSecrets_Returns}
 *
 * @since 4.0.0
 */
const blankSecrets = (value: MockApi_BlankSecrets_Value): MockApi_BlankSecrets_Returns => {
  if (Array.isArray(value) === true) {
    return value.map(blankSecrets);
  }

  if (isRecord(value) === false) {
    return value;
  }

  if (typeof value['$secret'] === 'string') {
    return { $secret: '' };
  }

  return Object.fromEntries(Object.entries(value).map((entry): MockApi_BlankSecrets_Entry => [
    entry[0],
    blankSecrets(entry[1]),
  ]));
};

/**
 * Mock API - Fallback Modules.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_FallbackModules_Returns}
 *
 * @since 4.0.0
 */
const fallbackModules = (): MockApi_FallbackModules_Returns => ({
  blank: blankSecrets,
  catalog: fallbackCatalog,
  editorFor: (featureKey) => fallbackEditors[featureKey] ?? {
    description: 'The mock has no form for this feature while the real editor module can\'t load.',
  },
  exampleFor: null,
  importLegacy: null,
  real: false,
  validate: null,
});

// loadModules reads the real catalog, editors, import, and validation code through Vite, so the
// mock shows exactly what the server will. Server files can be mid-edit; then it falls back.

/**
 * Mock API - Load Modules.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_LoadModules_Returns}
 *
 * @since 4.0.0
 */
const loadModules = async (): MockApi_LoadModules_Returns => {
  if (viteServer === null) {
    return fallbackModules();
  }

  try {
    const catalogModule: MockApi_LoadModules_CatalogModule = await viteServer.ssrLoadModule('/src/lib/feature-catalog.ts');
    const editorModule: MockApi_LoadModules_EditorModule = await viteServer.ssrLoadModule('/src/lib/feature-editor.ts');
    const importModule: MockApi_LoadModules_ImportModule = await viteServer.ssrLoadModule('/src/lib/legacy-import.ts');
    const validationModule: MockApi_LoadModules_ValidationModule = await viteServer.ssrLoadModule('/src/lib/feature-configuration-validation.ts');
    const secretsModule: MockApi_LoadModules_SecretsModule = await viteServer.ssrLoadModule('/src/lib/feature-secrets.ts');
    const getFeatureCatalog: MockApi_LoadModules_GetFeatureCatalog = catalogModule['getFeatureCatalog'];
    const getFeatureEditor: MockApi_LoadModules_GetFeatureEditor = editorModule['getFeatureEditor'];
    const getFeatureExample: MockApi_LoadModules_GetFeatureExample = editorModule['getFeatureExample'];
    const importLegacyConfiguration: MockApi_LoadModules_ImportLegacyConfiguration = importModule['importLegacyConfiguration'];
    const validateFeatureConfiguration: MockApi_LoadModules_ValidateFeatureConfiguration = validationModule['validateFeatureConfiguration'];
    const blankSecretReferences: MockApi_LoadModules_BlankSecretReferences = secretsModule['blankSecretReferences'];

    if (typeof getFeatureCatalog !== 'function' || typeof getFeatureEditor !== 'function') {
      throw new Error('The feature catalog or editor module is missing its exports.');
    }

    return {
      blank: (typeof blankSecretReferences === 'function') ? (value) => blankSecretReferences(value) : blankSecrets,
      catalog: (getFeatureCatalog() as MockApi_LoadModules_Catalog).map((entry) => ({
        category: entry['category'],
        description: entry['description'],
        key: entry['key'],
        name: entry['name'],
      })),
      editorFor: (featureKey) => getFeatureEditor(featureKey) as MockApi_LoadModules_Editor,
      exampleFor: (typeof getFeatureExample === 'function') ? (featureKey, starterSettings) => getFeatureExample(featureKey, starterSettings) : null,
      importLegacy: (typeof importLegacyConfiguration === 'function') ? (text, enable) => importLegacyConfiguration(text, enable) as MockApi_LoadModules_LegacyResult : null,
      real: true,
      validate: (typeof validateFeatureConfiguration === 'function') ? (featureKey, configuration, resolve) => validateFeatureConfiguration(featureKey, configuration, resolve) as MockApi_LoadModules_Issues : null,
    };
  } catch (error) {
    if (fallbackNoticeShown === false) {
      fallbackNoticeShown = true;

      const errorMessage: MockApi_LoadModules_ErrorMessage = (error instanceof Error) ? error.message : String(error);

      viteServer.config.logger.warn(`  Mock API: the real feature modules didn't load, so three hand-made editors stand in. (${errorMessage})`);
    }

    return fallbackModules();
  }
};

/**
 * Mock API - States For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_StatesFor_Returns}
 *
 * @since 4.0.0
 */
const statesFor = (serverId: MockApi_StatesFor_ServerId): MockApi_StatesFor_Returns => {
  const existing: MockApi_StatesFor_Existing = featureStates.get(serverId);

  if (existing !== undefined) {
    return existing;
  }

  const created: MockApi_StatesFor_Created = new Map();

  featureStates.set(serverId, created);

  return created;
};

/**
 * Mock API - Secrets For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SecretsFor_Returns}
 *
 * @since 4.0.0
 */
const secretsFor = (serverId: MockApi_SecretsFor_ServerId): MockApi_SecretsFor_Returns => {
  const existing: MockApi_SecretsFor_Existing = secretStores.get(serverId);

  if (existing !== undefined) {
    return existing;
  }

  const created: MockApi_SecretsFor_Created = new Map();

  secretStores.set(serverId, created);

  return created;
};

/**
 * Mock API - State Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_StateOf_Returns}
 *
 * @since 4.0.0
 */
const stateOf = (serverId: MockApi_StateOf_ServerId, featureKey: MockApi_StateOf_FeatureKey): MockApi_StateOf_Returns => {
  const states: MockApi_StateOf_States = statesFor(serverId);
  const existing: MockApi_StateOf_Existing = states.get(featureKey);

  if (existing !== undefined) {
    return existing;
  }

  const created: MockApi_StateOf_Created = {
    configuration: null,
    enabled: false,
    revision: 0,
    updatedAt: null,
  };

  states.set(featureKey, created);

  return created;
};

// The lounge starts from the repository's example config; the club has two features set up.

/**
 * Mock API - Prepare Features.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_PrepareFeatures_Returns}
 *
 * @since 4.0.0
 */
const prepareFeatures = async (): MockApi_PrepareFeatures_Returns => {
  const modules: MockApi_PrepareFeatures_Modules = await loadModules();
  const loungeOn: MockApi_PrepareFeatures_LoungeOn = [
    'auto-replies',
    'bump-threads',
    'detect-suspicious-words',
    'message-copiers',
    'remove-affiliates',
    'rss-feeds',
    'web-applications',
  ];
  let exampleText: MockApi_PrepareFeatures_ExampleText = '';

  try {
    exampleText = readFileSync(new URL('./examples/legacy-config.e2e.json', import.meta.url), 'utf-8');
  } catch {
    exampleText = '';
  }

  let imported: MockApi_PrepareFeatures_Imported = null;

  if (modules['importLegacy'] !== null && exampleText !== '') {
    try {
      imported = modules.importLegacy(exampleText, false);
    } catch {
      imported = null;
    }
  }

  const importedFeatures: MockApi_PrepareFeatures_ImportedFeatures = (imported === null) ? {} : (imported['settings']['features'] ?? {});

  for (const entry of modules['catalog']) {
    const importedFeature: MockApi_PrepareFeatures_ImportedFeature = importedFeatures[entry['key']];
    const configuration: MockApi_PrepareFeatures_Configuration = (importedFeature === undefined) ? fallbackConfigurations[entry['key']] : importedFeature['configuration'];

    if (configuration !== undefined && configuration !== null) {
      examples.set(entry['key'], (modules['exampleFor'] !== null && imported !== null) ? modules.exampleFor(entry['key'], imported['settings']) : modules.blank(structuredClone(configuration)));

      Object.assign(stateOf(loungeId, entry['key']), {
        configuration: structuredClone(configuration),
        enabled: loungeOn.includes(entry['key']),
        revision: 2,
        updatedAt: agoIso(3 * 24 * 60),
      });
    }
  }

  for (const secret of (imported === null) ? [] : imported['secrets']) {
    secretsFor(loungeId).set(secret['key'], secret['value']);
  }

  if (imported === null) {
    secretsFor(loungeId).set('message-copiers.0.destinations.1.webhook.url', 'https://discord.com/api/webhooks/1/mock');

    secretsFor(loungeId).set('web-applications.invite-generator.recaptcha.secret-key', 'mock-recaptcha-secret');
  }

  for (const featureKey of [
    'bump-threads',
    'schedule-posts',
  ]) {
    const example: MockApi_PrepareFeatures_Example = examples.get(featureKey);

    if (example !== undefined) {
      Object.assign(stateOf(clubId, featureKey), {
        configuration: structuredClone(example),
        enabled: featureKey === 'bump-threads',
        revision: 1,
        updatedAt: agoIso(26 * 60),
      });
    }
  }

  bot.activeFeatures = loungeOn;

  return;
};

/**
 * Mock API - Ensure Features.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_EnsureFeatures_Returns}
 *
 * @since 4.0.0
 */
const ensureFeatures = async (): MockApi_EnsureFeatures_Returns => {
  if (featuresReady === null) {
    featuresReady = prepareFeatures();
  }

  await featuresReady;

  return;
};

/**
 * Mock API - Feature Summary.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_FeatureSummary_Returns}
 *
 * @since 4.0.0
 */
const featureSummary = (entry: MockApi_FeatureSummary_Entry, serverId: MockApi_FeatureSummary_ServerId): MockApi_FeatureSummary_Returns => {
  const state: MockApi_FeatureSummary_State = stateOf(serverId, entry['key']);

  return {
    category: entry['category'],
    configured: state['configuration'] !== null,
    description: entry['description'],
    enabled: state['enabled'],
    key: entry['key'],
    name: entry['name'],
    revision: state['revision'],
    updatedAt: state['updatedAt'],
  };
};

// collectReferences finds every { "$secret": … } object with its JSON pointer and path.

/**
 * Mock API - Collect References.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @returns {MockApi_CollectReferences_Returns}
 *
 * @since 4.0.0
 */
const collectReferences = (value: MockApi_CollectReferences_Value, path: MockApi_CollectReferences_Path = []): MockApi_CollectReferences_Returns => {
  if (Array.isArray(value) === true) {
    return value.flatMap((entry, index) => collectReferences(entry, [
      ...path,
      String(index),
    ]));
  }

  if (isRecord(value) === false) {
    return [];
  }

  if (typeof value['$secret'] === 'string') {
    return [{
      key: value['$secret'],
      path,
    }];
  }

  return Object.entries(value).flatMap((entry) => collectReferences(entry[1], [
    ...path,
    entry[0],
  ]));
};

/**
 * Mock API - String List.
 *
 * Narrows one legacy report field to displayable strings.
 * Non-array values become an empty list.
 *
 * @param {MockApi_StringList_Value} value - Value.
 *
 * @returns {MockApi_StringList_Returns}
 *
 * @since 4.0.0
 */
const stringList = (value: MockApi_StringList_Value): MockApi_StringList_Returns => (Array.isArray(value) === true) ? value.map(String) : [];

/**
 * Mock API - Feature Display Name.
 *
 * Resolves a legacy feature key through the same catalog as the Features page.
 * A missing mock entry falls back to its key so the preview remains usable.
 *
 * @param {MockApi_FeatureDisplayName_FeatureKey} featureKey - Feature key.
 * @param {MockApi_FeatureDisplayName_Modules}    modules    - Modules.
 *
 * @returns {MockApi_FeatureDisplayName_Returns}
 *
 * @since 4.0.0
 */
const featureDisplayName = (featureKey: MockApi_FeatureDisplayName_FeatureKey, modules: MockApi_FeatureDisplayName_Modules): MockApi_FeatureDisplayName_Returns => {
  const feature: MockApi_FeatureDisplayName_Feature = modules['catalog'].find((candidate) => candidate['key'] === featureKey);

  return (feature === undefined) ? featureKey : feature['name'];
};

/**
 * Mock API - Legacy Warning Label.
 *
 * Mirrors the production preview labels for skipped legacy values.
 * Specific names keep the mock wizard representative of the real API.
 *
 * @param {MockApi_LegacyWarningLabel_Warning} warning - Warning.
 *
 * @returns {MockApi_LegacyWarningLabel_Returns}
 *
 * @since 4.0.0
 */
const legacyWarningLabel = (warning: MockApi_LegacyWarningLabel_Warning): MockApi_LegacyWarningLabel_Returns => {
  if (warning.startsWith('Twitter/X keys ') === true) {
    return 'Twitter/X keys';
  }

  if (warning.startsWith('Twitter/X feeds ') === true) {
    return 'Twitter/X feeds';
  }

  if (warning.includes('message-copier destination ') === true) {
    return 'Message copier destination on Twitter/X';
  }

  if (warning.includes('message-copier destinations ') === true) {
    return 'Message copier destinations on Twitter/X';
  }

  if (warning.includes('message-copier rule ') === true) {
    return 'Message copier rule on Twitter/X';
  }

  if (warning.includes('message-copier rules ') === true) {
    return 'Message copier rules on Twitter/X';
  }

  if (warning.startsWith('Unrecognized legacy sections ') === true) {
    return 'Unsupported legacy sections';
  }

  return 'Legacy settings';
};

/**
 * Mock API - Empty Backup Summary.
 *
 * Starts a comparison result before optional sections are counted.
 * Preview and apply share this normalized shape.
 *
 * @returns {MockApi_EmptyBackupSummary_Returns}
 *
 * @since 4.0.0
 */
const emptyBackupSummary = (): MockApi_EmptyBackupSummary_Returns => ({
  accessTokens: {
    added: 0,
    skipped: 0,
  },
  connection: 'skipped',
  features: {
    features: 0,
    servers: 0,
  },
  notifications: {
    added: 0,
    replaced: 0,
  },
});

/**
 * Mock API - Issue Backup Grant.
 *
 * Returns one opaque grant while retaining only its digest in memory.
 * The binding expires after five minutes.
 *
 * @param {MockApi_IssueBackupGrant_SessionId} sessionId - Session id.
 * @param {MockApi_IssueBackupGrant_Purpose}   purpose   - Purpose.
 *
 * @returns {MockApi_IssueBackupGrant_Returns}
 *
 * @since 4.0.0
 */
const issueBackupGrant = (sessionId: MockApi_IssueBackupGrant_SessionId, purpose: MockApi_IssueBackupGrant_Purpose): MockApi_IssueBackupGrant_Returns => {
  const grant: MockApi_IssueBackupGrant_Grant = `bkg_${randomBytes(32).toString('base64url')}`;
  const expiresAt: MockApi_IssueBackupGrant_ExpiresAt = Date.now() + (5 * minute);

  backupGrants.set(digest(grant), {
    expiresAt,
    purpose,
    sessionId: digest(sessionId),
  });

  return {
    expiresAt: new Date(expiresAt).toISOString(),
    grant,
  };
};

/**
 * Mock API - Consume Backup Grant.
 *
 * Accepts a matching, unexpired, session- and purpose-bound grant once.
 * Mismatched grants remain unusable by the caller.
 *
 * @param {MockApi_ConsumeBackupGrant_Value}     value     - Value.
 * @param {MockApi_ConsumeBackupGrant_SessionId} sessionId - Session id.
 * @param {MockApi_ConsumeBackupGrant_Purpose}   purpose   - Purpose.
 *
 * @returns {MockApi_ConsumeBackupGrant_Returns}
 *
 * @since 4.0.0
 */
const consumeBackupGrant = (value: MockApi_ConsumeBackupGrant_Value, sessionId: MockApi_ConsumeBackupGrant_SessionId, purpose: MockApi_ConsumeBackupGrant_Purpose): MockApi_ConsumeBackupGrant_Returns => {
  if (typeof value !== 'string') {
    return false;
  }
  const key: MockApi_ConsumeBackupGrant_Key = digest(value);
  const record: MockApi_ConsumeBackupGrant_Record = backupGrants.get(key);
  if (record === undefined || record['expiresAt'] <= Date.now()) {
    backupGrants.delete(key);
    return false;
  }
  if (record['sessionId'] !== digest(sessionId) || record['purpose'] !== purpose) {
    return false;
  }
  backupGrants.delete(key);
  return true;
};

/**
 * Mock API - Parse Mock Backup Source.
 *
 * Checks the discriminator and fixed envelope before the mock reads a wizard source.
 * The real browser and server perform the complete strict schema validation.
 *
 * @param {MockApi_ParseMockBackupSource_Value} value - Value.
 *
 * @returns {MockApi_ParseMockBackupSource_Returns}
 *
 * @since 4.0.0
 */
const parseMockBackupSource = (value: MockApi_ParseMockBackupSource_Value): MockApi_ParseMockBackupSource_Returns => {
  if (isRecord(value) === false) {
    return null;
  }
  if (value['type'] === 'export' && isRecord(value['document']) === true) {
    const document: MockApi_ParseMockBackupSource_Document = value['document'];
    if (document['format'] === 'discord-stonker-bot-export' && document['version'] === 1) {
      return value as MockApi_ParseMockBackupSource_Source;
    }
    return null;
  }
  if (
    value['type'] === 'legacy'
    && typeof value['configuration'] === 'string'
    && typeof value['enableFeatures'] === 'boolean'
    && typeof value['serverId'] === 'string'
  ) {
    return value as MockApi_ParseMockBackupSource_Source;
  }
  return null;
};

/**
 * Mock API - Create Mock Backup Document.
 *
 * Builds the same portable sections as the real export route with invented secrets.
 * Runtime-only user and Discord data never enter the document.
 *
 * @param {MockApi_CreateMockBackupDocument_Sections} sections - Sections.
 * @param {MockApi_CreateMockBackupDocument_User}     user     - User.
 *
 * @returns {MockApi_CreateMockBackupDocument_Returns}
 *
 * @since 4.0.0
 */
const createMockBackupDocument = (sections: MockApi_CreateMockBackupDocument_Sections, user: MockApi_CreateMockBackupDocument_User): MockApi_CreateMockBackupDocument_Returns => {
  const document: MockApi_CreateMockBackupDocument_Document = {
    appVersion: '4.0.0',
    exportedAt: nowIso(),
    format: 'discord-stonker-bot-export',
    version: 1,
  };
  if (sections['connection'] === true) {
    document.connection = {
      botToken: (bot['tokenConfigured'] === true) ? 'mock-discord-bot-token-northwind' : null,
      desiredState: bot['desiredState'],
    };
  }
  if (sections['features'] === true) {
    document.features = servers.map((server) => ({
      features: [...statesFor(server['id'])].map((stateEntry) => {
        const key: MockApi_CreateMockBackupDocument_Key = stateEntry[0];
        const state: MockApi_CreateMockBackupDocument_State = stateEntry[1];
        const store: MockApi_CreateMockBackupDocument_Store = secretsFor(server['id']);
        const secrets: MockApi_CreateMockBackupDocument_Secrets = {};

        for (const reference of collectReferences(state['configuration'])) {
          const secret: MockApi_CreateMockBackupDocument_Secret = store.get(reference['key']);
          if (secret !== undefined) {
            Reflect.set(secrets, reference['key'], secret);
          }
        }
        return {
          configuration: structuredClone(state['configuration']),
          enabled: state['enabled'],
          key,
          secrets,
        };
      }),
      serverId: server['id'],
      timeZone: 'America/New_York',
    }));
  }
  if (sections['notifications'] === true) {
    document.notifications = notifications.map((notification) => ({
      events: [...notification['events']],
      id: notification['id'],
      name: notification['name'],
      secrets: Object.fromEntries(Object.keys(notification['secrets']).map((key): MockApi_CreateMockBackupDocument_SecretEntry => [
        key,
        `mock-${notification['service']}-${key}-secret`,
      ])),
      service: notification['service'],
      settings: { ...notification['settings'] },
    }));
  }
  if (sections['accessTokens'] === true) {
    document.accessTokens = tokens.filter((token) => token['userId'] === user['id']).map((token) => ({
      expiresAt: token['expiresAt'],
      id: token['id'],
      name: token['name'],
      scopes: [...token['scopes']],
      tokenHash: token['hash'],
    }));
  }
  return document;
};

/**
 * Mock API - Preview Mock Backup.
 *
 * Produces the authoritative comparison for either wizard source without mutation.
 * Human-readable values mirror the real server response.
 *
 * @param {MockApi_PreviewMockBackup_Source}  source  - Source.
 * @param {MockApi_PreviewMockBackup_User}    user    - User.
 * @param {MockApi_PreviewMockBackup_Modules} modules - Modules.
 *
 * @returns {MockApi_PreviewMockBackup_Returns}
 *
 * @since 4.0.0
 */
const previewMockBackup = (source: MockApi_PreviewMockBackup_Source, user: MockApi_PreviewMockBackup_User, modules: MockApi_PreviewMockBackup_Modules): MockApi_PreviewMockBackup_Returns => {
  const summary: MockApi_PreviewMockBackup_Summary = emptyBackupSummary();
  if (source['type'] === 'legacy') {
    if (modules['importLegacy'] === null) {
      throw new Error('The older config.json importer is unavailable.');
    }
    const result: MockApi_PreviewMockBackup_Result = modules.importLegacy(source['configuration'], source['enableFeatures']);
    if (result['guildIdentifier'] !== undefined && result['guildIdentifier'] !== source['serverId']) {
      throw new Error('This config.json belongs to another Discord server. Switch to that server first.');
    }
    const recognized: MockApi_PreviewMockBackup_Recognized = stringList(result['report']['recognizedFeatureKeys']);
    const enabled: MockApi_PreviewMockBackup_Enabled = stringList(result['report']['enabledFeatureKeys']);
    const invalid: MockApi_PreviewMockBackup_Invalid = stringList(result['report']['invalidFeatureKeys']);
    const unsupported: MockApi_PreviewMockBackup_Unsupported = stringList(result['report']['unknownSections']);
    const warnings: MockApi_PreviewMockBackup_Warnings = stringList(result['report']['warnings']);
    summary.connection = (result['discordToken'] === undefined) ? 'skipped' : 'replaced';
    summary.features = {
      features: recognized.length,
      servers: 1,
    };
    const recognizedPlural: MockApi_PreviewMockBackup_RecognizedPlural = (recognized.length === 1) ? '' : 's';
    const sections: MockApi_PreviewMockBackup_Sections = [{
      file: `${String(recognized.length)} feature${recognizedPlural} for 1 server`,
      here: 'Current settings for this server',
      id: 'features',
      label: 'Features',
      willImport: true,
    }];
    if (result['discordToken'] !== undefined) {
      sections.unshift({
        file: 'Bot Token set',
        here: 'Current connection',
        id: 'connection',
        label: 'Connection',
        willImport: true,
      });
    }
    const featuresRequiringFixes: MockApi_PreviewMockBackup_FeaturesRequiringFixes = invalid.map((key) => ({
      id: `needs-attention-${key}`,
      label: featureDisplayName(key, modules),
      reason: 'Imported switched off. Fix its settings on the Features page before turning it on.',
    }));
    return {
      appVersion: null,
      excluded: [
        ...unsupported.map((key) => ({
          id: `unsupported-${key}`,
          label: key,
          reason: 'This older section is not supported.',
        })),
        ...warnings.map((warning, index) => ({
          id: `warning-${String(index)}`,
          label: legacyWarningLabel(warning),
          reason: warning,
        })),
      ],
      exportedAt: null,
      legacy: {
        featuresRequiringFixes,
        featuresThatTurnOn: enabled.length,
      },
      sections,
      source: 'legacy',
      summary,
    };
  }
  const document: MockApi_PreviewMockBackup_Document = source['document'];
  const sections: MockApi_PreviewMockBackup_Sections = [];
  if (document['connection'] === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as it is',
      id: 'connection',
      label: 'Connection',
      reason: 'This export does not include Connection.',
      willImport: false,
    });
  } else {
    summary.connection = (bot['tokenConfigured'] === true) ? 'replaced' : 'added';

    const fileState: MockApi_PreviewMockBackup_FileState = (document['connection']['desiredState'] === 'running') ? 'Running' : 'Stopped';
    const fileToken: MockApi_PreviewMockBackup_FileToken = (document['connection']['botToken'] === null) ? 'no Bot Token' : 'Bot Token set';
    const hereState: MockApi_PreviewMockBackup_HereState = (bot['desiredState'] === 'running') ? 'Running' : 'Stopped';
    const hereToken: MockApi_PreviewMockBackup_HereToken = (bot['tokenConfigured'] === true) ? 'Bot Token set' : 'no Bot Token';

    sections.push({
      file: `${fileState}, ${fileToken}`,
      here: `${hereState}, ${hereToken}`,
      id: 'connection',
      label: 'Connection',
      willImport: true,
    });
  }
  if (document['features'] === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as they are',
      id: 'features',
      label: 'Features',
      reason: 'This export does not include Features.',
      willImport: false,
    });
  } else {
    summary.features = {
      features: document['features'].reduce((count, server) => count + server['features'].length, 0),
      servers: document['features'].length,
    };
    const currentFeatures: MockApi_PreviewMockBackup_CurrentFeatures = [...featureStates.values()].reduce((count, states) => count + states.size, 0);
    const fileFeaturesPlural: MockApi_PreviewMockBackup_FileFeaturesPlural = (summary['features']['features'] === 1) ? '' : 's';
    const fileServersPlural: MockApi_PreviewMockBackup_FileServersPlural = (summary['features']['servers'] === 1) ? '' : 's';
    const hereFeaturesPlural: MockApi_PreviewMockBackup_HereFeaturesPlural = (currentFeatures === 1) ? '' : 's';
    const hereServersPlural: MockApi_PreviewMockBackup_HereServersPlural = (featureStates.size === 1) ? '' : 's';

    sections.push({
      file: `${String(summary['features']['features'])} feature${fileFeaturesPlural} for ${String(summary['features']['servers'])} server${fileServersPlural}`,
      here: `${String(currentFeatures)} feature${hereFeaturesPlural} for ${String(featureStates.size)} server${hereServersPlural}`,
      id: 'features',
      label: 'Features',
      willImport: true,
    });
  }
  if (document['notifications'] === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as they are',
      id: 'notifications',
      label: 'Notifications',
      reason: 'This export does not include Notifications.',
      willImport: false,
    });
  } else {
    const names: MockApi_PreviewMockBackup_Names = new Set(notifications.map((notification) => notification['name'].toLocaleLowerCase()));
    summary['notifications'].replaced = document['notifications'].filter((notification) => names.has(notification['name'].toLocaleLowerCase())).length;
    summary['notifications'].added = document['notifications'].length - summary['notifications']['replaced'];

    const filePlural: MockApi_PreviewMockBackup_FilePlural = (document['notifications'].length === 1) ? '' : 's';
    const herePlural: MockApi_PreviewMockBackup_HerePlural = (notifications.length === 1) ? '' : 's';

    sections.push({
      file: `${String(document['notifications'].length)} notification${filePlural}`,
      here: `${String(notifications.length)} notification${herePlural}`,
      id: 'notifications',
      label: 'Notifications',
      willImport: true,
    });
  }
  const ownTokens: MockApi_PreviewMockBackup_OwnTokens = tokens.filter((token) => token['userId'] === user['id']);
  if (document['accessTokens'] === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as they are',
      id: 'accessTokens',
      label: 'Access tokens',
      reason: 'This export does not include Access tokens.',
      willImport: false,
    });
  } else {
    const names: MockApi_PreviewMockBackup_Names = new Set(ownTokens.map((token) => token['name'].toLocaleLowerCase()));
    const hashes: MockApi_PreviewMockBackup_Hashes = new Set(ownTokens.map((token) => token['hash']));
    summary['accessTokens'].skipped = document['accessTokens'].filter((token) => names.has(token['name'].toLocaleLowerCase()) || hashes.has(token['tokenHash'])).length;
    summary['accessTokens'].added = document['accessTokens'].length - summary['accessTokens']['skipped'];

    const filePlural: MockApi_PreviewMockBackup_FilePlural = (document['accessTokens'].length === 1) ? '' : 's';
    const herePlural: MockApi_PreviewMockBackup_HerePlural = (ownTokens.length === 1) ? '' : 's';

    sections.push({
      file: `${String(document['accessTokens'].length)} access token${filePlural}`,
      here: `${String(ownTokens.length)} access token${herePlural}`,
      id: 'accessTokens',
      label: 'Access tokens',
      willImport: true,
    });
  }
  return {
    appVersion: document['appVersion'],
    excluded: [],
    exportedAt: document['exportedAt'],
    sections,
    source: 'export',
    summary,
  };
};

/**
 * Mock API - Apply Mock Backup.
 *
 * Mutates the in-memory console state after review and fresh authentication.
 * The returned summary contains no secret values.
 *
 * @param {MockApi_ApplyMockBackup_Source}  source  - Source.
 * @param {MockApi_ApplyMockBackup_User}    user    - User.
 * @param {MockApi_ApplyMockBackup_Modules} modules - Modules.
 *
 * @returns {MockApi_ApplyMockBackup_Returns}
 *
 * @since 4.0.0
 */
const applyMockBackup = (source: MockApi_ApplyMockBackup_Source, user: MockApi_ApplyMockBackup_User, modules: MockApi_ApplyMockBackup_Modules): MockApi_ApplyMockBackup_Returns => {
  const preview: MockApi_ApplyMockBackup_Preview = previewMockBackup(source, user, modules);
  const summary: MockApi_ApplyMockBackup_Summary = preview['summary'] as MockApi_ApplyMockBackup_Summary;
  const importedSections: MockApi_ApplyMockBackup_ImportedSections = [];
  if (source['type'] === 'legacy') {
    if (modules['importLegacy'] === null) {
      throw new Error('The older config.json importer is unavailable.');
    }
    const result: MockApi_ApplyMockBackup_Result = modules.importLegacy(source['configuration'], source['enableFeatures']);

    for (const featureEntry of Object.entries(result['settings']['features'] ?? {})) {
      const featureKey: MockApi_ApplyMockBackup_FeatureKey = featureEntry[0];
      const feature: MockApi_ApplyMockBackup_Feature = featureEntry[1];
      const state: MockApi_ApplyMockBackup_State = stateOf(source['serverId'], featureKey);
      state.configuration = structuredClone(feature['configuration']);
      state.enabled = feature['enabled'];
      state.revision += 1;
      state.updatedAt = nowIso();
    }
    for (const secret of result['secrets']) {
      secretsFor(source['serverId']).set(secret['key'], secret['value']);
    }
    if (result['discordToken'] !== undefined) {
      bot.tokenConfigured = true;
      importedSections.push('connection');
    }
    importedSections.push('features');
    return {
      ...summary,
      importedSections,
    };
  }
  const document: MockApi_ApplyMockBackup_Document = source['document'];
  if (document['connection'] !== undefined) {
    bot.desiredState = document['connection']['desiredState'];
    bot.tokenConfigured = document['connection']['botToken'] !== null;
    importedSections.push('connection');
  }
  if (document['features'] !== undefined) {
    for (const server of document['features']) {
      const states: MockApi_ApplyMockBackup_States = statesFor(server['serverId']);
      const secrets: MockApi_ApplyMockBackup_Secrets = secretsFor(server['serverId']);

      states.clear();

      secrets.clear();

      for (const feature of server['features']) {
        states.set(feature['key'], {
          configuration: structuredClone(feature['configuration']),
          enabled: feature['enabled'],
          revision: 1,
          updatedAt: nowIso(),
        });

        for (const secretEntry of Object.entries(feature['secrets'])) {
          secrets.set(secretEntry[0], secretEntry[1]);
        }
      }
    }
    bot.activeFeatures = [...statesFor(loungeId)].filter((entry) => entry[1]['enabled']).map((entry) => entry[0]);
    importedSections.push('features');
  }
  if (document['notifications'] !== undefined) {
    const usedIds: MockApi_ApplyMockBackup_UsedIds = new Set(notifications.map((notification) => notification['id']));

    for (const portable of document['notifications']) {
      const existing: MockApi_ApplyMockBackup_Existing = notifications.find((notification) => notification['name'].toLocaleLowerCase() === portable['name'].toLocaleLowerCase());
      let id: MockApi_ApplyMockBackup_Id = (existing !== undefined) ? existing['id'] : portable['id'];
      if (existing === undefined && usedIds.has(id) === true) {
        id = `ntf-${randomBytes(8).toString('hex')}`;
      }
      const next: MockApi_ApplyMockBackup_Next = {
        createdAt: (existing !== undefined) ? existing['createdAt'] : nowIso(),
        events: [...portable['events']],
        id,
        lastAttemptAt: (existing !== undefined) ? existing['lastAttemptAt'] : null,
        lastError: null,
        name: portable['name'],
        secrets: Object.fromEntries(Object.keys(portable['secrets']).map((key): MockApi_ApplyMockBackup_SecretEntry => [
          key,
          true,
        ])),
        secretsMissing: [],
        service: portable['service'],
        settings: { ...portable['settings'] },
        updatedAt: nowIso(),
      };
      if (existing === undefined) {
        notifications.push(next);
      } else {
        Object.assign(existing, next);
      }
      usedIds.add(id);
    }
    importedSections.push('notifications');
  }
  if (document['accessTokens'] !== undefined) {
    const names: MockApi_ApplyMockBackup_Names = new Set(tokens.filter((token) => token['userId'] === user['id']).map((token) => token['name'].toLocaleLowerCase()));
    const hashes: MockApi_ApplyMockBackup_Hashes = new Set(tokens.map((token) => token['hash']));
    const ids: MockApi_ApplyMockBackup_Ids = new Set(tokens.map((token) => token['id']));

    for (const portable of document['accessTokens']) {
      if (names.has(portable['name'].toLocaleLowerCase()) === true || hashes.has(portable['tokenHash']) === true) {
        continue;
      }
      let id: MockApi_ApplyMockBackup_Id = portable['id'];
      if (ids.has(id) === true) {
        id = `tok-${randomBytes(8).toString('hex')}`;
      }
      tokens.push({
        createdAt: nowIso(),
        expiresAt: portable['expiresAt'],
        hash: portable['tokenHash'],
        id,
        lastUsedAt: null,
        name: portable['name'],
        scopes: [...portable['scopes']],
        userId: user['id'],
      });

      names.add(portable['name'].toLocaleLowerCase());

      hashes.add(portable['tokenHash']);

      ids.add(id);
    }
    importedSections.push('accessTokens');
  }
  return {
    ...summary,
    importedSections,
  };
};

/**
 * Mock API - Read Pointer.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ReadPointer_Returns}
 *
 * @since 4.0.0
 */
const readPointer = (value: MockApi_ReadPointer_Value, pointer: MockApi_ReadPointer_Pointer): MockApi_ReadPointer_Returns => {
  let current: MockApi_ReadPointer_Current = value;

  for (const segment of pointer.split('/').slice(1).map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))) {
    if (Array.isArray(current) === true) {
      current = current[Number(segment)];
    } else if (isRecord(current) === true) {
      current = current[segment];
    } else {
      return undefined;
    }
  }

  return current;
};

/**
 * Mock API - Feature Detail.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_FeatureDetail_Returns}
 *
 * @since 4.0.0
 */
const featureDetail = async (entry: MockApi_FeatureDetail_Entry, serverId: MockApi_FeatureDetail_ServerId): MockApi_FeatureDetail_Returns => {
  const modules: MockApi_FeatureDetail_Modules = await loadModules();
  const state: MockApi_FeatureDetail_State = stateOf(serverId, entry['key']);
  const store: MockApi_FeatureDetail_Store = secretsFor(serverId);
  const saved: MockApi_FeatureDetail_Saved = {};

  for (const reference of collectReferences(state['configuration'])) {
    if (store.has(reference['key']) === true) {
      Reflect.set(saved, reference['key'], true);
    }
  }

  let editor: MockApi_FeatureDetail_Editor = {};

  try {
    editor = modules.editorFor(entry['key']);
  } catch {
    editor = fallbackModules().editorFor(entry['key']);
  }

  return {
    ...featureSummary(entry, serverId),
    configuration: state['configuration'],
    editor,
    example: examples.get(entry['key']) ?? null,
    secrets: saved,
  };
};

// Invite pages.

/**
 * Mock API - Invite Page For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_InvitePageFor_Returns}
 *
 * @since 4.0.0
 */
const invitePageFor = (server: MockApi_InvitePageFor_Server): MockApi_InvitePageFor_Returns => {
  const existing: MockApi_InvitePageFor_Existing = invitePages.get(server['id']);

  if (existing !== undefined) {
    return existing;
  }

  const created: MockApi_InvitePageFor_Created = (server['id'] === loungeId) ? {
    accentColor: '#6250d9',
    bannerImageId: null,
    buttonLabel: 'Join the server',
    description: 'Daily chat, weekly events, and a friendly crowd to hang out with.',
    footerText: [
      'By joining you agree to the [server rules](https://example.com/rules).',
      'Questions? https://example.com/help',
    ].join('\n'),
    logo: 'server',
    logoImageId: null,
    revision: 3,
    showBoostTier: true,
    showMemberCount: true,
    theme: 'system',
    title: 'Join Stonker Lounge',
    updatedAt: agoIso(5 * 24 * 60),
  } : {
    accentColor: '#6250d9',
    bannerImageId: null,
    buttonLabel: 'Join',
    description: '',
    footerText: '',
    logo: 'server',
    logoImageId: null,
    revision: 0,
    showBoostTier: false,
    showMemberCount: true,
    theme: 'system',
    title: server['name'],
    updatedAt: null,
  };

  invitePages.set(server['id'], created);

  return created;
};

// invitePathFor reads the invite path from the server's Web applications settings.

/**
 * Mock API - Invite Path For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_InvitePathFor_Returns}
 *
 * @since 4.0.0
 */
const invitePathFor = (serverId: MockApi_InvitePathFor_ServerId): MockApi_InvitePathFor_Returns => {
  const configuration: MockApi_InvitePathFor_Configuration = stateOf(serverId, 'web-applications')['configuration'];
  const generator: MockApi_InvitePathFor_Generator = (isRecord(configuration) === true) ? configuration['invite-generator'] : undefined;
  const options: MockApi_InvitePathFor_Options = (isRecord(generator) === true) ? generator['options'] : undefined;
  const path: MockApi_InvitePathFor_Path = (isRecord(options) === true) ? options['path'] : undefined;

  return (typeof path === 'string' && path.startsWith('/') === true) ? path : null;
};

/**
 * Mock API - Media URL.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_MediaUrl_Returns}
 *
 * @since 4.0.0
 */
const mediaUrl = (imageId: MockApi_MediaUrl_ImageId): MockApi_MediaUrl_Returns => ((imageId === null) ? null : `/media/${imageId}`);

/**
 * Mock API - Designer Response.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_DesignerResponse_Returns}
 *
 * @since 4.0.0
 */
const designerResponse = (server: MockApi_DesignerResponse_Server, origin: MockApi_DesignerResponse_Origin): MockApi_DesignerResponse_Returns => {
  const page: MockApi_DesignerResponse_Page = invitePageFor(server);
  const path: MockApi_DesignerResponse_Path = invitePathFor(server['id']);

  return {
    enabled: stateOf(server['id'], 'web-applications')['enabled'] && path !== null,
    page: {
      ...page,
      bannerImageUrl: mediaUrl(page['bannerImageId']),
      logoImageUrl: mediaUrl(page['logoImageId']),
    },
    publicUrl: (path === null) ? null : `${origin}${path}`,
    server: {
      iconUrl: server['iconUrl'],
      name: server['name'],
    },
  };
};

/**
 * Mock API - Escape HTML.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_EscapeHtml_Returns}
 *
 * @since 4.0.0
 */
const escapeHtml = (value: MockApi_EscapeHtml_Value): MockApi_EscapeHtml_Returns => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;');
};

// HTTP helpers.

/**
 * Mock API - Send JSON.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendJson_Returns}
 *
 * @since 4.0.0
 */
const sendJSON = (response: MockApi_SendJson_Response, status: MockApi_SendJson_Status, body: MockApi_SendJson_Body): MockApi_SendJson_Returns => {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  }).end(JSON.stringify(body));

  return;
};

/**
 * Mock API - Send Empty.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendEmpty_Returns}
 *
 * @since 4.0.0
 */
const sendEmpty = (response: MockApi_SendEmpty_Response, status: MockApi_SendEmpty_Status = 204): MockApi_SendEmpty_Returns => {
  response.writeHead(status).end();

  return;
};

/**
 * Mock API - Send Error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendError_Returns}
 *
 * @since 4.0.0
 */
const sendError = (response: MockApi_SendError_Response, status: MockApi_SendError_Status, code: MockApi_SendError_Code, message: MockApi_SendError_Message): MockApi_SendError_Returns => {
  sendJSON(response, status, {
    error: {
      code,
      message,
    },
  });

  return;
};

/**
 * Mock API - Send Issues.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendIssues_Returns}
 *
 * @since 4.0.0
 */
const sendIssues = (response: MockApi_SendIssues_Response, status: MockApi_SendIssues_Status, code: MockApi_SendIssues_Code, issues: MockApi_SendIssues_Issues): MockApi_SendIssues_Returns => {
  const firstIssue: MockApi_SendIssues_FirstIssue = issues[0];

  sendJSON(response, status, {
    error: {
      code,
      issues,
      message: (firstIssue !== undefined) ? firstIssue['message'] : 'Check the highlighted fields.',
    },
  });

  return;
};

/**
 * Mock API - Field Issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_FieldIssue_Returns}
 *
 * @since 4.0.0
 */
const fieldIssue = (field: MockApi_FieldIssue_Field, message: MockApi_FieldIssue_Message): MockApi_FieldIssue_Returns => ({
  field,
  message,
  path: field.split('.'),
});

/**
 * Mock API - Read Raw.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ReadRaw_Returns}
 *
 * @since 4.0.0
 */
const readRaw = async (request: MockApi_ReadRaw_Request): MockApi_ReadRaw_Returns => {
  const chunks: MockApi_ReadRaw_Chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

/**
 * Mock API - Read Cookies.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ReadCookies_Returns}
 *
 * @since 4.0.0
 */
const readCookies = (request: MockApi_ReadCookies_Request): MockApi_ReadCookies_Returns => {
  return Object.fromEntries((request.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim().split('='))
    .filter((parts) => parts.length >= 2 && parts[0] !== '')
    .map((parts): MockApi_ReadCookies_Entry => [
      parts[0] ?? '',
      decodeURIComponent(parts.slice(1).join('=')),
    ]));
};

// startSession signs a user in and answers like the real session response.

/**
 * Mock API - Start Session.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_StartSession_Returns}
 *
 * @since 4.0.0
 */
const startSession = (response: MockApi_StartSession_Response, user: MockApi_StartSession_User, status: MockApi_StartSession_Status = 200): MockApi_StartSession_Returns => {
  const sessionId: MockApi_StartSession_SessionId = randomBytes(24).toString('base64url');
  const csrfToken: MockApi_StartSession_CsrfToken = randomBytes(24).toString('base64url');

  const signedIn: MockApi_StartSession_SignedIn = users.find((candidate) => candidate['id'] === user['id']);

  sessions.set(sessionId, {
    csrfToken,
    userId: user['id'],
  });

  if (signedIn !== undefined) {
    signedIn.lastSignInAt = nowIso();
  }

  writeLog('web', 'info', 'sign_in_succeeded', {
    userId: user['id'],
    username: user['username'],
  });

  response.setHeader('Set-Cookie', [
    `dsb_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
    `dsb_csrf=${csrfToken}; Path=/; SameSite=Strict`,
  ]);

  sendJSON(response, status, {
    csrfToken,
    expiresAt: new Date(Date.now() + (24 * 60 * minute)).toISOString(),
    status: 'authenticated',
    user: {
      id: user['id'],
      role: user['role'],
      username: user['username'],
    },
  });

  return;
};

// principalOf finds who is calling: a browser session or a personal access token.

/**
 * Mock API - Principal Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_PrincipalOf_Returns}
 *
 * @since 4.0.0
 */
const principalOf = (request: MockApi_PrincipalOf_Request): MockApi_PrincipalOf_Returns => {
  const authorization: MockApi_PrincipalOf_Authorization = request.headers.authorization ?? '';

  if (authorization.startsWith('Bearer ') === true) {
    const token: MockApi_PrincipalOf_Token = tokens.find((candidate) => candidate['hash'] === digest(authorization.slice(7).trim()));
    const user: MockApi_PrincipalOf_User = (token === undefined) ? undefined : users.find((candidate) => candidate['id'] === token['userId']);

    if (
      token === undefined
      || user === undefined
      || user['enabled'] === false
      || (
        token['expiresAt'] !== null
        && Date.parse(token['expiresAt']) <= Date.now()
      )
    ) {
      return null;
    }

    token.lastUsedAt = nowIso();

    return {
      kind: 'token',
      token,
      user,
    };
  }

  const session: MockApi_PrincipalOf_Session = sessions.get(readCookies(request)['dsb_session'] ?? '');
  const user: MockApi_PrincipalOf_User = (session === undefined) ? undefined : users.find((candidate) => candidate['id'] === session['userId']);

  if (user === undefined || user['enabled'] === false) {
    return null;
  }

  return {
    kind: 'session',
    token: null,
    user,
  };
};

/**
 * Mock API - Csrf Valid.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_CsrfValid_Returns}
 *
 * @since 4.0.0
 */
const csrfValid = (request: MockApi_CsrfValid_Request): MockApi_CsrfValid_Returns => {
  const session: MockApi_CsrfValid_Session = sessions.get(readCookies(request)['dsb_session'] ?? '');

  return session !== undefined && request.headers['x-csrf-token'] === session['csrfToken'];
};

/**
 * Mock API - Sign Out User.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SignOutUser_Returns}
 *
 * @since 4.0.0
 */
const signOutUser = (userId: MockApi_SignOutUser_UserId): MockApi_SignOutUser_Returns => {
  for (const sessionEntry of sessions) {
    const sessionId: MockApi_SignOutUser_SessionId = sessionEntry[0];
    const session: MockApi_SignOutUser_Session = sessionEntry[1];

    if (session['userId'] === userId) {
      sessions.delete(sessionId);
    }
  }

  return;
};

// Bot state.

/**
 * Mock API - Set Bot Status.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SetBotStatus_Returns}
 *
 * @since 4.0.0
 */
const setBotStatus = (status: MockApi_SetBotStatus_Status, delay: MockApi_SetBotStatus_Delay, next: MockApi_SetBotStatus_Next): MockApi_SetBotStatus_Returns => {
  bot.status = status;

  if (botTimer !== undefined) {
    clearTimeout(botTimer);
  }

  if (next !== null) {
    botTimer = setTimeout(() => {
      bot.status = next;

      if (next === 'ready') {
        writeLog('bot', 'info', 'gateway_ready', {
          guildCount: servers.length,
          userTag: bot['userTag'],
        });
      }

      return;
    }, delay);
  }

  return;
};

/**
 * Mock API - Bot Resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_BotResource_Returns}
 *
 * @since 4.0.0
 */
const botResource = (): MockApi_BotResource_Returns => ({
  activeFeatures: bot['activeFeatures'],
  addServerUrl: addServerUrl(),
  applicationId: bot['applicationId'],
  configurationErrors: bot['configurationErrors'],
  desiredState: bot['desiredState'],
  guildCount: (bot['status'] === 'ready') ? servers.length : null,
  resolution: bot['resolution'],
  services: [
    {
      component: 'bot',
      status: bot['status'],
      updatedAt: agoIso(0.2),
    },
    {
      component: 'web',
      status: 'ready',
      updatedAt: agoIso(0.4),
    },
    {
      component: 'worker',
      status: 'ready',
      updatedAt: agoIso(0.7),
    },
  ],
  status: bot['status'],
  tokenConfigured: bot['tokenConfigured'],
  userTag: (bot['status'] === 'ready') ? bot['userTag'] : null,
});

// Routes.

// handlePublic answers the public invite page and uploaded images, like the web process does.

/**
 * Mock API - Handle Public.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_HandlePublic_Returns}
 *
 * @since 4.0.0
 */
const handlePublic = async (request: MockApi_HandlePublic_Request, response: MockApi_HandlePublic_Response, url: MockApi_HandlePublic_Url): MockApi_HandlePublic_Returns => {
  const method: MockApi_HandlePublic_Method = request.method ?? 'GET';
  const mediaMatch: MockApi_HandlePublic_MediaMatch = url.pathname.match(new RegExp(mediaPathPattern, 'u'));

  if (method === 'GET' && mediaMatch !== null) {
    const image: MockApi_HandlePublic_Image = images.get(mediaMatch[1] ?? '');

    if (image === undefined) {
      response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found.');

      return true;
    }

    response.writeHead(200, {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': image['contentType'],
    }).end(image['data']);

    return true;
  }

  await ensureFeatures();

  const server: MockApi_HandlePublic_Server = servers.find((candidate) => invitePathFor(candidate['id']) === url.pathname);

  if (server === undefined || viteServer === null) {
    return false;
  }

  const page: MockApi_HandlePublic_Page = invitePageFor(server);
  const available: MockApi_HandlePublic_Available = (
    bot['desiredState'] === 'running'
    && bot['status'] === 'ready'
    && stateOf(server['id'], 'web-applications')['enabled']
  );

  if (method === 'POST') {
    const address: MockApi_HandlePublic_Address = request.socket.remoteAddress ?? 'local';
    const recent: MockApi_HandlePublic_Recent = (inviteAttempts.get(address) ?? []).filter((time) => time > Date.now() - (10 * minute));
    let body: MockApi_HandlePublic_Body = undefined;

    try {
      body = JSON.parse((await readRaw(request)).toString('utf-8'));
    } catch {
      sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

      return true;
    }

    if (recent.length >= 5) {
      response.setHeader('Retry-After', '600');

      sendError(response, 429, 'rate_limited', 'Too many invites from this network. Try again in 10 minutes.');

      return true;
    }

    if (
      isRecord(body) === false
      || typeof body['recaptchaToken'] !== 'string'
      || body['recaptchaToken'].trim() === ''
    ) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('recaptchaToken', 'Complete the reCAPTCHA check.')]);

      return true;
    }

    if (available === false) {
      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return true;
    }

    inviteAttempts.set(address, [
      ...recent,
      Date.now(),
    ]);

    writeLog('web', 'info', 'public_invite_created', {
      guildIdentifier: server['id'],
      maxAgeSeconds: 300,
      maxUses: 1,
      path: url.pathname,
    });
    sendJSON(response, 200, { inviteUrl: `https://discord.gg/mock${randomBytes(3).toString('hex')}` });

    return true;
  }

  if (method !== 'GET') {
    return false;
  }

  const origin: MockApi_HandlePublic_Origin = `http://${request.headers.host ?? 'localhost:5175'}`;
  const bannerUrl: MockApi_HandlePublic_BannerUrl = mediaUrl(page['bannerImageId']);
  let logoUrl: MockApi_HandlePublic_LogoUrl = null;

  if (page['logo'] === 'server') {
    logoUrl = server['iconUrl'];
  } else if (page['logo'] === 'custom') {
    logoUrl = mediaUrl(page['logoImageId']);
  }

  const statsParts: MockApi_HandlePublic_StatsParts = [];

  if (page['showMemberCount'] === true) {
    statsParts.push(`${server['memberCount'].toLocaleString('en-US')} members`);
  }

  if (page['showBoostTier'] === true && server['boostTier'] > 0) {
    statsParts.push(`Boost level ${server['boostTier']}`);
  }

  const description: MockApi_HandlePublic_Description = [
    page['description'],
    statsParts.join(' · '),
  ].filter((part) => part !== '').join(' — ');
  const previewImage: MockApi_HandlePublic_PreviewImage = bannerUrl ?? ((logoUrl !== null && logoUrl.startsWith('/') === true) ? logoUrl : null);
  const twitterCard: MockApi_HandlePublic_TwitterCard = (bannerUrl === null) ? 'summary' : 'summary_large_image';
  const head: MockApi_HandlePublic_Head = [
    `<title>${escapeHtml(page['title'])}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="theme-color" content="${escapeHtml(page['accentColor'])}" />`,
    `<meta property="og:title" content="${escapeHtml(page['title'])}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(`${origin}${url.pathname}`)}" />`,
    ...((previewImage === null) ? [] : [`<meta property="og:image" content="${escapeHtml(`${origin}${previewImage}`)}" />`]),
    `<meta name="twitter:card" content="${twitterCard}" />`,
  ].join('\n    ');
  const data: MockApi_HandlePublic_Data = JSON.stringify({
    available,
    page: {
      accentColor: page['accentColor'],
      bannerUrl,
      buttonLabel: page['buttonLabel'],
      description: page['description'],
      footerText: page['footerText'],
      logoUrl,
      showBoostTier: page['showBoostTier'],
      showMemberCount: page['showMemberCount'],
      theme: page['theme'],
      title: page['title'],
    },
    recaptchaSiteKey: (available === true) ? recaptchaTestSiteKey : null,
    server: {
      boostTier: server['boostTier'],
      iconUrl: server['iconUrl'],
      memberCount: server['memberCount'],
      name: server['name'],
    },
    submitPath: url.pathname,
  }).replaceAll('<', '\\u003c');
  const template: MockApi_HandlePublic_Template = readFileSync(new URL('./invite.html', import.meta.url), 'utf-8');
  const html: MockApi_HandlePublic_Html = await viteServer.transformIndexHtml(url.pathname, template
    .replace('<!-- invite-head -->', head)
    .replace('<!-- invite-data -->', `<script type="application/json" id="invite-data">${data}</script>`));

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/html; charset=utf-8',
  }).end(html);

  return true;
};

// Answers one console API call, or returns false so Vite serves the page.

/**
 * Mock API - Handle Request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_HandleRequest_Returns}
 *
 * @since 4.0.0
 */
const handleRequest = async (request: MockApi_HandleRequest_Request, response: MockApi_HandleRequest_Response): MockApi_HandleRequest_Returns => {
  // The Host header gives the address the page was opened at, like the real server sees it.
  const url: MockApi_HandleRequest_Url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const path: MockApi_HandleRequest_Path = url.pathname;
  const method: MockApi_HandleRequest_Method = request.method ?? 'GET';

  if (path.startsWith('/api/v1/') === false) {
    return handlePublic(request, response, url);
  }

  await ensureFeatures();

  const uploadRoute: MockApi_HandleRequest_UploadRoute = method === 'POST' && new RegExp(inviteImagesPathPattern, 'u').test(path);
  let raw: MockApi_HandleRequest_Raw = Buffer.alloc(0);
  let body: MockApi_HandleRequest_Body = {};

  if (method !== 'GET' && method !== 'HEAD') {
    raw = await readRaw(request);

    if (uploadRoute === false && raw.length > 0) {
      try {
        const parsed: MockApi_HandleRequest_Parsed = JSON.parse(raw.toString('utf-8'));

        body = (isRecord(parsed) === true) ? parsed : {};
      } catch {
        sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

        return true;
      }
    }
  }

  if (method === 'GET' && path === '/api/v1/setup/status') {
    sendJSON(response, 200, (owner === null) ? {
      claimExpiresAt: new Date(startedAt + (30 * minute)).toISOString(),
      claimRequired: true,
    } : { claimRequired: false });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/setup/claim') {
    if (owner !== null) {
      sendError(response, 409, 'claim_unavailable', 'Setup is already complete. Sign in instead.');

      return true;
    }

    if (String(body['claimCode'] ?? '').trim() === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('claimCode', 'Enter the setup code from the container log.')]);

      return true;
    }

    if (normalizeCode(String(body['claimCode'])) !== normalizeCode(setupCode)) {
      sendIssues(response, 401, 'claim_invalid', [fieldIssue('claimCode', 'That setup code is wrong or expired. Restart the container to print a new one.')]);

      return true;
    }

    const claimUsername: MockApi_HandleRequest_ClaimUsername = String(body['username'] ?? '').trim();
    const claimUsernameIssue: MockApi_HandleRequest_ClaimUsernameIssue = usernameIssue(claimUsername);

    if (claimUsernameIssue !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', claimUsernameIssue)]);

      return true;
    }

    if (passwordIssue(body['password']) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('password', passwordIssue(body['password']))]);

      return true;
    }

    owner = {
      allServers: true,
      createdAt: nowIso(),
      enabled: true,
      id: userIdFor(1),
      lastSignInAt: null,
      password: String(body['password']),
      recoveryCodes: [],
      role: 'owner',
      serverIds: [],
      totpEnabled: false,
      totpPending: false,
      username: claimUsername,
    };
    seedAccounts(owner);
    writeLog('web', 'info', 'setup_completed', {
      userId: owner['id'],
      username: owner['username'],
    });
    startSession(response, owner, 201);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login') {
    const loginUsername: MockApi_HandleRequest_LoginUsername = String(body['username'] ?? '').trim();
    const loginPassword: MockApi_HandleRequest_LoginPassword = body['password'];

    if (loginUsername === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', 'Enter your username.')]);

      return true;
    }

    if (typeof loginPassword !== 'string' || loginPassword === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('password', 'Enter your password.')]);

      return true;
    }

    const loginUser: MockApi_HandleRequest_LoginUser = users.find((candidate) => candidate['username'].toLowerCase() === loginUsername.toLowerCase());

    if (
      loginUser === undefined
      || loginUser['enabled'] === false
      || loginUser['password'] !== loginPassword
    ) {
      writeLog('web', 'warn', 'sign_in_failed', { username: loginUsername });
      sendError(response, 401, 'credentials_invalid', 'The username or password is incorrect.');

      return true;
    }

    if (loginUser['totpEnabled'] === true) {
      pendingChallenge = {
        challenge: randomBytes(24).toString('base64url'),
        failures: 0,
        userId: loginUser['id'],
      };
      sendJSON(response, 200, {
        challenge: pendingChallenge['challenge'],
        expiresAt: new Date(Date.now() + (5 * minute)).toISOString(),
        status: 'second_factor_required',
      });

      return true;
    }

    startSession(response, loginUser);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login/second-factor') {
    const code: MockApi_HandleRequest_Code = String(body['code'] ?? '').trim();
    const currentChallenge: MockApi_HandleRequest_CurrentChallenge = pendingChallenge;
    const challengeUser: MockApi_HandleRequest_ChallengeUser = (currentChallenge === null) ? undefined : users.find((candidate) => candidate['id'] === currentChallenge['userId']);

    if (
      pendingChallenge === null
      || body['challenge'] !== pendingChallenge['challenge']
      || challengeUser === undefined
    ) {
      sendError(response, 401, 'challenge_expired', 'Your sign-in timed out. Enter your password again.');

      return true;
    }

    if (code === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('code', 'Enter the code from your authenticator app, or a recovery code.')]);

      return true;
    }

    const isTotpCode: MockApi_HandleRequest_IsTotpCode = new RegExp(totpCodePattern, 'u').test(code);
    const recoveryCode: MockApi_HandleRequest_RecoveryCode = (isTotpCode === true) ? undefined : challengeUser['recoveryCodes'].find((candidate) => normalizeCode(candidate) === normalizeCode(code));

    if (
      (
        isTotpCode === true
        && code !== '123456'
      )
      || (
        isTotpCode === false
        && recoveryCode === undefined
      )
    ) {
      pendingChallenge.failures += 1;

      if (pendingChallenge['failures'] >= 5) {
        pendingChallenge = null;
        sendError(response, 401, 'challenge_expired', 'Too many wrong codes. Enter your password again.');

        return true;
      }

      sendIssues(response, 401, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Try the current code, or a recovery code.')]);

      return true;
    }

    challengeUser.recoveryCodes = challengeUser['recoveryCodes'].filter((candidate) => candidate !== recoveryCode);
    pendingChallenge = null;
    startSession(response, challengeUser);

    return true;
  }

  // Passkey sign-in accepts any answer from the browser and signs in the owner, like the
  // transmission-vpn mock.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/options') {
    sendJSON(response, 200, {
      ceremonyId: randomBytes(16).toString('base64url'),
      options: {
        allowCredentials: [],
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/verify') {
    if (owner === null) {
      sendError(response, 401, 'passkey_rejected', 'That passkey wasn\'t accepted.');

      return true;
    }

    startSession(response, owner);

    return true;
  }

  const principal: MockApi_HandleRequest_Principal = principalOf(request);

  if (principal === null) {
    sendError(response, 401, 'authentication_required', 'Sign in to continue.');

    return true;
  }

  const user: MockApi_HandleRequest_User = principal['user'];
  const isSession: MockApi_HandleRequest_IsSession = principal['kind'] === 'session';

  if (
    isSession === true
    && method !== 'GET'
    && csrfValid(request) === false
  ) {
    sendError(response, 403, 'csrf_invalid', 'The request CSRF token is missing or invalid.');

    return true;
  }

  // requireScope lets a token through only with the scope; sessions pass.

  /**
   * Mock API - Require Scope.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_RequireScope_Returns}
   *
   * @since 4.0.0
   */
  const requireScope: MockApi_HandleRequest_RequireScope = (scope: MockApi_HandleRequest_RequireScope_Scope): MockApi_HandleRequest_RequireScope_Returns => {
    if (principal['token'] !== null && principal['token']['scopes'].includes(scope) === false) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${scope} scope.`);

      return false;
    }

    return true;
  };

  /**
   * Mock API - Require Session.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_RequireSession_Returns}
   *
   * @since 4.0.0
   */
  const requireSession: MockApi_HandleRequest_RequireSession = (): MockApi_HandleRequest_RequireSession_Returns => {
    if (isSession === false) {
      sendError(response, 403, 'session_required', 'A signed-in browser session is required.');

      return false;
    }

    return true;
  };

  /**
   * Mock API - Require Permission.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_RequirePermission_Returns}
   *
   * @since 4.0.0
   */
  const requirePermission: MockApi_HandleRequest_RequirePermission = (permission: MockApi_HandleRequest_RequirePermission_Permission): MockApi_HandleRequest_RequirePermission_Returns => {
    if (permissionsOf(user).includes(permission) === false) {
      sendError(response, 403, 'permission_required', permissionMessages[permission]);

      return false;
    }

    return true;
  };

  /**
   * Mock API - Check Password.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_CheckPassword_Returns}
   *
   * @since 4.0.0
   */
  const checkPassword: MockApi_HandleRequest_CheckPassword = (field: MockApi_HandleRequest_CheckPassword_Field = 'password'): MockApi_HandleRequest_CheckPassword_Returns => {
    if (typeof body[field] !== 'string' || body[field] === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(field, (field === 'currentPassword') ? 'Enter your current password.' : 'Enter your password.')]);

      return false;
    }

    if (body[field] !== user['password']) {
      sendIssues(response, 422, 'password_incorrect', [fieldIssue(field, 'That password is incorrect.')]);

      return false;
    }

    return true;
  };

  if (method === 'GET' && path === '/api/v1/auth/me') {
    sendJSON(response, 200, (principal['token'] === null) ? {
      allServers: user['allServers'],
      authenticationType: 'session',
      id: user['id'],
      permissions: permissionsOf(user),
      removedSecrets: removedSecrets.filter((removedSecret) => ((removedSecret['kind'] === 'authenticator') ? removedSecret['userId'] === user['id'] : permissionsOf(user).includes('configuration:write'))).map((removedSecret) => {
        const visibleSecret: MockApi_HandleRequest_VisibleSecret = { ...removedSecret };

        Reflect.deleteProperty(visibleSecret, 'userId');

        return visibleSecret;
      }),
      role: user['role'],
      serverIds: (user['allServers'] === true) ? [] : user['serverIds'],
      username: user['username'],
    } : {
      authenticationType: 'token',
      id: principal['token']['id'],
      name: principal['token']['name'],
      scopes: principal['token']['scopes'],
      username: user['username'],
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation') {
    if (requireSession() === false || requirePermission('users:manage') === false) {
      return true;
    }
    const purpose: MockApi_HandleRequest_Purpose = body['purpose'];
    if (purpose !== 'export' && purpose !== 'import') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('purpose', 'Choose what you are confirming.')]);
      return true;
    }
    if (checkPassword() === false) {
      return true;
    }
    if (user['totpEnabled'] === true && body['code'] !== '123456') {
      sendIssues(response, 422, 'identity_not_confirmed', [fieldIssue('code', 'That authenticator code is incorrect. Use 123456 in the mock.')]);
      return true;
    }
    const sessionId: MockApi_HandleRequest_SessionId = readCookies(request)['dsb_session'] ?? '';

    sendJSON(response, 200, issueBackupGrant(sessionId, purpose));
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation/passkey/options') {
    if (requireSession() === false || requirePermission('users:manage') === false) {
      return true;
    }
    const purpose: MockApi_HandleRequest_Purpose = body['purpose'];
    if (purpose !== 'export' && purpose !== 'import') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('purpose', 'Choose what you are confirming.')]);
      return true;
    }
    if ((passkeysByUser.get(user['id']) ?? []).length === 0) {
      sendError(response, 409, 'passkeys_unavailable', 'Add a passkey first, or use your password.');
      return true;
    }
    const ceremonyId: MockApi_HandleRequest_CeremonyId = randomBytes(16).toString('base64url');
    const sessionId: MockApi_HandleRequest_SessionId = readCookies(request)['dsb_session'] ?? '';

    backupPasskeyCeremonies.set(ceremonyId, {
      expiresAt: Date.now() + (5 * minute),
      purpose,
      sessionId: digest(sessionId),
    });

    sendJSON(response, 200, {
      ceremonyId,
      options: {
        allowCredentials: [],
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation/passkey/verify') {
    if (requireSession() === false || requirePermission('users:manage') === false) {
      return true;
    }
    const ceremonyId: MockApi_HandleRequest_CeremonyIdInput = body['ceremonyId'];
    const purpose: MockApi_HandleRequest_Purpose = body['purpose'];
    const sessionId: MockApi_HandleRequest_SessionId = readCookies(request)['dsb_session'] ?? '';
    const binding: MockApi_HandleRequest_Binding = (typeof ceremonyId === 'string') ? backupPasskeyCeremonies.get(ceremonyId) : undefined;
    if (
      binding === undefined
      || binding['expiresAt'] <= Date.now()
      || binding['sessionId'] !== digest(sessionId)
      || binding['purpose'] !== purpose
      || isRecord(body['credential']) === false
    ) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');
      return true;
    }
    backupPasskeyCeremonies.delete(ceremonyId as MockApi_HandleRequest_CeremonyId);

    sendJSON(response, 200, issueBackupGrant(sessionId, binding['purpose']));
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/export') {
    if (requireSession() === false || requirePermission('users:manage') === false) {
      return true;
    }
    const selected: MockApi_HandleRequest_Selected = body['sections'];
    if (
      isRecord(selected) === false
      || [
        'connection',
        'features',
        'notifications',
        'accessTokens',
      ].some((key) => selected[key] === true) === false
    ) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('sections', 'Choose at least one section.')]);
      return true;
    }
    const sessionId: MockApi_HandleRequest_SessionId = readCookies(request)['dsb_session'] ?? '';
    if (consumeBackupGrant(body['grant'], sessionId, 'export') === false) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');
      return true;
    }
    const document: MockApi_HandleRequest_Document = createMockBackupDocument(selected, user);

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="discord-stonker-bot-export-${document['exportedAt'].slice(0, 10)}.json"`,
      'Content-Type': 'application/json',
    }).end(JSON.stringify(document));
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/imports/preview') {
    if (requireSession() === false || requirePermission('users:manage') === false) {
      return true;
    }
    const source: MockApi_HandleRequest_Source = parseMockBackupSource(body['source']);
    if (source === null) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('source', 'Choose a valid backup file.')]);
      return true;
    }
    try {
      sendJSON(response, 200, previewMockBackup(source, user, await loadModules()));
    } catch (error) {
      const message: MockApi_HandleRequest_Message = (error instanceof Error) ? error.message : 'This file is not a supported config.json.';

      sendError(response, (message.includes('another Discord server') === true) ? 409 : 422, 'backup_source_invalid', message);
    }
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/imports') {
    if (requireSession() === false || requirePermission('users:manage') === false) {
      return true;
    }
    const source: MockApi_HandleRequest_Source = parseMockBackupSource(body['source']);
    if (source === null) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('source', 'Choose a valid backup file.')]);
      return true;
    }
    const sessionId: MockApi_HandleRequest_SessionId = readCookies(request)['dsb_session'] ?? '';
    if (consumeBackupGrant(body['grant'], sessionId, 'import') === false) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');
      return true;
    }
    try {
      const result: MockApi_HandleRequest_Result = applyMockBackup(source, user, await loadModules());

      writeLog('web', 'info', 'backup_imported', {
        importedSections: result['importedSections'],
        source: source['type'],
        userId: user['id'],
        username: user['username'],
      });
      sendJSON(response, 200, result);
    } catch (error) {
      const message: MockApi_HandleRequest_Message = (error instanceof Error) ? error.message : 'This file could not be imported.';

      sendError(response, (message.includes('another Discord server') === true) ? 409 : 422, 'backup_source_invalid', message);
    }
    return true;
  }

  if (method === 'DELETE' && path === '/api/v1/auth/removed-secrets') {
    if (requireSession() === false) {
      return true;
    }

    removedSecrets = removedSecrets.filter((removedSecret) => ((removedSecret['kind'] === 'authenticator') ? removedSecret['userId'] !== user['id'] : permissionsOf(user).includes('configuration:write') === false));
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/logout') {
    sessions.delete(readCookies(request)['dsb_session'] ?? '');

    writeLog('web', 'info', 'sign_out', {
      userId: user['id'],
      username: user['username'],
    });
    sendEmpty(response);

    return true;
  }

  // Bot, servers, features, logs, and the invite page accept tokens with the right scope.
  const serverMatch: MockApi_HandleRequest_ServerMatch = path.match(new RegExp(serverPathPattern, 'u'));

  if (method === 'GET' && path === '/api/v1/servers') {
    if (requireScope('features:read') === false) {
      return true;
    }

    sendJSON(response, 200, {
      items: servers
        .filter((server) => serverVisible(user, server['id']))
        .map((server) => ({
          available: server['available'],
          enabledFeatures: [...statesFor(server['id']).values()].filter((state) => state['enabled']).length,
          iconUrl: server['iconUrl'],
          id: server['id'],
          name: server['name'],
        })),
    });

    return true;
  }

  if (serverMatch !== null) {
    const serverId: MockApi_HandleRequest_ServerId = decodeURIComponent(serverMatch[1] ?? '');
    const rest: MockApi_HandleRequest_Rest = serverMatch[2] ?? '';
    const server: MockApi_HandleRequest_Server = servers.find((candidate) => candidate['id'] === serverId);

    if (server === undefined || serverVisible(user, serverId) === false) {
      sendError(response, 404, 'server_not_found', 'That Discord server isn\'t available.');

      return true;
    }

    const modules: MockApi_HandleRequest_Modules = await loadModules();

    if (method === 'GET' && rest === '/resources') {
      if (requireScope('features:read') === false) {
        return true;
      }

      sendJSON(response, 200, {
        channels: channels[serverId] ?? [],
        roles: roles[serverId] ?? [],
      });

      return true;
    }

    if (method === 'GET' && rest === '/features') {
      if (requireScope('features:read') === false) {
        return true;
      }

      sendJSON(response, 200, { items: modules['catalog'].map((entry) => featureSummary(entry, serverId)) });

      return true;
    }

    const featureMatch: MockApi_HandleRequest_FeatureMatch = rest.match(new RegExp(featurePathPattern, 'u'));

    if (featureMatch !== null) {
      const entry: MockApi_HandleRequest_Entry = modules['catalog'].find((candidate) => candidate['key'] === decodeURIComponent(featureMatch[1] ?? ''));

      if (entry === undefined) {
        sendError(response, 404, 'feature_not_found', 'That feature doesn\'t exist.');

        return true;
      }

      const state: MockApi_HandleRequest_State = stateOf(serverId, entry['key']);
      const store: MockApi_HandleRequest_Store = secretsFor(serverId);

      /**
       * Mock API - Resolve.
       *
       * Centralizes this operation for the surrounding workflow.
       * Callers reuse one implementation instead of repeating the behavior.
       *
       * @returns {MockApi_HandleRequest_Resolve_Returns}
       *
       * @since 4.0.0
       */
      const resolve: MockApi_HandleRequest_Resolve = (key: MockApi_HandleRequest_Resolve_Key): MockApi_HandleRequest_Resolve_Returns => store.get(key);

      if (method === 'GET' && featureMatch[2] === undefined) {
        if (requireScope('features:read') === false) {
          return true;
        }

        sendJSON(response, 200, await featureDetail(entry, serverId));

        return true;
      }

      if (method === 'PUT' && featureMatch[2] === '/enabled') {
        if (requireScope('features:write') === false || requirePermission('configuration:write') === false) {
          return true;
        }

        if (typeof body['enabled'] !== 'boolean') {
          sendIssues(response, 422, 'invalid_request', [fieldIssue('enabled', 'Choose on or off.')]);

          return true;
        }

        if (body['enabled'] === true && state['configuration'] === null) {
          sendError(response, 409, 'feature_not_configured', 'Set up this feature before turning it on.');

          return true;
        }

        if (body['enabled'] === true && modules['validate'] !== null) {
          const issues: MockApi_HandleRequest_Issues = modules.validate(entry['key'], state['configuration'], resolve);

          if (issues.length > 0) {
            sendJSON(response, 422, {
              error: {
                code: 'invalid_request',
                issues,
                message: 'Fix this feature\'s settings before turning it on.',
              },
            });

            return true;
          }
        }

        if (state['enabled'] !== body['enabled']) {
          state.enabled = body['enabled'];
          writeLog('web', 'info', (state['enabled'] === true) ? 'feature_enabled' : 'feature_disabled', {
            featureKey: entry['key'],
            guildIdentifier: serverId,
            userId: user['id'],
            username: user['username'],
          });
          writeLog('bot', 'info', 'features_reloaded', { guildIdentifier: serverId }, 0);
        }

        sendJSON(response, 200, featureSummary(entry, serverId));

        return true;
      }

      if (method === 'PUT' && featureMatch[2] === undefined) {
        if (requireScope('features:write') === false || requirePermission('configuration:write') === false) {
          return true;
        }

        const unknownKeys: MockApi_HandleRequest_UnknownKeys = Object.keys(body).filter((key) => [
          'configuration',
          'expectedRevision',
          'secrets',
        ].includes(key) === false);

        if (unknownKeys.length > 0) {
          sendIssues(response, 422, 'invalid_request', unknownKeys.map((key) => fieldIssue(key, 'This field isn\'t accepted.')));

          return true;
        }

        if (body['expectedRevision'] !== state['revision']) {
          sendError(response, 409, 'revision_conflict', 'This feature changed since you opened it. Reload to see the latest version.');

          return true;
        }

        const configuration: MockApi_HandleRequest_Configuration = structuredClone(body['configuration']);
        const secretValues: MockApi_HandleRequest_SecretValues = (isRecord(body['secrets']) === true) ? body['secrets'] : {};
        const freshSecrets: MockApi_HandleRequest_FreshSecrets = new Map();
        const issues: MockApi_HandleRequest_Issues = [];

        for (const secretValue of Object.entries(secretValues)) {
          const pointer: MockApi_HandleRequest_Pointer = secretValue[0];
          const plaintext: MockApi_HandleRequest_Plaintext = secretValue[1];
          const node: MockApi_HandleRequest_Node = readPointer(configuration, pointer);

          // An empty value keeps the secret that is already saved.
          if (plaintext === '') {
            continue;
          }

          if (
            isRecord(node) === false
            || typeof node['$secret'] !== 'string'
            || typeof plaintext !== 'string'
          ) {
            issues.push({
              field: `secrets.${pointer}`,
              message: 'This isn\'t a secret field.',
              path: [
                'secrets',
                pointer,
              ],
            });

            continue;
          }

          // A new value always gets a fresh key, so copies never share a secret by accident.
          const key: MockApi_HandleRequest_Key = `${entry['key']}.${randomBytes(6).toString('hex')}`;

          Reflect.set(node, '$secret', key);

          freshSecrets.set(key, plaintext);
        }

        for (const reference of collectReferences(configuration)) {
          if (freshSecrets.has(reference['key']) === false && store.has(reference['key']) === false) {
            issues.push({
              field: [
                'configuration',
                ...reference['path'],
              ].join('.'),
              message: 'Enter this secret.',
              path: [
                'configuration',
                ...reference['path'],
              ],
            });
          }
        }

        if (issues.length === 0 && modules['validate'] !== null) {
          issues.push(...modules.validate(entry['key'], configuration, (key) => freshSecrets.get(key) ?? store.get(key)));
        }

        if (
          issues.length === 0
          && (
            configuration === null
            || configuration === undefined
          )
        ) {
          issues.push(fieldIssue('configuration', 'Add the settings this feature needs.'));
        }

        if (issues.length > 0) {
          sendIssues(response, 422, 'invalid_request', issues);

          return true;
        }

        for (const freshSecret of freshSecrets) {
          store.set(freshSecret[0], freshSecret[1]);
        }

        state.configuration = configuration;
        state.revision += 1;
        state.updatedAt = nowIso();

        // Secrets no feature of this server points at any more are deleted.
        const referenced: MockApi_HandleRequest_Referenced = new Set([...statesFor(serverId).values()].flatMap((candidate) => collectReferences(candidate['configuration']).map((reference) => reference['key'])));

        for (const key of [...store.keys()]) {
          if (referenced.has(key) === false) {
            store.delete(key);
          }
        }

        removedSecrets = removedSecrets.filter((removedSecret) => (
          removedSecret['kind'] !== 'feature-secrets'
          || removedSecret['serverId'] !== serverId
          || removedSecret['featureKey'] !== entry['key']
        ));
        writeLog('web', 'info', 'feature_saved', {
          featureKey: entry['key'],
          guildIdentifier: serverId,
          revision: state['revision'],
          userId: user['id'],
          username: user['username'],
        });

        if (state['enabled'] === true) {
          writeLog('bot', 'info', 'features_reloaded', { guildIdentifier: serverId });
        }

        sendJSON(response, 200, await featureDetail(entry, serverId));

        return true;
      }
    }

    if (method === 'GET' && rest === '/invite-page') {
      if (requireScope('features:read') === false) {
        return true;
      }

      sendJSON(response, 200, designerResponse(server, `http://${request.headers.host ?? 'localhost:5175'}`));

      return true;
    }

    if (method === 'PUT' && rest === '/invite-page') {
      if (requireScope('features:write') === false || requirePermission('configuration:write') === false) {
        return true;
      }

      const page: MockApi_HandleRequest_Page = invitePageFor(server);
      const issues: MockApi_HandleRequest_Issues = [];

      /**
       * Mock API - Text.
       *
       * Centralizes this operation for the surrounding workflow.
       * Callers reuse one implementation instead of repeating the behavior.
       *
       * @returns {MockApi_HandleRequest_Text_Returns}
       *
       * @since 4.0.0
       */
      const text: MockApi_HandleRequest_Text = (key: MockApi_HandleRequest_Text_Key): MockApi_HandleRequest_Text_Returns => ((typeof body[key] === 'string') ? String(body[key]).trim() : '');
      const allowed: MockApi_HandleRequest_Allowed = [
        'accentColor',
        'bannerImageId',
        'buttonLabel',
        'description',
        'expectedRevision',
        'footerText',
        'logo',
        'logoImageId',
        'showBoostTier',
        'showMemberCount',
        'theme',
        'title',
      ];

      for (const key of Object.keys(body).filter((candidate) => allowed.includes(candidate) === false)) {
        issues.push(fieldIssue(key, 'This field isn\'t accepted.'));
      }

      if (new RegExp(hexColorPattern, 'iu').test(text('accentColor')) === false) {
        issues.push(fieldIssue('accentColor', 'Use a hex color like #6250d9.'));
      }

      if (text('title') === '') {
        issues.push(fieldIssue('title', 'Add a title.'));
      } else if (text('title').length > 100) {
        issues.push(fieldIssue('title', 'Use 100 characters or fewer.'));
      }

      if (text('description').length > 300) {
        issues.push(fieldIssue('description', 'Use 300 characters or fewer.'));
      }

      if (text('buttonLabel') === '') {
        issues.push(fieldIssue('buttonLabel', 'Add a button label.'));
      } else if (text('buttonLabel').length > 40) {
        issues.push(fieldIssue('buttonLabel', 'Use 40 characters or fewer.'));
      }

      if (text('footerText').length > 500) {
        issues.push(fieldIssue('footerText', 'Use 500 characters or fewer.'));
      }

      const logo: MockApi_HandleRequest_Logo = body['logo'];
      const theme: MockApi_HandleRequest_Theme = body['theme'];
      const logoImageId: MockApi_HandleRequest_LogoImageId = (typeof body['logoImageId'] === 'string') ? body['logoImageId'] : null;
      const bannerImageId: MockApi_HandleRequest_BannerImageId = (typeof body['bannerImageId'] === 'string') ? body['bannerImageId'] : null;

      if (
        logo !== 'custom'
        && logo !== 'none'
        && logo !== 'server'
      ) {
        issues.push(fieldIssue('logo', 'Choose the server icon, an uploaded logo, or no logo.'));
      }

      if (
        theme !== 'dark'
        && theme !== 'light'
        && theme !== 'system'
      ) {
        issues.push(fieldIssue('theme', 'Choose System, Light, or Dark.'));
      }

      if (logo === 'custom' && logoImageId === null) {
        issues.push(fieldIssue('logoImageId', 'Upload a logo, or choose another logo option.'));
      }

      for (const imageCheck of [
        [
          'logoImageId',
          (logo === 'custom') ? logoImageId : null,
        ],
        [
          'bannerImageId',
          bannerImageId,
        ],
      ] as MockApi_HandleRequest_ImageChecks) {
        const field: MockApi_HandleRequest_Field = imageCheck[0];
        const imageId: MockApi_HandleRequest_ImageId = imageCheck[1];

        if (imageId !== null) {
          const image: MockApi_HandleRequest_Image = images.get(imageId);

          if (image === undefined || image['serverId'] !== serverId) {
            issues.push(fieldIssue(field, 'That image isn\'t available. Upload it again.'));
          }
        }
      }

      if (typeof body['showMemberCount'] !== 'boolean') {
        issues.push(fieldIssue('showMemberCount', 'Choose whether to show the member count.'));
      }

      if (typeof body['showBoostTier'] !== 'boolean') {
        issues.push(fieldIssue('showBoostTier', 'Choose whether to show the boost level.'));
      }

      if (issues.length > 0) {
        sendIssues(response, 422, 'invalid_request', issues);

        return true;
      }

      if (body['expectedRevision'] !== page['revision']) {
        sendError(response, 409, 'revision_conflict', 'The invite page changed since you opened it. Reload to see the latest version.');

        return true;
      }

      invitePages.set(serverId, {
        accentColor: text('accentColor').toLowerCase(),
        bannerImageId,
        buttonLabel: text('buttonLabel'),
        description: text('description'),
        footerText: text('footerText'),
        logo: logo as MockApi_HandleRequest_PageLogo,
        logoImageId: (logo === 'custom') ? logoImageId : null,
        revision: page['revision'] + 1,
        showBoostTier: body['showBoostTier'] === true,
        showMemberCount: body['showMemberCount'] === true,
        theme: theme as MockApi_HandleRequest_PageTheme,
        title: text('title'),
        updatedAt: nowIso(),
      });

      writeLog('web', 'info', 'invite_page_saved', {
        guildIdentifier: serverId,
        userId: user['id'],
        username: user['username'],
      });
      sendJSON(response, 200, designerResponse(server, `http://${request.headers.host ?? 'localhost:5175'}`));

      return true;
    }

    if (method === 'POST' && rest === '/invite-page/images') {
      if (requireScope('features:write') === false || requirePermission('configuration:write') === false) {
        return true;
      }

      const contentTypeHeader: MockApi_HandleRequest_ContentTypeHeader = String(request.headers['content-type'] ?? '').split(';')[0];
      const contentType: MockApi_HandleRequest_ContentType = (contentTypeHeader !== undefined) ? contentTypeHeader.trim().toLowerCase() : '';
      const signatures: MockApi_HandleRequest_Signatures = {
        'image/gif': (data) => data.subarray(0, 4).toString('latin1') === 'GIF8',
        'image/jpeg': (data) => data.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex')),
        'image/png': (data) => data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')),
        'image/webp': (data) => data.subarray(0, 4).toString('latin1') === 'RIFF' && data.subarray(8, 12).toString('latin1') === 'WEBP',
      };
      const signature: MockApi_HandleRequest_Signature = signatures[contentType];

      if (raw.length > 2 * 1024 * 1024) {
        sendError(response, 413, 'payload_too_large', 'Upload an image of 2 MB or less.');

        return true;
      }

      if (
        signature === undefined
        || raw.length === 0
        || signature(raw) === false
      ) {
        sendError(response, 415, 'unsupported_image', 'Upload a PNG, JPEG, WebP, or GIF image.');

        return true;
      }

      const imageId: MockApi_HandleRequest_NewImageId = randomUUID();

      images.set(imageId, {
        contentType,
        data: raw,
        serverId,
      });

      sendJSON(response, 201, {
        id: imageId,
        url: `/media/${imageId}`,
      });

      return true;
    }

    sendError(response, 404, 'not_found', 'No route matches this request.');

    return true;
  }

  if (method === 'GET' && path === '/api/v1/bot') {
    if (requireScope('bot:control') === false) {
      return true;
    }

    sendJSON(response, 200, botResource());

    return true;
  }

  if (method === 'POST' && path === '/api/v1/bot/actions') {
    if (requireScope('bot:control') === false || requirePermission('bot:control') === false) {
      return true;
    }

    const action: MockApi_HandleRequest_Action = body['action'];

    if (
      action !== 'restart'
      && action !== 'start'
      && action !== 'stop'
    ) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('action', 'Choose start, stop, or restart.')]);

      return true;
    }

    if (action !== 'stop' && bot['tokenConfigured'] === false) {
      sendError(response, 409, 'bot_token_required', 'Add the Discord bot token before starting the bot.');

      return true;
    }

    writeLog('web', 'info', 'bot_action_requested', {
      action,
      userId: user['id'],
      username: user['username'],
    });

    if (action === 'stop') {
      bot.desiredState = 'stopped';
      setBotStatus('stopped', 0, null);
      writeLog('bot', 'info', 'gateway_closed', { reason: 'stop requested' });
    } else {
      bot.desiredState = 'running';
      setBotStatus('starting', 3_000, 'ready');
      writeLog('bot', 'info', 'gateway_connecting', { shard: 0 });
    }

    sendJSON(response, 202, { desiredState: bot['desiredState'] });

    return true;
  }

  if (method === 'PUT' && path === '/api/v1/bot/token') {
    if (requireSession() === false || requirePermission('configuration:write') === false) {
      return true;
    }

    const token: MockApi_HandleRequest_Token = (typeof body['token'] === 'string') ? body['token'].trim() : '';

    if (token === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('token', 'Enter the bot token.')]);

      return true;
    }

    if (token.length > 512) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('token', 'Use 512 characters or fewer.')]);

      return true;
    }

    bot.tokenConfigured = true;
    bot.resolution = null;
    removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['kind'] !== 'bot-token');
    writeLog('web', 'info', 'bot_token_saved', {
      userId: user['id'],
      username: user['username'],
    });
    sendEmpty(response);

    return true;
  }

  if (
    method === 'GET'
    && (
      path === '/api/v1/logs'
      || path === '/api/v1/logs/stream'
    )
  ) {
    if (requireScope('logs:read') === false) {
      return true;
    }

    const component: MockApi_HandleRequest_Component = url.searchParams.get('component') ?? 'bot';
    const minimumLevel: MockApi_HandleRequest_MinimumLevel = (levelOrder.includes(url.searchParams.get('level') as MockApi_HandleRequest_LevelParam) === true) ? url.searchParams.get('level') as MockApi_HandleRequest_LevelParam : 'debug';
    const search: MockApi_HandleRequest_Search = (url.searchParams.get('q') ?? '').trim();
    const after: MockApi_HandleRequest_After = url.searchParams.get('after');
    const matching: MockApi_HandleRequest_Matching = logs.filter((entry) => matchesLogFilters(entry, component, minimumLevel, search));

    if (path === '/api/v1/logs') {
      const items: MockApi_HandleRequest_Items = (after === null) ? matching.slice(-200) : matching.filter((entry) => Number(entry['id']) > Number(after)).slice(0, 200);
      const lastItem: MockApi_HandleRequest_LastItem = items.at(-1);

      sendJSON(response, 200, {
        cursor: (lastItem !== undefined) ? lastItem['id'] : after,
        items,
      });

      return true;
    }

    const lastMatching: MockApi_HandleRequest_LastMatching = matching.at(-1);
    const lastMatchingId: MockApi_HandleRequest_LastMatchingId = (lastMatching !== undefined) ? lastMatching['id'] : '0';
    const cursorStart: MockApi_HandleRequest_CursorStart = (
      request.headers['last-event-id']
      ?? after
      ?? lastMatchingId
    );
    let cursor: MockApi_HandleRequest_Cursor = Number(cursorStart);

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
    });

    response.write('retry: 3000\n\n');

    const poll: MockApi_HandleRequest_Poll = setInterval(() => {
      for (const entry of logs.filter((candidate) => Number(candidate['id']) > cursor && matchesLogFilters(candidate, component, minimumLevel, search))) {
        response.write([
          `id: ${entry['id']}`,
          'event: log',
          `data: ${JSON.stringify(entry)}`,
          '',
          '',
        ].join('\n'));
        cursor = Number(entry['id']);
      }

      return;
    }, 1_000);
    const keepAlive: MockApi_HandleRequest_KeepAlive = setInterval(() => {
      response.write(': keep-alive\n\n');

      return;
    }, 15_000);

    request.on('close', () => {
      clearInterval(poll);
      clearInterval(keepAlive);

      return;
    });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/diagnostics') {
    if (requireScope('logs:read') === false) {
      return true;
    }

    sendJSON(response, 200, { debugLogging });

    return true;
  }

  if (method === 'PUT' && path === '/api/v1/diagnostics') {
    if (requireSession() === false || requirePermission('bot:control') === false) {
      return true;
    }

    const requested: MockApi_HandleRequest_Requested = body['debugLogging'];

    if (typeof requested !== 'boolean' || Object.keys(body).length !== 1) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('debugLogging', 'Choose on or off.')]);

      return true;
    }

    if (requested !== debugLogging) {
      debugLogging = requested;

      // The control panel changes at once, and the bot and the worker follow on their next check.
      writeLog('web', 'info', (requested === true) ? 'debug_logging_on' : 'debug_logging_off', {
        userId: user['id'],
        username: user['username'],
      });
      writeLog('bot', 'info', (requested === true) ? 'debug_logging_on' : 'debug_logging_off');
      writeLog('worker', 'info', (requested === true) ? 'debug_logging_on' : 'debug_logging_off');
    }

    sendJSON(response, 200, { debugLogging });

    return true;
  }

  // Everything below works only from a signed-in browser.
  if (requireSession() === false) {
    return true;
  }

  if (method === 'GET' && path === '/api/v1/auth/security') {
    sendJSON(response, 200, {
      hostname: url.hostname,
      passkeys: passkeysByUser.get(user['id']) ?? [],
      passkeysAvailable: true,
      recoveryCodesRemaining: user['recoveryCodes'].length,
      role: user['role'],
      totpEnabled: user['totpEnabled'],
      username: user['username'],
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/password') {
    if (checkPassword('currentPassword') === false) {
      return true;
    }

    if (passwordIssue(body['newPassword']) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('newPassword', passwordIssue(body['newPassword']))]);

      return true;
    }

    user.password = String(body['newPassword']);
    writeLog('web', 'info', 'password_changed', {
      userId: user['id'],
      username: user['username'],
    });
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/username') {
    const nextUsername: MockApi_HandleRequest_NextUsername = String(body['username'] ?? '').trim();
    const nextUsernameIssue: MockApi_HandleRequest_NextUsernameIssue = usernameIssue(nextUsername);

    if (nextUsernameIssue !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', nextUsernameIssue)]);

      return true;
    }

    if (checkPassword() === false) {
      return true;
    }

    if (users.some((candidate) => candidate['id'] !== user['id'] && candidate['username'].toLowerCase() === nextUsername.toLowerCase()) === true) {
      sendIssues(response, 409, 'username_taken', [fieldIssue('username', 'That username is already in use.')]);

      return true;
    }

    user.username = nextUsername;
    writeLog('web', 'info', 'username_changed', {
      userId: user['id'],
      username: user['username'],
    });
    sendJSON(response, 200, {
      user: {
        id: user['id'],
        role: user['role'],
        username: user['username'],
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/setup') {
    if (checkPassword() === false) {
      return true;
    }

    if (user['totpEnabled'] === true) {
      sendError(response, 409, 'totp_enabled', 'The authenticator app is already on.');

      return true;
    }

    // A new random secret with the same URI and QR code options as the real server, so the code
    // scans. The mock still accepts 123456 as the code.
    const totpSecret: MockApi_HandleRequest_TotpSecret = new Secret({ size: 20 });
    const totpUri: MockApi_HandleRequest_TotpUri = new TOTP({
      algorithm: 'SHA1',
      digits: 6,
      issuer: 'Stonker Bot for Discord',
      label: user['username'],
      period: 30,
      secret: totpSecret,
    }).toString();

    user.totpPending = true;
    sendJSON(response, 200, {
      expiresAt: new Date(Date.now() + (10 * minute)).toISOString(),
      qrCode: await toDataURL(totpUri, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 240,
      }),
      secret: totpSecret.base32,
      uri: totpUri,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/enable') {
    if (user['totpPending'] === false) {
      sendError(response, 409, 'totp_setup_expired', 'Authenticator setup expired. Start again.');

      return true;
    }

    if (body['code'] !== '123456') {
      sendIssues(response, 422, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Check the time on your device and try again. In the mock, use 123456.')]);

      return true;
    }

    user.totpEnabled = true;
    user.totpPending = false;
    user.recoveryCodes = newRecoveryCodes();
    removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['kind'] !== 'authenticator' || removedSecret['userId'] !== user['id']);
    writeLog('web', 'info', 'totp_enabled', {
      userId: user['id'],
      username: user['username'],
    });
    sendJSON(response, 200, { recoveryCodes: user['recoveryCodes'] });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/disable') {
    if (checkPassword() === false) {
      return true;
    }

    if (user['totpEnabled'] === false) {
      sendError(response, 409, 'totp_disabled', 'The authenticator app is already off.');

      return true;
    }

    user.totpEnabled = false;
    user.recoveryCodes = [];
    writeLog('web', 'info', 'totp_disabled', {
      userId: user['id'],
      username: user['username'],
    });
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/recovery-codes') {
    if (checkPassword() === false) {
      return true;
    }

    if (user['totpEnabled'] === false) {
      sendError(response, 409, 'totp_disabled', 'Turn on the authenticator app first.');

      return true;
    }

    user.recoveryCodes = newRecoveryCodes();
    writeLog('web', 'info', 'recovery_codes_replaced', {
      userId: user['id'],
      username: user['username'],
    });
    sendJSON(response, 200, { recoveryCodes: user['recoveryCodes'] });

    return true;
  }

  // Adding a passkey runs the browser's real prompt; the mock saves whatever answer comes back.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/options') {
    const passkeyName: MockApi_HandleRequest_PasskeyName = (typeof body['name'] === 'string') ? body['name'].trim() : '';

    if (passkeyName === '' || [...passkeyName].length > 80) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', (passkeyName === '') ? 'Name this passkey.' : 'Use 80 characters or fewer.')]);

      return true;
    }

    if (checkPassword() === false) {
      return true;
    }

    const ceremonyId: MockApi_HandleRequest_CeremonyId = randomBytes(16).toString('base64url');

    passkeyCeremonies.set(ceremonyId, passkeyName);

    sendJSON(response, 200, {
      ceremonyId,
      options: {
        attestation: 'none',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
        },
        challenge: randomBytes(32).toString('base64url'),
        excludeCredentials: [],
        pubKeyCredParams: [
          {
            alg: -7,
            type: 'public-key',
          },
          {
            alg: -257,
            type: 'public-key',
          },
        ],
        rp: {
          id: url.hostname,
          name: 'Stonker Bot',
        },
        timeout: 300000,
        user: {
          displayName: user['username'],
          id: Buffer.from(user['id']).toString('base64url'),
          name: user['username'],
        },
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/verify') {
    const ceremonyId: MockApi_HandleRequest_CeremonyId = (typeof body['ceremonyId'] === 'string') ? body['ceremonyId'] : '';
    const passkeyName: MockApi_HandleRequest_PendingPasskeyName = passkeyCeremonies.get(ceremonyId);

    if (passkeyName === undefined) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return true;
    }

    const passkey: MockApi_HandleRequest_Passkey = {
      createdAt: new Date().toISOString(),
      hostname: url.hostname,
      id: `pk-${randomBytes(12).toString('base64url')}`,
      lastUsedAt: null,
      name: passkeyName,
    };

    passkeyCeremonies.delete(ceremonyId);

    passkeysByUser.set(user['id'], [
      ...(passkeysByUser.get(user['id']) ?? []),
      passkey,
    ]);

    sendJSON(response, 201, passkey);

    return true;
  }

  if (method === 'DELETE' && path.startsWith('/api/v1/auth/passkeys/') === true) {
    const passkeyId: MockApi_HandleRequest_PasskeyId = decodeURIComponent(path.slice('/api/v1/auth/passkeys/'.length));
    const saved: MockApi_HandleRequest_Saved = passkeysByUser.get(user['id']) ?? [];

    if (saved.some((passkey) => passkey['id'] === passkeyId) === false) {
      sendError(response, 404, 'passkey_not_found', 'That passkey no longer exists.');

      return true;
    }

    if (checkPassword() === false) {
      return true;
    }

    passkeysByUser.set(user['id'], saved.filter((passkey) => passkey['id'] !== passkeyId));

    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications/events') {
    if (requireSession() === false || requirePermission('configuration:write') === false) {
      return true;
    }

    sendJSON(response, 200, { items: notificationEvents });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications') {
    if (requireSession() === false || requirePermission('configuration:write') === false) {
      return true;
    }

    sendJSON(response, 200, { items: [...notifications].sort((left, right) => right['createdAt'].localeCompare(left['createdAt'])) });

    return true;
  }

  // notificationInput checks a create or edit body like the server, sending the first problem.

  /**
   * Mock API - Notification Input.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_NotificationInput_Returns}
   *
   * @since 4.0.0
   */
  const notificationInput: MockApi_HandleRequest_NotificationInput = (existing: MockApi_HandleRequest_NotificationInput_Existing): MockApi_HandleRequest_NotificationInput_Returns => {
    const service: MockApi_HandleRequest_NotificationInput_Service = (existing !== null) ? existing['service'] : body['service'] as MockApi_HandleRequest_NotificationInput_Service;
    const name: MockApi_HandleRequest_NotificationInput_Name = (typeof body['name'] === 'string') ? body['name'].trim() : '';
    const events: MockApi_HandleRequest_NotificationInput_Events = (Array.isArray(body['events']) === true) ? body['events'] as MockApi_HandleRequest_NotificationInput_Events : [];
    const values: MockApi_HandleRequest_NotificationInput_Values = (typeof body['settings'] === 'object' && body['settings'] !== null) ? body['settings'] as MockApi_HandleRequest_NotificationInput_Values : {};

    if (notificationFields[service] === undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('service', 'Choose a service.')]);

      return null;
    }

    if (name === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Name this notification.')]);

      return null;
    }

    if (events.length === 0) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('events', 'Choose at least one event.')]);

      return null;
    }

    const settings: MockApi_HandleRequest_NotificationInput_Settings = {};
    const secrets: MockApi_HandleRequest_NotificationInput_Secrets = { ...((existing !== null) ? existing['secrets'] : {}) };

    for (const notificationField of notificationFields[service]) {
      const key: MockApi_HandleRequest_NotificationInput_Key = notificationField[0];
      const missing: MockApi_HandleRequest_NotificationInput_Missing = notificationField[1];
      const secret: MockApi_HandleRequest_NotificationInput_Secret = notificationField[2];
      const required: MockApi_HandleRequest_NotificationInput_Required = notificationField[3];
      const value: MockApi_HandleRequest_NotificationInput_Value = (typeof values[key] === 'string') ? (values[key]).trim() : '';
      const saved: MockApi_HandleRequest_NotificationInput_Saved = (
        secret === true
        && existing !== null
        && existing['secrets'][key] === true
      );

      if (
        value === ''
        && required === true
        && saved === false
      ) {
        sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${key}`, missing)]);

        return null;
      }

      if (value !== '' && secret === true) {
        Reflect.set(secrets, key, true);
      } else if (value !== '') {
        Reflect.set(settings, key, value);
      }
    }

    // Optional secrets that are saved, or missing after a lost key, can be cleared once each, never alongside a new value.
    const clearable: MockApi_HandleRequest_NotificationInput_Clearable = notificationFields[service]
      .filter((field) => (
        field[2] === true
        && field[3] === false
        && existing !== null
        && (
          existing['secrets'][field[0]] === true
          || existing['secretsMissing'].includes(field[0])
        )
      ))
      .map((field) => field[0]);
    const clearSecrets: MockApi_HandleRequest_NotificationInput_ClearSecrets = (Array.isArray(body['clearSecrets']) === true) ? body['clearSecrets'] : [];
    const invalidIndex: MockApi_HandleRequest_NotificationInput_InvalidIndex = clearSecrets.findIndex((key) => typeof key !== 'string' || clearable.includes(key) === false);

    if (body['clearSecrets'] !== undefined && Array.isArray(body['clearSecrets']) === false) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose an optional saved secret.')]);

      return null;
    }

    if (invalidIndex !== -1) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`clearSecrets.${invalidIndex}`, 'Choose an optional saved secret.')]);

      return null;
    }

    if (new Set(clearSecrets).size !== clearSecrets.length) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose each secret only once.')]);

      return null;
    }

    const replaced: MockApi_HandleRequest_NotificationInput_Replaced = (clearSecrets as MockApi_HandleRequest_NotificationInput_ClearSecretKeys).find((key) => typeof values[key] === 'string' && (values[key]).trim() !== '');

    if (replaced !== undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${replaced}`, 'Enter a new value or clear this field, not both.')]);

      return null;
    }

    for (const key of clearSecrets as MockApi_HandleRequest_NotificationInput_ClearSecretKeys) {
      Reflect.deleteProperty(secrets, key);
    }

    const existingId: MockApi_HandleRequest_NotificationInput_ExistingId = (existing !== null) ? existing['id'] : undefined;

    if (notifications.some((notification) => notification['id'] !== existingId && notification['name'].toLowerCase() === name.toLowerCase()) === true) {
      sendIssues(response, 409, 'notification_exists', [fieldIssue('name', 'A notification with this name already exists.')]);

      return null;
    }

    return {
      clearSecrets: clearSecrets as MockApi_HandleRequest_NotificationInput_ClearSecretKeys,
      events,
      name,
      secrets,
      service,
      settings,
    };
  };

  if (method === 'POST' && path === '/api/v1/notifications') {
    if (requireSession() === false || requirePermission('configuration:write') === false) {
      return true;
    }

    const input: MockApi_HandleRequest_NotificationInputValue = notificationInput(null);

    if (input === null) {
      return true;
    }

    const notification: MockApi_HandleRequest_Notification = {
      events: input['events'],
      name: input['name'],
      secrets: input['secrets'],
      service: input['service'],
      settings: input['settings'],
      createdAt: new Date().toISOString(),
      id: `ntf-${randomBytes(8).toString('hex')}`,
      lastAttemptAt: null,
      lastError: null,
      secretsMissing: [],
      updatedAt: new Date().toISOString(),
    };

    notifications.push(notification);

    writeLog('web', 'info', 'notification_created', {
      notificationId: notification['id'],
      notificationName: notification['name'],
      service: notification['service'],
      userId: user['id'],
      username: user['username'],
    });
    sendJSON(response, 201, notification);

    return true;
  }

  const notificationMatch: MockApi_HandleRequest_NotificationMatch = path.match(new RegExp(notificationPathPattern, 'u'));

  if (notificationMatch !== null) {
    if (requireSession() === false || requirePermission('configuration:write') === false) {
      return true;
    }

    const index: MockApi_HandleRequest_Index = notifications.findIndex((notification) => notification['id'] === notificationMatch[1]);
    const notification: MockApi_HandleRequest_FoundNotification = notifications[index];

    if (notification === undefined) {
      sendError(response, 404, 'notification_not_found', 'That notification no longer exists.');

      return true;
    }

    if (method === 'POST' && notificationMatch[2] === '/test') {
      if (notification['secretsMissing'].length > 0) {
        sendJSON(response, 200, {
          delivered: false,
          message: 'Enter the removed secrets again first.',
        });

        return true;
      }

      notification.lastAttemptAt = new Date().toISOString();
      notification.lastError = null;
      sendJSON(response, 200, { delivered: true });

      return true;
    }

    if (method === 'DELETE') {
      notifications.splice(index, 1);
      removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['notificationId'] !== notification['id']);
      writeLog('web', 'info', 'notification_removed', {
        notificationId: notification['id'],
        notificationName: notification['name'],
        userId: user['id'],
        username: user['username'],
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'PUT') {
      const input: MockApi_HandleRequest_NotificationInputValue = notificationInput(notification);

      if (input === null) {
        return true;
      }

      notification.events = input['events'];
      notification.name = input['name'];
      notification.secrets = input['secrets'];

      // A missing secret is settled by entering it again or, when optional, by clearing it.
      notification.secretsMissing = notification['secretsMissing'].filter((key) => input['secrets'][key] !== true && input['clearSecrets'].includes(key) === false);
      notification.settings = input['settings'];
      notification.updatedAt = new Date().toISOString();

      if (notification['secretsMissing'].length === 0) {
        removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['notificationId'] !== notification['id']);
      }

      writeLog('web', 'info', 'notification_updated', {
        notificationId: notification['id'],
        notificationName: notification['name'],
        userId: user['id'],
        username: user['username'],
      });
      sendJSON(response, 200, notification);

      return true;
    }
  }

  if (method === 'GET' && path === '/api/v1/auth/tokens') {
    sendJSON(response, 200, {
      items: tokens
        .filter((token) => token['userId'] === user['id'])
        .sort((left, right) => right['createdAt'].localeCompare(left['createdAt']))
        .map(tokenResource),
    });

    return true;
  }

  // tokenInput reads and checks a create or edit body, sending the first problem it finds.

  /**
   * Mock API - Token Input.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @returns {MockApi_HandleRequest_TokenInput_Returns}
   *
   * @since 4.0.0
   */
  const tokenInput: MockApi_HandleRequest_TokenInput = (exceptId: MockApi_HandleRequest_TokenInput_ExceptId): MockApi_HandleRequest_TokenInput_Returns => {
    const name: MockApi_HandleRequest_TokenInput_Name = (typeof body['name'] === 'string') ? body['name'].trim() : '';
    const scopes: MockApi_HandleRequest_TokenInput_Scopes = (Array.isArray(body['scopes']) === true) ? body['scopes'] as MockApi_HandleRequest_TokenInput_Scopes : [];
    const grantable: MockApi_HandleRequest_TokenInput_Grantable = (user['role'] === 'viewer') ? [
      'features:read',
      'logs:read',
    ] : scopeOrder;

    if (name === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Name this token.')]);

      return null;
    }

    if (name.length > 80) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Use 80 characters or fewer.')]);

      return null;
    }

    if (scopes.length === 0) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('scopes', 'Choose at least one scope.')]);

      return null;
    }

    if (scopes.some((scope) => scopeOrder.includes(scope) === false) === true) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('scopes', `Choose from: ${scopeOrder.join(', ')}.`)]);

      return null;
    }

    const ungrantable: MockApi_HandleRequest_TokenInput_Ungrantable = scopes.find((scope) => grantable.includes(scope) === false);

    if (ungrantable !== undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('scopes', `Your role can't grant ${ungrantable}.`)]);

      return null;
    }

    if (tokens.some((token) => (
      token['userId'] === user['id']
      && token['id'] !== exceptId
      && token['name'].toLowerCase() === name.toLowerCase()
    )) === true) {
      sendIssues(response, 409, 'token_exists', [fieldIssue('name', 'A token with this name already exists.')]);

      return null;
    }

    return {
      name,
      scopes: scopeOrder.filter((scope) => scopes.includes(scope)),
    };
  };

  if (method === 'POST' && path === '/api/v1/auth/tokens') {
    const input: MockApi_HandleRequest_TokenInputValue = tokenInput('');

    if (input === null) {
      return true;
    }

    const plaintext: MockApi_HandleRequest_TokenPlaintext = `dsb_${randomBytes(32).toString('base64url')}`;
    const token: MockApi_HandleRequest_NewToken = {
      createdAt: nowIso(),
      expiresAt: (typeof body['expiresAt'] === 'string') ? body['expiresAt'] : null,
      hash: digest(plaintext),
      id: `tok-${randomBytes(8).toString('hex')}`,
      lastUsedAt: null,
      name: input['name'],
      scopes: input['scopes'],
      userId: user['id'],
    };

    tokens.push(token);

    writeLog('web', 'info', 'token_created', {
      name: token['name'],
      userId: user['id'],
      username: user['username'],
    });
    sendJSON(response, 201, {
      plaintext,
      token: tokenResource(token),
    });

    return true;
  }

  const tokenMatch: MockApi_HandleRequest_TokenMatch = path.match(new RegExp(tokenPathPattern, 'u'));

  if (tokenMatch !== null) {
    const index: MockApi_HandleRequest_Index = tokens.findIndex((token) => token['id'] === tokenMatch[1] && token['userId'] === user['id']);
    const token: MockApi_HandleRequest_FoundToken = tokens[index];

    if (token === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return true;
    }

    if (method === 'DELETE') {
      tokens.splice(index, 1);

      writeLog('web', 'info', 'token_revoked', {
        name: token['name'],
        userId: user['id'],
        username: user['username'],
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'PUT') {
      const input: MockApi_HandleRequest_TokenInputValue = tokenInput(token['id']);

      if (input === null) {
        return true;
      }

      token.name = input['name'];
      token.scopes = input['scopes'];

      if (body['expiresAt'] !== undefined) {
        token.expiresAt = (typeof body['expiresAt'] === 'string') ? body['expiresAt'] : null;
      }

      writeLog('web', 'info', 'token_updated', {
        name: token['name'],
        userId: user['id'],
        username: user['username'],
      });
      sendJSON(response, 200, tokenResource(token));

      return true;
    }
  }

  if (path === '/api/v1/users' || path.startsWith('/api/v1/users/') === true) {
    if (requirePermission('users:manage') === false) {
      return true;
    }

    // accessInput checks the role and server access a create or edit gives.

    /**
     * Mock API - Access Input.
     *
     * Stores this module-level value in one named location.
     * Related code reuses it instead of duplicating the definition.
     *
     * @returns {MockApi_HandleRequest_AccessInput_Returns}
     *
     * @since 4.0.0
     */
    const accessInput: MockApi_HandleRequest_AccessInput = (): MockApi_HandleRequest_AccessInput_Returns => {
      const role: MockApi_HandleRequest_AccessInput_Role = body['role'];
      const allServers: MockApi_HandleRequest_AccessInput_AllServers = body['allServers'] === true;
      const serverIds: MockApi_HandleRequest_AccessInput_ServerIds = (Array.isArray(body['serverIds']) === true) ? body['serverIds'].map(String) : [];
      const issues: MockApi_HandleRequest_AccessInput_Issues = [];

      if (
        role !== 'administrator'
        && role !== 'operator'
        && role !== 'viewer'
      ) {
        issues.push(fieldIssue('role', 'Choose administrator, operator, or viewer.'));
      }

      if (allServers === true && user['allServers'] === false) {
        issues.push(fieldIssue('allServers', 'You can only give access to servers you can see.'));
      }

      if (allServers === false && serverIds.length === 0) {
        issues.push(fieldIssue('serverIds', 'Choose at least one server.'));
      }

      if (
        allServers === false
        && user['allServers'] === false
        && serverIds.some((serverId) => user['serverIds'].includes(serverId) === false) === true
      ) {
        issues.push(fieldIssue('serverIds', 'You can only give access to servers you can see.'));
      }

      if (issues.length > 0) {
        sendIssues(response, 422, 'invalid_request', issues);

        return null;
      }

      return {
        allServers,
        role: role as MockApi_HandleRequest_AccessInput_AccessRole,
        serverIds: (allServers === true) ? [] : [...new Set(serverIds)],
      };
    };

    if (method === 'GET' && path === '/api/v1/users') {
      sendJSON(response, 200, {
        items: [...users]
          .sort((left, right) => (roleRank[left['role']] - roleRank[right['role']]) || left['username'].localeCompare(right['username']))
          .map((candidate) => userResource(candidate, user)),
      });

      return true;
    }

    if (method === 'POST' && path === '/api/v1/users') {
      const username: MockApi_HandleRequest_Username = String(body['username'] ?? '').trim();
      const usernameProblem: MockApi_HandleRequest_UsernameProblem = usernameIssue(username);
      const passwordProblem: MockApi_HandleRequest_PasswordProblem = passwordIssue(body['password']);
      const problems: MockApi_HandleRequest_Problems = [];

      // Like the server, every field with a problem is reported at once.
      if (usernameProblem !== '') {
        problems.push(fieldIssue('username', usernameProblem));
      }

      if (passwordProblem !== '') {
        problems.push(fieldIssue('password', passwordProblem));
      }

      if (problems.length > 0) {
        sendIssues(response, 422, 'invalid_request', problems);

        return true;
      }

      const access: MockApi_HandleRequest_Access = accessInput();

      if (access === null) {
        return true;
      }

      if (users.some((candidate) => candidate['username'].toLowerCase() === username.toLowerCase()) === true) {
        sendIssues(response, 409, 'username_taken', [fieldIssue('username', 'That username is already in use.')]);

        return true;
      }

      const created: MockApi_HandleRequest_Created = {
        ...access,
        createdAt: nowIso(),
        enabled: true,
        id: userIdFor(userSequence),
        lastSignInAt: null,
        password: String(body['password']),
        recoveryCodes: [],
        totpEnabled: false,
        totpPending: false,
        username,
      };

      userSequence += 1;
      users.push(created);

      writeLog('web', 'info', 'user_created', {
        targetUserId: created['id'],
        userId: user['id'],
        username: user['username'],
      });
      sendJSON(response, 201, userResource(created, user));

      return true;
    }

    const userMatch: MockApi_HandleRequest_UserMatch = path.match(new RegExp(userPathPattern, 'u'));
    const target: MockApi_HandleRequest_Target = (userMatch === null) ? undefined : users.find((candidate) => candidate['id'] === userMatch[1]);

    if (userMatch === null || target === undefined) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return true;
    }

    if (editableBy(user, target) === false) {
      sendError(response, 403, 'user_protected', 'You can\'t change this account here.');

      return true;
    }

    if (method === 'PUT' && userMatch[2] === undefined) {
      const access: MockApi_HandleRequest_Access = accessInput();

      if (access === null) {
        return true;
      }

      if (typeof body['enabled'] !== 'boolean') {
        sendIssues(response, 422, 'invalid_request', [fieldIssue('enabled', 'Choose whether they can sign in.')]);

        return true;
      }

      Object.assign(target, access, { enabled: body['enabled'] });

      if (target['enabled'] === false) {
        signOutUser(target['id']);
      }

      writeLog('web', 'info', 'user_updated', {
        targetUserId: target['id'],
        userId: user['id'],
        username: user['username'],
      });
      sendJSON(response, 200, userResource(target, user));

      return true;
    }

    if (method === 'POST' && userMatch[2] === '/password') {
      if (passwordIssue(body['password']) !== '') {
        sendIssues(response, 422, 'invalid_request', [fieldIssue('password', passwordIssue(body['password']))]);

        return true;
      }

      target.password = String(body['password']);
      signOutUser(target['id']);
      writeLog('web', 'info', 'user_password_reset', {
        targetUserId: target['id'],
        userId: user['id'],
        username: user['username'],
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'POST' && userMatch[2] === '/two-factor/reset') {
      target.totpEnabled = false;
      target.recoveryCodes = [];
      writeLog('web', 'info', 'user_two_factor_reset', {
        targetUserId: target['id'],
        userId: user['id'],
        username: user['username'],
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'DELETE' && userMatch[2] === undefined) {
      users.splice(users.indexOf(target), 1);

      signOutUser(target['id']);

      for (let index = tokens.length - 1; index >= 0; index -= 1) {
        const candidate: MockApi_HandleRequest_Candidate = tokens[index];

        if (candidate !== undefined && candidate['userId'] === target['id']) {
          tokens.splice(index, 1);
        }
      }

      writeLog('web', 'info', 'user_deleted', {
        targetUserId: target['id'],
        userId: user['id'],
        username: user['username'],
      });
      sendEmpty(response);

      return true;
    }
  }

  sendError(response, 404, 'not_found', 'No route matches this request.');

  return true;
};

/**
 * Mock API - Mock API.
 *
 * Answers the control panel's API from memory, so it runs without Discord or Postgres.
 * The setup code prints at start; other accounts use "mock password 123", codes 123456.
 * Feature editors, examples, import, and checks come from the real server modules.
 *
 * @returns {MockApi_MockApi_Returns}
 *
 * @since 4.0.0
 */
export const mockApi = (): MockApi_MockApi_Returns => ({
  name: 'discord-stonker-bot-mock-api',
  configureServer: (server) => {
    viteServer = server;
    seedLogs();

    server.config.logger.info(`  Mock setup code: ${setupCode}`);
    server.config.logger.info(`  Mock accounts after setup: avery, riley, jordan, sam, casey (password "${mockPassword}")`);

    const liveTimer: MockApi_MockApi_LiveTimer = setInterval(writeLiveLog, 4_000);

    if (server.httpServer !== null) {
      server.httpServer.on('close', () => clearInterval(liveTimer));
    }

    server.middlewares.use((request: MockApi_MockApi_Request, response: MockApi_MockApi_Response, next: MockApi_MockApi_Next) => {
      void handleRequest(request, response).then((handled) => {
        if (handled === false) {
          next();
        }

        return;
      }).catch((error) => {
        const errorMessage: MockApi_MockApi_ErrorMessage = (error instanceof Error) ? error.stack ?? error.message : String(error);

        server.config.logger.error(`  Mock API error: ${errorMessage}`);

        if (response.headersSent === false) {
          sendError(response, 500, 'internal_error', 'Something went wrong. Try again.');
        }

        return;
      });

      return;
    });

    return;
  },
});
