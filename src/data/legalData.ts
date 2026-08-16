import { PracticeArea, CaseStudy, BlogPost, Testimonial, OfficeLocation, ClientCase, EnquiryItem } from '../types';

export const FIRM_DETAILS = {
  name: "BHAVANI SINGH & ASSOCIATES",
  tagline: "ADVOCATE — ALLAHABAD HIGH COURT, LOWER COURTS & REVENUE COURTS (PRAYAGRAJ)",
  founderName: "Advocate Bhavani Singh",
  enrollmentNo: "UP/2022/HCBA (High Court Bar Association Prayagraj)",
  foundedYear: 2022,
  phone: "+91 9415211990",
  altPhone: "+91 9415211991",
  email: "chambers.bhavanisingh@gmail.com",
  officeHours: "Mon - Sat: 9:00 AM - 8:30 PM",
  mainAddress: "Chamber No. 402, High Court Bar Association Building, Allahabad High Court, Prayagraj (Allahabad), UP - 211001",
  mainOffice: "Plot 14-B, Tashkent Marg, Near Civil Lines Post Office, Prayagraj, UP - 211001",
  lowerCourtChamber: "District & Sessions Court Chamber Complex, Kutchery, Prayagraj, UP - 211002",
  revenueCourtChamber: "Board of Revenue Courts Chamber, Kutchery Compound, Prayagraj, UP - 211002",
  chambers: {
    prayagraj: "Chamber No. 402, High Court Bar Association Building, Allahabad High Court, Prayagraj, UP - 211001",
    lowerCourt: "District & Sessions Court Chambers, Kutchery, Prayagraj, UP - 211002",
    revenueCourt: "Board of Revenue Chambers, Prayagraj, UP - 211002"
  },
  barMemberships: "Active Member - High Court Bar Association Allahabad",
  highCourtOfficialPortal: "https://allahabadhighcourt.in/",
  highCourtCaseStatusPortal: "https://allahabadhighcourt.in/case_status.html",
  highCourtJudgmentsPortal: "https://www.allahabadhighcourt.in/jo.htm",
  eCourtsPortal: "https://services.ecourts.gov.in/ecourtindiaHC/",
  lowerCourtCaseStatusPortal: "https://services.ecourts.gov.in/ecourtindia_v6/",
  lowerCourtDistrictPortal: "https://districts.ecourts.gov.in/prayagraj",
  revenueCourtCaseStatusPortal: "https://vaad.up.nic.in/",
  boardOfRevenuePortal: "https://bor.up.nic.in/",
  stats: {
    leadingSince: "2022",
    experiencedAttorneys: "8+",
    happyClients: "1500+",
    successRatio: "95%",
    districtsCovered: "Prayagraj Jurisdiction"
  }
};

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: "allahabad-high-court-writs",
    title: "High Court Writ Petitions",
    shortDesc: "Specialized Constitutional Writs (Art. 226/227) before the Hon'ble High Court of Judicature at Allahabad for land, service & fundamental rights.",
    category: "writ",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    keyServices: [
      "Writ Petition (Civil) & Writ Petition (Criminal) under Article 226",
      "Quashing of Illegal FIRs / Stay on Arrest (Art. 226 Petitions)",
      "Service Writs for UP Govt Employees (Seniority, Promotion, Salary)",
      "Revenue & Land Acquisition Writs (UP Revenue Code / Land Ceiling)",
      "Mandamus, Certiorari & Habeas Corpus Petitions"
    ],
    fullDetails: "Advocate Bhavani Singh has argued hundreds of landmark writ petitions before the Allahabad High Court. We challenge unconstitutional government actions, illegal property seizures, arbitrary service dismissals, and malicious criminal proceedings."
  },
  {
    id: "criminal-appeal-bail-high-court",
    title: "High Court Bail & Criminal Appeals",
    shortDesc: "Aggressive representation for Anticipatory Bail, Regular Bail, and Criminal Appeals before the High Court of Judicature at Allahabad.",
    category: "criminal",
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
    keyServices: [
      "Section 482 CrPC / BNSS Petitions for Quashing Criminal Cases",
      "Anticipatory & Regular Bail before Allahabad High Court",
      "First & Second Criminal Appeals against Session Convictions",
      "Suspension of Sentence & Interim Release Orders",
      "Gangster Act, NDPS, POCSO & SC/ST Act Special Bail Applications"
    ],
    fullDetails: "When liberty is threatened, immediate high-court interventions are vital. Advocate Bhavani Singh specializes in swift bail petitions and quashing frivolous criminal proceedings across Uttar Pradesh."
  },
  {
    id: "revenue-land-disputes",
    title: "Land & Revenue Disputes",
    shortDesc: "Comprehensive legal defense in UP Revenue Code, Land Acquisition, Revenue Board Appeals, and Title Suits.",
    category: "civil",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    keyServices: [
      "Board of Revenue Appeals & Revision Petitions (Prayagraj)",
      "UP Revenue Code Sec 24 Boundary Demarcation & Mutation Suits",
      "Land Acquisition Compensation Enhancement Petitions",
      "Zamidari Abolition & Land Reforms (ZALR) Act Disputes",
      "Civil Title Injunctions & Partition Suits"
    ],
    fullDetails: "Managing complex agrarian and commercial land litigation requires deep mastery of UP state land codes and Board of Revenue precedents."
  },
  {
    id: "matrimonial-divorce-allahabad",
    title: "Matrimonial & Family Law",
    shortDesc: "Expert legal counsel for Mutual Consent & Contested Divorces, Maintenance, 498A Defense, and Child Custody before Family & High Courts.",
    category: "family",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    keyServices: [
      "Mutual Consent Divorce under Sec 13B Hindu Marriage Act",
      "Contested Divorce Proceedings & High Court First Appeals (FAFO)",
      "Maintenance Claims (Sec 125 CrPC / Sec 144 BNSS)",
      "Quashing of Frivolous 498A / Dowry Complaints",
      "Child Custody & Guardianship Writs"
    ],
    fullDetails: "Handling delicate matrimonial disputes with high confidentiality while protecting client interests in Family Courts and High Court First Appeals."
  },
  {
    id: "service-matters-up-govt",
    title: "UP Service & Administrative Matters",
    shortDesc: "Defending state government employees, police personnel, teachers, and PSU officials in service disputes & State Public Services Tribunal.",
    category: "tribunal",
    imageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80",
    keyServices: [
      "High Court Service Writs against Arbitrary Suspensions",
      "Seniority List & Promotion Denial Challenges",
      "High Court & Lower Court Administrative Service Petitions",
      "Pension, Gratuity & GPF Withholding Recovery",
      "Departmental Inquiry Defense & Show Cause Answers"
    ],
    fullDetails: "Advocate Bhavani Singh routinely represents government servants across UP against adverse entry orders, wrongful suspensions, and pension delays."
  },
  {
    id: "supreme-court-appeals-slp",
    title: "Supreme Court SLPs & Appeals",
    shortDesc: "Direct representation before the Supreme Court of India in Special Leave Petitions (SLPs), Transfer Petitions, and Writ Writs.",
    category: "tribunal",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    keyServices: [
      "Special Leave Petition (Civil) & (Criminal) against High Court Judgments",
      "Transfer Petitions for Matrimonial Cases to different States",
      "Article 32 Fundamental Rights Writ Petitions",
      "Review & Curative Petitions",
      "Urgent Stay Applications before SC Bench"
    ],
    fullDetails: "Seamless appellate litigation transition from Allahabad High Court to the Supreme Court of India in New Delhi."
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-hc-01",
    title: "Landmark Writ Petition Quashing Arbitrary Acquisition Order & Restoring 18 Acres Land",
    practiceArea: "High Court Writ & Revenue Law",
    court: "Hon'ble High Court of Judicature at Allahabad",
    year: "2025",
    summary: "Successfully secured a favorable judgment in Writ-C No. 18294/2024 quashing a state revenue acquisition order without compensation.",
    challenge: "District authorities had re-classified ancestral agricultural land as state reserve without issuing statutory notice under UP Revenue Code.",
    strategy: "Advocate Bhavani Singh filed an urgent Writ Petition (Civil) under Article 226, demonstrating non-compliance with principles of natural justice and Constitutional Article 300A.",
    verdictOutcome: "High Court Division Bench quashed the revenue order, restored possession to farmers, and levied costs on state officers.",
    impact: "Saved agricultural livelihoods of 14 farming families in Prayagraj region.",
    category: "writ",
    clientAnonymized: "Prayagraj Agricultural Union"
  },
  {
    id: "cs-hc-02",
    title: "Anticipatory Bail & Quashing of Malicious Criminal Proceedings in High Court",
    practiceArea: "Criminal Defense & High Court Bail",
    court: "Allahabad High Court (Main Bench)",
    year: "2025",
    summary: "Secured complete quashing of FIR under Section 482 CrPC for a falsely implicated businessman.",
    challenge: "Rival business firm filed a fabricated FIR alleging forgery and criminal breach of trust under IPC Sec 420/467.",
    strategy: "Demonstrated documentary proof of valid contractual receipts and lack of prima facie criminal intent during High Court argument.",
    verdictOutcome: "Hon'ble High Court quashed the charge sheet and stay of all coercive actions granted unconditionally.",
    impact: "Client saved from harassment and criminal record cleared.",
    category: "criminal",
    clientAnonymized: "Commercial Industrialist"
  },
  {
    id: "cs-hc-03",
    title: "Supreme Court SLP Granting Stay on High Court Order in Service Seniority Dispute",
    practiceArea: "Supreme Court & Service Writs",
    court: "Supreme Court of India",
    year: "2024",
    summary: "Secured stay on adverse promotion list impacting 45 UP Higher Education Service professors.",
    challenge: "High Court single judge order altered 15-year-old seniority list retrospectively.",
    strategy: "Filed SLP (Civil) highlighting violation of settled administrative law and doctrine of legitimate expectation.",
    verdictOutcome: "Supreme Court issued notice, stayed the operation of High Court order, and protected senior professors' designations.",
    impact: "Restored seniority ranking across UP state universities.",
    category: "tribunal",
    clientAnonymized: "UP University Faculty Association"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-hc-01",
    title: "How to Check Allahabad High Court Case Status & Order Sheets Online (Step-by-Step Guide)",
    category: "High Court Procedure",
    author: "Adv. Bhavani Singh",
    authorRole: "Senior Advocate & Founder",
    date: "Aug 05, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    excerpt: "Learn how clients and litigants can easily track Writ Petitions, Criminal Appeals, and daily hearing cause lists on the Allahabad High Court portal.",
    tags: ["Allahabad High Court", "Case Status", "Order Sheet", "Cause List", "Legal Guide"],
    isFeatured: true,
    fullArticle: `The Hon'ble High Court of Judicature at Allahabad provides an official digital portal (allahabadhighcourt.in/casestatus) for checking daily case status, cause lists, and judgment order sheets for the High Court at Prayagraj.

### How to Query Your Case Status:
1. **Case Type & Number**: Select your petition type (e.g., WRIT-C, WRIT-A, A482, CRLA) and enter the Case Number along with the Filing Year.
2. **Party Name Search**: Search by Petitioner or Respondent name if you do not know the exact case filing number.
3. **Downloading Certified Order Sheets**: High Court order sheets signed by the Hon'ble Benches are updated daily after 5:00 PM.

### Client Portal Integration at Bhavani Singh & Associates
Clients represented by Bhavani Singh & Associates do not need to struggle with complex legal portals. Our client system allows entering your case number to immediately view court dates, judge bench details, and direct one-click order sheet links.`
  },
  {
    id: "blog-hc-02",
    title: "Understanding Section 482 CrPC / BNSS Petitions for Quashing Malicious FIRs in UP",
    category: "Criminal Law",
    author: "Legal Research Team",
    authorRole: "Bhavani Singh & Associates",
    date: "Jul 28, 2026",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
    excerpt: "Inherent powers of the High Court to prevent abuse of legal process and quash false criminal complaints under Indian laws.",
    tags: ["Section 482", "Quashing FIR", "BNSS", "Allahabad High Court", "Bail"],
    isFeatured: true,
    fullArticle: `Section 482 of the Code of Criminal Procedure (and its corresponding BNSS provision) empowers the High Court to exercise inherent jurisdiction to prevent abuse of the process of any Court or secure the ends of justice.`
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-hc-1",
    name: "Rajendra Prasad Tripathi",
    rating: 5,
    location: "Prayagraj, UP",
    caseType: "Writ Petition (Land Dispute)",
    comment: "Advocate Bhavani Singh Sir fought our ancestral land case in Allahabad High Court with immense dedication. His command over revenue code and writ arguments is unmatched. We got immediate stay order."
  },
  {
    id: "t-hc-2",
    name: "Dr. Alok Verma",
    rating: 5,
    location: "Prayagraj, UP",
    caseType: "Service Writ & Promotion Matter",
    comment: "Bhavani Sir got my promotion order restored in High Court within 3 hearings. Very professional chamber team and transparent case updates."
  },
  {
    id: "t-hc-3",
    name: "Satish Chandra Yadav",
    rating: 5,
    location: "Varanasi, UP",
    caseType: "High Court Criminal Appeal & Bail",
    comment: "When my brother was wrongly framed, Bhavani Singh & Associates filed High Court bail and secured release smoothly. Honest and top advocate in Allahabad."
  }
];

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: "prayagraj-chamber",
    name: "Allahabad High Court Chamber (Prayagraj)",
    type: "High Court Practice Chamber",
    address: "Chamber No. 402, High Court Bar Association Building, Allahabad High Court, Prayagraj, UP - 211001",
    landmark: "Opposite Gate No. 3, Allahabad High Court Complex",
    phone: "+91 9415211990",
    email: "chambers.bhavanisingh@gmail.com",
    hours: "Mon - Sat: 10:00 AM - 6:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.8368739123!2d81.8262!3d25.4526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39853331b674b2f1%3A0x6b8012345678!2sAllahabad%20High%20Court!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },
  {
    id: "prayagraj-lower-court",
    name: "District & Lower Courts Chamber (Prayagraj)",
    type: "Lower Courts Practice Chamber",
    address: "District & Sessions Court Chamber Block, Kutchery Compound, Prayagraj, UP - 211002",
    landmark: "District Court Kutchery Campus, Prayagraj",
    phone: "+91 9415211990",
    email: "chambers.bhavanisingh@gmail.com",
    hours: "Mon - Sat: 10:00 AM - 5:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.5000!2d81.8333!3d25.4550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3985330000000001%3A0x123456789!2sCivil%20Lines%2C%20Prayagraj!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },
  {
    id: "prayagraj-revenue-court",
    name: "Board of Revenue & Revenue Courts Chamber (Prayagraj)",
    type: "Revenue Courts Practice Chamber",
    address: "Board of Revenue Compound, Kutchery Road, Prayagraj, UP - 211002",
    landmark: "Board of Revenue Building, Prayagraj",
    phone: "+91 9415211990",
    email: "chambers.bhavanisingh@gmail.com",
    hours: "Mon - Sat: 10:00 AM - 5:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.5000!2d81.8333!3d25.4550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3985330000000001%3A0x123456789!2sCivil%20Lines%2C%20Prayagraj!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },
  {
    id: "prayagraj-office",
    name: "Prayagraj Senior Law Office",
    type: "Main Commercial Office",
    address: "Plot 14-B, Tashkent Marg, Near Civil Lines Post Office, Prayagraj, UP - 211001",
    landmark: "Near Civil Lines Sub Post Office",
    phone: "+91 9415211990",
    email: "chambers.bhavanisingh@gmail.com",
    hours: "Mon - Sat: 9:00 AM - 8:30 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.5000!2d81.8333!3d25.4550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3985330000000001%3A0x123456789!2sCivil%20Lines%2C%20Prayagraj!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  }
];

export const INITIAL_CLIENT_CASES: ClientCase[] = [];

export const INITIAL_ENQUIRIES: EnquiryItem[] = [];

export const DEMO_CLIENT_CASE: ClientCase = {
  id: "demo-empty",
  caseNumber: "N/A",
  clientName: "No Active Case Loaded",
  practiceArea: "General Practice",
  courtName: "Allahabad High Court",
  judgeBench: "Court Bench",
  opposingParty: "State of UP",
  currentStage: "Pending Entry",
  nextHearingDate: "TBD",
  assignedAdvocate: "Advocate Bhavani Singh",
  statusBadge: "Active",
  allahabadHcCaseType: "WRIT-C",
  allahabadHcCaseNo: "00000",
  allahabadHcYear: "2026",
  highCourtOrderUrl: "https://allahabadhighcourt.in/casestatus/",
  orderSheetNotes: "",
  documents: [],
  hearingsHistory: [],
  invoices: [],
  messages: []
};
