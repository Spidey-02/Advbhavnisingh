import React from 'react';
import { Scale, ShieldAlert, Check, X } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onAccept, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1e293b] text-[#c5a059] border border-[#c5a059]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-[#1e293b]">Disclaimer</h2>
              <p className="text-xs text-[#c5a059] uppercase tracking-widest font-semibold">Bar Council of India Regulations</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close disclaimer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <span>
              <strong>The Bar Council of India prohibits the developing of the website for the advertisement by an Advocate.</strong>
            </span>
          </div>

          <p className="font-semibold text-[#1e293b]">
            By clicking &quot;I Agree&quot; below, the user acknowledges the following:
          </p>

          <p>
            This website is meant only for information purposes and not for any advertisement, personal communication, invitation or inducement of any sort from us or any of our members to solicit or advert any work through this website.
          </p>

          <p>
            If you wish to get more information about us or would like to get in touch with <strong>Bhavni Singh &amp; Associates</strong>, you may contact us on our registered email address: <a href="mailto:chambers.bhavnisingh@gmail.com" className="text-[#c5a059] underline font-medium">chambers.bhavnisingh@gmail.com</a>.
          </p>

          <div className="space-y-2.5 pt-2">
            <p className="font-semibold text-[#1e293b]">
              As per the rules of the Bar Council of India, Advocates are not permitted to solicit or advertise their work. By clicking on &quot;I Agree&quot; below, the user (you) acknowledges the following:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#c5a059] text-slate-600">
              <li>There exists no any sort of advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from us or any of our members and we are not soliciting any work through this website.</li>
              <li>The user deliberates and wishes to get more information about us for his/her own information, use and voluntary will.</li>
              <li>The information, if any, that may be provided to the user by us would have been provided upon user&apos;s specific request and any such information obtained, retained or downloaded from this website is absolutely the act of volition of the user and any transmission, receipt or use of information or links to this site would not create any lawyer-client relationship.</li>
            </ul>
          </div>

          <p className="text-slate-500 text-xs italic bg-slate-50 p-3 border border-slate-200">
            The information provided under this website is only available at your request for informational purposes rigidly, and should not be interpreted as soliciting or advertisement in any manner. We are neither privy nor responsible or liable for any consequence of any action taken by the user relying upon our material/information provided under this website. In case the user has any legal issues, the user must seek independent legal advice.
            <br /><br />
            <strong>Note:</strong> Access will only be granted once you confirm you have read and agree to the above.
          </p>
        </div>

        {/* Footer / Accept Button */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center sm:justify-end">
          <button
            onClick={onAccept}
            className="w-full sm:w-auto px-8 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Check className="w-5 h-5" />
            I agree
          </button>
        </div>

      </div>
    </div>
  );
};
