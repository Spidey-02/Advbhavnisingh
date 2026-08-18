// Centralized Helper for WhatsApp URLs with 0% Double-91 bug Guarantee

export const formatWhatsAppNumber = (rawNumber: string): string => {
  if (!rawNumber) return '919415211990';
  const digits = rawNumber.replace(/\D/g, ''); // Strip all non-numeric characters
  
  // If 10 digits (e.g. 9415211990), prepend 91 -> 919415211990
  if (digits.length === 10) {
    return `91${digits}`;
  }
  
  // If 12 digits and already starts with 91 (e.g. 919415211990), keep as is!
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  
  // If more than 10 digits ending in 10 digits (e.g. +91 9415211990 or 09415211990)
  if (digits.length > 10) {
    const last10 = digits.slice(-10);
    return `91${last10}`;
  }

  return `91${digits}`;
};

export const getWhatsAppUrl = (phoneOrWa: string, customMessage?: string): string => {
  const cleanNum = formatWhatsAppNumber(phoneOrWa);
  const defaultMsg = 'Hello Advocate Bhavni Singh, I need legal consultation.';
  const msg = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${cleanNum}?text=${msg}`;
};
