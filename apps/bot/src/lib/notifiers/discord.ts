import {
  chatPlatformWebhookUrlPrefix,
  isChatPlatformWebhookUrl,
} from '../chat-platform/index.js';
import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Discord_Runner_BuildRequest_Payload,
  Lib_Notifiers_Discord_Runner_BuildRequest_Returns,
  Lib_Notifiers_Discord_Runner_Constructor_Target,
  Lib_Notifiers_Discord_Runner_Definition,
  Lib_Notifiers_Discord_Runner_Send_Dependencies,
  Lib_Notifiers_Discord_Runner_Send_Payload,
  Lib_Notifiers_Discord_Runner_Send_Returns,
  Lib_Notifiers_Discord_Runner_Target,
  Lib_Notifiers_Discord_Runner_Validate_Key,
  Lib_Notifiers_Discord_Runner_Validate_Returns,
  Lib_Notifiers_Discord_Runner_Validate_Value,
} from '../../types/lib/notifiers/discord.d.ts';

/**
 * Discord.
 *
 * Owns Discord webhook validation and embed request construction.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Discord - Definition.
   *
   * Describes the stored Discord webhook field and its validation wording.
   * The URL itself remains sealed as a secret.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Discord_Runner_Definition = {
    fields: [{
      invalid: `Use a Discord webhook URL. It starts with ${chatPlatformWebhookUrlPrefix}.`,
      key: 'webhookUrl',
      kind: 'discord-webhook',
      maximum: 2048,
      missing: 'Enter the webhook URL.',
      required: true,
      secret: true,
    }],
    label: 'Discord',
  };

  /**
   * Discord - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Discord_Runner_Target;

  /**
   * Discord - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Discord_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Discord_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Discord - Build Request.
   *
   * Builds the Discord embed request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Discord_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Discord_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Discord_Runner_BuildRequest_Payload): Lib_Notifiers_Discord_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        embeds: [{
          color: (payload['notification']['priority'] === 'high') ? parseInt('d04437', 16) : parseInt('2f81f7', 16),
          description: payload['notification']['message'],
          timestamp: payload['notification']['occurredAt'],
          title: payload['title'],
        }],
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: this.#target['secrets']['webhookUrl'] ?? '',
    };
  }

  /**
   * Discord - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Discord_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Discord_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Discord_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Discord_Runner_Send_Payload, dependencies: Lib_Notifiers_Discord_Runner_Send_Dependencies): Lib_Notifiers_Discord_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Discord - Validate.
   *
   * Applies the one chat platform webhook URL rule that message routing uses.
   * Required and maximum-length checks remain in the shared schema layer.
   *
   * @param {Lib_Notifiers_Discord_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Discord_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Discord_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Discord_Runner_Validate_Key, value: Lib_Notifiers_Discord_Runner_Validate_Value): Lib_Notifiers_Discord_Runner_Validate_Returns {
    if (key === 'webhookUrl') {
      return isChatPlatformWebhookUrl(value);
    }

    return true;
  }
}
