import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Clock, 
  Building, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Send,
  X
} from 'lucide-react';
import { TESTING_LABS_DATABASE } from '../data/labs_data';
import { TestingLab, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface LabFinderProps {
  language: LanguageCode;
  onAskChatWithQuery: (query: string) => void;
}

export const LabFinder: React.FC<LabFinderProps> = ({ 
  language,
  onAskChatWithQuery 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLabForInquiry, setSelectedLabForInquiry] = useState<TestingLab | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Extract unique states & categories
  const states = ['ALL', ...Array.from(new Set(TESTING_LABS_DATABASE.map(l => l.state)))];
  const types = ['ALL', 'BIS Central Lab', 'BIS Regional Lab', 'NABL & BIS Recognized Lab', 'Government Lab'];
  const categories = [
    'ALL',
    'Electronics & IT',
    'Food & Agriculture',
    'Jewellery & Hallmarking',
    'Consumer Safety',
    'Chemical & Metallurgy',
    'Construction & Civil',
    'Renewable Energy',
    'Automotive & EV'
  ];

  const filteredLabs = TESTING_LABS_DATABASE.filter(lab => {
    const matchesSearch = 
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.accreditedStandards.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lab.recognizedCategories.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesState = selectedState === 'ALL' || lab.state === selectedState;
    const matchesType = selectedType === 'ALL' || lab.type === selectedType;
    const matchesCat = selectedCategory === 'ALL' || lab.recognizedCategories.includes(selectedCategory);

    return matchesSearch && matchesState && matchesType && matchesCat;
  });

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setSelectedLabForInquiry(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-bis-navy via-bis-dark to-bis-blue text-white rounded-2xl p-6 sm:p-8 shadow-card border border-white/10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bis-saffron/30 text-amber-300 border border-bis-saffron/40 mb-3">
            <FlaskConical className="w-3.5 h-3.5" /> Testing Infrastructure Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Find BIS Recognized & NABL Accredited Testing Labs
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Locate accredited testing facilities across India for safety verification, CRS registration, ISI license sample testing, and gold assaying.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Lab Name, City, Product Standard (e.g. IS 16102, IS 14543, Toys)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bis-saffron focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Filter by State / Region
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 border border-slate-300 rounded-lg p-2 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Lab Governance / Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 border border-slate-300 rounded-lg p-2 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Product Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 border border-slate-300 rounded-lg p-2 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lab Cards Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 px-1">
          <span>Accredited Labs Found: {filteredLabs.length}</span>
          <span>Showing verified facilities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl p-5 shadow-card border border-slate-200 hover:border-bis-saffron hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lab.type === 'BIS Central Lab' 
                      ? 'bg-bis-navy text-white' 
                      : lab.type === 'BIS Regional Lab'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {lab.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                    NABL: {lab.nablAccreditationNo}
                  </span>
                </div>

                {/* Lab Title */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {lab.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-bis-saffron flex-shrink-0" />
                    <span>{lab.city}, {lab.state}</span>
                  </p>
                </div>

                {/* Accredited Categories */}
                <div className="flex flex-wrap gap-1">
                  {lab.recognizedCategories.map((cat, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Key Standards */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Accredited Test Scopes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {lab.accreditedStandards.map((std, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-mono font-semibold text-bis-blue bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Turnaround & Address */}
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-50 px-2 py-1 rounded">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Avg Turnaround: {lab.turnaroundDays}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lab.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{lab.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onAskChatWithQuery(`What are the testing charges and sample requirements at ${lab.name}?`)}
                  className="text-xs font-semibold text-bis-blue hover:text-bis-navy flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-bis-saffron" />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => setSelectedLabForInquiry(lab)}
                  className="px-3 py-1.5 rounded-lg bg-bis-navy hover:bg-bis-dark text-white font-bold text-xs shadow transition-colors"
                >
                  Book / Inquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      {selectedLabForInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-bis-saffron" />
                <span>Request Testing Inquiry</span>
              </h3>
              <button 
                onClick={() => setSelectedLabForInquiry(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-600">The laboratory testing coordinator has been notified. Ref Token: LAB-INQ-2026-8812</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3.5 mt-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="font-bold text-bis-navy">{selectedLabForInquiry.name}</div>
                  <div className="text-slate-500 mt-0.5">{selectedLabForInquiry.address}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Enterprise / Applicant Name</label>
                  <input required placeholder="e.g. Apex Tech Innovations Pvt Ltd" className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-bis-saffron" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Description & Target IS Standard</label>
                  <input required placeholder="e.g. 12W LED Bulb as per IS 16102" className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-bis-saffron" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email / Phone</label>
                  <input required placeholder="contact@company.com / +91-9876543210" className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-bis-saffron" />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLabForInquiry(null)}
                    className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-bis-saffron hover:bg-bis-saffronDark text-white rounded shadow"
                  >
                    Submit Quotation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
