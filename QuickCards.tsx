import React from 'react';
import { 
  Search, 
  Award, 
  ShieldCheck, 
  FlaskConical, 
  FileWarning, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface QuickCardsProps {
  language: LanguageCode;
  setActiveTab: (tab: ActiveTab) => void;
  onAskChatWithQuery: (query: string) => void;
}

export const QuickCards: React.FC<QuickCardsProps> = ({ 
  language, 
  setActiveTab,
  onAskChatWithQuery
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const cards = [
    {
      id: 'find-std',
      title: 'Find a Standard (IS Codes)',
      titleHi: 'मानक खोजें (IS कोड)',
      desc: 'Discover applicable IS numbers, mandatory QCOs, and testing parameters for your product line.',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      tag: '21,500+ Standards',
      action: () => setActiveTab('standard-finder'),
      color: 'border-blue-200 hover:border-blue-500 bg-gradient-to-b from-white to-blue-50/30'
    },
    {
      id: 'cert-guide',
      title: 'Certification Guidance',
      titleHi: 'प्रमाणन मार्गदर्शन',
      desc: 'Step-by-step visual roadmap for ISI Mark (Scheme-I), CRS (Scheme-II), and FMCS with 50% MSME calculator.',
      icon: <Award className="w-6 h-6 text-bis-saffron" />,
      tag: '50% MSME Concession',
      action: () => setActiveTab('certification'),
      color: 'border-amber-200 hover:border-amber-500 bg-gradient-to-b from-white to-amber-50/30'
    },
    {
      id: 'hallmark-tool',
      title: 'Gold Hallmarking & HUID',
      titleHi: 'हॉलमार्किंग एवं HUID',
      desc: 'Verify 6-digit laser HUID codes, 22K/24K purity fineness, and AHC assaying credentials in real-time.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      tag: 'Live HUID Lookup',
      action: () => setActiveTab('consumer'),
      color: 'border-emerald-200 hover:border-emerald-500 bg-gradient-to-b from-white to-emerald-50/30'
    },
    {
      id: 'test-labs',
      title: 'Testing Lab Directory',
      titleHi: 'प्रयोगशाला खोजें',
      desc: 'Locate 1,450+ BIS Central, Regional, and NABL-recognized testing facilities across India.',
      icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
      tag: 'State & Product Filters',
      action: () => setActiveTab('labs'),
      color: 'border-purple-200 hover:border-purple-500 bg-gradient-to-b from-white to-purple-50/30'
    },
    {
      id: 'consumer-grievance',
      title: 'Consumer Complaints',
      titleHi: 'उपभोक्ता शिकायत',
      desc: 'Report counterfeit ISI marks, unhallmarked gold sales, or substandard products to BIS enforcement.',
      icon: <FileWarning className="w-6 h-6 text-rose-600" />,
      tag: 'Enforcement Action',
      action: () => setActiveTab('consumer'),
      color: 'border-rose-200 hover:border-rose-500 bg-gradient-to-b from-white to-rose-50/30'
    },
    {
      id: 'standards-clubs',
      title: 'Standards Clubs & Academia',
      titleHi: 'मानक क्लब एवं छात्र संपर्क',
      desc: 'BIS educational outreach program establishing 10,000+ Standards Clubs in schools and engineering colleges.',
      icon: <GraduationCap className="w-6 h-6 text-teal-600" />,
      tag: 'Youth Learning',
      action: () => onAskChatWithQuery('What are BIS Standards Clubs in schools and colleges?'),
      color: 'border-teal-200 hover:border-teal-500 bg-gradient-to-b from-white to-teal-50/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Comprehensive BIS Compliance Modules
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Select any portal service to access interactive tools, verification gateways, and AI-grounded guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={card.action}
            className={`rounded-2xl p-6 shadow-card hover:shadow-card-hover border-2 cursor-pointer transition-all flex flex-col justify-between group ${card.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {card.tag}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-bis-navy transition-colors">
                {language === 'hi' ? card.titleHi : card.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-bis-blue group-hover:text-bis-saffron transition-colors">
              <span>Access Module</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
