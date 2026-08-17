import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Award, Users, Smile, ShieldCheck, Scale, Sparkles, Building, MapPin } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

interface HeroProps {
  onExploreServices: () => void;
  onBookAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreServices,
  onBookAppointment
}) => {
  const { firmDetails, heroSlides } = useFirmData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = heroSlides && heroSlides.length > 0 ? heroSlides : [];

  // Auto slide effect every 4.5 seconds
  useEffect(() => {
    if (activeSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const current = activeSlides[currentSlide] || {
    title: "Advocate Bhavni Singh & Associates",
    subtitle: "Precision in Law, Excellence in Execution — Allahabad High Court Chambers",
    tag: "",
    image: ""
  };

  return (
    <section className="relative bg-[#0f172a] text-white overflow-hidden min-h-[550px] sm:min-h-[620px] flex flex-col justify-between">
      
      {/* Background Court Image Auto-Slider Carousel */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-85 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } bg-cover bg-center filter brightness-95 contrast-105 transition-transform duration-1000`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
      ))}

      {/* Refined Court Backdrop Overlay - Keeps Architecture Vividly Visible while Text is Ultra Legible */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1329]/80 via-[#0f172a]/65 to-[#0b1329]/90" />
      <div className="absolute inset-0 z-0 bg-radial from-transparent via-[#0f172a]/40 to-[#0b1329]/80" />

      {/* Main Hero Banner Content - Dynamic Full-Width Container */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-12 sm:pt-16 pb-16 sm:pb-20 flex flex-col items-center text-center">
        
        {/* Top Active Member Badge & Optional Court Badge Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 border border-[#c5a059]/60 text-[#c5a059] text-xs font-bold tracking-widest uppercase shadow-xl backdrop-blur-md hover:border-[#c5a059] transition-all">
            <Scale className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>{firmDetails.barMemberships}</span>
          </div>

          {/* Show court tag badge ONLY if tag is specified (Slide 2, 3, 4) */}
          {current.tag && (
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#1e293b]/90 border border-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Building className="w-4 h-4 text-[#c5a059] shrink-0" />
              <span className="text-[#c5a059] font-bold">{current.tag}:</span>
              <span className="hidden sm:inline">{current.title}</span>
            </div>
          )}
        </div>

        {/* Court Slide Subtitle */}
        <div className="text-[#c5a059] font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 flex items-center gap-2 bg-[#1e293b]/60 px-4 py-1.5 border border-[#c5a059]/30 rounded-full backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{current.subtitle}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.12] text-white max-w-5xl mb-6 tracking-tight drop-shadow-md">
          Precision in Law,<br className="hidden sm:inline" /> Excellence in Execution.
        </h1>

        {/* Supporting Copy */}
        <p className="text-slate-200 text-sm sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-8 drop-shadow-sm font-light">
          Dedicated litigation, constitutional writs, bail petitions, lower court trial advocacy, and revenue disputes before the Hon&apos;ble High Court of Judicature at Allahabad, District &amp; Sessions Court (Prayagraj), and Board of Revenue Courts (Prayagraj).
        </p>

        {/* CTA Button Group with 3D Floating Effect */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-widest shadow-2xl hover:shadow-[#c5a059]/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-[#c5a059]/40 group"
          >
            <span>Schedule Consultation</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onBookAppointment}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-[#1e293b] border border-white/60 hover:border-[#c5a059] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            View Case Studies
          </button>
        </div>

        {/* Interactive Court Image Auto-Slider Indicators */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 hover:border-[#c5a059] text-white hover:text-[#c5a059] transition-all cursor-pointer"
            aria-label="Previous Court Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id || idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 h-2.5 bg-[#c5a059] shadow-md shadow-[#c5a059]/50'
                    : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                }`}
                title={slide.title}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 hover:border-[#c5a059] text-white hover:text-[#c5a059] transition-all cursor-pointer"
            aria-label="Next Court Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Banner Stats Ribbon - Floating 3D Card Style with Expanded Width */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md text-[#1e293b] border-t border-b border-slate-200 py-6 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1600px] w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b] font-bold">
                {firmDetails.stats.leadingSince}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Practicing Active</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b] font-bold">
                {firmDetails.stats.experiencedAttorneys}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Associate Team</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="w-5 h-5 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b] font-bold">
                {firmDetails.stats.happyClients}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Litigants Assisted</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
              <span className="text-2xl sm:text-3xl font-serif text-[#1e293b] font-bold">
                {firmDetails.stats.successRatio}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Court Success</p>
          </div>

        </div>
      </div>
    </section>
  );
};
