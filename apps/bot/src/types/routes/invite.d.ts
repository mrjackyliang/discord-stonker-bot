import type express from 'express';
import type { RateLimitRequestHandler } from 'express-rate-limit';
import type { z } from 'zod';

import type {
  Lib_InvitePages_InviteImage,
  Lib_InvitePages_InvitePage,
  Lib_InvitePages_InvitePageInput,
  Lib_InvitePages_InviteServer,
  Lib_InvitePages_SaveResult,
} from '../lib/invite-pages.d.ts';
import type {
  Lib_WebApplicationFeatures_GuildMetadata,
  Lib_WebApplicationFeatures_InviteConfiguration,
  Lib_WebApplicationFeatures_InviteSettings,
  Lib_WebApplicationFeatures_PublicRoute,
  Lib_WebApplicationFeatures_Runtime,
} from '../lib/web-application-features.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_BotRuntimeControl,
  Shared_Principal,
} from '../shared.d.ts';

export type Routes_Invite_ImageContentTypes = string[];

export type Routes_Invite_DesignerPage = Lib_InvitePages_InvitePage & {
  bannerImageUrl: string | null;
  logoImageUrl: string | null;
};
export type Routes_Invite_DesignerResponse = {
  enabled: boolean;
  page: Routes_Invite_DesignerPage;
  publicUrl: string | null;
  server: Lib_InvitePages_InviteServer;
};
export type Routes_Invite_PublicInvite = {
  available: boolean;
  invite: Lib_WebApplicationFeatures_InviteConfiguration | undefined;
  metadata: Lib_WebApplicationFeatures_GuildMetadata | undefined;
  page: Lib_InvitePages_InvitePage;
  server: Lib_InvitePages_InviteServer;
};
export type Routes_Invite_GuildMetadataEntry = {
  expiresAt: number;
  metadata: Lib_WebApplicationFeatures_GuildMetadata | undefined;
};

export type Routes_Invite_Runner_Access = Server_Access;
export type Routes_Invite_Runner_Context = Server_Context;
export type Routes_Invite_Runner_GuildMetadataCache = Map<string, Routes_Invite_GuildMetadataEntry>;
export type Routes_Invite_Runner_ImageParser = express.RequestHandler;
export type Routes_Invite_Runner_InviteLimiter = RateLimitRequestHandler;

export type Routes_Invite_Runner_Constructor_Context = Server_Context;
export type Routes_Invite_Runner_Constructor_Access = Server_Access;

export type Routes_Invite_Runner_Register_App = express.Express;
export type Routes_Invite_Runner_Register_Returns = void;

export type Routes_Invite_Runner_DesignerResponse_Request = express.Request;
export type Routes_Invite_Runner_DesignerResponse_Page = Lib_InvitePages_InvitePage;
export type Routes_Invite_Runner_DesignerResponse_Server = Lib_InvitePages_InviteServer;
export type Routes_Invite_Runner_DesignerResponse_InviteSettings = Lib_WebApplicationFeatures_InviteSettings;
export type Routes_Invite_Runner_DesignerResponse_Returns = Routes_Invite_DesignerResponse;

export type Routes_Invite_Runner_GetGuildMetadata_GuildIdentifier = string;
export type Routes_Invite_Runner_GetGuildMetadata_TokenCiphertext = string;
export type Routes_Invite_Runner_GetGuildMetadata_Returns = Promise<Lib_WebApplicationFeatures_GuildMetadata | undefined>;
export type Routes_Invite_Runner_GetGuildMetadata_Now = number;
export type Routes_Invite_Runner_GetGuildMetadata_Cached = Routes_Invite_GuildMetadataEntry | undefined;
export type Routes_Invite_Runner_GetGuildMetadata_Metadata = Lib_WebApplicationFeatures_GuildMetadata | undefined;
export type Routes_Invite_Runner_GetGuildMetadata_DiscordToken = string;

export type Routes_Invite_Runner_HandleImageError_Error = unknown;
export type Routes_Invite_Runner_HandleImageError_Request = express.Request;
export type Routes_Invite_Runner_HandleImageError_Response = express.Response;
export type Routes_Invite_Runner_HandleImageError_Next = express.NextFunction;
export type Routes_Invite_Runner_HandleImageError_Returns = void;
export type Routes_Invite_Runner_HandleImageError_Type = unknown;

export type Routes_Invite_Runner_LoadPublicInvite_GuildIdentifier = string;
export type Routes_Invite_Runner_LoadPublicInvite_Path = string;
export type Routes_Invite_Runner_LoadPublicInvite_Returns = Promise<Routes_Invite_PublicInvite | undefined>;
export type Routes_Invite_Runner_LoadPublicInvite_Server = Lib_InvitePages_InviteServer | undefined;
export type Routes_Invite_Runner_LoadPublicInvite_Page = Lib_InvitePages_InvitePage;
export type Routes_Invite_Runner_LoadPublicInvite_Runtime = Lib_WebApplicationFeatures_Runtime | undefined;
export type Routes_Invite_Runner_LoadPublicInvite_Invite = Lib_WebApplicationFeatures_InviteConfiguration | undefined;
export type Routes_Invite_Runner_LoadPublicInvite_Control = Shared_BotRuntimeControl;
export type Routes_Invite_Runner_LoadPublicInvite_Running = boolean;
export type Routes_Invite_Runner_LoadPublicInvite_Metadata = Lib_WebApplicationFeatures_GuildMetadata | undefined;
export type Routes_Invite_Runner_LoadPublicInvite_Available = boolean;

export type Routes_Invite_Runner_RouteDesign_Request = express.Request;
export type Routes_Invite_Runner_RouteDesign_Response = express.Response;
export type Routes_Invite_Runner_RouteDesign_Returns = Promise<void>;
export type Routes_Invite_Runner_RouteDesign_ServerId = string;
export type Routes_Invite_Runner_RouteDesign_Server = Lib_InvitePages_InviteServer | undefined;

export type Routes_Invite_Runner_RouteImage_Request = express.Request;
export type Routes_Invite_Runner_RouteImage_Response = express.Response;
export type Routes_Invite_Runner_RouteImage_Returns = Promise<void>;
export type Routes_Invite_Runner_RouteImage_ServerId = string;
export type Routes_Invite_Runner_RouteImage_Data = Buffer;
export type Routes_Invite_Runner_RouteImage_ContentType = 'image/gif' | 'image/jpeg' | 'image/png' | 'image/webp' | undefined;
export type Routes_Invite_Runner_RouteImage_ImageId = string;

export type Routes_Invite_Runner_RouteMedia_Request = express.Request;
export type Routes_Invite_Runner_RouteMedia_Response = express.Response;
export type Routes_Invite_Runner_RouteMedia_Returns = Promise<void>;
export type Routes_Invite_Runner_RouteMedia_ImageId = string;
export type Routes_Invite_Runner_RouteMedia_Image = Lib_InvitePages_InviteImage | undefined;

export type Routes_Invite_Runner_RoutePublicInvite_Request = express.Request;
export type Routes_Invite_Runner_RoutePublicInvite_Response = express.Response;
export type Routes_Invite_Runner_RoutePublicInvite_Returns = Promise<void>;
export type Routes_Invite_Runner_RoutePublicInvite_PublicRoute = Lib_WebApplicationFeatures_PublicRoute | undefined;
export type Routes_Invite_Runner_RoutePublicInvite_Body = z.ZodSafeParseResult<{
  recaptchaToken: string;
}>;
export type Routes_Invite_Runner_RoutePublicInvite_Control = Shared_BotRuntimeControl;
export type Routes_Invite_Runner_RoutePublicInvite_Runtime = Lib_WebApplicationFeatures_Runtime | undefined;
export type Routes_Invite_Runner_RoutePublicInvite_Invite = Lib_WebApplicationFeatures_InviteConfiguration | undefined;
export type Routes_Invite_Runner_RoutePublicInvite_Verified = boolean;
export type Routes_Invite_Runner_RoutePublicInvite_Metadata = Lib_WebApplicationFeatures_GuildMetadata | undefined;
export type Routes_Invite_Runner_RoutePublicInvite_InviteUrl = string | undefined;
export type Routes_Invite_Runner_RoutePublicInvite_DiscordToken = string;

export type Routes_Invite_Runner_RoutePublicPage_Request = express.Request;
export type Routes_Invite_Runner_RoutePublicPage_Response = express.Response;
export type Routes_Invite_Runner_RoutePublicPage_Returns = Promise<void>;
export type Routes_Invite_Runner_RoutePublicPage_PublicRoute = Lib_WebApplicationFeatures_PublicRoute | undefined;
export type Routes_Invite_Runner_RoutePublicPage_PublicInvite = Routes_Invite_PublicInvite | undefined;
export type Routes_Invite_Runner_RoutePublicPage_Template = string | undefined;
export type Routes_Invite_Runner_RoutePublicPage_Origin = string;
export type Routes_Invite_Runner_RoutePublicPage_MemberCount = number | null;
export type Routes_Invite_Runner_RoutePublicPage_BoostTier = number | null;
export type Routes_Invite_Runner_RoutePublicPage_BannerUrl = string | null;
export type Routes_Invite_Runner_RoutePublicPage_LogoUrl = string | null;
export type Routes_Invite_Runner_RoutePublicPage_PreviewImageUrl = string | null;
export type Routes_Invite_Runner_RoutePublicPage_Html = string;

export type Routes_Invite_Runner_RouteSave_Request = express.Request;
export type Routes_Invite_Runner_RouteSave_Response = express.Response;
export type Routes_Invite_Runner_RouteSave_Returns = Promise<void>;
export type Routes_Invite_Runner_RouteSave_RequestBody = z.ZodSafeParseResult<Lib_InvitePages_InvitePageInput>;
export type Routes_Invite_Runner_RouteSave_ServerId = string;
export type Routes_Invite_Runner_RouteSave_Server = Lib_InvitePages_InviteServer | undefined;
export type Routes_Invite_Runner_RouteSave_Result = Lib_InvitePages_SaveResult;
export type Routes_Invite_Runner_RouteSave_Principal = Shared_Principal;
export type Routes_Invite_Runner_RouteSave_InviteSettings = Lib_WebApplicationFeatures_InviteSettings;

export type Routes_Invite_Runner_SetPageHeaders_Response = express.Response;
export type Routes_Invite_Runner_SetPageHeaders_Returns = void;

export type Routes_Invite_Runner_SetPublicHeaders_Response = express.Response;
export type Routes_Invite_Runner_SetPublicHeaders_Returns = void;
