# Work Mode Skill — portable trigger “โหลดทำงาน”

ใช้เมื่อผู้ใช้สั่ง “โหลดทำงาน”, “เปิดโหมดทำงาน” หรือความหมายเดียวกัน คำสั่งนี้เป็น execution approval สำหรับ
ขั้นตอนในไฟล์นี้ ไม่ต้องถามยืนยันย่อย แต่ยังต้องหยุดก่อนติดตั้ง/ลบ/แทนที่แอปหรือ external/destructive action

## ลำดับ

1. หา root ของ skill pack จากตำแหน่งไฟล์นี้ ห้ามฝัง absolute path ของผู้สร้าง
2. เปิด Docker Desktop ด้วยวิธีของระบบปฏิบัติการ แล้วรอ `docker info` พร้อมภายใน deadline
3. ตรวจ `docker-compose.yml` ด้วย `docker compose config`
   - ถ้ามี `skill_brain_3d` และ `3004:3004` แล้ว ห้ามเพิ่มซ้ำ
   - ถ้าขาด ให้เพิ่ม service ตาม compose ที่แจกมากับชุดนี้; ถ้า port 3004 ถูกใช้ ให้รายงาน conflict ไม่แย่งพอร์ต
4. รัน `docker compose up -d skill_brain_3d` แล้วรอ healthcheck หรือ `curl --fail http://localhost:3004`
5. ถ้าไม่พร้อม อ่าน log และ recreate เฉพาะ service นี้หนึ่งรอบ; ถ้ายังไม่ผ่านให้รายงาน blocker
6. เปิด `http://localhost:3004` ด้วย browser ที่ผู้ใช้ตั้งเป็นค่าเริ่มต้น
7. เปิดเครื่องมือทั่วไปหรือเพลงเฉพาะที่ผู้ใช้ตั้งค่าไว้เอง; public pack ไม่กำหนด playlist/app ส่วนตัว
8. ถามว่าจะทำงานอะไร แล้วเปิดสกิล/เครื่องมือเฉพาะโดเมนหลังผู้ใช้ตอบ

## ขอบเขต

- ห้าม restart Docker ทั้งระบบหรือ service อื่นเพื่อแก้เว็บสมอง
- ห้ามติดตั้งหรืออัปเดต Docker อัตโนมัติ
- ถ้า runtime แตะ Docker/GUI ไม่ได้ ให้บอกคำสั่งที่ผู้ใช้รันเองแทน ห้ามสร้างทางเลี่ยง permission
