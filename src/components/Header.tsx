import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Sun, 
  Moon, 
  Type, 
  Menu, 
  X, 
  BookOpen, 
  MessageSquare, 
  Search, 
  Award, 
  FlaskConical, 
  ShieldAlert, 
  Cpu,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: t.homeTab, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'chat', label: t.chatTab, icon: <MessageSquare className="w-4 h-4" />, badge: 'AI RAG' },
    { id: 'standard-finder', label: t.standardFinderTab, icon: <Search className="w-4 h-4" /> },
    { id: 'certification', label: t.certTab, icon: <Award className="w-4 h-4" /> },
    { id: 'labs', label: t.labsTab, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'consumer', label: t.consumerTab, icon: <ShieldAlert className="w-4 h-4" />, badge: 'HUID' },
    { id: 'architecture', label: t.archTab, icon: <Cpu className="w-4 h-4" />, badge: 'Demo' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-bis-navy text-white shadow-md border-b-4 border-bis-saffron">
      {/* Top Accessibility & Govt Bar */}
      <div className="bg-bis-dark/80 px-4 py-1 border-b border-white/10 text-xs flex flex-wrap justify-between items-center text-slate-300">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 font-medium text-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            मानक पथप्रदर्शक | Bureau of Indian Standards (BIS)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-amber-300 font-semibold">Government of India / भारत सरकार</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Font Resizing Controls */}
          <div className="flex items-center space-x-1 bg-white/10 rounded px-1.5 py-0.5" title="Font Resize">
            <Type className="w-3 h-3 text-slate-400" />
            <button 
              onClick={() => setFontSize('normal')}
              className={`px-1 rounded text-[11px] font-bold ${fontSize === 'normal' ? 'bg-bis-saffron text-white' : 'hover:text-white'}`}
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('large')}
              className={`px-1 rounded text-[12px] font-bold ${fontSize === 'large' ? 'bg-bis-saffron text-white' : 'hover:text-white'}`}
            >
              A+
            </button>
            <button 
              onClick={() => setFontSize('xlarge')}
              className={`px-1 rounded text-[13px] font-bold ${fontSize === 'xlarge' ? 'bg-bis-saffron text-white' : 'hover:text-white'}`}
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-white/10 hover:bg-white/20 text-slate-200'}`}
            title="Toggle High Contrast Mode"
          >
            {highContrast ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            <span className="hidden md:inline">{highContrast ? 'Normal' : 'High Contrast'}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-white/10 rounded px-2 py-0.5 hover:bg-white/20 transition-colors">
            <Globe className="w-3.5 h-3.5 mr-1 text-bis-saffron" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-bis-navy text-white">
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-bis-saffron to-amber-600 flex items-center justify-center shadow-lg border-2 border-white/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                ManakSetu <span className="text-bis-saffron">AI</span>
                <span className="text-sm font-semibold text-amber-200">मानक सेतु</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-bis-saffron/20 border border-bis-saffron/40 text-bis-saffron">
                <Sparkles className="w-3 h-3" /> BIS RAG 2.0
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Bureau of Indian Standards • National AI Standards & Compliance Assistant
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-bis-saffron text-white shadow-md'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-bis-navy' : 'bg-bis-saffron/30 text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2">
          <a
            href="https://manakonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-md transition-colors"
          >
            <span>e-BIS Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-bis-saffron hover:bg-bis-saffronDark text-white rounded-md shadow-md hover:shadow-glow transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Launch Assistant</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-bis-dark border-t border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-bis-saffron text-white font-bold'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-amber-200">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={() => {
                setActiveTab('chat');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-bold bg-bis-saffron text-white rounded"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
