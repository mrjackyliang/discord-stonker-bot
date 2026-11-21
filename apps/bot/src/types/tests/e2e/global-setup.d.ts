/**
 * Global Setup.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_ContainerName = string;
export type Tests_E2e_GlobalSetup_ControlPanelUrlValue = string;
export type Tests_E2e_GlobalSetup_ImageName = string;
export type Tests_E2e_GlobalSetup_VolumeName = string;

/**
 * Global Setup - Check Key Migration.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_CheckKeyMigration_LegacyKeyDigest = string;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_Returns = void;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_Canonical = boolean;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_Digest = string;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_DirectoryMode = string;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_FileMode = string;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_Length = number;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_SecretsExists = boolean;
export type Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport = {
  canonical: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_Canonical;
  digest: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_Digest;
  directoryMode: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_DirectoryMode;
  fileMode: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_FileMode;
  length: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_Length;
  secretsExists: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport_SecretsExists;
};

/**
 * Global Setup - Check Listening Ports.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_CheckListeningPorts_Returns = void;
export type Tests_E2e_GlobalSetup_CheckListeningPorts_TcpTables = string;
export type Tests_E2e_GlobalSetup_CheckListeningPorts_ListeningPorts = Set<number>;
export type Tests_E2e_GlobalSetup_CheckListeningPorts_TcpFields = string[];
export type Tests_E2e_GlobalSetup_CheckListeningPorts_LocalAddress = string;
export type Tests_E2e_GlobalSetup_CheckListeningPorts_LocalPort = number;
export type Tests_E2e_GlobalSetup_CheckListeningPorts_UnexpectedPorts = number[];

/**
 * Global Setup - Remove Container.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_RemoveContainer_Returns = void;

/**
 * Global Setup - Seed Discord Server.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_SeedDiscordServer_Returns = void;
export type Tests_E2e_GlobalSetup_SeedDiscordServer_SeedSql = string;

/**
 * Global Setup - Seed Legacy Credential Key.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_SeedLegacyCredentialKey_Returns = string;

/**
 * Global Setup - Setup Control Panel E2e.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_SetupControlPanelE2e_Returns = Promise<void>;
export type Tests_E2e_GlobalSetup_SetupControlPanelE2e_ControlPanelUrl = URL;
export type Tests_E2e_GlobalSetup_SetupControlPanelE2e_PublishedHost = string;
export type Tests_E2e_GlobalSetup_SetupControlPanelE2e_PublishedPort = string;
export type Tests_E2e_GlobalSetup_SetupControlPanelE2e_LegacyKeyDigest = string;
export type Tests_E2e_GlobalSetup_SetupControlPanelE2e_Ready = boolean;

/**
 * Global Setup - Wait Until Ready.
 *
 * @since 4.2.1
 */
export type Tests_E2e_GlobalSetup_WaitUntilReady_Attempt = number;

export type Tests_E2e_GlobalSetup_WaitUntilReady_Returns = Promise<boolean>;

export type Tests_E2e_GlobalSetup_WaitUntilReady_Ready = boolean;

export type Tests_E2e_GlobalSetup_WaitUntilReady_Response = Response;
