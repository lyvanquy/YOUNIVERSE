'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Compass, Search, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';
import { apiRequest, buildQuery, productLineToApi, type ApiProduct, type ProductListData } from '../lib/api';

interface ProductsViewProps {
  initialProducts: ApiProduct[];
  initialError?: string | null;
}

type ProductLineFilter = 'all' | 'astra' | 'sirius' | 'polaris';
type ProductLine = 'ASTRA' | 'SIRIUS' | 'POLARIS';
type SortBy = 'newest' | 'price-asc' | 'price-desc';

const sortToApi: Record<SortBy, string> = {
  newest: 'newest',
  'price-asc': 'price-low-high',
  'price-desc': 'price-high-low',
};

const lineFallbackImages: Record<ProductLine, string> = {
  ASTRA: '/images/astra-core.png',
  SIRIUS: '/images/sirius-core.png',
  POLARIS: '/images/polaris-core.png',
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

function ProductVisual({ product }: { product: ApiProduct }) {
  const [imageFailed, setImageFailed] = useState(false);
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const imageUrl = imageFailed ? lineFallbackImages[product.productLine] : primaryImage?.url ?? lineFallbackImages[product.productLine];
  
  return (
    <img
      src={imageUrl}
      alt={primaryImage?.alt ?? product.name}
      width={800}
      height={600}
      loading="lazy"
      decoding="async"
      onError={() => setImageFailed(true)}
      className="absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

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
            src="/images/feedback-main.jpg"
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
            src="/images/product-astra.jpg"
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
            src="/images/product-sirius.jpg"
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
            src="/images/product-polaris.jpg"
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

export default function ProductsView({ initialProducts, initialError = null }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState<ProductLineFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [refreshKey, setRefreshKey] = useState(0);
  const isFirstRender = useRef(true);
  const { language } = useYouniverseApp();
  const t = translations[language];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const data = await apiRequest<ProductListData>(
          `/products${buildQuery({
            page: 1,
            limit: 50,
            search: searchQuery,
            line: productLineToApi(selectedLine),
            sort: sortToApi[sortBy],
          })}`,
          { signal: controller.signal },
        );

        setProducts(data.items);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setProducts([]);
        setError(err instanceof Error ? err.message : 'Could not load products');
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(loadProducts, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [searchQuery, selectedLine, sortBy, refreshKey]);

  return (
    <div className="pb-24 space-y-16 bg-neutral-50/30" id="products-view">
      
      {/* 1. Header Banner of Our products */}
      <section className="relative overflow-hidden h-48 sm:h-64 cursor-default rounded-3xl mx-auto max-w-7xl mt-6 shadow-sm">
        <img 
          src="/images/banner-products-new.png" 
          alt="Start your YOUniverse Banner" 
          className="w-full h-full object-cover"
        />
      </section>

      {/* 2. Main Product Catalog Section with Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Headline */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-black uppercase" id="headline-our-products">
            {language === 'vi' ? 'SẢN PHẨM CỦA CHÚNG TÔI' : 'OUR PRODUCTS'}
          </h1>
          <div className="h-1 w-16 bg-amber-500 mx-auto mt-3 rounded" />
        </div>

        {/* Apple-style Filter & Search Bar */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              aria-label={language === 'vi' ? 'Tìm kiếm sản phẩm' : 'Search products'}
              type="text"
              placeholder={language === 'vi' ? "Tìm kiếm charm (ví dụ: tên, mô tả)..." : "Search charms (e.g. name, description)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full pl-10 pr-10 py-2.5 text-xs font-sans rounded-full bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-black font-sans font-bold"
              >
                ✕ {language === 'vi' ? 'Xóa' : 'Clear'}
              </button>
            )}
          </div>

          {/* Product Line Filter Segment Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'astra', 'sirius', 'polaris'] as const).map((line) => {
              const isActive = selectedLine === line;
              const label = line === 'all' 
                ? (language === 'vi' ? 'Tất cả các dòng' : 'All Lines') 
                : `Charm ${line.charAt(0).toUpperCase() + line.slice(1)}`;
              
              const activeClass = 
                line === 'all' ? 'bg-black text-white border-black' :
                line === 'astra' ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20' :
                line === 'sirius' ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20' :
                'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/20';

              const inactiveClass = 'hover:bg-stone-50 border-stone-200 text-stone-600 bg-white hover:text-black hover:border-stone-400';

              // Option B: Select icon based on the line type
              const renderIcon = () => {
                const iconClass = `h-3.5 w-3.5 transition-colors duration-300 ${
                  isActive 
                    ? 'text-white animate-pulse-glow' 
                    : line === 'astra' 
                    ? 'text-blue-500 group-hover:text-blue-600' 
                    : line === 'sirius' 
                    ? 'text-amber-500 group-hover:text-amber-600' 
                    : 'text-rose-500 group-hover:text-rose-600'
                }`;

                if (line === 'astra') return <Sparkles className={iconClass} />;
                if (line === 'sirius') return <Heart className={iconClass} />;
                if (line === 'polaris') return <Compass className={iconClass} />;
                return null;
              };

              return (
                <button
                  key={line}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedLine(line)}
                  className={`group flex items-center space-x-1.5 px-4 py-2 rounded-full border text-[10px] font-bold font-display tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive ? activeClass : inactiveClass
                  }`}
                >
                  {renderIcon()}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Dropdown Sorting Control */}
          <div className="relative flex items-center space-x-2 self-start lg:self-auto" id="sort-control-container">
            <span className={`text-[10px] ${language === 'vi' ? 'font-sans' : 'font-mono'} font-bold uppercase tracking-wider text-stone-400 shrink-0`}>{language === 'vi' ? 'Sắp xếp:' : 'Sort By:'}</span>
            
            <div className="relative">
              {/* Dropdown Toggle Button */}
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center justify-between space-x-3 bg-white border border-stone-200 hover:border-stone-400 rounded-full px-4.5 py-2 text-xs font-sans font-medium text-stone-700 hover:text-black transition-all cursor-pointer min-w-[160px]"
              >
                <span>{sortBy === 'price-asc' ? (language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High') : sortBy === 'price-desc' ? (language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low') : (language === 'vi' ? 'Thứ tự mặc định' : 'Default Order')}</span>
                <span className={`text-[8px] text-stone-400 transition-transform duration-350 ${sortOpen ? 'rotate-180 text-black' : 'rotate-0'}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown Options Panel */}
              {sortOpen && (
                <>
                  {/* Invisible backdrop to capture click-outside event */}
                  <div className="fixed inset-0 z-20 cursor-default" onClick={() => setSortOpen(false)} />
                  
                  {/* Options container list */}
                  <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white border border-stone-200 shadow-lg p-1.5 z-30 space-y-1 animate-fade-in">
                    {(
                      [
                        { value: 'newest', label: language === 'vi' ? 'Thứ tự mặc định' : 'Default Order' },
                        { value: 'price-asc', label: language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High' },
                        { value: 'price-desc', label: language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low' }
                      ] as const
                    ).map((opt) => {
                      const isSelected = opt.value === sortBy;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl font-sans transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-stone-50 text-black font-semibold' 
                              : 'text-stone-600 hover:bg-stone-50 hover:text-black'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span className="text-amber-500 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* 3 columns comparative list, staggered left-to-right, inspired by Apple comparative layouts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 animate-pulse">
                <div className="h-60 w-full rounded-3xl bg-white border border-stone-200 shadow-sm" />
                <div className="h-2 w-16 rounded bg-stone-200" />
                <div className="h-6 w-40 rounded bg-stone-200" />
                <div className="h-3 w-56 rounded bg-stone-100" />
                <div className="h-9 w-32 rounded-full bg-stone-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-red-200/80 shadow-sm space-y-4">
            <p className="font-sans text-red-500 text-sm font-semibold">Cannot load products from backend.</p>
            <p className="font-mono text-[11px] text-stone-400">{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="rounded-full bg-black px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/60 shadow-sm">
            <p className="font-sans text-stone-400 text-sm">{language === 'vi' ? 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.' : 'No products match your search/filter criteria.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 pt-4">
            
            {products.map((prod) => {
              const isAstra = prod.productLine === 'ASTRA';
              const isSirius = prod.productLine === 'SIRIUS';
              const currentPrice = prod.salePrice ?? prod.price;
              const stockQuantity = prod.inventory?.quantity ?? 0;
              const translatedBadge = isAstra ? t.charmAstraBadge : isSirius ? t.charmSiriusBadge : t.charmPolarisBadge;
              const translatedTagline = isAstra ? t.charmAstraTagline : isSirius ? t.charmSiriusTagline : t.charmPolarisTagline;
              const translatedDescription = isAstra ? t.charmAstraDesc : isSirius ? t.charmSiriusDesc : t.charmPolarisDesc;

              // Color accent per line
              const accentColor = isAstra ? 'text-blue-600' : isSirius ? 'text-amber-600' : 'text-rose-600';
              const btnBg = isAstra ? 'bg-blue-600 hover:bg-blue-700' : isSirius ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-500 hover:bg-rose-600';
              const btnTextColor = isAstra ? 'text-blue-600 hover:text-blue-700' : isSirius ? 'text-amber-600 hover:text-amber-700' : 'text-rose-600 hover:text-rose-700';

              return (
                <article
                  key={prod.id}
                  id={`product-card-${prod.slug}`}
                  className="flex flex-col items-center text-center cursor-default group/card"
                >
                  {/* Apple-style image container — tall, gray bg, no border */}
                  <div className="relative w-full aspect-[4/3] bg-[#f5f5f7] rounded-[20px] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover/card:shadow-lg">
                    <ProductVisual product={prod} />
                  </div>

                  {/* Color dots */}
                  <div className="flex space-x-1.5 justify-center pt-5 pb-3">
                    {isAstra && (
                      <>
                        <span className="h-[6px] w-[6px] rounded-full bg-blue-500 ring-[1.5px] ring-offset-1 ring-blue-500" />
                        <span className="h-[6px] w-[6px] rounded-full bg-amber-400" />
                        <span className="h-[6px] w-[6px] rounded-full bg-rose-400" />
                        <span className="h-[6px] w-[6px] rounded-full bg-stone-300" />
                      </>
                    )}
                    {isSirius && (
                      <>
                        <span className="h-[6px] w-[6px] rounded-full bg-blue-400" />
                        <span className="h-[6px] w-[6px] rounded-full bg-amber-500 ring-[1.5px] ring-offset-1 ring-amber-500" />
                        <span className="h-[6px] w-[6px] rounded-full bg-rose-400" />
                        <span className="h-[6px] w-[6px] rounded-full bg-stone-300" />
                      </>
                    )}
                    {!isAstra && !isSirius && (
                      <>
                        <span className="h-[6px] w-[6px] rounded-full bg-blue-400" />
                        <span className="h-[6px] w-[6px] rounded-full bg-amber-400" />
                        <span className="h-[6px] w-[6px] rounded-full bg-rose-500 ring-[1.5px] ring-offset-1 ring-rose-500" />
                        <span className="h-[6px] w-[6px] rounded-full bg-stone-300" />
                      </>
                    )}
                  </div>

                  {/* Product info — Apple style hierarchy */}
                  <div className="space-y-2.5 flex flex-col items-center max-w-[280px]">
                    
                    {/* Micro badge */}
                    <span className={`text-[10px] font-sans font-bold uppercase tracking-widest ${accentColor}`}>
                      {translatedBadge}
                    </span>
                    
                    {/* Product name — large and bold */}
                    <h3 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight leading-tight">
                      {prod.name}
                    </h3>
                    
                    {/* Tagline — italic */}
                    <p className={`${language === 'vi' ? 'font-sans' : 'font-mono'} text-xs font-medium text-stone-500 italic`}>
                      &ldquo;{translatedTagline}&rdquo;
                    </p>

                    {/* Description */}
                    <p className="font-sans text-stone-500 text-xs leading-relaxed line-clamp-3">
                      {language === 'vi'
                        ? translatedDescription
                        : (prod.shortDescription || prod.description || translatedDescription)}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-sans text-sm font-bold text-stone-900">{formatPrice(currentPrice)}</span>
                      {prod.salePrice && (
                        <span className="font-sans text-xs text-stone-400 line-through">{formatPrice(prod.price)}</span>
                      )}
                    </div>
                  </div>

                  {/* Apple-style button pair */}
                  <div className="flex items-center justify-center gap-4 pt-5">
                    <Link
                      href={`/products/${encodeURIComponent(prod.slug)}`}
                      className={`${btnBg} active:scale-95 text-white font-sans text-xs font-semibold px-6 py-2.5 rounded-full tracking-wide shadow-sm hover:shadow transition-all cursor-pointer`}
                    >
                      {language === 'vi' ? 'Tìm hiểu thêm' : 'Learn more'}
                    </Link>
                    <Link
                      href="/order"
                      className={`${btnTextColor} text-xs font-semibold font-sans flex items-center gap-0.5 cursor-pointer group/link`}
                    >
                      <span>{language === 'vi' ? 'Mua' : 'Buy'}</span>
                      <span className="inline-block transform group-hover/link:translate-x-0.5 transition-transform">&gt;</span>
                    </Link>
                  </div>

                  <p className={`text-[9px] ${language === 'vi' ? 'font-sans' : 'font-mono'} pt-4 ${stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {stockQuantity > 0
                      ? (language === 'vi' ? 'Còn hàng' : 'In stock')
                      : (language === 'vi' ? 'Tạm hết hàng' : 'Out of stock')}
                  </p>
                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* CTA — Start your YOUniverse */}
      <div className="text-center pt-4 pb-8">
        <a
          href="/order"
          className="inline-flex items-center gap-2 bg-black hover:bg-stone-800 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 cursor-pointer group"
        >
          <span>Start your YOUniverse</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </a>
      </div>

    </div>
  );
}
