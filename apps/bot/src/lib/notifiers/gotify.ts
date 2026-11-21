import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Gotify_Runner_BuildRequest_Payload,
  Lib_Notifiers_Gotify_Runner_BuildRequest_Returns,
  Lib_Notifiers_Gotify_Runner_Constructor_Target,
  Lib_Notifiers_Gotify_Runner_Definition,
  Lib_Notifiers_Gotify_Runner_Send_Dependencies,
  Lib_Notifiers_Gotify_Runner_Send_Payload,
  Lib_Notifiers_Gotify_Runner_Send_Returns,
  Lib_Notifiers_Gotify_Runner_Target,
  Lib_Notifiers_Gotify_Runner_Validate_Key,
  Lib_Notifiers_Gotify_Runner_Validate_Returns,
  Lib_Notifiers_Gotify_Runner_Validate_Value,
} from '../../types/lib/notifiers/gotify.d.ts';

/**
 * Gotify.
 *
 * Owns Gotify server validation, authentication, and request construction.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Gotify - Definition.
   *
   * Describes the Gotify server and sealed application token.
   * Validation messages stay beside the adapter rules.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Gotify_Runner_Definition = {
    fields: [
      {
        invalid: 'Use an http:// or https:// URL.',
        key: 'url',
        kind: 'http-url',
        maximum: 2048,
        missing: 'Enter the server URL.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Check this value.',
        key: 'token',
        kind: 'text',
        maximum: 1024,
        missing: 'Enter the app token.',
        required: true,
        secret: true,
      },
    ],
    label: 'Gotify',
  };

  /**
   * Gotify - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Gotify_Runner_Target;

  /**
   * Gotify - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Gotify_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Gotify_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Gotify - Build Request.
   *
   * Builds the Gotify message request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Gotify_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Gotify_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Gotify_Runner_BuildRequest_Payload): Lib_Notifiers_Gotify_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        message: payload['notification']['message'],
        priority: {
          default: 5,
          high: 8,
          low: 2,
        }[payload['notification']['priority']],
        title: payload['title'],
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Gotify-Key': this.#target['secrets']['token'] ?? '',
      },
      method: 'POST',
      url: `${HttpDelivery.trimTrailingSlashes(this.#target['settings']['url'] ?? '')}/message`,
    };
  }

  /**
   * Gotify - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Gotify_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Gotify_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Gotify_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Gotify_Runner_Send_Payload, dependencies: Lib_Notifiers_Gotify_Runner_Send_Dependencies): Lib_Notifiers_Gotify_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Gotify - Validate.
   *
   * Accepts an absolute HTTP or HTTPS Gotify server URL.
   * The token remains free-form text with shared length checks.
   *
   * @param {Lib_Notifiers_Gotify_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Gotify_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Gotify_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Gotify_Runner_Validate_Key, value: Lib_Notifiers_Gotify_Runner_Validate_Value): Lib_Notifiers_Gotify_Runner_Validate_Returns {
    if (key === 'url') {
      return HttpDelivery.isHttpUrl(value, [
        'http:',
        'https:',
      ]);
    }

    return true;
  }
}
