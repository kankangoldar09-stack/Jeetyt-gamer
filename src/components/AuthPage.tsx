import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Camera, ChevronRight, Lock, Mail, User as UserIcon, ArrowLeft, Smile, Phone, MessageSquare } from 'lucide-react';

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [usePhone, setUsePhone] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`);

  const handlePhoneLogin = async () => {
    if (step === 1) {
      setLoading(true);
      // Mock sending OTP
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 1500);
      return;
    }

    setLoading(true);
    // Mock login for phone
    setTimeout(() => {
      onAuthSuccess({
        id: `phone-${phone}`,
        email: `${phone}@indianreels.app`,
        user_metadata: {
          username: `user_${phone.slice(-4)}`,
          full_name: 'Indian Reels User',
          avatar_url: avatarUrl
        }
      });
      setLoading(false);
    }, 1500);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
          }
        }
      });
      if (error) throw error;
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 bg-[#010101] z-[100] flex flex-col items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 pointer-events-none technical-grid opacity-20"></div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black italic text-white tracking-tighter uppercase"
          >
            INDIAN<span className="text-[#69C9D0]">REELS</span><span className="text-[#EE1D52]">.</span>
          </motion.h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mt-4">
            {isLogin ? 'Establish Secure Node' : 'Initialize New Account'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[#EE1D52]/10 border border-[#EE1D52]/20 rounded-xl p-3 mb-4"
            >
              <p className="text-[#EE1D52] text-[10px] uppercase font-black text-center tracking-wider leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}

          {isLogin ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {usePhone ? (
                <div className="space-y-4">
                  {step === 1 ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#69C9D0]"
                        />
                      </div>
                      <button 
                        onClick={handlePhoneLogin}
                        disabled={loading || phone.length < 10}
                        className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-30"
                      >
                        {loading ? 'Sending OTP via WhatsApp...' : 'Get OTP'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          type="text" 
                          placeholder="Enter 6-digit OTP" 
                          value={otp}
                          maxLength={6}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm text-center tracking-[0.5em] focus:outline-none focus:border-[#69C9D0]"
                        />
                      </div>
                      <button 
                        onClick={handlePhoneLogin}
                        disabled={loading || otp.length < 6}
                        className="w-full py-4 bg-[#69C9D0] text-black font-black uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-30"
                      >
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </button>
                      <button 
                        onClick={() => setStep(1)} 
                        className="w-full text-white/20 text-[9px] font-bold uppercase tracking-widest"
                      >
                        Change Number
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#EE1D52]"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#EE1D52]"
                    />
                  </div>
                  <button 
                    onClick={handleEmailLogin}
                    disabled={loading}
                    className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl"
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </div>
              )}
              
              <div className="flex flex-col items-center gap-6 mt-4">
                <button 
                  onClick={() => { setUsePhone(!usePhone); setStep(1); }}
                  className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  {usePhone ? 'Login with Email instead' : 'Login with Phone instead'}
                </button>
                
                <div className="w-full h-[1px] bg-white/5" />

                <div className="flex items-center gap-4">
                  <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">No account?</span>
                  <button 
                    onClick={() => { setIsLogin(false); setStep(1); setError(null); }}
                    className="text-[#69C9D0] text-[10px] font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
                  >
                    Join Network
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-4 text-center">
                  <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mb-6 px-4 leading-relaxed">Phase 01: Identification Credentials</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="email" 
                      placeholder="Valid Email Endpoint" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#69C9D0]"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="password" 
                      placeholder="Secure Pass-phrase" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#69C9D0]"
                    />
                  </div>
                  <button 
                    onClick={nextStep}
                    disabled={!email || password.length < 6}
                    className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2 group disabled:opacity-30"
                  >
                    Establish Forward <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 text-center">
                  <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mb-6 px-4 leading-relaxed">Phase 02: Biological Metadata</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Display Name" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white text-sm text-center focus:outline-none focus:border-[#EE1D52]"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={prevStep} className="p-4 bg-white/5 rounded-xl text-white opacity-40">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextStep}
                      disabled={!fullName}
                      className="flex-1 py-4 bg-[#EE1D52] text-white font-black uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-30"
                    >
                      Continue Link
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 text-center">
                  <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mb-6 px-4 leading-relaxed">Phase 03: Handle Allocation</p>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-bold">@</span>
                    <input 
                      type="text" 
                      placeholder="Unique Node Handle" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-6 text-white text-sm focus:outline-none focus:border-[#69C9D0]"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={prevStep} className="p-4 bg-white/5 rounded-xl text-white opacity-40">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextStep}
                      disabled={!username}
                      className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-black text-base uppercase tracking-widest">Avatar Selection</h3>
                    <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">Visual node representation</p>
                  </div>

                  <div className="relative">
                    <label className="cursor-pointer group block">
                      <motion.div 
                        key={avatarUrl}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#69C9D0] to-[#EE1D52] rounded-3xl blur-[10px] opacity-30 animate-pulse" />
                        <img 
                          src={avatarUrl} 
                          className="relative w-36 h-36 rounded-3xl border-4 border-white/10 bg-zinc-900 object-cover shadow-2xl" 
                          alt="" 
                        />
                      </motion.div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAvatarUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button 
                      onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`)}
                      className="absolute -bottom-2 -right-2 z-20 p-3 bg-zinc-900 text-white rounded-2xl border border-white/10 shadow-lg active:scale-90 transition-transform"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="w-full space-y-3 mt-4">
                    <button 
                      onClick={handleSignup}
                      disabled={loading}
                      className="w-full py-4 bg-[#EE1D52] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                      {loading ? 'Finalizing...' : 'Initialize Node'}
                    </button>
                    <button 
                      onClick={prevStep}
                      className="w-full py-2 text-white/20 text-[9px] font-bold uppercase tracking-[0.3em] hover:text-white/40"
                    >
                      Abort Phase
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center">
                 <button 
                  onClick={() => { setIsLogin(true); setStep(1); setError(null); }}
                  className="text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Already registered? Access Node
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8 text-center text-white/5 text-[9px] uppercase tracking-[0.4em] font-black">
          Secured by IndianReels Cloud v1.0
        </div>
      </div>
    </div>
  );
}
