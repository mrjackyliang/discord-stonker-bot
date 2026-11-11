import {
  Secret,
  TOTP,
} from 'otpauth';

import { preparePanelSetupClaim } from '../../lib/panel-setup.js';

import type {
  Tests_Support_Accounts_AddUser_Input,
  Tests_Support_Accounts_AddUser_Owner,
  Tests_Support_Accounts_AddUser_Response,
  Tests_Support_Accounts_AddUser_Returns,
  Tests_Support_Accounts_ClaimOwner_Client,
  Tests_Support_Accounts_ClaimOwner_Pool,
  Tests_Support_Accounts_ClaimOwner_Returns,
  Tests_Support_Accounts_ClaimOwner_SetupClaim,
  Tests_Support_Accounts_ClaimOwner_Username,
  Tests_Support_Accounts_CreateTotpCode_Returns,
  Tests_Support_Accounts_CreateTotpCode_Secret,
  Tests_Support_Accounts_CreateTotpCode_Step,
  Tests_Support_Accounts_EnableAuthenticator_Client,
  Tests_Support_Accounts_EnableAuthenticator_Enabled,
  Tests_Support_Accounts_EnableAuthenticator_Password,
  Tests_Support_Accounts_EnableAuthenticator_Returns,
  Tests_Support_Accounts_EnableAuthenticator_Secret,
  Tests_Support_Accounts_EnableAuthenticator_Setup,
  Tests_Support_Accounts_EnableAuthenticator_Step,
  Tests_Support_Accounts_GetTotpStep_Remaining,
  Tests_Support_Accounts_GetTotpStep_Returns,
  Tests_Support_Accounts_OwnerPassword,
  Tests_Support_Accounts_RequestInOrder_Previous,
  Tests_Support_Accounts_RequestInOrder_Requests,
  Tests_Support_Accounts_RequestInOrder_Responses,
  Tests_Support_Accounts_RequestInOrder_Returns,
  Tests_Support_Accounts_SignIn_Client,
  Tests_Support_Accounts_SignIn_Password,
  Tests_Support_Accounts_SignIn_Returns,
  Tests_Support_Accounts_SignIn_Username,
} from '../../types/tests/support/accounts.d.ts';

/**
 * Accounts - Owner Password.
 *
 * Sets the password of the owner account each test creates through setup.
 * It is long enough for the password rule.
 *
 * @since 4.0.0
 */
export const OWNER_PASSWORD: Tests_Support_Accounts_OwnerPassword = 'owner password for tests';

/**
 * Accounts - Add User.
 *
 * Creates a panel user through the users API as a signed-in owner or administrator.
 * The new user's ID is returned so tests can address them.
 *
 * @param {Tests_Support_Accounts_AddUser_Owner} owner - Owner.
 * @param {Tests_Support_Accounts_AddUser_Input} input - Input.
 *
 * @returns {Tests_Support_Accounts_AddUser_Returns}
 *
 * @since 4.0.0
 */
export async function addUser(owner: Tests_Support_Accounts_AddUser_Owner, input: Tests_Support_Accounts_AddUser_Input): Tests_Support_Accounts_AddUser_Returns {
  const response: Tests_Support_Accounts_AddUser_Response = await owner.request('POST', '/api/v1/users', input);

  if (response['status'] !== 201) {
    throw new Error(`The test user was not created: ${JSON.stringify(response['body'])}`);
  }

  return String(Reflect.get(Object(response['body']), 'id'));
}

/**
 * Accounts - Claim Owner.
 *
 * Prints a fresh setup code the way the web process does and claims it with the client.
 * The client ends up signed in as the owner.
 *
 * @param {Tests_Support_Accounts_ClaimOwner_Pool}     pool       - Pool.
 * @param {Tests_Support_Accounts_ClaimOwner_Client}   client     - Client.
 * @param {Tests_Support_Accounts_ClaimOwner_Username} [username] - Username.
 *
 * @returns {Tests_Support_Accounts_ClaimOwner_Returns}
 *
 * @since 4.0.0
 */
export async function claimOwner(pool: Tests_Support_Accounts_ClaimOwner_Pool, client: Tests_Support_Accounts_ClaimOwner_Client, username: Tests_Support_Accounts_ClaimOwner_Username = 'owner'): Tests_Support_Accounts_ClaimOwner_Returns {
  const setupClaim: Tests_Support_Accounts_ClaimOwner_SetupClaim = await preparePanelSetupClaim(pool);

  if (setupClaim === undefined) {
    throw new Error('Setup is already complete.');
  }

  return client.request('POST', '/api/v1/setup/claim', {
    claimCode: setupClaim['code'],
    password: OWNER_PASSWORD,
    username,
  });
}

/**
 * Accounts - Create Totp Code.
 *
 * Generates the authenticator code for one 30-second time step.
 * Tests pick the step so codes are never reused by accident.
 *
 * @param {Tests_Support_Accounts_CreateTotpCode_Secret} secret - Secret.
 * @param {Tests_Support_Accounts_CreateTotpCode_Step}   step   - Step.
 *
 * @returns {Tests_Support_Accounts_CreateTotpCode_Returns}
 *
 * @since 4.0.0
 */
export function createTotpCode(secret: Tests_Support_Accounts_CreateTotpCode_Secret, step: Tests_Support_Accounts_CreateTotpCode_Step): Tests_Support_Accounts_CreateTotpCode_Returns {
  return new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  }).generate({
    timestamp: step * 30_000,
  });
}

/**
 * Accounts - Enable Authenticator.
 *
 * Sets up and turns on the authenticator app with the code of the previous time step.
 * The current and next steps stay free for sign-ins later in the test.
 *
 * @param {Tests_Support_Accounts_EnableAuthenticator_Client}   client   - Client.
 * @param {Tests_Support_Accounts_EnableAuthenticator_Password} password - Password.
 *
 * @returns {Tests_Support_Accounts_EnableAuthenticator_Returns}
 *
 * @since 4.0.0
 */
export async function enableAuthenticator(client: Tests_Support_Accounts_EnableAuthenticator_Client, password: Tests_Support_Accounts_EnableAuthenticator_Password): Tests_Support_Accounts_EnableAuthenticator_Returns {
  const step: Tests_Support_Accounts_EnableAuthenticator_Step = await getTotpStep();
  const setup: Tests_Support_Accounts_EnableAuthenticator_Setup = await client.request('POST', '/api/v1/auth/totp/setup', {
    password,
  });
  const secret: Tests_Support_Accounts_EnableAuthenticator_Secret = String(Reflect.get(Object(setup['body']), 'secret'));
  const enabled: Tests_Support_Accounts_EnableAuthenticator_Enabled = await client.request('POST', '/api/v1/auth/totp/enable', {
    code: createTotpCode(secret, step - 1),
  });

  if (enabled['status'] !== 200) {
    throw new Error(`The authenticator app was not turned on: ${JSON.stringify(enabled['body'])}`);
  }

  return {
    recoveryCodes: Reflect.get(Object(enabled['body']), 'recoveryCodes'),
    secret,
    step,
  };
}

/**
 * Accounts - Get Totp Step.
 *
 * Returns the current 30-second time step, first waiting out the last 3 seconds of a step.
 * Codes computed from it then stay valid while the test runs.
 *
 * @returns {Tests_Support_Accounts_GetTotpStep_Returns}
 *
 * @since 4.0.0
 */
export async function getTotpStep(): Tests_Support_Accounts_GetTotpStep_Returns {
  const remaining: Tests_Support_Accounts_GetTotpStep_Remaining = 30_000 - (Date.now() % 30_000);

  if (remaining < 3_000) {
    await new Promise<void>((resolvePromise) => {
      setTimeout(resolvePromise, remaining + 50);

      return;
    });
  }

  return Math.floor(Date.now() / 30_000);
}

/**
 * Accounts - Request In Order.
 *
 * Sends requests one after another and collects their answers in the same order.
 * Steps that depend on the previous answer, like counting wrong codes, need this order.
 *
 * @param {Tests_Support_Accounts_RequestInOrder_Requests} requests - Requests.
 *
 * @returns {Tests_Support_Accounts_RequestInOrder_Returns}
 *
 * @since 4.0.0
 */
export async function requestInOrder(requests: Tests_Support_Accounts_RequestInOrder_Requests): Tests_Support_Accounts_RequestInOrder_Returns {
  const responses: Tests_Support_Accounts_RequestInOrder_Responses = [];

  await requests.reduce(async (previous: Tests_Support_Accounts_RequestInOrder_Previous, request) => {
    await previous;

    responses.push(await request());

    return;
  }, Promise.resolve());

  return responses;
}

/**
 * Accounts - Sign In.
 *
 * Sends the password step of a sign-in.
 * Accounts with the authenticator app on answer with a second step instead of a session.
 *
 * @param {Tests_Support_Accounts_SignIn_Client}   client   - Client.
 * @param {Tests_Support_Accounts_SignIn_Username} username - Username.
 * @param {Tests_Support_Accounts_SignIn_Password} password - Password.
 *
 * @returns {Tests_Support_Accounts_SignIn_Returns}
 *
 * @since 4.0.0
 */
export async function signIn(client: Tests_Support_Accounts_SignIn_Client, username: Tests_Support_Accounts_SignIn_Username, password: Tests_Support_Accounts_SignIn_Password): Tests_Support_Accounts_SignIn_Returns {
  return client.request('POST', '/api/v1/auth/login', {
    password,
    username,
  });
}
