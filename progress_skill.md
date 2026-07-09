# Progress / Handoff Skill — ไฟล์ความจำงานที่กำลังทำ

มาจาก [`main_skill.md`](./main_skill.md) (ขั้น "คิดเสร็จก่อนลงมือ" + "ปิดงาน") และเป็นขั้นใน
[`work_flow_skill.md`](./work_flow_skill.md) [7]/[8] — ใช้ทำ **ไฟล์บันทึกความคืบหน้าของงานจริง**
เพื่อให้ agent อื่น (Codex CLI, Claude Code/CLI, หรือ session ใหม่) **ทำงานต่อได้ทันที** เมื่อ token หมด/ย้ายแชต

> ต่างจาก [`conversation_log_skill.md`](./conversation_log_skill.md) (log การ sync ความรู้เข้า skill)
> และ [`skill_maintenance_skill.md`](./skill_maintenance_skill.md) (แก้ไฟล์ skill เอง) —
> ไฟล์นี้คือ **สถานะงานที่กำลังทำ ณ ตอนนี้** (active task state) ไม่ใช่กฎถาวรของ skill
> ถ้าต้องสรุปว่า "วันนี้/เดือนนี้ทำอะไรไปบ้าง" ให้ใช้ [`work_summary_skill.md`](./work_summary_skill.md)
> และ `skill/day_dev_public/memory/WORK_LOG.md`

---

## หลักการ

งานหนึ่งอาจทำไม่จบใน session เดียว (token หมด, ย้าย agent, พักแล้วกลับมา)
→ ต้องมี **ไฟล์กลางที่จดว่า "คิดแผนไว้ยังไง / ทำถึงไหน / เหลืออะไร / แนะนำอะไรไปแล้ว"**
เพื่อให้คนถัดไป (หรือตัวเราเองรอบหน้า) อ่านไฟล์เดียวแล้วต่อได้เลย ไม่ต้องไล่อ่านแชตเก่า

**สร้าง "หลังคิดแผนเสร็จ ก่อนลงมือแก้ไฟล์" เสมอ** แล้ว **อัปเดตหลังทำแต่ละก้อน** และตอนใกล้ token หมด

---

## ไฟล์อยู่ที่ไหน / ชื่ออะไร

- อยู่ในโฟลเดอร์ skill ชุดนี้: **`skill/day_dev_public/memory/PROGRESS.md`** (โฟลเดอร์ `skill/day_dev_public/memory/`)
- มีหลายงานค้างพร้อมกัน → เก็บได้หลายไฟล์ เช่น `skill/day_dev_public/memory/PROGRESS-<งาน>.md`
- เป็น **สถานะงานที่กำลังทำ (work state) ไม่ใช่กฎ skill** — วางไว้ในโฟลเดอร์ skill เพื่อให้ agent เจอที่เดียว
  เป็นไฟล์ local ของงานที่ทำอยู่ (ไม่ใช่ deliverable); ถ้าไม่อยากคอมมิต → ใส่ `memory/` ใน `.gitignore`
- entry point ของ workspace (`AGENTS.md`/`CLAUDE.md`) ต้องชี้มาที่ไฟล์นี้ เพื่อให้ agent อ่านตอนเริ่มงาน

---

## เมื่อไหร่ทำ / ไม่ทำ

- **ทำ:** งานจริงที่มีหลายขั้น/แตะหลายไฟล์/น่าจะทำไม่จบรอบเดียว/เป็น plan mode
- **ไม่ทำ:** ถามสั้น, คุยทั่วไป, งานจบใน 1–2 step (over-head ไม่คุ้ม)

---

## วงจรการใช้ (lifecycle)

1. **ก่อนลงมือ (หลังเข้าใจงาน + วางแผนเสร็จ):** สร้าง/เปิด `skill/day_dev_public/memory/PROGRESS.md` แล้วเขียน
   เป้าหมาย + checklist ของแผน (`[ ]` ทุกข้อ) + context (ไฟล์/โปรเจคที่เกี่ยว)
2. **ระหว่างทำ:** ทำข้อไหนเสร็จ เปลี่ยน `[ ]` → `[x]`; ข้อที่กำลังทำใส่ `[~]`; เจอ blocker จดไว้
3. **หลังทำแต่ละก้อน / ก่อน token หมด / ก่อนปิดงาน:** อัปเดตสรุปสถานะ:
   - ทำอะไรไปแล้ว (Done) · กำลังทำ (In progress) · ยังไม่ได้ทำ (Next/TODO)
   - **คำแนะนำที่เสนอ user** แยก "ทำตามแล้ว" กับ "ยังไม่ได้ทำตาม" (ค้างรอ user ตัดสินใจ)
   - ไฟล์ที่แก้ + วิธี verify · blocker/คำถามค้าง · timestamp + ชื่อ session/agent
4. **จบงานจริง (ทุกข้อ `[x]`):** ปิดด้วยสรุปสั้นๆ ว่าเสร็จแล้ว เหลือแค่ข้อเสนอที่ user ยังไม่รับ (ถ้ามี)
5. **หลังปิดงาน:** append `skill/day_dev_public/memory/WORK_LOG.md` ตาม [`work_summary_skill.md`](./work_summary_skill.md)
   เพื่อให้สรุปรายวัน/รายเดือนได้ ไม่ต้องย้อนอ่าน PROGRESS เก่า

> ถ้า user ถามว่า "เหลืออะไร", "ยังไม่ได้ทำอะไร", หรือ "ยังไม่ได้ทำอะไรตามคำแนะนำ"
> ให้ตอบจาก `PROGRESS.md` + `WORK_LOG.md` คู่กันตาม [`work_summary_skill.md`](./work_summary_skill.md)
> และต้องรวมทั้ง Next, blocker, และคำแนะนำ `⏳ ยังไม่ได้ทำตาม`

> เปิด session ใหม่/ย้าย agent → **อ่าน `skill/day_dev_public/memory/PROGRESS.md` ก่อนเป็นอันดับแรก** (ผ่าน AGENTS.md/CLAUDE.md)
> แล้วทำต่อจาก Next/TODO — ไม่ต้องเริ่มใหม่

---

## เทมเพลตไฟล์ `skill/day_dev_public/memory/PROGRESS.md`

```markdown
# PROGRESS — <ชื่องาน>

อัปเดตล่าสุด: <YYYY-MM-DD HH:MM> · โดย: <session/agent> · สถานะ: กำลังทำ / เสร็จ / ค้าง(blocked)

## เป้าหมาย
<งานนี้ต้องได้อะไรออกมา ขอบเขตแค่ไหน>

## บริบท / ไฟล์ที่เกี่ยว
- <path/ไฟล์ + หมายเหตุสั้นๆ>

## Checklist
- [x] ทำเสร็จแล้ว …
- [~] กำลังทำ …
- [ ] ยังไม่ได้ทำ …

## ทำไปถึงไหนแล้ว (Done)
- <สรุปสิ่งที่เสร็จ + ไฟล์ที่แก้ + verify ผ่านอะไร>

## ยังไม่ได้ทำ / ทำต่อ (Next)
- <ขั้นถัดไปที่ชัดเจนพอให้คนอื่นหยิบทำต่อได้>

## คำแนะนำ (Recommendations)
- ✅ ทำตามแล้ว: <ข้อเสนอที่ user รับและทำแล้ว>
- ⏳ ยังไม่ได้ทำตาม: <ข้อเสนอที่เสนอไปแต่ user ยังไม่ตัดสินใจ/ยังไม่ทำ>

## Blocker / คำถามค้าง
- <ติดอะไร รอ artifact/คำตอบอะไรจาก user>
```

---

## เชื่อมกับ end-of-work (จบงานทุกครั้งต้องครบ 4 อย่าง)

ปิดงานจริงทุกครั้งให้เดินครบ (ดู [`work_flow_skill.md`](./work_flow_skill.md) [8] — Definition of Done):

1. **เสนอสิ่งที่ควรปรับ** (recommend) — บอก user แม้ไม่ได้ขอ พร้อมจุด+เหตุผล+ผลกระทบ จัดอันดับ
2. **อัปเดต `skill/day_dev_public/memory/PROGRESS.md`** — done/next/คำแนะนำ(ทำแล้ว/ยังไม่ทำ)/blocker
   โดยคำแนะนำที่ยังไม่ได้ทำตามต้องจดไว้ครบ ห้ามตัดเพราะเป็นแค่ optional/debt
3. **append `skill/day_dev_public/memory/WORK_LOG.md`** — สรุปรายวัน/เดือน/สไลด์ ตาม [`work_summary_skill.md`](./work_summary_skill.md)
   และหัวข้อ `เหลือ/แนะนำ` ต้องรวมงานค้าง, blocker, และคำแนะนำที่ยังไม่ได้ทำตาม
4. **บันทึกความรู้ใหม่เข้า skill** (ถ้ามีกฎ/แพตเทิร์นใหม่) → [`skill_maintenance_skill.md`](./skill_maintenance_skill.md)
5. **log แชต (ถ้าถูกขอ)** — user ขอ sync สิ่งที่คุย → [`conversation_log_skill.md`](./conversation_log_skill.md)

> ข้อ 1 กับ 2 ผูกกัน: คำแนะนำที่เสนอ (ข้อ 1) ต้องถูกจดใน PROGRESS (ข้อ 2) แยก "ทำแล้ว/ยังไม่ทำ"
> เพื่อรอบหน้าจะได้รู้ว่าเคยแนะอะไรไปแล้วยังไม่ได้ทำตามบ้าง
