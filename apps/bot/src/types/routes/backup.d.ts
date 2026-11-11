import type express from 'express';
import type { ZodSafeParseResult } from 'zod';

import type { Runner as Access } from '../../lib/access.js';
import type { passkeySignInVerify } from '../../lib/account-schemas.js';
import type { Runner as Attempts } from '../../lib/attempts.js';
import type {
  BackupService,
  GrantStore,
} from '../../lib/backup.js';
import type { createPasskeyAuthenticationOptions } from '../../lib/passkey-auth.js';
import type {
  Lib_Backup_ExportSections,
  Lib_Backup_ImportResult,
  Lib_Backup_ImportSource,
  Lib_Backup_Purpose,
} from '../../types/lib/backup.d.ts';
import type {
  Lib_PasskeyAuth_AuthenticationUsage,
  Lib_PasskeyAuth_Ceremony,
  Lib_PasskeyAuth_StoredPasskey,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Response,
} from '../../types/lib/passkey-auth.d.ts';
import type { Server_Context } from '../../types/server.d.ts';
import type {
  Shared_Principal,
  Shared_WebauthnConfiguration,
} from '../../types/shared.d.ts';

export type Routes_Backup_Runner_Access = Access;
export type Routes_Backup_Runner_Attempts = Attempts;
export type Routes_Backup_Runner_Context = Server_Context;
export type Routes_Backup_Runner_Service = BackupService;
export type Routes_Backup_Runner_Grants = GrantStore;
export type Routes_Backup_Runner_Constructor_Context = Server_Context;
export type Routes_Backup_Runner_Constructor_Access = Access;
export type Routes_Backup_Runner_Constructor_Attempts = Attempts;
export type Routes_Backup_Runner_Constructor_Grants = GrantStore | undefined;
export type Routes_Backup_Runner_Register_App = express.Express;
export type Routes_Backup_Runner_Register_Returns = void;
export type Routes_Backup_Runner_Guards = express.RequestHandler[];
export type Routes_Backup_RelyingPartyName = string;

export type Routes_Backup_CeremonyBinding = {
  expiresAt: number;
  purpose: Lib_Backup_Purpose;
  sessionId: string;
};
export type Routes_Backup_CeremonyBindingResult = Routes_Backup_CeremonyBinding | undefined;
export type Routes_Backup_Ceremonies = Map<string, Routes_Backup_CeremonyBinding>;
export type Routes_Backup_HasSection = (sections: Lib_Backup_ExportSections) => boolean;
export type Routes_Backup_Request = express.Request;
export type Routes_Backup_Response = express.Response;
export type Routes_Backup_Returns = Promise<void>;
export type Routes_Backup_Principal = Shared_Principal;
export type Routes_Backup_SessionId_Returns = string;
export type Routes_Backup_AttemptKey = string;
export type Routes_Backup_RejectIdentity_Field = 'password' | 'code';
export type Routes_Backup_RejectIdentity_Message = string;
export type Routes_Backup_RejectIdentity_Returns = void;
export type Routes_Backup_SendLegacySourceError_Error = unknown;
export type Routes_Backup_SendLegacySourceError_Response = express.Response;
export type Routes_Backup_SendLegacySourceError_Returns = boolean;
export type Routes_Backup_SendLegacySourceError_Message = string;
export type Routes_Backup_SendLegacySourceError_Status = number;
export type Routes_Backup_IsRateLimited_Returns = boolean;
export type Routes_Backup_TotpEnabled = boolean;
export type Routes_Backup_TotpCode = string | undefined;
export type Routes_Backup_TotpVerified = boolean;
export type Routes_Backup_PasskeyOptions = Awaited<ReturnType<typeof createPasskeyAuthenticationOptions>>;
export type Routes_Backup_CeremonyId = string;

export type Routes_Backup_ConfirmationData = {
  code?: string | undefined;
  password: string;
  purpose: Lib_Backup_Purpose;
};
export type Routes_Backup_ConfirmationBody = ZodSafeParseResult<Routes_Backup_ConfirmationData>;
export type Routes_Backup_ExportData = {
  grant: string;
  sections: Lib_Backup_ExportSections;
};
export type Routes_Backup_ExportBody = ZodSafeParseResult<Routes_Backup_ExportData>;
export type Routes_Backup_PreviewData = {
  source: Lib_Backup_ImportSource;
};
export type Routes_Backup_PreviewBody = ZodSafeParseResult<Routes_Backup_PreviewData>;
export type Routes_Backup_ImportData = {
  grant: string;
  source: Lib_Backup_ImportSource;
};
export type Routes_Backup_ImportBody = ZodSafeParseResult<Routes_Backup_ImportData>;
export type Routes_Backup_PasskeyOptionsData = {
  purpose: Lib_Backup_Purpose;
};
export type Routes_Backup_PasskeyOptionsBody = ZodSafeParseResult<Routes_Backup_PasskeyOptionsData>;
export type Routes_Backup_PasskeyVerifyData = ReturnType<typeof passkeySignInVerify.parse> & {
  purpose: Lib_Backup_Purpose;
};
export type Routes_Backup_PasskeyVerifyBody = ZodSafeParseResult<Routes_Backup_PasskeyVerifyData>;
export type Routes_Backup_Configuration = Shared_WebauthnConfiguration;
export type Routes_Backup_Ceremony = Lib_PasskeyAuth_Ceremony | undefined;
export type Routes_Backup_Passkey = Lib_PasskeyAuth_StoredPasskey | undefined;
export type Routes_Backup_Verification = Lib_PasskeyAuth_AuthenticationUsage | undefined;
export type Routes_Backup_Credential = Lib_PasskeyAuth_VerifyPasskeyAuthentication_Response;
export type Routes_Backup_ImportResult = Lib_Backup_ImportResult;
export type Routes_Backup_Document = Awaited<ReturnType<BackupService['createDocument']>>;
export type Routes_Backup_Date = string;
