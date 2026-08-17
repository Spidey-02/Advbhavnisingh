import React, { useState, useEffect } from 'react';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Header } from './components/Header';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ExpertisePage } from './pages/ExpertisePage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { AdvocatePortalPage } from './pages/AdvocatePortalPage';

export function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(() => {
    return localStorage.getItem('bhavni_disclaimer_accepted') === 'true';
  });

  // Current page path route (defaults to /home)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    let p = window.location.pathname.toLowerCase().trim();
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    if (p && p !== '/') {
      return p;
    }
    return '/home';
  });

  const [showEnquiryModal, setShowEnquiryModal] = useState<boolean>(false);

  useEffect(() => {
    // Listen to browser back/forward buttons
    const handlePopState = () => {
      let p = window.location.pathname.toLowerCase().trim();
      if (p.length > 1 && p.endsWith('/')) {
        p = p.slice(0, -1);
      }
      if (p && p !== '/') {
        setCurrentPath(p);
      } else {
        setCurrentPath('/home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    let normalized = path.toLowerCase().trim();
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    setCurrentPath(normalized);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAcceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    localStorage.setItem('bhavni_disclaimer_accepted', 'true');
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/about':
        return (
          <AboutPage 
            onNavigate={handleNavigate}
            onOpenAppointmentModal={() => setShowEnquiryModal(true)}
          />
        );
      case '/expertise':
        return (
          <ExpertisePage 
            onOpenAppointmentModal={() => setShowEnquiryModal(true)}
          />
        );
      case '/case-studies':
        return (
          <CaseStudiesPage 
            onOpenAppointmentModal={() => setShowEnquiryModal(true)}
          />
        );
      case '/services':
        return (
          <ServicesPage 
            onNavigate={handleNavigate}
            onOpenAppointmentModal={() => setShowEnquiryModal(true)}
          />
        );
      case '/blog':
        return <BlogPage />;
      case '/contactus':
      case '/contact':
        return <ContactPage />;
      case '/client-portal':
      case '/case-status':
        return <ClientPortalPage />;
      case '/advocate-portal':
      case '/advocate-dashboard':
        return <AdvocatePortalPage />;
      case '/home':
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate}
            onOpenAppointmentModal={() => setShowEnquiryModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col selection:bg-[#c5a059] selection:text-white">
      
      {/* Bar Council Disclaimer Modal */}
      <DisclaimerModal
        isOpen={!disclaimerAccepted}
        onAccept={handleAcceptDisclaimer}
      />

      {/* Main Navigation Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenAppointment={() => setShowEnquiryModal(true)}
        onOpenEnquiry={() => setShowEnquiryModal(true)}
      />

      {/* Main Page View Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Floating Speed Actions */}
      <FloatingActions
        onOpenAppointment={() => setShowEnquiryModal(true)}
      />

      {/* Global Modals */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={(sec) => {
          if (sec === 'contact') handleNavigate('/contactus');
          else if (sec === 'expertise') handleNavigate('/expertise');
          else if (sec === 'services') handleNavigate('/services');
          else if (sec === 'about') handleNavigate('/about');
          else if (sec === 'blog') handleNavigate('/blog');
          else if (sec === 'client-portal') handleNavigate('/client-portal');
          else handleNavigate('/home');
        }}
        onOpenDisclaimer={() => setDisclaimerAccepted(false)}
        onOpenAppointment={() => setShowEnquiryModal(true)}
      />

    </div>
  );
}

export default App;
