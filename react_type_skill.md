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

## Required Checks หลังแก้ไข

- Run `npm run build` หรือ `npx tsc --noEmit` ให้ผ่าน 0 errors
- ตรวจ:
  - Variables ขาด explicit type
  - Hardcoded hex color นอก `main_constant.ts`
  - MUI v5 Grid props (`item`, `xs`, `sm`, `md` เป็น direct props)
  - camelCase variable (ต้องเป็น lowercase)
  - lowercase function (ต้องเป็น camelCase)
  - lowercase React component (ต้องเป็น PascalCase)
  - Theme key ใหม่ที่ยังไม่เพิ่มใน `MainConstant` และ `AppPaletteColors`
- สรุปสั้นๆ: แก้อะไร, `tsc --noEmit` ผ่านไหม
