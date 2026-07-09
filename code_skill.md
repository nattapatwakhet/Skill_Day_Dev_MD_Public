# Code Skill — หลักการเขียนโค้ดรวม (ใช้ได้ทุกภาษา)

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [3.1] — ทุกงาน **code** อ่านไฟล์นี้ก่อน
ไฟล์นี้รวมหลักการที่ใช้ร่วมได้หลายภาษา จากนั้นค่อยลงไฟล์เฉพาะภาษา

> **โครงสร้างโปรเจคอยู่ที่** [`project_structure_skill.md`](./project_structure_skill.md) (ไม่ซ้ำในไฟล์นี้)
> **หลักคิดก่อน/ระหว่างเขียนโค้ด** (คิดก่อนเขียน, YAGNI/เรียบง่าย, surgical, goal-driven) อยู่ที่
> [`coding_principles_skill.md`](./coding_principles_skill.md) — อ่านคู่กับไฟล์นี้ทุกงาน code

---

## ลำดับการใช้งาน

จัดกลุ่มภาษาเป็น 3 หมวด — เลือกตามงาน:

```
code_skill.md  (หลักการรวม — naming / scope / rename / type / import)
│
├─ เว็บ frontend  (ใช้ docker)
│     javascript_skill → react_skill → react_type_skill
│     (ฐาน JS)         (React JS)    (React + TypeScript ครบสุด)
│
├─ เว็บ backend  (ใช้ docker)
│     php_skill → codeigniter3_skill / codeigniter4_skill
│     python_skill  (เช่น backend service / ML service)
│        └─ เช็ค "เป็นงาน API ไหม?" → api_skill
│
├─ mobile  (ไม่ใช้ docker)
│     flutter_skill   (Dart + Flutter + GetX; เทส = flutter test)
│
└─ desktop / สคริปต์  (ไม่ใช้ docker)
      python_skill   (เช่น id_card_reader, สคริปต์ data)
```

| กลุ่ม | ภาษา / Framework | ไฟล์ | docker |
|---|---|---|---|
| เว็บ frontend | JavaScript (ฐาน) | [`javascript_skill.md`](./javascript_skill.md) | ✓ |
| เว็บ frontend | React (JS) | [`react_skill.md`](./react_skill.md) | ✓ |
| เว็บ frontend | React + TypeScript + MUI v9 | [`react_type_skill.md`](./react_type_skill.md) | ✓ |
| เว็บ backend | PHP (ฐาน) | [`php_skill.md`](./php_skill.md) | ✓ |
| เว็บ backend | CodeIgniter 3 | [`codeigniter3_skill.md`](./codeigniter3_skill.md) | ✓ |
| เว็บ backend | CodeIgniter 4 | [`codeigniter4_skill.md`](./codeigniter4_skill.md) | ✓ |
| เว็บ backend | งาน API (ใช้ร่วม) | [`api_skill.md`](./api_skill.md) | ✓ |
| backend/desktop/script | Python | [`python_skill.md`](./python_skill.md) | ขึ้นกับงาน |
| mobile | Dart + Flutter + GetX | [`flutter_skill.md`](./flutter_skill.md) | ✗ |

หลัก: **base → framework** (เช่น php → codeigniter, javascript → react → react_type) อ่านชั้นฐานก่อนถ้าจำเป็น
**เว็บทั้งหมดรันบน docker** ([`docker_skill.md`](./docker_skill.md)) · **mobile ไม่ใช้** · **backend ที่ทำ API** แวะ [`api_skill.md`](./api_skill.md)
ภาษาใหม่ → ทำตามหลักในไฟล์นี้ แล้วสร้างไฟล์ภาษาใหม่ + เพิ่มในตาราง (จัดเข้าหมวดให้ถูก)

---

## งานย่อยข้ามภาษา (ใช้ได้ทุกภาษา ไม่ผูก flutter/react)

สกิลพวกนี้เป็นหลักการ ไม่ใช่ syntax — เรียกได้จากงาน code ทุกภาษา:

- **แก้บั๊ก** → [`debug_skill.md`](./debug_skill.md) — วินัย 4 ขั้น (reproduce → fail path → falsify → breadcrumb) + post-mortem
- **ออกแบบ/ปรับ UI** → [`frontend_design_skill.md`](./frontend_design_skill.md) — หลักดีไซน์สากล (React, Flutter, หรือ UI ภาษาอื่น)
- **หลักคิดการเขียน** → [`coding_principles_skill.md`](./coding_principles_skill.md) (karpathy + ponytail)

> เทส: หลักการเทส (goal-driven) อยู่ใน `karpathy_skill` / `debug_skill` ใช้ได้ทุกภาษา
> ส่วน *เครื่องมือ* เทสขึ้นกับภาษา — เว็บ/React → [`webapp_testing_skill.md`](./webapp_testing_skill.md) (Playwright),
> Flutter → `flutter test` (ดู checklist ใน `flutter_skill.md`)

---

## เช็ค Docker → `docker_skill.md` (งานเว็บ — frontend + backend)

**งานฝั่งเว็บ** (ทั้ง React frontend และ backend/service) รันบน docker → เปิด [`docker_skill.md`](./docker_skill.md) เช็ค:

- โปรเจค/บริการนี้ **มีอยู่ใน docker_skill หรือยัง**
- **มี service อะไร run อยู่บ้าง + พอร์ต** (ถ้าต้องรัน/ดู log จริง ทำผ่าน [`terminal_skill.md`](./terminal_skill.md))

> **ใช้ docker:** งานเว็บทั้ง frontend (React) และ backend/service ที่ workspace กำหนดไว้ใน [`docker_skill.md`](./docker_skill.md)
> **ไม่ใช้ docker:** งาน **Flutter mobile** ตัวแอปเอง (รันด้วย `flutter run` บนอุปกรณ์/emulator)
>
> docker_skill = ทะเบียนว่าบริการ/แอปเว็บไหนรันบน docker ยังไง — ถ้ายังไม่มีเพิ่มเข้าไป

---

## Naming Convention (ทุกภาษา)

### Folder Names — snake_case

ชื่อ folder ต้องเป็น snake_case เสมอ ห้าม camelCase หรือต่อกันไม่มี underscore:

```
history_coin/    ✓
historycoin/     ✗
time_attendance/ ✓
timeattendance/  ✗
```

### File Names — `{name}_{folder}` snake_case

ชื่อไฟล์ต้องมีชื่อ folder เป็น suffix ถ้ายังไม่มี ห้าม duplicate:

```
stat_card_component.dart / .tsx    ✓  (stat_card + component)
activity_admin_view.dart / .tsx    ✓  (activity + admin + view)
encrypt_storage_security.ts        ✓  (encrypt_storage + security)
admin_route.dart / .tsx            ✓  (admin + route)

// ✗ Wrong — suffix ซ้ำ
main_button_component_component.tsx
```

เมื่อสร้างไฟล์ใหม่ ให้ถามว่า "ชื่อไฟล์บอกได้ไหมว่าอยู่ folder ไหน?" ถ้าไม่ ให้เติม folder name เป็น suffix

### Identifiers — 3 ระดับ

| ระดับ | Convention | ตัวอย่าง |
|---|---|---|
| Class / Component | PascalCase | `StatCard`, `ActivityAdminView`, `Header` |
| Function / Method | camelCase | `getThemePalette`, `setThemeMode`, `buildCard` |
| Variable / State key | all lowercase (ไม่มี separator) | `themecolors`, `isdesktop`, `leftdraweropened` |

### Domain Folder Naming

เมื่อ feature มีหลาย business domain ให้แยก sub-folder ตาม domain:

```
model/phone/branch/branch_phone_model.dart
model/phone/department/department_phone_model.dart
```

ห้ามแก้ชื่อ model ที่ mismatch ด้วย alias — ให้ rename caller ไปใช้ชื่อ class จริงแทน

ห้ามใช้ชื่อ numbered ที่ไม่มีความหมาย:

- `type1` → `branchsearchtype`
- `type2` → `branchareauser`
- `headofficephonemodel` → `departmentphoneusermodel`

---

## Scope Rules (ทุกโปรเจค)

- แก้เฉพาะไฟล์หรือ folder ที่ user ขอเท่านั้น
- อ่านไฟล์ล่าสุดก่อนแก้เสมอ
- ทำงานกับ user changes ที่มีอยู่ ห้าม revert สิ่งที่ไม่เกี่ยว
- ห้ามแตะ legacy folder ถ้า user ไม่อนุญาตชัดเจน

---

## After-Rename Steps (ทุกโปรเจค)

เมื่อ rename ไฟล์หรือ folder ใดก็ตาม ต้องทำ 3 ขั้นนี้เสมอ:

1. **Rename ไฟล์** (บน macOS ใช้ชื่อชั่วคราวก่อนถ้าจำเป็น เพราะ filesystem case-insensitive)
2. **grep และ update imports ทั้งหมด** — ค้นหาชื่อเดิมทั้งโปรเจคและแก้ทุก reference
3. **Verify** — grep ชื่อเดิมอีกครั้งให้ได้ผล 0

```bash
# Step 2
grep -rn "old_filename" --include="*.dart" --include="*.ts" --include="*.tsx" .

# Step 3
grep -rn "old_filename" --include="*.dart" --include="*.ts" --include="*.tsx" . || echo "clean"
```

---

## Type Annotation — หลักการร่วม

ทุกภาษาต้องเขียน explicit type ทุก variable, parameter, และ return type
ห้ามพึ่ง type inference อย่างเดียว — รายละเอียด syntax ดูในไฟล์ภาษา:

- Dart → [`flutter_skill.md`](./flutter_skill.md) → "Dart Type Annotation Rules"
- TypeScript → [`react_type_skill.md`](./react_type_skill.md) → "TypeScript Type Annotation Rules"

---

## Import — หลักการร่วม

- ใช้ absolute/package import แทน relative path ข้าม folder
- ลบ unused imports หลังแก้ทุกครั้ง
- Models ห้าม import controller/service
- รายละเอียด syntax + import boundaries ของแต่ละภาษา ดูใน "Import Rules" ของไฟล์ภาษานั้นๆ

---

## หลังแก้ไข — ตรวจตามภาษา

- Flutter → `dart format` + `dart analyze` (checklist เต็มใน `flutter_skill.md`)
- React/TS → ถ้ามี scripts ให้รัน `npm run lint` → `npm run typecheck` → `npm run build`;
  ถ้ายังไม่มีให้รัน `npm run build` หรือ `tsc --noEmit` เทียบเท่า (checklist เต็มใน `react_type_skill.md`)
- สรุปสั้นๆ: แก้อะไร, check ผ่านไหม
