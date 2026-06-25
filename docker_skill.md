# Docker Skill — ทะเบียนแอป/บริการเว็บที่รันบน docker

มาจาก [`code_skill.md`](./code_skill.md) / [`terminal_skill.md`](./terminal_skill.md) — ใช้เมื่องานเกี่ยวกับ **service ที่รันบน Docker**
หรือคำสั่งต้องแตะ container/localhost/DB ของชุด Docker

> ไฟล์นี้เป็น template public ให้เติม service จริงของ workspace คุณเอง
> การรันคำสั่ง docker จริงบนเครื่อง user ให้ทำตาม [`terminal_skill.md`](./terminal_skill.md)

---

## ใช้ docker_skill เมื่อไหร่

ใช้เมื่อ:
- ต้องรู้ว่า service/container ชื่ออะไร พอร์ตอะไร workdir ใน container คืออะไร
- ต้องรัน/เช็ก Docker command เช่น `docker ps`, `docker exec`, `docker logs`, `docker compose up`
- ต้องยิง `localhost` ของ service ที่รันใน Docker หรือ query DB container
- ต้องตรวจ backend/frontend ในสภาพแวดล้อมจริงของ Docker
- งานจริงต้องพึ่ง container/service ไม่ว่าจะเป็นค้นหา log, ตรวจไฟล์ใน container, debug endpoint, หรือ verify behavior

ไม่ใช้เมื่อ:
- โปรเจคไม่ได้รันบน Docker หรือเป็น mobile/local script
- แค่แก้โค้ดและตรวจด้วย tool ใน sandbox ได้
- ต้องดู UI/UX บนจอจริง → ใช้ [`controlled_operation_skill.md`](./controlled_operation_skill.md)

ลำดับทำงาน: อ่าน docker_skill เพื่อรู้ service/context → ใช้ terminal_skill เพื่อรันคำสั่งที่เหมาะกับงาน → ใช้ controlled operation เฉพาะเมื่อต้องเห็น/คลิก UI จริง

---

## ศูนย์กลาง docker

ถ้า workspace มี docker กลาง ให้บันทึก path และไฟล์สำคัญที่นี่:

```text
<workspace-root>/docker/
├─ docker-compose.yml
├─ .env.example
└─ scripts/
```

ถ้าแต่ละโปรเจกต์มี docker ของตัวเอง ให้เพิ่ม section ต่อโปรเจกต์แทน

---

## ทะเบียน service

เติมเฉพาะ service ที่มีจริงใน workspace:

| service/container | image/build | port (host:container) | ชนิด | หมายเหตุ |
|---|---|---|---|---|
| `<db_service>` | `<image>` | `<host>:<container>` | DB | เช่น MySQL/Postgres |
| `<backend_service>` | build | `<host>:<container>` | backend/API | framework/runtime |
| `<frontend_service>` | build/image | `<host>:<container>` | frontend | React/Vite/Next/etc. |
| `<worker_service>` | build/image | — | worker | queue/background job |
| `<realtime_service>` | build/image | `<host>:<container>` | realtime | websocket/socket service |

> ห้ามเผยแพร่ค่า secret, production host, private registry token, internal DNS หรือ credential ในไฟล์นี้

---

## วิธีรัน (บนเครื่อง user — sandbox อาจเข้า docker/localhost ไม่ได้)

```bash
cd <workspace-root>/docker
docker compose up -d <service>
docker compose up -d --build <service>
docker logs <container> --tail 80
docker compose ps
```

ถ้าต้องรันบนเครื่อง user จริงและ sandbox เข้าไม่ได้:
- ใช้วิธี command-line ที่ runtime รองรับพร้อมขอสิทธิ์ตาม policy
- ใช้ `.command` script ที่ user ตรวจได้ก่อนรัน
- ให้ user รันคำสั่งเอง
- ใช้เครื่องมือคุมจอตาม [`controlled_operation_skill.md`](./controlled_operation_skill.md) เฉพาะเมื่อต้องเห็น/คลิก UI จริง

เจอ service ใหม่/พอร์ตเปลี่ยน → อัปเดตตารางนี้ตาม [`skill_maintenance_skill.md`](./skill_maintenance_skill.md)
