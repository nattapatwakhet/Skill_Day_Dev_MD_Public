# Repository Map Template

ไฟล์ตัวอย่างสำหรับจับคู่ path ใน workspace กับ remote repository โดยไม่ใส่ข้อมูลของผู้สร้างชุด skill

| Local path | Remote URL | Default branch | Notes |
|---|---|---|---|
| `apps/example` | `https://example.com/owner/example.git` | `main` | แทนค่าด้วยข้อมูลของ workspace ผู้ใช้ |

กฎ:

- เก็บเฉพาะข้อมูลที่จำเป็นต่อการ restore workspace
- ห้ามใส่ credential, token หรือ URL ที่ฝัง secret
- ถ้า repository map เป็นข้อมูลภายใน ให้เก็บไฟล์นี้เฉพาะ local และอย่าเผยแพร่

