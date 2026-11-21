import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type { Web_Api_Token } from '@/types/web/api.d.ts';
import type {
  Web_Components_AccessView_Props,
  Web_Components_Endpoint,
} from '@/types/web/components.d.ts';

/**
 * Access View.
 *
 * @since 4.2.1
 */
export type Web_AccessView_AccessView_Props = Web_Components_AccessView_Props;
export type Web_AccessView_AccessView_Returns = ReactElement;
export type Web_AccessView_AccessView_OnCreateToken = Web_Components_AccessView_Props['onCreateToken'];
export type Web_AccessView_AccessView_OnRevokeToken = Web_Components_AccessView_Props['onRevokeToken'];
export type Web_AccessView_AccessView_OnUpdateToken = Web_Components_AccessView_Props['onUpdateToken'];
export type Web_AccessView_AccessView_Role = Web_Components_AccessView_Props['role'];
export type Web_AccessView_AccessView_Tokens = Web_Components_AccessView_Props['tokens'];
export type Web_AccessView_AccessView_DialogOpen = boolean;
export type Web_AccessView_AccessView_SetDialogOpen = Dispatch<SetStateAction<Web_AccessView_AccessView_DialogOpen>>;
export type Web_AccessView_AccessView_DialogOpenState = [Web_AccessView_AccessView_DialogOpen, Web_AccessView_AccessView_SetDialogOpen];
export type Web_AccessView_AccessView_EditingToken = Web_Api_Token | null;
export type Web_AccessView_AccessView_SetEditingToken = Dispatch<SetStateAction<Web_AccessView_AccessView_EditingToken>>;
export type Web_AccessView_AccessView_EditingTokenState = [Web_AccessView_AccessView_EditingToken, Web_AccessView_AccessView_SetEditingToken];
export type Web_AccessView_AccessView_Revoking = Web_Api_Token | null;
export type Web_AccessView_AccessView_SetRevoking = Dispatch<SetStateAction<Web_AccessView_AccessView_Revoking>>;
export type Web_AccessView_AccessView_RevokingState = [Web_AccessView_AccessView_Revoking, Web_AccessView_AccessView_SetRevoking];
export type Web_AccessView_AccessView_Busy = boolean;
export type Web_AccessView_AccessView_SetBusy = Dispatch<SetStateAction<Web_AccessView_AccessView_Busy>>;
export type Web_AccessView_AccessView_BusyState = [Web_AccessView_AccessView_Busy, Web_AccessView_AccessView_SetBusy];
export type Web_AccessView_AccessView_RevokeError = string;
export type Web_AccessView_AccessView_SetRevokeError = Dispatch<SetStateAction<Web_AccessView_AccessView_RevokeError>>;
export type Web_AccessView_AccessView_RevokeErrorState = [Web_AccessView_AccessView_RevokeError, Web_AccessView_AccessView_SetRevokeError];
export type Web_AccessView_AccessView_Copied = string;
export type Web_AccessView_AccessView_SetCopied = Dispatch<SetStateAction<Web_AccessView_AccessView_Copied>>;
export type Web_AccessView_AccessView_CopiedState = [Web_AccessView_AccessView_Copied, Web_AccessView_AccessView_SetCopied];
export type Web_AccessView_AccessView_BaseUrl = string;
export type Web_AccessView_AccessView_CopyValue_Label = string;
export type Web_AccessView_AccessView_CopyValue_Value = string;
export type Web_AccessView_AccessView_CopyValue_Returns = Promise<void>;
export type Web_AccessView_AccessView_CopyValue = (label: Web_AccessView_AccessView_CopyValue_Label, value: Web_AccessView_AccessView_CopyValue_Value) => Web_AccessView_AccessView_CopyValue_Returns;
export type Web_AccessView_AccessView_Revoke_Token = Web_Api_Token;
export type Web_AccessView_AccessView_Revoke_Returns = Promise<void>;
export type Web_AccessView_AccessView_Revoke = (token: Web_AccessView_AccessView_Revoke_Token) => Web_AccessView_AccessView_Revoke_Returns;
export type Web_AccessView_AccessView_ExpiryLabel_Token = Web_Api_Token;
export type Web_AccessView_AccessView_ExpiryLabel_Returns = string;
export type Web_AccessView_AccessView_ExpiryLabel = (token: Web_AccessView_AccessView_ExpiryLabel_Token) => Web_AccessView_AccessView_ExpiryLabel_Returns;
export type Web_AccessView_AccessView_TokensNoun = string;
export type Web_AccessView_AccessView_RevokingName = string;

/**
 * Access View.
 *
 * @since 4.2.1
 */
export type Web_AccessView_Endpoints = Web_Components_Endpoint[];
