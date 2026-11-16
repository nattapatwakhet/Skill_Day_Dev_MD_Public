# Continuous Improvement Skill — autonomous measured loop

ใช้กับงานที่ผู้ใช้ตกลง Standing Authorization แล้ว เช่น OCR/model tuning, benchmark, batch quality improvement หรือ
งานปรับระบบซ้ำที่มี metric ชัด ไม่เปิดโหมดนี้จากคำว่า “แก้” หรือ “เพิ่ม” เพียงอย่างเดียว

## วงจร

1. อ่าน active progress และ reproduce baseline
2. เลือก failure cluster ที่มีหลักฐาน
3. เปลี่ยนตัวแปรให้น้อยพออธิบายผล
4. รัน test/regression/benchmark ทั้งชุดที่ตกลง
5. รับเฉพาะ candidate ที่ดีขึ้นและไม่ regress; บันทึก candidate ที่แพ้โดยไม่ promote
6. อัปเดต progress พร้อม next executable step แล้วทำรอบถัดไป

หยุดเมื่อผู้ใช้สั่งพัก, บริบทใกล้เต็ม, ขาด artifact/label/สิทธิ์จากผู้ใช้, หลาย hypothesis ที่มีเหตุผลไม่ชนะ baseline
(performance plateau), หรือจำเป็นต้องทำ destructive/production/external action ที่ standing authorization ไม่ครอบคลุม
ก่อนหยุดต้องจด baseline, hypothesis, command/result, ไฟล์ที่แก้, accept/reject และ resume point
