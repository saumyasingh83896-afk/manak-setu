import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Zap, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { STANDARDS_DATABASE } from '../data/standards_kb';
import { StandardItem, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface StandardFinderProps {
  language: LanguageCode;
  onAskChatWithQuery: (query: string) => void;
}

export const StandardFinder: React.FC<StandardFinderProps> = ({ 
  language, 
  onAskChatWithQuery 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardCategory, setWizardCategory] = useState<string>('');
  const [wizardProductType, setWizardProductType] = useState<string>('');
  const [selectedStandard, setSelectedStandard] = useState<StandardItem | null>(STANDARDS_DATABASE[0]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const categories = [
    'ALL',
    'Electronics & IT',
    'Food & Agriculture',
    'Jewellery & Hallmarking',
    'Consumer Safety',
    'Construction & Civil',
    'Automotive & EV',
    'Renewable Energy'
  ];

  const schemes = [
    'ALL',
    'ISI Mark (Scheme-I)',
    'CRS (Scheme-II)',
    'Hallmarking'
  ];

  const filteredStandards = STANDARDS_DATABASE.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicableProducts.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesScheme = selectedScheme === 'ALL' || item.scheme.includes(selectedScheme);

    return matchesSearch && matchesCategory && matchesScheme;
  });

  const handleWizardSubmit = () => {
    if (wizardCategory) {
      setSelectedCategory(wizardCategory);
      const match = STANDARDS_DATABASE.find(s => s.category === wizardCategory);
      if (match) {
        setSelectedStandard(match);
      }
    }
    setWizardStep(3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-bis-navy via-bis-dark to-bis-blue text-white rounded-2xl p-6 sm:p-8 shadow-card border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 w-96 h-96 -mr-20 -mt-20 pointer-events-none">
          <Layers className="w-full h-full text-white" />
        </div>
        <div className="max-w-3xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bis-saffron/30 text-amber-300 border border-bis-saffron/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Product-to-Standard Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Find Your Applicable Indian Standard (IS Code)
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Search our curated knowledge base of 21,000+ Indian Standards. Discover mandatory Quality Control Orders (QCOs), testing protocols, applicable conformity schemes, and MSME fee benefits.
          </p>
        </div>
      </div>

      {/* Two Modes: Interactive Product Recommendation Wizard vs Direct Search Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search & Standards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Box */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Product (e.g. LED, Water, Gold, Helmets)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bis-saffron focus:bg-white transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pt-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 text-slate-700 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-medium focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="bg-slate-100 text-slate-700 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-medium focus:outline-none cursor-pointer"
              >
                {schemes.map((s) => (
                  <option key={s} value={s}>
                    Scheme: {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Matching Standards ({filteredStandards.length})
            </div>

            {filteredStandards.map((std) => {
              const isSelected = selectedStandard?.id === std.id;
              return (
                <div
                  key={std.id}
                  onClick={() => setSelectedStandard(std)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-bis-light border-bis-blue ring-2 ring-bis-blue/30 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                        {std.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {std.title}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      std.mandatoryStatus === 'Mandatory' 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {std.mandatoryStatus}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono font-semibold text-bis-saffron">
                    {std.isNumber}
                  </div>

                  <div className="mt-2 text-xs text-slate-600 line-clamp-2">
                    {std.summary}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-500">{std.scheme}</span>
                    <span className="text-bis-blue font-bold flex items-center gap-1 group">
                      View Dossier <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredStandards.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
                <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <p className="text-sm font-semibold">No standard found matching your query.</p>
                <p className="text-xs mt-1">Try searching by general terms like "LED", "Water", "Gold", "Toys" or ask in the AI Chat.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full Conformity Assessment Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedStandard ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
              {/* Dossier Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-bis-navy text-white">
                      {selectedStandard.scheme}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {selectedStandard.category}
                    </span>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    selectedStandard.mandatoryStatus === 'Mandatory'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {selectedStandard.mandatoryStatus} QCO
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {selectedStandard.title}
                </h3>
                <p className="text-sm font-semibold text-bis-saffron font-mono mt-1">
                  {selectedStandard.isNumber}
                </p>
                {selectedStandard.qcoDate && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    Statutory Notification: {selectedStandard.qcoDate}
                  </p>
                )}
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                  Regulatory Scope & Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedStandard.summary}
                </p>
              </div>

              {/* Key Technical Clauses */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Key Technical Clauses to Comply
                </h4>
                <div className="space-y-2.5">
                  {selectedStandard.keyClauses.map((clause, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-bis-navy font-mono">
                          {clause.clauseNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {clause.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {clause.requirement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Testing Parameters */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Mandatory Lab Testing Parameters
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedStandard.sampleTestingParams.map((param, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 p-2 bg-amber-50/60 rounded border border-amber-200/60 text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{param}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applicable Products */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                  Covered Commercial Product Lines
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStandard.applicableProducts.map((prod, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full border border-slate-200 font-medium">
                      {prod}
                    </span>
                  ))}
                </div>
              </div>

              {/* MSME Concessions Box */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white flex-shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-emerald-900">
                    MSME & Startup Concession Guarantee
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    {selectedStandard.msmeBenefit}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3 items-center justify-between">
                <button
                  onClick={() => onAskChatWithQuery(`Explain the complete certification procedure and testing fees for ${selectedStandard.isNumber}`)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-bis-navy hover:bg-bis-dark text-white font-bold text-xs shadow transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI Detailed Guidance for this Standard</span>
                </button>

                <a
                  href={selectedStandard.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-bis-saffron hover:bg-bis-saffronDark text-white font-bold text-xs shadow transition-colors"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
              <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-800">Select a Standard to View Full Dossier</h3>
              <p className="text-xs text-slate-500 mt-1">Choose any item from the left panel to inspect its clause-by-clause requirements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
