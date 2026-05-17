# FPT Telecom Dashboard - Complete System Walkthrough

This document showcases the interactive walkthrough and demo of all features built within the **FPT Telecom Product Catalog & Pricing Management platform**.

## 🎥 Live Interactive Demonstration
Below is the live animation of the entire walkthrough showing all components, tabs, simulation charts, and the new **Quick Promotion Modal** operating seamlessly in real time:

![FPT Product Catalog & Pricing Dashboard Demonstration WebP](./fpt_dashboard_complete_walkthrough.webp)

---

## ⚡ Main Walkthrough Sequence & Highlights

### 1. Product Catalog & Filters
- **Path**: `/`
- **Features Demonstrated**: Full view of the grid catalog list showing sub-services, active channels, code parameters, and pricing metrics.
- **Search & Filter**: Searching and filtering by product categories.

### 2. Product Details Page
- **Path**: `/detail/:id`
- **Features Demonstrated**: Clean list back-navigation and dedicated full-screen layout displaying details and exact technical specifications.

### 3. Comprehensive Product Creation & Config
- **Path**: `/create` & `/edit/:id`
- **Features Demonstrated**: Selecting the dynamic product type dropdown (Combo Internet + FPT Play + Camera) to dynamically load service-specific tabs:
  - **Thông tin chung (General)**: Form inputs, long/short descriptions, visual image loaders.
  - **Meta data (SEO)**: Title, description, keywords, slug generators.
  - **Danh mục (Categories)**: Multi-selection checklists.
  - **Internet tab**: Bandwidth parameters, uplink/downlink, GPON infrastructure options.
  - **FPT Play tab**: Concurrent login limits, quality checkmarks (1080p, 4K), feature toggles.
  - **Camera tab**: Cloud storage days, AI analytics switch.
  - **Phạm vi áp dụng (Coverage)**: Geolocation mapping selectors.
  - **Giá (Pricing)**: Restructured pricing tables with advanced billing cycles.

### 4. Pricing Policies List
- **Path**: `/pricing-policies`
- **Features Demonstrated**: Comprehensive status counts (Ban hành, Chờ duyệt, Đề xuất, Nháp), and interactive search cards.

### 5. Pricing Policy Details (Unified Table View)
- **Path**: `/pricing-policies/:id`
- **Features Demonstrated**: The newly engineered **Unified pricing lines grid** combining multiple individual tables into a single high-performance workspace showing base price, discounts, and final rates simultaneously.

### 6. Quick Promotion Modal (New Tool!)
- **Trigger**: Click ⚡ **Cập nhật nhanh** button in the "Thao tác" column of the policy list.
- **Features Demonstrated**: 
  - Dynamic interactive tags corresponding to the active products.
  - Quick percentage (`% cước giảm`) or amount (`số tiền giảm`) bulk configuration.
  - Smart automatic disable parameters for prepaid vs postpaid gift month rules.
  - Direct live database synchronization mock with gorgeous green success toasts.

### 7. Service Price Allocation Simulator
- **Path**: `/settings/price-allocation`
- **Features Demonstrated**: Full allocations tuning and a live simulation chart illustrating the immediate distribution impact of the Internet fee part inside combos.
