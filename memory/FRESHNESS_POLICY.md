# FRESHNESS POLICY

- ข้อมูลที่เปลี่ยนตามเวลาให้กำหนด `last_verified_at` และ `review_after`
- เมื่อเลยวันทบทวน ให้ตรวจ source ปัจจุบันก่อนใช้ตัดสินใจ
- `superseded` และ `retired` เก็บเพื่อ audit แต่ถอนออกจาก retrieval ปกติ
