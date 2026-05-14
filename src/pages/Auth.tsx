import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star, GraduationCap, X, CheckCircle2, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SubscribeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setStep(1);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trust-navy/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-4xl flex overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-2 text-outline hover:text-trust-navy transition-colors z-20 hover:bg-light-mist rounded-full">
          <X className="w-5 h-5" />
        </button>

        {/* Left Side - Details */}
        <div className="w-[40%] bg-trust-navy-container p-10 text-white hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-academic-blue/30 via-transparent to-transparent opacity-60" />
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-4">Premium Counselling</h2>
            <p className="text-blue-100 text-sm mb-8 font-body leading-relaxed">Get personalized guidance, AI-powered college prediction, and guaranteed support until admission.</p>
            
            <div className="space-y-6">
              {[
                'Unlimited AI Predictor Access',
                'Personalized College Shortlist',
                'Document Verification Support',
                '1-on-1 Expert Session',
                'Real-time Cutoff Alerts'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-guidance-gold" />
                  <span className="text-sm font-semibold font-body">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-xs font-mono font-bold text-guidance-gold uppercase tracking-widest mb-1">One-time Fee</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold">₹2,000</span>
              <span className="text-sm text-blue-200">/season</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-[60%] p-10 relative">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-display font-bold text-trust-navy">Payment Successful!</h3>
                <p className="text-on-surface-variant font-body mb-6">Your premium account has been created. Check your email for login credentials.</p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
                <h3 className="text-2xl font-display font-bold text-trust-navy mb-2">Student Details</h3>
                <p className="text-sm text-on-surface-variant font-body mb-8">Enter your details exactly as they appear on your NEET/JEE application.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black uppercase tracking-widest text-on-surface-variant">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input type="text" required placeholder="Student Name" className="w-full pl-10 pr-4 py-3 bg-light-mist border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-academic-blue" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black uppercase tracking-widest text-on-surface-variant">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                        <input type="email" required placeholder="student@example.com" className="w-full pl-10 pr-4 py-3 bg-light-mist border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-academic-blue" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black uppercase tracking-widest text-on-surface-variant">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                        <input type="tel" required placeholder="+91 XXXXX XXXXX" className="w-full pl-10 pr-4 py-3 bg-light-mist border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-academic-blue" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black uppercase tracking-widest text-on-surface-variant">Roll Number</label>
                    <input type="text" required placeholder="e.g. 240501XXXXX" className="w-full px-4 py-3 bg-light-mist border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-academic-blue" />
                  </div>

                  <div className="pt-6 mt-auto">
                    <button type="submit" className="w-full bg-trust-navy text-white font-mono font-semibold py-4 rounded-xl hover:bg-academic-blue transition-colors flex items-center justify-center gap-2 group shadow-hover">
                      Proceed to Payment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-light-mist rounded-xl transition-colors">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-trust-navy">Payment Options</h3>
                    <p className="text-sm text-on-surface-variant font-body">Secure checkout via Razorpay</p>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6 flex-1 flex flex-col">
                  {/* Fake Payment UI representing standard Indian PSP */}
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border-2 border-academic-blue bg-academic-blue/5 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-academic-blue" />
                        <span className="font-semibold text-trust-navy">UPI / QR Code</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-[6px] border-academic-blue bg-white" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-outline-variant/50 rounded-xl cursor-pointer hover:border-outline transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-outline" />
                        <span className="font-semibold text-on-surface-variant">Credit / Debit Card</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-outline-variant/50 rounded-xl cursor-pointer hover:border-outline transition-colors">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-outline" />
                        <span className="font-semibold text-on-surface-variant">Net Banking</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                    </label>
                  </div>

                  <div className="mt-auto pt-6 border-t border-outline-variant/30">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-sm font-semibold text-on-surface-variant">Total Amount to Pay</span>
                      <span className="text-3xl font-display font-bold text-trust-navy">₹2,000</span>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full bg-[#3399cc] text-white font-mono font-semibold py-4 rounded-xl hover:bg-[#2b88b8] transition-colors flex items-center justify-center gap-2 group shadow-hover relative overflow-hidden"
                    >
                      {isProcessing ? 'Processing Payment...' : 'Pay Securely'}
                      {!isProcessing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      {isProcessing && <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute top-0 left-0 w-full h-full bg-white/20 skew-x-12" />}
                    </button>
                    <p className="text-center text-[10px] text-on-surface-variant mt-4 font-mono">Secured by Razorpay • PCI-DSS Compliant</p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default function Auth() {
  const [isStudentLogin, setIsStudentLogin] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, adminBypassLogin, userProfile, currentUser } = useAuth();

  useEffect(() => {
    if (userProfile && currentUser) {
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    }
  }, [userProfile, currentUser, navigate]);

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await signInWithGoogle(isStudentLogin ? 'student' : 'admin');
    } catch (error: any) {
      console.error("Google login error:", error);
      setErrorMsg(error.message || 'Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (authMode === 'login') {
      try {
        await signInWithEmail(email, password);
      } catch (error: any) {
        if (!isStudentLogin && email === 'admin@areduindia.com') {
          try {
             await signUpWithEmail(email, password, 'Super Admin', 'admin');
             await signInWithEmail(email, password);
             return;
          } catch (signUpError: any) {
             console.error("Auto-provision error", signUpError);
          }
        }
        setErrorMsg(error.message || 'Failed to sign in');
      }
    } else {
      try {
        await signUpWithEmail(email, password, name, isStudentLogin ? 'student' : 'admin');
        setAuthMode('login');
        setEmail('');
        setPassword('');
        setName('');
        setSuccessMsg("Account created! Please check your email to verify before logging in.");
      } catch (error: any) {
        setErrorMsg(error.message || 'Failed to sign up');
      }
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-light-mist">
      {/* Left Panel - Hero / Brand (Lg and up) */}
      <div className="hidden lg:flex w-[45%] bg-trust-navy-container relative overflow-hidden flex-col justify-between p-16">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 20% 80%, #d3e3ff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #aac8f6 0%, transparent 50%)' 
             }} 
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-white mb-4"
          >
            <div className="p-2 bg-white/10 rounded-lg">
              <GraduationCap className="w-8 h-8 text-guidance-gold" />
            </div>
            <h1 className="text-3xl font-display font-bold">AR EduIndia</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 max-w-md font-body"
          >
            Medical Admissions Excellence. Guiding your journey to top-tier medical institutions.
          </motion.p>
        </div>

        {/* Testimonial Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 glass-panel rounded-xl p-8 max-w-md shadow-hover"
        >
          <div className="flex items-start gap-4">
            <img 
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150" 
              alt="Anjali Sharma"
              className="w-14 h-14 rounded-full object-cover border-2 border-guidance-gold"
            />
            <div>
              <p className="text-white font-body italic mb-3 leading-relaxed">
                "The counselling guidance I received through the portal was invaluable. It helped me secure a seat in my dream medical college when I thought it was impossible."
              </p>
              <p className="font-mono text-guidance-gold font-semibold text-sm">Anjali Sharma</p>
              <p className="text-blue-200 text-xs">Secured AIIMS Delhi, NEET 2023</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden">
          <div className="flex items-center gap-2 text-trust-navy">
            <GraduationCap className="w-6 h-6 text-academic-blue" />
            <h1 className="text-xl font-display font-bold">AR EduIndia</h1>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md bg-white rounded-xl shadow-soft border border-outline-variant/30 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-outline-variant/30 bg-surface-container-low">
            <button 
              onClick={() => {
                setIsStudentLogin(true);
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-4 font-mono text-sm transition-colors relative ${isStudentLogin ? 'text-trust-navy bg-white underline decoration-2 underline-offset-8' : 'text-on-surface-variant'}`}
            >
              Student Login
              {isStudentLogin && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-academic-blue" />}
            </button>
            <button 
              onClick={() => {
                setIsStudentLogin(false);
                setAuthMode('login'); // Force login mode for admin
                setEmail('admin@areduindia.com');
                setPassword('admin 123');
              }}
              className={`flex-1 py-4 font-mono text-sm transition-colors relative ${!isStudentLogin ? 'text-trust-navy bg-white underline decoration-2 underline-offset-8' : 'text-on-surface-variant'}`}
            >
              Admin Login
              {!isStudentLogin && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-academic-blue" />}
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isStudentLogin && (
                <div className="flex bg-light-mist p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${authMode === 'login' ? 'bg-white shadow text-trust-navy' : 'text-on-surface-variant'}`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${authMode === 'signup' ? 'bg-white shadow text-trust-navy' : 'text-on-surface-variant'}`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg break-words">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-100 text-emerald-700 text-sm rounded-lg">
                  {successMsg}
                </div>
              )}

              {isStudentLogin ? (
                <>
                  <div className="space-y-4">
                    {authMode === 'signup' && (
                      <div>
                        <label className="block font-mono text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-outline-variant/50 rounded-xl font-body text-sm focus:outline-none focus:border-academic-blue focus:ring-1 focus:ring-academic-blue transition-all"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block font-mono text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@example.com"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-outline-variant/50 rounded-xl font-body text-sm focus:outline-none focus:border-academic-blue focus:ring-1 focus:ring-academic-blue transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block font-mono text-xs font-semibold text-on-surface uppercase tracking-wider">
                          Password
                        </label>
                        {authMode === 'login' && (
                          <button type="button" className="text-xs text-academic-blue hover:underline">
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-12 py-3 border border-outline-variant/50 rounded-xl font-body text-sm focus:outline-none focus:border-academic-blue focus:ring-1 focus:ring-academic-blue transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-academic-blue text-white font-mono font-semibold py-4 rounded-xl shadow-soft hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group mt-6"
                  >
                    {authMode === 'login' ? 'Login to Portal' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="relative flex items-center py-2 mt-6">
                    <div className="flex-grow border-t border-outline-variant/30"></div>
                    <span className="flex-shrink-0 mx-4 font-body text-xs text-on-surface-variant">or continue with Google</span>
                    <div className="flex-grow border-t border-outline-variant/30"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-outline-variant/30 text-trust-navy font-mono font-semibold py-4 rounded-xl shadow-soft hover:bg-light-mist transition-all flex items-center justify-center gap-3 group mt-4"
                   >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowSubscribe(true)}
                    className="w-full bg-guidance-gold text-trust-navy font-mono font-semibold py-4 rounded-xl shadow-soft hover:bg-guidance-gold/90 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    New? Subscribe Now
                    <Star className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-trust-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-trust-navy" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-trust-navy">Admin Access Hub</h3>
                  <p className="text-sm text-on-surface-variant font-body">Direct, secure access to the central dashboard. Authentication is handled automatically for administrators.</p>
                  
                  <button 
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        console.log("Starting admin bypass");
                        await adminBypassLogin();
                        console.log("Admin bypass complete");
                        navigate('/admin');
                      } catch (err: any) {
                        console.error("Admin bypass failed:", err);
                        setErrorMsg('Admin Login failed: ' + (err.message || 'Unknown error'));
                      }
                    }}
                    className="w-full bg-trust-navy text-white font-mono font-semibold py-4 rounded-xl shadow-soft hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group mt-8"
                  >
                    Enter Admin Dashboard
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      <SubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  );
}
