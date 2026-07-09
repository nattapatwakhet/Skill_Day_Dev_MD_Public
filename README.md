# Day Dev Public Skill

ชุดไฟล์ skill สำหรับใช้เป็น working system ให้ AI coding agent อ่านก่อนทำงานในโปรเจกต์ ชุดนี้ช่วยให้ agent ทำงานเป็นขั้นตอน: เข้าใจโจทย์ → จำแนกโดเมน → เปิด skill ที่เกี่ยว → ทำในขอบเขต → ตรวจงาน → บันทึกความรู้ใหม่กลับเข้า skill

This is a public, reusable skill pack for AI coding agents. It gives the agent a repeatable workflow: understand the task, classify the work domain, load the relevant skill files, execute within scope, verify the result, and record reusable learnings.

---

## ใช้ทำอะไร

- กำหนดวิธีคิดก่อนลงมือทำงานใน workspace
- แยกกฎตามโดเมน เช่น code, research, data, writing, deliverable, video
- แยกกฎตาม stack เช่น Flutter, React, TypeScript, PHP, CodeIgniter, Python, Docker
- บังคับให้ agent อ่านโครงสร้างโปรเจกต์ก่อนแก้ไฟล์
- ช่วยให้ agent สรุป ตรวจงาน และบันทึก pattern ใหม่ไว้ใช้ครั้งหน้า

## What It Does

- Defines a consistent working process for an AI agent inside a project
- Routes work by domain: code, research, data, writing, deliverables, video
- Provides stack-specific rules for Flutter, React, TypeScript, PHP, CodeIgniter, Python, and Docker
- Encourages reading project structure before editing files
- Captures reusable project learnings back into the skill files

---

## โครงสร้างไฟล์

```text
skill/day_dev_public/
├─ AGENTS.md
├─ CLAUDE.md
├─ main_skill.md
├─ work_flow_skill.md
├─ project_structure_skill.md
├─ code_skill.md
├─ *_skill.md
├─ README.md
├─ LICENSE
└─ .gitignore
```

ไฟล์หลัก:

- `AGENTS.md` — entry instruction สำหรับ Codex/agents ที่อ่าน AGENTS.md
- `CLAUDE.md` — entry instruction สำหรับ Claude-style workspace instruction
- `main_skill.md` — จุดเริ่มต้น วิธีคิด และ index
- `work_flow_skill.md` — flow การทำงานหลัก
- `project_structure_skill.md` — template โครงสร้างโปรเจกต์ ให้ปรับตาม workspace จริง
- `skill_maintenance_skill.md` — กฎเพิ่ม/ปรับ skill และ sync ความรู้ที่เผยแพร่ได้

---

## วิธีติดตั้งในโปรเจกต์

1. **โหลด repo** — กด Code → Download ZIP (หรือ `git clone`) แตกไฟล์จะได้โฟลเดอร์ชื่อ `Skill_Day_Dev_MD_Public-main`
2. **สร้างโฟลเดอร์ `skill/`** ที่ root ของโปรเจกต์ (ถ้ายังไม่มี)
3. **ย้ายโฟลเดอร์ที่โหลดมาเข้าไปใน `skill/` แล้วเปลี่ยนชื่อ** จาก `Skill_Day_Dev_MD_Public-main` → `day_dev_public`
   จะได้ `skill/day_dev_public/`
4. **เอา `AGENTS.md` และ `CLAUDE.md` ไปวางที่ root ของโปรเจกต์** (หรือที่ที่ workspace ใช้รวม instruction)
   ทั้งสองไฟล์ชี้มาที่ `skill/day_dev_public/...` อยู่แล้ว — **ไม่ต้องแก้ path** ถ้าวางตามข้อ 3

ได้โครงสร้างแบบนี้:

```text
<your-project>/
├─ AGENTS.md            ← จาก repo (เอามาวาง root)
├─ CLAUDE.md            ← จาก repo (เอามาวาง root)
└─ skill/
   └─ day_dev_public/   ← เปลี่ยนชื่อจาก Skill_Day_Dev_MD_Public-main
      ├─ main_skill.md
      ├─ work_flow_skill.md
      ├─ *_skill.md
      └─ ...
```

> - `AGENTS.md`/`CLAUDE.md` มีอยู่ในโฟลเดอร์ repo ด้วย — จะ **ย้าย** หรือ **copy** ขึ้น root ก็ได้ (ต้นฉบับที่ค้างอยู่ข้างในไม่มีผลเสีย)
> - ถ้าวาง skill ไว้ path อื่น (ไม่ใช่ `skill/day_dev_public/`) ให้แก้ path ใน `AGENTS.md`/`CLAUDE.md` ให้ตรง

---

## Installation

1. **Download the repo** — Code → Download ZIP (or `git clone`). Unzipping gives a folder named `Skill_Day_Dev_MD_Public-main`.
2. **Create a `skill/` folder** at your project root (if it doesn't exist yet).
3. **Move the downloaded folder into `skill/` and rename it** from `Skill_Day_Dev_MD_Public-main` → `day_dev_public`, giving you `skill/day_dev_public/`.
4. **Put `AGENTS.md` and `CLAUDE.md` at your project root** (or wherever your workspace loads its instructions). They already point to `skill/day_dev_public/...`, so **no path edits are needed** if you follow step 3.

Resulting layout:

```text
<your-project>/
├─ AGENTS.md            ← from the repo (placed at root)
├─ CLAUDE.md            ← from the repo (placed at root)
└─ skill/
   └─ day_dev_public/   ← renamed from Skill_Day_Dev_MD_Public-main
      ├─ main_skill.md
      ├─ work_flow_skill.md
      ├─ *_skill.md
      └─ ...
```

> - `AGENTS.md`/`CLAUDE.md` also ship inside the repo folder — you can **move** or **copy** them to the root (leftover originals inside do no harm).
> - If you place the pack at a different path, update the paths in `AGENTS.md`/`CLAUDE.md` to match.

---

## วิธีใช้งาน

ก่อนให้ agent ทำงาน ให้ instruction ของ workspace บอกว่า:

```text
ก่อนเริ่มงานทุกครั้ง ให้อ่าน skill/day_dev_public/main_skill.md
แล้วเดินตาม skill/day_dev_public/work_flow_skill.md
```

ครั้งแรกหลังติดตั้ง **ไม่ต้องกรอกโครงสร้างเอง** — agent จะ bootstrap ให้:
สแกน repo (top-level folders + ไฟล์ config) แล้วเขียนโครงสร้างจริงลง
`project_structure_skill.md` / service ลง `docker_skill.md` เอง (ดูหัวข้อ "Bootstrap อัตโนมัติ"
ใน `project_structure_skill.md`) แล้วอัปเดตต่อเนื่องเมื่อเจอของใหม่
คุณแค่ตรวจ/แก้เพิ่มถ้าอยากปรับ

---

## Usage

Add a workspace instruction like:

```text
Before every task, read skill/day_dev_public/main_skill.md
and follow skill/day_dev_public/work_flow_skill.md.
```

After installation you do **not** need to fill in the structure by hand — the agent
bootstraps it: it scans the repo (top-level folders + config files) and writes the real
structure into `project_structure_skill.md` (and services into `docker_skill.md`) itself,
then keeps it updated as it discovers more. See the "Bootstrap อัตโนมัติ" section in
`project_structure_skill.md`. You only review/tweak if you want to.

---

## กฎ Public-Safe

ชุดนี้ตั้งใจให้เผยแพร่ได้ จึงไม่ควรมีข้อมูลเหล่านี้:

- path เครื่องจริง เช่น `<local-user-path>/...`
- ชื่อโปรเจกต์หรือระบบภายใน
- production host, internal domain, private registry
- token, secret, password, credential, `.env`
- port/service จริงที่ไม่ต้องการเผยแพร่

ก่อน publish แนะนำรัน:

```bash
rg -n --hidden -i "(secret|token|password|credential|\\.env|api[_-]?key|private|<your-real-user-name>)" .
```

## Public-Safe Rule

This pack is intended to be publishable. Do not include:

- local machine paths such as `<local-user-path>/...`
- internal project or system names
- production hosts, internal domains, private registries
- tokens, secrets, passwords, credentials, `.env`
- real service ports or infrastructure details you do not want to publish

Before publishing, run:

```bash
rg -n --hidden -i "(secret|token|password|credential|\\.env|api[_-]?key|private|<your-real-user-name>)" .
```

---

## License

MIT
