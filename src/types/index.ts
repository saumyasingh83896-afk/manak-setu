export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'gu' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
}

export type ActiveTab = 
  | 'home' 
  | 'chat' 
  | 'standard-finder' 
  | 'certification' 
  | 'labs' 
  | 'consumer' 
  | 'architecture';

export interface SourceCitation {
  id: string;
  isNumber: string;
  title: string;
  clause: string;
  documentType: 'Indian Standard' | 'Quality Control Order' | 'Scheme Manual' | 'Hallmarking Regulation' | 'Gazette Notification';
  pageNumber?: number;
  snippet: string;
  mandatoryStatus?: 'Mandatory (QCO Active)' | 'Voluntary' | 'Mandatory under Phase IV';
  gazetteRef?: string;
  portalUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  hindiText?: string;
  citations?: SourceCitation[];
  suggestedFollowUps?: string[];
  intent?: string;
  confidenceScore?: number;
  schemeBadge?: string;
  isHtml?: boolean;
}

export interface StandardItem {
  id: string;
  isNumber: string;
  title: string;
  titleHindi: string;
  category: 'Electronics & IT' | 'Food & Agriculture' | 'Jewellery & Hallmarking' | 'Consumer Safety' | 'Construction & Civil' | 'Chemical & Metallurgy' | 'Renewable Energy' | 'Automotive & EV';
  mandatoryStatus: 'Mandatory' | 'Voluntary';
  qcoDate?: string;
  scheme: 'ISI Mark (Scheme-I)' | 'CRS (Scheme-II)' | 'Hallmarking' | 'FMCS' | 'Management Systems';
  summary: string;
  summaryHindi: string;
  keyClauses: {
    clauseNumber: string;
    title: string;
    requirement: string;
  }[];
  sampleTestingParams: string[];
  applicableProducts: string[];
  portalUrl: string;
  msmeBenefit: string;
}

export interface TestingLab {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'BIS Central Lab' | 'BIS Regional Lab' | 'BIS Branch Lab' | 'NABL & BIS Recognized Lab' | 'Government Lab';
  nablAccreditationNo: string;
  recognizedCategories: string[];
  accreditedStandards: string[];
  turnaroundDays: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface HuidVerificationResult {
  huid: string;
  isValid: boolean;
  jewellerName?: string;
  jewellerRegNo?: string;
  ahcName?: string;
  ahcNo?: string;
  articleType?: string;
  purity?: '24K995' | '22K916' | '18K750' | '14K585';
  hallmarkDate?: string;
  status: 'VERIFIED_ACTIVE' | 'NOT_FOUND' | 'SUSPENDED';
  message: string;
}

export interface IsiVerificationResult {
  cmlNumber: string;
  isValid: boolean;
  brandName?: string;
  licenseeName?: string;
  factoryAddress?: string;
  standardNumber?: string;
  productName?: string;
  validUpto?: string;
  status: 'OPERATIVE' | 'EXPIRED' | 'CANCELLED' | 'NOT_FOUND';
  message: string;
}

export interface CrsVerificationResult {
  rNumber: string;
  isValid: boolean;
  brandName?: string;
  modelNumbers?: string[];
  applicantName?: string;
  standardNumber?: string;
  productCategory?: string;
  validUpto?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'NOT_FOUND';
}

export interface ComplaintRecord {
  id: string;
  token: string;
  category: 'Misuse of ISI Mark' | 'Unhallmarked Gold' | 'Fake Substandard Product' | 'Overcharging' | 'Lab Report Discrepancy';
  productName: string;
  sellerDetails: string;
  date: string;
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'NOTICE_ISSUED' | 'RESOLVED';
  description: string;
}
