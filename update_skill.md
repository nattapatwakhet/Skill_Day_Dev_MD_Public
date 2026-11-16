# Update Skill — โหลดเวอร์ชันล่าสุดมาปรับใช้

ใช้เมื่อผู้ใช้สั่ง “update skill” เท่านั้น การดึงข้อมูลและ merge เป็น mutation จึงต้องผ่าน Consultation Gate เว้นแต่คำสั่งนั้นระบุให้ทำทันทีแล้ว

## หา upstream

1. ถ้าชุดนี้เป็น Git repository ให้ใช้ `git remote get-url origin`
2. ถ้าเป็นไฟล์ที่ copy มา ให้ผู้ใช้กำหนด `DAY_DEV_PUBLIC_UPSTREAM`
3. ห้ามเดา URL, branch หรือ credential

```bash
skill_root=skill/day_dev_public
upstream=$(git -C "$skill_root" remote get-url origin 2>/dev/null || printf '%s' "$DAY_DEV_PUBLIC_UPSTREAM")
test -n "$upstream"
tmp_dir=$(mktemp -d)
git clone --depth 1 "$upstream" "$tmp_dir/upstream"
```

## เปรียบเทียบและ merge

- เทียบ upstream กับ local โดย exclude `.git`, `update`, runtime memory และ generated files
- ไฟล์ใหม่เพิ่มได้เมื่อ public-safe และลิงก์เข้า `main_skill.md`
- กฎใหม่ merge ตามความหมาย ไม่ overwrite local customization
- ห้ามทับ `project_structure_skill.md`, service จริงใน `docker_skill.md`, `conversation_log_skill.md`, `memory/PROGRESS*.md`, `WORK_LOG.md`, `CHANGES.md` หรือ user memory
- conflict ที่เปลี่ยน behavior ต้องเสนอให้ผู้ใช้เลือก
- ก่อนจบให้รัน `scripts/validate_public.sh` และ build ของ `brain_3d`

ลบ temporary directory หลังตรวจว่า path มาจาก `mktemp -d` เท่านั้น แล้วสรุปไฟล์ create/edit/delete และส่วนที่ตั้งใจไม่แตะ
