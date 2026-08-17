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
      <div className="bg-[#1e293b] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
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

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('/home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#1e293b] flex items-center justify-center shrink-0 group-hover:bg-[#c5a059] transition-colors">
            <Scale className="w-5 h-5 text-[#c5a059] group-hover:text-white transition-colors" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-serif-heading tracking-tight text-[#1e293b] group-hover:text-[#c5a059] transition-colors uppercase">
              {firmDetails.name}
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#c5a059] uppercase truncate max-w-md">
              {firmDetails.tagline}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const isPortal = item.path === '/client-portal' || item.path === '/advocate-portal';
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? 'text-[#c5a059] border-b-2 border-[#c5a059]' 
                    : isPortal
                      ? 'text-[#1e293b] bg-slate-100 hover:bg-[#c5a059] hover:text-white px-2.5 py-1.5'
                      : 'text-slate-700 hover:text-[#c5a059]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAppointment}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            <span>Book Consultation</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#c5a059] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
