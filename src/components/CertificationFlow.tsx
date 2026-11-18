import React, { useState } from 'react';
import { 
  Award, 
  FileText, 
  CheckCircle2, 
  Building, 
  FlaskConical, 
  ShieldCheck, 
  Download, 
  Calculator, 
  CheckSquare, 
  Square, 
  Printer, 
  Sparkles,
  ArrowRight,
  Clock,
  IndianRupee,
  HelpCircle
} from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface CertificationFlowProps {
  language: LanguageCode;
  onAskChatWithQuery: (query: string) => void;
}

type SchemeType = 'isi' | 'crs' | 'fmcs' | 'hallmark';

export const CertificationFlow: React.FC<CertificationFlowProps> = ({ 
  language,
  onAskChatWithQuery 
}) => {
  const [activeScheme, setActiveScheme] = useState<SchemeType>('isi');
  const [enterpriseType, setEnterpriseType] = useState<'micro' | 'small' | 'medium' | 'large'>('micro');
  const [isWomanLed, setIsWomanLed] = useState<boolean>(false);
  const [isStartup, setIsStartup] = useState<boolean>(true);

  // Interactive checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'doc-gst': true,
    'doc-pan': true,
    'doc-factory': false,
    'doc-machinery': false,
    'doc-test-equip': false,
    'doc-qc-staff': false,
    'doc-sit': false
  });

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Fee calculation logic
  const calculateFees = () => {
    let baseAppFee = 1000;
    let baseAuditFee = 7000;
    let baseMarkingFee = 50000;

    if (activeScheme === 'crs') {
      baseAppFee = 1000;
      baseAuditFee = 0; // No factory audit under CRS
      baseMarkingFee = 43000; // 2 years
    } else if (activeScheme === 'fmcs') {
      baseAppFee = 8500;
      baseAuditFee = 250000; // Foreign audit travel + inspector charges
      baseMarkingFee = 120000;
    } else if (activeScheme === 'hallmark') {
      baseAppFee = 0; // Zero registration for jewellers < 40L
      baseAuditFee = 0;
      baseMarkingFee = 5000;
    }

    let discountPercent = 0;
    if (enterpriseType === 'micro' || isStartup || isWomanLed) {
      discountPercent = 50;
    } else if (enterpriseType === 'small') {
      discountPercent = 20;
    }

    const discountedApp = baseAppFee * (1 - discountPercent / 100);
    const discountedAudit = baseAuditFee * (1 - (activeScheme === 'isi' ? discountPercent / 100 : 0));
    const discountedMarking = baseMarkingFee * (1 - discountPercent / 100);
    const total = discountedApp + discountedAudit + discountedMarking;

    return {
      baseTotal: baseAppFee + baseAuditFee + baseMarkingFee,
      discountPercent,
      appFee: discountedApp,
      auditFee: discountedAudit,
      markingFee: discountedMarking,
      total
    };
  };

  const fees = calculateFees();

  const handlePrintChecklist = () => {
    window.print();
  };

  const stepsData = {
    isi: [
      {
        step: 1,
        title: 'In-House Lab & Infrastructure Setup',
        timeline: 'Day 1 - 15',
        desc: 'Procure calibrated testing equipment complying with the Scheme of Inspection and Testing (SIT) and appoint a competent QC chemist/microbiologist.',
        icon: <FlaskConical className="w-5 h-5" />
      },
      {
        step: 2,
        title: 'Online Application on Manakonline',
        timeline: 'Day 16 - 20',
        desc: 'Submit Form-V on manakonline.in along with factory layout, plant machinery list, calibration certificates, and 50% concessional fee receipt.',
        icon: <FileText className="w-5 h-5" />
      },
      {
        step: 3,
        title: 'Factory Audit & Sample Drawing',
        timeline: 'Day 21 - 35',
        desc: 'BIS inspecting officer visits your manufacturing premises to evaluate manufacturing flow, inspect in-house lab, and draw verification samples.',
        icon: <Building className="w-5 h-5" />
      },
      {
        step: 4,
        title: 'Independent Testing in BIS Lab',
        timeline: 'Day 36 - 60',
        desc: 'Drawn samples are sent in sealed condition to a recognized BIS/NABL testing lab for comprehensive chemical, safety, and endurance testing.',
        icon: <ShieldCheck className="w-5 h-5" />
      },
      {
        step: 5,
        title: 'Grant of License & ISI Marking',
        timeline: 'Day 61 - 70',
        desc: 'Upon satisfactory lab report, BIS issues the official CM/L (Certificate of Manufacturing License) Number permitting printing of the ISI Mark.',
        icon: <Award className="w-5 h-5" />
      }
    ],
    crs: [
      {
        step: 1,
        title: 'Sample Testing in BIS Recognized Lab',
        timeline: 'Day 1 - 10',
        desc: 'Send product samples to a recognized lab in India for safety test report generation as per relevant IS code (e.g. IS 16102 or IS 13252).',
        icon: <FlaskConical className="w-5 h-5" />
      },
      {
        step: 2,
        title: 'Generate Form-I on CRS Portal',
        timeline: 'Day 11 - 14',
        desc: 'Create online application on crsbis.in with test report, brand authorization letter (Form-C), and factory declaration.',
        icon: <FileText className="w-5 h-5" />
      },
      {
        step: 3,
        title: 'Document & Test Report Scrutiny',
        timeline: 'Day 15 - 22',
        desc: 'BIS CRS committee reviews test report parameters and critical component list (CCL). No physical factory audit required.',
        icon: <CheckCircle2 className="w-5 h-5" />
      },
      {
        step: 4,
        title: 'Grant of R-Number Registration',
        timeline: 'Day 23 - 30',
        desc: 'BIS issues unique R-XXXXXXXX registration code valid for 2 years. Apply standard CRS mark with model numbers.',
        icon: <Award className="w-5 h-5" />
      }
    ],
    fmcs: [
      {
        step: 1,
        title: 'Nominate Authorized Indian Rep (AIR)',
        timeline: 'Day 1 - 7',
        desc: 'Foreign manufacturer appoints an Indian citizen or registered entity as AIR to handle legal responsibilities under BIS Act 2016.',
        icon: <Building className="w-5 h-5" />
      },
      {
        step: 2,
        title: 'Submit Form-V on FMCS Portal',
        timeline: 'Day 8 - 20',
        desc: 'Submit detailed documentation, factory certifications, and pay preliminary overseas inspection deposit.',
        icon: <FileText className="w-5 h-5" />
      },
      {
        step: 3,
        title: 'Physical Audit of Overseas Factory',
        timeline: 'Day 30 - 60',
        desc: 'BIS technical delegation travels to the overseas factory for comprehensive on-site verification and physical sample sealing.',
        icon: <Building className="w-5 h-5" />
      },
      {
        step: 4,
        title: 'Sample Testing & Performance Bank Guarantee',
        timeline: 'Day 61 - 90',
        desc: 'Samples tested in Indian labs. Overseas entity furnishes USD 10,000 Performance Bank Guarantee (PBG).',
        icon: <ShieldCheck className="w-5 h-5" />
      },
      {
        step: 5,
        title: 'Grant of FMCS License (CM/L Number)',
        timeline: 'Day 91 - 105',
        desc: 'License issued allowing application of standard ISI mark on goods exported to India.',
        icon: <Award className="w-5 h-5" />
      }
    ],
    hallmark: [
      {
        step: 1,
        title: 'Zero-Fee Portal Registration',
        timeline: 'Day 1 (Instant)',
        desc: 'Jewellers register online on manakonline.in. Turnovers below ₹40 Lakhs have ₹0 registration fee and instant certificate generation.',
        icon: <FileText className="w-5 h-5" />
      },
      {
        step: 2,
        title: 'Send Jewellery to Recognized AHC',
        timeline: 'Day 2 - 3',
        desc: 'Send manufactured gold/silver jewellery batches to an accredited Assaying and Hallmarking Centre.',
        icon: <FlaskConical className="w-5 h-5" />
      },
      {
        step: 3,
        title: 'XRF Screening & Fire Assay Testing',
        timeline: 'Day 3 - 4',
        desc: 'AHC performs X-Ray fluorescence and cupellation fire assay to test gold fineness (e.g. 22K916).',
        icon: <ShieldCheck className="w-5 h-5" />
      },
      {
        step: 4,
        title: 'Laser Engraving of 6-Digit HUID',
        timeline: 'Day 4 - 5',
        desc: 'AHC laser-engraves the 3-sign hallmark (BIS Logo + Purity 22K916 + 6-digit alphanumeric HUID) and updates central BIS registry.',
        icon: <Award className="w-5 h-5" />
      }
    ]
  };

  const activeSteps = stepsData[activeScheme];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bis-navy via-bis-dark to-bis-blue text-white rounded-2xl p-6 sm:p-8 shadow-card border border-white/10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bis-saffron/30 text-amber-300 border border-bis-saffron/40 mb-3">
            <Award className="w-3.5 h-3.5" /> End-to-End Compliance Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Certification Process Explainer & Fee Calculator
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Understand the step-by-step statutory process for your chosen BIS scheme, compute your exact fees with active MSME/Startup discounts, and generate your printable audit readiness checklist.
          </p>
        </div>
      </div>

      {/* Scheme Selector Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        {[
          { id: 'isi', label: 'ISI Mark (Scheme-I)', sub: 'Domestic Manufacturing & Food' },
          { id: 'crs', label: 'CRS (Scheme-II)', sub: 'Electronics & IT Products' },
          { id: 'fmcs', label: 'FMCS (Scheme-X)', sub: 'Foreign Overseas Importers' },
          { id: 'hallmark', label: 'Gold Hallmarking (HUID)', sub: 'Jewellers & AHCs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScheme(tab.id as SchemeType)}
            className={`flex-1 min-w-[200px] text-left p-3.5 rounded-lg transition-all ${
              activeScheme === tab.id
                ? 'bg-bis-navy text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="text-xs sm:text-sm font-bold">{tab.label}</div>
            <div className={`text-[11px] mt-0.5 ${activeScheme === tab.id ? 'text-amber-300' : 'text-slate-500'}`}>
              {tab.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Visual Roadmap (Step-by-Step Flow) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Interactive 5-Stage Certification Journey
            </h3>
            <p className="text-xs text-slate-500">
              Typical turnaround timeline and milestones for {activeScheme.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => onAskChatWithQuery(`What are the step-by-step audit requirements for BIS ${activeScheme.toUpperCase()} certification?`)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-bis-navy hover:bg-blue-100 rounded-md text-xs font-semibold border border-blue-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-bis-saffron" />
            <span>Ask AI Help</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-bis-saffron hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-bis-navy text-white font-bold text-xs flex items-center justify-center group-hover:bg-bis-saffron transition-colors">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {step.timeline}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center text-xs font-semibold text-bis-blue">
                <span>Stage {step.step} Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Dynamic Fee Calculator + Downloadable Audit Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Dynamic MSME Fee Calculator (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Statutory Fee & Concession Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Official BIS tariff with MSME & Startup quality concessions
              </p>
            </div>
          </div>

          {/* Enterprise Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enterprise Classification (Udyam Registration)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'micro', label: 'Micro', discount: '50% Off' },
                { id: 'small', label: 'Small', discount: '20% Off' },
                { id: 'medium', label: 'Medium', discount: 'Standard' },
                { id: 'large', label: 'Large', discount: 'Standard' },
              ].map((ent) => (
                <button
                  key={ent.id}
                  onClick={() => setEnterpriseType(ent.id as any)}
                  className={`p-2 rounded-lg text-center border transition-all ${
                    enterpriseType === ent.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold ring-2 ring-emerald-600/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">{ent.label}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{ent.discount}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Incentive Checkboxes */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isStartup}
                onChange={(e) => setIsStartup(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span>DPIIT Recognized Startup (50% Concession)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isWomanLed}
                onChange={(e) => setIsWomanLed(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span>Women-Led Enterprise (50% Concession)</span>
            </label>
          </div>

          {/* Computed Fee Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Application / Processing Fee:</span>
              <span className="font-semibold text-slate-900">₹{fees.appFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Factory Inspection / Audit Fee:</span>
              <span className="font-semibold text-slate-900">₹{fees.auditFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Annual Minimum Marking Fee:</span>
              <span className="font-semibold text-slate-900">₹{fees.markingFee.toLocaleString()}</span>
            </div>

            {fees.discountPercent > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-bold pt-2 border-t border-slate-200">
                <span>MSME Quality Promotion Subsidy ({fees.discountPercent}%):</span>
                <span>- ₹{(fees.baseTotal - fees.total).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-extrabold text-bis-navy pt-2 border-t border-slate-300">
              <span>Estimated Net Payable Fee:</span>
              <span className="text-base text-emerald-700 flex items-center font-mono">
                <IndianRupee className="w-4 h-4" /> {fees.total.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            *Excludes laboratory sample testing charges (which vary per IS standard) and applicable 18% GST.
          </p>
        </div>

        {/* Right: Printable Audit Readiness Checklist (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-bis-navy text-white">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pre-Audit Document Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Essential statutory records required during BIS audit
                </p>
              </div>
            </div>

            <button
              onClick={handlePrintChecklist}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {[
              { id: 'doc-gst', title: 'GST Registration & Udyam Aadhar Certificate', req: 'Proof of legal entity & MSME classification' },
              { id: 'doc-pan', title: 'Factory License / Municipal Trade NOC', req: 'Valid industrial manufacturing clearance' },
              { id: 'doc-factory', title: 'Plant Machinery & Manufacturing Process Flowchart', req: 'Detailed step-by-step layout of factory floor' },
              { id: 'doc-test-equip', title: 'In-House Testing Equipment & Calibration Logs', req: 'NABL-traceable calibration within 12 months' },
              { id: 'doc-qc-staff', title: 'Quality Control Chemist / Engineer Credentials', req: 'B.Sc/B.Tech degree certificates of appointed QC officer' },
              { id: 'doc-sit', title: 'Scheme of Inspection and Testing (SIT) Agreement', req: 'Signed acceptance of BIS daily batch testing protocol' }
            ].map((item) => {
              const isChecked = checkedItems[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0 text-emerald-600">
                    {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${isChecked ? 'text-emerald-950' : 'text-slate-800'}`}>
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.req}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              Readiness: {Object.values(checkedItems).filter(Boolean).length} / {Object.keys(checkedItems).length} Completed
            </span>
            <a
              href="https://manakonline.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2 bg-bis-saffron hover:bg-bis-saffronDark text-white rounded-lg text-xs font-bold shadow transition-colors"
            >
              <span>Submit Form-V Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
