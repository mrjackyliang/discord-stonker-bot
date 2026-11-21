import type {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
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
  Web_Schema_Widget,
} from '@/types/web/schema.d.ts';

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_BooleanField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_BooleanField_Returns = ReactElement;
export type Web_SchemaForm_BooleanField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_BooleanField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_BooleanField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_BooleanField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_BooleanField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_BooleanField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_BooleanField_Issue = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_CheckboxGroup_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_CheckboxGroup_Returns = ReactElement;
export type Web_SchemaForm_CheckboxGroup_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_CheckboxGroup_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_CheckboxGroup_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_CheckboxGroup_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_CheckboxGroup_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_CheckboxGroup_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_CheckboxGroup_Items = Web_Schema_Node;
export type Web_SchemaForm_CheckboxGroup_Options = string[];
export type Web_SchemaForm_CheckboxGroup_Selected = string[];
export type Web_SchemaForm_CheckboxGroup_Issue = string;
export type Web_SchemaForm_CheckboxGroup_Next = string[];

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_EnumLabel_Schema = Web_Schema_Node;
export type Web_SchemaForm_EnumLabel_Value = string;
export type Web_SchemaForm_EnumLabel_Returns = string;
export type Web_SchemaForm_EnumLabel_Labels = Record<string, string> | undefined;
export type Web_SchemaForm_EnumLabel_Label = string | undefined;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_FieldError_Props = Web_Components_FieldError_Props;
export type Web_SchemaForm_FieldError_Returns = ReactElement | null;
export type Web_SchemaForm_FieldError_Id = Web_Components_FieldError_Props['id'];
export type Web_SchemaForm_FieldError_Message = Web_Components_FieldError_Props['message'];

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_FieldId_Path = Web_Schema_Path;
export type Web_SchemaForm_FieldId_Returns = string;
export type Web_SchemaForm_FieldId_Joined = string;
export type Web_SchemaForm_FieldId_Suffix = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_Hint_Props = Web_Components_Hint_Props;
export type Web_SchemaForm_Hint_Returns = ReactElement | null;
export type Web_SchemaForm_Hint_Id = Web_Components_Hint_Props['id'];
export type Web_SchemaForm_Hint_Text = Web_Components_Hint_Props['text'];

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_IdentifierListField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_IdentifierListField_Returns = ReactElement;
export type Web_SchemaForm_IdentifierListField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_IdentifierListField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_IdentifierListField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_IdentifierListField_OnRemove = Web_Components_SchemaField_Props['onRemove'];
export type Web_SchemaForm_IdentifierListField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_IdentifierListField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_IdentifierListField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_IdentifierListField_Widget = Web_Schema_Widget | undefined;
export type Web_SchemaForm_IdentifierListField_Items = Web_Schema_Node;
export type Web_SchemaForm_IdentifierListField_ItemKey = string;
export type Web_SchemaForm_IdentifierListField_Entries = unknown[];
export type Web_SchemaForm_IdentifierListField_Identifiers = string[];
export type Web_SchemaForm_IdentifierListField_Identifier = unknown;
export type Web_SchemaForm_IdentifierListField_Issue = string;
export type Web_SchemaForm_IdentifierListField_TextState = [string, Dispatch<SetStateAction<string>>];
export type Web_SchemaForm_IdentifierListField_Text = string;
export type Web_SchemaForm_IdentifierListField_SetText = Dispatch<SetStateAction<string>>;
export type Web_SchemaForm_IdentifierListField_Maximum = number;
export type Web_SchemaForm_IdentifierListField_Typed = string[];
export type Web_SchemaForm_IdentifierListField_Replace_Next = string[];
export type Web_SchemaForm_IdentifierListField_Replace_Returns = void;
export type Web_SchemaForm_IdentifierListField_Replace = (next: Web_SchemaForm_IdentifierListField_Replace_Next) => Web_SchemaForm_IdentifierListField_Replace_Returns;
export type Web_SchemaForm_IdentifierListField_Replace_Existing = unknown;
export type Web_SchemaForm_IdentifierListField_Next = string;
export type Web_SchemaForm_IdentifierListField_Kind = 'channel' | 'role';
export type Web_SchemaForm_IdentifierListField_Choices = Web_Components_PickerChoice[];
export type Web_SchemaForm_IdentifierListField_ChannelNote = string;
export type Web_SchemaForm_IdentifierListField_RoleNote = string;
export type Web_SchemaForm_IdentifierListField_NameOf_Identifier = string;
export type Web_SchemaForm_IdentifierListField_NameOf_Returns = string;
export type Web_SchemaForm_IdentifierListField_NameOf = (identifier: Web_SchemaForm_IdentifierListField_NameOf_Identifier) => Web_SchemaForm_IdentifierListField_NameOf_Returns;
export type Web_SchemaForm_IdentifierListField_NameOf_Choice = Web_Components_PickerChoice | undefined;
export type Web_SchemaForm_IdentifierListField_Remaining = Web_Components_PickerChoice[];

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_InlineChild_Schema = Web_Schema_Node;
export type Web_SchemaForm_InlineChild_Root = Web_Schema_Node;
export type Web_SchemaForm_InlineChild_Returns = [string, Web_Schema_Node] | null;
export type Web_SchemaForm_InlineChild_Entries = [string, Web_Schema_Node][];
export type Web_SchemaForm_InlineChild_First = [string, Web_Schema_Node] | undefined;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_InlineField_Props = Web_Components_InlineField_Props;
export type Web_SchemaForm_InlineField_Returns = ReactElement | null;
export type Web_SchemaForm_InlineField_Child = Web_Components_InlineField_Props['child'];
export type Web_SchemaForm_InlineField_Context = Web_Components_InlineField_Props['context'];
export type Web_SchemaForm_InlineField_Label = Web_Components_InlineField_Props['label'];
export type Web_SchemaForm_InlineField_OnChange = Web_Components_InlineField_Props['onChange'];
export type Web_SchemaForm_InlineField_Path = Web_Components_InlineField_Props['path'];
export type Web_SchemaForm_InlineField_Required = Web_Components_InlineField_Props['required'];
export type Web_SchemaForm_InlineField_Schema = Web_Components_InlineField_Props['schema'];
export type Web_SchemaForm_InlineField_Value = Web_Components_InlineField_Props['value'];
export type Web_SchemaForm_InlineField_ChildKey = string;
export type Web_SchemaForm_InlineField_ChildSchema = Web_Schema_Node;
export type Web_SchemaForm_InlineField_Record = Record<string, unknown>;
export type Web_SchemaForm_InlineField_ChildPath = Web_Schema_Path;
export type Web_SchemaForm_InlineField_ChildLabel = string;
export type Web_SchemaForm_InlineField_CandidateIssue = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_IsComplex_Schema = Web_Schema_Node;
export type Web_SchemaForm_IsComplex_Root = Web_Schema_Node;
export type Web_SchemaForm_IsComplex_Returns = boolean;
export type Web_SchemaForm_IsComplex_Resolved = Web_Schema_Node;
export type Web_SchemaForm_IsComplex_Types = Web_Schema_TypeName[];
export type Web_SchemaForm_IsComplex_Items = Web_Schema_Node;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_JsonField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_JsonField_Returns = ReactElement;
export type Web_SchemaForm_JsonField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_JsonField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_JsonField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_JsonField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_JsonField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_JsonField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_JsonField_TextState = [string, Dispatch<SetStateAction<string>>];
export type Web_SchemaForm_JsonField_Text = string;
export type Web_SchemaForm_JsonField_SetText = Dispatch<SetStateAction<string>>;
export type Web_SchemaForm_JsonField_ParseErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_SchemaForm_JsonField_ParseError = string;
export type Web_SchemaForm_JsonField_SetParseError = Dispatch<SetStateAction<string>>;
export type Web_SchemaForm_JsonField_Issue = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_LinesField_Props = Web_Components_LinesField_Props;
export type Web_SchemaForm_LinesField_Returns = ReactElement;
export type Web_SchemaForm_LinesField_Context = Web_Components_LinesField_Props['context'];
export type Web_SchemaForm_LinesField_ItemType = Web_Components_LinesField_Props['itemType'];
export type Web_SchemaForm_LinesField_Label = Web_Components_LinesField_Props['label'];
export type Web_SchemaForm_LinesField_OnChange = Web_Components_LinesField_Props['onChange'];
export type Web_SchemaForm_LinesField_OnRemove = Web_Components_LinesField_Props['onRemove'];
export type Web_SchemaForm_LinesField_Path = Web_Components_LinesField_Props['path'];
export type Web_SchemaForm_LinesField_Schema = Web_Components_LinesField_Props['schema'];
export type Web_SchemaForm_LinesField_Value = Web_Components_LinesField_Props['value'];
export type Web_SchemaForm_LinesField_Entries = unknown[];
export type Web_SchemaForm_LinesField_External = string;
export type Web_SchemaForm_LinesField_TextState = [string, Dispatch<SetStateAction<string>>];
export type Web_SchemaForm_LinesField_Text = string;
export type Web_SchemaForm_LinesField_SetText = Dispatch<SetStateAction<string>>;
export type Web_SchemaForm_LinesField_Issue = string;
export type Web_SchemaForm_LinesField_Numeric = boolean;
export type Web_SchemaForm_LinesField_Parse_Next = string;
export type Web_SchemaForm_LinesField_Parse_Returns = unknown[];
export type Web_SchemaForm_LinesField_Parse = (next: Web_SchemaForm_LinesField_Parse_Next) => Web_SchemaForm_LinesField_Parse_Returns;
export type Web_SchemaForm_LinesField_Parse_Lines = string[];
export type Web_SchemaForm_LinesField_Parse_Parsed = number;
export type Web_SchemaForm_LinesField_Next = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_ListField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_ListField_Returns = ReactElement;
export type Web_SchemaForm_ListField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_ListField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_ListField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_ListField_OnRemove = Web_Components_SchemaField_Props['onRemove'];
export type Web_SchemaForm_ListField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_ListField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_ListField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_ListField_Entries = unknown[];
export type Web_SchemaForm_ListField_Items = Web_Schema_Node;
export type Web_SchemaForm_ListField_ItemLabel = string;
export type Web_SchemaForm_ListField_TitleKey = string | undefined;
export type Web_SchemaForm_ListField_Minimum = number;
export type Web_SchemaForm_ListField_Maximum = number;
export type Web_SchemaForm_ListField_Issue = string;
export type Web_SchemaForm_ListField_Replace_Next = unknown[];
export type Web_SchemaForm_ListField_Replace_Returns = void;
export type Web_SchemaForm_ListField_Replace = (next: Web_SchemaForm_ListField_Replace_Next) => Web_SchemaForm_ListField_Replace_Returns;
export type Web_SchemaForm_ListField_Move_Index = number;
export type Web_SchemaForm_ListField_Move_Offset = number;
export type Web_SchemaForm_ListField_Move_Returns = void;
export type Web_SchemaForm_ListField_Move = (index: Web_SchemaForm_ListField_Move_Index, offset: Web_SchemaForm_ListField_Move_Offset) => Web_SchemaForm_ListField_Move_Returns;
export type Web_SchemaForm_ListField_Move_Next = unknown[];
export type Web_SchemaForm_ListField_Move_Target = number;
export type Web_SchemaForm_ListField_Move_Moving = unknown;
export type Web_SchemaForm_ListField_CountLabel = string;
export type Web_SchemaForm_ListField_Title = unknown;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_NumberField_Props = Web_Components_ScalarField_Props;
export type Web_SchemaForm_NumberField_Returns = ReactElement;
export type Web_SchemaForm_NumberField_Context = Web_Components_ScalarField_Props['context'];
export type Web_SchemaForm_NumberField_Label = Web_Components_ScalarField_Props['label'];
export type Web_SchemaForm_NumberField_Nullable = Web_Components_ScalarField_Props['nullable'];
export type Web_SchemaForm_NumberField_OnChange = Web_Components_ScalarField_Props['onChange'];
export type Web_SchemaForm_NumberField_Path = Web_Components_ScalarField_Props['path'];
export type Web_SchemaForm_NumberField_Schema = Web_Components_ScalarField_Props['schema'];
export type Web_SchemaForm_NumberField_Value = Web_Components_ScalarField_Props['value'];
export type Web_SchemaForm_NumberField_External = string;
export type Web_SchemaForm_NumberField_TextState = [string, Dispatch<SetStateAction<string>>];
export type Web_SchemaForm_NumberField_Text = string;
export type Web_SchemaForm_NumberField_SetText = Dispatch<SetStateAction<string>>;
export type Web_SchemaForm_NumberField_Issue = string;
export type Web_SchemaForm_NumberField_Integer = boolean;
export type Web_SchemaForm_NumberField_Limits = string[];
export type Web_SchemaForm_NumberField_LimitsHint = string | undefined;
export type Web_SchemaForm_NumberField_Next = string;
export type Web_SchemaForm_NumberField_Parsed = number;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_ObjectField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_ObjectField_Returns = ReactElement;
export type Web_SchemaForm_ObjectField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_ObjectField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_ObjectField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_ObjectField_OnRemove = Web_Components_SchemaField_Props['onRemove'];
export type Web_SchemaForm_ObjectField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_ObjectField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_ObjectField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_ObjectField_Record = Record<string, unknown>;
export type Web_SchemaForm_ObjectField_Issue = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_ObjectFields_Props = Web_Components_ObjectFields_Props;
export type Web_SchemaForm_ObjectFields_Returns = ReactElement;
export type Web_SchemaForm_ObjectFields_Context = Web_Components_ObjectFields_Props['context'];
export type Web_SchemaForm_ObjectFields_HiddenKey = Web_Components_ObjectFields_Props['hiddenKey'];
export type Web_SchemaForm_ObjectFields_OnChange = Web_Components_ObjectFields_Props['onChange'];
export type Web_SchemaForm_ObjectFields_Path = Web_Components_ObjectFields_Props['path'];
export type Web_SchemaForm_ObjectFields_Schema = Web_Components_ObjectFields_Props['schema'];
export type Web_SchemaForm_ObjectFields_Value = Web_Components_ObjectFields_Props['value'];
export type Web_SchemaForm_ObjectFields_Required = string[];
export type Web_SchemaForm_ObjectFields_Properties = [string, Web_Schema_Node][];
export type Web_SchemaForm_ObjectFields_Additions = [string, Web_Schema_Node][];
export type Web_SchemaForm_ObjectFields_SetKey_Key = string;
export type Web_SchemaForm_ObjectFields_SetKey_Next = unknown;
export type Web_SchemaForm_ObjectFields_SetKey_Returns = void;
export type Web_SchemaForm_ObjectFields_SetKey = (key: Web_SchemaForm_ObjectFields_SetKey_Key, next: Web_SchemaForm_ObjectFields_SetKey_Next) => Web_SchemaForm_ObjectFields_SetKey_Returns;
export type Web_SchemaForm_ObjectFields_SetKey_Copy = Record<string, unknown>;
export type Web_SchemaForm_ObjectFields_Fields = ReactElement[];
export type Web_SchemaForm_ObjectFields_Key = string;
export type Web_SchemaForm_ObjectFields_Property = Web_Schema_Node;
export type Web_SchemaForm_ObjectFields_Resolved = Web_Schema_Node;
export type Web_SchemaForm_ObjectFields_IsRequired = boolean;
export type Web_SchemaForm_ObjectFields_Present = boolean;
export type Web_SchemaForm_ObjectFields_Label = string;
export type Web_SchemaForm_ObjectFields_AdditionKey = string;
export type Web_SchemaForm_ObjectFields_AdditionProperty = Web_Schema_Node;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_PermissionMapField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_PermissionMapField_Returns = ReactElement;
export type Web_SchemaForm_PermissionMapField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_PermissionMapField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_PermissionMapField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_PermissionMapField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_PermissionMapField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_PermissionMapField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_PermissionMapField_Record = Record<string, unknown>;
export type Web_SchemaForm_PermissionMapField_Names = string[];
export type Web_SchemaForm_PermissionMapField_Options = string[];
export type Web_SchemaForm_PermissionMapField_Issue = string;
export type Web_SchemaForm_PermissionMapField_SetPermission_Name = string;
export type Web_SchemaForm_PermissionMapField_SetPermission_Allowed = boolean | undefined;
export type Web_SchemaForm_PermissionMapField_SetPermission_Returns = void;
export type Web_SchemaForm_PermissionMapField_SetPermission = (name: Web_SchemaForm_PermissionMapField_SetPermission_Name, allowed: Web_SchemaForm_PermissionMapField_SetPermission_Allowed) => Web_SchemaForm_PermissionMapField_SetPermission_Returns;
export type Web_SchemaForm_PermissionMapField_SetPermission_Next = Record<string, unknown>;
export type Web_SchemaForm_PermissionMapField_Next = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_PickerField_Props = Web_Components_PickerField_Props;
export type Web_SchemaForm_PickerField_Returns = ReactElement;
export type Web_SchemaForm_PickerField_Context = Web_Components_PickerField_Props['context'];
export type Web_SchemaForm_PickerField_Kind = Web_Components_PickerField_Props['kind'];
export type Web_SchemaForm_PickerField_Label = Web_Components_PickerField_Props['label'];
export type Web_SchemaForm_PickerField_OnChange = Web_Components_PickerField_Props['onChange'];
export type Web_SchemaForm_PickerField_Path = Web_Components_PickerField_Props['path'];
export type Web_SchemaForm_PickerField_Required = Web_Components_PickerField_Props['required'];
export type Web_SchemaForm_PickerField_Schema = Web_Components_PickerField_Props['schema'];
export type Web_SchemaForm_PickerField_Value = Web_Components_PickerField_Props['value'];
export type Web_SchemaForm_PickerField_Current = string;
export type Web_SchemaForm_PickerField_Issue = string;
export type Web_SchemaForm_PickerField_Channels = Web_Api_Channel[];
export type Web_SchemaForm_PickerField_Roles = Web_Api_DiscordRole[];
export type Web_SchemaForm_PickerField_Known = boolean;
export type Web_SchemaForm_PickerField_Next = string;
export type Web_SchemaForm_PickerField_ChannelNote = string;
export type Web_SchemaForm_PickerField_RoleNote = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_SchemaField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_SchemaField_Returns = ReactElement | null;
export type Web_SchemaForm_SchemaField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_SchemaField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_SchemaField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_SchemaField_Unwrapped = Web_Schema_Unwrapped;
export type Web_SchemaForm_SchemaField_Resolved = Web_Schema_Node;
export type Web_SchemaForm_SchemaField_Inline = [string, Web_Schema_Node] | null;
export type Web_SchemaForm_SchemaField_Union = Web_Schema_Union | null;
export type Web_SchemaForm_SchemaField_Types = Web_Schema_TypeName[];
export type Web_SchemaForm_SchemaField_Type = Web_Schema_TypeName | undefined;
export type Web_SchemaForm_SchemaField_Items = Web_Schema_Node;
export type Web_SchemaForm_SchemaField_ItemTypes = Web_Schema_TypeName[];
export type Web_SchemaForm_SchemaField_ListWidget = Web_Schema_Widget | undefined;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_SchemaForm_Props = Web_Components_SchemaForm_Props;
export type Web_SchemaForm_SchemaForm_Returns = ReactElement;
export type Web_SchemaForm_SchemaForm_Context = Web_Components_SchemaForm_Props['context'];
export type Web_SchemaForm_SchemaForm_OnChange = Web_Components_SchemaForm_Props['onChange'];
export type Web_SchemaForm_SchemaForm_Schema = Web_Components_SchemaForm_Props['schema'];
export type Web_SchemaForm_SchemaForm_Value = Web_Components_SchemaForm_Props['value'];
export type Web_SchemaForm_SchemaForm_Resolved = Web_Schema_Node;
export type Web_SchemaForm_SchemaForm_Types = Web_Schema_TypeName[];
export type Web_SchemaForm_SchemaForm_Record = Record<string, unknown>;
export type Web_SchemaForm_SchemaForm_Required = string[];
export type Web_SchemaForm_SchemaForm_Layout = Web_Components_SchemaForm_Layout;
export type Web_SchemaForm_SchemaForm_SetKey_Key = string;
export type Web_SchemaForm_SchemaForm_SetKey_Next = unknown;
export type Web_SchemaForm_SchemaForm_SetKey_Returns = void;
export type Web_SchemaForm_SchemaForm_SetKey = (key: Web_SchemaForm_SchemaForm_SetKey_Key, next: Web_SchemaForm_SchemaForm_SetKey_Next) => Web_SchemaForm_SchemaForm_SetKey_Returns;
export type Web_SchemaForm_SchemaForm_SetKey_Copy = Record<string, unknown>;
export type Web_SchemaForm_SchemaForm_PropertyOf_Key = string;
export type Web_SchemaForm_SchemaForm_PropertyOf_Returns = Web_Schema_Node;
export type Web_SchemaForm_SchemaForm_PropertyOf = (key: Web_SchemaForm_SchemaForm_PropertyOf_Key) => Web_SchemaForm_SchemaForm_PropertyOf_Returns;
export type Web_SchemaForm_SchemaForm_Property = Web_Schema_Node;
export type Web_SchemaForm_SchemaForm_IsRequired = boolean;
export type Web_SchemaForm_SchemaForm_Present = boolean;
export type Web_SchemaForm_SchemaForm_Complex = boolean;
export type Web_SchemaForm_SchemaForm_Title = string;
export type Web_SchemaForm_SchemaForm_SectionDescription = string;
export type Web_SchemaForm_SchemaForm_PropertyDescription = string;
export type Web_SchemaForm_SchemaForm_Description = string;
export type Web_SchemaForm_SchemaForm_ShowField = boolean;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_SecretField_Props = Web_Components_SchemaField_Props;
export type Web_SchemaForm_SecretField_Returns = ReactElement;
export type Web_SchemaForm_SecretField_Context = Web_Components_SchemaField_Props['context'];
export type Web_SchemaForm_SecretField_Label = Web_Components_SchemaField_Props['label'];
export type Web_SchemaForm_SecretField_OnChange = Web_Components_SchemaField_Props['onChange'];
export type Web_SchemaForm_SecretField_Path = Web_Components_SchemaField_Props['path'];
export type Web_SchemaForm_SecretField_Schema = Web_Components_SchemaField_Props['schema'];
export type Web_SchemaForm_SecretField_Value = Web_Components_SchemaField_Props['value'];
export type Web_SchemaForm_SecretField_Record = Record<string, unknown>;
export type Web_SchemaForm_SecretField_Key = string;
export type Web_SchemaForm_SecretField_Draft = string;
export type Web_SchemaForm_SecretField_Saved = boolean;
export type Web_SchemaForm_SecretField_ReplacingState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_SchemaForm_SecretField_Replacing = boolean;
export type Web_SchemaForm_SecretField_SetReplacing = Dispatch<SetStateAction<boolean>>;
export type Web_SchemaForm_SecretField_PathIssue = string;
export type Web_SchemaForm_SecretField_Issue = string;
export type Web_SchemaForm_SecretField_Next = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_SectionsFor_Schema = Web_Schema_Node;
export type Web_SchemaForm_SectionsFor_Root = Web_Schema_Node;
export type Web_SchemaForm_SectionsFor_Returns = Web_Components_SchemaForm_Layout;
export type Web_SchemaForm_SectionsFor_Properties = Record<string, Web_Schema_Node>;
export type Web_SchemaForm_SectionsFor_Keys = string[];
export type Web_SchemaForm_SectionsFor_General = string[];
export type Web_SchemaForm_SectionsFor_Sections = Web_Schema_Section[];
export type Web_SchemaForm_SectionsFor_Ordered = Web_Schema_Section[];
export type Web_SchemaForm_SectionsFor_Described = boolean;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_Singular_Label = string;
export type Web_SchemaForm_Singular_Returns = string;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_StringField_Props = Web_Components_ScalarField_Props;
export type Web_SchemaForm_StringField_Returns = ReactElement;
export type Web_SchemaForm_StringField_Context = Web_Components_ScalarField_Props['context'];
export type Web_SchemaForm_StringField_Label = Web_Components_ScalarField_Props['label'];
export type Web_SchemaForm_StringField_Nullable = Web_Components_ScalarField_Props['nullable'];
export type Web_SchemaForm_StringField_OnChange = Web_Components_ScalarField_Props['onChange'];
export type Web_SchemaForm_StringField_Path = Web_Components_ScalarField_Props['path'];
export type Web_SchemaForm_StringField_Required = Web_Components_ScalarField_Props['required'];
export type Web_SchemaForm_StringField_Schema = Web_Components_ScalarField_Props['schema'];
export type Web_SchemaForm_StringField_Value = Web_Components_ScalarField_Props['value'];
export type Web_SchemaForm_StringField_TextareaRef = RefObject<HTMLTextAreaElement | null>;
export type Web_SchemaForm_StringField_Widget = Web_Schema_Widget | undefined;
export type Web_SchemaForm_StringField_Issue = string;
export type Web_SchemaForm_StringField_Current = string;
export type Web_SchemaForm_StringField_Update_Next = string;
export type Web_SchemaForm_StringField_Update_Returns = void;
export type Web_SchemaForm_StringField_Update = (next: Web_SchemaForm_StringField_Update_Next) => Web_SchemaForm_StringField_Update_Returns;
export type Web_SchemaForm_StringField_Options = string[];
export type Web_SchemaForm_StringField_Variables = Web_Schema_Variable[];
export type Web_SchemaForm_StringField_Insert_Token = string;
export type Web_SchemaForm_StringField_Insert_Returns = void;
export type Web_SchemaForm_StringField_Insert = (token: Web_SchemaForm_StringField_Insert_Token) => Web_SchemaForm_StringField_Insert_Returns;
export type Web_SchemaForm_StringField_Insert_Element = HTMLTextAreaElement | null;
export type Web_SchemaForm_StringField_Insert_Start = number;
export type Web_SchemaForm_StringField_Insert_End = number;
export type Web_SchemaForm_StringField_Insert_Next = string;
export type Web_SchemaForm_StringField_InputType = string;
export type Web_SchemaForm_StringField_InputMode = 'numeric' | 'text' | 'url';
export type Web_SchemaForm_StringField_Placeholder = string | undefined;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_TimeZoneOptions_Returns = ReactElement;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_TimeZones_Returns = string[];

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_UnionField_Props = Web_Components_UnionField_Props;
export type Web_SchemaForm_UnionField_Returns = ReactElement;
export type Web_SchemaForm_UnionField_Context = Web_Components_UnionField_Props['context'];
export type Web_SchemaForm_UnionField_Label = Web_Components_UnionField_Props['label'];
export type Web_SchemaForm_UnionField_OnChange = Web_Components_UnionField_Props['onChange'];
export type Web_SchemaForm_UnionField_OnRemove = Web_Components_UnionField_Props['onRemove'];
export type Web_SchemaForm_UnionField_Path = Web_Components_UnionField_Props['path'];
export type Web_SchemaForm_UnionField_Schema = Web_Components_UnionField_Props['schema'];
export type Web_SchemaForm_UnionField_Union = Web_Components_UnionField_Props['union'];
export type Web_SchemaForm_UnionField_Value = Web_Components_UnionField_Props['value'];
export type Web_SchemaForm_UnionField_Index = number;
export type Web_SchemaForm_UnionField_Option = Web_Schema_Node;
export type Web_SchemaForm_UnionField_Record = Record<string, unknown>;
export type Web_SchemaForm_UnionField_DiscriminatorSchema = Web_Schema_Node | undefined;
export type Web_SchemaForm_UnionField_DiscriminatorTitle = string | undefined;
export type Web_SchemaForm_UnionField_DiscriminatorLabel = string;
export type Web_SchemaForm_UnionField_Issue = string;
export type Web_SchemaForm_UnionField_Body = ReactElement;
export type Web_SchemaForm_UnionField_NextOption = Web_Schema_Node | undefined;
export type Web_SchemaForm_UnionField_Constant = unknown;

/**
 * Schema Form.
 *
 * @since 4.2.1
 */
export type Web_SchemaForm_VariableButtons_Props = Web_Components_VariableButtons_Props;
export type Web_SchemaForm_VariableButtons_Returns = ReactElement;
export type Web_SchemaForm_VariableButtons_OnInsert = Web_Components_VariableButtons_Props['onInsert'];
export type Web_SchemaForm_VariableButtons_Variables = Web_Components_VariableButtons_Props['variables'];
export type Web_SchemaForm_VariableButtons_Token = string;
export type Web_SchemaForm_VariableButtons_Description = string | undefined;
