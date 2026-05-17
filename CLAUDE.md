# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot-reload)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

No test runner is configured in this project.

## Architecture

This is a React 19 + TypeScript + Vite SPA for **FPT Telecom's internal product and pricing management system** (FCP — FPT Catalog Platform). The UI language is Vietnamese.

### Stack
- **Routing**: React Router v7 (BrowserRouter, no data router)
- **Styling**: Tailwind CSS v3 with custom FPT brand colors (`fpt.orange`, `fpt.blue`, `fpt.lightBlue`, `fpt.darkBlue`) in `tailwind.config.js`
- **Icons**: lucide-react
- **Utilities**: `clsx` + `tailwind-merge` via `src/lib/utils.ts` (`cn()` helper)
- **Excel export**: `xlsx` package via `src/utils/exportExcel.ts`
- **Rich text**: react-quill (used in forms)
- **Date formatting**: date-fns (locale: Vietnamese dates, format `dd/MM/yyyy HH:mm`)

### Layout structure
`App.tsx` wraps everything in a fixed sidebar + scrollable content area:
- `Sidebar` (fixed, collapsible, `w-64` / `w-20`) — manages navigation, collapse state lives in `App`
- `Header` (fixed top bar, `h-16`, spans content area)
- Content area: `pt-16` + `ml-64` (or `ml-20` when collapsed)

### Route map
| Path | Page |
|------|------|
| `/` | ProductList |
| `/create` | CreateProduct |
| `/detail/:id` | ProductDetail |
| `/pricing-policies` | PricingPolicyList |
| `/pricing-policies/create` | CreatePricingPolicy |
| `/pricing-policies/:id` | PricingPolicyDetail |
| `/settings/price-allocation` | ServicePriceAllocation |

### Data layer
All data is currently **mock-only** — no API calls. Mock data lives in `src/mockData/`:
- `products.ts` — exports `Product` interface + `mockProducts[]`
- `pricingPolicies.ts` — pricing policy mock data

### Component organization
```
src/components/
  ui/          # Primitives: Button, Badge, Input, FormattedNumberInput
  layout/      # Header, Sidebar
  product/     # ProductTable, ProductFilter, TabGia, TabThietBiKemTheo
  pricing/     # PricingPolicyTable, PricingPolicyFilter, PricingPolicyGia,
               # PricingPolicyPhamVi, PricingPolicyThongTinChung
```

Detail pages use an accordion/tab pattern: `ProductDetail` renders multiple sections (Thông tin cơ bản, Đặc tả dịch vụ, Thiết bị kèm theo, Cấu hình Giá & Phạm vi) as collapsible cards. The collapse state is local `useState` in the page component.

### Design conventions
- Cards: `bg-white rounded-xl border border-slate-200 shadow-sm`
- Section headers: `bg-slate-50` bar with colored icon (`w-8 h-8 rounded-lg bg-{color}-100`)
- Status badges use `Badge` with variants: `success` (emerald), `warning` (amber), `danger` (red), `default` (slate)
- Primary action color: `blue-600`; FPT brand accent: `orange-500`
- Active sidebar item: `bg-blue-600 text-white`
- Vietnamese currency: `Number.toLocaleString()` + " đ" suffix
