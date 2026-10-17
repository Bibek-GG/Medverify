import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Clock, Building2, Sparkles } from 'lucide-react';

export const DEMO_PRESETS = [
  {
    id: 'dolo-match',
    expectedStatus: 'VERIFIED',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    title: 'Match Scenario: Dolo-650 Tablets',
    subtitle: 'Authentic registered GTIN, Batch & Expiry',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    data: {
      product_identifier: '8901234567890',
      name: 'Dolo-650 Tablets',
      manufacturer: 'Micro Labs Ltd',
      batch_number: 'DL24098',
      expiry_date: '02/2027',
      verification_method: 'QR_BARCODE',
    },
    description: 'All submitted parameters exactly match the configured sample registry.'
  },
  {
    id: 'asthalin-batch-mismatch',
    expectedStatus: 'SUSPICIOUS',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    title: 'Discrepancy: Batch Code Tampered',
    subtitle: 'Asthalin Inhaler with counterfeit batch',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    data: {
      product_identifier: '8906789012356',
      name: 'Asthalin Inhaler 100mcg',
      manufacturer: 'Cipla Ltd',
      batch_number: 'AS9999-TAMPERED',
      expiry_date: '01/2026',
      verification_method: 'IMAGE_OCR',
    },
    description: 'Valid product code, but batch AS9999-TAMPERED conflicts with registered batch AS9912.'
  },
  {
    id: 'monocef-mfg-mismatch',
    expectedStatus: 'SUSPICIOUS',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    title: 'Discrepancy: Counterfeit Entity',
    subtitle: 'Monocef with fake manufacturer entity',
    icon: Building2,
    iconColor: 'text-rose-500',
    data: {
      product_identifier: '8907890123467',
      name: 'Monocef 1g Injection',
      manufacturer: 'Apex Remedies (Suspected Fake Entity)',
      batch_number: 'MN4432',
      expiry_date: '03/2026',
      verification_method: 'MANUAL_ENTRY',
    },
    description: 'Monocef registered under Aristo Pharmaceuticals, but packaging claims Apex Remedies.'
  },
  {
    id: 'pand-expired',
    expectedStatus: 'SUSPICIOUS',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    title: 'Safety Warning: Expired Medication',
    subtitle: 'Pan-D Capsules past shelf-life',
    icon: Clock,
    iconColor: 'text-rose-500',
    data: {
      product_identifier: '8908901234578',
      name: 'Pan-D Capsules',
      manufacturer: 'Alkem Laboratories Ltd',
      batch_number: 'PD1092',
      expiry_date: '12/2023',
      verification_method: 'QR_BARCODE',
    },
    description: 'Packaging indicates batch expired in Dec 2023. Triggers immediate patient safety warning.'
  },
  {
    id: 'unknown-code',
    expectedStatus: 'UNABLE_TO_VERIFY',
    badgeColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
    title: 'Uncataloged: Unregistered Product ID',
    subtitle: 'Product code not found in sample database',
    icon: HelpCircle,
    iconColor: 'text-slate-400 dark:text-slate-500',
    data: {
      product_identifier: '8909999999999',
      name: 'Generic Cough Linctus',
      manufacturer: 'Unknown Regional Manufacturer',
      batch_number: 'LOT-9011',
      expiry_date: '08/2026',
      verification_method: 'MANUAL_ENTRY',
    },
    description: 'Returns neutral unable-to-verify state without declaring medicine counterfeit.'
  }
];

export default function DemoPresetSelector({ onSelectPreset, selectedPresetId }) {
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-soft backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-navy-950 dark:text-white text-sm">Quick Evaluator Presets</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Click any scenario to autofill parameters and test verification outcomes</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full border border-brand-500/20">
          1-Click Presets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEMO_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-brand-50/80 dark:bg-slate-800 border-brand-500 shadow-md ring-2 ring-brand-500/30'
                  : 'bg-white/60 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${preset.badgeColor}`}>
                  {preset.expectedStatus.replace('_', ' ')}
                </span>
                <Icon className={`w-4 h-4 ${preset.iconColor} flex-shrink-0`} />
              </div>
              <p className="font-bold text-xs text-navy-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                {preset.title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {preset.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
