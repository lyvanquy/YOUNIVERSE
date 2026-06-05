import { X, Trash2, Shield, Heart, Sparkles, Compass } from 'lucide-react';
import { CustomJewelry } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CustomJewelry[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" id="cart-drawer-overlay">
      
      {/* Black backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Drawer container panel */}
        <div className="w-screen max-w-md bg-white border-l border-stone-200 flex flex-col justify-between shadow-2xl relative z-10 animate-slide-in">
          
          {/* Header segment of lookbook drawer */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-extrabold text-black uppercase tracking-tight flex items-center space-x-1.5">
                <span>Giỏ Hàng Thiết Kế</span>
                <span className="text-[10px] font-mono font-black py-0.5 px-2 bg-stone-100 rounded text-stone-500">
                  {cartItems.length}
                </span>
              </h2>
              <p className="font-sans text-[11px] text-stone-400">
                Lưu trữ các phác thảo trang sức YOUniverse tùy chọn của bạn
              </p>
            </div>

            <button 
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:bg-stone-50 hover:text-black focus:outline-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List items core area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center border-2 border-dashed border-stone-300 text-stone-400">
                  <Sparkles className="h-6 w-6 animate-twinkle" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-stone-800 uppercase">
                    Chưa có thiết kế nào
                  </h3>
                  <p className="font-sans text-xs text-stone-400 max-w-xs mx-auto">
                    Hãy trải nghiệm &ldquo;Khóa Thiết Kế YOUniverse&rdquo; 3 bước ở trang chủ để tự tay đúc nên chiếc bùa may mắn của riêng mình!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => {
                  
                  // Map custom colors
                  const accentColorClass = {
                    blue: 'border-blue-300 bg-blue-50/40 text-blue-500',
                    yellow: 'border-amber-300 bg-amber-50/40 text-amber-500',
                    red: 'border-rose-300 bg-rose-50/40 text-red-500',
                    indigo: 'border-indigo-300 bg-indigo-50/40 text-indigo-500'
                  }[item.vibeColor] || 'border-stone-300 bg-stone-50';

                  return (
                    <div 
                      key={index}
                      className={`relative border-2 rounded-2xl p-4 flex items-start justify-between gap-4 transition-all hover:border-black ${accentColorClass}`}
                    >
                      
                      <div className="space-y-2 text-left">
                        {/* Type card metadata banner */}
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] font-mono font-black uppercase text-stone-400 tracking-wider">
                            Vibe: {item.vibeColor}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-[9px] font-mono font-bold text-stone-600 block uppercase">
                            Base: {item.baseType}
                          </span>
                        </div>

                        {/* ENGRAVED CHOSEN INSCRIPTION TITLE */}
                        <h4 className="font-display text-base font-extrabold text-black uppercase tracking-wide">
                          Engraved Core: &ldquo;<span className="underline decoration-2 decoration-amber-500">{item.customName}</span>&rdquo;
                        </h4>

                        {/* Active charms badges attached */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.selectedCharms.map((charm, cIdx) => (
                            <span 
                              key={cIdx}
                              className="inline-flex items-center gap-1 bg-white border border-stone-200 px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-600"
                            >
                              {charm === 'astra' && <Sparkles className="h-3 w-3 text-blue-500" />}
                              {charm === 'sirius' && <Heart className="h-3 w-3 text-amber-500" />}
                              {charm === 'polaris' && <Compass className="h-3 w-3 text-red-500" />}
                              <span className="capitalize">{charm}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Remove item action */}
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-1.5 rounded-lg border border-stone-200 bg-white hover:border-red-500 hover:text-red-500 text-stone-400 hover:bg-stone-50 focus:outline-none transition-colors shrink-0"
                        title="Delete Configuration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Footer segment: Submit Pre-Order */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
              
              <div className="flex items-start space-x-2 text-left">
                <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-stone-500 leading-normal">
                  Hệ thống thiết kế độc bản trực quan hỗ trợ lưu trữ cục bộ. Gửi yêu cầu đặt cọc cho ISB Event Team để đặt lịch gia công.
                </p>
              </div>

              <button
                onClick={onCheckout}
                className="w-full rounded-2xl bg-black hover:bg-stone-900 border-2 border-black text-white py-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300"
              >
                Gửi Đơn Đặt Hàng Phác Thảo
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
