import React from 'react';
import { 
  HelpCircle, 
  Scan, 
  Layers, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileWarning, 
  PhoneCall,
  ExternalLink,
  Info,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function HowItWorksPage({ setActiveTab }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Serialization & Architecture Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight font-display">
          How Medicine Verification Works in India
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Understanding Indian pharmaceutical serialization, GS1 DataMatrix mandates, and how MedVerify detects inconsistencies.
        </p>
      </div>

      {/* Visual Packaging Inspection Feature */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-6 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg bg-slate-950">
            <img 
              src="/images/packaging-inspection.jpg" 
              alt="Indian Medicine Box Serialization Inspection"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              CDSCO Rule 96(5B) Mandate
            </span>
            <h3 className="text-xl font-black text-navy-950 dark:text-white font-display">
              Mandatory GS1 2D DataMatrix on Top 300 Brands
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Enacted by the Ministry of Health and Family Welfare under Gazette Notification GSR 823(E), manufacturers must encode a structured 2D DataMatrix barcode on secondary packaging of high-volume medicines sold across India.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                (01) GTIN-14
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                (10) BATCH LOT
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                (17) EXPIRY DATE
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                (21) SERIAL NO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Verification Statuses Explained */}
      <div className="space-y-5">
        <h3 className="text-2xl font-black text-navy-950 dark:text-white font-display">
          Understanding the 3 Verification Results
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* VERIFIED */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/40 rounded-3xl border border-emerald-500/30 p-6 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm uppercase">VERIFIED</span>
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">Database Match Confirmed</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              All submitted product parameters (GTIN, brand name, manufacturer, batch, and expiry) match registered catalog records.
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 p-3 rounded-2xl border border-emerald-500/30">
              <strong>Caution:</strong> Digital consistency confirms registration alignment, but cannot guarantee physical chemical composition or cold-chain storage history.
            </p>
          </div>

          {/* SUSPICIOUS */}
          <div className="bg-amber-500/10 dark:bg-amber-950/40 rounded-3xl border border-amber-500/30 p-6 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="font-black text-amber-700 dark:text-amber-300 text-sm uppercase">SUSPICIOUS</span>
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">Inconsistency Detected</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              One or more scanned details (e.g. conflicting manufacturer entity, altered batch code, or elapsed expiration date) conflict with official data.
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/15 p-3 rounded-2xl border border-amber-500/30">
              <strong>Action:</strong> Do not consume. Retain packaging and consult your dispensing pharmacist or file a suspicious product incident report.
            </p>
          </div>

          {/* UNABLE TO VERIFY */}
          <div className="bg-slate-500/10 dark:bg-slate-800/40 rounded-3xl border border-slate-300 dark:border-slate-700 p-6 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="font-black text-slate-700 dark:text-slate-300 text-sm uppercase">UNABLE TO VERIFY</span>
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">No Matching Record</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              The product identifier was not found in the demonstration database catalog records.
            </p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-500/15 p-3 rounded-2xl border border-slate-300 dark:border-slate-700">
              <strong>Neutral:</strong> An unverified result does NOT prove counterfeit status; many authentic regional formulations are simply uncataloged.
            </p>
          </div>

        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('verify')}
          className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-600 via-teal-600 to-brand-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-elevated transition-all active:scale-95"
        >
          <span>Launch Verification Tool</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
