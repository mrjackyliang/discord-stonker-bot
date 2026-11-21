import type { ZodType } from 'zod';

import type { Web_Api_Schema } from '@/types/web/api.d.ts';
import type { Web_Backup_Document } from '@/types/web/backup.d.ts';
import type { Web_Notifications_ServiceDefinition } from '@/types/web/notifications.d.ts';

/**
 * Backup Format.
 *
 * @since 4.2.1
 */
export type Web_BackupFormat_BackupDocumentSchema = Web_Api_Schema<Web_Backup_Document>;
export type Web_BackupFormat_BackupDocumentSchema_ServerIds = string[];
export type Web_BackupFormat_BackupDocumentSchema_NotificationIds = string[];
export type Web_BackupFormat_BackupDocumentSchema_NotificationNames = string[];
export type Web_BackupFormat_BackupDocumentSchema_TokenIds = string[];
export type Web_BackupFormat_BackupDocumentSchema_TokenNames = string[];
export type Web_BackupFormat_BackupDocumentSchema_TokenHashes = string[];
export type Web_BackupFormat_BackupDocumentSchema_Groups = string[][];
export type Web_BackupFormat_BackupDocumentSchema_Keys = string[];

/**
 * Backup Format.
 *
 * @since 4.2.1
 */
export type Web_BackupFormat_CollectSecretReferences_Value = unknown;
export type Web_BackupFormat_CollectSecretReferences_Returns = Set<string>;
export type Web_BackupFormat_CollectSecretReferences_References = Set<string>;
export type Web_BackupFormat_CollectSecretReferences_Visit_Candidate = unknown;
export type Web_BackupFormat_CollectSecretReferences_Visit_Returns = void;
export type Web_BackupFormat_CollectSecretReferences_Visit = (candidate: Web_BackupFormat_CollectSecretReferences_Visit_Candidate) => Web_BackupFormat_CollectSecretReferences_Visit_Returns;
export type Web_BackupFormat_CollectSecretReferences_Visit_Record = Record<string, unknown>;

/**
 * Backup Format.
 *
 * @since 4.2.1
 */
export type Web_BackupFormat_FeatureSchema_References = Set<string>;

/**
 * Backup Format.
 *
 * @since 4.2.1
 */
export type Web_BackupFormat_JsonValueSchema = ZodType<unknown>;

/**
 * Backup Format.
 *
 * @since 4.2.1
 */
export type Web_BackupFormat_NotificationSchema_Service = Web_Notifications_ServiceDefinition | undefined;
export type Web_BackupFormat_NotificationSchema_PlainKeys = Set<string>;
export type Web_BackupFormat_NotificationSchema_SecretKeys = Set<string>;

/**
 * Backup Format.
 *
 * @since 4.2.1
 */
export type Web_BackupFormat_ParseBackupDocument_Value = unknown;
export type Web_BackupFormat_ParseBackupDocument_Returns = Web_Backup_Document;
