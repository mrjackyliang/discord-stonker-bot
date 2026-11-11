# syntax=docker/dockerfile:1

##################################
#### Step 1: Build Workspaces ####
##################################
FROM node:24.22.0-trixie-slim@sha256:a6155384446670e9719bdc4fd0ebe4d4b29fb32a8d6aa523da3547a6cfbcf22c AS build

WORKDIR /workspace

COPY packages/docker/build-package.json ./package.json
COPY packages/docker/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ["packages/docker/workspace-manifests/apps/bot/package.json","apps/bot/package.json"]

RUN npm install

COPY apps/bot/tsconfig.config.json ./apps/bot/tsconfig.config.json
COPY apps/bot/tsconfig.source.json ./apps/bot/tsconfig.source.json
COPY apps/bot/tsconfig.web.json ./apps/bot/tsconfig.web.json
COPY apps/bot/vite.config.mts apps/bot/mock-api.mts apps/bot/index.html apps/bot/invite.html ./apps/bot/
COPY apps/bot/examples ./apps/bot/examples
COPY apps/bot/src ./apps/bot/src

RUN --network=none npm run build --workspace='discord-stonker-bot-app-bot'

RUN npm prune --omit=dev && npm cache clean --force

####################################
#### Step 2: Install s6-overlay ####
####################################
FROM debian:trixie-20261005-slim@sha256:a29215f6a35e51e22adffa17f89e9d2ef06214e64a2bad10d765c46aea49f11f AS s6-overlay

ARG DEBIAN_FRONTEND="noninteractive"
ARG TARGETARCH
ARG S6_OVERLAY_VERSION="3.2.3.2"

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    xz-utils \
  && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
  case "${TARGETARCH}" in \
    "amd64") s6_architecture="x86_64" ;; \
    "arm64") s6_architecture="aarch64" ;; \
    *) echo "Unsupported target architecture: ${TARGETARCH}" >&2; exit 1 ;; \
  esac; \
  mkdir -p /s6-rootfs; \
  for archive_name in "s6-overlay-noarch.tar.xz" "s6-overlay-${s6_architecture}.tar.xz"; do \
    release_url="https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}"; \
    curl --fail --location --silent --show-error \
      --output "/tmp/${archive_name}" \
      "${release_url}/${archive_name}"; \
    curl --fail --location --silent --show-error \
      --output "/tmp/${archive_name}.sha256" \
      "${release_url}/${archive_name}.sha256"; \
    cd /tmp; \
    sha256sum -c "${archive_name}.sha256"; \
    tar -C /s6-rootfs -Jxpf "/tmp/${archive_name}"; \
    rm -f "/tmp/${archive_name}" "/tmp/${archive_name}.sha256"; \
  done

###############################
#### Step 3: Runtime Image ####
###############################
FROM node:24.22.0-trixie-slim@sha256:a6155384446670e9719bdc4fd0ebe4d4b29fb32a8d6aa523da3547a6cfbcf22c AS runtime

ARG POSTGRESQL_VERSION=17.11-0+deb13u1

ENV MIGRATIONS_DIRECTORY=/app/apps/bot/migrations \
  NODE_ENV=production \
  PATH=/usr/lib/postgresql/17/bin:${PATH} \
  PGID=1000 \
  POSTGRES_DATA_DIRECTORY=/data/postgres \
  POSTGRES_RUNTIME_DIRECTORY=/run/postgresql \
  PUID=1000 \
  S6_BEHAVIOUR_IF_STAGE2_FAILS=2 \
  S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0 \
  S6_READ_ONLY_ROOT=1 \
  STARTER_CONFIGURATION=/app/apps/bot/examples/legacy-config.e2e.json \
  TZ=UTC

WORKDIR /app

RUN apt-get update \
  && apt-get install --yes --no-install-recommends \
    ca-certificates \
    "postgresql-17=${POSTGRESQL_VERSION}" \
    "postgresql-client-17=${POSTGRESQL_VERSION}" \
    tzdata \
  && if [ -d /etc/postgresql/17/main ]; then pg_dropcluster --stop 17 main; fi \
  && rm -rf /var/lib/apt/lists/*

COPY --from=s6-overlay /s6-rootfs/ /
COPY packages/docker/rootfs/ /
COPY packages/docker/project/ /
COPY --from=build /workspace/apps/bot/build ./apps/bot/build
COPY --from=build /workspace/apps/bot/package.json ./apps/bot/package.json
COPY --from=build /workspace/node_modules ./node_modules
COPY apps/bot/examples ./apps/bot/examples
COPY apps/bot/migrations ./apps/bot/migrations

RUN --network=none chmod +x \
    /etc/s6-overlay/s6-rc.d/bot/finish \
    /etc/s6-overlay/s6-rc.d/bot/run \
    /etc/s6-overlay/s6-rc.d/postgres/finish \
    /etc/s6-overlay/s6-rc.d/postgres/run \
    /etc/s6-overlay/s6-rc.d/web/finish \
    /etc/s6-overlay/s6-rc.d/web/run \
    /etc/s6-overlay/s6-rc.d/worker/finish \
    /etc/s6-overlay/s6-rc.d/worker/run \
    /usr/local/libexec/nova-docker/finish-critical \
    /usr/local/libexec/nova-docker/healthcheck \
    /usr/local/libexec/nova-docker/init-user \
    /usr/local/libexec/nova-docker/services/migrate \
    /usr/local/libexec/nova-docker/services/prepare-postgres \
    /usr/local/libexec/discord-stonker-bot/migrate \
    /usr/local/libexec/discord-stonker-bot/prepare-postgres \
  && mkdir -p /data/postgres /data/secrets /run/postgresql \
  && chown postgres:postgres /data/postgres /run/postgresql \
  && chmod 0700 /data/postgres \
  && chmod 0755 /run/postgresql

VOLUME ["/data"]

EXPOSE 22604

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["/usr/local/libexec/nova-docker/healthcheck"]

STOPSIGNAL SIGTERM

ENTRYPOINT ["/init"]
