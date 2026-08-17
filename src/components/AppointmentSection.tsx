import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { PRACTICE_AREAS } from '../data/legalData';

interface AppointmentSectionProps {
  preselectedPracticeArea?: string;
  onAppointmentSuccess?: () => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  preselectedPracticeArea
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    practiceArea: preselectedPracticeArea || 'Divorce Lawyer',
    mode: 'In-Person (Office)' as 'In-Person (Office)' | 'Virtual Video Call' | 'Urgent Phone Consultation',
    date: '2026-08-12',
    timeSlot: '11:00 AM - 12:00 PM',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="appointment-section" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
                  Schedule Confidential Consultation
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 font-medium border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Client Privileged
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif text-[#1e293b] mb-6">
                Book An Appointment
              </h2>

              {submitted ? (
                <div className="p-8 bg-slate-50 border border-slate-200 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-[#1e293b] text-[#c5a059] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#1e293b]">
                    Consultation Requested!
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Thank you <strong>{formData.name}</strong>. Your consultation request for <strong>{formData.practiceArea}</strong> on <strong>{formData.date} at {formData.timeSlot}</strong> ({formData.mode}) has been routed to Advocate Bhavni Singh&apos;s chamber desk. Our office manager will call you at <strong>{formData.phone}</strong> shortly to confirm.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          subject: '',
                          practiceArea: 'Divorce Lawyer',
                          mode: 'In-Person (Office)',
                          date: '2026-08-12',
                          timeSlot: '11:00 AM - 12:00 PM',
                          message: ''
                        });
                      }}
                      className="px-6 py-3 bg-[#c5a059] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#a88442] transition-colors"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Practice Area & Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Practice Area
                      </label>
                      <select
                        value={formData.practiceArea}
                        onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white text-slate-800"
                      >
                        {PRACTICE_AREAS.map((area) => (
                          <option key={area.id} value={area.title}>
                            {area.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Consultation Mode
                      </label>
                      <select
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white text-slate-800"
                      >
                        <option value="In-Person (Office)">In-Person (Prayagraj Chambers)</option>
                        <option value="Virtual Video Call">Virtual Video Call (Google Meet)</option>
                        <option value="Urgent Phone Consultation">Urgent Phone Consultation</option>
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white text-slate-800"
                      >
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                        <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Query / Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Request Call'}
                      <Send className="w-4 h-4 text-[#c5a059]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full h-full min-h-[400px] border border-slate-200 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                alt="Law Firm Office Gavel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/50 to-transparent p-8 flex flex-col justify-end text-white border-t-2 border-[#c5a059]">
                <p className="text-2xl font-serif text-[#c5a059]">Bhavni Singh &amp; Associates</p>
                <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase mt-1">High Court, Lower Courts &amp; Revenue Courts Chambers &bull; Prayagraj</p>
                <p className="text-xs text-slate-400 mt-2">Direct Mob: +91 9415211990 | Email: chambers.bhavanisingh@gmail.com</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
