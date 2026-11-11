/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_TypeName = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string';

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Widget =
  'channel'
  | 'channel-list'
  | 'discord-id'
  | 'discord-id-list'
  | 'pattern'
  | 'permission-map'
  | 'role'
  | 'role-list'
  | 'secret'
  | 'textarea'
  | 'time-zone'
  | 'url'
  | 'variables';

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Variable = string | {
  description?: string | undefined;
  token: string;
};

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Section = {
  description?: string | undefined;
  key: string;
  title?: string | undefined;
};

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Node = {
  '$defs'?: Record<string, Web_Schema_Node> | undefined;
  '$ref'?: string | undefined;
  'additionalProperties'?: boolean | Web_Schema_Node | undefined;
  'allOf'?: Web_Schema_Node[] | undefined;
  'anyOf'?: Web_Schema_Node[] | undefined;
  'const'?: unknown;
  'default'?: unknown;
  'definitions'?: Record<string, Web_Schema_Node> | undefined;
  'description'?: string | undefined;
  'enum'?: unknown[] | undefined;
  'exclusiveMaximum'?: number | undefined;
  'exclusiveMinimum'?: number | undefined;
  'format'?: string | undefined;
  'items'?: Web_Schema_Node | undefined;
  'maxItems'?: number | undefined;
  'maxLength'?: number | undefined;
  'maximum'?: number | undefined;
  'minItems'?: number | undefined;
  'minLength'?: number | undefined;
  'minimum'?: number | undefined;
  'oneOf'?: Web_Schema_Node[] | undefined;
  'pattern'?: string | undefined;
  'properties'?: Record<string, Web_Schema_Node> | undefined;
  'required'?: string[] | undefined;
  'title'?: string | undefined;
  'type'?: Web_Schema_TypeName | Web_Schema_TypeName[] | undefined;
  'x-discriminator'?: string | undefined;
  'x-enum-labels'?: Record<string, string> | undefined;
  'x-hidden'?: boolean | undefined;
  'x-inline'?: boolean | undefined;
  'x-item-key'?: string | undefined;
  'x-item-label'?: string | undefined;
  'x-item-title-key'?: string | undefined;
  'x-options'?: string[] | undefined;
  'x-sections'?: Web_Schema_Section[] | undefined;
  'x-variables'?: Web_Schema_Variable[] | undefined;
  'x-widget'?: Web_Schema_Widget | undefined;
};

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_PathSegment = number | string;

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Path = Web_Schema_PathSegment[];

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Union = {
  discriminator: string;
  options: Web_Schema_Node[];
};

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Unwrapped = {
  nullable: boolean;
  schema: Web_Schema_Node;
};

/**
 * Schema.
 *
 * @since 4.0.0
 */
export type Web_Schema_Separated = {
  configuration: unknown;
  secrets: Record<string, string>;
};
