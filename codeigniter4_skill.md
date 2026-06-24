# CodeIgniter 4 Skill — framework PHP (เว็บ backend)

มาจาก [`code_skill.md`](./code_skill.md) → [`php_skill.md`](./php_skill.md) (ฐาน) — กลุ่ม **เว็บ backend** (รันบน docker)

> อ่าน php_skill ก่อน (กฎ PHP กลาง + เช็ค API) · โครงสร้างดู [`project_structure_skill.md`](./project_structure_skill.md)

---

## ใช้เมื่อ

โปรเจค backend ที่เป็น **CodeIgniter 4** (ต่างจาก CI3: namespace, autoload PSR-4, Model class, Entity)

## กฎหลัก (CI4)

- โครงสร้าง: `app/Controllers` · `app/Models` · `app/Config` · `app/Libraries` (namespace `App\...`)
- ใช้ Model class (`extends CodeIgniter\Model`) + Query Builder / binding — ห้าม concat ค่า user
- route ใน `app/Config/Routes.php`
- ใช้ `\Config\Services::...`, filters สำหรับ auth/CORS
- env/config แยกใน `.env`

## เป็นงาน API ไหม?

ถ้าทำ API → ดู [`api_skill.md`](./api_skill.md) (CI4 มี `ResourceController` / `respond()` ช่วยทำ REST)

## โยง

- ฐานภาษา → [`php_skill.md`](./php_skill.md) · รันบน docker → [`docker_skill.md`](./docker_skill.md) · รัน/ดู log → [`terminal_skill.md`](./terminal_skill.md)

> เพิ่มกฎ/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
