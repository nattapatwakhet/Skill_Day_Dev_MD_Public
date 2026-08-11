# Video Skill — โดเมนงานวิดีโอ

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [3] — โดเมนระดับเดียวกับ code / deliverable
ใช้เมื่องานคือ **ตัด/ทำ/แปลง/รวมวิดีโอ** หรือทำคอนเทนต์วิดีโอ

> ผสมโดเมนอื่นได้: video + writing (สคริปต์/บรรยาย) · video + deliverable (ส่งไฟล์/แนบสไลด์) · video + research (หาเนื้อหา)

---

## ขั้นตอน

```
1. เป้าหมาย + สเปก  → วิดีโออะไร ยาวเท่าไหร่ อัตราส่วน/ความละเอียด ปลายทางใช้ที่ไหน
2. เตรียมวัตถุดิบ    → คลิป/ภาพ/เสียง/สคริปต์
3. ทำ/ตัด           → ตัดต่อ/แปลง/รวม ตามสเปก
4. ตรวจ             → ดูผลจริง ภาพ/เสียง/ความยาว/ขนาดไฟล์ ตรงสเปกไหม
```

## หลัก

- **รู้ปลายทางก่อน** — แพลตฟอร์ม/อัตราส่วนต่างกัน (16:9, 9:16, 1:1) กำหนดสเปก
- **เก็บต้นฉบับ** ก่อนแปลง อย่าทับของเดิม
- ไฟล์ใหญ่ → ทำในโฟลเดอร์ที่แชร์ แล้วแชร์ผลให้ user ดู

## เครื่องมือ

- ตัด/แปลงด้วยสคริปต์ (เช่น ffmpeg) → รันใน sandbox bash หรือถ้าต้องรันบนเครื่อง user → [`terminal_skill.md`](./terminal_skill.md)
- ถ้ามีสกิล/connector ตัดต่อวิดีโอในระบบ → ค้นก่อนใช้ (ดู [`permission_skill.md`](./permission_skill.md))
- Adobe Premiere ผ่าน MCP bridge (สร้าง/แก้ timeline จากคำสั่ง) → [`premiere_mcp_video_skill.md`](./premiere_mcp_video_skill.md)

## Adobe Premiere ผ่าน MCP (กฎที่เจอจริง)

- ก่อนแก้ timeline ให้เรียก read-only discovery ก่อน (`get_project_info`, `get_active_sequence`,
  `get_full_sequence_info`, `list_project_items`) แล้วจึง import/place/transform/save
- `export_frame` อาจรายงานสำเร็จแต่ไม่เลื่อน playhead ตาม `time`; QA หลายช่วงต้อง `set_playhead_position(time)`
  ก่อน แล้วตรวจเฟรมจริง หรือยืนยันตำแหน่งด้วย `get_clip_properties`
- `set_clip_volume` รับค่า **linear amplitude** ไม่ใช่ dB; แปลงด้วย `gain = 10^(dB/20)` เช่น -20 dB = `0.1`
  และอ่านค่ากลับหลังตั้งทุกครั้ง เพราะส่ง `-20` ตรงๆ จะถูก clamp เป็น 0 (เงียบ)
- Overlay ที่ต้องลากวางแยกใน Premiere (ข้อความ/กรอบ/ตัวชี้) ให้ใช้ canvas แบบ bounded (ครอปพอดีองค์ประกอบ
  หรือขนาดมาตรฐานต่อแทร็ก) วางด้วย Motion Position + Scale 100% — ห้ามใช้ PNG โปร่งใสขนาดเต็ม sequence
- ถ้าผู้ใช้ต้องแก้คำใน Premiere ต้องทำเป็น Native Text/Essential Graphics ตั้งแต่ต้น ไม่ใช่ render เป็น PNG;
  อย่าถือว่า MOGRT ใช้ได้เพียงเพราะ text injection/readback สำเร็จ — บางเวอร์ชันรับค่าแต่ไม่เรนเดอร์ภาพ
  ต้อง export เฟรมตรวจจริงก่อนแทนของเดิม ถ้าไม่เรนเดอร์ให้ rollback
- ทางเลือกที่แก้คำ+เรนเดอร์ได้จริงเมื่อ Native Text ไม่เวิร์ก: SRT + `create_caption_track` (แจ้งชัดว่าเป็น Caption
  ไม่ใช่กราฟิกวางอิสระ) และเลือก caption ทีละชิ้นเวลาแก้ Font Size/Zone อ่านค่ากลับ + ตรวจ Program Monitor ทุกช่วง
- คุม Premiere GUI บนจอ Retina: `screencapture` อาจได้ภาพ 2× แต่เครื่องมือคลิกใช้ logical point;
  วัด scale ก่อน batch และคลิกทดสอบหนึ่งจุดพร้อมอ่าน Properties กลับก่อนทำหลายรายการ
- บันทึกผ่าน File > Save แล้วตรวจว่าเครื่องหมาย `*` หลังชื่อโปรเจกต์หายจริง จึงถือว่าบันทึกสำเร็จ

## โยง

- เขียนสคริปต์/บรรยาย → [`writing_skill.md`](./writing_skill.md)
- ส่งมอบไฟล์/แนบเอกสาร → [`deliverable_skill.md`](./deliverable_skill.md)
- ตรวจผลก่อนส่ง → [`review_skill.md`](./review_skill.md)

> ยังเป็นโครงกว้าง — เพิ่มแพตเทิร์น/เครื่องมือเฉพาะเมื่อเจองานจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
