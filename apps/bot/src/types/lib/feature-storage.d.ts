export type Lib_FeatureStorage_FeatureValueType =
  | 'array'
  | 'boolean'
  | 'null'
  | 'number'
  | 'object'
  | 'string';

export type Lib_FeatureStorage_FeatureValueRow_Path = string;
export type Lib_FeatureStorage_FeatureValueRow_Type = Lib_FeatureStorage_FeatureValueType;
export type Lib_FeatureStorage_FeatureValueRow_Value = string | undefined;
export type Lib_FeatureStorage_FeatureValueRow = {
  path: Lib_FeatureStorage_FeatureValueRow_Path;
  type: Lib_FeatureStorage_FeatureValueRow_Type;
  value: Lib_FeatureStorage_FeatureValueRow_Value;
};

export type Lib_FeatureStorage_AppendFeatureValue_Value = unknown;
export type Lib_FeatureStorage_AppendFeatureValue_Path = string;
export type Lib_FeatureStorage_AppendFeatureValue_Rows = Lib_FeatureStorage_FeatureValueRow[];
export type Lib_FeatureStorage_AppendFeatureValue_Returns = void;
export type Lib_FeatureStorage_AppendFeatureValue_ValueType = string;
export type Lib_FeatureStorage_AppendFeatureValue_Entries = [string, unknown][];
export type Lib_FeatureStorage_AppendFeatureValue_Entry = [string, unknown];
export type Lib_FeatureStorage_AppendFeatureValue_EntryKey = string;
export type Lib_FeatureStorage_AppendFeatureValue_EntryValue = unknown;
export type Lib_FeatureStorage_AppendFeatureValue_ChildPath = string;
export type Lib_FeatureStorage_AppendFeatureValue_SerializedValue = string;

export type Lib_FeatureStorage_CreateStoredValue_Row = Lib_FeatureStorage_FeatureValueRow;
export type Lib_FeatureStorage_CreateStoredValue_Returns = unknown;
export type Lib_FeatureStorage_CreateStoredValue_ParsedNumber = number;

export type Lib_FeatureStorage_DecodePath_Path = string;
export type Lib_FeatureStorage_DecodePath_Returns = string[];
export type Lib_FeatureStorage_DecodePath_Segments = string[];

export type Lib_FeatureStorage_EncodePathSegment_Segment = string;
export type Lib_FeatureStorage_EncodePathSegment_Returns = string;

export type Lib_FeatureStorage_FlattenFeatureConfiguration_Configuration = unknown;
export type Lib_FeatureStorage_FlattenFeatureConfiguration_Returns = Lib_FeatureStorage_FeatureValueRow[];
export type Lib_FeatureStorage_FlattenFeatureConfiguration_Rows = Lib_FeatureStorage_FeatureValueRow[];

export type Lib_FeatureStorage_InflateFeatureConfiguration_Rows = readonly Lib_FeatureStorage_FeatureValueRow[];
export type Lib_FeatureStorage_InflateFeatureConfiguration_Returns = unknown;
export type Lib_FeatureStorage_InflateFeatureConfiguration_RootRow = Lib_FeatureStorage_FeatureValueRow | undefined;
export type Lib_FeatureStorage_InflateFeatureConfiguration_Root = unknown;
export type Lib_FeatureStorage_InflateFeatureConfiguration_SortedRows = Lib_FeatureStorage_FeatureValueRow[];
export type Lib_FeatureStorage_InflateFeatureConfiguration_Segments = string[];
export type Lib_FeatureStorage_InflateFeatureConfiguration_Parent = unknown;
export type Lib_FeatureStorage_InflateFeatureConfiguration_Segment = string;
export type Lib_FeatureStorage_InflateFeatureConfiguration_Child = unknown;
export type Lib_FeatureStorage_InflateFeatureConfiguration_FinalSegment = string;
export type Lib_FeatureStorage_InflateFeatureConfiguration_Value = unknown;

export type Lib_FeatureStorage_IsRecord_Value = unknown;
export type Lib_FeatureStorage_IsRecord_Record = Record<string, unknown>;
