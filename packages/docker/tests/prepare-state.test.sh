#!/usr/bin/env bash
set -euo pipefail

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_directory="$(cd "${script_directory}/../../.." && pwd)"
prepare_state_script="${repository_directory}/packages/docker/project/usr/local/libexec/discord-stonker-bot/prepare-state"
log_helper="${repository_directory}/packages/docker/rootfs/usr/local/libexec/nova-docker/log"
test_directory="$(mktemp -d "${TMPDIR:-/tmp}/discord-stonker-bot-prepare-state.XXXXXX")"

cleanup() {
  rm -rf "${test_directory}"
}

fail() {
  printf '%s\n' "$1" >&2

  exit 1
}

assert_contains() {
  local content="$1"
  local expected="$2"

  if [[ "${content}" != *"${expected}"* ]]; then
    fail "Expected output to contain: ${expected}"
  fi
}

prepare_case() {
  local case_name="$1"
  local case_directory="${test_directory}/${case_name}"

  mkdir -p "${case_directory}/database" "${case_directory}/keys"

  printf '%s\n' "${case_directory}"
}

run_prepare_state() {
  local case_directory="$1"
  local output_file="${case_directory}/output"

  DATA_DIRECTORY="${case_directory}" \
    NOVA_DATABASE_DIRECTORY="${case_directory}/database" \
    NOVA_INSTALLATION_KEY_FILE="${case_directory}/keys/installation.key" \
    NOVA_LOG_HELPER="${log_helper}" \
    NOVA_STATE_DIRECTORY="${case_directory}" \
    /bin/sh "${prepare_state_script}" > "${output_file}" 2>&1
}

test_old_layout_moves_under_config() {
  local case_directory
  case_directory="$(prepare_case 'config-layout')"

  mkdir "${case_directory}/postgres" "${case_directory}/secrets"
  printf '17\n' > "${case_directory}/postgres/PG_VERSION"
  printf 'legacy-key-bytes' > "${case_directory}/secrets/credential.key"

  run_prepare_state "${case_directory}"

  [[ "$(< "${case_directory}/database/PG_VERSION")" == '17' ]] || fail 'The PostgreSQL directory did not move into "database".'
  [[ "$(< "${case_directory}/keys/installation.key")" == 'legacy-key-bytes' ]] || fail 'The installation key bytes changed while moving.'
  [[ ! -e "${case_directory}/postgres" ]] || fail 'The legacy PostgreSQL directory remained after migration.'
  [[ ! -e "${case_directory}/secrets" ]] || fail 'The empty legacy key directory remained after migration.'

  local output
  output="$(< "${case_directory}/output")"

  assert_contains "${output}" " INFO prepare-state: Moved PostgreSQL state from ${case_directory}/postgres to ${case_directory}/database."
  assert_contains "${output}" " INFO prepare-state: Moved the installation key from ${case_directory}/secrets/credential.key to ${case_directory}/keys/installation.key."
}

test_old_data_mount_uses_resolved_directory() {
  local case_directory
  case_directory="$(prepare_case 'data-layout')"

  mkdir "${case_directory}/postgres"
  printf '17\n' > "${case_directory}/postgres/PG_VERSION"

  run_prepare_state "${case_directory}"

  [[ "$(< "${case_directory}/database/PG_VERSION")" == '17' ]] || fail 'Resolved legacy state did not move into "database".'
  [[ ! -e "${case_directory}/postgres" ]] || fail 'Resolved legacy PostgreSQL state remained in place.'
}

test_conflict_fails_before_any_move() {
  local case_directory
  case_directory="$(prepare_case 'conflict')"

  mkdir "${case_directory}/postgres" "${case_directory}/secrets"
  printf 'legacy-database\n' > "${case_directory}/postgres/PG_VERSION"
  printf 'legacy-key\n' > "${case_directory}/secrets/credential.key"
  printf 'current-key\n' > "${case_directory}/keys/installation.key"

  if run_prepare_state "${case_directory}"; then
    fail 'Conflicting installation keys did not stop state preparation.'
  fi

  [[ "$(< "${case_directory}/postgres/PG_VERSION")" == 'legacy-database' ]] || fail 'A later key conflict allowed the database to move first.'
  [[ "$(< "${case_directory}/secrets/credential.key")" == 'legacy-key' ]] || fail 'The legacy key changed after a conflict.'
  [[ "$(< "${case_directory}/keys/installation.key")" == 'current-key' ]] || fail 'The current key changed after a conflict.'

  local output
  output="$(< "${case_directory}/output")"

  assert_contains "${output}" " ERROR prepare-state: Refusing to overwrite the installation key at ${case_directory}/keys/installation.key"
}

test_database_conflict_preserves_both_layouts() {
  local case_directory
  case_directory="$(prepare_case 'database-conflict')"

  mkdir "${case_directory}/postgres"
  printf 'legacy-database\n' > "${case_directory}/postgres/PG_VERSION"
  printf 'current-database\n' > "${case_directory}/database/PG_VERSION"

  if run_prepare_state "${case_directory}"; then
    fail 'Conflicting PostgreSQL directories did not stop state preparation.'
  fi

  [[ "$(< "${case_directory}/postgres/PG_VERSION")" == 'legacy-database' ]] || fail 'The legacy database changed after a conflict.'
  [[ "$(< "${case_directory}/database/PG_VERSION")" == 'current-database' ]] || fail 'The current database changed after a conflict.'
}

main() {
  trap cleanup EXIT

  test_old_layout_moves_under_config
  test_old_data_mount_uses_resolved_directory
  test_conflict_fails_before_any_move
  test_database_conflict_preserves_both_layouts

  printf '%s\n' 'State preparation tests passed.'
}

main "$@"
