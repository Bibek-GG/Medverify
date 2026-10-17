import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DisclaimerBanner from './components/DisclaimerBanner';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import ResultPage from './pages/ResultPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [verificationResult, setVerificationResult] = useState(null);
  const [reportPrefillData, setReportPrefillData] = useState(null);
  const [verifyPrefillData, setVerifyPrefillData] = useState(null);
  
  // Dark mode with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('medverify_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('medverify_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medverify_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleVerificationComplete = (result) => {
    setVerificationResult(result);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyAnother = () => {
    setVerificationResult(null);
    setVerifyPrefillData(null);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportMedicine = (prefillData) => {
    setReportPrefillData(prefillData);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPresetFromHome = (preset) => {
    setVerifyPrefillData(preset.data);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" style={{ animationDuration: '8s' }} />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" style={{ animationDuration: '10s' }} />
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Sticky Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab} 
            onSelectPreset={handleSelectPresetFromHome} 
          />
        )}

        {activeTab === 'verify' && (
          <VerifyPage 
            onVerificationComplete={handleVerificationComplete} 
            initialPrefill={verifyPrefillData}
          />
        )}

        {activeTab === 'result' && (
          <ResultPage 
            result={verificationResult}
            onVerifyAnother={handleVerifyAnother}
            onReportMedicine={handleReportMedicine}
            onViewHistory={() => { setActiveTab('history'); window.scrollTo(0,0); }}
          />
        )}

        {activeTab === 'report' && (
          <ReportPage 
            initialData={reportPrefillData}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage 
            onSelectResult={(item) => {
              setVerificationResult({
                scan_id: item.id,
                status: item.status,
                headline: `${item.scanned_medicine_name || 'Archived Medicine'} — ${item.status}`,
                explanation: item.explanation,
                disclaimer: 'Preliminary information check archive.',
                product_identifier: item.product_identifier,
                scanned_details: item.extracted_details || {},
                database_record: null,
                matched_fields: item.matched_fields || [],
                mismatched_fields: item.mismatched_fields || [],
                recommended_steps: ['Review historical scan archive against official packaging.'],
                created_at: item.created_at,
              });
              setActiveTab('result');
              window.scrollTo(0,0);
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksPage 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
