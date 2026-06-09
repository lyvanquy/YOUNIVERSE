# Backend 03. Database Rules

## 1. User

- Email unique.
- Password không lưu plain text, chỉ lưu `passwordHash`.
- Role mặc định là `CUSTOMER`.
- Admin được seed thủ công hoặc tạo bằng script riêng.

## 2. Product

- `slug` unique.
- `price` bắt buộc lớn hơn 0.
- `salePrice` nếu có phải nhỏ hơn `price`.
- Product có thể thuộc 1 category.
- Product line bắt buộc thuộc:
  - ASTRA
  - SIRIUS
  - POLARIS

## 3. Inventory

- Mỗi product có 1 inventory record.
- `quantity` không được âm.
- Khi đơn hoàn tất hoặc paid thì cập nhật:
  - quantity giảm
  - soldQuantity tăng
- Nếu hủy đơn đã trừ kho:
  - quantity tăng lại
  - soldQuantity giảm nếu cần

## 4. Cart

- Guest cart dùng `sessionId`.
- User cart dùng `userId`.
- Khi login:
  - tìm cart session
  - tìm cart user active
  - merge items
  - xóa hoặc đánh dấu abandoned cart session

## 5. Order

- `orderCode` unique, format đề xuất:

```txt
YOU-YYYYMMDD-XXXXXX
```

Ví dụ:

```txt
YOU-20260605-8F2K9A
```

- Khi tạo order, copy dữ liệu product vào order item:
  - productName
  - unitPrice
  - imageUrl
  - sku

Lý do: sau này sản phẩm đổi giá/tên thì lịch sử đơn không bị sai.

## 6. Payment

- Một order có thể có nhiều payment transaction.
- Transaction mới nhất trạng thái PAID là transaction hợp lệ.
- Không cập nhật order PAID nếu payment callback chưa verify.

## 7. Coupon

- `code` unique và nên uppercase.
- Khi apply coupon:
  - validate trước
  - tính discount
  - không tăng usedCount ngay nếu chưa tạo order
- Khi order thành công:
  - tăng usedCount
  - tạo CouponUsage

## 8. Decimal money

Dùng Decimal trong Prisma/PostgreSQL.

Không dùng Float để lưu tiền.

## 9. Soft delete

Sản phẩm không nên xóa cứng nếu đã có order.

Dùng:

```txt
status = ARCHIVED
```

## 10. Index

Các trường cần index:

- Product: slug, status, productLine
- Order: orderCode, status, customerEmail, createdAt
- Payment: providerTxnId, status
- Coupon: code
