# Backend 10. Implementation Plan

Mục tiêu của file này là chia backend thành các phần nhỏ để triển khai tuần tự. Mỗi lần code xong một phần, cập nhật trạng thái tại đây để biết phần nào đã hoàn thành, phần nào còn lại.

## Quy ước trạng thái

- `[ ]` Chưa làm
- `[~]` Đang làm
- `[x]` Đã code và kiểm tra cơ bản

## Nguyên tắc triển khai

- Backend nằm trong `backend/`, tách riêng khỏi frontend.
- API dùng base path `/api/v1`.
- Controller chỉ nhận request và trả response.
- Service chứa business logic, transaction, payment, email, inventory.
- Validation dùng Zod.
- Prisma dùng PostgreSQL và Decimal cho tiền.
- Response success/error phải thống nhất theo `docs/backend/04_API_SPEC.md`.
- Không hardcode secret; chỉ commit `.env.example`.
- Các luồng checkout, payment success, coupon usage, inventory adjustment phải dùng transaction.

## Phase 1 - Backend Foundation

- [x] Cập nhật `backend/package.json` với scripts cần thiết.
- [x] Thêm TypeScript config.
- [x] Thêm Express app và server entry.
- [x] Thêm cấu trúc thư mục `src/config`, `src/common`, `src/modules`.
- [x] Thêm env loader và `.env.example`.
- [x] Thêm middleware CORS, JSON parser, request logging cơ bản.
- [x] Thêm health check endpoint `GET /api/v1/health`.
- [x] Thêm response helper chuẩn.
- [x] Thêm `AppError` và error middleware chuẩn.

Tiêu chí hoàn thành:

- `npm run dev` khởi động backend ở port 4000.
- `GET /api/v1/health` trả response success chuẩn.
- TypeScript build không lỗi.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 1.
- Chưa chạy lệnh kiểm tra trong môi trường hiện tại theo yêu cầu của user. User sẽ tự chạy các lệnh install/typecheck/build/dev.

## Phase 2 - Prisma Database

- [x] Tạo `backend/prisma/schema.prisma` theo tài liệu.
- [x] Tạo Prisma client singleton.
- [x] Thêm scripts `prisma:generate`, `prisma:migrate`, `prisma:seed`.
- [x] Tạo seed script cho admin, categories, products, coupons.
- [x] Đảm bảo schema migrate được với PostgreSQL.

Tiêu chí hoàn thành:

- Prisma generate chạy được.
- Migration tạo đủ bảng/enums.
- Seed tạo admin `admin@youniverse.local` và 3 sản phẩm Charm Astra/Sirius/Polaris.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 2.
- Chưa chạy `prisma generate`, migration hoặc seed trong môi trường hiện tại theo yêu cầu của user. User sẽ tự chạy các lệnh kiểm tra.

## Phase 3 - Auth And RBAC

- [x] Tạo module `auth`.
- [x] Register customer.
- [x] Login bằng email/password.
- [x] `GET /auth/me`.
- [x] Hash password bằng bcrypt.
- [x] JWT payload gồm `sub`, `email`, `role`.
- [x] Auth middleware attach `req.user`.
- [x] Role middleware `requireRole("ADMIN")`.
- [x] Rate limit auth routes.
- [x] Không bao giờ trả `passwordHash`.

Tiêu chí hoàn thành:

- Register/Login trả token.
- Sai password trả 401.
- Customer gọi route admin bị 403.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 3.
- Thêm endpoint kiểm tra RBAC tạm thời `GET /api/v1/admin/access-check`.
- Chưa chạy lệnh typecheck/API test trong môi trường hiện tại theo yêu cầu của user. User sẽ tự chạy các lệnh kiểm tra.

## Phase 4 - Products And Categories

- [x] Tạo module `categories`.
- [x] Tạo module `products`.
- [x] Public `GET /products` có pagination, search, line, category, sort.
- [x] Public `GET /products/featured`.
- [x] Public `GET /products/:slug`.
- [x] Public chỉ trả product `ACTIVE`.
- [x] Admin CRUD product.
- [x] Khi tạo product phải tạo inventory.
- [x] Archive product bằng `status = ARCHIVED`, không hard delete.

Tiêu chí hoàn thành:

- Public xem được 3 sản phẩm seed.
- Product detail có images, inventory, category.
- Admin tạo/sửa/archive product được.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 4.
- Public endpoints: `GET /api/v1/categories`, `GET /api/v1/products`, `GET /api/v1/products/featured`, `GET /api/v1/products/:slug`.
- Admin endpoints: `GET/POST /api/v1/admin/products`, `GET/PATCH/DELETE /api/v1/admin/products/:id`.
- Chưa chạy typecheck/API test trong môi trường hiện tại theo yêu cầu của user. User sẽ tự chạy các lệnh kiểm tra.

## Phase 5 - Cart And Coupon Calculation

- [x] Tạo module `cart`.
- [x] Hỗ trợ guest cart bằng `x-session-id`.
- [x] Hỗ trợ user cart bằng JWT.
- [x] Add/update/remove cart item.
- [x] Validate product active và stock đủ.
- [x] Tính subtotal, discount, shippingFee, total.
- [x] Apply coupon chỉ validate/tính discount, chưa tăng `usedCount`.
- [x] Merge guest cart vào user cart sau login.

Tiêu chí hoàn thành:

- Không thêm được sản phẩm hết hàng/inactive.
- Không update quantity vượt stock.
- Coupon hợp lệ trả discount đúng.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 5.
- Cart endpoints: `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH /api/v1/cart/items/:itemId`, `DELETE /api/v1/cart/items/:itemId`, `POST /api/v1/cart/apply-coupon`, `POST /api/v1/cart/merge`.
- Guest cart dùng header `x-session-id`.
- User cart dùng `Authorization: Bearer <token>`.
- `apply-coupon` chỉ validate và trả tổng tiền đã tính lại, chưa tăng `Coupon.usedCount`.
- Chưa chạy typecheck/API test trong môi trường hiện tại theo yêu cầu của user. User sẽ tự chạy các lệnh kiểm tra.

## Phase 6 - Checkout And Orders

- [ ] Tạo module `checkout`.
- [ ] Tạo module `orders`.
- [ ] `POST /checkout/validate`.
- [ ] `POST /checkout/create-order`.
- [ ] Tạo order code format `YOU-YYYYMMDD-XXXXXX`.
- [ ] Copy product data vào `OrderItem`.
- [ ] COD flow hoàn chỉnh.
- [ ] Deduct inventory khi COD confirmed.
- [ ] Tăng coupon usage khi order thành công.
- [ ] Clear/mark cart `CHECKED_OUT`.
- [ ] Customer `GET /orders/me`.
- [ ] Customer `GET /orders/me/:id`.
- [ ] Customer cancel order khi policy cho phép.

Tiêu chí hoàn thành:

- Checkout COD tạo order `CONFIRMED`.
- Payment COD có status `PENDING`.
- Inventory giảm đúng một lần.
- Coupon usage tăng đúng một lần.

## Phase 7 - Payment Providers

- [ ] Tạo module `payments`.
- [ ] Tạo interface payment provider.
- [ ] Tạo `cod.provider.ts`.
- [ ] Tạo `mock-online.provider.ts` cho development.
- [ ] Tạo skeleton `vnpay`, `momo`, `stripe`.
- [ ] Callback/webhook endpoint theo provider.
- [ ] Verify callback/mock signature.
- [ ] Payment success idempotent.
- [ ] Verify amount khớp order total.

Tiêu chí hoàn thành:

- Online mock trả payment URL.
- Callback success mark payment `PAID`.
- Callback lặp lại không trừ kho/email/coupon thêm lần nữa.

## Phase 8 - Emails

- [ ] Tạo module `emails`.
- [ ] Email service không nằm trong controller.
- [ ] Order confirmation template.
- [ ] Payment success template.
- [ ] Order status updated template.
- [ ] Ghi `EmailLog` cho SENT/FAILED.
- [ ] Development fallback console log khi chưa cấu hình SMTP.
- [ ] Checkout không fail nếu email fail.

Tiêu chí hoàn thành:

- Order confirmation có order code, items, total, address, payment status.
- SMTP lỗi vẫn tạo order thành công và lưu EmailLog FAILED.

## Phase 9 - Admin APIs

- [ ] `GET /admin/dashboard`.
- [ ] `GET /admin/products`.
- [ ] `POST /admin/products`.
- [ ] `GET /admin/products/:id`.
- [ ] `PATCH /admin/products/:id`.
- [ ] `DELETE /admin/products/:id` archive product.
- [ ] `GET /admin/orders`.
- [ ] `GET /admin/orders/:id`.
- [ ] `PATCH /admin/orders/:id/status`.
- [ ] `GET /admin/inventory`.
- [ ] `PATCH /admin/inventory/:productId/adjust`.
- [ ] `GET /admin/coupons`.
- [ ] `POST /admin/coupons`.
- [ ] `PATCH /admin/coupons/:id`.
- [ ] `DELETE /admin/coupons/:id` disable coupon.
- [ ] `GET /admin/users`.

Tiêu chí hoàn thành:

- Tất cả admin routes cần JWT admin.
- Customer không truy cập được admin routes.
- Inventory adjustment tạo `InventoryLog`.
- Coupon delete chỉ disable, không hard delete.

## Phase 10 - Tests And Hardening

- [ ] Thêm test setup.
- [ ] Test auth.
- [ ] Test product public/admin.
- [ ] Test cart.
- [ ] Test coupon calculation.
- [ ] Test checkout COD.
- [ ] Test payment callback idempotency.
- [ ] Test customer order ownership.
- [ ] Test admin RBAC.
- [ ] Kiểm tra TypeScript strict.
- [ ] Kiểm tra API response consistency.

Tiêu chí hoàn thành:

- Các case trong `docs/08_TEST_CASES.md` pass hoặc được ghi rõ chưa hỗ trợ.
- Các acceptance criteria backend trong `docs/09_ACCEPTANCE_CRITERIA.md` đạt.

## Thứ tự khuyến nghị khi yêu cầu code

1. Phase 1 - Backend Foundation
2. Phase 2 - Prisma Database
3. Phase 3 - Auth And RBAC
4. Phase 4 - Products And Categories
5. Phase 5 - Cart And Coupon Calculation
6. Phase 6 - Checkout And Orders
7. Phase 7 - Payment Providers
8. Phase 8 - Emails
9. Phase 9 - Admin APIs
10. Phase 10 - Tests And Hardening

## Trạng thái hiện tại

- Phase 1 Backend Foundation đã được code.
- Phase 2 Prisma Database đã được code.
- Phase 3 Auth And RBAC đã được code.
- Phase 4 Products And Categories đã được code.
- Phase 5 Cart And Coupon Calculation đã được code.
- Chưa có Checkout hoặc Admin APIs đầy đủ.
- Lần code tiếp theo nên bắt đầu từ Phase 6 - Checkout And Orders.
