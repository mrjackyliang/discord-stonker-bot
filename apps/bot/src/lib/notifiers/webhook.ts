import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Webhook_Runner_BuildRequest_Bearer,
  Lib_Notifiers_Webhook_Runner_BuildRequest_Payload,
  Lib_Notifiers_Webhook_Runner_BuildRequest_Returns,
  Lib_Notifiers_Webhook_Runner_Constructor_Target,
  Lib_Notifiers_Webhook_Runner_Definition,
  Lib_Notifiers_Webhook_Runner_Send_Dependencies,
  Lib_Notifiers_Webhook_Runner_Send_Payload,
  Lib_Notifiers_Webhook_Runner_Send_Returns,
  Lib_Notifiers_Webhook_Runner_Target,
  Lib_Notifiers_Webhook_Runner_Validate_Key,
  Lib_Notifiers_Webhook_Runner_Validate_Returns,
  Lib_Notifiers_Webhook_Runner_Validate_Value,
} from '../../types/lib/notifiers/webhook.d.ts';

/**
 * Webhook.
 *
 * Owns generic webhook URL validation, bearer authentication, and JSON delivery.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Webhook - Definition.
   *
   * Describes the sealed webhook URL and optional bearer token.
   * Validation messages stay beside the adapter rules.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Webhook_Runner_Definition = {
    fields: [
      {
        invalid: 'Use an http:// or https:// URL.',
        key: 'url',
        kind: 'http-url',
        maximum: 2048,
        missing: 'Enter the URL.',
        required: true,
        secret: true,
      },
      {
        invalid: 'Check this value.',
        key: 'token',
        kind: 'text',
        maximum: 1024,
        missing: '',
        required: false,
        secret: true,
      },
    ],
    label: 'Webhook',
  };

  /**
   * Webhook - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Webhook_Runner_Target;

  /**
   * Webhook - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Webhook_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Webhook_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Webhook - Build Request.
   *
   * Builds the versioned webhook request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Webhook_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Webhook_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Webhook_Runner_BuildRequest_Payload): Lib_Notifiers_Webhook_Runner_BuildRequest_Returns {
    const bearer: Lib_Notifiers_Webhook_Runner_BuildRequest_Bearer = (this.#target['secrets']['token'] === undefined) ? {} : { Authorization: `Bearer ${this.#target['secrets']['token']}` };

    return {
      body: JSON.stringify(payload['webhook']),
      headers: {
        'Content-Type': 'application/json',
        ...bearer,
      },
      method: 'POST',
      url: this.#target['secrets']['url'] ?? '',
    };
  }

  /**
   * Webhook - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Webhook_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Webhook_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Webhook_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Webhook_Runner_Send_Payload, dependencies: Lib_Notifiers_Webhook_Runner_Send_Dependencies): Lib_Notifiers_Webhook_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Webhook - Validate.
   *
   * Accepts absolute HTTP and HTTPS webhook URLs, including credentialed URLs.
   * The optional token remains free-form text.
   *
   * @param {Lib_Notifiers_Webhook_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Webhook_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Webhook_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Webhook_Runner_Validate_Key, value: Lib_Notifiers_Webhook_Runner_Validate_Value): Lib_Notifiers_Webhook_Runner_Validate_Returns {
    if (key === 'url') {
      return HttpDelivery.isHttpUrl(value, [
        'http:',
        'https:',
      ]);
    }

    return true;
  }
}
