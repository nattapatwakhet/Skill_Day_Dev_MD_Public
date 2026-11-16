# brain_3d — เว็บกราฟความสัมพันธ์ของ skill pack

อ่าน Markdown ใต้ skill root แล้วสร้าง node/link จากลิงก์จริง เปิดผ่าน Docker ที่ `http://localhost:3004`

```bash
docker compose up -d skill_brain_3d
docker compose ps skill_brain_3d
```

รันโดยไม่ใช้ Docker:

```bash
cd brain_3d
npm install
npm run dev -- --host 0.0.0.0 --port 3004
```

ข้อมูลกราฟสร้างใหม่ตอน start จาก `SKILL_ROOT`; ไฟล์ usage log เป็น optional และไม่มีข้อมูลส่วนตัวติดมากับ repository
