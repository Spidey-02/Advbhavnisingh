import React from 'react';

export const WayWeWork: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: "Consultation with Confidentiality",
      desc: "We discuss your case and consult you with the latest laws ensuring your privacy and confidentiality as our pivotal aspect."
    },
    {
      num: 2,
      title: "Case Evaluation and Strategy Making",
      desc: "Our team analyzes your case from every corner and customizes a tailored strategy to maximize success."
    },
    {
      num: 3,
      title: "Time Bound Strong Representation",
      desc: "We vehemently advocate for your rights and provide well-timed services without any delay, making timed services our main essence."
    },
    {
      num: 4,
      title: "Resolution & Support",
      desc: "We achieve the best outcome and provide ongoing assistance throughout the legal journey and thereafter."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Title */}
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-1">Our Process</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1e293b]">
            The Way We Work
          </h2>
        </div>

        {/* 4 Steps Process Timeline */}
        <div className="relative">
          {/* Horizontal Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-300 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-start bg-white p-6 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200 hover:border-[#c5a059]">
                {/* Number Box */}
                <div className="w-12 h-12 bg-[#1e293b] text-[#c5a059] font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-sm border-b-2 border-[#c5a059] shrink-0">
                  0{step.num}
                </div>

                <h3 className="text-base font-serif text-[#1e293b] mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
