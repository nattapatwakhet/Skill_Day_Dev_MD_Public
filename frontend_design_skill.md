# Frontend Design — ดีไซน์ UI ให้มีเอกลักษณ์ ไม่หน้าตา template

มาจาก [`code_skill.md`](./code_skill.md) — **หลักออกแบบ UI ทั่วไป ใช้ได้ทุกแพลตฟอร์ม**
ทั้ง React web และ Flutter app ใช้เมื่อต้อง **ออกแบบ/ปรับหน้าตา UI ใหม่**
(ปรับหลักการมาจากแนวคิด frontend-design) เน้นเลือกอย่างตั้งใจ ไม่ใช่ default ที่ AI ชอบออก

> หลักออกแบบ (subject, typography, hierarchy, motion, restraint, copy) **ใช้ได้ทุกแพลตฟอร์ม**
> ส่วนที่เป็น **CSS เฉพาะ web** (selector specificity) ใช้กับ React เท่านั้น — Flutter เทียบเป็น widget tree/theme แทน
>
> ใช้คู่กับกฎเฉพาะภาษา: React → [`react_type_skill.md`](./react_type_skill.md) (component/theme/MUI) ·
> Flutter → [`flutter_skill.md`](./flutter_skill.md) (widget layout/component)

---

## ยึดกับ subject ก่อน

ถ้า brief ไม่ชัดว่าทำให้อะไร → ปักเอง: ระบุ subject 1 อย่าง, ผู้ใช้คือใคร, หน้านี้มีงานเดียวคืออะไร แล้วบอกออกมา
เอกลักษณ์มาจากโลกของ subject เอง (วัสดุ เครื่องมือ ศัพท์เฉพาะ) ใช้เนื้อหาจริงตั้งแต่ต้น

## หลักออกแบบ

- **Hero = thesis** เปิดด้วยสิ่งที่เป็นตัวแทนที่สุดของ subject (headline/ภาพ/demo/โมเมนต์ interactive) อย่าใช้สูตรสำเร็จ "เลขใหญ่ + label เล็ก + gradient" ถ้าไม่ใช่คำตอบที่ดีจริง
- **Typography คือบุคลิก** จับคู่ display + body อย่างตั้งใจ ตั้ง type scale ชัด (น้ำหนัก/ความกว้าง/ระยะ) ทำให้ตัวอักษรเป็นส่วนที่จำได้ ไม่ใช่แค่ตัวส่งสาร
- **โครงสร้างคือข้อมูล** เลข/eyebrow/เส้นคั่น/label ต้องเข้ารหัสความจริงของเนื้อหา ไม่ใช่ตกแต่ง — เลข 01/02/03 ใช้ต่อเมื่อมัน*เป็นลำดับจริง*
- **Motion อย่างตั้งใจ** เลือกว่า animation รับใช้ subject ตรงไหน (page-load, scroll reveal, hover) โมเมนต์เดียวที่จัดมาดีกว่า effect กระจาย — มากไปทำให้ดู AI-generated
- **ความซับซ้อนให้เข้ากับวิชั่น** maximalist ต้อง execute ละเอียด, minimal ต้อง precise เรื่อง spacing/type/รายละเอียด

## เลี่ยง default ที่ AI ชอบออก

ตอนนี้ดีไซน์ AI ชอบตกที่ 3 แบบ (อย่าใช้ถ้า brief ไม่ได้สั่ง):
1. พื้นครีม (~#F4F1EA) + serif คอนทราสต์สูง + accent terracotta
2. พื้นเกือบดำ + accent acid-green/vermilion สีเดียว
3. เลย์เอาต์หนังสือพิมพ์ เส้น hairline, border-radius 0, คอลัมน์แน่น

brief สั่งแนวไหน = ทำตามเป๊ะ แต่แกนที่ปล่อยอิสระ อย่าใช้ default พวกนี้

## กระบวนการ: brainstorm → plan → critique → build → critique

ทำ 2 รอบ:
1. ร่าง design plan สั้นๆ เป็น token system: **Color** (4–6 hex มีชื่อ), **Type** (display ใช้แบบมีวินัย + body + utility), **Layout** (concept + ASCII wireframe), **Signature** (1 อย่างที่หน้านี้จะถูกจำ)
2. รีวิว plan เทียบ brief — ส่วนไหนเหมือน default ที่จะออกให้หน้าอื่นๆ ได้เหมือนกัน → แก้ บอกว่าเปลี่ยนอะไรทำไม แล้วค่อยลงโค้ดตาม plan ที่แก้แล้ว

> เวลาเขียน CSS ระวัง selector specificity ตีกัน (เช่น `.section` กับ `.cta` ใส่ padding/margin ทับกัน)

## ความยับยั้ง + critique ตัวเอง

- ใช้ความกล้าที่เดียว — ให้ signature element เป็นของจำได้ชิ้นเดียว รอบๆ เงียบและมีวินัย ตัดของตกแต่งที่ไม่รับใช้ brief
- quality floor โดยไม่ป่าวประกาศ: responsive ลงมือถือ, keyboard focus เห็นชัด, เคารพ reduced motion
- critique ระหว่างทำ ถ่าย screenshot ถ้าทำได้ (ดู [`webapp_testing_skill.md`](./webapp_testing_skill.md))
- กฎ Chanel: ก่อนออกจากบ้าน ส่องกระจกแล้วถอดเครื่องประดับออก 1 ชิ้น

## เรื่อง copy ในดีไซน์

- เขียนจากฝั่งผู้ใช้ เรียกสิ่งของตามที่ผู้ใช้ควบคุม ไม่ใช่ตามที่ระบบสร้าง ("จัดการการแจ้งเตือน" ไม่ใช่ "ตั้งค่า webhook")
- active voice: ปุ่มบอกสิ่งที่จะเกิด "บันทึก" ไม่ใช่ "ส่ง" และชื่อ action เดิมตลอด flow ("เผยแพร่" → toast "เผยแพร่แล้ว")
- error/empty state ให้ทิศทาง ไม่ใช่อารมณ์: บอกว่าพังอะไร แก้ยังไง
- sentence case, ไม่มี filler, แต่ละ element ทำงานเดียว
