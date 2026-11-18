import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  FileWarning, 
  Send, 
  Lock, 
  QrCode,
  Building,
  Calendar,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_HUID_DATABASE, MOCK_ISI_DATABASE, MOCK_CRS_DATABASE } from '../data/verification_mock';
import { HuidVerificationResult, IsiVerificationResult, CrsVerificationResult, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface ConsumerCornerProps {
  language: LanguageCode;
  onAskChatWithQuery: (query: string) => void;
}

type VerificationType = 'huid' | 'isi' | 'crs';

export const ConsumerCorner: React.FC<ConsumerCornerProps> = ({ 
  language,
  onAskChatWithQuery 
}) => {
  const [activeTab, setActiveTab] = useState<VerificationType>('huid');
  
  // Verification input states
  const [huidInput, setHuidInput] = useState('AH9821');
  const [huidResult, setHuidResult] = useState<HuidVerificationResult | null>(MOCK_HUID_DATABASE['AH9821']);
  
  const [cmlInput, setCmlInput] = useState('CM/L-8400123');
  const [isiResult, setIsiResult] = useState<IsiVerificationResult | null>(MOCK_ISI_DATABASE['CM/L-8400123']);
  
  const [crsInput, setCrsInput] = useState('R-41001234');
  const [crsResult, setCrsResult] = useState<CrsVerificationResult | null>(MOCK_CRS_DATABASE['R-41001234']);

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState('Misuse of ISI Mark');
  const [complaintProduct, setComplaintProduct] = useState('');
  const [complaintSeller, setComplaintSeller] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSubmittedToken, setComplaintSubmittedToken] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 }
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  };

  const handleVerifyHuid = (codeToVerify?: string) => {
    const code = (codeToVerify || huidInput).trim().toUpperCase();
    if (!code) return;

    const result = MOCK_HUID_DATABASE[code];
    if (result) {
      setHuidResult(result);
      if (result.isValid) triggerCelebration();
    } else {
      setHuidResult({
        huid: code,
        isValid: false,
        status: 'NOT_FOUND',
        message: 'No active hallmarking record found in central BIS portal. Please check the 6-digit laser code on your gold article or report unhallmarked jewellery.'
      });
    }
  };

  const handleVerifyIsi = (codeToVerify?: string) => {
    const code = (codeToVerify || cmlInput).trim();
    if (!code) return;

    const result = MOCK_ISI_DATABASE[code];
    if (result) {
      setIsiResult(result);
      if (result.isValid) triggerCelebration();
    } else {
      setIsiResult({
        cmlNumber: code,
        isValid: false,
        status: 'NOT_FOUND',
        message: 'CM/L license number not found in active BIS registry. The product may be uncertified or using an unauthorized mark.'
      });
    }
  };

  const handleVerifyCrs = (codeToVerify?: string) => {
    const code = (codeToVerify || crsInput).trim();
    if (!code) return;

    const result = MOCK_CRS_DATABASE[code];
    if (result) {
      setCrsResult(result);
      if (result.isValid) triggerCelebration();
    } else {
      setCrsResult({
        rNumber: code,
        isValid: false,
        status: 'NOT_FOUND'
      });
    }
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `BIS-GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setComplaintSubmittedToken(token);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bis-navy via-bis-dark to-bis-blue text-white rounded-2xl p-6 sm:p-8 shadow-card border border-white/10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bis-saffron/30 text-amber-300 border border-bis-saffron/40 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Citizen & Consumer Protection Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Consumer Corner: Live Hallmark & ISI Verifier
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Verify the authenticity of your gold jewellery HUID, check ISI mark manufacturer licences (CM/L), and lodge complaints against counterfeit or substandard products.
          </p>
        </div>
      </div>

      {/* Main Grid: Live Verifier (7 Cols) + Grievance Wizard (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Verification Center (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-bis-saffron text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Real-Time Conformity Verifier
                </h3>
                <p className="text-xs text-slate-500">
                  Direct lookup against central BIS database
                </p>
              </div>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('huid')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'huid' ? 'bg-white text-bis-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gold HUID
              </button>
              <button
                onClick={() => setActiveTab('isi')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'isi' ? 'bg-white text-bis-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ISI (CM/L)
              </button>
              <button
                onClick={() => setActiveTab('crs')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'crs' ? 'bg-white text-bis-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CRS (R-No)
              </button>
            </div>
          </div>

          {/* TAB 1: Gold HUID Verification */}
          {activeTab === 'huid' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enter 6-Digit Alphanumeric Hallmark Code (HUID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={huidInput}
                    onChange={(e) => setHuidInput(e.target.value.toUpperCase())}
                    placeholder="e.g. AH9821, MN4029"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-mono font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-bis-saffron focus:bg-white"
                  />
                  <button
                    onClick={() => handleVerifyHuid()}
                    className="px-5 py-2.5 bg-bis-navy hover:bg-bis-dark text-white rounded-lg font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify HUID</span>
                  </button>
                </div>

                {/* Quick Test Chips */}
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
                  <span>Try Demo Codes:</span>
                  {['AH9821', 'MN4029', 'DL7712', 'KA9901', 'RJ5500'].map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setHuidInput(code);
                        handleVerifyHuid(code);
                      }}
                      className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-mono font-bold rounded border border-amber-200 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* HUID Result Card */}
              {huidResult && (
                <div className={`p-5 rounded-xl border ${
                  huidResult.isValid 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : 'bg-rose-50/50 border-rose-300'
                } space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {huidResult.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                      <span className={`text-sm font-bold ${
                        huidResult.isValid ? 'text-emerald-950' : 'text-rose-950'
                      }`}>
                        {huidResult.isValid ? 'BIS Hallmark Verified & Authentic' : 'Verification Alert / Not Verified'}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border">
                      Code: {huidResult.huid}
                    </span>
                  </div>

                  {huidResult.isValid ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Jeweller / Retailer</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{huidResult.jewellerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Reg: {huidResult.jewellerRegNo}</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Assaying & Hallmarking Centre</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{huidResult.ahcName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">AHC: {huidResult.ahcNo}</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Gold Purity Grade</span>
                        <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{huidResult.purity} (91.6% Pure Gold)</span>
                        <span className="text-[10px] text-slate-500">Article: {huidResult.articleType}</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Hallmarking Date</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{huidResult.hallmarkDate}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Active in Central Registry</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-rose-800 leading-relaxed font-medium">
                      {huidResult.message}
                    </p>
                  )}

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                    Verified via BIS CARE Database Gateway • Statutory Consumer Protection Act 2019
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ISI (CM/L) Verification */}
          {activeTab === 'isi' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enter 7-Digit CM/L (Certificate of Manufacturing License)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cmlInput}
                    onChange={(e) => setCmlInput(e.target.value)}
                    placeholder="e.g. CM/L-8400123"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-bis-saffron focus:bg-white"
                  />
                  <button
                    onClick={() => handleVerifyIsi()}
                    className="px-5 py-2.5 bg-bis-navy hover:bg-bis-dark text-white rounded-lg font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify ISI</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
                  <span>Try Demo Licenses:</span>
                  {['CM/L-8400123', 'CM/L-9128304', 'CM/L-4589211', 'CM/L-1122334'].map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCmlInput(code);
                        handleVerifyIsi(code);
                      }}
                      className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-mono font-bold rounded border border-blue-200 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {isiResult && (
                <div className={`p-5 rounded-xl border ${
                  isiResult.isValid 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : 'bg-rose-50/50 border-rose-300'
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isiResult.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                      <span className="text-sm font-bold text-slate-900">
                        {isiResult.isValid ? 'Operative ISI License' : 'Invalid or Expired License'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border">
                      {isiResult.cmlNumber}
                    </span>
                  </div>

                  {isiResult.isValid ? (
                    <div className="space-y-2 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <div className="font-bold text-slate-900 text-sm">{isiResult.brandName}</div>
                        <div className="text-slate-600">{isiResult.licenseeName}</div>
                        <div className="text-slate-500 text-[11px] mt-1">{isiResult.factoryAddress}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-emerald-100 flex justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Standard & Product</span>
                          <span className="font-mono font-bold text-bis-blue">{isiResult.standardNumber}</span>
                          <div className="text-slate-700">{isiResult.productName}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Valid Upto</span>
                          <span className="font-bold text-emerald-700">{isiResult.validUpto}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-rose-800 leading-relaxed font-medium">
                      {isiResult.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CRS Verification */}
          {activeTab === 'crs' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enter Electronics Registration Code (R-Number)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={crsInput}
                    onChange={(e) => setCrsInput(e.target.value)}
                    placeholder="e.g. R-41001234"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-bis-saffron focus:bg-white"
                  />
                  <button
                    onClick={() => handleVerifyCrs()}
                    className="px-5 py-2.5 bg-bis-navy hover:bg-bis-dark text-white rounded-lg font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify CRS</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
                  <span>Try Demo Codes:</span>
                  {['R-41001234', 'R-41029384', 'R-41098765'].map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCrsInput(code);
                        handleVerifyCrs(code);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold rounded border transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {crsResult && (
                <div className={`p-5 rounded-xl border ${
                  crsResult.isValid ? 'bg-emerald-50/50 border-emerald-300' : 'bg-rose-50/50 border-rose-300'
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {crsResult.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                      <span className="text-sm font-bold text-slate-900">
                        {crsResult.isValid ? 'Active CRS Electronic Registration' : 'CRS Number Not Found'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border">
                      {crsResult.rNumber}
                    </span>
                  </div>

                  {crsResult.isValid && (
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{crsResult.brandName}</span>
                          <div className="text-slate-600">{crsResult.applicantName}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Valid Upto</span>
                          <span className="font-bold text-emerald-700">{crsResult.validUpto}</span>
                        </div>
                      </div>
                      <div className="text-slate-700">
                        <strong>Standard:</strong> <span className="font-mono text-bis-blue">{crsResult.standardNumber}</span> ({crsResult.productCategory})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        <strong>Certified Models:</strong> {crsResult.modelNumbers?.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Consumer Grievance Lodging Wizard (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-lg bg-rose-600 text-white">
              <FileWarning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lodge Consumer Grievance
              </h3>
              <p className="text-xs text-slate-500">
                Report fake ISI mark, false hallmarking, or sub-standard goods
              </p>
            </div>
          </div>

          {complaintSubmittedToken ? (
            <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">Grievance Registered!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your complaint has been forwarded to the BIS Enforcement Branch & Regional Surveillance Officer.
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 font-mono text-xs font-bold text-bis-navy">
                Tracking Token: {complaintSubmittedToken}
              </div>
              <button
                onClick={() => setComplaintSubmittedToken(null)}
                className="text-xs text-bis-blue font-bold hover:underline"
              >
                Submit another grievance
              </button>
            </div>
          ) : (
            <form onSubmit={handleComplaintSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Violation Category
                </label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-bis-saffron"
                >
                  <option>Misuse of ISI Mark (Fake / Expired)</option>
                  <option>Unhallmarked Gold / Substandard Karatage</option>
                  <option>Non-Certified Mandatory Electronics</option>
                  <option>Hazardous / Non-Compliant Toy Sold</option>
                  <option>Packaged Water Impurities / Contamination</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product / Brand Name
                </label>
                <input
                  required
                  value={complaintProduct}
                  onChange={(e) => setComplaintProduct(e.target.value)}
                  placeholder="e.g. Brand XYZ Drinking Water / Gold Ring"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-bis-saffron"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Seller / Retailer / Location Details
                </label>
                <input
                  required
                  value={complaintSeller}
                  onChange={(e) => setComplaintSeller(e.target.value)}
                  placeholder="e.g. Shop No 4, Main Market, Mumbai"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-bis-saffron"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brief Description of Violation
                </label>
                <textarea
                  rows={3}
                  required
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Describe how the product failed quality checks or lacked mandatory marking..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-bis-saffron"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance to BIS Enforcement</span>
              </button>
            </form>
          )}

          <div className="text-[11px] text-slate-400">
            *BIS Surveillance officers conduct surprise raids and seized stock testing under Section 28 of BIS Act 2016.
          </div>
        </div>
      </div>
    </div>
  );
};
