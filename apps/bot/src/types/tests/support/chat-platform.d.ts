import type {
  Lib_ChatPlatform_Contracts_Application,
  Lib_ChatPlatform_Contracts_Client,
  Lib_ChatPlatform_Contracts_ClientEventArguments,
  Lib_ChatPlatform_Contracts_ClientEventListener,
  Lib_ChatPlatform_Contracts_ClientEventName,
  Lib_ChatPlatform_Contracts_Collection,
  Lib_ChatPlatform_Contracts_GuildManager,
  Lib_ChatPlatform_Contracts_RateLimit,
  Lib_ChatPlatform_Contracts_Rest,
  Lib_ChatPlatform_Contracts_User,
} from '../../lib/chat-platform/index.d.ts';

export type Tests_Support_ChatPlatform_Client = Lib_ChatPlatform_Contracts_Client & {
  emit(eventName: string | symbol, ...eventArguments: unknown[]): boolean;
  emitRateLimited(rateLimit: Lib_ChatPlatform_Contracts_RateLimit): boolean;
};

export type Tests_Support_ChatPlatform_CreateEmptyCollection_Returns<Value> = Lib_ChatPlatform_Contracts_Collection<Value>;
export type Tests_Support_ChatPlatform_CreateEmptyCollection_Values<Value> = Value[];

export type Tests_Support_ChatPlatform_Runner_Application = Lib_ChatPlatform_Contracts_Application | null;
export type Tests_Support_ChatPlatform_Runner_EventArguments = unknown[];
export type Tests_Support_ChatPlatform_Runner_EventName = Lib_ChatPlatform_Contracts_ClientEventName;
export type Tests_Support_ChatPlatform_Runner_Guilds = Lib_ChatPlatform_Contracts_GuildManager;
export type Tests_Support_ChatPlatform_Runner_Login_Token = string;
export type Tests_Support_ChatPlatform_Runner_Login_Returns = Promise<string>;
export type Tests_Support_ChatPlatform_Runner_RateLimitEvent = string;
export type Tests_Support_ChatPlatform_Runner_Rest = Lib_ChatPlatform_Contracts_Rest;
export type Tests_Support_ChatPlatform_Runner_User = Lib_ChatPlatform_Contracts_User | null;
export type Tests_Support_ChatPlatform_Runner_Destroy_Returns = void;
export type Tests_Support_ChatPlatform_Runner_EmitRateLimited_RateLimit = Lib_ChatPlatform_Contracts_RateLimit;
export type Tests_Support_ChatPlatform_Runner_EmitRateLimited_Returns = boolean;
export type Tests_Support_ChatPlatform_Runner_On_Listener<EventName extends Tests_Support_ChatPlatform_Runner_EventName> = Lib_ChatPlatform_Contracts_ClientEventListener<EventName>;
export type Tests_Support_ChatPlatform_Runner_On_Returns = Lib_ChatPlatform_Contracts_Client;
export type Tests_Support_ChatPlatform_Runner_Once_Listener<EventName extends Tests_Support_ChatPlatform_Runner_EventName> = Lib_ChatPlatform_Contracts_ClientEventListener<EventName>;
export type Tests_Support_ChatPlatform_Runner_Once_Returns = Lib_ChatPlatform_Contracts_Client;
export type Tests_Support_ChatPlatform_Runner_Emit_EventName = Tests_Support_ChatPlatform_Runner_EventName;
export type Tests_Support_ChatPlatform_Runner_Emit_EventArguments<EventName extends Tests_Support_ChatPlatform_Runner_Emit_EventName> = Lib_ChatPlatform_Contracts_ClientEventArguments[EventName];
export type Tests_Support_ChatPlatform_Runner_Emit_Returns = boolean;
