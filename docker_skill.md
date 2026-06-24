# Docker Skill — ทะเบียนแอป/บริการเว็บที่รันบน docker

มาจาก [`code_skill.md`](./code_skill.md) / [`react_type_skill.md`](./react_type_skill.md) — ใช้กับ **งานเว็บ** ที่รันบน docker
(ทั้ง frontend, backend, database, worker, realtime service) — ไม่เกี่ยวกับ mobile app ที่รันบนอุปกรณ์/emulator โดยตรง

> ไฟล์นี้เป็น template public ให้เติม service จริงของ workspace คุณเอง
> การรันคำสั่ง docker จริงบนเครื่อง user ให้ทำตาม [`terminal_skill.md`](./terminal_skill.md)

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
- ใช้ `.command` script ที่ user ตรวจได้ก่อนรัน
- ให้ user รันคำสั่งเอง
- หรือใช้เครื่องมือคุมจอตาม [`controlled_operation_skill.md`](./controlled_operation_skill.md)

เจอ service ใหม่/พอร์ตเปลี่ยน → อัปเดตตารางนี้ตาม [`skill_maintenance_skill.md`](./skill_maintenance_skill.md)
