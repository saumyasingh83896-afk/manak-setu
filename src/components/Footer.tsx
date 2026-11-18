import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Award,
  Sparkles,
  Heart
} from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <footer className="bg-bis-navy text-white border-t-4 border-bis-saffron mt-16">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Charter */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-lg bg-bis-saffron flex items-center justify-center text-white shadow">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-black text-white">ManakSetu AI</span>
                <div className="text-xs text-amber-300 font-semibold">मानक सेतु पोर्टल</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI-Powered Conversational Compliance Assistant for the Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Zero-Hallucination Grounded Architecture
            </div>
          </div>

          {/* Col 2: Official BIS Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Official BIS Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="https://manakonline.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Manakonline (e-BIS Portal)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://www.crsbis.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>CRS Electronics Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://knowyourstandards.bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Know Your Standards Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://www.bis.gov.in/hallmarking-overview" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>BIS Hallmarking Registry</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Citizen Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Helpline & Support
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-bis-saffron flex-shrink-0" />
                <span>BIS HQ Helpline: +91-11-23230131</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>National Consumer Helpline: 1915</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-bis-saffron flex-shrink-0" />
                <span>helpdesk@manakonline.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-bis-saffron flex-shrink-0" />
                <span>Manak Bhavan, 9 B.S. Zafar Marg, New Delhi 110002</span>
              </div>
            </div>
          </div>

          {/* Col 4: Statutory Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Statutory Integrity
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
              This application prototype illustrates AI-guided compliance navigation. Every response cites specific IS Codes and Gazette notifications under the Bureau of Indian Standards Act, 2016.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Gov.in Bar */}
      <div className="bg-bis-dark py-4 px-4 text-center text-xs text-slate-400 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © 2026 Bureau of Indian Standards (BIS) • Government of India. Prototype for Innovation.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Designed for MSMEs, Startups & Consumers</span>
            <span>•</span>
            <span className="text-amber-300 font-semibold">मानक पथप्रदर्शक 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
