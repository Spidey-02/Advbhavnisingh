import React from 'react';
import { ChevronRight, Award, Users, Smile, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { FIRM_DETAILS } from '../data/legalData';

interface HeroProps {
  onExploreServices: () => void;
  onBookAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreServices,
  onBookAppointment
}) => {
  return (
    <section className="relative bg-[#1e293b] text-white overflow-hidden">
      {/* Background Image with Vignette */}
      <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center filter grayscale contrast-125"
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80')` }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1e293b] via-[#1e293b]/90 to-slate-900/80" />

      {/* Main Hero Banner Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28 flex flex-col items-center text-center">
        
        {/* Supreme Court / Bar Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1e293b]/90 border border-[#c5a059]/50 text-[#c5a059] text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
          <Scale className="w-4 h-4 text-[#c5a059]" />
          <span>{FIRM_DETAILS.barMemberships}</span>
        </div>

        {/* Subtitle */}
        <p className="text-[#c5a059] font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3">
          Trusted Legal Counsel &bull; Welcome to {FIRM_DETAILS.name}
        </p>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-[1.15] text-white max-w-4xl mb-6">
          Precision in Law,<br className="hidden sm:inline" /> Excellence in Execution.
        </h1>

        {/* Supporting Copy */}
        <p className="text-slate-300 text-sm sm:text-lg max-w-2xl leading-relaxed mb-8">
          Dedicated High Court litigation, constitutional writs, bail applications, lower court trial advocacy, and revenue disputes before the Hon&apos;ble High Court of Judicature at Allahabad, District &amp; Sessions Court (Prayagraj), and Board of Revenue Courts (Prayagraj).
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Schedule Consultation</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onBookAppointment}
            className="w-full sm:w-auto px-8 py-4 border border-white/80 hover:border-[#c5a059] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            Our Case Studies
          </button>
        </div>
      </div>

      {/* Banner Stats Ribbon */}
      <div className="relative z-10 bg-white text-[#1e293b] border-t border-b border-slate-200 py-8 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-6 h-6 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b]">
                {FIRM_DETAILS.stats.leadingSince}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leading Since</p>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-6 h-6 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b]">
                {FIRM_DETAILS.stats.experiencedAttorneys}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experienced Attorneys</p>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="w-6 h-6 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b]">
                {FIRM_DETAILS.stats.happyClients}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Served</p>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b]">
                {FIRM_DETAILS.stats.successRatio}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Success</p>
          </div>

        </div>
      </div>
    </section>
  );
};
