import { randomUUID } from 'node:crypto';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Matrix_Runner_BuildRequest_Payload,
  Lib_Notifiers_Matrix_Runner_BuildRequest_Returns,
  Lib_Notifiers_Matrix_Runner_Constructor_Target,
  Lib_Notifiers_Matrix_Runner_Definition,
  Lib_Notifiers_Matrix_Runner_HasWhitespace_Returns,
  Lib_Notifiers_Matrix_Runner_HasWhitespace_Value,
  Lib_Notifiers_Matrix_Runner_IsRoomId_Colon,
  Lib_Notifiers_Matrix_Runner_IsRoomId_Returns,
  Lib_Notifiers_Matrix_Runner_IsRoomId_Value,
  Lib_Notifiers_Matrix_Runner_Send_Dependencies,
  Lib_Notifiers_Matrix_Runner_Send_Payload,
  Lib_Notifiers_Matrix_Runner_Send_Returns,
  Lib_Notifiers_Matrix_Runner_Target,
  Lib_Notifiers_Matrix_Runner_Validate_Key,
  Lib_Notifiers_Matrix_Runner_Validate_Returns,
  Lib_Notifiers_Matrix_Runner_Validate_Value,
} from '../../types/lib/notifiers/matrix.d.ts';

/**
 * Matrix.
 *
 * Owns Matrix homeserver and room validation, authentication, and requests.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Matrix - Definition.
   *
   * Describes the homeserver, room ID, and sealed access token.
   * Validation messages stay beside the adapter rules.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Matrix_Runner_Definition = {
    fields: [
      {
        invalid: 'Use an https:// URL.',
        key: 'homeserverUrl',
        kind: 'https-url',
        maximum: 2048,
        missing: 'Enter the homeserver URL.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Use a room ID like !room:example.com.',
        key: 'roomId',
        kind: 'matrix-room',
        maximum: 255,
        missing: 'Enter the room ID.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Check this value.',
        key: 'accessToken',
        kind: 'text',
        maximum: 1024,
        missing: 'Enter the access token.',
        required: true,
        secret: true,
      },
    ],
    label: 'Matrix',
  };

  /**
   * Matrix - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Matrix_Runner_Target;

  /**
   * Matrix - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Matrix_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Matrix_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Matrix - Build Request.
   *
   * Builds the Matrix room-message request with a fresh transaction ID.
   * Tests can inspect every other stable part without a network call.
   *
   * @param {Lib_Notifiers_Matrix_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Matrix_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Matrix_Runner_BuildRequest_Payload): Lib_Notifiers_Matrix_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        body: [
          payload['title'],
          payload['notification']['message'],
        ].join('\n'),
        msgtype: 'm.text',
      }),
      headers: {
        'Authorization': `Bearer ${this.#target['secrets']['accessToken'] ?? ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      url: `${HttpDelivery.trimTrailingSlashes(this.#target['settings']['homeserverUrl'] ?? '')}/_matrix/client/v3/rooms/${encodeURIComponent(this.#target['settings']['roomId'] ?? '')}/send/m.room.message/${randomUUID()}`,
    };
  }

  /**
   * Matrix - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Matrix_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Matrix_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Matrix_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Matrix_Runner_Send_Payload, dependencies: Lib_Notifiers_Matrix_Runner_Send_Dependencies): Lib_Notifiers_Matrix_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Matrix - Validate.
   *
   * Applies Matrix's HTTPS homeserver and concrete room-ID rules.
   * Access tokens remain free-form text with shared length checks.
   *
   * @param {Lib_Notifiers_Matrix_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Matrix_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Matrix_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Matrix_Runner_Validate_Key, value: Lib_Notifiers_Matrix_Runner_Validate_Value): Lib_Notifiers_Matrix_Runner_Validate_Returns {
    if (key === 'homeserverUrl') {
      return HttpDelivery.isHttpUrl(value, ['https:']);
    }

    if (key === 'roomId') {
      return Runner.isRoomId(value);
    }

    return true;
  }

  /**
   * Matrix - Has Whitespace.
   *
   * Checks for spaces, tabs, and line breaks inside a room ID.
   * Matrix room IDs cannot contain any of them.
   *
   * @param {Lib_Notifiers_Matrix_Runner_HasWhitespace_Value} value - Value.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Matrix_Runner_HasWhitespace_Returns}
   *
   * @since 4.2.1
   */
  private static hasWhitespace(value: Lib_Notifiers_Matrix_Runner_HasWhitespace_Value): Lib_Notifiers_Matrix_Runner_HasWhitespace_Returns {
    return [...value].some((character) => character.trim() === '');
  }

  /**
   * Matrix - Is Room ID.
   *
   * Accepts concrete room IDs such as !room:example.com and rejects aliases.
   * The send endpoint requires an ID rather than a hash-prefixed alias.
   *
   * @param {Lib_Notifiers_Matrix_Runner_IsRoomId_Value} value - Value.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Matrix_Runner_IsRoomId_Returns}
   *
   * @since 4.2.1
   */
  private static isRoomId(value: Lib_Notifiers_Matrix_Runner_IsRoomId_Value): Lib_Notifiers_Matrix_Runner_IsRoomId_Returns {
    const colon: Lib_Notifiers_Matrix_Runner_IsRoomId_Colon = value.indexOf(':');

    return (
      value.startsWith('!')
      && colon > 1
      && colon < value.length - 1
      && Runner.hasWhitespace(value) === false
    );
  }
}
