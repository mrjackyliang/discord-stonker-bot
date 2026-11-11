import type { Web_Api_Server } from './api.d.ts';
import type { Web_BackupComponents_ImportProgressJob } from './backup-components.d.ts';

export type Web_Backup_Purpose = 'export' | 'import';
export type Web_Backup_SectionId = 'connection' | 'features' | 'notifications' | 'accessTokens';
export type Web_Backup_ExportSections = Record<Web_Backup_SectionId, boolean>;
export type Web_Backup_Connection = {
  botToken: string | null;
  desiredState: 'running' | 'stopped';
};
export type Web_Backup_Feature = {
  configuration: unknown;
  enabled: boolean;
  key: string;
  secrets: Record<string, string>;
};
export type Web_Backup_ServerFeatures = {
  features: Web_Backup_Feature[];
  serverId: string;
  timeZone: string;
};
export type Web_Backup_Notification = {
  events: string[];
  id: string;
  name: string;
  secrets: Record<string, string>;
  service: 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';
  settings: Record<string, string>;
};
export type Web_Backup_AccessToken = {
  expiresAt: string | null;
  id: string;
  name: string;
  scopes: Array<'bot:control' | 'features:read' | 'features:write' | 'logs:read'>;
  tokenHash: string;
};
export type Web_Backup_Document = {
  accessTokens?: Web_Backup_AccessToken[] | undefined;
  appVersion: string;
  connection?: Web_Backup_Connection | undefined;
  exportedAt: string;
  features?: Web_Backup_ServerFeatures[] | undefined;
  format: 'discord-stonker-bot-export';
  notifications?: Web_Backup_Notification[] | undefined;
  version: 1;
};
export type Web_Backup_ExportSource = {
  document: Web_Backup_Document;
  type: 'export';
};
export type Web_Backup_LegacySource = {
  configuration: string;
  enableFeatures: boolean;
  serverId: string;
  type: 'legacy';
};
export type Web_Backup_ImportSource = Web_Backup_ExportSource | Web_Backup_LegacySource;
export type Web_Backup_Grant = {
  expiresAt: string;
  grant: string;
};
export type Web_Backup_ExcludedItem = {
  id: string;
  label: string;
  reason: string;
};
export type Web_Backup_ImportSectionPreview = {
  file: string;
  here: string;
  id: Web_Backup_SectionId;
  label: string;
  reason?: string | undefined;
  willImport: boolean;
};
export type Web_Backup_ImportSummary = {
  accessTokens: {
    added: number;
    skipped: number;
  };
  connection: 'added' | 'replaced' | 'skipped';
  features: {
    features: number;
    servers: number;
  };
  notifications: {
    added: number;
    replaced: number;
  };
};
export type Web_Backup_LegacyPreview = {
  featuresRequiringFixes: Web_Backup_ExcludedItem[];
  featuresThatTurnOn: number;
};
export type Web_Backup_ImportPreview = {
  appVersion: string | null;
  excluded: Web_Backup_ExcludedItem[];
  exportedAt: string | null;
  legacy?: Web_Backup_LegacyPreview | undefined;
  sections: Web_Backup_ImportSectionPreview[];
  source: 'export' | 'legacy';
  summary: Web_Backup_ImportSummary;
};
export type Web_Backup_ImportResult = Web_Backup_ImportSummary & {
  importedSections: Web_Backup_SectionId[];
};
export type Web_Backup_ViewStep = 'source' | 'settings' | 'review' | 'confirm' | 'importing';
export type Web_Backup_SourceType = 'export' | 'legacy';
export type Web_Backup_ViewProps = {
  onImported: () => Promise<void>;
  server: Web_Api_Server | undefined;
};
export type Web_Backup_ProgressJob = Web_BackupComponents_ImportProgressJob;
