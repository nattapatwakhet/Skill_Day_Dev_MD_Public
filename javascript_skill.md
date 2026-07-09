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
- `finally` ใช้สำหรับ cleanup เท่านั้น เช่น ปิด loading, close file, release lock, clear timer;
  ห้าม `return`, `throw`, `break`, `continue` ใน `finally` เพราะจะทับผลลัพธ์หรือ error จาก `try`/`catch`
- หลีกเลี่ยง global, แยกฟังก์ชันเล็กทำงานเดียว
- ตั้งชื่อตาม convention ใน code_skill (function camelCase, class PascalCase)

## Google Apps Script / Gmail automation

- สคริปต์ Gmail ควรแยก config ชัดเจน: labels, query, batch size, max runtime, rules
- ใช้ batch processor พร้อม `PropertiesService` เก็บ cursor/progress เพื่อหยุดก่อนชน runtime แล้ว resume ได้
- ระวัง Gmail quota: อย่าอ่าน body ทุก message ทุก thread ใน backfill ใหญ่ ให้เช็ก sender/subject ก่อน
- ถ้าต้องอ่าน body ให้จำกัดจำนวน message และจำนวนตัวอักษรต่อ message
- Incremental query ไม่ควรใช้ `-has:userlabels` ตรงๆ เพราะจะพลาดเมลที่มี label อื่นอยู่แล้ว
  ให้ exclude เฉพาะ label ที่สคริปต์ดูแลเอง
- cache label object ต่อรอบรัน ลดการเรียก service ซ้ำ
- ถ้าเจอ quota daily limit ให้รอ quota reset ก่อน แล้วลด batch/body scan แทนการ retry ถี่ๆ

## Date/time libraries

- Dayjs `isAfter()` / `isBefore()` เทียบ timestamp เต็มตาม default ไม่ใช่เฉพาะวันที่
- ถ้าต้องการเทียบเฉพาะวัน ให้ normalize ด้วย `startOf('day')`/`endOf('day')`
  หรือใช้ API/plugin ที่กำหนด unit/granularity ได้

## โยง

- ใช้ React → ขึ้น [`react_skill.md`](./react_skill.md)
- เว็บ frontend รันบน docker → [`docker_skill.md`](./docker_skill.md)
- เทสหน้าเว็บ → [`webapp_testing_skill.md`](./webapp_testing_skill.md)
- ออกแบบ UI → [`frontend_design_skill.md`](./frontend_design_skill.md)

> ภาษานี้ยังเก็บกฎกว้างๆ — เจอกฎเฉพาะโปรเจคจริงค่อยเพิ่ม (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
