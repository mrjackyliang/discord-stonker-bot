import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Pushover_Runner_BuildRequest_Payload,
  Lib_Notifiers_Pushover_Runner_BuildRequest_Returns,
  Lib_Notifiers_Pushover_Runner_Constructor_Target,
  Lib_Notifiers_Pushover_Runner_Definition,
  Lib_Notifiers_Pushover_Runner_Send_Dependencies,
  Lib_Notifiers_Pushover_Runner_Send_Payload,
  Lib_Notifiers_Pushover_Runner_Send_Returns,
  Lib_Notifiers_Pushover_Runner_Target,
  Lib_Notifiers_Pushover_Runner_Validate_Key,
  Lib_Notifiers_Pushover_Runner_Validate_Returns,
  Lib_Notifiers_Pushover_Runner_Validate_Value,
} from '../../types/lib/notifiers/pushover.d.ts';

/**
 * Pushover.
 *
 * Owns Pushover credentials, endpoint, and message request construction.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Pushover - Definition.
   *
   * Describes the two sealed credentials required by Pushover.
   * Their values remain free-form within the established limits.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Pushover_Runner_Definition = {
    fields: [
      {
        invalid: 'Check this value.',
        key: 'userKey',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the user key.',
        required: true,
        secret: true,
      },
      {
        invalid: 'Check this value.',
        key: 'appToken',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the app token.',
        required: true,
        secret: true,
      },
    ],
    label: 'Pushover',
  };

  /**
   * Pushover - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Pushover_Runner_Target;

  /**
   * Pushover - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Pushover_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Pushover_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Pushover - Build Request.
   *
   * Builds the Pushover message request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Pushover_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Pushover_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Pushover_Runner_BuildRequest_Payload): Lib_Notifiers_Pushover_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        message: payload['notification']['message'],
        priority: {
          default: 0,
          high: 1,
          low: -1,
        }[payload['notification']['priority']],
        title: payload['title'],
        token: this.#target['secrets']['appToken'] ?? '',
        user: this.#target['secrets']['userKey'] ?? '',
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: 'https://api.pushover.net/1/messages.json',
    };
  }

  /**
   * Pushover - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Pushover_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Pushover_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Pushover_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Pushover_Runner_Send_Payload, dependencies: Lib_Notifiers_Pushover_Runner_Send_Dependencies): Lib_Notifiers_Pushover_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Pushover - Validate.
   *
   * Keeps both Pushover credentials as free-form text as before the split.
   * The schema layer applies required and maximum-length checks.
   *
   * @param {Lib_Notifiers_Pushover_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Pushover_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Pushover_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Pushover_Runner_Validate_Key, value: Lib_Notifiers_Pushover_Runner_Validate_Value): Lib_Notifiers_Pushover_Runner_Validate_Returns {
    void key;
    void value;

    return true;
  }
}
