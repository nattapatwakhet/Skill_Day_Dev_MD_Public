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

## เมื่อ user บอก "อัปขึ้น server แล้ว"

user พูดทำนอง **"deploy แล้ว" / "อัปขึ้น server แล้ว" / "ขึ้น [project] แล้ว"** →
ย้ายรายการของโปรเจคนั้นจาก "รอ deploy" ไปหมวด **"Deployed"** พร้อมวันที่ (เก็บเป็นประวัติ)
แล้วเคลียร์ "รอ deploy" ของโปรเจคนั้นให้ว่าง

> ถ้า user ระบุเฉพาะบางโปรเจค → ย้ายเฉพาะโปรเจคนั้น ที่เหลือยังค้าง "รอ deploy" ต่อ

## เวลา user ถาม "มีไฟล์ไหนต้องอัปบ้าง"

อ่าน `CHANGES.md` หมวด "รอ deploy" แล้วตอบเป็นลิสต์ path จัดกลุ่มตามโปรเจค พร้อม action

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

งานที่**แตะไฟล์โปรเจค** ตอนปิดงานต้อง append ไฟล์ที่ create/edit/delete รอบนี้ลง `CHANGES.md`
หมวด "รอ deploy" (งานไม่แตะไฟล์ เช่น ตอบคำถาม/ปรึกษา → ข้าม)

> `CHANGES.md` เป็น work memory ของ workspace — agent สร้างเองตอนแตะไฟล์ครั้งแรก · อยู่ใน `.gitignore` (`memory/`)
