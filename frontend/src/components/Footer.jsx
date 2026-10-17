import React from 'react';
import { ShieldCheck, PhoneCall, AlertCircle, ExternalLink, HeartPulse } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-bold text-xl text-white tracking-tight">MedVerify India</span>
                <p className="text-xs text-teal-400 font-medium">Healthcare Integrity Initiative</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering consumers and pharmacists to verify Indian pharmaceutical packaging, scan mandatory track & trace codes, and flag suspicious medications.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sample Database v1.0.0 Online</span>
            </div>
          </div>

          {/* Verification Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => { setActiveTab('verify'); window.scrollTo(0,0); }} className="hover:text-brand-400 transition-colors">
                  Verify Medicine (QR / Photo)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('report'); window.scrollTo(0,0); }} className="hover:text-brand-400 transition-colors">
                  Report Suspicious Product
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('history'); window.scrollTo(0,0); }} className="hover:text-brand-400 transition-colors">
                  Verification History
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('dashboard'); window.scrollTo(0,0); }} className="hover:text-brand-400 transition-colors">
                  Surveillance Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('how-it-works'); window.scrollTo(0,0); }} className="hover:text-brand-400 transition-colors">
                  How Indian Track & Trace Works
                </button>
              </li>
            </ul>
          </div>

          {/* Official Indian Regulatory Helplines */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Official Drug Authorities</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>CDSCO Toll-Free Helpline</span>
                  <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <p className="text-slate-300 font-mono mt-1">1800-11-0144</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Central Drugs Standard Control Organisation</p>
              </li>
              <li className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>National Consumer Helpline</span>
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-slate-300 font-mono mt-1">1915 / SMS 8800001915</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Ministry of Consumer Affairs</p>
              </li>
            </ul>
          </div>

          {/* Ethical & Legal Guardrails */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Mandatory Disclaimer</h4>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Preliminary Check Tool</span>
              </div>
              <p className="leading-relaxed">
                MedVerify provides technical comparison against sample records. <strong>A database match does not confirm chemical purity, and an unverified status does not prove counterfeit goods.</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Always consult licensed pharmacies and healthcare practitioners.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MedVerify India. Built for public safety and consumer education demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Sample CDSCO Format</span>
            <span>•</span>
            <span className="text-slate-400">GS1 India DataMatrix Standard</span>
            <span>•</span>
            <span className="text-teal-400 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" /> Made for Indian Consumers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
