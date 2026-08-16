export type NavSection = 
  | 'home' 
  | 'about' 
  | 'expertise' 
  | 'case-studies' 
  | 'services' 
  | 'blog' 
  | 'client-portal' 
  | 'advocate-portal' 
  | 'contact';

export interface PracticeArea {
  id: string;
  title: string;
  shortDesc: string;
  category: 'family' | 'criminal' | 'civil' | 'corporate' | 'tribunal' | 'writ';
  fullDetails: string;
  keyServices: string[];
  subServices?: string[];
  imageUrl: string;
  badge?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  practiceArea: string;
  court: string;
  year: string;
  summary: string;
  challenge: string;
  strategy: string;
  verdictOutcome: string;
  outcome?: string;
  impact: string;
  category: 'family' | 'criminal' | 'civil' | 'corporate' | 'tribunal' | 'writ';
  clientAnonymized: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl: string;
  image?: string;
  excerpt: string;
  fullArticle: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  location: string;
  caseType: string;
  comment: string;
}

export interface AppointmentBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  practiceArea: string;
  date: string;
  timeSlot: string;
  mode: 'In-Person (Prayagraj Office)' | 'In-Person (High Court Chamber)' | 'Virtual Video Call' | 'Urgent Phone Consultation';
  message: string;
  status: 'Confirmed' | 'Pending Review' | 'Completed';
  createdAt: string;
}

export interface OfficeLocation {
  id: string;
  name: string;
  type: string;
  address: string;
  landmark: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  gmapEmbedUrl?: string;
}

export interface ClientCase {
  id?: string;
  caseNumber: string;
  clientName: string;
  phone?: string;
  caseType?: string;
  practiceArea?: string;
  courtName: string;
  courtRoomNo?: string;
  judgeBench?: string;
  opposingParty?: string;
  stage?: string;
  status?: string;
  currentStage?: string;
  nextHearingDate?: string;
  assignedAdvocate?: string;
  advocateAssigned?: string;
  statusBadge?: 'Active' | 'Under Hearing' | 'Reserved for Orders' | 'Disposed / Won';
  filingDate?: string;
  lastOrderRemarks?: string;
  allahabadHcCaseType?: string;
  allahabadHcCaseNo?: string;
  allahabadHcYear?: string;
  highCourtOrderUrl?: string;
  orderSheetNotes?: string;
  reminderSentDate?: string;
  documents?: { title: string; date: string; size: string; type: string; url?: string }[];
  hearingsHistory?: { date: string; stage: string; summary: string }[];
  invoices?: { invoiceNo: string; date: string; amount: string; status: 'Paid' | 'Pending' }[];
  messages?: { sender: 'Advocate' | 'Client'; text: string; timestamp: string }[];
}

export interface EnquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  query: string;
  date: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Archived';
}

