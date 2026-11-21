import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Apprise_Runner_BuildRequest_Payload,
  Lib_Notifiers_Apprise_Runner_BuildRequest_Returns,
  Lib_Notifiers_Apprise_Runner_Constructor_Target,
  Lib_Notifiers_Apprise_Runner_Definition,
  Lib_Notifiers_Apprise_Runner_Send_Dependencies,
  Lib_Notifiers_Apprise_Runner_Send_Payload,
  Lib_Notifiers_Apprise_Runner_Send_Returns,
  Lib_Notifiers_Apprise_Runner_Target,
  Lib_Notifiers_Apprise_Runner_Validate_Key,
  Lib_Notifiers_Apprise_Runner_Validate_Returns,
  Lib_Notifiers_Apprise_Runner_Validate_Value,
} from '../../types/lib/notifiers/apprise.d.ts';

/**
 * Apprise.
 *
 * Owns Apprise field validation and the exact JSON request sent to its API.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Apprise - Definition.
   *
   * Describes the fields stored for an Apprise destination.
   * Validation messages stay beside the adapter rule that produces them.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Apprise_Runner_Definition = {
    fields: [
      {
        invalid: 'Use an http:// or https:// URL.',
        key: 'url',
        kind: 'http-url',
        maximum: 2048,
        missing: 'Enter the Apprise URL.',
        required: true,
        secret: true,
      },
      {
        invalid: 'Check this value.',
        key: 'urls',
        kind: 'text',
        maximum: 4096,
        missing: '',
        required: false,
        secret: true,
      },
    ],
    label: 'Apprise',
  };

  /**
   * Apprise - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Apprise_Runner_Target;

  /**
   * Apprise - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Apprise_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Apprise_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Apprise - Build Request.
   *
   * Builds the Apprise request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Apprise_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Apprise_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Apprise_Runner_BuildRequest_Payload): Lib_Notifiers_Apprise_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        body: payload['notification']['message'],
        title: payload['title'],
        type: (payload['notification']['priority'] === 'high') ? 'warning' : 'info',
        ...((this.#target['secrets']['urls'] === undefined) ? {} : { urls: this.#target['secrets']['urls'] }),
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: this.#target['secrets']['url'] ?? '',
    };
  }

  /**
   * Apprise - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Apprise_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Apprise_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Apprise_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Apprise_Runner_Send_Payload, dependencies: Lib_Notifiers_Apprise_Runner_Send_Dependencies): Lib_Notifiers_Apprise_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Apprise - Validate.
   *
   * Applies Apprise's URL rule while free-form forwarding URLs stay text.
   * The schema layer owns required and maximum-length checks.
   *
   * @param {Lib_Notifiers_Apprise_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Apprise_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Apprise_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Apprise_Runner_Validate_Key, value: Lib_Notifiers_Apprise_Runner_Validate_Value): Lib_Notifiers_Apprise_Runner_Validate_Returns {
    if (key === 'url') {
      return HttpDelivery.isHttpUrl(value, [
        'http:',
        'https:',
      ]);
    }

    return true;
  }
}
