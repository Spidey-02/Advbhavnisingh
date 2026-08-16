import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, Mail } from 'lucide-react';
import { FIRM_DETAILS } from '../data/legalData';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white shadow-2xl p-6 sm:p-8 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-1">Quick Contact</span>
          <h3 className="text-2xl font-serif text-[#1e293b]">Enquiry Now</h3>
          <p className="text-xs text-slate-500 mt-1">Send a direct message to Bhavani Singh &amp; Associates chambers.</p>
        </div>

        {submitted ? (
          <div className="p-8 bg-slate-50 border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#c5a059] mx-auto" />
            <h4 className="text-xl font-serif text-[#1e293b]">Enquiry Received</h4>
            <p className="text-xs text-slate-600">Our senior legal consultant will contact you at {formData.phone} shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Description of Legal Matter *</label>
              <textarea
                rows={3}
                required
                placeholder="Mention your query..."
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Quick Enquiry
            </button>

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-4 border-t border-slate-200">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#c5a059]" /> {FIRM_DETAILS.phone}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#c5a059]" /> {FIRM_DETAILS.email}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
