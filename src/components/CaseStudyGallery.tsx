import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/legalData';
import { CaseStudy } from '../types';
import { Search, Gavel, Scale, CheckCircle2, ChevronRight, Award, Shield, X, Filter } from 'lucide-react';

interface CaseStudyGalleryProps {
  onBookConsultation: () => void;
}

export const CaseStudyGallery: React.FC<CaseStudyGalleryProps> = ({ onBookConsultation }) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCases = CASE_STUDIES.filter((cs) => {
    const matchesCategory = categoryFilter === 'all' || cs.category === categoryFilter;
    const matchesSearch = 
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.practiceArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.court.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-2">Track Record &amp; Precedents</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1e293b] mb-4">
            Case Study Gallery
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Explore detailed breakdowns of litigation victories, strategic court settlements, and landmark appeals handled by Advocate Bhavani Singh &amp; Associates.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-slate-50 p-4 border border-slate-200">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Precedents' },
              { id: 'family', label: 'Family & Matrimonial' },
              { id: 'criminal', label: 'Criminal & Bail' },
              { id: 'civil', label: 'Civil & Cheque Bounce' },
              { id: 'tribunal', label: 'Supreme Court & DRT' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-[#1e293b] text-[#c5a059] shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search court, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((cs) => (
            <div
              key={cs.id}
              className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-[#c5a059] shadow-sm transition-all duration-300"
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-[#1e293b] text-[#c5a059] text-[10px] font-bold uppercase tracking-wider">
                    {cs.practiceArea}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {cs.year}
                  </span>
                </div>

                <h3 className="text-lg font-serif text-[#1e293b] mb-2 leading-snug">
                  {cs.title}
                </h3>

                <p className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{cs.court}</span>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {cs.summary}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium mb-4">
                  <strong className="text-[#1e293b]">Outcome:</strong> {cs.verdictOutcome}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 italic">{cs.clientAnonymized}</span>
                <button
                  onClick={() => setSelectedCase(cs)}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1e293b] hover:text-[#c5a059] transition-colors cursor-pointer"
                >
                  <span>Read Strategy</span>
                  <ChevronRight className="w-4 h-4 text-[#c5a059]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm font-medium">No case studies matching your criteria.</p>
            <button
              onClick={() => { setCategoryFilter('all'); setSearchQuery(''); }}
              className="mt-3 text-xs text-[#c5a059] font-bold underline"
            >
              Reset filters
            </button>
          </div>
        )}

      </div>

      {/* Case Breakdown Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#1e293b] text-[#c5a059]">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#c5a059] uppercase">{selectedCase.practiceArea} • {selectedCase.year}</span>
                <h3 className="text-2xl font-serif text-[#1e293b]">{selectedCase.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">{selectedCase.court}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div className="bg-slate-50 p-4 border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Background &amp; Challenge</h4>
                <p className="text-slate-800">{selectedCase.challenge}</p>
              </div>

              <div className="bg-slate-900 text-white p-4 border border-slate-800">
                <h4 className="text-xs font-bold uppercase text-[#c5a059] tracking-wider mb-1">Legal Strategy Applied</h4>
                <p className="text-slate-200">{selectedCase.strategy}</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Verdict &amp; Court Ruling</h4>
                <p className="text-slate-900 font-semibold">{selectedCase.verdictOutcome}</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Long-term Client Impact</h4>
                <p className="text-slate-800">{selectedCase.impact}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 italic">Matter Reference: {selectedCase.clientAnonymized}</span>
              <button
                onClick={() => {
                  setSelectedCase(null);
                  onBookConsultation();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Discuss Similar Legal Case
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
