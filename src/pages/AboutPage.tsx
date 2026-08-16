import React from 'react';
import { Award, Scale, CheckCircle2, ShieldCheck, MapPin, Building, Phone, Mail, ExternalLink, Calendar } from 'lucide-react';
import { FIRM_DETAILS, OFFICE_LOCATIONS } from '../data/legalData';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenAppointmentModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenAppointmentModal }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Page Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Chambers Profile</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">About {FIRM_DETAILS.name}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Legal practice before the Hon&apos;ble High Court of Judicature at Allahabad, District &amp; Lower Courts (Prayagraj), and Board of Revenue &amp; Revenue Courts (Prayagraj).
          </p>
        </div>

        {/* Senior Advocate Profile Card */}
        <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md border border-slate-300 p-2 bg-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" 
                alt="Advocate Bhavani Singh" 
                className="w-full h-[400px] object-cover object-top"
              />
              <div className="bg-[#1e293b] p-4 text-center text-white mt-2">
                <h3 className="text-xl font-serif text-[#c5a059]">Advocate Bhavani Singh</h3>
                <p className="text-xs text-slate-300 font-semibold">{FIRM_DETAILS.enrollmentNo}</p>
                <p className="text-[11px] text-slate-400 mt-1">Founder &amp; Principal Advocate</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 text-slate-700">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Dedicated Trial &amp; Appellate Advocate</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1e293b]">Dynamic Legal Practice &amp; Appellate Advocacy in Uttar Pradesh</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Advocate Bhavani Singh has been practicing law actively since <strong>2022</strong> before the Hon&apos;ble High Court of Judicature at Allahabad, District &amp; Sessions Court (Prayagraj), and Board of Revenue &amp; Revenue Courts (Prayagraj). Known for relentless hard work, meticulous case research, and sharp court craftsmanship, Advocate Bhavani Singh has represented over 1,500 clients in high-stakes Constitutional Writs, Section 482 FIR Quashing Petitions, High Court Bail Applications, Lower Court Criminal &amp; Civil Trials, and Revenue Land Disputes.
            </p>

            <div className="bg-slate-50 p-4 border-l-4 border-[#c5a059] space-y-2">
              <p className="text-xs font-bold text-[#1e293b] uppercase">Chambers Practice &amp; Key Jurisdictions:</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>&bull; <strong>Allahabad High Court</strong>: Chamber No. 402, High Court Bar Association Building, Prayagraj</li>
                <li>&bull; <strong>District &amp; Lower Courts</strong>: District &amp; Sessions Court Chamber Complex, Kutchery, Prayagraj</li>
                <li>&bull; <strong>Revenue Courts &amp; Board of Revenue</strong>: Board of Revenue Chambers, Prayagraj</li>
                <li>&bull; <strong>Main Senior Law Office</strong>: Tashkent Marg, Civil Lines, Prayagraj</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAppointmentModal}
                className="px-8 py-3.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Book Private Consultation
              </button>

              <button
                onClick={() => onNavigate('/client-portal')}
                className="px-8 py-3.5 bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                View Client Case Portal
              </button>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 bg-[#1e293b] text-[#c5a059] w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#1e293b]">Constitutional Integrity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We uphold fundamental rights under Article 226/227 of the Indian Constitution, challenging unlawful executive orders, arbitrary land seizures, and malicious criminal prosecutions.
            </p>
          </div>

          <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 bg-[#1e293b] text-[#c5a059] w-fit">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#1e293b]">No-Miss Hearing Precision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our automated daily cause list monitoring ensures zero missed court hearing dates. Clients receive instant updates on judge bench allocations and next hearing schedules.
            </p>
          </div>

          <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 bg-[#1e293b] text-[#c5a059] w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#1e293b]">Complete Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every order sheet, certified copy, and case progression entry is uploaded to our two-way portal for immediate client access and Google Calendar synchronization.
            </p>
          </div>
        </div>

        {/* Office & Chamber Locations Grid */}
        <div className="bg-white p-8 border border-slate-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Chambers &amp; Offices</span>
            <h2 className="text-2xl font-serif text-[#1e293b]">Prayagraj High Court, Lower Court &amp; Revenue Court Chambers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFICE_LOCATIONS.map((office) => (
              <div key={office.id} className="p-5 bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] bg-[#1e293b] px-2.5 py-1 inline-block text-white">
                  {office.type}
                </span>
                <h4 className="text-base font-serif text-[#1e293b]">{office.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{office.phone}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
