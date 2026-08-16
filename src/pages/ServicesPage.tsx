import React from 'react';
import { PRACTICE_AREAS, FIRM_DETAILS } from '../data/legalData';
import { Scale, CheckCircle2, ShieldCheck, FileText, ArrowRight, Clock } from 'lucide-react';

interface ServicesPageProps {
  onOpenAppointmentModal: () => void;
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenAppointmentModal, onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Comprehensive Practice</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">Our Legal Consultation Services</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Single-window legal consultancy for High Court litigation, constitutional writs, lower court trials, and revenue disputes before Prayagraj Courts.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRACTICE_AREAS.map((service) => (
            <div key={service.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-[#1e293b] text-[#c5a059]">
                    <Scale className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] bg-amber-50 px-2 py-1 border border-amber-200">
                    High Court Practice
                  </span>
                </div>

                <h3 className="text-xl font-serif text-[#1e293b]">{service.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{service.shortDesc}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Includes:</span>
                  {(service.keyServices || service.subServices || []).slice(0, 3).map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onOpenAppointmentModal}
                  className="w-full py-3 bg-[#1e293b] hover:bg-[#c5a059] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Case Portal CTA Banner */}
        <div className="bg-[#1e293b] text-white p-8 border-t-4 border-[#c5a059] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Two-Way Portal Access</span>
            <h3 className="text-2xl font-serif text-white">Track Your Ongoing High Court Case Status</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Existing clients can view next hearing dates, download judge order sheets, and add hearing reminders to Google Calendar without logging in.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/client-portal')}
            className="px-8 py-4 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
          >
            Access Client Case Portal
          </button>
        </div>

      </div>
    </div>
  );
};
