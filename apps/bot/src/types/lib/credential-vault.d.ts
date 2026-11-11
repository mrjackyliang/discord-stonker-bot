import type {
  CipherGCM,
  DecipherGCM,
} from 'node:crypto';

export type Lib_CredentialVault_DecryptDiscordToken_Ciphertext = string;
export type Lib_CredentialVault_DecryptDiscordToken_CredentialKey = Buffer;
export type Lib_CredentialVault_DecryptDiscordToken_Returns = string;
export type Lib_CredentialVault_DecryptDiscordToken_Parts = string[];
export type Lib_CredentialVault_DecryptDiscordToken_InitializationVector = Buffer;
export type Lib_CredentialVault_DecryptDiscordToken_Tag = Buffer;
export type Lib_CredentialVault_DecryptDiscordToken_CiphertextBuffer = Buffer;
export type Lib_CredentialVault_DecryptDiscordToken_Decipher = DecipherGCM;

export type Lib_CredentialVault_CreateAssociatedData_Purpose = string;
export type Lib_CredentialVault_CreateAssociatedData_Returns = Buffer;

export type Lib_CredentialVault_DecryptSecret_AssociatedData = Buffer;
export type Lib_CredentialVault_DecryptSecret_Ciphertext = string;
export type Lib_CredentialVault_DecryptSecret_CiphertextBuffer = Buffer;
export type Lib_CredentialVault_DecryptSecret_CredentialKey = Buffer;
export type Lib_CredentialVault_DecryptSecret_Decipher = DecipherGCM;
export type Lib_CredentialVault_DecryptSecret_InitializationVector = Buffer;
export type Lib_CredentialVault_DecryptSecret_Parts = string[];
export type Lib_CredentialVault_DecryptSecret_Purpose = string;
export type Lib_CredentialVault_DecryptSecret_Returns = string;
export type Lib_CredentialVault_DecryptSecret_Tag = Buffer;

export type Lib_CredentialVault_EncryptDiscordToken_Token = string;
export type Lib_CredentialVault_EncryptDiscordToken_CredentialKey = Buffer;
export type Lib_CredentialVault_EncryptDiscordToken_Returns = string;
export type Lib_CredentialVault_EncryptDiscordToken_InitializationVector = Buffer;
export type Lib_CredentialVault_EncryptDiscordToken_Cipher = CipherGCM;
export type Lib_CredentialVault_EncryptDiscordToken_EncryptedToken = Buffer;
export type Lib_CredentialVault_EncryptDiscordToken_Tag = Buffer;

export type Lib_CredentialVault_EncryptSecret_AssociatedData = Buffer;
export type Lib_CredentialVault_EncryptSecret_Cipher = CipherGCM;
export type Lib_CredentialVault_EncryptSecret_CredentialKey = Buffer;
export type Lib_CredentialVault_EncryptSecret_EncryptedSecret = Buffer;
export type Lib_CredentialVault_EncryptSecret_InitializationVector = Buffer;
export type Lib_CredentialVault_EncryptSecret_Purpose = string;
export type Lib_CredentialVault_EncryptSecret_Returns = string;
export type Lib_CredentialVault_EncryptSecret_Secret = string;
export type Lib_CredentialVault_EncryptSecret_Tag = Buffer;

export type Lib_CredentialVault_ReadCredentialKey_FilePath = string;
export type Lib_CredentialVault_ReadCredentialKey_Returns = Promise<Buffer>;
export type Lib_CredentialVault_ReadCredentialKey_CredentialKey = Buffer;

export type Lib_CredentialVault_ValidateCredentialKey_CredentialKey = Buffer;
export type Lib_CredentialVault_ValidateCredentialKey_Returns = void;
