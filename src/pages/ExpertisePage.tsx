import React, { useState } from 'react';
import { PRACTICE_AREAS } from '../data/legalData';
import { PracticeArea } from '../types';
import { ArrowRight, CheckCircle2, Shield, Scale, ChevronRight } from 'lucide-react';

interface ExpertisePageProps {
  onOpenAppointmentModal: () => void;
}

export const ExpertisePage: React.FC<ExpertisePageProps> = ({ onOpenAppointmentModal }) => {
  const [selectedArea, setSelectedArea] = useState<PracticeArea>(PRACTICE_AREAS[0]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Practice Areas &amp; Specializations</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">Legal Expertise &amp; High Court Practice</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Focused advocacy across the Hon&apos;ble High Court of Judicature at Allahabad, District &amp; Lower Courts (Prayagraj), and Board of Revenue Courts (Prayagraj).
          </p>
        </div>

        {/* Practice Area Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side Practice List */}
          <div className="lg:col-span-5 bg-white border border-slate-200 divide-y divide-slate-100 shadow-sm">
            {PRACTICE_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className={`w-full text-left p-5 transition-all flex items-center justify-between cursor-pointer ${
                  selectedArea.id === area.id
                    ? 'bg-[#1e293b] text-white border-l-4 border-[#c5a059]'
                    : 'bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-none ${selectedArea.id === area.id ? 'bg-[#c5a059] text-white' : 'bg-slate-100 text-[#1e293b]'}`}>
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold">{area.title}</h3>
                    <p className={`text-[11px] truncate max-w-[220px] ${selectedArea.id === area.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {area.shortDesc}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedArea.id === area.id ? 'text-[#c5a059]' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          {/* Right Side Detail View */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-[#1e293b] text-[#c5a059]">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block">Practice Area Detail</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1e293b]">{selectedArea.title}</h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {selectedArea.fullDetails || selectedArea.fullDesc}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Sub-Services &amp; Legal Remedies:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(selectedArea.keyServices || selectedArea.subServices || []).map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e293b] text-white p-6 border-t-2 border-[#c5a059] space-y-3 mt-6">
              <h4 className="text-lg font-serif text-[#c5a059]">Need Urgent Counsel in {selectedArea.title}?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schedule a confidential consultation with Advocate Bhavani Singh. We examine case filings, HC daily cause list positioning, and draft effective legal remedies.
              </p>
              <button
                onClick={onOpenAppointmentModal}
                className="mt-2 px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Book Legal Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
