import { Runner as AppriseNotifier } from './apprise.js';
import { Runner as DiscordNotifier } from './discord.js';
import { Runner as EmailNotifier } from './email.js';
import { Runner as GotifyNotifier } from './gotify.js';
import { Runner as MatrixNotifier } from './matrix.js';
import { Runner as NtfyReverseProxyNotifier } from './ntfy-reverse-proxy.js';
import { Runner as NtfyNotifier } from './ntfy.js';
import { Runner as PushoverNotifier } from './pushover.js';
import { Runner as SlackNotifier } from './slack.js';
import { Runner as TelegramNotifier } from './telegram.js';
import { Runner as WebhookNotifier } from './webhook.js';

import type {
  Lib_Notifiers_Registry_Runner_Create_Returns,
  Lib_Notifiers_Registry_Runner_Create_Target,
  Lib_Notifiers_Registry_Runner_CreateHttp_Returns,
  Lib_Notifiers_Registry_Runner_CreateHttp_Target,
  Lib_Notifiers_Registry_Runner_GetDefaultDependencies_Returns,
  Lib_Notifiers_Registry_Runner_GetDefinitions_Returns,
  Lib_Notifiers_Registry_Runner_Validate_Key,
  Lib_Notifiers_Registry_Runner_Validate_Returns,
  Lib_Notifiers_Registry_Runner_Validate_Service,
  Lib_Notifiers_Registry_Runner_Validate_Value,
} from '../../types/lib/notifiers/registry.d.ts';

/**
 * Registry.
 *
 * Selects a project-owned adapter for every stored notification service.
 * Callers never see a third-party URL, request body, or validation rule.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Registry - Create.
   *
   * Returns the adapter for any stored destination, including SMTP email.
   * The public notification sender only uses the shared send boundary.
   *
   * @param {Lib_Notifiers_Registry_Runner_Create_Target} target - Target.
   *
   * @returns {Lib_Notifiers_Registry_Runner_Create_Returns}
   *
   * @since 4.2.1
   */
  public static create(target: Lib_Notifiers_Registry_Runner_Create_Target): Lib_Notifiers_Registry_Runner_Create_Returns {
    if (target['service'] === 'email') {
      return new EmailNotifier(target);
    }

    return Runner.createHttp(target);
  }

  /**
   * Registry - Create HTTP.
   *
   * Returns an HTTP adapter whose exact request can be inspected by tests.
   * Email is intentionally excluded because it uses SMTP.
   *
   * @param {Lib_Notifiers_Registry_Runner_CreateHttp_Target} target - Target.
   *
   * @returns {Lib_Notifiers_Registry_Runner_CreateHttp_Returns}
   *
   * @since 4.2.1
   */
  public static createHttp(target: Lib_Notifiers_Registry_Runner_CreateHttp_Target): Lib_Notifiers_Registry_Runner_CreateHttp_Returns {
    switch (target['service']) {
      case 'apprise': {
        return new AppriseNotifier(target);
      }

      case 'discord': {
        return new DiscordNotifier(target);
      }

      case 'gotify': {
        return new GotifyNotifier(target);
      }

      case 'matrix': {
        return new MatrixNotifier(target);
      }

      case 'ntfy': {
        return new NtfyNotifier(target);
      }

      case 'ntfy-reverse-proxy': {
        return new NtfyReverseProxyNotifier(target);
      }

      case 'pushover': {
        return new PushoverNotifier(target);
      }

      case 'slack': {
        return new SlackNotifier(target);
      }

      case 'telegram': {
        return new TelegramNotifier(target);
      }

      case 'webhook': {
        return new WebhookNotifier(target);
      }

      default: {
        throw new Error('does not have an HTTP request.');
      }
    }
  }

  /**
   * Registry - Get Default Dependencies.
   *
   * Supplies real fetch and SMTP boundaries to the public notification sender.
   * Tests can keep injecting the same dependency shape as before.
   *
   * @returns {Lib_Notifiers_Registry_Runner_GetDefaultDependencies_Returns}
   *
   * @since 4.2.1
   */
  public static getDefaultDependencies(): Lib_Notifiers_Registry_Runner_GetDefaultDependencies_Returns {
    return {
      fetch: (input, init) => fetch(input, init),
      sendMail: EmailNotifier['sendMail'],
    };
  }

  /**
   * Registry - Get Definitions.
   *
   * Collects adapter-owned field metadata under the existing service keys.
   * Stored targets and callers keep the same configuration shape.
   *
   * @returns {Lib_Notifiers_Registry_Runner_GetDefinitions_Returns}
   *
   * @since 4.2.1
   */
  public static getDefinitions(): Lib_Notifiers_Registry_Runner_GetDefinitions_Returns {
    return {
      'apprise': AppriseNotifier['definition'],
      'discord': DiscordNotifier['definition'],
      'email': EmailNotifier['definition'],
      'gotify': GotifyNotifier['definition'],
      'matrix': MatrixNotifier['definition'],
      'ntfy': NtfyNotifier['definition'],
      'ntfy-reverse-proxy': NtfyReverseProxyNotifier['definition'],
      'pushover': PushoverNotifier['definition'],
      'slack': SlackNotifier['definition'],
      'telegram': TelegramNotifier['definition'],
      'webhook': WebhookNotifier['definition'],
    };
  }

  /**
   * Registry - Validate.
   *
   * Routes one field value to the adapter that owns its service rules.
   * Shared schema code still handles blank, required, and maximum checks.
   *
   * @param {Lib_Notifiers_Registry_Runner_Validate_Service} service - Service.
   * @param {Lib_Notifiers_Registry_Runner_Validate_Key}     key     - Key.
   * @param {Lib_Notifiers_Registry_Runner_Validate_Value}   value   - Value.
   *
   * @returns {Lib_Notifiers_Registry_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(service: Lib_Notifiers_Registry_Runner_Validate_Service, key: Lib_Notifiers_Registry_Runner_Validate_Key, value: Lib_Notifiers_Registry_Runner_Validate_Value): Lib_Notifiers_Registry_Runner_Validate_Returns {
    switch (service) {
      case 'apprise': {
        return AppriseNotifier.validate(key, value);
      }

      case 'discord': {
        return DiscordNotifier.validate(key, value);
      }

      case 'email': {
        return EmailNotifier.validate(key, value);
      }

      case 'gotify': {
        return GotifyNotifier.validate(key, value);
      }

      case 'matrix': {
        return MatrixNotifier.validate(key, value);
      }

      case 'ntfy': {
        return NtfyNotifier.validate(key, value);
      }

      case 'ntfy-reverse-proxy': {
        return NtfyReverseProxyNotifier.validate(key, value);
      }

      case 'pushover': {
        return PushoverNotifier.validate(key, value);
      }

      case 'slack': {
        return SlackNotifier.validate(key, value);
      }

      case 'telegram': {
        return TelegramNotifier.validate(key, value);
      }

      case 'webhook': {
        return WebhookNotifier.validate(key, value);
      }

      default: {
        return false;
      }
    }
  }
}
