# Flutter Skill

ใช้ skill นี้เมื่อแก้โค้ด Dart/Flutter โดยเฉพาะไฟล์ service, controller, database, และ widget layout

> **อ่าน [code_skill.md](./code_skill.md) ก่อนเสมอ** — มี naming convention (folder/file/identifier),
> scope rules, after-rename steps, type annotation หลักรวม, import หลักรวม
>
> **โครงสร้าง Flutter app (`lib/...`) + layer boundaries** ย้ายไปอยู่ที่
> [`project_structure_skill.md`](./project_structure_skill.md) → "โครงสร้าง Flutter app" — ดูที่นั่นว่าวางไฟล์ folder ไหน
>
> ไฟล์นี้เก็บเฉพาะ **กฎ/ syntax เฉพาะ Dart + Flutter + GetX**
>
> ที่เกี่ยวข้อง (ของกลางทุกภาษา): **ออกแบบ UI** → [`frontend_design_skill.md`](./frontend_design_skill.md) (หลักดีไซน์สากล ใช้กับ widget ได้) ·
> **เทส** → ใช้ `flutter test` / widget test (ดู Required Checks ท้ายไฟล์) ไม่ใช่ `webapp_testing` (อันนั้นเว็บ)

---

## Dart Type Annotation Rules

```dart
// ✓ Correct
final int count = items.length;
final bool isdesktop = constraints.maxWidth >= 1024;
final String firstpath = '/home';
Widget buildCard(BuildContext context) { ... }
AppTheme createAppTheme(ThemeModeType thememode) { ... }

// ✗ Wrong
final count = items.length;
```

ทุก `Future` ต้องมี generic type:

```dart
// ✓ Correct
Future<void> loadData() async { ... }
Future<UserModel?> fetchUser(String id) async { ... }

// ✗ Wrong
Future loadData() async { ... }
```

---

## Variable Rules

- ห้ามใช้ `var`
- ไม่ reassign → `final Type name`
- reassign → `Type name`
- `const` เฉพาะ compile-time constants
- ห้ามเขียน `final name = ...` โดยไม่มี type
- `late` เฉพาะ field ที่จะ assign ก่อนใช้งานแน่นอน

---

## Future, Return, และ Try/Catch

- Wrap `Future<void>` และ `void` ด้วย `try { ... } catch (error) { ... }`
- `Future<T>` ต้อง return valid value ทุก path
- return type เป็น nullable และ error เกิด → return `null`
- ห้ามสร้าง fake error model (`model3error`) ใช้ `null` แทน
- เพิ่ม `return;` ท้าย `Future<void>`/`void` เมื่อไม่มีงานเหลือ

---

## Service and Controller Responsibility

- Services → เรียก API, return results
- Controllers → manage screen flow, dialogs, local cache, shared preferences
- ห้าม show Flutter dialog จาก service class
- ห้าม read/write SQLite จาก views
- ห้ามเขียน API URL strings ตรงๆ ใน controller/view → ใช้ `RouteServiceConstant`
- ใช้ shared preference keys จาก `SharedPreferencesDatabase`
- ถ้า MainService handle empty/null แล้ว controller ไม่ต้อง check ซ้ำ
- Controller ควร check แค่ `null`, `error1`, และ concrete result types ที่ต้องการ
- ถ้า service return `dynamic` controller ต้อง handle ทุก type:
  `StatusAndMessageModel`, `LoginModel`, `Map<String, dynamic>`, `List`, raw JWT `String`

---

## MainService Rules

- Handle empty response: `null`, `[]`, `{}`, empty string, `'null'`
- Response เป็น `List` → parse เป็น model list
- Response เป็น `Map` → parse เป็น model
- Response เป็น raw value (เช่น JWT string) → return raw value ไม่ใช่ `error1`
- ห้าม decode full JWT ใน service ถ้า controller ต้องการ payload
- `status: 0` = GET, `status: 1` = POST, `status: 2` = PUT
- `statusencode: true` เฉพาะตอน query values ต้อง base64 encode
- `statuspostencodeget` เฉพาะตอน POST response ต้องผ่าน GET decode path
- Login → prefer return raw API response ให้ controller จัดการ
- PrintUtil metadata ต้องครบทุก call

---

## Login Flow

- `postLogIn` → return raw result จาก MainService ไม่สร้าง fake error, return `dynamic`
- login controller ต้อง handle:
  - `null` หรือ `error1` → show login fail dialog
  - `StatusAndMessageModel` → show matching status dialog
  - `Map` with `ID_personnel` → login success
  - `Map` with `status` → show status dialog
  - `LoginModel` → login success
  - JWT string → split by `.`, decode payload, สร้าง LoginModel
- หลัง login success: save `SharedPreferencesDatabase.personnelid`, check SQLite ก่อน ถ้าข้อมูลเก่าค่อยเรียก API
- ห้าม pass `BuildContext` ข้าม async gap → re-read `Get.overlayContext ?? Get.context` ใน helper

---

## GetX Controller Rules

- ใช้ `Get.find`, `Get.context`, `Get.overlayContext`, `Rx`, `Rxn`, `.value` ได้
- `final Rxn<Model>` สำหรับ reactive nullable model ที่ไม่ reassign
- หลัง `await` → get fresh context จาก `Get.overlayContext ?? Get.context`
- Close loading dialog: `if (Get.isDialogOpen == true) { Get.back(); }`
- Fire-and-forget → ใช้ `unawaited(...)` และ import `dart:async`

---

## PrintUtil Rules

- ห้ามใช้ `print(...)` → ใช้ `PrintUtil().printDebug(...)` เท่านั้น
- ทุก `printDebug` ต้องมี: `class1`, `funsion1`, `statuserror`
- `statuserror: true` → errors และ catch blocks
- `statuserror: false` → normal logs
- ห้ามเขียน `funsion1: 'unknown'`

---

## Widget Layout Rules

- `Row` ต้องมี: `mainAxisAlignment`, `crossAxisAlignment`, `mainAxisSize`
- `Column` ต้องมี: `mainAxisAlignment`, `crossAxisAlignment`, `mainAxisSize`
- `Stack` ต้องมี: `alignment`, `clipBehavior`, `fit`
- `SingleChildScrollView` ต้องมี: `scrollDirection`, `physics`, `clipBehavior`
- ถ้า widget มีค่าแล้ว ห้ามเปลี่ยน → fill แค่ที่หายไป
- ใช้ widget จาก `lib/component/widget` ก่อนสร้างใหม่

---

## View Rules

- Views → `lib/view/<domain>/<name>_view.dart`
- Views เป็น screen-level → compose widgets, เรียก controllers
- Business logic → ย้ายเข้า controller
- ห้าม read/write SQLite จาก views

---

## Database และ SQFlite Rules

- `whereData` → ใช้ column constants จริงๆ ไม่ใช่ user values
- `whereArgs` → ต้องใส่ทุก filter value
- สร้าง table ด้วย `CREATE TABLE IF NOT EXISTS`
- เพิ่ม column หลังตรวจว่ายังไม่มีก่อน
- ห้าม build SQL insert ด้วย string concatenation
- ใช้ `Batch.insert`, `insert`, หรือ parameter binding
- เมื่อเพิ่ม model field ใหม่ที่เก็บ local ต้อง update ทั้ง: model mapping, column constants, table SQL, column check/add logic, insert/update mapping

---

## Model Rules

- เก็บ parsing ไว้ใน model class: `fromMap`, `toMap`, `fromJson`, `toJson`
- ห้าม parse model fields ใน views
- ใช้ nullable return values แทน fake error model instances
- Preserve existing field names ถ้า API keys ขึ้นอยู่กับมัน

---

## Legacy Model/Class Name Compatibility

- Run analyzer หรือ `rg` หาชื่อเดิมที่ยังอ้างอยู่
- ห้าม `typedef` alias → rename caller ไปใช้ class จริง:

```dart
// old → current
HolidayModel holiday → HolidayTimeAttendanceModel holiday
```

- ถ้า old code ต้องการ static namespace → ทำ compatibility class:

```dart
class ThailandLatitudeLongitudeJson {
  static const String name = LatitudeLongitudeThailandMap.name;
  static const List thailandlatitudelongitude =
      LatitudeLongitudeThailandMap.thailandlatitudelongitude;
}
```

- ถ้า old code import path ผิดที่ใช้กันแพร่หลาย → ทำ shim file:

```dart
export 'time_work_time_attendance_model.dart';
```

- ห้ามทำ `class PrintUtill extends PrintUtil {}` → update call sites ตรงๆ

---

## Import Rules

- ใช้ package import: `package:<appname>/...`
- ห้ามใช้ relative path ข้าม folder เช่น `../../service/main_service.dart`
- ต้องมี `.dart` extension เสมอ

```dart
// ✗ Wrong
import '../../component/widget/main_button_widget_component.dart';

// ✓ Correct
import 'package:<appname>/component/widget/main_button_widget_component.dart';
```

- ห้าม import จาก `lib/old/**` ถ้า user ไม่อนุญาต
- ลบ unused imports หลังแก้
- Import boundaries:
  - controllers → services, models, database, components, utilities
  - services → constants, MainService, models, utilities
  - models → ห้าม import controller/service
  - views → controllers, bindings, components, constants, models

---

## Required Checks หลังแก้ไข

- Run `dart format` บนไฟล์ที่แก้
- Run `dart analyze` สำหรับ scope ที่แก้
- ตรวจให้แน่ใจว่าไม่มี:
  - `print(`
  - bare `Future` ไม่มี generic type
  - `var name =`
  - `final name =` ไม่มี explicit type
  - `model3error`
  - unwanted imports จาก `lib/old/**`
  - `funsion1: 'unknown'`
  - `PrintUtil().printDebug` ขาด `class1`, `funsion1`, หรือ `statuserror`
- สรุปสั้นๆ: แก้อะไร, `dart format` ผ่านไหม, `dart analyze` ผ่านไหม
