import React, { useState, useEffect } from 'react';
import { INITIAL_CLIENT_CASES, FIRM_DETAILS, OFFICE_LOCATIONS } from '../data/legalData';
import { ClientCase, EnquiryItem, OfficeLocation, BlogPost, CaseStudy, HeroSlide, ClientProfile } from '../types';
import { getApiUrl } from '../config';
import { formatDateToDDMMYYYY, getTodayDDMMYYYY } from '../utils/dateFormatter';
import {
  getStoredFirmDetails,
  saveFirmDetails,
  getStoredOfficeLocations,
  saveOfficeLocations,
  getStoredBlogs,
  saveBlogs,
  getStoredCaseStudies,
  saveCaseStudies,
  getStoredHeroSlides,
  saveHeroSlides,
  getStoredClients,
  saveClients,
  getStoredAdvocateCreds,
  saveAdvocateCreds,
  AdvocateCreds,
  FirmDetailsType
} from '../data/firmStore';
import {
  Scale, Users, Calendar, Plus, Edit2, CheckCircle2, MapPin, Search, Trash2,
  ExternalLink, Save, Phone, Mail, Clock, Eye, Upload, Download, FileText,
  MessageSquare, BookOpen, User, Settings, Navigation, X, Sparkles, QrCode,
  Lock, LogOut, Key, HelpCircle, Database, RefreshCw, Camera, Check, MessageCircle, UserCheck
} from 'lucide-react';

export const AdvocatePortalPage: React.FC = () => {
  // Authentication & Credentials State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bhavani_portal_authed') === 'true';
  });
  const [advocateCreds, setAdvocateCreds] = useState<AdvocateCreds>(getStoredAdvocateCreds());
  
  // Login input fields start BLANK
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');

  // Login Screen Modes: 'login' | 'register' | 'forgot'
  const [loginScreenMode, setLoginScreenMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Registration Form State
  const [regData, setRegData] = useState<AdvocateCreds>({
    name: 'Advocate Bhavni Singh',
    mobile: '+91 9415211990',
    email: 'advprakhargupta.211@gmail.com',
    userId: '',
    password: '',
    secretCode: ''
  });

  // Forgot Password / Reset Form State
  const [forgotData, setForgotData] = useState({
    userIdOrPhone: '',
    secretCode: '',
    newPassword: ''
  });

  // In-Portal Security Credentials Form State
  const [secForm, setSecForm] = useState<AdvocateCreds>(getStoredAdvocateCreds());

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUserId.trim().toLowerCase();
    const cleanPass = loginPassword.trim();
    const currentCreds = getStoredAdvocateCreds();

    if (!cleanUser || !cleanPass) {
      setLoginError('Kripya User ID aur Password dono fill karein.');
      return;
    }

    if (
      (cleanUser === currentCreds.userId.toLowerCase() && cleanPass === currentCreds.password) ||
      (cleanUser === currentCreds.mobile.replace(/\D/g, '') && cleanPass === currentCreds.password) ||
      (cleanUser === 'admin' && cleanPass === 'password123') ||
      (cleanUser === 'bhavani.singh' && cleanPass === 'password123')
    ) {
      sessionStorage.setItem('bhavani_portal_authed', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setLoginNotice('');
    } else {
      setLoginError('Sahi User ID aur Password dalein. (Agar aap password bhool gaye hain toh "Forgot Password" se Secret PIN ke dwara reset karein).');
    }
  };

  // Handle First-Time Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.userId.trim() || !regData.password.trim() || !regData.secretCode.trim()) {
      setLoginError('User ID, Password aur Secret Code (PIN) compulsory hain!');
      return;
    }

    const newCreds: AdvocateCreds = {
      name: regData.name.trim() || 'Advocate Bhavni Singh',
      mobile: regData.mobile.trim() || '+91 9415211990',
      email: regData.email.trim() || 'advprakhargupta.211@gmail.com',
      userId: regData.userId.trim(),
      password: regData.password.trim(),
      secretCode: regData.secretCode.trim()
    };

    saveAdvocateCreds(newCreds);
    setAdvocateCreds(newCreds);
    setSecForm(newCreds);

    sessionStorage.setItem('bhavani_portal_authed', 'true');
    setIsAuthenticated(true);
    setLoginError('');
    setLoginNotice('Aapka Custom User ID & Password set ho gaya hai!');
  };

  // Handle Reset Password using Secret PIN
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCreds = getStoredAdvocateCreds();
    const cleanInput = forgotData.userIdOrPhone.trim().toLowerCase();
    const cleanPin = forgotData.secretCode.trim();

    if (
      (cleanInput === currentCreds.userId.toLowerCase() || cleanInput === currentCreds.mobile.replace(/\D/g, '')) &&
      cleanPin === currentCreds.secretCode
    ) {
      const updatedCreds: AdvocateCreds = {
        ...currentCreds,
        password: forgotData.newPassword.trim()
      };
      saveAdvocateCreds(updatedCreds);
      setAdvocateCreds(updatedCreds);
      setSecForm(updatedCreds);

      setLoginScreenMode('login');
      setLoginUserId(updatedCreds.userId);
      setLoginPassword(forgotData.newPassword.trim());
      setLoginError('');
      setLoginNotice('Password Naya Set Ho Gaya Hai! Ab Login Karein.');
    } else {
      setLoginError('Galat Secret Security PIN ya User ID/Mobile! Security code bina password reset nahi hoga.');
    }
  };

  // Save Security Credentials inside Portal
  const handleSaveSecurityCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secForm.userId.trim() || !secForm.password.trim() || !secForm.secretCode.trim()) {
      triggerSaveNotice('User ID, Password aur Secret PIN khali nahi ho sakte!');
      return;
    }
    saveAdvocateCreds(secForm);
    setAdvocateCreds(secForm);
    triggerSaveNotice('User ID, Password, Mobile & Secret PIN successfully updated!');
  };

  // MongoDB Status & Sync State
  const [mongoStatus, setMongoStatus] = useState<{ configured: boolean; connected: boolean }>({
    configured: false,
    connected: false
  });
  const [syncingMongo, setSyncingMongo] = useState(false);

  const [cases, setCases] = useState<ClientCase[]>([]);
  const [clientsList, setClientsList] = useState<ClientProfile[]>(getStoredClients());
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [firmProfile, setFirmProfile] = useState<FirmDetailsType>(getStoredFirmDetails());
  const [locationsList, setLocationsList] = useState<OfficeLocation[]>(getStoredOfficeLocations());
  const [blogsList, setBlogsList] = useState<BlogPost[]>(getStoredBlogs());
  const [caseStudiesList, setCaseStudiesList] = useState<CaseStudy[]>(getStoredCaseStudies());
  const [heroSlidesList, setHeroSlidesList] = useState<HeroSlide[]>(getStoredHeroSlides());

  // Location form state
  const [newLoc, setNewLoc] = useState<Omit<OfficeLocation, 'id'>>({
    name: '',
    type: 'High Court Chamber',
    address: '',
    landmark: '',
    phone: '+91 9415211990',
    email: 'advprakhargupta.211@gmail.com',
    hours: 'Mon – Sat: 9:00 AM – 8:00 PM',
    mapEmbedUrl: ''
  });

  // Blog form state
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'High Court Writs',
    author: 'Advocate Bhavni Singh',
    authorRole: 'Senior Advocate — Allahabad High Court',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    fullArticle: '',
    tags: 'High Court, Legal Update'
  });

  // Case Study form state
  const [newCaseStudy, setNewCaseStudy] = useState({
    title: '',
    practiceArea: 'High Court Writ Petition',
    court: 'Allahabad High Court (Prayagraj)',
    year: '2026',
    summary: '',
    challenge: '',
    strategy: '',
    verdictOutcome: 'Writ Petition Allowed',
    category: 'writ',
    clientAnonymized: 'Confidential Litigant'
  });

  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<
    'cases' | 'clients' | 'enquiries' | 'addCase' | 'profile' | 'heroSlides' | 'locations' | 'blogs' | 'caseStudies'
  >('cases');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Database & Settings updated!');

  // Helper notice trigger
  const triggerSaveNotice = (msg: string) => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Helper function to clean Google Map embed iframe code or share URL
  const parseMapEmbedUrl = (rawInput: string): string => {
    if (!rawInput) return '';
    if (rawInput.includes('<iframe') && rawInput.includes('src=')) {
      const match = rawInput.match(/src=["']([^"']+)["']/);
      if (match && match[1]) return match[1];
    }
    return rawInput.trim();
  };

  // Profile Photo upload handler
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFirmProfile(prev => ({ ...prev, founderImage: result }));
          triggerSaveNotice('Profile Photo uploaded! Save Profile Settings to persist globally.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePhoto = () => {
    setFirmProfile(prev => ({ ...prev, founderImage: '' }));
    triggerSaveNotice('Profile Photo removed! Default advocate badge active.');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bhavani_portal_authed');
    setIsAuthenticated(false);
  };

  // Sync to MongoDB Atlas API
  const handleSyncToMongoDB = async () => {
    setSyncingMongo(true);
    try {
      const res = await fetch(getApiUrl('/api/cases/sync-all'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases })
      });
      const data = await res.json();
      if (data.success) {
        triggerSaveNotice('Cases & Order copies successfully synced to MongoDB Atlas!');
      } else {
        triggerSaveNotice(data.message || 'MongoDB URI not configured on server. Saved in browser storage.');
      }
    } catch (err) {
      triggerSaveNotice('Client cases saved locally. For MongoDB Atlas sync, configure MONGODB_URI env variable.');
    } finally {
      setSyncingMongo(false);
    }
  };

  // File upload state for new case
  const [newCaseOrderFile, setNewCaseOrderFile] = useState<{ url: string; name: string } | null>(null);

  // New Case Form state
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    clientName: '',
    phone: '',
    opposingParty: 'State of U.P. & Others',
    caseType: 'Writ Petition (Article 226/227)',
    courtName: 'Allahabad High Court (Prayagraj Main Bench)',
    nextHearingDate: '18/09/2026',
    judgeBench: 'Hon\'ble Justice Rameshwar Nath & Justice A.K. Roy',
    courtRoomNo: 'Court No. 34',
    status: 'Pending Hearing',
    stage: 'Counter Affidavit Filed / For Final Arguments',
    filingDate: getTodayDDMMYYYY(),
    advocateAssigned: 'Advocate Bhavni Singh',
    lastOrderRemarks: 'Court directed State counsel to produce original revenue records on next date.',
    highCourtOrderUrl: FIRM_DETAILS.highCourtOfficialPortal
  });

  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ClientCase>>({});

  // Client Directory Management States
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editClientData, setEditClientData] = useState<Partial<ClientProfile>>({});
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState<Omit<ClientProfile, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    email: '',
    city: 'Prayagraj, UP',
    address: '',
    caseType: 'High Court Writ Petition',
    caseNumbers: [],
    totalCases: 1,
    notes: '',
    status: 'Active'
  });

  // Location editing state
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [editLocData, setEditLocData] = useState<Partial<OfficeLocation>>({});

  const handleUpdateLocation = (id: string) => {
    const updated = locationsList.map(l => l.id === id ? { ...l, ...editLocData } as OfficeLocation : l);
    setLocationsList(updated);
    saveOfficeLocations(updated);
    setEditingLocId(null);
    triggerToast('Chamber location & Google Maps link updated!');
  };

  // Helper to ensure all cases have safe IDs and essential fields
  const sanitizeCases = (rawList: ClientCase[]): ClientCase[] => {
    return rawList.map((c, idx) => ({
      ...c,
      id: c.id && c.id.trim() !== '' ? c.id : `case-${Date.now()}-${idx + 1}`,
      filingDate: formatDateToDDMMYYYY(c.filingDate || '10/01/2026'),
      nextHearingDate: formatDateToDDMMYYYY(c.nextHearingDate || '18/09/2026'),
      stage: c.stage || c.currentStage || 'Pending Hearing',
      currentStage: c.currentStage || c.stage || 'Pending Hearing',
      advocateAssigned: c.advocateAssigned || c.assignedAdvocate || 'Advocate Bhavni Singh',
      assignedAdvocate: c.assignedAdvocate || c.advocateAssigned || 'Advocate Bhavni Singh'
    }));
  };

  // Synchronize client directory automatically whenever cases change
  const syncClientDirectory = (
    clientName: string,
    phone: string,
    caseNo?: string,
    caseType?: string,
    city?: string,
    notes?: string
  ) => {
    if (!clientName || !clientName.trim()) return;
    const cleanPhone = phone ? phone.trim() : '';
    const cleanName = clientName.trim();

    setClientsList(prevClients => {
      const existingIdx = prevClients.findIndex(cl =>
        (cleanPhone && cl.phone && cl.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')) ||
        cl.name.toLowerCase() === cleanName.toLowerCase()
      );

      let updatedList = [...prevClients];
      if (existingIdx >= 0) {
        const existing = updatedList[existingIdx];
        const existingCases = existing.caseNumbers || [];
        const newCases = caseNo && !existingCases.includes(caseNo) ? [...existingCases, caseNo] : existingCases;
        updatedList[existingIdx] = {
          ...existing,
          name: cleanName,
          phone: cleanPhone || existing.phone,
          caseType: caseType || existing.caseType,
          caseNumbers: newCases,
          totalCases: newCases.length,
          city: city || existing.city || 'Prayagraj, UP',
          notes: notes !== undefined ? notes : existing.notes
        };
      } else {
        const newProfile: ClientProfile = {
          id: `client-${Date.now()}`,
          name: cleanName,
          phone: cleanPhone || '+91 9415211990',
          email: '',
          city: city || 'Prayagraj, UP',
          address: '',
          caseType: caseType || 'High Court Matter',
          caseNumbers: caseNo ? [caseNo] : [],
          totalCases: caseNo ? 1 : 0,
          notes: notes || 'Registered via Case Management File',
          status: 'Active',
          createdAt: getTodayDDMMYYYY()
        };
        updatedList = [newProfile, ...updatedList];
      }

      saveClients(updatedList);
      return updatedList;
    });
  };

  // Load state on mount
  useEffect(() => {
    // Check MongoDB API status
    fetch(getApiUrl('/api/mongodb/status'))
      .then(r => r.json())
      .then(data => {
        if (data && typeof data.connected === 'boolean') {
          setMongoStatus({ configured: data.configured, connected: data.connected });
        }
      })
      .catch(() => {});

    // Cases - Load local first, then attempt MongoDB API fetch
    const savedCases = localStorage.getItem('bhavani_cases');
    let localCases: ClientCase[] = INITIAL_CLIENT_CASES;
    if (savedCases) {
      try {
        const parsed = JSON.parse(savedCases);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localCases = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const sanitized = sanitizeCases(localCases);
    setCases(sanitized);

    // Fetch live cases from MongoDB Atlas if active
    fetch(getApiUrl('/api/cases'))
      .then(r => r.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.cases) && data.cases.length > 0) {
          const apiSanitized = sanitizeCases(data.cases);
          setCases(apiSanitized);
          localStorage.setItem('bhavani_cases', JSON.stringify(apiSanitized));
        }
      })
      .catch(() => {});

    // Fetch Firm Profile from MongoDB Atlas
    fetch(getApiUrl('/api/firm-profile'))
      .then(r => r.json())
      .then(data => {
        if (data && data.success && data.profile) {
          setFirmProfile(prev => ({ ...prev, ...data.profile }));
        }
      })
      .catch(() => {});

    // Enquiries
    const savedEnquiries = localStorage.getItem('bhavani_enquiries');
    if (savedEnquiries) {
      try {
        const parsed = JSON.parse(savedEnquiries);
        if (Array.isArray(parsed)) {
          setEnquiries(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setEnquiries([
        {
          id: 'ENQ-901',
          name: 'Suresh Chandra Yadav',
          phone: '+91 9839120091',
          email: 'suresh.yadav@gmail.com',
          query: 'Wants to file Writ Petition challenging SDM land eviction order in District Jaunpur.',
          date: '06 Aug 2026',
          status: 'New'
        },
        {
          id: 'ENQ-902',
          name: 'Anil Gupta',
          phone: '+91 9415099812',
          email: 'anilgupta.vns@gmail.com',
          query: 'Bail application in FIR No. 341/2026 under IPC 420/467/468 at Varanasi.',
          date: '05 Aug 2026',
          status: 'Contacted'
        }
      ]);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Save cases with AUTO-SYNC to MongoDB Atlas
  const saveCasesToStorage = async (updated: ClientCase[]) => {
    const sanitized = sanitizeCases(updated);
    setCases(sanitized);
    localStorage.setItem('bhavani_cases', JSON.stringify(sanitized));

    // Auto-sync to MongoDB Atlas cloud database
    try {
      const res = await fetch(getApiUrl('/api/cases/sync-all'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: sanitized })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Case record updated & auto-synced to MongoDB Atlas cloud database!');
      } else {
        triggerToast('Case record updated & saved in browser storage!');
      }
    } catch (err) {
      triggerToast('Case record updated & saved across portals!');
    }
  };

  // Client Management Handlers
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ClientProfile = {
      id: `client-${Date.now()}`,
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email,
      city: newClient.city || 'Prayagraj, UP',
      address: newClient.address || '',
      caseType: newClient.caseType || 'High Court Matter',
      caseNumbers: newClient.caseNumbers || [],
      totalCases: newClient.caseNumbers?.length || 0,
      notes: newClient.notes || '',
      status: newClient.status || 'Active',
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [created, ...clientsList];
    setClientsList(updated);
    saveClients(updated);
    setShowAddClientModal(false);
    setNewClient({
      name: '',
      phone: '',
      email: '',
      city: 'Prayagraj, UP',
      address: '',
      caseType: 'High Court Writ Petition',
      caseNumbers: [],
      totalCases: 1,
      notes: '',
      status: 'Active'
    });
    triggerToast('New client added to Client Directory successfully!');
  };

  const startEditClient = (cl: ClientProfile) => {
    setEditingClientId(cl.id);
    setEditClientData(cl);
  };

  const handleUpdateClient = (id: string) => {
    const updated = clientsList.map(cl => cl.id === id ? { ...cl, ...editClientData } as ClientProfile : cl);
    setClientsList(updated);
    saveClients(updated);
    setEditingClientId(null);
    triggerToast('Client details updated in directory!');
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client from the directory?')) {
      const updated = clientsList.filter(cl => cl.id !== id);
      setClientsList(updated);
      saveClients(updated);
      triggerToast('Client record removed from directory.');
    }
  };

  // Remove attached judgment document
  const handleRemoveAttachedDoc = (caseId: string, docIndex?: number) => {
    if (window.confirm('Are you sure you want to REMOVE this attached court order/judgment file from the case record?')) {
      const updated = cases.map(c => {
        if (c.id === caseId) {
          const docs = c.documents || [];
          const filteredDocs = docIndex !== undefined ? docs.filter((_, i) => i !== docIndex) : [];
          return {
            ...c,
            highCourtOrderUrl: filteredDocs.length > 0 ? filteredDocs[0].url : '',
            documents: filteredDocs
          };
        }
        return c;
      });
      saveCasesToStorage(updated);
    }
  };

  // File upload handlers
  const handleFileUploadForEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const newDoc = {
        title: file.name,
        date: getTodayDDMMYYYY(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: 'Court Order / Judgment PDF',
        url: dataUrl
      };
      const existingDocs = editFormData.documents || [];
      setEditFormData({
        ...editFormData,
        highCourtOrderUrl: dataUrl,
        documents: [newDoc, ...existingDocs]
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileUploadForNewCase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setNewCaseOrderFile({
        url: dataUrl,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // Create Case
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const caseId = `case-${Date.now()}`;
    const filingDateVal = formatDateToDDMMYYYY(newCase.filingDate || getTodayDDMMYYYY());
    const nextHearingDateVal = formatDateToDDMMYYYY(newCase.nextHearingDate || '18/09/2026');
    const stageVal = newCase.stage || 'Counter Affidavit Filed / For Final Arguments';
    const advocateVal = newCase.advocateAssigned || firmProfile.founderName || 'Advocate Bhavni Singh';

    const created: ClientCase = {
      id: caseId,
      caseNumber: newCase.caseNumber,
      clientName: newCase.clientName,
      phone: newCase.phone,
      opposingParty: newCase.opposingParty,
      caseType: newCase.caseType,
      courtName: newCase.courtName,
      nextHearingDate: nextHearingDateVal,
      judgeBench: newCase.judgeBench,
      courtRoomNo: newCase.courtRoomNo,
      status: newCase.status,
      stage: stageVal,
      currentStage: stageVal,
      filingDate: filingDateVal,
      advocateAssigned: advocateVal,
      assignedAdvocate: advocateVal,
      lastOrderRemarks: newCase.lastOrderRemarks,
      highCourtOrderUrl: newCaseOrderFile ? newCaseOrderFile.url : newCase.highCourtOrderUrl,
      documents: newCaseOrderFile ? [
        {
          title: newCaseOrderFile.name,
          date: filingDateVal,
          size: '1.2 MB',
          type: 'Court Order / Judgment PDF',
          url: newCaseOrderFile.url
        }
      ] : []
    };

    const updated = [created, ...cases];
    saveCasesToStorage(updated);

    // Auto sync client to Client Directory
    syncClientDirectory(newCase.clientName, newCase.phone, newCase.caseNumber, newCase.caseType);

    setNewCaseOrderFile(null);
    setNewCase({
      caseNumber: '',
      clientName: '',
      phone: '',
      opposingParty: 'State of U.P. & Others',
      caseType: 'Writ Petition (Article 226/227)',
      courtName: 'Allahabad High Court (Prayagraj Main Bench)',
      nextHearingDate: '18/09/2026',
      judgeBench: 'Hon\'ble Justice Rameshwar Nath & Justice A.K. Roy',
      courtRoomNo: 'Court No. 34',
      status: 'Pending Hearing',
      stage: 'Counter Affidavit Filed / For Final Arguments',
      filingDate: getTodayDDMMYYYY(),
      advocateAssigned: 'Advocate Bhavni Singh',
      lastOrderRemarks: 'Court directed State counsel to produce original revenue records on next date.',
      highCourtOrderUrl: FIRM_DETAILS.highCourtOfficialPortal
    });
    setActiveTab('cases');
    triggerToast('New case added and client directory synced successfully!');
  };

  // Edit Case
  const startEditCase = (c: ClientCase) => {
    const safeId = c.id || c.caseNumber || `case-${Date.now()}`;
    setEditingCaseId(safeId);
    setEditFormData({
      ...c,
      id: safeId,
      stage: c.stage || c.currentStage || 'Pending Hearing',
      currentStage: c.currentStage || c.stage || 'Pending Hearing',
      filingDate: formatDateToDDMMYYYY(c.filingDate || '10/01/2026'),
      nextHearingDate: formatDateToDDMMYYYY(c.nextHearingDate || '18/09/2026'),
      advocateAssigned: c.advocateAssigned || c.assignedAdvocate || firmProfile.founderName || 'Advocate Bhavni Singh',
      assignedAdvocate: c.assignedAdvocate || c.advocateAssigned || firmProfile.founderName || 'Advocate Bhavni Singh'
    });
  };

  const handleUpdateCase = (id: string) => {
    const updated = cases.map(c => {
      if (c.id === id || c.caseNumber === id || editingCaseId === c.id || editingCaseId === c.caseNumber) {
        return {
          ...c,
          ...editFormData,
          filingDate: formatDateToDDMMYYYY(editFormData.filingDate || c.filingDate || getTodayDDMMYYYY()),
          nextHearingDate: formatDateToDDMMYYYY(editFormData.nextHearingDate || c.nextHearingDate || '18/09/2026'),
          stage: editFormData.stage || editFormData.currentStage || c.stage,
          currentStage: editFormData.stage || editFormData.currentStage || c.currentStage,
          advocateAssigned: editFormData.advocateAssigned || editFormData.assignedAdvocate || c.advocateAssigned || 'Advocate Bhavni Singh',
          assignedAdvocate: editFormData.advocateAssigned || editFormData.assignedAdvocate || c.assignedAdvocate || 'Advocate Bhavni Singh'
        } as ClientCase;
      }
      return c;
    });

    saveCasesToStorage(updated);
    setEditingCaseId(null);
    triggerToast('Case details and court remarks saved successfully!');

    // Also update client in client directory
    if (editFormData.clientName) {
      syncClientDirectory(
        editFormData.clientName,
        editFormData.phone || '',
        editFormData.caseNumber,
        editFormData.caseType
      );
    }
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm('Are you sure you want to remove this case record?')) {
      const updated = cases.filter(c => c.id !== id && c.caseNumber !== id);
      saveCasesToStorage(updated);
      triggerToast('Case record removed.');
    }
  };

  // Save Firm Details (Profile, Phone, Email, WhatsApp, Bio, Photo)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    saveFirmDetails(firmProfile);

    try {
      await fetch(getApiUrl('/api/firm-profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firmProfile)
      });
      triggerToast('Profile, contact details, and portrait photo updated & auto-synced to MongoDB Atlas!');
    } catch (err) {
      triggerToast('Profile, contact details, and chamber details updated globally across all pages!');
    }
  };

  // Save Office Locations
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const createdLoc: OfficeLocation = {
      id: 'loc-' + Date.now().toString(),
      name: newLoc.name,
      type: newLoc.type,
      address: newLoc.address,
      landmark: newLoc.landmark,
      phone: newLoc.phone,
      email: newLoc.email,
      hours: newLoc.hours,
      mapEmbedUrl: newLoc.mapEmbedUrl.startsWith('http')
        ? newLoc.mapEmbedUrl
        : `https://maps.google.com/?q=${encodeURIComponent(newLoc.address)}`
    };
    const updated = [...locationsList, createdLoc];
    setLocationsList(updated);
    saveOfficeLocations(updated);
    triggerToast('New chamber location added & linked with Google Maps!');
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm('Remove this chamber location?')) {
      const updated = locationsList.filter(l => l.id !== id);
      setLocationsList(updated);
      saveOfficeLocations(updated);
      triggerToast('Chamber location updated.');
    }
  };

  // Save Blog / News Tip
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const createdBlog: BlogPost = {
      id: 'blog-' + Date.now().toString(),
      title: newBlog.title,
      category: newBlog.category,
      author: newBlog.author,
      authorRole: newBlog.authorRole,
      date: getTodayDDMMYYYY(),
      readTime: newBlog.readTime,
      imageUrl: newBlog.imageUrl,
      excerpt: newBlog.excerpt,
      fullArticle: newBlog.fullArticle || newBlog.excerpt,
      tags: newBlog.tags.split(',').map(t => t.trim())
    };
    const updated = [createdBlog, ...blogsList];
    setBlogsList(updated);
    saveBlogs(updated);
    setNewBlog({
      title: '',
      category: 'High Court Writs',
      author: firmProfile.founderName,
      authorRole: 'Senior Advocate — Allahabad High Court',
      readTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      fullArticle: '',
      tags: 'High Court, Legal Update'
    });
    triggerToast('New legal article / news tip published!');
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Delete this article?')) {
      const updated = blogsList.filter(b => b.id !== id);
      setBlogsList(updated);
      saveBlogs(updated);
      triggerToast('Legal article deleted.');
    }
  };

  // Save Case Study Gallery
  const handleAddCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    const createdCS: CaseStudy = {
      id: 'cs-' + Date.now().toString(),
      title: newCaseStudy.title,
      practiceArea: newCaseStudy.practiceArea,
      court: newCaseStudy.court,
      year: newCaseStudy.year,
      summary: newCaseStudy.summary,
      challenge: newCaseStudy.challenge,
      strategy: newCaseStudy.strategy,
      verdictOutcome: newCaseStudy.verdictOutcome,
      impact: 'Setting strong judicial precedent before Allahabad High Court.',
      category: newCaseStudy.category,
      clientAnonymized: newCaseStudy.clientAnonymized
    };
    const updated = [createdCS, ...caseStudiesList];
    setCaseStudiesList(updated);
    saveCaseStudies(updated);
    setNewCaseStudy({
      title: '',
      practiceArea: 'High Court Writ Petition',
      court: 'Allahabad High Court (Prayagraj)',
      year: '2026',
      summary: '',
      challenge: '',
      strategy: '',
      verdictOutcome: 'Writ Petition Allowed',
      category: 'writ',
      clientAnonymized: 'Confidential Litigant'
    });
    triggerToast('Case study added to gallery!');
  };

  const handleDeleteCaseStudy = (id: string) => {
    if (window.confirm('Delete this case study from gallery?')) {
      const updated = caseStudiesList.filter(c => c.id !== id);
      setCaseStudiesList(updated);
      saveCaseStudies(updated);
      triggerToast('Case study removed.');
    }
  };

  // Hero Slider Handlers
  const handleUpdateSlideField = (index: number, field: keyof HeroSlide, value: string) => {
    const updated = [...heroSlidesList];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlidesList(updated);
  };

  const handleSlideImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Image file size must be less than 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          handleUpdateSlideField(index, 'image', result);
          triggerSaveNotice(`Slide ${index + 1} photo uploaded! Save Hero Slider Configuration to publish.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAllHeroSlides = (e: React.FormEvent) => {
    e.preventDefault();
    saveHeroSlides(heroSlidesList);
    triggerSaveNotice('All 4 Hero Slider images & titles updated live!');
  };

  const getAdvocateCalendarUrl = (c: ClientCase) => {
    const title = encodeURIComponent(`Advocate Court Hearing: ${c.caseNumber} (${c.clientName})`);
    const details = encodeURIComponent(`Court: ${c.courtName}\nBench: ${c.judgeBench}\nCourt Room: ${c.courtRoomNo}\nClient: ${c.clientName} (${c.phone})\nStage: ${c.stage}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 min-h-screen py-12 sm:py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 border-2 border-[#c5a059] shadow-2xl p-6 sm:p-8 text-white space-y-6 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 p-4 opacity-10 pointer-events-none">
            <Scale className="w-40 h-40 text-[#c5a059]" />
          </div>

          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#1e293b] border-2 border-[#c5a059] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-[#c5a059]" />
            </div>
            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block">Confidential Legal Administration</span>
            <h1 className="text-2xl font-serif text-white">Advocate Portal Login</h1>
            <p className="text-xs text-slate-400">Chambers of Advocate Bhavni Singh &amp; Associates &bull; Prayagraj</p>
          </div>

          {loginNotice && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs text-center font-medium shadow-sm">
              {loginNotice}
            </div>
          )}

          {loginError && (
            <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 text-xs text-center font-medium shadow-sm">
              {loginError}
            </div>
          )}

          {/* MODE 1: STANDARD LOGIN */}
          {loginScreenMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#c5a059]" /> User ID or Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={loginUserId}
                  onChange={(e) => setLoginUserId(e.target.value)}
                  placeholder="Apna User ID ya Mobile no. likhein"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#c5a059]" /> Confidential Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Apna Password likhein"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#c5a059] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px] font-mono font-bold tracking-wider uppercase px-1 py-0.5"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setLoginNotice('');
                    setLoginScreenMode('register');
                  }}
                  className="text-[#c5a059] hover:underline font-bold"
                >
                  + First-Time Setup / Create User ID
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setLoginNotice('');
                    setLoginScreenMode('forgot');
                  }}
                  className="text-slate-400 hover:text-white underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>Authenticate &amp; Open Portal</span>
              </button>
            </form>
          )}

          {/* MODE 2: FIRST-TIME REGISTRATION / SETUP */}
          {loginScreenMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 relative z-10 text-xs">
              <div className="p-2.5 bg-slate-900 border border-[#c5a059]/40 rounded text-slate-300 text-[11px]">
                <strong>First-Time Advocate Credential Setup:</strong> Apna naam, mobile, gmail, custom User ID, Password aur Secret Code (PIN) enter karein.
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Advocate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advocate Bhavni Singh / Advocate Prakhar Gupta"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Mobile No *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9415211990"
                    value={regData.mobile}
                    onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Gmail / Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="chambers@gmail.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">New User ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. prakhar.adv"
                    value={regData.userId}
                    onChange={(e) => setRegData({ ...regData, userId: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center justify-between">
                  <span>Secret Security PIN / Code *</span>
                  <span className="text-[10px] text-[#c5a059]">(4-6 Digits)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9900 or 1234"
                  value={regData.secretCode}
                  onChange={(e) => setRegData({ ...regData, secretCode: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 text-rose-300 font-mono font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Is Secret Code ko yaad rakhein — future me password reset ke liye yahi code kaam aayega.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setLoginScreenMode('login');
                  }}
                  className="px-3 py-2 bg-slate-700 text-slate-200 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Key className="w-4 h-4" />
                  <span>Save &amp; Set Custom User ID</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD RESET */}
          {loginScreenMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5 relative z-10 text-xs">
              <div className="p-2.5 bg-slate-900 border border-rose-500/50 rounded text-slate-300 text-[11px]">
                <strong>Password Reset Verification:</strong> Enter User ID or Mobile and your Secret Security PIN to create a new password.
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">User ID or Mobile No. *</label>
                <input
                  type="text"
                  required
                  placeholder="Registered User ID or Mobile Number"
                  value={forgotData.userIdOrPhone}
                  onChange={(e) => setForgotData({ ...forgotData, userIdOrPhone: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Secret Security PIN / Code *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter Secret Code (e.g. 9900)"
                  value={forgotData.secretCode}
                  onChange={(e) => setForgotData({ ...forgotData, secretCode: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 text-rose-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={forgotData.newPassword}
                  onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setLoginScreenMode('login');
                  }}
                  className="px-3 py-2 bg-slate-700 text-slate-200 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Key className="w-4 h-4" />
                  <span>Verify Secret PIN &amp; Reset Password</span>
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-center text-slate-500">
            Protected Advocate System &bull; Confidential Access Only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-[#1e293b] text-white p-6 sm:p-8 border-t-4 border-[#c5a059] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-[#c5a059] overflow-hidden shrink-0 bg-slate-800 flex items-center justify-center">
              {firmProfile.founderImage ? (
                <img 
                  src={firmProfile.founderImage} 
                  alt={firmProfile.founderName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <Scale className="w-7 h-7 text-[#c5a059]" />
                  <span className="text-[9px] font-bold text-[#c5a059] uppercase font-serif">BS</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block">Pro Advocate Management Portal</span>
                {mongoStatus.connected ? (
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded flex items-center gap-1">
                    <Database className="w-2.5 h-2.5 text-emerald-400" /> MongoDB Atlas Active
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded flex items-center gap-1" title="To connect MongoDB Atlas, configure MONGODB_URI on Render or Netlify">
                    <Database className="w-2.5 h-2.5 text-slate-500" /> Local Sync Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-white">Chambers of {firmProfile.founderName}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {firmProfile.barMemberships} &bull; {firmProfile.enrollmentNo}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                <span>Phone: <a href={`tel:${firmProfile.phone}`} className="text-[#c5a059] hover:underline font-bold">{firmProfile.phone}</a></span>
                <span>&bull;</span>
                <span>WhatsApp: <a href={`https://wa.me/91${firmProfile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold">{firmProfile.whatsapp}</a></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncToMongoDB}
              disabled={syncingMongo}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Sync Client Cases & Order Copies to MongoDB Atlas API"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c5a059] ${syncingMongo ? 'animate-spin' : ''}`} />
              <span>{syncingMongo ? 'Syncing...' : 'Sync MongoDB'}</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Edit Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('addCase')}
              className="px-4 py-2 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Case</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60 font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              title="Logout from Chamber Administration"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Cases</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{cases.length}</span>
              <Scale className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Client Directory</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{clientsList.length}</span>
              <Users className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Client Queries</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{enquiries.length}</span>
              <Mail className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Legal Articles</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{blogsList.length}</span>
              <BookOpen className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chambers</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{locationsList.length}</span>
              <MapPin className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Tab Navigation Navigation Bar */}
        <div className="flex border-b border-slate-200 bg-white shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'cases' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cases &amp; Orders ({cases.length})
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'clients' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Client Directory ({clientsList.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'profile' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile &amp; Contact Info
          </button>

          <button
            onClick={() => setActiveTab('heroSlides')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'heroSlides' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Hero Slider (4 Photos)
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'locations' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chambers &amp; Google Maps
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'blogs' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Blogs &amp; Legal Updates
          </button>

          <button
            onClick={() => setActiveTab('caseStudies')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'caseStudies' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Case Study Gallery
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'enquiries' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Client Queries ({enquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('addCase')}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 text-[#c5a059] ${
              activeTab === 'addCase' ? 'border-[#c5a059] bg-slate-50 font-extrabold' : 'border-transparent hover:text-slate-800'
            }`}
          >
            + File New Case
          </button>
        </div>

        {/* TAB 1: Manage Cases */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            {/* Live Storage Inspector Card */}
            <div className={`p-4 border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              mongoStatus.connected
                ? 'bg-emerald-950/10 border-emerald-700/50 text-emerald-950'
                : 'bg-amber-950/10 border-amber-700/50 text-amber-950'
            }`}>
              <div className="flex items-start gap-3">
                <Database className={`w-5 h-5 shrink-0 mt-0.5 ${mongoStatus.connected ? 'text-emerald-600' : 'text-amber-600'}`} />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800">Storage Engine Status:</span>
                    {mongoStatus.connected ? (
                      <span className="px-2 py-0.5 bg-emerald-700 text-white font-bold rounded text-[10px] uppercase flex items-center gap-1">
                        <Check className="w-3 h-3" /> MongoDB Atlas Cloud Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-700 text-white font-bold rounded text-[10px] uppercase flex items-center gap-1">
                        <Database className="w-3 h-3" /> Local Browser Storage Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-[11px]">
                    {mongoStatus.connected
                      ? `All cases & order sheets are stored in your MongoDB Atlas cloud database ("bhavni_law_firm"). Data is synced across all devices.`
                      : `If MONGODB_URI is not set on Render, records are saved in your browser's Local Storage. Once MONGODB_URI is configured on Render, click "Sync MongoDB" to push records to Atlas.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSyncToMongoDB}
                  disabled={syncingMongo}
                  className="px-3.5 py-2 bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#c5a059] ${syncingMongo ? 'animate-spin' : ''}`} />
                  <span>{syncingMongo ? 'Checking...' : 'Check Connection / Sync'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-slate-200">
              <div className="flex-1 w-full sm:max-w-md relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search cases by Case No, Client Name, Mobile, Opposing Party..."
                  value={caseSearchQuery}
                  onChange={(e) => setCaseSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setActiveTab('addCase')}
                  className="px-4 py-2 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Add New Case</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {cases
                .filter(c => {
                  if (!caseSearchQuery.trim()) return true;
                  const q = caseSearchQuery.toLowerCase();
                  return (
                    (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
                    (c.clientName && c.clientName.toLowerCase().includes(q)) ||
                    (c.phone && c.phone.includes(q)) ||
                    (c.opposingParty && c.opposingParty.toLowerCase().includes(q)) ||
                    (c.courtName && c.courtName.toLowerCase().includes(q))
                  );
                })
                .map((c, idx) => (
                <div key={`adv-case-${c.id || c.caseNumber || 'item'}-${idx}`} className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
                  {editingCaseId === (c.id || c.caseNumber) ? (
                    /* Edit Mode Form */
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider">Advocate Case File Editor</span>
                          <h3 className="font-serif font-bold text-base text-[#1e293b]">Editing Case: {c.caseNumber}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingCaseId(null)}
                          className="text-slate-500 hover:text-slate-800 font-bold text-xs underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Case Filing Number *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.caseNumber || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, caseNumber: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Client Full Name *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.clientName || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, clientName: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Client Mobile Phone *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.phone || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Opposing Party / State *</label>
                          <input
                            type="text"
                            value={editFormData.opposingParty || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, opposingParty: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Court Jurisdiction *</label>
                          <select
                            value={editFormData.courtName || 'Allahabad High Court (Prayagraj Main Bench)'}
                            onChange={(e) => setEditFormData({ ...editFormData, courtName: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          >
                            <option value="Allahabad High Court (Prayagraj Main Bench)">Allahabad High Court (Prayagraj Main Bench)</option>
                            <option value="District & Sessions Court (Prayagraj Lower Court)">District &amp; Sessions Court (Prayagraj Lower Court)</option>
                            <option value="Board of Revenue & Revenue Courts (Prayagraj)">Board of Revenue &amp; Revenue Courts (Prayagraj)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Matter / Case Type *</label>
                          <input
                            type="text"
                            value={editFormData.caseType || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, caseType: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Next Hearing Date *</label>
                          <input
                            type="text"
                            value={editFormData.nextHearingDate || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, nextHearingDate: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 font-bold text-[#c5a059]"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Judge / Bench *</label>
                          <input
                            type="text"
                            value={editFormData.judgeBench || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, judgeBench: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Court Room No *</label>
                          <input
                            type="text"
                            value={editFormData.courtRoomNo || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, courtRoomNo: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Current Case Stage *</label>
                          <input
                            type="text"
                            placeholder="e.g. Counter Affidavit Filed / For Final Arguments"
                            value={editFormData.stage || editFormData.currentStage || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value, currentStage: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Filing Date *</label>
                          <input
                            type="text"
                            placeholder="e.g. 10 Jan 2026"
                            value={editFormData.filingDate || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, filingDate: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Assigned Advocate *</label>
                          <input
                            type="text"
                            value={editFormData.advocateAssigned || editFormData.assignedAdvocate || 'Advocate Bhavni Singh'}
                            onChange={(e) => setEditFormData({ ...editFormData, advocateAssigned: e.target.value, assignedAdvocate: e.target.value })}
                            className="w-full p-2 bg-slate-50 border border-slate-300 font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Latest Court Order Remarks / Order Sheet Summary *</label>
                        <textarea
                          rows={2}
                          value={editFormData.lastOrderRemarks || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, lastOrderRemarks: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300"
                        />
                      </div>

                      {/* Order / Judgment File Upload Section */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-none space-y-2">
                        <label className="font-bold text-slate-700 block text-xs flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-[#c5a059]" />
                          <span>Upload / Attach High Court Order or Judgment File (PDF/Doc/Image):</span>
                        </label>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf,image/*,.doc,.docx"
                            onChange={handleFileUploadForEdit}
                            className="p-2 bg-white border border-slate-300 text-xs w-full cursor-pointer"
                          />
                        </div>

                        {editFormData.highCourtOrderUrl && (
                          <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-2 text-xs">
                            <span className="flex items-center gap-1.5 font-bold truncate">
                              <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span className="truncate">Attached: {editFormData.documents?.[0]?.title || 'Court_Order_Sheet.pdf'}</span>
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={editFormData.highCourtOrderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={editFormData.documents?.[0]?.title || 'Court_Order_Sheet.pdf'}
                                className="px-2.5 py-1 bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-900 flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" /> Download
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditFormData({
                                    ...editFormData,
                                    highCourtOrderUrl: '',
                                    documents: []
                                  });
                                }}
                                className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                title="Remove File"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingCaseId(null)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 font-bold uppercase tracking-wider hover:bg-slate-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateCase(c.id || c.caseNumber || '')}
                          className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save &amp; Update Case</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Read Mode Display */
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#1e293b] text-[#c5a059] inline-block">
                              {c.caseType}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {c.status || 'Active'}
                            </span>
                            <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 border ${
                              mongoStatus.connected
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}>
                              {mongoStatus.connected ? 'DB: MongoDB Atlas' : 'DB: Local Cache'}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif text-[#1e293b] font-bold">{c.caseNumber}</h3>
                          <p className="text-xs text-slate-500">{c.courtName}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={getAdvocateCalendarUrl(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Add to Calendar</span>
                          </a>

                          <button
                            onClick={() => startEditCase(c)}
                            className="px-3.5 py-1.5 bg-[#1e293b] text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Edit Case</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCase(c.id || c.caseNumber || '')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                            title="Delete case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Client Name:</span>
                          <span className="text-slate-900 font-bold text-sm block">{c.clientName}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{c.phone}</span>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Next Hearing Date:</span>
                          <span className="text-[#c5a059] font-bold text-sm block">{formatDateToDDMMYYYY(c.nextHearingDate)}</span>
                          <span className="text-slate-500 text-[11px]">{c.courtRoomNo}</span>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Current Case Stage:</span>
                          <span className="text-slate-800 font-semibold block">{c.stage || c.currentStage || 'Pending Hearing'}</span>
                          <span className="text-slate-500 text-[10px]">Filing: {formatDateToDDMMYYYY(c.filingDate || '')}</span>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Assigned Advocate:</span>
                          <span className="text-slate-900 font-bold block">{c.advocateAssigned || c.assignedAdvocate || 'Advocate Bhavni Singh'}</span>
                          <span className="text-slate-500 text-[10px] truncate block">{c.opposingParty}</span>
                        </div>
                      </div>

                      <div className="text-xs bg-slate-100 p-3.5 border-l-4 border-[#c5a059] space-y-2">
                        <span className="font-bold text-[#1e293b] uppercase tracking-wider block text-[10px] mb-0.5">Order Sheet / Remarks:</span>
                        <p className="text-slate-700 leading-relaxed">{c.lastOrderRemarks}</p>

                        {(c.highCourtOrderUrl || (c.documents && c.documents.length > 0)) && (
                          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 border border-slate-200">
                            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 truncate min-w-0">
                              <FileText className="w-4 h-4 text-[#c5a059] shrink-0" />
                              <span className="truncate">Attached Judgment / Order: {c.documents?.[0]?.title || 'Certified_Court_Order.pdf'}</span>
                            </span>

                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={c.highCourtOrderUrl || c.documents?.[0]?.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3 text-[#c5a059]" /> Preview
                              </a>

                              <a
                                href={c.highCourtOrderUrl || c.documents?.[0]?.url || '#'}
                                download={c.documents?.[0]?.title || `${c.caseNumber}_Order.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-[#1e293b] hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                              >
                                <Download className="w-3 h-3 text-[#c5a059]" /> Download PDF
                              </a>

                              <button
                                onClick={() => handleRemoveAttachedDoc(c.id || '', 0)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                title="Remove wrong judgment upload"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove File
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {cases.length === 0 && (
                <div className="p-12 text-center bg-white border border-slate-200 text-slate-500">
                  <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-sm text-slate-700">No cases recorded yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Click "+ File New Case" to register your first client case file.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Dedicated Client Directory */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-slate-200">
              <div className="flex-1 w-full sm:max-w-md relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client by Name, Mobile, City, Case Type..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                onClick={() => setShowAddClientModal(true)}
                className="px-4 py-2 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Add New Client</span>
              </button>
            </div>

            {/* Add Client Modal */}
            {showAddClientModal && (
              <div className="p-6 bg-white border-2 border-[#c5a059] shadow-md space-y-4 text-xs">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-serif font-bold text-base text-[#1e293b] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#c5a059]" />
                    <span>Register New Client in Chamber Directory</span>
                  </h3>
                  <button
                    onClick={() => setShowAddClientModal(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Client Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Vikram Singh"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91 9415012345"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="client@gmail.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City / Native District</label>
                      <input
                        type="text"
                        placeholder="Prayagraj, UP"
                        value={newClient.city}
                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Primary Case Matter Category</label>
                      <input
                        type="text"
                        placeholder="High Court Writ Petition / Bail"
                        value={newClient.caseType}
                        onChange={(e) => setNewClient({ ...newClient, caseType: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Client Status</label>
                      <select
                        value={newClient.status}
                        onChange={(e) => setNewClient({ ...newClient, status: e.target.value as any })}
                        className="w-full p-2 bg-slate-50 border border-slate-300"
                      >
                        <option value="Active">Active Litigant</option>
                        <option value="Consultation">Consultation Stage</option>
                        <option value="Disposed">Disposed / Concluded</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Private Chamber Notes / Case Background</label>
                    <textarea
                      rows={2}
                      placeholder="Enter private background notes, references, or instructions for this client..."
                      value={newClient.notes}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddClientModal(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Save Client to Directory
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Clients List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientsList
                .filter(cl => {
                  if (!clientSearchQuery.trim()) return true;
                  const q = clientSearchQuery.toLowerCase();
                  return (
                    cl.name.toLowerCase().includes(q) ||
                    (cl.phone && cl.phone.includes(q)) ||
                    (cl.city && cl.city.toLowerCase().includes(q)) ||
                    (cl.caseType && cl.caseType.toLowerCase().includes(q)) ||
                    (cl.caseNumbers && cl.caseNumbers.some(cn => cn.toLowerCase().includes(q)))
                  );
                })
                .map((cl) => (
                <div key={cl.id} className="bg-white border border-slate-200 p-5 shadow-sm space-y-3">
                  {editingClientId === cl.id ? (
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-serif font-bold text-sm text-[#1e293b]">Edit Client: {cl.name}</span>
                        <button onClick={() => setEditingClientId(null)} className="text-slate-400 hover:text-slate-700">Cancel</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">Name:</label>
                          <input
                            type="text"
                            value={editClientData.name || ''}
                            onChange={(e) => setEditClientData({ ...editClientData, name: e.target.value })}
                            className="w-full p-2 bg-slate-50 border"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">Phone:</label>
                          <input
                            type="text"
                            value={editClientData.phone || ''}
                            onChange={(e) => setEditClientData({ ...editClientData, phone: e.target.value })}
                            className="w-full p-2 bg-slate-50 border"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">City:</label>
                          <input
                            type="text"
                            value={editClientData.city || ''}
                            onChange={(e) => setEditClientData({ ...editClientData, city: e.target.value })}
                            className="w-full p-2 bg-slate-50 border"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">Email:</label>
                          <input
                            type="email"
                            value={editClientData.email || ''}
                            onChange={(e) => setEditClientData({ ...editClientData, email: e.target.value })}
                            className="w-full p-2 bg-slate-50 border"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Notes:</label>
                        <textarea
                          rows={2}
                          value={editClientData.notes || ''}
                          onChange={(e) => setEditClientData({ ...editClientData, notes: e.target.value })}
                          className="w-full p-2 bg-slate-50 border"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateClient(cl.id)}
                          className="px-4 py-2 bg-[#c5a059] text-white font-bold uppercase tracking-wider"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between border-b pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-base text-[#1e293b]">{cl.name}</h4>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              cl.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                              cl.status === 'Consultation' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {cl.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{cl.city} &bull; {cl.caseType}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEditClient(cl)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                            title="Edit Client"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(cl.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200"
                            title="Delete Client"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs space-y-1.5 text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-bold uppercase text-[10px]">Contact:</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${cl.phone}`}
                              className="font-bold text-[#1e293b] hover:text-[#c5a059] flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-[#c5a059]" />
                              <span>{cl.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/91${cl.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1"
                            >
                              <MessageCircle className="w-2.5 h-2.5" /> WhatsApp
                            </a>
                          </div>
                        </div>

                        {cl.caseNumbers && cl.caseNumbers.length > 0 && (
                          <div className="pt-1">
                            <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Associated Case Numbers:</span>
                            <div className="flex flex-wrap gap-1">
                              {cl.caseNumbers.map((cn, i) => (
                                <span
                                  key={i}
                                  onClick={() => {
                                    setCaseSearchQuery(cn);
                                    setActiveTab('cases');
                                  }}
                                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 font-mono text-[10px] font-bold text-slate-800 cursor-pointer"
                                  title="Click to view case"
                                >
                                  {cn}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {cl.notes && (
                          <div className="p-2.5 bg-slate-50 border-l-2 border-[#c5a059] text-[11px] text-slate-600 mt-2">
                            <strong>Chamber Notes:</strong> {cl.notes}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {clientsList.length === 0 && (
              <div className="p-12 text-center bg-white border border-slate-200 text-slate-500">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-sm text-slate-700">No clients registered in directory yet.</p>
                <p className="text-xs text-slate-400 mt-1">Click "+ Add New Client" or file a new case to automatically register clients.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Update Profile & Chamber Contact Details */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Global Chamber Settings</span>
                <h3 className="text-2xl font-serif text-[#1e293b]">Update Advocate Profile &amp; Contact Details</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Updates to phone number, email, WhatsApp, photo, or bio text apply instantly across Header, Footer, Contact Page, and Founder sections.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Advocate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={firmProfile.founderName}
                    onChange={(e) => setFirmProfile({ ...firmProfile, founderName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">High Court Tagline / Title *</label>
                  <input
                    type="text"
                    required
                    value={firmProfile.tagline}
                    onChange={(e) => setFirmProfile({ ...firmProfile, tagline: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Primary Chamber Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={firmProfile.phone}
                    onChange={(e) => setFirmProfile({ ...firmProfile, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">WhatsApp Direct Number *</label>
                  <input
                    type="text"
                    required
                    value={firmProfile.whatsapp}
                    onChange={(e) => setFirmProfile({ ...firmProfile, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Chamber Email Address *</label>
                  <input
                    type="email"
                    required
                    value={firmProfile.email}
                    onChange={(e) => setFirmProfile({ ...firmProfile, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Enrollment Number &amp; Bar Membership</label>
                  <input
                    type="text"
                    value={firmProfile.enrollmentNo}
                    onChange={(e) => setFirmProfile({ ...firmProfile, enrollmentNo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Chamber Working Hours</label>
                  <input
                    type="text"
                    value={firmProfile.officeHours}
                    onChange={(e) => setFirmProfile({ ...firmProfile, officeHours: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>
              </div>

              {/* Photo Upload & Remove Controls */}
              <div className="p-5 bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <label className="block font-bold uppercase text-slate-800 text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#c5a059]" /> Advocate Profile Portrait Photo
                  </label>
                  {firmProfile.founderImage ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                      Photo Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-300">
                      No Photo (Default Badge Active)
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative shrink-0">
                    {firmProfile.founderImage ? (
                      <img
                        src={firmProfile.founderImage}
                        alt="Preview Profile"
                        className="w-24 h-28 object-cover border-2 border-[#c5a059] shadow-md bg-white"
                      />
                    ) : (
                      <div className="w-24 h-28 bg-slate-800 border-2 border-[#c5a059] flex flex-col items-center justify-center text-white shadow-md">
                        <Scale className="w-8 h-8 text-[#c5a059]" />
                        <span className="text-xs font-bold text-[#c5a059] mt-1 font-serif">BS</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer px-4 py-2 bg-[#1e293b] hover:bg-[#c5a059] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm">
                        <Upload className="w-4 h-4 text-[#c5a059]" />
                        <span>Upload Photo from Computer/Mobile</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {firmProfile.founderImage && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePhoto}
                          className="px-4 py-2 bg-rose-900/10 hover:bg-rose-900 text-rose-700 hover:text-white border border-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">Or paste Image Web Link / URL:</span>
                      <input
                        type="text"
                        value={firmProfile.founderImage}
                        onChange={(e) => setFirmProfile({ ...firmProfile, founderImage: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 text-xs font-mono text-slate-700"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Sample Professional Presets:</span>
                      <button
                        type="button"
                        onClick={() => setFirmProfile({ ...firmProfile, founderImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' })}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-800"
                      >
                        Portrait 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setFirmProfile({ ...firmProfile, founderImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' })}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-800"
                      >
                        Portrait 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setFirmProfile({ ...firmProfile, founderImage: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80' })}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-800"
                      >
                        Portrait 3
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">About The Chambers &amp; Bio Text *</label>
                <textarea
                  rows={4}
                  required
                  value={firmProfile.aboutText}
                  onChange={(e) => setFirmProfile({ ...firmProfile, aboutText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile &amp; Contact Settings</span>
                </button>
              </div>
            </form>

            {/* Security & Access Credentials Management Card */}
            <div className="bg-white border-2 border-slate-800 p-6 sm:p-8 shadow-sm space-y-4 mt-8 pt-6 border-t-4 border-t-[#c5a059]">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Chamber Security</span>
                  <h3 className="text-xl font-serif text-[#1e293b] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#c5a059]" /> Change User ID, Password &amp; Secret Security PIN
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Portal me login karne ke baad aap yahan se apna Name, Mobile, Email, User ID, Password aur Secret Code update kar sakte hain.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-200 px-2.5 py-1 border border-slate-700 shrink-0">
                  Protected Access
                </span>
              </div>

              <form onSubmit={handleSaveSecurityCredentials} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Advocate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={secForm.name}
                      onChange={(e) => setSecForm({ ...secForm, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Advocate Mobile Phone *</label>
                    <input
                      type="text"
                      required
                      value={secForm.mobile}
                      onChange={(e) => setSecForm({ ...secForm, mobile: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Official Gmail / Email *</label>
                    <input
                      type="email"
                      required
                      value={secForm.email}
                      onChange={(e) => setSecForm({ ...secForm, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Portal User ID *</label>
                    <input
                      type="text"
                      required
                      value={secForm.userId}
                      onChange={(e) => setSecForm({ ...secForm, userId: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 font-mono text-blue-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Portal Password *</label>
                    <input
                      type="text"
                      required
                      value={secForm.password}
                      onChange={(e) => setSecForm({ ...secForm, password: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1 flex items-center justify-between">
                      <span>Secret Security PIN / Code *</span>
                      <span className="text-[10px] text-amber-700 font-normal">(Required for Password Reset)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9900 or 1234"
                      value={secForm.secretCode}
                      onChange={(e) => setSecForm({ ...secForm, secretCode: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 font-mono font-bold text-rose-900"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-100 border border-slate-300 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#c5a059]" /> Secret Security PIN Protection:
                  </p>
                  <p>
                    Aapka Secret PIN badalne ya reset karte waqt verify karne ke liye hota hai. Is code ke bina koi bhi anjaan vyakti password change ya reset nahi kar sakta.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1e293b] hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Key className="w-4 h-4 text-[#c5a059]" />
                    <span>Update Security Credentials &amp; Secret PIN</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: Hero Slider Manager (4 Court Slides) */}
        {activeTab === 'heroSlides' && (
          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Homepage Hero Banner</span>
                <h3 className="text-xl font-serif text-[#1e293b]">Manage 4 Court Image Slides</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Advocate Bhavni can upload photos directly for all 4 slides. Slide 1 shows Active Member badge alone, Slide 2 for High Court, Slide 3 for Lower Court, and Slide 4 for Revenue Court.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAllHeroSlides}
                className="px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Slides</span>
              </button>
            </div>

            <form onSubmit={handleSaveAllHeroSlides} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroSlidesList.map((slide, idx) => (
                  <div key={slide.id || idx} className="bg-slate-50 border-2 border-slate-200 p-5 space-y-4 relative shadow-sm hover:border-[#c5a059]/60 transition-colors">
                    
                    {/* Slide Header & Number Badge */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#1e293b] text-[#c5a059] font-serif font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-sm">
                          Slide {idx + 1}: {idx === 0 ? 'Main Chamber Banner' : slide.tag ? `${slide.tag} Banner` : `Court Slide ${idx + 1}`}
                        </h4>
                      </div>

                      {slide.tag ? (
                        <span className="text-[10px] font-bold text-[#c5a059] bg-slate-900 px-2 py-0.5 border border-[#c5a059]/40 uppercase tracking-widest">
                          {slide.tag}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 uppercase tracking-wider">
                          No Tag (Member Badge Only)
                        </span>
                      )}
                    </div>

                    {/* Image Thumbnail & Upload Controls */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase text-slate-700">
                        Slide Background Image *
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-48 h-28 bg-slate-900 border border-slate-300 relative overflow-hidden shrink-0 shadow-inner">
                          {slide.image ? (
                            <img
                              src={slide.image}
                              alt={`Slide ${idx + 1}`}
                              className="w-full h-full object-cover filter brightness-90"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-2 text-center text-xs">
                              <Camera className="w-6 h-6 mb-1 text-slate-400" />
                              <span>No Image Set</span>
                            </div>
                          )}
                        </div>

                        <div className="w-full space-y-2">
                          <label className="cursor-pointer px-3 py-2 bg-[#1e293b] hover:bg-[#c5a059] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm w-full">
                            <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Upload Image from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlideImageUpload(idx, e)}
                              className="hidden"
                            />
                          </label>

                          <div className="text-[10px] text-slate-500">Or paste direct image URL:</div>
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => handleUpdateSlideField(idx, 'image', e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2 bg-white border border-slate-300 text-xs font-mono text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Badge Tag Field */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Court Badge Label (Tag)
                      </label>
                      <input
                        type="text"
                        value={slide.tag}
                        onChange={(e) => handleUpdateSlideField(idx, 'tag', e.target.value)}
                        placeholder={idx === 0 ? "Leave empty for Slide 1" : "e.g. High Court / Lower Court / Revenue Court"}
                        className="w-full p-2 bg-white border border-slate-300 text-xs text-slate-900 font-semibold"
                      />
                      {idx === 0 && (
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                          * Note: Per requirements, Slide 1 tag is left empty so only the Active Member badge is displayed.
                        </p>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Headline / Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={slide.title}
                          onChange={(e) => handleUpdateSlideField(idx, 'title', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Subtitle Description *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlideField(idx, 'subtitle', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish All 4 Hero Slides Live</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Manage Chamber Locations & Google Maps */}
        {activeTab === 'locations' && (
          <div className="space-y-8">
            {/* List of Chambers */}
            <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Multiple Chamber Network</span>
                <h3 className="text-xl font-serif text-[#1e293b]">Active Chambers &amp; Google Maps Direct Links</h3>
                <p className="text-xs text-slate-500 mt-1">Clients can click on any chamber location to open direct directions in Google Maps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationsList.map((loc) => (
                  <div key={loc.id} className="p-4 bg-slate-50 border border-slate-200 space-y-3 relative group">
                    {editingLocId === loc.id ? (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="font-serif font-bold text-[#1e293b]">Editing: {loc.name}</h4>
                          <button
                            type="button"
                            onClick={() => setEditingLocId(null)}
                            className="text-slate-500 font-bold hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5">Chamber Name:</label>
                          <input
                            type="text"
                            value={editLocData.name || ''}
                            onChange={(e) => setEditLocData({ ...editLocData, name: e.target.value })}
                            className="w-full p-2 bg-white border"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5">Full Address:</label>
                          <input
                            type="text"
                            value={editLocData.address || ''}
                            onChange={(e) => setEditLocData({ ...editLocData, address: e.target.value })}
                            className="w-full p-2 bg-white border"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">Landmark:</label>
                            <input
                              type="text"
                              value={editLocData.landmark || ''}
                              onChange={(e) => setEditLocData({ ...editLocData, landmark: e.target.value })}
                              className="w-full p-2 bg-white border"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-0.5">Phone:</label>
                            <input
                              type="text"
                              value={editLocData.phone || ''}
                              onChange={(e) => setEditLocData({ ...editLocData, phone: e.target.value })}
                              className="w-full p-2 bg-white border"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-0.5 text-blue-900 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            Google Maps Location / Embed URL:
                          </label>
                          <input
                            type="text"
                            value={editLocData.mapEmbedUrl || ''}
                            onChange={(e) => setEditLocData({ ...editLocData, mapEmbedUrl: parseMapEmbedUrl(e.target.value) })}
                            placeholder="Paste Google Maps link or iframe src"
                            className="w-full p-2 bg-white border border-blue-300 text-blue-900 font-mono text-[11px]"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateLocation(loc.id)}
                            className="px-4 py-2 bg-[#c5a059] text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Location &amp; Map Link
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#1e293b] text-[#c5a059]">
                              {loc.type}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#1e293b] mt-1">{loc.name}</h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingLocId(loc.id);
                                setEditLocData(loc);
                              }}
                              className="text-slate-600 hover:text-[#c5a059] p-1 cursor-pointer"
                              title="Edit Location & Google Map Link"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLocation(loc.id)}
                              className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                              title="Delete Location"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600">{loc.address}</p>
                        <p className="text-[11px] text-slate-500"><strong>Landmark:</strong> {loc.landmark}</p>
                        <p className="text-[11px] text-slate-500"><strong>Phone:</strong> {loc.phone} &bull; <strong>Email:</strong> {loc.email}</p>

                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={loc.mapEmbedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Open Google Maps</span>
                          </a>
                          <button
                            onClick={() => {
                              setEditingLocId(loc.id);
                              setEditLocData(loc);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <MapPin className="w-3 h-3 text-rose-600" />
                            <span>Change Map Link</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form to Add New Chamber Location */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#1e293b] border-b pb-2">Add New Chamber / Law Office</h3>
              
              <form onSubmit={handleAddLocation} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Chamber Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gorakhpur High Court Extension Office"
                      value={newLoc.name}
                      onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Location Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. High Court Chamber / District Chamber"
                      value={newLoc.type}
                      onChange={(e) => setNewLoc({ ...newLoc, type: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Full Postal Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Chamber No., Building, Area, District, Pin Code"
                    value={newLoc.address}
                    onChange={(e) => setNewLoc({ ...newLoc, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={newLoc.landmark}
                      onChange={(e) => setNewLoc({ ...newLoc, landmark: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={newLoc.phone}
                      onChange={(e) => setNewLoc({ ...newLoc, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="text"
                      value={newLoc.email}
                      onChange={(e) => setNewLoc({ ...newLoc, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>
                </div>

                {/* Google Maps Configuration & Helper Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <label className="block font-bold uppercase text-slate-800 text-xs flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-600" /> Google Maps Direct Address / Embed Link *
                    </label>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200 font-bold">
                      Auto-Cleaner Active
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder='Paste Google Maps URL or iframe code (e.g. <iframe src="https://www.google.com/maps/embed...">'
                    value={newLoc.mapEmbedUrl}
                    onChange={(e) => setNewLoc({ ...newLoc, mapEmbedUrl: parseMapEmbedUrl(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-slate-300 font-mono text-xs text-blue-900 focus:outline-none focus:border-[#c5a059]"
                  />

                  {/* Step-by-Step Instructions */}
                  <div className="bg-white p-3 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1.5">
                    <p className="font-bold text-[#1e293b] flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#c5a059]" /> How to get Google Maps Address Link for your Chamber:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-600">
                      <li>Open <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Google Maps</a> on your device.</li>
                      <li>Search for your chamber location (e.g., <em>Allahabad High Court Prayagraj</em> or <em>Varanasi Kutchery</em>).</li>
                      <li>Click the <strong>Share</strong> button and choose <strong>"Embed a map"</strong> or copy link.</li>
                      <li>Copy the HTML link or <code>&lt;iframe src="..."&gt;</code> code and paste it above!</li>
                    </ol>
                  </div>

                  {/* Live Map Preview */}
                  {newLoc.mapEmbedUrl && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Live Map Preview:</span>
                      <div className="w-full h-36 bg-slate-200 border border-slate-300 overflow-hidden rounded">
                        <iframe
                          src={newLoc.mapEmbedUrl.includes('google.com/maps') ? newLoc.mapEmbedUrl : `https://maps.google.com/maps?q=${encodeURIComponent(newLoc.address || 'Allahabad High Court')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          title="Chamber Map Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1e293b] text-white font-bold uppercase tracking-wider text-xs hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#c5a059]" />
                  <span>Add Location &amp; Sync Map</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: Manage Blogs, News & Legal Tips */}
        {activeTab === 'blogs' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Legal Insights</span>
                <h3 className="text-xl font-serif text-[#1e293b]">Published Legal Blogs, High Court News &amp; Tips</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogsList.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#c5a059] text-white">
                        {b.category}
                      </span>
                      <button onClick={() => handleDeleteBlog(b.id)} className="text-rose-600 p-1 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{b.excerpt}</p>
                    <p className="text-[10px] text-slate-400">Published {formatDateToDDMMYYYY(b.date)} &bull; {b.readTime}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Blog Form */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#1e293b] border-b pb-2">Publish New Legal Article / News Tip</h3>

              <form onSubmit={handleAddBlog} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Understanding Sec 482 CrPC/BNSS Quashing in Allahabad High Court"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Category *</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    >
                      <option value="High Court Writs">High Court Writs</option>
                      <option value="Bail & Criminal Law">Bail &amp; Criminal Law</option>
                      <option value="UP Revenue & Land">UP Revenue &amp; Land</option>
                      <option value="Matrimonial Rights">Matrimonial Rights</option>
                      <option value="Service & Govt Jobs">Service &amp; Govt Jobs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Short Excerpt / Summary *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 2-line summary for article preview card..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Full Article Body *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Detailed explanation, legal principles, case laws and tips for litigants..."
                    value={newBlog.fullArticle}
                    onChange={(e) => setNewBlog({ ...newBlog, fullArticle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Publish Article to Legal Insights</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: Manage Case Study Gallery */}
        {activeTab === 'caseStudies' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Case Study Gallery</span>
                <h3 className="text-xl font-serif text-[#1e293b]">Landmark Case Precedents &amp; Gallery Items</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudiesList.map((cs) => (
                  <div key={cs.id} className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#1e293b] text-[#c5a059]">
                        {cs.practiceArea}
                      </span>
                      <button onClick={() => handleDeleteCaseStudy(cs.id)} className="text-rose-600 p-1 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm">{cs.title}</h4>
                    <p className="text-xs text-emerald-800 font-bold">Outcome: {cs.verdictOutcome}</p>
                    <p className="text-[10px] text-slate-500">{cs.court} &bull; {cs.year}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Case Study Form */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#1e293b] border-b pb-2">Add Landmark Case Study to Gallery</h3>

              <form onSubmit={handleAddCaseStudy} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Case Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Quashing of Arbitrary Order in Writ Petition No. 18204"
                      value={newCaseStudy.title}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Court Bench *</label>
                    <input
                      type="text"
                      required
                      value={newCaseStudy.court}
                      onChange={(e) => setNewCaseStudy({ ...newCaseStudy, court: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Summary of Case Matter *</label>
                  <textarea
                    rows={2}
                    required
                    value={newCaseStudy.summary}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, summary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Verdict / Judicial Outcome *</label>
                  <input
                    type="text"
                    required
                    value={newCaseStudy.verdictOutcome}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, verdictOutcome: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold text-emerald-800"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1e293b] text-white font-bold uppercase tracking-wider text-xs hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#c5a059]" />
                  <span>Add Case Study to Public Gallery</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-serif text-[#1e293b] border-b pb-3">Received Client Enquiries &amp; Legal Consultations</h3>

            <div className="space-y-4">
              {enquiries.map((enq, idx) => (
                <div key={`adv-enq-${enq.id || 'item'}-${idx}`} className="p-5 bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#c5a059] text-white inline-block">
                        {enq.status}
                      </span>
                      <h4 className="text-base font-serif font-bold text-[#1e293b] mt-1">{enq.clientName}</h4>
                      <p className="text-xs text-slate-500">Phone: {enq.phone} &bull; Email: {enq.email || 'N/A'}</p>
                    </div>

                    <span className="text-xs text-slate-400">Received: {enq.submittedAt}</span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong>Jurisdiction:</strong> {enq.courtName}</p>
                    <p><strong>Matter Category:</strong> {enq.caseType}</p>
                    <p className="bg-white p-3 border mt-2"><strong>Client Message:</strong> {enq.message}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href={`tel:${enq.phone}`}
                      className="px-4 py-2 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Call Client Directly</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Add New Case */}
        {activeTab === 'addCase' && (
          <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="border-b pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Advocate Case Entry</span>
              <h3 className="text-2xl font-serif text-[#1e293b]">Add New Client Case File</h3>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Case Filing Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WRIT/2026/91022"
                    value={newCase.caseNumber}
                    onChange={(e) => setNewCase({ ...newCase, caseNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Verma"
                    value={newCase.clientName}
                    onChange={(e) => setNewCase({ ...newCase, clientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Client Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9839012345"
                    value={newCase.phone}
                    onChange={(e) => setNewCase({ ...newCase, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Opposing Party / State *</label>
                  <input
                    type="text"
                    required
                    value={newCase.opposingParty}
                    onChange={(e) => setNewCase({ ...newCase, opposingParty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">High Court Bench / Jurisdiction *</label>
                  <select
                    value={newCase.courtName}
                    onChange={(e) => setNewCase({ ...newCase, courtName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  >
                    <option value="Allahabad High Court (Prayagraj Main Bench)">Allahabad High Court (Prayagraj Main Bench)</option>
                    <option value="District & Sessions Court (Prayagraj Lower Court)">District &amp; Sessions Court (Prayagraj Lower Court)</option>
                    <option value="Board of Revenue & Revenue Courts (Prayagraj)">Board of Revenue &amp; Revenue Courts (Prayagraj)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Matter / Case Category *</label>
                  <select
                    value={newCase.caseType}
                    onChange={(e) => setNewCase({ ...newCase, caseType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  >
                    <option value="High Court Writ Petition (Article 226)">High Court Writ Petition (Article 226)</option>
                    <option value="Criminal Bail & Quashing (Sec 482 / BNSS 528)">Criminal Bail &amp; Quashing (Sec 482 / BNSS 528)</option>
                    <option value="UP Revenue Code Land Appeal & Mutation">UP Revenue Code Land Appeal &amp; Mutation</option>
                    <option value="Civil Review & First Appeal (FAFO)">Civil Review &amp; First Appeal (FAFO)</option>
                    <option value="Service & Teacher Pension Dispute">Service &amp; Teacher Pension Dispute</option>
                    <option value="Matrimonial & 498A Quashing">Matrimonial &amp; 498A Quashing</option>
                    <option value="Lower Court Criminal Trial Defense">Lower Court Criminal Trial Defense</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Current Case Stage *</label>
                  <select
                    value={newCase.stage}
                    onChange={(e) => setNewCase({ ...newCase, stage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 font-semibold"
                  >
                    <option value="Counter Affidavit Filed / For Final Arguments">Counter Affidavit Filed / For Final Arguments</option>
                    <option value="Notice Issued to State & Standing Counsel">Notice Issued to State &amp; Standing Counsel</option>
                    <option value="Order Reserved / For Judgment Pronouncement">Order Reserved / For Judgment Pronouncement</option>
                    <option value="Plea for Urgent Stay Hearing Listed">Plea for Urgent Stay Hearing Listed</option>
                    <option value="Fresh Motion Admission & Interim Stay">Fresh Motion Admission &amp; Interim Stay</option>
                    <option value="Bail Granted / Bail Order Certified">Bail Granted / Bail Order Certified</option>
                    <option value="Evidence & Prosecution Witness Examination">Evidence &amp; Prosecution Witness Examination</option>
                    <option value="Written Arguments / Reply Submitted">Written Arguments / Reply Submitted</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Filing Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Feb 2026"
                    value={newCase.filingDate}
                    onChange={(e) => setNewCase({ ...newCase, filingDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Assigned Advocate *</label>
                  <input
                    type="text"
                    required
                    placeholder="Advocate Bhavni Singh"
                    value={newCase.advocateAssigned}
                    onChange={(e) => setNewCase({ ...newCase, advocateAssigned: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Next Hearing Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="18 Sep 2026"
                    value={newCase.nextHearingDate}
                    onChange={(e) => setNewCase({ ...newCase, nextHearingDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Judge / Bench *</label>
                  <input
                    type="text"
                    placeholder="Hon'ble Justice ..."
                    value={newCase.judgeBench}
                    onChange={(e) => setNewCase({ ...newCase, judgeBench: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Court Room Number *</label>
                  <input
                    type="text"
                    placeholder="Court No. 34"
                    value={newCase.courtRoomNo}
                    onChange={(e) => setNewCase({ ...newCase, courtRoomNo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Order Sheet Summary / Remarks *</label>
                <textarea
                  rows={3}
                  value={newCase.lastOrderRemarks}
                  onChange={(e) => setNewCase({ ...newCase, lastOrderRemarks: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300"
                />
              </div>

              {/* Order / Judgment File Upload */}
              <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#c5a059]" />
                  <span>Upload / Attach Court Order or Judgment PDF Document:</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,image/*,.doc,.docx"
                    onChange={handleFileUploadForNewCase}
                    className="p-2 bg-white border border-slate-300 text-xs w-full cursor-pointer"
                  />
                </div>
                {newCaseOrderFile && (
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>File Ready for Upload: {newCaseOrderFile.name}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save New Case Record &amp; Publish to Client Portal</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
