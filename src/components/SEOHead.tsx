import React, { useEffect } from 'react';

interface SEOHeadProps {
  currentPath: string;
}

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogType?: string;
  schemaType?: string;
}

const SITE_URL = 'https://bhavnisinghassociates.com';

const DEFAULT_KEYWORDS = 'Advocate Bhavni Singh, Bhavni Singh & Associates, High Court Advocate Prayagraj, Allahabad High Court Lawyer, Top Advocate Prayagraj, Criminal Bail Lawyer High Court, Writ Petition Allahabad High Court, Revenue Land Disputes Advocate, Best Lawyer Allahabad, Board of Revenue Chambers';

const META_CONFIG: Record<string, PageMeta> = {
  '/home': {
    title: 'Bhavni Singh & Associates | High Court Advocates, Solicitors & Legal Consultants',
    description: 'Bhavni Singh & Associates - Top High Court Advocates at Allahabad High Court (Prayagraj & Lucknow Bench), Supreme Court of India, and District Courts in UP. Expertise in Bail, Writs, Land Disputes & Service Matters.',
    keywords: `${DEFAULT_KEYWORDS}, Allahabad High Court Main Bench, High Court Gate 3 Prayagraj`,
    canonicalPath: '/',
    ogType: 'website'
  },
  '/about': {
    title: 'About Advocate Bhavni Singh | High Court Chambers & Legal Team Prayagraj',
    description: 'Learn about Advocate Bhavni Singh legal legacy, credentials, and track record in Allahabad High Court, District Courts, and Board of Revenue in Prayagraj.',
    keywords: 'Advocate Bhavni Singh profile, High Court Lawyer credentials, Allahabad High Court Senior Counsel, Law firm Prayagraj history',
    canonicalPath: '/about',
    ogType: 'profile'
  },
  '/expertise': {
    title: 'Legal Practice Areas & Specializations | Bhavni Singh & Associates',
    description: 'Expert legal representation in Writ Petitions, Criminal Bail, Revenue Land Disputes, Service Law, Civil Appeals & Family Law at Allahabad High Court.',
    keywords: 'Criminal Bail High Court, Writ Petition Advocate, Revenue Court Lawyer Prayagraj, Service Law Attorney Allahabad, Property Dispute High Court',
    canonicalPath: '/expertise'
  },
  '/services': {
    title: 'Legal Services & Court Representation | Bhavni Singh & Associates Prayagraj',
    description: 'Comprehensive legal advisory, High Court litigation, bail drafting, certified order sheet procurement, and confidential client consultation.',
    keywords: 'Legal Consultation Prayagraj, Certified Order Copies High Court, Bail Drafting Allahabad, Revenue Court Legal Services',
    canonicalPath: '/services'
  },
  '/case-studies': {
    title: 'Landmark Case Victories & High Court Judgments | Bhavni Singh & Associates',
    description: 'Explore detailed case studies, landmark Allahabad High Court order sheets, bail approvals, and land dispute settlements secured by Adv. Bhavni Singh.',
    keywords: 'Allahabad High Court Case Studies, High Court Judgment Victory, Criminal Bail Success Stories, Writ Relief Examples',
    canonicalPath: '/case-studies'
  },
  '/blog': {
    title: 'Legal Insights & High Court Updates Blog | Bhavni Singh & Associates',
    description: 'Expert legal commentary on Indian statutory laws, Allahabad High Court procedural rules, bail jurisprudence, and land revenue updates by Adv. Bhavni Singh.',
    keywords: 'Indian Law Blog, Allahabad High Court News, Legal Commentary UP, Bail Law Articles, Land Revenue Judgments',
    canonicalPath: '/blog'
  },
  '/contact': {
    title: 'Contact & Legal Consultation Booking | Bhavni Singh & Associates Prayagraj',
    description: 'Get in touch with Advocate Bhavni Singh chamber at High Court Gate No. 3, Civil Lines, Prayagraj. Phone: +91 9415211990. Instant WhatsApp support.',
    keywords: 'Contact Advocate Bhavni Singh, High Court Lawyer Phone Number, Prayagraj Chamber Address, Book Legal Consultation',
    canonicalPath: '/contact'
  },
  '/contactus': {
    title: 'Contact & Legal Consultation Booking | Bhavni Singh & Associates Prayagraj',
    description: 'Get in touch with Advocate Bhavni Singh chamber at High Court Gate No. 3, Civil Lines, Prayagraj. Phone: +91 9415211990. Instant WhatsApp support.',
    keywords: 'Contact Advocate Bhavni Singh, High Court Lawyer Phone Number, Prayagraj Chamber Address, Book Legal Consultation',
    canonicalPath: '/contact'
  },
  '/client-portal': {
    title: 'Client Portal & Case Status Tracker | Bhavni Singh & Associates',
    description: 'Track your court case status online, view next hearing dates, judge bench details, and download certified High Court orders uploaded by Advocate Bhavni Singh.',
    keywords: 'Case Status Tracker Allahabad High Court, Client Portal Bhavni Singh, High Court Order Copy Download, Cause List Hearing Date',
    canonicalPath: '/client-portal'
  },
  '/case-status': {
    title: 'Client Portal & Case Status Tracker | Bhavni Singh & Associates',
    description: 'Track your court case status online, view next hearing dates, judge bench details, and download certified High Court orders uploaded by Advocate Bhavni Singh.',
    keywords: 'Case Status Tracker Allahabad High Court, Client Portal Bhavni Singh, High Court Order Copy Download, Cause List Hearing Date',
    canonicalPath: '/client-portal'
  },
  '/advocate-portal': {
    title: 'Advocate Chamber Admin & Case Management | Bhavni Singh & Associates',
    description: 'Confidential Advocate Chamber Portal for managing client case files, uploading High Court judgments, updating hearing dates, and cause list management.',
    keywords: 'Advocate Chamber Portal, Advocate Management System, High Court Case Admin',
    canonicalPath: '/advocate-portal'
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({ currentPath }) => {
  useEffect(() => {
    const meta = META_CONFIG[currentPath] || META_CONFIG['/home'];
    const fullUrl = `${SITE_URL}${meta.canonicalPath}`;

    // Update document title
    document.title = meta.title;

    // Helper function to update or create meta tag
    const setMetaTag = (selector: string, keyName: string, keyValue: string, contentValue: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(keyName, keyValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Standard Meta
    setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords);
    setMetaTag('meta[name="title"]', 'name', 'title', meta.title);

    // OpenGraph Meta
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');

    // Twitter Card Meta
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', meta.title);
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', meta.description);
    setMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', fullUrl);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // Dynamic Breadcrumb Schema (JSON-LD)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': SITE_URL
        },
        ...(meta.canonicalPath !== '/' ? [{
          '@type': 'ListItem',
          'position': 2,
          'name': meta.title.split('|')[0].trim(),
          'item': fullUrl
        }] : [])
      ]
    };

    let scriptElement = document.getElementById('dynamic-breadcrumb-schema');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'dynamic-breadcrumb-schema';
      scriptElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(breadcrumbSchema);

  }, [currentPath]);

  return null;
};
