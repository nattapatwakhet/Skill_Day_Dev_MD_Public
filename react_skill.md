# React Skill — React (JavaScript, ไม่มี TypeScript)

มาจาก [`code_skill.md`](./code_skill.md) — กลุ่ม **เว็บ frontend** (รันบน docker)
ชั้นกลาง: [`javascript_skill.md`](./javascript_skill.md) (ฐาน) → **react** (ไฟล์นี้) → [`react_type_skill.md`](./react_type_skill.md) (เติม TypeScript)

> อ่าน code_skill + coding_principles ก่อน · โครงสร้างดู [`project_structure_skill.md`](./project_structure_skill.md)

---

## ใช้เมื่อ

โปรเจค **React ที่เป็น JavaScript ล้วน** (`.jsx` ไม่ใช่ `.tsx`) — ไม่มี type annotation แบบ TS

## กฎหลัก (React JS)

- component = PascalCase, return element เดียว, props เป็น all-lowercase (ตาม convention โปรเจค)
- hooks: เรียกบนสุดของ component เท่านั้น, ใส่ dependency array ให้ครบ
- แยก state (`useState`) กับ business logic, reusable UI → component folder
- ไม่มี TS → ระวังเรื่อง prop ผิดชนิด ใส่ default + ตรวจค่าก่อนใช้

> ถ้าโปรเจคใช้ **TypeScript** → ใช้ [`react_type_skill.md`](./react_type_skill.md) แทน (กฎ type/MUI v9/Zustand ครบกว่า)

## โยง

- ฐานภาษา → [`javascript_skill.md`](./javascript_skill.md)
- รันบน docker → [`docker_skill.md`](./docker_skill.md) · เทส → [`webapp_testing_skill.md`](./webapp_testing_skill.md) · ดีไซน์ → [`frontend_design_skill.md`](./frontend_design_skill.md)

> เพิ่มกฎเฉพาะเมื่อเจอเคสจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
