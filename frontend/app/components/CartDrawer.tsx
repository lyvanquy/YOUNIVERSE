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
        
        {/* Drawer container panel - premium glassmorphism */}
        <div className="w-screen max-w-md bg-white/85 backdrop-blur-xl border-l border-white/20 flex flex-col justify-between shadow-2xl relative z-10 animate-slide-in">
          
          {/* Header segment of lookbook drawer */}
          <div className="px-6 py-5 border-b border-stone-100/60 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-extrabold text-black uppercase tracking-tight flex items-center space-x-1.5">
                <span>Custom Designs Cart</span>
                <span className="text-[10px] font-mono font-black py-0.5 px-2 bg-stone-100 rounded text-stone-500">
                  {cartItems.length}
                </span>
              </h2>
              <p className="font-sans text-[11px] text-stone-400">
                Storing your custom YOUniverse jewelry drafts
              </p>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:bg-white/50 hover:text-black focus:outline-none transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List items core area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 relative overflow-hidden">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 border border-dashed border-stone-200 rounded-full animate-spin-slow" />
                  <div className="absolute w-14 h-14 rounded-full bg-amber-500/5 blur-md" />
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-stone-200 text-amber-500 shadow-sm z-10 animate-pulse">
                    <Sparkles className="h-5 w-5 animate-twinkle" />
                  </div>
                </div>
                
                <div className="space-y-2 relative z-10">
                  <h3 className="font-display text-base font-black text-stone-900 uppercase tracking-wide">
                    Your Galaxy is Empty
                  </h3>
                  <p className="font-sans text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                    Craft your own custom jewelry draft in 3 steps on the home screen to place custom orders!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => {
                  
                  // Map custom colors with premium borders and glass styles
                  const accentColorClass = {
                    blue: 'border-blue-200/60 bg-blue-50/20 text-blue-600 hover:border-blue-400/50 hover:shadow-blue-500/5',
                    yellow: 'border-amber-200/60 bg-amber-50/20 text-amber-600 hover:border-amber-400/50 hover:shadow-amber-500/5',
                    red: 'border-rose-200/60 bg-rose-50/20 text-rose-600 hover:border-rose-400/50 hover:shadow-rose-500/5',
                    indigo: 'border-indigo-200/60 bg-indigo-50/20 text-indigo-600 hover:border-indigo-400/50 hover:shadow-indigo-500/5'
                  }[item.vibeColor] || 'border-stone-200 bg-stone-50/30';

                  return (
                    <div 
                      key={index}
                      className={`relative border rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-md ${accentColorClass}`}
                    >
                      
                      {/* Mini visual mockup of the custom jewelry */}
                      <div className="w-16 h-16 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner select-none">
                        {/* Mesh grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />
                        
                        {/* Vibe color glowing spot */}
                        <div className={`absolute w-8 h-8 rounded-full blur-[8px] opacity-40 ${
                          item.vibeColor === 'blue' ? 'bg-blue-500' :
                          item.vibeColor === 'yellow' ? 'bg-amber-500' :
                          item.vibeColor === 'red' ? 'bg-rose-500' : 'bg-indigo-500'
                        }`} />

                        {/* Visual base chain */}
                        {item.baseType === 'necklace' && (
                          <div className="absolute w-10 h-10 rounded-full border border-stone-700/80 top-3" />
                        )}
                        {item.baseType === 'bracelet' && (
                          <div className="absolute w-9 h-9 rounded-full border border-dashed border-stone-650/70" />
                        )}
                        {item.baseType === 'cord' && (
                          <div className="absolute w-11 h-0.5 bg-stone-700/80 rounded-full" />
                        )}

                        {/* Visual Charms hanging */}
                        <div className="absolute bottom-4 flex justify-center -space-x-1 z-10">
                          {item.selectedCharms.map((charm, cIdx) => (
                            <div 
                              key={cIdx}
                              className={`w-3.5 h-3.5 rounded-full border border-white/30 shadow-md flex items-center justify-center text-[7px] leading-none ${
                                charm === 'astra' ? 'bg-blue-500 text-white' :
                                charm === 'sirius' ? 'bg-amber-500 text-stone-900' :
                                'bg-rose-500 text-white'
                              }`}
                            >
                              {charm === 'astra' && '✦'}
                              {charm === 'sirius' && '♥'}
                              {charm === 'polaris' && '☩'}
                            </div>
                          ))}
                        </div>

                        {/* Tiny engraved initial label */}
                        <div className="absolute bottom-1 text-[6.5px] font-mono text-stone-300 font-bold tracking-tighter max-w-[50px] truncate uppercase bg-stone-900/90 px-1 py-0.5 rounded border border-stone-850 z-10">
                          {item.customName}
                        </div>
                      </div>

                      {/* Item details info column */}
                      <div className="flex-1 space-y-1.5 text-left">
                        {/* Type card metadata banner */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[8px] font-mono font-bold uppercase text-stone-400 tracking-wider">
                            Vibe: {item.vibeColor}
                          </span>
                          <span className="text-stone-300 text-[8px]">•</span>
                          <span className="text-[8px] font-mono font-bold text-stone-400 block uppercase">
                            Base: {item.baseType}
                          </span>
                        </div>

                        {/* ENGRAVED CHOSEN INSCRIPTION TITLE */}
                        <h4 className="font-display text-sm font-extrabold text-stone-900 uppercase tracking-wide">
                          Core Engraved: &ldquo;<span className="underline decoration-2 decoration-amber-500">{item.customName}</span>&rdquo;
                        </h4>

                        {/* Active charms badges attached */}
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {item.selectedCharms.map((charm, cIdx) => (
                            <span 
                              key={cIdx}
                              className="inline-flex items-center gap-1 bg-white/95 border border-stone-150 px-2 py-0.5 rounded-full text-[9px] font-mono text-stone-600 shadow-sm"
                            >
                              {charm === 'astra' && <Sparkles className="h-2.5 w-2.5 text-blue-500" />}
                              {charm === 'sirius' && <Heart className="h-2.5 w-2.5 text-amber-500" />}
                              {charm === 'polaris' && <Compass className="h-2.5 w-2.5 text-red-500" />}
                              <span className="capitalize">{charm}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Remove item action */}
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-1.5 rounded-lg border border-stone-200 bg-white/90 hover:border-red-500 hover:text-red-500 text-stone-400 hover:bg-stone-50 focus:outline-none transition-all duration-305 shrink-0 cursor-pointer shadow-sm"
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
            <div className="p-6 border-t border-stone-100/60 bg-stone-50/50 backdrop-blur-md space-y-4 relative z-20">
              
              <div className="flex items-start space-x-2 text-left">
                <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-sans text-[11px] text-stone-500 leading-normal">
                  Visual design customizer supports local draft saving. Submit your design query to the ISB Event Team to schedule physical handcrafting.
                </p>
              </div>

              <div className="group relative rounded-full overflow-hidden">
                {/* Flowing Gradient background */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-400 via-rose-500 to-blue-500 opacity-90 transition-opacity duration-300 pointer-events-none z-0 animate-flow-gradient rounded-full" />
                
                <button
                  onClick={onCheckout}
                  className="relative w-full rounded-full bg-stone-950/95 hover:bg-black/90 text-white py-4 font-display text-xs font-black tracking-widest uppercase transition-all duration-350 border border-transparent cursor-pointer z-10 text-center flex items-center justify-center space-x-2"
                >
                  <span>Submit Custom Design Order</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-twinkle" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
