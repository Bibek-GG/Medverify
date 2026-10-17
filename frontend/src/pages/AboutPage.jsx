import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Code2, 
  Database, 
  Cpu, 
  HeartHandshake, 
  FileCheck2,
  ExternalLink,
  Layers,
  Scan
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5" />
          <span>About MedVerify India</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight font-display">
          Engineering Public Health Transparency
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A full-stack pharmaceutical packaging verification system built to help Indian citizens, pharmacists, and health workers spot suspicious medicines.
        </p>
      </div>

      {/* Mission Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-soft space-y-4 backdrop-blur-md">
        <h3 className="font-extrabold text-navy-950 dark:text-white text-xl flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-500" />
          Project Objective & Public Safety Mission
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          MedVerify India was conceived as a non-commercial public health technology demonstrator. By bridging consumer-facing smartphone camera scanners with computer vision OCR and structured drug registry databases, our goal is to eliminate the opacity of pharmaceutical packaging and make track & trace information universally accessible.
        </p>
        <div className="p-4 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 text-xs text-brand-950 dark:text-brand-200 space-y-1">
          <p className="font-bold">Demonstration Mode & Sample Data Disclosure</p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            All records currently populated in this deployment represent simulated demonstration medicines. They are explicitly created for functional system testing and do not represent official government CDSCO or manufacturer databases.
          </p>
        </div>
      </div>

      {/* Technology Architecture Grid */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-navy-950 dark:text-white font-display">Technical Architecture & Stack</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 backdrop-blur-md">
            <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 text-sm">
              <Code2 className="w-4 h-4" /> Frontend Layer
            </span>
            <p className="font-extrabold text-navy-950 dark:text-white">React 19 + Vite 6</p>
            <p className="text-slate-500 dark:text-slate-400">Tailwind CSS design system with Plus Jakarta Sans typography and dark mode.</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 backdrop-blur-md">
            <span className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 text-sm">
              <Cpu className="w-4 h-4" /> Backend API
            </span>
            <p className="font-extrabold text-navy-950 dark:text-white">Python FastAPI</p>
            <p className="text-slate-500 dark:text-slate-400">Asynchronous REST API, Pydantic validation schemas, and modular routing.</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 backdrop-blur-md">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
              <Database className="w-4 h-4" /> Database & ORM
            </span>
            <p className="font-extrabold text-navy-950 dark:text-white">SQLAlchemy 2.0</p>
            <p className="text-slate-500 dark:text-slate-400">PostgreSQL ready with zero-config SQLite local development fallback.</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 backdrop-blur-md">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-sm">
              <Layers className="w-4 h-4" /> Computer Vision
            </span>
            <p className="font-extrabold text-navy-950 dark:text-white">OpenCV Preprocessing</p>
            <p className="text-slate-500 dark:text-slate-400">CLAHE contrast normalization, bilateral smoothing, and OCR text parsing.</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 backdrop-blur-md">
            <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-sm">
              <Scan className="w-4 h-4" /> Scanning Engine
            </span>
            <p className="font-extrabold text-navy-950 dark:text-white">html5-qrcode & ZXing</p>
            <p className="text-slate-500 dark:text-slate-400">In-browser camera detection for 2D GS1 DataMatrix and standard EAN-13.</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5 backdrop-blur-md">
            <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-sm">
              <FileCheck2 className="w-4 h-4" /> Analytics Engine
            </span>
            <p className="font-extrabold text-navy-950 dark:text-white">Recharts Visualization</p>
            <p className="text-slate-500 dark:text-slate-400">Interactive telemetry trends and incident tracking reference generator.</p>
          </div>

        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />

    </div>
  );
}
