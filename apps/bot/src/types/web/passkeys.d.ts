/**
 * Passkeys.
 *
 * @since 4.0.0
 */
export type Web_Passkeys_JsonObject = Record<string, unknown>;

/**
 * Passkeys.
 *
 * @since 4.0.0
 */
export type Web_Passkeys_PublicKeyCredentialStatic = {
  parseCreationOptionsFromJSON?: (options: Web_Passkeys_JsonObject) => PublicKeyCredentialCreationOptions;
  parseRequestOptionsFromJSON?: (options: Web_Passkeys_JsonObject) => PublicKeyCredentialRequestOptions;
};
