import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileWarning, 
  Scan, 
  RefreshCw, 
  TrendingUp, 
  Database,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  MapPin,
  Clock
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { getDashboardStats } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function DashboardPage({ setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('[Fetch Dashboard Stats Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieColors = ['#10b981', '#f59e0b', '#64748b'];

  const indianRegionalHubs = [
    { state: 'Maharashtra (Mumbai / Pune)', scans: 428, verifiedRate: '92.4%', risk: 'Low' },
    { state: 'Karnataka (Bengaluru / Mysuru)', scans: 384, verifiedRate: '94.8%', risk: 'Low' },
    { state: 'Delhi NCR (New Delhi / Noida)', scans: 312, verifiedRate: '88.1%', risk: 'Moderate' },
    { state: 'Telangana (Hyderabad)', scans: 276, verifiedRate: '95.2%', risk: 'Low' },
    { state: 'West Bengal (Kolkata)', scans: 198, verifiedRate: '86.4%', risk: 'Attention' },
    { state: 'Tamil Nadu (Chennai / Coimbatore)', scans: 245, verifiedRate: '96.1%', risk: 'Low' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>National Surveillance Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white font-display">
            Medicine Quality & Verification Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time telemetry, discrepancy clustering, and verification trends across Indian pharmaceutical queries.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-500' : 'text-slate-400'}`} />
          <span>Sync Live Analytics</span>
        </button>
      </div>

      {/* Demo Notice Ribbon */}
      <div className="p-4 bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 rounded-2xl flex items-center justify-between text-xs text-brand-900 dark:text-brand-200 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
          <span>
            <strong>Demonstration Telemetry:</strong> Metrics are computed live from your local database with sample CDSCO records and simulated scan events.
          </span>
        </div>
        <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 bg-brand-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
          Active Test Nodes
        </span>
      </div>

      {isLoading || !stats ? (
        <div className="py-24 text-center text-slate-400 space-y-4">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto text-brand-500" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Aggregating database verification metrics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total Scans */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider">Total Scans</span>
                <Scan className="w-4 h-4 text-brand-500" />
              </div>
              <p className="text-3xl font-black text-navy-950 dark:text-white font-mono">
                {stats.total_scans}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>+14.2% this week</span>
              </div>
            </div>

            {/* Verified Matches */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl border border-emerald-500/30 shadow-soft space-y-2 bg-gradient-to-br from-emerald-500/5 to-transparent backdrop-blur-md">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-[10px] font-black uppercase tracking-wider">Catalog Matches</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.verified_matches}
              </p>
              <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 block font-medium">100% parameter match</span>
            </div>

            {/* Suspicious Alerts */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl border border-amber-500/30 shadow-soft space-y-2 bg-gradient-to-br from-amber-500/5 to-transparent backdrop-blur-md">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span className="text-[10px] font-black uppercase tracking-wider">Discrepancy Alerts</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {stats.suspicious_count}
              </p>
              <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 block font-medium">Tampered / Expired</span>
            </div>

            {/* Unable to Verify */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider">Uncataloged</span>
                <HelpCircle className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-3xl font-black text-slate-700 dark:text-slate-300 font-mono">
                {stats.unable_to_verify_count}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Absent from demo catalog</span>
            </div>

            {/* Reports Submitted */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl border border-rose-500/30 shadow-soft space-y-2 bg-gradient-to-br from-rose-500/5 to-transparent col-span-2 lg:col-span-1 backdrop-blur-md">
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                <span className="text-[10px] font-black uppercase tracking-wider">Reports Logged</span>
                <FileWarning className="w-4 h-4" />
              </div>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {stats.reports_submitted}
              </p>
              <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 block font-medium">Formal CDSCO cases</span>
            </div>

          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Status Distribution Pie Chart */}
            <div className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-4 backdrop-blur-md">
              <div>
                <h3 className="font-extrabold text-navy-950 dark:text-white text-base">Verification Outcome Ratio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Proportion of verified vs suspicious vs uncataloged scans</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.status_distribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {stats.status_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name) => [`${value} Scans`, name]}
                      contentStyle={{ 
                        borderRadius: '16px', 
                        backgroundColor: '#0f172a',
                        color: '#f8fafc',
                        border: '1px solid rgba(255,255,255,0.1)', 
                        fontSize: '12px' 
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scans Over Time Trend Chart */}
            <div className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-4 backdrop-blur-md">
              <div>
                <h3 className="font-extrabold text-navy-950 dark:text-white text-base">Verification Timeline Volume</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily verification distribution categorized by outcome</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="verifiedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        backgroundColor: '#0f172a',
                        color: '#f8fafc',
                        border: '1px solid rgba(255,255,255,0.1)', 
                        fontSize: '12px' 
                      }} 
                    />
                    <Area type="monotone" dataKey="verified" name="Verified" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#verifiedGrad)" />
                    <Area type="monotone" dataKey="suspicious" name="Suspicious" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#suspiciousGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Regional Hub Activity Breakdown */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft p-6 sm:p-8 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-navy-950 dark:text-white text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  Indian Regional Distribution & Compliance Benchmarks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Simulated state pharmacy monitoring & verification volumes</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">6 Active Zones</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indianRegionalHubs.map((hub, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-950 dark:text-white truncate">{hub.state}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      hub.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {hub.risk} Risk
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span>{hub.scans} Queries</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold">{hub.verifiedRate} Authentic</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft p-6 sm:p-8 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-navy-950 dark:text-white text-base">Recent Verification Activity Feed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live feed of most recent scans executed across this system</p>
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Audit Archive</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recent_scans.map((scan) => (
                <div key={scan.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-navy-950 dark:text-white">
                      {scan.scanned_medicine_name || 'Unregistered Formulation'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      GTIN: {scan.product_identifier || 'N/A'} • Method: {scan.verification_method}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      scan.status === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : scan.status === 'SUSPICIOUS'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
                    }`}>
                      {scan.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {scan.created_at ? new Date(scan.created_at).toLocaleTimeString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Safety Notice */}
      <DisclaimerBanner />

    </div>
  );
}
