import React from 'react';
import { Scale, Phone, Mail, MapPin, ExternalLink, MessageSquare, QrCode, Lock } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenDisclaimer: () => void;
  onOpenAppointment: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenDisclaimer,
  onOpenAppointment
}) => {
  const { firmDetails, officeLocations } = useFirmData();

  const cleanWaNumber = (firmDetails.whatsapp || firmDetails.phone).replace(/[^0-9]/g, '');
  const formattedWa = cleanWaNumber.length === 10 ? `91${cleanWaNumber}` : cleanWaNumber;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Hello Advocate Bhavni Singh, I need legal guidance.')}`;
  const mailtoUrl = `mailto:${firmDetails.email}?subject=${encodeURIComponent('High Court Legal Consultation')}&body=${encodeURIComponent('Respected Advocate Bhavni Singh,\n\nI wish to consult regarding...')}`;

  return (
    <footer className="bg-[#1e293b] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border border-[#c5a059] flex items-center justify-center bg-[#1e293b] text-[#c5a059] shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif text-white tracking-wider uppercase">
                  {firmDetails.name}
                </h3>
                <p className="text-[10px] font-semibold tracking-widest text-[#c5a059] uppercase">
                  {firmDetails.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated litigation advocacy before the Allahabad High Court, District &amp; Lower Courts, and Board of Revenue Courts (Prayagraj).
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a 
                href={firmDetails.highCourtOfficialPortal} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-slate-800 hover:bg-[#c5a059] text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                <span>Allahabad High Court Live Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  About Chambers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('expertise')} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  High Court Expertise
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('case-studies')} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  Case Studies &amp; Orders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  Legal Insights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('client-portal')} className="hover:text-[#c5a059] font-bold text-[#c5a059] transition-colors cursor-pointer">
                  Client Case Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Chambers & Contact Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
              Contact Chambers
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a href={`tel:${firmDetails.phone}`} className="flex items-start gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>Call Chambers: {firmDetails.phone}</span>
              </a>

              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-emerald-400 text-emerald-400 font-bold transition-colors">
                <MessageSquare className="w-4 h-4 fill-emerald-400 shrink-0 mt-0.5" />
                <span>WhatsApp: {firmDetails.whatsapp}</span>
              </a>

              <a href={mailtoUrl} className="flex items-start gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="break-all">{firmDetails.email}</span>
              </a>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>{firmDetails.mainAddress}</span>
              </div>
            </div>
          </div>

          {/* Direct Scan QR Code Column */}
          <div className="lg:col-span-3 space-y-3 bg-slate-900/80 p-4 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase text-[#c5a059] tracking-widest flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5" /> WhatsApp QR Code
            </span>
            <p className="text-[11px] text-slate-400">Scan to chat directly with Advocate Bhavni Singh</p>
            <div className="p-2 bg-white inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(waUrl)}`}
                alt="Advocate Bhavni Singh QR"
                className="w-28 h-28 mx-auto"
              />
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-wider transition-colors"
            >
              Start WhatsApp Chat
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {firmDetails.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenDisclaimer} className="hover:text-slate-300 underline cursor-pointer">
              BCI Disclaimer &amp; Terms
            </button>
            <span>&bull;</span>
            <button onClick={() => onNavigate('advocate-portal')} className="flex items-center gap-1 text-slate-600 hover:text-[#c5a059] text-[11px] font-mono cursor-pointer transition-colors" title="Advocate Bhavni Singh - Confidential Chamber Portal">
              <Lock className="w-3 h-3 text-slate-500" /> Chamber Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
