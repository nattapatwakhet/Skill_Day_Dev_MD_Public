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

## เทส

- `pytest` / `unittest` — เขียนเทสที่ reproduce แล้วทำให้ผ่าน (หลักการกลางใน [`debug_skill.md`](./debug_skill.md) / [`karpathy_skill.md`](./karpathy_skill.md))

## รัน/ดู log

- ใน sandbox: `python3 ... ` ได้ถ้าไม่ต้องแตะ docker/ฮาร์ดแวร์ของ user
- บนเครื่อง user (docker/ฮาร์ดแวร์) → ผ่าน [`terminal_skill.md`](./terminal_skill.md)

> ยังเป็นโครงกว้าง — เพิ่ม convention/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
