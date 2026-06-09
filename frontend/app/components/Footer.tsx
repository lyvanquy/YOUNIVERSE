import { Phone } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';

export default function Footer() {
  const { language, setLanguage } = useYouniverseApp();
  const t = translations[language];

  return (
    <footer className="bg-black text-stone-200" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid - 4 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Col 1: YOUniverse Logo + Slogan */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo-youniverse.png" 
                alt="YOUniverse Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="font-youth text-xl font-extrabold tracking-widest text-white uppercase block">
                  YOUniverse
                </span>
                <span className="text-[9px] font-mono tracking-widest text-stone-400 block uppercase">
                  A galaxy to hold, a story to be told
                </span>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed font-sans">
              {t.footerLogoDesc}
            </p>
          </div>

          {/* Col 2: Address & Social connections */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2 mb-3">
                {t.address}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed font-sans">
                {t.addressText}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-display text-[11px] font-bold uppercase tracking-widest text-stone-400">
                {t.contactUs}
              </h4>
              <div className="flex items-center space-x-3 pt-1">
                {/* Tiktok Link */}
                <a 
                  href="https://www.tiktok.com/@youniverse_ueh.isb?_r=1&_t=ZS-96wc5zPz4a4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 border border-stone-900 text-stone-400 hover:bg-black hover:text-white hover:border-stone-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
                  title="TikTok"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.15 2.27 1.96 3.71 2.27v3.9c-1.4-.07-2.79-.56-3.95-1.37-.86-.6-1.56-1.38-2.06-2.29-.02 2.64.01 5.28-.01 7.92-.1 1.63-.64 3.23-1.57 4.56-.99 1.39-2.42 2.45-4.05 2.97-1.72.53-3.6.45-5.26-.25-1.59-.68-2.95-1.89-3.78-3.44C-.1 16.59-.16 14.4.42 12.44c.54-1.81 1.7-3.43 3.32-4.47 1.62-1.02 3.59-1.42 5.48-1.08.01 1.39-.02 2.78.01 4.17-1.17-.3-2.43-.07-3.41.62-.97.68-1.56 1.79-1.63 2.99-.07 1.31.52 2.61 1.52 3.42.99.78 2.33 1.05 3.52.71 1.12-.32 2.05-1.16 2.44-2.24.16-.48.24-.99.23-1.49-.02-5.02-.01-10.04-.02-15.06Z" />
                  </svg>
                </a>
                
                {/* Instagram Link */}
                <a 
                  href="https://www.instagram.com/youniverse_since2026/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 border border-stone-900 text-stone-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] cursor-pointer"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook Link */}
                <a 
                  href="https://www.facebook.com/share/17BFjM2d7T/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 border border-stone-900 text-stone-400 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-300 hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] cursor-pointer"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Main Contacts - Group 1 */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2">
              {t.contacts}
            </h3>
            
            <div className="flex flex-col space-y-3">
              {TEAM_MEMBERS.slice(0, 4).map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-stone-950 p-2.5 rounded-lg border border-stone-900 hover:border-stone-800 transition-colors space-y-1 text-left"
                >
                  <p className="font-sans font-semibold text-white tracking-wide truncate">
                    {language === 'vi' ? member.nameVi : member.name}
                  </p>
                  <p className="font-sans text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                    {member.role}
                  </p>
                  <a 
                    href={`tel:${member.phone}`} 
                    className="font-sans text-[10px] text-stone-400 hover:text-white flex items-center space-x-1 mt-0.5"
                  >
                    <Phone className="h-2.5 w-2.5 shrink-0" />
                    <span>{member.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Main Contacts - Group 2 */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2">
              {t.contacts}
            </h3>
            
            <div className="flex flex-col space-y-3">
              {TEAM_MEMBERS.slice(4, 8).map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-stone-950 p-2.5 rounded-lg border border-stone-900 hover:border-stone-800 transition-colors space-y-1 text-left"
                >
                  <p className="font-sans font-semibold text-white tracking-wide truncate">
                    {language === 'vi' ? member.nameVi : member.name}
                  </p>
                  <p className="font-sans text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                    {member.role}
                  </p>
                  <a 
                    href={`tel:${member.phone}`} 
                    className="font-sans text-[10px] text-stone-400 hover:text-white flex items-center space-x-1 mt-0.5"
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
          <p>{t.footerAttribution}</p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-sans text-stone-500">
            <span>{t.classText}</span>
            <span>•</span>
            <span>{t.universityText}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
