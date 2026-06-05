# 01. Project Overview

## Tên dự án

YOUniverse / UNIverse Website

## Mô tả ngắn

YOUniverse là website giới thiệu thương hiệu phụ kiện cá nhân hóa dành cho Gen Z. Website truyền tải ý tưởng mỗi người có một "vũ trụ" riêng, và các dòng charm Astra, Sirius, Polaris giúp người dùng thể hiện cá tính, câu chuyện và dấu ấn cá nhân.

## Mục tiêu website

Website cần đạt các mục tiêu chính:

1. Truyền tải được nhận diện thương hiệu YOUniverse.
2. Tạo cảm giác trẻ trung, vui, sáng tạo, cá tính, có hơi hướng vũ trụ.
3. Giới thiệu 3 dòng charm:
   - Astra
   - Sirius
   - Polaris
4. Cho người dùng hiểu câu chuyện, sứ mệnh, tầm nhìn và giá trị cốt lõi của thương hiệu.
5. Tạo nền tảng để mở rộng thành website bán hàng trong giai đoạn sau.

## Giai đoạn 1

Giai đoạn 1 gồm 3 landing page:

| Chức năng | Tên trang |
|---|---|
| Trang chủ | Home |
| Trang danh sách sản phẩm | Our UNIverse |
| Giới thiệu về công ty/dự án | About us |

## Phạm vi hiện tại

Trong brief hiện tại, các chức năng được yêu cầu chủ yếu là:

- Header.
- Footer.
- Banner.
- Marquee slogan.
- Carousel / product line introduction.
- Product cards.
- About sections.
- CTA button.
- Hover effects.
- Animation nhẹ.
- Responsive layout.

## Chưa có trong brief

Các chức năng sau chưa được mô tả rõ trong brief:

- Đăng nhập / đăng ký.
- Giỏ hàng.
- Checkout.
- Thanh toán online.
- Quản lý đơn hàng.
- Trang chi tiết sản phẩm đầy đủ.
- Admin dashboard.
- Tồn kho.
- Mã giảm giá.
- Email xác nhận đơn hàng.

## Đề xuất hướng triển khai

Triển khai trước theo hướng landing page có cấu trúc tốt, sau đó có thể mở rộng thành e-commerce.

Frontend dùng Next.js, React, TypeScript, Tailwind CSS, Framer Motion.

Backend/API có thể dùng Next.js Route Handlers chạy trên Node.js runtime. Database dùng PostgreSQL, Prisma ORM để lưu dữ liệu website như products, social links, contacts, page content, lead submissions.

## Đối tượng người dùng

- Gen Z.
- Sinh viên.
- Người thích phụ kiện cá nhân hóa.
- Người thích quà tặng có câu chuyện riêng.
- Khách hàng quan tâm đến style vui, sáng tạo, độc bản.

## Tông cảm xúc

Website nên tạo cảm giác:

- Playful.
- Creative.
- Youthful.
- Bright.
- Personal.
- Cosmic.
- Blink blink.
- Tự do thể hiện bản thân.

## Ngôn ngữ giao diện

Brief hiện có cả tiếng Anh và tiếng Việt.

Đề xuất:

- Menu và heading chính: có thể dùng tiếng Anh theo brief.
- Nội dung câu chuyện: tiếng Việt.
- Product line tagline: tiếng Anh.
- Nút CTA: tiếng Việt hoặc song ngữ tùy khách chốt.

## Nguyên tắc quan trọng

Không được hiểu nhầm đây là website bán hàng đầy đủ nếu khách chưa xác nhận. Hiện tại đúng hơn là website giới thiệu thương hiệu và giới thiệu sản phẩm ở trạng thái Coming soon.
