import React, { useState, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, getDocs, setDoc, doc, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import Papa from 'papaparse';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  Database, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Calendar,
  CloudUpload,
  Info,
  ArrowUpRight,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Briefcase,
  TrendingUp,
  CreditCard,
  UserPlus,
  History,
  FileText,
  Camera
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { INDIAN_STATES } from './StudentPortal';

// --- Sub-pages ---

const AdminOverview = () => {
  const kpis = [
    { label: 'Total Students', value: '847', trend: '+12%', icon: Users, color: 'text-academic-blue', bg: 'bg-academic-blue/10' },
    { label: 'Active Subscriptions', value: '624', trend: '+5%', icon: CreditCard, color: 'text-guidance-gold-container', bg: 'bg-guidance-gold/10' },
    { label: 'Revenue (Monthly)', value: '₹12,48k', trend: '+18%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Colleges in DB', value: '512', trend: '0%', icon: Database, color: 'text-trust-navy', bg: 'bg-trust-navy/10' },
  ];

  const trendData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 28 },
    { day: 'Fri', count: 24 },
    { day: 'Sat', count: 42 },
    { day: 'Sun', count: 56 },
  ];

  const categoryData = [
    { name: 'General', value: 45 },
    { name: 'OBC', value: 30 },
    { name: 'SC/ST', value: 15 },
    { name: 'EWS', value: 10 },
  ];
  const COLORS = ['#0051d5', '#fabc45', '#12355b', '#c3c6cf'];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-soft border border-outline-variant/30"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{kpi.label}</span>
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-3xl font-mono font-black text-trust-navy">{kpi.value}</div>
            <div className={`mt-3 text-[10px] font-black flex items-center gap-1 ${kpi.trend.includes('+') ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
              <TrendingUp className="w-3 h-3" />
              {kpi.trend} <span className="text-on-surface-variant font-normal normal-case ml-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-soft border border-outline-variant/30">
          <h3 className="text-lg font-display font-bold text-trust-navy mb-8">New Subscriptions Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E0FC" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 81, 213, 0.05)' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 12px 32px rgba(18, 53, 91, 0.12)' }}
                />
                <Bar dataKey="count" fill="#0051d5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-soft border border-outline-variant/30 flex flex-col items-center">
          <h3 className="text-lg font-display font-bold text-trust-navy mb-8 w-full">Students by Category</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-3 mt-6">
            {categoryData.map((c, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-on-surface-variant">{c.name}</span>
                </div>
                <span className="font-bold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-outline-variant/30 overflow-hidden">
          <div className="px-6 py-4 bg-light-mist border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-display font-bold text-trust-navy">Recent Subscriptions</h3>
            <button className="text-xs font-bold text-academic-blue hover:underline font-mono">VIEW ALL</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-trust-navy-container text-white text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {[
                  { name: 'Rahul Sharma', rank: '14,502', cat: 'General', status: 'Active', color: 'text-emerald-600' },
                  { name: 'Priya Patel', rank: '28,910', cat: 'OBC', status: 'Active', color: 'text-emerald-600' },
                  { name: 'Amit Kumar', rank: '52,100', cat: 'SC', status: 'Pending', color: 'text-on-surface-variant' },
                  { name: 'Sneha Reddy', rank: '8,204', cat: 'General', status: 'Active', color: 'text-emerald-600' },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-light-mist/50">
                    <td className="p-4 font-semibold text-trust-navy">{s.name}</td>
                    <td className="p-4 font-mono">{s.rank}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-lg bg-surface-container font-mono text-[10px] font-bold">{s.cat}</span>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${s.color}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {s.status}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-outline hover:text-trust-navy"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-outline-variant/30 flex flex-col">
          <h3 className="font-display font-bold text-trust-navy mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/20">
            {[
              { type: 'publish', user: 'System', time: '10:42 AM', title: 'Updated State Cutoff DB', icon: UploadCloud, color: 'text-academic-blue bg-academic-blue/10' },
              { type: 'premium', user: 'Billing', time: '09:15 AM', title: '5 New Premium Subs', icon: TrendingUp, color: 'text-guidance-gold-container bg-guidance-gold/10' },
              { type: 'user', user: 'Registration', time: 'Yesterday', title: 'Rahul S. registered', icon: UserPlus, color: 'text-trust-navy bg-trust-navy/10' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-6 relative">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-soft ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-xl border border-outline-variant/20 bg-light-mist/30 flex-grow shadow-sm">
                   <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-bold text-trust-navy">{activity.user}</span>
                    <span className="font-mono text-[9px] text-on-surface-variant font-bold">{activity.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">{activity.title}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 text-xs font-bold text-academic-blue hover:underline font-mono">LOAD MORE</button>
        </div>
      </div>
    </div>
  );
};

const CutoffUpload = ({ initialTabs = ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS'] }: { initialTabs?: string[] }) => {
  const [activeTab, setActiveTab] = useState(initialTabs[0]);
  const tabs = initialTabs;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('idle');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setUploadStatus('idle');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const chunks = [];
          for (let i = 0; i < results.data.length; i += 400) {
            chunks.push(results.data.slice(i, i + 400));
          }
          for (const chunk of chunks) {
            const batch = writeBatch(db);
            for (const row of chunk as any[]) {
              const docRef = doc(collection(db, 'cutoffs'));
              batch.set(docRef, {
                ...row,
                course: activeTab,
                uploaderExamTarget: initialTabs?.includes('B.Tech') ? 'BTECH' : 'NEET',
                createdAt: serverTimestamp(),
              });
            }
            await batch.commit();
          }
          setUploadStatus('success');
        } catch (error) {
          console.error("Upload save error", error);
          setUploadStatus('error');
        }
      },
      error: (error) => {
        console.error("CSV parse error", error);
        setUploadStatus('error');
      }
    });
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8 space-y-8">
        <h2 className="text-2xl font-display font-bold text-trust-navy border-b border-light-mist pb-4">Upload Cutoff Data</h2>
        
        <div className="flex gap-4 border-b border-outline-variant/30 pb-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2.5 rounded-full font-mono text-sm uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-academic-blue text-white shadow-soft font-bold'
                  : 'bg-light-mist text-on-surface-variant hover:bg-outline-variant/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div 
            className="lg:col-span-2 border-2 border-dashed border-outline-variant/50 rounded-2xl p-20 flex flex-col items-center justify-center text-center bg-light-mist/30 hover:bg-light-mist/60 hover:border-academic-blue transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setSelectedFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            <CloudUpload className="w-16 h-16 text-outline group-hover:text-academic-blue transition-colors mb-6" />
            <h3 className="text-xl font-display font-bold text-trust-navy mb-2">{selectedFile ? selectedFile.name : `Upload ${activeTab} CSV Cutoffs here`}</h3>
            <p className="text-sm text-on-surface-variant mb-8">{selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'Drag & Drop or click to browse'}</p>
            <button 
              className="bg-academic-blue text-white px-8 py-3 rounded-xl font-bold shadow-soft hover:shadow-hover transition-all"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {selectedFile ? 'Change File' : 'Select File'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-light-mist p-6 rounded-2xl border border-outline-variant/20 space-y-4">
              <h4 className="font-mono text-[10px] font-black uppercase text-trust-navy flex items-center gap-2">
                <Info className="w-4 h-4 text-academic-blue" />
                {activeTab} Format Guide
              </h4>
              <ul className="text-xs text-on-surface-variant space-y-3 list-disc pl-4 font-body leading-relaxed">
                <li>Headers must match course template.</li>
                <li>Verify ranks are valid.</li>
                <li>Category wise columns are required.</li>
              </ul>
              <button className="text-xs font-bold text-academic-blue hover:underline flex items-center gap-1">
                <Download className="w-3 h-3" />
                Download {activeTab} Template
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
              <h4 className="font-mono text-[10px] font-black uppercase text-on-surface tracking-wider">Validation Status</h4>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center text-on-surface">
                  <span>Status:</span>
                  {!selectedFile ? (
                    <span className="font-bold text-on-surface-variant">Waiting...</span>
                  ) : uploadStatus === 'uploading' ? (
                    <span className="font-bold text-academic-blue animate-pulse">Uploading...</span>
                  ) : uploadStatus === 'success' ? (
                    <span className="font-bold text-emerald-600">Successfully Uploaded</span>
                  ) : uploadStatus === 'error' ? (
                    <span className="font-bold text-error">Upload failed</span>
                  ) : (
                    <span className="font-bold text-trust-navy">Ready to upload</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-light-mist">
          <button 
            className="px-6 py-3 border-2 border-trust-navy text-trust-navy font-bold rounded-xl hover:bg-light-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'success'}
            onClick={() => setUploadStatus('idle')}
          >
            Reset
          </button>
          <button 
            className="px-6 py-3 bg-academic-blue text-white font-bold rounded-xl shadow-soft hover:shadow-hover transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'success'}
            onClick={handleUpload}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : uploadStatus === 'success' ? 'Published' : 'Publish to Live'}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

const SubscriptionManagement = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹14.2M', trend: '+12.5%', detail: 'this month', icon: CreditCard, color: 'text-academic-blue' },
    { label: 'Active Subscriptions', value: '2,845', trend: '', detail: 'Across all tiers', icon: Users, color: 'text-trust-navy' },
    { label: 'Pending Payments', value: '₹850K', trend: 'Requires attention', detail: '', icon: AlertTriangle, color: 'text-error' },
    { label: 'Avg. Order Value', value: '₹4,990', trend: '', detail: 'Steady growth', icon: FileText, color: 'text-guidance-gold-container' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-trust-navy">Subscription & Payment Management</h2>
            <p className="text-on-surface-variant mt-2">Overview of financial health and student onboarding.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant/30 text-trust-navy font-bold rounded-xl shadow-soft hover:shadow-hover hover:border-academic-blue/30 transition-all active:scale-95 transform hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-soft border border-outline-variant/30 flex flex-col justify-between h-44">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-on-surface-variant">{stat.label}</span>
                <div className={`p-2 rounded-xl bg-light-mist ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-mono font-black text-trust-navy">{stat.value}</div>
                <div className={`mt-2 font-mono text-[10px] font-bold ${stat.color === 'text-error' ? 'text-error' : 'text-academic-blue'}`}>
                  {stat.trend} <span className="text-on-surface-variant font-normal">{stat.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[400px]">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-soft border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-trust-navy">Revenue Trend (Q3)</h3>
            <span className="px-3 py-1 bg-light-mist text-[10px] font-bold uppercase font-mono rounded-full text-on-surface-variant">Weekly</span>
          </div>
          <div className="h-64 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { w: 'W1', val: 2.1 }, { w: 'W2', val: 2.8 }, { w: 'W3', val: 3.5 },
                { w: 'W4', val: 4.2 }, { w: 'W5', val: 3.8 }, { w: 'W6', val: 4.0 },
                { w: 'W7', val: 4.5 }, { w: 'W8', val: 4.9 },
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0051d5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0051d5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E0FC" />
                <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#0051d5" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-soft border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-bold text-trust-navy">Top States</h3>
            <Database className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div className="flex-1 space-y-6">
            {[
              { state: 'Maharashtra', val: 85, count: 850, color: 'bg-academic-blue' },
              { state: 'Uttar Pradesh', val: 62, count: 620, color: 'bg-trust-navy-container' },
              { state: 'Karnataka', val: 49, count: 490, color: 'bg-trust-navy-container/80' },
              { state: 'Tamil Nadu', val: 31, count: 310, color: 'bg-trust-navy-container/60' },
              { state: 'Delhi', val: 28, count: 280, color: 'bg-trust-navy-container/40' },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center font-mono text-[10px] font-bold">
                  <span className="text-on-surface-variant uppercase tracking-wider">{s.state}</span>
                  <span className="text-trust-navy">{s.count}</span>
                </div>
                <div className="h-2 bg-light-mist rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${s.val}%` }} 
                    className={`h-full ${s.color}`}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/20 overflow-hidden">
        <div className="p-6 bg-white border-b border-outline-variant/30 flex justify-between items-center flex-wrap gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Rank..."
              className="w-full bg-white border border-outline-variant/50 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-academic-blue transition-all" 
            />
          </div>
          <div className="flex gap-3">
            {['All Categories', 'Status: All'].map((text, i) => (
              <select key={i} className="bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-xs font-bold outline-none">
                <option>{text}</option>
              </select>
            ))}
            <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-outline-variant/50 hover:bg-light-mist transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-trust-navy-container text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Rank</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Counsellor</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {[
                { id: '#SUB-8921', name: 'Aarav Sharma', email: 'aarav.s@example.com', rank: '14,205', cat: 'Premium', color: 'bg-guidance-gold/20 text-guidance-gold-container', amount: '₹9,999', status: 'Active', counselor: 'Dr. Mehra' },
                { id: '#SUB-8920', name: 'Priya Patel', email: 'p.patel99@example.com', rank: '8,450', cat: 'Standard', color: 'bg-academic-blue/10 text-academic-blue', amount: '₹4,999', status: 'Pending', counselor: 'Unassigned' },
                { id: '#SUB-8919', name: 'Rohan Iyer', email: 'rohan.i@example.com', rank: '22,100', cat: 'Premium', color: 'bg-guidance-gold/20 text-guidance-gold-container', amount: '₹9,999', status: 'Active', counselor: 'Dr. Singh' },
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-light-mist/50 transition-colors ${i % 2 === 1 ? 'bg-light-mist/20' : ''}`}>
                  <td className="p-4 font-mono font-bold text-outline uppercase">{row.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-trust-navy">{row.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{row.email}</div>
                  </td>
                  <td className="p-4 font-mono font-bold">{row.rank}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md font-mono text-[10px] font-black uppercase ${row.color}`}>{row.cat}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-black text-academic-blue">{row.amount}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1.5 ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Active' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-trust-navy">{row.counselor}</td>
                  <td className="p-4 text-right">
                    <button className="px-4 py-1.5 bg-academic-blue/10 text-academic-blue rounded-lg hover:bg-academic-blue hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-sm">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-white border-t border-outline-variant/30 flex justify-between items-center">
          <span className="text-xs font-mono text-on-surface-variant font-bold uppercase tracking-widest">Showing 1-3 of 2,845</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-outline-variant/40 text-outline text-xs font-bold font-mono transition-transform active:scale-95 hover:bg-light-mist">PREV</button>
            <button className="px-4 py-2 rounded-xl bg-academic-blue text-white text-xs font-bold font-mono transition-transform active:scale-95 hover:-translate-y-0.5 shadow-sm hover:shadow-md">1</button>
            <button className="px-4 py-2 rounded-xl border border-outline-variant/40 text-on-surface text-xs font-bold font-mono hover:bg-light-mist transition-transform active:scale-95">2</button>
            <button className="px-4 py-2 rounded-xl border border-outline-variant/40 text-on-surface text-xs font-bold font-mono hover:bg-light-mist transition-transform active:scale-95">NEXT</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const StudentMgmt = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-trust-navy">Student Management</h2>
          <p className="text-on-surface-variant mt-1">Manage student profiles, verify documents, and assign counsellors.</p>
        </div>
        <button className="bg-academic-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-hover hover:border-academic-blue/30 transition-all active:scale-95 transform hover:-translate-y-0.5 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 overflow-hidden">
        <div className="p-6 bg-white border-b border-outline-variant/30 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input 
              type="text" 
              placeholder="Search by name, email or rank..."
              className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-academic-blue" 
            />
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-outline-variant/50 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-light-mist hover:text-trust-navy flex items-center gap-2 transition-all active:scale-95 transform hover:-translate-y-0.5">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-trust-navy-container text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Rank</th>
                <th className="p-4">State</th>
                <th className="p-4">Counsellor</th>
                <th className="p-4">Subscription</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {[
                { name: 'Aditya Verma', email: 'aditya@example.com', rank: '12,450', state: 'Delhi', counselor: 'Dr. Sharma', sub: 'Premium' },
                { name: 'Sanya Gupta', email: 'sanya@example.com', rank: '24,100', state: 'Maharashtra', counselor: 'Dr. Mehra', sub: 'Standard' },
                { name: 'Karan Singh', email: 'karan@example.com', rank: '5,200', state: 'Rajasthan', counselor: 'Unassigned', sub: 'Premium' },
                { name: 'Myra Khan', email: 'myra@example.com', rank: '42,900', state: 'Karnataka', counselor: 'Dr. Singh', sub: 'Basic' },
              ].map((s, i) => (
                <tr key={i} className="hover:bg-light-mist/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-trust-navy">{s.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{s.email}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-xs">{s.rank}</td>
                  <td className="p-4 text-sm text-on-surface-variant">{s.state}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${s.counselor === 'Unassigned' ? 'bg-error-container/20 text-error' : 'bg-academic-blue/10 text-academic-blue'}`}>
                      {s.counselor}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${s.sub === 'Premium' ? 'bg-guidance-gold/20 text-guidance-gold-container' : 'bg-light-mist text-on-surface-variant border border-outline-variant/20'}`}>
                      {s.sub}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-outline hover:text-academic-blue"><Edit2 className="w-4 h-4" /></button>
                       <button className="p-2 text-outline hover:text-error"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const DEMO_COLLEGES = [
  { name: 'AIIMS, New Delhi', city: 'Delhi', state: 'Delhi', type: 'Govt', seats: 125, fee: 1628, status: 'Active' },
  { name: 'MAMC', city: 'Delhi', state: 'Delhi', type: 'Govt', seats: 250, fee: 15000, status: 'Active' },
  { name: 'Grant Medical College', city: 'Mumbai', state: 'Maharashtra', type: 'Govt', seats: 250, fee: 114000, status: 'Active' },
  { name: 'KMC, Manipal', city: 'Manipal', state: 'Karnataka', type: 'Private', seats: 250, fee: 1800000, status: 'Active' },
  { name: 'D.Y. Patil', city: 'Pune', state: 'Maharashtra', type: 'Deemed', seats: 250, fee: 2500000, status: 'Active' },
  { name: 'AFMC Pune', city: 'Pune', state: 'Maharashtra', type: 'Govt', seats: 150, fee: 0, status: 'Active' },
  { name: 'CMC Vellore', city: 'Vellore', state: 'Tamil Nadu', type: 'Private', seats: 100, fee: 45000, status: 'Active' },
  { name: 'JIPMER', city: 'Puducherry', state: 'Puducherry', type: 'Govt', seats: 249, fee: 12000, status: 'Active' },
  { name: 'King George\'s Medical University', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Govt', seats: 250, fee: 54000, status: 'Active' },
  { name: 'Banaras Hindu University', city: 'Varanasi', state: 'Uttar Pradesh', type: 'Govt', seats: 100, fee: 30000, status: 'Active' },
  { name: 'St. John\'s Medical College', city: 'Bengaluru', state: 'Karnataka', type: 'Private', seats: 150, fee: 650000, status: 'Active' },
  { name: 'Madras Medical College', city: 'Chennai', state: 'Tamil Nadu', type: 'Govt', seats: 250, fee: 13000, status: 'Active' },
  { name: 'Stanley Medical College', city: 'Chennai', state: 'Tamil Nadu', type: 'Govt', seats: 250, fee: 13000, status: 'Active' },
  { name: 'B.J. Medical College', city: 'Ahmedabad', state: 'Gujarat', type: 'Govt', seats: 250, fee: 25000, status: 'Active' },
  { name: 'Seth GS Medical College', city: 'Mumbai', state: 'Maharashtra', type: 'Govt', seats: 250, fee: 114000, status: 'Active' },
  { name: 'Institute of Post Graduate Medical Education', city: 'Kolkata', state: 'West Bengal', type: 'Govt', seats: 200, fee: 9000, status: 'Active' },
  { name: 'Medical College, Kolkata', city: 'Kolkata', state: 'West Bengal', type: 'Govt', seats: 250, fee: 9000, status: 'Active' },
  { name: 'Christian Medical College', city: 'Ludhiana', state: 'Punjab', type: 'Private', seats: 100, fee: 660000, status: 'Active' },
  { name: 'Amrita School of Medicine', city: 'Kochi', state: 'Kerala', type: 'Deemed', seats: 150, fee: 1900000, status: 'Active' },
  { name: 'Kasturba Medical College', city: 'Mangalore', state: 'Karnataka', type: 'Private', seats: 250, fee: 1800000, status: 'Active' }
];

const CollegeDatabaseScreen = () => {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const q = query(collection(db, 'colleges'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // Seed database
        const newColleges = [];
        for (const c of DEMO_COLLEGES) {
          const newDoc = doc(collection(db, 'colleges'));
          const collegeEntry = { ...c, collegeId: newDoc.id };
          await setDoc(newDoc, collegeEntry);
          newColleges.push(collegeEntry);
        }
        setColleges(newColleges);
      } else {
        setColleges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collegeId: string) => {
    if (confirm('Are you sure you want to delete this college?')) {
      try {
        await deleteDoc(doc(db, 'colleges', collegeId));
        fetchColleges();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-trust-navy">College Database</h2>
          <p className="text-on-surface-variant mt-1">Manage detailed profiles and fee structures for medical colleges.</p>
        </div>
        <button className="bg-academic-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-hover transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New College Entry
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft h-fit space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-trust-navy pb-4 border-b border-light-mist">Advanced Filters</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">State</label>
              <select className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-3 py-2 text-sm outline-none font-semibold">
                <option>All States</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ownership</label>
              <div className="flex flex-col gap-2">
                {['Government', 'Private', 'Deemed'].map(o => (
                  <label key={o} className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-academic-blue" />
                    <span className="group-hover:text-trust-navy transition-colors">{o}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-soft">
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-trust-navy-container text-white text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-4">College</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-center">Seats</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant font-mono">
                        Loading database...
                      </td>
                    </tr>
                  ) : colleges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant font-mono">
                        No colleges found.
                      </td>
                    </tr>
                  ) : colleges.map((c, i) => (
                    <tr key={i} className="hover:bg-light-mist/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-trust-navy">{c.name}</div>
                      </td>
                      <td className="p-4 text-sm text-on-surface-variant">{c.city}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.type === 'Govt' ? 'bg-emerald-100 text-emerald-800' : 'bg-guidance-gold/20 text-guidance-gold-container'}`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-xs">{c.seats}</td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                           <button className="p-2 text-outline hover:text-academic-blue"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(c.collegeId)} className="p-2 text-outline hover:text-error"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const AnalyticsScreen = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-outline-variant/30 space-y-6">
          <h3 className="text-lg font-display font-bold text-trust-navy">Conversion Rates</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { n: 'Jan', v: 40 }, { n: 'Feb', v: 45 }, { n: 'Mar', v: 55 }, { n: 'Apr', v: 75 }
              ]}>
                <Area type="monotone" dataKey="v" stroke="#fabc45" fill="#fabc45" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">75% of registered users upgrade to premium following their first prediction.</p>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-soft border border-outline-variant/30">
          <h3 className="text-lg font-display font-bold text-trust-navy mb-8">System Usage by Hour</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { h: '08', v: 120 }, { h: '10', v: 240 }, { h: '12', v: 450 },
                { h: '14', v: 380 }, { h: '16', v: 520 }, { h: '18', v: 640 },
                { h: '20', v: 820 }, { h: '22', v: 540 }
              ]}>
                <Bar dataKey="v" fill="#0051d5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = () => {
  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8 space-y-8">
        <h3 className="text-2xl font-display font-bold text-trust-navy border-b border-light-mist pb-4">Platform Settings</h3>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#809eca]">General</h4>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Site Name</label>
                <input type="text" defaultValue="AR EduIndia Admin" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contact Email</label>
                <input type="email" defaultValue="support@areduindia.com" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#809eca]">Platform Configuration</h4>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Current Year</label>
                <input type="number" defaultValue={2024} className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Counselling Rounds</label>
                <select className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none font-semibold">
                  <option>Round 1 Only</option>
                  <option>R1 + R2</option>
                  <option>All Rounds</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-light-mist flex justify-end">
            <button className="bg-academic-blue text-white px-8 py-3 rounded-xl font-bold shadow-soft hover:shadow-hover transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const AdminProfileScreen = () => {
  const { userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!userProfile) return;
    setUpdating(true);
    try {
      await setDoc(doc(db, 'users', userProfile.uid), {
        name,
      }, { merge: true });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8 space-y-8">
        <h3 className="text-2xl font-display font-bold text-trust-navy border-b border-light-mist pb-4">Admin Profile Creation Info</h3>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-full border-4 border-light-mist overflow-hidden relative group shrink-0">
            <img src={userProfile?.photoURL || "https://images.unsplash.com/photo-1556157382-979249746065?auto=format&fit=crop&q=80&w=300"} alt="Admin placeholder" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-trust-navy/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                <input type="email" defaultValue={userProfile?.email || ''} readOnly className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none opacity-60 cursor-not-allowed" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Role</label>
              <input type="text" defaultValue="Super Admin" readOnly className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none opacity-60 cursor-not-allowed" />
            </div>
            
            <button 
              onClick={handleUpdate} 
              disabled={updating}
              className="bg-academic-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-hover transition-all text-sm disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Profile Information'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Main Admin Layout ---

export default function AdminDashboard() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userProfile, signOut } = useAuth();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Student Mgmt', path: '/admin/students', icon: Users },
    { label: 'Cutoff Upload (NEET)', path: '/admin/cutoff', icon: UploadCloud },
    { label: 'JEE Cutoffs', path: '/admin/jee-cutoff', icon: UploadCloud },
    { label: 'Subscription Mgmt', path: '/admin/subscriptions', icon: CreditCard },
    { label: 'College Database', path: '/admin/database', icon: Database },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-trust-navy text-white flex flex-col h-screen fixed left-0 top-0 z-50">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full border-2 border-guidance-gold overflow-hidden bg-white/10 shadow-hover relative group cursor-pointer">
              <img src={userProfile?.photoURL || "https://images.unsplash.com/photo-1556157382-979249746065?auto=format&fit=crop&q=80&w=150"} alt="Admin" className="group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-display font-black uppercase tracking-tighter">Admin Panel</h1>
              <p className="font-mono text-[10px] uppercase font-bold text-[#809eca]">AR EduIndia Central</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 mt-8" style={{ scrollbarWidth: 'none' }}>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                      active ? 'bg-academic-blue text-white shadow-soft' : 'text-[#809eca] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#809eca] transition-colors group-hover:text-white'}`} />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-8 mt-auto space-y-4 pt-10 border-t border-white/10">
          <Link to="/admin/profile" className="w-full flex items-center gap-3 text-[#809eca] hover:text-white transition-colors group px-4">
            <Users className="w-5 h-5 group-hover:text-white" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Admin Profile</span>
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-outline-variant/30 flex items-center justify-between px-10 sticky top-0 z-40">
           <h2 className="text-2xl font-display font-black text-trust-navy">
            {navItems.find(n => (n.path === location.pathname || (n.path === '/admin' && location.pathname === '/admin/')))?.label || 'Dashboard Overview'}
           </h2>
           <div className="flex items-center gap-8 relative">
              <div className="flex items-center gap-3 font-mono text-xs font-bold text-on-surface-variant">
                <Calendar className="w-4 h-4 text-academic-blue" />
                24 OCT 2024
              </div>
              <div className="h-8 w-px bg-outline-variant/30" />
              
              <div className="relative">
                <button 
                  className="p-2 text-on-surface-variant hover:bg-light-mist rounded-full transition-colors relative"
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-academic-blue rounded-full ring-2 ring-white animate-pulse" />
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-hover border border-outline-variant/20 overflow-hidden z-50 text-sm"
                    >
                      <div className="p-4 border-b border-light-mist flex justify-between items-center bg-light-mist/30">
                        <span className="font-bold text-trust-navy font-display">Notifications</span>
                        <span className="text-[10px] font-mono text-academic-blue font-bold px-2 py-0.5 rounded-full bg-academic-blue/10">3 NEW</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {[
                          { title: 'New Student Registration', time: '5m ago', unread: true },
                          { title: 'Database Backup Complete', time: '1h ago', unread: true },
                          { title: 'System Maintenance at 12AM', time: '3h ago', unread: false },
                        ].map((notif, i) => (
                          <div key={i} className={`p-4 border-b border-light-mist/50 hover:bg-light-mist/50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`font-semibold ${notif.unread ? 'text-trust-navy' : 'text-on-surface-variant'}`}>{notif.title}</span>
                              {notif.unread && <span className="w-2 h-2 bg-academic-blue rounded-full mt-1.5" />}
                            </div>
                            <span className="text-xs text-on-surface-variant font-mono">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-light-mist cursor-pointer hover:bg-light-mist/50 transition-colors">
                         <span className="text-xs font-bold text-academic-blue uppercase tracking-widest font-mono">Mark all as read</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-outline-variant overflow-hidden cursor-pointer hover:border-academic-blue transition-colors relative"
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                >
                  <img src={userProfile?.photoURL || "https://images.unsplash.com/photo-1556157382-979249746065?auto=format&fit=crop&q=80&w=150"} alt="Admin" className="hover:scale-110 transition-transform duration-300" />
                </div>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-hover border border-outline-variant/20 overflow-hidden z-50 text-sm"
                    >
                      <div className="p-4 border-b border-light-mist bg-light-mist/30">
                        <div className="font-bold text-trust-navy font-display truncate">{userProfile?.name || 'Admin'}</div>
                        <div className="text-xs text-on-surface-variant font-mono mt-1">Super Admin</div>
                      </div>
                      <div className="p-2">
                        <Link to="/admin/profile" onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2 hover:bg-light-mist rounded-xl transition-colors font-semibold text-trust-navy flex items-center gap-3">
                          <Settings className="w-4 h-4 text-on-surface-variant" />
                          Account Settings
                        </Link>
                        <Link to="/admin/settings" onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2 hover:bg-light-mist rounded-xl transition-colors font-semibold text-trust-navy flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-on-surface-variant" />
                          Billing info
                        </Link>
                      </div>
                      <div className="p-2 border-t border-light-mist">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-xl transition-colors font-bold text-error flex items-center gap-3">
                          <Briefcase className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

           </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-10 max-w-7xl mx-auto w-full scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
           <AnimatePresence mode="wait">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="students" element={<StudentMgmt />} />
              <Route path="cutoff" element={<CutoffUpload />} />
              <Route path="jee-cutoff" element={<CutoffUpload initialTabs={['B.Tech', 'B.Arch', 'B.Planning']} />} />
              <Route path="subscriptions" element={<SubscriptionManagement />} />
              <Route path="database" element={<CollegeDatabaseScreen />} />
              <Route path="analytics" element={<AnalyticsScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="profile" element={<AdminProfileScreen />} />
              <Route path="*" element={<div className="p-8 text-center"><h2 className="text-xl font-bold text-trust-navy">Page Not Found in Admin</h2></div>} />
            </Routes>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
