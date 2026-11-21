import { describe, expect, it } from 'vitest';

import { Runner as EmailNotifier } from '../../../src/lib/notifiers/email.js';
import { createPayload } from './fixtures.js';

/**
 * Email - Email Adapter.
 *
 * Locks SMTP option construction and email-specific validation rules.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Email adapter', () => {
  it('builds the exact SMTP options', () => {
    expect(new EmailNotifier({
      secrets: { password: 'smtp-password' },
      service: 'email',
      settings: {
        from: 'alerts@example.com',
        host: 'smtp.example.com',
        port: '587',
        security: 'starttls',
        to: 'owner@example.com, backup@example.com',
        username: 'alerts',
      },
    }).buildOptions(createPayload())).toEqual({
      from: 'alerts@example.com',
      host: 'smtp.example.com',
      password: 'smtp-password',
      port: 587,
      security: 'starttls',
      subject: 'Stonker Bot for Discord: Alert',
      text: 'Message <&>.',
      to: [
        'owner@example.com',
        'backup@example.com',
      ],
      username: 'alerts',
    });

    return;
  });

  it('validates SMTP fields', () => {
    expect(EmailNotifier.validate('port', '587')).toBe(true);

    expect(EmailNotifier.validate('port', '0587')).toBe(false);

    expect(EmailNotifier.validate('security', 'starttls')).toBe(true);

    expect(EmailNotifier.validate('security', 'ssl')).toBe(false);

    expect(EmailNotifier.validate('from', 'alerts@example.com')).toBe(true);

    expect(EmailNotifier.validate('to', 'owner@example.com,backup@example.com')).toBe(true);

    return;
  });

  return;
});
