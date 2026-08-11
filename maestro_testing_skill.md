# Maestro Testing Skill — ทดสอบแอปแบบ End-to-End

มาจาก [`work_flow_skill.md`](./work_flow_skill.md) ขั้น [8] และใช้คู่กับ
[`flutter_skill.md`](./flutter_skill.md) / skill ของ mobile framework ที่เกี่ยว

ใช้เมื่อ user สั่ง **"test app"**, **"ทดสอบ app"**, **"ทดสอบแอป"**, ขอทดสอบเส้นทางผู้ใช้จริงบน
Android/iOS หรือระบุ Maestro โดยตรง

> Maestro เป็น black-box UI automation ผ่าน accessibility hierarchy: เหมาะกับ E2E/user journey
> และ system dialog แต่ไม่แทน unit/widget/integration test ภายในโค้ด

---

## เลือกเครื่องมือให้ตรงเป้า

- Android/iOS (native, Flutter, React Native, hybrid) → ใช้ Maestro สำหรับ E2E บน Android emulator/physical device
  หรือ iOS Simulator ตาม target ที่รองรับ
- Flutter → รัน `dart analyze` + `flutter test` ก่อน แล้วใช้ Maestro พิสูจน์ smoke/critical journey
- Web app → ใช้ [`webapp_testing_skill.md`](./webapp_testing_skill.md) (Playwright) เป็นค่าเริ่มต้น;
  ใช้ Maestro Web เฉพาะเมื่อ user ระบุหรือมีเหตุผลต้องใช้ suite ข้ามแพลตฟอร์ม
- Flutter Desktop → Maestro ยังไม่รองรับ; ใช้ test ของ framework หรือเครื่องมือ GUI ที่เหมาะแทน
- ถ้า user ขอ unit/widget test โดยเฉพาะ → ไม่ต้องเรียก Maestro

## ก่อนรันทุกครั้ง

1. ระบุโปรเจค, platform, app ID/package name, environment และ user journey ที่ต้องพิสูจน์
2. ตรวจทั้ง `.maestro/` และ `maestro/` รวมถึง workspace ที่ user เปิดใน Maestro Studio ก่อนสร้าง flow ใหม่
   แล้วใช้โฟลเดอร์เดิมของโปรเจค; ห้ามสร้าง suite ซ้ำเพียงเพราะชื่อไม่ใช่ `.maestro/`
3. หา app ID จาก config จริง ไม่เดาจากชื่อแอป: iOS ดู `PRODUCT_BUNDLE_IDENTIFIER`, Android ดู
   `applicationId`; ถ้า flow ใช้ข้าม platform ให้ยืนยันว่า ID ตรงกันหรือแยก flow/env ตาม platform
4. ตรวจ `maestro --version`, Java 17+, Android `adb` หรือ iOS Simulator และ device ที่ online
5. ตรวจว่า build ที่ต้องทดสอบติดตั้งบน target แล้ว; Maestro ไม่ build/install แอปให้โดยอัตโนมัติ
6. ถ้าไม่มี Maestro CLI/MCP ให้บอก blocker และขออนุญาตก่อนติดตั้งหรือแก้ MCP config
7. ใช้ test account + test environment; ห้ามใช้ production data, payment จริง หรือ action ทำลายข้อมูล

## ลำดับเมื่อ user สั่ง “test app”

1. อ่าน requirement/โค้ดที่เปลี่ยนและหา critical path
2. รัน static/unit/widget checks ของ framework ก่อน
3. build และติดตั้งแอปบน target ที่เหมาะ
4. ถ้ามี Maestro flows → รัน smoke ก่อน แล้วรัน flow ที่ตรง feature
5. ถ้ายังไม่มี flow และคำสั่งครอบคลุม E2E → สร้าง flow ขั้นต่ำในโฟลเดอร์ Maestro เดิมของโปรเจค
6. รันด้วย Maestro MCP ถ้ามีและต้อง inspect hierarchy แบบ interactive; ไม่เช่นนั้นใช้ CLI
7. ถ้าล้มเหลว ให้อ่าน failure screenshot, command metadata และ log แล้วแยกให้ชัดว่าเป็น app bug,
   selector/test bug, environment/backend หรือ device state
8. แก้ test/app เฉพาะเมื่ออยู่ในขอบเขตคำสั่ง แล้ว rerun จนได้ผลชี้ขาด
9. รายงาน platform/device, flow ที่รัน, pass/fail, จุดที่ล้ม และ artifact path

## ตำแหน่งและโครงสร้างที่แนะนำ

- ใช้ `.maestro/` เป็นค่าเริ่มต้นสำหรับโปรเจคใหม่ แต่ถ้า repo/user ใช้ `maestro/` อยู่แล้วให้ใช้ต่อ
- ถ้า Maestro Studio เปิด app root เป็น workspace ไฟล์ใต้ `maestro/` ใช้งานได้; CLI ต้องชี้ path จริงนั้น
- ถ้าพบทั้ง `.maestro/` และ `maestro/` ให้ตรวจ config/ไฟล์เดิมและถามเมื่อแยกไม่ได้ว่าอันใดเป็น authority

```text
<maestro-workspace>/
├── config.yaml
├── smoke/
├── journeys/
└── subflows/
```

- Flow เดี่ยวเริ่มด้วย `appId`, optional `name`/`tags`, `---` แล้วตามด้วย commands
- ใช้ `config.yaml` เมื่อ suite โต: กำหนด flow discovery, env, tags, execution order และ output directory
- ให้แต่ละ flow รันได้จาก state ที่คาดเดาได้; ใช้ `clearState: true` เฉพาะกรณีที่ test ต้องเริ่มใหม่จริง
- launch smoke ที่ต้องรักษา login/session ใช้ `clearState: false`; แยก login/onboarding clean-state เป็นอีก flow
- แยก login/onboarding/permission เป็น subflow และใช้ conditional `runFlow` กับ popup ที่อาจมีหรือไม่มี
- tag อย่างน้อย `smoke`, `regression`, `wip` ตามหน้าที่ แล้วรัน subset ที่เล็กที่สุดก่อน
- launch smoke ควร `stopApp` → `launchApp` → รอ/ยืนยัน accessibility text หรือ id ที่เห็นจริง → screenshot
- ใช้ splash text เป็น assertion ได้เมื่อเป้าหมายคือพิสูจน์ cold launch และ splash อยู่พอให้ตรวจ; journey test
  ให้ยืนยันปลายทางที่เสถียร เช่น Login/Home เพิ่มด้วย

ตัวอย่าง smoke flow:

```yaml
appId: com.example.app
name: App launch smoke
tags:
  - smoke
---
- launchApp
- assertVisible: "Home"
```

## Selector และ Flutter Semantics

- เริ่มจาก visible text เพื่อพิสูจน์สิ่งที่ user เห็น
- ใช้ stable accessibility `id` สำหรับ icon, localized text และ element ที่ชื่อเปลี่ยนได้
- Flutter: ใช้ `Semantics(label:)`, `Semantics(identifier:)` (Flutter 3.19+) หรือ `semanticLabel`;
  Flutter `Key` มองไม่เห็นจาก accessibility layer จึงใช้เป็น Maestro selector ไม่ได้
- ใช้ relational selector เมื่อไม่มี id ที่เสถียร; หลีกเลี่ยง coordinate/index ถ้าแก้ accessibility ได้
- ตรวจ state เช่น `enabled: true` ก่อน action ที่รอ API/form validation
- อย่าครอบ flow ก้อนใหญ่ด้วย `retry`; retry เฉพาะ interaction ที่ผันผวนจริง ไม่ใช้ซ่อน flaky app

## คำสั่งมาตรฐาน

```bash
maestro test maestro/smoke
maestro test maestro --include-tags=smoke
maestro test maestro --exclude-tags=wip
maestro test --format html-detailed --output build/maestro-report.html \
  --test-output-dir=build/maestro-results maestro
```

- ตัวอย่างใช้ `maestro/`; เปลี่ยนเป็น `.maestro/` หรือ path workspace จริงของโปรเจค
- ถ้ามีหลาย device ให้ระบุ platform/device ชัดเจน อย่าปล่อยให้เลือก target ผิด
- CI ใช้ JUnit report; local handoff ใช้ HTML detailed + failure artifacts
- เก็บ secret ผ่าน environment/secret store ไม่ hardcode ใน YAML หรือ `config.yaml`
- ใช้ YAML parser ตรวจ syntax ก่อนรันได้ แต่ผลนี้ไม่ยืนยันว่า command/selector ถูก Maestro รองรับ;
  ต้องรัน Studio/CLI จริงจึงนับเป็น E2E pass

## Definition of Done สำหรับ app test

- framework checks ผ่าน หรือบอก failure ที่มีหลักฐานครบ
- Maestro flow ที่ตรง feature รันบน target จริงอย่างน้อยหนึ่งครั้ง
- ยืนยัน expected result ด้วย assertion ไม่ใช่แค่ tap จบ
- failure มี screenshot/log/artifact และจัดประเภทสาเหตุแล้ว
- รายงานสิ่งที่ยังไม่ได้ทดสอบ เช่นอีก platform, real device, offline/permission edge case

## เอกสารทางการที่ใช้อ้างอิง

- [Maestro overview](https://maestro.dev/)
- [Maestro CLI installation](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli)
- [Flutter support](https://docs.maestro.dev/platform-support/flutter)
- [Selectors](https://docs.maestro.dev/api-reference/selectors)
- [Workspace configuration](https://docs.maestro.dev/maestro-flows/workspace-management/project-configuration)
- [Reports and artifacts](https://docs.maestro.dev/troubleshooting/debug-output)
- [Maestro MCP](https://docs.maestro.dev/getting-started/maestro-mcp)
