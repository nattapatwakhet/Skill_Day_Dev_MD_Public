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

## Export/read-train-book style modules

- โมดูลที่มี read/train/book หรือ domain คล้ายกันมัก copy logic กัน ถ้าแก้ไฟล์หนึ่งให้ค้นคู่ที่ชื่อใกล้กันก่อนจบงาน
- ถ้าฟิลด์หรือ helper ใช้เฉพาะใน model หนึ่ง ห้ามให้ model อื่นเรียกผ่าน dependency เปราะๆ ที่อาจ deploy คนละเวอร์ชัน
  ให้เช็กด้วย `$this->db->field_exists(...)` แบบ local cached ใน model ที่ใช้งาน
- หลัง upload PHP ไป server แล้วถ้า error เดิมยังอยู่ ให้สงสัย OPcache/PHP-FPM/Apache cache ก่อนแก้ logic ซ้ำ
- control flag สำหรับ exclude/filter ต้อง normalize ค่าที่ส่งมาและใช้กับทั้ง count/filter/attach data ที่เกี่ยวข้อง ไม่ hardcode ทับค่า caller
- Sentinel ที่หมายถึง "ทั้งหมด" เช่น `0`/`'0'`/ค่าว่าง ต้อง normalize เป็น no-filter ก่อนเข้า Query Builder
  ถ้าปล่อยเป็น exact `WHERE field = 0` list/count/status bucket จะผิด
- Count/status bucket ต้องใช้ base filter เดียวกับ list แต่ unset เฉพาะ status field ที่กำลัง group เพื่อให้ count ทุก tab
  เทียบกันได้หลัง filter ประเภท/คำค้น/ผู้ใช้
- ถ้า backend เปลี่ยน all-data export เป็น paging ให้รับ limit/page params แล้วคืนข้อมูลพอให้ frontend วนโหลดจนครบ
- Export ที่ต้องแสดงตัวเลือก/child data ต่อรายการหลัก ต้อง join/attach child table ให้ครบใน `getDataExport`
  ไม่ใช่คืนแค่หัวข้อหลัก
- Export ควรคืนเหตุผลให้ frontend แยกได้ระหว่าง no-source-data กับ source-data-but-zero-results
- count/status bucket ที่มี active/open flag (เช่น `open_status = 1`) ต้องใส่ flag นั้นในทุก bucket ที่นับ
  ไม่งั้น record ที่ถูกปิด/soft-close จะถูกนับปนกับที่ยัง active — ตัวเลขสรุปเกินจริง

## Unique index กับ soft-close / re-insert

- composite UNIQUE index บน (user_id, item_id) จะบล็อกการ INSERT record ใหม่เมื่อมีแถวเดิมที่ถูก soft-close
  (เช่น `open_status = 0`) อยู่ → ปุ่ม/action เปิดซ้ำจะ **ล้มเงียบ** (insert ชน unique)
- ถ้า business ต้องเปิด/ปิดรายการเดิมซ้ำได้ ให้ relax/drop UNIQUE index เป็น non-unique
  แล้ว logic นับต้อง filter ด้วย active/open flag แทน uniqueness
- อาการข้ามชั้น (frontend กดไม่ติด แต่เหตุอยู่ที่ DB constraint) → ขอ artifact ชี้ขาดก่อน (insert error/response จริง)
  อย่าไล่แก้ปลายทางที่ frontend

## Manual status correction SQL

- ก่อน `UPDATE` สถานะจากคะแนน/เกณฑ์ ให้ `SELECT` preview ก่อนเสมอ โดย join ตารางหลักไปยัง detail/score table แล้ว `GROUP BY` id ที่จะอัปเดต
- คำนวณ `SUM(score)` เทียบ pass score ปัจจุบัน แล้วค่อยอัปเดต status
- ระบุ scope แคบ เช่น activity id หรือ target id list และถ้าทำ manual fix ให้ใส่สถานะเดิมใน `WHERE`
- ก่อน mark overdue/fail จากเวลา ให้ sync completed/success status ก่อน แล้วอัปเดตเฉพาะ record ที่ยัง pending
  เพื่อไม่เขียนทับ record ที่สำเร็จแล้ว

## Hierarchy/under-command filters

- Logic ใต้บังคับบัญชาของโมดูลคู่ขนานต้องเหมือนกัน: แก้ mapping หรือ rule แล้ว sync ทุก model ที่ใช้ flow เดียวกัน
- แยกความหมาย field ให้ชัด เช่น position code, position level, workplace code, region/belong scope
- หลังกรอง scope แล้วค่อยเทียบระดับตำแหน่งของลูกน้อง
- ถ้าไม่มีระดับตำแหน่ง/ข้อมูลที่พิสูจน์ hierarchy ได้ ให้คืน empty ดีกว่าเดาว่าคนใน scope เดียวกันเป็นลูกน้อง
- Query Builder ใน CI3 มี state ค้างได้: reset query ก่อน count/list query ใหม่ และ qualify column เมื่อ join หลายตาราง

## โยง

- ฐานภาษา → [`php_skill.md`](./php_skill.md) · รันบน docker → [`docker_skill.md`](./docker_skill.md) · รัน/ดู log → [`terminal_skill.md`](./terminal_skill.md)

> เพิ่มกฎ/แพตเทิร์นเฉพาะโปรเจคเมื่อเจอจริง (ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
