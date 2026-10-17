import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>
            <strong>Health & Safety Notice:</strong> MedVerify provides preliminary consistency checks. A matching barcode cannot independently guarantee physical chemical authenticity or safe storage.
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside aria-label="Healthcare verification disclaimer" className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-400/30 dark:border-amber-700/50 rounded-3xl p-5 sm:p-6 shadow-soft my-6 backdrop-blur-md">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-3 bg-amber-500/20 dark:bg-amber-500/30 rounded-2xl text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
          <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-base">Important Healthcare Safety Disclaimer</h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            MedVerify India checks product parameters against registered catalog records. <strong>It cannot conclusively determine whether a physical medicine package is genuine or whether its chemical contents remain unadulterated.</strong>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Never discontinue or alter prescribed medication without direct guidance from a licensed physician or registered medical professional. If a product appears suspicious, consult your pharmacist or report to the Central Drugs Standard Control Organisation (CDSCO).
          </p>
        </div>
      </div>
    </aside>
  );
}
