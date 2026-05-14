import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/student/*" element={<StudentPortal />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/" element={<Navigate to="/auth" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
