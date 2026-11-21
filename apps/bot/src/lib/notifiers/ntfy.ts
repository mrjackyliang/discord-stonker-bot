import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Ntfy_Runner_BuildRequest_Bearer,
  Lib_Notifiers_Ntfy_Runner_BuildRequest_Payload,
  Lib_Notifiers_Ntfy_Runner_BuildRequest_Returns,
  Lib_Notifiers_Ntfy_Runner_BuildRequest_Topic,
  Lib_Notifiers_Ntfy_Runner_Constructor_Target,
  Lib_Notifiers_Ntfy_Runner_Definition,
  Lib_Notifiers_Ntfy_Runner_ParseTopic_Returns,
  Lib_Notifiers_Ntfy_Runner_ParseTopic_Segments,
  Lib_Notifiers_Ntfy_Runner_ParseTopic_Topic,
  Lib_Notifiers_Ntfy_Runner_ParseTopic_Url,
  Lib_Notifiers_Ntfy_Runner_ParseTopic_Value,
  Lib_Notifiers_Ntfy_Runner_Send_Dependencies,
  Lib_Notifiers_Ntfy_Runner_Send_Payload,
  Lib_Notifiers_Ntfy_Runner_Send_Returns,
  Lib_Notifiers_Ntfy_Runner_Target,
  Lib_Notifiers_Ntfy_Runner_Validate_Key,
  Lib_Notifiers_Ntfy_Runner_Validate_Returns,
  Lib_Notifiers_Ntfy_Runner_Validate_Value,
} from '../../types/lib/notifiers/ntfy.d.ts';

/**
 * Ntfy.
 *
 * Owns ntfy topic validation, URL parsing, authentication, and JSON requests.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Ntfy - Definition.
   *
   * Describes the topic URL and optional sealed access token.
   * Validation messages stay beside the adapter rules.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Ntfy_Runner_Definition = {
    fields: [
      {
        invalid: 'Use the full topic URL, like https://ntfy.sh/my-alerts.',
        key: 'url',
        kind: 'ntfy-topic-url',
        maximum: 2048,
        missing: 'Enter the topic URL.',
        required: true,
        secret: false,
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
    label: 'ntfy',
  };

  /**
   * Ntfy - Target.
   *
   * Keeps the destination values used to build each request.
   * Secrets remain inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Ntfy_Runner_Target;

  /**
   * Ntfy - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Ntfy_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Ntfy - Build Request.
   *
   * Splits the configured topic URL and builds ntfy's JSON publish request.
   * Tests use this boundary to lock its exact HTTP shape.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_BuildRequest_Returns}
   *
   * @since 4.2.1
   */
  public buildRequest(payload: Lib_Notifiers_Ntfy_Runner_BuildRequest_Payload): Lib_Notifiers_Ntfy_Runner_BuildRequest_Returns {
    const topic: Lib_Notifiers_Ntfy_Runner_BuildRequest_Topic = Runner.parseTopic(this.#target['settings']['url'] ?? '');
    const bearer: Lib_Notifiers_Ntfy_Runner_BuildRequest_Bearer = (this.#target['secrets']['token'] === undefined) ? {} : { Authorization: `Bearer ${this.#target['secrets']['token']}` };

    return {
      body: JSON.stringify({
        message: payload['notification']['message'],
        priority: payload['webhook']['priority'],
        tags: payload['notification']['tags'],
        title: payload['title'],
        topic: topic['topic'],
      }),
      headers: {
        'Content-Type': 'application/json',
        ...bearer,
      },
      method: 'POST',
      url: topic['server'],
    };
  }

  /**
   * Ntfy - Send.
   *
   * Sends the adapter request through the common HTTP delivery path.
   * The shared path preserves timeout and error behavior.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Ntfy_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Ntfy_Runner_Send_Payload, dependencies: Lib_Notifiers_Ntfy_Runner_Send_Dependencies): Lib_Notifiers_Ntfy_Runner_Send_Returns {
    return HttpDelivery.send(this.buildRequest(payload), dependencies['fetch']);
  }

  /**
   * Ntfy - Validate.
   *
   * Requires an absolute HTTP or HTTPS URL with a final topic segment.
   * The optional access token remains free-form text.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Ntfy_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Ntfy_Runner_Validate_Key, value: Lib_Notifiers_Ntfy_Runner_Validate_Value): Lib_Notifiers_Ntfy_Runner_Validate_Returns {
    if (key === 'url') {
      return HttpDelivery.isHttpUrl(value, [
        'http:',
        'https:',
      ]) && Runner.parseTopic(value)['topic'] !== '';
    }

    return true;
  }

  /**
   * Ntfy - Parse Topic.
   *
   * Splits a topic URL into the server address and decoded topic name.
   * Publishing as JSON keeps non-English titles intact.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_ParseTopic_Value} value - Value.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_ParseTopic_Returns}
   *
   * @since 4.2.1
   */
  private static parseTopic(value: Lib_Notifiers_Ntfy_Runner_ParseTopic_Value): Lib_Notifiers_Ntfy_Runner_ParseTopic_Returns {
    try {
      const url: Lib_Notifiers_Ntfy_Runner_ParseTopic_Url = new URL(value);
      const segments: Lib_Notifiers_Ntfy_Runner_ParseTopic_Segments = url.pathname.split('/').filter((segment) => segment !== '');
      const topic: Lib_Notifiers_Ntfy_Runner_ParseTopic_Topic = segments.pop() ?? '';

      url.pathname = `/${segments.join('/')}`;
      url.search = '';
      url.hash = '';

      return {
        server: url.toString(),
        topic: decodeURIComponent(topic),
      };
    } catch {
      return {
        server: '',
        topic: '',
      };
    }
  }
}
