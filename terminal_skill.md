# Terminal Skill — ใช้ command-line / รันคำสั่ง

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [5] — เป็นขั้นเงื่อนไขแยกของตัวเอง
ใช้เมื่องานเหมาะกับ **command-line**: ค้นหา/สำรวจไฟล์, อ่าน output, verify, build, test, lint, curl, docker, log, DB query, หรือรันสคริปต์ช่วยงาน
ถ้าคำสั่งแตะ service จริงบนเครื่อง user (Docker/localhost/DB) ให้ใช้วิธีที่ runtime รองรับ เช่น escalation, `.command`, หรือให้ user รันเอง

> ไม่ใช่สกิลคุมจอ: ถ้าแค่ต้องรัน Docker/localhost/log ให้ใช้ terminal ก่อน ไม่เปิด Finder/ไม่คุมจอถ้าไม่จำเป็น

---

## ใช้ terminal เมื่อไหร่

ใช้เมื่ออย่างน้อยหนึ่งข้อเป็นจริง:
- command-line ทำงานได้เร็ว/แม่นกว่า เช่น `rg`, `find`, `ls`, `sed`, `git diff`, `wc`
- ต้องค้นหาไฟล์/ข้อความ/จุดอ้างอิงใน repo หรืออ่านไฟล์จำนวนมากแบบมี pattern
- ต้องรันคำสั่งตรวจงาน: build, typecheck, lint, unit test, API smoke test, `curl`, `docker logs`
- ต้องแตะ service จริงบนเครื่อง user: Docker container, `localhost`, DB container, local service
- ต้องอ่าน output ที่ reliable กว่าดูหน้าจอ เช่น test result, API response, stack trace, log
- ต้องรันสคริปต์ที่สร้างไว้และให้มันเขียน output ลงไฟล์

ไม่ใช้ terminal เมื่อ:
- มี context พอและอ่าน/แก้ไฟล์ตรงๆ ง่ายกว่า command-line
- ต้องประเมิน UX/UI จากสิ่งที่ผู้ใช้เห็นจริง → ใช้ [`controlled_operation_skill.md`](./controlled_operation_skill.md)
- ต้องคลิก/กรอก/ยืนยันในแอปจริงที่ไม่มี CLI/API แทน → ใช้ controlled operation

## ลำดับตัดสินใจ

1. งานนี้ command-line เหมาะจริงไหม → ถ้าเหมาะ ใช้ terminal ได้ แม้เป็นแค่ค้นหาไฟล์/ข้อความ
2. คำสั่งรันใน sandbox ได้ไหม → ใช้ terminal/exec ปกติ
3. ต้องแตะ Docker/localhost/DB/service ของเครื่อง user ไหม → ใช้วิธี command-line ที่ runtime รองรับพร้อมขอสิทธิ์ตาม policy
4. ถ้าเข้า service ไม่ได้หรือ command ต้องรันจาก user session เท่านั้น → สร้าง `.command` ให้เขียน output ลงไฟล์ หรือให้ user รันเอง
5. ถ้าต้องเห็น/คลิก UI เพื่อเปิด `.command` หรือดูผลบนจอจริง → ค่อยใช้ controlled operation

---

## ทำไมบางครั้งต้องอ้อม (รันตรงๆ ไม่ได้)

- `sandbox bash` เป็นเครื่อง Linux แยกต่างหาก — ไม่มี Docker, เข้า `localhost` ของ user ไม่ได้
- `localhost` ใน sandbox = ตัว sandbox เอง ไม่ใช่ Mac ของ user
- Terminal บนเครื่อง user ได้สิทธิ์แค่ tier **click** → เห็น + คลิกได้ แต่ **พิมพ์ไม่ได้ / paste ไม่ได้**

→ จะรันคำสั่งบนเครื่อง user จริง ต้องอ้อมผ่านทางที่ runtime รองรับ เช่น escalation, **สคริปต์ `.command` ที่ user ตรวจได้**, ให้ user พิมพ์เอง, หรือ terminal/browser automation ที่ได้รับอนุญาต

---

## วิธีหลัก: สคริปต์ `.command` + ดับเบิลคลิกใน Finder

ขั้นตอนเมื่อเขียนสคริปต์แล้วต้องการรันบนเครื่อง user:

```
1. Write สคริปต์ .command ลงโฟลเดอร์ที่แชร์ (เช่น code)
        └─ ให้สคริปต์ "เขียน output ลงไฟล์" ด้วย เพื่ออ่านผลกลับ
2. chmod +x สคริปต์ ผ่าน bash (ไฟล์ใน shared folder สิทธิ์ติดไปด้วย)
3. ขอ user ก่อน → open_application "Finder" → double_click ไฟล์ .command
        └─ ถ้า browser/แอปอื่นแย่ง focus: open_application "Finder" ใหม่ แล้วลองอีกที
4. wait ครู่นึง → Read ไฟล์ output ที่สคริปต์เขียนไว้
```

### ตัวอย่างสคริปต์

```bash
#!/bin/bash
cd "$(dirname "$0")"          # เข้า folder ที่ไฟล์อยู่
<คำสั่งที่ต้องรัน> > out.txt 2>&1   # ดัมพ์ทั้ง stdout + stderr ลงไฟล์ให้ Claude อ่าน
echo "done" >> out.txt
```

> ทำไมต้องเขียน output ลงไฟล์: Claude เห็นแค่ผลลัพธ์ผ่าน `Read` ไฟล์ — มองหน้าจอ Terminal เพื่ออ่านผลแบบ reliable ไม่ได้

---

## ข้อควรระวัง

- **Gatekeeper**: macOS อาจเตือนครั้งแรกที่เปิด `.command` → ให้ user คลิกขวา → Open ครั้งเดียว (ครั้งต่อไปดับเบิลคลิกได้เลย)
- **ขอ user ก่อนรันทุกครั้ง** — บอกว่าสคริปต์ทำอะไร รันที่ไหน (ดูกฎใน [`permission_skill.md`](./permission_skill.md))
- สคริปต์ต้องอยู่ใน **โฟลเดอร์ที่แชร์** เท่านั้น Claude ถึงจะ Write/อ่าน output ได้
- ทางเลือก: ถ้าไม่อยากรันสคริปต์ ให้ **user พิมพ์/รันคำสั่งเอง** ก็ได้ (Claude เตรียมคำสั่งให้)

---

## เคสที่ต่อยอด

- งานเว็บที่เป็น **API/curl/log/build/test/docker** → ใช้ terminal ได้ตามปกติ
- งานเว็บที่ต้อง **เปิดหน้า/กรอกฟอร์ม/ดู UI จริง** → ใช้ browser automation/tool หรือ controlled operation ตาม [`controlled_operation_skill.md`](./controlled_operation_skill.md)

> หมายเหตุ: ถ้าเป็นการรันคำสั่งของโปรเจคที่ใช้ docker (เช่น `docker logs`) เรื่อง "โปรเจคไหนใช้ docker"
> อยู่ที่ [`docker_skill.md`](./docker_skill.md) (เชื่อมจาก code_skill) — terminal_skill.md ดูแค่ *วิธีรัน* คำสั่งบนเครื่อง user
