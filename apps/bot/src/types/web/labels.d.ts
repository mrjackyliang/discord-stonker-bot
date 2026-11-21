import type {
  Web_Api_Bot,
  Web_Api_FeatureCategory,
  Web_Api_Permission,
  Web_Api_Principal,
  Web_Api_Role,
  Web_Api_Scope,
  Web_Api_Server,
  Web_Api_Service,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_BotStatus,
  Web_Components_ServiceStatus,
} from '@/types/web/components.d.ts';

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_CategoryLabels = Record<Web_Api_FeatureCategory, string>;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_CategoryOrder = Web_Api_FeatureCategory[];

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_DescribeBot_Bot = Web_Api_Bot | null;
export type Web_Labels_DescribeBot_Returns = Web_Components_BotStatus;
export type Web_Labels_DescribeBot_Status = string;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_DescribeService_Service = Web_Api_Service | undefined;
export type Web_Labels_DescribeService_Now = number;
export type Web_Labels_DescribeService_Returns = Web_Components_ServiceStatus;
export type Web_Labels_DescribeService_Status = string;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_PermissionsFor_Principal = Web_Api_Principal | null;
export type Web_Labels_PermissionsFor_Returns = Web_Api_Permission[];

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_RoleDescriptions = Record<Exclude<Web_Api_Role, 'owner'>, string>;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_RoleLabels = Record<Web_Api_Role, string>;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_RolePermissions = Record<Web_Api_Role, Web_Api_Permission[]>;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_ScopesForRole_Role = Web_Api_Role | undefined;
export type Web_Labels_ScopesForRole_Returns = Web_Api_Scope[];

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_ServerAccessLabel_AllServers = boolean;
export type Web_Labels_ServerAccessLabel_ServerIds = string[];
export type Web_Labels_ServerAccessLabel_Servers = Web_Api_Server[];
export type Web_Labels_ServerAccessLabel_Returns = string;
export type Web_Labels_ServerAccessLabel_Names = string[];
export type Web_Labels_ServerAccessLabel_Server = Web_Api_Server | undefined;

/**
 * Labels.
 *
 * @since 4.2.1
 */
export type Web_Labels_ServiceStaleMilliseconds = number;
