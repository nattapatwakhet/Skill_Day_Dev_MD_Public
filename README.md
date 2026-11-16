# Day Dev Public Skill

ชุดระบบทำงานสำหรับ AI coding agent ที่รวม workflow แบบปรึกษาก่อนทำ, memory ที่ตรวจสอบแหล่งที่มาได้, progress หลายงาน, autonomous improvement ที่มีขอบเขต และเว็บ Skill Brain 3D

## หลักการทำงาน

1. อ่านสถานะด้วย `scripts/list_active_progress.sh`
2. อ่าน `main_skill.md` แล้วเดินตาม `work_flow_skill.md`
3. สำรวจแบบ read-only เพื่อเข้าใจระบบจริง
4. ก่อนสร้าง/แก้/เพิ่ม/ลบ ให้คุยผลลัพธ์ จุดกระทบ เงื่อนไข ความเสี่ยง และวิธีตรวจ
5. เมื่อผู้ใช้ยืนยันด้วย “ทำเลย/ทำตามนี้/ทำอัตโนมัติ” ให้ลงมือต่อใน scope โดยไม่ถามเรื่องเดิมซ้ำ
6. ตรวจผล บันทึก progress/work log/change manifest และจำเฉพาะความรู้ที่มีคุณภาพ

การอนุมัติ implementation ไม่เท่ากับการอนุมัติ action ที่เสี่ยงหรือกระทบภายนอก หากต้องลบข้อมูลสำคัญ, deploy production, ส่งข้อความ, เผยแพร่ หรือขยาย scope อย่างมีนัยสำคัญ ต้องหยุดตาม `permission_skill.md`

## โหมดทำงานอัตโนมัติ

ผู้ใช้ให้ standing authorization แก่งานหนึ่งได้ เช่น “ทำอัตโนมัติไปเรื่อยจนดีหรือจนฉันบอกพัก” Agent ต้องกำหนด scope, metric, regression checks และ stopping rules ตาม `continuous_improvement_skill.md` แล้วทำเป็นรอบ:

`inspect → propose/approve → change → verify → record → next iteration`

หยุดเมื่อผู้ใช้บอกพัก, budget หมด, metric ไม่ดีขึ้น, เกิด regression หรือพบ action ใหม่ที่อยู่นอก authorization

## ความจำ

`memory/` มีเฉพาะ template สาธารณะ ไม่มีข้อมูลส่วนตัวของผู้สร้าง

- `BRAIN_INDEX.md` — แผนที่ความจำ
- `USER_MEMORY.md` — preference ที่ผู้ใช้ยืนยัน
- `DECISION_MEMORY.md` — การตัดสินใจและเหตุผล
- `MEMORY_INBOX.md` — candidate ที่ยังรอตรวจ
- `SOURCE_LEDGER.md` — provenance/freshness
- `PROGRESS*.md` — งานที่กำลังทำ แยกไฟล์ต่องาน
- `WORK_LOG.md` — ledger งานที่เสร็จ
- `CHANGES.md` — create/edit/delete ที่รอ deploy

เพิ่ม candidate อย่างปลอดภัย:

```bash
skill/day_dev_public/scripts/capture_memory.sh preference user-confirmed \
  "สรุปความชอบ" "conversation reference"
```

## Skill Brain 3D และ Work Mode

ชุดนี้มีเว็บแสดงความสัมพันธ์ของ skill/memory และ Docker service มาตรฐานชื่อ `skill_brain_3d`:

```bash
cd skill/day_dev_public
docker compose config --quiet
docker compose up -d skill_brain_3d
open http://localhost:3004
```

Compose มี mapping `3004:3004`, healthcheck และ relative mount จึงย้ายไป workspace อื่นได้ คำสั่ง trigger “โหลดทำงาน” ใช้ flow ใน `work_mode_skill.md`: ตรวจ Docker → ตรวจ/ซ่อม compose ตามสิทธิ์ → start service → รอ healthy → เปิดหน้าเว็บ

## ติดตั้ง

วางชุดนี้ที่ `skill/day_dev_public/` แล้วนำ `AGENTS.md` หรือ `CLAUDE.md` ไปไว้ root ของ workspace หากติดตั้ง path อื่นให้แก้ prefix ใน entry file

โครงสร้างสำคัญ:

```text
skill/day_dev_public/
├── AGENTS.md
├── CLAUDE.md
├── main_skill.md
├── work_flow_skill.md
├── *_skill.md
├── memory/
├── scripts/
├── brain_3d/
└── docker-compose.yml
```

## ตรวจสุขภาพก่อนเผยแพร่

```bash
skill/day_dev_public/scripts/validate_public.sh
cd skill/day_dev_public/brain_3d && npm run build
```

Validator ตรวจไฟล์จำเป็น, consultation-first contract, privacy markers, Markdown links, index coverage และ Docker Compose syntax

## Public-safe policy

ห้ามบันทึก local absolute path, อีเมล/ตัวตน, รายชื่อโปรเจกต์ภายใน, production host, credential, token, secret หรือ memory จริงของผู้ใช้ลง repository นี้ ใช้ placeholder และ template เท่านั้น ไฟล์ `.git/` เป็น metadata ของ repository และอยู่นอก content scan

## English summary

Day Dev Public is a portable operating system for coding agents. It defaults to consultation before mutations, supports explicit execution approval and bounded autonomous loops, keeps provenance-aware memory, tracks concurrent work in separate progress files, and ships a Dockerized 3D skill graph at `http://localhost:3004`.

## License

MIT
