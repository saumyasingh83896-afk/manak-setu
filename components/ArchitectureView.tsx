import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Layers, 
  FileText, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Code,
  Zap,
  Activity
} from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface ArchitectureViewProps {
  language: LanguageCode;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ language }) => {
  const [simQuery, setSimQuery] = useState('IS 16102 LED bulb safety insulation requirement');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(4);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(0);
    const interval = setInterval(() => {
      setSimStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsSimulating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bis-navy via-bis-dark to-bis-blue text-white rounded-2xl p-6 sm:p-8 shadow-card border border-white/10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bis-saffron/30 text-amber-300 border border-bis-saffron/40 mb-3">
            <Cpu className="w-3.5 h-3.5" /> Technical Architecture & Ingestion Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Zero-Hallucination BIS RAG Pipeline Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            A specialized hybrid retrieval pipeline engineered for statutory regulatory documents, technical clauses, Quality Control Orders (QCOs), and multi-lingual Indian citizen support.
          </p>
        </div>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-bis-saffron" />
            <span>End-to-End Information Retrieval & Grounding Flow</span>
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            Strict Source-Grounded
          </span>
        </div>

        {/* Step-by-Step Architecture Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
          {/* Node 1: User Query & Intent */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between text-center relative group hover:border-bis-blue transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                01
              </div>
              <h4 className="text-xs font-bold text-slate-900">User Query & NLU</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Multilingual input (Hindi, English, Regional) with intent & entity parsing.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-blue-700 bg-blue-50 py-0.5 rounded">
              Bhashini / NLU
            </span>
          </div>

          {/* Node 2: Document Chunking */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between text-center relative group hover:border-bis-blue transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                02
              </div>
              <h4 className="text-xs font-bold text-slate-900">Clause Chunking</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Hierarchical indexing of 21,000+ IS PDFs into clause & table units.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-amber-700 bg-amber-50 py-0.5 rounded">
              Clause-Level Slicing
            </span>
          </div>

          {/* Node 3: Hybrid Vector DB */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between text-center relative group hover:border-bis-blue transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                03
              </div>
              <h4 className="text-xs font-bold text-slate-900">Hybrid Index</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Dense BGE-M3 Multilingual Vectors + Sparse BM25 IS Code lookup.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-purple-700 bg-purple-50 py-0.5 rounded">
              Milvus / pgvector
            </span>
          </div>

          {/* Node 4: Re-Ranking */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between text-center relative group hover:border-bis-blue transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                04
              </div>
              <h4 className="text-xs font-bold text-slate-900">Reranker & Filter</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Quality Control Order (QCO) Gazette priority weighting filter.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-emerald-700 bg-emerald-50 py-0.5 rounded">
              Cross-Encoder
            </span>
          </div>

          {/* Node 5: LLM Synthesis */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between text-center relative group hover:border-bis-blue transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                05
              </div>
              <h4 className="text-xs font-bold text-slate-900">LLM Grounding</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Context-bound answer generation with anti-hallucination constraint.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-rose-700 bg-rose-50 py-0.5 rounded">
              Gemini Flash / Pro
            </span>
          </div>

          {/* Node 6: Cited Output */}
          <div className="bg-bis-navy text-white rounded-xl p-4 border border-bis-dark flex flex-col justify-between text-center shadow-md">
            <div>
              <div className="w-10 h-10 rounded-full bg-bis-saffron text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">
                06
              </div>
              <h4 className="text-xs font-bold text-white">Cited Delivery</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Direct answer with verifiable clause badges & portal links.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-amber-300 bg-white/10 py-0.5 rounded">
              Verified Response
            </span>
          </div>
        </div>
      </div>

      {/* Interactive RAG Pipeline Simulator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-bis-blue" />
              <span>Live Ingestion & Retrieval Pipeline Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Test how an Indian Standards query traverses vector similarity and generates grounded citations
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2 bg-bis-saffron hover:bg-bis-saffronDark disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow transition-colors"
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Processing...' : 'Run Pipeline Simulation'}</span>
          </button>
        </div>

        {/* Input Query for Simulator */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Simulation Test Query:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={simQuery}
              onChange={(e) => setSimQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-bis-saffron"
            />
          </div>
        </div>

        {/* Real-time State Output Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Vector Embeddings & Similarity */}
          <div className={`p-4 rounded-xl border transition-all ${
            simStep >= 2 ? 'bg-slate-900 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-amber-400 mb-2 flex items-center justify-between">
              <span>VECTOR SIMILARITY SCORE</span>
              <span>BGE-M3 (1024-dim)</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>IS 16102 (Part 1) Cl. 8.1</span>
                <span className="text-emerald-400 font-bold">0.962 (Match)</span>
              </div>
              <div className="flex justify-between">
                <span>IS 15885 Driver Safety</span>
                <span className="text-emerald-400 font-bold">0.891</span>
              </div>
              <div className="flex justify-between">
                <span>IS 10322 Luminaires</span>
                <span className="text-slate-400">0.710</span>
              </div>
              <div className="flex justify-between">
                <span>IS 14543 Drinking Water</span>
                <span className="text-rose-400">0.142 (Pruned)</span>
              </div>
            </div>
          </div>

          {/* Retrieved Grounded Chunk */}
          <div className={`p-4 rounded-xl border transition-all ${
            simStep >= 3 ? 'bg-slate-900 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-cyan-400 mb-2 flex items-center justify-between">
              <span>RETRIEVED CHUNK METADATA</span>
              <span>DocID: IS-16102-P1</span>
            </div>
            <div className="text-[10px] space-y-1 text-slate-300">
              <div><strong className="text-slate-400">Standard:</strong> IS 16102 (Part 1): 2012</div>
              <div><strong className="text-slate-400">Clause:</strong> 8.1 (Insulation Resistance)</div>
              <div><strong className="text-slate-400">Requirement:</strong> &ge; 4 M&Omega; at 500V DC</div>
              <div><strong className="text-slate-400">Scheme:</strong> CRS (Scheme-II) Mandatory</div>
            </div>
          </div>

          {/* LLM Citation Grounding Check */}
          <div className={`p-4 rounded-xl border transition-all ${
            simStep >= 4 ? 'bg-slate-900 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-emerald-400 mb-2 flex items-center justify-between">
              <span>GROUNDING & CITATION CHECK</span>
              <span>100% Passed</span>
            </div>
            <div className="text-[10px] space-y-1 text-slate-300">
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> No ungrounded claims detected
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mandatory citation chip attached
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confidence threshold: 0.96 &gt; 0.85
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
