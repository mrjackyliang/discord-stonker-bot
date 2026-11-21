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

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_Acronyms = Record<string, string>;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_ConstantOf_Schema = Web_Schema_Node | undefined;
export type Web_Schema_ConstantOf_Returns = unknown;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_CountChanges_Left = unknown;
export type Web_Schema_CountChanges_Right = unknown;
export type Web_Schema_CountChanges_Returns = number;
export type Web_Schema_CountChanges_Count = number;
export type Web_Schema_CountChanges_Keys = Set<string>;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_DefaultValue_Input = Web_Schema_Node;
export type Web_Schema_DefaultValue_Root = Web_Schema_Node;
export type Web_Schema_DefaultValue_Returns = unknown;
export type Web_Schema_DefaultValue_Unwrapped = Web_Schema_Unwrapped;
export type Web_Schema_DefaultValue_Schema = Web_Schema_Node;
export type Web_Schema_DefaultValue_Union = Web_Schema_Union | null;
export type Web_Schema_DefaultValue_Type = Web_Schema_TypeName | undefined;
export type Web_Schema_DefaultValue_Result = Record<string, unknown>;
export type Web_Schema_DefaultValue_Required = string[];
export type Web_Schema_DefaultValue_Key = string;
export type Web_Schema_DefaultValue_Property = Web_Schema_Node;
export type Web_Schema_DefaultValue_ResolvedProperty = Web_Schema_Node;
export type Web_Schema_DefaultValue_PropertyValue = unknown;
export type Web_Schema_DefaultValue_Minimum = number;
export type Web_Schema_DefaultValue_Items = Web_Schema_Node;
export type Web_Schema_DefaultValue_ItemTypes = Web_Schema_TypeName[];

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_IsHidden_Schema = Web_Schema_Node | undefined;
export type Web_Schema_IsHidden_Returns = boolean;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_IsRecord_Value = unknown;
export type Web_Schema_IsRecord_TypeGuard = Record<string, unknown>;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_IsSecretSchema_Schema = Web_Schema_Node;
export type Web_Schema_IsSecretSchema_Returns = boolean;
export type Web_Schema_IsSecretSchema_Properties = Record<string, Web_Schema_Node> | undefined;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_PathKey_Path = Web_Schema_Path;
export type Web_Schema_PathKey_Returns = string;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_PointerPath_Pointer = string;
export type Web_Schema_PointerPath_Returns = Web_Schema_Path;
export type Web_Schema_PointerPath_Segments = string[];

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_ResolveSchema_Schema = Web_Schema_Node | undefined;
export type Web_Schema_ResolveSchema_Root = Web_Schema_Node;
export type Web_Schema_ResolveSchema_Returns = Web_Schema_Node;
export type Web_Schema_ResolveSchema_Resolved = Web_Schema_Node;
export type Web_Schema_ResolveSchema_Guard = number;
export type Web_Schema_ResolveSchema_Reference = string;
export type Web_Schema_ResolveSchema_Match = RegExpExecArray | null;
export type Web_Schema_ResolveSchema_Container = Record<string, Web_Schema_Node> | undefined;
export type Web_Schema_ResolveSchema_ContainerKey = '$defs' | 'definitions';
export type Web_Schema_ResolveSchema_Target = Web_Schema_Node | undefined;
export type Web_Schema_ResolveSchema_Rest = Web_Schema_Node;
export type Web_Schema_ResolveSchema_Parts = Web_Schema_Node[];
export type Web_Schema_ResolveSchema_Merged = Web_Schema_Node;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_SameValue_Left = unknown;
export type Web_Schema_SameValue_Right = unknown;
export type Web_Schema_SameValue_Returns = boolean;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_SchemaTypes_Schema = Web_Schema_Node;
export type Web_Schema_SchemaTypes_Returns = Web_Schema_TypeName[];

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_SeparateSecrets_Value = unknown;
export type Web_Schema_SeparateSecrets_Returns = Web_Schema_Separated;
export type Web_Schema_SeparateSecrets_Secrets = Record<string, string>;
export type Web_Schema_SeparateSecrets_Walk_Entry = unknown;
export type Web_Schema_SeparateSecrets_Walk_Path = Web_Schema_Path;
export type Web_Schema_SeparateSecrets_Walk_Returns = unknown;
export type Web_Schema_SeparateSecrets_Walk = (entry: Web_Schema_SeparateSecrets_Walk_Entry, path: Web_Schema_SeparateSecrets_Walk_Path) => Web_Schema_SeparateSecrets_Walk_Returns;
export type Web_Schema_SeparateSecrets_Walk_Draft = unknown;
export type Web_Schema_SeparateSecrets_Walk_Key = string;
export type Web_Schema_SeparateSecrets_Walk_Item = unknown;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_StripSecrets_Value = unknown;
export type Web_Schema_StripSecrets_Returns = unknown;
export type Web_Schema_StripSecrets_Key = string;
export type Web_Schema_StripSecrets_Entry = unknown;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_TitleCase_Key = string;
export type Web_Schema_TitleCase_Returns = string;
export type Web_Schema_TitleCase_Words = string[];
export type Web_Schema_TitleCase_Lower = string;
export type Web_Schema_TitleCase_Acronym = string | undefined;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_ToPointer_Path = Web_Schema_Path;
export type Web_Schema_ToPointer_Returns = string;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_UnionOf_Schema = Web_Schema_Node;
export type Web_Schema_UnionOf_Root = Web_Schema_Node;
export type Web_Schema_UnionOf_Returns = Web_Schema_Union | null;
export type Web_Schema_UnionOf_Options = Web_Schema_Node[] | undefined;
export type Web_Schema_UnionOf_ResolvedOptions = Web_Schema_Node[];
export type Web_Schema_UnionOf_First = Web_Schema_Node | undefined;
export type Web_Schema_UnionOf_FixedEverywhere_Key = string;
export type Web_Schema_UnionOf_FixedEverywhere_Returns = boolean;
export type Web_Schema_UnionOf_FixedEverywhere = (key: Web_Schema_UnionOf_FixedEverywhere_Key) => Web_Schema_UnionOf_FixedEverywhere_Returns;
export type Web_Schema_UnionOf_FixedEverywhere_Property = Web_Schema_Node | undefined;
export type Web_Schema_UnionOf_Marked = string | undefined;
export type Web_Schema_UnionOf_Discriminator = string | undefined;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_UnionOptionIndex_Union = Web_Schema_Union;
export type Web_Schema_UnionOptionIndex_Value = unknown;
export type Web_Schema_UnionOptionIndex_Returns = number;
export type Web_Schema_UnionOptionIndex_Index = number;
export type Web_Schema_UnionOptionIndex_Property = Web_Schema_Node | undefined;

/**
 * Schema.
 *
 * @since 4.2.1
 */
export type Web_Schema_UnwrapNullable_Schema = Web_Schema_Node;
export type Web_Schema_UnwrapNullable_Root = Web_Schema_Node;
export type Web_Schema_UnwrapNullable_Returns = Web_Schema_Unwrapped;
export type Web_Schema_UnwrapNullable_Options = Web_Schema_Node[] | undefined;
export type Web_Schema_UnwrapNullable_ResolvedOptions = Web_Schema_Node[];
export type Web_Schema_UnwrapNullable_NullIndex = number;
export type Web_Schema_UnwrapNullable_Types = Web_Schema_TypeName[];
export type Web_Schema_UnwrapNullable_Inner = Web_Schema_Node;
export type Web_Schema_UnwrapNullable_Rest = Web_Schema_Node;
