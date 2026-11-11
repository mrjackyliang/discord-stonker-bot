import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  Pool,
  QueryResult,
} from 'pg';

import type { Shared_WebauthnConfiguration } from '../shared.d.ts';

export type Lib_PasskeyAuth_CeremonyKind = 'authentication' | 'registration';
export type Lib_PasskeyAuth_Ceremony = {
  challenge: string;
  name: string | null;
  origin: string;
  rpId: string;
  userId: string | null;
};
export type Lib_PasskeyAuth_StoredPasskey = {
  counter: number;
  id: string;
  name: string;
  publicKey: Uint8Array<ArrayBuffer>;
  rpId: string | null;
  transports: AuthenticatorTransportFuture[];
  userId: string;
};
export type Lib_PasskeyAuth_PasskeyDescriptor = {
  id: string;
  transports: AuthenticatorTransportFuture[];
};
export type Lib_PasskeyAuth_RegisteredCredential = {
  backedUp: boolean;
  counter: number;
  deviceType: CredentialDeviceType;
  id: string;
  publicKey: Uint8Array;
  transports: AuthenticatorTransportFuture[];
};
export type Lib_PasskeyAuth_AuthenticationUsage = {
  backedUp: boolean;
  counter: number;
  deviceType: CredentialDeviceType;
};

export type Lib_PasskeyAuth_CreatePanelPasskey_Pool = Pool;
export type Lib_PasskeyAuth_CreatePanelPasskey_UserId = string;
export type Lib_PasskeyAuth_CreatePanelPasskey_Name = string;
export type Lib_PasskeyAuth_CreatePanelPasskey_RpId = string;
export type Lib_PasskeyAuth_CreatePanelPasskey_Credential = Lib_PasskeyAuth_RegisteredCredential;
export type Lib_PasskeyAuth_CreatePanelPasskey_Returns = Promise<'conflict' | 'created'>;

export type Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Pool = Pool;
export type Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Ceremony = Lib_PasskeyAuth_Ceremony & {
  kind: Lib_PasskeyAuth_CeremonyKind;
};
export type Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Returns = Promise<string>;
export type Lib_PasskeyAuth_CreatePanelWebauthnCeremony_CeremonyId = string;

export type Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Configuration = Shared_WebauthnConfiguration;
export type Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Returns = Promise<PublicKeyCredentialRequestOptionsJSON>;

export type Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Configuration = Shared_WebauthnConfiguration;
export type Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Account = {
  id: string;
  username: string;
};
export type Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_ExistingPasskeys = Lib_PasskeyAuth_PasskeyDescriptor[];
export type Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Returns = Promise<PublicKeyCredentialCreationOptionsJSON>;

export type Lib_PasskeyAuth_GetPanelPasskey_Pool = Pool;
export type Lib_PasskeyAuth_GetPanelPasskey_CredentialId = string;
export type Lib_PasskeyAuth_GetPanelPasskey_Returns = Promise<Lib_PasskeyAuth_StoredPasskey | undefined>;
export type Lib_PasskeyAuth_GetPanelPasskey_QueryRow = {
  counter: string;
  credential_id: string;
  name: string;
  public_key: Buffer;
  rp_id: string | null;
  transports: AuthenticatorTransportFuture[];
  user_id: string;
};
export type Lib_PasskeyAuth_GetPanelPasskey_Row = Lib_PasskeyAuth_GetPanelPasskey_QueryRow | undefined;
export type Lib_PasskeyAuth_GetPanelPasskey_Result = QueryResult<Lib_PasskeyAuth_GetPanelPasskey_QueryRow>;

export type Lib_PasskeyAuth_GetPasskeyUserHandle_UserId = string;
export type Lib_PasskeyAuth_GetPasskeyUserHandle_Returns = string;

export type Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Pool = Pool;
export type Lib_PasskeyAuth_ListPanelPasskeyDescriptors_UserId = string;
export type Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Returns = Promise<Lib_PasskeyAuth_PasskeyDescriptor[]>;
export type Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Row = {
  credential_id: string;
  transports: AuthenticatorTransportFuture[];
};
export type Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Result = QueryResult<Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Row>;

export type Lib_PasskeyAuth_RemovePanelPasskey_Pool = Pool;
export type Lib_PasskeyAuth_RemovePanelPasskey_UserId = string;
export type Lib_PasskeyAuth_RemovePanelPasskey_CredentialId = string;
export type Lib_PasskeyAuth_RemovePanelPasskey_Returns = Promise<string | undefined>;
export type Lib_PasskeyAuth_RemovePanelPasskey_QueryRow = {
  name: string;
};
export type Lib_PasskeyAuth_RemovePanelPasskey_Row = Lib_PasskeyAuth_RemovePanelPasskey_QueryRow | undefined;
export type Lib_PasskeyAuth_RemovePanelPasskey_Result = QueryResult<Lib_PasskeyAuth_RemovePanelPasskey_QueryRow>;

export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_Pool = Pool;
export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_CeremonyId = string;
export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_Kind = Lib_PasskeyAuth_CeremonyKind;
export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_Returns = Promise<Lib_PasskeyAuth_Ceremony | undefined>;
export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_QueryRow = {
  active: boolean;
  challenge: string;
  name: string | null;
  origin: string;
  rp_id: string;
  user_id: string | null;
};
export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_Row = Lib_PasskeyAuth_TakePanelWebauthnCeremony_QueryRow | undefined;
export type Lib_PasskeyAuth_TakePanelWebauthnCeremony_Result = QueryResult<Lib_PasskeyAuth_TakePanelWebauthnCeremony_QueryRow>;

export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Pool = Pool;
export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_CredentialId = string;
export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_PreviousCounter = number;
export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Usage = Lib_PasskeyAuth_AuthenticationUsage;
export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_RpId = string;
export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Returns = Promise<boolean>;
export type Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Result = QueryResult;

export type Lib_PasskeyAuth_VerifyPasskeyAuthentication_Configuration = Shared_WebauthnConfiguration;
export type Lib_PasskeyAuth_VerifyPasskeyAuthentication_Response = AuthenticationResponseJSON;
export type Lib_PasskeyAuth_VerifyPasskeyAuthentication_Challenge = string;
export type Lib_PasskeyAuth_VerifyPasskeyAuthentication_Passkey = Lib_PasskeyAuth_StoredPasskey;
export type Lib_PasskeyAuth_VerifyPasskeyAuthentication_Returns = Promise<Lib_PasskeyAuth_AuthenticationUsage | undefined>;
export type Lib_PasskeyAuth_VerifyPasskeyAuthentication_Verification = VerifiedAuthenticationResponse | undefined;

export type Lib_PasskeyAuth_VerifyPasskeyRegistration_Configuration = Shared_WebauthnConfiguration;
export type Lib_PasskeyAuth_VerifyPasskeyRegistration_Response = RegistrationResponseJSON;
export type Lib_PasskeyAuth_VerifyPasskeyRegistration_Challenge = string;
export type Lib_PasskeyAuth_VerifyPasskeyRegistration_Returns = Promise<Lib_PasskeyAuth_RegisteredCredential | undefined>;
export type Lib_PasskeyAuth_VerifyPasskeyRegistration_Verification = VerifiedRegistrationResponse | undefined;
export type Lib_PasskeyAuth_VerifyPasskeyRegistration_Transports = AuthenticatorTransportFuture[];
