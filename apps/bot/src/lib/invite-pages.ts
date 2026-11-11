import type {
  Lib_InvitePages_BuildInviteDescription_BoostTier,
  Lib_InvitePages_BuildInviteDescription_Description,
  Lib_InvitePages_BuildInviteDescription_MemberCount,
  Lib_InvitePages_BuildInviteDescription_Page,
  Lib_InvitePages_BuildInviteDescription_Parts,
  Lib_InvitePages_BuildInviteDescription_Returns,
  Lib_InvitePages_BuildInviteDescription_Unit,
  Lib_InvitePages_DetectImageType_Data,
  Lib_InvitePages_DetectImageType_Returns,
  Lib_InvitePages_EscapeHtml_Returns,
  Lib_InvitePages_EscapeHtml_Value,
  Lib_InvitePages_GetDefaultInvitePage_Returns,
  Lib_InvitePages_GetDefaultInvitePage_ServerName,
  Lib_InvitePages_GetMediaUrl_ImageId,
  Lib_InvitePages_GetMediaUrl_Returns,
  Lib_InvitePages_GetServerIconUrl_GuildIdentifier,
  Lib_InvitePages_GetServerIconUrl_IconHash,
  Lib_InvitePages_GetServerIconUrl_Returns,
  Lib_InvitePages_ImageExists_Client,
  Lib_InvitePages_ImageExists_GuildIdentifier,
  Lib_InvitePages_ImageExists_ImageId,
  Lib_InvitePages_ImageExists_Result,
  Lib_InvitePages_ImageExists_Returns,
  Lib_InvitePages_InvitePageFromRow_Returns,
  Lib_InvitePages_InvitePageFromRow_Row,
  Lib_InvitePages_ReadInviteImage_FirstRow,
  Lib_InvitePages_ReadInviteImage_ImageId,
  Lib_InvitePages_ReadInviteImage_Pool,
  Lib_InvitePages_ReadInviteImage_Result,
  Lib_InvitePages_ReadInviteImage_Returns,
  Lib_InvitePages_ReadInviteImage_Row,
  Lib_InvitePages_ReadInvitePage_FirstRow,
  Lib_InvitePages_ReadInvitePage_GuildIdentifier,
  Lib_InvitePages_ReadInvitePage_Pool,
  Lib_InvitePages_ReadInvitePage_Result,
  Lib_InvitePages_ReadInvitePage_Returns,
  Lib_InvitePages_ReadInvitePage_Row,
  Lib_InvitePages_ReadInvitePage_ServerName,
  Lib_InvitePages_ReadInviteServer_FirstRow,
  Lib_InvitePages_ReadInviteServer_GuildIdentifier,
  Lib_InvitePages_ReadInviteServer_Pool,
  Lib_InvitePages_ReadInviteServer_Result,
  Lib_InvitePages_ReadInviteServer_Returns,
  Lib_InvitePages_ReadInviteServer_Row,
  Lib_InvitePages_RenderInviteDocument_Data,
  Lib_InvitePages_RenderInviteDocument_Head,
  Lib_InvitePages_RenderInviteDocument_HeadMarkup,
  Lib_InvitePages_RenderInviteDocument_Returns,
  Lib_InvitePages_RenderInviteDocument_SerializedData,
  Lib_InvitePages_RenderInviteDocument_Template,
  Lib_InvitePages_RenderInviteDocument_TwitterCard,
  Lib_InvitePages_SaveInvitePage_Client,
  Lib_InvitePages_SaveInvitePage_CurrentRevision,
  Lib_InvitePages_SaveInvitePage_FirstRevisionRow,
  Lib_InvitePages_SaveInvitePage_FirstRow,
  Lib_InvitePages_SaveInvitePage_GuildIdentifier,
  Lib_InvitePages_SaveInvitePage_Input,
  Lib_InvitePages_SaveInvitePage_LogoImageId,
  Lib_InvitePages_SaveInvitePage_Pool,
  Lib_InvitePages_SaveInvitePage_Result,
  Lib_InvitePages_SaveInvitePage_Returns,
  Lib_InvitePages_SaveInvitePage_RevisionResult,
  Lib_InvitePages_SaveInvitePage_RevisionRow,
  Lib_InvitePages_SaveInvitePage_Row,
  Lib_InvitePages_StoreInviteImage_ContentType,
  Lib_InvitePages_StoreInviteImage_Data,
  Lib_InvitePages_StoreInviteImage_FirstRow,
  Lib_InvitePages_StoreInviteImage_GuildIdentifier,
  Lib_InvitePages_StoreInviteImage_Pool,
  Lib_InvitePages_StoreInviteImage_Result,
  Lib_InvitePages_StoreInviteImage_Returns,
  Lib_InvitePages_StoreInviteImage_Row,
} from '../types/lib/invite-pages.d.ts';

/**
 * Invite Pages - Default Accent Color.
 *
 * Starts every new invite page with the control panel's purple accent.
 * Operators pick their own color in the designer.
 *
 * @since 4.0.0
 */
const DEFAULT_ACCENT_COLOR = '#6250d9';

/**
 * Invite Pages - Default Button Label.
 *
 * Labels the join button until the operator writes their own.
 * The page shows the reCAPTCHA check before the button sends anything.
 *
 * @since 4.0.0
 */
const DEFAULT_BUTTON_LABEL = 'Join the server';

/**
 * Invite Pages - Kept Unused Images.
 *
 * Keeps the newest uploads that no saved page uses yet, so a draft survives a few retries.
 * Older unused uploads are deleted whenever another image is stored.
 *
 * @since 4.0.0
 */
const KEPT_UNUSED_IMAGES = 9;

/**
 * Invite Pages - Page Columns.
 *
 * Lists the stored invite page columns every read and write returns.
 * Image ids are read as text so they stay plain strings.
 *
 * @since 4.0.0
 */
const PAGE_COLUMNS = 'title, description, accent_color, logo, logo_image_id::text, banner_image_id::text, show_member_count, show_boost_tier, button_label, footer_text, theme, revision::text, updated_at';

/**
 * Invite Pages - Build Invite Description.
 *
 * Joins the page description with the member count and boost level when they're shown.
 * Discord's link preview and search results read the same text.
 *
 * @param {Lib_InvitePages_BuildInviteDescription_Page}        page        - Page.
 * @param {Lib_InvitePages_BuildInviteDescription_MemberCount} memberCount - Member count.
 * @param {Lib_InvitePages_BuildInviteDescription_BoostTier}   boostTier   - Boost tier.
 *
 * @returns {Lib_InvitePages_BuildInviteDescription_Returns}
 *
 * @since 4.0.0
 */
export function buildInviteDescription(
  page: Lib_InvitePages_BuildInviteDescription_Page,
  memberCount: Lib_InvitePages_BuildInviteDescription_MemberCount,
  boostTier: Lib_InvitePages_BuildInviteDescription_BoostTier,
): Lib_InvitePages_BuildInviteDescription_Returns {
  const description: Lib_InvitePages_BuildInviteDescription_Description = page['description'].trim();
  const parts: Lib_InvitePages_BuildInviteDescription_Parts = (description === '') ? [] : [description];

  if (page['showMemberCount'] === true && memberCount !== null) {
    const unit: Lib_InvitePages_BuildInviteDescription_Unit = (memberCount === 1) ? 'member' : 'members';

    parts.push(`${memberCount.toLocaleString('en-US')} ${unit}`);
  }

  if (
    page['showBoostTier'] === true
    && boostTier !== null
    && boostTier > 0
  ) {
    parts.push(`Boost level ${boostTier}`);
  }

  return parts.join(' · ');
}

/**
 * Invite Pages - Detect Image Type.
 *
 * Reads the leading bytes of an upload to tell PNG, JPEG, GIF, and WebP images apart.
 * Anything else, including SVG, is rejected regardless of the type the browser claimed.
 *
 * @param {Lib_InvitePages_DetectImageType_Data} data - Data.
 *
 * @returns {Lib_InvitePages_DetectImageType_Returns}
 *
 * @since 4.0.0
 */
export function detectImageType(data: Lib_InvitePages_DetectImageType_Data): Lib_InvitePages_DetectImageType_Returns {
  if (data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) === true) {
    return 'image/png';
  }

  if (data.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex')) === true) {
    return 'image/jpeg';
  }

  if (
    data.length >= 6
    && (
      data.subarray(0, 6).toString('latin1') === 'GIF87a'
      || data.subarray(0, 6).toString('latin1') === 'GIF89a'
    )
  ) {
    return 'image/gif';
  }

  if (
    data.length >= 12
    && data.subarray(0, 4).toString('latin1') === 'RIFF'
    && data.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp';
  }

  return undefined;
}

/**
 * Invite Pages - Escape HTML.
 *
 * Encodes text placed in the public page's head tags and attributes.
 * Server names and operator copy never reach the markup unescaped.
 *
 * @param {Lib_InvitePages_EscapeHtml_Value} value - Value.
 *
 * @returns {Lib_InvitePages_EscapeHtml_Returns}
 *
 * @since 4.0.0
 */
export function escapeHtml(value: Lib_InvitePages_EscapeHtml_Value): Lib_InvitePages_EscapeHtml_Returns {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;');
}

/**
 * Invite Pages - Get Default Invite Page.
 *
 * Describes the page a server shows before anyone saves the designer.
 * The title uses the server's name and the logo uses its icon.
 *
 * @param {Lib_InvitePages_GetDefaultInvitePage_ServerName} serverName - Server name.
 *
 * @returns {Lib_InvitePages_GetDefaultInvitePage_Returns}
 *
 * @since 4.0.0
 */
export function getDefaultInvitePage(serverName: Lib_InvitePages_GetDefaultInvitePage_ServerName): Lib_InvitePages_GetDefaultInvitePage_Returns {
  return {
    accentColor: DEFAULT_ACCENT_COLOR,
    bannerImageId: null,
    buttonLabel: DEFAULT_BUTTON_LABEL,
    description: '',
    footerText: '',
    logo: 'server',
    logoImageId: null,
    revision: 0,
    showBoostTier: false,
    showMemberCount: true,
    theme: 'system',
    title: `Join ${serverName}`.slice(0, 100),
    updatedAt: null,
  };
}

/**
 * Invite Pages - Get Media URL.
 *
 * Builds the public path of an uploaded invite image.
 * Callers add the request origin when a link preview needs an absolute URL.
 *
 * @param {Lib_InvitePages_GetMediaUrl_ImageId} imageId - Image id.
 *
 * @returns {Lib_InvitePages_GetMediaUrl_Returns}
 *
 * @since 4.0.0
 */
export function getMediaUrl(imageId: Lib_InvitePages_GetMediaUrl_ImageId): Lib_InvitePages_GetMediaUrl_Returns {
  return `/media/${encodeURIComponent(imageId)}`;
}

/**
 * Invite Pages - Get Server Icon URL.
 *
 * Builds the Discord CDN address of a server's icon, or null when it has none.
 * Animated icons fall back to their first frame.
 *
 * @param {Lib_InvitePages_GetServerIconUrl_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_InvitePages_GetServerIconUrl_IconHash}        iconHash        - Icon hash.
 *
 * @returns {Lib_InvitePages_GetServerIconUrl_Returns}
 *
 * @since 4.0.0
 */
export function getServerIconUrl(guildIdentifier: Lib_InvitePages_GetServerIconUrl_GuildIdentifier, iconHash: Lib_InvitePages_GetServerIconUrl_IconHash): Lib_InvitePages_GetServerIconUrl_Returns {
  if (iconHash === null || iconHash === '') {
    return null;
  }

  return `https://cdn.discordapp.com/icons/${encodeURIComponent(guildIdentifier)}/${encodeURIComponent(iconHash)}.png?size=256`;
}

/**
 * Invite Pages - Read Invite Image.
 *
 * Loads one uploaded invite image for the public media route.
 * Unknown ids return undefined.
 *
 * @param {Lib_InvitePages_ReadInviteImage_Pool}    pool    - Pool.
 * @param {Lib_InvitePages_ReadInviteImage_ImageId} imageId - Image id.
 *
 * @returns {Lib_InvitePages_ReadInviteImage_Returns}
 *
 * @since 4.0.0
 */
export async function readInviteImage(pool: Lib_InvitePages_ReadInviteImage_Pool, imageId: Lib_InvitePages_ReadInviteImage_ImageId): Lib_InvitePages_ReadInviteImage_Returns {
  const result: Lib_InvitePages_ReadInviteImage_Result = await pool.query<Lib_InvitePages_ReadInviteImage_Row>(
    'SELECT content_type, data FROM guild_invite_images WHERE id = $1',
    [imageId],
  );
  const row: Lib_InvitePages_ReadInviteImage_FirstRow = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return {
    contentType: row['content_type'],
    data: Buffer.from(row['data']),
  };
}

/**
 * Invite Pages - Read Invite Page.
 *
 * Returns a server's saved invite page, or the default page while none is saved.
 * Revision 0 marks the unsaved default.
 *
 * @param {Lib_InvitePages_ReadInvitePage_Pool}            pool            - Pool.
 * @param {Lib_InvitePages_ReadInvitePage_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_InvitePages_ReadInvitePage_ServerName}      serverName      - Server name.
 *
 * @returns {Lib_InvitePages_ReadInvitePage_Returns}
 *
 * @since 4.0.0
 */
export async function readInvitePage(pool: Lib_InvitePages_ReadInvitePage_Pool, guildIdentifier: Lib_InvitePages_ReadInvitePage_GuildIdentifier, serverName: Lib_InvitePages_ReadInvitePage_ServerName): Lib_InvitePages_ReadInvitePage_Returns {
  const result: Lib_InvitePages_ReadInvitePage_Result = await pool.query<Lib_InvitePages_ReadInvitePage_Row>(
    `SELECT ${PAGE_COLUMNS} FROM guild_invite_pages WHERE guild_id = $1`,
    [guildIdentifier],
  );
  const row: Lib_InvitePages_ReadInvitePage_FirstRow = result.rows[0];

  if (row === undefined) {
    return getDefaultInvitePage(serverName);
  }

  return invitePageFromRow(row);
}

/**
 * Invite Pages - Read Invite Server.
 *
 * Loads the name and icon the bot last recorded for a server.
 * Unknown servers return undefined.
 *
 * @param {Lib_InvitePages_ReadInviteServer_Pool}            pool            - Pool.
 * @param {Lib_InvitePages_ReadInviteServer_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_InvitePages_ReadInviteServer_Returns}
 *
 * @since 4.0.0
 */
export async function readInviteServer(pool: Lib_InvitePages_ReadInviteServer_Pool, guildIdentifier: Lib_InvitePages_ReadInviteServer_GuildIdentifier): Lib_InvitePages_ReadInviteServer_Returns {
  const result: Lib_InvitePages_ReadInviteServer_Result = await pool.query<Lib_InvitePages_ReadInviteServer_Row>(
    'SELECT name, icon_hash FROM discord_servers WHERE guild_id = $1',
    [guildIdentifier],
  );
  const row: Lib_InvitePages_ReadInviteServer_FirstRow = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return {
    iconUrl: getServerIconUrl(guildIdentifier, row['icon_hash']),
    name: row['name'],
  };
}

/**
 * Invite Pages - Render Invite Document.
 *
 * Fills the built invite.html with escaped head tags and the page data as inert JSON.
 * The JSON escapes "<" so no value can close its script element.
 *
 * @param {Lib_InvitePages_RenderInviteDocument_Template} template - Template.
 * @param {Lib_InvitePages_RenderInviteDocument_Head}     head     - Head.
 * @param {Lib_InvitePages_RenderInviteDocument_Data}     data     - Data.
 *
 * @returns {Lib_InvitePages_RenderInviteDocument_Returns}
 *
 * @since 4.0.0
 */
export function renderInviteDocument(template: Lib_InvitePages_RenderInviteDocument_Template, head: Lib_InvitePages_RenderInviteDocument_Head, data: Lib_InvitePages_RenderInviteDocument_Data): Lib_InvitePages_RenderInviteDocument_Returns {
  const twitterCard: Lib_InvitePages_RenderInviteDocument_TwitterCard = (head['largeImage'] === true) ? 'summary_large_image' : 'summary';
  const headMarkup: Lib_InvitePages_RenderInviteDocument_HeadMarkup = [
    `<title>${escapeHtml(head['title'])}</title>`,
    `<meta name="description" content="${escapeHtml(head['description'])}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${escapeHtml(head['title'])}" />`,
    `<meta property="og:description" content="${escapeHtml(head['description'])}" />`,
    `<meta property="og:url" content="${escapeHtml(head['url'])}" />`,
    ...((head['imageUrl'] === null) ? [] : [`<meta property="og:image" content="${escapeHtml(head['imageUrl'])}" />`]),
    ...((head['imageUrl'] === null) ? [] : [`<meta name="twitter:card" content="${twitterCard}" />`]),
    `<meta name="theme-color" content="${escapeHtml(head['themeColor'])}" />`,
  ].join('\n    ');
  const serializedData: Lib_InvitePages_RenderInviteDocument_SerializedData = JSON.stringify(data)
    .replaceAll('<', '\\u003c')
    .replaceAll(String.fromCharCode(8232), '\\u2028')
    .replaceAll(String.fromCharCode(8233), '\\u2029');

  // Replacer functions keep "$&" and similar patterns in page text from being expanded.
  return template
    .replace('<!-- invite-head -->', () => headMarkup)
    .replace('<!-- invite-data -->', () => `<script type="application/json" id="invite-data">${serializedData}</script>`);
}

/**
 * Invite Pages - Save Invite Page.
 *
 * Stores a server's invite page when its revision still matches, in one transaction.
 * Uploaded images the page no longer uses are deleted in the same step.
 *
 * @param {Lib_InvitePages_SaveInvitePage_Pool}            pool            - Pool.
 * @param {Lib_InvitePages_SaveInvitePage_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_InvitePages_SaveInvitePage_Input}           input           - Input.
 *
 * @returns {Lib_InvitePages_SaveInvitePage_Returns}
 *
 * @since 4.0.0
 */
export async function saveInvitePage(pool: Lib_InvitePages_SaveInvitePage_Pool, guildIdentifier: Lib_InvitePages_SaveInvitePage_GuildIdentifier, input: Lib_InvitePages_SaveInvitePage_Input): Lib_InvitePages_SaveInvitePage_Returns {
  const client: Lib_InvitePages_SaveInvitePage_Client = await pool.connect();
  const logoImageId: Lib_InvitePages_SaveInvitePage_LogoImageId = (input['logo'] === 'custom') ? input['logoImageId'] : null;

  try {
    await client.query('BEGIN');

    const revisionResult: Lib_InvitePages_SaveInvitePage_RevisionResult = await client.query<Lib_InvitePages_SaveInvitePage_RevisionRow>(
      'SELECT revision::text FROM guild_invite_pages WHERE guild_id = $1 FOR UPDATE',
      [guildIdentifier],
    );
    const revisionRow: Lib_InvitePages_SaveInvitePage_FirstRevisionRow = revisionResult.rows[0];
    const currentRevision: Lib_InvitePages_SaveInvitePage_CurrentRevision = (revisionRow === undefined) ? 0 : Number.parseInt(revisionRow['revision'], 10);

    if (currentRevision !== input['expectedRevision']) {
      await client.query('ROLLBACK');

      return {
        status: 'conflict',
      };
    }

    if (logoImageId !== null && await imageExists(client, guildIdentifier, logoImageId) === false) {
      await client.query('ROLLBACK');

      return {
        field: 'logoImageId',
        status: 'image-missing',
      };
    }

    if (input['bannerImageId'] !== null && await imageExists(client, guildIdentifier, input['bannerImageId']) === false) {
      await client.query('ROLLBACK');

      return {
        field: 'bannerImageId',
        status: 'image-missing',
      };
    }

    const result: Lib_InvitePages_SaveInvitePage_Result = await client.query<Lib_InvitePages_SaveInvitePage_Row>(
      `INSERT INTO guild_invite_pages (guild_id, title, description, accent_color, logo, logo_image_id, banner_image_id, show_member_count, show_boost_tier, button_label, footer_text, theme, revision, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 1, NOW()) ON CONFLICT (guild_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, accent_color = EXCLUDED.accent_color, logo = EXCLUDED.logo, logo_image_id = EXCLUDED.logo_image_id, banner_image_id = EXCLUDED.banner_image_id, show_member_count = EXCLUDED.show_member_count, show_boost_tier = EXCLUDED.show_boost_tier, button_label = EXCLUDED.button_label, footer_text = EXCLUDED.footer_text, theme = EXCLUDED.theme, revision = guild_invite_pages.revision + 1, updated_at = NOW() WHERE guild_invite_pages.revision = $13 RETURNING ${PAGE_COLUMNS}`,
      [
        guildIdentifier,
        input['title'],
        input['description'],
        input['accentColor'],
        input['logo'],
        logoImageId,
        input['bannerImageId'],
        input['showMemberCount'],
        input['showBoostTier'],
        input['buttonLabel'],
        input['footerText'],
        input['theme'],
        input['expectedRevision'],
      ],
    );
    const row: Lib_InvitePages_SaveInvitePage_FirstRow = result.rows[0];

    // Another first save can win the insert after the revision check, which leaves no row here.
    if (row === undefined) {
      await client.query('ROLLBACK');

      return {
        status: 'conflict',
      };
    }

    await client.query(
      'DELETE FROM guild_invite_images WHERE guild_id = $1 AND id IS DISTINCT FROM $2::uuid AND id IS DISTINCT FROM $3::uuid',
      [
        guildIdentifier,
        logoImageId,
        input['bannerImageId'],
      ],
    );

    await client.query('COMMIT');

    return {
      page: invitePageFromRow(row),
      status: 'saved',
    };
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Invite Pages - Store Invite Image.
 *
 * Saves one checked upload for a server and returns its new id.
 * Older uploads that no saved page uses are trimmed first.
 *
 * @param {Lib_InvitePages_StoreInviteImage_Pool}            pool            - Pool.
 * @param {Lib_InvitePages_StoreInviteImage_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_InvitePages_StoreInviteImage_ContentType}     contentType     - Content type.
 * @param {Lib_InvitePages_StoreInviteImage_Data}            data            - Data.
 *
 * @returns {Lib_InvitePages_StoreInviteImage_Returns}
 *
 * @since 4.0.0
 */
export async function storeInviteImage(pool: Lib_InvitePages_StoreInviteImage_Pool, guildIdentifier: Lib_InvitePages_StoreInviteImage_GuildIdentifier, contentType: Lib_InvitePages_StoreInviteImage_ContentType, data: Lib_InvitePages_StoreInviteImage_Data): Lib_InvitePages_StoreInviteImage_Returns {
  await pool.query(
    `DELETE FROM guild_invite_images AS image WHERE image.guild_id = $1 AND NOT EXISTS (SELECT 1 FROM guild_invite_pages AS page WHERE page.guild_id = image.guild_id AND (page.logo_image_id = image.id OR page.banner_image_id = image.id)) AND image.id NOT IN (SELECT recent.id FROM guild_invite_images AS recent WHERE recent.guild_id = $1 ORDER BY recent.created_at DESC, recent.id DESC LIMIT ${KEPT_UNUSED_IMAGES})`,
    [guildIdentifier],
  );

  const result: Lib_InvitePages_StoreInviteImage_Result = await pool.query<Lib_InvitePages_StoreInviteImage_Row>(
    'INSERT INTO guild_invite_images (guild_id, content_type, data) VALUES ($1, $2, $3) RETURNING id::text',
    [
      guildIdentifier,
      contentType,
      data,
    ],
  );
  const row: Lib_InvitePages_StoreInviteImage_FirstRow = result.rows[0];

  if (row === undefined) {
    throw new Error('The invite image could not be stored.');
  }

  return row['id'];
}

/**
 * Invite Pages - Image Exists.
 *
 * Checks that an image id belongs to the server whose page is being saved.
 * Another server's uploads can't be reused.
 *
 * @param {Lib_InvitePages_ImageExists_Client}          client          - Client.
 * @param {Lib_InvitePages_ImageExists_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_InvitePages_ImageExists_ImageId}         imageId         - Image id.
 *
 * @private
 *
 * @returns {Lib_InvitePages_ImageExists_Returns}
 *
 * @since 4.0.0
 */
async function imageExists(client: Lib_InvitePages_ImageExists_Client, guildIdentifier: Lib_InvitePages_ImageExists_GuildIdentifier, imageId: Lib_InvitePages_ImageExists_ImageId): Lib_InvitePages_ImageExists_Returns {
  const result: Lib_InvitePages_ImageExists_Result = await client.query(
    'SELECT 1 FROM guild_invite_images WHERE guild_id = $1 AND id = $2',
    [
      guildIdentifier,
      imageId,
    ],
  );

  return (result.rowCount ?? 0) > 0;
}

/**
 * Invite Pages - Invite Page From Row.
 *
 * Maps a stored invite page row to the designer's field names.
 * Revisions and times become a number and an ISO string.
 *
 * @param {Lib_InvitePages_InvitePageFromRow_Row} row - Row.
 *
 * @private
 *
 * @returns {Lib_InvitePages_InvitePageFromRow_Returns}
 *
 * @since 4.0.0
 */
function invitePageFromRow(row: Lib_InvitePages_InvitePageFromRow_Row): Lib_InvitePages_InvitePageFromRow_Returns {
  return {
    accentColor: row['accent_color'],
    bannerImageId: row['banner_image_id'],
    buttonLabel: row['button_label'],
    description: row['description'],
    footerText: row['footer_text'],
    logo: row['logo'],
    logoImageId: row['logo_image_id'],
    revision: Number.parseInt(row['revision'], 10),
    showBoostTier: row['show_boost_tier'],
    showMemberCount: row['show_member_count'],
    theme: row['theme'],
    title: row['title'],
    updatedAt: new Date(row['updated_at']).toISOString(),
  };
}
