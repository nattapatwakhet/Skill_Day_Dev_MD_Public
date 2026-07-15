# AGENTS.md — Day Dev Public Skill

**ก่อนเริ่มงานทุกครั้งใน workspace ที่ติดตั้งชุดนี้ ให้อ่าน `skill/day_dev_public/main_skill.md` ก่อนเสมอ แล้วเดินตาม `skill/day_dev_public/work_flow_skill.md`**

`skill/day_dev_public/` คือชุด skill หลักของ workspace นี้ เป็นไฟล์จริงในโปรเจกต์ แก้ได้ตรงๆ และควรปรับให้ตรงกับโครงสร้างโปรเจกต์ของคุณ

> ถ้าวางไฟล์ชุดนี้ไว้ที่ path อื่น ให้แก้ path ในไฟล์นี้ให้ตรงกับตำแหน่งจริง

## ลำดับ

0. **ถ้ามี `skill/day_dev_public/memory/PROGRESS.md` → อ่านก่อนเป็นอันดับแรก** เพื่อดูว่างานค้างทำถึงไหน/เหลืออะไร แล้วทำต่อ (ดู `skill/day_dev_public/progress_skill.md`)
1. อ่าน `skill/day_dev_public/main_skill.md` (วิธีคิด + index ทุกไฟล์)
2. เดินตาม `skill/day_dev_public/work_flow_skill.md` (จำแนกโดเมน → เปิดสกิลที่เกี่ยว → ทำ → ตรวจ → เสนอสิ่งที่ควรปรับ → บันทึก)
3. ตามกฎในไฟล์ skill ที่เกี่ยวกับงานนั้น เช่น code → `code_skill.md` → ไฟล์ภาษา/framework
4. **งานหลายขั้น: สร้าง `skill/day_dev_public/memory/PROGRESS.md` ก่อนลงมือ แล้วอัปเดตหลังทำแต่ละก้อน** (`skill/day_dev_public/progress_skill.md`) — resume ข้าม session/agent (Codex, Claude CLI) ได้
5. **จบงานทุกครั้ง (Definition of Done): แนะนำสิ่งที่ควรปรับ + อัปเดต PROGRESS + append WORK_LOG + CHANGES(ถ้าแตะไฟล์) + update skill + log แชต(ถ้าถูกขอ)**
6. เจอของใหม่หลังจบงาน → บันทึกกลับเข้าชุด skill ตาม `skill/day_dev_public/skill_maintenance_skill.md`
7. ถ้า user ขอให้อ่าน/สรุป/อัปเดตสิ่งที่คุยในแชตลง skill → ใช้ `skill/day_dev_public/conversation_log_skill.md`

> โครงสร้างโปรเจกต์จริงของ workspace ให้บันทึกใน `skill/day_dev_public/project_structure_skill.md`
> docker/service ของ workspace ให้บันทึกใน `skill/day_dev_public/docker_skill.md`
> ความคืบหน้างานที่ทำค้างอยู่ที่ `skill/day_dev_public/memory/PROGRESS.md` (ทะเบียนวิธีใช้ใน `skill/day_dev_public/progress_skill.md`)
> สรุปงานย้อนหลังรายวัน/รายเดือนอยู่ที่ `skill/day_dev_public/memory/WORK_LOG.md` (วิธีใช้ใน `skill/day_dev_public/work_summary_skill.md`)
> ไฟล์ที่แก้รอขึ้น server อยู่ `skill/day_dev_public/memory/CHANGES.md` (วิธีใช้ใน `skill/day_dev_public/deploy_skill.md`) — user บอก "อัปขึ้น server แล้ว" → mark deployed
> อยากอัปเดต skill เป็นเวอร์ชันล่าสุด → user สั่ง **"update skill"** (ดู `skill/day_dev_public/update_skill.md`)
