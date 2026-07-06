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

/* ─── Charm Sections Config ─── */
/* Add a new entry here → nav tab + section header auto-generated */
const CHARM_SECTIONS = [
  { id: 'charm-astra', label: 'Charm Astra', iconName: 'sparkles' as const, iconColor: 'text-blue-500', hoverBg: 'hover:bg-blue-600', hoverShadow: 'hover:shadow-[0_4px_20px_rgba(59,130,246,0.35)]' },
  { id: 'charm-sirius', label: 'Charm Sirius', iconName: 'heart' as const, iconColor: 'text-amber-500', hoverBg: 'hover:bg-amber-500', hoverShadow: 'hover:shadow-[0_4px_20px_rgba(245,158,11,0.35)]' },
  { id: 'charm-polaris', label: 'Charm Polaris', iconName: 'compass' as const, iconColor: 'text-rose-500', hoverBg: 'hover:bg-rose-500', hoverShadow: 'hover:shadow-[0_4px_20px_rgba(244,63,94,0.35)]' },
];

const sectionIcon = (name: string, className: string) => {
  if (name === 'sparkles') return <Sparkles className={className} />;
  if (name === 'heart') return <Heart className={className} />;
  if (name === 'compass') return <Compass className={className} />;
  return null;
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

        {/* Navigation Tabs — auto-generated from CHARM_SECTIONS */}
        <div className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-2xl p-2.5 shadow-lg shadow-stone-200/30 flex items-center justify-center gap-2.5 flex-wrap">
          {CHARM_SECTIONS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className={`group flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[11px] font-bold font-display tracking-wider uppercase transition-all duration-300 cursor-pointer bg-stone-50 text-stone-600 hover:text-white hover:-translate-y-0.5 active:translate-y-0 ${tab.hoverBg} ${tab.hoverShadow}`}
            >
              {sectionIcon(tab.iconName, `h-3.5 w-3.5 ${tab.iconColor} group-hover:text-white transition-colors duration-300`)}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══ CHARM ASTRA SHOWCASE ═══ */}
        <div id="charm-astra" className="space-y-8 pt-4 scroll-mt-24">
          
          {/* Section Header — Astra */}
          <div className="space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
              Charm Astra
            </h2>
          </div>

          {/* Astra 3-card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { 
                img: '/images/astra-mat-troi.jpg', 
                name: language === 'vi' ? 'Hệ Mặt Trời' : 'Solar System',
                desc: language === 'vi' ? 'Năng lượng rực rỡ, tỏa sáng như mặt trời — biểu tượng của sức mạnh và niềm tin.' : 'Radiant energy, shining like the sun — a symbol of strength and belief.'
              },
              { 
                img: '/images/astra-mat-trang.jpg', 
                name: language === 'vi' ? 'Hệ Mặt Trăng' : 'Lunar System',
                desc: language === 'vi' ? 'Dịu dàng mà sâu lắng, ánh trăng dẫn lối qua những đêm tĩnh lặng nhất.' : 'Gentle yet profound, moonlight guides through the quietest nights.'
              },
              { 
                img: '/images/astra-tinh-tu.jpg', 
                name: language === 'vi' ? 'Hệ Tinh Tú' : 'Star System',
                desc: language === 'vi' ? 'Vô vàn ngôi sao, mỗi ánh sáng là một giấc mơ đang chờ bạn chạm tới.' : 'Countless stars, each light is a dream waiting for you to reach.'
              },
            ].map((variant, i) => (
              <div key={i} className="group/card relative rounded-[24px] overflow-hidden bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={variant.img} 
                    alt={variant.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                    loading="lazy"
                  />
                </div>
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
                  <h3 className="font-display text-lg font-black text-white uppercase tracking-wide">{variant.name}</h3>
                  <p className="font-sans text-white/70 text-[11px] leading-relaxed mt-1 line-clamp-2 opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-400">{variant.desc}</p>
                </div>
                {/* Top badge */}
                <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white">Astra</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ═══ CHARM SIRIUS SHOWCASE ═══ */}
        <div id="charm-sirius" className="space-y-8 pt-8 border-t border-stone-200/60 scroll-mt-24">
          
          {/* Section Header — Sirius */}
          <div className="space-y-3 pt-8">
            <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
              Charm Sirius
            </h2>
          </div>

          {/* Sub-category 1: Những người bạn 4 chân */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pl-1">
              <span className="text-xl">🐾</span>
              <h3 className="font-display text-lg font-extrabold text-stone-800 uppercase tracking-wide">
                {language === 'vi' ? 'Những người bạn 4 chân' : 'Four-legged Friends'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { img: '/images/sirius-cho.jpg', name: language === 'vi' ? 'Chó' : 'Dog', emoji: '🐕' },
                { img: '/images/sirius-meo.jpg', name: language === 'vi' ? 'Mèo' : 'Cat', emoji: '🐱' },
                { img: '/images/sirius-hamster.jpg', name: 'Hamster', emoji: '🐹' },
              ].map((pet, i) => (
                <div key={i} className="group/card relative rounded-[24px] overflow-hidden bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden">
                    <img src={pet.img} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" loading="lazy" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{pet.emoji}</span>
                      <h4 className="font-display text-xl font-black text-white uppercase tracking-wide">{pet.name}</h4>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white">Sirius</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-category 2: Năng lượng ngọt ngào */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pl-1">
              <span className="text-xl">☕</span>
              <h3 className="font-display text-lg font-extrabold text-stone-800 uppercase tracking-wide">
                {language === 'vi' ? 'Năng lượng ngọt ngào' : 'Sweet Energy'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { img: '/images/sirius-tra-sua.jpg', name: language === 'vi' ? 'Trà Sữa' : 'Bubble Tea', emoji: '🧋' },
                { img: '/images/sirius-matcha.jpg', name: 'Matcha Latte', emoji: '🍵' },
                { img: '/images/sirius-ca-phe.jpg', name: language === 'vi' ? 'Cà Phê' : 'Coffee', emoji: '☕' },
              ].map((drink, i) => (
                <div key={i} className="group/card relative rounded-[24px] overflow-hidden bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden">
                    <img src={drink.img} alt={drink.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" loading="lazy" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{drink.emoji}</span>
                      <h4 className="font-display text-xl font-black text-white uppercase tracking-wide">{drink.name}</h4>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white">Sirius</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ═══ CHARM POLARIS SHOWCASE ═══ */}
        <div id="charm-polaris" className="space-y-8 pt-8 border-t border-stone-200/60 scroll-mt-24">
          
          {/* Section Header — Polaris */}
          <div className="space-y-3 pt-8">
            <h2 className="font-display text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">
              Charm Polaris
            </h2>
          </div>

          {/* Split layout: image left + text right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="rounded-[24px] overflow-hidden shadow-md">
              <img 
                src="/images/polaris-quote.jpg" 
                alt="Charm Polaris - Tự viết nên châm ngôn" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Text */}
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="font-display text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight leading-tight">
                {language === 'vi' ? 'Tự viết nên châm ngôn của riêng bạn' : 'Write your own motto'}
              </h3>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
