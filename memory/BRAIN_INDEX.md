# BRAIN INDEX — public template

เปิดเฉพาะข้อมูลที่เกี่ยวกับคำขอ ไม่โหลด log/archive ทั้งหมดโดยอัตโนมัติ

| ต้องการ | Source of truth |
|---|---|
| ความชอบที่ผู้ใช้ยืนยัน | `USER_MEMORY.md` |
| กฎตัดสินใจข้ามงาน | `DECISION_MEMORY.md` |
| candidate ที่ยังไม่ยืนยัน | `MEMORY_INBOX.md` |
| คำค้นไปยังความรู้ | `RETRIEVAL_INDEX.md` |
| งานที่กำลังทำ | `PROGRESS*.md` ที่ `scripts/list_active_progress.sh` คืนมา |
| ประวัติงาน | `WORK_LOG.md` |
| ไฟล์โปรเจกต์รอ deploy | `CHANGES.md` |

ห้ามเก็บ password, token, private key, session, ข้อมูลส่วนบุคคลที่ไม่จำเป็น หรือ raw chat dump
