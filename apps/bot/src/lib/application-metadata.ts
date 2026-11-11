import { readFileSync } from 'node:fs';

import { z } from 'zod';

import type {
  Lib_ApplicationMetadata_Manifest,
  Lib_ApplicationMetadata_ManifestSchema,
  Lib_ApplicationMetadata_ParsedManifest,
  Lib_ApplicationMetadata_UserAgent,
  Lib_ApplicationMetadata_Version,
} from '../types/lib/application-metadata.d.ts';

/**
 * Application Metadata - Manifest Schema.
 *
 * Validates the package metadata fields used by runtime integrations.
 * Invalid or missing version metadata stops startup instead of sending a false version.
 *
 * @since 4.0.0
 */
const manifestSchema: Lib_ApplicationMetadata_ManifestSchema = z.object({
  version: z.string().trim().min(1).max(100),
});

/**
 * Application Metadata - Parsed Manifest.
 *
 * Reads the workspace-owned package manifest in source and compiled layouts.
 * Docker copies the same manifest beside the compiled application.
 *
 * @since 4.0.0
 */
const parsedManifest: Lib_ApplicationMetadata_ParsedManifest = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);

/**
 * Application Metadata - Manifest.
 *
 * Holds validated application metadata.
 * Only the bounded version field crosses this trust boundary.
 *
 * @since 4.0.0
 */
const manifest: Lib_ApplicationMetadata_Manifest = manifestSchema.parse(parsedManifest);

/**
 * Application Metadata - Application Version.
 *
 * Shares the package version with outbound integrations.
 * It therefore changes in the same edit as the release manifest.
 *
 * @since 4.0.0
 */
export const applicationVersion: Lib_ApplicationMetadata_Version = manifest['version'];

/**
 * Application Metadata - Application User Agent.
 *
 * Identifies provider requests with the current package version.
 * Providers receive no placeholder version that can silently drift.
 *
 * @since 4.0.0
 */
export const applicationUserAgent: Lib_ApplicationMetadata_UserAgent = `Discord-Stonker-Bot/${applicationVersion}`;
