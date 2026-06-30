import { useState } from 'react';
import { Sparkles, Heart, Compass, ChevronRight, ChevronLeft, Eye, ShoppingBag } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';
import { CHARM_PRODUCTS } from '../data';

/* ─── Charm option data ─── */
const ASTRA_OPTIONS = [
  { id: 'solar', label: 'Solar System', labelVi: 'Hệ mặt trời' },
  { id: 'fire', label: 'Fire (Hỏa)', labelVi: 'Hỏa' },
  { id: 'water', label: 'Water (Thủy)', labelVi: 'Thủy' },
  { id: 'wood', label: 'Wood (Mộc)', labelVi: 'Mộc' },
  { id: 'metal', label: 'Metal (Kim)', labelVi: 'Kim' },
  { id: 'earth', label: 'Earth (Thổ)', labelVi: 'Thổ' },
];

const SIRIUS_OPTIONS = [
  { id: 'parrot', emoji: '🦜', label: 'Parrot', labelVi: 'Vẹt' },
  { id: 'dog', emoji: '🐕', label: 'Dog', labelVi: 'Chó' },
  { id: 'cat', emoji: '🐈', label: 'Cat', labelVi: 'Mèo' },
  { id: 'coffee', emoji: '☕', label: 'Coffee', labelVi: 'Cà phê' },
  { id: 'matcha', emoji: '🍵', label: 'Matcha', labelVi: 'Matcha' },
  { id: 'boba', emoji: '🧋', label: 'Bubble Tea', labelVi: 'Trà sữa' },
  { id: 'aplus', emoji: '💯', label: 'A+ Score', labelVi: 'Điểm A+' },
  { id: 'wealth', emoji: '💰', label: 'Wealth', labelVi: 'Tài chính' },
  { id: 'weights', emoji: '🏋️', label: 'Weights', labelVi: 'Tạ' },
  { id: 'running', emoji: '👟', label: 'Running', labelVi: 'Giày chạy' },
  { id: 'racket', emoji: '🏸', label: 'Badminton', labelVi: 'Cầu lông' },
];

const POLARIS_QUOTES = [
  { id: 'q1', text: 'Be yourself; everyone else is already taken.', textVi: 'Hãy là chính mình; ai cũng đã có người khác rồi.' },
  { id: 'q2', text: 'The only way to do great work is to love what you do.', textVi: 'Cách duy nhất để làm việc tuyệt vời là yêu những gì bạn làm.' },
  { id: 'q3', text: 'In the middle of difficulty lies opportunity.', textVi: 'Giữa khó khăn là cơ hội.' },
  { id: 'q4', text: 'Stars can\'t shine without darkness.', textVi: 'Sao không thể tỏa sáng nếu thiếu bóng tối.' },
  { id: 'q5', text: 'Your vibe attracts your tribe.', textVi: 'Tần số của bạn thu hút cộng đồng của bạn.' },
  { id: 'q6', text: 'Dream big. Start small. Act now.', textVi: 'Mơ lớn. Bắt đầu nhỏ. Hành động ngay.' },
];

export default function OrderView() {
  const { language } = useYouniverseApp();
  const [step, setStep] = useState(1);
  
  // Form states
  const [nickname, setNickname] = useState('');
  const [astraStyle, setAstraStyle] = useState('');
  const [siriusIcons, setSiriusIcons] = useState<string[]>([]);
  const [useDoubleSirius, setUseDoubleSirius] = useState(false);
  const [siriusIcons2, setSiriusIcons2] = useState<string[]>([]);
  const [polarisQuote, setPolarisQuote] = useState('');
  const [customQuote, setCustomQuote] = useState('');

  // Customer info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const toggleSirius = (id: string, which: 'first' | 'second' = 'first') => {
    if (which === 'second') {
      setSiriusIcons2(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
    } else {
      setSiriusIcons(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
    }
  };

  const totalPrice = (() => {
    let p = 0;
    if (astraStyle) p += CHARM_PRODUCTS[0].price;
    if (siriusIcons.length > 0) p += CHARM_PRODUCTS[1].price;
    if (useDoubleSirius && siriusIcons2.length > 0) p += CHARM_PRODUCTS[1].price;
    if (!useDoubleSirius && (polarisQuote || customQuote)) p += CHARM_PRODUCTS[2].price;
    return p;
  })();

  const stepLabels = language === 'vi'
    ? ['Chọn Astra', 'Mix Charm 2 & 3', 'Xem trước', 'Đặt hàng']
    : ['Select Astra', 'Mix Charm 2 & 3', 'Preview', 'Order'];

  const stepColors = ['bg-blue-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500'];

  return (
    <div className="pb-24 text-stone-800 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Banner */}
      <section className="relative overflow-hidden h-40 sm:h-52 rounded-3xl mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mt-6 shadow-sm border border-stone-200 bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute top-6 right-8 text-amber-400 animate-twinkle">✦</div>
        <div className="absolute bottom-6 left-10 text-blue-400 animate-twinkle duration-2000">✦</div>
        <div className="text-center relative z-10 px-4 space-y-2">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">
            {language === 'vi' ? 'Tạo vũ trụ của bạn' : 'Build your universe'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
            Start Your YOUniverse
          </h1>
        </div>
      </section>

      {/* Step Progress */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-6 relative z-10">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-display text-sm font-bold transition-all duration-300 ${
                    step > i + 1 ? 'bg-emerald-500' : step === i + 1 ? stepColors[i] : 'bg-stone-300'
                  }`}
                >
                  {step > i + 1 ? '✓' : `0${i + 1}`}
                </div>
                <span className={`font-display text-[9px] font-bold uppercase tracking-wider mt-1.5 ${
                  step === i + 1 ? 'text-stone-900' : 'text-stone-400'
                }`}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-[2px] mx-2 rounded-full transition-all ${
                  step > i + 1 ? 'bg-emerald-400' : 'bg-stone-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-stone-200/80 rounded-[20px] p-6 md:p-10 shadow-sm min-h-[500px]">

          {/* ═══ STEP 1: Astra ═══ */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                    {language === 'vi' ? 'Bước 1 — Chọn Astra' : 'Step 1 — Select Astra'}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {language === 'vi' ? 'Khắc dấu ấn cá nhân' : 'Your Personal Identifier'}
                </h2>
                <p className="font-sans text-stone-500 text-sm">
                  {language === 'vi'
                    ? 'Nhập tên/biệt danh và chọn biểu tượng năng lượng cho charm Astra của bạn.'
                    : 'Enter your name/nickname and choose the energy symbol for your Astra charm.'}
                </p>
              </div>

              {/* Nickname input */}
              <div className="space-y-2 max-w-md">
                <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {language === 'vi' ? 'Tên / Biệt danh' : 'Name / Nickname'}
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={language === 'vi' ? 'Ví dụ: Minh, Luna, QueenB...' : 'e.g. Minh, Luna, QueenB...'}
                  className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Style selection */}
              <div className="space-y-3">
                <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {language === 'vi' ? 'Chọn biểu tượng năng lượng' : 'Choose energy symbol'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ASTRA_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAstraStyle(opt.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        astraStyle === opt.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <p className="font-display text-xs font-bold text-stone-900">
                        {language === 'vi' ? opt.labelVi : opt.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: Sirius + Polaris ═══ */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5">
                  <Heart className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
                    {language === 'vi' ? 'Bước 2 — Mix Charm' : 'Step 2 — Mix Charms'}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {language === 'vi' ? 'Chọn sở thích & câu quote' : 'Pick Interests & Quote'}
                </h2>
              </div>

              {/* Double Sirius toggle */}
              <div className="flex items-center gap-3 bg-amber-50/60 border border-amber-200/60 rounded-xl p-4">
                <input
                  type="checkbox"
                  id="doubleSirius"
                  checked={useDoubleSirius}
                  onChange={(e) => setUseDoubleSirius(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="doubleSirius" className="font-sans text-stone-700 text-sm cursor-pointer">
                  {language === 'vi'
                    ? '💡 Dùng 2 Charm Sirius thay vì Sirius + Polaris (ngập tràn đam mê!)'
                    : '💡 Use 2 Sirius charms instead of Sirius + Polaris (overflow your passions!)'}
                </label>
              </div>

              {/* Sirius 1 */}
              <div className="space-y-3">
                <label className="font-display text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Charm Sirius {useDoubleSirius ? '#1' : ''} — {language === 'vi' ? 'Chọn tối đa 3 biểu tượng' : 'Pick up to 3 icons'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {SIRIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleSirius(opt.id, 'first')}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                        siriusIcons.includes(opt.id)
                          ? 'border-amber-500 bg-amber-50 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <p className="font-sans text-[9px] text-stone-600 mt-1">
                        {language === 'vi' ? opt.labelVi : opt.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sirius 2 or Polaris */}
              {useDoubleSirius ? (
                <div className="space-y-3">
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    Charm Sirius #2 — {language === 'vi' ? 'Chọn tối đa 3 biểu tượng' : 'Pick up to 3 icons'}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {SIRIUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => toggleSirius(opt.id, 'second')}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                          siriusIcons2.includes(opt.id)
                            ? 'border-amber-500 bg-amber-50 shadow-sm'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <p className="font-sans text-[9px] text-stone-600 mt-1">
                          {language === 'vi' ? opt.labelVi : opt.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    <Compass className="inline h-3 w-3 mr-1" />
                    Charm Polaris — {language === 'vi' ? 'Chọn câu quote' : 'Pick a quote'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POLARIS_QUOTES.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => { setPolarisQuote(q.id); setCustomQuote(''); }}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                          polarisQuote === q.id
                            ? 'border-rose-500 bg-rose-50 shadow-sm'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <p className="font-sans text-xs text-stone-700 italic leading-relaxed">
                          "{language === 'vi' ? q.textVi : q.text}"
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {language === 'vi' ? 'Hoặc nhập quote riêng' : 'Or enter your own quote'}
                    </label>
                    <input
                      type="text"
                      value={customQuote}
                      onChange={(e) => { setCustomQuote(e.target.value); setPolarisQuote(''); }}
                      placeholder={language === 'vi' ? 'Nhập câu quote của bạn...' : 'Type your quote...'}
                      className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all mt-1.5"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ STEP 3: Preview ═══ */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5">
                  <Eye className="h-3.5 w-3.5 text-violet-500" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
                    {language === 'vi' ? 'Bước 3 — Xem trước' : 'Step 3 — Preview Orbit'}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {language === 'vi' ? 'Vũ trụ của bạn' : 'Your Universe'}
                </h2>
              </div>

              {/* Preview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Astra preview */}
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="font-display text-xs font-bold text-blue-700 uppercase">Astra</span>
                  </div>
                  <p className="font-display text-lg font-black text-stone-900">{nickname || '—'}</p>
                  <p className="font-sans text-xs text-stone-500">
                    {ASTRA_OPTIONS.find(o => o.id === astraStyle)?.[language === 'vi' ? 'labelVi' : 'label'] || '—'}
                  </p>
                  <p className="font-sans text-[10px] text-stone-400">
                    {CHARM_PRODUCTS[0].price.toLocaleString('vi-VN')} ₫
                  </p>
                </div>

                {/* Sirius preview */}
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-amber-500" />
                    <span className="font-display text-xs font-bold text-amber-700 uppercase">
                      Sirius {useDoubleSirius ? '#1' : ''}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xl">
                    {siriusIcons.map(id => {
                      const opt = SIRIUS_OPTIONS.find(o => o.id === id);
                      return <span key={id}>{opt?.emoji}</span>;
                    })}
                    {siriusIcons.length === 0 && <span className="text-stone-300">—</span>}
                  </div>
                  <p className="font-sans text-[10px] text-stone-400">
                    {CHARM_PRODUCTS[1].price.toLocaleString('vi-VN')} ₫
                  </p>
                </div>

                {/* Polaris or Sirius 2 preview */}
                {useDoubleSirius ? (
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-amber-500" />
                      <span className="font-display text-xs font-bold text-amber-700 uppercase">Sirius #2</span>
                    </div>
                    <div className="flex gap-2 text-xl">
                      {siriusIcons2.map(id => {
                        const opt = SIRIUS_OPTIONS.find(o => o.id === id);
                        return <span key={id}>{opt?.emoji}</span>;
                      })}
                      {siriusIcons2.length === 0 && <span className="text-stone-300">—</span>}
                    </div>
                    <p className="font-sans text-[10px] text-stone-400">
                      {CHARM_PRODUCTS[1].price.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                ) : (
                  <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Compass className="h-4 w-4 text-rose-500" />
                      <span className="font-display text-xs font-bold text-rose-700 uppercase">Polaris</span>
                    </div>
                    <p className="font-sans text-xs text-stone-700 italic leading-relaxed">
                      {customQuote
                        ? `"${customQuote}"`
                        : polarisQuote
                        ? `"${POLARIS_QUOTES.find(q => q.id === polarisQuote)?.[language === 'vi' ? 'textVi' : 'text']}"`
                        : '—'}
                    </p>
                    <p className="font-sans text-[10px] text-stone-400">
                      {CHARM_PRODUCTS[2].price.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-stone-900 text-white rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {language === 'vi' ? 'Tổng cộng' : 'Total'}
                  </p>
                  <p className="font-display text-2xl font-black text-amber-400">
                    {totalPrice.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-stone-600" />
              </div>
            </div>
          )}

          {/* ═══ STEP 4: Order info ═══ */}
          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-rose-500" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
                    {language === 'vi' ? 'Bước 4 — Đặt hàng' : 'Step 4 — Place Order'}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {language === 'vi' ? 'Thông tin đặt hàng' : 'Order Information'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'vi' ? 'Họ và tên' : 'Full Name'} *
                  </label>
                  <input
                    type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'vi' ? 'Số điện thoại' : 'Phone'} *
                  </label>
                  <input
                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Email
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'vi' ? 'Địa chỉ giao hàng' : 'Delivery Address'} *
                  </label>
                  <input
                    type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {language === 'vi' ? 'Ghi chú' : 'Note'}
                </label>
                <textarea
                  rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder={language === 'vi' ? 'Ghi chú thêm cho đơn hàng...' : 'Additional notes...'}
                  className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                />
              </div>

              {/* Order summary */}
              <div className="bg-stone-900 text-white rounded-2xl p-6 space-y-3">
                <p className="font-display text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {language === 'vi' ? 'Tóm tắt đơn hàng' : 'Order Summary'}
                </p>
                <div className="space-y-2 text-sm font-sans">
                  {astraStyle && (
                    <div className="flex justify-between">
                      <span className="text-stone-300">Astra — {nickname}</span>
                      <span className="text-stone-300">{CHARM_PRODUCTS[0].price.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  {siriusIcons.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-300">Sirius {useDoubleSirius ? '#1' : ''} — {siriusIcons.map(id => SIRIUS_OPTIONS.find(o => o.id === id)?.emoji).join(' ')}</span>
                      <span className="text-stone-300">{CHARM_PRODUCTS[1].price.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  {useDoubleSirius && siriusIcons2.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-300">Sirius #2 — {siriusIcons2.map(id => SIRIUS_OPTIONS.find(o => o.id === id)?.emoji).join(' ')}</span>
                      <span className="text-stone-300">{CHARM_PRODUCTS[1].price.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  {!useDoubleSirius && (polarisQuote || customQuote) && (
                    <div className="flex justify-between">
                      <span className="text-stone-300">Polaris</span>
                      <span className="text-stone-300">{CHARM_PRODUCTS[2].price.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  <div className="border-t border-stone-700 pt-2 flex justify-between">
                    <span className="font-bold text-white">{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                    <span className="font-display text-lg font-black text-amber-400">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-stone-100 mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 bg-black hover:bg-stone-800 text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer transition-all hover:shadow-lg"
              >
                <span>{language === 'vi' ? 'Tiếp theo' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => alert(language === 'vi' ? 'Đặt hàng thành công! YOUniverse sẽ liên hệ bạn sớm 🚀' : 'Order placed! YOUniverse will contact you soon 🚀')}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-display text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-full cursor-pointer transition-all hover:shadow-lg"
              >
                <span>{language === 'vi' ? 'Xác nhận đặt hàng' : 'Confirm Order'}</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
