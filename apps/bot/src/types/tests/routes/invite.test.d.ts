import type { MockInstance } from 'vitest';

import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';

export type Tests_Routes_Invite_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Invite_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Invite_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Invite_Token = string;
export type Tests_Routes_Invite_Url = string;
export type Tests_Routes_Invite_UserId = string;
export type Tests_Routes_Invite_LegacyConfiguration = Record<string, unknown>;
export type Tests_Routes_Invite_PageInput = Record<string, unknown>;
export type Tests_Routes_Invite_UploadedImage = {
  id: string;
  url: string;
};
export type Tests_Routes_Invite_ValidationCase = {
  field: string;
  message: string;
  value: unknown;
};
export type Tests_Routes_Invite_ValidationCases = Tests_Routes_Invite_ValidationCase[];
export type Tests_Routes_Invite_Image = Buffer;
export type Tests_Routes_Invite_MediaResponse = Response;
export type Tests_Routes_Invite_Html = string;
export type Tests_Routes_Invite_Data = unknown;
export type Tests_Routes_Invite_Header = string | null;
export type Tests_Routes_Invite_Body = string;

export type Tests_Routes_Invite_DiscordGuild = Record<string, unknown>;
export type Tests_Routes_Invite_DiscordMocks = {
  get: MockInstance;
  post: MockInstance;
};

export type Tests_Routes_Invite_RecaptchaResult = Record<string, unknown>;
export type Tests_Routes_Invite_FetchInput = string | URL | Request;
export type Tests_Routes_Invite_FetchInit = RequestInit | undefined;
export type Tests_Routes_Invite_FetchReturns = Promise<Response>;
export type Tests_Routes_Invite_RealFetch = typeof fetch;
export type Tests_Routes_Invite_FetchUrl = string;
export type Tests_Routes_Invite_RecaptchaMock = MockInstance;
export type Tests_Routes_Invite_RecaptchaCall = unknown[] | undefined;
export type Tests_Routes_Invite_RecaptchaForm = string;

export type Tests_Routes_Invite_TurnOnInvites_Harness = Tests_Support_Harness_Harness;
export type Tests_Routes_Invite_TurnOnInvites_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Invite_TurnOnInvites_Running = boolean;
export type Tests_Routes_Invite_TurnOnInvites_Returns = Promise<Tests_Support_Harness_Response>;
export type Tests_Routes_Invite_TurnOnInvites_Confirmation = Tests_Support_Harness_Response;
export type Tests_Routes_Invite_TurnOnInvites_Grant = {
  grant: string;
};
export type Tests_Routes_Invite_TurnOnInvites_Imported = Tests_Support_Harness_Response;

export type Tests_Routes_Invite_MockDiscord_Guild = Tests_Routes_Invite_DiscordGuild;
export type Tests_Routes_Invite_MockDiscord_Returns = Tests_Routes_Invite_DiscordMocks;

export type Tests_Routes_Invite_MockRecaptcha_Result = Tests_Routes_Invite_RecaptchaResult;
export type Tests_Routes_Invite_MockRecaptcha_Returns = Tests_Routes_Invite_RecaptchaMock;

export type Tests_Routes_Invite_ReadPageData_Html = string;
export type Tests_Routes_Invite_ReadPageData_Returns = unknown;
export type Tests_Routes_Invite_ReadPageData_Opening = string;
export type Tests_Routes_Invite_ReadPageData_Start = number;
export type Tests_Routes_Invite_ReadPageData_End = number;
export type Tests_Routes_Invite_ReadPageData_Serialized = string;

export type Tests_Routes_Invite_SignInAdmin_Harness = Tests_Support_Harness_Harness;
export type Tests_Routes_Invite_SignInAdmin_Returns = Promise<Tests_Support_Harness_Client>;
export type Tests_Routes_Invite_SignInAdmin_Client = Tests_Support_Harness_Client;
