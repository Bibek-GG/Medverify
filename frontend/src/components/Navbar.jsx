import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  FileWarning, 
  History, 
  LayoutDashboard, 
  HelpCircle, 
  Info, 
  Menu, 
  X,
  Sparkles,
  Database,
  Moon,
  Sun
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', shortLabel: 'Home', fullLabel: 'Home', icon: ShieldCheck },
    { id: 'verify', shortLabel: 'Verify', fullLabel: 'Verify Medicine', icon: Scan, isPrimary: true },
    { id: 'how-it-works', shortLabel: 'How It Works', fullLabel: 'How It Works', icon: HelpCircle },
    { id: 'report', shortLabel: 'Report', fullLabel: 'Report Medicine', icon: FileWarning },
    { id: 'history', shortLabel: 'History', fullLabel: 'Scan History', icon: History },
    { id: 'dashboard', shortLabel: 'Surveillance', fullLabel: 'Surveillance', icon: LayoutDashboard },
    { id: 'about', shortLabel: 'About', fullLabel: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-xs">
      
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-brand-700 via-teal-700 to-brand-800 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-bold tracking-wide">CDSCO Rule 96(5B) Verification Engine</span>
            <span className="hidden md:inline text-white/75">• National Drug Traceability Protocol</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-teal-100 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
              <Database className="w-3 h-3 text-teal-300" />
              <span className="font-mono font-medium">12 Cataloged Presets</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-400/30">
              Demo Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          
          {/* Brand Logo on Left */}
          <button 
            onClick={() => handleNavClick('home')}
            aria-label="MedVerify India Home"
            className="flex items-center gap-2.5 text-left group focus:outline-hidden shrink-0"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-teal-500 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-all">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-400 to-teal-400 rounded-xl blur-xs opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg xl:text-xl tracking-tight text-navy-950 dark:text-white font-display">MedVerify</span>
                <span className="bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-brand-300/60 dark:border-brand-700/60 uppercase tracking-widest leading-none">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap hidden xl:block leading-none mt-1">
                Medicine Verification
              </p>
            </div>
          </button>

          {/* Desktop & Tablet Navigation Items on Right */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              // Shared base styles ensuring identical height (h-9 = 36px) and vertical alignment
              let buttonClasses = 'h-9 inline-flex items-center justify-center gap-1.5 px-2.5 xl:px-3 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ';

              if (item.isPrimary) {
                // Verify Medicine tab: solid vibrant teal gradient ONLY when active; elegant teal pill when inactive
                if (isActive) {
                  buttonClasses += 'bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold shadow-sm shadow-brand-500/25 ';
                } else {
                  buttonClasses += 'text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 font-semibold ';
                }
              } else {
                // Standard tabs: subtle background pill when active; clean hover state when inactive
                if (isActive) {
                  buttonClasses += 'bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 font-bold border border-brand-200/80 dark:border-slate-700 shadow-2xs ';
                } else {
                  buttonClasses += 'text-slate-600 dark:text-slate-300 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 font-medium ';
                }
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={buttonClasses}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${
                    isActive 
                      ? (item.isPrimary ? 'text-white' : 'text-brand-600 dark:text-brand-400') 
                      : (item.isPrimary ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500')
                  }`} />
                  
                  {/* Single line labels: Full label on ≥1280px; Shortened label on 768px-1279px */}
                  <span className="whitespace-nowrap hidden xl:inline">{item.fullLabel}</span>
                  <span className="whitespace-nowrap xl:hidden">{item.shortLabel}</span>

                  {item.isPrimary && (
                    <Sparkles className={`w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0 ${
                      isActive ? 'text-teal-200' : 'text-teal-500 dark:text-teal-400'
                    }`} />
                  )}
                </button>
              );
            })}

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 xl:mx-1.5 shrink-0" aria-hidden="true" />

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Right Controls (<768px) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer (<768px) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? (item.isPrimary
                          ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-sm'
                          : 'bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-slate-700')
                      : (item.isPrimary
                          ? 'text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800')
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.fullLabel}</span>
                  </div>
                  {item.isPrimary && <Sparkles className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}

            {/* Mobile Theme Toggle Row */}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2">
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                <span>Theme Mode</span>
              </span>
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle theme mode"
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                {darkMode ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
