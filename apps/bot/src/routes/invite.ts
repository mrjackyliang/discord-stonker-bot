import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { REST } from 'discord.js';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

import {
  getPrincipal,
  getServerId,
} from '../lib/access.js';
import { decryptDiscordToken } from '../lib/credential-vault.js';
import { getBotRuntimeControl } from '../lib/database.js';
import {
  getClientAddress,
  getClientLimitKey,
  getRequestHostname,
  getRequestOrigin,
  handleAsync,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import {
  buildInviteDescription,
  detectImageType,
  getMediaUrl,
  readInviteImage,
  readInvitePage,
  readInviteServer,
  renderInviteDocument,
  saveInvitePage,
  storeInviteImage,
} from '../lib/invite-pages.js';
import {
  getErrorMessage,
  writeLog,
} from '../lib/logger.js';
import { LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH } from '../lib/regex.js';
import {
  compileGuildWebApplication,
  createDiscordInvite,
  fetchGuildMetadata,
  findWebApplicationRoute,
  readInviteSettings,
  verifyRecaptcha,
} from '../lib/web-application-features.js';

import type {
  Routes_Invite_ImageContentTypes,
  Routes_Invite_Runner_Access,
  Routes_Invite_Runner_Constructor_Access,
  Routes_Invite_Runner_Constructor_Context,
  Routes_Invite_Runner_Context,
  Routes_Invite_Runner_DesignerResponse_InviteSettings,
  Routes_Invite_Runner_DesignerResponse_Page,
  Routes_Invite_Runner_DesignerResponse_Request,
  Routes_Invite_Runner_DesignerResponse_Returns,
  Routes_Invite_Runner_DesignerResponse_Server,
  Routes_Invite_Runner_GetGuildMetadata_Cached,
  Routes_Invite_Runner_GetGuildMetadata_DiscordToken,
  Routes_Invite_Runner_GetGuildMetadata_GuildIdentifier,
  Routes_Invite_Runner_GetGuildMetadata_Metadata,
  Routes_Invite_Runner_GetGuildMetadata_Now,
  Routes_Invite_Runner_GetGuildMetadata_Returns,
  Routes_Invite_Runner_GetGuildMetadata_TokenCiphertext,
  Routes_Invite_Runner_GuildMetadataCache,
  Routes_Invite_Runner_HandleImageError_Error,
  Routes_Invite_Runner_HandleImageError_Next,
  Routes_Invite_Runner_HandleImageError_Request,
  Routes_Invite_Runner_HandleImageError_Response,
  Routes_Invite_Runner_HandleImageError_Returns,
  Routes_Invite_Runner_HandleImageError_Type,
  Routes_Invite_Runner_ImageParser,
  Routes_Invite_Runner_InviteLimiter,
  Routes_Invite_Runner_LoadPublicInvite_Available,
  Routes_Invite_Runner_LoadPublicInvite_Control,
  Routes_Invite_Runner_LoadPublicInvite_GuildIdentifier,
  Routes_Invite_Runner_LoadPublicInvite_Invite,
  Routes_Invite_Runner_LoadPublicInvite_Metadata,
  Routes_Invite_Runner_LoadPublicInvite_Page,
  Routes_Invite_Runner_LoadPublicInvite_Path,
  Routes_Invite_Runner_LoadPublicInvite_Returns,
  Routes_Invite_Runner_LoadPublicInvite_Running,
  Routes_Invite_Runner_LoadPublicInvite_Runtime,
  Routes_Invite_Runner_LoadPublicInvite_Server,
  Routes_Invite_Runner_Register_App,
  Routes_Invite_Runner_Register_Returns,
  Routes_Invite_Runner_RouteDesign_Request,
  Routes_Invite_Runner_RouteDesign_Response,
  Routes_Invite_Runner_RouteDesign_Returns,
  Routes_Invite_Runner_RouteDesign_Server,
  Routes_Invite_Runner_RouteDesign_ServerId,
  Routes_Invite_Runner_RouteImage_ContentType,
  Routes_Invite_Runner_RouteImage_Data,
  Routes_Invite_Runner_RouteImage_ImageId,
  Routes_Invite_Runner_RouteImage_Request,
  Routes_Invite_Runner_RouteImage_Response,
  Routes_Invite_Runner_RouteImage_Returns,
  Routes_Invite_Runner_RouteImage_ServerId,
  Routes_Invite_Runner_RouteMedia_Image,
  Routes_Invite_Runner_RouteMedia_ImageId,
  Routes_Invite_Runner_RouteMedia_Request,
  Routes_Invite_Runner_RouteMedia_Response,
  Routes_Invite_Runner_RouteMedia_Returns,
  Routes_Invite_Runner_RoutePublicInvite_Body,
  Routes_Invite_Runner_RoutePublicInvite_Control,
  Routes_Invite_Runner_RoutePublicInvite_DiscordToken,
  Routes_Invite_Runner_RoutePublicInvite_Invite,
  Routes_Invite_Runner_RoutePublicInvite_InviteUrl,
  Routes_Invite_Runner_RoutePublicInvite_Metadata,
  Routes_Invite_Runner_RoutePublicInvite_PublicRoute,
  Routes_Invite_Runner_RoutePublicInvite_Request,
  Routes_Invite_Runner_RoutePublicInvite_Response,
  Routes_Invite_Runner_RoutePublicInvite_Returns,
  Routes_Invite_Runner_RoutePublicInvite_Runtime,
  Routes_Invite_Runner_RoutePublicInvite_Verified,
  Routes_Invite_Runner_RoutePublicPage_BannerUrl,
  Routes_Invite_Runner_RoutePublicPage_BoostTier,
  Routes_Invite_Runner_RoutePublicPage_Html,
  Routes_Invite_Runner_RoutePublicPage_LogoUrl,
  Routes_Invite_Runner_RoutePublicPage_MemberCount,
  Routes_Invite_Runner_RoutePublicPage_Origin,
  Routes_Invite_Runner_RoutePublicPage_PreviewImageUrl,
  Routes_Invite_Runner_RoutePublicPage_PublicInvite,
  Routes_Invite_Runner_RoutePublicPage_PublicRoute,
  Routes_Invite_Runner_RoutePublicPage_Request,
  Routes_Invite_Runner_RoutePublicPage_Response,
  Routes_Invite_Runner_RoutePublicPage_Returns,
  Routes_Invite_Runner_RoutePublicPage_Template,
  Routes_Invite_Runner_RouteSave_InviteSettings,
  Routes_Invite_Runner_RouteSave_Principal,
  Routes_Invite_Runner_RouteSave_Request,
  Routes_Invite_Runner_RouteSave_RequestBody,
  Routes_Invite_Runner_RouteSave_Response,
  Routes_Invite_Runner_RouteSave_Result,
  Routes_Invite_Runner_RouteSave_Returns,
  Routes_Invite_Runner_RouteSave_Server,
  Routes_Invite_Runner_RouteSave_ServerId,
  Routes_Invite_Runner_SetPageHeaders_Response,
  Routes_Invite_Runner_SetPageHeaders_Returns,
  Routes_Invite_Runner_SetPublicHeaders_Response,
  Routes_Invite_Runner_SetPublicHeaders_Returns,
} from '../types/routes/invite.d.ts';

/**
 * Invite - Hex Digits.
 *
 * Lists the characters an accent color may use after its leading "#".
 * Colors are stored in lowercase.
 *
 * @since 4.0.0
 */
const HEX_DIGITS = '0123456789abcdef';

/**
 * Invite - Image Content Types.
 *
 * Lists the image types the designer accepts for logos and banners.
 * The upload's first bytes must match one of them too.
 *
 * @since 4.0.0
 */
const imageContentTypes: Routes_Invite_ImageContentTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Invite - Page Schema.
 *
 * Checks the invite page designer's fields with the words the designer shows.
 * A custom logo needs an uploaded image.
 *
 * @since 4.0.0
 */
const invitePageSchema = z.object({
  accentColor: z.string({ error: 'Use a hex color like #6250d9.' }).trim().toLowerCase().refine(
    (value) => (
      value.length === 7
      && value.startsWith('#') === true
      && [...value.slice(1)].every((character) => HEX_DIGITS.includes(character))
    ),
    'Use a hex color like #6250d9.',
  ),
  bannerImageId: z.uuid({ error: 'That image isn\'t available. Upload it again.' }).nullable(),
  buttonLabel: z.string({ error: 'Add a button label.' }).trim().min(1, 'Add a button label.').max(40, 'Use 40 characters or fewer.'),
  description: z.string({ error: 'Use 300 characters or fewer.' }).trim().max(300, 'Use 300 characters or fewer.'),
  expectedRevision: z.number({ error: 'Reload the page and try again.' }).int('Reload the page and try again.').min(0, 'Reload the page and try again.'),
  footerText: z.string({ error: 'Use 500 characters or fewer.' }).trim().max(500, 'Use 500 characters or fewer.'),
  logo: z.enum([
    'custom',
    'none',
    'server',
  ], { error: 'Choose the server icon, an uploaded logo, or no logo.' }),
  logoImageId: z.uuid({ error: 'That image isn\'t available. Upload it again.' }).nullable(),
  showBoostTier: z.boolean({ error: 'Choose whether to show the boost level.' }),
  showMemberCount: z.boolean({ error: 'Choose whether to show the member count.' }),
  theme: z.enum([
    'dark',
    'light',
    'system',
  ], { error: 'Choose System, Light, or Dark.' }),
  title: z.string({ error: 'Add a title.' }).trim().min(1, 'Add a title.').max(100, 'Use 100 characters or fewer.'),
}).strict().refine(
  (value) => value['logo'] !== 'custom' || value['logoImageId'] !== null,
  {
    message: 'Upload a logo, or choose another logo option.',
    path: ['logoImageId'],
  },
);

/**
 * Invite - Public Invite Schema.
 *
 * Accepts the reCAPTCHA response the public invite page sends.
 * Google decides whether it is valid.
 *
 * @since 4.0.0
 */
const publicInviteSchema = z.object({
  recaptchaToken: z.string({ error: 'Complete the reCAPTCHA check.' }).trim().min(1, 'Complete the reCAPTCHA check.').max(4_096, 'Complete the reCAPTCHA check again.'),
}).strict();

/**
 * Invite.
 *
 * Serves the invite page designer, its images, and the public invite page and join button.
 * Visitors never sign in; operators design the page from the control panel.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Invite - Access.
   *
   * Checks who may read or change the designer.
   * The public page and its images skip it.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Invite_Runner_Access;

  /**
   * Invite - Context.
   *
   * Supplies the database pool, the credential key, and the built page folder.
   * One context lives for the whole process.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Invite_Runner_Context;

  /**
   * Invite - Guild Metadata.
   *
   * Remembers member counts, boost levels, and rules channels from Discord for a minute.
   * Failed lookups are remembered for fifteen seconds so Discord isn't asked on every visit.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #guildMetadata: Routes_Invite_Runner_GuildMetadataCache;

  /**
   * Invite - Image Parser.
   *
   * Reads one uploaded image of up to 2 MB as raw bytes.
   * Other content types are left unread and rejected by the route.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #imageParser: Routes_Invite_Runner_ImageParser;

  /**
   * Invite - Invite Limiter.
   *
   * Allows five invite requests per ten minutes from one network.
   * The count lives in memory, so a restart clears it.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #inviteLimiter: Routes_Invite_Runner_InviteLimiter;

  /**
   * Invite - Constructor.
   *
   * Binds the designer and the public page to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Invite_Runner_Constructor_Context} context - Context.
   * @param {Routes_Invite_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Invite_Runner_Constructor_Context, access: Routes_Invite_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;
    this.#guildMetadata = new Map();
    this.#imageParser = express.raw({
      limit: '2mb',
      type: imageContentTypes,
    });
    this.#inviteLimiter = rateLimit({
      handler: (_request, response) => {
        this.setPublicHeaders(response);

        sendError(response, 429, 'rate_limited', 'Too many invites from this network. Try again in 10 minutes.');

        return;
      },
      keyGenerator: (request) => getClientLimitKey(request),
      legacyHeaders: false,
      limit: 5,
      standardHeaders: true,
      windowMs: 10 * 60 * 1000,
    });

    return;
  }

  /**
   * Invite - Register.
   *
   * Installs the media route, the designer API, and the public invite paths.
   * Every path shaped like an invite path is answered here, so the control panel never is.
   *
   * @param {Routes_Invite_Runner_Register_App} app - App.
   *
   * @returns {Routes_Invite_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Invite_Runner_Register_App): Routes_Invite_Runner_Register_Returns {
    app.get('/media/:imageId', handleAsync(this['routeMedia'].bind(this)));

    app.get(
      '/api/v1/servers/:serverId/invite-page',
      this.#access.requireAccess({
        mutation: false,
        scope: 'features:read',
      }),
      this.#access.requireServer(),
      handleAsync(this['routeDesign'].bind(this)),
    );

    app.put(
      '/api/v1/servers/:serverId/invite-page',
      this.#access.requireAccess({
        mutation: true,
        scope: 'features:write',
      }),
      this.#access.requirePermission('configuration:write'),
      this.#access.requireServer(),
      handleAsync(this['routeSave'].bind(this)),
    );

    app.post(
      '/api/v1/servers/:serverId/invite-page/images',
      this.#access.requireAccess({
        mutation: true,
        scope: 'features:write',
      }),
      this.#access.requirePermission('configuration:write'),
      this.#access.requireServer(),
      this.#imageParser,
      handleAsync(this['routeImage'].bind(this)),
      this['handleImageError'].bind(this),
    );

    app.get(LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH, handleAsync(this['routePublicPage'].bind(this)));

    app.post(LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH, this.#inviteLimiter, handleAsync(this['routePublicInvite'].bind(this)));

    return;
  }

  /**
   * Invite - Designer Response.
   *
   * Builds the designer's view of a server's invite page, its public address, and its state.
   * Image ids come with their media URLs so the preview can show them.
   *
   * @param {Routes_Invite_Runner_DesignerResponse_Request}        request        - Request.
   * @param {Routes_Invite_Runner_DesignerResponse_Page}           page           - Page.
   * @param {Routes_Invite_Runner_DesignerResponse_Server}         server         - Server.
   * @param {Routes_Invite_Runner_DesignerResponse_InviteSettings} inviteSettings - Invite settings.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_DesignerResponse_Returns}
   *
   * @since 4.0.0
   */
  private designerResponse(request: Routes_Invite_Runner_DesignerResponse_Request, page: Routes_Invite_Runner_DesignerResponse_Page, server: Routes_Invite_Runner_DesignerResponse_Server, inviteSettings: Routes_Invite_Runner_DesignerResponse_InviteSettings): Routes_Invite_Runner_DesignerResponse_Returns {
    return {
      enabled: inviteSettings['enabled'],
      page: {
        ...page,
        bannerImageUrl: (page['bannerImageId'] === null) ? null : getMediaUrl(page['bannerImageId']),
        logoImageUrl: (page['logoImageId'] === null) ? null : getMediaUrl(page['logoImageId']),
      },
      publicUrl: (inviteSettings['path'] === null) ? null : `${getRequestOrigin(request)}${inviteSettings['path']}`,
      server,
    };
  }

  /**
   * Invite - Get Guild Metadata.
   *
   * Reads the server's member count, boost level, and rules channel, cached for a minute.
   * Failures are logged and return undefined so the page can still render.
   *
   * @param {Routes_Invite_Runner_GetGuildMetadata_GuildIdentifier} guildIdentifier - Guild identifier.
   * @param {Routes_Invite_Runner_GetGuildMetadata_TokenCiphertext} tokenCiphertext - Token ciphertext.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_GetGuildMetadata_Returns}
   *
   * @since 4.0.0
   */
  private async getGuildMetadata(guildIdentifier: Routes_Invite_Runner_GetGuildMetadata_GuildIdentifier, tokenCiphertext: Routes_Invite_Runner_GetGuildMetadata_TokenCiphertext): Routes_Invite_Runner_GetGuildMetadata_Returns {
    const now: Routes_Invite_Runner_GetGuildMetadata_Now = Date.now();
    const cached: Routes_Invite_Runner_GetGuildMetadata_Cached = this.#guildMetadata.get(guildIdentifier);

    if (cached !== undefined && cached['expiresAt'] > now) {
      return cached['metadata'];
    }

    let metadata: Routes_Invite_Runner_GetGuildMetadata_Metadata = undefined;

    try {
      const discordToken: Routes_Invite_Runner_GetGuildMetadata_DiscordToken = decryptDiscordToken(tokenCiphertext, this.#context['credentialKey']);

      metadata = await fetchGuildMetadata(new REST({
        version: '10',
      }).setToken(discordToken), guildIdentifier);
    } catch (error) {
      writeLog('warn', 'web', 'public_invite_metadata_failed', {
        error: getErrorMessage(error),
        guildIdentifier,
      });
    }

    this.#guildMetadata.set(guildIdentifier, {
      expiresAt: now + ((metadata === undefined) ? 15_000 : 60_000),
      metadata,
    });

    return metadata;
  }

  /**
   * Invite - Handle Image Error.
   *
   * Explains an upload that is over the 2 MB limit in the designer's words.
   * Other failures continue to the shared error handler.
   *
   * @param {Routes_Invite_Runner_HandleImageError_Error}    error    - Error.
   * @param {Routes_Invite_Runner_HandleImageError_Request}  _request - Request.
   * @param {Routes_Invite_Runner_HandleImageError_Response} response - Response.
   * @param {Routes_Invite_Runner_HandleImageError_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_HandleImageError_Returns}
   *
   * @since 4.0.0
   */
  private handleImageError(error: Routes_Invite_Runner_HandleImageError_Error, _request: Routes_Invite_Runner_HandleImageError_Request, response: Routes_Invite_Runner_HandleImageError_Response, next: Routes_Invite_Runner_HandleImageError_Next): Routes_Invite_Runner_HandleImageError_Returns {
    const type: Routes_Invite_Runner_HandleImageError_Type = (typeof error === 'object' && error !== null) ? Reflect.get(error, 'type') : undefined;

    if (type === 'entity.too.large' && response.headersSent === false) {
      sendError(response, 413, 'payload_too_large', 'Upload an image of 2 MB or less.');

      return;
    }

    next(error);

    return;
  }

  /**
   * Invite - Load Public Invite.
   *
   * Gathers a server's page design, Discord details, and whether invites can be made now.
   * Invites are available only while the bot runs and the feature and rules channel are ready.
   *
   * @param {Routes_Invite_Runner_LoadPublicInvite_GuildIdentifier} guildIdentifier - Guild identifier.
   * @param {Routes_Invite_Runner_LoadPublicInvite_Path}            path            - Path.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_LoadPublicInvite_Returns}
   *
   * @since 4.0.0
   */
  private async loadPublicInvite(guildIdentifier: Routes_Invite_Runner_LoadPublicInvite_GuildIdentifier, path: Routes_Invite_Runner_LoadPublicInvite_Path): Routes_Invite_Runner_LoadPublicInvite_Returns {
    const server: Routes_Invite_Runner_LoadPublicInvite_Server = await readInviteServer(this.#context['pool'], guildIdentifier);

    if (server === undefined) {
      return undefined;
    }

    const page: Routes_Invite_Runner_LoadPublicInvite_Page = await readInvitePage(this.#context['pool'], guildIdentifier, server['name']);
    const runtime: Routes_Invite_Runner_LoadPublicInvite_Runtime = await compileGuildWebApplication(this.#context['pool'], this.#context['credentialKey'], guildIdentifier);
    const invite: Routes_Invite_Runner_LoadPublicInvite_Invite = (
      runtime === undefined
      || runtime['invite'] === undefined
      || runtime['invite']['path'] !== path
    ) ? undefined : runtime['invite'];
    const control: Routes_Invite_Runner_LoadPublicInvite_Control = await getBotRuntimeControl(this.#context['pool']);
    const running: Routes_Invite_Runner_LoadPublicInvite_Running = control['desiredState'] === 'running' && control['discordTokenCiphertext'] !== undefined;
    const metadata: Routes_Invite_Runner_LoadPublicInvite_Metadata = (running === true && control['discordTokenCiphertext'] !== undefined) ? await this.getGuildMetadata(guildIdentifier, control['discordTokenCiphertext']) : undefined;
    const available: Routes_Invite_Runner_LoadPublicInvite_Available = (
      running === true
      && invite !== undefined
      && metadata !== undefined
      && metadata['rulesChannelIdentifier'] !== undefined
    );

    return {
      available,
      invite,
      metadata,
      page,
      server,
    };
  }

  /**
   * Invite - Route Design.
   *
   * Answers the designer with a server's invite page, or its defaults while none is saved.
   * The public address appears once the web-applications feature sets an invite path.
   *
   * @param {Routes_Invite_Runner_RouteDesign_Request}  request  - Request.
   * @param {Routes_Invite_Runner_RouteDesign_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_RouteDesign_Returns}
   *
   * @since 4.0.0
   */
  private async routeDesign(request: Routes_Invite_Runner_RouteDesign_Request, response: Routes_Invite_Runner_RouteDesign_Response): Routes_Invite_Runner_RouteDesign_Returns {
    const serverId: Routes_Invite_Runner_RouteDesign_ServerId = getServerId(response);
    const server: Routes_Invite_Runner_RouteDesign_Server = await readInviteServer(this.#context['pool'], serverId);

    if (server === undefined) {
      sendError(response, 404, 'server_not_found', 'That Discord server isn\'t available.');

      return;
    }

    response.json(this.designerResponse(
      request,
      await readInvitePage(this.#context['pool'], serverId, server['name']),
      server,
      await readInviteSettings(this.#context['pool'], serverId),
    ));

    return;
  }

  /**
   * Invite - Route Image.
   *
   * Stores one uploaded logo or banner after checking its first bytes.
   * The page uses it once the designer saves the image's id.
   *
   * @param {Routes_Invite_Runner_RouteImage_Request}  request  - Request.
   * @param {Routes_Invite_Runner_RouteImage_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_RouteImage_Returns}
   *
   * @since 4.0.0
   */
  private async routeImage(request: Routes_Invite_Runner_RouteImage_Request, response: Routes_Invite_Runner_RouteImage_Response): Routes_Invite_Runner_RouteImage_Returns {
    const serverId: Routes_Invite_Runner_RouteImage_ServerId = getServerId(response);
    const data: Routes_Invite_Runner_RouteImage_Data = (Buffer.isBuffer(request.body) === true) ? request.body : Buffer.alloc(0);
    const contentType: Routes_Invite_Runner_RouteImage_ContentType = (data.length === 0) ? undefined : detectImageType(data);

    if (contentType === undefined) {
      sendError(response, 415, 'unsupported_image', 'Upload a PNG, JPEG, WebP, or GIF image.');

      return;
    }

    const imageId: Routes_Invite_Runner_RouteImage_ImageId = await storeInviteImage(this.#context['pool'], serverId, contentType, data);

    response.status(201).json({
      id: imageId,
      url: getMediaUrl(imageId),
    });

    return;
  }

  /**
   * Invite - Route Media.
   *
   * Serves an uploaded invite image to anyone, with a long cache because ids never change.
   * The image is sandboxed and never sniffed as another type.
   *
   * @param {Routes_Invite_Runner_RouteMedia_Request}  request  - Request.
   * @param {Routes_Invite_Runner_RouteMedia_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_RouteMedia_Returns}
   *
   * @since 4.0.0
   */
  private async routeMedia(request: Routes_Invite_Runner_RouteMedia_Request, response: Routes_Invite_Runner_RouteMedia_Response): Routes_Invite_Runner_RouteMedia_Returns {
    const imageId: Routes_Invite_Runner_RouteMedia_ImageId = request.params['imageId'] ?? '';
    const image: Routes_Invite_Runner_RouteMedia_Image = (z.uuid().safeParse(imageId).success === true) ? await readInviteImage(this.#context['pool'], imageId) : undefined;

    if (image === undefined) {
      response.status(404).type('text/plain').send('Not found.');

      return;
    }

    response.set({
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Security-Policy': 'default-src \'none\'; sandbox',
      'Content-Type': image['contentType'],
      'X-Content-Type-Options': 'nosniff',
    });

    response.send(image['data']);

    return;
  }

  /**
   * Invite - Route Public Invite.
   *
   * Checks the visitor's reCAPTCHA response and creates one short-lived rules-channel invite.
   * The page then sends the visitor to the returned invite link.
   *
   * @param {Routes_Invite_Runner_RoutePublicInvite_Request}  request  - Request.
   * @param {Routes_Invite_Runner_RoutePublicInvite_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_RoutePublicInvite_Returns}
   *
   * @since 4.0.0
   */
  private async routePublicInvite(request: Routes_Invite_Runner_RoutePublicInvite_Request, response: Routes_Invite_Runner_RoutePublicInvite_Response): Routes_Invite_Runner_RoutePublicInvite_Returns {
    this.setPublicHeaders(response);

    const publicRoute: Routes_Invite_Runner_RoutePublicInvite_PublicRoute = await findWebApplicationRoute(this.#context['pool'], request.path);

    // A page opened before its feature was turned off still gets the paused answer.
    if (publicRoute === undefined || publicRoute['kind'] !== 'invite') {
      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return;
    }

    const body: Routes_Invite_Runner_RoutePublicInvite_Body = publicInviteSchema.safeParse(request.body);

    if (body['success'] === false) {
      sendValidationError(response, 422, body['error'], 'Complete the reCAPTCHA check.');

      return;
    }

    const runtime: Routes_Invite_Runner_RoutePublicInvite_Runtime = await compileGuildWebApplication(this.#context['pool'], this.#context['credentialKey'], publicRoute['guildIdentifier']);
    const invite: Routes_Invite_Runner_RoutePublicInvite_Invite = (
      runtime === undefined
      || runtime['invite'] === undefined
      || runtime['invite']['path'] !== request.path
    ) ? undefined : runtime['invite'];
    const control: Routes_Invite_Runner_RoutePublicInvite_Control = await getBotRuntimeControl(this.#context['pool']);

    if (
      invite === undefined
      || control['desiredState'] !== 'running'
      || control['discordTokenCiphertext'] === undefined
    ) {
      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return;
    }

    let verified: Routes_Invite_Runner_RoutePublicInvite_Verified = false;

    try {
      verified = await verifyRecaptcha(body['data']['recaptchaToken'], invite['recaptchaSecret'], getRequestHostname(request), getClientAddress(request));
    } catch (error) {
      writeLog('warn', 'web', 'public_invite_recaptcha_unreachable', {
        error: getErrorMessage(error),
        guildIdentifier: publicRoute['guildIdentifier'],
      });

      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return;
    }

    if (verified === false) {
      sendError(response, 401, 'recaptcha_failed', 'The reCAPTCHA check didn\'t pass. Try again.');

      return;
    }

    const metadata: Routes_Invite_Runner_RoutePublicInvite_Metadata = await this.getGuildMetadata(publicRoute['guildIdentifier'], control['discordTokenCiphertext']);

    if (metadata === undefined || metadata['rulesChannelIdentifier'] === undefined) {
      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return;
    }

    let inviteUrl: Routes_Invite_Runner_RoutePublicInvite_InviteUrl = undefined;

    try {
      const discordToken: Routes_Invite_Runner_RoutePublicInvite_DiscordToken = decryptDiscordToken(control['discordTokenCiphertext'], this.#context['credentialKey']);

      inviteUrl = await createDiscordInvite(new REST({
        version: '10',
      }).setToken(discordToken), metadata['rulesChannelIdentifier'], invite);
    } catch (error) {
      writeLog('error', 'web', 'public_invite_failed', {
        error: getErrorMessage(error),
        guildIdentifier: publicRoute['guildIdentifier'],
      });

      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return;
    }

    writeLog('info', 'web', 'public_invite_created', {
      guildIdentifier: publicRoute['guildIdentifier'],
      maxAgeSeconds: invite['maxAgeSeconds'],
      maxUses: invite['maxUses'],
      path: request.path,
    });

    response.json({
      inviteUrl,
    });

    return;
  }

  /**
   * Invite - Route Public Page.
   *
   * Answers an invite path with the built page, its link-preview tags, and the page data.
   * Paths no enabled web-applications feature uses get a plain 404.
   *
   * @param {Routes_Invite_Runner_RoutePublicPage_Request}  request  - Request.
   * @param {Routes_Invite_Runner_RoutePublicPage_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_RoutePublicPage_Returns}
   *
   * @since 4.0.0
   */
  private async routePublicPage(request: Routes_Invite_Runner_RoutePublicPage_Request, response: Routes_Invite_Runner_RoutePublicPage_Response): Routes_Invite_Runner_RoutePublicPage_Returns {
    const publicRoute: Routes_Invite_Runner_RoutePublicPage_PublicRoute = await findWebApplicationRoute(this.#context['pool'], request.path);
    const publicInvite: Routes_Invite_Runner_RoutePublicPage_PublicInvite = (publicRoute === undefined || publicRoute['kind'] !== 'invite') ? undefined : await this.loadPublicInvite(publicRoute['guildIdentifier'], request.path);

    if (publicInvite === undefined) {
      this.setPublicHeaders(response);

      response.status(404).type('text/plain').send('Not found.');

      return;
    }

    let template: Routes_Invite_Runner_RoutePublicPage_Template = undefined;

    try {
      template = await readFile(join(this.#context['webRoot'], 'invite.html'), 'utf8');
    } catch {
      this.setPublicHeaders(response);

      response.status(503).type('text/plain').send('The invite page isn\'t built yet. Run npm run build:web in apps/bot.');

      return;
    }

    const page: Routes_Invite_Runner_LoadPublicInvite_Page = publicInvite['page'];
    const origin: Routes_Invite_Runner_RoutePublicPage_Origin = getRequestOrigin(request);
    const memberCount: Routes_Invite_Runner_RoutePublicPage_MemberCount = (publicInvite['metadata'] === undefined) ? null : publicInvite['metadata']['memberCount'] ?? null;
    const boostTier: Routes_Invite_Runner_RoutePublicPage_BoostTier = (publicInvite['metadata'] === undefined) ? null : publicInvite['metadata']['premiumTier'];
    const bannerUrl: Routes_Invite_Runner_RoutePublicPage_BannerUrl = (page['bannerImageId'] === null) ? null : getMediaUrl(page['bannerImageId']);
    let logoUrl: Routes_Invite_Runner_RoutePublicPage_LogoUrl = null;

    if (page['logo'] === 'server') {
      logoUrl = publicInvite['server']['iconUrl'];
    } else if (page['logo'] === 'custom' && page['logoImageId'] !== null) {
      logoUrl = getMediaUrl(page['logoImageId']);
    }

    const previewImageUrl: Routes_Invite_Runner_RoutePublicPage_PreviewImageUrl = bannerUrl ?? logoUrl;
    let absolutePreviewImageUrl: Routes_Invite_Runner_RoutePublicPage_PreviewImageUrl = previewImageUrl;

    if (previewImageUrl !== null && previewImageUrl.startsWith('/') === true) {
      absolutePreviewImageUrl = `${origin}${previewImageUrl}`;
    }

    const html: Routes_Invite_Runner_RoutePublicPage_Html = renderInviteDocument(template, {
      description: buildInviteDescription(page, memberCount, boostTier),
      imageUrl: absolutePreviewImageUrl,
      largeImage: bannerUrl !== null,
      themeColor: page['accentColor'],
      title: page['title'],
      url: `${origin}${request.path}`,
    }, {
      available: publicInvite['available'],
      page: {
        accentColor: page['accentColor'],
        bannerUrl,
        buttonLabel: page['buttonLabel'],
        description: page['description'],
        footerText: page['footerText'],
        logoUrl,
        showBoostTier: page['showBoostTier'],
        showMemberCount: page['showMemberCount'],
        theme: page['theme'],
        title: page['title'],
      },
      recaptchaSiteKey: (publicInvite['invite'] === undefined) ? null : publicInvite['invite']['recaptchaSiteKey'],
      server: {
        boostTier,
        iconUrl: publicInvite['server']['iconUrl'],
        memberCount,
        name: publicInvite['server']['name'],
      },
      submitPath: request.path,
    });

    this.setPageHeaders(response);

    response.status(200).type('html').send(html);

    return;
  }

  /**
   * Invite - Route Save.
   *
   * Saves the designer's fields when the page hasn't changed since it was opened.
   * The answer has the same shape as the designer's read.
   *
   * @param {Routes_Invite_Runner_RouteSave_Request}  request  - Request.
   * @param {Routes_Invite_Runner_RouteSave_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_RouteSave_Returns}
   *
   * @since 4.0.0
   */
  private async routeSave(request: Routes_Invite_Runner_RouteSave_Request, response: Routes_Invite_Runner_RouteSave_Response): Routes_Invite_Runner_RouteSave_Returns {
    const requestBody: Routes_Invite_Runner_RouteSave_RequestBody = invitePageSchema.safeParse(request.body);

    if (requestBody['success'] === false) {
      sendValidationError(response, 422, requestBody['error'], 'Check the highlighted fields.');

      return;
    }

    const serverId: Routes_Invite_Runner_RouteSave_ServerId = getServerId(response);
    const server: Routes_Invite_Runner_RouteSave_Server = await readInviteServer(this.#context['pool'], serverId);

    if (server === undefined) {
      sendError(response, 404, 'server_not_found', 'That Discord server isn\'t available.');

      return;
    }

    const result: Routes_Invite_Runner_RouteSave_Result = await saveInvitePage(this.#context['pool'], serverId, requestBody['data']);

    if (result['status'] === 'conflict') {
      sendError(response, 409, 'revision_conflict', 'The invite page changed since you opened it. Reload to see the latest version.');

      return;
    }

    if (result['status'] === 'image-missing') {
      sendError(response, 422, 'invalid_request', 'That image isn\'t available. Upload it again.', [{
        field: result['field'],
        message: 'That image isn\'t available. Upload it again.',
        path: [result['field']],
      }]);

      return;
    }

    const principal: Routes_Invite_Runner_RouteSave_Principal = getPrincipal(response);
    const inviteSettings: Routes_Invite_Runner_RouteSave_InviteSettings = await readInviteSettings(this.#context['pool'], serverId);

    writeLog('info', 'web', 'invite_page_saved', {
      guildId: serverId,
      revision: result['page']['revision'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json(this.designerResponse(request, result['page'], server, inviteSettings));

    return;
  }

  /**
   * Invite - Set Page Headers.
   *
   * Applies the public invite page's policy, allowing Google's reCAPTCHA and Discord icons.
   * The page can't be framed, and nothing else may run on it.
   *
   * @param {Routes_Invite_Runner_SetPageHeaders_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_SetPageHeaders_Returns}
   *
   * @since 4.0.0
   */
  private setPageHeaders(response: Routes_Invite_Runner_SetPageHeaders_Response): Routes_Invite_Runner_SetPageHeaders_Returns {
    response.set({
      'Cache-Control': 'no-store',
      'Content-Security-Policy': 'default-src \'self\'; base-uri \'none\'; connect-src \'self\' https://www.google.com/recaptcha/; font-src \'self\'; form-action \'self\'; frame-ancestors \'none\'; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; img-src \'self\' data: https://cdn.discordapp.com; object-src \'none\'; script-src \'self\' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src \'self\' \'unsafe-inline\'',
      'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
      'X-Frame-Options': 'DENY',
    });

    return;
  }

  /**
   * Invite - Set Public Headers.
   *
   * Applies a strict policy to the public answers that aren't the page itself.
   * Nothing in them may load or run anything.
   *
   * @param {Routes_Invite_Runner_SetPublicHeaders_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Invite_Runner_SetPublicHeaders_Returns}
   *
   * @since 4.0.0
   */
  private setPublicHeaders(response: Routes_Invite_Runner_SetPublicHeaders_Response): Routes_Invite_Runner_SetPublicHeaders_Returns {
    response.set({
      'Cache-Control': 'no-store',
      'Content-Security-Policy': 'default-src \'none\'; frame-ancestors \'none\'',
      'X-Frame-Options': 'DENY',
    });

    return;
  }
}
