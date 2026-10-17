import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  Upload, 
  FileWarning, 
  History, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Search,
  Layers,
  Database,
  Building,
  Activity,
  HeartPulse,
  BadgeAlert,
  Fingerprint,
  Info,
  ChevronRight,
  Eye
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function HomePage({ setActiveTab, onSelectPreset }) {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const presets = [
    {
      id: 'dolo_verified',
      title: 'Dolo-650 Tablets',
      company: 'Micro Labs Ltd',
      status: 'VERIFIED',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      desc: '100% digital match on GTIN, batch, and manufacturer record.',
      data: {
        product_identifier: '8901234567890',
        name: 'Dolo-650 Tablets',
        manufacturer: 'Micro Labs Ltd',
        batch_number: 'DL24098',
        expiry_date: '02/2027',
        verification_method: 'QR_BARCODE'
      }
    },
    {
      id: 'asthalin_tampered',
      title: 'Asthalin Inhaler',
      company: 'Cipla Ltd',
      status: 'SUSPICIOUS',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      desc: 'Batch code altered/unrecognized against registered active lot.',
      data: {
        product_identifier: '8906789012356',
        name: 'Asthalin Inhaler 100mcg',
        manufacturer: 'Cipla Ltd',
        batch_number: 'AS9999-TAMPERED',
        expiry_date: '10/2026',
        verification_method: 'MANUAL_ENTRY'
      }
    },
    {
      id: 'monocef_counterfeit',
      title: 'Monocef 1g Injection',
      company: 'Counterfeit Rem.',
      status: 'SUSPICIOUS',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: AlertTriangle,
      desc: 'Conflicting manufacturer entity detected in scanned packaging.',
      data: {
        product_identifier: '8907890123467',
        name: 'Monocef 1g Injection',
        manufacturer: 'Counterfeit Rem.',
        batch_number: 'MN4432',
        expiry_date: '08/2026',
        verification_method: 'IMAGE_OCR'
      }
    },
    {
      id: 'unregistered_sample',
      title: 'Uncataloged Formulation',
      company: 'Regional Brand',
      status: 'UNABLE TO VERIFY',
      badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
      icon: HelpCircle,
      desc: 'Product identifier absent from demonstration registry.',
      data: {
        product_identifier: '9999999999999',
        name: 'Unregistered Cough Formulation',
        manufacturer: 'Regional Labs',
        batch_number: 'REG771',
        expiry_date: '11/2026',
        verification_method: 'MANUAL_ENTRY'
      }
    }
  ];

  const recentScansTicker = [
    { medicine: 'Dolo-650 (Micro Labs)', city: 'Bengaluru', status: 'VERIFIED', time: 'Just now' },
    { medicine: 'Azithral 500 (Alembic)', city: 'Mumbai', status: 'VERIFIED', time: '2m ago' },
    { medicine: 'Asthalin Inhaler (Cipla)', city: 'New Delhi', status: 'SUSPICIOUS', time: '5m ago' },
    { medicine: 'Augmentin 625 (GSK)', city: 'Hyderabad', status: 'VERIFIED', time: '8m ago' },
    { medicine: 'Pan-D (Alkem Labs)', city: 'Pune', status: 'VERIFIED', time: '12m ago' },
    { medicine: 'Monocef 1g (Aristo)', city: 'Kolkata', status: 'SUSPICIOUS', time: '15m ago' },
    { medicine: 'Telma 40 (Glenmark)', city: 'Chennai', status: 'VERIFIED', time: '18m ago' },
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-2 pb-8 sm:pt-6 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2.5 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-4 py-2 rounded-full border border-brand-500/20 dark:border-brand-500/30 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">GS1 India 2D DataMatrix Mandate • CDSCO Rule 96(5B)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 dark:text-white tracking-tight leading-[1.1] font-display">
              Check Your Medicine. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-500 to-brand-500 dark:from-brand-400 dark:via-teal-300 dark:to-brand-300">
                Make Informed Decisions.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Verify Indian pharmaceutical packaging in seconds. Cross-reference GS1 barcodes, verify batch numbers via OpenCV computer vision, and detect discrepancies against registered drug records.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('verify')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-600 via-teal-600 to-brand-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-elevated hover:shadow-glow-brand transition-all active:scale-95 group"
              >
                <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Verify a Medicine Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('how-it-works')}
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-navy-950 dark:text-white font-semibold text-base px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft backdrop-blur-md transition-all"
              >
                <HelpCircle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <span>How Serialization Works</span>
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">GS1 2D DataMatrix & EAN-13</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span className="font-medium">OpenCV Packaging OCR</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                <span className="font-medium">CDSCO Compliant Registry</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: 3D Holographic Scanner Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg group">
              
              {/* Radial backdrop glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-teal-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity -z-10" />

              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
                
                {/* Embedded Photorealistic Scanner Visual */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img 
                    src="/images/hero-scanner.jpg" 
                    alt="MedVerify High-Tech Medicine Authentication Scanner"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Animated Scanner Laser Beam Overlay */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser pointer-events-none" />

                  {/* Floating Live Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>AI RETICLE ACTIVE • 60 FPS</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/10">
                    CDSCO RULE 96(5B)
                  </div>

                  {/* Bottom Image Info Strip */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white/90">
                    <div>
                      <p className="font-bold tracking-tight">Active Target: DOLO-650 Paracetamol</p>
                      <p className="text-[11px] text-teal-300 font-mono">GTIN: 8901234567890 • LOT: DL24098</p>
                    </div>
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-sm">
                      MATCH 100%
                    </span>
                  </div>
                </div>

                {/* Card Lower Controls */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Rapid Test Mode</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Instant Verification Engine
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('verify')}
                    className="w-full bg-navy-950 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Launch Live Camera & Image Scanner</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE VERIFICATION MARQUEE / TICKER */}
      <section className="relative overflow-hidden py-3 px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 flex-shrink-0 bg-brand-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-slate-700">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Live Activity:</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1 text-xs">
            {recentScansTicker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.medicine}</span>
                <span className="text-slate-400 dark:text-slate-500">• {item.city}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  item.status === 'VERIFIED' 
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                }`}>
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-400">{item.time}</span>
                {idx !== recentScansTicker.length - 1 && <span className="text-slate-300 dark:text-slate-700">|</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ONE-CLICK EVALUATOR PRESETS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight font-display">
              Test All Three Verification Outcomes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              No physical medicine packaging required. Click any scenario below to immediately run our verification engine.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('verify')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Advanced Verification Studio</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <div 
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="group relative bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-850 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${preset.badgeClass}`}>
                      {preset.status}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                  </div>

                  <h3 className="font-extrabold text-navy-950 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                    {preset.company}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {preset.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                  <span>Simulate Test Scan</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PACKAGING ANATOMY & REGULATORY FEATURE */}
      <section className="bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Packaging Image with Hotspots */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 group">
              <img 
                src="/images/packaging-inspection.jpg" 
                alt="Indian Pharmaceutical Packaging Inspection showing CDSCO Security Hologram and GS1 2D DataMatrix"
                className="w-full h-auto object-cover rounded-2xl"
              />

              {/* Hotspot 1: GS1 2D DataMatrix */}
              <div 
                className="absolute top-[28%] right-[28%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
              >
                <span className="flex h-6 w-6 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-cyan-500 text-slate-950 font-bold text-xs items-center justify-center shadow-lg">1</span>
                </span>
              </div>

              {/* Hotspot 2: Hologram CDSCO Seal */}
              <div 
                className="absolute top-[35%] left-[43%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setActiveHotspot(activeHotspot === 2 ? null : 2)}
              >
                <span className="flex h-6 w-6 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-teal-400 text-slate-950 font-bold text-xs items-center justify-center shadow-lg">2</span>
                </span>
              </div>

              {/* Hotspot 3: Batch and MRP Label */}
              <div 
                className="absolute bottom-[20%] right-[35%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setActiveHotspot(activeHotspot === 3 ? null : 3)}
              >
                <span className="flex h-6 w-6 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-400 text-slate-950 font-bold text-xs items-center justify-center shadow-lg">3</span>
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Click numbers on box to inspect packaging rules</span>
                <span className="text-teal-400 font-mono font-bold">INSPECTION ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Explanation Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/20 uppercase tracking-wider">
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Anatomy of Authentic Medicine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Indian Pharmaceutical Packaging Serialization
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Under CDSCO notification GSR 823(E), the government mandates distinct security markers on the top 300 pharmaceutical brands to curb counterfeit medicine distribution.
            </p>

            <div className="space-y-3.5">
              
              {/* Feature 1 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                activeHotspot === 1 
                  ? 'bg-cyan-500/15 border-cyan-400/50 shadow-glow-teal' 
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
                  <h4 className="font-bold text-white text-sm">GS1 2D DataMatrix Barcode</h4>
                </div>
                <p className="text-xs text-slate-300 mt-1 pl-9 leading-relaxed">
                  Contains the Global Trade Item Number (GTIN-14), Unique Serial Number, Batch Identifier, and Expiry Date in structured GS1 Application Identifiers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                activeHotspot === 2 
                  ? 'bg-teal-500/15 border-teal-400/50 shadow-glow-teal' 
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
                  <h4 className="font-bold text-white text-sm">Tamper-Evident Security Seal</h4>
                </div>
                <p className="text-xs text-slate-300 mt-1 pl-9 leading-relaxed">
                  Official tamper-evident holographic security sticker bridging the carton flap to guarantee packaging has not been opened or refilled.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                activeHotspot === 3 
                  ? 'bg-amber-500/15 border-amber-400/50 shadow-glow-amber' 
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0">3</span>
                  <h4 className="font-bold text-white text-sm">Clear Batch, Expiry & Max Retail Price</h4>
                </div>
                <p className="text-xs text-slate-300 mt-1 pl-9 leading-relaxed">
                  Must clearly state Batch No., Manufacturing Date, Expiration Date, and Maximum Retail Price (M.R.P. ₹ incl. of all taxes) with zero signs of overprinting or scratching.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS (4 STEPS) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Workflow</span>
          </div>
          <h2 className="text-3xl font-black text-navy-950 dark:text-white tracking-tight font-display">
            How MedVerify Works in 4 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            From physical packaging scan to catalog cross-referencing and actionable healthcare guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-soft space-y-3 relative group hover:border-brand-400 dark:hover:border-brand-600 transition-all">
            <span className="text-3xl font-black text-brand-500/25 group-hover:text-brand-500 transition-colors font-display">01</span>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Scan className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">Scan or Upload</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Use live camera scanning for 2D GS1 DataMatrix barcodes or upload photograph of blister packaging.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-soft space-y-3 relative group hover:border-teal-400 dark:hover:border-teal-600 transition-all">
            <span className="text-3xl font-black text-teal-500/25 group-hover:text-teal-500 transition-colors font-display">02</span>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">Extract Details</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Computer vision parses medicine brand, manufacturer, batch number, and expiration date automatically.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-soft space-y-3 relative group hover:border-brand-400 dark:hover:border-brand-600 transition-all">
            <span className="text-3xl font-black text-brand-500/25 group-hover:text-brand-500 transition-colors font-display">03</span>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">Catalog Cross-Check</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Engine matches records against registered database entries and flags expired or tampered lots.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-soft space-y-3 relative group hover:border-emerald-400 dark:hover:border-emerald-600 transition-all">
            <span className="text-3xl font-black text-emerald-500/25 group-hover:text-emerald-500 transition-colors font-display">04</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-base">Outcome & Certificate</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Review verified, suspicious, or unverified outcome with printable verification certificate.
            </p>
          </div>

        </div>
      </section>

      {/* 6. STATISTICAL BENCHMARKS & HELPLINES */}
      <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-soft">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/20 uppercase tracking-wider">
            <BadgeAlert className="w-3.5 h-3.5" />
            <span>Official Surveillance Benchmarks</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight font-display">
            National Pharmaceutical Context & Consumer Protection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400 font-mono">Top 300</span>
              <h4 className="font-bold text-navy-950 dark:text-white text-sm">Mandatory QR Brands</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mandated under CDSCO Rule 96(5B) for high-volume domestic formulations across India.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">~3.16%</span>
              <h4 className="font-bold text-navy-950 dark:text-white text-sm">NSQ Drug Alert Survey</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                National CDSCO sampling identifying products Not of Standard Quality (NSQ) requiring recalls.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">1800-11-0144</span>
              <h4 className="font-bold text-navy-950 dark:text-white text-sm">CDSCO Toll-Free Helpline</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Direct government regulatory helpline for reporting spurious medicine or filing complaints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PERMANENT DISCLAIMER BANNER */}
      <DisclaimerBanner />

    </div>
  );
}
