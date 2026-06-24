# CodeIgniter 3 Skill — framework PHP (เว็บ backend)

มาจาก [`code_skill.md`](./code_skill.md) → [`php_skill.md`](./php_skill.md) (ฐาน) — กลุ่ม **เว็บ backend** (รันบน docker)

> อ่าน php_skill ก่อน (กฎ PHP กลาง + เช็ค API) · โครงสร้างดู [`project_structure_skill.md`](./project_structure_skill.md)

---

## ใช้เมื่อ

โปรเจค backend ที่เป็น **CodeIgniter 3**

## กฎหลัก (CI3)

- โครงสร้าง MVC: `application/controllers` · `application/models` · `application/libraries` · `application/config`
- โหลดของผ่าน `$this->load->model()/library()/helper()` ตามที่ใช้จริง
- DB ใช้ Query Builder (`$this->db->...`) หรือ binding — ห้าม concat ค่า user ลง SQL
- route ใน `config/routes.php`
- แยก business logic ออกจาก controller ไป model/library

## เป็นงาน API ไหม?

ถ้าทำ API → ดู [`api_skill.md`](./api_skill.md) (CI3 มักใช้ `REST_Controller` หรือ output JSON เอง)

## โยง

- ฐานภาษา → [`php_skill.md`](./php_skill.md) · รันบน docker → [`docker_skill.md`](./docker_skill.md) · รัน/ดู log → [`terminal_skill.md`](./terminal_skill.md)

> เพิ่มกฎ/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
