#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"

# Tunable limits via environment variables.
MAX_TOTAL_DELETIONS="${MAX_TOTAL_DELETIONS:-220}"
MAX_DELETIONS_PER_FILE="${MAX_DELETIONS_PER_FILE:-80}"
MAX_PROTECTED_FILE_DELETIONS="${MAX_PROTECTED_FILE_DELETIONS:-15}"

# Override flags for exceptional commits.
ALLOW_MASS_DELETE="${ALLOW_MASS_DELETE:-0}"
ALLOW_PROTECTED_EDIT="${ALLOW_PROTECTED_EDIT:-0}"
ALLOW_FILE_DELETE="${ALLOW_FILE_DELETE:-0}"

protected_files=(
  "js/cyber-layout.css"
  "js/index-ui.css"
  "js/ui.js"
  "index.html"
)

is_protected_file() {
  local candidate="$1"
  local f
  for f in "${protected_files[@]}"; do
    if [[ "$f" == "$candidate" ]]; then
      return 0
    fi
  done
  return 1
}

numstat_output="$(git -C "${repo_root}" diff --cached --numstat -- '*.css' '*.html' '*.js')"
if [[ -z "$numstat_output" ]]; then
  exit 0
fi

total_deleted=0
errors=()

while IFS=$'\t' read -r added deleted file_path; do
  [[ -z "${file_path:-}" ]] && continue

  # Binary entries are represented with '-' in numstat.
  if [[ "$added" == "-" || "$deleted" == "-" ]]; then
    continue
  fi

  total_deleted=$((total_deleted + deleted))

  if (( deleted > MAX_DELETIONS_PER_FILE )); then
    errors+=("Large deletion in ${file_path}: -${deleted} lines (limit ${MAX_DELETIONS_PER_FILE})")
  fi

  if is_protected_file "$file_path" && (( deleted > MAX_PROTECTED_FILE_DELETIONS )) && [[ "$ALLOW_PROTECTED_EDIT" != "1" ]]; then
    errors+=("Protected file edit blocked for ${file_path}: -${deleted} lines (limit ${MAX_PROTECTED_FILE_DELETIONS}). Set ALLOW_PROTECTED_EDIT=1 for intentional refactors.")
  fi
done <<< "$numstat_output"

deleted_files="$(git -C "${repo_root}" diff --cached --name-only --diff-filter=D -- '*.css' '*.html' '*.js' || true)"
if [[ -n "$deleted_files" && "$ALLOW_FILE_DELETE" != "1" ]]; then
  while IFS= read -r deleted_file; do
    [[ -z "$deleted_file" ]] && continue
    errors+=("File deletion blocked: ${deleted_file}. Set ALLOW_FILE_DELETE=1 for intentional removals.")
  done <<< "$deleted_files"
fi

if (( total_deleted > MAX_TOTAL_DELETIONS )) && [[ "$ALLOW_MASS_DELETE" != "1" ]]; then
  errors+=("Total deleted lines too high: -${total_deleted} (limit ${MAX_TOTAL_DELETIONS}). Set ALLOW_MASS_DELETE=1 for intentional large cleanup.")
fi

if (( ${#errors[@]} > 0 )); then
  printf '\n\033[31mCommit blocked by safety guard.\033[0m\n'
  printf 'Reason(s):\n'
  for e in "${errors[@]}"; do
    printf '  - %s\n' "$e"
  done
  printf '\nTip: run `git diff --cached --stat` before committing.\n\n'
  exit 1
fi

exit 0
