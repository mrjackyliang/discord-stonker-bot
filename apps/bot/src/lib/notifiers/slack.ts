import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Slack_Runner_BuildRequest_Payload,
  Lib_Notifiers_Slack_Runner_BuildRequest_Returns,
  Lib_Notifiers_Slack_Runner_Constructor_Target,
  Lib_Notifiers_Slack_Runner_Definition,
  Lib_Notifiers_Slack_Runner_EscapeSlack_Returns,
  Lib_Notifiers_Slack_Runner_EscapeSlack_Value,
  Lib_Notifiers_Slack_Runner_Send_Dependencies,
  Lib_Notifiers_Slack_Runner_Send_Payload,
  Lib_Notifiers_Slack_Runner_Send_Returns,
  Lib_Notifiers_Slack_Runner_Target,
  Lib_Notifiers_Slack_Runner_Validate_Key,
  Lib_Notifiers_Slack_Runner_Validate_Returns,
  Lib_Notifiers_Slack_Runner_Validate_Value,
} from '../../types/lib/notifiers/slack.d.ts';

/**
 * Slack.
 *
 * Owns Slack webhook validation, escaping, and request construction.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Slack - Definition.
   *
   * Describes the sealed Slack incoming-webhook URL.
   * Its validation wording stays beside the adapter rule.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Slack_Runner_Definition = {
    fields: [{
      invalid: 'Use a Slack webhook URL. It starts with https://hooks.slack.com/.',
      key: 'webhookUrl',
      kind: 'slack-webhook',
      maximum: 2048,
      missing: 'Enter the webhook URL.',
      required: true,
      secret: true,
    }],
    label: 'Slack',
  };

  /**
   * Slack - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Slack_Runner_Target;

  /**
   * Slack - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Slack_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Slack_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Slack - Build Request.
   *
   * Builds the Slack webhook request without sending it.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Slack_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Slack_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Slack_Runner_BuildRequest_Payload): Lib_Notifiers_Slack_Runner_BuildRequest_Returns {
    return {
      body: JSON.stringify({
        text: [
          `*${Runner.escapeSlack(payload['title'])}*`,
          Runner.escapeSlack(payload['notification']['message']),
        ].join('\n'),
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: this.#target['secrets']['webhookUrl'] ?? '',
    };
  }

  /**
   * Slack - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Slack_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Slack_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Slack_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Slack_Runner_Send_Payload, dependencies: Lib_Notifiers_Slack_Runner_Send_Dependencies): Lib_Notifiers_Slack_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Slack - Validate.
   *
   * Accepts only Slack's established incoming-webhook host prefix.
   * Required and maximum-length checks remain in the shared schema layer.
   *
   * @param {Lib_Notifiers_Slack_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Slack_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Slack_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Slack_Runner_Validate_Key, value: Lib_Notifiers_Slack_Runner_Validate_Value): Lib_Notifiers_Slack_Runner_Validate_Returns {
    if (key === 'webhookUrl') {
      return value.startsWith('https://hooks.slack.com/');
    }

    return true;
  }

  /**
   * Slack - Escape Slack.
   *
   * Escapes the three characters Slack treats as markup in message text.
   * Everything else is sent as written.
   *
   * @param {Lib_Notifiers_Slack_Runner_EscapeSlack_Value} value - Value.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Slack_Runner_EscapeSlack_Returns}
   *
   * @since 4.2.1
   */
  private static escapeSlack(value: Lib_Notifiers_Slack_Runner_EscapeSlack_Value): Lib_Notifiers_Slack_Runner_EscapeSlack_Returns {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
