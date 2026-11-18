import { StandardItem, SourceCitation } from '../types';

export const STANDARDS_DATABASE: StandardItem[] = [
  {
    id: 'is-16102',
    isNumber: 'IS 16102 (Part 1 & Part 2): 2012',
    title: 'Self-Ballasted LED Lamps for General Lighting Services',
    titleHindi: 'सामान्य प्रकाश व्यवस्था के लिए सेल्फ-बैलास्टेड एलईडी लैंप',
    category: 'Electronics & IT',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Electronics & IT Goods (Compulsory Registration) Order, MeitY / BIS',
    scheme: 'CRS (Scheme-II)',
    summary: 'Specifies safety and performance requirements for self-ballasted LED lamps with supply voltages up to 250V AC. Mandates testing for insulation resistance, high voltage breakdown, lumen maintenance, and harmonic distortion.',
    summaryHindi: '250V एसी आपूर्ति वोल्टेज तक के सेल्फ-बैलास्टेड एलईडी लैंप के लिए सुरक्षा और प्रदर्शन आवश्यकताओं को निर्दिष्ट करता है।',
    keyClauses: [
      {
        clauseNumber: 'IS 16102 (Part 1): 2012 Cl. 6.3',
        title: 'Marking & Technical Label Requirements',
        requirement: 'Lamps must be clearly marked with rated wattage, rated voltage range, rated luminous flux (lumens), colour temperature (CCT), and BIS CRS Registration Mark (R-XXXXXXXX).'
      },
      {
        clauseNumber: 'IS 16102 (Part 1): 2012 Cl. 8.1',
        title: 'Insulation Resistance & Electric Strength',
        requirement: 'Insulation resistance between current-carrying parts and accessible metal parts shall not be less than 4 MΩ when tested at 500V DC.'
      },
      {
        clauseNumber: 'IS 16102 (Part 2): 2012 Cl. 7',
        title: 'Lumen Maintenance & Operating Life',
        requirement: 'Luminous flux maintenance at 1,000 hours of initial operation shall not be less than 95% of the rated initial luminous flux.'
      },
      {
        clauseNumber: 'IS 15885 (Part 2/Sec 13)',
        title: 'LED Driver Safety',
        requirement: 'The electronic control gear (driver) integrated or associated with the LED bulb must independently comply with IS 15885 for electrical isolation and surge immunity.'
      }
    ],
    sampleTestingParams: [
      'Wattage & Luminous Flux (Lumens/Watt efficacy)',
      'Insulation Resistance (>4 MΩ at 500V DC)',
      'High Voltage Breakdown Test (1.5 kV for 1 minute)',
      'Harmonic Current Distortion (THD < 20% complying to IS 14700)',
      'Ingress Protection & Heat Resistance'
    ],
    applicableProducts: ['LED Bulbs (B22, E27 caps)', 'Batten Tube Lights', 'Downlights', 'Retrofit LED Lamps'],
    portalUrl: 'https://www.crsbis.in',
    msmeBenefit: 'Exemption from physical factory inspection under CRS; 50% concession on testing fees at BIS Central Laboratory for recognized Micro enterprises.'
  },
  {
    id: 'is-14543',
    isNumber: 'IS 14543: 2024',
    title: 'Packaged Drinking Water (Other Than Packaged Natural Mineral Water)',
    titleHindi: 'पैकेज्ड पेयजल (पैकेज्ड प्राकृतिक खनिज जल के अतिरिक्त)',
    category: 'Food & Agriculture',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'FSSAI & BIS Act 2016 Notification (S.O. 1298)',
    scheme: 'ISI Mark (Scheme-I)',
    summary: 'Specifies physical, chemical, microbiological, and toxicological requirements for packaged drinking water filled in sealed hermetic containers intended for direct human consumption.',
    summaryHindi: 'मानव उपभोग के लिए सीलबंद कंटेनरों में भरे पैकेज्ड पेयजल की भौतिक, रासायनिक और सूक्ष्मजैविक आवश्यकताओं को निर्दिष्ट करता है।',
    keyClauses: [
      [
        {
          clauseNumber: 'IS 14543: 2024 Cl. 4.1',
          title: 'Physical & Sensory Characteristics',
          requirement: 'TDS must remain below 500 mg/L; Turbidity must not exceed 2 NTU; pH must strictly range between 6.5 to 8.5.'
        },
        {
          clauseNumber: 'IS 14543: 2024 Cl. 5.3',
          title: 'Microbiological Safety & Pathogens',
          requirement: 'Water must be completely free from E. coli, coliform bacteria, Salmonella, Pseudomonas aeruginosa, and virus particles in a 250 mL sample.'
        },
        {
          clauseNumber: 'IS 14543: 2024 Cl. 8.2',
          title: 'In-House Laboratory & Competent Chemist',
          requirement: 'Manufacturing unit must maintain a fully equipped in-house testing lab with calibrated autoclave, laminar air flow, spectrophotometer, and a certified microbiologist.'
        }
      ][0],
      {
        clauseNumber: 'IS 14543: 2024 Cl. 5.3',
        title: 'Microbiological Safety & Pathogens',
        requirement: 'Water must be completely free from E. coli, coliform bacteria, Salmonella, Pseudomonas aeruginosa, and virus particles in a 250 mL sample.'
      },
      {
        clauseNumber: 'IS 14543: 2024 Cl. 8.2',
        title: 'In-House Laboratory & Competent Chemist',
        requirement: 'Manufacturing unit must maintain a fully equipped in-house testing lab with calibrated autoclave, laminar air flow, spectrophotometer, and a certified microbiologist.'
      }
    ],
    sampleTestingParams: [
      'Microbiological parameters (E. coli, Coliform, Yeast & Mould)',
      'Heavy metals (Lead, Arsenic, Cadmium, Mercury)',
      'Pesticide residue testing using GC-MS/MS (Max 0.0001 mg/L)',
      'Mineral balance & Electrical Conductivity'
    ],
    applicableProducts: ['20L Water Jars', '1L / 500mL / 250mL PET Bottles', 'Water Pouches'],
    portalUrl: 'https://manakonline.in',
    msmeBenefit: 'Micro & Small enterprises get 50% concession on annual minimum marking fees and 20% concession on testing charges at BIS labs.'
  },
  {
    id: 'is-1417',
    isNumber: 'IS 1417: 2016 & IS 15820: 2009',
    title: 'Gold and Silver Hallmarking & HUID Regulations',
    titleHindi: 'स्वर्ण एवं रजत आभूषण हॉलमार्किंग एवं एचयूआईडी नियमावली',
    category: 'Jewellery & Hallmarking',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Hallmarking of Gold Jewellery and Gold Artefacts Order, 2020 (Phase I to IV)',
    scheme: 'Hallmarking',
    summary: 'Mandates 3-sign hallmarking system for gold jewellery comprising: (1) BIS Logo, (2) Purity in Karat and Fineness (24K995, 22K916, 18K750, 14K585), and (3) 6-digit alphanumeric HUID code.',
    summaryHindi: 'सोने के आभूषणों के लिए 3-प्रतीक हॉलमार्किंग प्रणाली अनिवार्य करता है: बीआईएस लोगो, शुद्धता (22K916 आदि) और 6-अंकीय एचयूआईडी कोड।',
    keyClauses: [
      {
        clauseNumber: 'IS 1417: 2016 Cl. 4.2',
        title: 'Approved Karatages and Fineness Standards',
        requirement: 'Permitted gold purity grades: 24K (995), 23K (958), 22K (916), 20K (833), 18K (750), and 14K (585). No negative tolerance is permitted.'
      },
      {
        clauseNumber: 'Hallmarking Reg. 2018 Cl. 3(B)',
        title: 'HUID Traceability & Assaying Process',
        requirement: 'Each article hallmarked at a BIS-recognized Assaying and Hallmarking Centre (AHC) must receive an indelible 6-digit laser-engraved alphanumeric HUID unique to that piece.'
      },
      {
        clauseNumber: 'IS 15820: 2009 Cl. 6',
        title: 'Fire Assay Method of Gold Testing',
        requirement: 'AHC must verify gold fineness via standard cupellation (fire assay) protocol with minimum accuracy of ± 0.5 parts per thousand.'
      }
    ],
    sampleTestingParams: [
      'XRF (X-Ray Fluorescence) preliminary alloy screening',
      'Fire Assay (Cupellation) destructive confirmation',
      'Lead & Nickel leach testing for skin safety',
      'Laser marking legibility & depth check'
    ],
    applicableProducts: ['Gold Rings, Chains, Necklaces', 'Bangles, Earrings', 'Gold Coins & Medallions', 'Silver Utensils & Ornaments'],
    portalUrl: 'https://www.manakonline.in/MANAK/hallmarkingHome',
    msmeBenefit: 'Zero registration fee for jewellers having annual turnover below ₹40 Lakhs; automatic online portal registration with instant certificate generation.'
  },
  {
    id: 'is-13252',
    isNumber: 'IS 13252 (Part 1): 2010',
    title: 'Information Technology Equipment — Safety (General Requirements)',
    titleHindi: 'सूचना प्रौद्योगिकी उपकरण — सुरक्षा (सामान्य आवश्यकताएं)',
    category: 'Electronics & IT',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Electronics and Information Technology Goods (Requirement for Compulsory Registration) Order',
    scheme: 'CRS (Scheme-II)',
    summary: 'Specifies safety standards for mains-powered or battery-powered IT equipment including laptops, power adapters, servers, printers, mobile phones, and POS machines to protect against electric shock, fire, and mechanical hazards.',
    summaryHindi: 'लैपटॉप, मोबाइल फोन, पावर एडेप्टर आदि आईटी उपकरणों के लिए विद्युत झटका, अग्नि और यांत्रिक खतरों से सुरक्षा मानक निर्दिष्ट करता है।',
    keyClauses: [
      {
        clauseNumber: 'IS 13252 (Part 1) Cl. 1.5',
        title: 'Critical Safety Components Approval',
        requirement: 'Power supplies, capacitors, transformers, fuses, and varistors must have valid test certificates and meet relevant IS/IEC safety standards.'
      },
      {
        clauseNumber: 'IS 13252 (Part 1) Cl. 4.5',
        title: 'Thermal Requirements & Temperature Rise',
        requirement: 'Surface temperatures of accessible enclosures, adapters, and battery bays must not exceed safe threshold limits under full operating load.'
      },
      {
        clauseNumber: 'IS 13252 (Part 1) Cl. 5.3',
        title: 'Abnormal Operating and Fault Conditions',
        requirement: 'Equipment must not catch fire, emit molten metal, or generate toxic fumes during short-circuit or blocked cooling ventilation testing.'
      }
    ],
    sampleTestingParams: [
      'Electric strength & Dielectric withstand (3 kV AC)',
      'Leakage current measurement (<0.25 mA for Class II)',
      'Ball pressure flammability test for plastic enclosures',
      'Drop and impact resistance test (1.0 meter drop)'
    ],
    applicableProducts: ['Laptops & Notebooks', 'Mobile Phones', 'Power Adapters', 'Printers & Scanners', 'Smart Watches', 'Set Top Boxes'],
    portalUrl: 'https://www.crsbis.in',
    msmeBenefit: 'No factory audit needed. Series guideline available: Up to 10 similar models can be grouped under one lead model test report to reduce compliance cost by 70%.'
  },
  {
    id: 'is-9873',
    isNumber: 'IS 9873 (Parts 1 to 9) & IS 15644',
    title: 'Safety of Toys — Mechanical, Physical, Chemical & Electric Safety',
    titleHindi: 'खिलौनों की सुरक्षा — यांत्रिक, भौतिक, रासायनिक और विद्युत सुरक्षा',
    category: 'Consumer Safety',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Toys (Quality Control) Order, 2020 (Effective 1st Jan 2021)',
    scheme: 'ISI Mark (Scheme-I)',
    summary: 'Strict mandatory standard for all children toys (for ages up to 14 years). Completely bans non-certified domestic production or import of toys. Mandates physical choke testing, heavy metal migration limits, and flammability.',
    summaryHindi: '14 वर्ष तक के बच्चों के सभी खिलौनों के लिए अनिवार्य सुरक्षा मानक। भारी धातुओं के प्रवासन और छोटे पुर्जों के निगलने के खतरे की जांच करता है।',
    keyClauses: [
      {
        clauseNumber: 'IS 9873 (Part 1): 2019 Cl. 4.4',
        title: 'Small Parts & Choking Hazard Test',
        requirement: 'Toys intended for children under 36 months must not contain or release small parts fitting inside standard choke test cylinder.'
      },
      {
        clauseNumber: 'IS 9873 (Part 3): 2017 Cl. 4',
        title: 'Migration of Heavy Metals (Toxic Elements)',
        requirement: 'Element migration limits: Antimony (60 mg/kg), Arsenic (25 mg/kg), Barium (1000 mg/kg), Cadmium (75 mg/kg), Lead (90 mg/kg), Mercury (60 mg/kg).'
      },
      {
        clauseNumber: 'IS 15644: 2006',
        title: 'Safety of Electric Toys',
        requirement: 'Supply voltage must not exceed 24V DC. Battery compartments must be secured with screws preventing toddler access.'
      }
    ],
    sampleTestingParams: [
      'Choking cylinder small parts test',
      'Sharp edge and sharp point accessibility test',
      'Heavy metal leaching by ICP-OES/AAS',
      'Flammability rate of textile toys (<30 mm/s)',
      'Phthalate ester plasticizer content limit (<0.1%)'
    ],
    applicableProducts: ['Plastic Toys', 'Soft Plush Toys', 'Battery-Operated Cars & Drones', 'Wooden Puzzles', 'Ride-on Toys'],
    portalUrl: 'https://manakonline.in',
    msmeBenefit: 'Micro scale toy artisans & MSMEs get 50% concession on marking fee. Handcrafted traditional Indian toys have simplified conformity assessment options.'
  },
  {
    id: 'is-4151',
    isNumber: 'IS 4151: 2020',
    title: 'Protective Helmets for Two-Wheeler Riders',
    titleHindi: 'दोपहिया वाहन चालकों के लिए सुरक्षात्मक हेलमेट',
    category: 'Consumer Safety',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'MoRTH Two-Wheeler Helmet Quality Control Order, 2020',
    scheme: 'ISI Mark (Scheme-I)',
    summary: 'Mandatory specification for protective motorcycle and scooter helmets. Restricts maximum weight to 1.2 kg and enforces high-velocity impact absorption, retention system strength, and peripheral vision angle.',
    summaryHindi: 'दोपहिया वाहन चालकों के लिए सुरक्षात्मक हेलमेट का अनिवार्य विनिर्देश। अधिकतम वजन 1.2 किग्रा और उच्च प्रभाव अवशोषण अनिवार्य।',
    keyClauses: [
      {
        clauseNumber: 'IS 4151: 2020 Cl. 7.1',
        title: 'Impact Energy Attenuation Test',
        requirement: 'Headform acceleration during drop onto flat and hemispherical steel anvils from 2.8m height must not exceed 300g (gravitational units).'
      },
      {
        clauseNumber: 'IS 4151: 2020 Cl. 7.3',
        title: 'Retention System (Chin Strap) Dynamic Test',
        requirement: 'Chin strap mechanism must withstand 300N dynamic shock load without slippage exceeding 25mm or buckle release.'
      },
      {
        clauseNumber: 'IS 4151: 2020 Cl. 8.1',
        title: 'Mandatory ISI Marking & Batch Identification',
        requirement: 'Every helmet shell must bear indelible ISI mark, CM/L number, helmet size, manufacture date, and weight.'
      }
    ],
    sampleTestingParams: [
      'Impact attenuation test under hot (+50°C), cold (-10°C), and water immersion conditions',
      'Retention strap elongation and quick-release buckle durability',
      'Visor optical clarity, scratch resistance & non-shattering test',
      'Rigidity test across lateral axis'
    ],
    applicableProducts: ['Full Face Helmets', 'Open Face Helmets', 'Modular/Flip-Up Helmets'],
    portalUrl: 'https://manakonline.in',
    msmeBenefit: '50% concession on annual marking fee for micro enterprises. Shared testing facilities available at National Test House and BIS labs.'
  },
  {
    id: 'is-17017',
    isNumber: 'IS 17017 (Part 1, Part 21 & Part 22) & IS 16046 (Part 2)',
    title: 'Electric Vehicle (EV) Conductive Charging Systems & Traction Batteries',
    titleHindi: 'इलेक्ट्रिक वाहन चार्जिंग सिस्टम एवं लिथियम-आयन बैटरी सुरक्षा',
    category: 'Automotive & EV',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Ministry of Heavy Industries & BIS AIS-156 / IS 17017 Notification',
    scheme: 'ISI Mark (Scheme-I)',
    summary: 'Specifies safety, interoperability, communication protocols, and thermal runaway containment for EV chargers (AC & DC) and secondary Lithium-ion batteries used in electric two-wheelers, three-wheelers, and passenger cars.',
    summaryHindi: 'ईवी चार्जर्स और लिथियम-आयन ट्रैक्शन बैटरी के लिए थर्मल सुरक्षा और चार्जिंग इंटरऑपरेबिलिटी मानक।',
    keyClauses: [
      {
        clauseNumber: 'IS 17017 (Part 1): 2018 Cl. 6',
        title: 'Electrical Isolation & Residual Current Protection',
        requirement: 'Charger must incorporate Type B RCD or 6mA DC residual fault detection to prevent earth fault hazards.'
      },
      {
        clauseNumber: 'IS 16046 (Part 2): 2018 / IEC 62133-2 Cl. 7.3',
        title: 'Battery Thermal Runaway & Overcharge Protection',
        requirement: 'Battery pack must incorporate smart BMS preventing cell overvoltage, over-temperature, and contain thermal propagation without external fire or explosion.'
      }
    ],
    sampleTestingParams: [
      'Short circuit test at +55°C ambient',
      'Overcharge and forced discharge endurance',
      'Vibration and mechanical shock (150 m/s²)',
      'Ingress Protection IP67 / IP65 water spray',
      'Thermal propagation test (Nail penetration / Overheating)'
    ],
    applicableProducts: ['EV AC Slow Chargers (3.3 kW, 7.4 kW)', 'DC Fast Chargers (CCS2, Bharat DC-001)', '2W/3W/4W Li-ion Battery Packs', 'BMS Units'],
    portalUrl: 'https://manakonline.in',
    msmeBenefit: 'Startup India certified startups receive fast-track audit processing and 50% application fee concession.'
  },
  {
    id: 'is-1489',
    isNumber: 'IS 1489 (Part 1 & Part 2): 2015',
    title: 'Portland Pozzolana Cement (Fly Ash & Calcined Clay Based)',
    titleHindi: 'पोर्टलैंड पॉज़ोलाना सीमेंट (फ्लाई ऐश एवं कैल्सीन्ड क्ले आधारित)',
    category: 'Construction & Civil',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Cement (Quality Control) Order, Department for Promotion of Industry and Internal Trade (DPIIT)',
    scheme: 'ISI Mark (Scheme-I)',
    summary: 'Mandatory standard for Portland Pozzolana Cement. Establishes compressive strength requirements (at 3, 7, and 28 days), setting time, soundness, and pozzolana content (15% to 35% fly ash blending).',
    summaryHindi: 'पोर्टलैंड पॉज़ोलाना सीमेंट के लिए संपीड़न शक्ति, सेटिंग समय और स्थायित्व के अनिवार्य मानक।',
    keyClauses: [
      {
        clauseNumber: 'IS 1489 (Part 1) Cl. 6.2',
        title: 'Compressive Strength Benchmarks',
        requirement: 'Compressive strength shall not be less than: 16 MPa (72 ± 1 h), 22 MPa (168 ± 2 h), and 33 MPa (672 ± 4 h).'
      },
      {
        clauseNumber: 'IS 1489 (Part 1) Cl. 7',
        title: 'Soundness by Le-Chatelier & Autoclave',
        requirement: 'Expansion by Le-Chatelier method shall not exceed 10 mm; Autoclave expansion shall not exceed 0.8%.'
      }
    ],
    sampleTestingParams: [
      'Compressive strength testing on mortar cubes',
      'Initial & Final setting time (Vicat Apparatus)',
      'Fineness by Specific Surface (Blaine air permeability >300 m²/kg)',
      'Chemical assay (Insoluble residue, SO3, Loss on Ignition)'
    ],
    applicableProducts: ['PPC Fly Ash Cement', 'PPC Calcined Clay Cement', 'Masonry Cement'],
    portalUrl: 'https://manakonline.in',
    msmeBenefit: 'Standardized Scheme of Inspection & Testing (SIT) available with pre-defined batch sampling protocols.'
  },
  {
    id: 'is-14286',
    isNumber: 'IS 14286 / IEC 61215 & IS/IEC 61730 (Part 1 & 2)',
    title: 'Crystalline Silicon & Thin-Film Solar Photovoltaic (PV) Modules',
    titleHindi: 'सौर फोटोवोल्टाइक (पीवी) मॉड्यूल — डिजाइन योग्यता एवं सुरक्षा मानक',
    category: 'Renewable Energy',
    mandatoryStatus: 'Mandatory',
    qcoDate: 'Solar Photovoltaics, Systems, Devices and Components Goods (Compulsory Registration) Order, MNRE',
    scheme: 'CRS (Scheme-II)',
    summary: 'Mandatory safety and durability standard for solar panels under MNRE ALMM (Approved List of Module Manufacturers). Covers damp heat, UV exposure, thermal cycling, and hail impact resistance.',
    summaryHindi: 'सौर पैनलों के लिए डिजाइन योग्यता, विद्युत रोधन और अत्यधिक पर्यावरणीय परिस्थितियों में स्थायित्व मानक।',
    keyClauses: [
      {
        clauseNumber: 'IS 14286 Cl. 10.13',
        title: 'Damp Heat Test (85°C / 85% RH for 1,000 hrs)',
        requirement: 'Module must maintain visual integrity and not lose more than 5% of its rated peak power after 1,000 hours of continuous damp heat exposure.'
      },
      {
        clauseNumber: 'IS/IEC 61730-2 Cl. 10.8',
        title: 'Dielectric Withstand & Wet Leakage Current',
        requirement: 'Insulation resistance multiplied by module area must exceed 40 MΩ·m² when measured immersed in water at 1,000V DC.'
      }
    ],
    sampleTestingParams: [
      'Maximum Power (Pmax) STC IV-Curve Flash Test',
      'Electroluminescence (EL) crack inspection',
      'Hail impact resistance (25mm ice ball at 23 m/s)',
      'PID (Potential Induced Degradation) resistance'
    ],
    applicableProducts: ['Mono PERC Solar Panels', 'TOPCon & HJT Modules', 'Polycrystalline Panels', 'Bifacial Solar Modules'],
    portalUrl: 'https://www.crsbis.in',
    msmeBenefit: 'Co-listed under MNRE ALMM Scheme for automatic eligibility in government solar subsidies (PM Surya Ghar / PM-KUSUM).'
  },
  {
    id: 'is-548',
    isNumber: 'IS 548 & Product Standards (IS 544, IS 546, IS 4277)',
    title: 'Edible Vegetable Oils, Mustard Oil, and Groundnut Oil',
    titleHindi: 'खाद्य वनस्पति तेल — सरसों, मूंगफली एवं सूरजमुखी तेल मानक',
    category: 'Food & Agriculture',
    mandatoryStatus: 'Voluntary',
    qcoDate: 'FSSAI Voluntary Quality Standards',
    scheme: 'ISI Mark (Scheme-I)',
    summary: 'Specifies acid value, saponification value, iodine value, refractive index, free fatty acid limits, and freedom from adulterants (Argemone oil, mineral oil, castor oil).',
    summaryHindi: 'शुद्ध खाद्य तेलों के लिए फैटी एसिड संरचना, मिलावट रहित होने और रिफ्रैक्टिव इंडेक्स के मानक।',
    keyClauses: [
      {
        clauseNumber: 'IS 548 (Part 2) Cl. 12',
        title: 'Test for Argemone Oil & Adulterants',
        requirement: 'Sample must test negative for presence of Argemone mexicana oil, hydrocyanic acid, and synthetic colouring matter.'
      },
      {
        clauseNumber: 'IS 548 (Part 1) Cl. 7',
        title: 'Acid Value and Peroxide Value Benchmarks',
        requirement: 'Acid value of refined edible oil shall not exceed 0.5; Peroxide value must be below 10 meq/kg oxygen.'
      }
    ],
    sampleTestingParams: [
      'Gas Chromatography (GC) Fatty Acid Profile',
      'Argemone oil TLC test',
      'Aflatoxin B1 contamination in peanut oil (<15 ppb)',
      'Moisture and volatile matter (<0.10%)'
    ],
    applicableProducts: ['Mustard Oil (Kachi Ghani)', 'Groundnut Oil', 'Refined Sunflower Oil', 'Soybean Oil'],
    portalUrl: 'https://manakonline.in',
    msmeBenefit: 'Simplified sampling scheme for rural cold-pressed expeller units and micro food processing clusters.'
  }
];

export interface PredefinedQA {
  id: string;
  keywords: string[];
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  citations: SourceCitation[];
  suggestedFollowUps: string[];
  schemeBadge: string;
  applicableStandardId: string;
}

export const PREDEFINED_KNOWLEDGE_BASE: PredefinedQA[] = [
  {
    id: 'led-bulbs',
    keywords: ['led', 'bulb', 'lighting', 'lamp', 'b22', 'e27', 'driver', 'lumen', 'is 16102', 'is 15885'],
    questionEn: 'What standard applies to LED bulbs?',
    questionHi: 'एलईडी बल्बों पर कौन सा मानक लागू होता है?',
    answerEn: `For **Self-Ballasted LED Bulbs** used for general lighting services in India, the mandatory Indian Standard is **IS 16102 (Part 1 & Part 2): 2012**. 

### Key Regulatory Requirements:
1. **Applicable Scheme**: **CRS (Compulsory Registration Scheme - Scheme-II)** administered under MeitY & BIS.
2. **Safety Standard**: **IS 16102 (Part 1): 2012** covers electric shock protection, insulation resistance (minimum 4 MΩ at 500V DC), high-voltage withstand (1.5 kV for 1 min), and mechanical torque resistance.
3. **Performance Standard**: **IS 16102 (Part 2): 2012** mandates minimum luminous efficacy (lumens per watt), power factor ($>0.90$), and lumen maintenance ($>95\\%$ after 1,000 operating hours).
4. **Driver Safety**: Associated electronic drivers must independently comply with **IS 15885 (Part 2/Sec 13)**.

### How to obtain Certification:
- **No physical factory audit** is required under CRS.
- Manufacturer sends sample to a BIS-recognized testing lab.
- Upload test report to the [CRS Portal](https://www.crsbis.in) to get a unique **R-XXXXXXXX** registration number.`,
    answerHi: `भारत में सामान्य प्रकाश व्यवस्था के लिए **सेल्फ-बैलास्टेड एलईडी बल्बों** पर अनिवार्य भारतीय मानक **IS 16102 (भाग 1 एवं भाग 2): 2012** लागू होता है।

### मुख्य विनियामक आवश्यकताएं:
1. **योजना**: यह **अनिवार्य पंजीकरण योजना (CRS - Scheme II)** के तहत आता है।
2. **सुरक्षा मानक (IS 16102 Part 1)**: विद्युत झटका सुरक्षा, 4 MΩ से अधिक इंसुलेशन प्रतिरोध और 1.5 kV वोल्टेज ब्रेकडाउन परीक्षण अनिवार्य है।
3. **प्रदर्शन मानक (IS 16102 Part 2)**: न्यूनतम ल्यूमेंस दक्षता, पावर फैक्टर (>0.90) और 1,000 घंटे के बाद >95% ल्यूमेन रखरखाव।
4. **एलईडी ड्राइवर**: ड्राइवर को **IS 15885 (Part 2/Sec 13)** का अनुपालन करना होगा।`,
    citations: [
      {
        id: 'cit-16102-1',
        isNumber: 'IS 16102 (Part 1): 2012',
        title: 'Self-Ballasted LED Lamps - Safety Requirements',
        clause: 'Clause 6.3 & Clause 8.1',
        documentType: 'Indian Standard',
        pageNumber: 8,
        snippet: 'Insulation resistance between current-carrying parts and accessible metal parts shall not be less than 4 MΩ when measured with 500V DC. Marking must include rated wattage, CCT, and BIS R-number.',
        mandatoryStatus: 'Mandatory (QCO Active)',
        gazetteRef: 'MeitY Electronics QCO S.O. 2357(E)',
        portalUrl: 'https://www.crsbis.in'
      },
      {
        id: 'cit-16102-2',
        isNumber: 'IS 16102 (Part 2): 2012',
        title: 'Self-Ballasted LED Lamps - Performance Requirements',
        clause: 'Clause 7.2 (Lumen Maintenance)',
        documentType: 'Indian Standard',
        pageNumber: 12,
        snippet: 'Luminous flux maintenance at 1,000 hours of operation shall be greater than or equal to 95% of initial value.',
        mandatoryStatus: 'Mandatory (QCO Active)',
        portalUrl: 'https://www.crsbis.in'
      }
    ],
    suggestedFollowUps: [
      'What is the testing fee and timeline for LED bulb CRS registration?',
      'Can I group multiple LED bulb wattages under a single CRS series?',
      'Which testing labs in India test IS 16102 LED lamps?'
    ],
    schemeBadge: 'CRS (Scheme-II) - Mandatory',
    applicableStandardId: 'is-16102'
  },
  {
    id: 'food-isi',
    keywords: ['food', 'isi', 'packaged water', 'mineral water', 'milk', 'oil', 'edible', 'is 14543', 'is 13428', 'fssai'],
    questionEn: 'How do I get ISI certification for my food product?',
    questionHi: 'मुझे अपने खाद्य उत्पाद के लिए ISI प्रमाणन कैसे मिलेगा?',
    answerEn: `To obtain an **ISI Mark (Scheme-I)** license for food products (e.g., Packaged Drinking Water under **IS 14543**, Packaged Natural Mineral Water under **IS 13428**, Infant Milk Foods under **IS 14433**, or Edible Oils under **IS 548**), follow the statutory 5-step procedure:

### 5-Step ISI Mark Certification Flow:
1. **Establish In-House Quality Control & Lab**:
   - Set up an in-house laboratory with calibrated testing apparatus as per the **Scheme of Inspection & Testing (SIT)**.
   - Employ qualified chemist / microbiologist.
2. **Apply Online on Manakonline**:
   - Submit **Form-V** on [manakonline.in](https://manakonline.in) with manufacturing flow chart, machinery list, and test equipment calibration certificates.
3. **Factory Audit by BIS Officer**:
   - A BIS technical auditor inspects your manufacturing premises, verifies in-house testing capability, hygiene conditions, and draws verification samples.
4. **Independent Lab Sample Testing**:
   - Drawn samples are sent in sealed condition to a **BIS Central / Recognized Laboratory** for complete parameter testing (microbiological, chemical, heavy metals, pesticide residues).
5. **Grant of License (CM/L Number)**:
   - Upon satisfactory test report and audit clearance, BIS issues the **CM/L (Certificate of Manufacturing License) Number**.
   - You may now print the authentic ISI Mark with your unique CM/L code on packages.

### MSME Concessions:
- **50% concession** on annual minimum marking fee for Micro enterprises ($₹25,000$ instead of $₹50,000$).
- **20% concession** for Small enterprises.`,
    answerHi: `खाद्य उत्पादों (जैसे पैकेज्ड ड्रिंकिंग वॉटर **IS 14543**, मिनरल वॉटर **IS 13428**, शिशु आहार **IS 14433**) के लिए **ISI मार्क (Scheme-I)** लाइसेंस प्राप्त करने की 5-चरणीय प्रक्रिया:

### 5-चरणीय ISI प्रमाणन प्रक्रिया:
1. **इन-हाउस प्रयोगशाला की स्थापना**: उत्पाद परीक्षण के लिए योग्य केमिस्ट/माइक्रोबायोलॉजिस्ट और कैलिब्रेटेड उपकरण रखें।
2. **Manakonline पर ऑनलाइन आवेदन**: [manakonline.in](https://manakonline.in) पर फॉर्म-V और आवश्यक दस्तावेज जमा करें।
3. **बीआईएस अधिकारी द्वारा फैक्ट्री निरीक्षण**: स्वच्छता, निर्माण क्षमता और गुणवत्ता नियंत्रण की जांच।
4. **स्वतंत्र प्रयोगशाला में नमूना परीक्षण**: सूक्ष्मजीव, कीटनाशक और भारी धातु परीक्षण।
5. **लाइसेंस (CM/L नंबर) जारी होना**: सफल रिपोर्ट पर अद्वितीय CM/L नंबर प्रदान किया जाता है।

### एमएसएमई छूट:
- सूक्ष्म उद्योगों (Micro Enterprises) को वार्षिक मार्किंग शुल्क में **50% की सीधी छूट** मिलती है।`,
    citations: [
      {
        id: 'cit-14543-1',
        isNumber: 'IS 14543: 2024',
        title: 'Packaged Drinking Water Specification',
        clause: 'Clause 8.1 & Clause 8.2 (In-house Lab & SIT)',
        documentType: 'Indian Standard',
        pageNumber: 15,
        snippet: 'The factory shall maintain an in-house laboratory equipped to conduct routine daily microbiological and physical-chemical tests as per the Scheme of Inspection and Testing.',
        mandatoryStatus: 'Mandatory (QCO Active)',
        gazetteRef: 'BIS Act 2016 / FSSAI Regulations',
        portalUrl: 'https://manakonline.in'
      },
      {
        id: 'cit-scheme-1',
        isNumber: 'BIS (Conformity Assessment) Regulations 2018',
        title: 'Scheme-I (Conformity Assessment Procedure)',
        clause: 'Regulation 4 & Schedule II',
        documentType: 'Scheme Manual',
        pageNumber: 4,
        snippet: 'Grant of licence under Scheme-I mandates factory audit, verification of in-house testing facility, and testing of sample drawn during inspection.',
        portalUrl: 'https://manakonline.in'
      }
    ],
    suggestedFollowUps: [
      'What are the mandatory testing parameters for Packaged Drinking Water IS 14543?',
      'What is the total fee and timeline for obtaining an ISI mark for water plants?',
      'Can I verify if an ISI license CM/L number is genuine?'
    ],
    schemeBadge: 'ISI Mark (Scheme-I) - Mandatory',
    applicableStandardId: 'is-14543'
  },
  {
    id: 'gold-hallmarking',
    keywords: ['gold', 'jewellery', 'hallmark', 'huid', '22k', '18k', '24k', 'purity', 'ahc', '916', '750', 'is 1417'],
    questionEn: 'Is my 22K gold jewellery hallmark valid?',
    questionHi: 'क्या मेरे 22 कैरेट सोने के गहनों का हॉलमार्क वैध है?',
    answerEn: `To verify if your **22K Gold Jewellery Hallmark** is legally valid in India under the **Hallmarking of Gold Jewellery and Gold Artefacts Order**, look for the mandatory **3-Sign Hallmark System** introduced by BIS:

### The 3 Mandatory Hallmark Marks:
1. **BIS Logo**: The triangular triangular emblem with Indian standard monogram.
2. **Purity in Karat & Fineness**: For 22K gold, it must be engraved as **\`22K916\`** ($91.6\\%$ pure gold). Other valid grades are \`24K995\`, \`18K750\`, and \`14K585\`. *(Older 4-sign marks with jeweller logos are phased out for new sales).*
3. **6-Digit Alphanumeric HUID (Hallmark Unique Identification)**: A laser-engraved 6-character code (e.g., **\`AH9821\`**, **\`MN4029\`**).

### How to Verify Instantly:
- Use our built-in **[Consumer Corner Verifier](#consumer)** or the official **BIS CARE Mobile App**.
- Enter your 6-digit HUID: It immediately retrieves the **Jeweller Name**, **Assaying & Hallmarking Centre (AHC)**, **Date of Hallmarking**, and **Certified Karatage**.

> **Consumer Right**: If hallmarked jewellery is tested and found of lower purity than marked, the jeweller is legally bound under BIS Rules to refund the value difference plus testing costs and compensation.`,
    answerHi: `भारत में **हॉलमार्किंग आदेश** के तहत आपके **22K सोने के आभूषण** के हॉलमार्क की वैधता की जांच के लिए **3 अनिवार्य प्रतीकों** को देखें:

### 3 अनिवार्य हॉलमार्क प्रतीक:
1. **बीआईएस लोगो (BIS Logo)**: त्रिभुजाकार मानक प्रतीक।
2. **शुद्धता और कैरेट**: 22 कैरेट के लिए **\`22K916\`** (91.6% शुद्ध सोना)। अन्य मान्य श्रेणियां: \`24K995\`, \`18K750\`, \`14K585\`।
3. **6-अंकीय अल्फ़ान्यूमेरिक HUID कोड**: लेज़र से उत्कीर्ण 6-वर्णों का अनूठा कोड (जैसे \`AH9821\`)।

### त्वरित सत्यापन:
- हमारे **[कंज्यूमर कॉर्नर](#consumer)** या **BIS CARE App** में अपना 6-अंकीय HUID दर्ज करें।
- यह तुरंत **ज्वेलर का नाम, एएचसी केंद्र, हॉलमार्किंग की तारीख और शुद्धता** प्रदर्शित करता है।`,
    citations: [
      {
        id: 'cit-1417-1',
        isNumber: 'IS 1417: 2016',
        title: 'Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking',
        clause: 'Clause 4.1 & Clause 4.2',
        documentType: 'Indian Standard',
        pageNumber: 3,
        snippet: 'Gold jewellery shall be hallmarked with 3 signs: BIS emblem, fineness mark (e.g., 22K916), and 6-digit laser HUID. No negative tolerance is permitted in gold fineness.',
        mandatoryStatus: 'Mandatory (QCO Active)',
        gazetteRef: 'Hallmarking Order Phase I-IV (Ministry of Consumer Affairs)',
        portalUrl: 'https://www.manakonline.in'
      },
      {
        id: 'cit-huid-reg',
        isNumber: 'BIS (Hallmarking) Regulations, 2018',
        title: 'Operational Guidelines for HUID & AHC',
        clause: 'Guideline Section 5 (Assaying Protocol)',
        documentType: 'Hallmarking Regulation',
        pageNumber: 7,
        snippet: 'Every hallmarked piece must be laser engraved with a unique 6-character alphanumeric code generated through the central portal upon passing fire assay.',
        portalUrl: 'https://www.manakonline.in'
      }
    ],
    suggestedFollowUps: [
      'Verify a sample HUID number right now (e.g., AH9821)',
      'What should I do if my gold jewellery does not have a HUID?',
      'How do jewellers register for BIS Hallmarking on Manakonline?'
    ],
    schemeBadge: 'Hallmarking Scheme - Mandatory',
    applicableStandardId: 'is-1417'
  },
  {
    id: 'crs-documents',
    keywords: ['crs', 'documents', 'registration', 'electronics', 'it', 'laptop', 'mobile', 'charger', 'is 13252', 'scheme 2'],
    questionEn: 'What documents are needed for a CRS license?',
    questionHi: 'CRS लाइसेंस के लिए कौन से दस्तावेज आवश्यक हैं?',
    answerEn: `The **Compulsory Registration Scheme (CRS - Scheme-II)** is a simplified conformity pathway for Electronics and IT products (e.g. Laptops, Power Banks, Smart Watches, LED Drivers, Mobile Phones) governed by **MeitY & BIS**.

### Checklist of Required Documents:
1. **Test Report from BIS-Recognized Lab**:
   - Complete safety test report issued by an accredited laboratory within India (validity: must be submitted within 90 days of issuance).
2. **Form-I (Online Application Form)**:
   - Generated on [crsbis.in](https://www.crsbis.in).
3. **Legal Identity & Factory Address Proof**:
   - Business Registration / GST Certificate / Factory License / Certificate of Incorporation.
4. **Trademark / Brand Authorization (Form-C)**:
   - Trademark Registration Certificate or Trademark Assignment Letter if manufacturing for a third-party brand.
5. **Authorized Indian Representative (AIR) Documentation** *(Only for Foreign Manufacturers)*:
   - Nominated Indian entity with PAN card, Aadhaar, Board Resolution, and Agreement of representation.
6. **Undertaking & Declaration of Conformity**:
   - Critical Component List (CCL) with safety certificate numbers for fuses, capacitors, and transformers.

### Fast-Track Processing Timeline:
- **Typical Turnaround**: 12 to 20 working days upon upload of valid test report.
- **Validity**: Granted for **2 years**, renewable up to 5 years.`,
    answerHi: `इलेक्ट्रॉनिक्स और आईटी उत्पादों (लैपटॉप, मोबाइल, स्मार्ट वॉच, एलईडी ड्राइवर आदि) के लिए **अनिवार्य पंजीकरण योजना (CRS - Scheme II)** के आवश्यक दस्तावेज:

### आवश्यक दस्तावेजों की सूची:
1. **बीआईएस-मान्यता प्राप्त लैब से टेस्ट रिपोर्ट**: भारत में किसी मान्यता प्राप्त प्रयोगशाला से जारी मान्य सुरक्षा टेस्ट रिपोर्ट (90 दिनों के भीतर जमा की जानी चाहिए)।
2. **फॉर्म-I (ऑनलाइन आवेदन)**: [crsbis.in](https://www.crsbis.in) पर भरा गया फॉर्म।
3. **फैक्ट्री पता एवं कानूनी पहचान प्रमाण**: जीएसटी प्रमाणपत्र / फैक्ट्री लाइसेंस / इनकॉर्पोरेशन सर्टिफिकेट।
4. **ट्रेडमार्क प्राधिकरण (फॉर्म-सी)**: ब्रांड नाम का ट्रेडमार्क पंजीकरण।
5. **अधिकृत भारतीय प्रतिनिधि (AIR) दस्तावेज** *(विदेशी निर्माताओं के लिए)*।
6. **महत्वपूर्ण घटकों की सूची (CCL)**: पावर सप्लाई, कैपेसिटर, बैटरी की सुरक्षा रिपोर्ट।

### समय सीमा:
- टेस्ट रिपोर्ट अपलोड करने के **12 से 20 कार्य दिवसों** के भीतर पंजीकरण प्रदान किया जाता है (वैधता: 2 वर्ष)।`,
    citations: [
      {
        id: 'cit-crs-doc-1',
        isNumber: 'BIS (Conformity Assessment) Regulations 2018',
        title: 'Scheme-II (Compulsory Registration Scheme Rules)',
        clause: 'Clause 3.1 & 3.2 (Documentation & Form I)',
        documentType: 'Scheme Manual',
        pageNumber: 2,
        snippet: 'Application under Scheme-II requires test report from recognized lab not older than 90 days, undertaking of compliance, brand authorization, and AIR nomination for overseas entities.',
        mandatoryStatus: 'Mandatory (QCO Active)',
        portalUrl: 'https://www.crsbis.in'
      },
      {
        id: 'cit-is-13252',
        isNumber: 'IS 13252 (Part 1): 2010',
        title: 'IT Equipment Safety - General Requirements',
        clause: 'Clause 1.5 (Critical Safety Component List)',
        documentType: 'Indian Standard',
        pageNumber: 11,
        snippet: 'Components such as power adapters, mains cords, varistors, and bridge rectifiers must meet relevant individual safety benchmarks.',
        portalUrl: 'https://www.crsbis.in'
      }
    ],
    suggestedFollowUps: [
      'What are the government application fees for a CRS license?',
      'How does the Series Guideline allow grouping multiple models?',
      'What is an Authorized Indian Representative (AIR) requirement?'
    ],
    schemeBadge: 'CRS (Scheme-II) - Electronics & IT',
    applicableStandardId: 'is-13252'
  },
  {
    id: 'toy-safety',
    keywords: ['toys', 'children', 'plastic toy', 'soft toy', 'is 9873', 'is 15644', 'toy qco', 'kids'],
    questionEn: 'Is certification mandatory for toys in India?',
    questionHi: 'क्या भारत में खिलौनों के लिए प्रमाणन अनिवार्य है?',
    answerEn: `**Yes, absolutely.** Certification is **100% mandatory** for all toys manufactured, imported, or sold in India under the **Toys (Quality Control) Order, 2020** issued by DPIIT.

### Applicable Standards:
- **Non-Electric Toys**: **IS 9873 (Part 1, 2, 3, 4, 7, 9)** covers physical/mechanical choke hazards, flammability, and heavy metal migration (Lead $<90$ ppm, Cadmium $<75$ ppm, Arsenic $<25$ ppm).
- **Electric Toys**: **IS 15644: 2006** covers electrical safety, insulation, and battery compartment screw fasteners.

### Scheme:
- Toys fall under **ISI Mark Scheme-I** (requires factory inspection + lab testing). No toy can be sold in India without the ISI mark.
- Micro scale artisans and hand-made traditional toy clusters receive special concessional testing schemes.`,
    answerHi: `**हाँ, बिल्कुल।** डीपीआईआईटी द्वारा जारी **खिलौने (गुणवत्ता नियंत्रण) आदेश, 2020** के तहत भारत में निर्मित, आयातित या बेचे जाने वाले सभी खिलौनों के लिए बीआईएस प्रमाणन **100% अनिवार्य** है।

### लागू मानक:
- **गैर-इलेक्ट्रिक खिलौने**: **IS 9873 (भाग 1-9)** - यांत्रिक सुरक्षा, ज्वलनशीलता और भारी धातुओं (सीसा, कैडमियम, पारा) की सीमा।
- **इलेक्ट्रिक खिलौने**: **IS 15644: 2006** - विद्युत सुरक्षा एवं बैटरी कंपार्टमेंट सुरक्षा।

### योजना:
- यह **ISI मार्क Scheme-I** के अंतर्गत आता है (फैक्ट्री ऑडिट और लैब परीक्षण आवश्यक)।`,
    citations: [
      {
        id: 'cit-9873-1',
        isNumber: 'IS 9873 (Part 1): 2019',
        title: 'Safety of Toys - Mechanical and Physical Properties',
        clause: 'Clause 4.4 (Small Parts) & Clause 4.8',
        documentType: 'Indian Standard',
        pageNumber: 6,
        snippet: 'Toys intended for children under 3 years must not contain removable or fragile small parts that fit within the small parts test cylinder.',
        mandatoryStatus: 'Mandatory (QCO Active)',
        gazetteRef: 'DPIIT Toys QCO S.O. 858(E)',
        portalUrl: 'https://manakonline.in'
      }
    ],
    suggestedFollowUps: [
      'What is the penalty for selling non-ISI marked toys?',
      'How can micro toy artisans get 50% concession on BIS fees?',
      'Find testing labs accredited for IS 9873 toy safety'
    ],
    schemeBadge: 'ISI Mark (Scheme-I) - Mandatory',
    applicableStandardId: 'is-9873'
  },
  {
    id: 'fmcs-foreign',
    keywords: ['fmcs', 'foreign', 'overseas', 'import', 'china', 'germany', 'usa', 'japan', 'scheme x', 'foreign manufacturer'],
    questionEn: 'What is FMCS scheme for foreign manufacturers?',
    questionHi: 'विदेशी निर्माताओं के लिए FMCS योजना क्या है?',
    answerEn: `The **Foreign Manufacturers Certification Scheme (FMCS - Scheme-X / Scheme-I)** allows overseas manufacturers outside India to use the standard **ISI Mark** on their products exported to India.

### Key Aspects of FMCS:
1. **Applicability**: Mandatory for all products under mandatory Indian QCOs (e.g. Steel, Cement, Chemicals, Tyres, Medical Devices, Toys) manufactured outside India.
2. **Authorized Indian Representative (AIR)**: The foreign company must appoint an AIR residing in India who acts as the legal liaison and accepts statutory accountability.
3. **Physical Overseas Inspection**: BIS technical auditors travel to the overseas factory to inspect the manufacturing unit and draw physical samples.
4. **Performance Bank Guarantee (PBG)**: Overseas manufacturer submits a PBG (typically USD 10,000) from an RBI-approved bank.
5. **Validity**: Granted initially for **1 to 2 years**, renewable on audit compliance.`,
    answerHi: `**विदेशी निर्माता प्रमाणन योजना (FMCS)** भारत के बाहर स्थित विदेशी निर्माताओं को भारत में निर्यात किए जाने वाले उत्पादों पर **ISI मार्क** का उपयोग करने की अनुमति देती है।

### FMCS के मुख्य बिंदु:
1. **प्रयोज्यता**: अनिवार्य QCOs (स्टील, सीमेंट, रसायन, टायर, खिलौने आदि) के तहत आने वाले सभी आयातित उत्पादों के लिए।
2. **अधिकृत भारतीय प्रतिनिधि (AIR)**: भारत में स्थित एक अधिकृत प्रतिनिधि नियुक्त करना अनिवार्य है।
3. **विदेशी फैक्ट्री का भौतिक ऑडिट**: बीआईएस तकनीकी अधिकारी विदेशी संयंत्र का दौरा करते हैं और नमूने लेते हैं।
4. **बैंक गारंटी**: USD 10,000 की परफॉर्मेंस बैंक गारंटी जमा करनी होती है।`,
    citations: [
      {
        id: 'cit-fmcs-1',
        isNumber: 'BIS (Conformity Assessment) Regulations 2018',
        title: 'FMCS Operational Guidelines (Scheme-X)',
        clause: 'Regulation 6 & Guidelines for Overseas Licences',
        documentType: 'Scheme Manual',
        pageNumber: 5,
        snippet: 'Overseas manufacturers require nomination of an Authorized Indian Representative (AIR), physical plant inspection by BIS officers, and submission of Performance Bank Guarantee.',
        portalUrl: 'https://www.bis.gov.in/fmcs'
      }
    ],
    suggestedFollowUps: [
      'What are the AIR liabilities under BIS Act 2016?',
      'How much does a foreign factory audit cost under FMCS?',
      'Check if my imported product falls under mandatory QCO list'
    ],
    schemeBadge: 'FMCS Scheme - Foreign Import',
    applicableStandardId: 'is-1489'
  }
];
