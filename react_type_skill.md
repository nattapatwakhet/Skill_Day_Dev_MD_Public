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
