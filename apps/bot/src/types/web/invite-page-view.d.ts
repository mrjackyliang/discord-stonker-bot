import type {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
} from 'react';

import type {
  Web_Api_InvitePage,
  Web_Api_InvitePageResponse,
  Web_Api_UploadedImage,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_AccentSwatch,
  Web_Components_InviteDraft,
  Web_Components_InviteImageKind,
  Web_Components_InviteLogoOption,
  Web_Components_InvitePageView_Props,
  Web_Components_InviteThemeOption,
} from '@/types/web/components.d.ts';
import type { Web_Invite_Rgb } from '@/types/web/invite.d.ts';

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_AccentSwatches = Web_Components_AccentSwatch[];

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_CountDraftChanges_Draft = Web_Components_InviteDraft;
export type Web_InvitePageView_CountDraftChanges_Saved = Web_Components_InviteDraft;
export type Web_InvitePageView_CountDraftChanges_Returns = number;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_DarkSurface = Web_Invite_Rgb;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_DraftFrom_Page = Web_Api_InvitePage;
export type Web_InvitePageView_DraftFrom_Returns = Web_Components_InviteDraft;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_FormatRatio_Ratio = number;
export type Web_InvitePageView_FormatRatio_Returns = string;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_ImageTypes = string[];

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_InvitePageView_Props = Web_Components_InvitePageView_Props;
export type Web_InvitePageView_InvitePageView_Returns = ReactElement;
export type Web_InvitePageView_InvitePageView_CanWrite = Web_Components_InvitePageView_Props['canWrite'];
export type Web_InvitePageView_InvitePageView_OnOpenFeature = Web_Components_InvitePageView_Props['onOpenFeature'];
export type Web_InvitePageView_InvitePageView_Server = Web_Components_InvitePageView_Props['server'];
export type Web_InvitePageView_InvitePageView_LoadedState = [Web_Api_InvitePageResponse | null, Dispatch<SetStateAction<Web_Api_InvitePageResponse | null>>];
export type Web_InvitePageView_InvitePageView_Loaded = Web_Api_InvitePageResponse | null;
export type Web_InvitePageView_InvitePageView_SetLoaded = Dispatch<SetStateAction<Web_Api_InvitePageResponse | null>>;
export type Web_InvitePageView_InvitePageView_DraftState = [Web_Components_InviteDraft | null, Dispatch<SetStateAction<Web_Components_InviteDraft | null>>];
export type Web_InvitePageView_InvitePageView_Draft = Web_Components_InviteDraft | null;
export type Web_InvitePageView_InvitePageView_SetDraft = Dispatch<SetStateAction<Web_Components_InviteDraft | null>>;
export type Web_InvitePageView_InvitePageView_LoadErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_InvitePageView_InvitePageView_LoadError = string;
export type Web_InvitePageView_InvitePageView_SetLoadError = Dispatch<SetStateAction<string>>;
export type Web_InvitePageView_InvitePageView_SaveErrorState = [unknown, Dispatch<SetStateAction<unknown>>];
export type Web_InvitePageView_InvitePageView_SaveError = unknown;
export type Web_InvitePageView_InvitePageView_SetSaveError = Dispatch<SetStateAction<unknown>>;
export type Web_InvitePageView_InvitePageView_ConflictState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_InvitePageView_InvitePageView_Conflict = boolean;
export type Web_InvitePageView_InvitePageView_SetConflict = Dispatch<SetStateAction<boolean>>;
export type Web_InvitePageView_InvitePageView_SavingState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_InvitePageView_InvitePageView_Saving = boolean;
export type Web_InvitePageView_InvitePageView_SetSaving = Dispatch<SetStateAction<boolean>>;
export type Web_InvitePageView_InvitePageView_UploadingState = [Web_Components_InviteImageKind | null, Dispatch<SetStateAction<Web_Components_InviteImageKind | null>>];
export type Web_InvitePageView_InvitePageView_Uploading = Web_Components_InviteImageKind | null;
export type Web_InvitePageView_InvitePageView_SetUploading = Dispatch<SetStateAction<Web_Components_InviteImageKind | null>>;
export type Web_InvitePageView_InvitePageView_UploadErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_InvitePageView_InvitePageView_UploadError = string;
export type Web_InvitePageView_InvitePageView_SetUploadError = Dispatch<SetStateAction<string>>;
export type Web_InvitePageView_InvitePageView_HexTextState = [string, Dispatch<SetStateAction<string>>];
export type Web_InvitePageView_InvitePageView_HexText = string;
export type Web_InvitePageView_InvitePageView_SetHexText = Dispatch<SetStateAction<string>>;
export type Web_InvitePageView_InvitePageView_CopiedState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_InvitePageView_InvitePageView_Copied = boolean;
export type Web_InvitePageView_InvitePageView_SetCopied = Dispatch<SetStateAction<boolean>>;
export type Web_InvitePageView_InvitePageView_LogoInputValue = HTMLInputElement | null;
export type Web_InvitePageView_InvitePageView_LogoInput = RefObject<HTMLInputElement | null>;
export type Web_InvitePageView_InvitePageView_BannerInputValue = HTMLInputElement | null;
export type Web_InvitePageView_InvitePageView_BannerInput = RefObject<HTMLInputElement | null>;
export type Web_InvitePageView_InvitePageView_Load_Returns = Promise<void>;
export type Web_InvitePageView_InvitePageView_Load = () => Web_InvitePageView_InvitePageView_Load_Returns;
export type Web_InvitePageView_InvitePageView_Load_Response = Web_Api_InvitePageResponse;
export type Web_InvitePageView_InvitePageView_Saved = Web_Components_InviteDraft | null;
export type Web_InvitePageView_InvitePageView_ChangeCount = number;
export type Web_InvitePageView_InvitePageView_ReadOnly = boolean;
export type Web_InvitePageView_InvitePageView_Update_Key = keyof Web_Components_InviteDraft;
export type Web_InvitePageView_InvitePageView_Update_Value<Key extends Web_InvitePageView_InvitePageView_Update_Key> = Web_Components_InviteDraft[Key];
export type Web_InvitePageView_InvitePageView_Update_Returns = void;
export type Web_InvitePageView_InvitePageView_Update = <Key extends Web_InvitePageView_InvitePageView_Update_Key>(key: Key, value: Web_InvitePageView_InvitePageView_Update_Value<Key>) => Web_InvitePageView_InvitePageView_Update_Returns;
export type Web_InvitePageView_InvitePageView_ChooseAccent_Color = string;
export type Web_InvitePageView_InvitePageView_ChooseAccent_Returns = void;
export type Web_InvitePageView_InvitePageView_ChooseAccent = (color: Web_InvitePageView_InvitePageView_ChooseAccent_Color) => Web_InvitePageView_InvitePageView_ChooseAccent_Returns;
export type Web_InvitePageView_InvitePageView_Upload_Kind = Web_Components_InviteImageKind;
export type Web_InvitePageView_InvitePageView_Upload_File = File | undefined;
export type Web_InvitePageView_InvitePageView_Upload_Returns = Promise<void>;
export type Web_InvitePageView_InvitePageView_Upload = (kind: Web_InvitePageView_InvitePageView_Upload_Kind, file: Web_InvitePageView_InvitePageView_Upload_File) => Web_InvitePageView_InvitePageView_Upload_Returns;
export type Web_InvitePageView_InvitePageView_Upload_Image = Web_Api_UploadedImage;
export type Web_InvitePageView_InvitePageView_Save_Returns = Promise<void>;
export type Web_InvitePageView_InvitePageView_Save = () => Web_InvitePageView_InvitePageView_Save_Returns;
export type Web_InvitePageView_InvitePageView_Save_Page = Web_Api_InvitePage;
export type Web_InvitePageView_InvitePageView_FieldError_Field = string;
export type Web_InvitePageView_InvitePageView_FieldError_Returns = string;
export type Web_InvitePageView_InvitePageView_FieldError = (field: Web_InvitePageView_InvitePageView_FieldError_Field) => Web_InvitePageView_InvitePageView_FieldError_Returns;
export type Web_InvitePageView_InvitePageView_Accent = Web_Invite_Rgb | null;
export type Web_InvitePageView_InvitePageView_ButtonRatio = number;
export type Web_InvitePageView_InvitePageView_LinkSurfaces = [string, Web_Invite_Rgb][];
export type Web_InvitePageView_InvitePageView_WeakLinkThemes = string[];
export type Web_InvitePageView_InvitePageView_LogoUrl = string | null;
export type Web_InvitePageView_InvitePageView_BannerError = string;
export type Web_InvitePageView_InvitePageView_BannerButton = string;
export type Web_InvitePageView_InvitePageView_LogoError = string;
export type Web_InvitePageView_InvitePageView_Summary = string;
export type Web_InvitePageView_InvitePageView_ThemeName = string;
export type Web_InvitePageView_InvitePageView_ChangeNoun = string;
export type Web_InvitePageView_InvitePageView_Next = string;
export type Web_InvitePageView_InvitePageView_Files = FileList | null;
export type Web_InvitePageView_InvitePageView_File = File | undefined;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_LightSurface = Web_Invite_Rgb;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_LogoOptions = Web_Components_InviteLogoOption[];

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_MaximumImageBytes = number;

/**
 * Invite Page View.
 *
 * @since 4.2.1
 */
export type Web_InvitePageView_ThemeOptions = Web_Components_InviteThemeOption[];
