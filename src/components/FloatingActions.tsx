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
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-3 max-w-[calc(100vw-1.5rem)] pointer-events-none">
      
      {/* WhatsApp Chat Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer border border-emerald-500/30 rounded-none shrink-0"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-4 h-4 fill-white shrink-0" />
        <span>WhatsApp Advocate</span>
      </a>

      {/* Book Appointment Floating Button */}
      <button
        onClick={onOpenAppointment}
        className="pointer-events-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-[#c5a059] hover:bg-[#a88442] text-white shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#c5a059]/40 rounded-none shrink-0"
        aria-label="Book Appointment"
      >
        <Calendar className="w-4 h-4 shrink-0" />
        <span>Book Consultation</span>
      </button>

      {/* Direct Call Floating Button */}
      <a
        href={`tel:${firmDetails.phone}`}
        className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1e293b] hover:bg-[#c5a059] text-white border-2 border-[#c5a059] flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer shrink-0"
        aria-label={`Call Advocate Bhavni Singh at ${firmDetails.phone}`}
        title={`Call Advocate Bhavni Singh at ${firmDetails.phone}`}
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#c5a059] hover:text-white" />
      </a>

    </div>
  );
};
