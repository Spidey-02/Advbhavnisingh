import React, { useState, useEffect } from 'react';
import { INITIAL_CLIENT_CASES, FIRM_DETAILS, OFFICE_LOCATIONS } from '../data/legalData';
import { ClientCase, EnquiryItem, OfficeLocation, BlogPost, CaseStudy } from '../types';
import { getApiUrl } from '../config';
import {
  getStoredFirmDetails,
  saveFirmDetails,
  getStoredOfficeLocations,
  saveOfficeLocations,
  getStoredBlogs,
  saveBlogs,
  getStoredCaseStudies,
  saveCaseStudies,
  FirmDetailsType
} from '../data/firmStore';
import {
  Scale, Users, Calendar, Plus, Edit2, CheckCircle2, MapPin, Search, Trash2,
  ExternalLink, Save, Phone, Mail, Clock, Eye, Upload, Download, FileText,
  MessageSquare, BookOpen, User, Settings, Navigation, X, Sparkles, QrCode,
  Lock, LogOut, Key, HelpCircle, Database, RefreshCw, Camera, Check
} from 'lucide-react';

export const AdvocatePortalPage: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bhavani_portal_authed') === 'true';
  });
  const [loginUserId, setLoginUserId] = useState('bhavani.singh');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // MongoDB Status & Sync State
  const [mongoStatus, setMongoStatus] = useState<{ configured: boolean; connected: boolean }>({
    configured: false,
    connected: false
  });
  const [syncingMongo, setSyncingMongo] = useState(false);

  const [cases, setCases] = useState<ClientCase[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [firmProfile, setFirmProfile] = useState<FirmDetailsType>(getStoredFirmDetails());
  const [locationsList, setLocationsList] = useState<OfficeLocation[]>(getStoredOfficeLocations());
  const [blogsList, setBlogsList] = useState<BlogPost[]>(getStoredBlogs());
  const [caseStudiesList, setCaseStudiesList] = useState<CaseStudy[]>(getStoredCaseStudies());

  const [activeTab, setActiveTab] = useState<
    'cases' | 'enquiries' | 'addCase' | 'profile' | 'locations' | 'blogs' | 'caseStudies'
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

  // Auth Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUserId.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (
      (cleanUser === 'bhavani.singh' || cleanUser === 'bhavani' || cleanUser === 'admin') &&
      (cleanPass === 'password123' || cleanPass === 'bhavani123' || cleanPass === 'bhavani2026')
    ) {
      sessionStorage.setItem('bhavani_portal_authed', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid User ID or Password. Default User ID: bhavani.singh | Password: password123');
    }
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
    nextHearingDate: '18 Sep 2026',
    judgeBench: 'Hon\'ble Justice Rameshwar Nath & Justice A.K. Roy',
    courtRoomNo: 'Court No. 34',
    status: 'Pending Hearing',
    stage: 'Counter Affidavit Filed / For Final Arguments',
    lastOrderRemarks: 'Court directed State counsel to produce original revenue records on next date.',
    highCourtOrderUrl: FIRM_DETAILS.highCourtOfficialPortal
  });

  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ClientCase>>({});

  // States for adding location, blog, case study
  const [newLoc, setNewLoc] = useState({
    name: 'District & Sessions Court Chamber',
    type: 'District Chamber',
    address: 'Chamber No. 12, Lawyers Block, District Court Compound, Varanasi, UP - 221001',
    landmark: 'Near Kutchery Gate No. 2',
    phone: firmProfile.phone,
    email: firmProfile.email,
    hours: 'Mon - Sat: 10:00 AM - 5:00 PM',
    mapEmbedUrl: `https://maps.google.com/?q=Varanasi+District+Court`
  });

  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'High Court Writs',
    author: 'Advocate Bhavni Singh',
    authorRole: 'Senior Advocate — Allahabad High Court',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    fullArticle: '',
    tags: 'High Court, Writs, Legal Tips'
  });

  const [newCaseStudy, setNewCaseStudy] = useState({
    title: '',
    practiceArea: 'High Court Writ Petition',
    court: 'Allahabad High Court (Prayagraj)',
    year: '2026',
    summary: '',
    challenge: '',
    strategy: '',
    verdictOutcome: 'Writ Petition Allowed with Landmark Directions',
    category: 'writ' as const,
    clientAnonymized: 'Confidential Litigant'
  });

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
    setCases(localCases);

    // Fetch live cases from MongoDB Atlas if active
    fetch(getApiUrl('/api/cases'))
      .then(r => r.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.cases) && data.cases.length > 0) {
          setCases(data.cases);
          localStorage.setItem('bhavani_cases', JSON.stringify(data.cases));
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
          clientName: 'Suresh Chandra Yadav',
          phone: '+91 9839120091',
          email: 'suresh.yadav@gmail.com',
          caseType: 'Land Revenue Dispute (UP Revenue Code)',
          courtName: 'Allahabad High Court (Prayagraj)',
          message: 'Wants to file Writ Petition challenging SDM land eviction order in District Jaunpur.',
          submittedAt: '06 Aug 2026',
          status: 'New'
        },
        {
          id: 'ENQ-902',
          clientName: 'Anil Gupta',
          phone: '+91 9415099812',
          email: 'anilgupta.vns@gmail.com',
          caseType: 'High Court Bail Application',
          courtName: 'Allahabad High Court (Prayagraj)',
          message: 'Bail application in FIR No. 341/2026 under IPC 420/467/468 at Varanasi.',
          submittedAt: '05 Aug 2026',
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
    setCases(updated);
    localStorage.setItem('bhavani_cases', JSON.stringify(updated));

    // Auto-sync to MongoDB Atlas cloud database
    try {
      const res = await fetch(getApiUrl('/api/cases/sync-all'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: updated })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Case record updated & auto-synced to MongoDB Atlas cloud database!');
      } else {
        triggerToast('Case record updated & saved locally across portals!');
      }
    } catch (err) {
      triggerToast('Case record updated & saved locally across portals!');
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
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
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
    const created: ClientCase = {
      id: 'case-' + Date.now().toString(),
      caseNumber: newCase.caseNumber,
      clientName: newCase.clientName,
      phone: newCase.phone,
      opposingParty: newCase.opposingParty,
      caseType: newCase.caseType,
      courtName: newCase.courtName,
      nextHearingDate: newCase.nextHearingDate,
      judgeBench: newCase.judgeBench,
      courtRoomNo: newCase.courtRoomNo,
      status: newCase.status,
      stage: newCase.stage,
      filingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      advocateAssigned: firmProfile.founderName || 'Advocate Bhavni Singh',
      lastOrderRemarks: newCase.lastOrderRemarks,
      highCourtOrderUrl: newCaseOrderFile ? newCaseOrderFile.url : newCase.highCourtOrderUrl,
      documents: newCaseOrderFile ? [
        {
          title: newCaseOrderFile.name,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          size: '1.2 MB',
          type: 'Court Order / Judgment PDF',
          url: newCaseOrderFile.url
        }
      ] : []
    };

    const updated = [created, ...cases];
    saveCasesToStorage(updated);
    setNewCaseOrderFile(null);
    setActiveTab('cases');
  };

  // Edit Case
  const startEditCase = (c: ClientCase) => {
    setEditingCaseId(c.id || '');
    setEditFormData(c);
  };

  const handleUpdateCase = (id: string) => {
    const updated = cases.map(c => c.id === id ? { ...c, ...editFormData } : c);
    saveCasesToStorage(updated);
    setEditingCaseId(null);
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm('Are you sure you want to remove this case record?')) {
      const updated = cases.filter(c => c.id !== id);
      saveCasesToStorage(updated);
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
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
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
            <h1 className="text-2xl font-serif text-white">Advocate Bhavni Portal</h1>
            <p className="text-xs text-slate-400">High Court, Lower Courts &amp; Revenue Courts Chambers &bull; Prayagraj</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/80 border border-rose-600 text-rose-200 text-xs text-center font-medium shadow-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#c5a059]" /> User ID / Access Name *
              </label>
              <input
                type="text"
                required
                value={loginUserId}
                onChange={(e) => setLoginUserId(e.target.value)}
                placeholder="e.g. bhavani.singh"
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
                  placeholder="Enter password"
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

            <div className="bg-slate-900/80 p-3 border border-slate-700 rounded text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-[#c5a059] uppercase text-[10px] flex items-center gap-1">
                <Lock className="w-3 h-3" /> Default Chamber Credentials:
              </p>
              <p>&bull; <strong>User ID:</strong> <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">bhavani.singh</code></p>
              <p>&bull; <strong>Password:</strong> <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">password123</code></p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a059] hover:bg-[#a88442] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate &amp; Open Portal</span>
            </button>
          </form>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Active Cases</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{cases.length}</span>
              <Scale className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Client Enquiries</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{enquiries.length}</span>
              <Mail className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Legal Articles / News</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-serif text-[#1e293b]">{blogsList.length}</span>
              <BookOpen className="w-6 h-6 text-[#c5a059]" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chamber Locations</span>
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
              activeTab === 'cases' ? 'border-[#c5a059] text-[#1e293b] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cases &amp; Orders ({cases.length})
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Registered Client Cases with Attached Court Orders:
              </span>
              <button
                onClick={() => setActiveTab('addCase')}
                className="px-4 py-2 bg-[#1e293b] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Add New Case</span>
              </button>
            </div>

            <div className="space-y-4">
              {cases.map((c, idx) => (
                <div key={`adv-case-${c.id || c.caseNumber || 'item'}-${idx}`} className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
                  {editingCaseId === c.id ? (
                    /* Edit Mode Form */
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-serif font-bold text-base text-[#1e293b]">Editing Case: {c.caseNumber}</h3>
                        <button
                          onClick={() => setEditingCaseId(null)}
                          className="text-slate-400 hover:text-slate-700 font-bold"
                        >
                          Cancel Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-600">Case Number:</label>
                          <input
                            type="text"
                            value={editFormData.caseNumber || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, caseNumber: e.target.value })}
                            className="w-full p-2 bg-slate-50 border mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600">Client Name:</label>
                          <input
                            type="text"
                            value={editFormData.clientName || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, clientName: e.target.value })}
                            className="w-full p-2 bg-slate-50 border mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600">Client Phone:</label>
                          <input
                            type="text"
                            value={editFormData.phone || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            className="w-full p-2 bg-slate-50 border mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-600">Next Hearing Date:</label>
                          <input
                            type="text"
                            value={editFormData.nextHearingDate || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, nextHearingDate: e.target.value })}
                            className="w-full p-2 bg-slate-50 border mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600">Judge / Bench:</label>
                          <input
                            type="text"
                            value={editFormData.judgeBench || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, judgeBench: e.target.value })}
                            className="w-full p-2 bg-slate-50 border mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600">Court Room No:</label>
                          <input
                            type="text"
                            value={editFormData.courtRoomNo || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, courtRoomNo: e.target.value })}
                            className="w-full p-2 bg-slate-50 border mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-600">Latest Court Order Remarks / Notes:</label>
                        <textarea
                          rows={2}
                          value={editFormData.lastOrderRemarks || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, lastOrderRemarks: e.target.value })}
                          className="w-full p-2 bg-slate-50 border mt-1"
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
                          onClick={() => handleUpdateCase(c.id || '')}
                          className="px-6 py-2.5 bg-[#c5a059] text-white font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Read Mode Display */
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#1e293b] text-[#c5a059] inline-block mb-1">
                            {c.caseType}
                          </span>
                          <h3 className="text-xl font-serif text-[#1e293b]">{c.caseNumber}</h3>
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
                            className="px-3 py-1.5 bg-[#1e293b] text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Edit Case</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCase(c.id || '')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                            title="Delete case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                        <div className="p-3 bg-slate-50 border">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Client Name:</span>
                          <span className="text-slate-800 font-bold">{c.clientName} ({c.phone})</span>
                        </div>

                        <div className="p-3 bg-slate-50 border">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Next Hearing Date:</span>
                          <span className="text-[#c5a059] font-bold text-sm">{c.nextHearingDate}</span>
                        </div>

                        <div className="p-3 bg-slate-50 border">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Bench / Courtroom:</span>
                          <span className="text-slate-800 font-semibold">{c.courtRoomNo} &bull; {c.judgeBench}</span>
                        </div>

                        <div className="p-3 bg-slate-50 border">
                          <span className="text-slate-400 font-bold uppercase block text-[10px]">Case Stage:</span>
                          <span className="text-slate-800 font-semibold">{c.stage}</span>
                        </div>
                      </div>

                      <div className="text-xs bg-slate-100 p-3 border-l-4 border-[#c5a059] space-y-2">
                        <span className="font-bold text-[#1e293b] uppercase tracking-wider block text-[10px] mb-0.5">Order Sheet / Remarks:</span>
                        <p className="text-slate-700">{c.lastOrderRemarks}</p>

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
            </div>
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
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#1e293b] text-[#c5a059]">
                          {loc.type}
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#1e293b] mt-1">{loc.name}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteLocation(loc.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Delete Location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600">{loc.address}</p>
                    <p className="text-[11px] text-slate-500"><strong>Landmark:</strong> {loc.landmark}</p>
                    <p className="text-[11px] text-slate-500"><strong>Phone:</strong> {loc.phone} &bull; <strong>Email:</strong> {loc.email}</p>

                    <a
                      href={loc.mapEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open Google Maps</span>
                    </a>
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
                    <p className="text-[10px] text-slate-400">Published {b.date} &bull; {b.readTime}</p>
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
                    <option value="Allahabad High Court (Prayagraj)">Allahabad High Court (Prayagraj)</option>
                    <option value="District & Sessions Court (Prayagraj Lower Court)">District &amp; Sessions Court (Prayagraj Lower Court)</option>
                    <option value="Board of Revenue & Revenue Courts (Prayagraj)">Board of Revenue &amp; Revenue Courts (Prayagraj)</option>
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Judge / Bench *</label>
                  <input
                    type="text"
                    value={newCase.judgeBench}
                    onChange={(e) => setNewCase({ ...newCase, judgeBench: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Court Room Number *</label>
                  <input
                    type="text"
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
