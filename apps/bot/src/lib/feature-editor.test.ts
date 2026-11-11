import {
  describe,
  expect,
  it,
} from 'vitest';

import { getFeatureCatalog } from './feature-catalog.js';
import {
  getFeatureEditor,
  getFeatureExample,
  getMessageVariables,
} from './feature-editor.js';

import type { Lib_FeatureEditor_Test_Editor } from '../types/lib/feature-editor.d.ts';

/**
 * Feature Editor - Feature Editor.
 *
 * Checks the form description built from each feature's schema and its decorations.
 * The control panel renders every feature from it.
 *
 * @since 4.0.0
 */
describe('feature editor', () => {
  it('describes every catalog feature as a titled JSON Schema', () => {
    for (const definition of getFeatureCatalog()) {
      const editor: Lib_FeatureEditor_Test_Editor = getFeatureEditor(definition['key']);

      expect(editor).toMatchObject({
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        description: definition['description'],
        title: definition['name'],
      });

      if (editor['type'] === 'object') {
        expect(Array.isArray(editor['x-sections'])).toBe(true);
      } else {
        expect(editor['type']).toBe('array');

        expect(typeof editor['x-item-label']).toBe('string');
      }
    }

    return;
  });

  it('returns a copy the caller may change', () => {
    const editor: Lib_FeatureEditor_Test_Editor = getFeatureEditor('anti-raid');

    Reflect.set(editor, 'title', 'Changed');

    expect(getFeatureEditor('anti-raid')['title']).toBe('Anti-raid');

    return;
  });

  it('orders and explains the sections of object features', () => {
    expect(getFeatureEditor('web-applications')['x-sections']).toEqual([
      {
        description: 'Create limited Discord invites from a protected public page.',
        key: 'invite-generator',
        title: 'Invite page',
      },
      {
        description: 'Verify incoming services, map their fields, and post a Discord message.',
        key: 'map-webhooks',
        title: 'Incoming webhooks',
      },
    ]);

    return;
  });

  it('marks pickers, secrets, and repeatable rows', () => {
    expect(getFeatureEditor('message-proxies')).toMatchObject({
      'items': {
        properties: {
          channel: {
            'properties': {
              'channel-id': {
                'title': 'Discord channel',
                'x-widget': 'channel',
              },
            },
            'x-inline': true,
          },
          replacements: {
            'items': {
              properties: {
                pattern: {
                  'x-widget': 'pattern',
                },
              },
            },
            'x-item-label': 'Replacement',
          },
          webhook: {
            properties: {
              'webhook-url': {
                'title': 'Webhook URL',
                'x-widget': 'secret',
              },
            },
          },
        },
      },
      'x-item-label': 'Proxy',
      'x-item-title-key': 'name',
    });

    expect(getFeatureEditor('toggle-perms')).toMatchObject({
      items: {
        properties: {
          'toggle-on': {
            properties: {
              'time-zone': {
                'x-widget': 'time-zone',
              },
            },
          },
          'toggles': {
            items: {
              properties: {
                permissions: {
                  items: {
                    properties: {
                      'target-type': {
                        'x-enum-labels': {
                          member: 'Member',
                          role: 'Role',
                        },
                      },
                      'user-or-role-id': {
                        'x-widget': 'discord-id',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return;
  });

  it('offers the starter settings as an example with every secret emptied', () => {
    expect(getFeatureExample('message-proxies', {
      features: {
        'message-proxies': {
          configuration: [{
            name: 'Announcements',
            webhook: {
              'webhook-url': {
                $secret: 'legacy:message-proxies.0.webhook.webhook-url',
              },
            },
          }],
          enabled: false,
        },
      },
    })).toEqual([{
      name: 'Announcements',
      webhook: {
        'webhook-url': {
          $secret: '',
        },
      },
    }]);

    expect(getFeatureExample('anti-raid', {
      features: {},
    })).toBeNull();

    expect(getFeatureExample('anti-raid', {})).toBeNull();

    return;
  });

  it('lists only the variables rendered by that feature', () => {
    expect(getMessageVariables()).toHaveLength(18);

    expect(getFeatureEditor('anti-raid')).toMatchObject({
      properties: {
        'membership-gate': {
          properties: {
            payload: {
              properties: {
                content: {
                  'title': 'Text',
                  'x-variables': getMessageVariables().filter((variable) => [
                    '%GUILD_NAME%',
                    '%MEMBER_MENTION%',
                    '%YEAR%',
                  ].includes(variable['token'])),
                  'x-widget': 'variables',
                },
              },
            },
          },
        },
      },
    });

    expect(JSON.stringify(getFeatureEditor('anti-raid'))).not.toContain('%ITEM_LINK%');

    return;
  });

  return;
});
