import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';
import { useFirmData } from '../hooks/useFirmData';

export const LocationsMapSection: React.FC = () => {
  const { officeLocations, firmDetails } = useFirmData();
  const [selectedOffice, setSelectedOffice] = useState(officeLocations[0] || {
    id: 'main',
    name: firmDetails.name,
    type: 'Head Office',
    address: firmDetails.mainAddress,
    landmark: 'High Court Compound',
    phone: firmDetails.phone,
    email: firmDetails.email,
    hours: firmDetails.officeHours,
    mapEmbedUrl: `https://maps.google.com/?q=${encodeURIComponent(firmDetails.mainAddress)}`
  });

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] block mb-2">Multiple Chamber Locations &amp; Maps</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1e293b] mb-3">
            Visit Our Chambers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Advocate Bhavani Singh maintains strategic chambers at the Allahabad High Court, District &amp; Lower Courts, and Board of Revenue Courts in Prayagraj.
          </p>
        </div>

        {/* Location Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {officeLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedOffice(loc)}
              className={`p-4 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                selectedOffice.id === loc.id
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-[#c5a059]'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider ${
                  selectedOffice.id === loc.id ? 'bg-[#c5a059] text-white' : 'bg-slate-100 text-[#1e293b]'
                }`}>
                  {loc.type}
                </span>
                <h3 className="text-base font-serif mt-2 mb-1">{loc.name}</h3>
                <p className={`text-xs line-clamp-2 ${selectedOffice.id === loc.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {loc.address}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/30 text-[11px] font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Select Office</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Office Details & Embedded Map */}
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Details Column */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">{selectedOffice.type}</span>
              <h3 className="text-2xl font-serif text-[#1e293b] mb-4">{selectedOffice.name}</h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1e293b] text-xs uppercase font-bold tracking-wider">Address:</strong>
                    <span>{selectedOffice.address}</span>
                    <p className="text-xs text-slate-400 italic mt-0.5">Landmark: {selectedOffice.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1e293b] text-xs uppercase font-bold tracking-wider">Chamber Mob:</strong>
                    <a href={`tel:${selectedOffice.phone}`} className="hover:text-[#c5a059] font-medium">{selectedOffice.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1e293b] text-xs uppercase font-bold tracking-wider">Official Email:</strong>
                    <a href={`mailto:${selectedOffice.email}`} className="hover:text-[#c5a059] font-medium">{selectedOffice.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1e293b] text-xs uppercase font-bold tracking-wider">Working Hours:</strong>
                    <span>{selectedOffice.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <a
                href={selectedOffice.mapEmbedUrl.startsWith('http') ? selectedOffice.mapEmbedUrl : `https://maps.google.com/?q=${encodeURIComponent(selectedOffice.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Open Directions in Google Maps
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-7 bg-slate-200 min-h-[350px] relative">
            <iframe
              title={`Map for ${selectedOffice.name}`}
              src={selectedOffice.mapEmbedUrl.includes('embed') 
                ? selectedOffice.mapEmbedUrl 
                : `https://maps.google.com/maps?q=${encodeURIComponent(selectedOffice.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[380px] border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

        </div>

      </div>
    </section>
  );
};
