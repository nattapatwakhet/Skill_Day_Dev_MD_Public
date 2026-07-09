# React / TypeScript Skill

ใช้ skill นี้เมื่อแก้โค้ด React + TypeScript + MUI v9
โดยเฉพาะไฟล์ component, view, store, route, และ layout

> ชั้นภาษา (เว็บ frontend): [`javascript_skill.md`](./javascript_skill.md) (ฐาน) → [`react_skill.md`](./react_skill.md) (React JS) → **react_type** (เติม TypeScript) — ไฟล์นี้คือชั้นบนสุด ครบสุด

> **อ่าน [code_skill.md](./code_skill.md) ก่อนเสมอ** — มี naming convention (folder/file/identifier),
> scope rules, after-rename steps, type annotation หลักรวม, import หลักรวม
>
> **โครงสร้าง React app (`src/...`) + layer boundaries** ย้ายไปอยู่ที่
> [`project_structure_skill.md`](./project_structure_skill.md) → "โครงสร้าง React Web app" — ดูที่นั่นว่าวางไฟล์ folder ไหน
>
> ไฟล์นี้เก็บเฉพาะ **กฎ/ syntax เฉพาะ React + TypeScript + MUI v9** (component catalogue, props, theme, Grid, Zustand)
>
> ที่เกี่ยวข้อง: **ออกแบบ UI ให้มีเอกลักษณ์** → [`frontend_design_skill.md`](./frontend_design_skill.md) ·
> **เทสหน้าเว็บจริง (Playwright)** → [`webapp_testing_skill.md`](./webapp_testing_skill.md) ·
> **รันบน docker** (ถ้าเว็บของ workspace รันบน docker) → [`docker_skill.md`](./docker_skill.md)

---

## Component Catalogue

| File | Purpose | Key props / named exports |
|---|---|---|
| `stat_card_component.tsx` | Summary metric cards | `StatCardItem[]`, `compact?: boolean` |
| `name_header_route_component.tsx` | Page title + breadcrumb header | `icon`, `title`, `breadcrumbs` |
| `input_field_component.tsx` | Styled text input with clear button | `value`, `onChange`, `onClear`, `starticon`, `inputprops`, `cleartooltip`, `inputsx` |
| `select_field_component.tsx` | Styled dropdown | `value`, `options: SelectFieldOption[]`, `onChange`, `placeholder`, `alloptionlabel`, `minwidth` |
| `filter_table_component.tsx` | Filter row: search + status + category + date range | `searchvalue`, `statusvalue`, `categoryvalue`, `startdate`, `enddate`, `filteradd?: FilterAddItem[]`, `onClear` |
| `toolbar_table_component.tsx` | Table toolbar: add + refresh + bulk actions | `onAdd`, `onRefresh`, `bulkactions: BulkAction[]`, `hasselection`, `buttonsize` |
| `data_table_component.tsx` | Generic table with checkboxes + status chips | `DataTable<T extends object>`, `ColumnDef<T>`, **named export** `StatusChip` |
| `pagination_table_component.tsx` | Page navigation + page-size + dense toggle | `page`, `pagesize`, `totalpages`, `totalrows`, `onPageChange`, `onPageSizeChange`, `dense`, `onDenseChange` |

`FilterTable` รับ `filteradd?: FilterAddItem[]`:

```ts
export type FilterAddItem = FilterAddSelectItem | FilterAddDateItem | FilterAddSwitchItem;
```

`DataTable` generic — ใน `.tsx` ต้องเขียน constraint:

```tsx
const DataTable = <T extends object>({ ... }: DataTableProps<T>): ReactElement => { ... };
```

Named exports ต้อง import แยก:

```ts
import DataTable, { StatusChip } from "../../component/data_table_component";
import FilterTable, { type FilterAddItem } from "../../component/filter_table_component";
import ToolbarTable, { type BulkAction } from "../../component/toolbar_table_component";
```

---

## TypeScript Type Annotation Rules

```ts
// ✓ Correct
const themecolors: AppPaletteColors = theme.palette.app;
const count: number = items.length;
const isdesktop: boolean = useMediaQuery(theme.breakpoints.up("md"));
export const createAppTheme = (thememode: ThemeModeType): Theme => { ... };
items.forEach((item: StatCardItem) => { ... });
items.map((item: StatCardItem): ReactElement => { ... });

// ✗ Wrong
const themecolors = theme.palette.app;
items.forEach((item) => { ... });
```

React components return `ReactElement` เสมอ ห้าม `JSX.Element`:

```tsx
// ✓ Correct
const Header = (): ReactElement => { ... };

// ✗ Wrong
const Header = (): JSX.Element => { ... };
```

ทุกไฟล์ที่ใช้ `ReactElement` ต้อง import ชัดเจน:

```ts
import type { ReactElement } from "react";
import { useMemo, useState, type ReactElement } from "react";
```

ใช้ `type` imports สำหรับ pure types:

```ts
import type { ThemeModeType, LanguageType } from "../../constant/main_constant";
import type { Theme } from "@mui/material/styles";
```

- ใช้ `const` ถ้าไม่ reassign, `let` เฉพาะตอน reassign
- ห้าม shadow store state key ด้วย local variable ที่ case ต่างกัน

---

## Props Interface — All-Lowercase Names

Props ทุกตัวบน custom component ต้องเป็น all-lowercase:

```tsx
// ✓ Correct
interface InputFieldProps {
  starticon?: ReactElement;
  cleartooltip?: string;
  inputsx?: SxProps<Theme>;
}

// ✗ Wrong
interface InputFieldProps {
  startIcon?: ReactElement;
  clearTooltip?: string;
}
```

```tsx
<InputField starticon={<FiSearch />} cleartooltip="ล้าง" />  // ✓
<InputField startIcon={<FiSearch />} clearTooltip="ล้าง" />  // ✗
```

## MUI Button Icon-Only Alignment

MUI `Button` adds default margin to `.MuiButton-startIcon`, so icon-only buttons can look off-center.

Rules:
- If a reusable button supports icon-only mode, make `label` optional.
- Use flex center for icon-only buttons.
- Clear the default start-icon margin when there is no label.
- Keep an explicit gap, such as `8px`, only when both icon and label are rendered.
- `variant="contained"` has a default MUI shadow. If the design expects flat buttons, set
  `disableElevation` and keep `boxShadow: "none"` for normal, hover, active, and focus states.

## MUI form widget behaviors

- **Autocomplete: เปิด dropdown ขณะมีค่าเลือกอยู่ → search ผิด (เหลือแค่ตัวที่เลือก)** — MUI ยิง
  `onInputChange(reason="input", <label ของตัวที่เลือก>)` ตอนเปิด → handler เอา label ไป search → เหลือ option เดียว
  แก้: เก็บ label ล่าสุดที่เลือกไว้ใน `ref` แล้วใน `onInputChange` ถ้า `inputValue === ref.current` → `return`
  ไม่ search (โชว์ทุก option); พิมพ์ทับ/ล้าง → ค่าต่างจาก ref → search ปกติ (เชื่อ ref เสถียรกว่าเทียบ selected value)
- **ช่องที่มีตัวนับ (maxlength `x/255`) → error ต้องเข้า `errortext` ของ input** ไม่ใช่ `<Typography>` แยกอีกบรรทัด
  ไม่งั้นตัวนับกับ error อยู่คนละบรรทัด/ตัวนับหาย ให้ error ซ้าย + ตัวนับขวา บรรทัดเดียวกัน + กรอบแดงตอน error
- **responsive object (sx / size) ต้องใส่ breakpoint ให้ครบ `xs`/`sm`/`md` ทุกก้อน** อย่าใส่ค้างบาง breakpoint

## Approval/dialog UI patterns

- Dialog action bar ควรแยกตำแหน่งชัด: ปิด/ยกเลิกฝั่งหนึ่ง, status/selection ตรงกลาง, primary save อีกฝั่ง
- Radio status ต้องมีหัวข้อและสี/label ที่สื่อสถานะจริง และต้อง validate ว่าเลือกแล้วก่อนกดบันทึก
- Dialog หลายรายการควรมี scroll ชั้นเดียว; หลีกเลี่ยง `DialogContent` scroll แล้ว component ลูกมี `overflowY` อีกชั้น
- รูป/เอกสาร preview ใน data dialog ควรมี slot ขนาดคงที่ รวม placeholder ช่องว่างที่เหลือ เพื่อไม่ให้ layout กระโดด
- Dialog ดูข้อมูลที่ต้องกว้างเต็มควรควบคุม `maxWidth` ที่ wrapper ให้ตรง ไม่ใช่ตั้ง width ด้านในอย่างเดียว
- Dialog ที่มี form/table ใหญ่ควรตั้งขนาดที่ wrapper แบบ viewport-constrained เช่น `maxWidth="xl"`,
  width เกือบเต็มจอแต่เหลือ margin และ `maxHeight` ประมาณ `94vh` เพื่อไม่ให้ content หลุด viewport

---

## Color และ Theme Rules

`main_constant.ts` คือ single source of truth สำหรับ hex values:

```ts
// ✓ Correct
statusopen: Color.green3color,

// ✗ Wrong
statusopen: "#1b7a50",
```

เพิ่ม theme key ใหม่ (เช่น `statusnew`):
1. เพิ่มใน `Color` ถ้าต้องการ hex ใหม่
2. เพิ่ม `statusnew` ใน `darktheme` และ `lighttheme`
3. เพิ่ม `statusnew: string` ใน `AppPaletteColors` ที่ `src/types/mui-augmentation.d.ts`

Access สีใน component:

```tsx
const themecolors: AppPaletteColors = theme.palette.app;
```

---

## MUI v9 Grid

MUI v9 ลบ `item`, `xs`, `sm`, `md` เป็น direct props → ใช้ `size` แทน:

```tsx
// ✓ Correct — MUI v9
<Grid container spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
  <Grid size={{ xs: 6, sm: 4, md: mdcols }}>

// ✗ Wrong — MUI v5
<Grid item xs={6} sm={4} md={mdcols}>
```

`justifyContent` และ layout props บน `container` → ใส่ใน `sx`

### MUI v9 Changes อื่นๆ

- `MenuProps.PaperProps` บน `<Select>` invalid → ห้ามใช้ทั้ง `PaperProps` และ `slotProps.paper`
- `disableUnderline` บน `<Select variant="standard">` ยังใช้ได้
- `displayEmpty` + `renderValue` คือ pattern ที่ถูกสำหรับ placeholder ใน Select

---

## Zustand Store Rules

- One store per concern: layout, user, badge, permission
- State keys → lowercase, actions → camelCase
- Destructure เฉพาะที่ component ต้องการ:

```ts
// ✓ Correct
const { leftdraweropened, setLeftDrawerOpened } = useLayoutStore();

// ✗ Wrong
const store = useLayoutStore();
```

- ห้ามสร้าง store ใหม่สำหรับ transient local UI state → ใช้ `useState`

## Auth token / route gate / service boundary

- ถ้า service, API interceptor, และ store ต้อง decode token/user data เหมือนกัน ให้ย้ายเป็น utility กลาง
  แล้วให้ทุกจุดเรียกตัวเดียวกัน ห้าม duplicate decode logic กระจายในหลายไฟล์
- API/file service ไม่ควร import Zustand store โดยตรงถ้า interceptor ต้องอ่าน token สดทุก request;
  ให้ utility อ่านจาก storage/source of truth แล้ว store ใช้ utility เป็นค่าเริ่มต้นของ UI state
- Route guard ต้องเช็ก active-status ของ user ด้วย ไม่ใช่เช็กแค่ว่ามี id/token/permission
  เช่นมี field สถานะพนักงาน/บัญชี ต้อง allow เฉพาะค่า active ที่ระบบกำหนด
- Startup data ที่โหลดครั้งเดียวหลังเข้า app ควรรวม count/badge/permission ที่จำเป็น และต้องไม่ยิงซ้ำจากทุก component

## Badge/count contract

- Badge หรือ stat ที่ควร scoped ตาม user/filter ห้ามอ่าน count รวมทั้งระบบ เช่น `total_data_status_*`
  ถ้า backend มี count ตาม filter ให้ใช้ field แบบ `total_data_filter_*`
- ถ้า backend ยังไม่มี count ตาม filter ให้เพิ่ม contract แยกชัดเจน แทนการเอา count รวมไปใช้กับ UI ที่เป็นของผู้ใช้คนเดียว
- Frontend params type ต้องประกาศ control flags ที่ส่งจริง และไม่บังคับให้ interface เป็น `Record<string, unknown>`
  ถ้า service รับ object เฉพาะ domain ให้แปลง/serialize ที่ service boundary
- Status form ที่เพิ่ม/แก้ข้อมูล workflow ต้องส่ง status ที่ backend ต้องการครบทั้ง success/status และ approve/status;
  อย่า rely default ฝั่ง backend ถ้า UI เป็น flow เฉพาะ
- ถ้าใช้ service กลางที่รับ `Record<string, unknown>` → interface params ต้องมี index signature
  `[k: string]: unknown` ไม่งั้น `tsc` ฟ้อง *"Index signature for type 'string' is missing"* (error 2345)

## ตาราง select-all ทั้ง dataset (ข้ามหน้า)

- **ติ๊กหัวตาราง = เลือกทุกแถวที่ *action ได้* ทั้ง dataset** ไม่ใช่แค่หน้าปัจจุบัน → ดึงด้วย `limit:"all"`
  เฉพาะ status ที่ทำ action ได้ แล้วเก็บ id ทั้งหมด
- **indeterminate (–)**: เทียบจำนวนที่เลือกกับจำนวนทั้งหมดที่ action ได้ (จาก count ตาม filter) ไม่ใช่จำนวนแถวในหน้า
- **persistence**: เปลี่ยนหน้าแล้วที่เลือกไว้ต้องอยู่ครบ · **bulk** ทำกับ id ที่เลือกทั้งหมดข้ามหน้า

---

## Component Rules

- Reusable UI ทั้งหมด → `src/component`
- Class name ต้อง match filename:
  - `stat_card_component.tsx` → `StatCard`
  - `filter_table_component.tsx` → `FilterTable`
- Props interfaces → PascalCase, define ในไฟล์เดียวกัน
- Optional prop → `?` suffix
- Components return `ReactElement` เสมอ

---

## View Rules

- Views → `src/view/<domain>/<name>_view.tsx`
- Views เป็น page-level → compose components, อ่าน stores หรือรับ props จาก router
- ห้าม duplicate store access ที่ layout component ทำแล้ว
- ใช้ `NameHeaderRoute` ที่ด้านบนทุก admin view

---

## Import Rules

- `import type` สำหรับ pure types
- ลบ unused imports หลังแก้
- Order: React/library → MUI → project (store → constant → component → util)
- ห้ามใช้ `.js` extension
- ห้ามใช้ `../../src/` ใน path

```ts
// ✓ Correct
import resolveRouterBasename from "./router_basename";

// ✗ Wrong
import resolveRouterBasename from "./router_basename.js";
import MainLayout from "../../src/view/layout/main_layout";
```

---

## Notification / Popup Rules — กัน popup ซ้อนขัดกันเอง

ถ้าหน้านี้มี **2 ระบบแจ้งเตือน** (เช่น dialog ผล submit + toast จาก error handler กลาง)
ระวัง **popup ขัดกันเอง**:

- หลัง **mutation สำเร็จ** (add/edit/delete) แล้วเรียก refresh ตาราง — ถ้า refresh พลาด
  **error handler กลางจะเด้ง toast "ไม่สำเร็จ" มาซ้อนกับ dialog "สำเร็จ"**
- กฎ: **ผลสำเร็จ/ล้มเหลวยึดจากตัว mutation เท่านั้น** — การ refresh/secondary call ที่พลาด
  ห้ามเด้ง toast มาขัด → ให้ refresh แบบ **silent** (ส่ง flag ปิด error toast เฉพาะ call นั้น)

```tsx
const fetchlist = useCallback(async (opts?: { silent?: boolean }): Promise<void> => {
  try { /* ... */ }
  catch (e) { if (!opts?.silent) handleApiError(e); }
}, [/* deps */]);
// หลัง save สำเร็จ:
await fetchlist({ silent: true });
```

## เปลี่ยน hook/import — แก้ให้ครบคราวเดียว (กัน "X is not defined")

ตอน refactor hook/import (เช่นสลับ `useState`→`useRef`) ต้องแก้ **import + ทุกจุดที่ใช้
ให้ครบในคราวเดียว** อย่าทิ้ง symbol เก่าค้าง:
- **เซฟกลางคัน = พังทันที** — Vite HMR รันไฟล์ที่เพิ่งเซฟสดๆ ถ้า import เปลี่ยนแล้วแต่ยังมี
  `useState(...)` ค้างอยู่ → runtime error `useState is not defined` แวบขึ้นจอ user
- หลังแก้: **grep หา symbol เก่าที่ลบไปว่าค้างไหม** ก่อนถือว่าเสร็จ
  ```bash
  grep -n "useState\|useEffect" file.tsx   # ต้องไม่เหลือถ้าลบไปแล้ว
  ```
- `tsc --noEmit` จับ "Cannot find name" ได้ → รันให้ผ่านก่อนปิดงานเสมอ

## React Compiler / ESLint hooks rules

- `npm run lint` ต้องเป็นด่านก่อน build/deploy สำหรับ React + TypeScript เพราะมันจับปัญหาคุณภาพโค้ดที่ build
  อาจยังสร้าง bundle ได้ เช่น unused import/variable, hooks dependency, Promise/async pattern, และรูปแบบที่ผิดมาตรฐานทีม
- `@typescript-eslint/no-unused-vars`: ถ้า `import`, variable, callback param, หรือ `catch (error)` ไม่ถูกใช้จริง ให้ลบออก
  หรือเปลี่ยนเป็น `catch {}` เมื่อไม่ต้องอ่าน error; อย่าคงชื่อไว้เฉยๆ เพื่อให้ผ่านตา
- `useCallback` dependency array ต้องสะท้อนค่าที่ callback ใช้จริงเท่านั้น:
  - ใส่ function/state/prop ที่อ่านใน callback เช่น `navigate`, `redirect`, `isExternal`
  - ลบ dependency ที่ไม่ได้อ่านใน callback ออก เพราะทำให้ lint เตือนและ callback เปลี่ยน identity โดยไม่จำเป็น
  - ค่าคงที่จาก `import.meta.env` ที่ไม่เปลี่ยนระหว่าง runtime ควรคำนวณเป็น module-level constant ให้ React เห็นว่าเป็นค่าคงที่จริง
- ห้ามอ่านหรือเขียน `ref.current` ระหว่าง render เพื่อ feed JSX เช่น `anchorEl={ref.current}` หรือ cache lookup ใน render
  ให้ใช้ state ที่ได้จาก event (`event.currentTarget`) หรือ `useMemo` จาก props/state แทน
- ถ้าค่าเป็น derived จาก props/state อย่าเก็บเป็น state แล้ว `setState` ใน `useEffect` ทันที เช่น preview URL จาก `file`
  ให้ derive ด้วย `useMemo` และใช้ `useEffect` เฉพาะ cleanup (`URL.revokeObjectURL`) แทน
- ถ้าต้องจำ metadata ที่มาจาก event เช่น video metadata ให้ผูก state กับ input object (`file`) ที่โหลดจริง
  เพื่อกัน metadata เก่าค้างหลัง prop เปลี่ยนโดยไม่ต้อง reset state ใน effect
- หลีกเลี่ยง `false && <Component />` สำหรับ UI ที่ปิดชั่วคราว เพราะ `no-constant-binary-expression` จะ fail
  ให้ใช้ flag ที่มีที่มา เช่น env flag (`import.meta.env.VITE_* === "true"`) และ default ปิดไว้

## ฟอร์มพิมพ์แล้วแลค/สะดุด (typing lag) — controlled form state ก้อนเดียว

อาการ: พิมพ์ในช่อง text แล้วหน่วง/กระตุก เพราะทุกคีย์ → `setform((prev)=>({...prev,[k]:v}))`
→ controller/hook re-render → งานหนักทุก keystroke

ต้นเหตุที่พบบ่อย:
1. **derived array/tree คำนวณ inline ใน body ทุก render** (เช่น สร้าง options/tree ขนาดใหญ่
   จากการ map ซ้อนหลายชุดข้อมูล) → กิน CPU บน render thread ทุก keystroke = แลค
2. **widget หนักไม่ได้ memo** (tree select / rich text editor) → re-render ทุกคีย์แม้ค่าไม่เปลี่ยน
3. **callback เป็น inline arrow** (`onChange={(v)=>onFieldChange("x",v)}`) → ref ใหม่ทุก render
   → ต่อให้ memo widget ก็ไม่ข้าม

วิธีแก้ (เรียงตาม impact):
1. ห่อ derived ทุกตัวด้วย `useMemo` + dep ให้แม่น — ใส่ **เฉพาะฟิลด์ของ form ที่ใช้จริง**
   (เช่น `form.some_array_field`) ไม่ใช่ object form ทั้งก้อน เพราะ `{...prev,[k]:v}` สร้าง
   object ใหม่แต่ field เดิม ref ไม่เปลี่ยน → พิมพ์ฟิลด์อื่นแล้ว memo ไม่ invalidate
2. ย้าย pure helper ออกไป **module scope** → stable, ไม่ต้องอยู่ใน dep array
3. `export default memo(Widget)` กับ widget หนัก
4. ส่ง callback ที่ stable ด้วย `useCallback` แทน inline arrow — ต้องครบทั้ง memo +
   callback stable + value/data stable widget หนักถึงจะข้าม re-render

> หลักคิด: ลด **งานต่อ keystroke** ก่อน (useMemo ตัด CPU ที่ render) แล้วค่อยตัด
> **reconciliation** ของ subtree หนัก (memo + stable props)

## ⚠️ ห้ามนิยาม component ซ้อนใน component (remount → input หลุด focus)

อาการ: พิมพ์ในช่อง **1 ตัวอักษรแล้วเด้งออกจากช่อง ต้องคลิกใหม่** — ไม่ใช่แค่แลค แต่ input โดน
**unmount + remount** ทุก keystroke

ต้นเหตุ: นิยาม sub-component (`FieldLabel`, `Section`, `InfoRow`, ...) ไว้ **ข้างใน** component หลัก
→ ทุก render สร้าง function identity ใหม่ → React มองเป็น **component type ใหม่** → ทำลาย subtree เก่า
แล้ว mount ใหม่ → input ข้างในเสีย focus + state

```tsx
// ✗ ผิด — นิยามข้างใน → remount ทุก render
const MyForm = ({ form, onFieldChange }: Props): ReactElement => {
  const FieldLabel = ({ label }: { label: string }): ReactElement => ( ... ); // ← ระเบิด
  return <FieldLabel label="ชื่อ" />;
};

// ✓ ถูก — นิยามระดับ module, เรียก useTheme/useTranslation ในตัวเอง
const FieldLabel = ({ label }: { label: string }): ReactElement => { ... };
const MyForm = ({ form, onFieldChange }: Props): ReactElement => { ... };
```

**กฎ:** ประกาศ component ทุกตัวที่ **ระดับ module เสมอ** (นอก component อื่น) — ถ้าต้องใช้ theme/t
ให้เรียก `useTheme()`/`useTranslation()` ภายในตัว component เอง ห้ามพึ่ง closure ของ parent

หา anti-pattern นี้ทั้งโปรเจค:
```bash
grep -rnE '^[[:space:]]+const [A-Z][A-Za-z0-9]* = \(' --include="*.tsx" src \
  | grep -vE 'useState|useRef|useMemo|useCallback'   # PascalCase const มี indent = ซ้อนใน function
```

> ต่างจาก typing-lag ด้านบน: อันนั้น = re-render ช้า (แก้ด้วย memo/useCallback), อันนี้ = **remount**
> ทำลาย focus/state (แก้ได้ทางเดียวคือย้ายนิยามออกนอก component) memo ช่วยไม่ได้

## Admin form master data readiness

ฟอร์ม admin ที่มี dropdown/master data หลายชุดห้ามเปิดให้กรอกหรือ submit ขณะข้อมูลยังไม่ครบ:

- หน้า admin ที่โหลดช้าเพราะดึงตารางกับ dropdown หนักพร้อมกัน ให้โหลด list/table หลักก่อน แล้วค่อย defer
  master/dropdown data; personnel/access-rights ไม่ควร `limit=all` ตั้งแต่ page load ถ้าใช้ search/deferred load ได้
- แยก flag "กำลังโหลด" ออกจาก "โหลดสำเร็จครบแล้ว" เช่น `formmasterdataready`
- ตอนเปิดเพิ่ม/แก้ไข ให้เรียก loader กลางของ form master data ก่อน แล้วค่อยเปิด form เมื่อข้อมูลครบ
- ถ้า loader fail ให้ปิด/ไม่เปิด form และแจ้ง error แทนการปล่อย dropdown ว่าง
- ตอน edit ต้องโหลด master data สำเร็จก่อนค่อยดึง detail/เติมค่าเดิม ไม่งั้น selected value อาจไม่มี option ให้แสดง
- ตอน submit ต้อง guard ซ้ำ ถ้า master data ยังไม่ ready ห้ามยิง API

## Bulk status actions

bulk action ในตารางต้องทำ mutation จริง ไม่ใช่แค่ล้าง selection:

- ถ้าปุ่ม bulk ใช้ checkbox เลือกแถว ให้ trace selected ids → toolbar/action → controller handler → service → API
- handler ที่ยังเป็น TODO หรือแค่ clear selection คือบั๊ก แม้ UI จะเหมือน action สำเร็จแล้ว
- action ที่เปลี่ยนสถานะหลายรายการต้องส่ง id จริงแบบ array ให้ backend (`whereIn`) และ refresh ตารางหลังสำเร็จ
- ถ้ารายการมี auto schedule แล้ว action ต้องปิดรายการ ให้ปิด auto flag ไปด้วย ไม่งั้น backend อาจ recompute แล้วเปิดกลับ
- checkbox ของ bulk action ควร selectable เฉพาะแถวที่ action ทำได้จริง

## Upload/detail payload mapping

- ฟอร์มที่ส่ง snapshot/detail fields ให้ backend ต้องส่ง field ที่ backend ใช้จริง ห้ามส่งว่างทุกครั้งถ้า UI มีข้อมูลแล้ว
- ถ้ามี video upload ให้ append file จริงใน multipart และส่ง metadata ที่ frontend หาได้ เช่น duration แทนให้ backend เดาเอง
- ถ้า upload สำเร็จแต่ submit/insert ล้ม ให้แยกว่า external upload ได้ id แล้วหรือยัง กับ DB insert error คืออะไร
  เพราะอาจเกิดไฟล์ค้างใน external storage โดยไม่มี row ใน DB

## Required Checks หลังแก้ไข

- ถ้าโปรเจกต์มี scripts ให้รันตามลำดับนี้: `npm run lint` → `npm run typecheck` → `npm run build`
- สำหรับ Vite + React + TypeScript ควรตั้ง scripts ให้ build เรียก check ก่อนเสมอ:
  ```json
  {
    "scripts": {
      "dev": "vite",
      "lint": "eslint .",
      "typecheck": "tsc -b",
      "check": "npm run lint && npm run typecheck",
      "build": "npm run check && vite build",
      "preview": "vite preview"
    }
  }
  ```
- ถ้าโปรเจกต์ยังไม่มี scripts เหล่านี้ ให้รันเทียบเท่าอย่างน้อย `npm run lint`, `npx tsc --noEmit` หรือ
  `node_modules/.bin/tsc --noEmit`, แล้วค่อย `npm run build`
- `npm run build` ที่ไม่เรียก typecheck เอง แปลได้แค่ว่า production bundle สร้างได้ ไม่ได้แปลว่า type/lint สะอาด
- ตรวจ:
  - Variables ขาด explicit type
  - Hardcoded hex color นอก `main_constant.ts`
  - MUI v5 Grid props (`item`, `xs`, `sm`, `md` เป็น direct props)
  - camelCase variable (ต้องเป็น lowercase)
  - lowercase function (ต้องเป็น camelCase)
  - lowercase React component (ต้องเป็น PascalCase)
  - Theme key ใหม่ที่ยังไม่เพิ่มใน `MainConstant` และ `AppPaletteColors`
- สรุปสั้นๆ: แก้อะไร, `tsc --noEmit` ผ่านไหม
