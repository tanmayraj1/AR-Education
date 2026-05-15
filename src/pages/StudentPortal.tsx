import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  Milestone, 
  Bell, 
  User,
  GraduationCap,
  History,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Trash2,
  FileText,
  MessageSquare,
  BarChart3,
  Filter,
  Users,
  CreditCard,
  Settings,
  Camera,
  MapPin,
  Briefcase,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { PortalSubscribeModal } from '../components/PortalSubscribeModal';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// --- Sub-pages ---

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DashboardHome = () => {
  const { userProfile, currentUser } = useAuth();
  const [dashboardColleges, setDashboardColleges] = React.useState<any[]>([]);
  const [loadingColleges, setLoadingColleges] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser) return;
    const fetchSaved = async () => {
      try {
        const q = query(collection(db, 'users', currentUser.uid, 'saved_colleges'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        // Sort by chance/scoreValue
        data.sort((a,b) => (b.scoreValue || 0) - (a.scoreValue || 0));
        setDashboardColleges(data.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchSaved();
  }, [currentUser]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const courseType = userProfile?.course || 'NEET';
    const rank = courseType === 'BTECH' ? (userProfile?.jeeRank || 250000) : (userProfile?.neetRank || 150000);
    
    doc.setFontSize(18);
    doc.text("College Predictions Report (Saved)", 14, 22);
    doc.setFontSize(12);
    doc.text(`Student: ${userProfile?.name || 'Guest'} | Exam: ${courseType} | Rank: ${rank}`, 14, 30);

    const tableColumn = ["College Name", "State", "Course", "Cutoff", "Chance"];
    const tableRows = dashboardColleges.map(row => [
      row.collegeName || row.name,
      row.state,
      row.course,
      Number(row.closingRank || row.cutoff || 0).toLocaleString(),
      row.chance
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [17, 34, 51] }, // trust-navy color
    });

    doc.save(`${userProfile?.name || 'Student'}_Saved_Predictions.pdf`);
  };
  
  const data = [
    { name: 'Mon', subs: 12 },
    { name: 'Tue', subs: 18 },
    { name: 'Wed', subs: 15 },
    { name: 'Thu', subs: 28 },
    { name: 'Fri', subs: 24 },
    { name: 'Sat', subs: 42 },
    { name: 'Sun', subs: 56 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <h1 className="text-3xl font-display font-bold text-trust-navy">Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}</h1>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-soft border border-trust-navy-container/10">
                <span className="text-sm text-on-surface-variant font-body">{userProfile?.course === 'BTECH' ? 'JEE Rank:' : 'NEET Rank:'}</span>
                <span className="font-mono font-bold text-trust-navy bg-light-mist px-2 py-0.5 rounded">
                  {userProfile?.course === 'BTECH' ? (userProfile?.jeeRank || 'Not set') : (userProfile?.neetRank || 'Not set')}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-soft border border-trust-navy-container/10">
                <span className="text-sm text-on-surface-variant font-body">Category:</span>
                <span className="font-mono bg-academic-blue/10 text-academic-blue px-3 py-0.5 rounded-full text-xs font-bold uppercase">{userProfile?.category || 'General'}</span>
              </div>
              {userProfile?.isSubscribed ? (
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl shadow-soft border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-semibold font-body">Subscription Active</span>
                </div>
              ) : (
                <button onClick={() => window.dispatchEvent(new CustomEvent('open-subscribe-modal'))} className="flex items-center gap-2 bg-guidance-gold/20 px-4 py-2 rounded-xl shadow-soft border border-guidance-gold hover:bg-guidance-gold/30 transition-colors">
                  <Star className="w-4 h-4 text-guidance-gold-container" />
                  <span className="text-sm text-guidance-gold-container font-semibold font-body">Subscribe Now</span>
                </button>
              )}
            </div>
          </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 overflow-hidden">
            <div className="h-1 bg-trust-navy-container w-full" />
            <div className="p-6 border-b border-outline-variant/30 bg-light-mist">
              <h3 className="text-xl font-display font-bold text-trust-navy">Your College Predictions</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Rank', 'Category', 'Counselling Type', 'State'].map((label, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
                    <div className="bg-light-mist px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-semibold truncate">
                      {idx === 0 ? (userProfile?.course === 'BTECH' ? (userProfile?.jeeRank || 'Not set') : (userProfile?.neetRank || 'Not set')) 
                        : idx === 1 ? (userProfile?.category || 'General') 
                        : idx === 2 ? (userProfile?.course === 'BTECH' ? 'JoSAA/CSAB' : 'AIQ (15%)') 
                        : (userProfile?.domicile || 'All States')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-trust-navy-container text-white">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">College Name</th>
                      <th className="px-4 py-3 text-sm font-semibold">State</th>
                      <th className="px-4 py-3 text-sm font-semibold">Course</th>
                      <th className="px-4 py-3 text-sm font-semibold text-right">Cutoff</th>
                      <th className="px-4 py-3 text-sm font-semibold text-center">Chance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-sm">
                    {loadingColleges ? (
                       <tr><td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">Loading your predictions...</td></tr>
                    ) : dashboardColleges.length === 0 ? (
                       <tr><td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">No saved predictions yet. Head to the Predictor tab to explore and save colleges!</td></tr>
                    ) : dashboardColleges.map((row, i) => (
                      <tr key={i} className="hover:bg-light-mist transition-colors">
                        <td className="px-4 py-3 font-semibold text-trust-navy">{row.collegeName || row.name}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{row.state}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{row.course}</td>
                        <td className="px-4 py-3 text-right font-mono">{Number(row.closingRank || row.cutoff || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            row.chance === 'High' || row.chance === 'Very High' ? 'bg-emerald-100 text-emerald-800' :
                            row.chance === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {row.chance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button onClick={handleDownloadPDF} disabled={dashboardColleges.length === 0} className="flex items-center gap-2 bg-academic-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8">
            <h3 className="text-xl font-display font-bold text-trust-navy mb-8">Admission Tracker</h3>
            <div className="relative flex justify-between">
              <div className="absolute top-4 left-0 w-full h-1 bg-outline-variant/20 -z-0" />
              <div className="absolute top-4 left-0 h-1 bg-academic-blue -z-0 transition-all duration-1000" style={{ width: '37%' }} />
              
              {[
                { label: 'Profile', icon: User, active: true },
                { label: 'Subscription', icon: Bookmark, active: true },
                { label: 'Prediction', icon: Milestone, active: true, current: true },
                { label: 'Shortlist', icon: Search, active: false },
                { label: 'Application', icon: FileText, active: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step.active ? 'bg-academic-blue text-white shadow-hover' : 'bg-white border-2 border-outline-variant text-outline-variant'
                  } ${step.current ? 'ring-4 ring-academic-blue/20' : ''}`}>
                    {step.active ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step.active ? 'text-trust-navy' : 'text-outline-variant'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <aside className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-6 space-y-6">
            <div className="flex items-center gap-3 text-trust-navy">
              <Search className="w-5 h-5 text-academic-blue" />
              <h3 className="text-lg font-display font-bold">Cutoff Quick Search</h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/student/predictor`;
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">College Code or Name</label>
                <input 
                  type="text" 
                  name="q"
                  placeholder="e.g., MAMC"
                  className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue" 
                />
              </div>
              <button type="submit" className="w-full py-3 border-2 border-trust-navy text-trust-navy font-bold rounded-xl hover:bg-light-mist transition-colors">
                Search Cutoffs
              </button>
            </form>
          </aside>

          <aside className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-6">
             <div className="flex items-center gap-3 text-trust-navy mb-6 pb-3 border-b border-outline-variant/30">
              <Bell className="w-5 h-5 text-academic-blue" />
              <h3 className="text-lg font-display font-bold">Recent Updates</h3>
            </div>
            <div className="space-y-6">
              {[
                { title: `${userProfile?.course === 'BTECH' ? 'JoSAA' : 'MCC'} Round 1 Result Declared`, time: 'Oct 15, 2024 • 10:30 AM', active: true },
                { title: `State Counselling Guidelines Updated for ${userProfile?.domicile || 'All India'}`, time: 'Oct 14, 2024 • 04:15 PM' },
                { title: 'Document Verification Schedule Released', time: 'Oct 12, 2024 • 09:00 AM' },
              ].map((update, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${update.active ? 'bg-academic-blue scale-125' : 'bg-outline-variant'}`} />
                  <div>
                    <h4 className="text-sm font-semibold text-trust-navy group-hover:text-academic-blue transition-colors">{update.title}</h4>
                    <p className="font-mono text-[10px] text-on-surface-variant mt-1">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm font-bold text-academic-blue hover:underline">
              View All Notifications
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

const SavedColleges = () => {
  const { currentUser } = useAuth();
  const [colleges, setColleges] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser) return;
    const loadSaved = async () => {
      try {
        const q = query(collection(db, 'users', currentUser.uid, 'saved_colleges'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        // Sort by chance (which has been calculated in Predictor, or re-calculate here)
        data.sort((a,b) => (b.scoreValue || 0) - (a.scoreValue || 0));
        setColleges(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSaved();
  }, [currentUser]);

  const handleRemove = async (collegeId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'saved_colleges', collegeId));
      setColleges(prev => prev.filter(c => c.id !== collegeId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("My Shortlisted Colleges", 14, 22);
    
    const tableColumn = ["College Name", "State", "Exam", "Category", "Closing Rank", "Chance"];
    const tableRows = colleges.map(row => [
      row.collegeName,
      row.state,
      row.exam || row.uploaderExamTarget,
      row.category,
      Number(row.closingRank).toLocaleString(),
      row.chance
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [17, 34, 51] },
    });

    doc.save(`Shortlisted_Colleges.pdf`);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-trust-navy">My Shortlisted Colleges</h1>
          <p className="text-on-surface-variant mt-2">Manage and prioritize your target institutions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadPDF} disabled={colleges.length === 0} className="flex items-center gap-2 bg-academic-blue text-white px-5 py-2 rounded-xl font-bold hover:shadow-hover transition-all disabled:opacity-50">
            <FileText className="w-4 h-4" />
            Generate PDF Shortlist
          </button>
        </div>
      </section>

      <div className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-trust-navy-container text-white">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">College Name</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">State</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Category</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-right">Closing Rank</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Chance</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                       Loading saved colleges...
                    </td>
                 </tr>
              ) : colleges.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                       No saved colleges. Go to College Predictor to shortlist!
                    </td>
                 </tr>
              ) : colleges.map((row) => (
                <tr key={row.id} className="hover:bg-light-mist/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-trust-navy group-hover:text-academic-blue transition-colors">{row.collegeName}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{row.course}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{row.state}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-light-mist rounded text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-trust-navy">{Number(row.closingRank).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase ${row.chanceColor}`}>
                      {row.chance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleRemove(row.id)} className="p-2 text-outline hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-light-mist border-t border-outline-variant/30 flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-mono">Showing 3 of 12 saved colleges</span>
          <div className="flex gap-2">
            <button className="p-1 rounded hover:bg-white text-outline disabled:opacity-30" disabled><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-1 rounded hover:bg-white text-academic-blue"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <section className="space-y-8 pt-10 border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-trust-navy">Cutoff News & Updates</h2>
            <p className="text-on-surface-variant mt-1">Stay informed with the latest released cutoff notifications for various institutions and state quotas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-outline-variant/30 shadow-soft relative overflow-hidden">
            <div className="absolute left-[3.1rem] top-12 bottom-12 w-0.5 bg-outline-variant/20 -z-0" />
            
            <div className="space-y-12 relative z-10">
              {[
                { 
                  title: 'All India Quota (AIQ) Round 1 Released', 
                  date: 'Recent Update', 
                  status: 'completed',
                  noteType: 'Official Notification',
                  note: 'The official cutoffs for AIQ Round 1 have been released. Notice a slight drop in General Category closing ranks compared to last year. Check the College Predictor for updated data.'
                },
                { 
                  title: 'State Counselling Registrations Open', 
                  date: 'Active Now', 
                  status: 'active',
                  noteType: 'System Auto-Note',
                  note: 'Multiple states including Maharashtra, Delhi, and Karnataka have opened registrations. Ensure you know your target cutoffs before choice filling.',
                  actions: ['View AI Predictor']
                },
                { 
                  title: 'Round 2 Preparation Strategy', 
                  status: 'pending',
                },
              ].map((stage, i) => (
                <div key={i} className={`flex gap-8 group ${stage.status === 'pending' ? 'opacity-50' : ''}`}>
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border-4 border-white shadow-soft transition-all duration-300 ${
                    stage.status === 'completed' ? 'bg-academic-blue text-white' : 
                    stage.status === 'active' ? 'bg-academic-blue text-white ring-8 ring-academic-blue/10' : 
                    'bg-light-mist text-outline-variant border-outline-variant/20'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                      <h4 className={`text-lg font-display font-bold ${stage.status === 'active' ? 'text-academic-blue' : 'text-trust-navy'}`}>
                        {stage.title}
                        {stage.status === 'active' && <span className="ml-3 px-2 py-0.5 rounded bg-guidance-gold/20 text-guidance-gold text-[10px] uppercase font-black">In Progress</span>}
                      </h4>
                      {stage.date && <span className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{stage.date}</span>}
                    </div>
                    {stage.note && (
                      <div className={`p-4 rounded-2xl border relative ${stage.status === 'active' ? 'bg-white border-academic-blue/30 shadow-hover' : 'bg-light-mist border-outline-variant/20'}`}>
                        <div className={`absolute -left-2 top-4 w-4 h-4 rotate-45 border-l border-b ${stage.status === 'active' ? 'bg-white border-academic-blue/30' : 'bg-light-mist border-outline-variant/20'}`} />
                        {stage.noteType && <span className="text-[10px] font-black uppercase text-trust-navy block mb-1">{stage.noteType}:</span>}
                        <p className="text-sm text-on-surface-variant font-body leading-relaxed">{stage.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-trust-navy-container rounded-2xl p-8 relative overflow-hidden group shadow-hover flex flex-col justify-between h-full">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Star className="w-6 h-6 text-guidance-gold" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">Premium Insights</h3>
                <p className="text-white/70 text-sm font-body leading-relaxed">
                  Upgrade your plan to get advanced filtering, complete PDF downloads, historical trend analysis, and dynamic chance indicators for each college based on specific quotas.
                </p>
              </div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-subscribe-modal'))} 
                className="relative z-10 w-full mt-6 py-3 bg-guidance-gold text-trust-navy font-bold rounded-xl hover:bg-white transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Predictor = () => {
  const { userProfile, currentUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [analyzingStep, setAnalyzingStep] = React.useState('');
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [savedColleges, setSavedColleges] = React.useState<string[]>([]);
  
  const [rankInput, setRankInput] = React.useState(userProfile?.course === 'BTECH' ? (userProfile?.jeeRank || '') : (userProfile?.neetRank || ''));
  const [categoryInput, setCategoryInput] = React.useState(userProfile?.category || 'General');
  const [stateInput, setStateInput] = React.useState(userProfile?.domicile || 'All India');

  React.useEffect(() => {
    if (!currentUser) return;
    const loadSaved = async () => {
      const q = query(collection(db, 'users', currentUser.uid, 'saved_colleges'));
      const snap = await getDocs(q);
      setSavedColleges(snap.docs.map(d => d.id));
    };
    loadSaved();
  }, [currentUser]);

  const toggleSave = async (college: any) => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid, 'saved_colleges', college.id);
    if (savedColleges.includes(college.id)) {
      await deleteDoc(docRef);
      setSavedColleges(prev => prev.filter(id => id !== college.id));
    } else {
      await setDoc(docRef, { ...college, savedAt: serverTimestamp() });
      setSavedColleges(prev => [...prev, college.id]);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rankInput) {
       alert("Please enter a valid rank.");
       return;
    }
    
    // Auto-save the input to user profile if modified
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const examTarget = userProfile?.course === 'BTECH' ? 'BTECH' : 'NEET';
        const parsedRank = rankInput ? Number(rankInput.toString().replace(/,/g, '')) || 0 : 0;
        await updateDoc(userRef, {
          category: categoryInput,
          domicile: stateInput,
          [examTarget === 'BTECH' ? 'jeeRank' : 'neetRank']: parsedRank
        });
      } catch (err) {
        console.error("Failed to auto-save profile data", err);
      }
    }

    setLoading(true);
    setShowResults(false);
    setAnalyzingStep('Initializing AI model...');

    setTimeout(() => setAnalyzingStep('Analyzing candidate profile...'), 800);
    setTimeout(() => setAnalyzingStep('Querying Gemini intelligence...'), 1600);
    setTimeout(() => setAnalyzingStep('Finalizing AI college predictions...'), 2400);

    try {
      const examTarget = userProfile?.course === 'BTECH' ? 'BTECH' : 'NEET';
      const score = examTarget === 'BTECH' ? userProfile?.jeeScore : userProfile?.neetScore;
      
      const payload = {
        rank: rankInput,
        category: categoryInput,
        state: stateInput,
        course: examTarget,
        examTarget: examTarget,
        score: score
      };

      const res = await fetch('/api/predict-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to fetch predictions from AI');
      }

      const data = await res.json();
      const processed = data.predictions || [];

      // Sort by scoreValue, keeping High > Medium > Low
      processed.sort((a: any, b: any) => {
        const scoreA = (a.chance === 'Very High' ? 4 : a.chance === 'High' ? 3 : a.chance === 'Medium' ? 2 : 1);
        const scoreB = (b.chance === 'Very High' ? 4 : b.chance === 'High' ? 3 : b.chance === 'Medium' ? 2 : 1);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return a.closingRank - b.closingRank;
      });

      setTimeout(() => {
        setPredictions(processed);
        setLoading(false);
        setShowResults(true);
      }, 3500);
    } catch (err) {
      console.error(err);
      setAnalyzingStep('AI Prediction failed, using fallback...');
      setTimeout(() => {
        let rankMultiplier = 1;
        if (categoryInput === 'OBC' || categoryInput === 'OBC-NCL') rankMultiplier = 2.5;
        else if (categoryInput === 'EWS') rankMultiplier = 2;
        else if (categoryInput === 'SC') rankMultiplier = 5;
        else if (categoryInput === 'ST') rankMultiplier = 8;
        
        const isBtech = userProfile?.course === 'BTECH';
        let baseColleges = isBtech ? [
          { collegeName: 'IIT Bombay', state: 'Maharashtra', course: 'B.Tech CS', baseCutoff: 150 },
          { collegeName: 'IIT Delhi', state: 'Delhi', course: 'B.Tech CS', baseCutoff: 500 },
          { collegeName: 'NIT Trichy', state: 'Tamil Nadu', course: 'B.Tech CS', baseCutoff: 1500 },
          { collegeName: 'DTU', state: 'Delhi', course: 'B.Tech ECE', baseCutoff: 8000 },
          { collegeName: 'NSUT', state: 'Delhi', course: 'B.Tech Mech', baseCutoff: 15000 },
          { collegeName: 'NIT Warangal', state: 'Telangana', course: 'B.Tech Civil', baseCutoff: 21000 },
          { collegeName: 'VIT Vellore', state: 'Tamil Nadu', course: 'B.Tech CS', baseCutoff: 35000 },
        ] : [
          { collegeName: 'AIIMS New Delhi', state: 'Delhi', course: 'MBBS', baseCutoff: 60 },
          { collegeName: 'Maulana Azad Medical College', state: 'Delhi', course: 'MBBS', baseCutoff: 1000 },
          { collegeName: 'VMMC & Safdarjung', state: 'Delhi', course: 'MBBS', baseCutoff: 1500 },
          { collegeName: 'Seth GS Medical College', state: 'Maharashtra', course: 'MBBS', baseCutoff: 2000 },
          { collegeName: 'Grant Medical College', state: 'Maharashtra', course: 'MBBS', baseCutoff: 4500 },
        ];

        let mockData = baseColleges.map(c => ({
          ...c,
          category: categoryInput,
          closingRank: Math.round(c.baseCutoff * rankMultiplier),
          id: c.collegeName.replace(/\s+/g, '-').toLowerCase()
        }));

        const r = Number(rankInput) || 0;
        let processedMock = mockData.map(c => {
          const diff = c.closingRank - r;
          let chance = 'Low';
          let chanceColor = 'bg-error-container/20 text-error';
          if (diff >= 5000) { chance = 'Very High'; chanceColor = 'bg-emerald-100 text-emerald-700'; }
          else if (diff >= 0) { chance = 'High'; chanceColor = 'bg-emerald-100 text-emerald-700'; }
          else if (diff >= -2000) { chance = 'Medium'; chanceColor = 'bg-guidance-gold/20 text-guidance-gold-container'; }
          return { ...c, chance, chanceColor, scoreValue: diff };
        });

        processedMock.sort((a,b) => b.scoreValue - a.scoreValue);

        setPredictions(processedMock);
        setLoading(false);
        setShowResults(true);
      }, 3200);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-academic-blue/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-academic-blue/10 text-academic-blue rounded-xl shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-trust-navy mb-2">AI College Predictor</h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Our advanced prediction engine analyzes millions of past records to estimate your chances with 94% accuracy.
            </p>
          </div>
        </div>
        
        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-trust-navy-container text-white rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#809eca]">AIR/Rank</label>
            <input 
              type="number" 
              value={rankInput}
              onChange={(e) => setRankInput(e.target.value)}
              placeholder="e.g. 12450"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-academic-blue" 
            />
          </div>
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#809eca]">Category</label>
            <select value={categoryInput} onChange={e => setCategoryInput(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-academic-blue appearance-none">
              <option className="text-trust-navy">General</option>
              <option className="text-trust-navy">OBC</option>
              <option className="text-trust-navy">SC</option>
              <option className="text-trust-navy">ST</option>
            </select>
          </div>
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#809eca]">State Domicile</label>
            <select value={stateInput} onChange={e => setStateInput(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-academic-blue appearance-none">
              <option className="text-trust-navy">All India</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state} className="text-trust-navy">{state}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end relative z-10">
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-guidance-gold text-trust-navy font-bold rounded-xl shadow-soft hover:bg-[#ffc95c] transition-all flex items-center justify-center gap-2 disabled:opacity-90 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-trust-navy/30 border-t-trust-navy rounded-full animate-spin" />
                  <span className="animate-pulse">{analyzingStep}</span>
                </div>
              ) : (
                <>
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Run AI Engine
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {showResults && (
        <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-6 border-b border-light-mist flex justify-between items-center bg-light-mist/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-trust-navy">AI Evaluated Results</h3>
            </div>
            <div className="flex gap-4">
              <button className="text-xs font-bold text-on-surface-variant flex items-center gap-2 hover:text-trust-navy transition-colors">
                <Filter className="w-4 h-4" />
                Sort By: Chances
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse border border-outline-variant/20 rounded-xl overflow-hidden">
              <thead className="bg-surface-container text-trust-navy text-[10px] uppercase font-bold tracking-widest outline outline-1 outline-outline-variant/20">
                <tr>
                  <th className="p-4 rounded-tl-xl">College Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Closing Rank (Prev)</th>
                  <th className="p-4 text-center">AI Confidence</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm">
                {predictions.map((c, i) => (
                  <tr key={i} className="hover:bg-light-mist/30 transition-colors group">
                    <td className="p-4 font-bold text-trust-navy">{c.collegeName}</td>
                    <td className="p-4 text-sm text-on-surface-variant font-body">{c.state}</td>
                    <td className="p-4 text-center font-mono text-xs font-bold text-on-surface-variant">{Number(c.closingRank).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 h-2 bg-light-mist rounded-full overflow-hidden">
                          <div className={`h-full ${c.chance === 'Very High' || c.chance === 'High' ? 'bg-emerald-500' : c.chance === 'Medium' ? 'bg-guidance-gold' : 'bg-error'}`} style={{ width: c.chance === 'Very High' ? '98%' : c.chance === 'High' ? '85%' : c.chance === 'Medium' ? '60%' : '30%' }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase ${c.chanceColor}`}>
                        {c.chance}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => toggleSave(c)} className={`px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest shadow-sm transform group-hover:-translate-y-0.5 ${savedColleges.includes(c.id) ? 'bg-guidance-gold text-trust-navy' : 'bg-academic-blue/10 text-academic-blue hover:bg-academic-blue hover:text-white'}`}>
                        {savedColleges.includes(c.id) ? 'Saved' : 'Shortlist +'}
                      </button>
                    </td>
                  </tr>
                ))}
                {predictions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                      No matching colleges found based on your parameters. Try uploading cutoffs in the Admin Dashboard!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

const Tracker = () => {
  const { userProfile } = useAuth();
  
  const hasRank = userProfile?.course === 'BTECH' ? !!userProfile?.jeeRank : !!userProfile?.neetRank;
  const isProfileComplete = !!(userProfile?.name && userProfile?.course && hasRank && userProfile?.domicile && userProfile?.category);

  const steps = [
    { title: 'Profile Setup', date: userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Now', status: isProfileComplete ? 'completed' : 'active', icon: User, details: isProfileComplete ? 'Profile is complete' : 'Please complete your profile to unlock all features' },
    { title: `${userProfile?.course === 'BTECH' ? 'JEE' : 'NEET'} Result`, date: isProfileComplete ? 'Updated' : 'Pending', status: isProfileComplete ? 'completed' : 'pending', icon: CheckCircle2, details: isProfileComplete ? `Rank: ${userProfile?.course === 'BTECH' ? userProfile?.jeeRank : userProfile?.neetRank} | State: ${userProfile?.domicile}` : 'Awaiting profile details' },
    { title: `${userProfile?.course === 'BTECH' ? 'JoSAA' : 'AIQ'} Registration`, date: 'Next Step', status: isProfileComplete ? 'active' : 'pending', icon: Milestone, details: 'Registration process' },
    { title: 'Choice Filling - Round 1', date: 'Upcoming', status: 'pending', icon: FileText, details: 'Targeting preferred colleges' },
    { title: 'Seat Allotment Result', date: 'Upcoming', status: 'pending', icon: GraduationCap, details: 'Awaiting allotment' },
    { title: 'Admission Completion', date: 'Final', status: 'pending', icon: GraduationCap, details: 'Final Step' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-academic-blue/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <h1 className="text-3xl font-display font-bold text-trust-navy mb-4">Admissions Journey</h1>
        <p className="text-on-surface-variant max-w-2xl">Track every milestone of your admission process in real-time.</p>
        
        <div className="mt-12 space-y-0 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-1 before:bg-outline-variant/10">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex gap-10 pb-12 last:pb-0 relative ${step.status === 'pending' ? 'opacity-60' : ''}`}
            >
              {i < steps.length - 1 && step.status === 'completed' && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.5 }}
                  className="absolute left-8 top-4 w-1 bg-emerald-500 z-0"
                />
              )}
              
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-soft transition-all duration-500 relative ${
                step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                step.status === 'active' ? 'bg-academic-blue text-white ring-8 ring-academic-blue/10 scale-110 shadow-lg' : 
                'bg-light-mist text-outline-variant border-outline-variant/20'
              }`}>
                <step.icon className="w-7 h-7" />
                {step.status === 'active' && (
                  <div className="absolute inset-0 rounded-full border-2 border-academic-blue animate-ping opacity-20" />
                )}
              </div>
              <div className={`flex-grow p-6 rounded-2xl border transition-all duration-300 ${
                step.status === 'active' ? 'bg-white border-academic-blue/30 shadow-xl transform scale-[1.02]' : 'bg-light-mist/40 border-outline-variant/10'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <h3 className={`text-xl font-display font-bold ${step.status === 'active' ? 'text-academic-blue' : 'text-trust-navy'}`}>
                    {step.title}
                  </h3>
                  <span className={`font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${step.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white text-on-surface-variant border-outline-variant/10'}`}>
                    {step.date}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{step.details}</p>
                {step.status === 'active' && (
                  <button className="bg-trust-navy text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-academic-blue transition-colors flex items-center gap-2">
                    Modify Preferences <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Main Student Portal Layout ---

const StudentProfile = () => {
  const { userProfile, currentUser } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const safeParse = (val: any) => val ? Number(val.toString().replace(/,/g, '')) || 0 : null;
      await updateDoc(userRef, {
        name: formData.name || null,
        email: formData.email || null,
        mobile: formData.mobile || null,
        gender: formData.gender || null,
        course: formData.course || null,
        neetRank: safeParse(formData.neetRank),
        jeeRank: safeParse(formData.jeeRank),
        neetScore: safeParse(formData.neetScore),
        jeeScore: safeParse(formData.jeeScore),
        category: formData.category || null,
        domicile: formData.domicile || null,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (userProfile) {
      setFormData(userProfile);
    }
  };
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/30">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-soft overflow-hidden">
              <img src={userProfile?.photoURL || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-academic-blue text-white rounded-full shadow-hover opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-trust-navy">{formData.name || 'User'}</h1>
            <p className="text-on-surface-variant flex items-center gap-2 mt-1 font-body">
              <GraduationCap className="w-4 h-4 text-academic-blue" /> {formData.course === 'BTECH' ? 'JEE' : 'NEET'} 2024 Aspirant <span className="opacity-50">•</span> <MapPin className="w-4 h-4 ml-1 text-academic-blue" /> {formData.domicile || 'Location'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {saveSuccess && <span className="text-sm text-emerald-600 font-bold animate-pulse">Profile updated successfully!</span>}
          <div className="flex gap-3">
            <button onClick={handleDiscard} className="px-5 py-2.5 bg-white border border-outline-variant/50 text-trust-navy font-bold rounded-xl shadow-soft hover:bg-light-mist hover:text-trust-navy transition-all active:scale-95 transform hover:-translate-y-0.5">Discard</button>
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-academic-blue text-white font-bold rounded-xl shadow-soft hover:shadow-hover transition-all active:scale-95 transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-75">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8">
             <h3 className="text-xl font-display font-bold text-trust-navy mb-6">Personal details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Full Name *</label>
                 <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Email *</label>
                 <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mobile Number *</label>
                 <input type="tel" name="mobile" value={formData.mobile || ''} onChange={handleChange} placeholder="+91" className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Gender</label>
                 <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue appearance-none transition-colors">
                   <option value="" disabled>Select Gender</option>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
               <div className="col-span-1 md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Permanent Address</label>
                 <textarea rows={3} defaultValue="" className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue resize-none transition-colors" placeholder="Enter your full address" />
               </div>
             </div>
          </section>

          <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8">
             <h3 className="text-xl font-display font-bold text-trust-navy mb-6">Academic & Examination Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Course Focus</label>
                 <select name="course" value={formData.course || ''} onChange={handleChange} className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue appearance-none transition-colors">
                   <option value="NEET">MBBS/BDS/Medical (NEET)</option>
                   <option value="BTECH">B.Tech/Engineering (JEE)</option>
                 </select>
               </div>
               {formData.course === 'BTECH' ? (
                 <>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">JEE Rank</label>
                     <input type="number" name="jeeRank" value={formData.jeeRank || ''} onChange={handleChange} placeholder="e.g. 15000" className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">JEE Score</label>
                     <input type="number" name="jeeScore" value={formData.jeeScore || ''} onChange={handleChange} placeholder="e.g. 180" className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
                   </div>
                 </>
               ) : (
                 <>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">NEET Rank</label>
                     <input type="number" name="neetRank" value={formData.neetRank || ''} onChange={handleChange} placeholder="e.g. 45000" className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">NEET Score</label>
                     <input type="number" name="neetScore" value={formData.neetScore || ''} onChange={handleChange} placeholder="e.g. 620" className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
                   </div>
                 </>
               )}
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Category</label>
                 <select name="category" value={formData.category || 'General'} onChange={handleChange} className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue appearance-none transition-colors">
                   <option value="General">General / Unreserved</option>
                   <option value="OBC-NCL">OBC-NCL</option>
                   <option value="SC">SC</option>
                   <option value="ST">ST</option>
                   <option value="EWS">EWS</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Domicile State</label>
                 <select name="domicile" value={formData.domicile || ''} onChange={handleChange} className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue appearance-none transition-colors">
                   <option value="" disabled>Select State</option>
                   {INDIAN_STATES.map(state => (
                     <option key={state} value={state}>{state}</option>
                   ))}
                 </select>
               </div>
             </div>
          </section>

          <section className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-8">
             <h3 className="text-xl font-display font-bold text-trust-navy mb-6">Parent/Guardian Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Parent's Full Name</label>
                 <input type="text" defaultValue="Rajesh R." className="w-full bg-light-mist/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Parent's Contact Number</label>
                 <input type="tel" defaultValue="+91 9812345670" className="w-full bg-light-mist/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Occupation</label>
                 <input type="text" defaultValue="Business" className="w-full bg-light-mist/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-academic-blue transition-colors" />
               </div>
             </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <aside className="bg-trust-navy-container text-white rounded-2xl shadow-soft p-6 relative overflow-hidden group">
             <div className="absolute right-0 top-0 w-32 h-32 bg-guidance-gold/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-guidance-gold/20" />
             <h3 className="text-lg font-display font-bold mb-4 relative z-10">Profile Completeness</h3>
             <div className="flex items-end justify-between mb-2 relative z-10">
               <div className="flex items-start gap-1">
                 <span className="text-4xl font-mono font-black text-guidance-gold">85</span>
                 <span className="text-xl font-mono font-bold text-guidance-gold mt-1">%</span>
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-primary-fixed-dim bg-white/10 px-2 py-1 rounded-md">Great</span>
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4 relative z-10">
               <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-guidance-gold w-[85%]" />
             </div>
             <p className="text-sm text-primary-fixed-dim relative z-10">Almost ready for counselling. Please upload your Aadhar Card to reach 100%.</p>
          </aside>

          <aside className="bg-white rounded-2xl shadow-soft border border-outline-variant/30 p-6">
             <h3 className="text-lg font-display font-bold text-trust-navy mb-4 border-b border-light-mist pb-4">Required Documents</h3>
             <div className="space-y-3">
               {[
                 { doc: `${userProfile?.course === 'BTECH' ? 'JEE' : 'NEET'} Scorecard`, status: 'verified', label: 'Verified' },
                 { doc: '10th Marksheet', status: 'verified', label: 'Verified' },
                 { doc: '12th Marksheet', status: 'verified', label: 'Verified' },
                 { doc: 'Aadhar Card', status: 'pending', label: 'Upload Pending' },
                 { doc: 'Domicile Cert.', status: 'pending', label: 'Upload Pending' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/20 hover:bg-light-mist transition-colors group cursor-pointer">
                   <div className="flex items-center gap-3">
                     <FileText className={`w-4 h-4 ${item.status === 'verified' ? 'text-emerald-500' : 'text-outline-variant'}`} />
                     <span className={`text-sm font-semibold ${item.status === 'verified' ? 'text-trust-navy' : 'text-on-surface-variant'}`}>{item.doc}</span>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md transition-colors ${
                     item.status === 'verified' 
                       ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-100' 
                       : 'bg-red-50 text-error border border-error/10 group-hover:bg-red-100'
                   }`}>{item.label}</span>
                 </div>
               ))}
             </div>
             <button className="w-full py-3 bg-light-mist border border-outline-variant/50 hover:bg-trust-navy hover:text-white transition-all mt-6 rounded-xl text-sm font-bold text-trust-navy flex items-center justify-center gap-2 group transform active:scale-95">
               Go to Document Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

import { doc, getDoc, updateDoc, setDoc, query, collection, getDocs, where, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';


const OnboardingOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = React.useState(1);
  const [selectedCourse, setSelectedCourse] = React.useState('MBBS');
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>(['Top Ranked College']);
  
  const { userProfile } = useAuth();
  
  // Form State
  const [name, setName] = React.useState(userProfile?.name || '');
  const [mobile, setMobile] = React.useState(userProfile?.mobile || '');
  const [gender, setGender] = React.useState(userProfile?.gender || '');
  const prevRank = userProfile?.course === 'BTECH' ? userProfile?.jeeRank : userProfile?.neetRank;
  const [rank, setRank] = React.useState(prevRank ? String(prevRank) : '');
  const prevScore = userProfile?.course === 'BTECH' ? userProfile?.jeeScore : userProfile?.neetScore;
  const [score, setScore] = React.useState(prevScore ? String(prevScore) : '');
  const [category, setCategory] = React.useState(userProfile?.category || '');
  const [domicile, setDomicile] = React.useState(userProfile?.domicile || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const togglePriority = (p: string) => {
    setSelectedPriorities(prev => 
      prev.includes(p) 
        ? prev.filter(item => item !== p)
        : prev.length < 2 ? [...prev, p] : prev
    );
  };

  const calculateCourseEnum = () => {
    if (selectedCourse === 'B.Tech') return 'BTECH';
    return 'NEET';
  }

  const handleComplete = async () => {
    if (!userProfile) {
       localStorage.setItem('hasCompletedOnboarding', 'true');
       onComplete();
       return;
    }
    
    setIsSubmitting(true);
    try {
       const userDoc = doc(db, 'users', userProfile.uid);
       const safeParse = (val: any) => val ? Number(val.toString().replace(/,/g, '')) || 0 : 0;
       await setDoc(userDoc, {
          name: name || userProfile.name || 'Student',
          mobile,
          gender,
          course: calculateCourseEnum(),
          category: category || 'General',
          domicile: domicile || 'All States',
          [calculateCourseEnum() === 'BTECH' ? 'jeeRank' : 'neetRank']: safeParse(rank),
          [calculateCourseEnum() === 'BTECH' ? 'jeeScore' : 'neetScore']: safeParse(score),
       }, { merge: true });
       localStorage.setItem('hasCompletedOnboarding', 'true');
       onComplete();
    } catch (error) {
       console.error("Error saving onboarding details", error);
       alert("Failed to save profile. Make sure you are logged in and try again.");
       localStorage.setItem('hasCompletedOnboarding', 'true');
       onComplete();
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-trust-navy-container/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full min-h-[600px] flex overflow-hidden border border-outline-variant/20 shadow-trust-navy/30">
        {/* Sidebar */}
        <div className="w-[320px] bg-light-mist p-10 border-r border-outline-variant/30 flex-col hidden lg:flex relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 w-64 h-64 bg-academic-blue/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
           <div className="flex items-center gap-2 mb-12 relative z-10">
             <GraduationCap className="w-8 h-8 text-academic-blue" />
             <span className="text-2xl font-display font-black uppercase tracking-tighter text-trust-navy">AR EduIndia</span>
           </div>
           <ul className="space-y-8 relative z-10 flex-1">
             {[
               { id: 1, title: 'Welcome', subtitle: 'Basic Details' },
               { id: 2, title: 'Academic', subtitle: 'Exam & Current Status' },
               { id: 3, title: 'Preferences', subtitle: 'Targets & Goals' }
             ].map(s => (
               <li key={s.id} className={`flex items-start gap-4 transition-all duration-300 ${step === s.id ? 'opacity-100 scale-105' : step > s.id ? 'opacity-50' : 'opacity-30'}`}>
                 <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center font-bold font-mono text-xs transition-colors duration-300 ${step >= s.id ? 'bg-academic-blue text-white shadow-soft' : 'border-2 border-outline-variant text-outline'}`}>
                   {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                 </div>
                 <div>
                   <h4 className={`font-bold transition-colors ${step === s.id ? 'text-trust-navy' : 'text-on-surface-variant'}`}>{s.title}</h4>
                   <p className="text-xs text-on-surface-variant mt-0.5">{s.subtitle}</p>
                 </div>
               </li>
             ))}
           </ul>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col relative overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-display font-bold text-trust-navy mb-2">Let's set up your profile</h2>
                <p className="text-on-surface-variant mb-10 text-lg">We need a few details to personalize your college predictor and tracker.</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Full Name *</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mobile Number *</label>
                      <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 9999999999" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Email Address *</label>
                    <input type="email" value={userProfile?.email} readOnly disabled className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none opacity-60 cursor-not-allowed transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Date of Birth</label>
                      <input type="date" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Gender</label>
                      <div className="relative">
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white appearance-none transition-colors">
                          <option disabled value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronRight className="w-4 h-4 text-outline absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-display font-bold text-trust-navy mb-2">Academic Information</h2>
                <p className="text-on-surface-variant mb-10 text-lg">This helps our algorithms accurately predict your chances.</p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Target Course *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['MBBS', 'BDS', 'BAMS/BHMS', 'B.Tech'].map(c => (
                        <label key={c} className="cursor-pointer group">
                          <input type="radio" name="course" className="peer sr-only" checked={selectedCourse === c} onChange={() => setSelectedCourse(c)} />
                          <div className={`text-center py-4 border-2 rounded-xl text-sm font-bold transition-all group-hover:border-academic-blue/50 ${selectedCourse === c ? 'border-academic-blue bg-academic-blue/5 text-academic-blue' : 'border-outline-variant/30 text-on-surface-variant'}`}>
                            {c}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                        {calculateCourseEnum() === 'BTECH' ? 'JEE Main Rank' : 'NEET Rank'}
                      </label>
                      <input type="number" value={rank} onChange={(e) => setRank(e.target.value)} placeholder="e.g. 12450" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                        {calculateCourseEnum() === 'BTECH' ? 'JEE Main Score' : 'NEET Score'}
                      </label>
                      <input type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 120" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Category *</label>
                      <div className="relative">
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white appearance-none transition-colors">
                          <option disabled value="">Select Category</option>
                          <option value="General">General</option>
                          <option value="OBC-NCL">OBC-NCL</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                        </select>
                        <ChevronRight className="w-4 h-4 text-outline absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Domicile State *</label>
                      <div className="relative">
                        <select value={domicile} onChange={(e) => setDomicile(e.target.value)} className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white appearance-none transition-colors">
                          <option disabled value="">Select State</option>
                          {INDIAN_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-outline absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-display font-bold text-trust-navy mb-2">Final Step: Your Goals</h2>
                <p className="text-on-surface-variant mb-10 text-lg">What are your top priorites during counselling?</p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">Top Priority (Select up to 2)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Top Ranked College', 'Home State Preferred', 'Low Fees', 'Specific City', 'Government Only', 'Peripheral AIIMS'].map((c, i) => (
                        <label key={c} className={`cursor-pointer group ${!selectedPriorities.includes(c) && selectedPriorities.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input type="checkbox" className="sr-only" checked={selectedPriorities.includes(c)} onChange={() => togglePriority(c)} disabled={!selectedPriorities.includes(c) && selectedPriorities.length >= 2} />
                          <div className={`px-5 py-4 border-2 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${selectedPriorities.includes(c) ? 'border-academic-blue bg-academic-blue/5 text-academic-blue' : 'border-outline-variant/30 text-on-surface-variant group-hover:border-academic-blue/50'}`}>
                            {c}
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedPriorities.includes(c) ? 'bg-academic-blue border-academic-blue' : 'border-outline-variant/50'}`}>
                              <CheckCircle2 className={`w-3 h-3 text-white transition-opacity ${selectedPriorities.includes(c) ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Dream College / Target (Optional)</label>
                    <input type="text" placeholder="e.g. AIIMS Delhi, MAMC" className="w-full bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-academic-blue focus:bg-white transition-colors" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-6 border-t border-outline-variant/20 flex justify-between items-center bg-white sticky bottom-0 z-10">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-on-surface-variant hover:bg-light-mist hover:text-trust-navy'}`}
            >
              Back
            </button>
            <button 
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else {
                  handleComplete();
                }
              }}
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-academic-blue text-white rounded-xl font-bold shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : step === 3 ? 'Complete Setup' : 'Continue'}
              {step < 3 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentPortal() {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showSubscribe, setShowSubscribe] = React.useState(false);

  React.useEffect(() => {
    const handleOpen = () => setShowSubscribe(true);
    window.addEventListener('open-subscribe-modal', handleOpen);
    return () => window.removeEventListener('open-subscribe-modal', handleOpen);
  }, []);

  const [hasOnboarded, setHasOnboarded] = React.useState(() => {
    const fromStorage = localStorage.getItem('hasCompletedOnboarding') === 'true';
    const hasData = userProfile?.course && userProfile?.domicile;
    if (hasData && !fromStorage) {
      localStorage.setItem('hasCompletedOnboarding', 'true');
    }
    return fromStorage || Boolean(hasData);
  });

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      localStorage.removeItem('hasCompletedOnboarding');
      // Use window.location as navigate might fail if out of scope or we can just import useNavigate
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'College Predictor', path: '/student/predictor', icon: Search },
    { label: 'Saved Colleges', path: '/student/shortlisted', icon: Bookmark },
    { label: 'Tracker', path: '/student/tracker', icon: Milestone },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light-mist">
      {!hasOnboarded && <OnboardingOverlay onComplete={() => setHasOnboarded(true)} />}
      <PortalSubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />

      {/* Top Navbar */}
      <nav className="bg-white border-b border-outline-variant/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <Link to="/student" className="flex items-center gap-2 group">
              <GraduationCap className="w-6 h-6 text-academic-blue group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-display font-black text-trust-navy uppercase tracking-tighter group-hover:text-academic-blue transition-colors duration-300">Student Portal</span>
            </Link>
            
            <ul className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`text-sm font-body font-semibold transition-colors flex items-center gap-2 group ${
                      location.pathname === item.path ? 'text-academic-blue' : 'text-on-surface-variant hover:text-trust-navy'
                    }`}
                  >
                    <span className="group-hover:-translate-y-0.5 transition-transform duration-300">{item.label}</span>
                    {location.pathname === item.path && <motion.div layoutId="nav-glow" className="w-1.5 h-1.5 rounded-full bg-academic-blue" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <button 
                className="p-2 text-on-surface-variant hover:bg-light-mist rounded-full relative transition-colors group"
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-white animate-pulse" />
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
                      <span className="text-[10px] font-mono text-academic-blue font-bold px-2 py-0.5 rounded-full bg-academic-blue/10">1 UNREAD</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {[
                        { title: `${userProfile?.course === 'BTECH' ? 'JoSAA' : 'MCC'} Expected Schedule out`, time: '10m ago', unread: true },
                        { title: 'Prediction Saved Successfully', time: '1d ago', unread: false },
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full border-2 border-outline-variant ring-offset-2 ring-2 ring-transparent hover:ring-academic-blue/20 transition-all cursor-pointer overflow-hidden group"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              >
                <img src={userProfile?.photoURL || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"} alt="Profile" className="group-hover:scale-110 transition-transform duration-300" />
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
                      <div className="font-bold text-trust-navy font-display truncate">{userProfile?.name || 'User'}</div>
                      <div className="text-xs text-on-surface-variant font-mono mt-1">{userProfile?.isSubscribed ? 'Premium User' : 'Free Tier User'}</div>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link to="/student/profile" className="w-full text-left px-4 py-2 hover:bg-light-mist rounded-xl transition-colors font-semibold text-trust-navy flex items-center gap-3" onClick={() => setShowProfileMenu(false)}>
                        <Users className="w-4 h-4 text-on-surface-variant" />
                        My Profile
                      </Link>
                      <button onClick={() => { setShowSubscribe(true); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-light-mist rounded-xl transition-colors font-semibold text-trust-navy flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-on-surface-variant" />
                        Upgrade to Premium
                      </button>
                      <Link to="/student/settings" onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2 hover:bg-light-mist rounded-xl transition-colors font-semibold text-trust-navy flex items-center gap-3">
                        <Settings className="w-4 h-4 text-on-surface-variant" />
                        Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-light-mist">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-xl transition-colors font-bold text-error flex items-center gap-3">
                        <Briefcase className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow scroll-smooth">
        <AnimatePresence mode="wait">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="predictor" element={<Predictor />} />
            <Route path="shortlisted" element={<SavedColleges />} />
            <Route path="tracker" element={<Tracker />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="settings" element={
              <div className="p-8 bg-white rounded-2xl shadow-soft">
                 <h1 className="text-3xl font-display font-bold text-trust-navy mb-4">Settings</h1>
                 <p className="text-on-surface-variant max-w-2xl mb-8">Manage your account preferences and notifications.</p>
                 <div className="space-y-6">
                    <div className="p-4 border border-outline-variant/30 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-trust-navy">Email Notifications</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-on-surface-variant">Receive updates about seat allocations.</p>
                    </div>
                    <div className="p-4 border border-outline-variant/30 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-trust-navy">SMS Alerts</span>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-on-surface-variant">Get instant alerts on your registered mobile number.</p>
                    </div>
                 </div>
              </div>
            } />
            <Route path="cutoffs" element={
              <div className="bg-white rounded-2xl shadow-soft p-8">
                 <h1 className="text-3xl font-display font-bold text-trust-navy mb-4">Cutoff Database</h1>
                 <p className="text-on-surface-variant max-w-2xl mb-8">Search detailed previous year college cutoffs across categories and states. Data updated by administrators.</p>
                 <div className="flex gap-4 mb-8">
                   <input type="text" placeholder="Search by college name, code, or state..." className="flex-1 bg-light-mist border border-outline-variant/30 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-academic-blue" />
                   <button className="bg-academic-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-academic-blue/90 transition-colors">Search</button>
                 </div>
                 <div className="h-64 flex items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-xl">
                   <p className="text-on-surface-variant font-mono">Select a state or enter a query to view historical cutoffs.</p>
                 </div>
              </div>
            } />
            <Route path="*" element={<div className="p-8 text-center text-xl font-bold">Page Not Found in Student Portal</div>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-trust-navy-container text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <GraduationCap className="w-6 h-6 text-guidance-gold group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-display font-black uppercase tracking-tighter">AR EduIndia</span>
            </div>
            <p className="text-primary-fixed-dim text-sm leading-relaxed">
              Medical Admissions Excellence. Guiding your journey to top-tier institutions.
            </p>
          </div>
          <div className="md:col-span-3 flex justify-end items-end">
            <div className="flex flex-wrap gap-8 text-sm font-bold uppercase tracking-widest text-[#809eca]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Counselling Guide</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center md:text-left">
          <p className="font-mono text-[10px] text-primary-fixed-dim/50">
            © 2026 AR EDUINDIA. ALL RIGHTS RESERVED. POWERED BY ACADEMIC EXCELLENCE.
          </p>
        </div>
      </footer>
    </div>
  );
}
