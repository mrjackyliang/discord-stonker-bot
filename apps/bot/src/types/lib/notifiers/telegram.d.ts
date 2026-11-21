import type { Shared_NotifierPayload } from '../../shared.d.ts';
import type {
  Lib_Notifications_Dependencies,
  Lib_Notifications_HttpRequest,
  Lib_Notifications_Result,
  Lib_Notifications_ServiceDefinition,
  Lib_Notifications_Target,
} from '../notifications.d.ts';

export type Lib_Notifiers_Telegram_Runner_Definition = Lib_Notifications_ServiceDefinition;
export type Lib_Notifiers_Telegram_Runner_Target = Lib_Notifications_Target;

export type Lib_Notifiers_Telegram_Runner_BuildRequest_Payload = Shared_NotifierPayload;
export type Lib_Notifiers_Telegram_Runner_BuildRequest_Returns = Lib_Notifications_HttpRequest;

export type Lib_Notifiers_Telegram_Runner_Constructor_Target = Lib_Notifications_Target;

export type Lib_Notifiers_Telegram_Runner_Send_Payload = Shared_NotifierPayload;
export type Lib_Notifiers_Telegram_Runner_Send_Dependencies = Lib_Notifications_Dependencies;
export type Lib_Notifiers_Telegram_Runner_Send_Returns = Promise<Lib_Notifications_Result>;

export type Lib_Notifiers_Telegram_Runner_Validate_Key = string;
export type Lib_Notifiers_Telegram_Runner_Validate_Value = string;
export type Lib_Notifiers_Telegram_Runner_Validate_Returns = boolean;
