# Skill Maintenance — สร้าง/ปรับสกิลในชุดนี้เอง

มาจาก [`main_skill.md`](./main_skill.md) (ขั้นบันทึกของใหม่) — ใช้เมื่อต้อง **เพิ่ม/แก้/จัดระเบียบไฟล์ skill**
ในโฟลเดอร์ `day_dev_public` เอง (meta-skill)
(ปรับหลักการมาจากแนวคิด skill-creator)

> ถ้า runtime มี skill/tool สำหรับสร้าง skill แบบเต็มรูป (เช่น SKILL.md พร้อม metadata/script/eval)
> ให้ใช้ tool นั้นเมื่อเหมาะสม ไฟล์นี้คือกฎประจำชุด day_dev_public

---

## เมื่อไหร่ต้องแตะไฟล์ skill

หลังจบงาน ถ้าเจอของใหม่ → บันทึกกลับ (ตามท้าย [`main_skill.md`](./main_skill.md)):
- เนื้อหาเข้าไฟล์เดิมได้ → เติมในไฟล์นั้น
- เป็นเรื่องใหม่ทั้งก้อน → สร้างไฟล์ใหม่ในโฟลเดอร์นี้
- user ขอให้สรุป/อัปเดตสิ่งที่คุยในแชตลง skill → ใช้ [`conversation_log_skill.md`](./conversation_log_skill.md)
  เพื่อแยกว่าอะไรลง skill แล้ว อะไรยังไม่ได้ลง และอะไรไม่ควรลง
- user สั่ง "update skill" (โหลดเวอร์ชันล่าสุดจาก repo มาปรับใช้) → ใช้ [`update_skill.md`](./update_skill.md)

สำหรับชุด public: รับเฉพาะเนื้อหาที่เป็นความรู้ทั่วไปและเผยแพร่ได้เท่านั้น
ห้ามใส่ path เครื่องจริง ชื่อโปรเจคภายใน service จริง หรือข้อมูลลับ

## กฎการสร้าง/แก้ไฟล์ในชุดนี้

1. **หนึ่งเรื่อง หนึ่งไฟล์ ไม่ซ้ำ** — เนื้อหาอยู่ที่เดียว ที่อื่นลิงก์ไปหา (เหมือนที่ทำกับ project_structure/permission)
2. **ทุกไฟล์ขึ้นต้นด้วย "มาจากไฟล์ไหน"** — บอก parent + ขั้นใน work_flow ที่พามา
3. **เชื่อมสองทาง** — ไฟล์ใหม่ลิงก์กลับ parent และเพิ่มใน:
   - ไดอะแกรม + ตาราง index ใน `main_skill.md`
   - จุดที่เกี่ยวใน `work_flow_skill.md` (ถ้าเป็นขั้นใน flow)
4. **ภาษาไทย กระชับ** — ตัดบริบทเฉพาะของแหล่งที่มา (เช่น JIRA/ชื่อบริษัท/ชื่อโปรเจคภายใน) ปรับให้เป็นคำอธิบายทั่วไป
5. **ไม่ดึงเนื้อหาซ้ำกับสกิลที่มีในระบบ** — ถ้าระบบมีสกิลนั้นแล้ว (เช่น docx) ให้ทำเป็น router ชี้ไป ไม่ก็อปมา (ดู [`deliverable_skill.md`](./deliverable_skill.md))

## project-local `skill.md` vs Codex skill จริง

- ไฟล์ `skill.md` ที่อยู่ใน root โปรเจคเป็นแค่ project note/local instruction ยังไม่ใช่ skill ที่ Codex auto-load เอง
- ถ้าจะใช้งาน ให้บอก agent ชัดๆ ว่า "อ่าน `skill.md` ก่อน" ในโปรเจคนั้น
- ถ้าต้องการให้เป็น Codex skill จริง ให้ย้าย/ติดตั้งเป็นโครง `~/.codex/skills/<skill-name>/SKILL.md`
  และใส่ frontmatter/description ตาม skill creator pattern
- เมื่อ sync chat → skill ให้ดึงกฎที่ใช้ซ้ำมาไว้ในไฟล์โดเมน ไม่ copy ทั้ง project-local `skill.md` มาใส่ทั้งก้อน

## กฎรับอัปเดตจาก private

เมื่อ sync เนื้อหาจาก `skill/day_dev/` มาที่ `skill/day_dev_public/`:

1. คัดเฉพาะ rule/flow/หลักคิดที่ generic
2. ลบหรือแทนที่ข้อมูลเฉพาะตัวก่อนเสมอ:
   - path จริง เช่น `<local-user-path>/...`
   - ชื่อโปรเจค/ระบบ/บริการภายใน
   - port/service/docker จริงที่ไม่ควรเผยแพร่
   - token, secret, credential, env, key
3. `AGENTS.md` และ `CLAUDE.md` ใน public ต้องอ้าง path ของ public เอง
4. README public ต้องอธิบายวิธีใช้ทั้งไทยและอังกฤษ

## เช็กหลังแก้ไฟล์ skill

- ลิงก์ภายในทุกอันชี้ไฟล์ที่มีจริง (เช็ก markdown link แบบ relative ที่ชี้ไปไฟล์ `.md`)
- ไม่มีเนื้อหาซ้ำระหว่างไฟล์
- main_skill index + diagram ตรงกับไฟล์ที่มีอยู่จริง

```bash
# เช็กลิงก์เสีย
cd day_dev_public
for f in *.md; do grep -oE '\]\(\./[a-z_]+\.md\)' "$f" | sed 's/](\.\///;s/)//' | while read t; do [ -f "$t" ] || echo "$f -> $t MISSING"; done; done
```

> สร้างสกิลแบบ SKILL.md เต็ม (นอกชุดนี้) → ใช้ skill/tool creator ที่ runtime รองรับ
> หมายเหตุ: แก้ไฟล์ในแคชสกิลของระบบไม่ได้ — ชุดนี้เป็นไฟล์ของคุณเองในโฟลเดอร์ code แก้ได้อิสระ
