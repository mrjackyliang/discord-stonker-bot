import type { Tests_Support_ChatPlatform_Client } from '../tests/support/chat-platform.d.ts';
import type {
  Lib_ChatPlatform_Contracts_ApplicationCommand,
  Lib_ChatPlatform_Contracts_Client,
  Lib_ChatPlatform_Contracts_Guild,
} from './chat-platform/index.d.ts';

export type Lib_ApplicationCommands_State_Commands = Lib_ChatPlatform_Contracts_ApplicationCommand[];
export type Lib_ApplicationCommands_State_GuildIdentifier = string;
export type Lib_ApplicationCommands_State_GuildCommands = Map<
  Lib_ApplicationCommands_State_GuildIdentifier,
  Lib_ApplicationCommands_State_Commands
>;
export type Lib_ApplicationCommands_State = {
  guildCommands: Lib_ApplicationCommands_State_GuildCommands;
};
export type Lib_ApplicationCommands_Registries = WeakMap<Lib_ChatPlatform_Contracts_Client, Lib_ApplicationCommands_State>;

export type Lib_ApplicationCommands_RegisterApplicationCommands_Client = Lib_ChatPlatform_Contracts_Client;
export type Lib_ApplicationCommands_RegisterApplicationCommands_GuildIdentifier = string;
export type Lib_ApplicationCommands_RegisterApplicationCommands_Commands = Lib_ChatPlatform_Contracts_ApplicationCommand[];
export type Lib_ApplicationCommands_RegisterApplicationCommands_Returns = void;
export type Lib_ApplicationCommands_RegisterApplicationCommands_State = Lib_ApplicationCommands_State | undefined;
export type Lib_ApplicationCommands_RegisterApplicationCommands_GuildCommands =
  Lib_ApplicationCommands_State_Commands | undefined;

export type Lib_ApplicationCommands_SynchronizeCommands_Client = Lib_ChatPlatform_Contracts_Client;
export type Lib_ApplicationCommands_SynchronizeCommands_State = Lib_ApplicationCommands_State;
export type Lib_ApplicationCommands_SynchronizeCommands_Returns = Promise<void>;
export type Lib_ApplicationCommands_SynchronizeCommands_Guild = Lib_ChatPlatform_Contracts_Guild;
export type Lib_ApplicationCommands_SynchronizeCommands_Entry = [
  Lib_ApplicationCommands_State_GuildIdentifier,
  Lib_ApplicationCommands_State_Commands,
];
export type Lib_ApplicationCommands_SynchronizeCommands_GuildIdentifier =
  Lib_ApplicationCommands_State_GuildIdentifier;
export type Lib_ApplicationCommands_SynchronizeCommands_Commands =
  Lib_ApplicationCommands_State_Commands;

export type Lib_ApplicationCommands_Test_Client = Tests_Support_ChatPlatform_Client;
