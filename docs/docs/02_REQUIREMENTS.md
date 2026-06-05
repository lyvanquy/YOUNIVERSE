# 02. Functional Requirements

## 1. Global Requirements

Website cần có 3 trang chính:

1. `/` - Home
2. `/our-universe` - Our UNIverse
3. `/about` - About us

Tất cả các trang cần có:

- Header chung.
- Footer chung.
- Responsive tốt trên desktop, tablet, mobile.
- Animation nhẹ, mượt.
- Style đúng moodboard: trắng, đen, xanh, vàng, đỏ, element blink blink / star / sparkle.
- Tối ưu SEO cơ bản: title, description, semantic HTML.

## 2. Header Requirements

### Vị trí và bố cục

- Logo nằm ở giữa header.
- Logo click vào sẽ điều hướng về trang Home.
- Menu nằm bên trái header.
- Menu gồm 3 item:
  - Home
  - Our UNIverse
  - About us

### Hover effect

Khi hover vào menu:

- Chữ nổi lên nhẹ.
- Màu chữ đổi theo 3 màu thương hiệu:
  - Home: xanh.
  - Our UNIverse: vàng.
  - About us: đỏ.

### Active state

- Menu item của trang hiện tại cần có trạng thái active.
- Active state có thể là underline, màu đậm hơn hoặc small sparkle indicator.

### Mobile

Trên mobile:

- Header chuyển thành menu hamburger.
- Logo vẫn phải rõ ràng.
- Menu mở dạng drawer/dropdown.
- Animation mở menu nhẹ, không giật.

## 3. Footer Requirements

Footer có bố cục giống mẫu nền đen trong brief.

### Nội dung footer

Từ trái qua phải:

1. Logo YOUniverse.
2. Slogan: `A galaxy to hold, a story to be told`.
3. Address: `279 Nguyễn Tri Phương street, Vườn Lài Ward, HCMC`.
4. Contact us gồm 3 social links:
   - TikTok
   - Instagram
   - Facebook
5. Main contact: 8 người, hiển thị thành 2 hàng mỗi hàng 4 người trên desktop.

### Responsive footer

- Desktop: nhiều cột.
- Tablet: 2 cột.
- Mobile: 1 cột, contact cards xếp dọc hoặc grid 1 cột.

## 4. Home Page Requirements

Route: `/`

### Section 1: Header

Dùng Header chung.

### Section 2: Hero Banner

- Có banner lớn ở đầu trang.
- Hiện tại banner chưa có, dùng placeholder.
- Placeholder nên mang cảm giác vũ trụ, sáng, vui, có các hình sparkle/star.
- Khi khách gửi banner thật thì thay ảnh.

### Section 3: Running Slogan / CTA Marquee

Text:

`A galaxy to hold, a story to be told`

Yêu cầu:

- Text chạy từ trái sang phải hoặc lặp ngang.
- Hover vào thì chữ sáng hơn, scale nhẹ hoặc pause animation.
- Click vào chuyển sang `/about` hoặc `/our-universe`.
- Có thể thêm icon sparkle nhỏ chạy cùng text.

### Section 4: Product Line Introduction

Headline:

`Khám Phá Các Hành Tinh`

Hiển thị 3 dòng charm:

1. Astra
   - Text: `Astra - Own your unique name, ignite your inner flame.`
2. Sirius
   - Text: `Sirius - Pack the joy you seek, let your passion speak.`
3. Polaris
   - Text: `Polaris - Trust the guiding quote, let your spirit float.`

Yêu cầu UI:

- Có carousel 3 khối hình ảnh.
- Ảnh sản phẩm sẽ cập nhật sau, dùng placeholder.
- Hover vào từng khối thì hiện chữ/tagline.
- Card có hiệu ứng scale nhẹ hoặc tilt nhẹ.
- Có thể dùng Framer Motion để animate khi section vào viewport.

### Section 5: How to Build Your YOUniverse

Headline:

`How to Build Your YOUniverse`

Steps:

1. Set Your Vibe.
2. Mix & match Astra, Sirius, Polaris.
3. Tell your story.

Yêu cầu layout đề xuất:

- Desktop: 3 step cards nằm ngang theo dạng orbit/timeline.
- Mỗi step là một "planet card" hoặc "orbit node".
- Có đường orbit nét đứt hoặc đường cong nối 3 bước.
- Mỗi card có icon đơn giản:
  - Step 1: sparkle / mood icon.
  - Step 2: mix / puzzle / charm icon.
  - Step 3: story / star trail icon.
- Hover card:
  - Card nổi lên.
  - Border phát sáng nhẹ.
  - Có sparkle xuất hiện.
- Mobile: 3 cards xếp dọc.

### Section 6: Footer

Dùng Footer chung.

## 5. Our UNIverse Page Requirements

Route: `/our-universe`

### Section 1: Header

Dùng Header chung.

### Section 2: Banner

- Có banner cho trang danh sách sản phẩm.
- Hiện tại banner chưa có, dùng placeholder.
- Style đồng bộ với Home.

### Section 3: Product Category

Headline:

`OUR PRODUCTS`

Dưới headline là 3 product cards.

### Product Card 1: Charm Astra

- Image: sẽ update sau.
- Badge: `Unique`.
- Heading: `Charm Astra`.
- Tagline:
  `A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.`
- Price: bỏ dòng này, không hiển thị giá.
- CTA: `Coming soon`.

### Product Card 2: Charm Sirius

- Image: sẽ update sau.
- Badge: `Passion`.
- Heading: `Charm Sirius`.
- Tagline:
  `Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.`
- Price: bỏ dòng này, không hiển thị giá.
- CTA: `Coming soon`.

### Product Card 3: Charm Polaris

- Image: sẽ update sau.
- Badge: `Inspiring`.
- Heading: `Charm Polaris`.
- Tagline:
  `Inspiring quotes that serve as a guiding compass for your soul.`
- Price: bỏ dòng này, không hiển thị giá.
- CTA: `Coming soon`.

### Animation

- 3 product cards hiện từ trái sang phải.
- Khi hover:
  - Ảnh scale nhẹ.
  - Card nâng lên.
  - Button sáng nhẹ.
  - Có thể hiện sparkle nhỏ.

### Section 4: Running Slogan

Text:

`A galaxy to hold, a story to be told`

- Chạy ngang.
- Đồng bộ với Home marquee.

### Section 5: Footer

Dùng Footer chung.

## 6. About Us Page Requirements

Route: `/about`

### Section 1: Header

Dùng Header chung.

### Section 2: Our Story

Headline:

`Từ những cá tính bị rập khuôn đến một vũ trụ tự do.`

Content:

`Khởi nguồn từ những mảnh ghép đầy cá tính tại UEH.ISB, YOUniverse bắt nguồn từ một sự thật khiến chúng mình trăn trở: Thế giới nội tâm của Gen Z vốn đa sắc, cớ sao chúng ta lại phải thu mình trong những món phụ kiện rập khuôn?

YOUniverse ra đời để phá vỡ giới hạn đó. Chúng mình trao cho bạn một không gian sáng tạo: một 'vũ trụ' thu nhỏ, nơi từng chiếc charm sẽ thay bạn kể câu chuyện của riêng mình. Không cần phải lên tiếng, thế giới vẫn sẽ nhận ra bạn là ai, đam mê điều gì và mang bản sắc độc đáo đến nhường nào.`

### Section 3: Our Mission

Content:

`Nhiệm vụ của YOUniverse không phải là bán phụ kiện. Chúng mình bán "quyền được là chính mình". Bằng việc thiết kế các charm mang tính biểu tượng cao, chúng mình giúp bạn mang theo những sở thích bình dị, những điểm tựa tinh thần đi khắp mọi nơi.`

### Section 4: Our Vision

Content:

`Chúng mình mong muốn trở thành thương hiệu phụ kiện cá nhân hóa hàng đầu của Gen Z do chính UEH.ISB-ers sáng lập và làm chủ. Là thương hiệu quà tặng và phụ kiện cá nhân hóa truyền cảm hứng, giúp mỗi người tự tin thể hiện bản sắc, câu chuyện và dấu ấn riêng của mình. Là nơi mỗi người có thể tìm thấy chính mình trong từng sản phẩm.`

### Section 5: Our Core Values

Hiển thị dạng 3 cột trên desktop:

1. `Y - You-nique`
   - `Tôn vinh bản sắc độc bản. Vũ trụ của bạn là duy nhất.`
2. `O - Out-of-the-box`
   - `Tư duy đột phá. Không ngại tùy biến, không ngại điên rồ.`
3. `U - Unconditional connection`
   - `Kết nối vô điều kiện. Hòa hợp cái tôi cá nhân với thế giới xung quanh qua những câu chuyện nhỏ được kể trên từng chiếc charms.`

### Section 6: CTA Button

Text:

`Vậy bạn đã sẵn sàng để tạo ra vũ trụ cho riêng mình chưa?`

Yêu cầu:

- Hover vào thì sáng lên.
- Click chuyển sang `/our-universe`.
- Nút nên nổi bật, có glow effect và sparkle.

### Section 7: Footer

Dùng Footer chung.

## 7. Backend Requirements for Phase 1

Do khách hàng yêu cầu stack có Node.js, PostgreSQL, Prisma, backend nên phục vụ cho:

- Lưu product lines.
- Lưu social links.
- Lưu contact persons.
- Lưu content sections nếu muốn chỉnh nội dung từ database.
- Lưu lead/contact submissions nếu thêm form sau này.
- API public để frontend fetch dữ liệu.

Không cần auth/admin nếu khách chưa xác nhận.

## 8. Non-functional Requirements

- Tốc độ tải nhanh.
- Tối ưu ảnh.
- Responsive.
- Không lỗi console.
- Code tách component rõ ràng.
- Dễ thay ảnh khi khách gửi assets.
- Dễ thay content.
- Dễ mở rộng thành e-commerce.
