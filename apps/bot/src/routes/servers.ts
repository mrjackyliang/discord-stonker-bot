import {
  getPrincipal,
  getServerId,
  serverAccessible,
} from '../lib/access.js';
import {
  countEnabledGuildFeatures,
  listDiscordResources,
  listDiscordServers,
} from '../lib/configuration-database.js';
import { handleAsync } from '../lib/http.js';

import type {
  Routes_Servers_CreateIconUrl_GuildIdentifier,
  Routes_Servers_CreateIconUrl_IconHash,
  Routes_Servers_CreateIconUrl_Returns,
  Routes_Servers_Runner_Access,
  Routes_Servers_Runner_Constructor_Access,
  Routes_Servers_Runner_Constructor_Context,
  Routes_Servers_Runner_Context,
  Routes_Servers_Runner_Register_App,
  Routes_Servers_Runner_Register_Returns,
  Routes_Servers_Runner_RouteList_EnabledCounts,
  Routes_Servers_Runner_RouteList_Principal,
  Routes_Servers_Runner_RouteList_Request,
  Routes_Servers_Runner_RouteList_Response,
  Routes_Servers_Runner_RouteList_Returns,
  Routes_Servers_Runner_RouteList_Servers,
  Routes_Servers_Runner_RouteResources_Request,
  Routes_Servers_Runner_RouteResources_Resources,
  Routes_Servers_Runner_RouteResources_Response,
  Routes_Servers_Runner_RouteResources_Returns,
} from '../types/routes/servers.d.ts';

/**
 * Servers - Create Icon URL.
 *
 * Builds the Discord CDN address of a server icon at the size the sidebar shows.
 * Servers without an icon get null, and animated icons show their first frame.
 *
 * @param {Routes_Servers_CreateIconUrl_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Routes_Servers_CreateIconUrl_IconHash}        iconHash        - Icon hash.
 *
 * @returns {Routes_Servers_CreateIconUrl_Returns}
 *
 * @since 4.0.0
 */
function createIconUrl(guildIdentifier: Routes_Servers_CreateIconUrl_GuildIdentifier, iconHash: Routes_Servers_CreateIconUrl_IconHash): Routes_Servers_CreateIconUrl_Returns {
  if (iconHash === undefined || iconHash === '') {
    return null;
  }

  return `https://cdn.discordapp.com/icons/${encodeURIComponent(guildIdentifier)}/${encodeURIComponent(iconHash)}.png?size=128`;
}

/**
 * Servers.
 *
 * Lists the Discord servers a caller can see, with the channels and roles of each.
 * Any signed-in role can read them; tokens need the features:read scope.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Servers - Access.
   *
   * Accepts a browser session or a token with the features:read scope.
   * The resources route also checks the caller can see the server.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Servers_Runner_Access;

  /**
   * Servers - Context.
   *
   * Supplies the database pool that holds what the bot last saw of each server.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Servers_Runner_Context;

  /**
   * Servers - Constructor.
   *
   * Binds the server routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Servers_Runner_Constructor_Context} context - Context.
   * @param {Routes_Servers_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Servers_Runner_Constructor_Context, access: Routes_Servers_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Servers - Register.
   *
   * Installs the server list and the channel and role list of one server.
   * Both only read.
   *
   * @param {Routes_Servers_Runner_Register_App} app - App.
   *
   * @returns {Routes_Servers_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Servers_Runner_Register_App): Routes_Servers_Runner_Register_Returns {
    app.get('/api/v1/servers', this.#access.requireAccess({
      mutation: false,
      scope: 'features:read',
    }), handleAsync(this['routeList'].bind(this)));

    app.get('/api/v1/servers/:serverId/resources', this.#access.requireAccess({
      mutation: false,
      scope: 'features:read',
    }), this.#access.requireServer(), handleAsync(this['routeResources'].bind(this)));

    return;
  }

  /**
   * Servers - Route List.
   *
   * Answers the servers the caller can see, with their icon and how many features are on.
   * Servers the bot has left stay listed as unavailable so their settings can still be read.
   *
   * @param {Routes_Servers_Runner_RouteList_Request}  _request - Request.
   * @param {Routes_Servers_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Servers_Runner_RouteList_Returns}
   *
   * @since 4.0.0
   */
  private async routeList(_request: Routes_Servers_Runner_RouteList_Request, response: Routes_Servers_Runner_RouteList_Response): Routes_Servers_Runner_RouteList_Returns {
    const principal: Routes_Servers_Runner_RouteList_Principal = getPrincipal(response);
    const servers: Routes_Servers_Runner_RouteList_Servers = await listDiscordServers(this.#context['pool']);
    const enabledCounts: Routes_Servers_Runner_RouteList_EnabledCounts = await countEnabledGuildFeatures(this.#context['pool']);

    response.json({
      items: servers.filter((server) => serverAccessible(principal['user'], server['guildIdentifier'])).map((server) => ({
        available: server['available'],
        enabledFeatures: enabledCounts.get(server['guildIdentifier']) ?? 0,
        iconUrl: createIconUrl(server['guildIdentifier'], server['iconHash']),
        id: server['guildIdentifier'],
        name: server['name'],
      })),
    });

    return;
  }

  /**
   * Servers - Route Resources.
   *
   * Answers the channels and roles of one server for the pickers in feature forms.
   * Ones the bot can no longer see are marked unavailable instead of left out.
   *
   * @param {Routes_Servers_Runner_RouteResources_Request}  _request - Request.
   * @param {Routes_Servers_Runner_RouteResources_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Servers_Runner_RouteResources_Returns}
   *
   * @since 4.0.0
   */
  private async routeResources(_request: Routes_Servers_Runner_RouteResources_Request, response: Routes_Servers_Runner_RouteResources_Response): Routes_Servers_Runner_RouteResources_Returns {
    const resources: Routes_Servers_Runner_RouteResources_Resources = await listDiscordResources(this.#context['pool'], getServerId(response));

    response.json(resources);

    return;
  }
}
