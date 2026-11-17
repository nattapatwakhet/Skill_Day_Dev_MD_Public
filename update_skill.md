# Update Skill — ตรวจ เรียบเรียง พัฒนา และซิงก์ชุดความรู้

ใช้เมื่อผู้ใช้สั่ง “update skill” เท่านั้น การดึงข้อมูลและ merge เป็น mutation จึงต้องผ่าน Consultation Gate เว้นแต่คำสั่งนั้นระบุให้ทำทันทีแล้ว

คำสั่งนี้ต้องทำมากกว่าดึง upstream หรือ commit: ตรวจของเดิมก่อน, อ่านเฉพาะ delta, เรียบเรียง memory/กฎ/ความรู้,
ลดซ้ำ, ตรวจ conflict/freshness/provenance, archive ประวัติออกจาก rule, อัปเดต index/retrieval แล้วจึง validate และ publish.
ทำ full-corpus audit เมื่อผู้ใช้ระบุ “ทุกเรื่อง/ทั้งหมด” หรือ validator/ledger ชี้ debt; รอบทั่วไป refine เฉพาะ delta
เพื่อไม่ rewrite ไฟล์โดยไม่มีประโยชน์

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

## Knowledge Refinement และ Git closure

1. แยก fact/decision/rule/pattern/history แล้วเก็บใน source of truth ที่ถูกชนิด
2. deduplicate ตามความหมาย ไม่ใช่ชื่อไฟล์; conflict ต้อง supersede/ถาม ไม่วางสองกฎ active ขัดกัน
3. ตรวจ freshness ของ claim ที่เปลี่ยนได้และติด provenance/evidence ceiling
4. public ต้อง generic และ sanitize path/project/person/credential/private data เสมอ
5. ถ้าผู้ใช้สั่ง commit/push ให้ review secret/generated/build/cache/backup และ destructive deletion ก่อน stage,
   commit เป็นก้อนที่ย้อนกลับได้ และรายงานสิ่งที่ยัง push ไม่ได้
6. อัปเดต README, workflow image และตัวอย่างเมื่อ flow/installation เปลี่ยน เพื่อให้ public repository ใช้งานได้ด้วยตัวเอง

Public sync เป็นปลายทางของ private workflow: รับเฉพาะ generic reusable rules หลัง sanitize เท่านั้น ไม่รับ user memory,
local path, private project knowledge, credentials, production configuration หรือ private work log

ลบ temporary directory หลังตรวจว่า path มาจาก `mktemp -d` เท่านั้น แล้วสรุปไฟล์ create/edit/delete และส่วนที่ตั้งใจไม่แตะ
