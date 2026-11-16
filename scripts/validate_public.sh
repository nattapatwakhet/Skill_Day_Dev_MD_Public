#!/usr/bin/env bash
set -u

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
errors=0
fail() { printf 'FAIL  %s\n' "$1"; errors=$((errors + 1)); }
pass() { printf 'PASS  %s\n' "$1"; }

required='AGENTS.md CLAUDE.md README.md main_skill.md work_flow_skill.md plan_mode_skill.md permission_skill.md progress_skill.md work_mode_skill.md continuous_improvement_skill.md auto_memory_skill.md docker-compose.yml brain_3d/package.json memory/BRAIN_INDEX.md'
for file in $required; do
  [ -f "$root/$file" ] || fail "missing $file"
done
[ "$errors" -eq 0 ] && pass 'required public files exist'

private_pattern='/'"'Users/|'"'Downloads/code|nattapatwakhet@|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|github_pat_|sk-[A-Za-z0-9]'
if rg -n --hidden --glob '!**/.git/**' --glob '!brain_3d/package-lock.json' --glob '!**/validate_public.sh' "$private_pattern" "$root"; then
  fail 'private path, identity or secret-like value found'
else
  pass 'privacy scan'
fi

if rg -q 'Consultation Gate' "$root/work_flow_skill.md" &&
   rg -q 'Impact Expansion Pass' "$root/work_flow_skill.md" &&
   rg -q 'ทำเลย' "$root/AGENTS.md"; then
  pass 'consultation and execution-approval contract'
else
  fail 'consultation or execution-approval contract missing'
fi

missing_index=0
for file in "$root"/*_skill.md; do
  name=$(basename "$file")
  if ! rg -qF "$name" "$root/main_skill.md"; then
    printf 'MISSING INDEX  %s\n' "$name"
    missing_index=$((missing_index + 1))
  fi
done
if [ "$missing_index" -eq 0 ]; then pass 'all top-level skills indexed'; else fail "$missing_index skills absent from main index"; fi

ROOT="$root" ruby <<'RUBY'
root = ENV.fetch('ROOT')
bad = []
Dir.glob(File.join(root, '**', '*.md')).each do |file|
  next if file.include?('/node_modules/') || file.include?('/.git/')
  text = File.read(file)
  text.scan(/\[[^\]]*\]\(([^)]+)\)/).flatten.each do |target|
    next if target =~ %r{^(https?://|mailto:|#)}
    clean = target.sub(/#.*/, '').sub(/^<|>$/, '')
    next if clean.empty?
    bad << [file, target] unless File.exist?(File.expand_path(clean, File.dirname(file)))
  end
end
if bad.empty?
  puts 'PASS  relative Markdown links'
else
  bad.each { |file, target| warn "BROKEN LINK  #{file}: #{target}" }
  exit 1
end
RUBY
if [ "$?" -ne 0 ]; then fail 'broken relative Markdown links'; fi

if command -v docker >/dev/null 2>&1 && docker compose -f "$root/docker-compose.yml" config --quiet; then
  pass 'Docker Compose config'
else
  fail 'Docker Compose unavailable or invalid'
fi

printf '\nRESULT errors=%s\n' "$errors"
[ "$errors" -eq 0 ]
