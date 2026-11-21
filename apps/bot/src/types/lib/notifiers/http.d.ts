import type {
  Lib_Notifications_Dependencies,
  Lib_Notifications_HttpRequest,
  Lib_Notifications_Result,
} from '../notifications.d.ts';

export type Lib_Notifiers_Http_Runner_DescribeError_Error = unknown;
export type Lib_Notifiers_Http_Runner_DescribeError_Returns = string;

export type Lib_Notifiers_Http_Runner_DescribeResponse_Response = Response;
export type Lib_Notifiers_Http_Runner_DescribeResponse_Returns = Promise<string>;
export type Lib_Notifiers_Http_Runner_DescribeResponse_Detail = string;
export type Lib_Notifiers_Http_Runner_DescribeResponse_Body = string;
export type Lib_Notifiers_Http_Runner_DescribeResponse_Parsed = Record<string, unknown>;
export type Lib_Notifiers_Http_Runner_DescribeResponse_Candidate = unknown;

export type Lib_Notifiers_Http_Runner_IsHttpUrl_Value = string;
export type Lib_Notifiers_Http_Runner_IsHttpUrl_Protocols = string[];
export type Lib_Notifiers_Http_Runner_IsHttpUrl_Returns = boolean;
export type Lib_Notifiers_Http_Runner_IsHttpUrl_Url = URL;

export type Lib_Notifiers_Http_Runner_Send_Request = Lib_Notifications_HttpRequest;
export type Lib_Notifiers_Http_Runner_Send_Fetch = Lib_Notifications_Dependencies['fetch'];
export type Lib_Notifiers_Http_Runner_Send_Returns = Promise<Lib_Notifications_Result>;
export type Lib_Notifiers_Http_Runner_Send_Response = Response | undefined;

export type Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value = string;
export type Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns = string;
export type Lib_Notifiers_Http_Runner_TrimTrailingSlashes_End = number;
