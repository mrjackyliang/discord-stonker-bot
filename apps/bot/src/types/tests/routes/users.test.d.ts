import type { MockInstance } from 'vitest';

import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';

export type Tests_Routes_Users_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Users_BaseUrl = string;
export type Tests_Routes_Users_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Users_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Users_Responses = Tests_Support_Harness_Response[];
export type Tests_Routes_Users_ServerId = string;
export type Tests_Routes_Users_UserId = string;
export type Tests_Routes_Users_Plaintext = string;
export type Tests_Routes_Users_Output = string;
export type Tests_Routes_Users_OutputSpy = MockInstance<typeof process.stdout.write>;
export type Tests_Routes_Users_Items = Record<string, unknown>[];
