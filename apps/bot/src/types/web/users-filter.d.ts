import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Components_UsersFilter_Option,
  Web_Components_UsersFilter_Props,
} from '@/types/web/components.d.ts';

/**
 * Users Filter.
 *
 * @since 4.2.1
 */
export type Web_UsersFilter_UsersFilter_Props = Web_Components_UsersFilter_Props;
export type Web_UsersFilter_UsersFilter_Returns = ReactElement;
export type Web_UsersFilter_UsersFilter_AnyLabel = Web_Components_UsersFilter_Props['anyLabel'];
export type Web_UsersFilter_UsersFilter_ClassName = Web_Components_UsersFilter_Props['className'];
export type Web_UsersFilter_UsersFilter_Label = Web_Components_UsersFilter_Props['label'];
export type Web_UsersFilter_UsersFilter_OnChange = Web_Components_UsersFilter_Props['onChange'];
export type Web_UsersFilter_UsersFilter_Options = Web_Components_UsersFilter_Props['options'];
export type Web_UsersFilter_UsersFilter_Value = Web_Components_UsersFilter_Props['value'];
export type Web_UsersFilter_UsersFilter_OpenState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UsersFilter_UsersFilter_Open = boolean;
export type Web_UsersFilter_UsersFilter_SetOpen = Dispatch<SetStateAction<boolean>>;
export type Web_UsersFilter_UsersFilter_Selected = Web_Components_UsersFilter_Option | undefined;
export type Web_UsersFilter_UsersFilter_Choose_Next = string;
export type Web_UsersFilter_UsersFilter_Choose_Returns = void;
export type Web_UsersFilter_UsersFilter_Choose = (next: Web_UsersFilter_UsersFilter_Choose_Next) => Web_UsersFilter_UsersFilter_Choose_Returns;
