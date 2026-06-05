import { Phone, Sparkles } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';

export default function Footer() {
  return (
    <footer className="bg-black text-stone-200" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Col 1: YOUniverse Logo + Slogan (Page 9) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black font-extrabold text-xl font-display">
                YO
              </div>
              <div>
                <span className="font-display text-xl font-extrabold tracking-widest text-white uppercase block">
                  YOUniverse
                </span>
                <span className="text-[9px] font-mono tracking-widest text-stone-400 block uppercase">
                  A galaxy to hold, a story to be told
                </span>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Nơi mỗi người tìm thấy chính mình trong từng mảnh ghép lấp lánh tinh vân. Dự án thiết kế phụ kiện cá nhân hóa do sinh viên UEH.ISB dẫn dắt.
            </p>

            {/* Sparkle decorative */}
            <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-mono">
              <Sparkles className="h-4 w-4 animate-twinkle" />
              <span>Blink Blink Theme Vũ Trụ 2026</span>
            </div>
          </div>

          {/* Col 2: Address & Social connections (Page 9) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white">
              Address
            </h3>
            
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              279 Nguyễn Tri Phương street, Vườn Lài Ward, HCMC
            </p>

            <div className="space-y-4 pt-2">
              <h4 className="font-display text-[11px] font-bold uppercase tracking-widest text-stone-400">
                Contact Us
              </h4>
              <div className="flex flex-col space-y-2 text-sm text-stone-400">
                {/* Tiktok Link */}
                <a 
                  href="https://www.tiktok.com/@youniverse_ueh.isb?_r=1&_t=ZS-96wc5zPz4a4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center space-x-2 font-display text-xs"
                >
                  <span className="bg-stone-900 p-1.5 rounded-md text-white font-bold border border-stone-800">Tik</span>
                  <span>Tiktok @youniverse_ueh.isb</span>
                </a>
                
                {/* Instagram Link */}
                <a 
                  href="https://www.instagram.com/youniverse_since2026/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors flex items-center space-x-2 font-display text-xs"
                >
                  <span className="bg-stone-900 p-1.5 rounded-md text-pink-500 font-bold border border-stone-800">Ins</span>
                  <span>Instagram @youniverse_since2026</span>
                </a>

                {/* Facebook Link */}
                <a 
                  href="https://www.facebook.com/share/17BFjM2d7T/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center space-x-2 font-display text-xs"
                >
                  <span className="bg-stone-900 p-1.5 rounded-md text-blue-500 font-bold border border-stone-800">Fb</span>
                  <span>Facebook YOUniverse</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Main Contact grid (2 rows, 4 columns on desktop as requested in PDF) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2">
              Main contacts
            </h3>
            
            {/* Grid of the 8 members: 2 rows of 4 contributors */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs">
              {TEAM_MEMBERS.map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-stone-950 p-2.5 rounded-lg border border-stone-900 hover:border-stone-800 transition-colors space-y-1"
                >
                  <p className="font-sans font-semibold text-white tracking-wide truncate">
                    {member.name}
                  </p>
                  <p className="font-mono text-[9px] text-amber-500 font-bold">
                    {member.role}
                  </p>
                  <a 
                    href={`tel:${member.phone}`} 
                    className="font-mono text-[10px] text-stone-400 hover:text-white flex items-center space-x-1 mt-0.5"
                  >
                    <Phone className="h-2.5 w-2.5 shrink-0" />
                    <span>{member.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 border-t border-stone-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 font-sans">
          <p>© 2026 YOUniverse. Designed with pride by ISB event contributors.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-mono">
            <span>Class: ISB Event Team</span>
            <span>•</span>
            <span>University of Economics HCMC</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
