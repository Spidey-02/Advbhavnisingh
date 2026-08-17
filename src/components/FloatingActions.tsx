import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, QrCode, X } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

interface FloatingActionsProps {
  onOpenAppointment: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenAppointment
}) => {
  const { firmDetails } = useFirmData();
  const [showQr, setShowQr] = useState(false);

  const cleanWaNumber = (firmDetails.whatsapp || firmDetails.phone).replace(/[^0-9]/g, '');
  const formattedWa = cleanWaNumber.length === 10 ? `91${cleanWaNumber}` : cleanWaNumber;
  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent('Hello Advocate Bhavni Singh, I need legal guidance.')}`;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* WhatsApp Chat Floating Pill */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md cursor-pointer group"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">WhatsApp Advocate</span>
        </a>

        {/* Book Appointment Pill */}
        <button
          onClick={onOpenAppointment}
          className="pointer-events-auto px-5 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
          aria-label="Book Appointment"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consultation</span>
        </button>

        {/* Direct Call Floating Button */}
        <a
          href={`tel:${firmDetails.phone}`}
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#1e293b] hover:bg-[#c5a059] text-white border-2 border-[#c5a059] flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer"
          aria-label={`Call Advocate Bhavni Singh at ${firmDetails.phone}`}
          title={`Call Advocate Bhavni Singh at ${firmDetails.phone}`}
        >
          <Phone className="w-5 h-5 text-[#c5a059] hover:text-white" />
        </a>

      </div>
    </>
  );
};
