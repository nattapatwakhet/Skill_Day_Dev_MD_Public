# Python Skill — ภาษา Python (backend / desktop / สคริปต์)

มาจาก [`code_skill.md`](./code_skill.md) — Python ใช้หลายที่ในชุดนี้ (ไม่ผูกกลุ่มเดียว):

| ใช้ที่ | ตัวอย่างจริง | docker | หมายเหตุ |
|---|---|---|---|
| backend / ML | `<workspace-root>/api/python/<service>` | ✓ | ถ้าเปิดเป็น API → [`api_skill.md`](./api_skill.md) |
| desktop / utility | `<workspace-root>/program/<tool>` (`app.py`) | ✗ | ฮาร์ดแวร์/desktop รันบนเครื่อง user |
| สคริปต์ data | `<workspace-root>/scripts/python/` | ✗ | งานข้อมูล → คู่กับ [`data_skill.md`](./data_skill.md) |

> อ่าน [`code_skill.md`](./code_skill.md) + [`coding_principles_skill.md`](./coding_principles_skill.md) ก่อน · โครงสร้างดู [`project_structure_skill.md`](./project_structure_skill.md)

---

## กฎหลัก (Python)

- ตั้งชื่อตาม PEP8: ฟังก์ชัน/ตัวแปร `snake_case`, class `PascalCase`, ค่าคงที่ `UPPER_CASE`
  (ถ้าโปรเจคมี convention เดิม → ตามของเดิม ดู scope ใน code_skill)
- แยกไฟล์/ฟังก์ชันตามหน้าที่ ไม่ยัด logic รวมก้อนเดียว
- จัดการ error ด้วย `try/except` ที่เจาะจง exception ไม่ใช่ `except:` เปล่า
- **กันความปลอดภัย**: validate input, ห้าม SQL injection (ใช้ parameter binding), ห้าม `eval`/`exec` กับ input จากภายนอก
- ใช้ virtualenv / requirements.txt แยก dependency ของแต่ละโปรเจค

## ตามชนิดงาน

- **เป็น API ไหม?** → ดู [`api_skill.md`](./api_skill.md) (REST/auth/response)
- **backend รันบน docker** → [`docker_skill.md`](./docker_skill.md) (เช่น service ที่ build จาก python)
- **desktop/ฮาร์ดแวร์** → รันบนเครื่อง user ไม่ใช่ docker → ดู [`terminal_skill.md`](./terminal_skill.md)
- **งานข้อมูล/ML** → หลักวิเคราะห์อยู่ [`data_skill.md`](./data_skill.md)

## Desktop utility + System Tray

สำหรับ Python desktop utility ที่มี hardware, local web viewer และ System Tray:

- ห้ามตรวจ hardware/network ใน callback ที่ใช้ render เมนู tray โดยตรง — ให้ background monitor ตรวจตามช่วงเวลา
  แล้วเก็บสถานะล่าสุดใน memory; callback ของเมนูคืนเฉพาะ cached status เพื่อไม่ให้เมนูค้าง
- เริ่ม background monitor หลัง tray พร้อมทำงานแล้ว และใช้ `threading.Event.wait(interval)` แทน `sleep`
  เพื่อให้ shutdown หยุด worker ได้ทันที
- งานที่ user กดจาก tray แล้วอาจช้า เช่น ตรวจเวอร์ชัน/เรียก API ต้องรันใน daemon thread และแจ้งผลครบทั้ง
  สำเร็จ, ไม่มีข้อมูลใหม่ และเชื่อมต่อไม่ได้
- สถานะใน tray ต้องสื่อความหมายได้โดยไม่พึ่งสีอย่างเดียว เช่น `🟢 พร้อมใช้งาน` / `🔴 ไม่พบอุปกรณ์`
  และ refresh เมนูหลัง background state เปลี่ยน
- ถ้ามี local viewer ให้ bind เฉพาะ loopback เป็นค่าเริ่มต้น, แสดงข้อมูลเป็น read-only, มี copy action ราย field,
  แยก device state ออกจาก operation state และไม่โหลด dependency จาก CDN ถ้าต้องทำงานออฟไลน์
- เมื่อแพ็กด้วย PyInstaller ต้องเพิ่ม template/static/resource directories ใน build data และ resolve path ผ่าน `_MEIPASS`;
  ทดสอบทั้ง source mode และ packaged mode

### Desktop version update

- ตรวจอัตโนมัติหลัง tray พร้อมแล้วและตรวจซ้ำตามช่วงเวลาที่ไม่รบกวน; มีเมนู manual check แยกต่างหาก
- เปรียบเทียบ semantic version หลัง normalize prefix/build suffix และเติม segment ที่ขาดก่อนเทียบ
- แยก version fields ต่อ OS (macOS/Windows/Linux) ไม่ยืม field ของ mobile platform หรืออีก OS หนึ่ง
- API ล้มเหลวในรอบอัตโนมัติ → log และทำงานต่อโดยไม่เด้ง popup; manual check → แจ้งว่าตรวจไม่สำเร็จ
- ไม่มีเวอร์ชันใหม่ → automatic ไม่แจ้ง; manual ต้องแจ้งว่าเป็นเวอร์ชันล่าสุด
- มีเวอร์ชันใหม่แบบ optional → ปุ่ม `อัปเดต` + `ไว้ภายหลัง`; แบบ forced → ไม่มีปุ่ม dismiss/later
- รอบอัตโนมัติแจ้งรุ่นเดิมเพียงครั้งเดียวต่อ process; manual check อนุญาตให้เปิดรายละเอียดรุ่นเดิมซ้ำได้
- network call, notification และการเปิด update UI ต้องไม่ block tray thread
- ก่อนติดตั้งจริงต้องตรวจ checksum/code signature ของไฟล์ดาวน์โหลด และ validate URL/update schema ก่อนใช้

## เทส

- `pytest` / `unittest` — เขียนเทสที่ reproduce แล้วทำให้ผ่าน (หลักการกลางใน [`debug_skill.md`](./debug_skill.md) / [`karpathy_skill.md`](./karpathy_skill.md))
- Desktop utility ควร mock hardware, network, browser และ tray notification; ทดสอบ platform mapping,
  no-update/update/forced/API-failure โดยไม่พึ่งอุปกรณ์จริง

## รัน/ดู log

- ใน sandbox: `python3 ... ` ได้ถ้าไม่ต้องแตะ docker/ฮาร์ดแวร์ของ user
- บนเครื่อง user (docker/ฮาร์ดแวร์) → ผ่าน [`terminal_skill.md`](./terminal_skill.md)

> ยังเป็นโครงกว้าง — เพิ่ม convention/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
