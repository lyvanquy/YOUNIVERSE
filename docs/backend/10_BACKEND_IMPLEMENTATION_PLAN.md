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

- [x] Tạo module `checkout`.
- [x] Tạo module `orders`.
- [x] `POST /checkout/validate`.
- [x] `POST /checkout/create-order`.
- [x] Tạo order code format `YOU-YYYYMMDD-XXXXXX`.
- [x] Copy product data vào `OrderItem`.
- [x] COD flow hoàn chỉnh.
- [x] Deduct inventory khi COD confirmed.
- [x] Tăng coupon usage khi order thành công.
- [x] Clear/mark cart `CHECKED_OUT`.
- [x] Customer `GET /orders/me`.
- [x] Customer `GET /orders/me/:id`.
- [x] Customer cancel order khi policy cho phép.

Tiêu chí hoàn thành:

- Checkout COD tạo order `CONFIRMED`.
- Payment COD có status `PENDING`.
- Inventory giảm đúng một lần.
- Coupon usage tăng đúng một lần.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 6.
- Checkout endpoints: `POST /api/v1/checkout/validate`, `POST /api/v1/checkout/create-order`.
- Customer order endpoints: `GET /api/v1/orders/me`, `GET /api/v1/orders/me/:id`, `POST /api/v1/orders/:id/cancel`.
- Phase 6 chỉ hoàn chỉnh COD. Online payment provider và callback sẽ làm ở Phase 7.
- Chưa chạy typecheck/API test trong môi trường hiện tại theo yêu cầu của user. User sẽ tự chạy các lệnh kiểm tra.

## Phase 7 - Payment Providers

- [x] Tạo module `payments`.
- [x] Tạo interface payment provider.
- [x] Tạo `cod.provider.ts`.
- [x] Tạo `mock-online.provider.ts` cho development.
- [x] Tạo skeleton `vnpay`, `momo`, `stripe`.
- [x] Callback/webhook endpoint theo provider.
- [x] Verify callback/mock signature.
- [x] Payment success idempotent.
- [x] Verify amount khớp order total.

Tiêu chí hoàn thành:

- Online mock trả payment URL.
- Callback success mark payment `PAID`.
- Callback lặp lại không trừ kho/email/coupon thêm lần nữa.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 7.
- Thêm enum Prisma `MOCK_ONLINE` và migration `20260606000000_add_mock_online_payment_provider`.
- Payment endpoints: `GET /api/v1/payments/callback/:provider`, `POST /api/v1/payments/webhook/:provider`.
- Mock provider dùng provider param `mock-online` hoặc `MOCK_ONLINE`, ký HMAC bằng `PAYMENT_WEBHOOK_SECRET`.
- `POST /api/v1/checkout/create-order` với `paymentProvider = "MOCK_ONLINE"` tạo order `PENDING_PAYMENT`, payment `PENDING`, trả `paymentUrl`.
- Callback success verify chữ ký + amount, mark payment `PAID`, order `PAID`, trừ kho, ghi `InventoryLog`, tăng coupon usage trong transaction.
- Callback lặp lại với payment đã `PAID` trả success và không chạy lại side effects.

## Phase 8 - Emails

- [x] Tạo module `emails`.
- [x] Email service không nằm trong controller.
- [x] Order confirmation template.
- [x] Payment success template.
- [x] Order status updated template.
- [x] Ghi `EmailLog` cho SENT/FAILED.
- [x] Development fallback console log khi chưa cấu hình SMTP.
- [x] Checkout không fail nếu email fail.

Tiêu chí hoàn thành:

- Order confirmation có order code, items, total, address, payment status.
- SMTP lỗi vẫn tạo order thành công và lưu EmailLog FAILED.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 8.
- Email module nằm tại `backend/src/modules/emails`.
- COD checkout gọi `sendOrderConfirmationEmail(order.id)` sau khi tạo order thành công.
- Online payment success gọi `sendPaymentSuccessEmail(order.id)` sau khi payment callback mark `PAID`; callback lặp lại không gửi lại.
- Nếu SMTP chưa cấu hình, development fallback in nội dung email ra console và ghi `EmailLog` status `SENT`.
- Nếu SMTP lỗi, service ghi `EmailLog` status `FAILED` và không throw ra checkout/payment callback.

## Phase 9 - Admin APIs

- [x] `GET /admin/dashboard`.
- [x] `GET /admin/products`.
- [x] `POST /admin/products`.
- [x] `GET /admin/products/:id`.
- [x] `PATCH /admin/products/:id`.
- [x] `DELETE /admin/products/:id` archive product.
- [x] `GET /admin/orders`.
- [x] `GET /admin/orders/:id`.
- [x] `PATCH /admin/orders/:id/status`.
- [x] `GET /admin/inventory`.
- [x] `PATCH /admin/inventory/:productId/adjust`.
- [x] `GET /admin/coupons`.
- [x] `POST /admin/coupons`.
- [x] `PATCH /admin/coupons/:id`.
- [x] `DELETE /admin/coupons/:id` disable coupon.
- [x] `GET /admin/users`.

Tiêu chí hoàn thành:

- Tất cả admin routes cần JWT admin.
- Customer không truy cập được admin routes.
- Inventory adjustment tạo `InventoryLog`.
- Coupon delete chỉ disable, không hard delete.

Ghi chú kiểm tra:

- Đã code đầy đủ Phase 9.
- Existing admin product routes vẫn dùng module `products/product.admin.routes.ts`.
- Các API dashboard/orders/inventory/coupons/users nằm trong `backend/src/modules/admin`.
- `PATCH /admin/orders/:id/status` restore stock nếu chuyển sang `CANCELLED` sau khi stock đã bị trừ và chưa restore.
- `PATCH /admin/inventory/:productId/adjust` hỗ trợ `IMPORT`, `EXPORT`, `ADJUSTMENT` và tạo `InventoryLog`.
- `DELETE /admin/coupons/:id` chỉ set `isActive = false`.
- `GET /admin/users` không trả `passwordHash`.

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
- Phase 6 Checkout And Orders đã được code.
- Phase 7 Payment Providers đã được code.
- Phase 8 Emails đã được code.
- Phase 9 Admin APIs đã được code.
- Lần code tiếp theo nên bắt đầu từ Phase 10 - Tests And Hardening.
