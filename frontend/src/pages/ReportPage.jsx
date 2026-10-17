import React, { useState } from 'react';
import { 
  FileWarning, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Send, 
  Upload, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { submitReport, getReport } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function ReportPage({ initialData = null }) {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'track'
  
  // New Report Form
  const [formData, setFormData] = useState({
    medicine_name: initialData?.medicine_name || '',
    manufacturer: initialData?.manufacturer || '',
    batch_number: initialData?.batch_number || '',
    expiry_date: initialData?.expiry_date || '',
    purchase_location: '',
    suspicion_reason: initialData?.suspicion_reason || 'QR code does not match',
    description: '',
    contact_info: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  // Track Existing Report
  const [searchReferenceId, setSearchReferenceId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedReport, setTrackedReport] = useState(null);
  const [trackError, setTrackError] = useState(null);

  const suspicionReasons = [
    'QR code does not match',
    'Manufacturer details differ',
    'Batch number mismatch',
    'Expired or unclear expiry date',
    'Damaged or unusual packaging',
    'Inconsistent pill color, texture, or odor',
    'No bill/invoice provided by chemist',
    'Other concern'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medicine_name.trim() || !formData.description.trim()) {
      setErrorMessage('Please fill in the medicine name and a description of the issue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitReport(formData);
      setSubmitSuccess(response);
    } catch (err) {
      console.error('[Submit Report Error]:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!searchReferenceId.trim()) return;

    setIsSearching(true);
    setTrackError(null);
    setTrackedReport(null);

    try {
      const response = await getReport(searchReferenceId.trim());
      setTrackedReport(response);
    } catch (err) {
      console.error('[Track Report Error]:', err);
      setTrackError('No incident report was found with reference ID: ' + searchReferenceId);
    } finally {
      setIsSearching(false);
    }
  };

  const copyReference = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20 dark:border-amber-500/30 uppercase tracking-wider">
          <FileWarning className="w-3.5 h-3.5" />
          <span>Community Pharmaceutical Surveillance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight font-display">
          Report Fake or Suspicious Medicine
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Submit suspicious packaging, printing anomalies, or tampered medicines for catalog logging and analysis.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-2 gap-2">
          
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'new'
                ? 'bg-white dark:bg-slate-800 text-navy-950 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Send className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Submit New Incident Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'track'
                ? 'bg-white dark:bg-slate-800 text-navy-950 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Track Existing Report</span>
          </button>

        </div>

        <div className="p-6 sm:p-8">

          {/* TAB 1: New Report Submission Form */}
          {activeTab === 'new' && (
            <div>
              {submitSuccess ? (
                <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-navy-950 dark:text-white font-display">
                      Incident Report Logged Successfully
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Thank you for reporting. Your entry has been recorded in the demonstration database with the unique tracking reference below.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 max-w-sm mx-auto space-y-3">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Report Reference ID</span>
                    <div className="flex items-center justify-center gap-3 font-mono text-2xl font-black text-navy-950 dark:text-white">
                      <span>{submitSuccess.report_reference}</span>
                      <button
                        type="button"
                        onClick={() => copyReference(submitSuccess.report_reference)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                        title="Copy Reference"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Status: {submitSuccess.status}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitSuccess(null);
                        setFormData({
                          medicine_name: '',
                          manufacturer: '',
                          batch_number: '',
                          expiry_date: '',
                          purchase_location: '',
                          suspicion_reason: 'QR code does not match',
                          description: '',
                          contact_info: '',
                        });
                      }}
                      className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
                    >
                      File Another Incident Report
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Medicine Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Medicine Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.medicine_name}
                        onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                        placeholder="e.g., Asthalin Inhaler, Augmentin 625 Duo"
                        className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Manufacturer */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Manufacturer (Printed on pack)</label>
                      <input
                        type="text"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="e.g., Cipla Ltd or suspicious entity"
                        className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Batch Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Batch / Lot Number</label>
                      <input
                        type="text"
                        value={formData.batch_number}
                        onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                        placeholder="e.g., AS9912 or printed batch"
                        className="w-full text-sm font-mono uppercase px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expiry Date</label>
                      <input
                        type="text"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                        placeholder="e.g., MM/YYYY"
                        className="w-full text-sm font-mono px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Purchase Location */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Purchase Location / Pharmacy Details</label>
                      <input
                        type="text"
                        value={formData.purchase_location}
                        onChange={(e) => setFormData({ ...formData, purchase_location: e.target.value })}
                        placeholder="e.g., Apollo Pharmacy, Indiranagar, Bengaluru or Local Chemist, Mumbai"
                        className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Reason for Suspicion */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Primary Reason for Suspicion <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.suspicion_reason}
                        onChange={(e) => setFormData({ ...formData, suspicion_reason: e.target.value })}
                        className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                      >
                        {suspicionReasons.map((reason) => (
                          <option key={reason} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>

                    {/* Detailed Description */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Detailed Description of the Issue <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Explain why the medicine appears suspicious (e.g. barcode didn't scan, label peeling, spelling errors in brand name, different capsule color, missing MRP print)..."
                        className="w-full text-sm p-4 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Information (Optional - Email or Phone)</label>
                      <input
                        type="text"
                        value={formData.contact_info}
                        onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                        placeholder="email@domain.com or +91 98765 43210"
                        className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reports generate an official tracking ID and are logged in the database.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-elevated transition-all active:scale-95 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: Track Existing Report Status */}
          {activeTab === 'track' && (
            <div className="space-y-6">
              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchReferenceId}
                  onChange={(e) => setSearchReferenceId(e.target.value)}
                  placeholder="Enter Reference ID (e.g. MV-2026-X8801)"
                  className="flex-1 text-sm font-mono px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white uppercase"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>{isSearching ? 'Searching...' : 'Search'}</span>
                </button>
              </form>

              {trackError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}

              {trackedReport && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-3xl p-6 bg-slate-50/70 dark:bg-slate-850 space-y-4 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-750 pb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Report Reference</span>
                      <h3 className="font-mono font-black text-xl text-navy-950 dark:text-white">{trackedReport.report_reference}</h3>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Status: {trackedReport.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-400 uppercase font-black text-[10px] block">Medicine</span>
                      <p className="font-bold text-navy-950 dark:text-white mt-0.5">{trackedReport.medicine_name}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-400 uppercase font-black text-[10px] block">Manufacturer</span>
                      <p className="font-bold text-navy-950 dark:text-white mt-0.5">{trackedReport.manufacturer || 'Unspecified'}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-400 uppercase font-black text-[10px] block">Batch / Expiry</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">{trackedReport.batch_number || 'N/A'} • {trackedReport.expiry_date || 'N/A'}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-400 uppercase font-black text-[10px] block">Purchase Point</span>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5">{trackedReport.purchase_location || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Reason for Suspicion</span>
                    <p className="font-bold text-amber-600 dark:text-amber-400">{trackedReport.suspicion_reason}</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{trackedReport.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />

    </div>
  );
}
