# Auto Memory Skill — เรียนรู้กลับเข้าระบบอย่างควบคุมได้

มาจาก [`knowledge_application_skill.md`](./knowledge_application_skill.md) ใช้หลังงานหรือบทสนทนาที่มีข้อมูลใหม่ซึ่งอาจนำกลับมาใช้ได้

## วงจร

1. **Capture** — ถ้ายังไม่แน่ใจว่าเป็นความจริงถาวร ให้เพิ่ม candidate ใน [`memory/MEMORY_INBOX.md`](./memory/MEMORY_INBOX.md) ผ่าน `scripts/capture_memory.sh`
2. **Classify** — แยกเป็น preference, decision, project knowledge, source, feedback หรือ transient log
3. **Verify** — หา source จริง กำหนด confidence/sensitivity และตรวจข้อมูลใหม่กับ [`memory/DECISION_MEMORY.md`](./memory/DECISION_MEMORY.md)
4. **Resolve** — ถ้าขัดกับกฎเดิม ห้ามมี Active สองชุด: แก้รายการเดิมหรือสร้างรายการใหม่ที่ `supersedes` ของเดิม แล้วเปลี่ยนของเดิมเป็น `superseded`
5. **Promote** — ย้ายไป source of truth แห่งเดียว: USER_MEMORY, DECISION_MEMORY, skill ปลายทาง, SOURCE_LEDGER หรือ FEEDBACK_MEMORY
6. **Index** — เพิ่ม keyword/alias ใน [`memory/RETRIEVAL_INDEX.md`](./memory/RETRIEVAL_INDEX.md)
7. **Age** — กำหนด `last_verified_at` และ `review_after` ตาม [`memory/FRESHNESS_POLICY.md`](./memory/FRESHNESS_POLICY.md)
8. **Validate** — รัน `scripts/validate_public.sh`; ปิดงานไม่ได้เมื่อมี FAIL หรือ candidate ค้างโดยไม่มี owner/next action

## Retention gate — อะไรควรจำ / ไม่ควรจำ

ก่อน Capture ให้ถามว่า “ข้อมูลนี้จะเปลี่ยนการตัดสินใจในงานอนาคตหรือไม่” แล้วเลือกชะตาเดียว:

| ชะตา | ใช้เมื่อ | ที่เก็บ |
|---|---|---|
| Promote | มีหลักฐาน ใช้ซ้ำได้ และรู้ source of truth | decision / user memory / skill ปลายทาง |
| Candidate | น่าจะใช้ซ้ำ แต่ยังขาดหลักฐานหรือ conflict check | `MEMORY_INBOX.md` |
| Log only | มีประโยชน์ต่อการย้อนเหตุการณ์ แต่ไม่ควรเป็นกฎ | `WORK_LOG.md` / archive |
| Discard | ชั่วคราว ซ้ำ หาใหม่ได้ง่าย ไม่มีผลต่อการตัดสินใจ หรือเสี่ยงเก็บเกินจำเป็น | ไม่บันทึก |

Promote ได้เมื่อครบทุกข้อ: มี source ย้อนกลับได้, ระบุขอบเขตใช้ได้, ไม่ซ้ำ source of truth เดิม, กำหนด freshness ได้
และไม่มี secret/ข้อมูลบุคคลที่ไม่จำเป็น ถ้าขาดข้อใดข้อหนึ่งห้ามเลื่อนเป็นความจำถาวร

ไม่จำข้อความแชตดิบ, output ชั่วคราว, hypothesis เดี่ยว, path/session/token ที่หมดอายุ, รายละเอียดที่สร้างใหม่ได้จาก source
ภายในเวลาอันสั้น หรือ preference ที่ผู้ใช้ยังไม่ได้ยืนยัน เพราะสิ่งเหล่านี้เพิ่ม noise และทำให้ retrieval เลือกของเก่าผิด

## Forget / compact — สมองต้องลืมเป็น

- ความรู้ถูกแทนที่ → mark `superseded` และเอา alias หลักไปชี้ตัวใหม่; เก็บตัวเก่าเพื่อ audit เท่านั้น
- ระบบเลิกใช้ → mark `retired`; ถอนออกจาก route งานทั่วไป
- candidate ตรวจแล้วไม่จริง/ไม่คุ้มเก็บ → บันทึกเหตุผล reject แบบสั้นใน log แล้วลบจาก Inbox
- progress ที่จบ → ย่อผลลัพธ์ลง WORK_LOG แล้วเอารายละเอียดออกจาก active PROGRESS
- log/archive โตได้ แต่ห้ามถูกโหลดอัตโนมัติ; router ต้องชี้เฉพาะ source of truth ที่ยัง active
- การลืมหมายถึงถอนออกจากเส้นทางตัดสินใจ ไม่จำเป็นต้องทำลายหลักฐานย้อนหลัง

## เกณฑ์จับอัตโนมัติ

จับเมื่อมีอย่างน้อยหนึ่งข้อ:

- ผู้ใช้ยืนยันหลักการ ความชอบ หรือแก้ความเข้าใจเดิม
- พบ root cause/invariant ที่ใช้ซ้ำได้
- พบ source, path, schema, command หรือวิธีตรวจใหม่
- ผลงานจริงยืนยันว่าแนวทางหนึ่งผ่าน/ไม่ผ่าน

ไม่จับ password, token, session, private key, ข้อมูลชั่วคราว, ตัวเลข incident เฉพาะครั้ง หรือข้อสันนิษฐานที่ยังไม่มีหลักฐานเป็นความจำถาวร

## Promotion map

| Candidate | ปลายทาง |
|---|---|
| วิธีทำงาน/ความชอบที่ผู้ใช้ยืนยัน | `USER_MEMORY.md` |
| กฎข้ามงานที่ผ่านหลักฐาน | `DECISION_MEMORY.md` |
| ขั้นตอน/แพตเทิร์นเทคนิค | skill รายโดเมน |
| แหล่งหรือวิธีอ่านใหม่ | `SOURCE_LEDGER.md` |
| ผลตอบรับที่ช่วยเลือกแนวทางครั้งหน้า | `FEEDBACK_MEMORY.md` |
| งานเฉพาะครั้ง | `WORK_LOG.md` / active `PROGRESS*.md` ที่ตรงงานเท่านั้น |

## คำสั่ง Capture

```bash
skill/day_dev_public/scripts/capture_memory.sh <type> <source> <summary> <source_ref>
```

คำสั่งนี้เพิ่ม candidate เท่านั้น ไม่เลื่อนเป็นความจำถาวรอัตโนมัติ
