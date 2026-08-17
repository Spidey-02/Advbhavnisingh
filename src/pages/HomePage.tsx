import React from 'react';
import { Hero } from '../components/Hero';
import { FounderSection } from '../components/FounderSection';
import { ExpertiseSection } from '../components/ExpertiseSection';
import { CaseStudyGallery } from '../components/CaseStudyGallery';
import { WayWeWork } from '../components/WayWeWork';
import { BlogSection } from '../components/BlogSection';
import { LocationsMapSection } from '../components/LocationsMapSection';
import { AppointmentSection } from '../components/AppointmentSection';
import { CourtCaseTrackerSection } from '../components/CourtCaseTrackerSection';
import { Scale, ExternalLink, Calendar, Search, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { FIRM_DETAILS } from '../data/legalData';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenAppointmentModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAppointmentModal
}) => {
  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <Hero 
        onExploreServices={() => onNavigate('/services')}
        onBookAppointment={onOpenAppointmentModal}
      />

      {/* Two-Way System Direct Quick Case Status Search Bar */}
      <section className="bg-gradient-to-r from-[#1e293b] via-slate-900 to-[#1e293b] py-8 text-white border-y border-[#c5a059]/30">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#c5a059] text-white shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-widest block">Client Case Portal &bull; Two-Way System</span>
              <h3 className="text-xl sm:text-2xl font-serif text-white">Track Next Court Hearing &amp; High Court Orders</h3>
              <p className="text-xs text-slate-300">No login required! Enter your case filing number or view official Allahabad High Court links.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => onNavigate('/client-portal')}
              className="px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Client Case Tracker</span>
            </button>

            <a
              href={FIRM_DETAILS.highCourtOfficialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-slate-950 hover:bg-black text-[#c5a059] border border-[#c5a059]/40 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>High Court Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <FounderSection onOpenAppointment={onOpenAppointmentModal} />

      {/* Practice Areas / Expertise */}
      <ExpertiseSection onOpenAppointment={onOpenAppointmentModal} />

      {/* Multi-Court Case Status & Cause List Tracker Section */}
      <CourtCaseTrackerSection />

      {/* Case Studies Gallery */}
      <CaseStudyGallery onOpenAppointment={onOpenAppointmentModal} />

      {/* Process / Way We Work */}
      <WayWeWork onOpenAppointment={onOpenAppointmentModal} />

      {/* Blog & Legal Insights */}
      <BlogSection onNavigateToBlog={() => onNavigate('/blog')} />

      {/* Offices & Map Locations */}
      <LocationsMapSection />

      {/* Appointment Booking Section */}
      <AppointmentSection />
    </div>
  );
};
