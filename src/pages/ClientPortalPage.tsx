import React, { useState, useEffect } from 'react';
import { INITIAL_CLIENT_CASES, FIRM_DETAILS } from '../data/legalData';
import { ClientCase } from '../types';
import { Search, Calendar, FileText, ExternalLink, Scale, CheckCircle2, AlertCircle, Clock, Share2, Plus, Download, BellRing, Database, User } from 'lucide-react';
import { CourtCaseTrackerSection } from '../components/CourtCaseTrackerSection';

export const ClientPortalPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ClientCase[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ClientCase | null>(null);
  const [reminderSet, setReminderSet] = useState<string | null>(null);
  const [allCases, setAllCases] = useState<ClientCase[]>(INITIAL_CLIENT_CASES);
  const [mongoLoaded, setMongoLoaded] = useState(false);

  // Fetch cases from MongoDB API on mount & merge with local storage
  useEffect(() => {
    const saved = localStorage.getItem('bhavani_cases');
    let localCasesList = INITIAL_CLIENT_CASES;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localCasesList = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setAllCases(localCasesList);

    // Fetch live cases from MongoDB Atlas API
    fetch('/api/cases')
      .then(r => r.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.cases) && data.cases.length > 0) {
          setAllCases(data.cases);
          localStorage.setItem('bhavani_cases', JSON.stringify(data.cases));
          setMongoLoaded(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      setSearched(false);
      return;
    }

    const matched = allCases.filter(c => 
      c.caseNumber.toLowerCase().includes(query) ||
      c.clientName.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query)) ||
      (c.opposingParty && c.opposingParty.toLowerCase().includes(query)) ||
      c.caseType.toLowerCase().includes(query) ||
      c.courtName.toLowerCase().includes(query)
    );

    setSearchResults(matched);
    setSearched(true);
    if (matched.length > 0) {
      setSelectedCase(matched[0]);
    } else {
      setSelectedCase(null);
    }
  };

  const handleSetReminder = (caseId: string, hearingDate: string) => {
    setReminderSet(caseId);
    // Show toast / status
    setTimeout(() => {
      setReminderSet(null);
    }, 4000);
  };

  const createGoogleCalendarUrl = (c: ClientCase) => {
    const title = encodeURIComponent(`Court Hearing: ${c.caseNumber} - ${c.courtName}`);
    const details = encodeURIComponent(`Hearing Date for ${c.clientName}.\nCourt: ${c.courtName}\nJudge/Bench: ${c.judgeBench}\nCourtroom: ${c.courtRoomNo}\nStage: ${c.stage}\nLawyer: Advocate Bhavani Singh (+91 9415211990)`);
    const location = encodeURIComponent(`${c.courtName}, Prayagraj`);
    
    // Format date YYYYMMDD
    let dateStr = '20260915';
    try {
      const d = new Date(c.nextHearingDate);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dateStr = `${yyyy}${mm}${dd}`;
      }
    } catch (e) {
      console.error(e);
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}T100000Z/${dateStr}T120000Z`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e293b] text-[#c5a059] text-[11px] font-bold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>Two-Way Client Case Portal &bull; No Login Required</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">Allahabad High Court Case Status Tracker</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Enter your Case Filing Number, Client Name, or Mobile Number to view next hearing dates, judge bench details, order sheets, and set Google Calendar reminders.
          </p>
        </div>

        {/* Quick Allahabad High Court Official Banner */}
        <div className="bg-gradient-to-r from-[#1e293b] to-slate-900 text-white p-6 border-l-4 border-[#c5a059] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] block">Official Government Portal Redirection</span>
            <h3 className="text-xl font-serif text-white">Need Official Cause Lists or Orders Directly from Allahabad High Court?</h3>
            <p className="text-xs text-slate-300">
              Access live daily cause lists, case status searches, and judge bench allocations directly from the official High Court portal.
            </p>
          </div>

          <a
            href={FIRM_DETAILS.highCourtOfficialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <span>Visit Official HC Web Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Enter Case Filing Number / Client Name / Phone Number:
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. WRIT/2026/89412 or Ramesh or 9839012345"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#1e293b] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
              >
                Search Case
              </button>
            </div>
          </form>

          {/* Active Cases Pills */}
          {allCases.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Active Registered Cases:</span>
              {allCases.slice(0, 4).map((c, idx) => (
                <button
                  key={`demo-case-${c.id || c.caseNumber || 'item'}-${idx}`}
                  onClick={() => {
                    setSearchQuery(c.caseNumber);
                    setSearchResults([c]);
                    setSelectedCase(c);
                    setSearched(true);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-[#c5a059] hover:text-white border border-slate-300 text-[11px] transition-colors"
                >
                  {c.caseNumber} ({c.clientName})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {searched && (
          <div className="space-y-6">
            {searchResults.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 p-8 text-center space-y-3 max-w-2xl mx-auto">
                <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                <h3 className="text-xl font-serif text-amber-900">No Matching Case Records Found</h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  We could not find any case matching <strong>&quot;{searchQuery}&quot;</strong>. Please check your filing number, or contact Advocate Bhavani Singh&apos;s chamber at <strong>+91 9415211990</strong> for immediate assistance.
                </p>
                <div className="pt-2">
                  <a
                    href={FIRM_DETAILS.highCourtOfficialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    <span>Check Official Allahabad HC Database</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Search Result Case List */}
                <div className="lg:col-span-4 space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Found {searchResults.length} Matching Record(s):
                  </span>
                  {searchResults.map((c, idx) => (
                    <div
                      key={`search-case-${c.id || c.caseNumber || 'item'}-${idx}`}
                      onClick={() => setSelectedCase(c)}
                      className={`p-4 border cursor-pointer transition-all ${
                        selectedCase?.id === c.id
                          ? 'bg-[#1e293b] text-white border-[#c5a059]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 inline-block mb-1 ${
                        selectedCase?.id === c.id ? 'bg-[#c5a059] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {c.caseType}
                      </span>
                      <h4 className="text-base font-serif font-bold">{c.caseNumber}</h4>
                      <p className={`text-xs mt-1 ${selectedCase?.id === c.id ? 'text-slate-300' : 'text-slate-600'}`}>
                        Client: <strong>{c.clientName}</strong> vs {c.opposingParty}
                      </p>
                      <p className={`text-[11px] mt-1 font-semibold ${selectedCase?.id === c.id ? 'text-[#c5a059]' : 'text-[#1e293b]'}`}>
                        Next Hearing: {c.nextHearingDate}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Selected Case Detailed View */}
                {selectedCase && (
                  <div className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Official Case Record</span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-[#1e293b]">{selectedCase.caseNumber}</h2>
                        <p className="text-xs text-slate-500 mt-1">{selectedCase.courtName}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase border border-emerald-300">
                          Status: {selectedCase.status}
                        </span>
                      </div>
                    </div>

                    {/* Next Hearing Callout Box */}
                    <div className="bg-gradient-to-r from-[#1e293b] to-slate-900 text-white p-6 border-l-4 border-[#c5a059] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block">Upcoming Court Hearing</span>
                        <h3 className="text-2xl font-serif text-white mt-0.5">{selectedCase.nextHearingDate}</h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Bench: {selectedCase.judgeBench} &bull; Room No: <strong>{selectedCase.courtRoomNo}</strong>
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <a
                          href={createGoogleCalendarUrl(selectedCase)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Add to Google Calendar</span>
                        </a>

                        <button
                          onClick={() => handleSetReminder(selectedCase.id, selectedCase.nextHearingDate)}
                          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BellRing className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span>{reminderSet === selectedCase.id ? '✓ Notification Enabled' : 'Enable No-Miss Reminder'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Case Details Table Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Client Name:</span>
                        <span className="text-slate-800 font-bold text-sm">{selectedCase.clientName}</span>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Opposing Party / State:</span>
                        <span className="text-slate-800 font-bold text-sm">{selectedCase.opposingParty}</span>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Case Category:</span>
                        <span className="text-slate-800 font-bold text-sm">{selectedCase.caseType}</span>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Current Case Stage:</span>
                        <span className="text-slate-800 font-bold text-sm">{selectedCase.stage}</span>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Filing Date:</span>
                        <span className="text-slate-800 font-bold text-sm">{selectedCase.filingDate}</span>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold uppercase block text-[10px]">Assigned Advocate:</span>
                        <span className="text-[#1e293b] font-bold text-sm">{selectedCase.advocateAssigned}</span>
                      </div>
                    </div>

                    {/* Order Sheets & Remarks History */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Court Remarks &amp; Updates:</h4>
                      <div className="p-4 bg-slate-100 border-l-4 border-[#1e293b] text-xs text-slate-700 leading-relaxed">
                        {selectedCase.lastOrderRemarks}
                      </div>
                    </div>

                    {/* Download Court Order & Judgment Section for Client */}
                    <div className="p-5 bg-gradient-to-br from-slate-900 to-[#1e293b] text-white border-l-4 border-[#c5a059] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block">Official High Court Document</span>
                          <h4 className="text-lg font-serif text-white">Court Order &amp; Judgment Copy</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Uploaded &amp; Certified by Advocate Bhavani Singh</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={selectedCase.highCourtOrderUrl || FIRM_DETAILS.highCourtJudgmentsPortal}
                            download={`${selectedCase.caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Order_Copy.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                          >
                            <Download className="w-4 h-4 text-white" />
                            <span>Download Order / Judgment PDF</span>
                          </a>
                        </div>
                      </div>

                      {/* List of Attached Case Files / Document Copies */}
                      {selectedCase.documents && selectedCase.documents.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase text-slate-300 block">Uploaded Document Files:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedCase.documents.map((doc, docIdx) => (
                              <div key={`${selectedCase.id}-doc-${docIdx}`} className="p-2.5 bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-2 text-xs">
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-200 truncate">{doc.title}</p>
                                  <p className="text-[10px] text-slate-400">{doc.type} &bull; {doc.date} &bull; {doc.size}</p>
                                </div>
                                <a
                                  href={doc.url && doc.url !== '#' ? doc.url : (selectedCase.highCourtOrderUrl || FIRM_DETAILS.highCourtJudgmentsPortal)}
                                  download={doc.title}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#a88442] text-white text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Official Order Sheets Links */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Official High Court Links:</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={selectedCase.highCourtOrderUrl || FIRM_DETAILS.highCourtJudgmentsPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-[#1e293b] text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-[#c5a059]" />
                          <span>View Judgments / Orders</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={FIRM_DETAILS.highCourtCaseStatusPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-[#c5a059] text-white hover:bg-[#a88442] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                          <span>Check HC Case Status</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={FIRM_DETAILS.highCourtOfficialPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                          <span>Allahabad HC Main Site</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </a>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* Multi-Court Case Status & Cause List Tracker Section */}
        <div className="pt-6">
          <CourtCaseTrackerSection />
        </div>

      </div>
    </div>
  );
};
