import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ApiError,
  errorMessage,
  getInvitePage,
  issueFor,
  saveInvitePage,
  uploadInviteImage,
} from '@/web/api.ts';
import { FieldLabel } from '@/web/field-label.tsx';
import {
  buttonTextColor,
  contrastRatio,
  InvitePage,
  parseHex,
} from '@/web/invite-page.tsx';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { countChanges } from '@/web/schema.ts';
import { showToast } from '@/web/toast.ts';

import type {
  Web_InvitePageView_AccentSwatches,
  Web_InvitePageView_CountDraftChanges_Draft,
  Web_InvitePageView_CountDraftChanges_Returns,
  Web_InvitePageView_CountDraftChanges_Saved,
  Web_InvitePageView_DarkSurface,
  Web_InvitePageView_DraftFrom_Page,
  Web_InvitePageView_DraftFrom_Returns,
  Web_InvitePageView_FormatRatio_Ratio,
  Web_InvitePageView_FormatRatio_Returns,
  Web_InvitePageView_ImageTypes,
  Web_InvitePageView_InvitePageView_Accent,
  Web_InvitePageView_InvitePageView_BannerButton,
  Web_InvitePageView_InvitePageView_BannerError,
  Web_InvitePageView_InvitePageView_BannerInput,
  Web_InvitePageView_InvitePageView_BannerInputValue,
  Web_InvitePageView_InvitePageView_ButtonRatio,
  Web_InvitePageView_InvitePageView_CanWrite,
  Web_InvitePageView_InvitePageView_ChangeCount,
  Web_InvitePageView_InvitePageView_ChangeNoun,
  Web_InvitePageView_InvitePageView_ChooseAccent,
  Web_InvitePageView_InvitePageView_ChooseAccent_Color,
  Web_InvitePageView_InvitePageView_ChooseAccent_Returns,
  Web_InvitePageView_InvitePageView_Conflict,
  Web_InvitePageView_InvitePageView_ConflictState,
  Web_InvitePageView_InvitePageView_Copied,
  Web_InvitePageView_InvitePageView_CopiedState,
  Web_InvitePageView_InvitePageView_Draft,
  Web_InvitePageView_InvitePageView_DraftState,
  Web_InvitePageView_InvitePageView_FieldError,
  Web_InvitePageView_InvitePageView_FieldError_Field,
  Web_InvitePageView_InvitePageView_FieldError_Returns,
  Web_InvitePageView_InvitePageView_File,
  Web_InvitePageView_InvitePageView_Files,
  Web_InvitePageView_InvitePageView_HexText,
  Web_InvitePageView_InvitePageView_HexTextState,
  Web_InvitePageView_InvitePageView_LinkSurfaces,
  Web_InvitePageView_InvitePageView_Load,
  Web_InvitePageView_InvitePageView_Load_Response,
  Web_InvitePageView_InvitePageView_Load_Returns,
  Web_InvitePageView_InvitePageView_Loaded,
  Web_InvitePageView_InvitePageView_LoadedState,
  Web_InvitePageView_InvitePageView_LoadError,
  Web_InvitePageView_InvitePageView_LoadErrorState,
  Web_InvitePageView_InvitePageView_LogoError,
  Web_InvitePageView_InvitePageView_LogoInput,
  Web_InvitePageView_InvitePageView_LogoInputValue,
  Web_InvitePageView_InvitePageView_LogoUrl,
  Web_InvitePageView_InvitePageView_Next,
  Web_InvitePageView_InvitePageView_OnOpenFeature,
  Web_InvitePageView_InvitePageView_Props,
  Web_InvitePageView_InvitePageView_ReadOnly,
  Web_InvitePageView_InvitePageView_Returns,
  Web_InvitePageView_InvitePageView_Save,
  Web_InvitePageView_InvitePageView_Save_Page,
  Web_InvitePageView_InvitePageView_Save_Returns,
  Web_InvitePageView_InvitePageView_Saved,
  Web_InvitePageView_InvitePageView_SaveError,
  Web_InvitePageView_InvitePageView_SaveErrorState,
  Web_InvitePageView_InvitePageView_Saving,
  Web_InvitePageView_InvitePageView_SavingState,
  Web_InvitePageView_InvitePageView_Server,
  Web_InvitePageView_InvitePageView_SetConflict,
  Web_InvitePageView_InvitePageView_SetCopied,
  Web_InvitePageView_InvitePageView_SetDraft,
  Web_InvitePageView_InvitePageView_SetHexText,
  Web_InvitePageView_InvitePageView_SetLoaded,
  Web_InvitePageView_InvitePageView_SetLoadError,
  Web_InvitePageView_InvitePageView_SetSaveError,
  Web_InvitePageView_InvitePageView_SetSaving,
  Web_InvitePageView_InvitePageView_SetUploadError,
  Web_InvitePageView_InvitePageView_SetUploading,
  Web_InvitePageView_InvitePageView_Summary,
  Web_InvitePageView_InvitePageView_ThemeName,
  Web_InvitePageView_InvitePageView_Update,
  Web_InvitePageView_InvitePageView_Update_Key,
  Web_InvitePageView_InvitePageView_Update_Returns,
  Web_InvitePageView_InvitePageView_Update_Value,
  Web_InvitePageView_InvitePageView_Upload,
  Web_InvitePageView_InvitePageView_Upload_File,
  Web_InvitePageView_InvitePageView_Upload_Image,
  Web_InvitePageView_InvitePageView_Upload_Kind,
  Web_InvitePageView_InvitePageView_Upload_Returns,
  Web_InvitePageView_InvitePageView_UploadError,
  Web_InvitePageView_InvitePageView_UploadErrorState,
  Web_InvitePageView_InvitePageView_Uploading,
  Web_InvitePageView_InvitePageView_UploadingState,
  Web_InvitePageView_InvitePageView_WeakLinkThemes,
  Web_InvitePageView_LightSurface,
  Web_InvitePageView_LogoOptions,
  Web_InvitePageView_MaximumImageBytes,
  Web_InvitePageView_ThemeOptions,
} from '@/types/web/invite-page-view.d.ts';

/**
 * Invite Page View - Accent Swatches.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const accentSwatches: Web_InvitePageView_AccentSwatches = [
  {
    color: '#6250d9',
    name: 'Purple',
  },
  {
    color: '#5865f2',
    name: 'Blurple',
  },
  {
    color: '#2563eb',
    name: 'Blue',
  },
  {
    color: '#0f766e',
    name: 'Teal',
  },
  {
    color: '#15803d',
    name: 'Green',
  },
  {
    color: '#b45309',
    name: 'Amber',
  },
  {
    color: '#c2410c',
    name: 'Orange',
  },
  {
    color: '#be123c',
    name: 'Rose',
  },
  {
    color: '#a21caf',
    name: 'Magenta',
  },
  {
    color: '#334155',
    name: 'Slate',
  },
];

/**
 * Invite Page View - Theme Options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const themeOptions: Web_InvitePageView_ThemeOptions = [
  {
    id: 'system',
    label: 'System',
  },
  {
    id: 'light',
    label: 'Light',
  },
  {
    id: 'dark',
    label: 'Dark',
  },
];

/**
 * Invite Page View - Logo Options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logoOptions: Web_InvitePageView_LogoOptions = [
  {
    id: 'server',
    label: 'Server icon',
  },
  {
    id: 'custom',
    label: 'Your image',
  },
  {
    id: 'none',
    label: 'No logo',
  },
];

/**
 * Invite Page View - Image Types.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const imageTypes: Web_InvitePageView_ImageTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Invite Page View - Maximum Image Bytes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const maximumImageBytes: Web_InvitePageView_MaximumImageBytes = 2 * 1024 * 1024;

/**
 * Invite Page View - Light Surface.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const lightSurface: Web_InvitePageView_LightSurface = [
  255,
  255,
  255,
];

/**
 * Invite Page View - Dark Surface.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const darkSurface: Web_InvitePageView_DarkSurface = [
  24,
  27,
  30,
];

// draftFrom copies the saved page into the fields the designer edits.

/**
 * Invite Page View - Draft From.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePageView_DraftFrom_Page} page - Page.
 *
 * @returns {Web_InvitePageView_DraftFrom_Returns}
 *
 * @since 4.0.0
 */
const draftFrom = (page: Web_InvitePageView_DraftFrom_Page): Web_InvitePageView_DraftFrom_Returns => ({
  accentColor: page['accentColor'],
  bannerImageId: page['bannerImageId'],
  bannerImageUrl: page['bannerImageUrl'],
  buttonLabel: page['buttonLabel'],
  description: page['description'],
  footerText: page['footerText'],
  logo: page['logo'],
  logoImageId: page['logoImageId'],
  logoImageUrl: page['logoImageUrl'],
  showBoostTier: page['showBoostTier'],
  showMemberCount: page['showMemberCount'],
  theme: page['theme'],
  title: page['title'],
});

// countDraftChanges counts what the designer edits. Image addresses follow their image ids,
// so a new banner is one change, not two.

/**
 * Invite Page View - Count Draft Changes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePageView_CountDraftChanges_Draft} draft - Draft.
 * @param {Web_InvitePageView_CountDraftChanges_Saved} saved - Saved.
 *
 * @returns {Web_InvitePageView_CountDraftChanges_Returns}
 *
 * @since 4.0.0
 */
const countDraftChanges = (draft: Web_InvitePageView_CountDraftChanges_Draft, saved: Web_InvitePageView_CountDraftChanges_Saved): Web_InvitePageView_CountDraftChanges_Returns => countChanges({
  ...draft,
  bannerImageUrl: null,
  logoImageUrl: null,
}, {
  ...saved,
  bannerImageUrl: null,
  logoImageUrl: null,
});

// formatRatio shows a contrast ratio the way contrast checkers do, such as 4.6:1.

/**
 * Invite Page View - Format Ratio.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePageView_FormatRatio_Ratio} ratio - Ratio.
 *
 * @returns {Web_InvitePageView_FormatRatio_Returns}
 *
 * @since 4.0.0
 */
const formatRatio = (ratio: Web_InvitePageView_FormatRatio_Ratio): Web_InvitePageView_FormatRatio_Returns => `${(Math.floor(ratio * 10) / 10).toFixed(1)}:1`;

/**
 * Invite Page View - Invite Page View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_InvitePageView_InvitePageView_Props} props - Props.
 *
 * @returns {Web_InvitePageView_InvitePageView_Returns}
 *
 * @since 4.0.0
 */
export const InvitePageView = (props: Web_InvitePageView_InvitePageView_Props): Web_InvitePageView_InvitePageView_Returns => {
  const canWrite: Web_InvitePageView_InvitePageView_CanWrite = props['canWrite'];
  const onOpenFeature: Web_InvitePageView_InvitePageView_OnOpenFeature = props['onOpenFeature'];
  const server: Web_InvitePageView_InvitePageView_Server = props['server'];
  const loadedState: Web_InvitePageView_InvitePageView_LoadedState = useState<Web_InvitePageView_InvitePageView_Loaded>(null);
  const loaded: Web_InvitePageView_InvitePageView_Loaded = loadedState[0];
  const setLoaded: Web_InvitePageView_InvitePageView_SetLoaded = loadedState[1];
  const draftState: Web_InvitePageView_InvitePageView_DraftState = useState<Web_InvitePageView_InvitePageView_Draft>(null);
  const draft: Web_InvitePageView_InvitePageView_Draft = draftState[0];
  const setDraft: Web_InvitePageView_InvitePageView_SetDraft = draftState[1];
  const loadErrorState: Web_InvitePageView_InvitePageView_LoadErrorState = useState<Web_InvitePageView_InvitePageView_LoadError>('');
  const loadError: Web_InvitePageView_InvitePageView_LoadError = loadErrorState[0];
  const setLoadError: Web_InvitePageView_InvitePageView_SetLoadError = loadErrorState[1];
  const saveErrorState: Web_InvitePageView_InvitePageView_SaveErrorState = useState<Web_InvitePageView_InvitePageView_SaveError>(null);
  const saveError: Web_InvitePageView_InvitePageView_SaveError = saveErrorState[0];
  const setSaveError: Web_InvitePageView_InvitePageView_SetSaveError = saveErrorState[1];
  const conflictState: Web_InvitePageView_InvitePageView_ConflictState = useState<Web_InvitePageView_InvitePageView_Conflict>(false);
  const conflict: Web_InvitePageView_InvitePageView_Conflict = conflictState[0];
  const setConflict: Web_InvitePageView_InvitePageView_SetConflict = conflictState[1];
  const savingState: Web_InvitePageView_InvitePageView_SavingState = useState<Web_InvitePageView_InvitePageView_Saving>(false);
  const saving: Web_InvitePageView_InvitePageView_Saving = savingState[0];
  const setSaving: Web_InvitePageView_InvitePageView_SetSaving = savingState[1];
  const uploadingState: Web_InvitePageView_InvitePageView_UploadingState = useState<Web_InvitePageView_InvitePageView_Uploading>(null);
  const uploading: Web_InvitePageView_InvitePageView_Uploading = uploadingState[0];
  const setUploading: Web_InvitePageView_InvitePageView_SetUploading = uploadingState[1];
  const uploadErrorState: Web_InvitePageView_InvitePageView_UploadErrorState = useState<Web_InvitePageView_InvitePageView_UploadError>('');
  const uploadError: Web_InvitePageView_InvitePageView_UploadError = uploadErrorState[0];
  const setUploadError: Web_InvitePageView_InvitePageView_SetUploadError = uploadErrorState[1];
  const hexTextState: Web_InvitePageView_InvitePageView_HexTextState = useState<Web_InvitePageView_InvitePageView_HexText>('');
  const hexText: Web_InvitePageView_InvitePageView_HexText = hexTextState[0];
  const setHexText: Web_InvitePageView_InvitePageView_SetHexText = hexTextState[1];
  const copiedState: Web_InvitePageView_InvitePageView_CopiedState = useState<Web_InvitePageView_InvitePageView_Copied>(false);
  const copied: Web_InvitePageView_InvitePageView_Copied = copiedState[0];
  const setCopied: Web_InvitePageView_InvitePageView_SetCopied = copiedState[1];
  const logoInput: Web_InvitePageView_InvitePageView_LogoInput = useRef<Web_InvitePageView_InvitePageView_LogoInputValue>(null);
  const bannerInput: Web_InvitePageView_InvitePageView_BannerInput = useRef<Web_InvitePageView_InvitePageView_BannerInputValue>(null);

  /**
   * Invite Page View - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_InvitePageView_InvitePageView_Load_Returns}
   *
   * @since 4.0.0
   */
  const load: Web_InvitePageView_InvitePageView_Load = async (): Web_InvitePageView_InvitePageView_Load_Returns => {
    setLoadError('');
    try {
      const response: Web_InvitePageView_InvitePageView_Load_Response = await getInvitePage(server['id']);

      setLoaded(response);
      setDraft(draftFrom(response['page']));
      setHexText(response['page']['accentColor']);
      setSaveError(null);
      setConflict(false);
    } catch (caughtError) {
      setLoadError(errorMessage(caughtError, 'The invite page could not be loaded.'));
    }

    return;
  };

  useEffect(() => {
    setLoaded(null);
    setDraft(null);
    void load();

    return;
  }, [server['id']]);

  const saved: Web_InvitePageView_InvitePageView_Saved = (loaded === null) ? null : draftFrom(loaded['page']);
  const changeCount: Web_InvitePageView_InvitePageView_ChangeCount = (saved === null || draft === null) ? 0 : countDraftChanges(draft, saved);

  if (loaded === null || draft === null) {
    return (
      <div className="detail-loading">
        {(loadError === '') ? (
          <>
            <span className="spinner" />
            Loading the invite page…
          </>
        ) : loadError}
      </div>
    );
  }

  const readOnly: Web_InvitePageView_InvitePageView_ReadOnly = canWrite === false || saving;

  /**
   * Invite Page View - Update.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Key}                                                 key   - Key.
   * @param {Web_InvitePageView_InvitePageView_Update_Value<Key>} value - Value.
   *
   * @returns {Web_InvitePageView_InvitePageView_Update_Returns}
   *
   * @since 4.0.0
   */
  const update: Web_InvitePageView_InvitePageView_Update = <Key extends Web_InvitePageView_InvitePageView_Update_Key>(key: Key, value: Web_InvitePageView_InvitePageView_Update_Value<Key>): Web_InvitePageView_InvitePageView_Update_Returns => {
    setDraft({
      ...draft,
      [key]: value,
    });

    return;
  };

  /**
   * Invite Page View - Choose Accent.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_InvitePageView_InvitePageView_ChooseAccent_Color} color - Color.
   *
   * @returns {Web_InvitePageView_InvitePageView_ChooseAccent_Returns}
   *
   * @since 4.0.0
   */
  const chooseAccent: Web_InvitePageView_InvitePageView_ChooseAccent = (color: Web_InvitePageView_InvitePageView_ChooseAccent_Color): Web_InvitePageView_InvitePageView_ChooseAccent_Returns => {
    setHexText(color);
    update('accentColor', color.toLowerCase());

    return;
  };

  /**
   * Invite Page View - Upload.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_InvitePageView_InvitePageView_Upload_Kind} kind - Kind.
   * @param {Web_InvitePageView_InvitePageView_Upload_File} file - File.
   *
   * @returns {Web_InvitePageView_InvitePageView_Upload_Returns}
   *
   * @since 4.0.0
   */
  const upload: Web_InvitePageView_InvitePageView_Upload = async (kind: Web_InvitePageView_InvitePageView_Upload_Kind, file: Web_InvitePageView_InvitePageView_Upload_File): Web_InvitePageView_InvitePageView_Upload_Returns => {
    if (file === undefined) {
      return;
    }

    setUploadError('');

    if (imageTypes.includes(file.type) === false) {
      setUploadError('Upload a PNG, JPEG, WebP, or GIF image.');

      return;
    }

    if (file.size > maximumImageBytes) {
      setUploadError('Use an image of 2 MB or less.');

      return;
    }

    setUploading(kind);
    try {
      const image: Web_InvitePageView_InvitePageView_Upload_Image = await uploadInviteImage(server['id'], file);

      setDraft((kind === 'logo') ? {
        ...draft,
        logo: 'custom',
        logoImageId: image['id'],
        logoImageUrl: image['url'],
      } : {
        ...draft,
        bannerImageId: image['id'],
        bannerImageUrl: image['url'],
      });
    } catch (caughtError) {
      setUploadError(errorMessage(caughtError, 'The image could not be uploaded. Try again.'));
    } finally {
      setUploading(null);
    }

    return;
  };

  /**
   * Invite Page View - Save.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_InvitePageView_InvitePageView_Save_Returns}
   *
   * @since 4.0.0
   */
  const save: Web_InvitePageView_InvitePageView_Save = async (): Web_InvitePageView_InvitePageView_Save_Returns => {
    setSaving(true);
    setSaveError(null);
    try {
      const page: Web_InvitePageView_InvitePageView_Save_Page = await saveInvitePage(server['id'], {
        accentColor: draft['accentColor'],
        bannerImageId: draft['bannerImageId'],
        buttonLabel: draft['buttonLabel'],
        description: draft['description'],
        expectedRevision: loaded['page']['revision'],
        footerText: draft['footerText'],
        logo: draft['logo'],
        logoImageId: (draft['logo'] === 'custom') ? draft['logoImageId'] : null,
        showBoostTier: draft['showBoostTier'],
        showMemberCount: draft['showMemberCount'],
        theme: draft['theme'],
        title: draft['title'],
      });

      setLoaded({
        ...loaded,
        page,
      });
      setDraft(draftFrom(page));
      setHexText(page['accentColor']);
      showToast((loaded['publicUrl'] === null || loaded['enabled'] === false) ? 'Saved.' : 'Saved. Visitors see the new page right away.', true);
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.code === 'revision_conflict') {
        setConflict(true);
      } else {
        setSaveError(caughtError);
      }
    } finally {
      setSaving(false);
    }

    return;
  };

  /**
   * Invite Page View - Field Error.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_InvitePageView_InvitePageView_FieldError_Field} field - Field.
   *
   * @returns {Web_InvitePageView_InvitePageView_FieldError_Returns}
   *
   * @since 4.0.0
   */
  const fieldError: Web_InvitePageView_InvitePageView_FieldError = (field: Web_InvitePageView_InvitePageView_FieldError_Field): Web_InvitePageView_InvitePageView_FieldError_Returns => issueFor(saveError, field);
  const accent: Web_InvitePageView_InvitePageView_Accent = parseHex(draft['accentColor']);
  const buttonRatio: Web_InvitePageView_InvitePageView_ButtonRatio = (accent === null) ? 0 : contrastRatio(accent, buttonTextColor(accent));
  const linkSurfaces: Web_InvitePageView_InvitePageView_LinkSurfaces = [];

  if (draft['theme'] !== 'dark') {
    linkSurfaces.push([
      'light',
      lightSurface,
    ]);
  }

  if (draft['theme'] !== 'light') {
    linkSurfaces.push([
      'dark',
      darkSurface,
    ]);
  }

  const weakLinkThemes: Web_InvitePageView_InvitePageView_WeakLinkThemes = (accent === null) ? [] : linkSurfaces
    .filter((linkSurface) => contrastRatio(accent, linkSurface[1]) < 4.5)
    .map((linkSurface) => linkSurface[0]);
  let logoUrl: Web_InvitePageView_InvitePageView_LogoUrl = null;

  if (draft['logo'] === 'server') {
    logoUrl = loaded['server']['iconUrl'];
  } else if (draft['logo'] === 'custom') {
    logoUrl = draft['logoImageUrl'];
  }

  const bannerError: Web_InvitePageView_InvitePageView_BannerError = fieldError('bannerImageId');
  let bannerButton: Web_InvitePageView_InvitePageView_BannerButton = (draft['bannerImageUrl'] === null) ? 'Upload a banner' : 'Replace';

  if (uploading === 'banner') {
    bannerButton = 'Uploading…';
  }

  const logoError: Web_InvitePageView_InvitePageView_LogoError = fieldError('logoImageId');
  const summary: Web_InvitePageView_InvitePageView_Summary = (saveError === null) ? '' : errorMessage(saveError, 'The invite page could not be saved. Try again.');
  const themeName: Web_InvitePageView_InvitePageView_ThemeName = (draft['theme'] === 'dark') ? 'Dark' : 'Light';
  const changeNoun: Web_InvitePageView_InvitePageView_ChangeNoun = (changeCount === 1) ? 'change' : 'changes';

  return (
    <section className="workspace-section">
      <div className="workspace-heading">
        <h1>Invite page</h1>
        <p>{`The page people open to join ${server['name']}. They check a reCAPTCHA box, then the bot creates a Discord invite for them.`}</p>
      </div>

      {(loaded['publicUrl'] === null || loaded['enabled'] === false) ? (
        <div className="panel">
          <section className="form-section">
            <div className="form-section-head">
              <h2>Not published yet</h2>
              <button className="text-button" onClick={() => onOpenFeature('web-applications')} type="button">Open Web applications</button>
            </div>
            <p className="form-section-note">Turn on the Web applications feature and give the invite page a path. You can design the page now; it goes live once both are set.</p>
          </section>
        </div>
      ) : (
        <div className="copy-list invite-public-link">
          <div className="copy-row">
            <span>Public link</span>
            <code>{loaded['publicUrl']}</code>
            <span className="invite-link-actions">
              <button
                aria-label="Copy the public link"
                className="icon-button"
                onClick={() => {
                  void navigator.clipboard.writeText(loaded['publicUrl'] ?? '').then(() => {
                    setCopied(true);

                    window.setTimeout(() => setCopied(false), 1800);

                    return;
                  });

                  return;
                }}
                title="Copy"
                type="button"
              >
                <Icon name={(copied === true) ? 'check' : 'copy'} size={16} />
              </button>
              <a aria-label="Open the public page" className="icon-button" href={loaded['publicUrl']} rel="noopener noreferrer" target="_blank" title="Open">
                <Icon name="external" size={16} />
              </a>
            </span>
          </div>
        </div>
      )}

      {(canWrite === true) ? null : (
        <p className="form-notice form-notice-info">
          <Icon name="shield" size={16} />
          <span>Your role can see the invite page but not change it.</span>
        </p>
      )}

      {(conflict === true) ? (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>The invite page changed since you opened it. Reload to see the latest version.</span>
          <button
            className="text-button"
            onClick={() => {
              void load();

              return;
            }}
            type="button"
          >
            Reload
          </button>
        </div>
      ) : null}

      {(summary === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{summary}</span>
        </div>
      )}

      <div className="invite-designer">
        <div className="panel invite-designer-form">
          <section className="form-section">
            <div className="form-section-head">
              <h2>Text</h2>
            </div>
            <FieldLabel>
              <span>Title</span>
              <input
                aria-invalid={fieldError('title') !== ''}
                disabled={readOnly}
                maxLength={100}
                onChange={(event) => update('title', event.currentTarget.value)}
                value={draft['title']}
              />
              {(fieldError('title') === '') ? null : <small className="field-error">{fieldError('title')}</small>}
            </FieldLabel>
            <FieldLabel>
              <span>Description</span>
              <textarea
                aria-invalid={fieldError('description') !== ''}
                disabled={readOnly}
                maxLength={300}
                onChange={(event) => update('description', event.currentTarget.value)}
                rows={3}
                value={draft['description']}
              />
              {(fieldError('description') === '') ? <small>{`${draft['description'].length} of 300 characters.`}</small> : <small className="field-error">{fieldError('description')}</small>}
            </FieldLabel>
            <FieldLabel>
              <span>Button label</span>
              <input
                aria-invalid={fieldError('buttonLabel') !== ''}
                disabled={readOnly}
                maxLength={40}
                onChange={(event) => update('buttonLabel', event.currentTarget.value)}
                value={draft['buttonLabel']}
              />
              {(fieldError('buttonLabel') === '') ? null : <small className="field-error">{fieldError('buttonLabel')}</small>}
            </FieldLabel>
            <FieldLabel>
              <span>Footer</span>
              <textarea
                aria-invalid={fieldError('footerText') !== ''}
                disabled={readOnly}
                maxLength={500}
                onChange={(event) => update('footerText', event.currentTarget.value)}
                rows={3}
                value={draft['footerText']}
              />
              {(fieldError('footerText') === '') ? <small>For a link, paste an https:// address, or write [Server rules](https://example.com/rules).</small> : <small className="field-error">{fieldError('footerText')}</small>}
            </FieldLabel>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2>Look</h2>
            </div>
            <div className="field">
              <span id="invite-theme-label">Theme</span>
              <div aria-labelledby="invite-theme-label" className="segmented segmented-fit" role="group">
                {themeOptions.map((option) => (
                  <button aria-pressed={draft['theme'] === option['id']} disabled={readOnly} key={option['id']} onClick={() => update('theme', option['id'])} type="button">
                    {option['label']}
                  </button>
                ))}
              </div>
              <small>{'System follows each visitor\'s device setting.'}</small>
            </div>

            <div className="field">
              <span id="invite-accent-label">Accent color</span>
              <div aria-labelledby="invite-accent-label" className="accent-swatches" role="group">
                {accentSwatches.map((swatch) => (
                  <button
                    aria-label={swatch['name']}
                    aria-pressed={draft['accentColor'] === swatch['color']}
                    className="accent-swatch"
                    disabled={readOnly}
                    key={swatch['color']}
                    onClick={() => chooseAccent(swatch['color'])}
                    style={{ backgroundColor: swatch['color'] }}
                    title={swatch['name']}
                    type="button"
                  />
                ))}
              </div>
              <div className="accent-input">
                <input
                  aria-label="Pick a color"
                  disabled={readOnly}
                  onChange={(event) => chooseAccent(event.currentTarget.value)}
                  type="color"
                  value={(accent === null) ? '#6250d9' : draft['accentColor']}
                />
                <input
                  aria-invalid={accent === null || fieldError('accentColor') !== ''}
                  aria-label="Hex color"
                  autoCapitalize="none"
                  className="monospace"
                  disabled={readOnly}
                  maxLength={7}
                  onChange={(event) => {
                    const next: Web_InvitePageView_InvitePageView_Next = event.currentTarget.value.trim();

                    setHexText(next);

                    if (parseHex(next) !== null) {
                      update('accentColor', next.toLowerCase());
                    }

                    return;
                  }}
                  spellCheck={false}
                  value={hexText}
                />
              </div>
              {(fieldError('accentColor') !== '') ? <small className="field-error">{fieldError('accentColor')}</small> : null}
              {(parseHex(hexText) === null && fieldError('accentColor') === '') ? <small className="field-error">Use a hex color like #6250d9.</small> : null}
              {(accent === null || parseHex(hexText) === null) ? null : (
                <small className={(buttonRatio < 4.5 || weakLinkThemes.length > 0) ? 'contrast-note contrast-note-weak' : 'contrast-note'}>
                  {(buttonRatio < 4.5) ? `Button text contrast is ${formatRatio(buttonRatio)}. Choose a darker or lighter color so the button is easy to read.` : `Button text contrast is ${formatRatio(buttonRatio)}, easy to read.`}
                  {(weakLinkThemes.length === 0) ? '' : ` Footer links may be hard to read on the ${weakLinkThemes.join(' and ')} theme.`}
                </small>
              )}
            </div>

            <div className="field">
              <span id="invite-logo-label">Logo</span>
              <div aria-labelledby="invite-logo-label" className="segmented segmented-fit" role="group">
                {logoOptions.map((option) => (
                  <button
                    aria-pressed={draft['logo'] === option['id']}
                    disabled={readOnly}
                    key={option['id']}
                    onClick={() => {
                      if (option['id'] === 'custom' && draft['logoImageId'] === null) {
                        if (logoInput.current !== null) {
                          logoInput.current.click();
                        }

                        return;
                      }

                      update('logo', option['id']);

                      return;
                    }}
                    type="button"
                  >
                    {option['label']}
                  </button>
                ))}
              </div>
              {(draft['logo'] === 'server' && loaded['server']['iconUrl'] === null) ? <small>This server has no icon, so the page shows no logo.</small> : null}
              {(draft['logo'] === 'custom') ? (
                <div className="invite-image-row">
                  {(draft['logoImageUrl'] === null) ? null : <img alt="" className="invite-image-thumb invite-image-thumb-logo" src={draft['logoImageUrl']} />}
                  {(readOnly === true) ? null : (
                    <Button
                      disabled={uploading !== null}
                      icon="upload"
                      onClick={() => {
                        if (logoInput.current !== null) {
                          logoInput.current.click();
                        }

                        return;
                      }}
                    >
                      {(uploading === 'logo') ? 'Uploading…' : 'Upload a logo'}
                    </Button>
                  )}
                </div>
              ) : null}
              {(logoError === '') ? <small>Square images look best. PNG, JPEG, WebP, or GIF, up to 2 MB.</small> : <small className="field-error">{logoError}</small>}
              <input
                accept={imageTypes.join(',')}
                hidden
                onChange={(event) => {
                  const files: Web_InvitePageView_InvitePageView_Files = event.currentTarget.files;
                  const file: Web_InvitePageView_InvitePageView_File = (files === null) ? undefined : files[0];

                  // Clearing the picker lets the same file be chosen again after an error.
                  if (logoInput.current !== null) {
                    logoInput.current.value = '';
                  }

                  void upload('logo', file);

                  return;
                }}
                ref={logoInput}
                type="file"
              />
            </div>

            <div className="field">
              <span>Banner</span>
              <div className="invite-image-row">
                {(draft['bannerImageUrl'] === null) ? <small>No banner.</small> : <img alt="" className="invite-image-thumb" src={draft['bannerImageUrl']} />}
                {(readOnly === true) ? null : (
                  <>
                    <Button
                      disabled={uploading !== null}
                      icon="upload"
                      onClick={() => {
                        if (bannerInput.current !== null) {
                          bannerInput.current.click();
                        }

                        return;
                      }}
                    >
                      {bannerButton}
                    </Button>
                    {(draft['bannerImageUrl'] === null) ? null : (
                      <Button
                        disabled={uploading !== null}
                        icon="remove"
                        onClick={() => setDraft({
                          ...draft,
                          bannerImageId: null,
                          bannerImageUrl: null,
                        })}
                        variant="quiet"
                      >
                        Remove
                      </Button>
                    )}
                  </>
                )}
              </div>
              {(bannerError === '') ? <small>A wide image, about 3 to 1, shown above the title and in link previews.</small> : <small className="field-error">{bannerError}</small>}
              <input
                accept={imageTypes.join(',')}
                hidden
                onChange={(event) => {
                  const files: Web_InvitePageView_InvitePageView_Files = event.currentTarget.files;
                  const file: Web_InvitePageView_InvitePageView_File = (files === null) ? undefined : files[0];

                  if (bannerInput.current !== null) {
                    bannerInput.current.value = '';
                  }

                  void upload('banner', file);

                  return;
                }}
                ref={bannerInput}
                type="file"
              />
            </div>

            {(uploadError === '') ? null : (
              <div className="form-error" role="alert">
                <Icon name="warning" size={16} />
                <span>{uploadError}</span>
              </div>
            )}
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2>Server details</h2>
            </div>
            <label aria-label="Show the member count" className="schema-switch-row">
              <span className="schema-switch-copy">
                <span>Show the member count</span>
                <small>Shown when Discord shares it, like 1,204 members.</small>
              </span>
              <span className="switch-control">
                <input checked={draft['showMemberCount']} disabled={readOnly} onChange={(event) => update('showMemberCount', event.currentTarget.checked)} type="checkbox" />
                <span className="switch-track"><span /></span>
              </span>
            </label>
            <label aria-label="Show the boost level" className="schema-switch-row">
              <span className="schema-switch-copy">
                <span>Show the boost level</span>
                <small>Shown when the server has at least boost level 1.</small>
              </span>
              <span className="switch-control">
                <input checked={draft['showBoostTier']} disabled={readOnly} onChange={(event) => update('showBoostTier', event.currentTarget.checked)} type="checkbox" />
                <span className="switch-track"><span /></span>
              </span>
            </label>
          </section>
        </div>

        <div className="invite-designer-preview">
          <div className="invite-preview-head">
            <span>Preview</span>
            <small>{(draft['theme'] === 'system') ? 'Follows your device theme' : `${themeName} theme`}</small>
          </div>
          <div className="invite-preview-frame">
            <InvitePage
              available
              error=""
              joinState="idle"
              page={{
                accentColor: (accent === null) ? '#6250d9' : draft['accentColor'],
                bannerUrl: draft['bannerImageUrl'],
                buttonLabel: (draft['buttonLabel'].trim() === '') ? 'Join' : draft['buttonLabel'],
                description: draft['description'],
                footerText: draft['footerText'],
                logoUrl,
                showBoostTier: draft['showBoostTier'],
                showMemberCount: draft['showMemberCount'],
                theme: draft['theme'],
                title: (draft['title'].trim() === '') ? 'Untitled' : draft['title'],
              }}
              preview
              server={{
                boostTier: null,
                iconUrl: loaded['server']['iconUrl'],
                memberCount: null,
                name: loaded['server']['name'],
              }}
            />
          </div>
        </div>
      </div>

      {(changeCount > 0 && canWrite === true) ? (
        <div aria-label="Unsaved changes" className="save-bar" role="region">
          <strong>{`${changeCount} unsaved ${changeNoun}`}</strong>
          <Button
            disabled={saving}
            onClick={() => {
              if (saved !== null) {
                setDraft(saved);
                setHexText(saved['accentColor']);
              }

              setSaveError(null);
              setUploadError('');

              return;
            }}
          >
            Discard
          </Button>
          <Button
            disabled={(
              saving
              || conflict
              || uploading !== null
              || accent === null
            )}
            onClick={() => {
              void save();

              return;
            }}
            variant="primary"
          >
            {(saving === true) ? 'Saving…' : 'Save'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
