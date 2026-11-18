import { HuidVerificationResult, IsiVerificationResult, CrsVerificationResult } from '../types';

export const MOCK_HUID_DATABASE: Record<string, HuidVerificationResult> = {
  'AH9821': {
    huid: 'AH9821',
    isValid: true,
    jewellerName: 'Tanishq (Titan Company Ltd), Connaught Place',
    jewellerRegNo: 'HM/JL-0891234',
    ahcName: 'Delhi Assaying & Hallmarking Centre, Okhla (AHC-011)',
    ahcNo: 'AHC-9921',
    articleType: 'Gold Bangle (Pair)',
    purity: '22K916',
    hallmarkDate: '14 Jan 2026',
    status: 'VERIFIED_ACTIVE',
    message: 'Valid BIS Hallmark. Verified as 22 Karat (91.6% purity) genuine gold artefact.'
  },
  'MN4029': {
    huid: 'MN4029',
    isValid: true,
    jewellerName: 'Kalyan Jewellers, T. Nagar, Chennai',
    jewellerRegNo: 'HM/JL-0439120',
    ahcName: 'Madras Precious Metals Assaying Centre (AHC-044)',
    ahcNo: 'AHC-4412',
    articleType: 'Gold Necklace & Pendant',
    purity: '22K916',
    hallmarkDate: '02 Feb 2026',
    status: 'VERIFIED_ACTIVE',
    message: 'Valid BIS Hallmark. Verified as 22 Karat (91.6% purity) genuine gold artefact.'
  },
  'DL7712': {
    huid: 'DL7712',
    isValid: true,
    jewellerName: 'Malabar Gold & Diamonds, Bandra West, Mumbai',
    jewellerRegNo: 'HM/JL-0228190',
    ahcName: 'Mumbai Hallmark Assayers Pvt Ltd (AHC-022)',
    ahcNo: 'AHC-2290',
    articleType: '24K Investment Gold Coin (10 Grams)',
    purity: '24K995',
    hallmarkDate: '28 Dec 2025',
    status: 'VERIFIED_ACTIVE',
    message: 'Valid BIS Hallmark. Verified as 24 Karat (99.5% purity) bullion-grade gold coin.'
  },
  'KA9901': {
    huid: 'KA9901',
    isValid: true,
    jewellerName: 'Bhima Jewellers, Commercial Street, Bengaluru',
    jewellerRegNo: 'HM/JL-0561230',
    ahcName: 'Karnataka Hallmarking Refineries (AHC-080)',
    ahcNo: 'AHC-8012',
    articleType: '18K Diamond-Studded Ring',
    purity: '18K750',
    hallmarkDate: '19 Jan 2026',
    status: 'VERIFIED_ACTIVE',
    message: 'Valid BIS Hallmark. Verified as 18 Karat (75.0% purity) genuine gold jewellery.'
  },
  'RJ5500': {
    huid: 'RJ5500',
    isValid: false,
    status: 'SUSPENDED',
    message: 'Suspended Record: Assaying centre licence is under review by BIS Regional Office. Do not trade under this stamp.'
  }
};

export const MOCK_ISI_DATABASE: Record<string, IsiVerificationResult> = {
  'CM/L-8400123': {
    cmlNumber: 'CM/L-8400123',
    isValid: true,
    brandName: 'Bisleri Aqua Pure',
    licenseeName: 'Bisleri International Pvt Ltd',
    factoryAddress: 'Plot 12, Industrial Area, Phase II, Noida, Uttar Pradesh - 201305',
    standardNumber: 'IS 14543: 2024',
    productName: 'Packaged Drinking Water (20L Jar & 1L Bottle)',
    validUpto: '31 Dec 2027',
    status: 'OPERATIVE',
    message: 'Valid & Operative License. The manufacturer is certified to apply standard ISI Mark.'
  },
  'CM/L-9128304': {
    cmlNumber: 'CM/L-9128304',
    isValid: true,
    brandName: 'Steelbird Hi-Tech Helmets',
    licenseeName: 'Steelbird Hi-Tech India Ltd',
    factoryAddress: 'Industrial Focal Point, Baddi, Solan, Himachal Pradesh - 173205',
    standardNumber: 'IS 4151: 2020',
    productName: 'Protective Helmets for Two Wheeler Riders',
    validUpto: '15 Aug 2027',
    status: 'OPERATIVE',
    message: 'Valid & Operative License. Product meets mandatory safety impact standards.'
  },
  'CM/L-4589211': {
    cmlNumber: 'CM/L-4589211',
    isValid: true,
    brandName: 'UltraTech Super PPC',
    licenseeName: 'UltraTech Cement Limited',
    factoryAddress: 'Kharia Khangar, Jodhpur, Rajasthan - 342606',
    standardNumber: 'IS 1489 (Part 1): 2015',
    productName: 'Portland Pozzolana Cement (Fly Ash Based)',
    validUpto: '30 Jun 2028',
    status: 'OPERATIVE',
    message: 'Valid & Operative License. Conforms to Portland Pozzolana Cement specification.'
  },
  'CM/L-1122334': {
    cmlNumber: 'CM/L-1122334',
    isValid: false,
    brandName: 'Unknown Local Toy Corp',
    licenseeName: 'Old Toys Manufacturing Unit',
    factoryAddress: 'Bawana Industrial Area, Delhi',
    standardNumber: 'IS 9873 (Part 1)',
    productName: 'Plastic Toys',
    validUpto: '01 Jan 2023',
    status: 'EXPIRED',
    message: 'Expired License! Licence was cancelled due to non-renewal. Application of ISI mark is illegal.'
  }
};

export const MOCK_CRS_DATABASE: Record<string, CrsVerificationResult> = {
  'R-41001234': {
    rNumber: 'R-41001234',
    isValid: true,
    brandName: 'Philips Lighting',
    modelNumbers: ['PH-LED-9W-B22', 'PH-LED-12W-B22', 'PH-LED-15W-E27'],
    applicantName: 'Signify Innovations India Ltd',
    standardNumber: 'IS 16102 (Part 1 & 2): 2012',
    productCategory: 'Self-Ballasted LED Lamp',
    validUpto: '14 Oct 2027',
    status: 'ACTIVE'
  },
  'R-41029384': {
    rNumber: 'R-41029384',
    isValid: true,
    brandName: 'Apple India',
    modelNumbers: ['MacBook Pro (A2992)', 'MacBook Air (A3113)'],
    applicantName: 'Apple India Private Limited',
    standardNumber: 'IS 13252 (Part 1): 2010',
    productCategory: 'Information Technology Equipment (Laptop)',
    validUpto: '20 Nov 2027',
    status: 'ACTIVE'
  },
  'R-41098765': {
    rNumber: 'R-41098765',
    isValid: true,
    brandName: 'Tata Power Solar',
    modelNumbers: ['TP-540W-BIFACIAL', 'TP-550W-MONO'],
    applicantName: 'Tata Power Solar Systems Ltd',
    standardNumber: 'IS 14286 / IS 61730',
    productCategory: 'Crystalline Silicon Terrestrial PV Modules',
    validUpto: '05 May 2028',
    status: 'ACTIVE'
  }
};
