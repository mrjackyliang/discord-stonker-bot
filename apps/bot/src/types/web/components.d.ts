import type {
  ReactElement,
  ReactNode,
} from 'react';

import type {
  Web_Api_Bot,
  Web_Api_BotAction,
  Web_Api_CreatedToken,
  Web_Api_CreateTokenInput,
  Web_Api_FeatureCategory,
  Web_Api_FeatureDetail,
  Web_Api_FeatureSummary,
  Web_Api_InviteLogo,
  Web_Api_InviteTheme,
  Web_Api_LogLevel,
  Web_Api_Permission,
  Web_Api_Principal,
  Web_Api_Resources,
  Web_Api_Role,
  Web_Api_Scope,
  Web_Api_Server,
  Web_Api_ServiceComponent,
  Web_Api_Token,
  Web_Api_UpdateTokenInput,
  Web_Api_User,
} from '@/types/web/api.d.ts';
import type {
  Web_Invite_JoinState,
  Web_Invite_PageData,
  Web_Invite_ServerData,
} from '@/types/web/invite.d.ts';
import type {
  Web_Schema_Node,
  Web_Schema_Path,
  Web_Schema_Section,
  Web_Schema_TypeName,
  Web_Schema_Union,
  Web_Schema_Variable,
} from '@/types/web/schema.d.ts';

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_Icon_Name =
  'activity'
  | 'add'
  | 'arrow-down'
  | 'arrow-up'
  | 'archive'
  | 'bell'
  | 'bot'
  | 'check'
  | 'chevron'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-up'
  | 'clock'
  | 'containers'
  | 'copy'
  | 'download'
  | 'duplicate'
  | 'edit'
  | 'external'
  | 'features'
  | 'folder'
  | 'grip'
  | 'history'
  | 'image'
  | 'import'
  | 'invite'
  | 'key'
  | 'label'
  | 'logout'
  | 'logs'
  | 'menu'
  | 'more'
  | 'overview'
  | 'pause'
  | 'play'
  | 'plug'
  | 'refresh'
  | 'remove'
  | 'search'
  | 'send'
  | 'server'
  | 'settings'
  | 'shield'
  | 'signal'
  | 'sliders-horizontal'
  | 'stop'
  | 'torrent'
  | 'upload'
  | 'users'
  | 'variable'
  | 'warning'
  | 'x';

export type Web_Components_Icon_Props = {
  name: Web_Components_Icon_Name;
  size?: number;
};
export type Web_Components_Icon_Returns = ReactElement;

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_Button_Variant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type Web_Components_Button_Props = {
  block?: boolean;
  children: ReactNode;
  disabled?: boolean;
  icon?: Web_Components_Icon_Name;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Web_Components_Button_Variant;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ConfirmDialog_Tone = 'danger' | 'primary';
export type Web_Components_ConfirmDialog_Props = {
  busy: boolean;
  busyLabel: string;
  children?: ReactNode;
  confirmDisabled?: boolean;
  confirmLabel: string;
  error: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  tone?: Web_Components_ConfirmDialog_Tone;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_TotpDialog_Mode = 'disable' | 'recovery' | 'setup';
export type Web_Components_TotpDialog_Step = 'codes' | 'password' | 'scan';
export type Web_Components_TotpDialog_Props = {
  mode: Web_Components_TotpDialog_Mode | null;
  onAuthenticatorEnabled: () => void;
  onChanged: () => Promise<void>;
  onClose: () => void;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_View =
  'access'
  | 'backup'
  | 'connection'
  | 'feature'
  | 'features'
  | 'invite'
  | 'logs'
  | 'notifications'
  | 'overview'
  | 'security'
  | 'users';

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_StatusTone = 'blocked' | 'connecting' | 'idle' | 'protected';

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_BotStatus = {
  detail: string;
  label: string;
  tone: Web_Components_StatusTone;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ServiceStatus = {
  detail: string | null;
  label: string;
  tone: Web_Components_StatusTone;
};

export type Web_Components_ShellStatus = Web_Components_BotStatus & {
  onOpen: () => void;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_Can = (permission: Web_Api_Permission) => boolean;

/**
 * Components - App Shell phone sheet.
 *
 * @since UNRELEASED
 */
export type Web_Components_AppShell_PhoneSheet = {
  content: ReactNode;
  id: string;
  onClose: () => void;
  title: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_AppShell_Props = {
  accountDetail?: ReactNode;
  activeView: Web_Components_View;
  canOpen?: (permission: string) => boolean;
  children: ReactNode;
  notice: ReactNode;
  onLogout: () => void;
  onViewChange: (view: Web_Components_View) => void;
  phonePageTop?: ReactNode;
  phoneSheet?: Web_Components_AppShell_PhoneSheet | undefined;
  sidebarNavigationSlot?: ReactNode;
  sidebarTop?: ReactNode;
  status?: Web_Components_ShellStatus;
  username: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_AccountMenu_Props = {
  detail?: ReactNode;
  onLogout: () => void;
  onViewChange: (view: Web_Components_View) => void;
  username: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_AuthenticationScreen_Mode = 'claim' | 'login';
export type Web_Components_AuthenticationScreen_Props = {
  mode: Web_Components_AuthenticationScreen_Mode;
  onSignedIn: () => Promise<void>;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_SecurityView_ErrorContext = 'page' | 'passkey' | 'password' | 'prompt' | 'username';
export type Web_Components_SecurityView_Props = {
  onAuthenticatorEnabled: () => void;
  onUsernameChanged: (username: string) => void;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_KeyNotice_Item = {
  id: string;
  label: string;
  onOpen: () => void;
};
export type Web_Components_KeyNotice_Props = {
  appName: string;
  items: Web_Components_KeyNotice_Item[];
  keyName: string;
  onDismiss: () => Promise<void>;
  removedAt: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_NoServer_Props = {
  addServerUrl: string | null;
  onOpenConnection: () => void;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_OverviewView_Props = {
  bot: Web_Api_Bot | null;
  can: Web_Components_Can;
  onBotAction: (action: Web_Api_BotAction) => Promise<void>;
  onOpenConnection: () => void;
  onOpenFeatures: () => void;
  onRefresh: () => Promise<void>;
  principal: Web_Api_Principal;
  server: Web_Api_Server | undefined;
  servers: Web_Api_Server[];
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_BotControls_Props = {
  bot: Web_Api_Bot;
  onBotAction: (action: Web_Api_BotAction) => Promise<void>;
  onError: (message: string) => void;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_FeatureFilter = 'all' | 'on' | Web_Api_FeatureCategory;
export type Web_Components_FeatureFilterOption = {
  id: Web_Components_FeatureFilter;
  label: string;
};
export type Web_Components_FeaturesView_Props = {
  canWrite: boolean;
  onFeaturesChanged: () => void;
  onOpenFeature: (featureKey: string) => void;
  server: Web_Api_Server;
};
export type Web_Components_FeatureIcon_Props = {
  featureKey: string;
  size?: number;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_FeatureEditor_Props = {
  canWrite: boolean;
  featureKey: string;
  onBack: () => void;
  onDirtyChange: (dirty: boolean) => void;
  onFeaturesChanged: () => void;
  server: Web_Api_Server;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_FeatureEditor_Loaded = {
  detail: Web_Api_FeatureDetail;
  resources: Web_Api_Resources;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_SchemaForm_Context = {
  issueAt: (path: Web_Schema_Path) => string;
  readOnly: boolean;
  resources: Web_Api_Resources;
  root: Web_Schema_Node;
  savedSecrets: Record<string, boolean>;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_PickerChoice = {
  id: string;
  name: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_SchemaField_Props = {
  context: Web_Components_SchemaForm_Context;
  label: string;
  onChange: (value: unknown) => void;
  onRemove?: (() => void) | undefined;
  path: Web_Schema_Path;
  required: boolean;
  schema: Web_Schema_Node;
  value: unknown;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_FieldError_Props = {
  id?: string | undefined;
  message: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_Hint_Props = {
  id?: string | undefined;
  text: string | undefined;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_VariableButtons_Props = {
  onInsert: (token: string) => void;
  variables: Web_Schema_Variable[];
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_PickerField_Props = Web_Components_SchemaField_Props & {
  kind: 'channel' | 'role';
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ScalarField_Props = Web_Components_SchemaField_Props & {
  nullable: boolean;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_LinesField_Props = Web_Components_SchemaField_Props & {
  itemType: Web_Schema_TypeName | undefined;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ObjectFields_Props = {
  context: Web_Components_SchemaForm_Context;
  hiddenKey?: string | undefined;
  onChange: (value: unknown) => void;
  path: Web_Schema_Path;
  schema: Web_Schema_Node;
  value: Record<string, unknown>;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_UnionField_Props = Web_Components_SchemaField_Props & {
  union: Web_Schema_Union;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InlineField_Props = Web_Components_SchemaField_Props & {
  child: [string, Web_Schema_Node];
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_SchemaForm_Layout = {
  general: string[];
  sections: Web_Schema_Section[];
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_SchemaForm_Props = {
  context: Web_Components_SchemaForm_Context;
  onChange: (value: unknown) => void;
  schema: Web_Schema_Node;
  value: unknown;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InvitePage_Props = {
  available: boolean;
  error: string;
  joinState: Web_Invite_JoinState;
  onJoin?: (() => void) | undefined;
  page: Web_Invite_PageData;
  preview?: boolean;
  recaptcha?: ReactElement | null;
  server: Web_Invite_ServerData;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InviteDraft = {
  accentColor: string;
  bannerImageId: string | null;
  bannerImageUrl: string | null;
  buttonLabel: string;
  description: string;
  footerText: string;
  logo: Web_Api_InviteLogo;
  logoImageId: string | null;
  logoImageUrl: string | null;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: Web_Api_InviteTheme;
  title: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InviteImageKind = 'banner' | 'logo';

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InviteThemeOption = {
  id: Web_Api_InviteTheme;
  label: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InviteLogoOption = {
  id: Web_Api_InviteLogo;
  label: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_AccentSwatch = {
  color: string;
  name: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_InvitePageView_Props = {
  canWrite: boolean;
  onOpenFeature: (featureKey: string) => void;
  server: Web_Api_Server;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_LogLevelOption = {
  id: Web_Api_LogLevel;
  label: string;
};
export type Web_Components_LogStreamState = 'connecting' | 'disconnected' | 'live' | 'paused';
export type Web_Components_LogComponentOption = {
  id: Web_Api_ServiceComponent;
  label: string;
};

/**
 * Components.
 *
 * @since UNRELEASED
 */
export type Web_Components_LogsView_Props = {
  canChangeDebugLogging: boolean;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ConnectionView_Props = {
  bot: Web_Api_Bot | null;
  can: Web_Components_Can;
  onBotAction: (action: Web_Api_BotAction) => Promise<void>;
  onTokenSaved: () => Promise<void>;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_UsersView_Props = {
  principal: Web_Api_Principal;
  servers: Web_Api_Server[];
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_UsersFilter_Option = {
  label: string;
  value: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_UsersFilter_Props = {
  anyLabel: string;
  className: string;
  label: string;
  onChange: (value: string) => void;
  options: Web_Components_UsersFilter_Option[];
  value: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ManagedRole = Exclude<Web_Api_Role, 'owner'>;

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ServerChoice = {
  available: boolean;
  id: string;
  name: string;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_UserDialog_Props = {
  onClose: () => void;
  onSaved: () => Promise<void>;
  open: boolean;
  principal: Web_Api_Principal;
  servers: Web_Api_Server[];
  user: Web_Api_User | null;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_AccessView_Props = {
  onCreateToken: (input: Web_Api_CreateTokenInput) => Promise<Web_Api_CreatedToken>;
  onRevokeToken: (tokenId: string) => Promise<void>;
  onUpdateToken: (tokenId: string, input: Web_Api_UpdateTokenInput) => Promise<void>;
  role: Web_Api_Role | undefined;
  tokens: Web_Api_Token[];
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_Endpoint = {
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  scope: Web_Api_Scope;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_TokenDialog_Expiry = '30' | '90' | '365' | 'keep' | 'never';
export type Web_Components_TokenDialog_Props = {
  allowedScopes?: Web_Api_Scope[];
  onClose: () => void;
  onCreate: (input: Web_Api_CreateTokenInput) => Promise<Web_Api_CreatedToken>;
  onUpdate: (tokenId: string, input: Web_Api_UpdateTokenInput) => Promise<void>;
  open: boolean;
  token: Web_Api_Token | null;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_ScopeOption = {
  description: string;
  endpoints?: string[];
  id: Web_Api_Scope;
  includes?: Web_Api_Scope;
};

/**
 * Components.
 *
 * @since 4.0.0
 */
export type Web_Components_FeatureSummaryList = Web_Api_FeatureSummary[];
