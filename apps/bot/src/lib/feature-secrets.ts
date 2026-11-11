import { randomBytes } from 'node:crypto';

import type {
  Lib_FeatureSecrets_AppendSecretReferences_ChildPointer,
  Lib_FeatureSecrets_AppendSecretReferences_Entry,
  Lib_FeatureSecrets_AppendSecretReferences_Node,
  Lib_FeatureSecrets_AppendSecretReferences_Pointer,
  Lib_FeatureSecrets_AppendSecretReferences_References,
  Lib_FeatureSecrets_AppendSecretReferences_Returns,
  Lib_FeatureSecrets_AppendSecretReferences_SecretKey,
  Lib_FeatureSecrets_BlankSecretReferences_Copy,
  Lib_FeatureSecrets_BlankSecretReferences_Returns,
  Lib_FeatureSecrets_BlankSecretReferences_Value,
  Lib_FeatureSecrets_CollectSecretReferences_References,
  Lib_FeatureSecrets_CollectSecretReferences_Returns,
  Lib_FeatureSecrets_CollectSecretReferences_Value,
  Lib_FeatureSecrets_CreateSecretKey_FeatureKey,
  Lib_FeatureSecrets_CreateSecretKey_Returns,
  Lib_FeatureSecrets_EncodePointerSegment_Returns,
  Lib_FeatureSecrets_EncodePointerSegment_Segment,
  Lib_FeatureSecrets_IsRecord_Record,
  Lib_FeatureSecrets_IsRecord_Value,
  Lib_FeatureSecrets_IsSecretReference_Object,
  Lib_FeatureSecrets_IsSecretReference_Value,
  Lib_FeatureSecrets_PointerToPath_Pointer,
  Lib_FeatureSecrets_PointerToPath_Returns,
  Lib_FeatureSecrets_ReadJsonPointer_Child,
  Lib_FeatureSecrets_ReadJsonPointer_Current,
  Lib_FeatureSecrets_ReadJsonPointer_Index,
  Lib_FeatureSecrets_ReadJsonPointer_Pointer,
  Lib_FeatureSecrets_ReadJsonPointer_Returns,
  Lib_FeatureSecrets_ReadJsonPointer_Segments,
  Lib_FeatureSecrets_ReadJsonPointer_Value,
} from '../types/lib/feature-secrets.d.ts';

/**
 * Feature Secrets - Blank Secret References.
 *
 * Copies a configuration with every secret reference emptied, for use as an example.
 * The copy never points at a stored secret, so saving it asks for real values.
 *
 * @param {Lib_FeatureSecrets_BlankSecretReferences_Value} value - Value.
 *
 * @returns {Lib_FeatureSecrets_BlankSecretReferences_Returns}
 *
 * @since 4.0.0
 */
export function blankSecretReferences(value: Lib_FeatureSecrets_BlankSecretReferences_Value): Lib_FeatureSecrets_BlankSecretReferences_Returns {
  const copy: Lib_FeatureSecrets_BlankSecretReferences_Copy = structuredClone(value);

  for (const reference of collectSecretReferences(copy)) {
    const node: Lib_FeatureSecrets_ReadJsonPointer_Returns = readJsonPointer(copy, reference['pointer']);

    if (isRecord(node) === true) {
      Reflect.set(node, '$secret', '');
    }
  }

  return copy;
}

/**
 * Feature Secrets - Collect Secret References.
 *
 * Finds every `{ "$secret": "<key>" }` object in a configuration, with its JSON pointer.
 * Empty references are included so callers can ask for their values.
 *
 * @param {Lib_FeatureSecrets_CollectSecretReferences_Value} value - Value.
 *
 * @returns {Lib_FeatureSecrets_CollectSecretReferences_Returns}
 *
 * @since 4.0.0
 */
export function collectSecretReferences(value: Lib_FeatureSecrets_CollectSecretReferences_Value): Lib_FeatureSecrets_CollectSecretReferences_Returns {
  const references: Lib_FeatureSecrets_CollectSecretReferences_References = [];

  appendSecretReferences(value, '', references);

  return references;
}

/**
 * Feature Secrets - Create Secret Key.
 *
 * Names a new secret after its feature plus random hex, like "message-proxies:3f9a0c1d…".
 * A fresh key per value means two rows can never share one secret.
 *
 * @param {Lib_FeatureSecrets_CreateSecretKey_FeatureKey} featureKey - Feature key.
 *
 * @returns {Lib_FeatureSecrets_CreateSecretKey_Returns}
 *
 * @since 4.0.0
 */
export function createSecretKey(featureKey: Lib_FeatureSecrets_CreateSecretKey_FeatureKey): Lib_FeatureSecrets_CreateSecretKey_Returns {
  return `${featureKey}:${randomBytes(8).toString('hex')}`;
}

/**
 * Feature Secrets - Is Secret Reference.
 *
 * Reports whether a value is a `{ "$secret": "<key>" }` object, even one with an empty key.
 * Only these objects can take a new secret value.
 *
 * @param {Lib_FeatureSecrets_IsSecretReference_Value} value - Value.
 *
 * @returns {Lib_FeatureSecrets_IsSecretReference_Returns}
 *
 * @since 4.0.0
 */
export function isSecretReference(value: Lib_FeatureSecrets_IsSecretReference_Value): value is Lib_FeatureSecrets_IsSecretReference_Object {
  return (
    isRecord(value) === true
    && typeof value['$secret'] === 'string'
  );
}

/**
 * Feature Secrets - Pointer To Path.
 *
 * Turns a JSON pointer such as "/0/webhook/url" into path segments for error issues.
 * The ~1 and ~0 escapes become "/" and "~" again.
 *
 * @param {Lib_FeatureSecrets_PointerToPath_Pointer} pointer - Pointer.
 *
 * @returns {Lib_FeatureSecrets_PointerToPath_Returns}
 *
 * @since 4.0.0
 */
export function pointerToPath(pointer: Lib_FeatureSecrets_PointerToPath_Pointer): Lib_FeatureSecrets_PointerToPath_Returns {
  if (pointer === '') {
    return [];
  }

  return pointer.slice(1).split('/').map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'));
}

/**
 * Feature Secrets - Read JSON Pointer.
 *
 * Follows a JSON pointer into a configuration and returns the value there, if any.
 * Pointers that don't start with "/" or leave the structure return undefined.
 *
 * @param {Lib_FeatureSecrets_ReadJsonPointer_Value}   value   - Value.
 * @param {Lib_FeatureSecrets_ReadJsonPointer_Pointer} pointer - Pointer.
 *
 * @returns {Lib_FeatureSecrets_ReadJsonPointer_Returns}
 *
 * @since 4.0.0
 */
export function readJsonPointer(value: Lib_FeatureSecrets_ReadJsonPointer_Value, pointer: Lib_FeatureSecrets_ReadJsonPointer_Pointer): Lib_FeatureSecrets_ReadJsonPointer_Returns {
  if (pointer === '') {
    return value;
  }

  if (pointer.startsWith('/') === false) {
    return undefined;
  }

  const segments: Lib_FeatureSecrets_ReadJsonPointer_Segments = pointerToPath(pointer);
  let current: Lib_FeatureSecrets_ReadJsonPointer_Current = value;

  for (const segment of segments) {
    let child: Lib_FeatureSecrets_ReadJsonPointer_Child = undefined;

    if (Array.isArray(current) === true) {
      const index: Lib_FeatureSecrets_ReadJsonPointer_Index = Number(segment);

      child = (Number.isInteger(index) === true && String(index) === segment) ? current[index] : undefined;
    } else if (isRecord(current) === true && Object.hasOwn(current, segment) === true) {
      child = current[segment];
    }

    if (child === undefined) {
      return undefined;
    }

    current = child;
  }

  return current;
}

/**
 * Feature Secrets - Append Secret References.
 *
 * Walks one value and adds the secret references inside it, in order.
 * A secret reference object is recorded whole and not walked into.
 *
 * @param {Lib_FeatureSecrets_AppendSecretReferences_Node}       node       - Node.
 * @param {Lib_FeatureSecrets_AppendSecretReferences_Pointer}    pointer    - Pointer.
 * @param {Lib_FeatureSecrets_AppendSecretReferences_References} references - References.
 *
 * @private
 *
 * @returns {Lib_FeatureSecrets_AppendSecretReferences_Returns}
 *
 * @since 4.0.0
 */
function appendSecretReferences(node: Lib_FeatureSecrets_AppendSecretReferences_Node, pointer: Lib_FeatureSecrets_AppendSecretReferences_Pointer, references: Lib_FeatureSecrets_AppendSecretReferences_References): Lib_FeatureSecrets_AppendSecretReferences_Returns {
  if (Array.isArray(node) === true) {
    node.forEach((child, index) => {
      appendSecretReferences(child, `${pointer}/${index}`, references);

      return;
    });

    return;
  }

  if (isRecord(node) === false) {
    return;
  }

  const secretKey: Lib_FeatureSecrets_AppendSecretReferences_SecretKey = node['$secret'];

  if (typeof secretKey === 'string') {
    references.push({
      key: secretKey,
      pointer,
    });

    return;
  }

  for (const entry of Object.entries(node)) {
    const typedEntry: Lib_FeatureSecrets_AppendSecretReferences_Entry = entry;
    const childPointer: Lib_FeatureSecrets_AppendSecretReferences_ChildPointer = `${pointer}/${encodePointerSegment(typedEntry[0])}`;

    appendSecretReferences(typedEntry[1], childPointer, references);
  }

  return;
}

/**
 * Feature Secrets - Encode Pointer Segment.
 *
 * Escapes "~" and "/" in one property name for use in a JSON pointer.
 * Other characters stay as they are.
 *
 * @param {Lib_FeatureSecrets_EncodePointerSegment_Segment} segment - Segment.
 *
 * @private
 *
 * @returns {Lib_FeatureSecrets_EncodePointerSegment_Returns}
 *
 * @since 4.0.0
 */
function encodePointerSegment(segment: Lib_FeatureSecrets_EncodePointerSegment_Segment): Lib_FeatureSecrets_EncodePointerSegment_Returns {
  return segment.replaceAll('~', '~0').replaceAll('/', '~1');
}

/**
 * Feature Secrets - Is Record.
 *
 * Narrows unknown configuration values to plain objects.
 * Arrays and null values are excluded.
 *
 * @param {Lib_FeatureSecrets_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_FeatureSecrets_IsRecord_Returns}
 *
 * @since 4.0.0
 */
function isRecord(value: Lib_FeatureSecrets_IsRecord_Value): value is Lib_FeatureSecrets_IsRecord_Record {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}
