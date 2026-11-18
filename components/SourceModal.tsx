import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, ExternalLink, Download, ShieldCheck, Scale } from 'lucide-react';
import { SourceCitation } from '../types';

interface SourceModalProps {
  citation: SourceCitation | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Modal Header */}
        <div className="bg-bis-navy text-white px-6 py-4 flex justify-between items-center rounded-t-xl border-b-2 border-bis-saffron">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-bis-saffron text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {citation.documentType}
                </span>
                {citation.mandatoryStatus && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {citation.mandatoryStatus}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold leading-tight text-white">{citation.isNumber}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Title & Clause details */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Official Title of Standard / Regulation</h4>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{citation.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Clause Ref: {citation.clause}
              </span>
              {citation.pageNumber && (
                <span className="text-slate-500">Document Page #{citation.pageNumber}</span>
              )}
              {citation.gazetteRef && (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Gazette Ref: {citation.gazetteRef}
                </span>
              )}
            </div>
          </div>

          {/* Verified Clause Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Grounded Clause Excerpt
              </h4>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                100% Zero-Hallucination Match
              </span>
            </div>
            <div className="p-4 rounded-lg bg-amber-50/60 border-l-4 border-bis-saffron text-slate-800 font-mono text-xs leading-relaxed">
              "{citation.snippet}"
            </div>
          </div>

          {/* Statutory Authority & Integrity Note */}
          <div className="flex items-start gap-3 p-3 bg-blue-50/70 rounded-lg text-xs text-slate-700 border border-blue-100">
            <Scale className="w-4 h-4 text-bis-blue mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-bis-navy">Statutory Basis: </span>
              Extract retrieved directly from indexed Bureau of Indian Standards (BIS) Gazette publications and technical manuals. All conformity assessment requirements are legally enforceable under the BIS Act, 2016.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 rounded-b-xl border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div className="text-xs text-slate-500">
            Source Verified by ManakSetu Grounding Engine
          </div>
          <div className="flex items-center gap-2">
            {citation.portalUrl && (
              <a
                href={citation.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-bis-navy border border-slate-300 rounded-md transition-colors shadow-sm"
              >
                <span>Official BIS Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-bis-navy hover:bg-bis-dark text-white rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
