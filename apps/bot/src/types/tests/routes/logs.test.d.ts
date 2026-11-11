import type { MockInstance } from 'vitest';

import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';

export type Tests_Routes_Logs_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Logs_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Logs_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Logs_Token = string;
export type Tests_Routes_Logs_UserId = string;
export type Tests_Routes_Logs_BodyItem = {
  event: string;
  id: string;
  level: string;
};
export type Tests_Routes_Logs_Body = {
  cursor: string | null;
  items: Tests_Routes_Logs_BodyItem[];
};
export type Tests_Routes_Logs_Item = Tests_Routes_Logs_BodyItem | undefined;
export type Tests_Routes_Logs_Controller = AbortController;
export type Tests_Routes_Logs_StreamResponse = Response;
export type Tests_Routes_Logs_Reader = ReadableStreamDefaultReader<Uint8Array> | undefined;
export type Tests_Routes_Logs_Decoder = TextDecoder;
export type Tests_Routes_Logs_Text = string;
export type Tests_Routes_Logs_Chunk = ReadableStreamReadResult<Uint8Array>;
export type Tests_Routes_Logs_Write = MockInstance<typeof process.stdout.write>;
export type Tests_Routes_Logs_Lines = string[];

export type Tests_Routes_Logs_AddLog_Component = 'bot' | 'web' | 'worker';
export type Tests_Routes_Logs_AddLog_Level = 'debug' | 'error' | 'info' | 'warn';
export type Tests_Routes_Logs_AddLog_Event = string;
export type Tests_Routes_Logs_AddLog_Context = Record<string, unknown>;
export type Tests_Routes_Logs_AddLog_Returns = Promise<void>;
