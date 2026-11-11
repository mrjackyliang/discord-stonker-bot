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
  ChangeEvent,
  ReactElement,
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
 * Invite Page View - Accent swatches.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const accentSwatches: Web_Components_AccentSwatch[] = [
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
 * Invite Page View - Theme options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const themeOptions: Web_Components_InviteThemeOption[] = [
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
 * Invite Page View - Logo options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logoOptions: Web_Components_InviteLogoOption[] = [
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
 * Invite Page View - Image types.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const imageTypes: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Invite Page View - Maximum image bytes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const maximumImageBytes: number = 2 * 1024 * 1024;

/**
 * Invite Page View - Light surface.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const lightSurface: Web_Invite_Rgb = [
  255,
  255,
  255,
];

/**
 * Invite Page View - Dark surface.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const darkSurface: Web_Invite_Rgb = [
  24,
  27,
  30,
];

// draftFrom copies the saved page into the fields the designer edits.

/**
 * Invite Page View - Draft from.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const draftFrom = (page: Web_Api_InvitePage): Web_Components_InviteDraft => ({
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
 * Invite Page View - Count draft changes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const countDraftChanges = (draft: Web_Components_InviteDraft, saved: Web_Components_InviteDraft): number => countChanges({
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
 * Invite Page View - Formats ratio.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const formatRatio = (ratio: number): string => `${(Math.floor(ratio * 10) / 10).toFixed(1)}:1`;

/**
 * Invite Page View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const InvitePageView = ({
  canWrite,
  onOpenFeature,
  server,
}: Web_Components_InvitePageView_Props): ReactElement => {
  const [
    loaded,
    setLoaded,
  ] = useState<Web_Api_InvitePageResponse | null>(null);
  const [
    draft,
    setDraft,
  ] = useState<Web_Components_InviteDraft | null>(null);
  const [
    loadError,
    setLoadError,
  ] = useState<string>('');
  const [
    saveError,
    setSaveError,
  ] = useState<unknown>(null);
  const [
    conflict,
    setConflict,
  ] = useState<boolean>(false);
  const [
    saving,
    setSaving,
  ] = useState<boolean>(false);
  const [
    uploading,
    setUploading,
  ] = useState<Web_Components_InviteImageKind | null>(null);
  const [
    uploadError,
    setUploadError,
  ] = useState<string>('');
  const [
    hexText,
    setHexText,
  ] = useState<string>('');
  const [
    copied,
    setCopied,
  ] = useState<boolean>(false);
  const logoInput = useRef<HTMLInputElement | null>(null);
  const bannerInput = useRef<HTMLInputElement | null>(null);

  /**
   * Invite Page View - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const load = async (): Promise<void> => {
    setLoadError('');
    try {
      const response: Web_Api_InvitePageResponse = await getInvitePage(server['id']);

      setLoaded(response);
      setDraft(draftFrom(response['page']));
      setHexText(response['page']['accentColor']);
      setSaveError(null);
      setConflict(false);
    } catch (caughtError) {
      setLoadError(errorMessage(caughtError, 'The invite page could not be loaded.'));
    }
  };

  useEffect((): void => {
    setLoaded(null);
    setDraft(null);
    void load();
  }, [server['id']]);

  const saved: Web_Components_InviteDraft | null = (loaded === null) ? null : draftFrom(loaded['page']);
  const changeCount: number = (saved === null || draft === null) ? 0 : countDraftChanges(draft, saved);

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

  const readOnly: boolean = !canWrite || saving;

  /**
   * Invite Page View - Update.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const update = <Key extends keyof Web_Components_InviteDraft>(key: Key, value: Web_Components_InviteDraft[Key]): void => {
    setDraft({
      ...draft,
      [key]: value,
    });
  };

  /**
   * Invite Page View - Choose accent.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const chooseAccent = (color: string): void => {
    setHexText(color);
    update('accentColor', color.toLowerCase());
  };

  /**
   * Invite Page View - Upload.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const upload = async (kind: Web_Components_InviteImageKind, file: File | undefined): Promise<void> => {
    if (file === undefined) {
      return;
    }

    setUploadError('');

    if (!imageTypes.includes(file.type)) {
      setUploadError('Upload a PNG, JPEG, WebP, or GIF image.');

      return;
    }

    if (file.size > maximumImageBytes) {
      setUploadError('Use an image of 2 MB or less.');

      return;
    }

    setUploading(kind);
    try {
      const image: Web_Api_UploadedImage = await uploadInviteImage(server['id'], file);

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
  };

  /**
   * Invite Page View - Save.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const save = async (): Promise<void> => {
    setSaving(true);
    setSaveError(null);
    try {
      const page: Web_Api_InvitePage = await saveInvitePage(server['id'], {
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
      showToast((loaded['publicUrl'] === null || !loaded['enabled']) ? 'Saved.' : 'Saved. Visitors see the new page right away.', true);
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.code === 'revision_conflict') {
        setConflict(true);
      } else {
        setSaveError(caughtError);
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Invite Page View - Field error.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const fieldError = (field: string): string => issueFor(saveError, field);
  const accent: Web_Invite_Rgb | null = parseHex(draft['accentColor']);
  const buttonRatio: number = (accent === null) ? 0 : contrastRatio(accent, buttonTextColor(accent));
  const linkSurfaces: [string, Web_Invite_Rgb][] = [];

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

  const weakLinkThemes: string[] = (accent === null) ? [] : linkSurfaces
    .filter(([
      , surface]: [string, Web_Invite_Rgb,
    ]): boolean => contrastRatio(accent, surface) < 4.5)
    .map(([name]: [string, Web_Invite_Rgb]): string => name);
  let logoUrl: string | null = null;

  if (draft['logo'] === 'server') {
    logoUrl = loaded['server']['iconUrl'];
  } else if (draft['logo'] === 'custom') {
    logoUrl = draft['logoImageUrl'];
  }

  const bannerError: string = fieldError('bannerImageId');
  let bannerButton: string = (draft['bannerImageUrl'] === null) ? 'Upload a banner' : 'Replace';

  if (uploading === 'banner') {
    bannerButton = 'Uploading…';
  }

  const logoError: string = fieldError('logoImageId');
  const summary: string = (saveError === null) ? '' : errorMessage(saveError, 'The invite page could not be saved. Try again.');

  return (
    <section className="workspace-section">
      <div className="workspace-heading">
        <h1>Invite page</h1>
        <p>{`The page people open to join ${server['name']}. They check a reCAPTCHA box, then the bot creates a Discord invite for them.`}</p>
      </div>

      {(loaded['publicUrl'] === null || !loaded['enabled']) ? (
        <div className="panel">
          <section className="form-section">
            <div className="form-section-head">
              <h2>Not published yet</h2>
              <button className="text-button" onClick={(): void => onOpenFeature('web-applications')} type="button">Open Web applications</button>
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
                onClick={(): void => {
                  void navigator.clipboard.writeText(loaded['publicUrl'] ?? '').then((): void => {
                    setCopied(true);
                    window.setTimeout((): void => setCopied(false), 1800);
                  });
                }}
                title="Copy"
                type="button"
              >
                <Icon name={(copied) ? 'check' : 'copy'} size={16} />
              </button>
              <a aria-label="Open the public page" className="icon-button" href={loaded['publicUrl']} rel="noopener noreferrer" target="_blank" title="Open">
                <Icon name="external" size={16} />
              </a>
            </span>
          </div>
        </div>
      )}

      {(canWrite) ? null : (
        <p className="form-notice form-notice-info">
          <Icon name="shield" size={16} />
          <span>Your role can see the invite page but not change it.</span>
        </p>
      )}

      {(conflict) ? (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>The invite page changed since you opened it. Reload to see the latest version.</span>
          <button
            className="text-button"
            onClick={(): void => {
              void load();
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
                onChange={(event: ChangeEvent<HTMLInputElement>): void => update('title', event.currentTarget.value)}
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
                onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => update('description', event.currentTarget.value)}
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
                onChange={(event: ChangeEvent<HTMLInputElement>): void => update('buttonLabel', event.currentTarget.value)}
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
                onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => update('footerText', event.currentTarget.value)}
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
                {themeOptions.map((option: Web_Components_InviteThemeOption): ReactElement => (
                  <button aria-pressed={draft['theme'] === option['id']} disabled={readOnly} key={option['id']} onClick={(): void => update('theme', option['id'])} type="button">
                    {option['label']}
                  </button>
                ))}
              </div>
              <small>{'System follows each visitor\'s device setting.'}</small>
            </div>

            <div className="field">
              <span id="invite-accent-label">Accent color</span>
              <div aria-labelledby="invite-accent-label" className="accent-swatches" role="group">
                {accentSwatches.map((swatch: Web_Components_AccentSwatch): ReactElement => (
                  <button
                    aria-label={swatch['name']}
                    aria-pressed={draft['accentColor'] === swatch['color']}
                    className="accent-swatch"
                    disabled={readOnly}
                    key={swatch['color']}
                    onClick={(): void => chooseAccent(swatch['color'])}
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
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => chooseAccent(event.currentTarget.value)}
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
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    const next: string = event.currentTarget.value.trim();

                    setHexText(next);

                    if (parseHex(next) !== null) {
                      update('accentColor', next.toLowerCase());
                    }
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
                {logoOptions.map((option: Web_Components_InviteLogoOption): ReactElement => (
                  <button
                    aria-pressed={draft['logo'] === option['id']}
                    disabled={readOnly}
                    key={option['id']}
                    onClick={(): void => {
                      if (option['id'] === 'custom' && draft['logoImageId'] === null) {
                        logoInput.current?.click();

                        return;
                      }

                      update('logo', option['id']);
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
                  {(readOnly) ? null : (
                    <Button disabled={uploading !== null} icon="upload" onClick={(): void => logoInput.current?.click()}>
                      {(uploading === 'logo') ? 'Uploading…' : 'Upload a logo'}
                    </Button>
                  )}
                </div>
              ) : null}
              {(logoError === '') ? <small>Square images look best. PNG, JPEG, WebP, or GIF, up to 2 MB.</small> : <small className="field-error">{logoError}</small>}
              <input
                accept={imageTypes.join(',')}
                hidden
                onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                  const file: File | undefined = event.currentTarget.files?.[0];

                  // Clearing the picker lets the same file be chosen again after an error.
                  if (logoInput.current !== null) {
                    logoInput.current.value = '';
                  }

                  void upload('logo', file);
                }}
                ref={logoInput}
                type="file"
              />
            </div>

            <div className="field">
              <span>Banner</span>
              <div className="invite-image-row">
                {(draft['bannerImageUrl'] === null) ? <small>No banner.</small> : <img alt="" className="invite-image-thumb" src={draft['bannerImageUrl']} />}
                {(readOnly) ? null : (
                  <>
                    <Button disabled={uploading !== null} icon="upload" onClick={(): void => bannerInput.current?.click()}>
                      {bannerButton}
                    </Button>
                    {(draft['bannerImageUrl'] === null) ? null : (
                      <Button
                        disabled={uploading !== null}
                        icon="remove"
                        onClick={(): void => setDraft({
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
                onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                  const file: File | undefined = event.currentTarget.files?.[0];

                  if (bannerInput.current !== null) {
                    bannerInput.current.value = '';
                  }

                  void upload('banner', file);
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
                <input checked={draft['showMemberCount']} disabled={readOnly} onChange={(event: ChangeEvent<HTMLInputElement>): void => update('showMemberCount', event.currentTarget.checked)} type="checkbox" />
                <span className="switch-track"><span /></span>
              </span>
            </label>
            <label aria-label="Show the boost level" className="schema-switch-row">
              <span className="schema-switch-copy">
                <span>Show the boost level</span>
                <small>Shown when the server has at least boost level 1.</small>
              </span>
              <span className="switch-control">
                <input checked={draft['showBoostTier']} disabled={readOnly} onChange={(event: ChangeEvent<HTMLInputElement>): void => update('showBoostTier', event.currentTarget.checked)} type="checkbox" />
                <span className="switch-track"><span /></span>
              </span>
            </label>
          </section>
        </div>

        <div className="invite-designer-preview">
          <div className="invite-preview-head">
            <span>Preview</span>
            <small>{(draft['theme'] === 'system') ? 'Follows your device theme' : `${(draft['theme'] === 'dark') ? 'Dark' : 'Light'} theme`}</small>
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

      {(changeCount > 0 && canWrite) ? (
        <div aria-label="Unsaved changes" className="save-bar" role="region">
          <strong>{`${changeCount} unsaved ${(changeCount === 1) ? 'change' : 'changes'}`}</strong>
          <Button
            disabled={saving}
            onClick={(): void => {
              if (saved !== null) {
                setDraft(saved);
                setHexText(saved['accentColor']);
              }

              setSaveError(null);
              setUploadError('');
            }}
          >
            Discard
          </Button>
          <Button
            disabled={saving || conflict || uploading !== null || accent === null}
            onClick={(): void => {
              void save();
            }}
            variant="primary"
          >
            {(saving) ? 'Saving…' : 'Save'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
