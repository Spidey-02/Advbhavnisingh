import React, { useState } from 'react';
import { Phone, Mail, Scale, Menu, X, Sparkles, ExternalLink, MessageSquare, QrCode } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAppointment: () => void;
  onOpenEnquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenAppointment,
  onOpenEnquiry
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const { firmDetails } = useFirmData();

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/expertise', label: 'Our Expertise' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Legal Insights' },
    { path: '/contactus', label: 'Contact Us' },
    { path: '/client-portal', label: 'Client Case Portal' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const cleanWaNumber = (firmDetails.whatsapp || firmDetails.phone).replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/91${cleanWaNumber.length === 10 ? cleanWaNumber : cleanWaNumber}?text=${encodeURIComponent('Hello Advocate Bhavni Singh, I need legal consultation.')}`;
  const mailtoUrl = `mailto:${firmDetails.email}?subject=${encodeURIComponent('Legal Consultation Request')}&body=${encodeURIComponent('Respected Advocate Bhavni Singh,\n\nI need legal advice regarding...')}`;

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-white border-b border-slate-200">
      {/* Top Contact & High Court Bar */}
      <div className="bg-[#1e293b] text-slate-300 text-xs py-2 px-4 sm:px-8 md:px-12 lg:px-16 border-b border-slate-700">
        <div className="max-w-[1600px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5">
            <a 
              href={`tel:${firmDetails.phone}`} 
              className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors"
              title="Click to call chambers"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="font-semibold">Chambers: {firmDetails.phone}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a 
              href={mailtoUrl} 
              className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors"
              title="Click to draft email to Advocate Bhavni Singh"
            >
              <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{firmDetails.email}</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>WhatsApp: {firmDetails.whatsapp}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1 text-[11px] text-[#c5a059] hover:underline cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>WhatsApp QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header Row */}
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-8 md:px-12 lg:px-16 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 border-b border-slate-100 overflow-hidden">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('/home')}
          className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group min-w-0 flex-1 overflow-hidden"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#1e293b] flex items-center justify-center shrink-0 group-hover:bg-[#c5a059] transition-colors shadow-md">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-[#c5a059] group-hover:text-white transition-colors" />
          </div>
          <div className="min-w-0 overflow-hidden pr-1">
            <h1 className="text-sm sm:text-xl md:text-2xl font-bold font-serif-heading tracking-tight text-[#1e293b] group-hover:text-[#c5a059] transition-colors uppercase leading-tight truncate">
              {firmDetails.name}
            </h1>
            <p className="text-[9.5px] sm:text-xs font-bold tracking-tight sm:tracking-wider text-[#c5a059] uppercase leading-tight line-clamp-2 sm:line-clamp-none break-words">
              {firmDetails.tagline}
            </p>
          </div>
        </div>

        {/* Action Buttons & Mobile Toggle (Guaranteed visible inside screen!) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Quick Mobile Call Button */}
          <a
            href={`tel:${firmDetails.phone}`}
            className="flex sm:hidden items-center justify-center p-2 bg-[#1e293b] hover:bg-[#2d3d54] text-[#c5a059] border border-[#c5a059]/40 rounded shadow-sm cursor-pointer"
            title={`Call Chambers: ${firmDetails.phone}`}
          >
            <Phone className="w-3.5 h-3.5" />
          </a>

          {/* Quick Mobile WhatsApp Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex sm:hidden items-center justify-center p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm cursor-pointer"
            title="WhatsApp Chat"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
          </a>

          {/* Desktop Book Consultation */}
          <button
            onClick={onOpenAppointment}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer border border-[#c5a059]/50"
          >
            <span>Book Consultation</span>
          </button>

          {/* Compact Mobile Book Button */}
          <button
            onClick={onOpenAppointment}
            className="flex sm:hidden items-center gap-1 px-2 py-1.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-[10px] uppercase rounded shadow-sm cursor-pointer border border-[#c5a059]/50 whitespace-nowrap"
          >
            <span>Book</span>
          </button>

          {/* Mobile Hamburger Sidebar Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-800 hover:text-[#c5a059] focus:outline-none shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Single-Line Desktop Main Navigation Bar */}
      <div className="hidden lg:block bg-slate-900 text-white border-b border-slate-800 shadow-inner">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const isPortal = item.path === '/client-portal' || item.path === '/advocate-portal';
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3.5 xl:px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-[#c5a059] text-white shadow-md' 
                    : isPortal
                      ? 'text-[#c5a059] hover:bg-slate-800 hover:text-white font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-[#c5a059]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider ${
                  currentPath === item.path ? 'bg-[#c5a059] text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <a
                href={`tel:${firmDetails.phone}`}
                className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Chambers: {firmDetails.phone}</span>
              </a>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAppointment(); }}
                className="w-full py-2.5 bg-[#c5a059] text-white text-xs font-bold uppercase tracking-wider text-center"
              >
                Book Legal Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white p-6 shadow-2xl border-t-4 border-emerald-600 space-y-4 text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">Direct Chamber QR Connect</span>
            <h3 className="text-xl font-serif text-[#1e293b]">Advocate Bhavni WhatsApp</h3>
            
            <div className="p-3 bg-slate-50 border inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(waUrl)}`}
                alt="WhatsApp QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-xs text-slate-500">Scan QR Code using phone camera or click button below to start chat.</p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Start WhatsApp Chat Now</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
