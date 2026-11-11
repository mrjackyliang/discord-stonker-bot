import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

export type Lib_InvitePages_ImageContentType = 'image/gif' | 'image/jpeg' | 'image/png' | 'image/webp';
export type Lib_InvitePages_Logo = 'custom' | 'none' | 'server';
export type Lib_InvitePages_Theme = 'dark' | 'light' | 'system';

export type Lib_InvitePages_InvitePage = {
  accentColor: string;
  bannerImageId: string | null;
  buttonLabel: string;
  description: string;
  footerText: string;
  logo: Lib_InvitePages_Logo;
  logoImageId: string | null;
  revision: number;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: Lib_InvitePages_Theme;
  title: string;
  updatedAt: string | null;
};

export type Lib_InvitePages_InvitePageInput = {
  accentColor: string;
  bannerImageId: string | null;
  buttonLabel: string;
  description: string;
  expectedRevision: number;
  footerText: string;
  logo: Lib_InvitePages_Logo;
  logoImageId: string | null;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: Lib_InvitePages_Theme;
  title: string;
};

export type Lib_InvitePages_InvitePageRow = {
  accent_color: string;
  banner_image_id: string | null;
  button_label: string;
  description: string;
  footer_text: string;
  logo: Lib_InvitePages_Logo;
  logo_image_id: string | null;
  revision: string;
  show_boost_tier: boolean;
  show_member_count: boolean;
  theme: Lib_InvitePages_Theme;
  title: string;
  updated_at: Date;
};

export type Lib_InvitePages_InviteServer = {
  iconUrl: string | null;
  name: string;
};

export type Lib_InvitePages_InviteImage = {
  contentType: string;
  data: Buffer;
};

export type Lib_InvitePages_InviteHead = {
  description: string;
  imageUrl: string | null;
  largeImage: boolean;
  themeColor: string;
  title: string;
  url: string;
};

export type Lib_InvitePages_PublicPageData = {
  available: boolean;
  page: {
    accentColor: string;
    bannerUrl: string | null;
    buttonLabel: string;
    description: string;
    footerText: string;
    logoUrl: string | null;
    showBoostTier: boolean;
    showMemberCount: boolean;
    theme: Lib_InvitePages_Theme;
    title: string;
  };
  recaptchaSiteKey: string | null;
  server: {
    boostTier: number | null;
    iconUrl: string | null;
    memberCount: number | null;
    name: string;
  };
  submitPath: string;
};

export type Lib_InvitePages_SaveResult = {
  page: Lib_InvitePages_InvitePage;
  status: 'saved';
} | {
  status: 'conflict';
} | {
  field: 'bannerImageId' | 'logoImageId';
  status: 'image-missing';
};

export type Lib_InvitePages_BuildInviteDescription_Page = Pick<Lib_InvitePages_InvitePage, 'description' | 'showBoostTier' | 'showMemberCount'>;
export type Lib_InvitePages_BuildInviteDescription_MemberCount = number | null;
export type Lib_InvitePages_BuildInviteDescription_BoostTier = number | null;
export type Lib_InvitePages_BuildInviteDescription_Returns = string;
export type Lib_InvitePages_BuildInviteDescription_Description = string;
export type Lib_InvitePages_BuildInviteDescription_Parts = string[];
export type Lib_InvitePages_BuildInviteDescription_Unit = string;

export type Lib_InvitePages_DetectImageType_Data = Buffer;
export type Lib_InvitePages_DetectImageType_Returns = Lib_InvitePages_ImageContentType | undefined;

export type Lib_InvitePages_EscapeHtml_Value = string;
export type Lib_InvitePages_EscapeHtml_Returns = string;

export type Lib_InvitePages_GetDefaultInvitePage_ServerName = string;
export type Lib_InvitePages_GetDefaultInvitePage_Returns = Lib_InvitePages_InvitePage;

export type Lib_InvitePages_GetMediaUrl_ImageId = string;
export type Lib_InvitePages_GetMediaUrl_Returns = string;

export type Lib_InvitePages_GetServerIconUrl_GuildIdentifier = string;
export type Lib_InvitePages_GetServerIconUrl_IconHash = string | null;
export type Lib_InvitePages_GetServerIconUrl_Returns = string | null;

export type Lib_InvitePages_ImageExists_Client = PoolClient;
export type Lib_InvitePages_ImageExists_GuildIdentifier = string;
export type Lib_InvitePages_ImageExists_ImageId = string;
export type Lib_InvitePages_ImageExists_Returns = Promise<boolean>;
export type Lib_InvitePages_ImageExists_Result = QueryResult;

export type Lib_InvitePages_InvitePageFromRow_Row = Lib_InvitePages_InvitePageRow;
export type Lib_InvitePages_InvitePageFromRow_Returns = Lib_InvitePages_InvitePage;

export type Lib_InvitePages_ReadInviteImage_Pool = Pool;
export type Lib_InvitePages_ReadInviteImage_ImageId = string;
export type Lib_InvitePages_ReadInviteImage_Returns = Promise<Lib_InvitePages_InviteImage | undefined>;
export type Lib_InvitePages_ReadInviteImage_Row = {
  content_type: string;
  data: Buffer;
};
export type Lib_InvitePages_ReadInviteImage_Result = QueryResult<Lib_InvitePages_ReadInviteImage_Row>;
export type Lib_InvitePages_ReadInviteImage_FirstRow = Lib_InvitePages_ReadInviteImage_Row | undefined;

export type Lib_InvitePages_ReadInvitePage_Pool = Pool;
export type Lib_InvitePages_ReadInvitePage_GuildIdentifier = string;
export type Lib_InvitePages_ReadInvitePage_ServerName = string;
export type Lib_InvitePages_ReadInvitePage_Returns = Promise<Lib_InvitePages_InvitePage>;
export type Lib_InvitePages_ReadInvitePage_Row = Lib_InvitePages_InvitePageRow;
export type Lib_InvitePages_ReadInvitePage_Result = QueryResult<Lib_InvitePages_ReadInvitePage_Row>;
export type Lib_InvitePages_ReadInvitePage_FirstRow = Lib_InvitePages_ReadInvitePage_Row | undefined;

export type Lib_InvitePages_ReadInviteServer_Pool = Pool;
export type Lib_InvitePages_ReadInviteServer_GuildIdentifier = string;
export type Lib_InvitePages_ReadInviteServer_Returns = Promise<Lib_InvitePages_InviteServer | undefined>;
export type Lib_InvitePages_ReadInviteServer_Row = {
  icon_hash: string | null;
  name: string;
};
export type Lib_InvitePages_ReadInviteServer_Result = QueryResult<Lib_InvitePages_ReadInviteServer_Row>;
export type Lib_InvitePages_ReadInviteServer_FirstRow = Lib_InvitePages_ReadInviteServer_Row | undefined;

export type Lib_InvitePages_RenderInviteDocument_Template = string;
export type Lib_InvitePages_RenderInviteDocument_Head = Lib_InvitePages_InviteHead;
export type Lib_InvitePages_RenderInviteDocument_Data = Lib_InvitePages_PublicPageData;
export type Lib_InvitePages_RenderInviteDocument_Returns = string;
export type Lib_InvitePages_RenderInviteDocument_HeadMarkup = string;
export type Lib_InvitePages_RenderInviteDocument_SerializedData = string;
export type Lib_InvitePages_RenderInviteDocument_TwitterCard = string;

export type Lib_InvitePages_SaveInvitePage_Pool = Pool;
export type Lib_InvitePages_SaveInvitePage_GuildIdentifier = string;
export type Lib_InvitePages_SaveInvitePage_Input = Lib_InvitePages_InvitePageInput;
export type Lib_InvitePages_SaveInvitePage_Returns = Promise<Lib_InvitePages_SaveResult>;
export type Lib_InvitePages_SaveInvitePage_Client = PoolClient;
export type Lib_InvitePages_SaveInvitePage_LogoImageId = string | null;
export type Lib_InvitePages_SaveInvitePage_RevisionRow = {
  revision: string;
};
export type Lib_InvitePages_SaveInvitePage_RevisionResult = QueryResult<Lib_InvitePages_SaveInvitePage_RevisionRow>;
export type Lib_InvitePages_SaveInvitePage_FirstRevisionRow = Lib_InvitePages_SaveInvitePage_RevisionRow | undefined;
export type Lib_InvitePages_SaveInvitePage_CurrentRevision = number;
export type Lib_InvitePages_SaveInvitePage_Row = Lib_InvitePages_InvitePageRow;
export type Lib_InvitePages_SaveInvitePage_Result = QueryResult<Lib_InvitePages_SaveInvitePage_Row>;
export type Lib_InvitePages_SaveInvitePage_FirstRow = Lib_InvitePages_SaveInvitePage_Row | undefined;

export type Lib_InvitePages_StoreInviteImage_Pool = Pool;
export type Lib_InvitePages_StoreInviteImage_GuildIdentifier = string;
export type Lib_InvitePages_StoreInviteImage_ContentType = Lib_InvitePages_ImageContentType;
export type Lib_InvitePages_StoreInviteImage_Data = Buffer;
export type Lib_InvitePages_StoreInviteImage_Returns = Promise<string>;
export type Lib_InvitePages_StoreInviteImage_Row = {
  id: string;
};
export type Lib_InvitePages_StoreInviteImage_Result = QueryResult<Lib_InvitePages_StoreInviteImage_Row>;
export type Lib_InvitePages_StoreInviteImage_FirstRow = Lib_InvitePages_StoreInviteImage_Row | undefined;
