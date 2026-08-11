# premiere_mcp_video_skill — ตัดต่อวิดีโอใน Adobe Premiere ผ่าน MCP bridge

ใช้เมื่อ: ต้องสร้าง/แก้วิดีโอใน Adobe Premiere Pro แบบสั่งด้วย AI agent (เช่น ทำทัวทอเรียลจากภาพหน้าจอ)
เครื่องมือ: `mcp__premiere-pro__*` (จากปลั๊กอิน Adobe_Premiere_Pro_MCP ของ hetpatel-11)

## ติดตั้งครั้งเดียว (Mac)
```
cd <workspace>/video
git clone https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP.git adobe_premiere_pro_mcp
cd adobe_premiere_pro_mcp && npm run setup:mac
```
แล้ว: รีสตาร์ท AI host + Premiere → Window > Extensions > MCP Bridge (CEP) →
Temp `/tmp/premiere-mcp-bridge` → Save → **Start Bridge** (ต้องเขียว Premiere: Ready)
ตรวจ: `npm run setup:doctor`

## ใช้งาน (ลำดับที่เวิร์ก)
1. `ToolSearch "select:mcp__premiere-pro__ping,..."` โหลด tool ก่อนเรียก (มี ~200 ตัว โหลดเท่าที่ใช้)
2. `ping` เช็คเชื่อมต่อ (ได้ premiereVersion + projectName = ต่ออยู่)
3. `create_sequence` (name,width,height,frameRate) → เก็บ sequenceId
4. `import_media` (filePath ต้องเป็น path บนเครื่องจริง, binName) → เก็บ project item id (เช่น 000f4242)
5. วางไทม์ไลน์: `add_to_timeline_batch` (เร็วสุด, overwrite) — clips:[{projectItemId,trackIndex,time,sourceInPoint,sourceOutPoint}]
   - time/sourceOut = วินาที · trackIndex 0-based (V1=0)
6. จัดขนาด/ตำแหน่ง: `set_clip_properties`(clipId,{scale,position:{x,y},opacity,rotation})
   - scale = % (100=native) · position = pixel (จอ 1920x1080 → กลาง = 960,540)
7. เพิ่มแทร็ก: `add_track`(trackType:"video",position:"above")
8. ดูโครง: `get_full_sequence_info` (authoritative — เชื่ออันนี้ ไม่ใช่ screenshot ที่อาจ stale)
9. เซฟ: `save_project`

## เทคนิคแยกเลเยอร์ (ให้แก้ทีละอย่างได้)
สร้าง PNG พื้นใส (RGBA) ด้วย PIL แล้ววางคนละ track:
V1=พื้นหลัง · V2=ภาพ/มือถือ · V3=ข้อความ · V4=กรอบ/ไฮไลต์ · V5=มือคลิก
- วางภาพมือถือแนวตั้ง 1440x3120 ใน 1920x1080 ให้ชิดขวา: scale≈31.4, pos x≈1604 y540
- แนวนอน 3120x1440: scale≈36.9, pos x≈1275 y540
- overlay ห้ามใช้ canvas โปร่งใสเต็ม sequence เมื่อผู้ใช้ต้องลาก/ปรับใน Premiere: ครอปพอดีองค์ประกอบ
  หรือใช้ canvas มาตรฐานเฉพาะแทร็ก แล้ววางด้วย Motion Position, Scale 100%
- แยก V3 ข้อความ, V4 กรอบ และ V5 มือ/GIF เป็นคนละ source/track; ไม่ฝังวงคลิกหรือมือรวมในกรอบ

## Gotchas (สำคัญ — เคยพลาด)
- **export_frame ไม่ seek** ตาม param time → ต้อง `set_playhead_position(time)` ก่อน แล้ว export_frame
- export_frame เติม `.png` เอง (outputPath ไม่ต้องมี .png)
- ตรวจงานด้วยการ export_frame + อ่านรูป (host path) — อย่าเชื่อ screenshot ผู้ใช้ที่อาจ stale
- แซนด์บ็อกซ์ mount: เขียน/ก๊อปได้ แต่บางที่ **ลบไม่ได้** (Operation not permitted)
- ตัวอย่างงานที่มักกำหนด: ข้อความ **native (ไม่ใช่รูป)**, ไม่เอาลูกศรเส้น, ทำในตัว Premiere (ไม่ใช่ render MP4 แยก)

## ข้อความจริง (native text) — ข้อจำกัด
- `add_text_overlay` ต้องมีไฟล์ .mogrt (ถ้าไม่มีในเครื่อง ใช้ไม่ได้)
- `create_caption_track` (จาก .srt ที่ import) = ข้อความจริง/แก้ได้ แต่ default อยู่ล่างกลาง
- จัดข้อความ native ตำแหน่งอิสระ + สไตล์ → ต้องใช้ Type tool ใน Premiere (คุมจอ) หรือ MOGRT ที่ออกแบบไว้
- `execute_extendscript` ทำได้ทุกอย่างแต่ schema ว่าง (generic) เสี่ยง — ใช้เมื่อจำเป็นและทดสอบ
- การเลือก caption หลายชิ้นแล้วตั้ง Font Size/Zone อาจเปลี่ยนไม่ครบ แม้ Properties แสดงค่าใหม่;
  ต้องเลือกทีละชิ้น ตั้งค่า อ่าน numeric value กลับ และตรวจ Program Monitor ครบทุกฉาก
- บนจอ Retina ภาพจาก `screencapture` อาจเป็น physical pixel 2× แต่เครื่องมือคลิกใช้ logical point;
  วัด scale ก่อน batch และตรวจหัว Properties ว่า target ยังเป็น `C1:Subtitle n of N` ก่อนพิมพ์ค่า
- บันทึกผ่าน File > Save แล้วตรวจว่า `*` หลังชื่อโปรเจกต์หายก่อนถือว่าสำเร็จ

> ภาพรวม/ที่มาของกฎเหล่านี้ + การตัดสินใจ native text vs caption ดู [`video_skill.md`](./video_skill.md)
