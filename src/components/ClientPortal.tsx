import React, { useState } from 'react';
import { DEMO_CLIENT_CASE } from '../data/legalData';
import { ClientCase } from '../types';
import { ShieldCheck, Lock, FileText, Calendar, DollarSign, MessageSquare, Download, Send, CheckCircle2, AlertCircle, User, LogOut, Key } from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [caseData, setCaseData] = useState<ClientCase>(DEMO_CLIENT_CASE);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'hearings' | 'invoices' | 'messages'>('overview');
  const [newMessage, setNewMessage] = useState('');

  const [loginCreds, setLoginCreds] = useState({ caseNumber: 'HMA/2025/00892', pin: '1234' });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updatedMessages = [
      ...caseData.messages,
      {
        sender: 'Client' as const,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'
      }
    ];

    setCaseData({
      ...caseData,
      messages: updatedMessages
    });

    setNewMessage('');

    // Simulate auto advocate response
    setTimeout(() => {
      setCaseData(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            sender: 'Advocate' as const,
            text: 'Note received. Our office will review your document and update the court file accordingly.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'
          }
        ]
      }));
    }, 1200);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#1e293b] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-2">256-Bit Encrypted Portal</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white mb-3">
            Secure Client Portal
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Track real-time court hearing schedules, download certified court orders, review billing, and exchange confidential case notes.
          </p>
        </div>

        {!isLoggedIn ? (
          /* Login Card */
          <div className="max-w-md mx-auto bg-slate-900/90 p-8 border border-slate-700 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#1e293b] text-[#c5a059] border border-[#c5a059]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">Client Login</h3>
                <p className="text-xs text-slate-400">Enter Case Number &amp; Access PIN</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Case Filing Number</label>
                <input
                  type="text"
                  required
                  value={loginCreds.caseNumber}
                  onChange={(e) => setLoginCreds({ ...loginCreds, caseNumber: e.target.value })}
                  placeholder="e.g. HMA/2025/00892"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Access PIN</label>
                <input
                  type="password"
                  required
                  value={loginCreds.pin}
                  onChange={(e) => setLoginCreds({ ...loginCreds, pin: e.target.value })}
                  placeholder="••••"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Access Secure Vault
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsLoggedIn(true)}
                  className="text-xs text-[#c5a059] underline hover:text-white"
                >
                  Load Sample Client Case (Ankita Singh)
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Client Portal Dashboard */
          <div className="bg-slate-900 border border-slate-700 overflow-hidden shadow-xl">
            
            {/* Top Portal Banner Bar */}
            <div className="bg-slate-950 p-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1e293b] border border-[#c5a059] flex items-center justify-center text-[#c5a059] font-bold text-lg shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif text-white">{caseData.clientName}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                      {caseData.statusBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Case No: <strong className="text-slate-200">{caseData.caseNumber}</strong> &bull; {caseData.practiceArea}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Assigned Advocate</p>
                  <p className="text-xs font-bold text-[#c5a059]">{caseData.assignedAdvocate}</p>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#c5a059]" />
                  Logout
                </button>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto">
              {[
                { id: 'overview', label: 'Case Status Overview', icon: ShieldCheck },
                { id: 'documents', label: 'Document Vault', icon: FileText, count: caseData.documents.length },
                { id: 'hearings', label: 'Hearing History', icon: Calendar, count: caseData.hearingsHistory.length },
                { id: 'invoices', label: 'Fee Invoices', icon: DollarSign, count: caseData.invoices.length },
                { id: 'messages', label: 'Advocate Chat', icon: MessageSquare, count: caseData.messages.length },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#c5a059] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="px-1.5 py-0.2 bg-slate-950 text-[10px] font-bold text-slate-300">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Next Hearing Date</p>
                      <p className="text-2xl font-serif text-[#c5a059]">{caseData.nextHearingDate}</p>
                      <p className="text-xs text-slate-400">Saket Family Court Complex</p>
                    </div>

                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Current Stage</p>
                      <p className="text-lg font-bold text-slate-100">{caseData.currentStage}</p>
                      <p className="text-xs text-emerald-400 font-medium">Order sheet signed</p>
                    </div>

                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Court &amp; Bench</p>
                      <p className="text-xs font-semibold text-slate-200">{caseData.courtName}</p>
                      <p className="text-[11px] text-slate-400">{caseData.judgeBench}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Advocate Case Notes</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Statements of both parties have been successfully recorded by the Principal Judge. First motion order certified copy has been uploaded to your document vault. Please keep original ID proofs ready for the second motion filing scheduled for August 28.
                    </p>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <h4 className="text-base font-serif text-white">Case Document Vault</h4>
                    <span className="text-xs text-slate-400">Official Orders &amp; Judgments Uploaded by Advocate Bhavni</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {caseData.documents.map((doc, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-[#1e293b] text-[#c5a059] border border-slate-700">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-100">{doc.title}</p>
                            <p className="text-[11px] text-slate-400">{doc.date} &bull; {doc.size}</p>
                          </div>
                        </div>

                        <a
                          href={doc.url && doc.url !== '#' ? doc.url : caseData.highCourtOrderUrl || 'https://www.allahabadhighcourt.in/jo.htm'}
                          download={doc.title}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-slate-800 hover:bg-[#c5a059] text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                          aria-label="Download Document"
                        >
                          <Download className="w-4 h-4 text-[#c5a059]" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hearing History Tab */}
              {activeTab === 'hearings' && (
                <div className="space-y-4">
                  <h4 className="text-base font-serif text-white">Court Appearances &amp; Order Sheets</h4>
                  <div className="space-y-3">
                    {caseData.hearingsHistory.map((h, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#c5a059]">{h.date}</span>
                          <span className="text-xs font-semibold text-slate-300">{h.stage}</span>
                        </div>
                        <p className="text-xs text-slate-400">{h.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Tab */}
              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  <h4 className="text-base font-serif text-white">Professional Fee Statements</h4>
                  <div className="space-y-3">
                    {caseData.invoices.map((inv, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-100">{inv.invoiceNo}</p>
                          <p className="text-xs text-slate-400">Billed on {inv.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-base font-bold text-[#c5a059]">{inv.amount}</span>
                          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Chat Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <h4 className="text-base font-serif text-white">Privileged Legal Team Messaging</h4>
                  <div className="bg-slate-950 p-4 border border-slate-800 h-64 overflow-y-auto space-y-3">
                    {caseData.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.sender === 'Client' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3 text-xs sm:text-sm ${
                            msg.sender === 'Client'
                              ? 'bg-[#c5a059] text-white'
                              : 'bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <p className="font-semibold text-[10px] text-slate-300 mb-1">{msg.sender}</p>
                          <p>{msg.text}</p>
                          <p className="text-[9px] text-slate-300 text-right mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type confidential note to Advocate Bhavni Singh..."
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-[#c5a059]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
