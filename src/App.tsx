import { useState, useEffect, FormEvent } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Bell, 
  Terminal, 
  Compass, 
  FileSpreadsheet, 
  Users, 
  PlusCircle, 
  FolderGit2, 
  Eye, 
  Activity, 
  Sparkles, 
  Download, 
  Maximize2,
  Printer,
  X,
  Radio,
  FileDown,
  Github,
  Info,
  Globe
} from 'lucide-react';
import { Project, UserProfile, ContributorRanking, ActivityChange, SystemAlert, APIDocEndpoint } from './types';
import MetricCards from './components/MetricCards';
import ProjectTable from './components/ProjectTable';
import Leaderboard from './components/Leaderboard';
import AnalyticsCharts from './components/AnalyticsCharts';
import ProjectHeatmap from './components/ProjectHeatmap';
import brazilSinghAvatar from './assets/images/brazil_singh_avatar_1779533131692.png';

export default function App() {
  // Live Dashboard states
  const [projects, setProjects] = useState<Project[]>([]);
  const [contributors, setContributors] = useState<ContributorRanking[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityChange[]>([]);
  const [encryptionLogs, setEncryptionLogs] = useState<any[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIDocEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Active User Persona (Read-only spectator)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: "Secure Guest Viewer",
    email: "guest@youthmappers.org",
    role: "Guest",
    isApproved: true,
    chapter: "Independent Observer",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    encryptionPublicKey: "rsa_pub_ym_gst_3338ee31fda..."
  });

  // Navigation / Tab states
  const [dashboardTab, setDashboardTab] = useState<'bento' | 'api-docs' | 'encryption-audit' | 'about'>('bento');
  const [alertOpen, setAlertOpen] = useState(false);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  
  // Create project form states
  const [formData, setFormData] = useState({
    title: '',
    projectId: 'HOT #',
    source: 'HOT' as 'HOT' | 'TeachOSM',
    totalTasks: 300,
    campaign: 'Regional Capacity Build',
    country: 'Kenya',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    description: ''
  });

  // State to simulate push alert toasted popup
  const [toastAlert, setToastAlert] = useState<SystemAlert | null>(null);

  // Static read-only metadata parameters
  const roleOptions: { name: string; email: string; role: any; chapter: string; key: string }[] = [
    { name: "Secure Guest Viewer", email: "guest@youthmappers.org", role: "Guest", chapter: "Independent Observer", key: "rsa_pub_ym_gst_3338ee31fda..." }
  ];

  // Fetch initial stats
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [projRes, leaderboardRes, alertRes, actRes, cryptRes, docRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/leaderboard'),
        fetch('/api/alerts'),
        fetch('/api/activities'),
        fetch('/api/encryption/logs'),
        fetch('/api/docs')
      ]);

      const projData = await projRes.json();
      const leaderboardData = await leaderboardRes.json();
      const alertData = await alertRes.json();
      const actData = await actRes.json();
      const cryptData = await cryptRes.json();
      const docData = await docRes.json();

      if (projData.success) setProjects(projData.projects);
      if (leaderboardData.success) setContributors(leaderboardData.contributors);
      
      // Toast notification if a new alert arrives that is unread
      if (alertData.success && alertData.alerts.length > 0) {
        const latestAlert = alertData.alerts[0];
        const alreadyHasAlert = alerts.some(a => a.id === latestAlert.id);
        if (!alreadyHasAlert && alerts.length > 0 && latestAlert.unread) {
          setToastAlert(latestAlert);
          setTimeout(() => setToastAlert(null), 6000);
        }
        setAlerts(alertData.alerts);
      }
      
      if (actData.success) setRecentActivities(actData.activities);
      if (cryptData.success) setEncryptionLogs(cryptData.logs);
      if (docData.success) setApiEndpoints(docData.endpoints);

      setErrorMessage('');
    } catch (err) {
      console.error("Error communicating with YouthMappers dashboard back-end server:", err);
      setErrorMessage("Lost connectivity to validation server. Please verify Express server status on Port 3000.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Syncing states
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState('');

  const handleSyncLiveAPI = async () => {
    setSyncing(true);
    setSyncError('');
    setSyncSuccess('');
    try {
      const res = await fetch('/api/projects/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setSyncSuccess(data.message || "Real-time Tasking Managers synchronized successfully!");
        setProjects(data.projects);
        // Silent query to refresh recent activity and alerts list
        fetchData(true);
        setTimeout(() => setSyncSuccess(''), 6000);
      } else {
        setSyncError(data.message || "Failed to trigger live Search Grounding API sync.");
        setTimeout(() => setSyncError(''), 8000);
      }
    } catch (err: any) {
      console.error("Sync error:", err);
      setSyncError("Lost back-end connection or failed to poll Gemini Search API.");
      setTimeout(() => setSyncError(''), 8000);
    } finally {
      setSyncing(false);
    }
  };

  // Background polling to mirror real-time simulation tick on server: every 8 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Static placeholder for profile configuration
  const handleRoleChange = (idx: number) => {
    // Disabled in secure read-only instance
  };

  // Trigger Validation (E2E Encrypted Payload simulation POST)
  const handleValidationSubmit = async (projId: string, count: number, cipherText: string) => {
    try {
      const response = await fetch(`/api/projects/${projId}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedPayload: cipherText,
          validatorEmail: currentUser.email
        })
      });
      const data = await response.json();
      if (data.success) {
        // Optimistic refresh
        fetchData(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Trigger Mapping simulation POST
  const handleMappingSubmit = async (projId: string, count: number) => {
    try {
      const response = await fetch(`/api/projects/${projId}/map`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          mapperName: currentUser.name
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchData(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Track Custom Project Addition (Local State update proxy)
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setNewProjectModal(false);
        // Reset form
        setFormData({
          title: '',
          projectId: 'HOT #',
          source: 'HOT',
          totalTasks: 350,
          campaign: 'Regional Capacity Build',
          country: 'Rwanda',
          difficulty: 'Medium',
          description: ''
        });
        fetchData();
      } else {
        alert(data.message || "Failed to create campaign.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Report Downloader
  const handleDownloadCSV = async (selectedSource: string) => {
    try {
      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'csv', selectedSource })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youthmappers-validation-report-${selectedSource.toLowerCase()}-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setExportModal(false);
    } catch (err) {
      alert("Failed to export report CSV");
    }
  };

  // Trigger browser print representing dynamic PDF generator layout
  const handlePrintPDF = () => {
    window.print();
  };

  // Dismiss alerts
  const markAlertsAllRead = async () => {
    try {
      await fetch('/api/alerts/mark-read', { method: 'POST' });
      fetchData(true);
    } catch (err) {}
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans flex flex-col antialiased text-slate-800 dark:text-zinc-100" id="youthmappers-app">
      {/* Dev notification warning if server error occurs */}
      {errorMessage && (
        <div className="bg-rose-500 text-white text-xs px-6 py-2.5 flex items-center justify-between font-mono font-bold shrink-0 sticky top-0 z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 animate-ping" />
            <span>Telemetry Error: {errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Close</button>
        </div>
      )}

      {/* Dynamic Push Toast Notification Alarms */}
      {toastAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-teal-500/30 text-white rounded-2xl shadow-2xl p-4 flex gap-3 animate-slide-in-up border-l-4 border-l-teal-500">
          <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg shrink-0 h-8 w-8 flex items-center justify-center">
            <Bell className="h-4 w-4 animate-swing" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-400">Push Alert Notification</h4>
              <button onClick={() => setToastAlert(null)} className="text-zinc-400 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <h5 className="text-sm font-bold mt-1 text-white">{toastAlert.title}</h5>
            <p className="text-xs text-zinc-300 mt-1">{toastAlert.message}</p>
            <span className="text-[10px] text-zinc-550 block mt-2 font-mono">Timestamp: {new Date(toastAlert.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Main Bar Navigation */}
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800/80 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-xs z-25 sticky top-0" id="title-app-navigation">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 select-none flex items-center justify-center shrink-0">
            <svg viewBox="0 0 800 900" className="w-[34px] h-[38px] hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer">
              {/* Globe circle background */}
              <path d="M 215,790 A 350,350 0 0,0 870,330 A 350,350 0 0,1 215,790" fill="#92D4D4" />
              {/* Continental green shapes */}
              <path d="M 460,865 C 475,868 495,864 510,855 C 520,840 550,810 562,790 C 570,770 550,710 470,700 C 420,695 460,650 500,660 C 550,670 600,680 642,710 C 660,700 680,680 720,700 C 750,710 740,650 780,640 C 820,630 840,550 820,530 C 800,510 820,480 840,460 A 350,350 0 0,1 870,330 A 350,350 0 0,1 865,490 C 840,580 840,750 735,830 C 670,880 580,900 460,865 Z" fill="#4C8C00" />
              {/* Navy blue silhouettes */}
              <path d="M 520,540 C 540,480 620,400 706,340 C 770,300 802,310 862,310 C 820,360 740,440 680,530 C 640,590 600,650 550,740 L 520,540 Z" fill="#2E3C64" />
              <circle cx="790" cy="270" r="70" fill="#2E3C64" />
              <path d="M 430,684 C 362,686 200,634 110,610 C 40,590 5,615 50,642 C 100,670 205,730 353,745 L 430,684 Z" fill="#2E3C64" />
              <circle cx="118" cy="740" r="70" fill="#2E3C64" />
              <path d="M 480,590 C 390,560 210,480 150,450 C 75,410 38,440 120,480 C 190,520 310,570 410,635 L 480,590 Z" fill="#2E3C64" />
              <circle cx="108" cy="530" r="70" fill="#2E3C64" />
              <path d="M 440,590 C 352,500 240,400 170,340 C 110,290 85,320 180,390 C 230,435 340,520 405,622 L 440,590 Z" fill="#2E3C64" />
              <circle cx="138" cy="490" r="70" fill="#2E3C64" fillOpacity="0" />
              {/* Orange location pin */}
              <path d="M 440,10 C 220,10 115,200 115,365 C 115,480 200,550 350,725 C 430,810 440,820 440,820 C 440,820 450,810 530,725 C 680,550 765,480 765,365 C 765,200 660,10 440,10 Z M 440,410 C 350,410 270,340 270,250 C 270,160 350,90 440,90 C 530,90 610,165 610,250 C 610,340 530,410 440,410 Z" fill="#FF5C00" />
              <circle cx="440" cy="250" r="110" fill="#FFFFFF" />
            </svg>
          </div>
          <div>
            <h1 className="text-md sm:text-lg font-black tracking-tight text-zinc-800 dark:text-zinc-50 flex items-center gap-1.5 font-sans">
              YouthMappers <span className="text-teal-600 dark:text-teal-400 font-semibold font-mono text-xs sm:text-sm bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-lg">Validation Hub</span>
            </h1>
            <p className="hidden md:block text-[10px] text-zinc-400 font-mono">Direct instance interface supporting HOT &amp; TeachOSM Task Managers</p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="hidden lg:flex gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button 
            onClick={() => setDashboardTab('bento')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${dashboardTab === 'bento' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-300'}`}
          >
            <Compass className="h-3.5 w-3.5 text-teal-600" /> Bento Workspace
          </button>
          <button 
            onClick={() => setDashboardTab('api-docs')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${dashboardTab === 'api-docs' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-300'}`}
          >
            <Terminal className="h-3.5 w-3.5" /> API Documentation
          </button>
          <button 
            onClick={() => setDashboardTab('encryption-audit')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${dashboardTab === 'encryption-audit' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-300'}`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Security Audit Logs
          </button>
          <button 
            onClick={() => setDashboardTab('about')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${dashboardTab === 'about' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-300'}`}
          >
            <Info className="h-3.5 w-3.5 text-indigo-500" /> About Hub &amp; YM
          </button>
        </div>

        {/* User Identity switcher & Notifications */}
        <div className="flex items-center gap-3 md:gap-5" id="user-controls-strip">
          
          {/* Mobile Tab view select */}
          <div className="block lg:hidden">
            <select
              value={dashboardTab}
              onChange={(e: any) => setDashboardTab(e.target.value)}
              className="px-2 py-1.5 text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-50 focus:outline-none"
            >
              <option value="bento">Bento Workspace</option>
              <option value="api-docs">API Docs</option>
              <option value="encryption-audit">Audit Logs</option>
              <option value="about">About Hub &amp; YouthMappers</option>
            </select>
          </div>

          {/* Quick Alarm Push Alerts bell */}
          <div className="relative">
            <button 
              onClick={() => { setAlertOpen(!alertOpen); markAlertsAllRead(); }}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all relative"
              id="notifications-bell-toggle"
            >
              <Bell className="h-5 w-5" />
              {alerts.some(a => a.unread) && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full border border-white dark:border-zinc-900 animate-ping" />
              )}
            </button>

            {/* Micro Alerts Dropper */}
            {alertOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-40 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                <div className="p-3 bg-zinc-55/40 dark:bg-zinc-900 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5" /> Push Broadcast System
                  </h4>
                  <button onClick={() => setAlertOpen(false)} className="text-[10px] text-zinc-450 font-semibold hover:underline">Dismiss</button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
                  {alerts.length === 0 ? (
                    <p className="p-4 text-xs text-center text-zinc-400">No active network updates.</p>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all text-xs">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                            alert.severity === 'alert' ? 'bg-red-50 text-red-600 dark:bg-red-950/20' :
                            alert.severity === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-teal-50 text-teal-600 dark:bg-teal-950/20'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <h6 className="font-bold text-zinc-800 dark:text-zinc-100 mt-1 max-w-[220px] truncate">{alert.title}</h6>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800"></div>

          {/* Static spectator session info */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400 py-1.5 px-3 rounded-xl border border-teal-200/40 dark:border-teal-900/40 animate-scale-up">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secure Guest Observer
            </span>
          </div>

        </div>
      </header>

      {/* Primary Dashboard Content Area */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-hidden">

        {/* Loading Indicator Spinner overlay */}
        {loading && (
          <div className="fixed inset-0 bg-slate-55/60 dark:bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-600 rounded-full animate-spin" />
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 font-mono animate-pulse">Syncing YouthMappers Data Engine...</p>
          </div>
        )}

        {/* Page title and actions banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-850 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
              Validation Team Workspace
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Currently monitoring <span className="font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">{projects.length}</span> campaign feeds focusing exclusively on regional YouthMappers targets.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Sync Live API Button using Search Grounding */}
            <button
              onClick={handleSyncLiveAPI}
              disabled={syncing}
              className={`px-4 py-2 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                syncing
                  ? 'bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed'
                  : 'bg-indigo-650 hover:bg-indigo-700 hover:shadow-md'
              }`}
              title="Queries Search Grounding API for actual, live YouthMappers projects on HOT and TeachOSM Tasking Managers"
            >
              <Sparkles className={`h-4 w-4 text-amber-300 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronizing Live...' : 'Sync Live API'}
            </button>

            {/* Quick action button to track new project */}
            <button
              onClick={() => setNewProjectModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
              id="btn-add-campaign"
            >
              <PlusCircle className="h-4 w-4" /> Track Project ID
            </button>

            <button
              onClick={() => setExportModal(true)}
              className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-855/50 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              id="btn-export-center"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Reports
            </button>
            
            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              title="Print current page as report PDF"
            >
              <Printer className="h-4 w-4 text-indigo-500" /> Print / PDF
            </button>
          </div>
        </div>

        {/* Sync Status Feedback Banners */}
        {syncSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 p-3.5 rounded-2xl text-xs font-bold leading-relaxed flex items-center gap-2.5 animate-scale-up">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{syncSuccess}</span>
          </div>
        )}

        {syncError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-bold leading-relaxed flex flex-col gap-1.5 animate-scale-up">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span>{syncError}</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 pl-5 font-normal">
              To resolve, go to the top-right <span className="font-bold">Settings &gt; Secrets</span> panel in the AI Studio editor header and add or verify your <span className="font-bold">GEMINI_API_KEY</span> identifier.
            </p>
          </div>
        )}



        {/* Tab Selector Contents */}

        {/* tab 1: MAIN BENTO MATRIX WORKSPACE */}
        {dashboardTab === 'bento' && (
          <div className="space-y-6">
            
            {/* Aggregate Stats Section of Bento layout */}
            <MetricCards projects={projects} />

            {/* Nested Grid (Bento columns): Main Feed on the Left, Leaderboard and Live Feed on Right */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left Column (Span 8) - Primary Feeds & Verification Matrix */}
              <div className="col-span-12 lg:col-span-8 space-y-6 flex flex-col justify-between">
                
                {/* Active Interactive Project Table */}
                <div className="flex-1">
                  <ProjectTable 
                    projects={projects}
                    currentUser={currentUser}
                    onValidate={handleValidationSubmit}
                    onMap={handleMappingSubmit}
                  />
                </div>

                {/* Custom system alert feed banner */}
                <div className="bg-slate-900 text-zinc-300 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between flex-wrap gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-teal-500 border-2 border-zinc-900 font-bold" />
                      <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-zinc-900 font-bold" />
                      <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-zinc-900 font-bold" />
                    </div>
                    <span className="text-[11px] sm:text-xs">
                      YouthMappers validation engine matches tiles dynamically. <strong className="text-white">Role privileges enforced</strong> using asymmetric keystore simulation keys.
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDashboardTab('api-docs')}
                      className="px-3 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700/60"
                    >
                      Browse APIs
                    </button>
                    <button 
                      onClick={() => setDashboardTab('encryption-audit')}
                      className="px-3 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                    >
                      Audit Handshakes
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column (Span 4) - Analytics Speedometers & Individual/Chapter Leaderboards */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Real-time Progress Gauge Card (from AnalyticsCharts component) */}
                <div className="h-auto">
                  <AnalyticsCharts projects={projects} />
                </div>

                {/* Global Contributor Rankings */}
                <div>
                  <Leaderboard contributors={contributors} />
                </div>

                {/* Local Activity Feed (Bento Segment) */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-widest mb-3 flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-teal-600" />
                    Live Activity Handshake stream
                  </h3>
                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {recentActivities.slice(0, 5).map((act) => (
                      <div key={act.id} className="flex justify-between items-start text-xs border-b border-zinc-50 dark:border-zinc-800/20 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {act.user} <span className="font-normal text-zinc-400">submitted</span> {act.action}
                          </p>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">{act.projectTitle} ({act.source})</span>
                        </div>
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          act.action === 'Validated' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                        }`}>
                          +{act.count} tiles
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Custom Priorities Verification Heatmap using D3 */}
            {projects.length > 0 && (
              <ProjectHeatmap
                projects={projects}
                currentUser={currentUser}
                onValidateTile={handleValidationSubmit}
              />
            )}

          </div>
        )}

        {/* tab 2: INTERACTIVE API DOCUMENTATION PANEL */}
        {dashboardTab === 'api-docs' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-xs max-w-5xl mx-auto space-y-6" id="api-documentation-tab">
            <div>
              <div className="flex items-center gap-2 text-teal-605">
                <Terminal className="h-5 w-5 text-teal-600" />
                <span className="text-xs uppercase font-extrabold tracking-widest font-mono text-teal-600">Secure Integration Endpoint Catalog</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans mt-1">Robust Third-Party Connection & API Specifications</h3>
              <p className="text-xs text-zinc-500 mt-1">Connect your university chapter's external automations or mapping monitors securely. Access requires authenticated JSON authorization headers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs">
              <div className="p-2">
                <strong className="text-zinc-700 dark:text-zinc-200 block mb-1">Standard Encryption Policy:</strong>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  All mutate actions require symmetric payload encryption. Keys must be stored inside secrets configuration.
                </p>
              </div>
              <div className="p-2 border-y md:border-y-0 md:border-x border-zinc-200 dark:border-zinc-800">
                <strong className="text-zinc-700 dark:text-zinc-200 block mb-1">Rate Limits & CORS:</strong>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Enforced at server container limits. Authorized partners are capped to 10,000 queries per hour.
                </p>
              </div>
              <div className="p-2">
                <strong className="text-zinc-700 dark:text-zinc-200 block mb-1">Role scopes mapped:</strong>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Guests: GET only. Mappers: Map, GET. Validators: Validate. Admins: Create Project, Update-Role.
                </p>
              </div>
            </div>

            {/* Interactive REST display */}
            <div className="space-y-4">
              {apiEndpoints.map((ep) => (
                <div key={ep.path} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden font-mono text-xs">
                  <div className="bg-zinc-50/75 dark:bg-zinc-800/30 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        ep.method === 'GET' ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/20' : 'bg-teal-50 text-teal-600 dark:bg-teal-950/20'
                      }`}>
                        {ep.method}
                      </span>
                      <strong className="text-zinc-800 dark:text-zinc-100">{ep.path}</strong>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-sans">{ep.description}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-250 dark:border-zinc-800">
                    {/* Headers or requests parameter */}
                    <div className="p-4 bg-white dark:bg-zinc-950">
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-sans font-extrabold block mb-2">Request Body Schema</span>
                      {ep.requestBody ? (
                        <pre className="text-[11px] text-zinc-650 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg overflow-x-auto select-all max-h-40">{ep.requestBody}</pre>
                      ) : (
                        <p className="text-[11px] italic text-zinc-400 leading-relaxed font-sans">No Request body arguments required. Queries accepted.</p>
                      )}
                    </div>

                    {/* Standard Mock Response Payload */}
                    <div className="p-4 bg-white dark:bg-zinc-950">
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-sans font-extrabold block mb-2">Simulated Response Payload</span>
                      <pre className="text-[11px] text-zinc-650 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg overflow-x-auto max-h-40">{ep.responseBody}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* tab 3: SECURITY HANDSHAKES & ENCRYPTION AUDIT PANEL */}
        {dashboardTab === 'encryption-audit' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-xs max-w-5xl mx-auto space-y-6" id="security-telemetry-tab">
            <div>
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="h-5 w-5 fill-emerald-50 dark:fill-zinc-900" />
                <span className="text-xs uppercase font-extrabold tracking-widest font-mono">End-to-End Cryptography Audit Logs</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans mt-1">Live Encryption Verification Center</h3>
              <p className="text-xs text-zinc-500 mt-1">This panel visualizes the real-time server payload decryptions. All network submissions to tiles are encrypted using the client-side rsa key pair before posting.</p>
            </div>

            {/* Asymmetric Keys representation indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-150 dark:border-zinc-800 rounded-xl p-4 self-start bg-slate-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lock className="h-4 w-4" /> Client Public Handshake Keystore
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Your current active role profile (<strong className="text-zinc-700 dark:text-zinc-300">{currentUser.name}</strong>) has compiled the following transient RSA public authorization signature:
                </p>
                <div className="bg-zinc-900 text-teal-400 text-[10px] font-mono p-3 rounded-lg border border-zinc-800 mt-3 truncate break-all selection:bg-teal-500 select-all">
                  {currentUser.encryptionPublicKey}
                </div>
              </div>

              <div className="border border-zinc-150 dark:border-zinc-800 rounded-xl p-4 self-start bg-slate-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2">
                  <UserCheck className="h-4 w-4" /> Role Enforcement Policy (RBAC)
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Tokens are signed by regional coordinators using JSON crypt tags. Let's see the allowed permissions mapped on active profiles:
                </p>
                <div className="space-y-1.5 mt-3 text-[11px] font-mono">
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1">
                    <span className="text-zinc-400">Admin</span>
                    <span className="text-emerald-500 font-bold">ALL ACCESS + PROJECT CREATE</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1">
                    <span className="text-zinc-400">Validator</span>
                    <span className="text-blue-500 font-bold">SUBMIT secured tile validators</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1">
                    <span className="text-zinc-400">Mapper</span>
                    <span className="text-amber-500 font-bold">SUBMIT mapped tiles to TM feed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Guest</span>
                    <span className="text-zinc-400 italic">No mutate handshakes permitted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Encrypt/Decrypt Log telemetry */}
            <div>
              <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">Live Server Decryption Logs (API proxy payload audit)</h4>
              <div className="space-y-3 font-mono text-xs">
                {encryptionLogs.map((log, i) => (
                  <div key={log.timestamp + i} className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 px-4 py-2 text-zinc-400 text-[10px] flex justify-between items-center">
                      <span>Endpoint target: <strong className="text-zinc-700 dark:text-zinc-300">{log.endpoint}</strong></span>
                      <span>Decrypted timestamp: {new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-zinc-950 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
                      <div className="md:col-span-5 p-4 space-y-1 bg-zinc-900/90 text-zinc-400">
                        <strong className="text-[10px] uppercase font-sans font-bold text-red-400 block tracking-wider">Intercepted Base64 Ciphertext:</strong>
                        <p className="text-[11px] truncate select-all text-red-300/80">{log.cipherTextPreview}</p>
                        <span className="text-[10px] text-zinc-550 text-right block pt-1 font-sans">Encrypted Payload Size: {log.originalPayloadSize} bytes</span>
                      </div>
                      <div className="md:col-span-7 p-4 bg-white dark:bg-zinc-950 space-y-1">
                        <strong className="text-[10px] uppercase font-sans font-bold text-emerald-600 block tracking-wider">Decrypted JSON Output:</strong>
                        <code className="text-[11px] text-zinc-650 block bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md max-h-20 overflow-y-auto">{log.decryptedPlaintext}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* tab 4: ABOUT PAGE */}
        {dashboardTab === 'about' && (
          <div className="bg-white dark:bg-zinc-905 border border-zinc-100 dark:border-zinc-800 p-6 shadow-xs max-w-5xl mx-auto space-y-8 animate-scale-up" id="about-information-tab">
            
            {/* Header portion */}
            <div className="border-b border-zinc-105 dark:border-zinc-800 pb-5">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Info className="h-5 w-5" />
                <span className="text-xs uppercase font-extrabold tracking-widest font-mono text-zinc-500 dark:text-zinc-450">Platform Identity &amp; Mission Statement</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-50 font-sans mt-2">
                About the YouthMappers Validation Hub
              </h3>
              <p className="text-xs sm:text-sm text-zinc-505 dark:text-zinc-400 mt-2 leading-relaxed">
                This validation hub is a custom, high-visibility monitoring and synchronization workspace designed and maintained by <strong className="text-teal-700 dark:text-teal-400 font-extrabold">Brazil Singh</strong> (YouthMappers Regional Ambassador • Director of the OpenStreetMap Foundation).
              </p>
            </div>

            {/* Split layout: Hub info & YouthMappers info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left col: What is this Hub? */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <span className="p-1.5 bg-teal-50 dark:bg-teal-950/40 rounded-lg shrink-0">
                    <Compass className="h-4 w-4" />
                  </span>
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                    The Security &amp; Validation Hub
                  </h4>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-3 leading-relaxed">
                  <p>
                    The <strong className="text-zinc-700 dark:text-zinc-300">YouthMappers Validation Hub</strong> operates as a telemetry aggregator and role-based data validation workspace. It directly monitors YouthMappers mapping actions across the global <strong>Humanitarian OpenStreetMap Team (HOT)</strong> and <strong>TeachOSM</strong> tasking managers.
                  </p>
                  <p>
                    By establishing persistent REST API hooks to active server instances, the dashboard monitors regional campaigns dedicated to disaster relief, infrastructure building, and localized sustainable development datasets.
                  </p>
                  <p>
                    This prevents duplication of effort, coordinates volunteer mapping channels, and offers security auditing to enforce validator identity checks.
                  </p>
                </div>
              </div>

              {/* Right col: What is YouthMappers? */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg shrink-0">
                    <Users className="h-4 w-4" />
                  </span>
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                    About YouthMappers Org
                  </h4>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-3 leading-relaxed">
                  <p>
                    <strong>YouthMappers</strong> is a global network of university student chapters organized globally to map for development and humanitarian resilience. 
                  </p>
                  <p>
                    Formed in 2015, the network mobilizes student leadership by creating and using free, open-source geographic data. YouthMappers chapters support local and international development programs by addressing urgent needs in public health, municipal planning, and climate adaptation.
                  </p>
                  <p>
                    Supported by the <strong>USAID GeoCenter</strong>, West Virginia University, Texas Tech, and George Washington University, the consortium has grown to hundreds of campus-led chapters worldwide.
                  </p>
                </div>
              </div>

            </div>

            {/* Technical stack highlight */}
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 col-span-2">
              <span className="text-[9px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider block mb-2 font-mono">Core Hub Services &amp; Architecture</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                  <strong className="text-zinc-805 dark:text-zinc-200 font-bold block mb-1">Live REST API Poller</strong>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Queries staging and production endpoints of task managers matching organisationName=YouthMappers dynamically.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                  <strong className="text-zinc-805 dark:text-zinc-200 font-bold block mb-1">E2E Payload Crypts</strong>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Simulates secure validator sign-offs through RSA asymmetric key handshakes to prevent data pollution.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80">
                  <strong className="text-zinc-850 dark:text-zinc-200 font-bold block mb-1">Bento Workspace Layout</strong>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Consolidates active map tables, live feed counters, and contributor statistics into a beautiful landscape layout.</p>
                </div>
              </div>
            </div>

            {/* Social Media Directory & Institutional Redirects banner */}
            <div className="border-t border-zinc-100 dark:border-zinc-804/40 pt-6 space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Globe className="h-3.5 w-3.5 text-zinc-400" />
                YouthMappers Official Networks &amp; Social Channels
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <a 
                  href="https://www.youthmappers.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center block transition-all"
                >
                  <span className="block text-lg mb-1">🌐</span>
                  <span className="block text-[11px] font-bold text-zinc-750 dark:text-zinc-200">Official Website</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5 truncate font-mono">youthmappers.org</span>
                </a>

                <a 
                  href="https://twitter.com/youthmappers" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center block transition-all"
                >
                  <span className="block text-lg mb-1">𝕏</span>
                  <span className="block text-[11px] font-bold text-zinc-750 dark:text-zinc-200">Twitter / X</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5 truncate font-mono">@youthmappers</span>
                </a>

                <a 
                  href="https://www.instagram.com/youthmappers/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center block transition-all"
                >
                  <span className="block text-lg mb-1">📸</span>
                  <span className="block text-[11px] font-bold text-zinc-750 dark:text-zinc-200">Instagram</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5 truncate font-mono">@youthmappers</span>
                </a>

                <a 
                  href="https://www.linkedin.com/company/youthmappers/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center block transition-all"
                >
                  <span className="block text-lg mb-1">💼</span>
                  <span className="block text-[11px] font-bold text-zinc-755 dark:text-zinc-200">LinkedIn Org</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5 truncate font-mono">youthmappers</span>
                </a>

                <a 
                  href="https://github.com/youthmappers" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center block transition-all"
                >
                  <span className="block text-lg mb-1">🐙</span>
                  <span className="block text-[11px] font-bold text-zinc-750 dark:text-zinc-200">GitHub Repos</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5 truncate font-mono">youthmappers</span>
                </a>

                <a 
                  href="https://www.facebook.com/youthmappers" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center block transition-all"
                >
                  <span className="block text-lg mb-1">👤</span>
                  <span className="block text-[11px] font-bold text-zinc-750 dark:text-zinc-200">Facebook Page</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5 truncate font-mono">youthmappers</span>
                </a>
              </div>
            </div>

            {/* Meet the Regional Ambassador Bio Card */}
            <div className="bg-gradient-to-r from-teal-500/5 via-indigo-500/5 to-emerald-500/5 border border-teal-500/15 rounded-2xl p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src={brazilSinghAvatar} 
                  alt="Brazil Singh" 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover shrink-0 shadow-xs border border-teal-200/50" 
                />
                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <h4 className="text-md font-bold text-zinc-905 dark:text-zinc-100">
                    Brazil Singh <span className="text-xs font-normal text-zinc-400 font-mono">(YouthMappers Regional Ambassador • OSMF Director)</span>
                  </h4>
                  <p className="text-xs text-zinc-505 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    Brazil Singh is a prominent contributor in the OpenStreetMap ecosystem, acting as a certified regional ambassador for the YouthMappers consortium and an elected Board Director for the OpenStreetMap Foundation (OSMF).
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 pt-1.5 text-[11px] font-mono">
                    <a href="mailto:bsrittik@gmail.com" className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5 font-bold">
                      📬 bsrittik@gmail.com
                    </a>
                    <span className="text-zinc-304 dark:text-zinc-750">|</span>
                    <a href="https://www.linkedin.com/in/brazil-singh-rittik/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 font-bold">
                      🔗 LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer & End-To-End Security Info Section of layout */}
      <footer className="py-6 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800/80 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="tracking-wider uppercase font-semibold text-[10px] text-zinc-400">Active Session: SHA-RSA Secured Encrypted Pipeline</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono">
            Partner Consortium: <a href="https://www.youthmappers.org/" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">youthmappers.org</a>
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2 font-sans text-center md:text-right">
          <div className="text-xs text-zinc-700 dark:text-zinc-300 flex flex-wrap gap-x-2 gap-y-1 justify-center md:justify-end items-center">
            <span>Build by</span> 
            <strong className="font-extrabold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md border border-teal-200/30">Brazil Singh</strong> 
            <span className="text-zinc-300 dark:text-zinc-800 font-normal">|</span>
            <span className="font-semibold text-zinc-650 dark:text-zinc-350">YouthMappers Regional Ambassador</span>
            <span className="text-zinc-300 dark:text-zinc-800 font-normal">|</span>
            <span className="font-semibold text-zinc-650 dark:text-zinc-350 font-mono">Director, OpenStreetMap Foundation</span>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-400 flex-wrap justify-center">
            <a href="mailto:bsrittik@gmail.com" className="hover:text-teal-650 dark:hover:text-teal-400 transition-colors flex items-center gap-1">
              <span>📬</span> bsrittik@gmail.com
            </a>
            <span className="text-zinc-250 dark:text-zinc-800">|</span>
            <a href="https://www.linkedin.com/in/brazil-singh-rittik/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-650 dark:hover:text-teal-400 transition-colors flex items-center gap-1 font-bold">
              <span>in</span> LinkedIn Profile
            </a>
            <span className="text-zinc-250 dark:text-zinc-800">|</span>
            <a href="https://www.youthmappers.org/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-650 dark:hover:text-teal-400 transition-colors flex items-center gap-1">
              <span>🌐</span> YouthMappers Network
            </a>
            <span className="text-zinc-250 dark:text-zinc-800">|</span>
            <span>© {new Date().getFullYear()} Validation Portal</span>
          </div>
        </div>
      </footer>

      {/* MODAL WINDOW 1: Admin Create Campaign modal */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-md sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-teal-600" />
                Initiate YouthMappers Campaign
              </h3>
              <button 
                onClick={() => setNewProjectModal(false)}
                className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-sm font-semibold rounded-lg p-1.5"
              >✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Manager Source</label>
                  <select 
                    value={formData.source}
                    onChange={(e: any) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-zinc-55 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                  >
                    <option value="HOT">HOT Tasking Manager</option>
                    <option value="TeachOSM">TeachOSM Instance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Instance Project ID</label>
                  <input 
                    type="text"
                    required
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-zinc-55 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                    placeholder="HOT #14202"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Campaign Work Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-zinc-55 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                  placeholder="Rwanda Secondary Roads Mapping"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Target Country</label>
                  <input 
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-55 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                    placeholder="Rwanda"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Tiles Count</label>
                  <input 
                    type="number"
                    value={formData.totalTasks}
                    onChange={(e) => setFormData({...formData, totalTasks: Number(e.target.value) || 200})}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-55 dark:bg-zinc-850 text-zinc-805 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                  <select 
                    value={formData.difficulty}
                    onChange={(e: any) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-55 dark:bg-zinc-850 text-zinc-805 dark:text-zinc-20s border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Chapter Campaign / Sponsor</label>
                <input 
                  type="text"
                  value={formData.campaign}
                  onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-zinc-55 dark:bg-zinc-855 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                  placeholder="Disaster Resilience Road Rally"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-zinc-55 dark:bg-zinc-85s text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none"
                  placeholder="Detailed scopes for this mapping campaign..."
                />
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setNewProjectModal(false)}
                  className="px-4 py-2 text-xs text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-1"
                >
                  Confirm Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: Export Center / Reports Hub */}
      {exportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-md sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 font-sans flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                Reports &amp; Data Export Hub
              </h3>
              <button 
                onClick={() => setExportModal(false)}
                className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 text-sm font-semibold rounded-lg p-1.5"
              >✕</button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-zinc-500">
                Generate high-integrity summary logs representing monitored mapping and validation metrics for chapter reports, slide decks, or papers.
              </p>

              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Option A: Quick CSV formats by source</span>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleDownloadCSV('All')}
                    className="py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-250 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    CSV (All feed)
                  </button>
                  <button 
                    onClick={() => handleDownloadCSV('HOT')}
                    className="py-2 bg-red-50 hover:bg-red-100 text-red-650 dark:bg-red-950/20 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    HOT Feed CSV
                  </button>
                  <button 
                    onClick={() => handleDownloadCSV('TeachOSM')}
                    className="py-2 bg-indigo-50 hover:bg-indigo-150 text-indigo-500 dark:bg-indigo-950/20 rounded-lg text-xs font-bold transition-all shadow-2xs"
                  >
                    TeachOSM CSV
                  </button>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-805 pt-4 space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Option B: Visual PDF summary reporting</span>
                
                <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl p-3 flex items-start gap-3">
                  <FileDown className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Printable Document Structure</h5>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      Compiles all metrics cards, active tables, custom gauge speedometers, and contributor badges into a single screen grid formatted seamlessly for standard A4 landscape printer defaults.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setExportModal(false)}
                    className="px-4 py-1.5 text-xs text-zinc-500 hover:bg-zinc-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePrintPDF}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" /> Launch Print Dialog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
