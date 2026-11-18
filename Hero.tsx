import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  FlaskConical, 
  Percent, 
  HelpCircle,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { LanguageCode, ActiveTab } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface HeroProps {
  language: LanguageCode;
  onSearchSubmit: (query: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  language, 
  onSearchSubmit,
  setActiveTab 
}) => {
  const [queryInput, setQueryInput] = useState('');
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearchSubmit(queryInput);
    }
  };

  const samplePrompts = [
    'What standard applies to LED bulbs?',
    'How do I get ISI certification for my food product?',
    'Is my 22K gold jewellery hallmark valid?',
    'What documents are needed for a CRS license?'
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-bis-navy via-bis-dark to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-bis-saffron">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bis-saffron rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        {/* National Standards Body Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300 shadow-inner">
          <ShieldCheck className="w-4 h-4 text-bis-saffron" />
          <span>Bureau of Indian Standards (BIS) • National AI Standards Portal</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
          Empowering India with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-bis-saffron via-amber-300 to-yellow-400">
            Source-Backed Standards & Compliance AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {t.heroDesc} Instant, clause-grounded guidance on <strong>ISI Mark (Scheme-I)</strong>, <strong>CRS Electronics</strong>, <strong>Gold Hallmarking (HUID)</strong>, and <strong>Testing Laboratories</strong>.
        </p>

        {/* Main Search / Chat Input Box */}
        <div className="max-w-3xl mx-auto pt-2">
          <form onSubmit={handleHeroSubmit} className="relative flex items-center shadow-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={t.askInputPlaceholder}
              className="w-full pl-12 pr-32 sm:pr-40 py-4 bg-white/95 backdrop-blur-md text-slate-900 placeholder-slate-500 rounded-2xl text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-bis-saffron focus:bg-white shadow-xl transition-all font-medium"
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 bg-bis-saffron hover:bg-bis-saffronDark text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-glow transition-all cursor-pointer"
            >
              <span>{t.askButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-bis-saffron" />
              Try asking:
            </span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSearchSubmit(prompt)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-full text-xs font-medium border border-white/15 transition-all shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* MSME 50% Concession Banner */}
        <div className="max-w-3xl mx-auto mt-6 bg-gradient-to-r from-emerald-900/60 via-teal-900/60 to-emerald-900/60 border border-emerald-500/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">MSME & Women-Led Startup Quality Incentive</span>
              <span className="text-[11px] text-slate-200">Avail 50% concession on application and minimum marking fees.</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('certification')}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-md shadow transition-colors"
          >
            Calculate Concession →
          </button>
        </div>

        {/* Metrics Counters Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">21,500+</div>
            <div className="text-xs text-slate-300 mt-0.5">Indian Standards (IS)</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">42,000+</div>
            <div className="text-xs text-slate-300 mt-0.5">Operative ISI Licenses</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">1,450+</div>
            <div className="text-xs text-slate-300 mt-0.5">Recognized Test Labs</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">99.8%</div>
            <div className="text-xs text-slate-300 mt-0.5">HUID Hallmark Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
