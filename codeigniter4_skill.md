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
- ถ้า route match แล้ว controller ไม่ถูกเรียก ให้เช็ก namespace/class/file case และ document root ก่อน
  โดยเฉพาะ server ที่ docroot เป็น `public` แล้ว URL ไม่ควรมี `/public` ซ้ำ

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

## การเรียงลำดับ list ปกติ — "แก้ไขถ้ามี ไม่งั้นเพิ่ม"

ถ้า base model มีจุดเรียงเดียว (เช่น `applyDefaultOrder()`) และอยากให้ list โชว์ "ล่าสุดที่แตะ"
ขึ้นก่อน ให้เรียงด้วย `COALESCE(NULLIF(editDate,'0000-00-00 00:00:00'), addDate) DESC`
แล้วตามด้วย `addDate DESC` เป็น tiebreaker — แถวที่ยังไม่เคยแก้ (edit เป็น NULL/zero) fallback ไป addDate

### ⚠️ ห้ามเทียบคอลัมน์ DATETIME กับ string ว่าง ''
- `NULLIF(datetime_col, '')` พัง: MySQL STRICT mode มองว่า `''` เป็น datetime ไม่ถูกต้อง →
  error 1525 "Incorrect DATETIME value: ''" → **ทุก query ที่ใช้จุดเรียงนี้พังหมด**
- เป็น runtime SQL error (ไม่ใช่ syntax) — `php -l` ผ่าน แต่รันจริงบน DB ที่เปิด STRICT แล้วล้ม
- เทียบกับ datetime literal `'0000-00-00 00:00:00'` ปลอดภัย / COALESCE จับ NULL ได้อยู่แล้ว
- เปลี่ยน SQL ในจุดเรียงกลาง = กระทบทุก endpoint → ต้องเทสต์ว่า list ยังโหลดได้ก่อนปิดงาน

## Performance patterns

- ถ้า response ต้องคืน count หลายสถานะ เช่น `status_0/status_1/status_2`, draft, approve count → อย่ายิง `COUNT(*)` แยกทีละสถานะถ้าใช้ตาราง/เงื่อนไขฐานเดียวกัน ให้ยุบเป็น query เดียวด้วย `SUM(condition)` หรือ `GROUP BY`
- ถ้า endpoint สำหรับหน้า home/feed ไม่ใช้ metadata ของหน้า admin/list ให้แยก path ให้ไม่แบก count query ที่ไม่จำเป็น
- export mode ต้องไม่แบก count metadata/status counts ของหน้า admin/list ที่ไม่ได้ใช้กับไฟล์ export
- export ที่ต้อง enrich row ด้วย helper data หนัก เช่นรายชื่อบุคลากร/สิทธิ์ ควร cache ต่อ request/export ไม่ query ซ้ำต่อ row
- ระวัง one-to-many join ทำให้แถว multiply; ถ้า export ช้ากว่า implementation เดิม ให้เทียบจำนวน join/row ที่เพิ่มก่อนสรุปว่า query หลักพัง
- endpoint ที่ต้อง limit ต่อกลุ่ม/type: เริ่มจาก helper กลางให้ contract ถูกก่อน ถ้าข้อมูลโตจริงค่อยย้ายไป SQL/window function พร้อม test เทียบผลก่อน/หลัง
- home/feed ที่ต้องส่งทุกกลุ่มพร้อม limit ต่อกลุ่ม ให้ cap หลัง sort เดิมของแต่ละกลุ่ม และถือเป็น grouped response ไม่ใช่ paging ปกติ

## Count/filter response contract

- แยก count รวมทั้งระบบออกจาก count ตาม filter ปัจจุบันเสมอ:
  `total_data_*` ใช้สำหรับยอดรวมตาม contract เดิม, ส่วน `total_data_filter_*` ใช้สำหรับยอดหลัง apply filter/request
- Badge/queue ของผู้ใช้คนเดียวต้องใช้ count ตาม filter ไม่ใช่ count รวมทั้งระบบ
- ถ้าต้องนับ bucket ของสถานะหลัง filter ให้ unset เฉพาะ field สถานะที่กำลัง group แล้วคง filter อื่นไว้
  เช่น user id, search, date, draft/status หลัก เพื่อให้ count ของทุก bucket ยังเทียบกันได้
- ชื่อ field response ใหม่ต้องไม่ทับความหมาย field เดิม ถ้าต้องรักษา backward compatibility ให้เพิ่ม field ใหม่คู่กัน

## GET params / control flags

- หลีกเลี่ยง query param เฉพาะกิจที่ซ้ำกับ field จริงโดยไม่จำเป็น ให้ใช้ field จริงสำหรับ exact filter
- Control flag เช่น mode, grouped count, export join, หรือ queue-count ต้องอยู่ใน skip list ของ base filter
  เพื่อไม่หลุดไปเป็น `WHERE <flag> = ...` บนตารางหลัก
- อย่าใช้ suffix search เฉพาะกิจเช่น `_like` ถ้า base model มี search contract กลางอยู่แล้ว
- ถ้าพารามิเตอร์หนึ่งมีหลายความหมาย เช่น user สำหรับดูสิทธิ์ vs user ใน attend/history ให้แยกชื่อ param ตามบทบาท
  และอย่า reuse field เดียวจน list หลักหายหรือ response กลายเป็น 204 โดยไม่ตั้งใจ

## Model inheritance visibility

ถ้าย้าย helper กลางขึ้น parent/base model แล้ว child model มี method ชื่อเดียวกัน ห้ามให้ child ลด visibility
จาก parent เช่น parent เป็น `protected` แต่ child เป็น `private` เพราะ PHP จะ fatal ตอน autoload class

กฎ:
- helper ที่ตั้งใจให้ child override/เรียกใช้ร่วมกับ base ให้ใช้ `protected`
- หลัง refactor base model ให้ค้น method ชื่อซ้ำใน child model ก่อน smoke endpoint
- `php -l` อย่างเดียวไม่พอ ต้องยิง endpoint หรือ instantiate class ที่เกี่ยวข้องด้วย

## Upload แล้ว insert ล้ม ต้องแยกสาเหตุ

ฟอร์มที่ upload ไฟล์ก่อน insert record หลัก อาจอัปโหลดสำเร็จแต่ insert DB ล้มภายหลัง เช่น unique/code field ว่างหรือชน
จึงต้อง debug แยก:
- ตรวจ log ว่าไฟล์ได้ external id แล้วหรือยัง
- ตรวจ insert error ของตารางหลัก เช่น duplicate key / NOT NULL
- field code ที่ unique/required ต้อง generate ก่อน insert
- ก่อน insert/update ให้ normalize empty string ตาม schema: datetime ว่างเป็น `null`, integer ที่ schema บังคับค่าให้เป็น default
  ที่ระบบรองรับ เช่น `0`, และ field required/no-default ต้องเติมค่าก่อน save
- ถ้า insert ล้มหลัง upload อาจมีไฟล์ค้างใน external storage ต้องบอก user หรือทำ cleanup แยก

## Auto-generate code — เช็คความยาว column ก่อนเสมอ

เคสจริง: code = prefix + ปี + running (padding N หลัก) รวมยาวเกินความกว้าง column → DB **ตัดท้าย**
ให้เหลือเท่า column → running digits หลุด → code ที่ต่างกันกลายเป็นตัวเดียวกัน → **ชนทุกตัว** (duplicate)

- แก้: นับ `prefix + running` เทียบความยาว column จริงก่อน gen (ถ้าเกินให้ลด padding ของ running ลง)
- audit generator **ทุกตัว** ในระบบ ไม่ใช่แค่ตัวที่เจอปัญหา
- **หนึ่งตาราง หนึ่ง generator** — อย่า pre-gen code ของตาราง A ด้วย model ที่สแกนตาราง B
  ให้ model ของตารางนั้นสแกนตารางตัวเองเป็นคน gen คนเดียว กัน generator ซ้อนทับกัน
- code ที่ unique/required ต้อง gen ก่อน insert เสมอ ถ้า insert ล้มด้วย `Duplicate entry '' for key`
  แปลว่า generator ไม่ได้ทำงาน/ค่าว่าง ไม่ใช่ upload ล้ม

## External storage — Google Drive service account

- **service account อัปไฟล์ไม่ขึ้น (เงียบ ไม่ error)** — ตั้ง parent เป็นโฟลเดอร์ใน **My Drive** ไม่ได้:
  service account ไม่มีพื้นที่เก็บใน My Drive → อัปเงียบ ต้องใช้ **Shared Drive ID** เท่านั้น
  (เทียบไฟล์ตัวอย่างที่อัปได้จริง มักต่างแค่บรรทัด parent id บรรทัดเดียว)

## Home summary / grouped counts

- Summary ที่ใช้กับ `home=true` ควรแยกจาก list join ปกติ: อย่า auto join ทุกอย่างจาก home flag ถ้า caller ไม่ได้ขอ
- ถ้านับเฉพาะรายการที่ usable/approved ให้ใส่ status filters ครบ เช่น approve/open/success
- group key ต้องตรงโจทย์ เช่นสรุปตาม activity/product/category type ไม่ใช่ transaction type ถ้า UI ต้องแสดงชนิดของ source item
- ถ้า summary ว่างแต่ list มีรายการ ให้ตรวจ status filters ก่อนสรุปว่า query ผิด

## Write/delete response และ upload result

- method เขียน/ลบที่คืน row เดียวหรือ associative array ต้องใช้ cleaner สำหรับ row object ไม่ใช่ cleaner สำหรับ list
  ไม่งั้น response อาจกลายเป็น `data: []`
- upload key จาก form อาจมี suffix `[]`; normalize ก่อน map กับ field config
- upload result/error ควรอยู่ใน field ที่ frontend อ่านได้ชัด เช่น `data.upload_result`
- หลังแก้ controller/model ให้รัน syntax check และ diff whitespace check เฉพาะ source ที่เกี่ยวข้อง

## Logging contract

- Frontend ส่งรายละเอียด log ได้ แต่ backend ต้อง sanitize/trim และ resolve log type/action จาก server-side mapping เอง
- ถ้า server หา log type ได้แล้ว ห้ามให้ `log_type_id` จาก payload override; ใช้ payload type เฉพาะ fallback ที่ออกแบบไว้
- Log query ควร join/attach log type metadata ตอนอ่าน เพื่อให้ UI แสดงชื่อ action ได้โดยไม่ต้องเดาเอง

## Security (backend)

- **ห้ามส่ง `$e->getMessage()` ออก client** — catch แล้ว `log_message('error', ...)` ไว้ฝั่ง server
  แล้วคืนข้อความกลางๆ เช่น `'server error'` กัน SQL/path/stack รั่วสู่ client
- **API key/token รับจาก header เท่านั้น** (`X-API-KEY` / `Authorization: Bearer`) อย่ารับจาก query string/body
  และเวลา verify ห้าม query/print ค่า key จริงจาก DB/log ออก output
- **DBDebug ปิดใน production** (`ENVIRONMENT !== 'production'`) กัน SQL error โผล่หน้า client
- **CORS คุมที่เดียว** — ตั้ง allowed origins/headers/methods ที่ `Config/Cors.php` (filter บน `api/*`)
  อย่า set CORS header ซ้ำใน controller (จะทับ/ขัดกันเอง) preflight OPTIONS ปล่อยให้ filter จัดการ
- **authz ต้อง derive จากฝั่ง server** — ห้ามเชื่อ header สิทธิ์/ตัวตน/วันหมดอายุที่ client ส่งมาเอง
  (client ปลอมได้) ให้ resolve ตัวตน+สิทธิ์จาก token → DB ฝั่ง server แทน
- แยก secret (token/clientSecret/parent id) ไป `.env` / config ไม่ฝังในโค้ด

## responseJson คืน HTTP 200 เสมอ (design choice ที่พบบ่อย)

บาง API design เลือกให้ backend ส่งสถานะจริงใน `body.status` แต่ HTTP code = 200 เสมอ
เพราะ frontend อ่าน `body.status` เอง + axios reject เฉพาะ non-2xx

- **ห้ามเปลี่ยนเป็น HTTP code จริงโดยไม่แก้ frontend พร้อมกัน** — จะทำให้ error handler กลางของ frontend เด้งผิด
- getData by-id ที่ไม่พบคืน `body.status = 404` ได้ (HTTP ยัง 200) frontend อ่าน `data[0]` อยู่แล้ว
- ถ้าจะย้ายไปใช้ HTTP status จริง ให้ทำเป็น decision ทั้งระบบ + แก้ frontend contract คู่กัน

## Lazy-init external library ใน controller

library ภายนอกที่หนัก (Google Drive / cloud SDK / video service) **ห้ามสร้างใน `__construct`**
เพราะจะถูกสร้างทุก request แม้ GET ที่ไม่ได้ใช้ →

```php
private function drive(): DriveLib { return $this->driveLib ??= new DriveLib(...); }
```

สร้างตอนที่ต้องใช้จริง (อัป/ลบไฟล์) เท่านั้น

## โยง

- ฐานภาษา → [`php_skill.md`](./php_skill.md) · รันบน docker → [`docker_skill.md`](./docker_skill.md) · รัน/ดู log → [`terminal_skill.md`](./terminal_skill.md)

> เพิ่มกฎ/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
