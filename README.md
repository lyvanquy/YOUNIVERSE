# YOUniverse - Personalized Accessories E-commerce Platform

> **Slogan:** *"A galaxy to hold, a story to be told"*
> 
> **Website chính thức (Production):** [https://youniverse.io.vn](https://youniverse.io.vn)

Dự án **YOUniverse** là nền tảng thương mại điện tử chuyên cung cấp các dòng sản phẩm phụ kiện charm cá nhân hóa độc đáo (Astra, Sirius, Polaris). Nền tảng được thiết kế hiện đại, responsive mobile-first và tối ưu hóa trải nghiệm người dùng với các hiệu ứng chuyển động mượt mà.

Hệ thống được chia làm 3 phần chính nằm trong cùng một repository:
1. **Backend**: Express API Server kết nối PostgreSQL qua Prisma ORM.
2. **Frontend**: Next.js (App Router) cho giao diện khách hàng.
3. **Admin**: React + Vite làm trang quản trị độc lập dành cho người quản trị.

---

## 🌌 Mục lục tài liệu dự án (`docs/`)

Để hiểu rõ hơn về các yêu cầu thiết kế, quy chuẩn nghiệp vụ và kịch bản kiểm thử, vui lòng tham khảo các tài liệu chi tiết trong thư mục `docs/`:

* **Tổng quan & Nghiệp vụ:**
  * [00_PROJECT_BRIEF.md](./docs/00_PROJECT_BRIEF.md): Mục tiêu dự án, tinh thần thiết kế và các dòng sản phẩm chính.
  * [01_REQUIREMENTS_FULL.md](./docs/01_REQUIREMENTS_FULL.md): Yêu cầu chức năng chi tiết (Giỏ hàng, Đặt hàng, Mã giảm giá, Tồn kho...).
  * [05_ADMIN_DASHBOARD_SPEC.md](./docs/05_ADMIN_DASHBOARD_SPEC.md): Đặc tả chức năng trang quản trị Admin.
  * [06_CART_CHECKOUT_RULES.md](./docs/06_CART_CHECKOUT_RULES.md): Quy tắc tính toán giỏ hàng, phí vận chuyển và áp dụng mã giảm giá.
* **Kiến trúc & Cấu trúc:**
  * [02_ARCHITECTURE.md](./docs/02_ARCHITECTURE.md): Kiến trúc hệ thống, sơ đồ thực thể (ERD) và luồng thanh toán.
  * [03_FOLDER_STRUCTURE.md](./docs/03_FOLDER_STRUCTURE.md): Quy ước đặt tên file và cấu trúc thư mục chi tiết.
  * [04_CONTENT_COPY.md](./docs/04_CONTENT_COPY.md): Bản dịch nội dung, thông điệp hiển thị đa ngôn ngữ.
* **Triển khai & Kiểm thử:**
  * [07_SECURITY_VALIDATION.md](./docs/07_SECURITY_VALIDATION.md): Quy chuẩn bảo mật, phân quyền và validate dữ liệu.
  * [08_TEST_CASES.md](./docs/08_TEST_CASES.md): Kịch bản kiểm thử cho các luồng chính.
  * [09_ACCEPTANCE_CRITERIA.md](./docs/09_ACCEPTANCE_CRITERIA.md): Tiêu chí nghiệm thu dự án.
  * [11_IMPLEMENTATION_ROADMAP.md](./docs/11_IMPLEMENTATION_ROADMAP.md): Lộ trình triển khai.
  * [12_DEPLOYMENT_NOTES.md](./docs/12_DEPLOYMENT_NOTES.md): Ghi chú deploy lên môi trường Production.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### 1. Backend (`backend/`)
* **Framework:** Node.js, Express, TypeScript (chạy bằng `tsx`).
* **Database & ORM:** PostgreSQL kết hợp Prisma ORM.
* **Authentication:** JWT (JSON Web Tokens) & bcrypt mã hóa mật khẩu.
* **Libraries:** Express Rate Limit, Helmet (bảo mật), Multer (upload ảnh), Nodemailer (gửi email xác nhận đơn hàng).

### 2. Frontend (`frontend/`)
* **Framework:** Next.js (App Router), React, TypeScript.
* **Styling:** Tailwind CSS (v4).
* **Icons:** Lucide React.
* **Routing:** Next.js File-system Routing.

### 3. Admin (`admin/`)
* **Build Tool:** Vite + React + TypeScript.
* **State Management & Queries:** TanStack React Query.
* **Routing:** React Router DOM v7.
* **Charts:** Recharts.

---

## ⚙️ Hướng dẫn cài đặt và chạy dự án (Local Setup)

Đảm bảo máy tính đã cài đặt **Node.js** (khuyến nghị v18+) và **PostgreSQL** đang chạy.

### Bước 1: Thiết lập Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env` từ file mẫu:
   ```bash
   cp .env.example .env
   ```
   *Cập nhật thông tin kết nối Database (`DATABASE_URL`) và các khóa thanh toán, email nếu cần.*
4. Chạy Migration để tạo các bảng trong Database:
   ```bash
   npx prisma migrate dev
   ```
5. Đổ dữ liệu mẫu (Seed Database):
   ```bash
   npm run prisma:seed
   ```
   *Để chủ động tạo/cập nhật admin khi seed, đặt `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD` trong `backend/.env`. Không có tài khoản hoặc mật khẩu mặc định.*
6. Khởi động server phát triển (chạy tại cổng `4000`):
   ```bash
   npm run dev
   ```

### Bước 2: Thiết lập Giao diện Khách hàng (Frontend)

1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Chạy môi trường phát triển (chạy tại cổng `3000`):
   ```bash
   npm run dev
   ```

### Bước 3: Thiết lập Trang Quản trị (Admin Dashboard)

1. Di chuyển vào thư mục admin:
   ```bash
   cd ../admin
   ```
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env` từ file mẫu:
   ```bash
   cp .env.example .env
   ```
   *Mặc định API trỏ đến `http://localhost:4000/api/v1`*
4. Khởi động trang admin (chạy tại cổng `5173`):
   ```bash
   npm run dev
   ```

---

## 🌐 Sơ đồ các cổng kết nối (Port Mapping)

Khi tất cả các dịch vụ được chạy ở chế độ phát triển:
* **Frontend (Khách hàng):** [http://localhost:3000](http://localhost:3000)
* **Admin (Quản trị):** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:4000](http://localhost:4000)
  * Swagger/API docs hoặc Base route: `/api/v1`

---

## 📦 Các Dòng Sản Phẩm Charm Độc Quyền

1. **Astra** (*Badge: Unique*): Khẳng định cá tính cá nhân thông qua tên riêng, biểu tượng chòm sao hoàng đạo hoặc năng lượng nguyên tố.
2. **Sirius** (*Badge: Passion*): Gói trọn những niềm vui nhỏ bé thường nhật, thú cưng đáng yêu hay các thói quen cá nhân.
3. **Polaris** (*Badge: Inspiring*): Những câu trích dẫn truyền cảm hứng, đóng vai trò như chiếc la bàn định hướng cho tâm hồn.

---

## 🔒 Tài khoản quản trị

Tài khoản quản trị chỉ được tạo qua các biến môi trường `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD` khi chạy seed. Không commit hoặc ghi mật khẩu thật vào tài liệu.
