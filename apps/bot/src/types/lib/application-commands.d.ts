import type {
  ApplicationCommandDataResolvable,
  Client,
  Guild,
} from 'discord.js';

export type Lib_ApplicationCommands_State_Commands = ApplicationCommandDataResolvable[];
export type Lib_ApplicationCommands_State_GuildIdentifier = string;
export type Lib_ApplicationCommands_State_GuildCommands = Map<
  Lib_ApplicationCommands_State_GuildIdentifier,
  Lib_ApplicationCommands_State_Commands
>;
export type Lib_ApplicationCommands_State = {
  guildCommands: Lib_ApplicationCommands_State_GuildCommands;
};
export type Lib_ApplicationCommands_Registries = WeakMap<Client, Lib_ApplicationCommands_State>;

export type Lib_ApplicationCommands_RegisterApplicationCommands_Client = Client;
export type Lib_ApplicationCommands_RegisterApplicationCommands_GuildIdentifier = string;
export type Lib_ApplicationCommands_RegisterApplicationCommands_Commands = ApplicationCommandDataResolvable[];
export type Lib_ApplicationCommands_RegisterApplicationCommands_Returns = void;
export type Lib_ApplicationCommands_RegisterApplicationCommands_State = Lib_ApplicationCommands_State | undefined;
export type Lib_ApplicationCommands_RegisterApplicationCommands_GuildCommands =
  Lib_ApplicationCommands_State_Commands | undefined;

export type Lib_ApplicationCommands_SynchronizeCommands_Client = Client<true>;
export type Lib_ApplicationCommands_SynchronizeCommands_State = Lib_ApplicationCommands_State;
export type Lib_ApplicationCommands_SynchronizeCommands_Returns = Promise<void>;
export type Lib_ApplicationCommands_SynchronizeCommands_Guild = Guild;
export type Lib_ApplicationCommands_SynchronizeCommands_Entry = [
  Lib_ApplicationCommands_State_GuildIdentifier,
  Lib_ApplicationCommands_State_Commands,
];
export type Lib_ApplicationCommands_SynchronizeCommands_GuildIdentifier =
  Lib_ApplicationCommands_State_GuildIdentifier;
export type Lib_ApplicationCommands_SynchronizeCommands_Commands =
  Lib_ApplicationCommands_State_Commands;
