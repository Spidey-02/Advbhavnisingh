import { useState, useEffect } from 'react';
import {
  getStoredFirmDetails,
  getStoredOfficeLocations,
  getStoredBlogs,
  getStoredCaseStudies,
  FirmDetailsType
} from '../data/firmStore';
import { OfficeLocation, BlogPost, CaseStudy } from '../types';

export const useFirmData = () => {
  const [firmDetails, setFirmDetails] = useState<FirmDetailsType>(getStoredFirmDetails());
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>(getStoredOfficeLocations());
  const [blogs, setBlogs] = useState<BlogPost[]>(getStoredBlogs());
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(getStoredCaseStudies());

  const refreshData = () => {
    setFirmDetails(getStoredFirmDetails());
    setOfficeLocations(getStoredOfficeLocations());
    setBlogs(getStoredBlogs());
    setCaseStudies(getStoredCaseStudies());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('firmDataUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('firmDataUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    firmDetails,
    officeLocations,
    blogs,
    caseStudies,
    refreshData
  };
};
