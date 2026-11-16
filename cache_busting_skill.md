# Cache Busting Skill — กันเบราว์เซอร์แคชของเก่าหลัง build/deploy (React + Vite)

มาจาก [`react_skill.md`](./react_skill.md) / [`deploy_skill.md`](./deploy_skill.md) — ใช้เมื่อ
**อัป build ใหม่ขึ้น server แล้ว user ยังเห็นของเก่า** (ต้อง hard refresh ถึงจะเห็นเวอร์ชันใหม่)

> ⚠️ ไฟล์นี้ **เขียนใหม่ (reconstructed) 2026-08-13** จากแชต "Browser cache after npm build"
> ที่แพ็กสกิลไว้แต่ยังไม่ได้เซฟลงดิสก์ + อิงจาก stack จริงของ workspace (React/Vite + MAMP/Apache)
> — โปรด review/แก้ให้ตรงกับที่คุยในแชตนั้นถ้ามีจุดต่าง

stack ที่อ้างอิง: React + Vite + TypeScript → `npm run build` เป็น static
(`dist/`) แล้ววางใต้ Apache (MAMP htdocs)

---

## ทำไมยังเห็นของเก่า

- Vite **hash ชื่อไฟล์ asset ให้อยู่แล้ว** (`assets/index-<hash>.js`, `index-<hash>.css`) → asset ที่ bundle
  **ไม่ใช่ตัวปัญหา** เพราะทุก build ที่เนื้อหาเปลี่ยน ชื่อไฟล์เปลี่ยนตาม
- ตัวปัญหาจริงคือ **`index.html`** — เบราว์เซอร์/พร็อกซีแคช HTML ตัว shell ไว้ พอ deploy ใหม่ HTML เก่า
  ยังชี้ไป hash เก่า → โหลด bundle เก่า (หรือ 404 ถ้าไฟล์เก่าถูกลบไปแล้ว)
- ไฟล์ใน `public/` ที่ **ไม่ถูก hash** (เช่น PDF คู่มือใน `public/document/`, favicon, โลโก้, `version.json`)
  อ้างผ่าน `import.meta.env.BASE_URL` → แคชค้างจนกว่าจะเปลี่ยนชื่อ/เติม query

## กฎหลัก (แยก cache เป็น 2 ชั้น)

1. **`index.html` = ห้ามแคชค้าง (ต้อง revalidate ทุกครั้ง)**
   - `Cache-Control: no-cache, must-revalidate` ให้เบราว์เซอร์ถาม server ทุกครั้งว่ามี HTML ใหม่ไหม
   - HTML เล็ก cost ต่ำ แต่ทำให้ได้ reference ไป hash asset ล่าสุดเสมอ
2. **`assets/*` (ไฟล์ที่ Vite hash แล้ว) = แคชยาว immutable**
   - `Cache-Control: public, max-age=31536000, immutable` — ชื่อมี hash อยู่แล้ว เปลี่ยน build = เปลี่ยนชื่อ
     จึงปลอดภัยที่จะแคชยาว และช่วยให้โหลดเร็ว

## Apache (.htaccess) — MAMP/htdocs deploy

วางไว้ใน docroot ที่เสิร์ฟ build (`dist/`):

```apache
# ต้องเปิด mod_headers (MAMP เปิด default)
# index.html: ให้ revalidate เสมอ
<Files "index.html">
  Header set Cache-Control "no-cache, must-revalidate"
</Files>

# hashed bundle assets เท่านั้น: แคชยาว
# ต้องวาง rule นี้ในขอบเขต dist/assets/ หรือเพิ่มเงื่อนไขชื่อ hash ตาม output จริงของ build
<FilesMatch "\.(js|css|woff2?)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

> ตัวอย่างข้างบนปลอดภัยต่อเมื่อ scope อยู่ใน hashed asset directory จริง ตรวจ `dist/` หลัง build และ response header
> ก่อนใช้เสมอ ไฟล์นามสกุลเดียวกันไม่ได้แปลว่ามี content hash; ห้ามตั้ง immutable แบบเหมารวมทั้ง docroot

## ไฟล์ public/ ที่ไม่ถูก hash

- ไฟล์ที่อ้างผ่าน `BASE_URL` (เช่น คู่มือ PDF ใน `public/document/`, favicon) **ไม่มี hash** → แคชค้างได้
- ทางแก้: (ก) เติม query version ตอนอ้าง เช่น `?v=<build>` · (ข) เปลี่ยนชื่อไฟล์เมื่อเนื้อหาเปลี่ยน ·
  (ค) อย่าตั้ง immutable กับ path นั้น ให้ปล่อยเป็น cache สั้น/revalidate

## ตัวเลือกเสริม: แจ้ง "มีเวอร์ชันใหม่" (optional)

ถ้าอยากให้ผู้ใช้ที่เปิดหน้าค้างไว้รู้ว่ามี build ใหม่ (ไม่ต้องบอกให้ hard refresh เอง):

- ตอน build เขียน `public/version.json` = `{ "version": "<git-hash | timestamp>" }` (ตั้ง no-cache)
- แอปเช็ค/เทียบ version ตอน focus หรือ interval ถ้าต่างจากที่โหลดมา → โชว์ toast "มีเวอร์ชันใหม่ กดรีเฟรช"
- **อย่า reload เงียบๆ** ระหว่างที่ user กรอกฟอร์มค้างอยู่ — ให้ผู้ใช้กดเอง

## เช็ก/ยืนยันหลัง deploy

- DevTools → Network → `index.html` ต้องตอบ `Cache-Control: no-cache...` และ asset ตอบ `max-age=...immutable`
- **โหลดแบบปกติ (ไม่ hard refresh)** แล้วต้องเห็นของใหม่ — ถ้ายังเก่า = `index.html` ยังโดนแคชอยู่
- อย่าใช้ "hard refresh แล้วหาย" เป็นข้อสรุปว่าแก้แล้ว ต้องผ่าน normal reload ถึงจะจบจริง

## อย่าทำ

- อย่าเติม query/hash มือใน `<script src>` / `import` เอง — Vite จัดการ hash bundle ให้แล้ว ทำมือจะชนกับ Vite
- อย่าตั้ง `no-store` กับ asset ที่ hash แล้ว — เสียประโยชน์ cache โดยไม่จำเป็น
- อย่าปิดแคชทั้งเว็บเพื่อแก้ปัญหานี้ — แก้เฉพาะ `index.html` (+ public ที่ไม่ hash) พอ

---

ปิดงานที่แตะไฟล์ build/config/.htaccess → จดใน [`deploy_skill.md`](./deploy_skill.md) (`memory/CHANGES.md`) ด้วย
