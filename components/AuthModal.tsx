
import React, { useState } from 'react';
import { X, Terminal, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { AuthService } from '../services/platformServices';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, isPro: boolean) => void; // Keep prop for compatibility, but logic moves to App
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.login(email, password);
        onClose();
      } else if (mode === 'signup') {
        await AuthService.register(email, password);
        onClose();
      } else if (mode === 'forgot') {
        await AuthService.sendPasswordReset(email);
        setSuccessMsg('Password reset email sent. Check your inbox.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await AuthService.loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
           <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="text-cyan-400" size={20} />
              <span>{mode === 'login' ? 'System Access' : mode === 'signup' ? 'New Recruit' : 'Reset Credentials'}</span>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-8 flex-1">
            {/* Tabs */}
            {mode !== 'forgot' && (
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 mb-6">
                    <button 
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === 'login' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        LOGIN
                    </button>
                    <button 
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === 'signup' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        SIGN UP
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{error}</div>}
               {successMsg && <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400">{successMsg}</div>}

               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                 <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-3 text-white focus:border-cyan-500 outline-none transition-colors"
                        placeholder="architect@vibecode.dev"
                        required
                    />
                 </div>
               </div>

               {mode !== 'forgot' && (
                   <div className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                        {mode === 'login' && (
                            <button type="button" onClick={() => setMode('forgot')} className="text-xs text-cyan-500 hover:text-cyan-400">Forgot?</button>
                        )}
                     </div>
                     <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-3 text-white focus:border-cyan-500 outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                     </div>
                   </div>
               )}

               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                  {loading ? 'Processing...' : mode === 'login' ? 'Establish Uplink' : mode === 'signup' ? 'Initialize Account' : 'Send Reset Link'}
                  {!loading && <ArrowRight size={16} />}
               </button>
            </form>

            {mode !== 'forgot' && (
                <>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
                    </div>

                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Globe size={16} />
                        Google
                    </button>
                </>
            )}
            
            {mode === 'forgot' && (
                <button onClick={() => setMode('login')} className="w-full mt-4 text-xs text-slate-500 hover:text-white">
                    Back to Login
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
