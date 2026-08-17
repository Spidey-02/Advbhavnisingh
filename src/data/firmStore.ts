import { FIRM_DETAILS, OFFICE_LOCATIONS, BLOG_POSTS, CASE_STUDIES } from './legalData';
import { OfficeLocation, BlogPost, CaseStudy } from '../types';

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
};

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
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading blogs from storage', e);
  }
  return BLOG_POSTS;
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

// Setter functions that dispatch custom broadcast events
export const notifyFirmDataChanged = () => {
  window.dispatchEvent(new Event('firmDataUpdated'));
};

export const saveFirmDetails = (details: FirmDetailsType) => {
  localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
  notifyFirmDataChanged();
};

export const saveOfficeLocations = (locations: OfficeLocation[]) => {
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  notifyFirmDataChanged();
};

export const saveBlogs = (blogs: BlogPost[]) => {
  localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  notifyFirmDataChanged();
};

export const saveCaseStudies = (caseStudies: CaseStudy[]) => {
  localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(caseStudies));
  notifyFirmDataChanged();
};
