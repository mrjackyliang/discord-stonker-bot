export type Lib_FeatureSecrets_SecretReference_Key = string;
export type Lib_FeatureSecrets_SecretReference_Pointer = string;
export type Lib_FeatureSecrets_SecretReference = {
  key: Lib_FeatureSecrets_SecretReference_Key;
  pointer: Lib_FeatureSecrets_SecretReference_Pointer;
};
export type Lib_FeatureSecrets_SecretReferences = Lib_FeatureSecrets_SecretReference[];
export type Lib_FeatureSecrets_SecretObject_Secret = string;
export type Lib_FeatureSecrets_SecretObject = {
  $secret: Lib_FeatureSecrets_SecretObject_Secret;
};

export type Lib_FeatureSecrets_AppendSecretReferences_Node = unknown;
export type Lib_FeatureSecrets_AppendSecretReferences_Pointer = string;
export type Lib_FeatureSecrets_AppendSecretReferences_References = Lib_FeatureSecrets_SecretReferences;
export type Lib_FeatureSecrets_AppendSecretReferences_Returns = void;
export type Lib_FeatureSecrets_AppendSecretReferences_SecretKey = unknown;
export type Lib_FeatureSecrets_AppendSecretReferences_Entry = [string, unknown];
export type Lib_FeatureSecrets_AppendSecretReferences_ChildPointer = string;

export type Lib_FeatureSecrets_BlankSecretReferences_Value = unknown;
export type Lib_FeatureSecrets_BlankSecretReferences_Returns = unknown;
export type Lib_FeatureSecrets_BlankSecretReferences_Copy = unknown;

export type Lib_FeatureSecrets_CollectSecretReferences_Value = unknown;
export type Lib_FeatureSecrets_CollectSecretReferences_Returns = Lib_FeatureSecrets_SecretReferences;
export type Lib_FeatureSecrets_CollectSecretReferences_References = Lib_FeatureSecrets_SecretReferences;

export type Lib_FeatureSecrets_CreateSecretKey_FeatureKey = string;
export type Lib_FeatureSecrets_CreateSecretKey_Returns = string;

export type Lib_FeatureSecrets_EncodePointerSegment_Segment = string;
export type Lib_FeatureSecrets_EncodePointerSegment_Returns = string;

export type Lib_FeatureSecrets_IsRecord_Value = unknown;
export type Lib_FeatureSecrets_IsRecord_Record = Record<string, unknown>;
export type Lib_FeatureSecrets_IsRecord_Returns = boolean;

export type Lib_FeatureSecrets_IsSecretReference_Value = unknown;
export type Lib_FeatureSecrets_IsSecretReference_Object = Lib_FeatureSecrets_SecretObject;
export type Lib_FeatureSecrets_IsSecretReference_Returns = boolean;

export type Lib_FeatureSecrets_PointerToPath_Pointer = string;
export type Lib_FeatureSecrets_PointerToPath_Returns = string[];

export type Lib_FeatureSecrets_Test_Configuration = Record<string, unknown>;
export type Lib_FeatureSecrets_Test_SecretKey = string;

export type Lib_FeatureSecrets_ReadJsonPointer_Value = unknown;
export type Lib_FeatureSecrets_ReadJsonPointer_Pointer = string;
export type Lib_FeatureSecrets_ReadJsonPointer_Returns = unknown;
export type Lib_FeatureSecrets_ReadJsonPointer_Segments = string[];
export type Lib_FeatureSecrets_ReadJsonPointer_Current = unknown;
export type Lib_FeatureSecrets_ReadJsonPointer_Child = unknown;
export type Lib_FeatureSecrets_ReadJsonPointer_Index = number;
