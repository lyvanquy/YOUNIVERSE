'use client';

import Image from 'next/image';
import { Sparkles, Heart, Compass, Search, Quote } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';
import type { ShowcaseProduct, ShowcaseVariant } from '../lib/api';

interface ProductsViewProps {
  showcaseProducts: ShowcaseProduct[];
  initialError?: string | null;
}

type ProductLine = 'ASTRA' | 'SIRIUS' | 'POLARIS';

const LINE_COLORS: Record<ProductLine, { badge: string; badgeBg: string }> = {
  ASTRA: { badge: 'bg-blue-600/90', badgeBg: 'bg-blue-600' },
  SIRIUS: { badge: 'bg-amber-500/90', badgeBg: 'bg-amber-500' },
  POLARIS: { badge: 'bg-rose-500/90', badgeBg: 'bg-rose-500' },
};

const LINE_NAV: Record<ProductLine, { iconName: string; iconColor: string; hoverBg: string; hoverShadow: string }> = {
  ASTRA: { iconName: 'sparkles', iconColor: 'text-blue-500', hoverBg: 'hover:bg-blue-600', hoverShadow: 'hover:shadow-[0_4px_20px_rgba(59,130,246,0.35)]' },
  SIRIUS: { iconName: 'heart', iconColor: 'text-amber-500', hoverBg: 'hover:bg-amber-500', hoverShadow: 'hover:shadow-[0_4px_20px_rgba(245,158,11,0.35)]' },
  POLARIS: { iconName: 'compass', iconColor: 'text-rose-500', hoverBg: 'hover:bg-rose-500', hoverShadow: 'hover:shadow-[0_4px_20px_rgba(244,63,94,0.35)]' },
};

const sectionIcon = (name: string, className: string) => {
  if (name === 'sparkles') return <Sparkles className={className} />;
  if (name === 'heart') return <Heart className={className} />;
  if (name === 'compass') return <Compass className={className} />;
  return null;
};



/* ─── Testimonial Carousel ─── */
interface Testimonial {
  name: string;
  image: string;
  charm: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Minh Quang',
    image: '/images/testimonial-minh-quang.jpg',
    charm: 'Charm Astra',
    quote: 'Thật ra ban đầu không kỳ vọng nhiều lắm, nhưng cầm lên tay thấy chắc hơn mình nghĩ. Nhìn vào charm là thấy đúng mình, không cần giải thích gì thêm.',
  },
  {
    name: 'Thuỳ Linh',
    image: '/images/testimonial-thuy-linh.jpg',
    charm: 'Charm Sirius',
    quote: 'Hồi đầu cũng phân vân không biết chọn cái nào, nhưng chọn xong rồi thì thấy đúng luôn. Đeo lên rồi mới thấy cái nhỏ xíu vậy mà nói được nhiều thứ thiệt.',
  },
  {
    name: 'Hạnh Nguyên',
    image: '/images/testimonial-hanh-nguyen.jpg',
    charm: 'Charm Polaris',
    quote: 'Nhìn ảnh trên mạng với cầm trên tay khác nhau nhiều lắm, ý là cầm trên tay đẹp hơn. Màu sắc tươi, in rõ nét, xinh hơn mình tưởng nhiều.',
  },
  {
    name: 'Ngọc Anh',
    image: '/images/testimonial-ngoc-anh.jpg',
    charm: 'Charm Astra',
    quote: 'Mua tặng bạn thân nhân dịp sinh nhật, chọn theo đúng sở thích của bạn. Bạn nhận xong nhắn lại là thích lắm, xài ngay luôn không cất. Chắc lần sau order thêm cái cho bản thân mình luôn quá.',
  },
];

export function TestimonialCarousel({ language }: { language: 'vi' | 'en' }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 mb-2">
          {language === 'vi' ? 'Khách hàng của chúng tôi' : 'Our Customers'}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          YOUniverse <span className="text-stone-400">&</span> YOU
        </h2>
      </div>

      {/* 4-column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group/card hover:-translate-y-1"
          >
            {/* Customer photo */}
            <div className="h-52 overflow-hidden">
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <Quote className="h-4 w-4 text-amber-400/60" />
              <p className="font-sans text-stone-600 text-xs leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <p className="font-display text-sm font-bold text-stone-900">{t.name}</p>
                <p className="font-sans text-[10px] text-amber-600 font-semibold uppercase tracking-wider">{t.charm}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ─── Material Showcase ─── */
export function MaterialShowcase({ language }: { language: 'vi' | 'en' }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      {/* Section badge + title */}
      <div className="text-center mb-12">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 mb-2">
          {language === 'vi' ? 'Chất liệu & Trải nghiệm' : 'Material & Experience'}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          Premium Heat-Shrink Plastic
        </h2>
        <p className="font-sans text-stone-500 text-xs mt-2">
          {language === 'vi' ? 'Chất liệu co nhiệt cao cấp' : 'High-quality heat-shrink material'}
        </p>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left — Material Image */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#f5f5f7] aspect-[4/3] group">
          <img
            src="/images/material-showcase.jpg"
            alt="Chất liệu co nhiệt thủ công của charm YOUniverse"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-700">
              Handcrafted Quality
            </span>
          </div>
        </div>

        {/* Right — Content */}
        <div className="space-y-8">
          {/* Block 1: Chất liệu */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h3 className="font-display text-base font-extrabold text-stone-900 uppercase tracking-wide">
                {language === 'vi' ? 'Chất liệu' : 'Material'}
              </h3>
            </div>
            <p className="font-sans text-stone-600 text-sm leading-relaxed pl-[38px]">
              {language === 'vi'
                ? 'Mỗi sản phẩm là sự kết hợp hoàn hảo giữa phôi nhựa màng co được gia nhiệt để đạt độ cứng cáp tuyệt đối, phủ bề mặt bóng bẩy và khóa trọn dải màu sắc nét.'
                : 'Each product is a perfect combination of heat-shrink film heated to absolute rigidity, with a glossy surface finish that locks in vibrant, sharp colors.'}
            </p>
          </div>

          <div className="border-t border-stone-200 ml-[38px]" />

          {/* Block 2: Trải nghiệm số */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Search className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <h3 className="font-display text-base font-extrabold text-stone-900 uppercase tracking-wide">
                {language === 'vi' ? 'Trải nghiệm số' : 'Digital Experience'}
              </h3>
            </div>
            <p className="font-sans text-stone-600 text-sm leading-relaxed pl-[38px]">
              {language === 'vi'
                ? 'Dựa trên dữ liệu bình chọn từ hàng trăm bạn trẻ, chúng mình đã lưu kho những thiết kế được yêu thích nhất. Việc của bạn chỉ là thực hiện 4 bước đơn giản ngay trên website:'
                : 'Based on voting data from hundreds of young people, we\'ve curated the most popular designs. All you need to do is follow 4 simple steps right on our website:'}
            </p>

            <div className="grid grid-cols-2 gap-3 pl-[38px] pt-2">
              {[
                { step: '01', label: language === 'vi' ? 'Chọn dòng Charm' : 'Choose Charm Line' },
                { step: '02', label: language === 'vi' ? 'Chọn thiết kế yêu thích' : 'Pick your design' },
                { step: '03', label: language === 'vi' ? 'Cá nhân hóa thông tin' : 'Personalize details' },
                { step: '04', label: language === 'vi' ? 'Đặt hàng & nhận charm' : 'Order & receive' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-2.5 bg-[#f5f5f7] rounded-xl p-3">
                  <span className="font-display text-[10px] font-black text-amber-500 mt-0.5">{s.step}</span>
                  <span className="font-sans text-xs text-stone-700 font-medium leading-snug">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Astra Product Showcase ─── */
export function AstraShowcase({ language }: { language: 'vi' | 'en' }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      {/* Split layout — image left, content right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left — Product Image */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#f5f5f7] aspect-[4/3] group order-2 lg:order-1">
          <Image
            src="/images/product-astra.png"
            alt="Charm Astra cá nhân hóa tên riêng"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Floating line badge */}
          <div className="absolute top-4 left-4 bg-blue-600 rounded-full px-4 py-1.5 shadow-lg">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-white">
              Charm Astra
            </span>
          </div>
        </div>

        {/* Right — Content */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              {language === 'vi' ? 'Tuyên ngôn độc bản' : 'Your Unique Identifier'}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight leading-tight">
            Astra
            <span className="block text-blue-600 text-lg md:text-xl font-extrabold mt-1">
              {language === 'vi' ? 'Lõi quỹ đạo của bạn' : 'The core of your orbit'}
            </span>
          </h2>

          {/* Description */}
          <p className="font-sans text-stone-600 text-sm md:text-base leading-relaxed max-w-lg">
            {language === 'vi'
              ? 'Astra xoay quanh cái TÔI duy nhất. Hãy khắc lên đó Tên hoặc Nickname thân thuộc, kết hợp cùng các biểu tượng hệ mặt trời hoặc năng lượng ngũ hành. Đây là bản quyền không thể sao chép của riêng bạn.'
              : 'Astra revolves around YOU. Customize it with your Name or Nickname, surrounded by the cosmic energy of solar system elements or the five elemental forces. It is the definitive proof of your unique existence.'}
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(language === 'vi'
              ? ['Tên / Nickname', 'Hệ mặt trời', 'Ngũ hành', 'Thiết kế độc bản']
              : ['Name / Nickname', 'Solar System', 'Five Elements', 'Unique Design']
            ).map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 text-stone-600 font-sans text-[11px] font-medium px-3 py-1.5 rounded-full border border-stone-200/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <a
              href="/order"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 cursor-pointer group"
            >
              <span>{language === 'vi' ? 'Mua ngay' : 'Buy Now'}</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sirius Product Showcase ─── */
export function SiriusShowcase({ language }: { language: 'vi' | 'en' }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      {/* Split layout — content left, image right (flipped from Astra) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left — Content */}
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5">
            <Heart className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
              {language === 'vi' ? 'Đam mê cất lời' : 'The Unspoken Passion'}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight leading-tight">
            Sirius
            <span className="block text-amber-500 text-lg md:text-xl font-extrabold mt-1">
              {language === 'vi' ? 'Để niềm vui tự cất tiếng' : 'Let your joys speak'}
            </span>
          </h2>

          {/* Description */}
          <p className="font-sans text-stone-600 text-sm md:text-base leading-relaxed max-w-lg">
            {language === 'vi'
              ? 'Sirius gói gọn phong cách sống của bạn qua các biểu tượng thịnh hành nhất do chính Gen Z bình chọn: từ thú cưng (vẹt, chó, mèo), niềm đam mê thường nhật (cà phê, trà sữa, điểm A+, tài chính) cho đến các hoạt động thể chất (tạ, giày chạy, vợt cầu lông).'
              : 'Sirius captures your lifestyle through vibrant icons: your sweet pets (parrots, dogs, cats), your everyday fuel (coffee, matcha, bubble tea, striking an A+, or manifesting wealth), and your active spirit (weights, running shoes, rackets).'}
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(language === 'vi'
              ? ['Thú cưng', 'Đam mê', 'Thể thao', 'Gen Z bình chọn']
              : ['Pets', 'Passions', 'Sports', 'Voted by Gen Z']
            ).map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 text-stone-600 font-sans text-[11px] font-medium px-3 py-1.5 rounded-full border border-stone-200/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <a
              href="/order"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 cursor-pointer group"
            >
              <span>{language === 'vi' ? 'Mua ngay' : 'Buy Now'}</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Right — Product Image */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#f5f5f7] aspect-[4/3] group">
          <Image
            src="/images/product-sirius.png"
            alt="Charm Sirius thể hiện sở thích cá nhân"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Floating line badge */}
          <div className="absolute top-4 right-4 bg-amber-500 rounded-full px-4 py-1.5 shadow-lg">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-white">
              Charm Sirius
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Polaris Product Showcase ─── */
export function PolarisShowcase({ language }: { language: 'vi' | 'en' }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      {/* Split layout — image left, content right (zigzag: same as Astra) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left — Product Image */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#f5f5f7] aspect-[4/3] group order-2 lg:order-1">
          <Image
            src="/images/product-polaris.png"
            alt="Charm Polaris mang thông điệp truyền cảm hứng"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-rose-500 rounded-full px-4 py-1.5 shadow-lg">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-white">
              Charm Polaris
            </span>
          </div>
        </div>

        {/* Right — Content */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5">
            <Compass className="h-3.5 w-3.5 text-rose-500" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
              {language === 'vi' ? 'Kim chỉ nam cảm xúc' : 'The Guiding Spirit'}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight leading-tight">
            Polaris
            <span className="block text-rose-500 text-lg md:text-xl font-extrabold mt-1">
              {language === 'vi' ? 'Mỏ neo cảm xúc của bạn' : 'The emotional anchor'}
            </span>
          </h2>

          {/* Description */}
          <p className="font-sans text-stone-600 text-sm md:text-base leading-relaxed max-w-lg">
            {language === 'vi'
              ? 'Polaris tổng hợp những câu quote "chạm trúng tim đen" về áp lực học tập, cuộc sống hay động lực tiến bước. Hãy chọn kim chỉ nam cho tâm hồn mình.'
              : 'Polaris features the most relatable quotes about life\'s pressures, studies, and dreams. Choose the words that keep you grounded.'}
          </p>

          {/* Pro tip callout */}
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 max-w-lg">
            <p className="font-sans text-stone-600 text-xs leading-relaxed">
              <span className="font-bold text-rose-500">💡 {language === 'vi' ? 'Bật mí' : 'Pro tip'}:</span>{' '}
              {language === 'vi'
                ? 'Bạn hoàn toàn có thể thay thế Polaris bằng một chiếc charm Sirius thứ 2 nếu đam mê của bạn là không thể chứa hết trong một chiếc!'
                : 'If your passions are overflowing, you can swap Polaris for a second Sirius charm to complete your trio!'}
            </p>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(language === 'vi'
              ? ['Quotes cảm xúc', 'Động lực', 'Áp lực & Hy vọng', 'Tùy chọn linh hoạt']
              : ['Emotional Quotes', 'Motivation', 'Pressure & Hope', 'Flexible Options']
            ).map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 text-stone-600 font-sans text-[11px] font-medium px-3 py-1.5 rounded-full border border-stone-200/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <a
              href="/order"
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 cursor-pointer group"
            >
              <span>{language === 'vi' ? 'Mua ngay' : 'Buy Now'}</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Visual 4 Steps ─── */
export function Visual4Steps({ language }: { language: 'vi' | 'en' }) {
  const steps = [
    {
      num: '01',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      title: language === 'vi' ? 'Select Charm 1 (Astra)' : 'Select Charm 1 (Astra)',
      desc: language === 'vi'
        ? 'Chọn định danh cá nhân của bạn.'
        : 'Choose your personal identifier.',
    },
    {
      num: '02',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      title: language === 'vi' ? 'Mix Charm 2 & 3' : 'Mix Charm 2 & 3',
      desc: language === 'vi'
        ? 'Tự do kéo-thả sở thích và câu quote (Sirius + Polaris). Hoặc chọn hẳn 2 Charm Sirius nếu bạn ngập tràn đam mê!'
        : 'Drag & drop your hobbies and quotes (Sirius + Polaris). Or pick 2 Sirius charms if your passions overflow!',
    },
    {
      num: '03',
      icon: <Search className="h-5 w-5" />,
      color: 'bg-violet-500',
      lightBg: 'bg-violet-50',
      title: language === 'vi' ? 'Preview Orbit' : 'Preview Orbit',
      desc: language === 'vi'
        ? 'Xem trước toàn bộ "vũ trụ" của bạn trên màn hình.'
        : 'Preview your entire universe on screen.',
    },
    {
      num: '04',
      icon: <Compass className="h-5 w-5" />,
      color: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      title: language === 'vi' ? 'Launch' : 'Launch',
      desc: language === 'vi'
        ? 'Đặt hàng và để hệ thống tự động hóa khâu chế tác, gửi thành phẩm đến bạn trong thời gian siêu tốc.'
        : 'Place your order and let our system automate the crafting process — delivered to you in record time.',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 mb-2">
          {language === 'vi' ? 'Quy trình đặt hàng' : 'How it works'}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-black uppercase">
          {language === 'vi' ? '4 Bước Tạo Vũ Trụ' : '4 Steps to Your Universe'}
        </h2>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, i) => (
          <div key={step.num} className="relative group">
            {/* Connecting line (hidden on last) */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[1px] bg-stone-200 z-0" />
            )}

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              {/* Step circle */}
              <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>

              {/* Step number */}
              <span className="font-display text-[10px] font-black text-stone-400 uppercase tracking-widest">
                {language === 'vi' ? 'Bước' : 'Step'} {step.num}
              </span>

              {/* Title */}
              <h3 className="font-display text-sm font-extrabold text-stone-900 uppercase tracking-wide">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-stone-500 text-xs leading-relaxed max-w-[220px]">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-14">
        <a
          href="/order"
          className="inline-flex items-center gap-2.5 bg-black hover:bg-stone-800 text-white font-display text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 cursor-pointer group"
        >
          <span>Start your YOUniverse</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </a>
      </div>
    </section>
  );
}

/* ─── Dynamic Variant Card ─── */
function VariantCard({ variant, productLine }: { variant: ShowcaseVariant; productLine: ProductLine }) {
  const colors = LINE_COLORS[productLine] ?? LINE_COLORS.ASTRA;
  return (
    <div className="group/card relative rounded-[24px] overflow-hidden bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        {variant.imageUrl ? (
          <img
            src={variant.imageUrl}
            alt={variant.imageAlt ?? variant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-stone-800 flex items-center justify-center">
            <span className="text-stone-500 text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
        <h3 className="font-display text-lg font-black text-white uppercase tracking-wide">{variant.name}</h3>
        {variant.description && (
          <p className="font-sans text-white/70 text-[11px] leading-relaxed mt-1 line-clamp-2 opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-400">
            {variant.description}
          </p>
        )}
      </div>
      <div className={`absolute top-3 left-3 ${colors.badge} backdrop-blur-sm rounded-full px-3 py-1`}>
        <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white">
          {productLine.charAt(0) + productLine.slice(1).toLowerCase()}
        </span>
      </div>
    </div>
  );
}

/* ─── Dynamic Product Section ─── */
function DynamicProductSection({ product, isFirst }: { product: ShowcaseProduct; isFirst: boolean }) {
  const sectionId = product.slug;
  const productLine = product.productLine as ProductLine;
  const variants = product.variants ?? [];

  // Group variants by group field
  const groups = new Map<string | null, ShowcaseVariant[]>();
  for (const v of variants) {
    const key = v.group;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }

  const hasGroups = groups.size > 1 || (groups.size === 1 && !groups.has(null));

  return (
    <div
      id={sectionId}
      className={`space-y-8 ${isFirst ? 'pt-4' : 'pt-8 border-t border-stone-200/60'} scroll-mt-24`}
    >
      {/* Section Header */}
      <div className={`space-y-3 ${!isFirst ? 'pt-8' : ''}`}>
        <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
          {product.name}
        </h2>
      </div>

      {variants.length > 0 ? (
        // Has variants → render grid cards
        hasGroups ? (
          // Multiple groups → sub-category layout
          Array.from(groups.entries()).map(([groupName, groupVariants]) => (
            <div key={groupName ?? 'ungrouped'} className="space-y-4">
              {groupName && (
                <div className="flex items-center gap-3 pl-1">
                  {groupVariants[0]?.groupEmoji && (
                    <span className="text-xl">{groupVariants[0].groupEmoji}</span>
                  )}
                  <h3 className="font-display text-lg font-extrabold text-stone-800 uppercase tracking-wide">
                    {groupName}
                  </h3>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {groupVariants.map((v) => (
                  <VariantCard key={v.id} variant={v} productLine={productLine} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // No groups → flat grid
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {variants.map((v) => (
              <VariantCard key={v.id} variant={v} productLine={productLine} />
            ))}
          </div>
        )
      ) : (
        // No variants → single image + text layout (Polaris-style)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="rounded-[24px] overflow-hidden shadow-md">
            <img
              src={product.images[0]?.url ?? '/images/placeholder.jpg'}
              alt={product.images[0]?.alt ?? product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="font-display text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight leading-tight">
              {product.shortDescription}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsView({ showcaseProducts, initialError = null }: ProductsViewProps) {
  const { language } = useYouniverseApp();

  return (
    <div className="pb-24 space-y-16 bg-neutral-50/30" id="products-view">
      
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden h-48 sm:h-64 cursor-default rounded-3xl mx-auto max-w-7xl mt-6 shadow-sm">
        <img 
          src="/images/banner-products-new.png" 
          alt="Start your YOUniverse Banner" 
          className="w-full h-full object-cover"
        />
      </section>

      {/* 2. Product Showcase Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Headline */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-black uppercase" id="headline-our-products">
            {language === 'vi' ? 'SẢN PHẨM CỦA CHÚNG TÔI' : 'OUR PRODUCTS'}
          </h1>
          <div className="h-1 w-16 bg-amber-500 mx-auto mt-3 rounded" />
        </div>

        {/* Navigation Tabs — auto-generated from showcase data */}
        <div className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-2xl p-2.5 shadow-lg shadow-stone-200/30 flex items-center justify-center gap-2.5 flex-wrap">
          {showcaseProducts.map((product) => {
            const nav = LINE_NAV[product.productLine as ProductLine] ?? LINE_NAV.ASTRA;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => document.getElementById(product.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`group flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[11px] font-bold font-display tracking-wider uppercase transition-all duration-300 cursor-pointer bg-stone-50 text-stone-600 hover:text-white hover:-translate-y-0.5 active:translate-y-0 ${nav.hoverBg} ${nav.hoverShadow}`}
              >
                {sectionIcon(nav.iconName, `h-3.5 w-3.5 ${nav.iconColor} group-hover:text-white transition-colors duration-300`)}
                <span>{product.name}</span>
              </button>
            );
          })}
        </div>

        {/* Error state */}
        {initialError && (
          <div className="text-center text-red-500 py-8">{initialError}</div>
        )}

        {/* Dynamic showcase sections */}
        {showcaseProducts.map((product, index) => (
          <DynamicProductSection
            key={product.id}
            product={product}
            isFirst={index === 0}
          />
        ))}

      </section>

    </div>
  );
}
