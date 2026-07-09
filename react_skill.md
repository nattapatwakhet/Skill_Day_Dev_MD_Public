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

## Vite dev — 404 `chunk-*.js` ใน `.vite/deps` (cache ไม่ตรง)

อาการ: หน้าเว็บ `GET .../node_modules/.vite/deps/chunk-XXXX.js?v=<hash>` ได้ **404**

- สาเหตุ: เบราว์เซอร์ค้าง hash เก่า แต่ Vite re-optimize ใหม่ (แก้ `package.json`/lock) → chunk ชื่อเดิมถูกลบ
  → เช็คก่อนว่า dev server รันอยู่จริงไหม (`curl localhost:<port>`) แท็บที่ค้างอาจเป็นหน้าเก่าเฉยๆ
- แก้: `rm -rf node_modules/.vite` แล้ว `npm run dev` ใหม่ + **hard refresh** (Cmd+Shift+R) สำคัญ ไม่งั้นจำ hash เก่า
- ปัญหาแฝงที่ทำให้ asset/deps ผิด origin: `vite.config` ตั้ง `base` เป็น absolute URL
  (เช่น `base: 'http://host:port'`) → dev server ต้องเป็น `base: '/'` เท่านั้น

## React Router basename / direct URL

- ถ้า app deploy ใต้ subpath ให้ Router `basename`, Vite `base`, และ URL ที่ user เปิดตรงกัน
- อาการ route ไม่ render แต่ build ไม่พังคือเปิด path ที่ไม่มี basename หรือ server rewrite ไม่ตรง
- หลังเพิ่ม/ซ่อนเมนูตามสิทธิ์ ต้อง guard route ด้วยเสมอ เพราะ user พิมพ์ URL ตรงได้
- เงื่อนไขเมนูกับ route guard ต้องใช้ helper เดียวกัน หรืออย่างน้อยใช้ source field เดียวกัน

## Export/report patterns

- ExcelJS workbook ต้องใช้ `new ExcelJS.Workbook()` ไม่ใช่ชื่อ constructor ที่พิมพ์ผิด
- Select/dropdown sentinel เช่น `0`, `'0'`, หรือค่าว่างที่หมายถึง "ทั้งหมด" ต้อง normalize/omit ก่อนส่ง API
  ถ้า backend มอง sentinel เป็น exact id จริง list/count จะกลายเป็น 0 แถวผิด
- ถ้า backend เปลี่ยนจากส่งทุกคนเป็น paging ให้ frontend วนโหลดทีละ page แล้ว merge ตาม id ของ domain นั้น
- การแบ่ง request ลด timeout/memory ต่อ request แต่ภาระรวมยังมี ถ้าต้องการลดจริงให้ backend ส่ง summary ที่คำนวณแล้ว
- ถ้า product ต้องการโหลดครั้งเดียว ให้ backend batch query nested data หรือทำ summary endpoint แทนการ loop รายคนใน request ใหญ่
- ถ้า response มี lesson/child record ซ้ำ ให้เลือก id ของ attend/detail record ก่อน fallback ไป id หลัก
  และเลือกตัวที่มีข้อมูลจริงก่อนตัวว่าง
- payload ที่มาเป็น object ตรง, array, หรือ indexed object ต้อง normalize/unwrap ก่อนเช็กเงื่อนไข nested data
- ถ้ากรองข้อมูลออกจาก report ต้องกรองทั้งกลุ่ม attended และกลุ่ม missing/broken ไม่งั้นแถวไม่มีคะแนนยังติด export
- Export ต้องแยก no-source-data ออกจาก source-data-but-zero-results เช่น ไม่มีข้อสอบ vs มีข้อสอบแต่ยังไม่มีคนทำ
- Attempt/count buckets ควรนิยามชัดว่า exact หรือ cumulative; ถ้าเป็น exact คนที่มี 5 attempts ต้องอยู่เฉพาะ bucket 5
- สถานะในรายงานต้องระบุ source ให้ชัด ถ้าใช้ status field เป็น truth ห้ามให้ score-derived logic ไปทำให้ label ขัดกันโดยไม่ตั้งใจ
- Async save/export/download buttons ต้องมี loading state, disabled state, และ clear state ใน `finally`
- หน้า list ที่มี business eligibility ต้อง filter ก่อน sort/display: open/draft/approval/access/date-window ผ่านก่อน
  แล้วค่อยเรียง pinned/active-window/general; อย่าเอา filter ของ active list ไปใช้กับ history/report โดยไม่ตั้งใจ
- Access-rights list ต้องเทียบ code ชนิดเดียวกัน เช่น position-code กับ position-code, level-code กับ level-code,
  workplace/region/person id กับ field ที่ตรงกัน ห้ามเทียบคนละ semantic แล้วได้ false negative

## Learning/player completion และ browser guards

- Completion ของ media ไม่ควรพึ่ง React state ที่อาจยังไม่ flush ตอน event `ended`; ส่ง explicit complete flag/ref เข้า save path
- near-end checks ควรมี grace เล็กน้อยเพื่อเลี่ยง currentTime/duration precision issue
- Auto-next หลัง save สำเร็จควรเลือก item ถัดไปตามลำดับ business จริง ไม่ใช่ filter ที่ใช้กับหน้า list โดยบังเอิญ
- การดัก PrintScreen ใน browser เป็น best-effort เท่านั้น ใช้เป็น UX deterrent ได้ แต่ไม่ใช่ security control
- ช่อง media ที่รับได้ทั้งไฟล์ตรงและลิงก์ provider (เช่น embed/share link) ต้อง detect ชนิดก่อน render
  แล้วเลือก player/iframe ให้ถูก อย่า assume ว่าเป็นไฟล์ media เสมอ
- field-name typo ทำให้ flag เช่น hasVideo เป็น false เงียบๆ โดย build ไม่ error → ยืนยันชื่อ field จาก response จริงก่อนเช็ก
- multi-requirement completion: บทที่มีหลายส่วน (เช่น วิดีโอ + เอกสาร) ต้องจบทุกส่วนถึง mark complete
  `partdone = !haspart || partcompleted` ต่อส่วน แล้ว success เมื่อทุกส่วน done; ใส่ตัวแปร gate ใน useCallback deps กัน stale closure
- ปุ่ม next-action หลังบทปัจจุบัน complete เป็น state machine: มี exam ยังไม่ผ่าน → ทำ exam;
  ไม่งั้นมี item ถัดไป → ไปถัดไป; ไม่งั้น → ปุ่มสรุป (navigate ไปหน้า summary/history)
  วาง trigger ที่เดียวต่อกรณี (media wrapper สำหรับ media, doc component สำหรับเอกสารล้วน) กันปุ่มซ้ำ

## Layout overflow ใน MUI/React JS

- ใน flex row ที่มีข้อความยาว ให้ใส่ `minWidth: 0` ให้ item ที่ยืดได้ และหลีกเลี่ยง `minWidth` แข็งบน text
- ถ้าใช้ width `100%` ร่วมกับ margin ซ้าย/ขวาใน container แคบ จะ overflow ง่าย ให้ใช้ gap/padding หรือ `boxSizing`
- ปุ่ม/toolbar ที่มีข้อความยาวควรยอม wrap หรือย่อด้วย responsive layout แทนบังคับแถวเดียว

## Input widget — จำกัด/ปลดจำกัดความยาว

- field ที่ต้องการไม่จำกัดความยาว → ส่ง `maxlength={null}` และลบ prop `maxlength` ค่าเดิมออก
  (prop ซ้ำ prop หลังชนะ ถ้าไม่ลบค่าเดิมยังผลอยู่)
- ซ่อนเฉพาะตัวนับอักษรด้วยเงื่อนไข `maxlength != null` อย่าปิด flag ที่ error message ไป share ด้วย
  ไม่งั้น error หายพร้อมตัวนับ
- เอา max validation ออกให้ตัด rule ออกจริง ไม่ใช่ตั้งค่าใหญ่ๆ

## เมนู/route ตามสิทธิ์-ตำแหน่ง

- เมนูที่จำกัดตามตำแหน่ง/สิทธิ์ ต้อง block-by-default: เห็นเฉพาะเมื่ออยู่ใน allow-list จริง
  แล้วกรอง child ทุก id ในกลุ่มนั้น อย่าเหลือ default ที่ปล่อยให้เห็นเมื่อไม่เข้าเงื่อนไข (จะรั่ว)
- เมนูซ่อนแล้วต้อง guard route ด้วยเสมอ เพราะพิมพ์ URL ตรงได้ (ใช้ source field เดียวกับเมนู)

## ตรวจ syntax JSX ใน sandbox

- ตรวจ syntax `.jsx` บน Linux sandbox ใช้ `@babel/parser`:
  `parse(code, { sourceType: 'module', plugins: ['jsx'] })`
- อย่าพึ่ง bundler ที่เป็น native binary ของ OS อื่น (เช่น esbuild macOS binary) บน Linux sandbox

## Lint sweep pragmatics

- แยก dependency/config failure ออกจาก lint จริงของไฟล์ก่อนแก้โค้ด
- Codebase JS เก่าควรปรับ rule ที่เป็น noise ตามจริง แล้วรัน `eslint --fix` เป็นกลุ่มเล็ก
- `prettier/prettier` ใน ESLint อาจช้ามากบนไฟล์ JSX ใหญ่ ให้ใช้ Prettier แยกเมื่อจำเป็น

## โยง

- ฐานภาษา → [`javascript_skill.md`](./javascript_skill.md)
- รันบน docker → [`docker_skill.md`](./docker_skill.md) · เทส → [`webapp_testing_skill.md`](./webapp_testing_skill.md) · ดีไซน์ → [`frontend_design_skill.md`](./frontend_design_skill.md)

> เพิ่มกฎเฉพาะเมื่อเจอเคสจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
