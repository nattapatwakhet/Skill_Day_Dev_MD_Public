# Webapp Testing — เทส web app ด้วย Playwright

มาจาก [`code_skill.md`](./code_skill.md) / [`react_type_skill.md`](./react_type_skill.md) / [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [8]
ใช้เมื่อต้อง **ทดสอบ/ดีบัก/ตรวจหน้าเว็บจริง** — เช็คว่า frontend ทำงาน, จับ screenshot, ดู log
(ปรับหลักการมาจากแนวคิด webapp-testing)

> **ขอบเขต: เว็บเท่านั้น** (Playwright รันบนเบราว์เซอร์) → ใช้กับ React หรือเว็บภาษาไหนก็ได้ที่ render เป็น HTML
> **ภาษาอื่นใช้ test framework ของตัวเอง** — Flutter → `flutter test` / widget test (ดู `flutter_skill.md`),
> backend → unit test ของภาษานั้น
> *หลักการเทส* (เขียนเทสที่ reproduce แล้วทำให้ผ่าน) ที่ใช้ได้ทุกภาษาอยู่ใน [`karpathy_skill.md`](./karpathy_skill.md) + [`debug_skill.md`](./debug_skill.md)

> เขียนสคริปต์ Playwright (Python) ตรงๆ รัน headless chromium

---

## เลือกวิธี (decision tree)

```
งาน → เป็น static HTML ไหม?
   ├─ ใช่ → อ่านไฟล์ HTML หา selector ตรงๆ → เขียน Playwright ใช้ selector นั้น
   │        (ถ้าไม่ครบ → ทำแบบ dynamic ด้านล่าง)
   └─ ไม่ (dynamic) → server รันอยู่หรือยัง?
        ├─ ยัง → จัดการ server lifecycle เอง (รัน dev server ก่อน) แล้วเขียนสคริปต์
        └─ รันแล้ว → reconnaissance-then-action:
             1. navigate + wait networkidle
             2. screenshot หรือ inspect DOM
             3. หา selector จากสถานะที่ render จริง
             4. ทำ action ด้วย selector ที่เจอ
```

## โครงสคริปต์

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)   # headless เสมอ
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')       # สำคัญ: รอ JS ทำงานก่อน
    # ... action + assert ...
    page.screenshot(path='out.png')
    browser.close()
```

## ข้อควรระวัง (สำคัญสำหรับ sandbox)

- **sandbox เข้า localhost ของ user ไม่ได้** — ถ้าจะเทส dev server ที่รันบนเครื่อง user ต้องอ้อม:
  รันสคริปต์ผ่านวิธีใน [`terminal_skill.md`](./terminal_skill.md) (`.command` + ดับเบิลคลิก) แล้วให้สคริปต์เขียนผล/เซฟ screenshot ลงไฟล์ในโฟลเดอร์ที่แชร์ แล้ว `Read` กลับ
- ถ้าจะคุมเบราว์เซอร์จริงบนเครื่อง user แทน Playwright → ใช้ browser automation/tool ที่ runtime รองรับ (ดู [`controlled_operation_skill.md`](./controlled_operation_skill.md))
- ติดตั้ง playwright ใน sandbox: `pip install playwright --break-system-packages && playwright install chromium` (ใช้ได้เฉพาะกับเป้าที่ sandbox เข้าถึงได้)

## ใช้ตอนไหนใน flow

- **ตรวจงาน [8]** หลังแก้ React/หน้าเว็บ → รัน Playwright ยืนยันว่า flow ที่แก้ทำงานจริง + จับ screenshot
- คู่กับ checklist ใน [`react_type_skill.md`](./react_type_skill.md) (`tsc --noEmit` / `npm run build`) — อันนั้นเช็ค compile อันนี้เช็คพฤติกรรมจริงบนหน้าจอ
