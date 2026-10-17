import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Calendar, 
  Eye, 
  Printer, 
  RefreshCw, 
  ArrowUpDown,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getHistory } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function HistoryPage({ onSelectResult }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const limit = 10;

  // Selected item modal
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory({
        search: searchTerm,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        sort_by: sortBy,
        order: sortOrder,
        skip: page * limit,
        limit: limit,
      });
      setHistoryItems(data.items || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('[Fetch History Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchTerm, statusFilter, sortBy, sortOrder, page]);

  const handlePrintScan = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> SUSPICIOUS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-500/30">
            <HelpCircle className="w-3.5 h-3.5" /> UNABLE TO VERIFY
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white font-display">
            Verification Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review past packaging verification records, conflicting parameter logs, and certificates.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-500' : 'text-slate-400'}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-soft space-y-3 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              placeholder="Search by medicine name, barcode, or details..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-white"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 bg-slate-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-bold"
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="VERIFIED">Verified Matches</option>
              <option value="SUSPICIOUS">Suspicious Alerts</option>
              <option value="UNABLE_TO_VERIFY">Unable to Verify</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <div className="sm:col-span-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 bg-slate-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-bold"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

        </div>
      </div>

      {/* History Records Table / Cards */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft overflow-hidden backdrop-blur-md">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-500" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Loading audit history...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <History className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 stroke-[1.5]" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No verification scans found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Scans performed through the camera scanner or manual lookup will be archived here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                <tr>
                  <th className="py-4 px-5">Medicine / Formulation</th>
                  <th className="py-4 px-4">GTIN / Code</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Scan Date & Time</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historyItems.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-navy-950 dark:text-white text-sm">
                        {scan.scanned_medicine_name || 'Unregistered Formulation'}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                        {scan.explanation}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                      {scan.product_identifier || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(scan.status)}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {scan.created_at ? new Date(scan.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-500/10 hover:bg-brand-500/20 px-3.5 py-1.5 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalCount > limit && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, totalCount)} of {totalCount} total scans
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-40 font-bold"
              >
                Previous
              </button>
              <button
                disabled={(page + 1) * limit >= totalCount}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-40 font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">Audit Record #{selectedScan.id}</span>
                <h3 className="text-xl font-black text-navy-950 dark:text-white mt-1">
                  {selectedScan.scanned_medicine_name || 'Archived Medicine Scan'}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedScan(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Outcome:</span>
                {getStatusBadge(selectedScan.status)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Assessment</span>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedScan.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Identifier / GTIN</span>
                  <span className="font-mono font-bold text-navy-950 dark:text-white">{selectedScan.product_identifier || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-slate-400 uppercase font-semibold block text-[10px]">Method Used</span>
                  <span className="font-bold text-navy-950 dark:text-white">{selectedScan.verification_method}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onSelectResult(selectedScan);
                  setSelectedScan(null);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
              >
                <span>Open Full Certificate View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedScan(null)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <DisclaimerBanner />

    </div>
  );
}
