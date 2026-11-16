#!/usr/bin/env bash

set -eu

if [ "$#" -ne 4 ]; then
  printf 'Usage: %s <type> <source> <summary> <source_ref>\n' "$0" >&2
  exit 64
fi

type=$1
source=$2
summary=$3
source_ref=$4

# Keep the generated YAML one-record-per-line and prevent headings/fences or
# control characters from being injected into the inbox structure.
for value in "$type" "$source" "$summary" "$source_ref"; do
  if [ -z "$value" ] || [ "$(printf '%s' "$value" | wc -l | tr -d ' ')" -ne 0 ] || printf '%s' "$value" | LC_ALL=C rg -q '[[:cntrl:]]'; then
    printf 'Fields must be non-empty single-line text\n' >&2
    exit 68
  fi
done

case "$type" in
  preference|decision|project|source|feedback|lesson) ;;
  *) printf 'Invalid type: %s\n' "$type" >&2; exit 65 ;;
esac

case "$source" in
  user-confirmed|source-code|verified-data|official-doc|chat-derived) ;;
  *) printf 'Invalid source: %s\n' "$source" >&2; exit 66 ;;
esac

if printf '%s\n%s\n' "$summary" "$source_ref" | rg -qi 'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|bearer[[:space:]]+[a-z0-9._-]{12,}|(client_secret|api[_-]?key|password)[[:space:]]*[:=][[:space:]]*[^ <][^ ]{7,}'; then
  printf 'Refusing to capture possible secret\n' >&2
  exit 67
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
inbox="$script_dir/../memory/MEMORY_INBOX.md"
timestamp=$(date '+%Y%m%d-%H%M%S')
today=$(date '+%F')

if rg -q '^ไม่มี$' "$inbox"; then
  sed -i.bak '/^ไม่มี$/d' "$inbox"
  rm -f "$inbox.bak"
fi

{
  printf '\n## CAND-%s\n\n' "$timestamp"
  printf '```yaml\n'
  printf 'id: CAND-%s\n' "$timestamp"
  printf 'type: %s\n' "$type"
  printf 'summary: %s\n' "$(printf '%s' "$summary" | sed "s/'/''/g; s/^/'/; s/$/'/")"
  printf 'source: %s\n' "$source"
  printf 'source_ref: %s\n' "$(printf '%s' "$source_ref" | sed "s/'/''/g; s/^/'/; s/$/'/")"
  printf 'captured_at: %s\n' "$today"
  printf 'status: pending\n'
  printf 'owner: agent\n'
  printf 'next_action: ตรวจ source, conflict, sensitivity และเลือก source of truth\n'
  printf '```\n'
} >> "$inbox"

printf 'Captured CAND-%s\n' "$timestamp"
