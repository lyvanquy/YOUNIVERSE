# 20. E-commerce Extension Backlog

## Purpose

File này ghi lại các chức năng bán hàng thật nếu sau này khách yêu cầu. Hiện tại không nằm trong brief giai đoạn 1.

## Phase 2 Possible Features

### Product Detail Page

Routes:

```txt
/our-universe/astra
/our-universe/sirius
/our-universe/polaris
```

Features:

- Product gallery.
- Description.
- Customization options.
- Coming soon / pre-order.
- Related products.

### Cart

Features:

- Add to cart.
- Update quantity.
- Remove item.
- Cart drawer.
- Cart page.

### Checkout

Features:

- Customer info.
- Shipping address.
- Payment method.
- Order summary.
- Confirm order.

### Payment

Options:

- Manual bank transfer.
- MoMo.
- VNPay.
- ZaloPay.
- Stripe.

Chỉ chọn khi khách yêu cầu.

### Orders

Features:

- Create order.
- Order status.
- Admin view orders.
- Customer receives confirmation.

### Admin Dashboard

Features:

- Login.
- Manage products.
- Manage content.
- Manage orders.
- Manage contacts/social links.

### Inventory

Features:

- Stock quantity.
- Low stock warning.
- Sold out.

### Coupon

Features:

- Discount code.
- Expiry date.
- Usage limit.

## Additional Database Models

Nếu triển khai e-commerce, có thể thêm:

```txt
User
ProductVariant
Cart
CartItem
Order
OrderItem
Payment
ShippingAddress
Coupon
AdminUser
```

## Warning

Không thêm các model này vào Phase 1 nếu chưa được xác nhận. Làm vậy sẽ khiến project phức tạp hơn, tăng thời gian và dễ lệch yêu cầu khách hàng.

## Recommended Upgrade Path

1. Hoàn thành Phase 1 landing pages.
2. Khách duyệt UI/brand.
3. Hỏi khách có bán hàng thật không.
4. Nếu có, viết scope Phase 2.
5. Thiết kế database e-commerce.
6. Code admin + cart + order.
7. Tích hợp payment.
