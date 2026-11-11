import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { FieldLabel } from '@/web/field-label.tsx';
import {
  Button,
  Icon,
  passwordManagerIgnore,
} from '@/web/primitives.tsx';
import {
  clone,
  constantOf,
  defaultValue,
  isHidden,
  isRecord,
  isSecretSchema,
  pathKey,
  resolveSchema,
  schemaTypes,
  stripSecrets,
  titleCase,
  unionOf,
  unionOptionIndex,
  unwrapNullable,
} from '@/web/schema.ts';

import type {
  ChangeEvent,
  ReactElement,
} from 'react';

import type {
  Web_Api_Channel,
  Web_Api_DiscordRole,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_FieldError_Props,
  Web_Components_Hint_Props,
  Web_Components_InlineField_Props,
  Web_Components_LinesField_Props,
  Web_Components_ObjectFields_Props,
  Web_Components_PickerChoice,
  Web_Components_PickerField_Props,
  Web_Components_ScalarField_Props,
  Web_Components_SchemaField_Props,
  Web_Components_SchemaForm_Layout,
  Web_Components_SchemaForm_Props,
  Web_Components_UnionField_Props,
  Web_Components_VariableButtons_Props,
} from '@/types/web/components.d.ts';
import type {
  Web_Schema_Node,
  Web_Schema_Path,
  Web_Schema_Section,
  Web_Schema_TypeName,
  Web_Schema_Union,
  Web_Schema_Unwrapped,
  Web_Schema_Variable,
} from '@/types/web/schema.d.ts';

// fieldId builds a stable element id from a path so labels and errors stay linked.

/**
 * Schema Form - Field ID.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const fieldId = (path: Web_Schema_Path): string => `field-${path.map((segment: number | string): string => String(segment).replace(/[^A-Za-z0-9_-]/gu, '_')).join('-') || 'root'}`;

// inlineChild returns the one picker inside an object the editor marked inline, such as { "channel-id": … }.

/**
 * Schema Form - Inline child.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const inlineChild = (schema: Web_Schema_Node, root: Web_Schema_Node): [string, Web_Schema_Node] | null => {
  if (schema['x-inline'] !== true || schema['properties'] === undefined) {
    return null;
  }

  const entries: [string, Web_Schema_Node][] = Object.entries(schema['properties']);
  const first: [string, Web_Schema_Node] | undefined = entries[0];

  return (entries.length === 1 && first !== undefined) ? [
    first[0],
    resolveSchema(first[1], root),
  ] : null;
};

// enumLabel names one fixed choice with the editor's wording when it has some.

/**
 * Schema Form - Enum label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const enumLabel = (schema: Web_Schema_Node, value: string): string => {
  const labels: Record<string, string> | undefined = schema['x-enum-labels'];
  const label: string | undefined = (labels === undefined) ? undefined : labels[value];

  return label ?? titleCase(value);
};

// isComplex says whether a node needs its own group instead of one input.

/**
 * Schema Form - Checks whether complex.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const isComplex = (schema: Web_Schema_Node, root: Web_Schema_Node): boolean => {
  const resolved: Web_Schema_Node = unwrapNullable(resolveSchema(schema, root), root)['schema'];

  if (isSecretSchema(resolved) || inlineChild(resolved, root) !== null) {
    return false;
  }

  if (unionOf(resolved, root) !== null) {
    return true;
  }

  const types: Web_Schema_TypeName[] = schemaTypes(resolved);

  if (types.includes('object')) {
    return true;
  }

  if (types.includes('array')) {
    const items: Web_Schema_Node = resolveSchema(resolved['items'], root);

    return items['enum'] === undefined;
  }

  return false;
};

// singular makes a row name from a list label, such as "Destinations" to "Destination".

/**
 * Schema Form - Singular.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const singular = (label: string): string => {
  if (label.endsWith('ies')) {
    return `${label.slice(0, -3)}y`;
  }

  if (label.endsWith('ses') || label.endsWith('xes')) {
    return label.slice(0, -2);
  }

  return (label.endsWith('s') && !label.endsWith('ss')) ? label.slice(0, -1) : label;
};

/**
 * Schema Form - Field error.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const FieldError = ({
  id,
  message,
}: Web_Components_FieldError_Props): ReactElement | null => (
  (message === '') ? null : <small className="field-error" id={id}>{message}</small>
);

/**
 * Schema Form - Hint.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const Hint = ({
  id,
  text,
}: Web_Components_Hint_Props): ReactElement | null => (
  (text === undefined || text === '') ? null : <small id={id}>{text}</small>
);

/**
 * Schema Form - JSON field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const JsonField = ({
  context,
  label,
  onChange,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const [
    text,
    setText,
  ] = useState<string>((value === undefined) ? '' : JSON.stringify(value, null, 2));
  const [
    parseError,
    setParseError,
  ] = useState<string>('');

  useEffect((): void => {
    setText((value === undefined) ? '' : JSON.stringify(value, null, 2));
  }, [JSON.stringify(value)]);

  const issue: string = context.issueAt(path);

  return (
    <FieldLabel className="field schema-wide">
      <span>{label}</span>
      <textarea
        aria-invalid={issue !== '' || parseError !== ''}
        className="monospace schema-json"
        disabled={context.readOnly}
        id={fieldId(path)}
        onBlur={(): void => {
          if (text.trim() === '') {
            setParseError('');
            onChange(undefined);

            return;
          }

          try {
            onChange(JSON.parse(text));
            setParseError('');
          } catch {
            setParseError('This isn\'t valid JSON.');
          }
        }}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => setText(event.currentTarget.value)}
        rows={Math.min(14, Math.max(4, text.split('\n').length + 1))}
        spellCheck={false}
        value={text}
      />
      {(parseError === '') ? <FieldError message={issue} /> : <small className="field-error">{parseError}</small>}
      {(parseError === '' && issue === '') ? <Hint text={schema['description'] ?? 'Edited as JSON.'} /> : null}
    </FieldLabel>
  );
};

/**
 * Schema Form - Variable buttons.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const VariableButtons = ({
  onInsert,
  variables,
}: Web_Components_VariableButtons_Props): ReactElement => (
  <div aria-label="Insert a variable" className="variable-bar" role="group">
    {variables.map((variable: Web_Schema_Variable): ReactElement => {
      const token: string = (typeof variable === 'string') ? variable : variable['token'];
      const description: string | undefined = (typeof variable === 'string') ? undefined : variable['description'];

      return (
        <button
          className="variable-chip"
          key={token}
          onClick={(): void => onInsert(token)}
          title={description}
          type="button"
        >
          {token}
        </button>
      );
    })}
  </div>
);

/**
 * Schema Form - Picker field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const PickerField = ({
  context,
  kind,
  label,
  onChange,
  path,
  required,
  schema,
  value,
}: Web_Components_PickerField_Props): ReactElement => {
  const current: string = (typeof value === 'string') ? value : '';
  const issue: string = context.issueAt(path);
  const channels: Web_Api_Channel[] = [...context.resources['channels']].sort((left: Web_Api_Channel, right: Web_Api_Channel): number => left['name'].localeCompare(right['name']));
  const roles: Web_Api_DiscordRole[] = [...context.resources['roles']].sort((left: Web_Api_DiscordRole, right: Web_Api_DiscordRole): number => (right['position'] ?? 0) - (left['position'] ?? 0));
  const known: boolean = current === '' || ((kind === 'channel') ? channels.some((channel: Web_Api_Channel): boolean => channel['id'] === current) : roles.some((role: Web_Api_DiscordRole): boolean => role['id'] === current));

  return (
    <FieldLabel>
      <span>{label}</span>
      <select
        aria-invalid={issue !== ''}
        className="select-control picker-control"
        disabled={context.readOnly}
        id={fieldId(path)}
        onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
          const next: string = event.currentTarget.value;

          onChange((next === '' && !required) ? undefined : next);
        }}
        value={current}
      >
        <option className="select-placeholder" value="">— Select one —</option>
        {(known) ? null : <option value={current}>{`Unknown ${kind} (${current})`}</option>}
        {(kind === 'channel') ? channels.map((channel: Web_Api_Channel): ReactElement => (
          <option key={channel['id']} value={channel['id']}>{`#${channel['name']}${(channel['available']) ? '' : ' (deleted)'}`}</option>
        )) : roles.map((role: Web_Api_DiscordRole): ReactElement => (
          <option key={role['id']} value={role['id']}>{`@${role['name']}${(role['available']) ? '' : ' (deleted)'}`}</option>
        ))}
      </select>
      {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
    </FieldLabel>
  );
};

/**
 * Schema Form - String field.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const StringField = (props: Web_Components_ScalarField_Props): ReactElement => {
  const {
    context,
    label,
    nullable,
    onChange,
    path,
    required,
    schema,
    value,
  } = props;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const widget: Web_Schema_Node['x-widget'] = schema['x-widget'];
  const issue: string = context.issueAt(path);
  let current: string = '';

  if (typeof value === 'string') {
    current = value;
  } else if (value !== undefined && value !== null) {
    current = String(value);
  }

  if (widget === 'channel' || widget === 'role') {
    return <PickerField {...props} kind={widget} />;
  }

  /**
   * Schema Form - Update.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const update = (next: string): void => {
    if (next === '') {
      if (nullable) {
        onChange(null);

        return;
      }

      onChange((required) ? '' : undefined);

      return;
    }

    onChange(next);
  };

  if (schema['enum'] !== undefined) {
    const options: string[] = schema['enum'].map((entry: unknown): string => String(entry));

    return (
      <FieldLabel>
        <span>{label}</span>
        <select
          aria-invalid={issue !== ''}
          className="select-control picker-control"
          disabled={context.readOnly}
          id={fieldId(path)}
          onChange={(event: ChangeEvent<HTMLSelectElement>): void => update(event.currentTarget.value)}
          value={current}
        >
          <option className="select-placeholder" value="">— Select one —</option>
          {(current !== '' && !options.includes(current)) ? <option value={current}>{`${current} (not a listed choice)`}</option> : null}
          {options.map((option: string): ReactElement => <option key={option} value={option}>{enumLabel(schema, option)}</option>)}
        </select>
        {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
      </FieldLabel>
    );
  }

  const variables: Web_Schema_Variable[] = schema['x-variables'] ?? [];
  // Long text and message text (the fields with variables) get a multi-line box.
  if (widget === 'textarea' || widget === 'variables') {
    /**
     * Schema Form - Insert.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 4.0.0
     */
    const insert = (token: string): void => {
      const element: HTMLTextAreaElement | null = textareaRef.current;
      const start: number = (element === null) ? current.length : element.selectionStart;
      const end: number = (element === null) ? current.length : element.selectionEnd;
      const next: string = `${current.slice(0, start)}${token}${current.slice(end)}`;

      update(next);

      window.requestAnimationFrame((): void => {
        if (element !== null) {
          element.focus();
          element.setSelectionRange(start + token.length, start + token.length);
        }
      });
    };

    return (
      <div className="field schema-wide">
        <label htmlFor={fieldId(path)}>{label}</label>
        <textarea
          aria-invalid={issue !== ''}
          disabled={context.readOnly}
          id={fieldId(path)}
          maxLength={schema['maxLength']}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => update(event.currentTarget.value)}
          ref={textareaRef}
          rows={Math.min(10, Math.max(3, current.split('\n').length + 1))}
          value={current}
        />
        {(variables.length === 0 || context.readOnly) ? null : <VariableButtons onInsert={insert} variables={variables} />}
        {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
      </div>
    );
  }

  let inputType: string = 'text';
  let inputMode: 'numeric' | 'text' | 'url' = 'text';
  let placeholder: string | undefined = undefined;

  if (widget === 'url' || schema['format'] === 'uri' || schema['format'] === 'url') {
    inputType = 'url';
    inputMode = 'url';
    placeholder = 'e.g. https://example.com';
  } else if (widget === 'discord-id') {
    inputMode = 'numeric';
    placeholder = 'e.g. 123456789012345678';
  } else if (widget === 'time-zone') {
    placeholder = 'e.g. America/New_York';
  }

  return (
    <FieldLabel>
      <span>{label}</span>
      <input
        aria-invalid={issue !== ''}
        autoCapitalize="none"
        className={(widget === 'pattern' || widget === 'discord-id') ? 'monospace' : undefined}
        disabled={context.readOnly}
        id={fieldId(path)}
        inputMode={inputMode}
        list={(widget === 'time-zone') ? 'schema-time-zones' : undefined}
        maxLength={schema['maxLength']}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => update(event.currentTarget.value)}
        placeholder={placeholder}
        spellCheck={widget !== 'pattern' && widget !== 'discord-id' && widget !== 'url' && widget !== 'time-zone'}
        type={inputType}
        value={current}
      />
      {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
    </FieldLabel>
  );
};

// timeZones lists the IANA time zones the browser knows, for the time zone suggestions.

/**
 * Schema Form - Time zones.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const timeZones = (): string[] => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return [];
  }
};

// TimeZoneOptions renders the suggestions every time zone field shares.

/**
 * Schema Form - Time zone options.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const TimeZoneOptions = (): ReactElement => (
  <datalist id="schema-time-zones">
    {timeZones().map((zone: string): ReactElement => <option key={zone} value={zone} />)}
  </datalist>
);

/**
 * Schema Form - Identifier list field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const IdentifierListField = ({
  context,
  label,
  onChange,
  onRemove,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const widget: Web_Schema_Node['x-widget'] = schema['x-widget'];
  const items: Web_Schema_Node = resolveSchema(schema['items'], context.root);
  const itemKey: string = schema['x-item-key'] ?? Object.keys(items['properties'] ?? {})[0] ?? 'id';
  const entries: unknown[] = (Array.isArray(value)) ? value : [];
  const identifiers: string[] = entries.map((entry: unknown): string => {
    const identifier: unknown = (isRecord(entry)) ? entry[itemKey] : entry;

    return (typeof identifier === 'string') ? identifier : '';
  });
  const issue: string = context.issueAt(path);
  const [
    text,
    setText,
  ] = useState<string>(identifiers.join('\n'));
  const maximum: number = schema['maxItems'] ?? Number.POSITIVE_INFINITY;

  useEffect((): void => {
    const typed: string[] = text.split('\n').map((line: string): string => line.trim()).filter((line: string): boolean => line !== '');

    if (typed.join('\n') !== identifiers.join('\n')) {
      setText(identifiers.join('\n'));
    }
  }, [identifiers.join('\n')]);

  // Each row keeps any other keys it had, so only the chosen ID changes.

  /**
   * Schema Form - Replace.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const replace = (next: string[]): void => onChange(next.map((identifier: string): unknown => {
    const existing: unknown = entries[identifiers.indexOf(identifier)];

    return {
      ...((isRecord(existing)) ? existing : {}),
      [itemKey]: identifier,
    };
  }));

  if (widget === 'discord-id-list') {
    return (
      <div className="field schema-wide">
        <div className="schema-list-head">
          <label className="field-label" htmlFor={fieldId(path)}>{label}</label>
          {(onRemove === undefined || context.readOnly) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
        </div>
        <textarea
          aria-invalid={issue !== ''}
          className="monospace"
          disabled={context.readOnly}
          id={fieldId(path)}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => {
            const next: string = event.currentTarget.value;

            setText(next);
            replace(next.split('\n').map((line: string): string => line.trim()).filter((line: string): boolean => line !== ''));
          }}
          rows={Math.min(10, Math.max(3, identifiers.length + 1))}
          spellCheck={false}
          value={text}
        />
        {(issue === '') ? <small>{schema['description'] ?? 'One ID per line.'}</small> : <FieldError message={issue} />}
      </div>
    );
  }

  const kind: 'channel' | 'role' = (widget === 'role-list') ? 'role' : 'channel';
  const choices: Web_Components_PickerChoice[] = (kind === 'channel') ? [...context.resources['channels']]
    .sort((left: Web_Api_Channel, right: Web_Api_Channel): number => left['name'].localeCompare(right['name']))
    .map((channel: Web_Api_Channel): Web_Components_PickerChoice => ({
      id: channel['id'],
      name: `#${channel['name']}${(channel['available']) ? '' : ' (deleted)'}`,
    })) : [...context.resources['roles']]
    .sort((left: Web_Api_DiscordRole, right: Web_Api_DiscordRole): number => (right['position'] ?? 0) - (left['position'] ?? 0))
    .map((role: Web_Api_DiscordRole): Web_Components_PickerChoice => ({
      id: role['id'],
      name: `@${role['name']}${(role['available']) ? '' : ' (deleted)'}`,
    }));

  /**
   * Schema Form - Name of.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const nameOf = (identifier: string): string => {
    const choice: Web_Components_PickerChoice | undefined = choices.find((candidate: Web_Components_PickerChoice): boolean => candidate['id'] === identifier);

    return (choice === undefined) ? `Unknown ${kind} (${identifier})` : choice['name'];
  };
  const remaining: Web_Components_PickerChoice[] = choices.filter((choice: Web_Components_PickerChoice): boolean => !identifiers.includes(choice['id']));

  return (
    <div className="field schema-wide">
      <div className="schema-list-head">
        <span className="field-label">{label}</span>
        {(onRemove === undefined || context.readOnly) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </div>
      {(identifiers.length === 0) ? <p className="schema-empty">{(kind === 'channel') ? 'No channels yet.' : 'No roles yet.'}</p> : (
        <ul className="picker-list">
          {identifiers.map((identifier: string, index: number): ReactElement => (
            <li key={`${identifier}-${index}`}>
              <span className={(identifier === '' || nameOf(identifier).startsWith('Unknown')) ? 'picker-list-unknown' : undefined}>{(identifier === '') ? `No ${kind} chosen` : nameOf(identifier)}</span>
              {(context.readOnly) ? null : (
                <button
                  aria-label={`Remove ${nameOf(identifier)}`}
                  className="icon-button"
                  onClick={(): void => replace(identifiers.filter((_identifier: string, candidate: number): boolean => candidate !== index))}
                  title="Remove"
                  type="button"
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {(context.readOnly || identifiers.length >= maximum) ? null : (
        <select
          aria-label={(kind === 'channel') ? `Add a channel to ${label.toLowerCase()}` : `Add a role to ${label.toLowerCase()}`}
          className="select-control picker-control"
          disabled={remaining.length === 0}
          id={fieldId(path)}
          onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
            const next: string = event.currentTarget.value;

            if (next !== '') {
              replace([
                ...identifiers,
                next,
              ]);
            }
          }}
          value=""
        >
          <option className="select-placeholder" disabled value="">{(kind === 'channel') ? 'Add a channel…' : 'Add a role…'}</option>
          {remaining.map((choice: Web_Components_PickerChoice): ReactElement => <option key={choice['id']} value={choice['id']}>{choice['name']}</option>)}
        </select>
      )}
      {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
    </div>
  );
};

/**
 * Schema Form - Permission map field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const PermissionMapField = ({
  context,
  label,
  onChange,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const record: Record<string, unknown> = (isRecord(value)) ? value : {};
  const names: string[] = Object.keys(record);
  const options: string[] = (schema['x-options'] ?? []).filter((option: string): boolean => !names.includes(option));
  const issue: string = context.issueAt(path);

  /**
   * Schema Form - Set permission.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const setPermission = (name: string, allowed: boolean | undefined): void => {
    const next: Record<string, unknown> = { ...record };

    if (allowed === undefined) {
      delete next[name];
    } else {
      next[name] = allowed;
    }

    onChange(next);
  };

  return (
    <div className="field schema-wide">
      <span className="field-label">{label}</span>
      {(names.length === 0) ? <p className="schema-empty">No permissions yet.</p> : (
        <ul className="picker-list">
          {names.map((name: string): ReactElement => (
            <li key={name}>
              <span className="monospace">{name}</span>
              <span className="picker-list-controls">
                <span aria-label={`${name} permission`} className="segmented schema-segmented" role="group">
                  <button aria-pressed={record[name] === true} disabled={context.readOnly} onClick={(): void => setPermission(name, true)} type="button">Allow</button>
                  <button aria-pressed={record[name] === false} disabled={context.readOnly} onClick={(): void => setPermission(name, false)} type="button">Deny</button>
                </span>
                {(context.readOnly) ? null : (
                  <button aria-label={`Remove ${name}`} className="icon-button" onClick={(): void => setPermission(name, undefined)} title="Remove" type="button">
                    <Icon name="x" size={16} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {(context.readOnly) ? null : (
        <select
          aria-label="Add a permission"
          className="select-control picker-control"
          disabled={options.length === 0}
          id={fieldId(path)}
          onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
            const next: string = event.currentTarget.value;

            if (next !== '') {
              setPermission(next, true);
            }
          }}
          value=""
        >
          <option className="select-placeholder" disabled value="">Add a permission…</option>
          {options.map((option: string): ReactElement => <option key={option} value={option}>{option}</option>)}
        </select>
      )}
      {(issue === '') ? <Hint text={schema['description'] ?? 'Set the complete Discord permission overwrite. Permissions you leave out return to their inherited value.'} /> : <FieldError message={issue} />}
    </div>
  );
};

/**
 * Schema Form - Number field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const NumberField = ({
  context,
  label,
  nullable,
  onChange,
  path,
  schema,
  value,
}: Web_Components_ScalarField_Props): ReactElement => {
  const external: string = (typeof value === 'number') ? String(value) : '';
  const [
    text,
    setText,
  ] = useState<string>(external);
  const issue: string = context.issueAt(path);
  const integer: boolean = schemaTypes(schema).includes('integer');

  useEffect((): void => {
    if (Number(text) !== value || text === '') {
      setText(external);
    }
  }, [external]);

  const limits: string[] = [];

  if (schema['minimum'] !== undefined) {
    limits.push(`at least ${schema['minimum']}`);
  }

  if (schema['maximum'] !== undefined) {
    limits.push(`at most ${schema['maximum']}`);
  }

  return (
    <FieldLabel>
      <span>{label}</span>
      <input
        aria-invalid={issue !== ''}
        disabled={context.readOnly}
        id={fieldId(path)}
        inputMode={(integer) ? 'numeric' : 'decimal'}
        max={schema['maximum']}
        min={schema['minimum']}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          const next: string = event.currentTarget.value;

          setText(next);

          if (next.trim() === '') {
            onChange((nullable) ? null : undefined);

            return;
          }

          const parsed: number = Number(next);

          onChange((Number.isFinite(parsed)) ? parsed : next);
        }}
        step={(integer) ? 1 : 'any'}
        type="number"
        value={text}
      />
      {(issue === '') ? <Hint text={schema['description'] ?? ((limits.length === 0) ? undefined : `${limits.join(', ')}.`.replace(/^./u, (first: string): string => first.toUpperCase()))} /> : <FieldError message={issue} />}
    </FieldLabel>
  );
};

/**
 * Schema Form - Boolean field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const BooleanField = ({
  context,
  label,
  onChange,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const issue: string = context.issueAt(path);

  return (
    <div className="field schema-switch">
      <label className="schema-switch-row">
        <span className="schema-switch-copy">
          <span>{label}</span>
          {(issue === '') ? <Hint text={schema['description']} /> : null}
        </span>
        <span className="switch-control">
          <input
            checked={value === true}
            disabled={context.readOnly}
            id={fieldId(path)}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => onChange(event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="switch-track"><span /></span>
        </span>
      </label>
      <FieldError message={issue} />
    </div>
  );
};

/**
 * Schema Form - Secret field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const SecretField = ({
  context,
  label,
  onChange,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const record: Record<string, unknown> = (isRecord(value)) ? value : {};
  const key: string = (typeof record['$secret'] === 'string') ? record['$secret'] : '';
  const draft: string = (typeof record['__draft'] === 'string') ? record['__draft'] : '';
  const saved: boolean = key !== '' && context.savedSecrets[key] === true;
  const [
    replacing,
    setReplacing,
  ] = useState<boolean>(false);
  const issue: string = context.issueAt(path) || context.issueAt([
    ...path,
    '$secret',
  ]);

  if (saved && !replacing && draft === '') {
    return (
      <div className="field">
        <span className="field-label">{label}</span>
        <div className="secret-saved">
          <span className="tag tag-success">Saved</span>
          <small>{'Stored encrypted. It\'s never shown again.'}</small>
          {(context.readOnly) ? null : <button className="text-button" onClick={(): void => setReplacing(true)} type="button">Replace</button>}
        </div>
        <FieldError message={issue} />
      </div>
    );
  }

  return (
    <FieldLabel>
      <span>{label}</span>
      <input
        {...passwordManagerIgnore}
        aria-invalid={issue !== ''}
        autoComplete="off"
        disabled={context.readOnly}
        id={fieldId(path)}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          const next: string = event.currentTarget.value;

          onChange((next === '') ? { $secret: key } : {
            $secret: key,
            __draft: next,
          });
        }}
        placeholder={(saved) ? 'Enter the new value' : undefined}
        spellCheck={false}
        type="password"
        value={draft}
      />
      {(issue === '') ? (
        <small>
          {(saved) ? 'Leave it empty to keep the saved value. ' : ''}
          {schema['description'] ?? 'Stored encrypted and never shown again.'}
          {(saved) ? (
            <>
              {' '}
              <button
                className="text-button text-button-inline"
                onClick={(): void => {
                  setReplacing(false);
                  onChange({ $secret: key });
                }}
                type="button"
              >
                Keep the saved value
              </button>
            </>
          ) : null}
        </small>
      ) : <FieldError message={issue} />}
    </FieldLabel>
  );
};

/**
 * Schema Form - Lines field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const LinesField = ({
  context,
  itemType,
  label,
  onChange,
  onRemove,
  path,
  schema,
  value,
}: Web_Components_LinesField_Props): ReactElement => {
  const entries: unknown[] = (Array.isArray(value)) ? value : [];
  const external: string = entries.map((entry: unknown): string => String(entry)).join('\n');
  const [
    text,
    setText,
  ] = useState<string>(external);
  const issue: string = context.issueAt(path);
  const numeric: boolean = itemType === 'number' || itemType === 'integer';

  /**
   * Schema Form - Parse.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const parse = (next: string): unknown[] => next
    .split('\n')
    .map((line: string): string => line.replace(/\r$/u, ''))
    .filter((line: string): boolean => line.trim() !== '')
    .map((line: string): unknown => {
      if (!numeric) {
        return line;
      }

      const parsed: number = Number(line.trim());

      return (Number.isFinite(parsed)) ? parsed : line;
    });

  useEffect((): void => {
    if (JSON.stringify(parse(text)) !== JSON.stringify(entries)) {
      setText(external);
    }
  }, [external]);

  return (
    <div className="field schema-wide">
      <div className="schema-list-head">
        <label className="field-label" htmlFor={fieldId(path)}>{label}</label>
        {(onRemove === undefined || context.readOnly) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </div>
      <textarea
        aria-invalid={issue !== ''}
        className={(numeric || resolveSchema(schema['items'], context.root)['x-widget'] === 'discord-id') ? 'monospace' : undefined}
        disabled={context.readOnly}
        id={fieldId(path)}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => {
          const next: string = event.currentTarget.value;

          setText(next);
          onChange(parse(next));
        }}
        rows={Math.min(10, Math.max(3, entries.length + 1))}
        spellCheck={false}
        value={text}
      />
      {(issue === '') ? <small>{schema['description'] ?? 'One per line.'}</small> : <FieldError message={issue} />}
    </div>
  );
};

/**
 * Schema Form - Checkbox group.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const CheckboxGroup = ({
  context,
  label,
  onChange,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const items: Web_Schema_Node = resolveSchema(schema['items'], context.root);
  const options: string[] = (items['enum'] ?? []).map((entry: unknown): string => String(entry));
  const selected: string[] = (Array.isArray(value)) ? value.map((entry: unknown): string => String(entry)) : [];
  const issue: string = context.issueAt(path);

  return (
    <fieldset className="scope-fieldset schema-wide">
      <legend>{label}</legend>
      <div className="schema-checks">
        {options.map((option: string): ReactElement => (
          <label aria-label={enumLabel(items, option)} className="check-row" key={option}>
            <input
              checked={selected.includes(option)}
              disabled={context.readOnly}
              onChange={(): void => {
                const next: string[] = (selected.includes(option)) ? selected.filter((entry: string): boolean => entry !== option) : options.filter((entry: string): boolean => entry === option || selected.includes(entry));

                onChange(next);
              }}
              type="checkbox"
            />
            <span>
              <strong>{enumLabel(items, option)}</strong>
            </span>
          </label>
        ))}
      </div>
      {(issue === '') ? <Hint text={schema['description']} /> : <small className="field-error">{issue}</small>}
    </fieldset>
  );
};

/**
 * Schema Form - List field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const ListField = ({
  context,
  label,
  onChange,
  onRemove,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const entries: unknown[] = (Array.isArray(value)) ? value : [];
  const items: Web_Schema_Node = resolveSchema(schema['items'], context.root);
  const itemLabel: string = schema['x-item-label'] ?? ((label === '') ? 'Item' : singular(label));
  const titleKey: string | undefined = schema['x-item-title-key'] ?? ((items['properties'] !== undefined && items['properties']['name'] !== undefined) ? 'name' : undefined);
  const minimum: number = schema['minItems'] ?? 0;
  const maximum: number = schema['maxItems'] ?? Number.POSITIVE_INFINITY;
  const issue: string = context.issueAt(path);

  /**
   * Schema Form - Replace.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const replace = (next: unknown[]): void => onChange(next);

  /**
   * Schema Form - Move.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const move = (index: number, offset: number): void => {
    const next: unknown[] = [...entries];
    const target: number = index + offset;
    const moving: unknown = next[index];

    next[index] = next[target];
    next[target] = moving;
    replace(next);
  };

  return (
    <div className="schema-list schema-wide">
      {(label === '' && onRemove === undefined) ? null : (
        <div className="schema-list-head">
          <span className="field-label">{label}</span>
          <span className="schema-count">{`${entries.length} ${(entries.length === 1) ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`}`}</span>
          {(onRemove === undefined || context.readOnly) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
        </div>
      )}
      {(schema['description'] === undefined) ? null : <p className="form-section-note">{schema['description']}</p>}

      {(entries.length === 0) ? <p className="schema-empty">{`No ${itemLabel.toLowerCase()}s yet.`}</p> : null}

      {entries.map((entry: unknown, index: number): ReactElement => {
        const title: unknown = (titleKey === undefined || !isRecord(entry)) ? undefined : entry[titleKey];

        return (
          <div className="schema-card" key={index}>
            <div className="schema-card-head">
              <strong>{`${itemLabel} ${index + 1}`}</strong>
              {(typeof title === 'string' && title !== '') ? <span className="schema-card-title">{title}</span> : null}
              {(context.readOnly) ? null : (
                <span className="schema-card-actions">
                  <button aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`} className="icon-button" disabled={index === 0} onClick={(): void => move(index, -1)} title="Move up" type="button">
                    <Icon name="arrow-up" size={16} />
                  </button>
                  <button aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`} className="icon-button" disabled={index === entries.length - 1} onClick={(): void => move(index, 1)} title="Move down" type="button">
                    <Icon name="arrow-down" size={16} />
                  </button>
                  <button
                    aria-label={`Copy ${itemLabel.toLowerCase()} ${index + 1}`}
                    className="icon-button"
                    disabled={entries.length >= maximum}
                    onClick={(): void => replace([
                      ...entries.slice(0, index + 1),
                      stripSecrets(clone(entry)),
                      ...entries.slice(index + 1),
                    ])}
                    title="Copy"
                    type="button"
                  >
                    <Icon name="duplicate" size={16} />
                  </button>
                  <button
                    aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                    className="icon-button icon-button-danger"
                    disabled={entries.length <= minimum}
                    onClick={(): void => replace(entries.filter((_entry: unknown, candidate: number): boolean => candidate !== index))}
                    title="Remove"
                    type="button"
                  >
                    <Icon name="remove" size={16} />
                  </button>
                </span>
              )}
            </div>
            <SchemaField
              context={context}
              label=""
              onChange={(nextEntry: unknown): void => replace(entries.map((candidate: unknown, candidateIndex: number): unknown => ((candidateIndex === index) ? nextEntry : candidate)))}
              path={[
                ...path,
                index,
              ]}
              required
              schema={items}
              value={entry}
            />
          </div>
        );
      })}

      <FieldError message={issue} />

      {(context.readOnly) ? null : (
        <div className="schema-add-row">
          <Button
            disabled={entries.length >= maximum}
            icon="add"
            onClick={(): void => replace([
              ...entries,
              defaultValue(items, context.root),
            ])}
          >
            {`Add ${itemLabel.toLowerCase()}`}
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Schema Form - Object fields.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const ObjectFields = ({
  context,
  hiddenKey,
  onChange,
  path,
  schema,
  value,
}: Web_Components_ObjectFields_Props): ReactElement => {
  const required: string[] = schema['required'] ?? [];
  const properties: [string, Web_Schema_Node][] = Object.entries(schema['properties'] ?? {}).filter(([key]: [string, Web_Schema_Node]): boolean => key !== hiddenKey);
  const additions: [string, Web_Schema_Node][] = [];

  /**
   * Schema Form - Set key.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const setKey = (key: string, next: unknown): void => {
    const copy: Record<string, unknown> = { ...value };

    if (next === undefined) {
      delete copy[key];
    } else {
      copy[key] = next;
    }

    onChange(copy);
  };

  const fields: ReactElement[] = [];

  for (const [
    key,
    property,
  ] of properties) {
    const resolved: Web_Schema_Node = resolveSchema(property, context.root);
    const isRequired: boolean = required.includes(key);
    const present: boolean = value[key] !== undefined;
    const label: string = resolved['title'] ?? titleCase(key);

    // Hidden values ride along untouched, since the copy above keeps every key.
    if (isHidden(resolved)) {
      continue;
    }

    if (!present && !isRequired && (isComplex(resolved, context.root) || isSecretSchema(resolved))) {
      additions.push([
        key,
        resolved,
      ]);

      continue;
    }

    fields.push(
      <SchemaField
        context={context}
        key={key}
        label={label}
        onChange={(next: unknown): void => setKey(key, next)}
        onRemove={(isRequired || !(isComplex(resolved, context.root) || isSecretSchema(resolved))) ? undefined : (): void => setKey(key, undefined)}
        path={[
          ...path,
          key,
        ]}
        required={isRequired}
        schema={resolved}
        value={value[key]}
      />,
    );
  }

  return (
    <>
      <div className="schema-fields">{fields}</div>
      {(additions.length === 0 || context.readOnly) ? null : (
        <div className="schema-add-row">
          {additions.map(([
            key,
            property,
          ]: [string, Web_Schema_Node,
          ]): ReactElement => (
            <Button icon="add" key={key} onClick={(): void => setKey(key, defaultValue(property, context.root))} variant="quiet">
              {`Add ${(property['title'] ?? titleCase(key)).toLowerCase()}`}
            </Button>
          ))}
        </div>
      )}
    </>
  );
};

/**
 * Schema Form - Object field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const ObjectField = ({
  context,
  label,
  onChange,
  onRemove,
  path,
  schema,
  value,
}: Web_Components_SchemaField_Props): ReactElement => {
  const record: Record<string, unknown> = (isRecord(value)) ? value : {};
  const issue: string = context.issueAt(path);

  if (label === '') {
    return (
      <div className="schema-group-plain schema-wide">
        <ObjectFields context={context} onChange={onChange} path={path} schema={schema} value={record} />
        <FieldError message={issue} />
      </div>
    );
  }

  return (
    <fieldset className="schema-group schema-wide">
      <legend>
        <span>{label}</span>
        {(onRemove === undefined || context.readOnly) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </legend>
      {(schema['description'] === undefined) ? null : <p className="form-section-note">{schema['description']}</p>}
      <ObjectFields context={context} onChange={onChange} path={path} schema={schema} value={record} />
      <FieldError message={issue} />
    </fieldset>
  );
};

/**
 * Schema Form - Union field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const UnionField = ({
  context,
  label,
  onChange,
  onRemove,
  path,
  schema,
  union,
  value,
}: Web_Components_UnionField_Props): ReactElement => {
  const index: number = unionOptionIndex(union, value);
  const option: Web_Schema_Node = union['options'][index] ?? {};
  const record: Record<string, unknown> = (isRecord(value)) ? value : {};
  const discriminatorSchema: Web_Schema_Node | undefined = (option['properties'] === undefined) ? undefined : option['properties'][union['discriminator']];
  const discriminatorLabel: string = discriminatorSchema?.['title'] ?? titleCase(union['discriminator']);
  const issue: string = context.issueAt(path);

  const body: ReactElement = (
    <>
      <div className="schema-fields">
        <FieldLabel>
          <span>{discriminatorLabel}</span>
          <select
            className="select-control picker-control"
            disabled={context.readOnly}
            id={fieldId([
              ...path,
              union['discriminator'],
            ])}
            onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
              const nextOption: Web_Schema_Node | undefined = union['options'][Number(event.currentTarget.value)];

              if (nextOption !== undefined) {
                onChange(defaultValue(nextOption, context.root));
              }
            }}
            value={String(index)}
          >
            {union['options'].map((candidate: Web_Schema_Node, candidateIndex: number): ReactElement => {
              const constant: unknown = constantOf((candidate['properties'] === undefined) ? undefined : candidate['properties'][union['discriminator']]);

              return (
                <option key={String(constant)} value={String(candidateIndex)}>
                  {candidate['title'] ?? titleCase(String(constant))}
                </option>
              );
            })}
          </select>
        </FieldLabel>
      </div>
      <ObjectFields
        context={context}
        hiddenKey={union['discriminator']}
        onChange={(next: unknown): void => onChange({
          ...((isRecord(next)) ? next : {}),
          [union['discriminator']]: constantOf(discriminatorSchema),
        })}
        path={path}
        schema={option}
        value={record}
      />
      <FieldError message={issue} />
    </>
  );

  if (label === '') {
    return <div className="schema-group-plain schema-wide">{body}</div>;
  }

  return (
    <fieldset className="schema-group schema-wide">
      <legend>
        <span>{label}</span>
        {(onRemove === undefined || context.readOnly) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </legend>
      {(schema['description'] === undefined) ? null : <p className="form-section-note">{schema['description']}</p>}
      {body}
    </fieldset>
  );
};

/**
 * Schema Form - Inline field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const InlineField = ({
  child,
  context,
  label,
  onChange,
  path,
  required,
  schema,
  value,
}: Web_Components_InlineField_Props): ReactElement | null => {
  const [
    childKey,
    childSchema,
  ] = child;
  const record: Record<string, unknown> = (isRecord(value)) ? value : {};
  const childPath: Web_Schema_Path = [
    ...path,
    childKey,
  ];
  let childLabel: string = label;

  if (childLabel === '') {
    if (childSchema['x-widget'] === 'channel') {
      childLabel = 'Channel';
    } else if (childSchema['x-widget'] === 'role') {
      childLabel = 'Role';
    } else {
      childLabel = childSchema['title'] ?? titleCase(childKey);
    }
  }

  return (
    <SchemaField
      context={{
        ...context,
        // A problem with the whole object shows under its one field.
        issueAt: (candidate: Web_Schema_Path): string => context.issueAt(candidate) || ((pathKey(candidate) === pathKey(childPath)) ? context.issueAt(path) : ''),
      }}
      label={childLabel}
      onChange={(next: unknown): void => {
        if ((next === undefined || next === '') && !required) {
          onChange(undefined);

          return;
        }

        onChange({
          ...record,
          [childKey]: next ?? '',
        });
      }}
      path={childPath}
      required={required}
      schema={{
        ...childSchema,
        description: childSchema['description'] ?? schema['description'],
      }}
      value={record[childKey]}
    />
  );
};

/**
 * Schema Form - Schema field.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const SchemaField = (props: Web_Components_SchemaField_Props): ReactElement | null => {
  const {
    context,
    schema,
    value,
  } = props;
  const unwrapped: Web_Schema_Unwrapped = unwrapNullable(resolveSchema(schema, context.root), context.root);
  const resolved: Web_Schema_Node = unwrapped['schema'];

  if (isHidden(resolved)) {
    return null;
  }

  if (isSecretSchema(resolved)) {
    return <SecretField {...props} schema={resolved} />;
  }

  const inline: [string, Web_Schema_Node] | null = inlineChild(resolved, context.root);

  if (inline !== null && (value === undefined || isRecord(value))) {
    return <InlineField {...props} child={inline} schema={resolved} />;
  }

  if (resolved['x-widget'] === 'permission-map' && (value === undefined || isRecord(value))) {
    return <PermissionMapField {...props} schema={resolved} />;
  }

  const union: Web_Schema_Union | null = unionOf(resolved, context.root);

  if (union !== null) {
    return (value === undefined || isRecord(value)) ? <UnionField {...props} schema={resolved} union={union} /> : <JsonField {...props} schema={resolved} />;
  }

  const types: Web_Schema_TypeName[] = schemaTypes(resolved).filter((type: Web_Schema_TypeName): boolean => type !== 'null');

  if (types.length !== 1) {
    return <JsonField {...props} schema={resolved} />;
  }

  const type: Web_Schema_TypeName | undefined = types[0];

  if (type === 'object') {
    if (resolved['properties'] === undefined || (value !== undefined && value !== null && !isRecord(value))) {
      return <JsonField {...props} schema={resolved} />;
    }

    return <ObjectField {...props} schema={resolved} />;
  }

  if (type === 'array') {
    if (value !== undefined && value !== null && !Array.isArray(value)) {
      return <JsonField {...props} schema={resolved} />;
    }

    const items: Web_Schema_Node = unwrapNullable(resolveSchema(resolved['items'], context.root), context.root)['schema'];
    const itemTypes: Web_Schema_TypeName[] = schemaTypes(items);
    const listWidget: Web_Schema_Node['x-widget'] = resolved['x-widget'];

    if (listWidget === 'channel-list' || listWidget === 'role-list' || listWidget === 'discord-id-list') {
      return <IdentifierListField {...props} schema={resolved} />;
    }

    if (items['enum'] !== undefined) {
      return <CheckboxGroup {...props} schema={resolved} />;
    }

    if (isSecretSchema(items) || unionOf(items, context.root) !== null || itemTypes.includes('object') || itemTypes.includes('array')) {
      return <ListField {...props} schema={resolved} />;
    }

    if (itemTypes.length === 1 && (itemTypes[0] === 'string' || itemTypes[0] === 'number' || itemTypes[0] === 'integer')) {
      return <LinesField {...props} itemType={itemTypes[0]} schema={resolved} />;
    }

    return <JsonField {...props} schema={resolved} />;
  }

  if (type === 'string') {
    return <StringField {...props} nullable={unwrapped['nullable']} schema={resolved} />;
  }

  if (type === 'number' || type === 'integer') {
    return <NumberField {...props} nullable={unwrapped['nullable']} schema={resolved} />;
  }

  if (type === 'boolean') {
    return <BooleanField {...props} schema={resolved} />;
  }

  return <JsonField {...props} schema={resolved} />;
};

// sectionsFor orders the top-level keys of an object feature into titled sections.

/**
 * Schema Form - Sections for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const sectionsFor = (schema: Web_Schema_Node, root: Web_Schema_Node): Web_Components_SchemaForm_Layout => {
  const properties: Record<string, Web_Schema_Node> = schema['properties'] ?? {};
  const keys: string[] = Object.keys(properties).filter((key: string): boolean => !isHidden(resolveSchema(properties[key], root)));
  const general: string[] = [];
  const sections: Web_Schema_Section[] = [];
  const ordered: Web_Schema_Section[] = [
    ...(schema['x-sections'] ?? []).filter((section: Web_Schema_Section): boolean => keys.includes(section['key'])),
    ...keys.map((key: string): Web_Schema_Section => ({ key })),
  ];

  // Lists and groups get their own section; plain values without a section note share "General".
  for (const section of ordered) {
    if (general.includes(section['key']) || sections.some((candidate: Web_Schema_Section): boolean => candidate['key'] === section['key'])) {
      continue;
    }

    const described: boolean = section['description'] !== undefined && section['description'] !== '';

    if (described || isComplex(properties[section['key']] ?? {}, root)) {
      sections.push(section);
    } else {
      general.push(section['key']);
    }
  }

  return {
    general,
    sections,
  };
};

/**
 * Schema Form.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const SchemaForm = ({
  context,
  onChange,
  schema,
  value,
}: Web_Components_SchemaForm_Props): ReactElement => {
  const resolved: Web_Schema_Node = resolveSchema(schema, context.root);
  const types: Web_Schema_TypeName[] = schemaTypes(resolved);

  if (!types.includes('object') || resolved['properties'] === undefined || isSecretSchema(resolved) || (value !== undefined && value !== null && !isRecord(value))) {
    return (
      <div className="panel">
        <section className="form-section">
          <SchemaField
            context={context}
            label=""
            onChange={onChange}
            path={[]}
            required
            schema={{
              ...resolved,
              description: undefined,
            }}
            value={value}
          />
        </section>
        <TimeZoneOptions />
      </div>
    );
  }

  const record: Record<string, unknown> = (isRecord(value)) ? value : {};
  const required: string[] = resolved['required'] ?? [];
  const layout: Web_Components_SchemaForm_Layout = sectionsFor(resolved, context.root);

  /**
   * Schema Form - Set key.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const setKey = (key: string, next: unknown): void => {
    const copy: Record<string, unknown> = { ...record };

    if (next === undefined) {
      delete copy[key];
    } else {
      copy[key] = next;
    }

    onChange(copy);
  };

  /**
   * Schema Form - Property of.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const propertyOf = (key: string): Web_Schema_Node => resolveSchema((resolved['properties'] ?? {})[key], context.root);

  return (
    <div className="panel">
      {(layout['general'].length === 0) ? null : (
        <section className="form-section">
          <div className="form-section-head">
            <h2>General</h2>
          </div>
          <div className="schema-fields">
            {layout['general'].map((key: string): ReactElement => (
              <SchemaField
                context={context}
                key={key}
                label={propertyOf(key)['title'] ?? titleCase(key)}
                onChange={(next: unknown): void => setKey(key, next)}
                path={[key]}
                required={required.includes(key)}
                schema={propertyOf(key)}
                value={record[key]}
              />
            ))}
          </div>
        </section>
      )}

      {layout['sections'].map((section: Web_Schema_Section): ReactElement => {
        const property: Web_Schema_Node = propertyOf(section['key']);
        const isRequired: boolean = required.includes(section['key']);
        const present: boolean = record[section['key']] !== undefined;
        const complex: boolean = isComplex(property, context.root);
        const title: string = section['title'] ?? property['title'] ?? titleCase(section['key']);
        const description: string = section['description'] || property['description'] || '';

        return (
          <section className="form-section" key={section['key']}>
            <div className="form-section-head">
              <h2>{title}</h2>
              {(complex && !isRequired && present && !context.readOnly) ? <button className="text-button" onClick={(): void => setKey(section['key'], undefined)} type="button">Remove</button> : null}
            </div>
            {(description === '') ? null : <p className="form-section-note">{description}</p>}
            {(present || isRequired || !complex) ? (
              <SchemaField
                context={context}
                label=""
                onChange={(next: unknown): void => setKey(section['key'], next)}
                path={[section['key']]}
                required={isRequired}
                schema={{
                  ...property,
                  description: undefined,
                }}
                value={record[section['key']]}
              />
            ) : (
              <div className="schema-add-row">
                {(context.readOnly) ? <p className="schema-empty">Not set.</p> : (
                  <Button icon="add" onClick={(): void => setKey(section['key'], defaultValue(property, context.root))} variant="quiet">
                    {`Add ${title.toLowerCase()}`}
                  </Button>
                )}
              </div>
            )}
          </section>
        );
      })}
      <TimeZoneOptions />
    </div>
  );
};
