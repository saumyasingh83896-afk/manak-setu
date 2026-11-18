import { PREDEFINED_KNOWLEDGE_BASE, STANDARDS_DATABASE } from '../data/standards_kb';
import { ChatMessage, SourceCitation, LanguageCode } from '../types';

export interface RagResult {
  text: string;
  hindiText?: string;
  citations: SourceCitation[];
  suggestedFollowUps: string[];
  intent: string;
  confidenceScore: number;
  schemeBadge?: string;
  source?: string;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'what', 'which', 'who', 'how', 'when', 'where', 'why', 'can',
  'i', 'you', 'my', 'me', 'we', 'our', 'do', 'does', 'did', 'need', 'tell',
  'kya', 'hai', 'kaise', 'ka', 'ke', 'ki', 'ko', 'me', 'par', 'se'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function calculateScore(queryTokens: string[], targetKeywords: string[], targetText: string): number {
  if (queryTokens.length === 0) return 0;
  let score = 0;
  const lowerText = targetText.toLowerCase();

  for (const token of queryTokens) {
    if (targetKeywords.some(kw => kw.toLowerCase() === token)) {
      score += 3.5;
    } else if (targetKeywords.some(kw => kw.toLowerCase().includes(token))) {
      score += 2.0;
    }

    if (lowerText.includes(token)) {
      score += 1.0;
    }
  }

  // IS number pattern matching boost
  const isMatch = queryTokens.join(' ').match(/is\s*(\d+)/i);
  if (isMatch && lowerText.includes(isMatch[1])) {
    score += 8.0;
  }

  return score;
}

export function queryRagEngineLocal(query: string, language: LanguageCode = 'en'): RagResult {
  const cleanQuery = query.trim();
  const queryTokens = tokenize(cleanQuery);

  // 1. Check Predefined QA matches
  let bestQAMatch = null;
  let highestQAScore = 0;

  for (const qa of PREDEFINED_KNOWLEDGE_BASE) {
    const combinedTarget = `${qa.questionEn} ${qa.questionHi} ${qa.answerEn} ${qa.answerHi} ${qa.keywords.join(' ')}`;
    const score = calculateScore(queryTokens, qa.keywords, combinedTarget);
    if (score > highestQAScore) {
      highestQAScore = score;
      bestQAMatch = qa;
    }
  }

  // 2. Check Standards Database
  let bestStandardMatch = null;
  let highestStdScore = 0;

  for (const std of STANDARDS_DATABASE) {
    const stdKeywords = [
      std.isNumber,
      std.title,
      std.category,
      std.scheme,
      ...std.applicableProducts,
      ...std.sampleTestingParams
    ];
    const combinedStd = `${std.isNumber} ${std.title} ${std.summary} ${std.applicableProducts.join(' ')}`;
    const score = calculateScore(queryTokens, stdKeywords, combinedStd);
    if (score > highestStdScore) {
      highestStdScore = score;
      bestStandardMatch = std;
    }
  }

  // Decision Logic
  if (bestQAMatch && highestQAScore >= 3.0) {
    const confidence = Math.min(0.99, Math.max(0.85, (highestQAScore / 10) * 0.95));
    return {
      text: bestQAMatch.answerEn,
      hindiText: bestQAMatch.answerHi,
      citations: bestQAMatch.citations,
      suggestedFollowUps: bestQAMatch.suggestedFollowUps,
      intent: 'Grounded Regulatory Q&A',
      confidenceScore: Math.round(confidence * 100) / 100,
      schemeBadge: bestQAMatch.schemeBadge,
      source: 'local_rag_engine'
    };
  }

  if (bestStandardMatch && highestStdScore >= 2.5) {
    const std = bestStandardMatch;

    const textEn = `Based on official Bureau of Indian Standards (BIS) records, here is the conformity framework for **${std.title}**:

### Standard Details:
- **Standard Number**: **${std.isNumber}**
- **Classification**: **${std.category}**
- **Mandatory Status**: **${std.mandatoryStatus}** ${std.qcoDate ? `(*under ${std.qcoDate}*)` : ''}
- **Applicable Scheme**: **${std.scheme}**

### Key Technical Clauses:
${std.keyClauses.map(kc => `- **${kc.clauseNumber} (${kc.title})**: ${kc.requirement}`).join('\n')}

### Sample Testing Requirements:
${std.sampleTestingParams.map(tp => `- ${tp}`).join('\n')}

### MSME & Startup Benefit:
- ${std.msmeBenefit}

You can apply online or download the Scheme of Inspection and Testing (SIT) at [${std.portalUrl}](${std.portalUrl}).`;

    const textHi = `भारतीय मानक ब्यूरो (BIS) के आधिकारिक रिकॉर्ड के अनुसार, **${std.titleHindi}** के लिए नियामक रूपरेखा:

### मानक विवरण:
- **मानक संख्या**: **${std.isNumber}**
- **श्रेणी**: **${std.category}**
- **अनिवार्य स्थिति**: **${std.mandatoryStatus}**
- **योजना**: **${std.scheme}**

### मुख्य क्लॉज आवश्यकताएं:
${std.keyClauses.map(kc => `- **${kc.clauseNumber}**: ${kc.requirement}`).join('\n')}

### एमएसएमई लाभ:
- ${std.msmeBenefit}`;

    const citations: SourceCitation[] = std.keyClauses.map((kc, idx) => ({
      id: `cit-gen-${std.id}-${idx}`,
      isNumber: std.isNumber,
      title: std.title,
      clause: kc.clauseNumber,
      documentType: 'Indian Standard',
      snippet: kc.requirement,
      mandatoryStatus: std.mandatoryStatus === 'Mandatory' ? 'Mandatory (QCO Active)' : 'Voluntary',
      portalUrl: std.portalUrl
    }));

    return {
      text: textEn,
      hindiText: textHi,
      citations,
      suggestedFollowUps: [
        `What are the laboratory testing charges for ${std.isNumber}?`,
        `How long does the certification audit take for ${std.title}?`,
        `Find BIS recognized testing labs for ${std.isNumber}`
      ],
      intent: 'Standard Specification Lookup',
      confidenceScore: 0.94,
      schemeBadge: `${std.scheme} - ${std.mandatoryStatus}`,
      source: 'local_rag_engine'
    };
  }

  // Fallback Grounded General Assistant Response
  return {
    text: `I searched the BIS knowledge repository for "${cleanQuery}". While this exact query does not match a specific single Indian Standard catalog card, here is guidance based on BIS guidelines:

### General BIS Compliance Guidance:
1. **Finding Your Standard**: Search the product name or category in the **[Find a Standard](#standard-finder)** section or visit [knowyourstandards.bis.gov.in](https://knowyourstandards.bis.gov.in).
2. **Certification Routes**:
   - **Scheme-I (ISI Mark)**: Mandatory for products affecting public safety, food, children, civil engineering. Requires factory audit + lab tests.
   - **Scheme-II (CRS)**: Mandatory for electronics and IT goods. Fast-track self-registration via accredited lab test report.
   - **Scheme-IV (Hallmarking)**: Mandatory for Gold & Silver jewellery with 6-digit HUID.
3. **MSME Concessions**: Micro and Small enterprises receive **50% concession** on minimum marking fees and 20% on testing fees under the National MSME Quality Concession Directive.

For personalized assistance, try asking about specific products like *LED bulbs, packaged water, gold jewellery, toys, cement, or EV chargers*.`,
    hindiText: `मैंने बीआईएस ज्ञानकोश में "${cleanQuery}" की खोज की। सामान्य बीआईएस अनुपालन दिशानिर्देश:
1. **मानक खोजें**: [मानक खोजें](#standard-finder) टैब पर जाएं या [knowyourstandards.bis.gov.in](https://knowyourstandards.bis.gov.in) पर देखें।
2. **प्रमाणन मार्ग**: Scheme-I (ISI मार्क), Scheme-II (CRS इलेक्ट्रॉनिक्स), या हॉलमार्किंग (HUID)।
3. **एमएसएमई छूट**: सूक्ष्म उद्योगों को बीआईएस शुल्क में 50% की सीधी छूट मिलती है।`,
    citations: [
      {
        id: 'cit-bis-act',
        isNumber: 'Bureau of Indian Standards Act, 2016',
        title: 'Statutory Conformity Assessment and Standards Framework',
        clause: 'Section 16 & Section 29 (Powers to notify mandatory standards)',
        documentType: 'Gazette Notification',
        pageNumber: 1,
        snippet: 'The Central Government, after consulting the Bureau, may notify mandatory Indian Standards in the public interest or for protection of human, animal or plant health and safety.',
        portalUrl: 'https://www.bis.gov.in'
      },
      {
        id: 'cit-msme-guideline',
        isNumber: 'BIS Circular on MSME Concessions',
        title: 'Fee Concessions for Micro, Small and Women-led Startups',
        clause: 'Circular No. CMD-1/MSME-2022',
        documentType: 'Scheme Manual',
        pageNumber: 2,
        snippet: '50% concession on application fee and annual minimum marking fee for micro enterprises and DPIIT-recognized startups.',
        portalUrl: 'https://manakonline.in'
      }
    ],
    suggestedFollowUps: [
      'What standard applies to LED bulbs?',
      'How do I get ISI certification for my food product?',
      'Is my 22K gold jewellery hallmark valid?',
      'What documents are needed for a CRS license?'
    ],
    intent: 'General BIS Regulatory Guidance',
    confidenceScore: 0.88,
    schemeBadge: 'BIS Statutory Guidance',
    source: 'local_rag_engine'
  };
}

export async function queryRagEngine(query: string, language: LanguageCode = 'en', history: string = ''): Promise<RagResult> {
  // First, attempt to query the FastAPI backend server on localhost:8000
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        language: language,
        chat_history: history
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.text,
        hindiText: data.hindiText,
        citations: data.citations || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        intent: data.intent || 'FastAPI RAG Backend',
        confidenceScore: data.confidenceScore || 0.95,
        schemeBadge: data.schemeBadge || 'FastAPI Backend',
        source: 'backend_api'
      };
    }
  } catch (err) {
    // Backend offline or timed out; fall through to local RAG
  }

  // Fallback to client-side RAG engine
  return queryRagEngineLocal(query, language);
}
