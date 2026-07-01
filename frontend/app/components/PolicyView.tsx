'use client';

import { Shield, Truck, Phone, AlertTriangle, CheckCircle, XCircle, Sparkles, Heart } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';

export default function PolicyView() {
  const { language } = useYouniverseApp();

  return (
    <div className="pb-24 space-y-20 text-stone-800 relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* 1. Banner */}
      <section className="relative overflow-hidden h-48 sm:h-64 rounded-3xl mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mt-6 shadow-sm border border-stone-200 bg-gradient-to-br from-stone-900 via-purple-950 to-stone-900 flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute top-6 right-8 text-purple-400 animate-twinkle">✦</div>
        <div className="absolute bottom-8 left-10 text-amber-400 animate-twinkle duration-2000">✦</div>
        <div className="mx-auto max-w-xl text-center space-y-3 relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-2">
            <Shield className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
              {language === 'vi' ? 'Chính sách' : 'Policies'}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider select-none">
            {language === 'vi' ? 'Chính sách' : 'Our Policies'}
          </h1>
          <p className="font-sans text-stone-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {language === 'vi'
              ? 'Đổi trả, bảo hành & vận chuyển'
              : 'Returns, warranty & shipping'}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION A: CHÍNH SÁCH ĐỔI TRẢ & BẢO HÀNH     */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-black uppercase tracking-tight">
            {language === 'vi' ? 'Chính sách đổi trả & bảo hành' : 'Return & Warranty Policy'}
          </h2>
          <p className="font-sans text-stone-500 text-sm leading-relaxed max-w-2xl mx-auto">
            {language === 'vi'
              ? 'YOUniverse luôn mong muốn mang đến những sản phẩm chất lượng và trải nghiệm mua sắm tốt nhất cho khách iu. Để đảm bảo quyền lợi của khách hàng, chúng mình áp dụng chính sách đổi trả và bảo hành như sau:'
              : 'YOUniverse is committed to delivering quality products and the best shopping experience. To protect your rights, we apply the following return and warranty policies:'}
          </p>
        </div>

        {/* ─── 1. Chính sách đổi trả ─── */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <span className="font-display text-[10px] font-bold text-purple-500 uppercase tracking-widest">01</span>
              <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                {language === 'vi' ? 'Chính sách đổi trả' : 'Return Policy'}
              </h3>
            </div>
          </div>

          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            {language === 'vi'
              ? 'YOUniverse hỗ trợ đổi/trả sản phẩm trong vòng 02 ngày kể từ ngày khách hàng nhận được hàng đối với các trường hợp:'
              : 'YOUniverse supports product exchange/return within 02 days from the date of delivery for the following cases:'}
          </p>

          {/* Eligible cases */}
          <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="font-display text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {language === 'vi' ? 'Được hỗ trợ đổi/trả' : 'Eligible for return'}
              </span>
            </div>
            {(language === 'vi'
              ? [
                  'Giao thiếu sản phẩm.',
                  'Giao sai sản phẩm so với đơn đặt hàng.',
                  'Sản phẩm bị lỗi hoặc hư hỏng do quá trình vận chuyển.',
                  'Sản phẩm bị lỗi từ phía nhà sản xuất.',
                ]
              : [
                  'Missing products in delivery.',
                  'Wrong product delivered vs. order.',
                  'Product damaged during shipping.',
                  'Manufacturing defect.',
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="font-sans text-stone-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Conditions */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="font-display text-xs font-bold text-amber-700 uppercase tracking-wider">
                {language === 'vi' ? 'Điều kiện áp dụng' : 'Conditions'}
              </span>
            </div>
            {(language === 'vi'
              ? [
                  'Khách iu vui lòng quay video unbox từ lúc còn nguyên kiện hàng đến khi kiểm tra sản phẩm.',
                  'Video cần được quay liên tục, rõ nét, không cắt ghép, không chỉnh sửa hoặc tua nhanh.',
                  'Sản phẩm cần còn đầy đủ phụ kiện, bao bì và chưa có dấu hiệu sử dụng.',
                ]
              : [
                  'Please record an unboxing video from the sealed package to product inspection.',
                  'Video must be continuous, clear, unedited, and not sped up.',
                  'Product must include all accessories, packaging, and show no signs of use.',
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                <p className="font-sans text-stone-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Not eligible */}
          <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-4 w-4 text-rose-500" />
              <span className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider">
                {language === 'vi' ? 'Chưa thể hỗ trợ đổi/trả' : 'Not eligible'}
              </span>
            </div>
            {(language === 'vi'
              ? [
                  'Khách hàng thay đổi nhu cầu hoặc sở thích cá nhân.',
                  'Sản phẩm bị hư hỏng do sử dụng, bảo quản không đúng cách.',
                  'Liên hệ đổi trả sau thời gian quy định.',
                ]
              : [
                  'Change of mind or personal preference.',
                  'Product damaged due to improper use or storage.',
                  'Return request after the designated period.',
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                <p className="font-sans text-stone-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 2. Chính sách bảo hành ─── */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="font-display text-[10px] font-bold text-blue-500 uppercase tracking-widest">02</span>
              <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                {language === 'vi' ? 'Chính sách bảo hành' : 'Warranty Policy'}
              </h3>
            </div>
          </div>

          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            {language === 'vi'
              ? 'YOUniverse hỗ trợ bảo hành đối với các lỗi phát sinh từ quá trình sản xuất, bao gồm:'
              : 'YOUniverse provides warranty for manufacturing defects, including:'}
          </p>

          <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-6 space-y-3">
            {(language === 'vi'
              ? [
                  'Sản phẩm nhận được không đúng mẫu hoặc thiếu charm so với đơn hàng đã đặt.',
                  'Móc khóa bị lỏng lẻo khiến các charm bị rời ra.',
                  'Charm bị nứt, gãy hoặc biến dạng bất thường ngay khi nhận hàng hoặc trong thời gian ngắn sử dụng do lỗi sản xuất.',
                  'Khoen, móc khóa hoặc phụ kiện kim loại bị tuột khỏi sản phẩm do lỗi gia công.',
                ]
              : [
                  'Product received doesn\'t match the ordered design or is missing charms.',
                  'Keychain is loose, causing charms to fall off.',
                  'Charm is cracked, broken, or abnormally deformed upon receipt or shortly after due to manufacturing defect.',
                  'Keyring, clasp, or metal accessories detach from the product due to assembly defect.',
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                <p className="font-sans text-stone-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Handmade note */}
          <div className="relative bg-stone-900 text-white rounded-2xl p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="absolute top-4 right-6 text-amber-400 animate-twinkle text-sm">✦</div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-amber-400" />
                <span className="font-display text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {language === 'vi' ? 'Một số lưu ý nho nhỏ' : 'A Few Small Notes'}
                </span>
              </div>
              <p className="font-sans text-stone-300 text-sm leading-relaxed">
                {language === 'vi'
                  ? 'Tất cả sản phẩm tại YOUniverse đều được làm thủ công và hoàn thiện bằng tay, nên mỗi bé móc khóa sẽ có một chút khác biệt riêng. Vì vậy, bạn iu có thể gặp những trường hợp như:'
                  : 'All YOUniverse products are handmade and hand-finished, so each keychain has its own unique character. You may notice:'}
              </p>
              <div className="space-y-2">
                {(language === 'vi'
                  ? [
                      'Chênh lệch nhẹ về màu sắc do quá trình tô màu thủ công hoặc điều kiện ánh sáng khi chụp ảnh.',
                      'Kích thước có thể sai số nhỏ sau quá trình co nhiệt.',
                      'Độ dày của lớp resin hoặc độ bóng có thể khác nhau đôi chút giữa các sản phẩm.',
                      'Các chi tiết vẽ tay, vị trí màu sắc hoặc nét vẽ có thể không hoàn toàn giống 100% so với hình ảnh mẫu.',
                      'Có thể xuất hiện một vài bọt khí rất nhỏ hoặc vết thủ công không đáng kể trên lớp resin.',
                    ]
                  : [
                      'Slight color differences due to hand-coloring or lighting conditions.',
                      'Minor size variations after heat-shrinking.',
                      'Resin thickness or gloss may vary slightly between products.',
                      'Hand-drawn details may not be 100% identical to sample images.',
                      'Tiny air bubbles or minor handcraft marks may appear on the resin layer.',
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                    <p className="font-sans text-stone-400 text-xs leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <p className="font-sans text-stone-400 text-xs leading-relaxed pt-2 border-t border-stone-700">
                {language === 'vi'
                  ? 'Những khác biệt nhỏ mang tính đặc trưng của sản phẩm handmade sẽ không được xem là lỗi sản xuất. YOUniverse chỉ hỗ trợ đổi/trả khi sản phẩm có sai khác quá lớn, ảnh hưởng nghiêm trọng đến tính thẩm mỹ hoặc khả năng sử dụng. Mong bạn iu thông cảm và yêu thương những nét riêng trong từng sản phẩm của YOUniverse nha 💖'
                  : 'These minor handmade characteristics are not considered manufacturing defects. YOUniverse only supports returns when differences significantly affect aesthetics or usability. We hope you\'ll appreciate the unique charm in every handcrafted piece 💖'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── 3. Thông tin liên hệ ─── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <span className="font-display text-[10px] font-bold text-rose-500 uppercase tracking-widest">03</span>
              <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
              </h3>
            </div>
          </div>

          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            {language === 'vi'
              ? 'Nếu cần hỗ trợ về đổi trả hoặc bảo hành, khách iu vui lòng liên hệ với YOUniverse qua:'
              : 'For return or warranty support, please contact YOUniverse via:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(language === 'vi'
              ? [
                  { icon: '💬', title: 'Fanpage', desc: 'Tin nhắn trực tiếp trên fanpage' },
                  { icon: '🛒', title: 'Kênh bán hàng', desc: 'Kênh bán hàng chính thức' },
                  { icon: '📞', title: 'Hotline', desc: 'Thông tin liên hệ trên từng nền tảng' },
                ]
              : [
                  { icon: '💬', title: 'Fanpage', desc: 'Direct message on fanpage' },
                  { icon: '🛒', title: 'Sales Channel', desc: 'Official sales channels' },
                  { icon: '📞', title: 'Hotline', desc: 'Contact info on each platform' },
                ]
            ).map((c) => (
              <div key={c.title} className="bg-white border border-stone-200/80 rounded-2xl p-5 text-center space-y-2 hover:shadow-md hover:border-stone-300 transition-all duration-300">
                <span className="text-2xl">{c.icon}</span>
                <p className="font-display text-xs font-bold text-stone-900 uppercase tracking-wider">{c.title}</p>
                <p className="font-sans text-stone-500 text-[11px]">{c.desc}</p>
              </div>
            ))}
          </div>

          <p className="font-sans text-stone-500 text-sm text-center italic">
            {language === 'vi'
              ? 'YOUniverse chân thành cảm ơn khách iu đã tin tưởng và đồng hành cùng chúng mình 💜'
              : 'YOUniverse sincerely thanks you for your trust and support 💜'}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-8">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION B: CHÍNH SÁCH VẬN CHUYỂN              */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-black uppercase tracking-tight">
            {language === 'vi' ? 'Chính sách vận chuyển' : 'Shipping Policy'}
          </h2>
          <p className="font-sans text-stone-500 text-sm leading-relaxed max-w-2xl mx-auto">
            {language === 'vi'
              ? 'YOUniverse luôn cố gắng mang những bé móc khóa đáng yêu đến tay khách iu nhanh chóng và an toàn nhất.'
              : 'YOUniverse strives to deliver your adorable keychains quickly and safely.'}
          </p>
        </div>

        {/* ─── 1. Giao hàng qua đơn vị vận chuyển ─── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <span className="font-display text-[10px] font-bold text-emerald-500 uppercase tracking-widest">01</span>
              <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                {language === 'vi' ? 'Giao hàng qua đơn vị vận chuyển' : 'Carrier Delivery'}
              </h3>
            </div>
          </div>

          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            {language === 'vi'
              ? 'YOUniverse hỗ trợ giao hàng toàn quốc thông qua Viettel Post. Phí vận chuyển dao động tùy theo khu vực nhận hàng.'
              : 'YOUniverse supports nationwide delivery via Viettel Post. Shipping fees vary by region.'}
          </p>

          {/* Delivery times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-2 hover:shadow-md transition-all">
              <p className="font-display text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City'}
              </p>
              <p className="font-display text-3xl font-black text-emerald-500">1–3</p>
              <p className="font-sans text-stone-500 text-xs">
                {language === 'vi' ? 'ngày làm việc' : 'business days'}
              </p>
            </div>
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-2 hover:shadow-md transition-all">
              <p className="font-display text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === 'vi' ? 'Các tỉnh/thành khác' : 'Other provinces'}
              </p>
              <p className="font-display text-3xl font-black text-blue-500">3–7</p>
              <p className="font-sans text-stone-500 text-xs">
                {language === 'vi' ? 'ngày làm việc' : 'business days'}
              </p>
            </div>
          </div>

          <p className="font-sans text-stone-500 text-xs leading-relaxed bg-stone-50 rounded-xl p-4 border border-stone-200/60">
            {language === 'vi'
              ? 'Sau khi đơn hàng được xác nhận và bàn giao cho đơn vị vận chuyển, chúng mình sẽ gửi mã vận đơn để khách iu tiện theo dõi hành trình của đơn hàng.'
              : 'Once your order is confirmed and handed to the carrier, we\'ll send a tracking number so you can follow your package.'}
          </p>
        </div>

        {/* ─── 2. Nhận hàng trực tiếp ─── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <span className="font-display text-[10px] font-bold text-amber-500 uppercase tracking-widest">02</span>
              <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                {language === 'vi' ? 'Nhận hàng trực tiếp' : 'In-Person Pickup'}
              </h3>
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-6 space-y-3">
            <p className="font-sans text-stone-700 text-sm leading-relaxed">
              {language === 'vi'
                ? 'Khách iu cũng có thể lựa chọn nhận hàng trực tiếp tại Cơ sở B – UEH để tiết kiệm chi phí vận chuyển.'
                : 'You can also pick up your order at UEH Campus B to save on shipping costs.'}
            </p>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-amber-200/60">
              <div className="text-2xl">🕐</div>
              <div>
                <p className="font-display text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {language === 'vi' ? 'Khung giờ giao' : 'Pickup hours'}
                </p>
                <p className="font-sans text-stone-600 text-sm">
                  {language === 'vi' ? 'Thứ 2 - Thứ 6, 9h00 - 11h00' : 'Monday - Friday, 9:00 AM - 11:00 AM'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. Lưu ý ─── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <span className="font-display text-[10px] font-bold text-rose-500 uppercase tracking-widest">03</span>
              <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                {language === 'vi' ? 'Một vài lưu ý nhỏ' : 'A Few Notes'}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5">
              <p className="font-sans text-stone-600 text-sm leading-relaxed">
                {language === 'vi'
                  ? 'YOUniverse không chịu trách nhiệm đối với các trường hợp giao hàng chậm do thiên tai, thời tiết xấu, sự cố từ đơn vị vận chuyển hoặc các nguyên nhân bất khả kháng khác.'
                  : 'YOUniverse is not responsible for delivery delays caused by natural disasters, bad weather, carrier issues, or other force majeure events.'}
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5">
              <p className="font-sans text-stone-600 text-sm leading-relaxed">
                {language === 'vi'
                  ? 'Khách iu vui lòng kiểm tra kỹ thông tin người nhận (họ tên, số điện thoại, địa chỉ) trước khi xác nhận đơn hàng để tránh phát sinh chi phí giao lại hoặc chậm trễ trong quá trình vận chuyển.'
                  : 'Please double-check recipient information (name, phone, address) before confirming your order to avoid redelivery charges or delays.'}
              </p>
            </div>
          </div>

          <p className="font-sans text-stone-500 text-sm text-center italic">
            {language === 'vi'
              ? 'YOUniverse chân thành cảm ơn khách iu đã tin tưởng và đồng hành cùng chúng mình.'
              : 'YOUniverse sincerely thanks you for your trust and support.'}
          </p>
        </div>
      </section>
    </div>
  );
}
