import {
  REST,
  Routes,
} from 'discord.js';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { hashPanelPassword } from '../lib/panel-auth.js';

import {
  createClient,
  seedServer,
  startHarness,
} from '../tests/support/harness.js';
import {
  createTestToken,
  createTestUser,
  signInTestUser,
} from '../tests/support/sessions.js';

import type {
  Tests_Routes_Invite_Body,
  Tests_Routes_Invite_Client,
  Tests_Routes_Invite_DiscordGuild,
  Tests_Routes_Invite_DiscordMocks,
  Tests_Routes_Invite_FetchInit,
  Tests_Routes_Invite_FetchInput,
  Tests_Routes_Invite_FetchReturns,
  Tests_Routes_Invite_FetchUrl,
  Tests_Routes_Invite_Harness,
  Tests_Routes_Invite_Header,
  Tests_Routes_Invite_Html,
  Tests_Routes_Invite_Image,
  Tests_Routes_Invite_LegacyConfiguration,
  Tests_Routes_Invite_MediaResponse,
  Tests_Routes_Invite_MockDiscord_Guild,
  Tests_Routes_Invite_MockDiscord_Returns,
  Tests_Routes_Invite_MockRecaptcha_Result,
  Tests_Routes_Invite_MockRecaptcha_Returns,
  Tests_Routes_Invite_PageInput,
  Tests_Routes_Invite_ReadPageData_End,
  Tests_Routes_Invite_ReadPageData_Html,
  Tests_Routes_Invite_ReadPageData_Opening,
  Tests_Routes_Invite_ReadPageData_Returns,
  Tests_Routes_Invite_ReadPageData_Serialized,
  Tests_Routes_Invite_ReadPageData_Start,
  Tests_Routes_Invite_RealFetch,
  Tests_Routes_Invite_RecaptchaCall,
  Tests_Routes_Invite_RecaptchaForm,
  Tests_Routes_Invite_RecaptchaMock,
  Tests_Routes_Invite_Response,
  Tests_Routes_Invite_SignInAdmin_Client,
  Tests_Routes_Invite_SignInAdmin_Harness,
  Tests_Routes_Invite_SignInAdmin_Returns,
  Tests_Routes_Invite_Token,
  Tests_Routes_Invite_TurnOnInvites_Client,
  Tests_Routes_Invite_TurnOnInvites_Confirmation,
  Tests_Routes_Invite_TurnOnInvites_Grant,
  Tests_Routes_Invite_TurnOnInvites_Harness,
  Tests_Routes_Invite_TurnOnInvites_Imported,
  Tests_Routes_Invite_TurnOnInvites_Returns,
  Tests_Routes_Invite_TurnOnInvites_Running,
  Tests_Routes_Invite_UploadedImage,
  Tests_Routes_Invite_Url,
  Tests_Routes_Invite_UserId,
  Tests_Routes_Invite_ValidationCases,
} from '../types/tests/routes/invite.test.d.ts';

/**
 * Invite - Server ID.
 *
 * Names the Discord server every test designs an invite page for.
 * The imported config.json belongs to the same server.
 *
 * @since 4.0.0
 */
const SERVER_ID = '1197999049190674442';

/**
 * Invite - Admin Password.
 *
 * Allows the backup import route to freshly confirm the test administrator.
 * The value exists only in the isolated in-memory test database.
 *
 * @since UNRELEASED
 */
const ADMIN_PASSWORD = 'invite fixture admin password';

/**
 * Invite - Rules Channel ID.
 *
 * Names the rules channel Discord reports for the test server.
 * Invites are created for this channel.
 *
 * @since 4.0.0
 */
const RULES_CHANNEL_ID = '1209383231867326487';

/**
 * Invite - Icon URL.
 *
 * Gives the Discord CDN address of the test server's icon.
 * The designer and the public page both show it.
 *
 * @since 4.0.0
 */
const iconUrl: Tests_Routes_Invite_Url = `https://cdn.discordapp.com/icons/${SERVER_ID}/a1b2c3.png?size=256`;

/**
 * Invite - Designer Path.
 *
 * Points at the invite page designer API of the test server.
 * Image uploads live under it.
 *
 * @since 4.0.0
 */
const designerPath: Tests_Routes_Invite_Url = `/api/v1/servers/${SERVER_ID}/invite-page`;

/**
 * Invite - Paused Message.
 *
 * Repeats the answer visitors get whenever invites can't be made.
 * The public page shows it as is.
 *
 * @since 4.0.0
 */
const PAUSED_MESSAGE = 'Invites are paused right now. Try again later.';

/**
 * Invite - Png.
 *
 * Holds a one-pixel PNG image.
 * Uploads are checked by their first bytes, so a real image keeps the tests honest.
 *
 * @since 4.0.0
 */
const png: Tests_Routes_Invite_Image = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c6360000200000500017a5eab3f0000000049454e44ae426082', 'hex');

/**
 * Invite - Legacy Configuration.
 *
 * Describes a config.json with an invite path, a reCAPTCHA key pair, and a bot token.
 * Importing it is how the tests turn the public invite page on.
 *
 * @since 4.0.0
 */
const legacyConfiguration: Tests_Routes_Invite_LegacyConfiguration = {
  'settings': {
    discord: {
      guild: {
        'guild-id': SERVER_ID,
      },
      token: 'fixture-discord-token',
    },
  },
  'web-applications': {
    'invite-generator': {
      options: {
        'max-age': 300,
        'max-uses': 1,
        'path': '/invite',
      },
      recaptcha: {
        'secret-key': 'fixture-recaptcha-secret',
        'site-key': 'fixture-recaptcha-site-key',
      },
    },
  },
};

/**
 * Invite - Valid Page.
 *
 * Fills every designer field with a value that passes validation.
 * Tests change one field at a time from here.
 *
 * @since 4.0.0
 */
const validPage: Tests_Routes_Invite_PageInput = {
  accentColor: '#22aa88',
  bannerImageId: null,
  buttonLabel: 'Come hang out with us',
  description: 'Books, memes, and a friendly crowd.',
  expectedRevision: 0,
  footerText: 'By joining you agree to the server rules.',
  logo: 'server',
  logoImageId: null,
  showBoostTier: true,
  showMemberCount: true,
  theme: 'dark',
  title: 'Join the Stonk Club',
};

/**
 * Invite - Discord Guild.
 *
 * Mirrors the server lookup Discord answers with member counts and a rules channel.
 * Tests copy it to leave the rules channel out.
 *
 * @since 4.0.0
 */
const discordGuild: Tests_Routes_Invite_DiscordGuild = {
  approximate_member_count: 1234,
  name: 'Stonk Club',
  premium_tier: 2,
  rules_channel_id: RULES_CHANNEL_ID,
};

/**
 * Invite - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database with the test server in it.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Invite_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  await seedServer(harness['pool'], SERVER_ID, 'Stonk Club');

  await harness['pool'].query('UPDATE discord_servers SET icon_hash = $2 WHERE guild_id = $1', [
    SERVER_ID,
    'a1b2c3',
  ]);

  return;
});

afterEach(async () => {
  vi.restoreAllMocks();

  if (harness !== undefined) {
    await harness.close();
  }

  harness = undefined;

  return;
});

/**
 * Invite - Sign In Admin.
 *
 * Signs a new administrator in on a fresh client.
 * Administrators may read and change every server.
 *
 * @param {Tests_Routes_Invite_SignInAdmin_Harness} currentHarness - Current harness.
 *
 * @returns {Tests_Routes_Invite_SignInAdmin_Returns}
 *
 * @since 4.0.0
 */
async function signInAdmin(currentHarness: Tests_Routes_Invite_SignInAdmin_Harness): Tests_Routes_Invite_SignInAdmin_Returns {
  const client: Tests_Routes_Invite_SignInAdmin_Client = createClient(currentHarness['baseUrl']);

  const userId: Tests_Routes_Invite_UserId = await signInTestUser(currentHarness['pool'], client, {
    allServers: true,
    role: 'administrator',
    serverIds: [],
    username: 'admin',
  });

  await currentHarness['pool'].query('UPDATE panel_users SET password_hash = $2 WHERE id = $1', [
    userId,
    await hashPanelPassword(ADMIN_PASSWORD),
  ]);

  return client;
}

/**
 * Invite - Turn On Invites.
 *
 * Imports the invite config.json for the test server and can mark the bot as running.
 * The import gives the web-applications feature its invite path and reCAPTCHA keys.
 *
 * @param {Tests_Routes_Invite_TurnOnInvites_Harness} currentHarness - Current harness.
 * @param {Tests_Routes_Invite_TurnOnInvites_Client}  client         - Client.
 * @param {Tests_Routes_Invite_TurnOnInvites_Running} running        - Running.
 *
 * @returns {Tests_Routes_Invite_TurnOnInvites_Returns}
 *
 * @since 4.0.0
 */
async function turnOnInvites(currentHarness: Tests_Routes_Invite_TurnOnInvites_Harness, client: Tests_Routes_Invite_TurnOnInvites_Client, running: Tests_Routes_Invite_TurnOnInvites_Running): Tests_Routes_Invite_TurnOnInvites_Returns {
  const confirmation: Tests_Routes_Invite_TurnOnInvites_Confirmation = await client.request('POST', '/api/v1/backup/confirmation', {
    password: ADMIN_PASSWORD,
    purpose: 'import',
  });
  const grant: Tests_Routes_Invite_TurnOnInvites_Grant = confirmation['body'] as Tests_Routes_Invite_TurnOnInvites_Grant;
  const imported: Tests_Routes_Invite_TurnOnInvites_Imported = await client.request('POST', '/api/v1/backup/imports', {
    grant: grant['grant'],
    source: {
      configuration: JSON.stringify(legacyConfiguration),
      enableFeatures: true,
      serverId: SERVER_ID,
      type: 'legacy',
    },
  });

  if (running === true) {
    await currentHarness['pool'].query('UPDATE bot_runtime_control SET desired_state = $1 WHERE singleton = TRUE', ['running']);
  }

  return imported;
}

/**
 * Invite - Mock Discord.
 *
 * Answers the server lookup and invite creation the way Discord's REST API would.
 * Nothing leaves the machine.
 *
 * @param {Tests_Routes_Invite_MockDiscord_Guild} guild - Guild.
 *
 * @returns {Tests_Routes_Invite_MockDiscord_Returns}
 *
 * @since 4.0.0
 */
function mockDiscord(guild: Tests_Routes_Invite_MockDiscord_Guild): Tests_Routes_Invite_MockDiscord_Returns {
  return {
    get: vi.spyOn(REST.prototype, 'get').mockResolvedValue(guild),
    post: vi.spyOn(REST.prototype, 'post').mockResolvedValue({
      code: 'lounge',
    }),
  };
}

/**
 * Invite - Mock Recaptcha.
 *
 * Answers Google's siteverify endpoint with a fixed result and passes other requests on.
 * The test client's own requests still reach the app.
 *
 * @param {Tests_Routes_Invite_MockRecaptcha_Result} result - Result.
 *
 * @returns {Tests_Routes_Invite_MockRecaptcha_Returns}
 *
 * @since 4.0.0
 */
function mockRecaptcha(result: Tests_Routes_Invite_MockRecaptcha_Result): Tests_Routes_Invite_MockRecaptcha_Returns {
  const realFetch: Tests_Routes_Invite_RealFetch = globalThis.fetch;

  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: Tests_Routes_Invite_FetchInput, init?: Tests_Routes_Invite_FetchInit): Tests_Routes_Invite_FetchReturns => {
    const url: Tests_Routes_Invite_FetchUrl = (input instanceof Request) ? input.url : String(input);

    if (url.startsWith('https://www.google.com/recaptcha/') === true) {
      return Response.json(result);
    }

    return realFetch(input, init);
  });
}

/**
 * Invite - Read Page Data.
 *
 * Pulls the JSON the server wrote into the page's data script and parses it.
 * The raw text is checked separately for escaping.
 *
 * @param {Tests_Routes_Invite_ReadPageData_Html} html - Html.
 *
 * @returns {Tests_Routes_Invite_ReadPageData_Returns}
 *
 * @since 4.0.0
 */
function readPageData(html: Tests_Routes_Invite_ReadPageData_Html): Tests_Routes_Invite_ReadPageData_Returns {
  const opening: Tests_Routes_Invite_ReadPageData_Opening = '<script type="application/json" id="invite-data">';
  const start: Tests_Routes_Invite_ReadPageData_Start = html.indexOf(opening);
  const end: Tests_Routes_Invite_ReadPageData_End = html.indexOf('</script>', start);

  if (start === -1 || end === -1) {
    throw new Error('The page has no data script.');
  }

  const serialized: Tests_Routes_Invite_ReadPageData_Serialized = html.slice(start + opening.length, end);

  return JSON.parse(serialized);
}

/**
 * Invite - Invite Page Designer.
 *
 * Covers reading the designer's defaults, saving with revisions, and every field message.
 * Viewers and tokens read the page; only roles that change settings save it.
 *
 * @since 4.0.0
 */
describe('invite page designer', () => {
  it('starts from the server name and icon until the page is saved', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);

    expect(await admin.request('GET', designerPath)).toEqual(expect.objectContaining({
      body: {
        enabled: false,
        page: {
          accentColor: '#6250d9',
          bannerImageId: null,
          bannerImageUrl: null,
          buttonLabel: 'Join the server',
          description: '',
          footerText: '',
          logo: 'server',
          logoImageId: null,
          logoImageUrl: null,
          revision: 0,
          showBoostTier: false,
          showMemberCount: true,
          theme: 'system',
          title: 'Join Stonk Club',
          updatedAt: null,
        },
        publicUrl: null,
        server: {
          iconUrl,
          name: 'Stonk Club',
        },
      },
      status: 200,
    }));

    const ownerId: Tests_Routes_Invite_UserId = await createTestUser(harness['pool'], {
      allServers: true,
      role: 'owner',
      serverIds: [],
      username: 'owner',
    });
    const readToken: Tests_Routes_Invite_Token = await createTestToken(harness['pool'], ownerId, ['features:read']);
    const logsToken: Tests_Routes_Invite_Token = await createTestToken(harness['pool'], ownerId, ['logs:read']);

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${readToken}`,
    }).request('GET', designerPath)).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${logsToken}`,
    }).request('GET', designerPath)).toEqual(expect.objectContaining({
      status: 403,
    }));

    return;
  });

  it('saves the page and refuses a save based on an older revision', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const saved: Tests_Routes_Invite_Response = await admin.request('PUT', designerPath, validPage);

    expect(saved).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        page: expect.objectContaining({
          accentColor: '#22aa88',
          buttonLabel: 'Come hang out with us',
          revision: 1,
          showBoostTier: true,
          theme: 'dark',
          title: 'Join the Stonk Club',
          updatedAt: expect.any(String),
        }),
      }),
      status: 200,
    }));

    expect(await admin.request('GET', designerPath)).toEqual(expect.objectContaining({
      body: saved['body'],
      status: 200,
    }));

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      title: 'An older edit',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'revision_conflict',
          message: 'The invite page changed since you opened it. Reload to see the latest version.',
        },
      },
      status: 409,
    }));

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      expectedRevision: 1,
      title: 'A newer edit',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        page: expect.objectContaining({
          revision: 2,
          title: 'A newer edit',
        }),
      }),
      status: 200,
    }));

    return;
  });

  it('explains each field that fails validation', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const validationCases: Tests_Routes_Invite_ValidationCases = [
      {
        field: 'title',
        message: 'Add a title.',
        value: '   ',
      },
      {
        field: 'title',
        message: 'Use 100 characters or fewer.',
        value: 'x'.repeat(101),
      },
      {
        field: 'description',
        message: 'Use 300 characters or fewer.',
        value: 'x'.repeat(301),
      },
      {
        field: 'accentColor',
        message: 'Use a hex color like #6250d9.',
        value: 'purple',
      },
      {
        field: 'buttonLabel',
        message: 'Add a button label.',
        value: '',
      },
      {
        field: 'buttonLabel',
        message: 'Use 40 characters or fewer.',
        value: 'x'.repeat(41),
      },
      {
        field: 'footerText',
        message: 'Use 500 characters or fewer.',
        value: 'x'.repeat(501),
      },
      {
        field: 'theme',
        message: 'Choose System, Light, or Dark.',
        value: 'neon',
      },
      {
        field: 'logo',
        message: 'Choose the server icon, an uploaded logo, or no logo.',
        value: 'banner',
      },
      {
        field: 'bannerImageId',
        message: 'That image isn\'t available. Upload it again.',
        value: 'not-an-image',
      },
      {
        field: 'expectedRevision',
        message: 'Reload the page and try again.',
        value: -1,
      },
      {
        field: 'legacyTemplate',
        message: 'This field isn\'t accepted.',
        value: '<h1>Old page</h1>',
      },
    ];

    for (const validationCase of validationCases) {
      expect(await admin.request('PUT', designerPath, {
        ...validPage,
        [validationCase['field']]: validationCase['value'],
      })).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'invalid_request',
            issues: [{
              field: validationCase['field'],
              message: validationCase['message'],
              path: [validationCase['field']],
            }],
            message: validationCase['message'],
          },
        },
        status: 422,
      }));
    }

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      logo: 'custom',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          message: 'Upload a logo, or choose another logo option.',
        }),
      }),
      status: 422,
    }));

    return;
  });

  it('lets viewers read the designer but not change it', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const viewer: Tests_Routes_Invite_Client = createClient(harness['baseUrl']);

    await signInTestUser(harness['pool'], viewer, {
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });

    expect(await viewer.request('GET', designerPath)).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect(await viewer.request('PUT', designerPath, validPage)).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'permission_required',
          message: 'Your role can\'t change settings.',
        },
      },
      status: 403,
    }));

    expect(await viewer.request('POST', `${designerPath}/images`, png, {
      'Content-Type': 'image/png',
    })).toEqual(expect.objectContaining({
      status: 403,
    }));

    return;
  });

  return;
});

/**
 * Invite - Invite Page Images.
 *
 * Covers uploading logos and banners, serving them, and clearing the ones no page uses.
 * Uploads are checked by their first bytes and limited to 2 MB.
 *
 * @since 4.0.0
 */
describe('invite page images', () => {
  it('stores an upload and serves it to anyone with a long cache', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const upload: Tests_Routes_Invite_Response = await admin.request('POST', `${designerPath}/images`, png, {
      'Content-Type': 'image/png',
    });
    const uploaded: Tests_Routes_Invite_UploadedImage = upload['body'] as Tests_Routes_Invite_UploadedImage;

    expect(upload['status']).toBe(201);

    expect(uploaded['url']).toBe(`/media/${uploaded['id']}`);

    const media: Tests_Routes_Invite_MediaResponse = await fetch(`${harness['baseUrl']}${uploaded['url']}`);

    expect(media.status).toBe(200);

    expect(media.headers.get('Content-Type')).toBe('image/png');

    expect(media.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');

    expect(media.headers.get('X-Content-Type-Options')).toBe('nosniff');

    expect(Buffer.from(await media.arrayBuffer()).equals(png)).toBe(true);

    expect((await fetch(`${harness['baseUrl']}/media/00000000-0000-4000-8000-000000000000`)).status).toBe(404);

    expect((await fetch(`${harness['baseUrl']}/media/not-an-image`)).status).toBe(404);

    return;
  });

  it('refuses files that are not PNG, JPEG, WebP, or GIF images', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const svg: Tests_Routes_Invite_Image = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

    expect(await admin.request('POST', `${designerPath}/images`, svg, {
      'Content-Type': 'image/png',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'unsupported_image',
          message: 'Upload a PNG, JPEG, WebP, or GIF image.',
        },
      },
      status: 415,
    }));

    expect(await admin.request('POST', `${designerPath}/images`, svg, {
      'Content-Type': 'image/svg+xml',
    })).toEqual(expect.objectContaining({
      status: 415,
    }));

    return;
  });

  it('refuses images over 2 MB', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);

    expect(await admin.request('POST', `${designerPath}/images`, Buffer.concat([
      png,
      Buffer.alloc(2 * 1024 * 1024),
    ]), {
      'Content-Type': 'image/png',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'payload_too_large',
          message: 'Upload an image of 2 MB or less.',
        },
      },
      status: 413,
    }));

    return;
  });

  it('deletes uploads the saved page no longer uses', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const first: Tests_Routes_Invite_UploadedImage = (await admin.request('POST', `${designerPath}/images`, png, {
      'Content-Type': 'image/png',
    }))['body'] as Tests_Routes_Invite_UploadedImage;
    const second: Tests_Routes_Invite_UploadedImage = (await admin.request('POST', `${designerPath}/images`, png, {
      'Content-Type': 'image/png',
    }))['body'] as Tests_Routes_Invite_UploadedImage;

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      bannerImageId: first['id'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        page: expect.objectContaining({
          bannerImageId: first['id'],
          bannerImageUrl: first['url'],
        }),
      }),
      status: 200,
    }));

    expect((await fetch(`${harness['baseUrl']}${first['url']}`)).status).toBe(200);

    expect((await fetch(`${harness['baseUrl']}${second['url']}`)).status).toBe(404);

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      expectedRevision: 1,
    })).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect((await fetch(`${harness['baseUrl']}${first['url']}`)).status).toBe(404);

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      expectedRevision: 2,
      logo: 'custom',
      logoImageId: first['id'],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'logoImageId',
            message: 'That image isn\'t available. Upload it again.',
            path: ['logoImageId'],
          }],
          message: 'That image isn\'t available. Upload it again.',
        },
      },
      status: 422,
    }));

    return;
  });

  return;
});

/**
 * Invite - Public Invite Page.
 *
 * Covers the built page with its link-preview tags and data, and paths no server uses.
 * Discord's REST API is mocked, so member counts come from the test.
 *
 * @since 4.0.0
 */
describe('public invite page', () => {
  it('fills the built page with escaped link-preview tags and the page data', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);

    await harness['pool'].query('UPDATE discord_servers SET name = $2 WHERE guild_id = $1', [
      SERVER_ID,
      'Stonk <Club> & "Friends"',
    ]);

    expect(await turnOnInvites(harness, admin, true)).toEqual(expect.objectContaining({
      status: 200,
    }));

    const discord: Tests_Routes_Invite_DiscordMocks = mockDiscord(discordGuild);
    const banner: Tests_Routes_Invite_UploadedImage = (await admin.request('POST', `${designerPath}/images`, png, {
      'Content-Type': 'image/png',
    }))['body'] as Tests_Routes_Invite_UploadedImage;

    expect(await admin.request('PUT', designerPath, {
      ...validPage,
      bannerImageId: banner['id'],
      description: 'Talk </script> books',
      title: 'Join <Stonk> & "Co" $& $\'',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        enabled: true,
        publicUrl: `${harness['baseUrl']}/invite`,
      }),
      status: 200,
    }));

    const visitor: Tests_Routes_Invite_Client = createClient(harness['baseUrl']);
    const page: Tests_Routes_Invite_Response = await visitor.request('GET', '/invite');
    const html: Tests_Routes_Invite_Html = String(page['body']);
    const policy: Tests_Routes_Invite_Header = page['headers'].get('Content-Security-Policy');

    expect(page['status']).toBe(200);

    expect(page['headers'].get('Content-Type')).toContain('text/html');

    expect(policy).toContain('frame-ancestors \'none\'');

    expect(policy).toContain('script-src \'self\' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/');

    expect(policy).toContain('img-src \'self\' data: https://cdn.discordapp.com');

    expect(html).toContain('<title>Join &lt;Stonk&gt; &amp; &quot;Co&quot; $&amp; $&#39;</title>');

    expect(html).toContain('<meta property="og:title" content="Join &lt;Stonk&gt; &amp; &quot;Co&quot; $&amp; $&#39;" />');

    expect(html).toContain('<meta name="description" content="Talk &lt;/script&gt; books · 1,234 members · Boost level 2" />');

    expect(html).toContain('<meta property="og:type" content="website" />');

    expect(html).toContain(`<meta property="og:url" content="${harness['baseUrl']}/invite" />`);

    expect(html).toContain(`<meta property="og:image" content="${harness['baseUrl']}${banner['url']}" />`);

    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');

    expect(html).toContain('<meta name="theme-color" content="#22aa88" />');

    expect(html).toContain('Talk \\u003c/script> books');

    expect(html.split('</script>')).toHaveLength(2);

    expect(readPageData(html)).toEqual({
      available: true,
      page: {
        accentColor: '#22aa88',
        bannerUrl: banner['url'],
        buttonLabel: 'Come hang out with us',
        description: 'Talk </script> books',
        footerText: 'By joining you agree to the server rules.',
        logoUrl: iconUrl,
        showBoostTier: true,
        showMemberCount: true,
        theme: 'dark',
        title: 'Join <Stonk> & "Co" $& $\'',
      },
      recaptchaSiteKey: 'fixture-recaptcha-site-key',
      server: {
        boostTier: 2,
        iconUrl,
        memberCount: 1234,
        name: 'Stonk <Club> & "Friends"',
      },
      submitPath: '/invite',
    });

    await visitor.request('GET', '/invite');

    expect(discord['get']).toHaveBeenCalledTimes(1);

    expect(discord['get']).toHaveBeenCalledWith(Routes.guild(SERVER_ID), expect.anything());

    return;
  });

  it('answers paths no server uses with a plain 404', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const visitor: Tests_Routes_Invite_Client = createClient(harness['baseUrl']);
    const missing: Tests_Routes_Invite_Response = await visitor.request('GET', '/invite');

    expect(missing['status']).toBe(404);

    expect(missing['headers'].get('Content-Type')).toContain('text/plain');

    expect(missing['body']).toBe('Not found.');

    await turnOnInvites(harness, admin, false);

    expect(await visitor.request('GET', '/invite')).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect(await visitor.request('GET', '/join/somewhere-else')).toEqual(expect.objectContaining({
      body: 'Not found.',
      status: 404,
    }));

    return;
  });

  it('shows the page as unavailable while the bot is stopped', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);

    await turnOnInvites(harness, admin, false);

    const discord: Tests_Routes_Invite_DiscordMocks = mockDiscord(discordGuild);
    const page: Tests_Routes_Invite_Response = await createClient(harness['baseUrl']).request('GET', '/invite');

    expect(page['status']).toBe(200);

    expect(readPageData(String(page['body']))).toEqual(expect.objectContaining({
      available: false,
      server: {
        boostTier: null,
        iconUrl,
        memberCount: null,
        name: 'Stonk Club',
      },
    }));

    expect(String(page['body'])).toContain('<meta property="og:image" content="https://cdn.discordapp.com/icons/');

    expect(String(page['body'])).toContain('<meta name="twitter:card" content="summary" />');

    expect(discord['get']).not.toHaveBeenCalled();

    return;
  });

  return;
});

/**
 * Invite - Public Invite Requests.
 *
 * Covers creating an invite after Google checks the reCAPTCHA response, and every refusal.
 * Google and Discord are mocked; visitors come from documentation-only IP addresses.
 *
 * @since 4.0.0
 */
describe('public invite requests', () => {
  it('creates an invite once Google accepts the reCAPTCHA response', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);

    await turnOnInvites(harness, admin, true);

    const discord: Tests_Routes_Invite_DiscordMocks = mockDiscord(discordGuild);
    const recaptcha: Tests_Routes_Invite_RecaptchaMock = mockRecaptcha({
      hostname: '127.0.0.1',
      success: true,
    });
    const visitor: Tests_Routes_Invite_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '203.0.113.10',
    });

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'visitor-token',
    })).toEqual(expect.objectContaining({
      body: {
        inviteUrl: 'https://discord.gg/lounge',
      },
      status: 200,
    }));

    expect(discord['post']).toHaveBeenCalledWith(Routes.channelInvites(RULES_CHANNEL_ID), expect.objectContaining({
      body: {
        max_age: 300,
        max_uses: 1,
        temporary: false,
        unique: true,
      },
    }));

    const googleCall: Tests_Routes_Invite_RecaptchaCall = recaptcha.mock.calls.find((call) => String(call[0]).startsWith('https://www.google.com/recaptcha/') === true);

    if (googleCall === undefined) {
      throw new Error('Google was not asked to check the reCAPTCHA response.');
    }

    const form: Tests_Routes_Invite_RecaptchaForm = String(Reflect.get(Object(googleCall[1]), 'body'));

    expect(new URLSearchParams(form).get('secret')).toBe('fixture-recaptcha-secret');

    expect(new URLSearchParams(form).get('response')).toBe('visitor-token');

    expect(new URLSearchParams(form).get('remoteip')).toBe('203.0.113.10');

    return;
  });

  it('refuses a reCAPTCHA response Google rejects or that was solved on another site', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const visitor: Tests_Routes_Invite_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '203.0.113.20',
    });
    const refused: Tests_Routes_Invite_Body = 'The reCAPTCHA check didn\'t pass. Try again.';

    await turnOnInvites(harness, admin, true);

    mockDiscord(discordGuild);

    mockRecaptcha({
      'error-codes': ['invalid-input-response'],
      'success': false,
    });

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'rejected-token',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'recaptcha_failed',
          message: refused,
        },
      },
      status: 401,
    }));

    vi.restoreAllMocks();

    const discord: Tests_Routes_Invite_DiscordMocks = mockDiscord(discordGuild);

    mockRecaptcha({
      hostname: 'elsewhere.example',
      success: true,
    });

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'foreign-token',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'recaptcha_failed',
          message: refused,
        },
      },
      status: 401,
    }));

    expect(discord['post']).not.toHaveBeenCalled();

    return;
  });

  it('limits each network to five invite requests every ten minutes', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const visitor: Tests_Routes_Invite_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.7',
    });

    await turnOnInvites(harness, admin, true);

    mockDiscord(discordGuild);

    mockRecaptcha({
      hostname: '127.0.0.1',
      success: true,
    });

    for (const attempt of [
      1,
      2,
      3,
      4,
      5,
    ]) {
      expect(await visitor.request('POST', '/invite', {
        recaptchaToken: `token-${attempt}`,
      })).toEqual(expect.objectContaining({
        status: 200,
      }));
    }

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'token-6',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many invites from this network. Try again in 10 minutes.',
        },
      },
      status: 429,
    }));

    expect(await createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.8',
    }).request('POST', '/invite', {
      recaptchaToken: 'token-elsewhere',
    })).toEqual(expect.objectContaining({
      status: 200,
    }));

    return;
  });

  it('pauses invites while the bot is stopped, the feature is off, or there is no rules channel', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const admin: Tests_Routes_Invite_Client = await signInAdmin(harness);
    const visitor: Tests_Routes_Invite_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '192.0.2.44',
    });
    const paused: Tests_Routes_Invite_Response = {
      body: {
        error: {
          code: 'invite_unavailable',
          message: PAUSED_MESSAGE,
        },
      },
      headers: expect.anything(),
      status: 503,
    };

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'before-the-feature',
    })).toEqual(paused);

    await turnOnInvites(harness, admin, false);

    const discord: Tests_Routes_Invite_DiscordMocks = mockDiscord({
      ...discordGuild,
      rules_channel_id: null,
    });

    mockRecaptcha({
      hostname: '127.0.0.1',
      success: true,
    });

    expect(await visitor.request('POST', '/invite', {})).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'recaptchaToken',
            message: 'Complete the reCAPTCHA check.',
            path: ['recaptchaToken'],
          }],
          message: 'Complete the reCAPTCHA check.',
        },
      },
      status: 422,
    }));

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'while-stopped',
    })).toEqual(paused);

    await harness['pool'].query('UPDATE bot_runtime_control SET desired_state = $1 WHERE singleton = TRUE', ['running']);

    expect(await visitor.request('POST', '/invite', {
      recaptchaToken: 'without-rules',
    })).toEqual(paused);

    await harness['pool'].query('UPDATE guild_features SET enabled = FALSE WHERE guild_id = $1 AND feature_key = $2', [
      SERVER_ID,
      'web-applications',
    ]);

    expect(await createClient(harness['baseUrl'], {
      'X-Forwarded-For': '192.0.2.45',
    }).request('POST', '/invite', {
      recaptchaToken: 'feature-off',
    })).toEqual(paused);

    expect(discord['post']).not.toHaveBeenCalled();

    return;
  });

  return;
});
