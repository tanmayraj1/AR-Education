import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, CreditCard, User, ArrowRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const PortalSubscribeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { userProfile } = useAuth();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        if (userProfile?.uid) {
          const userRef = doc(db, 'users', userProfile.uid);
          await updateDoc(userRef, { isSubscribed: true });
        }
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2000);
      } catch (error) {
        console.error("Error updating subscription status:", error);
        setIsProcessing(false);
      }
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
            <p className="text-blue-100 text-sm mb-8 font-body leading-relaxed">Upgrade to access personalized guidance, AI prediction, and guaranteed support.</p>
            
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
                <p className="text-on-surface-variant font-body mb-6">Your account has been upgraded to Premium.</p>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
                <div className="flex items-center gap-4 mb-8">
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
