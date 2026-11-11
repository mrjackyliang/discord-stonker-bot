import type express from 'express';

import type {
  Lib_ConfigurationDatabase_DiscordResources,
  Lib_ConfigurationDatabase_DiscordServer,
} from '../lib/configuration-database.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type { Shared_Principal } from '../shared.d.ts';

export type Routes_Servers_CreateIconUrl_GuildIdentifier = string;
export type Routes_Servers_CreateIconUrl_IconHash = string | undefined;
export type Routes_Servers_CreateIconUrl_Returns = string | null;

export type Routes_Servers_Runner_Access = Server_Access;
export type Routes_Servers_Runner_Context = Server_Context;
export type Routes_Servers_Runner_Constructor_Context = Server_Context;
export type Routes_Servers_Runner_Constructor_Access = Server_Access;
export type Routes_Servers_Runner_Register_App = express.Express;
export type Routes_Servers_Runner_Register_Returns = void;

export type Routes_Servers_Runner_RouteList_Request = express.Request;
export type Routes_Servers_Runner_RouteList_Response = express.Response;
export type Routes_Servers_Runner_RouteList_Returns = Promise<void>;
export type Routes_Servers_Runner_RouteList_Principal = Shared_Principal;
export type Routes_Servers_Runner_RouteList_Servers = Lib_ConfigurationDatabase_DiscordServer[];
export type Routes_Servers_Runner_RouteList_EnabledCounts = Map<string, number>;

export type Routes_Servers_Runner_RouteResources_Request = express.Request;
export type Routes_Servers_Runner_RouteResources_Response = express.Response;
export type Routes_Servers_Runner_RouteResources_Returns = Promise<void>;
export type Routes_Servers_Runner_RouteResources_Resources = Lib_ConfigurationDatabase_DiscordResources;
