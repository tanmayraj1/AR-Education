import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function RequireAuth({ children, role }: { children: JSX.Element, role: 'student' | 'admin' }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-light-mist flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-academic-blue border-t-transparent animate-spin" />
          <p className="font-mono text-sm font-bold tracking-widest text-trust-navy uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (userProfile.role !== role) {
    return <Navigate to={userProfile.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
}

function AppContent() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/student/*" element={
          <RequireAuth role="student">
            <StudentPortal />
          </RequireAuth>
        } />
        <Route path="/admin/*" element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        } />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
