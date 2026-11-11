import type { z } from 'zod';

export type Lib_AccountSchemas_IsUnique_Values = readonly unknown[];
export type Lib_AccountSchemas_IsUnique_Returns = boolean;

export type Lib_AccountSchemas_ExpiresAt_Value = string;
export type Lib_AccountSchemas_ExpiresAt_Context = z.RefinementCtx<string>;
export type Lib_AccountSchemas_ExpiresAt_Returns = void;

export type Lib_AccountSchemas_ServerAccess_Value = {
  allServers: boolean;
  serverIds: string[];
};
export type Lib_AccountSchemas_ServerAccess_Context = z.RefinementCtx<Lib_AccountSchemas_ServerAccess_Value>;
export type Lib_AccountSchemas_ServerAccess_Returns = void;
