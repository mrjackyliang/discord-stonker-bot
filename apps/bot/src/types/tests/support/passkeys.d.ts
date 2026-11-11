import type {
  JsonWebKey,
  KeyPairKeyObjectResult,
} from 'node:crypto';

export type Tests_Support_Passkeys_Authenticator = {
  credentialId: Buffer;
  keyPair: KeyPairKeyObjectResult;
  signCount: number;
  userHandle: string | undefined;
};
export type Tests_Support_Passkeys_CborValue = number | string | Uint8Array | Map<Tests_Support_Passkeys_CborValue, Tests_Support_Passkeys_CborValue>;
export type Tests_Support_Passkeys_Options = Record<string, unknown>;
export type Tests_Support_Passkeys_Credential = Record<string, unknown>;

export type Tests_Support_Passkeys_CreateAssertion_Authenticator = Tests_Support_Passkeys_Authenticator;
export type Tests_Support_Passkeys_CreateAssertion_Options = Tests_Support_Passkeys_Options;
export type Tests_Support_Passkeys_CreateAssertion_Origin = string;
export type Tests_Support_Passkeys_CreateAssertion_RpId = string;
export type Tests_Support_Passkeys_CreateAssertion_Returns = Tests_Support_Passkeys_Credential;
export type Tests_Support_Passkeys_CreateAssertion_AuthenticatorData = Buffer;
export type Tests_Support_Passkeys_CreateAssertion_ClientData = Buffer;
export type Tests_Support_Passkeys_CreateAssertion_Signature = Buffer;

export type Tests_Support_Passkeys_CreateAuthenticator_Returns = Tests_Support_Passkeys_Authenticator;

export type Tests_Support_Passkeys_CreateRegistration_Authenticator = Tests_Support_Passkeys_Authenticator;
export type Tests_Support_Passkeys_CreateRegistration_Options = Tests_Support_Passkeys_Options;
export type Tests_Support_Passkeys_CreateRegistration_Origin = string;
export type Tests_Support_Passkeys_CreateRegistration_Returns = Tests_Support_Passkeys_Credential;
export type Tests_Support_Passkeys_CreateRegistration_PublicKey = JsonWebKey;
export type Tests_Support_Passkeys_CreateRegistration_CredentialIdLength = Buffer;
export type Tests_Support_Passkeys_CreateRegistration_RpId = string;
export type Tests_Support_Passkeys_CreateRegistration_Attested = Buffer;
export type Tests_Support_Passkeys_CreateRegistration_AuthenticatorData = Buffer;
export type Tests_Support_Passkeys_CreateRegistration_AttestationObject = Buffer;
export type Tests_Support_Passkeys_CreateRegistration_ClientData = Buffer;

export type Tests_Support_Passkeys_CreateAuthenticatorData_RpId = string;
export type Tests_Support_Passkeys_CreateAuthenticatorData_Flags = number;
export type Tests_Support_Passkeys_CreateAuthenticatorData_SignCount = number;
export type Tests_Support_Passkeys_CreateAuthenticatorData_Attested = Buffer;
export type Tests_Support_Passkeys_CreateAuthenticatorData_Returns = Buffer;
export type Tests_Support_Passkeys_CreateAuthenticatorData_Counter = Buffer;

export type Tests_Support_Passkeys_EncodeCbor_Value = Tests_Support_Passkeys_CborValue;
export type Tests_Support_Passkeys_EncodeCbor_Returns = Buffer;
export type Tests_Support_Passkeys_EncodeCbor_Bytes = Buffer;
export type Tests_Support_Passkeys_EncodeCbor_Entries = [Tests_Support_Passkeys_CborValue, Tests_Support_Passkeys_CborValue][];

export type Tests_Support_Passkeys_EncodeCborHead_MajorType = number;
export type Tests_Support_Passkeys_EncodeCborHead_Length = number;
export type Tests_Support_Passkeys_EncodeCborHead_Returns = Buffer;
export type Tests_Support_Passkeys_EncodeCborHead_Head = Buffer;
