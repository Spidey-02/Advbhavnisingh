import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin, QrCode, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface WhatsAppConnectWidgetProps {
  compact?: boolean;
}

export const WhatsAppConnectWidget: React.FC<WhatsAppConnectWidgetProps> = ({ compact = false }) => {
  const { firmDetails, officeLocations } = useFirmData();
  const [copied, setCopied] = useState(false);

  const whatsappUrl = getWhatsAppUrl(
    firmDetails.whatsapp || firmDetails.phone,
    'Hello Advocate Bhavni Singh, I need legal consultation regarding an Allahabad High Court matter.'
  );

  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(whatsappUrl)}&color=1e293b&bgcolor=ffffff`;

  const emailSubject = encodeURIComponent("Legal Consultation Request — Allahabad High Court Chambers");
  const emailBody = encodeURIComponent(
    `Respected Advocate Bhavni Singh,\n\nI am reaching out regarding a legal consultation/representation.\n\nMy Details:\n- Name: \n- Phone: \n- District / City: \n- Matter / Case Type (Writ / Bail / Revenue / Civil / Family / Service): \n\nBrief Summary:\n\nThank you.`
  );
  const mailtoUrl = `mailto:${firmDetails.email}?subject=${emailSubject}&body=${emailBody}`;

  const primaryChamber = officeLocations[0] || {
    address: firmDetails.mainAddress,
    gmapEmbedUrl: `https://maps.google.com/?q=${encodeURIComponent(firmDetails.mainAddress)}`
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(firmDetails.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className="bg-[#1e293b] p-4 text-white border-l-4 border-[#c5a059] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" /> Instant Scan &amp; Chat
          </span>
          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 uppercase">Online</span>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={qrCodeImgUrl}
            alt="WhatsApp QR Code Advocate Bhavni Singh"
            className="w-20 h-20 bg-white p-1 border border-slate-700 shrink-0"
          />
          <div className="space-y-1 text-xs">
            <p className="font-serif text-white font-bold">Direct Scan to WhatsApp</p>
            <p className="text-[11px] text-slate-300">Scan QR Code with phone camera to start direct chat with Advocate Bhavni Singh.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline pt-1"
            >
              <span>Click to Chat Directly</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            Direct Connect &amp; Instant Action Portal
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-white mt-1">
            Connect with Advocate Bhavni Singh
          </h3>
          <p className="text-xs text-slate-400">
            Scan WhatsApp QR Code or click direct call &amp; drafted email triggers for instant legal response.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Chambers Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* QR Code Card Column */}
        <div className="md:col-span-5 bg-white text-slate-900 p-5 border border-slate-200 text-center space-y-3 shadow-md">
          <div className="inline-block p-2 bg-slate-50 border border-slate-200">
            <img
              src={qrCodeImgUrl}
              alt="Advocate Bhavni Singh WhatsApp QR Code"
              className="w-40 h-40 mx-auto object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1e293b]">
              Scan QR Code with Mobile Camera
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instantly opens WhatsApp chat with Advocate Bhavni Singh
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Chat Directly</span>
          </a>
        </div>

        {/* Quick Click Triggers Column */}
        <div className="md:col-span-7 space-y-3.5">
          
          {/* Phone Trigger */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700 hover:border-[#c5a059] transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone Call (Opens Dial Pad)</span>
                <p className="text-sm font-bold text-white tracking-wide">{firmDetails.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPhone}
                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <a
                href={`tel:${firmDetails.phone}`}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Email Trigger with Pre-drafted Template */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700 hover:border-[#c5a059] transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-none bg-[#c5a059] text-white flex items-center justify-center shrink-0 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Email (Auto Drafted Template)</span>
                <p className="text-xs font-bold text-slate-200 truncate">{firmDetails.email}</p>
              </div>
            </div>

            <a
              href={mailtoUrl}
              className="px-3.5 py-2 bg-[#c5a059] hover:bg-[#a88442] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Draft Email</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Google Maps Directions Trigger */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700 hover:border-[#c5a059] transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-none bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Chambers Directions</span>
                <p className="text-xs font-semibold text-slate-300 truncate">{firmDetails.mainAddress}</p>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(firmDetails.mainAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Map Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
