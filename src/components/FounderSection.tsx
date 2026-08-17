import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Award, X, User, Scale } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

interface FounderSectionProps {
  onOpenAppointment: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onOpenAppointment }) => {
  const [showBioModal, setShowBioModal] = useState(false);
  const { firmDetails } = useFirmData();

  const benefits = [
    "Allahabad High Court Practice Specialist (Prayagraj)",
    "Lower Courts Practice (District & Sessions Court, Prayagraj)",
    "Board of Revenue & Revenue Courts Practice (Prayagraj)",
    "Constitutional Writs (Art. 226/227) & Land Revenue Mastery",
    "High Court Bail, 482 Quashing & Criminal Trials",
    "Hardworking, Diligent & Research-Driven Representation",
    "Direct Allahabad High Court Order Sheet & Case Tracking Links",
    "Dedicated Client Portal & Daily Cause List Updates",
    "Absolute Professional Ethics & Client Confidentiality"
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Top Banner Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-serif text-[#1e293b] leading-snug">
            We serve you on priority with consultation from {firmDetails.founderName} &amp; Associates, ensuring complete transparency and court hearing precision.
          </h2>
        </div>

        {/* Founder Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Advocate Portrait Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#1e293b] to-[#c5a059] blur-md opacity-20 group-hover:opacity-35 transition-opacity" />
              <div className="relative border border-slate-200 bg-white shadow-md">
                {firmDetails.founderImage ? (
                  <img 
                    src={firmDetails.founderImage} 
                    alt={firmDetails.founderName}
                    className="w-full h-[420px] sm:h-[480px] object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-[#1e293b] via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center p-8 text-white relative overflow-hidden">
                    <div className="w-28 h-28 rounded-full bg-[#c5a059]/20 border-2 border-[#c5a059] flex items-center justify-center mb-4 shadow-inner">
                      <Scale className="w-14 h-14 text-[#c5a059]" />
                    </div>
                    <span className="text-3xl font-serif text-[#c5a059] tracking-wider font-bold">BS</span>
                    <p className="text-lg font-serif text-white mt-2">{firmDetails.founderName}</p>
                    <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">High Court Advocate</p>
                    <div className="mt-4 px-3 py-1 bg-white/10 text-slate-300 text-[11px] font-mono border border-white/10">
                      Chambers &bull; Prayagraj
                    </div>
                  </div>
                )}
                <div className="bg-[#1e293b] p-6 text-white border-t-2 border-[#c5a059]">
                  <p className="text-xl font-serif text-[#c5a059]">{firmDetails.founderName}</p>
                  <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase mt-1">High Court of Judicature at Allahabad</p>
                  <p className="text-xs text-slate-400 mt-1">{firmDetails.enrollmentNo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Firm Description & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[#c5a059] font-semibold tracking-widest uppercase text-xs block mb-1">
                About The Chambers
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#1e293b] uppercase">
                {firmDetails.name}
              </h3>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {firmDetails.aboutText}
            </p>

            {/* Our Best Service Benefits Grid */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Why Litigants Trust Our Chambers:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-800 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowBioModal(true)}
                className="px-8 py-4 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Read Chambers Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAppointment}
                className="px-8 py-4 border border-[#1e293b] text-[#1e293b] hover:bg-[#1e293b] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Book Personal Legal Consultation
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Read More Detailed Modal */}
      {showBioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setShowBioModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#1e293b] text-[#c5a059]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#1e293b]">{firmDetails.founderName}</h3>
                <p className="text-xs text-[#c5a059] font-semibold uppercase tracking-wider">{firmDetails.enrollmentNo}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>{firmDetails.aboutText}</p>
              <p>
                <strong>Comprehensive Practice Jurisdiction in Prayagraj:</strong>
                <br />
                Our chambers actively handle litigations, writ petitions, lower court criminal trials & civil suits, and revenue cases across the High Court of Judicature at Allahabad, District &amp; Sessions Court (Prayagraj), and Board of Revenue &amp; Revenue Courts (Prayagraj).
              </p>
              <p>
                <strong>Chamber Mobile Phone:</strong> <a href={`tel:${firmDetails.phone}`} className="text-[#c5a059] font-bold">{firmDetails.phone}</a>
                <br />
                <strong>Official Email:</strong> <a href={`mailto:${firmDetails.email}`} className="text-[#c5a059] font-bold">{firmDetails.email}</a>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => { setShowBioModal(false); onOpenAppointment(); }}
                className="px-6 py-3 bg-[#1e293b] text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
