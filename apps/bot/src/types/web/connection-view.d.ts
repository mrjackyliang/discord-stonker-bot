import type {
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Components_BotStatus,
  Web_Components_ConnectionView_Props,
} from '@/types/web/components.d.ts';

/**
 * Connection View.
 *
 * @since 4.2.1
 */
export type Web_ConnectionView_ConnectionView_Props = Web_Components_ConnectionView_Props;
export type Web_ConnectionView_ConnectionView_Returns = ReactElement;
export type Web_ConnectionView_ConnectionView_Bot = Web_Components_ConnectionView_Props['bot'];
export type Web_ConnectionView_ConnectionView_Can = Web_Components_ConnectionView_Props['can'];
export type Web_ConnectionView_ConnectionView_OnBotAction = Web_Components_ConnectionView_Props['onBotAction'];
export type Web_ConnectionView_ConnectionView_OnTokenSaved = Web_Components_ConnectionView_Props['onTokenSaved'];
export type Web_ConnectionView_ConnectionView_Token = string;
export type Web_ConnectionView_ConnectionView_SetToken = Dispatch<SetStateAction<Web_ConnectionView_ConnectionView_Token>>;
export type Web_ConnectionView_ConnectionView_TokenState = [Web_ConnectionView_ConnectionView_Token, Web_ConnectionView_ConnectionView_SetToken];
export type Web_ConnectionView_ConnectionView_Replacing = boolean;
export type Web_ConnectionView_ConnectionView_SetReplacing = Dispatch<SetStateAction<Web_ConnectionView_ConnectionView_Replacing>>;
export type Web_ConnectionView_ConnectionView_ReplacingState = [Web_ConnectionView_ConnectionView_Replacing, Web_ConnectionView_ConnectionView_SetReplacing];
export type Web_ConnectionView_ConnectionView_Saving = boolean;
export type Web_ConnectionView_ConnectionView_SetSaving = Dispatch<SetStateAction<Web_ConnectionView_ConnectionView_Saving>>;
export type Web_ConnectionView_ConnectionView_SavingState = [Web_ConnectionView_ConnectionView_Saving, Web_ConnectionView_ConnectionView_SetSaving];
export type Web_ConnectionView_ConnectionView_TokenError = unknown;
export type Web_ConnectionView_ConnectionView_SetTokenError = Dispatch<SetStateAction<Web_ConnectionView_ConnectionView_TokenError>>;
export type Web_ConnectionView_ConnectionView_TokenErrorState = [Web_ConnectionView_ConnectionView_TokenError, Web_ConnectionView_ConnectionView_SetTokenError];
export type Web_ConnectionView_ConnectionView_Copied = boolean;
export type Web_ConnectionView_ConnectionView_SetCopied = Dispatch<SetStateAction<Web_ConnectionView_ConnectionView_Copied>>;
export type Web_ConnectionView_ConnectionView_CopiedState = [Web_ConnectionView_ConnectionView_Copied, Web_ConnectionView_ConnectionView_SetCopied];
export type Web_ConnectionView_ConnectionView_Status = Web_Components_BotStatus;
export type Web_ConnectionView_ConnectionView_CanWrite = boolean;
export type Web_ConnectionView_ConnectionView_ShowForm = boolean;
export type Web_ConnectionView_ConnectionView_TokenIssue = string;
export type Web_ConnectionView_ConnectionView_Submit_Event = FormEvent<HTMLFormElement>;
export type Web_ConnectionView_ConnectionView_Submit_Returns = Promise<void>;
export type Web_ConnectionView_ConnectionView_Submit = (event: Web_ConnectionView_ConnectionView_Submit_Event) => Web_ConnectionView_ConnectionView_Submit_Returns;

/**
 * Connection View.
 *
 * @since 4.2.1
 */
export type Web_ConnectionView_ToneClasses = Record<Web_Components_BotStatus['tone'], string>;
