import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  hasRoleDependencyCycle,
  planRoleChanges,
  prepareRoleSyncFeatures,
} from './role-sync-features.js';

import type {
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns,
  Lib_RoleSyncFeatures_Test_CurrentRoleIdentifiers,
  Lib_RoleSyncFeatures_Test_Rules,
} from '../types/lib/role-sync-features.d.ts';

/**
 * Role Sync Features - Role Sync Feature Preparation.
 *
 * Verifies idempotent role plans, cycle rejection, and conditional intents.
 * Runtime Discord mutations remain outside ordinary automated tests.
 *
 * @since 4.0.0
 */
describe('role sync feature preparation', () => {
  it('keeps member access disabled when role synchronization is disabled', () => {
    expect(prepareRoleSyncFeatures({
      features: {
        'sync-roles': {
          configuration: {},
          enabled: false,
        },
      },
    })).toMatchObject({
      activeFeatureKeys: [],
      configurationErrors: [],
      intents: [],
    });

    return;
  });

  it('compiles bounded role rules and requests member access', () => {
    const prepared: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns = prepareRoleSyncFeatures({
      features: {
        'sync-roles': {
          configuration: {
            events: [{
              'has-some-roles': true,
              'name': 'Remove onboarding role',
              'some-roles': [{
                'role-id': '000000000000000001',
              }],
              'to-remove-roles': [{
                'role-id': '000000000000000002',
              }],
            }],
            timeout: 2,
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['sync-roles']);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([GatewayIntentBits.GuildMembers]);

    return;
  });

  it('plans additions and removals without repeating satisfied operations', () => {
    const rules: Lib_RoleSyncFeatures_Test_Rules = [
      {
        addRoleIdentifiers: [],
        hasSomeRoles: true,
        name: 'Remove onboarding role',
        removeRoleIdentifiers: ['000000000000000002'],
        triggerRoleIdentifiers: ['000000000000000001'],
      },
      {
        addRoleIdentifiers: ['000000000000000002'],
        hasSomeRoles: false,
        name: 'Restore onboarding role',
        removeRoleIdentifiers: [],
        triggerRoleIdentifiers: ['000000000000000001'],
      },
    ];
    const verifiedRoles: Lib_RoleSyncFeatures_Test_CurrentRoleIdentifiers = new Set([
      '000000000000000001',
      '000000000000000002',
    ]);
    const unverifiedRoles: Lib_RoleSyncFeatures_Test_CurrentRoleIdentifiers = new Set();

    expect(planRoleChanges(rules, verifiedRoles)).toMatchObject({
      addRoleIdentifiers: [],
      conflictingRoleIdentifiers: [],
      removeRoleIdentifiers: ['000000000000000002'],
    });

    expect(planRoleChanges(rules, unverifiedRoles)).toMatchObject({
      addRoleIdentifiers: ['000000000000000002'],
      conflictingRoleIdentifiers: [],
      removeRoleIdentifiers: [],
    });

    return;
  });

  it('reports a role that active rules try to add and remove', () => {
    const rules: Lib_RoleSyncFeatures_Test_Rules = [
      {
        addRoleIdentifiers: ['000000000000000003'],
        hasSomeRoles: false,
        name: 'Add alerts',
        removeRoleIdentifiers: [],
        triggerRoleIdentifiers: ['000000000000000001'],
      },
      {
        addRoleIdentifiers: [],
        hasSomeRoles: false,
        name: 'Remove alerts',
        removeRoleIdentifiers: ['000000000000000003'],
        triggerRoleIdentifiers: ['000000000000000002'],
      },
    ];

    expect(planRoleChanges(rules, new Set())).toMatchObject({
      addRoleIdentifiers: [],
      conflictingRoleIdentifiers: ['000000000000000003'],
      removeRoleIdentifiers: [],
    });

    return;
  });

  it('detects dependency cycles and rejects the enabled module', () => {
    const rules: Lib_RoleSyncFeatures_Test_Rules = [
      {
        addRoleIdentifiers: ['000000000000000002'],
        hasSomeRoles: true,
        name: 'First edge',
        removeRoleIdentifiers: [],
        triggerRoleIdentifiers: ['000000000000000001'],
      },
      {
        addRoleIdentifiers: ['000000000000000001'],
        hasSomeRoles: true,
        name: 'Second edge',
        removeRoleIdentifiers: [],
        triggerRoleIdentifiers: ['000000000000000002'],
      },
    ];
    const prepared: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns = prepareRoleSyncFeatures({
      features: {
        'sync-roles': {
          configuration: {
            events: [
              {
                'has-some-roles': true,
                'name': 'First edge',
                'some-roles': [{
                  'role-id': '000000000000000001',
                }],
                'to-add-roles': [{
                  'role-id': '000000000000000002',
                }],
              },
              {
                'has-some-roles': true,
                'name': 'Second edge',
                'some-roles': [{
                  'role-id': '000000000000000002',
                }],
                'to-add-roles': [{
                  'role-id': '000000000000000001',
                }],
              },
            ],
            timeout: 1,
          },
          enabled: true,
        },
      },
    });

    expect(hasRoleDependencyCycle(rules)).toBe(true);

    expect(prepared['activeFeatureKeys']).toEqual([]);

    expect(prepared['configurationErrors'][0]).toContain('cycle');

    return;
  });

  return;
});
