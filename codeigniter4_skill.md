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

## ⚠️ Route ordering — child ก่อน parent เสมอ

ถ้าลงทะเบียน route แบบ loop ที่ใส่ catch-all `api/{uri}/(:segment)` ให้ทุก resource
**CI4 ใช้ route แรกที่ match ชนะ** → parent ที่มาก่อน child จะ **กลืน** route ของ child

ตัวอย่าง: ถ้า `'users'` อยู่ก่อน `'users/roles'` ในลิสต์ → `api/users/(:segment)`
ถูกลงทะเบียนก่อน → `GET api/users/roles` วิ่งเข้า controller ของ `users` แล้วเอา `"roles"`
ไปเป็น primary key → `WHERE id='roles'` บนตารางผิด → คืน 0 แถว
(อาการหลอก: `data: []` แต่ count = จำนวนแถวของตาราง parent / ทุก dropdown ที่ดึงจาก endpoint ลูกหาย)

**กฎ:** เรียง **child (path ลึกกว่า) ไว้ก่อน parent เสมอ** แล้วค่อยปิดท้ายด้วย parent

> วินิจฉัยเร็ว: endpoint ลูกคืน `data: []` แต่ count = จำนวนแถวของตาราง parent
> → เกือบแน่ว่าโดน route ของ parent กลืน ไปดูลำดับใน `Routes.php` ก่อนแก้ model/data

## เป็นงาน API ไหม?

ถ้าทำ API → ดู [`api_skill.md`](./api_skill.md) (CI4 มี `ResourceController` / `respond()` ช่วยทำ REST)

## Performance patterns

- ถ้า response ต้องคืน count หลายสถานะ เช่น `status_0/status_1/status_2`, draft, approve count → อย่ายิง `COUNT(*)` แยกทีละสถานะถ้าใช้ตาราง/เงื่อนไขฐานเดียวกัน ให้ยุบเป็น query เดียวด้วย `SUM(condition)` หรือ `GROUP BY`
- ถ้า endpoint สำหรับหน้า home/feed ไม่ใช้ metadata ของหน้า admin/list ให้แยก path ให้ไม่แบก count query ที่ไม่จำเป็น
- endpoint ที่ต้อง limit ต่อกลุ่ม/type: เริ่มจาก helper กลางให้ contract ถูกก่อน ถ้าข้อมูลโตจริงค่อยย้ายไป SQL/window function พร้อม test เทียบผลก่อน/หลัง

## โยง

- ฐานภาษา → [`php_skill.md`](./php_skill.md) · รันบน docker → [`docker_skill.md`](./docker_skill.md) · รัน/ดู log → [`terminal_skill.md`](./terminal_skill.md)

> เพิ่มกฎ/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
