# Main Skill — จุดเริ่มต้น (อ่านไฟล์นี้ก่อนเสมอ)

ไฟล์นี้คือ **ไฟล์หลัก** ของชุด skill ทั้งหมด ใช้ได้กับทุกภาษาและทุกโปรเจค
หน้าที่ของไฟล์นี้คือ **วางวิธีคิด/ตรรกะการทำงาน** แล้ว **ส่งต่อไปไฟล์ที่ถูกต้อง**
ไม่เก็บรายละเอียดเชิงเทคนิคเอง (รายละเอียดอยู่ในไฟล์ย่อยแต่ละตัว)

---

## วิธีคิดก่อนลงมือ (logic หลัก)

ก่อนทำงานทุกครั้ง คิดตามลำดับนี้:

1. **เข้าใจงานก่อน** — user ขออะไร ขอบเขตแค่ไหน แตะไฟล์ไหน/เครื่อง user ไหม
2. **จำแนกว่างานเป็นด้านไหน (domain)** — code? สร้างไฟล์ส่งมอบ? ค้นคว้า? วิเคราะห์ข้อมูล? เขียนเนื้อหา? อื่นๆ — **ระบบนี้ทำได้ทุกด้าน code เป็นแค่หนึ่งโดเมน** (งานเดียวเข้าได้หลายอย่าง)
3. **เดินตาม work flow** — ส่งต่อไป [`work_flow_skill.md`](./work_flow_skill.md) ซึ่งจะจำแนกโดเมนแล้วพาไปไฟล์ที่เกี่ยวทีละขั้น
4. **ทำในขอบเขต** — แก้เฉพาะที่ขอ อ่านไฟล์ล่าสุดก่อนแก้เสมอ
   > งานหลายขั้น/แตะหลายไฟล์/น่าจะทำไม่จบรอบเดียว → **สร้าง `skill/day_dev_public/memory/PROGRESS.md` ก่อนลงมือ** (ดู [`progress_skill.md`](./progress_skill.md)) เพื่อ resume ข้าม session/agent ได้
5. **เสนอสิ่งที่ควรปรับ** — ระหว่าง/หลังทำ ถ้าเห็นจุดที่ควรแก้/ปรับ (บั๊กแฝง, tech-debt, ซับซ้อนเกิน, เสี่ยง, วิธีที่ดีกว่า) → **บอก user แม้ไม่ได้ขอ** แต่ไม่ลงมือแก้เองนอกขอบเขต (เสนอก่อน)
6. **ปิดงาน (Definition of Done)** — (a) สรุปผลสั้นๆ + เสนอสิ่งที่ควรปรับ · (b) อัปเดต [`progress_skill.md`](./progress_skill.md) (ทำถึงไหน/เหลืออะไร/แนะนำอะไรแล้วทำ-ยังไม่ทำ) · (c) append [`work_summary_skill.md`](./work_summary_skill.md) สำหรับสรุปรายวัน/เดือน + ถ้าแตะไฟล์โปรเจค → [`deploy_skill.md`](./deploy_skill.md) (`CHANGES.md` ไฟล์รอ deploy) · (d) มีความรู้/แพตเทิร์น/โดเมนใหม่ → บันทึกเข้า skill (ดูท้ายไฟล์) · (e) user ขอ sync แชต → [`conversation_log_skill.md`](./conversation_log_skill.md)

> หลักการเสนอ: เสนอแบบมีหลักฐาน (ชี้จุด + เหตุผล + ผลกระทบ) จัดอันดับความสำคัญ ไม่ใช่บ่นลอยๆ — ใช้ [`review_skill.md`](./review_skill.md) เป็นเครื่องมือเวลารีวิวลึก

> หลักสำคัญ: ไฟล์นี้ไม่ตัดสินใจรายละเอียดเอง แต่ชี้ว่า "งานนี้เป็นด้านไหน → ต้องไปอ่านไฟล์ไหนต่อ"
> โดเมนใหม่เพิ่มได้เรื่อยๆ เป็นกิ่งระดับเดียวกับ code (ดู `work_flow_skill.md` ขั้น [3] + `skill_maintenance_skill.md`)

---

## แผนผังการเชื่อมต่อ (ไฟล์นี้เชื่อมไปทุกไฟล์)

```
main_skill.md  (วิธีคิด + index)
   │
   └─> work_flow_skill.md            ← ตรรกะตัดสินใจว่างานแบบไหน เดินต่อยังไง
          ├─> project_structure_skill.md   ← โครงสร้างโปรเจคทั้งหมด (ไม่มีก็เพิ่ม)
          │
          ├─> [งาน code] code_skill.md   ← หลักการ code รวม ใช้ได้หลายภาษา
          │        │  — ของกลาง ใช้ได้ทุกภาษา —
          │        ├─> coding_principles_skill.md  (hub) ─┬─ karpathy_skill.md
          │        │                                      └─ ponytail_skill.md
          │        ├─> debug_skill.md          (แก้บั๊ก + post-mortem)
          │        ├─> frontend_design_skill.md (ออกแบบ UI — ทุกแพลตฟอร์ม)
          │        │  — เว็บ frontend (ใช้ docker) —
          │        ├─> javascript_skill.md → react_skill.md → react_type_skill.md
          │        │        └─> webapp_testing_skill.md   (เทส Playwright — web)
          │        │  — เว็บ backend (ใช้ docker) —
          │        ├─> php_skill.md → codeigniter3_skill.md / codeigniter4_skill.md · python_skill.md
          │        │        └─> api_skill.md   (ถ้าเป็นงาน API)
          │        ├─> docker_skill.md         (เว็บทั้ง frontend+backend รันบน docker)
          │        │  — mobile / desktop (ไม่ใช้ docker) —
          │        ├─> flutter_skill.md        (Dart + Flutter + GetX; เทส = flutter test)
          │        └─> python_skill.md         (backend ML / desktop / สคริปต์)
          │
          ├─> [เอกสาร/ไฟล์ส่งมอบ] deliverable_skill.md   ← router ไปสกิลเอกสารในระบบ
          ├─> [วิดีโอ] video_skill.md
          ├─> [ค้นคว้า] research_skill.md
          ├─> [วิเคราะห์ข้อมูล] data_skill.md
          ├─> [เขียนเนื้อหา] writing_skill.md
          │   (โดเมน peer กันหมด ผสมกันได้ เช่น code+research, video+writing — เพิ่มโดเมนใหม่ได้)
          │
          ├─> [ต้องดู/คุมจอ] controlled_operation_skill.md   ← หลักการคุมหน้าจอ/เครื่อง user
          │
          ├─> [ต้องรันคำสั่ง/สคริปต์] terminal_skill.md   ← รันบนเครื่อง user
          │
          ├─> [ต้องขอสิทธิ์] permission_skill.md   ← สิทธิ์ทำได้/ทำไม่ได้
          │
          ├─> [งานใหญ่ วางแผนก่อน] plan_mode_skill.md   ← plan ก่อนแตะไฟล์ → อนุมัติ → แก้ทีละไฟล์
          │
          ├─> [รีวิว plan/PR/code] review_skill.md   ← ก่อนลงมือ / ตอนตรวจงาน
          │
          ├─> [รายงานคนไม่ใช่ dev] report_skill.md   ← ตอนสรุป/ปิดงาน
          │
          ├─> [จดความคืบหน้างาน] progress_skill.md   ← สร้างก่อนลงมือ + อัปเดตหลังทำ (resume ข้าม session/agent)
          ├─> [สรุปวันนี้/เดือนนี้] work_summary_skill.md ← ledger งานสำหรับถามย้อนหลัง/ทำสไลด์
          ├─> [ไฟล์แก้รอ deploy] deploy_skill.md      ← memory/CHANGES.md (ส่งขึ้น server เฉพาะที่แก้ + mark deployed)
          │
          └─> [ปรับ/เพิ่มสกิลเอง] skill_maintenance_skill.md   ← ตอนบันทึกของใหม่
                    ├─> conversation_log_skill.md   ← ตอน user ขอ sync สิ่งที่คุยในแชตลง skill
                    └─> update_skill.md             ← ตอน user สั่ง "update skill" (โหลดเวอร์ชันล่าสุดมาปรับใช้)
```

---

## สารบัญไฟล์ (index)

| ไฟล์ | หน้าที่ |
|---|---|
| [`work_flow_skill.md`](./work_flow_skill.md) | ตรรกะ/ลำดับการทำงาน — เริ่มที่นี่หลังอ่าน main |
| [`project_structure_skill.md`](./project_structure_skill.md) | โครงสร้างโปรเจคทั้งหมด (workspace + Flutter lib/ + React src/) |
| [`code_skill.md`](./code_skill.md) | หลักการเขียน code ที่ใช้ร่วมทุกภาษา (naming, scope, rename, type) |
| [`coding_principles_skill.md`](./coding_principles_skill.md) | hub หลักคิดการเขียนโค้ด → karpathy + ponytail |
| [`karpathy_skill.md`](./karpathy_skill.md) | คิดก่อนเขียน + simplicity + surgical + goal-driven |
| [`ponytail_skill.md`](./ponytail_skill.md) | ขี้เกียจอย่างฉลาด: บันได YAGNI + intensity + `ponytail:` debt |
| **— เว็บ frontend (docker) —** | base → framework |
| [`javascript_skill.md`](./javascript_skill.md) | ภาษาฐาน JS (frontend) |
| [`react_skill.md`](./react_skill.md) | React (JavaScript ล้วน) |
| [`react_type_skill.md`](./react_type_skill.md) | React + TypeScript + MUI v9 (ชั้นบนสุด) |
| **— เว็บ backend (docker) —** | base → framework |
| [`php_skill.md`](./php_skill.md) | ภาษาฐาน PHP (backend) |
| [`codeigniter3_skill.md`](./codeigniter3_skill.md) | framework CodeIgniter 3 |
| [`codeigniter4_skill.md`](./codeigniter4_skill.md) | framework CodeIgniter 4 |
| [`api_skill.md`](./api_skill.md) | งานทำ API (REST/endpoint/auth) ใช้ร่วมทุก backend |
| [`python_skill.md`](./python_skill.md) | Python — backend ML / desktop / สคริปต์ data |
| **— mobile —** | |
| [`flutter_skill.md`](./flutter_skill.md) | กฎเฉพาะ Dart + Flutter + GetX (ไม่ใช้ docker) |
| **— ของกลาง code —** | |
| [`frontend_design_skill.md`](./frontend_design_skill.md) | ออกแบบ UI ให้มีเอกลักษณ์ (ทุกแพลตฟอร์ม) |
| [`webapp_testing_skill.md`](./webapp_testing_skill.md) | เทส web app จริงด้วย Playwright (web only) |
| [`debug_skill.md`](./debug_skill.md) | วินัยแก้บั๊ก 4 ขั้น + บันทึก post-mortem |
| [`docker_skill.md`](./docker_skill.md) | ทะเบียน service ที่รันบน docker + PHP ext-intl (ไม่ใช่ mobile) |
| **— โดเมนอื่น (peer ของ code) —** | |
| [`deliverable_skill.md`](./deliverable_skill.md) | router สร้างไฟล์ส่งมอบ/เอกสาร/อาร์ต → สกิลในระบบ |
| [`video_skill.md`](./video_skill.md) | โดเมนงานวิดีโอ (ตัด/ทำ/แปลง) |
| [`research_skill.md`](./research_skill.md) | โดเมนค้นคว้า/หาข้อมูล/สรุปมีอ้างอิง |
| [`data_skill.md`](./data_skill.md) | โดเมนวิเคราะห์/จัดการ/visualize ข้อมูล |
| [`writing_skill.md`](./writing_skill.md) | โดเมนเขียนเนื้อหา (บทความ/โพสต์/อีเมล/doc) |
| **— ตรวจ/สื่อสาร/ดูแล —** | |
| [`plan_mode_skill.md`](./plan_mode_skill.md) | วางแผนก่อนลงมือ (งานใหญ่/เสี่ยง) → checklist → อนุมัติ → แก้ทีละไฟล์ (Opus คิด/Sonnet ทำ) |
| [`review_skill.md`](./review_skill.md) | รีวิวงานทุกโดเมน + over-engineering pass |
| [`report_skill.md`](./report_skill.md) | สรุปงานให้คนไม่ใช่ dev อ่าน (ตามช่องทาง) |
| [`progress_skill.md`](./progress_skill.md) | ไฟล์ความจำงานที่ทำอยู่ (`skill/day_dev_public/memory/PROGRESS.md`) — สร้างก่อนลงมือ อัปเดตหลังทำ resume ข้าม session/agent |
| [`work_summary_skill.md`](./work_summary_skill.md) | สรุปงานรายวัน/รายเดือนจาก `memory/WORK_LOG.md` สำหรับถามย้อนหลังหรือเอาไปใส่สไลด์ |
| [`deploy_skill.md`](./deploy_skill.md) | จดไฟล์ที่ create/edit/delete รอขึ้น server (`memory/CHANGES.md`) — deploy เฉพาะที่แก้ + mark deployed |
| **— แตะเครื่อง user (เสริม) —** | |
| [`controlled_operation_skill.md`](./controlled_operation_skill.md) | หลักการดู/คุมหน้าจอ คุมเครื่อง user |
| [`terminal_skill.md`](./terminal_skill.md) | วิธีรันคำสั่ง/สคริปต์บนเครื่อง user (.command + Finder) |
| [`permission_skill.md`](./permission_skill.md) | สิทธิ์ที่ต้องขอ / สิ่งที่ทำได้-ทำไม่ได้ |
| [`skill_maintenance_skill.md`](./skill_maintenance_skill.md) | กฎเพิ่ม/ปรับไฟล์ skill ในชุดนี้เอง |
| [`conversation_log_skill.md`](./conversation_log_skill.md) | บันทึกสิ่งที่คุยในแชต + รายการที่ยังไม่ได้ลง skill (เริ่มเป็น log เปล่า) |
| [`update_skill.md`](./update_skill.md) | คำสั่ง "update skill" — โหลดเวอร์ชันล่าสุดจาก repo มาเทียบ เอาของใหม่มาปรับใช้ แล้วลบ temp ทิ้ง |

---

## หลังจบงาน — บันทึกความรู้ใหม่

ถ้าระหว่างหรือหลังทำงานเจอแพตเทิร์น/กฎ/โครงสร้างใหม่ที่ควรจำไว้ใช้ครั้งหน้า
ให้เพิ่มลงไฟล์ที่เกี่ยวข้องในโฟลเดอร์ skill นี้:

```
skill/day_dev_public/
```

- โครงสร้างโปรเจคใหม่ → เพิ่มใน `project_structure_skill.md`
- หลักการ code ใหม่ (ข้ามภาษา) → `code_skill.md` / หลักคิดใหม่ → `karpathy_skill.md` หรือ `ponytail_skill.md`
- กฎเฉพาะภาษา → `flutter_skill.md` / `react_type_skill.md`
- แนวออกแบบ UI ใหม่ → `frontend_design_skill.md` / วิธีเทสใหม่ → `webapp_testing_skill.md`
- เทคนิค debug / เคส post-mortem ใหม่ → `debug_skill.md`
- วิธีรีวิวใหม่ → `review_skill.md` / วิธีสรุปรายงานใหม่ → `report_skill.md`
- สกิลเอกสาร/ส่งมอบใหม่ → `deliverable_skill.md`
- วิธีคุมจอ/รันคำสั่งใหม่ → `controlled_operation_skill.md`
- วิธีจัดการ/เพิ่มสกิลเอง → `skill_maintenance_skill.md`
- สิ่งที่คุยในแชต / รายการที่ยังไม่ได้ลง skill → `conversation_log_skill.md`
- ความคืบหน้างานที่ทำอยู่ (ทำถึงไหน/เหลืออะไร/แนะนำอะไรแล้ว) → `progress_skill.md` (`skill/day_dev_public/memory/PROGRESS.md`) — resume ข้าม session/agent
- สรุปงานย้อนหลังรายวัน/รายเดือน/เอาไปใส่สไลด์ → `work_summary_skill.md` (`skill/day_dev_public/memory/WORK_LOG.md`)
- ไฟล์ที่ create/edit/delete รอขึ้น server (deploy เฉพาะที่แก้) → `deploy_skill.md` (`skill/day_dev_public/memory/CHANGES.md`)
- เรื่องสิทธิ์ใหม่ → `permission_skill.md`
- ถ้าเป็นเรื่องใหม่ที่ไม่เข้าไฟล์ไหนเลย → สร้างไฟล์ใหม่ในโฟลเดอร์นี้ แล้วลิงก์กลับมาที่ index ด้านบน

สำหรับ public version ให้บันทึกเฉพาะความรู้ที่เผยแพร่ได้และตัดข้อมูลส่วนตัว/โปรเจคจริงออกก่อนเสมอ

รายละเอียดกติกา public-safe อยู่ใน [`skill_maintenance_skill.md`](./skill_maintenance_skill.md)
