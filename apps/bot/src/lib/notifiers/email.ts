import nodemailer from 'nodemailer';
import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Email_Runner_BuildOptions_Payload,
  Lib_Notifiers_Email_Runner_BuildOptions_Returns,
  Lib_Notifiers_Email_Runner_Constructor_Target,
  Lib_Notifiers_Email_Runner_Definition,
  Lib_Notifiers_Email_Runner_EmailAddressSchema,
  Lib_Notifiers_Email_Runner_IsPort_Port,
  Lib_Notifiers_Email_Runner_IsPort_Returns,
  Lib_Notifiers_Email_Runner_IsPort_Value,
  Lib_Notifiers_Email_Runner_Send_Dependencies,
  Lib_Notifiers_Email_Runner_Send_Payload,
  Lib_Notifiers_Email_Runner_Send_Returns,
  Lib_Notifiers_Email_Runner_SendMail_Options,
  Lib_Notifiers_Email_Runner_SendMail_Returns,
  Lib_Notifiers_Email_Runner_SendMail_Transport,
  Lib_Notifiers_Email_Runner_Target,
  Lib_Notifiers_Email_Runner_Validate_Key,
  Lib_Notifiers_Email_Runner_Validate_Returns,
  Lib_Notifiers_Email_Runner_Validate_Value,
} from '../../types/lib/notifiers/email.d.ts';

/**
 * Email.
 *
 * Owns email validation, SMTP options, authentication, and message delivery.
 * The registry exposes it through the common notifier boundary.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Email - Definition.
   *
   * Describes every stored SMTP field and which value is sealed.
   * Validation messages stay beside the adapter rules.
   *
   * @since 4.2.1
   */
  public static readonly definition: Lib_Notifiers_Email_Runner_Definition = {
    fields: [
      {
        invalid: 'Check this value.',
        key: 'host',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the SMTP server.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Use a port from 1 to 65535.',
        key: 'port',
        kind: 'port',
        maximum: 5,
        missing: 'Enter a port number.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Choose STARTTLS, TLS, or none.',
        key: 'security',
        kind: 'security',
        maximum: 8,
        missing: 'Choose STARTTLS, TLS, or none.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Check this value.',
        key: 'username',
        kind: 'text',
        maximum: 255,
        missing: '',
        required: false,
        secret: false,
      },
      {
        invalid: 'Check this value.',
        key: 'password',
        kind: 'text',
        maximum: 1024,
        missing: '',
        required: false,
        secret: true,
      },
      {
        invalid: 'Use an email address, like alerts@example.com.',
        key: 'from',
        kind: 'email',
        maximum: 255,
        missing: 'Enter the address to send from.',
        required: true,
        secret: false,
      },
      {
        invalid: 'Use email addresses separated by commas.',
        key: 'to',
        kind: 'emails',
        maximum: 1024,
        missing: 'Enter the address to send to.',
        required: true,
        secret: false,
      },
    ],
    label: 'Email',
  };

  /**
   * Email - Email Address Schema.
   *
   * Checks one From or To address with the same Zod email rule as before.
   * Comma-separated recipients are checked one address at a time.
   *
   * @private
   *
   * @since 4.2.1
   */
  static readonly #emailAddressSchema: Lib_Notifiers_Email_Runner_EmailAddressSchema = z.email();

  /**
   * Email - Target.
   *
   * Keeps the destination values used to build each SMTP message.
   * The password remains inside the adapter after the registry creates it.
   *
   * @private
   *
   * @since 4.2.1
   */
  readonly #target: Lib_Notifiers_Email_Runner_Target;

  /**
   * Email - Constructor.
   *
   * Stores one destination so callers only pass a notification to send.
   * The stored config shape remains unchanged.
   *
   * @param {Lib_Notifiers_Email_Runner_Constructor_Target} target - Target.
   *
   * @since 4.2.1
   */
  public constructor(target: Lib_Notifiers_Email_Runner_Constructor_Target) {
    this.#target = target;

    return;
  }

  /**
   * Email - Build Options.
   *
   * Builds the existing SMTP delivery options without opening a connection.
   * Tests use this boundary to lock authentication and message fields.
   *
   * @param {Lib_Notifiers_Email_Runner_BuildOptions_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Email_Runner_BuildOptions_Returns}
   *
   * @since 4.2.1
   */
  public buildOptions(payload: Lib_Notifiers_Email_Runner_BuildOptions_Payload): Lib_Notifiers_Email_Runner_BuildOptions_Returns {
    return {
      from: this.#target['settings']['from'] ?? '',
      host: this.#target['settings']['host'] ?? '',
      password: this.#target['secrets']['password'] ?? '',
      port: Number(this.#target['settings']['port'] ?? '587'),
      security: this.#target['settings']['security'] ?? 'starttls',
      subject: payload['title'],
      text: payload['notification']['message'],
      to: (this.#target['settings']['to'] ?? '').split(',').map((address) => address.trim()).filter((address) => address !== ''),
      username: this.#target['settings']['username'] ?? '',
    };
  }

  /**
   * Email - Send.
   *
   * Sends one message through the injected SMTP boundary and reports failures.
   * The result wording matches HTTP and the previous combined module.
   *
   * @param {Lib_Notifiers_Email_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Email_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Email_Runner_Send_Returns}
   *
   * @since 4.2.1
   */
  public async send(payload: Lib_Notifiers_Email_Runner_Send_Payload, dependencies: Lib_Notifiers_Email_Runner_Send_Dependencies): Lib_Notifiers_Email_Runner_Send_Returns {
    try {
      await dependencies.sendMail(this.buildOptions(payload));

      return { delivered: true };
    } catch (error) {
      return {
        delivered: false,
        message: HttpDelivery.describeError(error),
      };
    }
  }

  /**
   * Email - Send Mail.
   *
   * Sends one plain-text email through the destination's SMTP server.
   * Connecting, greeting, sending, and the socket each time out after ten seconds.
   *
   * @param {Lib_Notifiers_Email_Runner_SendMail_Options} options - Options.
   *
   * @returns {Lib_Notifiers_Email_Runner_SendMail_Returns}
   *
   * @since 4.2.1
   */
  public static async sendMail(options: Lib_Notifiers_Email_Runner_SendMail_Options): Lib_Notifiers_Email_Runner_SendMail_Returns {
    const transport: Lib_Notifiers_Email_Runner_SendMail_Transport = nodemailer.createTransport({
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      host: options['host'],
      ignoreTLS: options['security'] === 'none',
      port: options['port'],
      requireTLS: options['security'] === 'starttls',
      secure: options['security'] === 'tls',
      socketTimeout: 10_000,
      ...((options['username'] === '') ? {} : {
        auth: {
          pass: options['password'],
          user: options['username'],
        },
      }),
    });

    try {
      await transport.sendMail({
        from: options['from'],
        subject: options['subject'],
        text: options['text'],
        to: options['to'],
      });
    } finally {
      transport.close();
    }

    return;
  }

  /**
   * Email - Validate.
   *
   * Applies the established port, security, sender, and recipient rules.
   * Host, username, and password remain free-form text.
   *
   * @param {Lib_Notifiers_Email_Runner_Validate_Key}   key   - Key.
   * @param {Lib_Notifiers_Email_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Email_Runner_Validate_Returns}
   *
   * @since 4.2.1
   */
  public static validate(key: Lib_Notifiers_Email_Runner_Validate_Key, value: Lib_Notifiers_Email_Runner_Validate_Value): Lib_Notifiers_Email_Runner_Validate_Returns {
    switch (key) {
      case 'port': {
        return Runner.isPort(value);
      }

      case 'security': {
        return [
          'none',
          'starttls',
          'tls',
        ].includes(value);
      }

      case 'from': {
        return Runner.#emailAddressSchema.safeParse(value)['success'];
      }

      case 'to': {
        return value.split(',').map((address) => address.trim()).every((address) => Runner.#emailAddressSchema.safeParse(address)['success']);
      }

      default: {
        return true;
      }
    }
  }

  /**
   * Email - Is Port.
   *
   * Checks for a whole port from 1 to 65535 without leading zeroes.
   * Exponential notation and other extra characters remain invalid.
   *
   * @param {Lib_Notifiers_Email_Runner_IsPort_Value} value - Value.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Email_Runner_IsPort_Returns}
   *
   * @since 4.2.1
   */
  private static isPort(value: Lib_Notifiers_Email_Runner_IsPort_Value): Lib_Notifiers_Email_Runner_IsPort_Returns {
    const port: Lib_Notifiers_Email_Runner_IsPort_Port = Number(value);

    return (
      Number.isInteger(port)
      && port >= 1
      && port <= 65535
      && String(port) === value
    );
  }
}
