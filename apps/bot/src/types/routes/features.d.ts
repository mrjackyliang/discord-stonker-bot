import type express from 'express';
import type { ZodSafeParseResult } from 'zod';

import type {
  Lib_ConfigurationDatabase_FeatureSecret,
  Lib_ConfigurationDatabase_FeatureState,
  Lib_ConfigurationDatabase_FeatureStates,
  Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Outcome,
  Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Outcome,
  Lib_ConfigurationDatabase_StoredFeature,
} from '../lib/configuration-database.d.ts';
import type { Lib_FeatureConfigurationValidation_SecretResolver } from '../lib/feature-configuration-validation.d.ts';
import type { Lib_FeatureEditor_Editor } from '../lib/feature-editor.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_ErrorIssue,
  Shared_ErrorIssues,
  Shared_FeatureCategory,
  Shared_FeatureDefinition,
  Shared_FeatureKey,
  Shared_JsonObject,
  Shared_Principal,
} from '../shared.d.ts';

export type Routes_Features_MissingSecretKey = string;

export type Routes_Features_Summary_UpdatedAt = string | null;
export type Routes_Features_Summary = {
  category: Shared_FeatureCategory;
  configured: boolean;
  description: string;
  enabled: boolean;
  key: Shared_FeatureKey;
  name: string;
  revision: number;
  updatedAt: Routes_Features_Summary_UpdatedAt;
};
export type Routes_Features_Detail_Secrets = Record<string, boolean>;
export type Routes_Features_Detail = Routes_Features_Summary & {
  configuration: unknown;
  editor: Lib_FeatureEditor_Editor;
  example: unknown;
  secrets: Routes_Features_Detail_Secrets;
};
export type Routes_Features_NewSecret = {
  key: string;
  value: string;
};
export type Routes_Features_SecretValues = Map<string, string>;

export type Routes_Features_CheckConfiguration_FeatureKey = Shared_FeatureKey;
export type Routes_Features_CheckConfiguration_Configuration = unknown;
export type Routes_Features_CheckConfiguration_Values = Routes_Features_SecretValues;
export type Routes_Features_CheckConfiguration_Returns = Shared_ErrorIssues;
export type Routes_Features_CheckConfiguration_ValidationConfiguration = unknown;
export type Routes_Features_CheckConfiguration_Issues = Shared_ErrorIssues;
export type Routes_Features_CheckConfiguration_Node = unknown;
export type Routes_Features_CheckConfiguration_Resolver = Lib_FeatureConfigurationValidation_SecretResolver | undefined;

export type Routes_Features_CreateSecretIssue_Pointer = string;
export type Routes_Features_CreateSecretIssue_Returns = Shared_ErrorIssue;
export type Routes_Features_CreateSecretIssue_Path = string[];

export type Routes_Features_CreateSecretPurpose_ServerId = string;
export type Routes_Features_CreateSecretPurpose_SecretKey = string;
export type Routes_Features_CreateSecretPurpose_Returns = string;

export type Routes_Features_CreateSummary_Definition = Shared_FeatureDefinition;
export type Routes_Features_CreateSummary_State = Lib_ConfigurationDatabase_FeatureState | undefined;
export type Routes_Features_CreateSummary_Returns = Routes_Features_Summary;

export type Routes_Features_DecryptStoredSecret_ServerId = string;
export type Routes_Features_DecryptStoredSecret_SecretKey = string;
export type Routes_Features_DecryptStoredSecret_Ciphertext = string;
export type Routes_Features_DecryptStoredSecret_CredentialKey = Buffer;
export type Routes_Features_DecryptStoredSecret_Returns = string | undefined;

export type Routes_Features_ReadFeatureKey_Request = express.Request;
export type Routes_Features_ReadFeatureKey_Response = express.Response;
export type Routes_Features_ReadFeatureKey_Returns = Shared_FeatureKey | undefined;
export type Routes_Features_ReadFeatureKey_FeatureKey = string | undefined;

export type Routes_Features_SendRevisionConflict_Response = express.Response;
export type Routes_Features_SendRevisionConflict_Returns = void;

export type Routes_Features_Runner_Access = Server_Access;
export type Routes_Features_Runner_Context = Server_Context;
export type Routes_Features_Runner_Constructor_Context = Server_Context;
export type Routes_Features_Runner_Constructor_Access = Server_Access;
export type Routes_Features_Runner_Register_App = express.Express;
export type Routes_Features_Runner_Register_Returns = void;

export type Routes_Features_Runner_RouteDetail_Request = express.Request;
export type Routes_Features_Runner_RouteDetail_Response = express.Response;
export type Routes_Features_Runner_RouteDetail_Returns = Promise<void>;
export type Routes_Features_Runner_RouteDetail_FeatureKey = Shared_FeatureKey | undefined;
export type Routes_Features_Runner_RouteDetail_Detail = Routes_Features_Detail;

export type Routes_Features_Runner_RouteEnabled_Request = express.Request;
export type Routes_Features_Runner_RouteEnabled_Response = express.Response;
export type Routes_Features_Runner_RouteEnabled_Returns = Promise<void>;
export type Routes_Features_Runner_RouteEnabled_FeatureKey = Shared_FeatureKey | undefined;
export type Routes_Features_Runner_RouteEnabled_Body = ZodSafeParseResult<{
  enabled: boolean;
}>;
export type Routes_Features_Runner_RouteEnabled_ServerId = string;
export type Routes_Features_Runner_RouteEnabled_Stored = Lib_ConfigurationDatabase_StoredFeature | undefined;
export type Routes_Features_Runner_RouteEnabled_WebApplicationSettings = Shared_JsonObject;
export type Routes_Features_Runner_RouteEnabled_PathConflicts = string[];
export type Routes_Features_Runner_RouteEnabled_SecretKeys = string[];
export type Routes_Features_Runner_RouteEnabled_Issues = Shared_ErrorIssues;
export type Routes_Features_Runner_RouteEnabled_Outcome = Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Outcome;
export type Routes_Features_Runner_RouteEnabled_Principal = Shared_Principal;
export type Routes_Features_Runner_RouteEnabled_States = Lib_ConfigurationDatabase_FeatureStates;

export type Routes_Features_Runner_RouteList_Request = express.Request;
export type Routes_Features_Runner_RouteList_Response = express.Response;
export type Routes_Features_Runner_RouteList_Returns = Promise<void>;
export type Routes_Features_Runner_RouteList_States = Lib_ConfigurationDatabase_FeatureStates;

export type Routes_Features_Runner_RouteSave_Request = express.Request;
export type Routes_Features_Runner_RouteSave_Response = express.Response;
export type Routes_Features_Runner_RouteSave_Returns = Promise<void>;
export type Routes_Features_Runner_RouteSave_FeatureKey = Shared_FeatureKey | undefined;
export type Routes_Features_Runner_RouteSave_Body = ZodSafeParseResult<{
  configuration: unknown[] | Record<string, unknown>;
  expectedRevision: number;
  secrets?: Record<string, string> | undefined;
}>;
export type Routes_Features_Runner_RouteSave_ServerId = string;
export type Routes_Features_Runner_RouteSave_Stored = Lib_ConfigurationDatabase_StoredFeature | undefined;
export type Routes_Features_Runner_RouteSave_StoredConfiguration = unknown;
export type Routes_Features_Runner_RouteSave_StoredKeys = Set<string>;
export type Routes_Features_Runner_RouteSave_Configuration = unknown[] | Record<string, unknown>;
export type Routes_Features_Runner_RouteSave_Issues = Shared_ErrorIssues;
export type Routes_Features_Runner_RouteSave_NewSecrets = Routes_Features_NewSecret[];
export type Routes_Features_Runner_RouteSave_Pointer = string;
export type Routes_Features_Runner_RouteSave_Value = string;
export type Routes_Features_Runner_RouteSave_Node = unknown;
export type Routes_Features_Runner_RouteSave_SecretKey = string;
export type Routes_Features_Runner_RouteSave_KeptKeys = string[];
export type Routes_Features_Runner_RouteSave_Values = Routes_Features_SecretValues;
export type Routes_Features_Runner_RouteSave_WebApplicationSettings = Shared_JsonObject;
export type Routes_Features_Runner_RouteSave_PathConflicts = string[];
export type Routes_Features_Runner_RouteSave_FirstIssue = Shared_ErrorIssue | undefined;
export type Routes_Features_Runner_RouteSave_Secrets = Lib_ConfigurationDatabase_FeatureSecret[];
export type Routes_Features_Runner_RouteSave_Outcome = Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Outcome;
export type Routes_Features_Runner_RouteSave_Principal = Shared_Principal;
export type Routes_Features_Runner_RouteSave_Detail = Routes_Features_Detail;

export type Routes_Features_Runner_CreateDetail_ServerId = string;
export type Routes_Features_Runner_CreateDetail_FeatureKey = Shared_FeatureKey;
export type Routes_Features_Runner_CreateDetail_Returns = Promise<Routes_Features_Detail>;
export type Routes_Features_Runner_CreateDetail_Stored = Lib_ConfigurationDatabase_StoredFeature | undefined;
export type Routes_Features_Runner_CreateDetail_Configuration = unknown;
export type Routes_Features_Runner_CreateDetail_SecretKeys = string[];
export type Routes_Features_Runner_CreateDetail_Ciphertexts = Map<string, string>;
export type Routes_Features_Runner_CreateDetail_Secrets = Routes_Features_Detail_Secrets;

export type Routes_Features_Runner_ReadSecretValues_ServerId = string;
export type Routes_Features_Runner_ReadSecretValues_SecretKeys = string[];
export type Routes_Features_Runner_ReadSecretValues_Returns = Promise<Routes_Features_SecretValues>;
export type Routes_Features_Runner_ReadSecretValues_Ciphertexts = Map<string, string>;
export type Routes_Features_Runner_ReadSecretValues_Values = Routes_Features_SecretValues;
export type Routes_Features_Runner_ReadSecretValues_Value = string | undefined;
