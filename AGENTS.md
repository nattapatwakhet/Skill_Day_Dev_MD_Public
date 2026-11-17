# AGENTS.md — Day Dev Public Skill

ก่อนเริ่มงานทุกครั้ง ให้หา root ของชุดนี้ แล้วทำตามลำดับ:

1. รัน `skill/day_dev_public/scripts/list_active_progress.sh` และอ่าน progress ที่ตรงกับงาน
2. อ่าน `skill/day_dev_public/main_skill.md`
3. เดินตาม `skill/day_dev_public/work_flow_skill.md` และเปิด skill เฉพาะโดเมนที่เกี่ยว
4. งานหลายขั้นให้สร้างหรือเลือก `memory/PROGRESS*.md` แยกตามงาน และอัปเดตหลังแต่ละก้อน
5. ปิดงานด้วยการตรวจผล อัปเดต progress, `memory/WORK_LOG.md`, `memory/CHANGES.md` เมื่อมีไฟล์เปลี่ยน และบันทึกความรู้ที่ควรใช้ซ้ำ

## กฎการลงมือ

- อ่าน ค้น ตรวจ และวิเคราะห์แบบ read-only ได้ทันที
- ค่าเริ่มต้นของการสร้าง/แก้/เพิ่ม/ลบคือ **ปรึกษาก่อนทำ**: สรุปสิ่งที่เข้าใจ วิธีทำ ผลลัพธ์ จุดกระทบ เงื่อนไข ความเสี่ยง และคำแนะนำ แล้วรอการยืนยัน
- ถ้าผู้ใช้พูดว่า “ทำเลย”, “ทำตามนี้”, “ทำอัตโนมัติ” หรืออนุมัติแผนแล้ว ให้ลงมือในขอบเขตนั้นต่อได้ ไม่ถามซ้ำ
- standing authorization ใช้ได้เฉพาะเป้าหมายและขอบเขตที่ตกลง หยุดเมื่อผู้ใช้บอกพัก, metric ไม่ดีขึ้น, เกิดความเสี่ยงใหม่ หรือจำเป็นต้องทำ destructive/external action ที่ยังไม่อนุมัติ
- ห้ามใส่ข้อมูลส่วนตัว secret หรือรายละเอียดระบบจริงลง public skill

ถ้าติดตั้งไว้ path อื่น ให้ปรับ prefix ของ path ในไฟล์นี้ให้ตรงตำแหน่งจริง

คำสั่ง `update skill` ให้ใช้ `update_skill.md`: ตรวจ delta แล้วเรียบเรียง/ลดซ้ำ/ตรวจ conflict-freshness-provenance
ของ memory, workflow rules และ knowledge ก่อน validate/commit/push; ห้ามทำให้ Git สะอาดด้วยการ commit secret,
generated/build/cache/backup หรือ deletion ที่ provenance ไม่ชัด
