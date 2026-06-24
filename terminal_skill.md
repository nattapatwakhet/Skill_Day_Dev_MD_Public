# Terminal Skill — รันคำสั่ง/สคริปต์บนเครื่อง user

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [5] — เป็นขั้นเงื่อนไขแยกของตัวเอง
ใช้เมื่อต้อง **รันคำสั่งจริงบนเครื่อง user** (ไม่ใช่ใน sandbox)
เน้นเคส: **เขียนสคริปต์ไว้แล้ว จะรันยังไง**

> หมายเหตุ: การดับเบิลคลิกสคริปต์ต้องเปิด Finder ซึ่งเป็นการคุมจอ —
> ถ้ายังไม่ได้อ่านลำดับการคุมจอ ดู [`controlled_operation_skill.md`](./controlled_operation_skill.md) ประกอบ

---

## ทำไมต้องอ้อม (รันตรงๆ ไม่ได้)

- `sandbox bash` เป็นเครื่อง Linux แยกต่างหาก — ไม่มี Docker, เข้า `localhost` ของ user ไม่ได้
- `localhost` ใน sandbox = ตัว sandbox เอง ไม่ใช่ Mac ของ user
- Terminal บนเครื่อง user ได้สิทธิ์แค่ tier **click** → เห็น + คลิกได้ แต่ **พิมพ์ไม่ได้ / paste ไม่ได้**

→ จะรันคำสั่งบนเครื่อง user จริง ต้องอ้อมผ่านทางที่ runtime รองรับ เช่น **(1) สคริปต์ `.command` ที่ user ตรวจได้** (2) ให้ user พิมพ์เอง (3) terminal/browser automation ที่ได้รับอนุญาต

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

- งาน **เว็บ / เปิด URL / กรอกฟอร์ม** → ไม่ใช่ Terminal ให้ใช้ browser automation/tool ที่ runtime รองรับแทน (ดู `controlled_operation_skill.md`)

> หมายเหตุ: ถ้าเป็นการรันคำสั่งของโปรเจคที่ใช้ docker (เช่น `docker logs`) เรื่อง "โปรเจคไหนใช้ docker"
> อยู่ที่ [`docker_skill.md`](./docker_skill.md) (เชื่อมจาก code_skill) — terminal_skill.md ดูแค่ *วิธีรัน* คำสั่งบนเครื่อง user
