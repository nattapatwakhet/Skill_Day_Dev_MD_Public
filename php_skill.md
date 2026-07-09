# PHP Skill — ภาษาฐานฝั่ง backend เว็บ

มาจาก [`code_skill.md`](./code_skill.md) — กลุ่ม **เว็บ backend** (รันบน docker)
เป็น **ภาษาฐาน** ของ framework: php → [`codeigniter3_skill.md`](./codeigniter3_skill.md) / [`codeigniter4_skill.md`](./codeigniter4_skill.md)

> อ่าน [`code_skill.md`](./code_skill.md) + [`coding_principles_skill.md`](./coding_principles_skill.md) ก่อน · โครงสร้างดู [`project_structure_skill.md`](./project_structure_skill.md)

---

## ใช้เมื่อ

งาน **PHP** — ทั้งล้วนและบน framework (CodeIgniter)

## กฎหลัก (PHP)

- ตั้งชื่อตาม convention โปรเจค, แยกไฟล์ตามหน้าที่ (controller/model/library)
- ระวัง SQL injection → ใช้ query binding / prepared statement เสมอ ห้าม concat ค่าจาก user
- validate input ทุก endpoint, จัดการ error ชัดเจน, อย่าโชว์ error ดิบสู่ client
- แยก config/secret ออกจากโค้ด

## เช็คก่อน: เป็นงาน API ไหม?

**ถ้า backend นี้ทำ API** (รับ/ส่ง JSON, มี endpoint, ให้ client อื่นเรียก) → เปิด [`api_skill.md`](./api_skill.md)
(หลัก REST, รูปแบบ response, auth, status code) — ใช้ร่วมทั้ง CI3/CI4/PHP

## framework

- CodeIgniter 3 → [`codeigniter3_skill.md`](./codeigniter3_skill.md)
- CodeIgniter 4 → [`codeigniter4_skill.md`](./codeigniter4_skill.md)

## PHP extension บน Docker

- CI4 ต้องมี `ext-intl` (localization / `NumberFormatter` / `IntlDateFormatter`) — ถ้ารันบน Docker
  ต้อง `docker-php-ext-install intl` (+ `libicu-dev`) ใน image ไม่ใช่แค่เปิดใน `php.ini`
  วิธีเต็ม + เช็คหลัง build ดู [`docker_skill.md`](./docker_skill.md) หัวข้อ `ext-intl`

## Scheduled notification / async send scripts

- ถ้า caller ส่ง `send_at` เป็นเวลาส่งจริง ห้ามบวก lead/preparation seconds ซ้ำใน scheduled send time
- แยก scheduled send time ออกจาก prepare time เช่น `prepareAt = sendAt - leadSeconds`
- ถ้าไม่มี `send_at` และต้องการส่งทันที ให้ใช้ `time()` เป็น send time
- response-before-send/async web worker ยังต้องคำนึงถึง timeout ของ web server/PHP-FPM
- ไฟล์ start/end หรือ script คู่ขนานต้อง sync default message, scheduling, และ error handling ให้ตรงกัน

## โยง

- เว็บ backend รันบน docker → [`docker_skill.md`](./docker_skill.md)
- รันคำสั่ง/ดู log บนเครื่อง user → [`terminal_skill.md`](./terminal_skill.md)

> เพิ่มกฎเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
