import type {
  Shared_HttpNotifier,
  Shared_Notifier,
} from '../../shared.d.ts';
import type {
  Lib_Notifications_Dependencies,
  Lib_Notifications_Service,
  Lib_Notifications_ServiceDefinitions,
  Lib_Notifications_Target,
} from '../notifications.d.ts';

export type Lib_Notifiers_Registry_Runner_Create_Target = Lib_Notifications_Target;
export type Lib_Notifiers_Registry_Runner_Create_Returns = Shared_Notifier;

export type Lib_Notifiers_Registry_Runner_CreateHttp_Target = Lib_Notifications_Target;
export type Lib_Notifiers_Registry_Runner_CreateHttp_Returns = Shared_HttpNotifier;

export type Lib_Notifiers_Registry_Runner_GetDefaultDependencies_Returns = Lib_Notifications_Dependencies;

export type Lib_Notifiers_Registry_Runner_GetDefinitions_Returns = Lib_Notifications_ServiceDefinitions;

export type Lib_Notifiers_Registry_Runner_Validate_Service = Lib_Notifications_Service;
export type Lib_Notifiers_Registry_Runner_Validate_Key = string;
export type Lib_Notifiers_Registry_Runner_Validate_Value = string;
export type Lib_Notifiers_Registry_Runner_Validate_Returns = boolean;
