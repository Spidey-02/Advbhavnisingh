import React, { useState } from 'react';
import { useFirmData } from '../hooks/useFirmData';
import { CaseStudy } from '../types';
import { Scale, Award, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const { caseStudies, firmDetails } = useFirmData();
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCases = activeCategory === 'all'
    ? caseStudies
    : caseStudies.filter(c => c.category === activeCategory);

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Landmark High Court Precedents</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">Case Studies &amp; Court Success Gallery</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Exemplary litigation triumphs, quashed FIRs, granted high court bails, and landmark writ petition orders argued by {firmDetails.founderName}.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'all', label: 'All Precedents' },
            { id: 'writ', label: 'Constitutional Writs' },
            { id: 'criminal', label: 'Bail & 482 Quashing' },
            { id: 'civil', label: 'Land & Revenue' },
            { id: 'family', label: 'Matrimonial & Divorce' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1e293b] text-[#c5a059] border border-[#c5a059]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#c5a059]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((cs) => (
            <div key={cs.id} className="bg-white border border-slate-200 p-6 shadow-sm hover:border-[#c5a059] transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-[#1e293b] text-[#c5a059]">
                    {cs.practiceArea}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{cs.year}</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#1e293b] leading-snug">{cs.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {cs.summary}
                </p>

                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Outcome: {cs.verdictOutcome || cs.outcome}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{cs.court}</span>
                <button
                  onClick={() => setSelectedCase(cs)}
                  className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#c5a059] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 space-y-6">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border-b pb-3 space-y-1">
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">{selectedCase.practiceArea}</span>
              <h2 className="text-2xl font-serif text-[#1e293b]">{selectedCase.title}</h2>
              <p className="text-xs text-slate-500">{selectedCase.court} &bull; {selectedCase.year}</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-sm">
              Verdict: {selectedCase.verdictOutcome || selectedCase.outcome}
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <strong className="block text-[#1e293b] uppercase tracking-wider mb-1">Matter Summary:</strong>
                <p className="bg-slate-50 p-3 border leading-relaxed">{selectedCase.summary}</p>
              </div>

              {selectedCase.challenge && (
                <div>
                  <strong className="block text-[#1e293b] uppercase tracking-wider mb-1">Legal Challenge:</strong>
                  <p className="bg-slate-50 p-3 border leading-relaxed">{selectedCase.challenge}</p>
                </div>
              )}

              {selectedCase.strategy && (
                <div>
                  <strong className="block text-[#1e293b] uppercase tracking-wider mb-1">Courtroom Strategy &amp; Research:</strong>
                  <p className="bg-slate-50 p-3 border leading-relaxed">{selectedCase.strategy}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-6 py-2 bg-[#1e293b] text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
