# Work Flow — ตรรกะการทำงาน (เดินตามทีละขั้น)

มาจาก [`main_skill.md`](./main_skill.md) แล้ว ไฟล์นี้คือ **ตัวจำแนกงาน** — ใช้ได้กับ **งานทุกด้าน**
หน้าที่หลักคือ "อ่านว่างานนี้เป็น**ด้านไหน (domain)**" แล้วส่งไปสกิลของโดเมนนั้น
code เป็นแค่ **หนึ่งโดเมน** ไม่ใช่ศูนย์กลาง เดินตามขั้นด้านล่าง **ตามลำดับ** ขั้นไหนไม่เข้าก็ข้าม

---

## ภาพรวม flow

```
[1] เข้าใจงาน + จำแนกว่าเป็น "ด้านไหน" (domain)
        │
[2] งานนี้แตะไฟล์/โปรเจคไหม? → ใช่: project_structure_skill.md (ไม่มีก็เพิ่ม) / ไม่: ข้าม
        │
[3] เปิดสกิลตาม "โดเมน" ของงาน — เลือกได้หลายโดเมน ผสมกันได้:
        ├─ code            → code_skill.md (+coding_principles)
        │     เว็บ frontend: javascript→react→react_type   (ใช้ docker)
        │     เว็บ backend:  php→codeigniter3/4 · python  + เช็ค API→api_skill  (ใช้ docker)
        │     mobile:       flutter   (ไม่ใช้ docker)
        │     desktop/สคริปต์: python   (ไม่ใช้ docker)
        │     ของกลาง: debug / frontend_design
        ├─ เอกสาร/ไฟล์ส่งมอบ → deliverable_skill.md (docx/สไลด์/ชีต/PDF/อาร์ต)
        ├─ วิดีโอ           → video_skill.md
        ├─ ค้นคว้า          → research_skill.md
        ├─ วิเคราะห์ข้อมูล  → data_skill.md
        ├─ เขียนเนื้อหา     → writing_skill.md
        └─ โดเมนใหม่อื่นๆ   → เพิ่มได้เรื่อยๆ (ในหมวดหมู่) ผ่าน skill_maintenance
        │  (ผสมกันได้: code+research, code+deliverable, video+writing ฯลฯ)
        │
[4] งานนี้ต้อง "ดู/คุมหน้าจอ" ไหม?
        ├─ ไม่ → ข้าม
        └─ ใช่ → controlled_operation_skill.md
        │
[5] งานนี้ต้อง "รันคำสั่ง/สคริปต์บนเครื่อง user" ไหม?
        ├─ ไม่ → ข้าม
        └─ ใช่ → terminal_skill.md
        │
[6] งานนี้ต้องขอสิทธิ์อะไรบ้าง? → permission_skill.md  (ขอให้ครบในครั้งเดียว)
        │
[7] ลงมือทำในขอบเขตสิทธิ์ + ตามกฎของไฟล์ที่เกี่ยว
        ├─ ก่อนแตะไฟล์ (งานหลายขั้น) → progress_skill.md: สร้าง skill/day_dev_public/memory/PROGRESS.md
        ├─ งานใหญ่/เสี่ยง/แตะหลายไฟล์ → plan_mode_skill.md (วางแผนก่อน รออนุมัติ แล้วแก้ทีละไฟล์)
        └─ ก่อนลงมือ ถ้าเป็น plan ใหญ่ → review_skill.md (มีวิธีง่ายกว่าไหม)
        │
[8] ตรวจงาน (review_skill.md) + ปิดงาน + ถ้าต้องรายงานคนอื่น → report_skill.md
        └─ Definition of Done: แนะนำ + PROGRESS + WORK_LOG + CHANGES(ถ้าแตะไฟล์) + update skill + log แชต(ถ้าถูกขอ)
```

---

## [1] เข้าใจงาน + จำแนกโดเมน

ถามตัวเองก่อน:

- งานนี้ "ผลลัพธ์" คืออะไร อยากได้อะไรออกมา
- **งานนี้เป็นด้านไหน (domain)?** — code / สร้างไฟล์ส่งมอบ / ค้นคว้า / วิเคราะห์ข้อมูล / เขียนเนื้อหา / อื่นๆ
- ขอบเขตแค่ไหน — ทำเฉพาะที่ขอ
- งานนี้แตะ **เครื่อง user** (จอ/แอป/ไฟล์นอก sandbox) ไหม / ต้องใช้ **บริการภายนอก** ไหม

> โดเมนคือคำตอบหลักที่พา flow ไปขั้น [3] — ระบบนี้ทำได้ทุกด้าน ไม่ใช่แค่ code
> ขั้น [4]–[6] (คุมจอ / รันคำสั่ง / สิทธิ์) เป็นตัวเสริมที่งานโดเมนไหนก็เรียกใช้ได้

---

## [2] งานนี้แตะไฟล์/โปรเจคไหม? → `project_structure_skill.md`

**เฉพาะงานที่แตะไฟล์ในโปรเจค** (เขียนโค้ด, ย้าย/แก้ไฟล์) เปิด [`project_structure_skill.md`](./project_structure_skill.md):

- โปรเจคนี้คือตัวไหน (`api/`, `web/`, `app/`, package/module ใด)
- ไฟล์ประเภทนี้ควรอยู่ folder ไหน + layer boundary

> งานที่ไม่แตะโปรเจค (เช่น ค้นคว้า, ตอบคำถาม, ทำสไลด์) → ข้ามขั้นนี้
> **ถ้าโครงสร้างของโปรเจคยังไม่มีในไฟล์นั้น → เพิ่มเข้าไป** (เป็นทะเบียนกลางของทุกโปรเจค)

---

## [3] เปิดสกิลตามโดเมนของงาน

จาก [1] รู้แล้วว่างานเป็นด้านไหน → เปิดสกิลของโดเมนนั้น:

### โดเมน: code → `code_skill.md`

ถ้างานคือการเขียน/แก้/รีแฟกเตอร์โค้ด → เปิด [`code_skill.md`](./code_skill.md) ก่อน
ไฟล์นั้นรวม **หลักการที่ใช้ได้ทุกภาษา**: naming convention, scope rules, after-rename steps,
type annotation, import philosophy

จากนั้น `code_skill.md` จัด **ไฟล์เฉพาะภาษา** เป็น 3 กลุ่ม (base → framework):

- **เว็บ frontend** (docker): [`javascript_skill.md`](./javascript_skill.md) → [`react_skill.md`](./react_skill.md) → [`react_type_skill.md`](./react_type_skill.md)
- **เว็บ backend** (docker): [`php_skill.md`](./php_skill.md) → [`codeigniter3_skill.md`](./codeigniter3_skill.md) / [`codeigniter4_skill.md`](./codeigniter4_skill.md) · [`python_skill.md`](./python_skill.md) — **เช็ค "เป็นงาน API ไหม?"** → [`api_skill.md`](./api_skill.md)
- **mobile** (ไม่ใช้ docker): [`flutter_skill.md`](./flutter_skill.md)
- **desktop / สคริปต์** (ไม่ใช้ docker): [`python_skill.md`](./python_skill.md) (เช่น id_card_reader, สคริปต์ data)

> ลำดับอ่าน: `code_skill` (หลักรวม) → ไฟล์ภาษา (base → framework) → ลงมือ
> ภาษาใหม่ → สร้างไฟล์ + จัดเข้าหมวดให้ถูก (frontend/backend/mobile)
>
> งานย่อยของ code: **แก้บั๊ก** → [`debug_skill.md`](./debug_skill.md) · **เว็บรันบน docker** → [`docker_skill.md`](./docker_skill.md) (ไม่ใช่ mobile) · **ทำ API** → [`api_skill.md`](./api_skill.md)
> ทุกงาน code อ่าน [`coding_principles_skill.md`](./coding_principles_skill.md) ควบ

### โดเมน: สร้างไฟล์ส่งมอบ → `deliverable_skill.md`

งานคือ **สร้างเอกสาร/สไลด์/สเปรดชีต/PDF/อาร์ต** (ไม่ใช่แก้โค้ดโปรเจค) → [`deliverable_skill.md`](./deliverable_skill.md)
(เป็น router ชี้ไปสกิลเอกสาร/อาร์ตที่มีในระบบ)

### โดเมน: ค้นคว้า → `research_skill.md`

งานคือ **หาข้อมูล / สรุปความรู้ / เช็คข้อเท็จจริง** → [`research_skill.md`](./research_skill.md)

### โดเมน: วิเคราะห์ข้อมูล → `data_skill.md`

งานคือ **วิเคราะห์/ทำความสะอาด/ทำชาร์ตจากข้อมูล** → [`data_skill.md`](./data_skill.md)

### โดเมน: เขียนเนื้อหา → `writing_skill.md`

งานคือ **เขียนบทความ/โพสต์/อีเมล/README/doc** → [`writing_skill.md`](./writing_skill.md)

### โดเมน: วิดีโอ → `video_skill.md`

งานคือ **ตัด/ทำ/แปลง/รวมวิดีโอ** → [`video_skill.md`](./video_skill.md)

### โดเมนใหม่ที่ยังไม่มีไฟล์

ระบบนี้ทำได้ทุกด้าน ถ้างานไม่เข้าโดเมนข้างบนเลย → ทำตามหลักทั่วไป (เข้าใจเป้า → ลงมือ → ตรวจ)
แล้วถ้า **โดเมนนี้เจอบ่อย** → จบงานสร้างไฟล์โดเมนใหม่ผ่าน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md) แล้วลิงก์กลับ index
(นี่คือจุดที่ทำให้ระบบ "โตได้")

> ถ้าไม่เข้าโดเมนไหนเลย (เช่น ตอบคำถามสั้นๆ) → ข้ามขั้นนี้ไป [4]

### โดเมนผสมกันได้ — ไม่ต้องเลือกอันเดียว

งานเดียว**เข้าได้หลายโดเมนพร้อมกัน** เปิดสกิลของทุกโดเมนที่เกี่ยว เช่น code ผสมกับโดเมนอื่น:

- **code + research** — หา library/วิธีแก้ก่อนเขียน → research + `code_skill`
- **code + data** — เขียนโค้ดวิเคราะห์/ทำ chart → `code_skill` + data
- **code + deliverable** — เขียนโค้ดเสร็จแล้วทำ README / เอกสาร API / export รายงาน → `code_skill` + [`deliverable_skill.md`](./deliverable_skill.md)
- **code + writing** — เขียน changelog / คอมเมนต์ / doc → `code_skill` + writing

> deliverable / research / data / writing **ไม่ได้ห้ามใช้กับ code** — มันเสริมกันได้
> เลือกตามว่า "งานนี้ต้องทำอะไรบ้าง" ไม่ใช่ "งานนี้เป็นประเภทเดียวคืออะไร"

---

## [4] งานนี้ต้อง "ดู/คุมหน้าจอ" ไหม? → `controlled_operation_skill.md`

**เช็คก่อนเสมอว่างานนี้จำเป็นต้องดูจอหรือคุมจอจริงไหม**

- **ไม่ต้อง** ถ้าทำได้ด้วยอ่าน/แก้ไฟล์, รันคำสั่ง, curl/API, test output, log, screenshot จาก tool, หรือ browser automation → **ข้ามขั้นนี้**
- **ต้อง** เฉพาะเมื่อผลลัพธ์ต้องพึ่งการมองเห็น/ใช้งาน UI จริง หรือไม่มีวิธีอื่นที่ reliable เช่น UX/UI layout, spacing, overflow, interaction, browser-specific behavior, คลิก/เลือก/ยืนยันในแอปจริง, state เฉพาะ session/browser/app, หรือ user ขอให้ดูจอโดยตรง →
  เปิด [`controlled_operation_skill.md`](./controlled_operation_skill.md) แล้วทำตามลำดับการคุมจอ

---

## [5] งานนี้ควรใช้ "terminal/command-line" ไหม? → `terminal_skill.md`

**เช็คว่างานนี้ใช้ command-line แล้วเหมาะ/เร็ว/แม่นกว่าไหม และคำสั่งนั้นต้องแตะเครื่อง user หรือ service จริงไหม**

- **ไม่ต้อง** ถ้าตอบ/แก้ได้จาก context หรือเครื่องมืออ่านไฟล์โดยตรงอยู่แล้ว → **ข้ามขั้นนี้**
- **ใช้ได้/ควรใช้** เมื่องานเหมาะกับ command-line เช่น ค้นหาไฟล์/ข้อความ (`rg`, `find`, `ls`), อ่านช่วงไฟล์ (`sed`), ดู diff, build/test/lint/curl/log/db/docker, หรือรันสคริปต์ช่วยงาน
  - ถ้าคำสั่งรันใน sandbox ได้ → ใช้ terminal/exec ปกติ
  - ถ้าต้องแตะ Docker/localhost/service/DB ของเครื่อง user → เปิด [`terminal_skill.md`](./terminal_skill.md) แล้วใช้วิธีที่ runtime รองรับ เช่น escalation, `.command`, หรือให้ user รันเอง

> ขั้นนี้แยกจาก [4]: terminal/docker = ใช้เมื่องานเหมาะกับ command-line หรือ service/container; คุมจอ = ใช้เมื่อต้องเห็นหรือควบคุม UI จริง
> ห้ามคุมจอเพียงเพราะต้องรัน Docker ถ้ารันด้วย terminal/วิธี command-line ได้

---

## [6] งานนี้ต้องขอสิทธิ์อะไรบ้าง? → `permission_skill.md`

ดูว่างานที่จะทำให้ user **ต้องใช้สิทธิ์อะไร** แล้วเปิด [`permission_skill.md`](./permission_skill.md) เช็ค:

- ต้องใช้สิทธิ์แบบไหน (โฟลเดอร์ / คุมจอรายแอป / connector ภายนอก)
- มีสิทธิ์แล้วหรือยัง — ถ้ายัง **ขอให้ครบในครั้งเดียว**
- งานนี้เป็นสิ่งที่ "ทำไม่ได้เด็ดขาด" หรือ "ต้องขอ user ก่อนทุกครั้ง" ไหม

> ถ้าขั้น [4]/[5] ต้องคุมจอหรือรันสคริปต์ — สิทธิ์ก็มาขอที่ขั้นนี้ (เช็คสิทธิ์ก่อน แล้วค่อยลงมือ)

---

## [7] ลงมือทำ

- **ก่อนแตะไฟล์ (งานหลายขั้น/แตะหลายไฟล์/น่าจะทำไม่จบรอบเดียว): สร้าง `skill/day_dev_public/memory/PROGRESS.md`**
  ตาม [`progress_skill.md`](./progress_skill.md) — จดเป้าหมาย + checklist ของแผน ก่อนลงมือ
  (งานสั้น 1–2 step ข้ามได้) → resume ข้าม session/agent เมื่อ token หมด/ย้าย agent
- ทำในขอบเขตสิทธิ์ที่ได้ ตามกฎของไฟล์ที่เกี่ยวข้อง · ทำเสร็จแต่ละก้อน **อัปเดต PROGRESS** (`[ ]`→`[x]`)
- บอก user ก่อนทำสิ่งที่แตะเครื่อง/ย้อนไม่ได้ แล้วรอ ok
- **งานใหญ่/เสี่ยง/แตะหลายไฟล์/ยังไม่รู้สาเหตุชัด** → เข้า [`plan_mode_skill.md`](./plan_mode_skill.md)
  วางแผนเป็น checklist (ไฟล์ไหน/ฟังก์ชันไหน/ทำไม/ลำดับ) **ก่อนแตะไฟล์** → รอ user อนุมัติ → แก้ทีละไฟล์
  (คิด/วางแผน = Opus · ลงมือ = Sonnet)
- **ถ้าเป็น plan ใหญ่/มีหลายทางเลือก** → ก่อนลงมือ รีวิว plan ด้วย [`review_skill.md`](./review_skill.md)
  (เช็คว่ามีวิธีง่ายกว่าไหม ก่อนจะเสียแรงทำ)

---

## [8] ตรวจงาน + ปิดงาน

- ตรวจงานตามชนิด:
  - Flutter → `dart format` + `dart analyze` + `flutter test` (ดู `flutter_skill.md`)
  - React/JS/TS → `npm run build` หรือ `tsc --noEmit` + เทสหน้าเว็บจริง [`webapp_testing_skill.md`](./webapp_testing_skill.md) (Playwright)
  - PHP/CodeIgniter → เทส endpoint/PHPUnit (ดู [`api_skill.md`](./api_skill.md) / `php_skill.md`)
  - Python → `pytest`/`unittest` (ดู `python_skill.md`)
  - คุมจอ → screenshot ปิดท้าย แล้ว **คืนจอให้ user**
  - *หลักการเทสกลาง (เขียนเทสที่ reproduce แล้วทำให้ผ่าน) อยู่ใน `karpathy_skill` / `debug_skill`*
- **รีวิวโค้ด/diff ที่แก้** ด้วย [`review_skill.md`](./review_skill.md) — trace path จริง verify ว่าทำได้ตามที่อ้าง (มี over-engineering pass ด้วย)
- **เสนอสิ่งที่ควรปรับ/แก้เพิ่ม** — เจอจุดที่ควรแก้ระหว่างทำ (บั๊กแฝง, tech-debt, ซับซ้อนเกิน, เสี่ยง, วิธีง่ายกว่า) → บอก user แม้ไม่ได้ขอ พร้อมจุด+เหตุผล+ผลกระทบ จัดอันดับความสำคัญ (อย่าลงมือแก้นอกขอบเขตเอง เสนอก่อน)
- สรุปสั้นๆ ว่าทำอะไร ผ่าน check อะไรบ้าง
- **ถ้าต้องรายงานให้คนไม่ใช่ dev** (หัวหน้า/PM/ทีมอื่น) → จัดรูปด้วย [`report_skill.md`](./report_skill.md)
- ถ้าเจอแพตเทิร์น/โครงสร้าง/กฎใหม่ → บันทึกกลับเข้าไฟล์ที่เกี่ยวในโฟลเดอร์ skill
  (รายละเอียดวิธีบันทึกอยู่ท้าย [`main_skill.md`](./main_skill.md))
- หลังจบงานจริงให้ append `skill/day_dev_public/memory/WORK_LOG.md` ตาม [`work_summary_skill.md`](./work_summary_skill.md)
  เพื่อให้ถามย้อนหลังได้ว่า "วันนี้/เดือนนี้ทำอะไรไปบ้าง" และเอาไปเรียบเรียงใส่สไลด์ได้
- ถ้างานแตะไฟล์โปรเจค → append ไฟล์ที่ create/edit/delete ลง `skill/day_dev_public/memory/CHANGES.md`
  ตาม [`deploy_skill.md`](./deploy_skill.md) (ไว้ deploy เฉพาะที่แก้; user บอก "อัปขึ้น server แล้ว" → mark deployed)
- ถ้า user ขอ "อัปเดตสิ่งที่คุยในแชตลง skill / อะไรยังไม่ได้ลง" →
  ใช้ [`conversation_log_skill.md`](./conversation_log_skill.md) คู่กับ [`skill_maintenance_skill.md`](./skill_maintenance_skill.md)

### ✅ Definition of Done — จบงานจริงทุกครั้งต้องครบ

1. **แนะนำ** — เสนอสิ่งที่ควรปรับ (บั๊กแฝง/tech-debt/วิธีง่ายกว่า) พร้อมจุด+เหตุผล+ผลกระทบ จัดอันดับ
2. **จดบันทึก** — อัปเดต [`progress_skill.md`](./progress_skill.md) (`skill/day_dev_public/memory/PROGRESS.md`): ทำถึงไหน,
   เหลืออะไร (Next), คำแนะนำที่เสนอไปแยก "ทำตามแล้ว / ยังไม่ได้ทำตาม", blocker → ให้ session/agent ถัดไปทำต่อได้
3. **จดสรุปย้อนหลัง** — append [`work_summary_skill.md`](./work_summary_skill.md) (`skill/day_dev_public/memory/WORK_LOG.md`)
   เป็น bullet สั้นสำหรับตอบ "วันนี้/เดือนนี้ทำอะไรไปบ้าง" หรือเอาไปใส่สไลด์
4. **จดไฟล์ที่แก้ (ถ้าแตะไฟล์โปรเจค)** — append `skill/day_dev_public/memory/CHANGES.md` ([`deploy_skill.md`](./deploy_skill.md))
   บอก action (สร้าง/แก้/ลบ) + path → ตอนอัปขึ้น server ส่งเฉพาะที่แก้; user บอก "อัปขึ้น server แล้ว" → mark deployed
5. **update skill** — มีกฎ/แพตเทิร์น/โดเมนใหม่ → บันทึกเข้าไฟล์ skill ที่ถูก ([`skill_maintenance_skill.md`](./skill_maintenance_skill.md))
6. **log แชต (ถ้าถูกขอ)** — user ขอ sync สิ่งที่คุย → [`conversation_log_skill.md`](./conversation_log_skill.md)

> ข้อ 1 ผูกกับข้อ 2: คำแนะนำที่เสนอต้องถูกจดใน PROGRESS แยก "ทำแล้ว/ยังไม่ทำ" เพื่อรอบหน้ารู้ว่ายังค้างอะไร

---

## 3 โหมดการทำงาน (เลือกตามชนิดข้อความ — user เป็นคนกำหนดทาง)

| โหมด | เข้าเมื่อ | ทำอะไร |
|---|---|---|
| **คุยทั่วไป/ถามสั้น** | ทักทาย, ถามข้อเท็จจริงสั้น | ตอบเลย **ไม่เปิด skill ไม่ประกาศ** |
| **ปรึกษา/คิดโปรเจค** | ถามกว้าง, "คิดด้วยกัน", ยังไม่ชัด | ถ้าคุยถึงโปรเจคจริง → **ground ด้วย `project_structure_skill` + อ่านโค้ดจริงก่อน** → ถก/เสนอทางเลือก **ไม่แก้ไฟล์** (ตรงกับ `plan_mode_skill`/`review_skill`) |
| **งานจริง** | สั่งชัดตรงๆ ("แก้ X", "เพิ่ม Y") | **เปิด domain skill + บอกชื่อ skill ที่อิง 1 บรรทัด** → (งานหลายขั้น: สร้าง PROGRESS) → ทำในขอบเขต → ตรวจ → **Definition of Done** (แนะนำ + PROGRESS + WORK_LOG + CHANGES + update skill + log) |

**งานจริงที่เป็น "แก้บั๊ก/ของพัง" → มีขั้นหาสาเหตุก่อนแก้เสมอ** (อยู่ในโหมดงานจริง):
`เปิด domain skill + ` [`debug_skill.md`](./debug_skill.md) → **หาสาเหตุ** (4 ขั้น: reproduce →
fail path → หักล้าง hypothesis → breadcrumb) → **เจอ root cause จริงก่อน** ค่อยแก้ → ตรวจ → บันทึก
> อาการข้ามชั้น (frontend แต่ data มาจาก API/DB) → **ขอ artifact ชี้ขาด (response จริงของ
> endpoint) ก่อน** อย่าไล่แก้ปลายเหตุ (ดู `debug_skill`)

กฎเสริม:
- **ปรึกษาเป็น optional ไม่บังคับ** — สั่งตรงๆ = ลงมืองานจริงเลย ข้ามปรึกษาได้
- **ข้อยกเว้น:** ถึงสั่งตรงๆ แต่ถ้างาน **ใหญ่/เสี่ยง/แตะหลายไฟล์/ย้อนไม่ได้** → สรุป plan ให้ดูก่อน รอ "โอเค"
- ไหลปกติเมื่อมีปรึกษา: **ปรึกษา → วางแผน → user โอเค → งานจริง**
- **ไม่กระโดดแก้ไฟล์เองตอนยังปรึกษา/วางแผนอยู่** — รอ "โอเค" ก่อนเสมอ
- งานจริงให้ **เปิดไฟล์ skill ของโดเมนนั้นจริง ไม่ทำจากความจำ** (ข้ามโดเมน = เปิดไฟล์ใหม่)
