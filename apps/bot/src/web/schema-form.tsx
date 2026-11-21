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
  firstCharacterPattern,
  trailingCarriageReturnPattern,
  unsafeIdCharacterPattern,
} from '@/web/regex.js';
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
  Web_SchemaForm_BooleanField_Context,
  Web_SchemaForm_BooleanField_Issue,
  Web_SchemaForm_BooleanField_Label,
  Web_SchemaForm_BooleanField_OnChange,
  Web_SchemaForm_BooleanField_Path,
  Web_SchemaForm_BooleanField_Props,
  Web_SchemaForm_BooleanField_Returns,
  Web_SchemaForm_BooleanField_Schema,
  Web_SchemaForm_BooleanField_Value,
  Web_SchemaForm_CheckboxGroup_Context,
  Web_SchemaForm_CheckboxGroup_Issue,
  Web_SchemaForm_CheckboxGroup_Items,
  Web_SchemaForm_CheckboxGroup_Label,
  Web_SchemaForm_CheckboxGroup_Next,
  Web_SchemaForm_CheckboxGroup_OnChange,
  Web_SchemaForm_CheckboxGroup_Options,
  Web_SchemaForm_CheckboxGroup_Path,
  Web_SchemaForm_CheckboxGroup_Props,
  Web_SchemaForm_CheckboxGroup_Returns,
  Web_SchemaForm_CheckboxGroup_Schema,
  Web_SchemaForm_CheckboxGroup_Selected,
  Web_SchemaForm_CheckboxGroup_Value,
  Web_SchemaForm_EnumLabel_Label,
  Web_SchemaForm_EnumLabel_Labels,
  Web_SchemaForm_EnumLabel_Returns,
  Web_SchemaForm_EnumLabel_Schema,
  Web_SchemaForm_EnumLabel_Value,
  Web_SchemaForm_FieldError_Id,
  Web_SchemaForm_FieldError_Message,
  Web_SchemaForm_FieldError_Props,
  Web_SchemaForm_FieldError_Returns,
  Web_SchemaForm_FieldId_Joined,
  Web_SchemaForm_FieldId_Path,
  Web_SchemaForm_FieldId_Returns,
  Web_SchemaForm_FieldId_Suffix,
  Web_SchemaForm_Hint_Id,
  Web_SchemaForm_Hint_Props,
  Web_SchemaForm_Hint_Returns,
  Web_SchemaForm_Hint_Text,
  Web_SchemaForm_IdentifierListField_ChannelNote,
  Web_SchemaForm_IdentifierListField_Choices,
  Web_SchemaForm_IdentifierListField_Context,
  Web_SchemaForm_IdentifierListField_Entries,
  Web_SchemaForm_IdentifierListField_Identifier,
  Web_SchemaForm_IdentifierListField_Identifiers,
  Web_SchemaForm_IdentifierListField_Issue,
  Web_SchemaForm_IdentifierListField_ItemKey,
  Web_SchemaForm_IdentifierListField_Items,
  Web_SchemaForm_IdentifierListField_Kind,
  Web_SchemaForm_IdentifierListField_Label,
  Web_SchemaForm_IdentifierListField_Maximum,
  Web_SchemaForm_IdentifierListField_NameOf,
  Web_SchemaForm_IdentifierListField_NameOf_Choice,
  Web_SchemaForm_IdentifierListField_NameOf_Identifier,
  Web_SchemaForm_IdentifierListField_NameOf_Returns,
  Web_SchemaForm_IdentifierListField_Next,
  Web_SchemaForm_IdentifierListField_OnChange,
  Web_SchemaForm_IdentifierListField_OnRemove,
  Web_SchemaForm_IdentifierListField_Path,
  Web_SchemaForm_IdentifierListField_Props,
  Web_SchemaForm_IdentifierListField_Remaining,
  Web_SchemaForm_IdentifierListField_Replace,
  Web_SchemaForm_IdentifierListField_Replace_Existing,
  Web_SchemaForm_IdentifierListField_Replace_Next,
  Web_SchemaForm_IdentifierListField_Replace_Returns,
  Web_SchemaForm_IdentifierListField_Returns,
  Web_SchemaForm_IdentifierListField_RoleNote,
  Web_SchemaForm_IdentifierListField_Schema,
  Web_SchemaForm_IdentifierListField_SetText,
  Web_SchemaForm_IdentifierListField_Text,
  Web_SchemaForm_IdentifierListField_TextState,
  Web_SchemaForm_IdentifierListField_Typed,
  Web_SchemaForm_IdentifierListField_Value,
  Web_SchemaForm_IdentifierListField_Widget,
  Web_SchemaForm_InlineChild_Entries,
  Web_SchemaForm_InlineChild_First,
  Web_SchemaForm_InlineChild_Returns,
  Web_SchemaForm_InlineChild_Root,
  Web_SchemaForm_InlineChild_Schema,
  Web_SchemaForm_InlineField_CandidateIssue,
  Web_SchemaForm_InlineField_Child,
  Web_SchemaForm_InlineField_ChildKey,
  Web_SchemaForm_InlineField_ChildLabel,
  Web_SchemaForm_InlineField_ChildPath,
  Web_SchemaForm_InlineField_ChildSchema,
  Web_SchemaForm_InlineField_Context,
  Web_SchemaForm_InlineField_Label,
  Web_SchemaForm_InlineField_OnChange,
  Web_SchemaForm_InlineField_Path,
  Web_SchemaForm_InlineField_Props,
  Web_SchemaForm_InlineField_Record,
  Web_SchemaForm_InlineField_Required,
  Web_SchemaForm_InlineField_Returns,
  Web_SchemaForm_InlineField_Schema,
  Web_SchemaForm_InlineField_Value,
  Web_SchemaForm_IsComplex_Items,
  Web_SchemaForm_IsComplex_Resolved,
  Web_SchemaForm_IsComplex_Returns,
  Web_SchemaForm_IsComplex_Root,
  Web_SchemaForm_IsComplex_Schema,
  Web_SchemaForm_IsComplex_Types,
  Web_SchemaForm_JsonField_Context,
  Web_SchemaForm_JsonField_Issue,
  Web_SchemaForm_JsonField_Label,
  Web_SchemaForm_JsonField_OnChange,
  Web_SchemaForm_JsonField_ParseError,
  Web_SchemaForm_JsonField_ParseErrorState,
  Web_SchemaForm_JsonField_Path,
  Web_SchemaForm_JsonField_Props,
  Web_SchemaForm_JsonField_Returns,
  Web_SchemaForm_JsonField_Schema,
  Web_SchemaForm_JsonField_SetParseError,
  Web_SchemaForm_JsonField_SetText,
  Web_SchemaForm_JsonField_Text,
  Web_SchemaForm_JsonField_TextState,
  Web_SchemaForm_JsonField_Value,
  Web_SchemaForm_LinesField_Context,
  Web_SchemaForm_LinesField_Entries,
  Web_SchemaForm_LinesField_External,
  Web_SchemaForm_LinesField_Issue,
  Web_SchemaForm_LinesField_ItemType,
  Web_SchemaForm_LinesField_Label,
  Web_SchemaForm_LinesField_Next,
  Web_SchemaForm_LinesField_Numeric,
  Web_SchemaForm_LinesField_OnChange,
  Web_SchemaForm_LinesField_OnRemove,
  Web_SchemaForm_LinesField_Parse,
  Web_SchemaForm_LinesField_Parse_Lines,
  Web_SchemaForm_LinesField_Parse_Next,
  Web_SchemaForm_LinesField_Parse_Parsed,
  Web_SchemaForm_LinesField_Parse_Returns,
  Web_SchemaForm_LinesField_Path,
  Web_SchemaForm_LinesField_Props,
  Web_SchemaForm_LinesField_Returns,
  Web_SchemaForm_LinesField_Schema,
  Web_SchemaForm_LinesField_SetText,
  Web_SchemaForm_LinesField_Text,
  Web_SchemaForm_LinesField_TextState,
  Web_SchemaForm_LinesField_Value,
  Web_SchemaForm_ListField_Context,
  Web_SchemaForm_ListField_CountLabel,
  Web_SchemaForm_ListField_Entries,
  Web_SchemaForm_ListField_Issue,
  Web_SchemaForm_ListField_ItemLabel,
  Web_SchemaForm_ListField_Items,
  Web_SchemaForm_ListField_Label,
  Web_SchemaForm_ListField_Maximum,
  Web_SchemaForm_ListField_Minimum,
  Web_SchemaForm_ListField_Move,
  Web_SchemaForm_ListField_Move_Index,
  Web_SchemaForm_ListField_Move_Moving,
  Web_SchemaForm_ListField_Move_Next,
  Web_SchemaForm_ListField_Move_Offset,
  Web_SchemaForm_ListField_Move_Returns,
  Web_SchemaForm_ListField_Move_Target,
  Web_SchemaForm_ListField_OnChange,
  Web_SchemaForm_ListField_OnRemove,
  Web_SchemaForm_ListField_Path,
  Web_SchemaForm_ListField_Props,
  Web_SchemaForm_ListField_Replace,
  Web_SchemaForm_ListField_Replace_Next,
  Web_SchemaForm_ListField_Replace_Returns,
  Web_SchemaForm_ListField_Returns,
  Web_SchemaForm_ListField_Schema,
  Web_SchemaForm_ListField_Title,
  Web_SchemaForm_ListField_TitleKey,
  Web_SchemaForm_ListField_Value,
  Web_SchemaForm_NumberField_Context,
  Web_SchemaForm_NumberField_External,
  Web_SchemaForm_NumberField_Integer,
  Web_SchemaForm_NumberField_Issue,
  Web_SchemaForm_NumberField_Label,
  Web_SchemaForm_NumberField_Limits,
  Web_SchemaForm_NumberField_LimitsHint,
  Web_SchemaForm_NumberField_Next,
  Web_SchemaForm_NumberField_Nullable,
  Web_SchemaForm_NumberField_OnChange,
  Web_SchemaForm_NumberField_Parsed,
  Web_SchemaForm_NumberField_Path,
  Web_SchemaForm_NumberField_Props,
  Web_SchemaForm_NumberField_Returns,
  Web_SchemaForm_NumberField_Schema,
  Web_SchemaForm_NumberField_SetText,
  Web_SchemaForm_NumberField_Text,
  Web_SchemaForm_NumberField_TextState,
  Web_SchemaForm_NumberField_Value,
  Web_SchemaForm_ObjectField_Context,
  Web_SchemaForm_ObjectField_Issue,
  Web_SchemaForm_ObjectField_Label,
  Web_SchemaForm_ObjectField_OnChange,
  Web_SchemaForm_ObjectField_OnRemove,
  Web_SchemaForm_ObjectField_Path,
  Web_SchemaForm_ObjectField_Props,
  Web_SchemaForm_ObjectField_Record,
  Web_SchemaForm_ObjectField_Returns,
  Web_SchemaForm_ObjectField_Schema,
  Web_SchemaForm_ObjectField_Value,
  Web_SchemaForm_ObjectFields_AdditionKey,
  Web_SchemaForm_ObjectFields_AdditionProperty,
  Web_SchemaForm_ObjectFields_Additions,
  Web_SchemaForm_ObjectFields_Context,
  Web_SchemaForm_ObjectFields_Fields,
  Web_SchemaForm_ObjectFields_HiddenKey,
  Web_SchemaForm_ObjectFields_IsRequired,
  Web_SchemaForm_ObjectFields_Key,
  Web_SchemaForm_ObjectFields_Label,
  Web_SchemaForm_ObjectFields_OnChange,
  Web_SchemaForm_ObjectFields_Path,
  Web_SchemaForm_ObjectFields_Present,
  Web_SchemaForm_ObjectFields_Properties,
  Web_SchemaForm_ObjectFields_Property,
  Web_SchemaForm_ObjectFields_Props,
  Web_SchemaForm_ObjectFields_Required,
  Web_SchemaForm_ObjectFields_Resolved,
  Web_SchemaForm_ObjectFields_Returns,
  Web_SchemaForm_ObjectFields_Schema,
  Web_SchemaForm_ObjectFields_SetKey,
  Web_SchemaForm_ObjectFields_SetKey_Copy,
  Web_SchemaForm_ObjectFields_SetKey_Key,
  Web_SchemaForm_ObjectFields_SetKey_Next,
  Web_SchemaForm_ObjectFields_SetKey_Returns,
  Web_SchemaForm_ObjectFields_Value,
  Web_SchemaForm_PermissionMapField_Context,
  Web_SchemaForm_PermissionMapField_Issue,
  Web_SchemaForm_PermissionMapField_Label,
  Web_SchemaForm_PermissionMapField_Names,
  Web_SchemaForm_PermissionMapField_Next,
  Web_SchemaForm_PermissionMapField_OnChange,
  Web_SchemaForm_PermissionMapField_Options,
  Web_SchemaForm_PermissionMapField_Path,
  Web_SchemaForm_PermissionMapField_Props,
  Web_SchemaForm_PermissionMapField_Record,
  Web_SchemaForm_PermissionMapField_Returns,
  Web_SchemaForm_PermissionMapField_Schema,
  Web_SchemaForm_PermissionMapField_SetPermission,
  Web_SchemaForm_PermissionMapField_SetPermission_Allowed,
  Web_SchemaForm_PermissionMapField_SetPermission_Name,
  Web_SchemaForm_PermissionMapField_SetPermission_Next,
  Web_SchemaForm_PermissionMapField_SetPermission_Returns,
  Web_SchemaForm_PermissionMapField_Value,
  Web_SchemaForm_PickerField_ChannelNote,
  Web_SchemaForm_PickerField_Channels,
  Web_SchemaForm_PickerField_Context,
  Web_SchemaForm_PickerField_Current,
  Web_SchemaForm_PickerField_Issue,
  Web_SchemaForm_PickerField_Kind,
  Web_SchemaForm_PickerField_Known,
  Web_SchemaForm_PickerField_Label,
  Web_SchemaForm_PickerField_Next,
  Web_SchemaForm_PickerField_OnChange,
  Web_SchemaForm_PickerField_Path,
  Web_SchemaForm_PickerField_Props,
  Web_SchemaForm_PickerField_Required,
  Web_SchemaForm_PickerField_Returns,
  Web_SchemaForm_PickerField_RoleNote,
  Web_SchemaForm_PickerField_Roles,
  Web_SchemaForm_PickerField_Schema,
  Web_SchemaForm_PickerField_Value,
  Web_SchemaForm_SchemaField_Context,
  Web_SchemaForm_SchemaField_Inline,
  Web_SchemaForm_SchemaField_Items,
  Web_SchemaForm_SchemaField_ItemTypes,
  Web_SchemaForm_SchemaField_ListWidget,
  Web_SchemaForm_SchemaField_Props,
  Web_SchemaForm_SchemaField_Resolved,
  Web_SchemaForm_SchemaField_Returns,
  Web_SchemaForm_SchemaField_Schema,
  Web_SchemaForm_SchemaField_Type,
  Web_SchemaForm_SchemaField_Types,
  Web_SchemaForm_SchemaField_Union,
  Web_SchemaForm_SchemaField_Unwrapped,
  Web_SchemaForm_SchemaField_Value,
  Web_SchemaForm_SchemaForm_Complex,
  Web_SchemaForm_SchemaForm_Context,
  Web_SchemaForm_SchemaForm_Description,
  Web_SchemaForm_SchemaForm_IsRequired,
  Web_SchemaForm_SchemaForm_Layout,
  Web_SchemaForm_SchemaForm_OnChange,
  Web_SchemaForm_SchemaForm_Present,
  Web_SchemaForm_SchemaForm_Property,
  Web_SchemaForm_SchemaForm_PropertyDescription,
  Web_SchemaForm_SchemaForm_PropertyOf,
  Web_SchemaForm_SchemaForm_PropertyOf_Key,
  Web_SchemaForm_SchemaForm_PropertyOf_Returns,
  Web_SchemaForm_SchemaForm_Props,
  Web_SchemaForm_SchemaForm_Record,
  Web_SchemaForm_SchemaForm_Required,
  Web_SchemaForm_SchemaForm_Resolved,
  Web_SchemaForm_SchemaForm_Returns,
  Web_SchemaForm_SchemaForm_Schema,
  Web_SchemaForm_SchemaForm_SectionDescription,
  Web_SchemaForm_SchemaForm_SetKey,
  Web_SchemaForm_SchemaForm_SetKey_Copy,
  Web_SchemaForm_SchemaForm_SetKey_Key,
  Web_SchemaForm_SchemaForm_SetKey_Next,
  Web_SchemaForm_SchemaForm_SetKey_Returns,
  Web_SchemaForm_SchemaForm_ShowField,
  Web_SchemaForm_SchemaForm_Title,
  Web_SchemaForm_SchemaForm_Types,
  Web_SchemaForm_SchemaForm_Value,
  Web_SchemaForm_SecretField_Context,
  Web_SchemaForm_SecretField_Draft,
  Web_SchemaForm_SecretField_Issue,
  Web_SchemaForm_SecretField_Key,
  Web_SchemaForm_SecretField_Label,
  Web_SchemaForm_SecretField_Next,
  Web_SchemaForm_SecretField_OnChange,
  Web_SchemaForm_SecretField_Path,
  Web_SchemaForm_SecretField_PathIssue,
  Web_SchemaForm_SecretField_Props,
  Web_SchemaForm_SecretField_Record,
  Web_SchemaForm_SecretField_Replacing,
  Web_SchemaForm_SecretField_ReplacingState,
  Web_SchemaForm_SecretField_Returns,
  Web_SchemaForm_SecretField_Saved,
  Web_SchemaForm_SecretField_Schema,
  Web_SchemaForm_SecretField_SetReplacing,
  Web_SchemaForm_SecretField_Value,
  Web_SchemaForm_SectionsFor_Described,
  Web_SchemaForm_SectionsFor_General,
  Web_SchemaForm_SectionsFor_Keys,
  Web_SchemaForm_SectionsFor_Ordered,
  Web_SchemaForm_SectionsFor_Properties,
  Web_SchemaForm_SectionsFor_Returns,
  Web_SchemaForm_SectionsFor_Root,
  Web_SchemaForm_SectionsFor_Schema,
  Web_SchemaForm_SectionsFor_Sections,
  Web_SchemaForm_Singular_Label,
  Web_SchemaForm_Singular_Returns,
  Web_SchemaForm_StringField_Context,
  Web_SchemaForm_StringField_Current,
  Web_SchemaForm_StringField_InputMode,
  Web_SchemaForm_StringField_InputType,
  Web_SchemaForm_StringField_Insert,
  Web_SchemaForm_StringField_Insert_Element,
  Web_SchemaForm_StringField_Insert_End,
  Web_SchemaForm_StringField_Insert_Next,
  Web_SchemaForm_StringField_Insert_Returns,
  Web_SchemaForm_StringField_Insert_Start,
  Web_SchemaForm_StringField_Insert_Token,
  Web_SchemaForm_StringField_Issue,
  Web_SchemaForm_StringField_Label,
  Web_SchemaForm_StringField_Nullable,
  Web_SchemaForm_StringField_OnChange,
  Web_SchemaForm_StringField_Options,
  Web_SchemaForm_StringField_Path,
  Web_SchemaForm_StringField_Placeholder,
  Web_SchemaForm_StringField_Props,
  Web_SchemaForm_StringField_Required,
  Web_SchemaForm_StringField_Returns,
  Web_SchemaForm_StringField_Schema,
  Web_SchemaForm_StringField_TextareaRef,
  Web_SchemaForm_StringField_Update,
  Web_SchemaForm_StringField_Update_Next,
  Web_SchemaForm_StringField_Update_Returns,
  Web_SchemaForm_StringField_Value,
  Web_SchemaForm_StringField_Variables,
  Web_SchemaForm_StringField_Widget,
  Web_SchemaForm_TimeZoneOptions_Returns,
  Web_SchemaForm_TimeZones_Returns,
  Web_SchemaForm_UnionField_Body,
  Web_SchemaForm_UnionField_Constant,
  Web_SchemaForm_UnionField_Context,
  Web_SchemaForm_UnionField_DiscriminatorLabel,
  Web_SchemaForm_UnionField_DiscriminatorSchema,
  Web_SchemaForm_UnionField_DiscriminatorTitle,
  Web_SchemaForm_UnionField_Index,
  Web_SchemaForm_UnionField_Issue,
  Web_SchemaForm_UnionField_Label,
  Web_SchemaForm_UnionField_NextOption,
  Web_SchemaForm_UnionField_OnChange,
  Web_SchemaForm_UnionField_OnRemove,
  Web_SchemaForm_UnionField_Option,
  Web_SchemaForm_UnionField_Path,
  Web_SchemaForm_UnionField_Props,
  Web_SchemaForm_UnionField_Record,
  Web_SchemaForm_UnionField_Returns,
  Web_SchemaForm_UnionField_Schema,
  Web_SchemaForm_UnionField_Union,
  Web_SchemaForm_UnionField_Value,
  Web_SchemaForm_VariableButtons_Description,
  Web_SchemaForm_VariableButtons_OnInsert,
  Web_SchemaForm_VariableButtons_Props,
  Web_SchemaForm_VariableButtons_Returns,
  Web_SchemaForm_VariableButtons_Token,
  Web_SchemaForm_VariableButtons_Variables,
} from '@/types/web/schema-form.d.ts';

// fieldId builds a stable element id from a path so labels and errors stay linked.

/**
 * Schema Form - Field ID.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_FieldId_Path} path - Path.
 *
 * @returns {Web_SchemaForm_FieldId_Returns}
 *
 * @since 4.0.0
 */
const fieldId = (path: Web_SchemaForm_FieldId_Path): Web_SchemaForm_FieldId_Returns => {
  const joined: Web_SchemaForm_FieldId_Joined = path.map((segment) => String(segment).replace(new RegExp(unsafeIdCharacterPattern, 'gu'), '_')).join('-');
  const suffix: Web_SchemaForm_FieldId_Suffix = (joined !== '') ? joined : 'root';

  return `field-${suffix}`;
};

// inlineChild returns the one picker inside an object the editor marked inline, such as { "channel-id": … }.

/**
 * Schema Form - Inline Child.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_InlineChild_Schema} schema - Schema.
 * @param {Web_SchemaForm_InlineChild_Root}   root   - Root.
 *
 * @returns {Web_SchemaForm_InlineChild_Returns}
 *
 * @since 4.0.0
 */
const inlineChild = (schema: Web_SchemaForm_InlineChild_Schema, root: Web_SchemaForm_InlineChild_Root): Web_SchemaForm_InlineChild_Returns => {
  if (schema['x-inline'] !== true || schema['properties'] === undefined) {
    return null;
  }

  const entries: Web_SchemaForm_InlineChild_Entries = Object.entries(schema['properties']);
  const first: Web_SchemaForm_InlineChild_First = entries[0];

  return (entries.length === 1 && first !== undefined) ? [
    first[0],
    resolveSchema(first[1], root),
  ] : null;
};

// enumLabel names one fixed choice with the editor's wording when it has some.

/**
 * Schema Form - Enum Label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_EnumLabel_Schema} schema - Schema.
 * @param {Web_SchemaForm_EnumLabel_Value}  value  - Value.
 *
 * @returns {Web_SchemaForm_EnumLabel_Returns}
 *
 * @since 4.0.0
 */
const enumLabel = (schema: Web_SchemaForm_EnumLabel_Schema, value: Web_SchemaForm_EnumLabel_Value): Web_SchemaForm_EnumLabel_Returns => {
  const labels: Web_SchemaForm_EnumLabel_Labels = schema['x-enum-labels'];
  const label: Web_SchemaForm_EnumLabel_Label = (labels === undefined) ? undefined : labels[value];

  return label ?? titleCase(value);
};

// isComplex says whether a node needs its own group instead of one input.

/**
 * Schema Form - Is Complex.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_IsComplex_Schema} schema - Schema.
 * @param {Web_SchemaForm_IsComplex_Root}   root   - Root.
 *
 * @returns {Web_SchemaForm_IsComplex_Returns}
 *
 * @since 4.0.0
 */
const isComplex = (schema: Web_SchemaForm_IsComplex_Schema, root: Web_SchemaForm_IsComplex_Root): Web_SchemaForm_IsComplex_Returns => {
  const resolved: Web_SchemaForm_IsComplex_Resolved = unwrapNullable(resolveSchema(schema, root), root)['schema'];

  if (isSecretSchema(resolved) === true || inlineChild(resolved, root) !== null) {
    return false;
  }

  if (unionOf(resolved, root) !== null) {
    return true;
  }

  const types: Web_SchemaForm_IsComplex_Types = schemaTypes(resolved);

  if (types.includes('object') === true) {
    return true;
  }

  if (types.includes('array') === true) {
    const items: Web_SchemaForm_IsComplex_Items = resolveSchema(resolved['items'], root);

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
 * @param {Web_SchemaForm_Singular_Label} label - Label.
 *
 * @returns {Web_SchemaForm_Singular_Returns}
 *
 * @since 4.0.0
 */
const singular = (label: Web_SchemaForm_Singular_Label): Web_SchemaForm_Singular_Returns => {
  if (label.endsWith('ies') === true) {
    return `${label.slice(0, -3)}y`;
  }

  if (label.endsWith('ses') === true || label.endsWith('xes') === true) {
    return label.slice(0, -2);
  }

  return (label.endsWith('s') === true && label.endsWith('ss') === false) ? label.slice(0, -1) : label;
};

/**
 * Schema Form - Field Error.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_FieldError_Props} props - Props.
 *
 * @returns {Web_SchemaForm_FieldError_Returns}
 *
 * @since 4.0.0
 */
const FieldError = (props: Web_SchemaForm_FieldError_Props): Web_SchemaForm_FieldError_Returns => {
  const id: Web_SchemaForm_FieldError_Id = props['id'];
  const message: Web_SchemaForm_FieldError_Message = props['message'];

  return (message === '') ? null : <small className="field-error" id={id}>{message}</small>;
};

/**
 * Schema Form - Hint.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_Hint_Props} props - Props.
 *
 * @returns {Web_SchemaForm_Hint_Returns}
 *
 * @since 4.0.0
 */
const Hint = (props: Web_SchemaForm_Hint_Props): Web_SchemaForm_Hint_Returns => {
  const id: Web_SchemaForm_Hint_Id = props['id'];
  const text: Web_SchemaForm_Hint_Text = props['text'];

  return (text === undefined || text === '') ? null : <small id={id}>{text}</small>;
};

/**
 * Schema Form - JSON Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_JsonField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_JsonField_Returns}
 *
 * @since 4.0.0
 */
const JsonField = (props: Web_SchemaForm_JsonField_Props): Web_SchemaForm_JsonField_Returns => {
  const context: Web_SchemaForm_JsonField_Context = props['context'];
  const label: Web_SchemaForm_JsonField_Label = props['label'];
  const onChange: Web_SchemaForm_JsonField_OnChange = props['onChange'];
  const path: Web_SchemaForm_JsonField_Path = props['path'];
  const schema: Web_SchemaForm_JsonField_Schema = props['schema'];
  const value: Web_SchemaForm_JsonField_Value = props['value'];
  const textState: Web_SchemaForm_JsonField_TextState = useState<Web_SchemaForm_JsonField_Text>((value === undefined) ? '' : JSON.stringify(value, null, 2));
  const text: Web_SchemaForm_JsonField_Text = textState[0];
  const setText: Web_SchemaForm_JsonField_SetText = textState[1];
  const parseErrorState: Web_SchemaForm_JsonField_ParseErrorState = useState<Web_SchemaForm_JsonField_ParseError>('');
  const parseError: Web_SchemaForm_JsonField_ParseError = parseErrorState[0];
  const setParseError: Web_SchemaForm_JsonField_SetParseError = parseErrorState[1];

  useEffect(() => {
    setText((value === undefined) ? '' : JSON.stringify(value, null, 2));

    return;
  }, [JSON.stringify(value)]);

  const issue: Web_SchemaForm_JsonField_Issue = context.issueAt(path);

  return (
    <FieldLabel className="field schema-wide">
      <span>{label}</span>
      <textarea
        aria-invalid={issue !== '' || parseError !== ''}
        className="monospace schema-json"
        disabled={context['readOnly']}
        id={fieldId(path)}
        onBlur={() => {
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

          return;
        }}
        onChange={(event) => setText(event.currentTarget.value)}
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
 * Schema Form - Variable Buttons.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_VariableButtons_Props} props - Props.
 *
 * @returns {Web_SchemaForm_VariableButtons_Returns}
 *
 * @since 4.0.0
 */
const VariableButtons = (props: Web_SchemaForm_VariableButtons_Props): Web_SchemaForm_VariableButtons_Returns => {
  const onInsert: Web_SchemaForm_VariableButtons_OnInsert = props['onInsert'];
  const variables: Web_SchemaForm_VariableButtons_Variables = props['variables'];

  return (
    <div aria-label="Insert a variable" className="variable-bar" role="group">
      {variables.map((variable) => {
        const token: Web_SchemaForm_VariableButtons_Token = (typeof variable === 'string') ? variable : variable['token'];
        const description: Web_SchemaForm_VariableButtons_Description = (typeof variable === 'string') ? undefined : variable['description'];

        return (
          <button
            className="variable-chip"
            key={token}
            onClick={() => onInsert(token)}
            title={description}
            type="button"
          >
            {token}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Schema Form - Picker Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_PickerField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_PickerField_Returns}
 *
 * @since 4.0.0
 */
const PickerField = (props: Web_SchemaForm_PickerField_Props): Web_SchemaForm_PickerField_Returns => {
  const context: Web_SchemaForm_PickerField_Context = props['context'];
  const kind: Web_SchemaForm_PickerField_Kind = props['kind'];
  const label: Web_SchemaForm_PickerField_Label = props['label'];
  const onChange: Web_SchemaForm_PickerField_OnChange = props['onChange'];
  const path: Web_SchemaForm_PickerField_Path = props['path'];
  const required: Web_SchemaForm_PickerField_Required = props['required'];
  const schema: Web_SchemaForm_PickerField_Schema = props['schema'];
  const value: Web_SchemaForm_PickerField_Value = props['value'];
  const current: Web_SchemaForm_PickerField_Current = (typeof value === 'string') ? value : '';
  const issue: Web_SchemaForm_PickerField_Issue = context.issueAt(path);
  const channels: Web_SchemaForm_PickerField_Channels = [...context['resources']['channels']].sort((left, right) => left['name'].localeCompare(right['name']));
  const roles: Web_SchemaForm_PickerField_Roles = [...context['resources']['roles']].sort((left, right) => (right['position'] ?? 0) - (left['position'] ?? 0));
  const known: Web_SchemaForm_PickerField_Known = current === '' || ((kind === 'channel') ? channels.some((channel) => channel['id'] === current) : roles.some((role) => role['id'] === current));

  return (
    <FieldLabel>
      <span>{label}</span>
      <select
        aria-invalid={issue !== ''}
        className="select-control picker-control"
        disabled={context['readOnly']}
        id={fieldId(path)}
        onChange={(event) => {
          const next: Web_SchemaForm_PickerField_Next = event.currentTarget.value;

          onChange((next === '' && required === false) ? undefined : next);

          return;
        }}
        value={current}
      >
        <option className="select-placeholder" value="">— Select one —</option>
        {(known === true) ? null : <option value={current}>{`Unknown ${kind} (${current})`}</option>}
        {(kind === 'channel') ? channels.map((channel) => {
          const channelNote: Web_SchemaForm_PickerField_ChannelNote = (channel['available'] === true) ? '' : ' (deleted)';

          return (
            <option key={channel['id']} value={channel['id']}>{`#${channel['name']}${channelNote}`}</option>
          );
        }) : roles.map((role) => {
          const roleNote: Web_SchemaForm_PickerField_RoleNote = (role['available'] === true) ? '' : ' (deleted)';

          return (
            <option key={role['id']} value={role['id']}>{`@${role['name']}${roleNote}`}</option>
          );
        })}
      </select>
      {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
    </FieldLabel>
  );
};

/**
 * Schema Form - String Field.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_StringField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_StringField_Returns}
 *
 * @since 4.0.0
 */
const StringField = (props: Web_SchemaForm_StringField_Props): Web_SchemaForm_StringField_Returns => {
  const context: Web_SchemaForm_StringField_Context = props['context'];
  const label: Web_SchemaForm_StringField_Label = props['label'];
  const nullable: Web_SchemaForm_StringField_Nullable = props['nullable'];
  const onChange: Web_SchemaForm_StringField_OnChange = props['onChange'];
  const path: Web_SchemaForm_StringField_Path = props['path'];
  const required: Web_SchemaForm_StringField_Required = props['required'];
  const schema: Web_SchemaForm_StringField_Schema = props['schema'];
  const value: Web_SchemaForm_StringField_Value = props['value'];
  const textareaRef: Web_SchemaForm_StringField_TextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const widget: Web_SchemaForm_StringField_Widget = schema['x-widget'];
  const issue: Web_SchemaForm_StringField_Issue = context.issueAt(path);
  let current: Web_SchemaForm_StringField_Current = '';

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
   * @param {Web_SchemaForm_StringField_Update_Next} next - Next.
   *
   * @returns {Web_SchemaForm_StringField_Update_Returns}
   *
   * @since 4.0.0
   */
  const update: Web_SchemaForm_StringField_Update = (next: Web_SchemaForm_StringField_Update_Next): Web_SchemaForm_StringField_Update_Returns => {
    if (next === '') {
      if (nullable === true) {
        onChange(null);

        return;
      }

      onChange((required === true) ? '' : undefined);

      return;
    }

    onChange(next);

    return;
  };

  if (schema['enum'] !== undefined) {
    const options: Web_SchemaForm_StringField_Options = schema['enum'].map((entry) => String(entry));

    return (
      <FieldLabel>
        <span>{label}</span>
        <select
          aria-invalid={issue !== ''}
          className="select-control picker-control"
          disabled={context['readOnly']}
          id={fieldId(path)}
          onChange={(event) => update(event.currentTarget.value)}
          value={current}
        >
          <option className="select-placeholder" value="">— Select one —</option>
          {(current !== '' && options.includes(current) === false) ? <option value={current}>{`${current} (not a listed choice)`}</option> : null}
          {options.map((option) => <option key={option} value={option}>{enumLabel(schema, option)}</option>)}
        </select>
        {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
      </FieldLabel>
    );
  }

  const variables: Web_SchemaForm_StringField_Variables = schema['x-variables'] ?? [];

  // Long text and message text (the fields with variables) get a multi-line box.
  if (widget === 'textarea' || widget === 'variables') {
    /**
     * Schema Form - Insert.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @param {Web_SchemaForm_StringField_Insert_Token} token - Token.
     *
     * @returns {Web_SchemaForm_StringField_Insert_Returns}
     *
     * @since 4.0.0
     */
    const insert: Web_SchemaForm_StringField_Insert = (token: Web_SchemaForm_StringField_Insert_Token): Web_SchemaForm_StringField_Insert_Returns => {
      const element: Web_SchemaForm_StringField_Insert_Element = textareaRef.current;
      const start: Web_SchemaForm_StringField_Insert_Start = (element === null) ? current.length : element.selectionStart;
      const end: Web_SchemaForm_StringField_Insert_End = (element === null) ? current.length : element.selectionEnd;
      const next: Web_SchemaForm_StringField_Insert_Next = `${current.slice(0, start)}${token}${current.slice(end)}`;

      update(next);

      window.requestAnimationFrame(() => {
        if (element !== null) {
          element.focus();

          element.setSelectionRange(start + token.length, start + token.length);
        }

        return;
      });

      return;
    };

    return (
      <div className="field schema-wide">
        <label htmlFor={fieldId(path)}>{label}</label>
        <textarea
          aria-invalid={issue !== ''}
          disabled={context['readOnly']}
          id={fieldId(path)}
          maxLength={schema['maxLength']}
          onChange={(event) => update(event.currentTarget.value)}
          ref={textareaRef}
          rows={Math.min(10, Math.max(3, current.split('\n').length + 1))}
          value={current}
        />
        {(variables.length === 0 || context['readOnly'] === true) ? null : <VariableButtons onInsert={insert} variables={variables} />}
        {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
      </div>
    );
  }

  let inputType: Web_SchemaForm_StringField_InputType = 'text';
  let inputMode: Web_SchemaForm_StringField_InputMode = 'text';
  let placeholder: Web_SchemaForm_StringField_Placeholder = undefined;

  if (
    widget === 'url'
    || schema['format'] === 'uri'
    || schema['format'] === 'url'
  ) {
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
        disabled={context['readOnly']}
        id={fieldId(path)}
        inputMode={inputMode}
        list={(widget === 'time-zone') ? 'schema-time-zones' : undefined}
        maxLength={schema['maxLength']}
        onChange={(event) => update(event.currentTarget.value)}
        placeholder={placeholder}
        spellCheck={(
          widget !== 'pattern'
          && widget !== 'discord-id'
          && widget !== 'url'
          && widget !== 'time-zone'
        )}
        type={inputType}
        value={current}
      />
      {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
    </FieldLabel>
  );
};

// timeZones lists the IANA time zones the browser knows, for the time zone suggestions.

/**
 * Schema Form - Time Zones.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_SchemaForm_TimeZones_Returns}
 *
 * @since 4.0.0
 */
const timeZones = (): Web_SchemaForm_TimeZones_Returns => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return [];
  }
};

// TimeZoneOptions renders the suggestions every time zone field shares.

/**
 * Schema Form - Time Zone Options.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_SchemaForm_TimeZoneOptions_Returns}
 *
 * @since 4.0.0
 */
const TimeZoneOptions = (): Web_SchemaForm_TimeZoneOptions_Returns => (
  <datalist id="schema-time-zones">
    {timeZones().map((zone) => <option key={zone} value={zone} />)}
  </datalist>
);

/**
 * Schema Form - Identifier List Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_IdentifierListField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_IdentifierListField_Returns}
 *
 * @since 4.0.0
 */
const IdentifierListField = (props: Web_SchemaForm_IdentifierListField_Props): Web_SchemaForm_IdentifierListField_Returns => {
  const context: Web_SchemaForm_IdentifierListField_Context = props['context'];
  const label: Web_SchemaForm_IdentifierListField_Label = props['label'];
  const onChange: Web_SchemaForm_IdentifierListField_OnChange = props['onChange'];
  const onRemove: Web_SchemaForm_IdentifierListField_OnRemove = props['onRemove'];
  const path: Web_SchemaForm_IdentifierListField_Path = props['path'];
  const schema: Web_SchemaForm_IdentifierListField_Schema = props['schema'];
  const value: Web_SchemaForm_IdentifierListField_Value = props['value'];
  const widget: Web_SchemaForm_IdentifierListField_Widget = schema['x-widget'];
  const items: Web_SchemaForm_IdentifierListField_Items = resolveSchema(schema['items'], context['root']);
  const itemKey: Web_SchemaForm_IdentifierListField_ItemKey = (
    schema['x-item-key']
    ?? Object.keys(items['properties'] ?? {})[0]
    ?? 'id'
  );
  const entries: Web_SchemaForm_IdentifierListField_Entries = (Array.isArray(value) === true) ? value : [];
  const identifiers: Web_SchemaForm_IdentifierListField_Identifiers = entries.map((entry) => {
    const identifier: Web_SchemaForm_IdentifierListField_Identifier = (isRecord(entry) === true) ? entry[itemKey] : entry;

    return (typeof identifier === 'string') ? identifier : '';
  });
  const issue: Web_SchemaForm_IdentifierListField_Issue = context.issueAt(path);
  const textState: Web_SchemaForm_IdentifierListField_TextState = useState<Web_SchemaForm_IdentifierListField_Text>(identifiers.join('\n'));
  const text: Web_SchemaForm_IdentifierListField_Text = textState[0];
  const setText: Web_SchemaForm_IdentifierListField_SetText = textState[1];
  const maximum: Web_SchemaForm_IdentifierListField_Maximum = schema['maxItems'] ?? Number.POSITIVE_INFINITY;

  useEffect(() => {
    const typed: Web_SchemaForm_IdentifierListField_Typed = text.split('\n').map((line) => line.trim()).filter((line) => line !== '');

    if (typed.join('\n') !== identifiers.join('\n')) {
      setText(identifiers.join('\n'));
    }

    return;
  }, [identifiers.join('\n')]);

  // Each row keeps any other keys it had, so only the chosen ID changes.

  /**
   * Schema Form - Replace.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_IdentifierListField_Replace_Next} next - Next.
   *
   * @returns {Web_SchemaForm_IdentifierListField_Replace_Returns}
   *
   * @since 4.0.0
   */
  const replace: Web_SchemaForm_IdentifierListField_Replace = (next: Web_SchemaForm_IdentifierListField_Replace_Next): Web_SchemaForm_IdentifierListField_Replace_Returns => onChange(next.map((identifier) => {
    const existing: Web_SchemaForm_IdentifierListField_Replace_Existing = entries[identifiers.indexOf(identifier)];

    return {
      ...((isRecord(existing) === true) ? existing : {}),
      [itemKey]: identifier,
    };
  }));

  if (widget === 'discord-id-list') {
    return (
      <div className="field schema-wide">
        <div className="schema-list-head">
          <label className="field-label" htmlFor={fieldId(path)}>{label}</label>
          {(onRemove === undefined || context['readOnly'] === true) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
        </div>
        <textarea
          aria-invalid={issue !== ''}
          className="monospace"
          disabled={context['readOnly']}
          id={fieldId(path)}
          onChange={(event) => {
            const next: Web_SchemaForm_IdentifierListField_Next = event.currentTarget.value;

            setText(next);
            replace(next.split('\n').map((line) => line.trim()).filter((line) => line !== ''));

            return;
          }}
          rows={Math.min(10, Math.max(3, identifiers.length + 1))}
          spellCheck={false}
          value={text}
        />
        {(issue === '') ? <small>{schema['description'] ?? 'One ID per line.'}</small> : <FieldError message={issue} />}
      </div>
    );
  }

  const kind: Web_SchemaForm_IdentifierListField_Kind = (widget === 'role-list') ? 'role' : 'channel';
  const choices: Web_SchemaForm_IdentifierListField_Choices = (kind === 'channel') ? [...context['resources']['channels']]
    .sort((left, right) => left['name'].localeCompare(right['name']))
    .map((channel) => {
      const channelNote: Web_SchemaForm_IdentifierListField_ChannelNote = (channel['available'] === true) ? '' : ' (deleted)';

      return {
        id: channel['id'],
        name: `#${channel['name']}${channelNote}`,
      };
    }) : [...context['resources']['roles']]
    .sort((left, right) => (right['position'] ?? 0) - (left['position'] ?? 0))
    .map((role) => {
      const roleNote: Web_SchemaForm_IdentifierListField_RoleNote = (role['available'] === true) ? '' : ' (deleted)';

      return {
        id: role['id'],
        name: `@${role['name']}${roleNote}`,
      };
    });

  /**
   * Schema Form - Name Of.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_IdentifierListField_NameOf_Identifier} identifier - Identifier.
   *
   * @returns {Web_SchemaForm_IdentifierListField_NameOf_Returns}
   *
   * @since 4.0.0
   */
  const nameOf: Web_SchemaForm_IdentifierListField_NameOf = (identifier: Web_SchemaForm_IdentifierListField_NameOf_Identifier): Web_SchemaForm_IdentifierListField_NameOf_Returns => {
    const choice: Web_SchemaForm_IdentifierListField_NameOf_Choice = choices.find((candidate) => candidate['id'] === identifier);

    return (choice === undefined) ? `Unknown ${kind} (${identifier})` : choice['name'];
  };
  const remaining: Web_SchemaForm_IdentifierListField_Remaining = choices.filter((choice) => identifiers.includes(choice['id']) === false);

  return (
    <div className="field schema-wide">
      <div className="schema-list-head">
        <span className="field-label">{label}</span>
        {(onRemove === undefined || context['readOnly'] === true) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </div>
      {(identifiers.length === 0) ? <p className="schema-empty">{(kind === 'channel') ? 'No channels yet.' : 'No roles yet.'}</p> : (
        <ul className="picker-list">
          {identifiers.map((identifier, index) => (
            <li key={`${identifier}-${index}`}>
              <span className={(identifier === '' || nameOf(identifier).startsWith('Unknown') === true) ? 'picker-list-unknown' : undefined}>{(identifier === '') ? `No ${kind} chosen` : nameOf(identifier)}</span>
              {(context['readOnly'] === true) ? null : (
                <button
                  aria-label={`Remove ${nameOf(identifier)}`}
                  className="icon-button"
                  onClick={() => replace(identifiers.filter((_identifier, candidate) => candidate !== index))}
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
      {(context['readOnly'] === true || identifiers.length >= maximum) ? null : (
        <select
          aria-label={(kind === 'channel') ? `Add a channel to ${label.toLowerCase()}` : `Add a role to ${label.toLowerCase()}`}
          className="select-control picker-control"
          disabled={remaining.length === 0}
          id={fieldId(path)}
          onChange={(event) => {
            const next: Web_SchemaForm_IdentifierListField_Next = event.currentTarget.value;

            if (next !== '') {
              replace([
                ...identifiers,
                next,
              ]);
            }

            return;
          }}
          value=""
        >
          <option className="select-placeholder" disabled value="">{(kind === 'channel') ? 'Add a channel…' : 'Add a role…'}</option>
          {remaining.map((choice) => <option key={choice['id']} value={choice['id']}>{choice['name']}</option>)}
        </select>
      )}
      {(issue === '') ? <Hint text={schema['description']} /> : <FieldError message={issue} />}
    </div>
  );
};

/**
 * Schema Form - Permission Map Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_PermissionMapField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_PermissionMapField_Returns}
 *
 * @since 4.0.0
 */
const PermissionMapField = (props: Web_SchemaForm_PermissionMapField_Props): Web_SchemaForm_PermissionMapField_Returns => {
  const context: Web_SchemaForm_PermissionMapField_Context = props['context'];
  const label: Web_SchemaForm_PermissionMapField_Label = props['label'];
  const onChange: Web_SchemaForm_PermissionMapField_OnChange = props['onChange'];
  const path: Web_SchemaForm_PermissionMapField_Path = props['path'];
  const schema: Web_SchemaForm_PermissionMapField_Schema = props['schema'];
  const value: Web_SchemaForm_PermissionMapField_Value = props['value'];
  const record: Web_SchemaForm_PermissionMapField_Record = (isRecord(value) === true) ? value : {};
  const names: Web_SchemaForm_PermissionMapField_Names = Object.keys(record);
  const options: Web_SchemaForm_PermissionMapField_Options = (schema['x-options'] ?? []).filter((option) => names.includes(option) === false);
  const issue: Web_SchemaForm_PermissionMapField_Issue = context.issueAt(path);

  /**
   * Schema Form - Set Permission.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_PermissionMapField_SetPermission_Name}    name    - Name.
   * @param {Web_SchemaForm_PermissionMapField_SetPermission_Allowed} allowed - Allowed.
   *
   * @returns {Web_SchemaForm_PermissionMapField_SetPermission_Returns}
   *
   * @since 4.0.0
   */
  const setPermission: Web_SchemaForm_PermissionMapField_SetPermission = (name: Web_SchemaForm_PermissionMapField_SetPermission_Name, allowed: Web_SchemaForm_PermissionMapField_SetPermission_Allowed): Web_SchemaForm_PermissionMapField_SetPermission_Returns => {
    const next: Web_SchemaForm_PermissionMapField_SetPermission_Next = { ...record };

    if (allowed === undefined) {
      delete next[name];
    } else {
      Reflect.set(next, name, allowed);
    }

    onChange(next);

    return;
  };

  return (
    <div className="field schema-wide">
      <span className="field-label">{label}</span>
      {(names.length === 0) ? <p className="schema-empty">No permissions yet.</p> : (
        <ul className="picker-list">
          {names.map((name) => (
            <li key={name}>
              <span className="monospace">{name}</span>
              <span className="picker-list-controls">
                <span aria-label={`${name} permission`} className="segmented schema-segmented" role="group">
                  <button aria-pressed={record[name] === true} disabled={context['readOnly']} onClick={() => setPermission(name, true)} type="button">Allow</button>
                  <button aria-pressed={record[name] === false} disabled={context['readOnly']} onClick={() => setPermission(name, false)} type="button">Deny</button>
                </span>
                {(context['readOnly'] === true) ? null : (
                  <button aria-label={`Remove ${name}`} className="icon-button" onClick={() => setPermission(name, undefined)} title="Remove" type="button">
                    <Icon name="x" size={16} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {(context['readOnly'] === true) ? null : (
        <select
          aria-label="Add a permission"
          className="select-control picker-control"
          disabled={options.length === 0}
          id={fieldId(path)}
          onChange={(event) => {
            const next: Web_SchemaForm_PermissionMapField_Next = event.currentTarget.value;

            if (next !== '') {
              setPermission(next, true);
            }

            return;
          }}
          value=""
        >
          <option className="select-placeholder" disabled value="">Add a permission…</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      )}
      {(issue === '') ? <Hint text={schema['description'] ?? 'Set the complete Discord permission overwrite. Permissions you leave out return to their inherited value.'} /> : <FieldError message={issue} />}
    </div>
  );
};

/**
 * Schema Form - Number Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_NumberField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_NumberField_Returns}
 *
 * @since 4.0.0
 */
const NumberField = (props: Web_SchemaForm_NumberField_Props): Web_SchemaForm_NumberField_Returns => {
  const context: Web_SchemaForm_NumberField_Context = props['context'];
  const label: Web_SchemaForm_NumberField_Label = props['label'];
  const nullable: Web_SchemaForm_NumberField_Nullable = props['nullable'];
  const onChange: Web_SchemaForm_NumberField_OnChange = props['onChange'];
  const path: Web_SchemaForm_NumberField_Path = props['path'];
  const schema: Web_SchemaForm_NumberField_Schema = props['schema'];
  const value: Web_SchemaForm_NumberField_Value = props['value'];
  const external: Web_SchemaForm_NumberField_External = (typeof value === 'number') ? String(value) : '';
  const textState: Web_SchemaForm_NumberField_TextState = useState<Web_SchemaForm_NumberField_Text>(external);
  const text: Web_SchemaForm_NumberField_Text = textState[0];
  const setText: Web_SchemaForm_NumberField_SetText = textState[1];
  const issue: Web_SchemaForm_NumberField_Issue = context.issueAt(path);
  const integer: Web_SchemaForm_NumberField_Integer = schemaTypes(schema).includes('integer');

  useEffect(() => {
    if (Number(text) !== value || text === '') {
      setText(external);
    }

    return;
  }, [external]);

  const limits: Web_SchemaForm_NumberField_Limits = [];

  if (schema['minimum'] !== undefined) {
    limits.push(`at least ${schema['minimum']}`);
  }

  if (schema['maximum'] !== undefined) {
    limits.push(`at most ${schema['maximum']}`);
  }

  const limitsHint: Web_SchemaForm_NumberField_LimitsHint = (limits.length === 0) ? undefined : `${limits.join(', ')}.`.replace(new RegExp(firstCharacterPattern, 'u'), (first) => first.toUpperCase());

  return (
    <FieldLabel>
      <span>{label}</span>
      <input
        aria-invalid={issue !== ''}
        disabled={context['readOnly']}
        id={fieldId(path)}
        inputMode={(integer === true) ? 'numeric' : 'decimal'}
        max={schema['maximum']}
        min={schema['minimum']}
        onChange={(event) => {
          const next: Web_SchemaForm_NumberField_Next = event.currentTarget.value;

          setText(next);

          if (next.trim() === '') {
            onChange((nullable === true) ? null : undefined);

            return;
          }

          const parsed: Web_SchemaForm_NumberField_Parsed = Number(next);

          onChange((Number.isFinite(parsed) === true) ? parsed : next);

          return;
        }}
        step={(integer === true) ? 1 : 'any'}
        type="number"
        value={text}
      />
      {(issue === '') ? <Hint text={schema['description'] ?? limitsHint} /> : <FieldError message={issue} />}
    </FieldLabel>
  );
};

/**
 * Schema Form - Boolean Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_BooleanField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_BooleanField_Returns}
 *
 * @since 4.0.0
 */
const BooleanField = (props: Web_SchemaForm_BooleanField_Props): Web_SchemaForm_BooleanField_Returns => {
  const context: Web_SchemaForm_BooleanField_Context = props['context'];
  const label: Web_SchemaForm_BooleanField_Label = props['label'];
  const onChange: Web_SchemaForm_BooleanField_OnChange = props['onChange'];
  const path: Web_SchemaForm_BooleanField_Path = props['path'];
  const schema: Web_SchemaForm_BooleanField_Schema = props['schema'];
  const value: Web_SchemaForm_BooleanField_Value = props['value'];
  const issue: Web_SchemaForm_BooleanField_Issue = context.issueAt(path);

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
            disabled={context['readOnly']}
            id={fieldId(path)}
            onChange={(event) => onChange(event.currentTarget.checked)}
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
 * Schema Form - Secret Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_SecretField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_SecretField_Returns}
 *
 * @since 4.0.0
 */
const SecretField = (props: Web_SchemaForm_SecretField_Props): Web_SchemaForm_SecretField_Returns => {
  const context: Web_SchemaForm_SecretField_Context = props['context'];
  const label: Web_SchemaForm_SecretField_Label = props['label'];
  const onChange: Web_SchemaForm_SecretField_OnChange = props['onChange'];
  const path: Web_SchemaForm_SecretField_Path = props['path'];
  const schema: Web_SchemaForm_SecretField_Schema = props['schema'];
  const value: Web_SchemaForm_SecretField_Value = props['value'];
  const record: Web_SchemaForm_SecretField_Record = (isRecord(value) === true) ? value : {};
  const key: Web_SchemaForm_SecretField_Key = (typeof record['$secret'] === 'string') ? record['$secret'] : '';
  const draft: Web_SchemaForm_SecretField_Draft = (typeof record['__draft'] === 'string') ? record['__draft'] : '';
  const saved: Web_SchemaForm_SecretField_Saved = key !== '' && context['savedSecrets'][key] === true;
  const replacingState: Web_SchemaForm_SecretField_ReplacingState = useState<Web_SchemaForm_SecretField_Replacing>(false);
  const replacing: Web_SchemaForm_SecretField_Replacing = replacingState[0];
  const setReplacing: Web_SchemaForm_SecretField_SetReplacing = replacingState[1];
  const pathIssue: Web_SchemaForm_SecretField_PathIssue = context.issueAt(path);
  const issue: Web_SchemaForm_SecretField_Issue = (pathIssue !== '') ? pathIssue : context.issueAt([
    ...path,
    '$secret',
  ]);

  if (
    saved === true
    && replacing === false
    && draft === ''
  ) {
    return (
      <div className="field">
        <span className="field-label">{label}</span>
        <div className="secret-saved">
          <span className="tag tag-success">Saved</span>
          <small>{'Stored encrypted. It\'s never shown again.'}</small>
          {(context['readOnly'] === true) ? null : <button className="text-button" onClick={() => setReplacing(true)} type="button">Replace</button>}
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
        disabled={context['readOnly']}
        id={fieldId(path)}
        onChange={(event) => {
          const next: Web_SchemaForm_SecretField_Next = event.currentTarget.value;

          onChange((next === '') ? { $secret: key } : {
            $secret: key,
            __draft: next,
          });

          return;
        }}
        placeholder={(saved === true) ? 'Enter the new value' : undefined}
        spellCheck={false}
        type="password"
        value={draft}
      />
      {(issue === '') ? (
        <small>
          {(saved === true) ? 'Leave it empty to keep the saved value. ' : ''}
          {schema['description'] ?? 'Stored encrypted and never shown again.'}
          {(saved === true) ? (
            <>
              {' '}
              <button
                className="text-button text-button-inline"
                onClick={() => {
                  setReplacing(false);
                  onChange({ $secret: key });

                  return;
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
 * Schema Form - Lines Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_LinesField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_LinesField_Returns}
 *
 * @since 4.0.0
 */
const LinesField = (props: Web_SchemaForm_LinesField_Props): Web_SchemaForm_LinesField_Returns => {
  const context: Web_SchemaForm_LinesField_Context = props['context'];
  const itemType: Web_SchemaForm_LinesField_ItemType = props['itemType'];
  const label: Web_SchemaForm_LinesField_Label = props['label'];
  const onChange: Web_SchemaForm_LinesField_OnChange = props['onChange'];
  const onRemove: Web_SchemaForm_LinesField_OnRemove = props['onRemove'];
  const path: Web_SchemaForm_LinesField_Path = props['path'];
  const schema: Web_SchemaForm_LinesField_Schema = props['schema'];
  const value: Web_SchemaForm_LinesField_Value = props['value'];
  const entries: Web_SchemaForm_LinesField_Entries = (Array.isArray(value) === true) ? value : [];
  const external: Web_SchemaForm_LinesField_External = entries.map((entry) => String(entry)).join('\n');
  const textState: Web_SchemaForm_LinesField_TextState = useState<Web_SchemaForm_LinesField_Text>(external);
  const text: Web_SchemaForm_LinesField_Text = textState[0];
  const setText: Web_SchemaForm_LinesField_SetText = textState[1];
  const issue: Web_SchemaForm_LinesField_Issue = context.issueAt(path);
  const numeric: Web_SchemaForm_LinesField_Numeric = itemType === 'number' || itemType === 'integer';

  /**
   * Schema Form - Parse.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_LinesField_Parse_Next} next - Next.
   *
   * @returns {Web_SchemaForm_LinesField_Parse_Returns}
   *
   * @since 4.0.0
   */
  const parse: Web_SchemaForm_LinesField_Parse = (next: Web_SchemaForm_LinesField_Parse_Next): Web_SchemaForm_LinesField_Parse_Returns => {
    const lines: Web_SchemaForm_LinesField_Parse_Lines = next
      .split('\n')
      .map((line) => line.replace(new RegExp(trailingCarriageReturnPattern, 'u'), ''))
      .filter((line) => line.trim() !== '');

    return lines.map((line) => {
      if (numeric === false) {
        return line;
      }

      const parsed: Web_SchemaForm_LinesField_Parse_Parsed = Number(line.trim());

      return (Number.isFinite(parsed) === true) ? parsed : line;
    });
  };

  useEffect(() => {
    if (JSON.stringify(parse(text)) !== JSON.stringify(entries)) {
      setText(external);
    }

    return;
  }, [external]);

  return (
    <div className="field schema-wide">
      <div className="schema-list-head">
        <label className="field-label" htmlFor={fieldId(path)}>{label}</label>
        {(onRemove === undefined || context['readOnly'] === true) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </div>
      <textarea
        aria-invalid={issue !== ''}
        className={(numeric === true || resolveSchema(schema['items'], context['root'])['x-widget'] === 'discord-id') ? 'monospace' : undefined}
        disabled={context['readOnly']}
        id={fieldId(path)}
        onChange={(event) => {
          const next: Web_SchemaForm_LinesField_Next = event.currentTarget.value;

          setText(next);
          onChange(parse(next));

          return;
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
 * Schema Form - Checkbox Group.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_CheckboxGroup_Props} props - Props.
 *
 * @returns {Web_SchemaForm_CheckboxGroup_Returns}
 *
 * @since 4.0.0
 */
const CheckboxGroup = (props: Web_SchemaForm_CheckboxGroup_Props): Web_SchemaForm_CheckboxGroup_Returns => {
  const context: Web_SchemaForm_CheckboxGroup_Context = props['context'];
  const label: Web_SchemaForm_CheckboxGroup_Label = props['label'];
  const onChange: Web_SchemaForm_CheckboxGroup_OnChange = props['onChange'];
  const path: Web_SchemaForm_CheckboxGroup_Path = props['path'];
  const schema: Web_SchemaForm_CheckboxGroup_Schema = props['schema'];
  const value: Web_SchemaForm_CheckboxGroup_Value = props['value'];
  const items: Web_SchemaForm_CheckboxGroup_Items = resolveSchema(schema['items'], context['root']);
  const options: Web_SchemaForm_CheckboxGroup_Options = (items['enum'] ?? []).map((entry) => String(entry));
  const selected: Web_SchemaForm_CheckboxGroup_Selected = (Array.isArray(value) === true) ? value.map((entry) => String(entry)) : [];
  const issue: Web_SchemaForm_CheckboxGroup_Issue = context.issueAt(path);

  return (
    <fieldset className="scope-fieldset schema-wide">
      <legend>{label}</legend>
      <div className="schema-checks">
        {options.map((option) => (
          <label aria-label={enumLabel(items, option)} className="check-row" key={option}>
            <input
              checked={selected.includes(option)}
              disabled={context['readOnly']}
              onChange={() => {
                const next: Web_SchemaForm_CheckboxGroup_Next = (selected.includes(option) === true) ? selected.filter((entry) => entry !== option) : options.filter((entry) => entry === option || selected.includes(entry) === true);

                onChange(next);

                return;
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
 * Schema Form - List Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_ListField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_ListField_Returns}
 *
 * @since 4.0.0
 */
const ListField = (props: Web_SchemaForm_ListField_Props): Web_SchemaForm_ListField_Returns => {
  const context: Web_SchemaForm_ListField_Context = props['context'];
  const label: Web_SchemaForm_ListField_Label = props['label'];
  const onChange: Web_SchemaForm_ListField_OnChange = props['onChange'];
  const onRemove: Web_SchemaForm_ListField_OnRemove = props['onRemove'];
  const path: Web_SchemaForm_ListField_Path = props['path'];
  const schema: Web_SchemaForm_ListField_Schema = props['schema'];
  const value: Web_SchemaForm_ListField_Value = props['value'];
  const entries: Web_SchemaForm_ListField_Entries = (Array.isArray(value) === true) ? value : [];
  const items: Web_SchemaForm_ListField_Items = resolveSchema(schema['items'], context['root']);
  const itemLabel: Web_SchemaForm_ListField_ItemLabel = schema['x-item-label'] ?? ((label === '') ? 'Item' : singular(label));
  const titleKey: Web_SchemaForm_ListField_TitleKey = schema['x-item-title-key'] ?? ((items['properties'] !== undefined && items['properties']['name'] !== undefined) ? 'name' : undefined);
  const minimum: Web_SchemaForm_ListField_Minimum = schema['minItems'] ?? 0;
  const maximum: Web_SchemaForm_ListField_Maximum = schema['maxItems'] ?? Number.POSITIVE_INFINITY;
  const issue: Web_SchemaForm_ListField_Issue = context.issueAt(path);

  /**
   * Schema Form - Replace.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_ListField_Replace_Next} next - Next.
   *
   * @returns {Web_SchemaForm_ListField_Replace_Returns}
   *
   * @since 4.0.0
   */
  const replace: Web_SchemaForm_ListField_Replace = (next: Web_SchemaForm_ListField_Replace_Next): Web_SchemaForm_ListField_Replace_Returns => onChange(next);

  /**
   * Schema Form - Move.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_ListField_Move_Index}  index  - Index.
   * @param {Web_SchemaForm_ListField_Move_Offset} offset - Offset.
   *
   * @returns {Web_SchemaForm_ListField_Move_Returns}
   *
   * @since 4.0.0
   */
  const move: Web_SchemaForm_ListField_Move = (index: Web_SchemaForm_ListField_Move_Index, offset: Web_SchemaForm_ListField_Move_Offset): Web_SchemaForm_ListField_Move_Returns => {
    const next: Web_SchemaForm_ListField_Move_Next = [...entries];
    const target: Web_SchemaForm_ListField_Move_Target = index + offset;
    const moving: Web_SchemaForm_ListField_Move_Moving = next[index];

    Reflect.set(next, index, next[target]);

    Reflect.set(next, target, moving);

    replace(next);

    return;
  };

  const countLabel: Web_SchemaForm_ListField_CountLabel = (entries.length === 1) ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`;

  return (
    <div className="schema-list schema-wide">
      {(label === '' && onRemove === undefined) ? null : (
        <div className="schema-list-head">
          <span className="field-label">{label}</span>
          <span className="schema-count">{`${entries.length} ${countLabel}`}</span>
          {(onRemove === undefined || context['readOnly'] === true) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
        </div>
      )}
      {(schema['description'] === undefined) ? null : <p className="form-section-note">{schema['description']}</p>}

      {(entries.length === 0) ? <p className="schema-empty">{`No ${itemLabel.toLowerCase()}s yet.`}</p> : null}

      {entries.map((entry, index) => {
        const title: Web_SchemaForm_ListField_Title = (titleKey === undefined || isRecord(entry) === false) ? undefined : entry[titleKey];

        return (
          <div className="schema-card" key={index}>
            <div className="schema-card-head">
              <strong>{`${itemLabel} ${index + 1}`}</strong>
              {(typeof title === 'string' && title !== '') ? <span className="schema-card-title">{title}</span> : null}
              {(context['readOnly'] === true) ? null : (
                <span className="schema-card-actions">
                  <button aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`} className="icon-button" disabled={index === 0} onClick={() => move(index, -1)} title="Move up" type="button">
                    <Icon name="arrow-up" size={16} />
                  </button>
                  <button aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`} className="icon-button" disabled={index === entries.length - 1} onClick={() => move(index, 1)} title="Move down" type="button">
                    <Icon name="arrow-down" size={16} />
                  </button>
                  <button
                    aria-label={`Copy ${itemLabel.toLowerCase()} ${index + 1}`}
                    className="icon-button"
                    disabled={entries.length >= maximum}
                    onClick={() => replace([
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
                    onClick={() => replace(entries.filter((_entry, candidate) => candidate !== index))}
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
              onChange={(nextEntry) => replace(entries.map((candidate, candidateIndex) => ((candidateIndex === index) ? nextEntry : candidate)))}
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

      {(context['readOnly'] === true) ? null : (
        <div className="schema-add-row">
          <Button
            disabled={entries.length >= maximum}
            icon="add"
            onClick={() => replace([
              ...entries,
              defaultValue(items, context['root']),
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
 * Schema Form - Object Fields.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_ObjectFields_Props} props - Props.
 *
 * @returns {Web_SchemaForm_ObjectFields_Returns}
 *
 * @since 4.0.0
 */
const ObjectFields = (props: Web_SchemaForm_ObjectFields_Props): Web_SchemaForm_ObjectFields_Returns => {
  const context: Web_SchemaForm_ObjectFields_Context = props['context'];
  const hiddenKey: Web_SchemaForm_ObjectFields_HiddenKey = props['hiddenKey'];
  const onChange: Web_SchemaForm_ObjectFields_OnChange = props['onChange'];
  const path: Web_SchemaForm_ObjectFields_Path = props['path'];
  const schema: Web_SchemaForm_ObjectFields_Schema = props['schema'];
  const value: Web_SchemaForm_ObjectFields_Value = props['value'];
  const required: Web_SchemaForm_ObjectFields_Required = schema['required'] ?? [];
  const properties: Web_SchemaForm_ObjectFields_Properties = Object.entries(schema['properties'] ?? {}).filter((propertyEntry) => propertyEntry[0] !== hiddenKey);
  const additions: Web_SchemaForm_ObjectFields_Additions = [];

  /**
   * Schema Form - Set Key.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_ObjectFields_SetKey_Key}  key  - Key.
   * @param {Web_SchemaForm_ObjectFields_SetKey_Next} next - Next.
   *
   * @returns {Web_SchemaForm_ObjectFields_SetKey_Returns}
   *
   * @since 4.0.0
   */
  const setKey: Web_SchemaForm_ObjectFields_SetKey = (key: Web_SchemaForm_ObjectFields_SetKey_Key, next: Web_SchemaForm_ObjectFields_SetKey_Next): Web_SchemaForm_ObjectFields_SetKey_Returns => {
    const copy: Web_SchemaForm_ObjectFields_SetKey_Copy = { ...value };

    if (next === undefined) {
      delete copy[key];
    } else {
      Reflect.set(copy, key, next);
    }

    onChange(copy);

    return;
  };

  const fields: Web_SchemaForm_ObjectFields_Fields = [];

  for (const propertyEntry of properties) {
    const key: Web_SchemaForm_ObjectFields_Key = propertyEntry[0];
    const property: Web_SchemaForm_ObjectFields_Property = propertyEntry[1];
    const resolved: Web_SchemaForm_ObjectFields_Resolved = resolveSchema(property, context['root']);
    const isRequired: Web_SchemaForm_ObjectFields_IsRequired = required.includes(key);
    const present: Web_SchemaForm_ObjectFields_Present = value[key] !== undefined;
    const label: Web_SchemaForm_ObjectFields_Label = resolved['title'] ?? titleCase(key);

    // Hidden values ride along untouched, since the copy above keeps every key.
    if (isHidden(resolved) === true) {
      continue;
    }

    if (
      present === false
      && isRequired === false
      && (
        isComplex(resolved, context['root']) === true
        || isSecretSchema(resolved) === true
      )
    ) {
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
        onChange={(next) => setKey(key, next)}
        onRemove={(
          isRequired === true
          || (
            isComplex(resolved, context['root']) === false
            && isSecretSchema(resolved) === false
          )
        ) ? undefined : () => setKey(key, undefined)}
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
      {(additions.length === 0 || context['readOnly'] === true) ? null : (
        <div className="schema-add-row">
          {additions.map((addition) => {
            const additionKey: Web_SchemaForm_ObjectFields_AdditionKey = addition[0];
            const additionProperty: Web_SchemaForm_ObjectFields_AdditionProperty = addition[1];

            return (
              <Button icon="add" key={additionKey} onClick={() => setKey(additionKey, defaultValue(additionProperty, context['root']))} variant="quiet">
                {`Add ${(additionProperty['title'] ?? titleCase(additionKey)).toLowerCase()}`}
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
};

/**
 * Schema Form - Object Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_ObjectField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_ObjectField_Returns}
 *
 * @since 4.0.0
 */
const ObjectField = (props: Web_SchemaForm_ObjectField_Props): Web_SchemaForm_ObjectField_Returns => {
  const context: Web_SchemaForm_ObjectField_Context = props['context'];
  const label: Web_SchemaForm_ObjectField_Label = props['label'];
  const onChange: Web_SchemaForm_ObjectField_OnChange = props['onChange'];
  const onRemove: Web_SchemaForm_ObjectField_OnRemove = props['onRemove'];
  const path: Web_SchemaForm_ObjectField_Path = props['path'];
  const schema: Web_SchemaForm_ObjectField_Schema = props['schema'];
  const value: Web_SchemaForm_ObjectField_Value = props['value'];
  const record: Web_SchemaForm_ObjectField_Record = (isRecord(value) === true) ? value : {};
  const issue: Web_SchemaForm_ObjectField_Issue = context.issueAt(path);

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
        {(onRemove === undefined || context['readOnly'] === true) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </legend>
      {(schema['description'] === undefined) ? null : <p className="form-section-note">{schema['description']}</p>}
      <ObjectFields context={context} onChange={onChange} path={path} schema={schema} value={record} />
      <FieldError message={issue} />
    </fieldset>
  );
};

/**
 * Schema Form - Union Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_UnionField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_UnionField_Returns}
 *
 * @since 4.0.0
 */
const UnionField = (props: Web_SchemaForm_UnionField_Props): Web_SchemaForm_UnionField_Returns => {
  const context: Web_SchemaForm_UnionField_Context = props['context'];
  const label: Web_SchemaForm_UnionField_Label = props['label'];
  const onChange: Web_SchemaForm_UnionField_OnChange = props['onChange'];
  const onRemove: Web_SchemaForm_UnionField_OnRemove = props['onRemove'];
  const path: Web_SchemaForm_UnionField_Path = props['path'];
  const schema: Web_SchemaForm_UnionField_Schema = props['schema'];
  const union: Web_SchemaForm_UnionField_Union = props['union'];
  const value: Web_SchemaForm_UnionField_Value = props['value'];
  const index: Web_SchemaForm_UnionField_Index = unionOptionIndex(union, value);
  const option: Web_SchemaForm_UnionField_Option = union['options'][index] ?? {};
  const record: Web_SchemaForm_UnionField_Record = (isRecord(value) === true) ? value : {};
  const discriminatorSchema: Web_SchemaForm_UnionField_DiscriminatorSchema = (option['properties'] === undefined) ? undefined : option['properties'][union['discriminator']];
  const discriminatorTitle: Web_SchemaForm_UnionField_DiscriminatorTitle = (discriminatorSchema === undefined) ? undefined : discriminatorSchema['title'];
  const discriminatorLabel: Web_SchemaForm_UnionField_DiscriminatorLabel = discriminatorTitle ?? titleCase(union['discriminator']);
  const issue: Web_SchemaForm_UnionField_Issue = context.issueAt(path);

  const body: Web_SchemaForm_UnionField_Body = (
    <>
      <div className="schema-fields">
        <FieldLabel>
          <span>{discriminatorLabel}</span>
          <select
            className="select-control picker-control"
            disabled={context['readOnly']}
            id={fieldId([
              ...path,
              union['discriminator'],
            ])}
            onChange={(event) => {
              const nextOption: Web_SchemaForm_UnionField_NextOption = union['options'][Number(event.currentTarget.value)];

              if (nextOption !== undefined) {
                onChange(defaultValue(nextOption, context['root']));
              }

              return;
            }}
            value={String(index)}
          >
            {union['options'].map((candidate, candidateIndex) => {
              const constant: Web_SchemaForm_UnionField_Constant = constantOf((candidate['properties'] === undefined) ? undefined : candidate['properties'][union['discriminator']]);

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
        onChange={(next) => onChange({
          ...((isRecord(next) === true) ? next : {}),
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
        {(onRemove === undefined || context['readOnly'] === true) ? null : <button className="text-button" onClick={onRemove} type="button">Remove</button>}
      </legend>
      {(schema['description'] === undefined) ? null : <p className="form-section-note">{schema['description']}</p>}
      {body}
    </fieldset>
  );
};

/**
 * Schema Form - Inline Field.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_InlineField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_InlineField_Returns}
 *
 * @since 4.0.0
 */
const InlineField = (props: Web_SchemaForm_InlineField_Props): Web_SchemaForm_InlineField_Returns => {
  const child: Web_SchemaForm_InlineField_Child = props['child'];
  const context: Web_SchemaForm_InlineField_Context = props['context'];
  const label: Web_SchemaForm_InlineField_Label = props['label'];
  const onChange: Web_SchemaForm_InlineField_OnChange = props['onChange'];
  const path: Web_SchemaForm_InlineField_Path = props['path'];
  const required: Web_SchemaForm_InlineField_Required = props['required'];
  const schema: Web_SchemaForm_InlineField_Schema = props['schema'];
  const value: Web_SchemaForm_InlineField_Value = props['value'];
  const childKey: Web_SchemaForm_InlineField_ChildKey = child[0];
  const childSchema: Web_SchemaForm_InlineField_ChildSchema = child[1];
  const record: Web_SchemaForm_InlineField_Record = (isRecord(value) === true) ? value : {};
  const childPath: Web_SchemaForm_InlineField_ChildPath = [
    ...path,
    childKey,
  ];
  let childLabel: Web_SchemaForm_InlineField_ChildLabel = label;

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
        issueAt: (candidate) => {
          const candidateIssue: Web_SchemaForm_InlineField_CandidateIssue = context.issueAt(candidate);

          if (candidateIssue !== '') {
            return candidateIssue;
          }

          return (pathKey(candidate) === pathKey(childPath)) ? context.issueAt(path) : '';
        },
      }}
      label={childLabel}
      onChange={(next) => {
        if (
          (
            next === undefined
            || next === ''
          )
          && required === false
        ) {
          onChange(undefined);

          return;
        }

        onChange({
          ...record,
          [childKey]: next ?? '',
        });

        return;
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
 * Schema Form - Schema Field.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_SchemaField_Props} props - Props.
 *
 * @returns {Web_SchemaForm_SchemaField_Returns}
 *
 * @since 4.0.0
 */
export const SchemaField = (props: Web_SchemaForm_SchemaField_Props): Web_SchemaForm_SchemaField_Returns => {
  const context: Web_SchemaForm_SchemaField_Context = props['context'];
  const schema: Web_SchemaForm_SchemaField_Schema = props['schema'];
  const value: Web_SchemaForm_SchemaField_Value = props['value'];
  const unwrapped: Web_SchemaForm_SchemaField_Unwrapped = unwrapNullable(resolveSchema(schema, context['root']), context['root']);
  const resolved: Web_SchemaForm_SchemaField_Resolved = unwrapped['schema'];

  if (isHidden(resolved) === true) {
    return null;
  }

  if (isSecretSchema(resolved) === true) {
    return <SecretField {...props} schema={resolved} />;
  }

  const inline: Web_SchemaForm_SchemaField_Inline = inlineChild(resolved, context['root']);

  if (
    inline !== null
    && (
      value === undefined
      || isRecord(value) === true
    )
  ) {
    return <InlineField {...props} child={inline} schema={resolved} />;
  }

  if (
    resolved['x-widget'] === 'permission-map'
    && (
      value === undefined
      || isRecord(value) === true
    )
  ) {
    return <PermissionMapField {...props} schema={resolved} />;
  }

  const union: Web_SchemaForm_SchemaField_Union = unionOf(resolved, context['root']);

  if (union !== null) {
    return (value === undefined || isRecord(value) === true) ? <UnionField {...props} schema={resolved} union={union} /> : <JsonField {...props} schema={resolved} />;
  }

  const types: Web_SchemaForm_SchemaField_Types = schemaTypes(resolved).filter((type) => type !== 'null');

  if (types.length !== 1) {
    return <JsonField {...props} schema={resolved} />;
  }

  const type: Web_SchemaForm_SchemaField_Type = types[0];

  if (type === 'object') {
    if (
      resolved['properties'] === undefined
      || (
        value !== undefined
        && value !== null
        && isRecord(value) === false
      )
    ) {
      return <JsonField {...props} schema={resolved} />;
    }

    return <ObjectField {...props} schema={resolved} />;
  }

  if (type === 'array') {
    if (
      value !== undefined
      && value !== null
      && Array.isArray(value) === false
    ) {
      return <JsonField {...props} schema={resolved} />;
    }

    const items: Web_SchemaForm_SchemaField_Items = unwrapNullable(resolveSchema(resolved['items'], context['root']), context['root'])['schema'];
    const itemTypes: Web_SchemaForm_SchemaField_ItemTypes = schemaTypes(items);
    const listWidget: Web_SchemaForm_SchemaField_ListWidget = resolved['x-widget'];

    if (
      listWidget === 'channel-list'
      || listWidget === 'role-list'
      || listWidget === 'discord-id-list'
    ) {
      return <IdentifierListField {...props} schema={resolved} />;
    }

    if (items['enum'] !== undefined) {
      return <CheckboxGroup {...props} schema={resolved} />;
    }

    if (
      isSecretSchema(items) === true
      || unionOf(items, context['root']) !== null
      || itemTypes.includes('object') === true
      || itemTypes.includes('array') === true
    ) {
      return <ListField {...props} schema={resolved} />;
    }

    if (
      itemTypes.length === 1
      && (
        itemTypes[0] === 'string'
        || itemTypes[0] === 'number'
        || itemTypes[0] === 'integer'
      )
    ) {
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
 * Schema Form - Sections For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_SchemaForm_SectionsFor_Schema} schema - Schema.
 * @param {Web_SchemaForm_SectionsFor_Root}   root   - Root.
 *
 * @returns {Web_SchemaForm_SectionsFor_Returns}
 *
 * @since 4.0.0
 */
const sectionsFor = (schema: Web_SchemaForm_SectionsFor_Schema, root: Web_SchemaForm_SectionsFor_Root): Web_SchemaForm_SectionsFor_Returns => {
  const properties: Web_SchemaForm_SectionsFor_Properties = schema['properties'] ?? {};
  const keys: Web_SchemaForm_SectionsFor_Keys = Object.keys(properties).filter((key) => isHidden(resolveSchema(properties[key], root)) === false);
  const general: Web_SchemaForm_SectionsFor_General = [];
  const sections: Web_SchemaForm_SectionsFor_Sections = [];
  const ordered: Web_SchemaForm_SectionsFor_Ordered = [
    ...(schema['x-sections'] ?? []).filter((section) => keys.includes(section['key'])),
    ...keys.map((key) => ({ key })),
  ];

  // Lists and groups get their own section; plain values without a section note share "General".
  for (const section of ordered) {
    if (general.includes(section['key']) === true || sections.some((candidate) => candidate['key'] === section['key']) === true) {
      continue;
    }

    const described: Web_SchemaForm_SectionsFor_Described = section['description'] !== undefined && section['description'] !== '';

    if (described === true || isComplex(properties[section['key']] ?? {}, root) === true) {
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
 * Schema Form - Schema Form.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_SchemaForm_SchemaForm_Props} props - Props.
 *
 * @returns {Web_SchemaForm_SchemaForm_Returns}
 *
 * @since 4.0.0
 */
export const SchemaForm = (props: Web_SchemaForm_SchemaForm_Props): Web_SchemaForm_SchemaForm_Returns => {
  const context: Web_SchemaForm_SchemaForm_Context = props['context'];
  const onChange: Web_SchemaForm_SchemaForm_OnChange = props['onChange'];
  const schema: Web_SchemaForm_SchemaForm_Schema = props['schema'];
  const value: Web_SchemaForm_SchemaForm_Value = props['value'];
  const resolved: Web_SchemaForm_SchemaForm_Resolved = resolveSchema(schema, context['root']);
  const types: Web_SchemaForm_SchemaForm_Types = schemaTypes(resolved);

  if (
    types.includes('object') === false
    || resolved['properties'] === undefined
    || isSecretSchema(resolved) === true
    || (
      value !== undefined
      && value !== null
      && isRecord(value) === false
    )
  ) {
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

  const record: Web_SchemaForm_SchemaForm_Record = (isRecord(value) === true) ? value : {};
  const required: Web_SchemaForm_SchemaForm_Required = resolved['required'] ?? [];
  const layout: Web_SchemaForm_SchemaForm_Layout = sectionsFor(resolved, context['root']);

  /**
   * Schema Form - Set Key.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_SchemaForm_SetKey_Key}  key  - Key.
   * @param {Web_SchemaForm_SchemaForm_SetKey_Next} next - Next.
   *
   * @returns {Web_SchemaForm_SchemaForm_SetKey_Returns}
   *
   * @since 4.0.0
   */
  const setKey: Web_SchemaForm_SchemaForm_SetKey = (key: Web_SchemaForm_SchemaForm_SetKey_Key, next: Web_SchemaForm_SchemaForm_SetKey_Next): Web_SchemaForm_SchemaForm_SetKey_Returns => {
    const copy: Web_SchemaForm_SchemaForm_SetKey_Copy = { ...record };

    if (next === undefined) {
      delete copy[key];
    } else {
      Reflect.set(copy, key, next);
    }

    onChange(copy);

    return;
  };

  /**
   * Schema Form - Property Of.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_SchemaForm_SchemaForm_PropertyOf_Key} key - Key.
   *
   * @returns {Web_SchemaForm_SchemaForm_PropertyOf_Returns}
   *
   * @since 4.0.0
   */
  const propertyOf: Web_SchemaForm_SchemaForm_PropertyOf = (key: Web_SchemaForm_SchemaForm_PropertyOf_Key): Web_SchemaForm_SchemaForm_PropertyOf_Returns => resolveSchema((resolved['properties'] ?? {})[key], context['root']);

  return (
    <div className="panel">
      {(layout['general'].length === 0) ? null : (
        <section className="form-section">
          <div className="form-section-head">
            <h2>General</h2>
          </div>
          <div className="schema-fields">
            {layout['general'].map((key) => (
              <SchemaField
                context={context}
                key={key}
                label={propertyOf(key)['title'] ?? titleCase(key)}
                onChange={(next) => setKey(key, next)}
                path={[key]}
                required={required.includes(key)}
                schema={propertyOf(key)}
                value={record[key]}
              />
            ))}
          </div>
        </section>
      )}

      {layout['sections'].map((section) => {
        const property: Web_SchemaForm_SchemaForm_Property = propertyOf(section['key']);
        const isRequired: Web_SchemaForm_SchemaForm_IsRequired = required.includes(section['key']);
        const present: Web_SchemaForm_SchemaForm_Present = record[section['key']] !== undefined;
        const complex: Web_SchemaForm_SchemaForm_Complex = isComplex(property, context['root']);
        const title: Web_SchemaForm_SchemaForm_Title = (
          section['title']
          ?? property['title']
          ?? titleCase(section['key'])
        );
        const sectionDescription: Web_SchemaForm_SchemaForm_SectionDescription = section['description'] ?? '';
        const propertyDescription: Web_SchemaForm_SchemaForm_PropertyDescription = property['description'] ?? '';
        const description: Web_SchemaForm_SchemaForm_Description = (sectionDescription !== '') ? sectionDescription : propertyDescription;
        const showField: Web_SchemaForm_SchemaForm_ShowField = (
          present === true
          || isRequired === true
          || complex === false
        );

        return (
          <section className="form-section" key={section['key']}>
            <div className="form-section-head">
              <h2>{title}</h2>
              {(
                complex === true
                && isRequired === false
                && present === true
                && context['readOnly'] === false
              ) ? <button className="text-button" onClick={() => setKey(section['key'], undefined)} type="button">Remove</button> : null}
            </div>
            {(description === '') ? null : <p className="form-section-note">{description}</p>}
            {(showField === true) ? (
              <SchemaField
                context={context}
                label=""
                onChange={(next) => setKey(section['key'], next)}
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
                {(context['readOnly'] === true) ? <p className="schema-empty">Not set.</p> : (
                  <Button icon="add" onClick={() => setKey(section['key'], defaultValue(property, context['root']))} variant="quiet">
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
