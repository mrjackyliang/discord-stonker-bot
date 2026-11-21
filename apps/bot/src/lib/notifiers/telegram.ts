import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Telegram_Runner_BuildRequest_Payload,
  Lib_Notifiers_Telegram_Runner_BuildRequest_Returns,
  Lib_Notifiers_Telegram_Runner_Constructor_Target,
  Lib_Notifiers_Telegram_Runner_Definition,
  Lib_Notifiers_Telegram_Runner_Send_Dependencies,
  Lib_Notifiers_Telegram_Runner_Send_Payload,
  Lib_Notifiers_Telegram_Runner_Send_Returns,
  Lib_Notifiers_Telegram_Runner_Target,
  Lib_Notifiers_Telegram_Runner_Validate_Key,
  Lib_Notifiers_Telegram_Runner_Validate_Returns,
  Lib_Notifiers_Telegram_Runner_Validate_Value,
} from '../../types/lib/notifiers/telegram.d.ts';

/**
 * Telegram.
 *
 * Owns Telegram bot authentication, endpoint, and request construction.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Telegram - Definition.
   *
   * Describes the sealed bot token and plain chat identifier.
   * Their free-form validation behavior remains unchanged.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Telegram_Runner_Definition = {
    fields: [
      {
        invalid: 'Check this value.',
        key: 'botToken',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the bot token.',
        required: true,
        secret: true,
      },
      {
        invalid: 'Check this value.',
        key: 'chatId',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the chat ID.',
        required: true,
        secret: false,
      },
    ],
    label: 'Telegram',
  };

  /**
   * Telegram - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Telegram_Runner_Target;

  /**
   * Telegram - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Telegram_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Telegram_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Telegram - Build Request.
   *
   * Builds the Telegram sendMessage request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Telegram_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Telegram_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Telegram_Runner_BuildRequest_Payload): Lib_Notifiers_Telegram_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        chat_id: this.#target['settings']['chatId'] ?? '',
        disable_web_page_preview: true,
        text: [
          payload['title'],
          '',
          payload['notification']['message'],
        ].join('\n'),
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: `https://api.telegram.org/bot${this.#target['secrets']['botToken'] ?? ''}/sendMessage`,
    };
  }

  /**
   * Telegram - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Telegram_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Telegram_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Telegram_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Telegram_Runner_Send_Payload, dependencies: Lib_Notifiers_Telegram_Runner_Send_Dependencies): Lib_Notifiers_Telegram_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Telegram - Validate.
   *
   * Keeps the bot token and chat identifier as free-form text as before.
   * The schema layer applies required and maximum-length checks.
   *
   * @param {Lib_Notifiers_Telegram_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Telegram_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Telegram_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Telegram_Runner_Validate_Key, value: Lib_Notifiers_Telegram_Runner_Validate_Value): Lib_Notifiers_Telegram_Runner_Validate_Returns {
    void key;
    void value;

    return true;
  }
}
