import {
  createHash,
  generateKeyPairSync,
  randomBytes,
  sign,
} from 'node:crypto';

import type {
  Tests_Support_Passkeys_CborValue,
  Tests_Support_Passkeys_CreateAssertion_Authenticator,
  Tests_Support_Passkeys_CreateAssertion_AuthenticatorData,
  Tests_Support_Passkeys_CreateAssertion_ClientData,
  Tests_Support_Passkeys_CreateAssertion_Options,
  Tests_Support_Passkeys_CreateAssertion_Origin,
  Tests_Support_Passkeys_CreateAssertion_Returns,
  Tests_Support_Passkeys_CreateAssertion_RpId,
  Tests_Support_Passkeys_CreateAssertion_Signature,
  Tests_Support_Passkeys_CreateAuthenticator_Returns,
  Tests_Support_Passkeys_CreateAuthenticatorData_Attested,
  Tests_Support_Passkeys_CreateAuthenticatorData_Counter,
  Tests_Support_Passkeys_CreateAuthenticatorData_Flags,
  Tests_Support_Passkeys_CreateAuthenticatorData_Returns,
  Tests_Support_Passkeys_CreateAuthenticatorData_RpId,
  Tests_Support_Passkeys_CreateAuthenticatorData_SignCount,
  Tests_Support_Passkeys_CreateRegistration_AttestationObject,
  Tests_Support_Passkeys_CreateRegistration_Attested,
  Tests_Support_Passkeys_CreateRegistration_Authenticator,
  Tests_Support_Passkeys_CreateRegistration_AuthenticatorData,
  Tests_Support_Passkeys_CreateRegistration_ClientData,
  Tests_Support_Passkeys_CreateRegistration_CredentialIdLength,
  Tests_Support_Passkeys_CreateRegistration_Options,
  Tests_Support_Passkeys_CreateRegistration_Origin,
  Tests_Support_Passkeys_CreateRegistration_PublicKey,
  Tests_Support_Passkeys_CreateRegistration_Returns,
  Tests_Support_Passkeys_CreateRegistration_RpId,
  Tests_Support_Passkeys_EncodeCbor_Bytes,
  Tests_Support_Passkeys_EncodeCbor_Entries,
  Tests_Support_Passkeys_EncodeCbor_Returns,
  Tests_Support_Passkeys_EncodeCbor_Value,
  Tests_Support_Passkeys_EncodeCborHead_Head,
  Tests_Support_Passkeys_EncodeCborHead_Length,
  Tests_Support_Passkeys_EncodeCborHead_MajorType,
  Tests_Support_Passkeys_EncodeCborHead_Returns,
} from '../../types/tests/support/passkeys.d.ts';

/**
 * Passkeys - Create Assertion.
 *
 * Signs sign-in options like a browser and platform authenticator would.
 * The signature counter goes up by one each time.
 *
 * @param {Tests_Support_Passkeys_CreateAssertion_Authenticator} authenticator - Authenticator.
 * @param {Tests_Support_Passkeys_CreateAssertion_Options}       options       - Options.
 * @param {Tests_Support_Passkeys_CreateAssertion_Origin}        origin        - Origin.
 * @param {Tests_Support_Passkeys_CreateAssertion_RpId}          rpId          - Rp id.
 *
 * @returns {Tests_Support_Passkeys_CreateAssertion_Returns}
 *
 * @since 4.0.0
 */
export function createAssertion(authenticator: Tests_Support_Passkeys_CreateAssertion_Authenticator, options: Tests_Support_Passkeys_CreateAssertion_Options, origin: Tests_Support_Passkeys_CreateAssertion_Origin, rpId: Tests_Support_Passkeys_CreateAssertion_RpId): Tests_Support_Passkeys_CreateAssertion_Returns {
  Reflect.set(authenticator, 'signCount', authenticator['signCount'] + 1);

  const authenticatorData: Tests_Support_Passkeys_CreateAssertion_AuthenticatorData = createAuthenticatorData(rpId, 5, authenticator['signCount']);
  const clientData: Tests_Support_Passkeys_CreateAssertion_ClientData = Buffer.from(JSON.stringify({
    challenge: options['challenge'],
    crossOrigin: false,
    origin,
    type: 'webauthn.get',
  }));
  const signature: Tests_Support_Passkeys_CreateAssertion_Signature = sign('sha256', Buffer.concat([
    authenticatorData,
    createHash('sha256').update(clientData).digest(),
  ]), authenticator['keyPair']['privateKey']);

  return {
    authenticatorAttachment: 'platform',
    clientExtensionResults: {},
    id: authenticator['credentialId'].toString('base64url'),
    rawId: authenticator['credentialId'].toString('base64url'),
    response: {
      authenticatorData: authenticatorData.toString('base64url'),
      clientDataJSON: clientData.toString('base64url'),
      signature: signature.toString('base64url'),
      userHandle: authenticator['userHandle'],
    },
    type: 'public-key',
  };
}

/**
 * Passkeys - Create Authenticator.
 *
 * Creates a software passkey with a P-256 key pair and a random credential ID.
 * Its user handle is filled in once registration options name the account.
 *
 * @returns {Tests_Support_Passkeys_CreateAuthenticator_Returns}
 *
 * @since 4.0.0
 */
export function createAuthenticator(): Tests_Support_Passkeys_CreateAuthenticator_Returns {
  return {
    credentialId: randomBytes(16),
    keyPair: generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
    }),
    signCount: 0,
    userHandle: undefined,
  };
}

/**
 * Passkeys - Create Registration.
 *
 * Answers registration options like a browser and platform authenticator would.
 * The options' user ID becomes the authenticator's user handle for later sign-ins.
 *
 * @param {Tests_Support_Passkeys_CreateRegistration_Authenticator} authenticator - Authenticator.
 * @param {Tests_Support_Passkeys_CreateRegistration_Options}       options       - Options.
 * @param {Tests_Support_Passkeys_CreateRegistration_Origin}        origin        - Origin.
 *
 * @returns {Tests_Support_Passkeys_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
export function createRegistration(authenticator: Tests_Support_Passkeys_CreateRegistration_Authenticator, options: Tests_Support_Passkeys_CreateRegistration_Options, origin: Tests_Support_Passkeys_CreateRegistration_Origin): Tests_Support_Passkeys_CreateRegistration_Returns {
  const publicKey: Tests_Support_Passkeys_CreateRegistration_PublicKey = authenticator['keyPair']['publicKey'].export({
    format: 'jwk',
  });
  const credentialIdLength: Tests_Support_Passkeys_CreateRegistration_CredentialIdLength = Buffer.alloc(2);
  const rpId: Tests_Support_Passkeys_CreateRegistration_RpId = String(Reflect.get(Object(options['rp']), 'id'));

  Reflect.set(authenticator, 'userHandle', String(Reflect.get(Object(options['user']), 'id')));

  credentialIdLength.writeUInt16BE(authenticator['credentialId'].length, 0);

  const attested: Tests_Support_Passkeys_CreateRegistration_Attested = Buffer.concat([
    Buffer.alloc(16),
    credentialIdLength,
    authenticator['credentialId'],
    encodeCbor(new Map<Tests_Support_Passkeys_CborValue, Tests_Support_Passkeys_CborValue>([
      [
        1,
        2,
      ],
      [
        3,
        -7,
      ],
      [
        -1,
        1,
      ],
      [
        -2,
        Buffer.from(publicKey['x'] ?? '', 'base64url'),
      ],
      [
        -3,
        Buffer.from(publicKey['y'] ?? '', 'base64url'),
      ],
    ])),
  ]);
  const authenticatorData: Tests_Support_Passkeys_CreateRegistration_AuthenticatorData = createAuthenticatorData(rpId, 69, authenticator['signCount'], attested);
  const attestationObject: Tests_Support_Passkeys_CreateRegistration_AttestationObject = encodeCbor(new Map<Tests_Support_Passkeys_CborValue, Tests_Support_Passkeys_CborValue>([
    [
      'fmt',
      'none',
    ],
    [
      'attStmt',
      new Map(),
    ],
    [
      'authData',
      authenticatorData,
    ],
  ]));
  const clientData: Tests_Support_Passkeys_CreateRegistration_ClientData = Buffer.from(JSON.stringify({
    challenge: options['challenge'],
    crossOrigin: false,
    origin,
    type: 'webauthn.create',
  }));

  return {
    authenticatorAttachment: 'platform',
    clientExtensionResults: {},
    id: authenticator['credentialId'].toString('base64url'),
    rawId: authenticator['credentialId'].toString('base64url'),
    response: {
      attestationObject: attestationObject.toString('base64url'),
      clientDataJSON: clientData.toString('base64url'),
      transports: ['internal'],
    },
    type: 'public-key',
  };
}

/**
 * Passkeys - Create Authenticator Data.
 *
 * Builds the RP ID hash, flags, and counter that start every authenticator response.
 * Registrations also carry the attested credential.
 *
 * @param {Tests_Support_Passkeys_CreateAuthenticatorData_RpId}      rpId       - Rp id.
 * @param {Tests_Support_Passkeys_CreateAuthenticatorData_Flags}     flags      - Flags.
 * @param {Tests_Support_Passkeys_CreateAuthenticatorData_SignCount} signCount  - Sign count.
 * @param {Tests_Support_Passkeys_CreateAuthenticatorData_Attested}  [attested] - Attested.
 *
 * @returns {Tests_Support_Passkeys_CreateAuthenticatorData_Returns}
 *
 * @since 4.0.0
 */
function createAuthenticatorData(rpId: Tests_Support_Passkeys_CreateAuthenticatorData_RpId, flags: Tests_Support_Passkeys_CreateAuthenticatorData_Flags, signCount: Tests_Support_Passkeys_CreateAuthenticatorData_SignCount, attested?: Tests_Support_Passkeys_CreateAuthenticatorData_Attested): Tests_Support_Passkeys_CreateAuthenticatorData_Returns {
  const counter: Tests_Support_Passkeys_CreateAuthenticatorData_Counter = Buffer.alloc(4);

  counter.writeUInt32BE(signCount, 0);

  return Buffer.concat([
    createHash('sha256').update(rpId).digest(),
    Buffer.from([flags]),
    counter,
    ...((attested === undefined) ? [] : [attested]),
  ]);
}

/**
 * Passkeys - Encode Cbor.
 *
 * Encodes the small CBOR subset used by attestation objects and COSE keys.
 * Integers, text, bytes, and maps are enough for a none attestation.
 *
 * @param {Tests_Support_Passkeys_EncodeCbor_Value} value - Value.
 *
 * @returns {Tests_Support_Passkeys_EncodeCbor_Returns}
 *
 * @since 4.0.0
 */
function encodeCbor(value: Tests_Support_Passkeys_EncodeCbor_Value): Tests_Support_Passkeys_EncodeCbor_Returns {
  if (typeof value === 'number') {
    return (value >= 0) ? encodeCborHead(0, value) : encodeCborHead(1, -1 - value);
  }

  if (typeof value === 'string') {
    const bytes: Tests_Support_Passkeys_EncodeCbor_Bytes = Buffer.from(value, 'utf8');

    return Buffer.concat([
      encodeCborHead(3, bytes.length),
      bytes,
    ]);
  }

  if (value instanceof Uint8Array) {
    return Buffer.concat([
      encodeCborHead(2, value.length),
      Buffer.from(value),
    ]);
  }

  const entries: Tests_Support_Passkeys_EncodeCbor_Entries = [...value.entries()];

  return Buffer.concat([
    encodeCborHead(5, entries.length),
    ...entries.flatMap((entry) => [
      encodeCbor(entry[0]),
      encodeCbor(entry[1]),
    ]),
  ]);
}

/**
 * Passkeys - Encode Cbor Head.
 *
 * Encodes one CBOR major type and length the way authenticators do.
 * Lengths up to 65,535 are enough for these responses.
 *
 * @param {Tests_Support_Passkeys_EncodeCborHead_MajorType} majorType - Major type.
 * @param {Tests_Support_Passkeys_EncodeCborHead_Length}    length    - Length.
 *
 * @returns {Tests_Support_Passkeys_EncodeCborHead_Returns}
 *
 * @since 4.0.0
 */
function encodeCborHead(majorType: Tests_Support_Passkeys_EncodeCborHead_MajorType, length: Tests_Support_Passkeys_EncodeCborHead_Length): Tests_Support_Passkeys_EncodeCborHead_Returns {
  if (length < 24) {
    return Buffer.from([(majorType * 32) + length]);
  }

  if (length < 256) {
    return Buffer.from([
      (majorType * 32) + 24,
      length,
    ]);
  }

  const head: Tests_Support_Passkeys_EncodeCborHead_Head = Buffer.alloc(3);

  head.writeUInt8((majorType * 32) + 25, 0);

  head.writeUInt16BE(length, 1);

  return head;
}
