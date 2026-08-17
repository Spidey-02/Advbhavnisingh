import React, { useState } from 'react';
import { LocationsMapSection } from '../components/LocationsMapSection';
import { WhatsAppConnectWidget } from '../components/WhatsAppConnectWidget';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, Scale, ExternalLink, QrCode, MessageSquare } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

export const ContactPage: React.FC = () => {
  const { firmDetails, officeLocations } = useFirmData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    caseType: 'Writ Petition (Article 226/227)',
    court: 'Allahabad High Court (Prayagraj Main Bench)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const existingQueries = JSON.parse(localStorage.getItem('bhavani_enquiries') || '[]');
    const newQuery = {
      id: 'ENQ-' + Date.now().toString().slice(-4),
      clientName: formData.name,
      phone: formData.phone,
      email: formData.email,
      caseType: formData.caseType,
      courtName: formData.court,
      message: formData.message,
      submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'New'
    };
    localStorage.setItem('bhavni_enquiries', JSON.stringify([newQuery, ...existingQueries]));
  };

  const cleanWaNumber = (firmDetails.whatsapp || firmDetails.phone).replace(/[^0-9]/g, '');
  const formattedWa = cleanWaNumber.length === 10 ? `91${cleanWaNumber}` : cleanWaNumber;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Hello Advocate Bhavni Singh, I need legal consultation.')}`;

  const emailSubject = encodeURIComponent("Legal Consultation Request — High Court Chambers");
  const emailBody = encodeURIComponent(
    `Respected Advocate Bhavni Singh,\n\nI wish to request a legal consultation regarding my matter.\n\nName:\nPhone:\nCase Type:\nBrief Details:\n\nThank you.`
  );
  const mailtoUrl = `mailto:${firmDetails.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block">Chambers Contact &amp; Legal Consultations</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">Contact {firmDetails.name}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Schedule a legal consultation, submit an online case enquiry, or visit our chambers in Prayagraj (High Court, Lower Courts, &amp; Revenue Courts).
          </p>
        </div>

        {/* WhatsApp & Instant Connect Bar */}
        <WhatsAppConnectWidget />

        {/* Grid: Form & Direct Chamber Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Direct Case Query Submission</span>
              <h2 className="text-2xl font-serif text-[#1e293b]">Send Legal Enquiry to Advocate Bhavni Singh</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your enquiry is transmitted securely to Advocate Bhavni Singh&apos;s personal dashboard.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif text-emerald-900">Enquiry Received Successfully!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry regarding <strong>{formData.caseType}</strong> at <strong>{formData.court}</strong> has been received by {firmDetails.founderName}. Our chamber associate will contact you at <strong>{formData.phone}</strong> shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', email: '', caseType: 'Writ Petition (Article 226/227)', court: 'Allahabad High Court (Prayagraj Main Bench)', message: '' }); }}
                  className="px-6 py-2.5 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9415211990"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="rajesh@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Legal Jurisdiction *</label>
                    <select
                      value={formData.court}
                      onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                    >
                      <option value="Allahabad High Court (Prayagraj)">Allahabad High Court (Prayagraj)</option>
                      <option value="District & Sessions Court (Prayagraj Lower Court)">District &amp; Sessions Court (Prayagraj Lower Court)</option>
                      <option value="Board of Revenue & Revenue Courts (Prayagraj)">Board of Revenue &amp; Revenue Courts (Prayagraj)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Case Category *</label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                  >
                    <option value="Writ Petition (Article 226/227)">Writ Petition (Article 226/227)</option>
                    <option value="Anticipatory & Regular Bail">Anticipatory &amp; Regular Bail</option>
                    <option value="Section 482 CrPC/BNSS Quashing">Section 482 CrPC/BNSS FIR Quashing</option>
                    <option value="UP Revenue & Land Disputes">UP Revenue &amp; Land Disputes</option>
                    <option value="Service & Government Job Dispute">Service &amp; Government Job Dispute</option>
                    <option value="Matrimonial & Divorce Appeal">Matrimonial &amp; Divorce Appeal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Describe Your Case / Legal Query *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide brief details including FIR number, police station, district, or High Court order details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Case Enquiry to Chambers</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct Chamber Information Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#1e293b] text-white p-6 sm:p-8 border-t-4 border-[#c5a059] shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">Direct Contact Information</span>
                <h3 className="text-2xl font-serif text-white mt-1">Allahabad High Court Chambers</h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <a href={`tel:${firmDetails.phone}`} className="flex items-start gap-3 p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors block">
                  <Phone className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white uppercase text-[10px] tracking-wider">Chamber Mobile (Click to Call):</strong>
                    <span className="text-sm font-bold text-[#c5a059]">{firmDetails.phone}</span>
                  </div>
                </a>

                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors block">
                  <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-400 uppercase text-[10px] tracking-wider">WhatsApp Direct (Click to Chat):</strong>
                    <span className="text-xs font-bold text-emerald-300">{firmDetails.whatsapp}</span>
                  </div>
                </a>

                <a href={mailtoUrl} className="flex items-start gap-3 p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors block">
                  <Mail className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white uppercase text-[10px] tracking-wider">Official Email (Click to Draft):</strong>
                    <span className="text-xs text-slate-200">{firmDetails.email}</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 bg-slate-800/80 border border-slate-700">
                  <Clock className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white uppercase text-[10px] tracking-wider">Chamber Hours:</strong>
                    <span>{firmDetails.officeHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/80 border border-slate-700">
                  <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white uppercase text-[10px] tracking-wider">Prayagraj Main Chamber:</strong>
                    <span>{firmDetails.mainAddress}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(firmDetails.mainAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* High Court Official Links */}
            <div className="bg-white p-6 border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-[#1e293b] uppercase tracking-wider block border-b pb-2">
                Official Court Portals
              </span>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href={firmDetails.highCourtOfficialPortal} target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a059] flex items-center justify-between">
                    <span>Allahabad High Court Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
                  </a>
                </li>
                <li>
                  <a href={firmDetails.highCourtCaseStatusPortal} target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a059] flex items-center justify-between">
                    <span>High Court Case Status &amp; Daily Cause List</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
                  </a>
                </li>
                <li>
                  <a href={firmDetails.highCourtJudgmentsPortal} target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a059] flex items-center justify-between">
                    <span>Certified Judgments &amp; Order Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Chambers Locations & Google Maps */}
        <LocationsMapSection />

      </div>
    </div>
  );
};
