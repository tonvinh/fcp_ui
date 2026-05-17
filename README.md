# FPT Telecom - Product Catalog & Pricing Management Platform (FCP)
> Hệ thống Quản lý Danh mục Sản phẩm & Chính sách Giá hợp nhất toàn diện của FPT Telecom.

FCP là nền tảng quản lý danh mục sản phẩm, cấu hình thông số dịch vụ kỹ thuật (Internet GPON, Truyền hình FPT Play, Camera an ninh Cloud) và thiết lập chính sách giá, ưu đãi khuyến mại hàng loạt một cách trực quan, tối ưu năng suất làm việc cho quản trị viên và ban giám đốc.

---

## 🎥 Video Demo Thao tác Hệ thống
Để xem toàn bộ video thao tác thực tế và mô phỏng các tính năng chính của hệ thống, vui lòng mở tài liệu báo cáo:
👉 **[Walkthrough Demo Recording (WebP)](./docs/walkthrough_report.md)**

---

## ⚡ Các Tính năng Chủ chốt

### 1. Quản lý Danh mục & Thông số Dịch vụ chuyên sâu (Product Catalog)
* **Giao diện hiện đại**: Bảng danh sách trực quan, hỗ trợ tìm kiếm nhanh, lọc theo trạng thái và nhóm sản phẩm.
* **Chi tiết kỹ thuật**: Trang xem chi tiết gói cước hiển thị đầy đủ thông số băng thông (Uplink/Downlink), hạ tầng hỗ trợ, số luồng xem truyền hình đồng thời, ngày lưu trữ Cloud và nền tảng hỗ trợ.

### 2. Trình cấu hình Sản phẩm linh hoạt (Create/Edit Product)
* **Tabs Cấu hình Động**: Khi chọn loại sản phẩm (ví dụ: *Combo Internet + FPT Play + Camera*), hệ thống tự động tải và hiển thị các tab tương ứng:
  * **Thông tin chung**: Tên, mô tả định dạng phong phú (Rich Text), hình ảnh tỉ lệ vàng, video giới thiệu.
  * **SEO / Metadata**: Tiêu đề SEO, từ khóa, mô tả và đường dẫn thân thiện (Slug).
  * **Internet**: Tốc độ download/upload (Mbps), hạ tầng GPON/XGSPON.
  * **FPT Play**: Thiết bị đăng nhập tối đa, chất lượng xem (HD/FullHD/4K), nội dung bản quyền.
  * **Camera**: Chất lượng ghi hình, số ngày lưu trữ Cloud, công nghệ AI thông minh.
  * **Giá & Thiết bị kèm theo**: Tích hợp chu kỳ thanh toán và kịch bản trả sau/trả trước.

### 3. Chính sách giá Hợp nhất (Unified Pricing Policy)
* **Gộp bảng giá thông minh**: Thay vì hiển thị rời rạc nhiều bảng, FCP đã gộp toàn bộ cấu hình giá của các sản phẩm trong chính sách vào một **Bảng hợp nhất duy nhất**, giúp người dùng dễ dàng so sánh giá gốc, mức chiết khấu và giá bán thực tế.
* **Tùy chọn hiển thị linh hoạt**: Hỗ trợ nút chuyển đổi nhanh giữa chế độ *"Xem bảng hợp nhất"* và *"Xem bảng riêng"* theo nhu cầu nghiệp vụ.

### 4. ⚡ Cập nhật nhanh Khuyến mại Hàng loạt (Quick Bulk Promotion Update)
* **Công cụ tăng năng suất đột phá**: Tích hợp trực tiếp tại cột **Thao tác** trên danh sách Chính sách giá.
* **Giao diện Modal cao cấp (Frosted Glass)**:
  * Cho phép chọn/bỏ chọn nhanh các sản phẩm áp dụng trong chính sách bằng các thẻ Chip cam cực kỳ trực quan.
  * Thiết lập nhanh hình thức áp dụng (Trả sau, Trả trước hoặc Cả hai).
  * Lựa chọn cách giảm cước (giảm theo % hoặc số tiền cố định).
  * Nhập mức giảm, số tháng hưởng ưu đãi và số tháng khuyến mại tặng kèm (tự động vô hiệu hóa cho hình thức trả sau).
  * Hiển thị thông báo Toast thành công tức thì sau khi áp dụng.

### 5. Trình Mô phỏng Phân bổ Giá Combo (Service Price Allocation)
* **Simulate & Preview**: Công cụ giúp kế toán và quản trị sản phẩm mô phỏng tỷ lệ phân bổ doanh thu nội bộ của các dịch vụ bên trong gói Combo.
* **Biểu đồ trực quan thời gian thực**: Sử dụng biểu đồ tròn (Donut/Pie Chart) tự động tính toán lại và biểu diễn trực quan phần giá trị của dịch vụ Internet, Truyền hình, Camera ngay khi thay đổi giá trị nhập vào.

---

## 🛠️ Công nghệ Sử dụng

* **Core**: React 18, TypeScript.
* **Bundler & Build Tool**: Vite (đảm bảo tốc độ HMR cực nhanh).
* **Styling & CSS**: TailwindCSS kết hợp Custom Vanilla CSS cho các thành phần UI/UX cao cấp (Frosted Glass, Toast, Chips).
* **Iconography**: Lucide React (Bộ vector icon đồng bộ sắc nét).
* **Data Visualization**: Recharts (vẽ biểu đồ phân bổ doanh thu trực quan).

---

## 📂 Cấu trúc Thư mục chính

```bash
fcp-ui/
├── src/
│   ├── components/            # Các component dùng chung và chuyên biệt
│   │   ├── layout/            # Header, Sidebar hệ thống
│   │   ├── pricing/           # Bộ lọc, Bảng chính sách, Cấu hình giá
│   │   ├── product/           # Các tab thông số Internet, Camera, Play, Bảng giá
│   │   └── ui/                # Button, Input, Badge, Toast dùng chung
│   ├── mockData/              # Dữ liệu mô phỏng nghiệp vụ sản phẩm & chính sách
│   ├── pages/                 # Các trang chức năng chính của hệ thống
│   │   ├── ProductList.tsx
│   │   ├── CreateProduct.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── PricingPolicyList.tsx
│   │   ├── PricingPolicyDetail.tsx
│   │   └── ServicePriceAllocation.tsx
│   ├── App.tsx                # Quản lý định tuyến (Router)
│   └── main.tsx               # Điểm khởi chạy ứng dụng
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

### 1. Yêu cầu hệ thống
* Đã cài đặt **Node.js** (Phiên bản khuyến nghị: `>= 16.x`)
* Trình quản lý gói **npm** hoặc **yarn**

### 2. Cài đặt các thư viện phụ thuộc
Chạy lệnh sau tại thư mục gốc của dự án:
```bash
npm install
```

### 3. Khởi chạy môi trường Phát triển (Development)
Chạy máy chủ cục bộ (local dev server):
```bash
npm run dev
```
Sau khi chạy thành công, truy cập ứng dụng tại:
👉 **[http://localhost:5173](http://localhost:5173)**

### 4. Biên dịch Dự án (Production Build)
Biên dịch dự án ra thư mục `dist` để sẵn sàng triển khai thực tế:
```bash
npm run build
```
Để chạy thử bản build cục bộ:
```bash
npm run preview
```
