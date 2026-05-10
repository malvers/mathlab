#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"
hooks_dir="${repo_root}/.git/hooks"

if [[ ! -d "${hooks_dir}" ]]; then
  echo "No .git/hooks directory found at ${hooks_dir}. Run this from a cloned git repo."
  exit 1
fi

install -m 0755 "${repo_root}/hooks/pre-commit" "${hooks_dir}/pre-commit"

echo "Installed pre-commit hook to ${hooks_dir}/pre-commit"
echo "Guard script: ${repo_root}/scripts/safe-commit-check.sh"
