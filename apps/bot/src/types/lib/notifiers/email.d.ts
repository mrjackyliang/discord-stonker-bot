import type { Transporter } from 'nodemailer';
import type { ZodEmail } from 'zod';

import type { Shared_NotifierPayload } from '../../shared.d.ts';
import type {
  Lib_Notifications_Dependencies,
  Lib_Notifications_MailOptions,
  Lib_Notifications_Result,
  Lib_Notifications_ServiceDefinition,
  Lib_Notifications_Target,
} from '../notifications.d.ts';

export type Lib_Notifiers_Email_Runner_Definition = Lib_Notifications_ServiceDefinition;
export type Lib_Notifiers_Email_Runner_EmailAddressSchema = ZodEmail;
export type Lib_Notifiers_Email_Runner_Target = Lib_Notifications_Target;

export type Lib_Notifiers_Email_Runner_BuildOptions_Payload = Shared_NotifierPayload;
export type Lib_Notifiers_Email_Runner_BuildOptions_Returns = Lib_Notifications_MailOptions;

export type Lib_Notifiers_Email_Runner_Constructor_Target = Lib_Notifications_Target;

export type Lib_Notifiers_Email_Runner_IsPort_Value = string;
export type Lib_Notifiers_Email_Runner_IsPort_Returns = boolean;
export type Lib_Notifiers_Email_Runner_IsPort_Port = number;

export type Lib_Notifiers_Email_Runner_Send_Payload = Shared_NotifierPayload;
export type Lib_Notifiers_Email_Runner_Send_Dependencies = Lib_Notifications_Dependencies;
export type Lib_Notifiers_Email_Runner_Send_Returns = Promise<Lib_Notifications_Result>;

export type Lib_Notifiers_Email_Runner_SendMail_Options = Lib_Notifications_MailOptions;
export type Lib_Notifiers_Email_Runner_SendMail_Returns = Promise<void>;
export type Lib_Notifiers_Email_Runner_SendMail_Transport = Transporter;

export type Lib_Notifiers_Email_Runner_Validate_Key = string;
export type Lib_Notifiers_Email_Runner_Validate_Value = string;
export type Lib_Notifiers_Email_Runner_Validate_Returns = boolean;
