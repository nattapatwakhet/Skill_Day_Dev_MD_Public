# Knowledge Application Skill — นำความจำไปใช้ทำงาน

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ใช้เมื่อคำขอต้องอาศัยความรู้ข้ามแชต ประวัติโปรเจกต์ หลักการเดิม หรือการตัดสินใจจากหลายโดเมน

เป้าหมายคือเปลี่ยน memory ให้เป็นการกระทำที่ตรวจสอบได้ ไม่ใช่เพียงจำได้หรือคัดคำตอบเก่า

## วงจรคิดและทำ

```text
คำขอปัจจุบัน
  → ระบุ outcome/ข้อจำกัด
  → ดึงความจำเฉพาะที่เกี่ยว
  → ตรวจความสดและหลักฐาน
  → เลือก skill/source of truth
  → วางกติกาเดียวที่ต้องใช้
  → ลงมือ frontend/backend/data/artifact ตามขอบเขต
  → ตรวจ invariant และผลจริง
  → บันทึกความรู้ใหม่กลับจุดเดียว
```

## 1. ดึงความจำอย่างมีเป้าหมาย

- วิธีทำงาน/ความชอบผู้ใช้ → [`memory/USER_MEMORY.md`](./memory/USER_MEMORY.md)
- หัวข้ออยู่ skill ไหน → [`memory/KNOWLEDGE_MAP.md`](./memory/KNOWLEDGE_MAP.md)
- งานค้าง/สถานะล่าสุด → รัน [`scripts/list_active_progress.sh`](./scripts/list_active_progress.sh) แล้วเปิดไฟล์ active ที่ตรงกับคำขอ
- เคยทำอะไร/เหตุผลเดิม → [`memory/WORK_LOG.md`](./memory/WORK_LOG.md)
- ไฟล์ที่แก้/รอ deploy → [`memory/CHANGES.md`](./memory/CHANGES.md)
- ที่มาความรู้และ coverage → [`memory/SOURCE_LEDGER.md`](./memory/SOURCE_LEDGER.md)
- กติกาที่ใช้ข้ามงาน → [`memory/DECISION_MEMORY.md`](./memory/DECISION_MEMORY.md)
- รูปแบบ provenance/freshness → [`memory/MEMORY_SCHEMA.md`](./memory/MEMORY_SCHEMA.md)
- คำค้น/alias → [`memory/RETRIEVAL_INDEX.md`](./memory/RETRIEVAL_INDEX.md)
- วันทบทวน → [`memory/FRESHNESS_POLICY.md`](./memory/FRESHNESS_POLICY.md)

ห้ามอ่าน archive/inventory ทั้งหมดโดยอัตโนมัติ ให้ค้นชื่อระบบ หัวข้อ รหัส หรือคำสำคัญก่อน แล้วเปิดช่วงที่เกี่ยว

## 2. แยกชนิดความรู้ก่อนใช้

| ชนิด | วิธีใช้ |
|---|---|
| กฎที่ผู้ใช้ยืนยัน | ใช้เป็น constraint ของงาน เช่น metric เดียวกันต้องนิยามเดียวกัน |
| Convention โปรเจกต์ | ตรวจ source ล่าสุด แล้วทำตาม skill ภาษา/ระบบ |
| บทเรียนจากบั๊ก | ใช้สร้าง regression/invariant ไม่คัด patch เก่าโดยไม่ตรวจ |
| ความชอบ | ใช้ปรับรูปแบบคำตอบ/UI/คำแนะนำ แต่ไม่แทน requirement ปัจจุบัน |
| ข้อมูลตามเวลา | browse/ตรวจแหล่งปัจจุบันก่อนใช้ |
| ข้อมูลจากแชตเก่า | ใช้เป็น hypothesis จนกว่าจะยืนยันกับ artifact/source ปัจจุบัน |

ก่อนใช้ผลค้นคืน ให้แยก “พบข้อความ” ออกจาก “ใช้ตัดสินใจได้”: archive/log ช่วยหาเบาะแส แต่มีเพียง source of truth
ที่ยัง active, ไม่ overdue และผ่าน `verify_before_use` เท่านั้นที่ใช้เป็น constraint ได้ หาก memory ไม่เปลี่ยนการตัดสินใจ
ของงานนี้ให้ตัดออกจาก context เพื่อลดการยึดติดกับเรื่องเก่า

## 3. สร้างกติกากลางก่อนแก้หลายจุด

งานที่มีหลาย consumer เช่น dashboard, popup, Excel, backend หรือ Read/Book/Train ให้เขียน invariant ก่อน:

- ใครอยู่ใน population
- record ใดนับ/ไม่นับ
- deduplicate ด้วย key และลำดับใด
- คะแนน/สถานะ/ยอดรวมคำนวณจาก field ใด
- search ครอบคลุมชื่อและรหัสใด

จากนั้นให้ทุก consumer ใช้ invariant เดียวกัน และตรวจผลรวมข้ามจุด ห้ามแก้ยอดเฉพาะหน้าด้วยค่าชดเชย

## 4. เลือกระดับการพิสูจน์

- คำตอบทั่วไป → ตรวจแหล่งปัจจุบันเมื่อข้อมูลเปลี่ยนได้
- แก้ code → lint/typecheck/syntax + test เฉพาะจุด + diff check
- ตัวเลข/รายงาน → reconciliation + invariant + sample edge cases
- UI → interaction จริง, responsive state, loading/empty/error และ screenshot เมื่อเหมาะสม
- เอกสาร/สื่อ → render/open ผลจริง ไม่ถือว่าสร้างไฟล์สำเร็จเท่ากับเนื้อหาถูก

## 5. เรียนรู้กลับเข้าระบบ

หลังงานเสร็จ:

1. กฎ reusable ใหม่ → skill ปลายทางเพียงแห่งเดียว
2. เปลี่ยนบริบทผู้ใช้ → `USER_MEMORY`
3. topic/route ใหม่ → `KNOWLEDGE_MAP`
4. แหล่งใหม่/วิธีอ่านใหม่ → `SOURCE_LEDGER`
5. สถานะงาน → ไฟล์ active `PROGRESS*.md` ที่ตรงกับงาน
6. ประวัติ → `WORK_LOG`
7. ไฟล์โปรเจคที่ต้อง deploy เปลี่ยน → `CHANGES` (ไม่ใช้เป็นบัญชีแก้ไฟล์ memory/skill ทั่วไป)
8. Decision ใหม่/เปลี่ยน → จับผ่าน [`auto_memory_skill.md`](./auto_memory_skill.md), ตรวจ conflict แล้วลง `DECISION_MEMORY` พร้อม metadata และ supersedes
9. Feedback ที่เปลี่ยนแนวทางครั้งหน้า → `FEEDBACK_MEMORY`

ทุกข้อมูลใหม่ต้องผ่าน retention gate ใน [`auto_memory_skill.md`](./auto_memory_skill.md): promote, candidate, log only
หรือ discard อย่างใดอย่างหนึ่ง ห้ามใช้ “เก็บไว้ก่อนทั้งหมด” เป็นค่าเริ่มต้น

ถ้าความรู้ใหม่แก้ของเก่า ให้แก้ข้อความเดิมและบันทึกเหตุผลใน log ห้ามปล่อยสองกฎขัดกัน

## Definition of Done

- ระบุได้ว่าการตัดสินใจมาจาก source/กฎใด
- ความรู้ตามเวลาถูกตรวจใหม่
- ทุกส่วนของระบบใช้ invariant เดียวกัน
- ผลถูกตรวจในระดับเหมาะกับความเสี่ยง
- ความรู้ใหม่ถูกเก็บจุดเดียวและ route หาได้
- รายงานไฟล์สร้าง/แก้/ลบครบ
- `scripts/validate_public.sh` ผ่านโดยไม่มี FAIL; warning ต้องอธิบายหรือแก้ก่อนสรุป
