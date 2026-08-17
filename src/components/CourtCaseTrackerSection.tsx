import React, { useState } from 'react';
import { FIRM_DETAILS } from '../data/legalData';
import { Scale, Building2, Landmark, Search, ExternalLink, FileText, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const CourtCaseTrackerSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hc' | 'dc' | 'rc'>('hc');
  const [cnoQuery, setCnoQuery] = useState('');

  const courtPortals = {
    hc: {
      title: "Allahabad High Court (Prayagraj Main Bench)",
      subtitle: "Judicature at Allahabad — Constitutional Writs, Section 482, Bail & First Appeals",
      icon: Scale,
      badge: "High Court Bench",
      links: [
        {
          name: "High Court Case Status Search",
          desc: "Search by Case Type, Writ Number, Filing Year, Litigant Name or Advocate Roll No.",
          url: FIRM_DETAILS.highCourtCaseStatusPortal,
          primary: true
        },
        {
          name: "Daily Cause List & Bench Allocations",
          desc: "Check daily court room cause list and judge bench allocations for Prayagraj.",
          url: "https://allahabadhighcourt.in/causelist/clist.html",
          primary: false
        },
        {
          name: "Judgment & Order Sheets PDF",
          desc: "Download official signed copy of High Court orders and judgments directly.",
          url: FIRM_DETAILS.highCourtJudgmentsPortal,
          primary: false
        },
        {
          name: "Official Allahabad High Court Portal",
          desc: "Main portal for notifications, roster changes, and circulars.",
          url: FIRM_DETAILS.highCourtOfficialPortal,
          primary: false
        }
      ]
    },
    dc: {
      title: "District & Sessions Courts (Prayagraj & Kutchery)",
      subtitle: "eCourts Services — Civil Suits, Criminal Trials, Sessions Bail & Magistrate Courts",
      icon: Building2,
      badge: "District Court eCourts",
      links: [
        {
          name: "Prayagraj District Court eCourts Portal",
          desc: "Official District Court Prayagraj website for case status and daily orders.",
          url: "https://districts.ecourts.gov.in/prayagraj",
          primary: true
        },
        {
          name: "eCourts India National Case Status",
          desc: "Search District Court cases by CNR Number, Party Name, FIR No. or Case No.",
          url: "https://services.ecourts.gov.in/ecourtindia_v6/",
          primary: false
        },
        {
          name: "eCourts Daily Cause List",
          desc: "View courtroom-wise daily hearing lists for Prayagraj Sessions & Lower Courts.",
          url: "https://services.ecourts.gov.in/ecourtindia_v6/static/causelist.php",
          primary: false
        }
      ]
    },
    rc: {
      title: "Board of Revenue & Revenue Courts (Prayagraj)",
      subtitle: "UP Revenue Court Management System (RCMS Vaad) — Land Mutation, Partition & Eviction",
      icon: Landmark,
      badge: "Revenue & Land Courts",
      links: [
        {
          name: "UP RCMS Vaad Portal (Case Status)",
          desc: "Official UP Revenue Court Management System for searching land dispute cases.",
          url: "https://vaad.up.nic.in/online_application/Search_Case_Status.aspx",
          primary: true
        },
        {
          name: "Board of Revenue Prayagraj Official Portal",
          desc: "Apex revenue court portal for appeals, revisions, and revenue board cause lists.",
          url: "https://bor.up.nic.in/",
          primary: false
        },
        {
          name: "RCMS Land Dispute Status Tracker",
          desc: "Track SDM, Tehsildar, Commissioner & Board of Revenue hearings online.",
          url: "https://vaad.up.nic.in/",
          primary: false
        }
      ]
    }
  };

  const handleExternalRedirect = (e: React.FormEvent, defaultUrl: string) => {
    e.preventDefault();
    if (cnoQuery.trim()) {
      // Direct user to official portal with helpful tip
      window.open(defaultUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(defaultUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const currentCourt = courtPortals[activeTab];

  return (
    <section className="bg-slate-900 text-white py-12 sm:py-16 border-t-4 border-[#c5a059] relative overflow-hidden">
      {/* Background subtle watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
        <Scale className="w-96 h-96 text-[#c5a059]" />
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-[#c5a059]/40 text-[#c5a059] text-[11px] font-bold uppercase tracking-widest rounded-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Court Case Status &amp; Cause List Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-white">
            Prayagraj Courts Online Portal Redirection
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Advocate Bhavni Singh represents clients across <strong className="text-white">Allahabad High Court</strong>, <strong className="text-white">District &amp; Lower Courts</strong>, and <strong className="text-white">Board of Revenue Courts</strong> in Prayagraj. Use our direct links to access official court portals for daily cause lists, judge bench allocations, and order sheets.
          </p>
        </div>

        {/* Court Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('hc')}
            className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'hc'
                ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>1. Allahabad High Court</span>
          </button>

          <button
            onClick={() => setActiveTab('dc')}
            className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'dc'
                ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>2. District &amp; Lower Courts</span>
          </button>

          <button
            onClick={() => setActiveTab('rc')}
            className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'rc'
                ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>3. Board of Revenue Courts</span>
          </button>
        </div>

        {/* Active Court Content Card */}
        <div className="bg-slate-800/90 border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-slate-900 border border-[#c5a059] flex items-center justify-center shrink-0">
                <currentCourt.icon className="w-6 h-6 text-[#c5a059]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block">
                  {currentCourt.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-white">
                  {currentCourt.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentCourt.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Case Search Redirection Bar */}
          <form 
            onSubmit={(e) => handleExternalRedirect(e, currentCourt.links[0].url)} 
            className="bg-slate-900/90 p-4 border border-slate-700 space-y-2"
          >
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Direct Government Portal Search Query:
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Writ/Case No, Litigant Name, or CNR No..."
                  value={cnoQuery}
                  onChange={(e) => setCnoQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#c5a059] hover:bg-[#a88442] text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Track on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Clicking will safely open the official government court portal in a new tab for live verification.
            </p>
          </form>

          {/* Grid of Direct Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {currentCourt.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 border transition-all flex flex-col justify-between space-y-3 group cursor-pointer ${
                  link.primary
                    ? 'bg-slate-900/90 border-[#c5a059] hover:border-amber-400'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-[#c5a059] transition-colors flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#c5a059]" />
                      {link.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c5a059]" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {link.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#c5a059] pt-1">
                  <span>Open Official Web Page</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
