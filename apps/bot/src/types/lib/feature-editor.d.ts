import type { z } from 'zod';

import type {
  Shared_FeatureDefinition,
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_FeatureEditor_Node = Record<string, unknown>;
export type Lib_FeatureEditor_Editor = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_Widget = 'channel' | 'discord-id' | 'pattern' | 'role' | 'textarea' | 'time-zone' | 'url' | 'variables';
export type Lib_FeatureEditor_IdentifierWidget = 'channel' | 'discord-id' | 'role';
export type Lib_FeatureEditor_TemplateVariable_Description = string;
export type Lib_FeatureEditor_TemplateVariable_Token = string;
export type Lib_FeatureEditor_TemplateVariable = {
  description: Lib_FeatureEditor_TemplateVariable_Description;
  token: Lib_FeatureEditor_TemplateVariable_Token;
};
export type Lib_FeatureEditor_Section_Description = string;
export type Lib_FeatureEditor_Section_Key = string;
export type Lib_FeatureEditor_Section_Title = string;
export type Lib_FeatureEditor_Section = {
  description: Lib_FeatureEditor_Section_Description;
  key: Lib_FeatureEditor_Section_Key;
  title: Lib_FeatureEditor_Section_Title;
};
export type Lib_FeatureEditor_Presentation_ItemLabel = string;
export type Lib_FeatureEditor_Presentation_Sections = Lib_FeatureEditor_Section[];
export type Lib_FeatureEditor_Presentation = {
  itemLabel: Lib_FeatureEditor_Presentation_ItemLabel;
  sections: Lib_FeatureEditor_Presentation_Sections;
};
export type Lib_FeatureEditor_Context_Depth = number;
export type Lib_FeatureEditor_Context_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureEditor_Context_ItemLabel = string;
export type Lib_FeatureEditor_Context_Key = string | undefined;
export type Lib_FeatureEditor_Context = {
  depth: Lib_FeatureEditor_Context_Depth;
  featureKey: Lib_FeatureEditor_Context_FeatureKey;
  itemLabel: Lib_FeatureEditor_Context_ItemLabel;
  key: Lib_FeatureEditor_Context_Key;
  presentation: Lib_FeatureEditor_Presentation;
};

export type Lib_FeatureEditor_FeatureSchemas = Record<Shared_FeatureKey, z.ZodType>;
export type Lib_FeatureEditor_FieldLabels = Record<string, string | undefined>;
export type Lib_FeatureEditor_DescribedFields = Record<string, string | undefined>;
export type Lib_FeatureEditor_IgnoredFields = string[];
export type Lib_FeatureEditor_EnumLabels = Record<string, string | undefined>;
export type Lib_FeatureEditor_ItemLabels = Record<string, string | undefined>;
export type Lib_FeatureEditor_ItemTitleKeys = string[];
export type Lib_FeatureEditor_DiscordIdentifierWidgets = Record<string, Lib_FeatureEditor_IdentifierWidget | undefined>;
export type Lib_FeatureEditor_VariableFields = string[];
export type Lib_FeatureEditor_TemplateVariables = Lib_FeatureEditor_TemplateVariable[];
export type Lib_FeatureEditor_FeatureVariableTokens = Partial<Record<Shared_FeatureKey, string[]>>;
export type Lib_FeatureEditor_IgnoredFeatureFields = Partial<Record<Shared_FeatureKey, string[]>>;
export type Lib_FeatureEditor_Presentations = Record<Shared_FeatureKey, Lib_FeatureEditor_Presentation>;
export type Lib_FeatureEditor_PermissionNames = string[];
export type Lib_FeatureEditor_EditorCache = Map<Shared_FeatureKey, Lib_FeatureEditor_Editor>;

export type Lib_FeatureEditor_GetFeatureEditor_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureEditor_GetFeatureEditor_Returns = Lib_FeatureEditor_Editor;
export type Lib_FeatureEditor_GetFeatureEditor_Cached = Lib_FeatureEditor_Editor | undefined;
export type Lib_FeatureEditor_GetFeatureEditor_Editor = Lib_FeatureEditor_Editor;

export type Lib_FeatureEditor_GetFeatureExample_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureEditor_GetFeatureExample_StarterSettings = Shared_JsonObject;
export type Lib_FeatureEditor_GetFeatureExample_Returns = unknown;
export type Lib_FeatureEditor_GetFeatureExample_Features = unknown;
export type Lib_FeatureEditor_GetFeatureExample_Feature = unknown;

export type Lib_FeatureEditor_GetFeatureSchema_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureEditor_GetFeatureSchema_Returns = z.ZodType;

export type Lib_FeatureEditor_GetMessageVariables_Returns = Lib_FeatureEditor_TemplateVariables;
export type Lib_FeatureEditor_GetFeatureMessageVariables_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureEditor_GetFeatureMessageVariables_Returns = Lib_FeatureEditor_TemplateVariables;
export type Lib_FeatureEditor_GetFeatureMessageVariables_Tokens = string[];

export type Lib_FeatureEditor_BuildFeatureEditor_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureEditor_BuildFeatureEditor_Returns = Lib_FeatureEditor_Editor;
export type Lib_FeatureEditor_BuildFeatureEditor_Definition = Shared_FeatureDefinition;
export type Lib_FeatureEditor_BuildFeatureEditor_Presentation = Lib_FeatureEditor_Presentation;
export type Lib_FeatureEditor_BuildFeatureEditor_Editor = Lib_FeatureEditor_Editor;

export type Lib_FeatureEditor_CreateEnumLabel_Value = string;
export type Lib_FeatureEditor_CreateEnumLabel_Returns = string;
export type Lib_FeatureEditor_CreateEnumLabel_Override = string | undefined;

export type Lib_FeatureEditor_CreateItemLabel_Key = string;
export type Lib_FeatureEditor_CreateItemLabel_Label = string;
export type Lib_FeatureEditor_CreateItemLabel_Returns = string;
export type Lib_FeatureEditor_CreateItemLabel_Override = string | undefined;

export type Lib_FeatureEditor_CreateLabel_Key = string;
export type Lib_FeatureEditor_CreateLabel_Returns = string;
export type Lib_FeatureEditor_CreateLabel_Override = string | undefined;
export type Lib_FeatureEditor_CreateLabel_Phrase = string;

export type Lib_FeatureEditor_CreateSections_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_CreateSections_Presentation = Lib_FeatureEditor_Presentation;
export type Lib_FeatureEditor_CreateSections_Returns = Lib_FeatureEditor_Section[];
export type Lib_FeatureEditor_CreateSections_Properties = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_CreateSections_Keys = string[];
export type Lib_FeatureEditor_CreateSections_Sections = Lib_FeatureEditor_Section[];
export type Lib_FeatureEditor_CreateSections_Key = string;
export type Lib_FeatureEditor_CreateSections_Section = Lib_FeatureEditor_Section | undefined;

export type Lib_FeatureEditor_DecorateArray_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateArray_Context = Lib_FeatureEditor_Context;
export type Lib_FeatureEditor_DecorateArray_Returns = void;
export type Lib_FeatureEditor_DecorateArray_Items = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateArray_ItemProperties = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateArray_PropertyKeys = string[];
export type Lib_FeatureEditor_DecorateArray_ObjectRows = boolean;
export type Lib_FeatureEditor_DecorateArray_Key = string;
export type Lib_FeatureEditor_DecorateArray_ItemLabel = string | undefined;
export type Lib_FeatureEditor_DecorateArray_TitleKey = string | undefined;
export type Lib_FeatureEditor_DecorateArray_IdentifierKey = string;
export type Lib_FeatureEditor_DecorateArray_ListWidget = Lib_FeatureEditor_IdentifierWidget | undefined;

export type Lib_FeatureEditor_DecorateNode_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateNode_Context = Lib_FeatureEditor_Context;
export type Lib_FeatureEditor_DecorateNode_Returns = void;

export type Lib_FeatureEditor_DecorateObject_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateObject_Context = Lib_FeatureEditor_Context;
export type Lib_FeatureEditor_DecorateObject_Returns = void;
export type Lib_FeatureEditor_DecorateObject_Properties = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateObject_PropertyKeys = string[];
export type Lib_FeatureEditor_DecorateObject_Entry = [string, unknown];
export type Lib_FeatureEditor_DecorateObject_EntryKey = string;
export type Lib_FeatureEditor_DecorateObject_EntryValue = unknown;
export type Lib_FeatureEditor_DecorateObject_ChildNode = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateObject_SectionTitle = Lib_FeatureEditor_Section | undefined;
export type Lib_FeatureEditor_DecorateObject_Description = string | undefined;
export type Lib_FeatureEditor_DecorateObject_ChildContext = Lib_FeatureEditor_Context;
export type Lib_FeatureEditor_DecorateObject_OnlyChild = unknown;

export type Lib_FeatureEditor_DecorateScalar_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateScalar_Context = Lib_FeatureEditor_Context;
export type Lib_FeatureEditor_DecorateScalar_Returns = void;
export type Lib_FeatureEditor_DecorateScalar_Key = string;
export type Lib_FeatureEditor_DecorateScalar_Type = unknown;
export type Lib_FeatureEditor_DecorateScalar_EnumValues = unknown;
export type Lib_FeatureEditor_DecorateScalar_EnumLabels = Record<string, string>;
export type Lib_FeatureEditor_DecorateScalar_Format = unknown;
export type Lib_FeatureEditor_DecorateScalar_MaxLength = unknown;
export type Lib_FeatureEditor_DecorateScalar_Widget = Lib_FeatureEditor_Widget | undefined;

export type Lib_FeatureEditor_DecorateUnion_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateUnion_Context = Lib_FeatureEditor_Context;
export type Lib_FeatureEditor_DecorateUnion_Returns = void;
export type Lib_FeatureEditor_DecorateUnion_Options = Lib_FeatureEditor_Node[];
export type Lib_FeatureEditor_DecorateUnion_Discriminator = string | undefined;
export type Lib_FeatureEditor_DecorateUnion_OptionProperties = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_DecorateUnion_OptionValue = unknown;

export type Lib_FeatureEditor_FindDiscriminator_Options = Lib_FeatureEditor_Node[];
export type Lib_FeatureEditor_FindDiscriminator_Returns = string | undefined;
export type Lib_FeatureEditor_FindDiscriminator_FirstOption = Lib_FeatureEditor_Node | undefined;
export type Lib_FeatureEditor_FindDiscriminator_FirstProperties = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_FindDiscriminator_Candidate = string;

export type Lib_FeatureEditor_GetRecord_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_GetRecord_Key = string;
export type Lib_FeatureEditor_GetRecord_Returns = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_GetRecord_Value = unknown;

export type Lib_FeatureEditor_GetRecordList_Node = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_GetRecordList_Key = string;
export type Lib_FeatureEditor_GetRecordList_Returns = Lib_FeatureEditor_Node[];
export type Lib_FeatureEditor_GetRecordList_Value = unknown;

export type Lib_FeatureEditor_IsRecord_Value = unknown;
export type Lib_FeatureEditor_IsRecord_Record = Lib_FeatureEditor_Node;
export type Lib_FeatureEditor_IsRecord_Returns = boolean;

export type Lib_FeatureEditor_Test_Editor = Lib_FeatureEditor_Editor;
