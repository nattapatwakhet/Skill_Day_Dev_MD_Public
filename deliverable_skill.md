# Deliverable Skill — สร้างไฟล์ส่งมอบ / เอกสาร / อาร์ต

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) — ใช้เมื่องานคือ **สร้างไฟล์ส่งมอบ** (เอกสาร, สไลด์, สเปรดชีต, PDF, อาร์ต, หน้าเว็บ artifact)
ไม่ใช่แก้โค้ดโปรเจค

> ของพวกนี้ควรใช้สกิล/เครื่องมือเฉพาะทางที่ runtime มีอยู่แล้ว เช่น document, spreadsheet, presentation, PDF, image/design tools
> ไฟล์นี้เป็น **ตัวเชื่อม (router)** บอกว่างานแบบไหนเรียกสกิลไหน — ไม่เก็บวิธีทำซ้ำ
> หลัก: ค้นข้อมูล/เนื้อหาให้ครบก่อน แล้วค่อยอ่านสกิล format ตอนจะสร้างไฟล์

---

## ตารางเลือกสกิล

| งาน | ใช้สกิล |
|---|---|
| Word / .docx (รายงาน, จดหมาย, memo) | `docx` |
| PowerPoint / .pptx (สไลด์, เด็ค) | `pptx` |
| Excel / .xlsx / .csv (ตาราง, งบ, โมเดล) | `xlsx` |
| PDF (อ่าน/รวม/แยก/กรอกฟอร์ม/สร้าง) | `pdf` |
| โปสเตอร์/อาร์ตเป็น .png/.pdf (ดีไซน์) | image/design tool |
| อาร์ตเจน p5.js / generative art | code/artifact tool |
| ธีมสี/ฟอนต์ให้ artifact | design/theme guidance |
| GIF เคลื่อนไหว | image/video tool |
| HTML artifact ซับซ้อน | web artifact/frontend tool |
| เขียนเอกสาร/สเปก/proposal แบบ co-author | writing/document tool |
| internal comms (อัปเดต/ประกาศภายใน) | writing/report tool |
| สร้าง MCP/server/tooling | code/backend tool |
| โค้ดเรียก AI API / SDK | official docs/reference ของ provider นั้น |

## ลำดับการทำงาน (สำคัญ)

1. **ค้น/รวบรวมเนื้อหาก่อน** — ข้อมูล, ตัวเลข, ข้อเท็จจริง, แหล่งอ้างอิง ให้ครบ (ยังไม่อ่านสกิล format)
2. **อ่านสกิล format ที่เกี่ยวตอนจะสร้างไฟล์** — เช่น `Read` SKILL.md ของ docx/pptx/xlsx/pdf ก่อนลงมือ
3. **สร้างไฟล์จริง** บันทึกลงโฟลเดอร์ที่แชร์ แล้วแชร์ให้ user เห็น
4. ถ้าต้องดีไซน์ UI/หน้าเว็บเอง (ไม่ใช่เอกสาร) → ดู [`frontend_design_skill.md`](./frontend_design_skill.md)

> ถ้าเนื้อหาในไฟล์ส่งมอบเป็นการสรุปงาน eng ให้คนไม่ใช่ dev → จัดถ้อยคำด้วย [`report_skill.md`](./report_skill.md) ก่อน แล้วค่อยลงสกิล format
> ถ้าจะสร้าง/ปรับ "สกิล" เอง → [`skill_maintenance_skill.md`](./skill_maintenance_skill.md)
