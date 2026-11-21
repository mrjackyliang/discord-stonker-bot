import type {
  Channel,
  Client,
  Guild,
  GuildMember,
  RateLimitData,
  REST,
  Role,
  User,
} from 'discord.js';
import type { Mock } from 'vitest';

import type {
  Lib_ChatPlatform_Contracts_Channel,
  Lib_ChatPlatform_Contracts_Client,
  Lib_ChatPlatform_Contracts_Guild,
  Lib_ChatPlatform_Contracts_Member,
  Lib_ChatPlatform_Contracts_PermissionOverwrite,
  Lib_ChatPlatform_Contracts_RateLimit,
  Lib_ChatPlatform_Contracts_Rest,
  Lib_ChatPlatform_Contracts_Role,
  Lib_ChatPlatform_Contracts_User,
} from '../../../lib/chat-platform/index.d.ts';

export type Tests_Lib_ChatPlatform_Discord_Mock = Mock;
export type Tests_Lib_ChatPlatform_Discord_ProviderValue = unknown;
export type Tests_Lib_ChatPlatform_Discord_RawChannel = Channel;
export type Tests_Lib_ChatPlatform_Discord_RawClient = Client;
export type Tests_Lib_ChatPlatform_Discord_RawGuild = Guild;
export type Tests_Lib_ChatPlatform_Discord_RawMember = GuildMember;
export type Tests_Lib_ChatPlatform_Discord_RawRest = REST;
export type Tests_Lib_ChatPlatform_Discord_RawRole = Role;
export type Tests_Lib_ChatPlatform_Discord_RawUser = User;
export type Tests_Lib_ChatPlatform_Discord_Channel = Lib_ChatPlatform_Contracts_Channel;
export type Tests_Lib_ChatPlatform_Discord_Client = Lib_ChatPlatform_Contracts_Client;
export type Tests_Lib_ChatPlatform_Discord_Guild = Lib_ChatPlatform_Contracts_Guild;
export type Tests_Lib_ChatPlatform_Discord_Member = Lib_ChatPlatform_Contracts_Member;
export type Tests_Lib_ChatPlatform_Discord_MemberState = {
  manageable: boolean;
  reads: number;
};
export type Tests_Lib_ChatPlatform_Discord_Overwrite = Lib_ChatPlatform_Contracts_PermissionOverwrite;
export type Tests_Lib_ChatPlatform_Discord_Permissions = Record<string, boolean>;
export type Tests_Lib_ChatPlatform_Discord_RateLimit = Lib_ChatPlatform_Contracts_RateLimit;
export type Tests_Lib_ChatPlatform_Discord_RateLimitListener = (rateLimit: Tests_Lib_ChatPlatform_Discord_RateLimit) => void;
export type Tests_Lib_ChatPlatform_Discord_RawRateLimit = RateLimitData;
export type Tests_Lib_ChatPlatform_Discord_RawRateLimitListener = (rateLimit: Tests_Lib_ChatPlatform_Discord_RawRateLimit) => void;
export type Tests_Lib_ChatPlatform_Discord_Rest = Lib_ChatPlatform_Contracts_Rest;
export type Tests_Lib_ChatPlatform_Discord_Role = Lib_ChatPlatform_Contracts_Role;
export type Tests_Lib_ChatPlatform_Discord_User = Lib_ChatPlatform_Contracts_User;
