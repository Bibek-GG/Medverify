import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Printer, 
  RotateCcw, 
  FileWarning, 
  History, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building,
  Hash,
  Database,
  ExternalLink,
  Info,
  Award,
  Sparkles,
  QrCode
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function ResultPage({ result, onVerifyAnother, onReportMedicine, onViewHistory }) {
  if (!result) return null;

  const isVerified = result.status === 'VERIFIED';
  const isSuspicious = result.status === 'SUSPICIOUS';
  const isUnableToVerify = result.status === 'UNABLE_TO_VERIFY';

  // Trigger celebration confetti for genuine database match
  useEffect(() => {
    if (isVerified) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#10b981', '#14b8a6', '#0ea5e9', '#38bdf8']
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [isVerified]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onVerifyAnother}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Verify Another Medicine</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft transition-all"
          >
            <Printer className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Print or Save Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className={`print-card rounded-3xl border p-6 sm:p-10 shadow-elevated relative overflow-hidden backdrop-blur-xl ${
        isVerified 
          ? 'bg-gradient-to-b from-emerald-500/10 via-white/95 to-white/95 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-slate-900/90 border-emerald-500/40' 
          : isSuspicious
          ? 'bg-gradient-to-b from-amber-500/10 via-white/95 to-white/95 dark:from-amber-950/40 dark:via-slate-900/90 dark:to-slate-900/90 border-amber-500/40'
          : 'bg-gradient-to-b from-slate-500/10 via-white/95 to-white/95 dark:from-slate-900/40 dark:via-slate-900/90 dark:to-slate-900/90 border-slate-300 dark:border-slate-700'
      }`}>
        
        {/* Hologram / Certificate Seal Watermark in Corner */}
        <div className="absolute top-6 right-6 opacity-15 dark:opacity-20 pointer-events-none hidden sm:block">
          <Award className="w-32 h-32 text-brand-500" />
        </div>

        {/* Status Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              isVerified
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                : isSuspicious
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/30'
                : 'bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-slate-500/30'
            }`}>
              {isVerified && <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />}
              {isSuspicious && <AlertTriangle className="w-9 h-9 stroke-[2.2]" />}
              {isUnableToVerify && <HelpCircle className="w-9 h-9 stroke-[2.2]" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                  isVerified
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : isSuspicious
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'
                }`}>
                  Status: {result.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Scan Record #{result.scan_id} • {new Date(result.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white mt-1.5 font-display">
                {result.headline}
              </h1>
            </div>
          </div>
        </div>

        {/* Plain Language Explanation */}
        <div className="my-6 p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Verification Assessment Summary
          </h2>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {result.explanation}
          </p>
        </div>

        {/* Medicine Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 py-2">
          <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Medicine Name</span>
            <p className="font-extrabold text-navy-950 dark:text-white text-sm mt-0.5 truncate">
              {result.database_record?.name || result.scanned_details?.name || 'Uncataloged Formulation'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Product Identifier</span>
            <p className="font-extrabold text-navy-950 dark:text-white text-sm font-mono mt-0.5 truncate">
              {result.product_identifier || result.scanned_details?.product_identifier || 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Batch Number</span>
            <p className="font-extrabold text-navy-950 dark:text-white text-sm font-mono mt-0.5 truncate uppercase">
              {result.scanned_details?.batch_number || result.database_record?.batch_number || 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Expiry Date</span>
            <p className="font-extrabold text-navy-950 dark:text-white text-sm font-mono mt-0.5 truncate">
              {result.scanned_details?.expiry_date || result.database_record?.expiry_date || 'N/A'}
            </p>
          </div>
        </div>

        {/* Detailed Field Comparison Table */}
        <div className="mt-8 space-y-3">
          <h2 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center justify-between">
            <span>Detailed Parameter Comparison Table</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Cross-Checked Against CDSCO Demo Catalog</span>
          </h2>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-850 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Parameter</th>
                  <th className="py-3.5 px-4">Scanned / Extracted</th>
                  <th className="py-3.5 px-4">Catalog Baseline</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Mismatched Fields First */}
                {result.mismatched_fields.map((field, idx) => (
                  <tr key={`mismatch-${idx}`} className="bg-red-500/10 dark:bg-red-950/30">
                    <td className="py-3.5 px-4 font-bold text-red-950 dark:text-red-300">
                      {field.field_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-red-600 dark:text-red-400 font-bold">
                      {field.submitted_value || 'Missing'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {field.database_value || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-red-300 dark:border-red-700">
                        <AlertTriangle className="w-3 h-3" /> Discrepancy
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Matched Fields */}
                {result.matched_fields.map((field, idx) => (
                  <tr key={`match-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {field.field_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {field.submitted_value || 'Exact Match'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {field.database_value || 'Registered'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Matched
                      </span>
                    </td>
                  </tr>
                ))}

                {result.matched_fields.length === 0 && result.mismatched_fields.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                      No baseline catalog entry found in the sample database to execute parameter comparisons.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Action Steps */}
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Recommended Healthcare Steps
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {result.recommended_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Disclaimer Callout */}
        <div className="mt-8">
          <DisclaimerBanner />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onVerifyAnother}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-elevated transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Verify Another Medicine</span>
            </button>

            {isSuspicious && (
              <button
                onClick={() => onReportMedicine({
                  medicine_name: result.database_record?.name || result.scanned_details?.name || '',
                  manufacturer: result.scanned_details?.manufacturer || result.database_record?.manufacturer || '',
                  batch_number: result.scanned_details?.batch_number || '',
                  expiry_date: result.scanned_details?.expiry_date || '',
                  suspicion_reason: result.mismatched_fields.length > 0 ? `${result.mismatched_fields[0].field_name} discrepancy` : 'Inconsistency detected during verification'
                })}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-elevated transition-all active:scale-95"
              >
                <FileWarning className="w-4 h-4" />
                <span>Submit Suspicious Drug Report</span>
              </button>
            )}
          </div>

          <button
            onClick={onViewHistory}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>Audit History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
