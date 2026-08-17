import React, { useState } from 'react';
import { PRACTICE_AREAS } from '../data/legalData';
import { PracticeArea } from '../types';
import { ChevronRight, Scale, Shield, Users, FileText, Gavel, X, Check } from 'lucide-react';

interface ExpertiseSectionProps {
  onSelectPracticeArea: (area: PracticeArea) => void;
  onBookAppointment: (practiceAreaTitle?: string) => void;
}

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  onBookAppointment
}) => {
  const [selectedArea, setSelectedArea] = useState<PracticeArea | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'family' | 'criminal' | 'civil' | 'corporate' | 'tribunal'>('all');

  const filteredAreas = activeTab === 'all' 
    ? PRACTICE_AREAS 
    : PRACTICE_AREAS.filter(area => area.category === activeTab);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-2">Legal Specialties</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1e293b] mb-4">
            Our Expertise
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Providing specialized litigation advocacy, advisory, and dispute resolution across all major domains of Indian law.
          </p>
        </div>

        {/* Practice Area Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Specialties' },
            { id: 'family', label: 'Matrimonial & Family' },
            { id: 'criminal', label: 'Criminal & Bail' },
            { id: 'civil', label: 'Civil & Recovery' },
            { id: 'corporate', label: 'Corporate & NCLT' },
            { id: 'tribunal', label: 'Supreme Court & DRT' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1e293b] text-[#c5a059] shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Expertise Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.id}
              className="group bg-white overflow-hidden border border-slate-200 hover:border-[#c5a059] shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Image with Circular Icon Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={area.imageUrl}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 w-9 h-9 bg-[#1e293b] text-[#c5a059] flex items-center justify-center shadow-md">
                    <Scale className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-serif text-[#1e293b] mb-2 group-hover:text-[#c5a059] transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {area.shortDesc}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedArea(area)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1e293b] group-hover:text-[#c5a059] transition-colors cursor-pointer"
                >
                  <span>View Detail</span>
                  <ChevronRight className="w-4 h-4 text-[#c5a059] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setSelectedArea(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#1e293b] text-[#c5a059] flex items-center justify-center shrink-0">
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#1e293b]">{selectedArea.title}</h3>
                <p className="text-xs text-[#c5a059] font-semibold uppercase tracking-wider">Practice Domain: {selectedArea.category.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p className="text-slate-800 font-medium">{selectedArea.fullDetails}</p>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Legal Services Offered:</h4>
                <div className="space-y-2">
                  {selectedArea.keyServices.map((service, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 border border-slate-200">
                      <Check className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">Confidential consultations arranged at Preet Vihar, Supreme Court, or District Chambers.</p>
              <button
                onClick={() => {
                  const areaTitle = selectedArea.title;
                  setSelectedArea(null);
                  onBookAppointment(areaTitle);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
