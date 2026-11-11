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
      'web',
      'worker',
    ]);

    expect(manifestJson['workspaces'].map((workspace) => workspace['path'])).toEqual(['apps/bot']);

    expect(manifestJson['workspaces'][0]!['runtimePaths']).toEqual([
      'examples',
      'migrations',
    ]);

    expect(manifestJson['services'].find((service) => service['name'] === 'postgres')!['command']).toContain('/command/s6-setuidgid postgres');

    expect(manifestJson['services'].find((service) => service['name'] === 'postgres')!['runAsRoot']).toBe(true);

    expect(manifestJson['services'].find((service) => service['name'] === 'migrate')!['runAsRoot']).toBe(true);

    expect(manifestJson['services'].find((service) => service['name'] === 'migrate')!['command']).toBe('/usr/local/libexec/discord-stonker-bot/migrate');

    expect(manifestJson['services'].find((service) => service['name'] === 'prepare-postgres')!['command']).toBe('/usr/local/libexec/discord-stonker-bot/prepare-postgres');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('COPY packages/docker/project/ /');

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8').split('\n  app:').length - 1).toBe(1);

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('ENTRYPOINT ["/init"]');

    expect(readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')).toContain('ARG S6_OVERLAY_VERSION="3.2.3.2"');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/migrate/dependencies.d/postgres', import.meta.url), 'utf8')).toBe('\n');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/web/finish', import.meta.url), 'utf8')).toContain('finish-critical web');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/bot/finish', import.meta.url), 'utf8')).not.toContain('/run/s6/basedir/bin/halt');

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

  it('supports read-only numeric application identities and a fixed database identity', () => {
    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('PUID: $'.concat('{PUID:-1000}'));

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('PGID: $'.concat('{PGID:-1000}'));

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('TZ: $'.concat('{TZ:-UTC}'));

    expect(readFileSync(new URL('../compose.yml', import.meta.url), 'utf8')).toContain('read_only: true');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/bot/run', import.meta.url), 'utf8')).toContain('/command/s6-applyuidgid');

    expect(readFileSync(new URL('../packages/docker/rootfs/etc/s6-overlay/s6-rc.d/postgres/run', import.meta.url), 'utf8')).toContain('/command/s6-setuidgid postgres');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).not.toContain('chown -R');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/init-user', import.meta.url), 'utf8')).not.toContain('/etc/localtime');

    expect(readFileSync(new URL('../packages/docker/rootfs/usr/local/libexec/nova-docker/healthcheck', import.meta.url), 'utf8').startsWith('#!/bin/sh\n')).toBe(true);

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
