# API Skill — งานทำ API (ใช้ร่วมทุก backend)

มาจาก [`code_skill.md`](./code_skill.md) / [`php_skill.md`](./php_skill.md) — เปิดเมื่อ backend นี้ **ทำ API**
(รับ/ส่ง JSON, มี endpoint ให้ client อื่นเรียก) — ใช้ร่วม CI3 / CI4 / PHP / ภาษา backend อื่น

> ไฟล์นี้เป็น **หลักการ API กลาง** ไม่ผูก framework — กฎ syntax เฉพาะอยู่ในไฟล์ภาษา/เฟรมเวิร์ก

---

## เช็คก่อนว่าเป็นงาน API ไหม

ใช่ถ้า: มี endpoint, รับ/ส่ง JSON, ให้ frontend/แอป/ระบบอื่นเรียก — ถ้าใช่ ทำตามด้านล่าง

## หลัก REST

- **เมธอดให้ตรงความหมาย** — GET อ่าน, POST สร้าง, PUT/PATCH แก้, DELETE ลบ
- **endpoint เป็นคำนาม** (`/users`, `/orders/123`) ไม่ใช่กริยา
- **status code ให้ถูก** — 200/201 สำเร็จ, 400 input ผิด, 401/403 สิทธิ์, 404 ไม่เจอ, 422 validate ไม่ผ่าน, 500 error ฝั่ง server
- **รูปแบบ response สม่ำเสมอทั้งระบบ** — โครง JSON เดียวกัน (เช่น `{status, message, data}`) ทุก endpoint

## ความปลอดภัย (สำคัญ)

- **validate input ทุก endpoint** ก่อนแตะ DB
- **auth** — token/session ตรวจก่อนเข้าถึง resource ที่ต้องล็อกอิน
- **ห้าม SQL injection** → binding/prepared เสมอ (ดูกฎใน [`php_skill.md`](./php_skill.md))
- ไม่โชว์ error/stack ดิบสู่ client, ไม่ leak ข้อมูล sensitive
- CORS/rate limit ตามต้องการ

## ตรวจ/เทส

- เทส endpoint จริง (request → ดู status + body) — ถ้าผ่านเครื่อง user/ docker → ดู [`terminal_skill.md`](./terminal_skill.md)
- ตรวจ contract: response ตรงที่ client คาดไหม → [`review_skill.md`](./review_skill.md)

## โยง

- syntax ตาม framework → [`codeigniter3_skill.md`](./codeigniter3_skill.md) / [`codeigniter4_skill.md`](./codeigniter4_skill.md) / [`php_skill.md`](./php_skill.md)
- รันบน docker → [`docker_skill.md`](./docker_skill.md)
- frontend ที่เรียก API นี้ → [`react_type_skill.md`](./react_type_skill.md) (ฝั่งเรียก)

> เพิ่มแพตเทิร์น API เฉพาะ workspace เมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
