# JavaScript Skill — ภาษาฐานฝั่ง frontend เว็บ

มาจาก [`code_skill.md`](./code_skill.md) — กลุ่ม **เว็บ frontend** (รันบน docker)
เป็น **ภาษาฐาน** ของ React: javascript → [`react_skill.md`](./react_skill.md) → [`react_type_skill.md`](./react_type_skill.md)

> อ่าน [`code_skill.md`](./code_skill.md) (naming/scope/rename) + [`coding_principles_skill.md`](./coding_principles_skill.md) ก่อนเสมอ
> โครงสร้างโปรเจคดูที่ [`project_structure_skill.md`](./project_structure_skill.md)

---

## ใช้เมื่อ

งานที่เป็น **JavaScript ล้วน** (ไม่ใช่ React) — สคริปต์, utility, Node, vanilla DOM

## กฎหลัก (JS)

- `const`/`let` เท่านั้น ห้าม `var`
- `===`/`!==` เท่านั้น (strict equality)
- async → `async/await` + try/catch ห้ามลืม handle error
- หลีกเลี่ยง global, แยกฟังก์ชันเล็กทำงานเดียว
- ตั้งชื่อตาม convention ใน code_skill (function camelCase, class PascalCase)

## โยง

- ใช้ React → ขึ้น [`react_skill.md`](./react_skill.md)
- เว็บ frontend รันบน docker → [`docker_skill.md`](./docker_skill.md)
- เทสหน้าเว็บ → [`webapp_testing_skill.md`](./webapp_testing_skill.md)
- ออกแบบ UI → [`frontend_design_skill.md`](./frontend_design_skill.md)

> ภาษานี้ยังเก็บกฎกว้างๆ — เจอกฎเฉพาะโปรเจคจริงค่อยเพิ่ม (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
