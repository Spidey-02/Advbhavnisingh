import { FIRM_DETAILS, OFFICE_LOCATIONS, BLOG_POSTS, CASE_STUDIES } from './legalData';
import { OfficeLocation, BlogPost, CaseStudy, HeroSlide, ClientProfile, ClientCase } from '../types';
import { formatDateToDDMMYYYY } from '../utils/dateFormatter';
import { getApiUrl } from '../config';

import imgAllahabadHC from '../assets/images/allahabad_high_court_1786991749564.jpg';
import imgLowerCourt from '../assets/images/prayagraj_lower_court_1786991768842.jpg';
import imgRevenueCourt from '../assets/images/board_of_revenue_court_1786991790874.jpg';

export interface FirmDetailsType {
  name: string;
  tagline: string;
  founderName: string;
  enrollmentNo: string;
  foundedYear: number;
  phone: string;
  altPhone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  mainAddress: string;
  mainOffice: string;
  lowerCourtChamber?: string;
  revenueCourtChamber?: string;
  lucknowChamber?: string;
  supremeCourtChamber?: string;
  founderImage: string;
  aboutText: string;
  chambers: {
    prayagraj: string;
    lowerCourt?: string;
    revenueCourt?: string;
    lucknow?: string;
    supremeCourt?: string;
  };
  barMemberships: string;
  highCourtOfficialPortal: string;
  highCourtCaseStatusPortal: string;
  highCourtJudgmentsPortal: string;
  eCourtsPortal: string;
  lowerCourtCaseStatusPortal?: string;
  lowerCourtDistrictPortal?: string;
  revenueCourtCaseStatusPortal?: string;
  boardOfRevenuePortal?: string;
  stats: {
    leadingSince: string;
    experiencedAttorneys: string;
    happyClients: string;
    successRatio: string;
    districtsCovered: string;
  };
}

const STORAGE_KEYS = {
  DETAILS: 'bhavni_firm_details',
  LOCATIONS: 'bhavni_office_locations',
  BLOGS: 'bhavni_blog_posts',
  CASE_STUDIES: 'bhavni_case_studies',
  HERO_SLIDES: 'bhavni_hero_slides',
  CLIENTS: 'bhavani_clients'
};

export const DEFAULT_CLIENTS: ClientProfile[] = [
  {
    id: 'client-1',
    name: 'Ramesh Chandra Verma',
    phone: '+91 9839012345',
    email: 'ramesh.verma@gmail.com',
    city: 'Prayagraj, UP',
    address: 'Civil Lines, Prayagraj',
    caseType: 'High Court Writ Petition',
    caseNumbers: ['WRIT/2026/91022'],
    totalCases: 1,
    notes: 'Land acquisition compensation enhancement petition before Division Bench.',
    status: 'Active',
    createdAt: '10/01/2026'
  },
  {
    id: 'client-2',
    name: 'Santosh Kumar Pandey',
    phone: '+91 9415099881',
    email: 'santosh.pandey@gmail.com',
    city: 'Varanasi, UP',
    address: 'Kutchery Road, Varanasi',
    caseType: 'High Court Bail Application',
    caseNumbers: ['BAIL/2026/41029'],
    totalCases: 1,
    notes: 'Section 439 CrPC regular bail in Police Station Cantonment matter.',
    status: 'Active',
    createdAt: '15/02/2026'
  },
  {
    id: 'client-3',
    name: 'Dinesh Kumar Mishra',
    phone: '+91 9838045612',
    email: 'dinesh.mishra@gmail.com',
    city: 'Prayagraj, UP',
    address: 'Kutchery, Prayagraj',
    caseType: 'Revenue Court Suit (Sec 144 UP Revenue Code)',
    caseNumbers: ['REV/2026/11094'],
    totalCases: 1,
    notes: 'Mutation & partition declaration before Board of Revenue Prayagraj.',
    status: 'Active',
    createdAt: '01/03/2026'
  }
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    slideNumber: 1,
    title: "Advocate Bhavni Singh & Associates",
    subtitle: "Precision in Law, Excellence in Execution — Allahabad High Court Chambers",
    tag: "", // Slide 1: nothing beside active member badge
    image: imgAllahabadHC
  },
  {
    id: 'slide-2',
    slideNumber: 2,
    title: "Hon'ble High Court of Judicature at Allahabad",
    subtitle: "Main Bench (Prayagraj) — Constitutional Writs, Section 482 & High Court Bail Petitions",
    tag: "High Court",
    image: imgAllahabadHC
  },
  {
    id: 'slide-3',
    slideNumber: 3,
    title: "District & Sessions Court (Prayagraj)",
    subtitle: "Kutchery Court Complex — Criminal Trials, Bail Applications & Civil Suits",
    tag: "Lower Court",
    image: imgLowerCourt
  },
  {
    id: 'slide-4',
    slideNumber: 4,
    title: "Board of Revenue Courts (Prayagraj)",
    subtitle: "Apex State Revenue Appellate Jurisdiction — Land Mutation & Revenue Suits",
    tag: "Revenue Court",
    image: imgRevenueCourt
  }
];

export const DEFAULT_FIRM_DETAILS: FirmDetailsType = {
  ...FIRM_DETAILS,
  whatsapp: FIRM_DETAILS.phone,
  founderImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  aboutText: "Practicing since 2022, Advocate Bhavni Singh & Associates is a dynamic and deeply knowledgeable law firm practicing actively before the Hon'ble High Court of Judicature at Allahabad, District & Lower Courts (Prayagraj), and Board of Revenue & Revenue Courts (Prayagraj). Known for relentless hard work, exhaustive legal research, and sharp court craftsmanship, Advocate Bhavni Singh represents clients in Constitutional Writs, Criminal Bail & Trials, Section 482 Quashing Petitions, and Revenue & Land Disputes."
};

// Getter functions
export const getStoredFirmDetails = (): FirmDetailsType => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DETAILS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean up stale localStorage if it references old bar memberships or 75 districts
      if (parsed.barMemberships?.includes('OUDH') || parsed.tagline?.includes('75 DISTRICTS') || parsed.tagline?.includes('LUCKNOW BENCH')) {
        localStorage.removeItem(STORAGE_KEYS.DETAILS);
        return DEFAULT_FIRM_DETAILS;
      }
      return { ...DEFAULT_FIRM_DETAILS, ...parsed };
    }
  } catch (e) {
    console.error('Error loading firm details from storage', e);
  }
  return DEFAULT_FIRM_DETAILS;
};

export const getStoredOfficeLocations = (): OfficeLocation[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading office locations from storage', e);
  }
  return OFFICE_LOCATIONS;
};

export const getStoredBlogs = (): BlogPost[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((p: BlogPost) => ({
          ...p,
          date: formatDateToDDMMYYYY(p.date)
        }));
      }
    }
  } catch (e) {
    console.error('Error loading blogs from storage', e);
  }
  return BLOG_POSTS.map(p => ({ ...p, date: formatDateToDDMMYYYY(p.date) }));
};

export const getStoredCaseStudies = (): CaseStudy[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CASE_STUDIES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading case studies from storage', e);
  }
  return CASE_STUDIES;
};

export const getStoredHeroSlides = (): HeroSlide[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((slide: HeroSlide, index: number) => {
          const defaultSlide = DEFAULT_HERO_SLIDES[index] || DEFAULT_HERO_SLIDES[0];
          // If stored slide image is blank, undefined, or broken placeholder, restore valid court image
          const hasValidImage = slide.image && typeof slide.image === 'string' && slide.image.trim() !== '' && !slide.image.includes('undefined');
          return {
            ...defaultSlide,
            ...slide,
            image: hasValidImage ? slide.image : defaultSlide.image
          };
        });
      }
    }
  } catch (e) {
    console.error('Error loading hero slides from storage', e);
  }
  return DEFAULT_HERO_SLIDES;
};

export const getStoredClients = (): ClientProfile[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c: ClientProfile) => ({
          ...c,
          createdAt: formatDateToDDMMYYYY(c.createdAt)
        }));
      }
    }
  } catch (e) {
    console.error('Error loading clients from storage', e);
  }
  return DEFAULT_CLIENTS.map(c => ({ ...c, createdAt: formatDateToDDMMYYYY(c.createdAt) }));
};

// Setter functions that dispatch custom broadcast events & sync to MongoDB Atlas
export const notifyFirmDataChanged = () => {
  window.dispatchEvent(new Event('firmDataUpdated'));
};

// Helper to push items directly to MongoDB Atlas
export const syncItemToMongoDB = async (type: string, data: any) => {
  try {
    const url = getApiUrl('/api/sync/item');
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
  } catch (e) {
    console.error(`Failed to sync ${type} to MongoDB Atlas:`, e);
  }
};

// Helper to fetch entire state from MongoDB Atlas on cross-device app load
export const fetchAllFromMongoDBAndSyncLocal = async (): Promise<boolean> => {
  try {
    const url = getApiUrl('/api/sync/all');
    const res = await fetch(url);
    const json = await res.json();
    if (json && json.success && json.connected && json.data) {
      const { firmDetails, officeLocations, heroSlides, blogs, caseStudies, clients, advocateCreds, enquiries, cases } = json.data;
      if (firmDetails) localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(firmDetails));
      if (officeLocations) localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(officeLocations));
      if (heroSlides) localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
      if (blogs) localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
      if (caseStudies) localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(caseStudies));
      if (clients) localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      if (advocateCreds) localStorage.setItem('bhavani_advocate_creds', JSON.stringify(advocateCreds));
      if (enquiries) localStorage.setItem('bhavani_enquiries', JSON.stringify(enquiries));
      if (cases && Array.isArray(cases) && cases.length > 0) localStorage.setItem('bhavani_cases', JSON.stringify(cases));

      notifyFirmDataChanged();
      return true;
    }
  } catch (e) {
    console.error('Error in fetchAllFromMongoDBAndSyncLocal:', e);
  }
  return false;
};

export const saveFirmDetails = (details: FirmDetailsType) => {
  localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
  notifyFirmDataChanged();
  syncItemToMongoDB('firmDetails', details);
};

export const saveOfficeLocations = (locations: OfficeLocation[]) => {
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  notifyFirmDataChanged();
  syncItemToMongoDB('officeLocations', locations);
};

export const saveBlogs = (blogs: BlogPost[]) => {
  localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  notifyFirmDataChanged();
  syncItemToMongoDB('blogs', blogs);
};

export const saveCaseStudies = (caseStudies: CaseStudy[]) => {
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(caseStudies));
  notifyFirmDataChanged();
  syncItemToMongoDB('caseStudies', caseStudies);
};

export const saveHeroSlides = (heroSlides: HeroSlide[]) => {
  localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
  notifyFirmDataChanged();
  syncItemToMongoDB('heroSlides', heroSlides);
};

export const saveEnquiries = (enquiries: any[]) => {
  localStorage.setItem('bhavani_enquiries', JSON.stringify(enquiries));
  notifyFirmDataChanged();
  syncItemToMongoDB('enquiries', enquiries);
};

export interface AdvocateCreds {
  name: string;
  mobile: string;
  email: string;
  userId: string;
  password: string;
  secretCode: string;
}

export const getStoredAdvocateCreds = (): AdvocateCreds => {
  try {
    const saved = localStorage.getItem('bhavani_advocate_creds');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.userId && parsed.password) {
        return {
          name: parsed.name || 'Advocate Bhavni Singh',
          mobile: parsed.mobile || '+91 9415211990',
          email: parsed.email || 'advprakhargupta.211@gmail.com',
          userId: parsed.userId,
          password: parsed.password,
          secretCode: parsed.secretCode || '9900'
        };
      }
    }
  } catch (e) {
    console.error('Error reading advocate creds', e);
  }
  return {
    name: 'Advocate Bhavni Singh',
    mobile: '+91 9415211990',
    email: 'advprakhargupta.211@gmail.com',
    userId: 'bhavani.singh',
    password: 'password123',
    secretCode: '9900'
  };
};

export const saveAdvocateCreds = (creds: AdvocateCreds) => {
  localStorage.setItem('bhavani_advocate_creds', JSON.stringify(creds));
  notifyFirmDataChanged();
  syncItemToMongoDB('advocateCreds', creds);
};

export const saveClients = (clients: ClientProfile[]) => {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  notifyFirmDataChanged();
  syncItemToMongoDB('clients', clients);
};

export const saveCases = (cases: ClientCase[]) => {
  localStorage.setItem('bhavani_cases', JSON.stringify(cases));
  notifyFirmDataChanged();
  syncItemToMongoDB('cases', cases);
};

