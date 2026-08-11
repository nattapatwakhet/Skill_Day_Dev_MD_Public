# Deploy Skill — จดไฟล์ที่แก้รอขึ้น server (deploy manifest)

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [8] (ส่วน "จดบันทึก") — คุมไฟล์
**`skill/day_dev_public/memory/CHANGES.md`** = รายการไฟล์ที่ **create / edit / delete** ในโปรเจค
เพื่อให้ตอนอัปโค้ดขึ้น server **ส่งเฉพาะไฟล์ที่แก้จริง** ไม่ต้องเดาว่าไฟล์ไหนบ้าง

> เทียบ memory อื่น:
> - [`progress_skill.md`](./progress_skill.md) `PROGRESS.md` = สถานะงานที่กำลังทำ (resume)
> - [`work_summary_skill.md`](./work_summary_skill.md) `WORK_LOG.md` = ไดอารี่งาน (สรุปวัน/เดือน)
> - **ไฟล์นี้** `CHANGES.md` = "ไฟล์ไหนแก้บ้าง รอ deploy"

---

## ต้องจดเมื่อไหร่

**ทุกครั้งที่แตะไฟล์ในโปรเจค (create / edit / delete)** → append ลง `CHANGES.md` หมวด "รอ deploy"
(เป็นส่วนของ Definition of Done เมื่องานนั้นแตะไฟล์โปรเจค)

- action: **[+] สร้าง · [~] แก้ · [-] ลบ**
- path เต็มจาก root ของโปรเจค (ให้ก็อปไปหาไฟล์บน server ได้เลย)
- จัดกลุ่มตามโปรเจค/service ถ้าทำหลายตัว
- ไฟล์เดิมที่แก้ซ้ำหลายรอบ = 1 บรรทัดพอ · สร้างแล้วลบทีหลังในรอบเดียว = ตัดออกได้
- เสริม: ถ้าโปรเจคเป็น git ใช้ `git status --short` / `git diff --name-only` เช็คซ้ำได้ แต่ `CHANGES.md`
  ครอบคลุม **ข้าม session** และไฟล์ agent สร้างที่อาจยังไม่ commit

## ต้องบอก user ทุกครั้งที่แตะไฟล์

เมื่อมีการ **สร้าง / แก้ไข / ลบ / rename / move ไฟล์** ต้องรายงานให้ user เห็นชัดทั้งใน progress update ที่เกี่ยวข้อง
และในข้อความสรุปปิดงาน โดยอย่างน้อยต้องมี:

1. action ของไฟล์: `สร้าง`, `แก้ไข`, `ลบ`, `rename` หรือ `move`
2. ชื่อไฟล์
3. path ของไฟล์ที่ชัดเจน — ตอนสรุปให้ใช้ absolute path หรือ clickable file link
4. สรุปสั้นๆ ว่าแตะไฟล์นั้นเพื่ออะไร

ห้ามสรุปเพียงว่า "แก้เรียบร้อย" หรือบอกเฉพาะชื่อ feature โดยไม่แจ้งรายชื่อไฟล์ หากมีหลายไฟล์ให้แยกเป็นรายการ
ตาม action เพื่อให้ user ตรวจและนำไป deploy ต่อได้ทันที

ตัวอย่าง:

```markdown
ไฟล์ที่แก้ไข:
- [~] `/absolute/path/app.py` — เพิ่ม route สำหรับหน้าดูข้อมูล

ไฟล์ที่สร้าง:
- [+] `/absolute/path/templates/viewer.html` — เพิ่มหน้าจอแสดงข้อมูล
```

## เมื่อ user บอก "อัปขึ้น server แล้ว"

user พูดทำนอง **"deploy แล้ว" / "อัปขึ้น server แล้ว" / "ขึ้น [project] แล้ว"** →
ย้ายรายการของโปรเจคนั้นจาก "รอ deploy" ไปหมวด **"Deployed"** พร้อมวันที่ (เก็บเป็นประวัติ)
แล้วเคลียร์ "รอ deploy" ของโปรเจคนั้นให้ว่าง

> ถ้า user ระบุเฉพาะบางโปรเจค → ย้ายเฉพาะโปรเจคนั้น ที่เหลือยังค้าง "รอ deploy" ต่อ

## เวลา user ถาม "มีไฟล์ไหนต้องอัปบ้าง"

ห้ามตอบจาก `CHANGES.md` อย่างเดียว เพราะ manifest อาจตกหล่นหรือยังไม่อัปเดต ให้ตรวจหลักฐานจริงของโปรเจคด้วย:

1. อ่าน `CHANGES.md` เพื่อรู้ขอบเขตงานข้าม session
2. ตรวจ `git status --short` สำหรับไฟล์ที่ยังไม่ commit
3. ตรวจ `git log --name-status` / `git diff-tree` ของ commit หรือช่วง commit ที่เกี่ยวข้อง
4. ถ้าจะสรุปว่าไฟล์ใด "ต้องขึ้น server" ต้องรู้ baseline บน server ก่อน เช่น commit/hash หรือวันที่ deploy ล่าสุด
   ถ้ายังไม่รู้ ให้บอกชัดว่าเป็น "ไฟล์ที่เปลี่ยนใน commit/ช่วงนี้" ไม่อ้างว่า server ยังขาดแน่นอน
5. เทียบ Git กับ `CHANGES.md`; ถ้าไม่ตรง ให้ยึด Git เป็นหลักสำหรับไฟล์ใน commit แล้วซ่อม manifest ที่ตกหล่น

`git status` ว่างหมายถึง working tree สะอาด/ไม่มีไฟล์แก้ค้างเท่านั้น **ไม่ได้แปลว่า server มีโค้ดล่าสุดแล้ว**
เวลาผู้ใช้ขอเฉพาะบางชั้น เช่น Controller/Model ให้กรอง path จาก Git จริงแล้วรายงานจำนวนแยก create/edit/delete

---

## รูปแบบ `memory/CHANGES.md`

```markdown
# CHANGES — ไฟล์ที่แก้ (deploy manifest)

## รอขึ้น server (pending)

### <project/service>
- [~] app/Controllers/Api/XController.php     # แก้ logic ...
- [+] app/Models/YModel.php                   # เพิ่ม model
- [-] app/Libraries/OldLib.php                # ลบทิ้ง

## Deployed แล้ว (ประวัติ)

### 2026-07-10 — <project/service>
- [~] app/Controllers/Api/XController.php
```

---

## Definition of Done เพิ่มเติม

งานที่**แตะไฟล์โปรเจค** ตอนปิดงานต้อง:

1. append ไฟล์ที่ create/edit/delete รอบนี้ลง `CHANGES.md` หมวด "รอ deploy"
2. รายงาน action + ชื่อไฟล์ + path + จุดประสงค์ของไฟล์ให้ user ในข้อความสรุปปิดงาน
3. (งานไม่แตะไฟล์ เช่น ตอบคำถาม/ปรึกษา → ข้าม)

> `CHANGES.md` เป็น work memory ของ workspace — agent สร้างเองตอนแตะไฟล์ครั้งแรก · อยู่ใน `.gitignore` (`memory/`)
