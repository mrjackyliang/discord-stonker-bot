import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';
import type { ZodType } from 'zod';

import type { Server_Context } from '../server.d.ts';
import type {
  Shared_BotDesiredState,
  Shared_FeatureKey,
  Shared_JsonObject,
  Shared_TokenScope,
} from '../shared.d.ts';
import type { Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry } from './configuration-database.d.ts';
import type {
  Lib_Database_GetGuildSecrets_Secret,
  Lib_Database_SaveLegacyImport_EncryptedSecret,
  Lib_Database_SaveLegacyImport_EncryptedSecrets,
} from './database.d.ts';
import type { Lib_FeatureSecrets_SecretReference } from './feature-secrets.d.ts';
import type { Lib_LegacyImport_Result } from './legacy-import.d.ts';
import type {
  Lib_Notifications_Field,
  Lib_Notifications_NotificationInputSchema_Returns,
} from './notifications.d.ts';

export type Lib_Backup_Purpose = 'export' | 'import';
export type Lib_Backup_SectionId = 'connection' | 'features' | 'notifications' | 'accessTokens';
export type Lib_Backup_ExportSections = Record<Lib_Backup_SectionId, boolean>;

export type Lib_Backup_Connection = {
  botToken: string | null;
  desiredState: Shared_BotDesiredState;
};
export type Lib_Backup_OptionalConnection = Lib_Backup_Connection | undefined;
export type Lib_Backup_Feature = {
  configuration: unknown;
  enabled: boolean;
  key: string;
  secrets: Record<string, string>;
};
export type Lib_Backup_ServerFeatures = {
  features: Lib_Backup_Feature[];
  serverId: string;
  timeZone: string;
};
export type Lib_Backup_Notification = {
  events: string[];
  id: string;
  name: string;
  secrets: Record<string, string>;
  service: 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';
  settings: Record<string, string>;
};
export type Lib_Backup_AccessToken = {
  expiresAt: string | null;
  id: string;
  name: string;
  scopes: Shared_TokenScope[];
  tokenHash: string;
};
export type Lib_Backup_Document = {
  accessTokens?: Lib_Backup_AccessToken[] | undefined;
  appVersion: string;
  connection?: Lib_Backup_Connection | undefined;
  exportedAt: string;
  features?: Lib_Backup_ServerFeatures[] | undefined;
  format: 'discord-stonker-bot-export';
  notifications?: Lib_Backup_Notification[] | undefined;
  version: 1;
};

export type Lib_Backup_LegacySource = {
  configuration: string;
  enableFeatures: boolean;
  serverId: string;
  type: 'legacy';
};
export type Lib_Backup_ExportSource = {
  document: Lib_Backup_Document;
  type: 'export';
};
export type Lib_Backup_ImportSource = Lib_Backup_ExportSource | Lib_Backup_LegacySource;

export type Lib_Backup_ExcludedItem = {
  id: string;
  label: string;
  reason: string;
};
export type Lib_Backup_ImportSectionPreview = {
  file: string;
  here: string;
  id: Lib_Backup_SectionId;
  label: string;
  reason?: string | undefined;
  willImport: boolean;
};
export type Lib_Backup_ImportSummary = {
  accessTokens: {
    added: number;
    skipped: number;
  };
  connection: 'added' | 'replaced' | 'skipped';
  features: {
    features: number;
    servers: number;
  };
  notifications: {
    added: number;
    replaced: number;
  };
};
export type Lib_Backup_LegacyPreview = {
  featuresRequiringFixes: Lib_Backup_ExcludedItem[];
  featuresThatTurnOn: number;
};
export type Lib_Backup_ImportPreview = {
  appVersion: string | null;
  excluded: Lib_Backup_ExcludedItem[];
  exportedAt: string | null;
  legacy?: Lib_Backup_LegacyPreview | undefined;
  sections: Lib_Backup_ImportSectionPreview[];
  source: 'export' | 'legacy';
  summary: Lib_Backup_ImportSummary;
};
export type Lib_Backup_ImportResult = Lib_Backup_ImportSummary & {
  importedSections: Lib_Backup_SectionId[];
};

export type Lib_Backup_Grant = {
  expiresAt: string;
  grant: string;
};
export type Lib_Backup_GrantRecord = {
  expiresAt: number;
  purpose: Lib_Backup_Purpose;
  sessionId: string;
};
export type Lib_Backup_GrantStore_Clock = () => number;
export type Lib_Backup_GrantStore_DurationMilliseconds = number;
export type Lib_Backup_GrantStore_Grants = Map<string, Lib_Backup_GrantRecord>;
export type Lib_Backup_GrantStore_Issue_Returns = Lib_Backup_Grant;
export type Lib_Backup_GrantStore_Consume_Returns = boolean;
export type Lib_Backup_GrantStore_Prune_Returns = void;

export type Lib_Backup_DocumentSchema = ZodType<Lib_Backup_Document>;
export type Lib_Backup_ImportSourceSchema = ZodType<Lib_Backup_ImportSource>;
export type Lib_Backup_Schema<Value> = ZodType<Value>;
export type Lib_Backup_JsonValueSchema = ZodType<unknown>;
export type Lib_Backup_StringMapSchema = ZodType<Record<string, string>>;
export type Lib_Backup_NotificationEventKeys = [string, ...string[]];
export type Lib_Backup_NotificationSchema = ZodType<Lib_Backup_Notification>;
export type Lib_Backup_FeatureSchema = ZodType<Lib_Backup_Feature>;
export type Lib_Backup_NotificationRefinement = Parameters<Lib_Backup_NotificationSchema['superRefine']>[0];
export type Lib_Backup_FeatureRefinement = Parameters<Lib_Backup_FeatureSchema['superRefine']>[0];
export type Lib_Backup_DocumentRefinement = Parameters<Lib_Backup_Schema<Lib_Backup_Document>['superRefine']>[0];
export type Lib_Backup_NotificationEventsPredicate = (events: string[]) => boolean;
export type Lib_Backup_AccessTokenScopesPredicate = (scopes: Shared_TokenScope[]) => boolean;
export type Lib_Backup_NotificationFields = Lib_Notifications_Field[];
export type Lib_Backup_NotificationFieldPredicate = (field: Lib_Notifications_Field) => boolean;
export type Lib_Backup_NotificationFieldMapper = (field: Lib_Notifications_Field) => string;
export type Lib_Backup_StringSet = Set<string>;
export type Lib_Backup_ParsedNotification = ReturnType<Lib_Notifications_NotificationInputSchema_Returns['safeParse']>;
export type Lib_Backup_SecretReferenceMapper = (reference: Lib_FeatureSecrets_SecretReference) => string;
export type Lib_Backup_NonEmptyStringPredicate = (value: string) => boolean;
export type Lib_Backup_ServerIdMapper = (server: Lib_Backup_ServerFeatures) => string;
export type Lib_Backup_NotificationIdMapper = (notification: Lib_Backup_Notification) => string;
export type Lib_Backup_NotificationNameMapper = (notification: Lib_Backup_Notification) => string;
export type Lib_Backup_AccessTokenIdMapper = (token: Lib_Backup_AccessToken) => string;
export type Lib_Backup_AccessTokenNameMapper = (token: Lib_Backup_AccessToken) => string;
export type Lib_Backup_AccessTokenHashMapper = (token: Lib_Backup_AccessToken) => string;
export type Lib_Backup_FeatureKeyMapper = (feature: Lib_Backup_Feature) => string;
export type Lib_Backup_StringList = string[];
export type Lib_Backup_ParseBackupDocument_Value = unknown;
export type Lib_Backup_ParseBackupDocument_Returns = Lib_Backup_Document;
export type Lib_Backup_ParseImportSource_Value = unknown;
export type Lib_Backup_ParseImportSource_Returns = Lib_Backup_ImportSource;

export type Lib_Backup_Service_Context = Server_Context;
export type Lib_Backup_Service_Constructor_Context = Server_Context;
export type Lib_Backup_Service_CreateDocument_Sections = Lib_Backup_ExportSections;
export type Lib_Backup_Service_CreateDocument_UserId = string;
export type Lib_Backup_Service_CreateDocument_Returns = Promise<Lib_Backup_Document>;
export type Lib_Backup_Service_Preview_Source = Lib_Backup_ImportSource;
export type Lib_Backup_Service_Preview_UserId = string;
export type Lib_Backup_Service_Preview_Returns = Promise<Lib_Backup_ImportPreview>;
export type Lib_Backup_Service_Apply_Source = Lib_Backup_ImportSource;
export type Lib_Backup_Service_Apply_UserId = string;
export type Lib_Backup_Service_Apply_Returns = Promise<Lib_Backup_ImportResult>;

export type Lib_Backup_Service_RuntimeRow = {
  desired_state: Shared_BotDesiredState;
  discord_token_ciphertext: string | null;
};
export type Lib_Backup_Service_RuntimeResult = QueryResult<Lib_Backup_Service_RuntimeRow>;
export type Lib_Backup_Service_Runtime = Lib_Backup_Service_RuntimeRow | undefined;
export type Lib_Backup_Service_SettingsEntry = {
  guildIdentifier: string;
  settings: Shared_JsonObject;
};
export type Lib_Backup_Service_SettingsEntries = Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry[];
export type Lib_Backup_Service_FeatureServers = Lib_Backup_ServerFeatures[];
export type Lib_Backup_Service_StoredSecrets = Lib_Database_GetGuildSecrets_Secret[];
export type Lib_Backup_Service_StoredSecretMapper = (secret: Lib_Database_GetGuildSecrets_Secret) => [string, string];
export type Lib_Backup_Service_Ciphertexts = Map<string, string>;
export type Lib_Backup_Service_PortableFeatures = Lib_Backup_Feature[];
export type Lib_Backup_Service_Configuration = unknown;
export type Lib_Backup_Service_OptionalCiphertext = string | undefined;
export type Lib_Backup_Service_FeaturesObject = Record<string, unknown>;
export type Lib_Backup_Service_FeatureEntry = [string, unknown];
export type Lib_Backup_Service_FeatureObject = Record<string, unknown>;
export type Lib_Backup_Service_Secrets = Record<string, string>;
export type Lib_Backup_Service_NotificationsResult = QueryResult<Record<string, unknown>>;
export type Lib_Backup_Service_TokensResult = QueryResult<Record<string, unknown>>;
export type Lib_Backup_Service_CurrentNames = Set<string>;
export type Lib_Backup_Service_CurrentHashes = Set<string>;
export type Lib_Backup_Service_Ids = Set<string>;
export type Lib_Backup_Service_NameMap = Map<string, string>;
export type Lib_Backup_Service_Row = Record<string, unknown>;
export type Lib_Backup_Service_Rows = Lib_Backup_Service_Row[];
export type Lib_Backup_Service_RowResult = Lib_Backup_Service_Row | undefined;
export type Lib_Backup_Service_RowStringMapper = (row: Lib_Backup_Service_Row) => string;
export type Lib_Backup_Service_RowStringMapper_Row = Lib_Backup_Service_Row;
export type Lib_Backup_Service_RowStringMapper_Returns = string;
export type Lib_Backup_Service_RowNameIdMapper = (row: Lib_Backup_Service_Row) => [string, string];
export type Lib_Backup_Service_RowNameIdMapper_Returns = [string, string];
export type Lib_Backup_Service_Sections = Lib_Backup_ImportSectionPreview[];
export type Lib_Backup_Service_FeatureCountReducer = (count: number, server: Lib_Backup_ServerFeatures) => number;
export type Lib_Backup_Service_NotificationPredicate = (target: Lib_Backup_Notification) => boolean;
export type Lib_Backup_Service_AccessTokenPredicate = (token: Lib_Backup_AccessToken) => boolean;
export type Lib_Backup_Service_Count = number;
export type Lib_Backup_Service_CountRow = {
  count: string;
} | undefined;
export type Lib_Backup_Service_ConnectionCiphertext = string | null;
export type Lib_Backup_Service_ExistingId = string | undefined;
export type Lib_Backup_Service_Identifier = string;
export type Lib_Backup_Service_Description = string;
export type Lib_Backup_Service_HasToken = boolean;
export type Lib_Backup_Service_SealedSecrets = string | null;
export type Lib_Backup_Service_EncryptedSecrets = Lib_Database_SaveLegacyImport_EncryptedSecrets;
export type Lib_Backup_Service_LegacySecretPredicate = (secret: Lib_Backup_Service_LegacyResult['secrets'][number]) => boolean;
export type Lib_Backup_Service_LegacySecretMapper = (secret: Lib_Backup_Service_LegacyResult['secrets'][number]) => Lib_Database_SaveLegacyImport_EncryptedSecret;
export type Lib_Backup_Service_TokenCiphertext = string | undefined;
export type Lib_Backup_Service_LegacyReport = Shared_JsonObject;
export type Lib_Backup_Service_PreviewLegacy_InvalidFeature = (key: Shared_FeatureKey) => Lib_Backup_ExcludedItem;
export type Lib_Backup_Service_PreviewLegacy_UnsupportedSection = (key: string) => Lib_Backup_ExcludedItem;
export type Lib_Backup_Service_PreviewLegacy_WarningItem = (warning: string, index: number) => Lib_Backup_ExcludedItem;
export type Lib_Backup_Service_Client = PoolClient;
export type Lib_Backup_Service_Pool = Pool;
export type Lib_Backup_Service_ImportedSections = Lib_Backup_SectionId[];
export type Lib_Backup_Service_LegacyResult = Lib_LegacyImport_Result;

export type Lib_Backup_IsRecord_Value = unknown;
export type Lib_Backup_IsRecord_Record = Record<string, unknown>;
export type Lib_Backup_IsRecord_Returns = boolean;
export type Lib_Backup_EmptySummary_Returns = Lib_Backup_ImportSummary;
export type Lib_Backup_CountLabel_Count = number;
export type Lib_Backup_CountLabel_Noun = string;
export type Lib_Backup_CountLabel_Returns = string;
export type Lib_Backup_LegacyWarningLabel_Warning = string;
export type Lib_Backup_LegacyWarningLabel_Returns = string;
export type Lib_Backup_NewTokenId_Returns = string;
export type Lib_Backup_NewNotificationId_Returns = string;
export type Lib_Backup_GrantStore_SessionId = string;
export type Lib_Backup_GrantStore_Grant = string;
export type Lib_Backup_GrantStore_Now = number;
export type Lib_Backup_GrantStore_ExpiresAt = number;
export type Lib_Backup_GrantStore_Digest = string;
export type Lib_Backup_GrantStore_Record = Lib_Backup_GrantRecord | undefined;
export type Lib_Backup_GrantStore_Entry = [string, Lib_Backup_GrantRecord];
