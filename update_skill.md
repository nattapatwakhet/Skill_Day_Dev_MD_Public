# Update Skill — โหลดเวอร์ชันล่าสุดมาปรับใช้ (self-update)

มาจาก [`skill_maintenance_skill.md`](./skill_maintenance_skill.md) — ใช้เมื่อ user สั่ง
**"update skill" / "อัปเดต skill" / "โหลดเวอร์ชันใหม่"** เพื่อดึงชุด skill สาธารณะเวอร์ชันล่าสุด
มาเทียบ แล้วเอา **เฉพาะของใหม่ที่ยังไม่มี** มาปรับใช้กับชุดที่ติดตั้งอยู่

> คำสั่งนี้เป็น **public-only** (ชุดที่ผู้อื่นโหลดไปใช้ ต้องมีวิธี pull update จากต้นทาง)
> เป็น **on-demand** — ทำเมื่อ user สั่งเท่านั้น ไม่ใช่ทุกครั้งจบงาน

repo ต้นทาง: `https://github.com/nattapatwakhet/Skill_Day_Dev_MD_Public`

---

## ขั้นตอน (agent ทำตามนี้เมื่อ user สั่ง update)

### 1. โหลดเวอร์ชันล่าสุดลงโฟลเดอร์ชั่วคราว

โหลดลง `skill/day_dev_public/update/` โดยชื่อโฟลเดอร์ที่ได้คือ `Skill_Day_Dev_MD_Public`:

```bash
mkdir -p skill/day_dev_public/update
# วิธี A: git clone (เอาเฉพาะล่าสุด ไม่เอา history)
git clone --depth 1 https://github.com/nattapatwakhet/Skill_Day_Dev_MD_Public.git \
  skill/day_dev_public/update/Skill_Day_Dev_MD_Public

# วิธี B: ถ้าไม่มี git — โหลด ZIP แล้วแตกให้ได้โฟลเดอร์เดียวกัน
#   curl -L -o /tmp/skill.zip https://github.com/nattapatwakhet/Skill_Day_Dev_MD_Public/archive/refs/heads/main.zip
#   unzip /tmp/skill.zip -d skill/day_dev_public/update
#   mv skill/day_dev_public/update/Skill_Day_Dev_MD_Public-main skill/day_dev_public/update/Skill_Day_Dev_MD_Public
```

> ถ้าเครื่องดึงเน็ตไม่ได้/บล็อก ให้บอก user โหลด ZIP เองแล้ววางไว้ที่
> `skill/day_dev_public/update/Skill_Day_Dev_MD_Public` แล้วสั่งต่อ

### 2. เรียนรู้/เทียบ — เอาเฉพาะของใหม่ที่ยังไม่มี

เทียบ **ของที่โหลดมา** (`update/Skill_Day_Dev_MD_Public/`) กับ **ของที่ใช้อยู่** (`skill/day_dev_public/`):

```bash
# ไฟล์ที่มีในเวอร์ชันใหม่แต่ยังไม่มีในเครื่อง (ไฟล์ใหม่ทั้งไฟล์)
diff -rq skill/day_dev_public/update/Skill_Day_Dev_MD_Public skill/day_dev_public \
  | grep "Only in .*update"
# ความต่างรายไฟล์ (section/กฎใหม่ในไฟล์เดิม)
diff -ru skill/day_dev_public/<file>.md \
  skill/day_dev_public/update/Skill_Day_Dev_MD_Public/<file>.md
```

กฎการ merge:

- **ไฟล์ใหม่ทั้งไฟล์** → copy เข้า `skill/day_dev_public/` แล้วเพิ่มใน index ของ `main_skill.md`
- **section/กฎใหม่ในไฟล์เดิม** → เพิ่ม **เฉพาะส่วนที่ยังไม่มี** (ความรู้ generic / กฎ / แพตเทิร์น / stack ใหม่)
- **ห้ามทับเนื้อหาที่ user ปรับ local เอง** — โดยเฉพาะ:
  - `project_structure_skill.md` (โครงสร้างโปรเจคจริงของ user)
  - `docker_skill.md` (service/port จริงของ user)
  - `conversation_log_skill.md` (log ของ user เอง)
  - `memory/PROGRESS.md` (งานที่ user กำลังทำ)
  - ไฟล์/section ใดๆ ที่ user แก้ให้เข้ากับ workspace ตัวเอง
  → 4 อย่างข้างบนเอา **แค่กฎ/วิธีใช้ที่เปลี่ยน** ไม่เอา "เนื้อหา" มาทับ
- ถ้าไม่แน่ใจว่าอันไหน local vs upstream → **ถาม user ก่อน** อย่าทับมั่ว
- ใช้ tool diff ช่วย (git diff / `diff -u` / rg) อย่าไล่อ่านทั้งไฟล์เทียบเอง

### 3. ลบโฟลเดอร์ชั่วคราวทิ้ง

เมื่อ merge เสร็จ:

```bash
rm -rf skill/day_dev_public/update/Skill_Day_Dev_MD_Public
rmdir skill/day_dev_public/update 2>/dev/null || true   # ลบ update/ ถ้าว่าง
```

### 4. สรุปให้ user

รายงานว่า **เพิ่ม/อัปเดตอะไรบ้าง** (ไฟล์ใหม่กี่ไฟล์, section ใหม่ในไฟล์ไหน) และ
**อะไรที่ตั้งใจไม่แตะ** (ของ local ที่ user ปรับเอง) + เช็ก broken link หลัง merge

---

## หมายเหตุ

- โฟลเดอร์ `update/` เป็น temp เท่านั้น — อยู่ใน `.gitignore` แล้ว ไม่ถูกคอมมิต
- คำสั่งนี้ **ดึงจาก public → ทับ public ของตัวเอง** เท่านั้น ไม่เกี่ยวกับ private ของใคร
- ถ้า user fork/แก้ repo ต้นทางเอง ให้เปลี่ยน URL ในไฟล์นี้เป็น repo ของตัวเอง
