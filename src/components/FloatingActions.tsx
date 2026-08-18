import React from 'react';
import { Phone, Calendar, MessageSquare } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

interface FloatingActionsProps {
  onOpenAppointment: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenAppointment
}) => {
  const { firmDetails } = useFirmData();

  const cleanWaNumber = (firmDetails.whatsapp || firmDetails.phone).replace(/[^0-9]/g, '');
  const formattedWa = cleanWaNumber.length === 10 ? `91${cleanWaNumber}` : cleanWaNumber;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Hello Advocate Bhavni Singh, I need legal guidance.')}`;

  return (
    <>
      {/* Mobile Fixed Bottom Action Bar (100% Fitted inside Mobile Screen) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1e293b] border-t-2 border-[#c5a059] shadow-2xl flex items-center justify-around py-2 px-2 text-white">
        {/* Call Now */}
        <a
          href={`tel:${firmDetails.phone}`}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-slate-200 hover:text-[#c5a059] transition-colors border-r border-slate-700 cursor-pointer"
          aria-label={`Call Chambers at ${firmDetails.phone}`}
        >
          <Phone className="w-4 h-4 text-[#c5a059]" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Call Now</span>
        </a>

        {/* WhatsApp Chat */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-emerald-400 hover:text-emerald-300 transition-colors border-r border-slate-700 cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-tight">WhatsApp</span>
        </a>

        {/* Book Consultation */}
        <button
          onClick={onOpenAppointment}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-[#c5a059] hover:text-white transition-colors cursor-pointer"
          aria-label="Book Consultation"
        >
          <Calendar className="w-4 h-4 text-[#c5a059]" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Book</span>
        </button>
      </div>

      {/* Desktop Floating Actions Stack */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3 pointer-events-none">
        {/* WhatsApp Chat Floating Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer border border-emerald-500/30 shrink-0"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white shrink-0" />
          <span>WhatsApp Advocate</span>
        </a>

        {/* Book Appointment Floating Button */}
        <button
          onClick={onOpenAppointment}
          className="pointer-events-auto px-5 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#c5a059]/40 shrink-0"
          aria-label="Book Appointment"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Book Consultation</span>
        </button>

        {/* Direct Call Floating Button */}
        <a
          href={`tel:${firmDetails.phone}`}
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#1e293b] hover:bg-[#c5a059] text-white border-2 border-[#c5a059] flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer shrink-0"
          aria-label={`Call Advocate Bhavni Singh at ${firmDetails.phone}`}
          title={`Call Advocate Bhavni Singh at ${firmDetails.phone}`}
        >
          <Phone className="w-5 h-5 text-[#c5a059] hover:text-white" />
        </a>
      </div>
    </>
  );
};
