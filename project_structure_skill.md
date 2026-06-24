# Project Structure — ทะเบียนกลางของโครงสร้างโปรเจกต์

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [2] — เปิดไฟล์นี้ก่อนสร้าง/ย้าย/แก้ไฟล์
เพื่อรู้ว่าโปรเจกต์ไหน วางไฟล์ folder ไหน และ layer ไหนเรียกอะไรได้

> **กฎหลักของไฟล์นี้:** ถ้าโครงสร้างโปรเจกต์/ส่วนที่กำลังทำงานยังไม่มีในนี้ → **เพิ่มเข้าไป**
> ไฟล์นี้เป็น template public ให้ปรับตาม workspace จริงของคุณก่อนใช้จริง

---

## วิธีปรับใช้กับ workspace ของคุณ

1. เปลี่ยน `<workspace-root>` เป็น root path ของโปรเจกต์จริง
2. เพิ่มตารางโปรเจกต์/แพ็กเกจ/แอปที่มีจริง
3. ระบุว่าแต่ละส่วนเป็น `api`, `app`, `web`, `program`, `server`, `scripts` หรือชนิดอื่น
4. ระบุ layer boundary ให้ชัดว่าไฟล์ชนิดไหนอยู่ folder ไหน และอะไรเรียกอะไรได้
5. ถ้ามี docker/service ให้บันทึกใน [`docker_skill.md`](./docker_skill.md)

---

## ภาพรวม workspace — `<workspace-root>`

ตัวอย่างโครงสร้างที่ใช้ได้กับหลายโปรเจกต์:

| Folder | คืออะไร | Skill ที่เกี่ยว |
|---|---|---|
| `api/` | backend/API services | [`php_skill.md`](./php_skill.md), [`python_skill.md`](./python_skill.md), [`api_skill.md`](./api_skill.md) |
| `web/` | frontend web apps | [`javascript_skill.md`](./javascript_skill.md), [`react_skill.md`](./react_skill.md), [`react_type_skill.md`](./react_type_skill.md) |
| `app/` | mobile apps | [`flutter_skill.md`](./flutter_skill.md) |
| `program/` | desktop/utility apps | [`python_skill.md`](./python_skill.md) |
| `server/` | server config, deployment, load test, infrastructure helpers | project-specific |
| `scripts/` | automation, migration, utility scripts | language-specific |
| `docs/` | project documentation | [`writing_skill.md`](./writing_skill.md), [`deliverable_skill.md`](./deliverable_skill.md) |
| `skill/day_dev_public/` | ชุด skill นี้ | [`skill_maintenance_skill.md`](./skill_maintenance_skill.md) |

> โปรเจกต์ใหม่ → เพิ่ม section เฉพาะของโปรเจกต์นั้นในไฟล์นี้

---

## โครงสร้าง Flutter app (Dart + Flutter + GetX)

กฎการเขียน Dart อยู่ใน [`flutter_skill.md`](./flutter_skill.md)

- `lib/main.dart` — entry point และ global startup wiring
- `lib/config` หรือ `lib/route` — routing/configuration
- `lib/constant` — constants, route URLs, theme, translations, static values
- `lib/controller` — GetX controllers และ bindings
- `lib/service` — API/service layer
- `lib/model` — data models และ parsing logic
- `lib/database` — local persistence
- `lib/view` — screens/pages
- `lib/component` หรือ `lib/widget` — reusable widgets/dialogs/components
- `lib/util` — utilities
- `lib/old` — โค้ดเก่า ห้ามแก้หรือ import ถ้า user ไม่อนุญาตชัดเจน

### Layer Boundaries (Flutter)

- Views → build UI, เรียก controllers
- Controllers → manage screen state, flow, dialogs, local cache
- Services → เรียก API, ห้าม show dialog
- Models → parse และ hold data เท่านั้น
- Database → table creation, migrations, CRUD เท่านั้น
- Constants → เก็บ static values
- Reusable UI → components/widgets
- Utilities → helper functions ที่ไม่มี state หนัก

---

## โครงสร้าง React Web app

ใช้กับ frontend ฝั่ง web กฎการเขียน React อยู่ใน [`react_skill.md`](./react_skill.md)
และถ้าใช้ TypeScript/MUI ให้ดู [`react_type_skill.md`](./react_type_skill.md)

- `src/main.tsx` หรือ `src/main.jsx` — entry point
- `src/app.tsx` หรือ `src/App.jsx` — root component/provider/router outlet
- `src/constant` — constants/theme/static values
- `src/assets` — static assets/theme files
- `src/types` — shared TypeScript declarations
- `src/database` หรือ `src/store` — client-side stores
- `src/route` — route definitions
- `src/view` — page-level views แยกตาม domain
- `src/component` — reusable UI components
- `src/util` — utilities
- `src/security` — auth/security utilities

### Layer Boundaries (React)

- Views → build UI, เรียก stores/hooks หรือ pass props
- Layout components → manage shell structure
- Constants/theme → single source of truth สำหรับ design tokens
- Reusable UI → `src/component`
- Routes → `src/route`
- Utilities → pure/helper logic

---

## โครงสร้าง PHP backend — CodeIgniter

กฎการเขียนอยู่ใน [`php_skill.md`](./php_skill.md) →
[`codeigniter3_skill.md`](./codeigniter3_skill.md) / [`codeigniter4_skill.md`](./codeigniter4_skill.md)

### CodeIgniter 3

- `application/controllers` — รับ request, เรียก model/library, คืน response
- `application/models` — query DB, business data
- `application/libraries` — logic ที่ใช้ซ้ำ
- `application/config` — config, routes, database
- `application/helpers` — helper functions
- `system/` — core framework ห้ามแก้

### CodeIgniter 4

- `app/Controllers` — รับ request/API controller
- `app/Models` — model classes
- `app/Config` — routes, config, filters
- `app/Libraries` — shared business/service logic
- `app/Helpers` — helper functions
- `app/Filters` — auth/CORS/middleware-style logic

### Layer Boundaries (backend)

- Controllers → รับ/ตอบ ไม่ใส่ business logic หนัก
- Models → query + data access เท่านั้น
- Libraries/Services → reusable business logic
- งาน API → response/auth/status code ตาม [`api_skill.md`](./api_skill.md)
- งานที่รันบน container → ดู [`docker_skill.md`](./docker_skill.md)

---

## เพิ่มโครงสร้างใหม่

เจอโปรเจกต์/ภาษา/โครงสร้างที่ยังไม่มีในนี้ → เพิ่ม section ใหม่
ตั้งหัวข้อให้ชัด วาง folder layout + layer boundaries แล้วลิงก์ไป skill ภาษา/framework ที่เกี่ยว
