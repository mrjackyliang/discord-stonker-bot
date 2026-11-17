import {
  existsSync,
  readFileSync,
} from 'node:fs';

import {
  describe,
  expect,
  it,
} from 'vitest';

import novaConfigJson from '../nova.config.json' with { type: 'json' };
import packageJson from '../package.json' with { type: 'json' };
import manifestJson from '../packages/docker/manifest.json' with { type: 'json' };
import dockerPackageJson from '../packages/docker/package.json' with { type: 'json' };

/**
 * Docker Architecture - Repository Appliance.
 *
 * Protects the one-image root contract and the private native s6 assembly.
 * Runtime details stay regression-tested independently from application code.
 *
 * @since 0.0.0
 */
describe('repository appliance', () => {
  it('keeps Docker entrypoints at the root and assembly internals private', () => {
    expect(existsSync(new URL('../Dockerfile', import.meta.url))).toBe(true);

    expect(existsSync(new URL('../compose.yml', import.meta.url))).toBe(true);

    expect(existsSync(new URL('../.dockerignore', import.meta.url))).toBe(true);

    expect(existsSync(new URL('../packages/docker/rootfs/etc/s6-overlay/user-bundles.d/user/contents.d/bot', import.meta.url))).toBe(true);

    expect(existsSync(new URL('../packages/docker/rootfs/etc/s6-overlay/user-bundles.d/user/contents.d/postgres', import.meta.url))).toBe(true);

    expect(existsSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/user', import.meta.url))).toBe(false);

    expect(existsSync(new URL('../apps/bot/Dockerfile', import.meta.url))).toBe(false);

    expect(existsSync(new URL('../apps/bot/compose.yml', import.meta.url))).toBe(false);

    expect(existsSync(new URL('../apps/bot/rootfs', import.meta.url))).toBe(false);

    expect(existsSync(new URL('../apps/bot/runtime', import.meta.url))).toBe(false);

    expect(dockerPackageJson['private']).toBe(true);

    expect(packageJson['scripts']['deploy:container']).toBe('docker compose up --build --detach');

    return;
  });

  it('preserves one native s6 service graph', () => {
    expect(manifestJson['services'].map((service) => service['name'])).toEqual([
      'bot',
      'migrate',
      'postgres',
      'prepare-postgres',
      'prepare-state',
      'web',
      'worker',
    ]);

    expect(manifestJson['workspaces'].map((workspace) => workspace['path'])).toEqual(['apps/bot']);

    expect(manifestJson['workspaces'][0]!['runtimePaths']).toEqual([
      'examples',
      'migrations',
    ]);

    expect(manifestJson['services'].find((service) => service['name'] === 'postgres')!['command']).toContain('-D "$'.concat('{NOVA_DATABASE_DIRECTORY}"'));

    expect(manifestJson['services'].every((service) => service['runAsRoot'] === false)).toBe(true);

    expect(manifestJson['services'].filter((service) => service['critical']).map((service) => service['name'])).toEqual([
      'postgres',
      'web',
      'worker',
    ]);

    expect(manifestJson['services'].filter((service) => service['requiredForHealth']).map((service) => service['name'])).toEqual([
      'bot',
      'postgres',
      'web',
      'worker',
    ]);

    expect(manifestJson['services'].find((service) => service['name'] === 'prepare-state')!['command']).toBe('/usr/local/libexec/discord-stonker-bot/prepare-state');

    expect(manifestJson['services'].find((service) => service['name'] === 'migrate')!['command']).toBe('/usr/local/libexec/discord-stonker-bot/migrate');

    expect(manifestJson['services'].find((service) => service['name'] === 'prepare-postgres')!['command']).toBe('/usr/local/libexec/discord-stonker-bot/prepare-postgres');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('COPY packages/docker/project/ /');

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8').split('\n  app:').length - 1).toBe(1);

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('ENTRYPOINT ["/init"]');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('ARG S6_OVERLAY_VERSION="3.2.3.2"');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/migrate/dependencies.d/postgres', import.meta.url), 'utf8')).toBe('');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/prepare-postgres/dependencies.d/prepare-state', import.meta.url), 'utf8')).toBe('');

    expect(existsSync(new URL('../packages/docker/project/etc/s6-overlay/s6-rc.d/nova-container-init/up', import.meta.url))).toBe(false);

    expect(existsSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/container-init', import.meta.url))).toBe(false);

    expect(existsSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/state-mount', import.meta.url))).toBe(false);

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/postgres/finish', import.meta.url), 'utf8')).toContain('/run/s6/basedir/bin/halt');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/web/finish', import.meta.url), 'utf8')).toContain('/run/s6/basedir/bin/halt');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/worker/finish', import.meta.url), 'utf8')).toContain('/run/s6/basedir/bin/halt');

    expect(existsSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/bot/finish', import.meta.url))).toBe(false);

    return;
  });

  it('builds only the selected workspace source from Nova\'s generated manifests', () => {
    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('COPY packages/docker/build-package.json ./package.json');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('COPY ["packages/docker/workspace-manifests/apps/bot/package.json","apps/bot/package.json"]');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).not.toContain('package-lock.json');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('npm run build --workspace=\'discord-stonker-bot-app-bot\'');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('COPY apps/bot/src ./apps/bot/src');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).not.toContain('COPY . .');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).not.toContain('COPY apps/docs ./apps/docs');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('RUN npm prune --omit=dev && npm cache clean --force');

    return;
  });

  it('uses Nova state, ownership, timezone, health, and shutdown defaults', () => {
    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('PUID: "$'.concat('{PUID:-1000}"'));

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('PGID: "$'.concat('{PGID:-1000}"'));

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('TZ: "$'.concat('{TZ:-UTC}"'));

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('network_mode: host');

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('user: "0:0"');

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).not.toContain('read_only:');

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).not.toContain('cap_drop:');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/bot/run', import.meta.url), 'utf8')).toContain('/command/s6-applyuidgid');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/postgres/run', import.meta.url), 'utf8')).toContain('/command/s6-applyuidgid');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/postgres/run', import.meta.url), 'utf8')).not.toContain('s6-setuidgid postgres');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).toContain('between 1 and 60000');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).toContain('chown -R "$'.concat('{PUID_VALUE}:$').concat('{PGID_VALUE}"'));

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).toContain('/etc/localtime');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).toContain('export NOVA_INSTALLATION_KEY_FILE=%s/keys/installation.key');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).toContain('export NOVA_DATABASE_DIRECTORY=%s/database');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).toContain('export DATA_DIRECTORY=%s');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8').startsWith('#!/bin/sh\n')).toBe(true);

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8')).toContain('/run/service/bot');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8')).toContain('/run/service/postgres');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8')).toContain('/run/service/web');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8')).toContain('/run/service/worker');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8')).toContain('http://127.0.0.1:22604/health');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).not.toContain('VOLUME ');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('mkdir -p /config /data');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('util-linux');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('S6_KILL_FINISH_MAXTIME=1000');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('S6_KILL_GRACETIME=1000');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('S6_SERVICES_GRACETIME=6000');

    expect(manifestJson['healthPath']).toBe('/health');

    expect(manifestJson['stateEnvironment']).toBe('DATA_DIRECTORY');

    expect(manifestJson['services'].flatMap((service) => service['writablePaths'])).toEqual(['/tmp/postgresql']);

    return;
  });

  it('keeps PostgreSQL on its Unix socket without a password', () => {
    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/postgres/run', import.meta.url), 'utf8')).toContain('-c "listen_addresses="');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/postgres/run', import.meta.url), 'utf8')).toContain('-c "hba_file=/etc/discord-stonker-bot/pg_hba.conf"');

    expect(readFileSync(new URL('../packages/docker/project/etc/discord-stonker-bot/pg_hba.conf', import.meta.url), 'utf8').split('\n').filter((hbaLine) => hbaLine !== '' && hbaLine.startsWith('#') === false)).toEqual(['local all all trust']);

    expect(readFileSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/prepare-postgres', import.meta.url), 'utf8')).not.toContain('--pwfile');

    expect(readFileSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/migrate', import.meta.url), 'utf8')).toContain('ALTER ROLE CURRENT_USER WITH PASSWORD NULL;');

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).not.toContain('POSTGRES_PORT');

    return;
  });

  it('migrates the legacy database and key without the removed state helper', () => {
    expect(manifestJson['legacyStatePaths']).toEqual([
      'database',
      'keys/installation.key',
      'postgres',
      'secrets/credential.key',
    ]);

    expect(readFileSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/prepare-state', import.meta.url), 'utf8')).toContain('legacy_database_directory="$'.concat('{state_directory}/postgres"'));

    expect(readFileSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/prepare-state', import.meta.url), 'utf8')).toContain('legacy_key_file="$'.concat('{state_directory}/secrets/credential.key"'));

    expect(readFileSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/prepare-state', import.meta.url), 'utf8')).toContain('Refusing to overwrite PostgreSQL state');

    expect(readFileSync(new URL('../packages/docker/project/usr/local/libexec/discord-stonker-bot/prepare-state', import.meta.url), 'utf8')).toContain('Refusing to overwrite the installation key');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/nova-docker/legacy-state-paths', import.meta.url), 'utf8')).toBe([
      'database',
      'keys/installation.key',
      'postgres',
      'secrets/credential.key',
      '',
    ].join('\n'));

    return;
  });

  it('publishes the root image to Docker Hub and GHCR', () => {
    expect(novaConfigJson['dockerHub']).toEqual(expect.objectContaining({
      namespace: 'mrjackyliang',
      repository: 'discord-stonker-bot',
    }));

    expect(novaConfigJson['workflows'][2]!['deploy']).toEqual(expect.arrayContaining([
      expect.objectContaining({
        path: './',
        to: 'docker-hub',
      }),
      expect.objectContaining({
        path: './',
        to: 'ghcr',
        with: {
          IMAGE_REPOSITORY: 'discord-stonker-bot',
        },
      }),
    ]));

    return;
  });

  return;
});
