#!/usr/bin/env bash
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
for file in "$root"/memory/PROGRESS*.md; do
  [ -f "$file" ] || continue
  case "$(basename "$file")" in *ARCHIVE*|*COMPLETE*|*BEFORE*) continue ;; esac
  status=$(sed -n '1,6p' "$file" | rg -o 'สถานะ:[^·]*' || true)
  printf '%s' "$status" | rg -qi 'เสร็จ|complete|completed|archive' && continue
  printf '%s\t%s\t%s\n' "$file" "$(sed -n '1p' "$file")" "${status:-สถานะ: ไม่ระบุ}"
done
