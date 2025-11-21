
import React, { useState } from 'react';
import { X, Terminal } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, isPro: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(username, isPro);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
           <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="text-cyan-400" size={20} />
              <span>Identify Yourself</span>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Codename</label>
             <input 
               type="text" 
               value={username}
               onChange={e => setUsername(e.target.value)}
               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
               placeholder="e.g. Neo, Trinity..."
             />
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enrollment Tier</label>
             <div className="grid grid-cols-2 gap-4">
                <button 
                   type="button"
                   onClick={() => setIsPro(false)}
                   className={`p-4 rounded-xl border text-center transition-all ${!isPro ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                    <div className="font-bold text-sm mb-1">Auditor</div>
                    <div className="text-xs opacity-70">Free Trial</div>
                </button>
                <button 
                   type="button"
                   onClick={() => setIsPro(true)}
                   className={`p-4 rounded-xl border text-center transition-all ${isPro ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                    <div className="font-bold text-sm mb-1">Architect</div>
                    <div className="text-xs opacity-70">$9/mo</div>
                </button>
             </div>
           </div>

           <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50"
           >
              {loading ? 'Establishing Uplink...' : 'Access Dashboard'}
           </button>
           
           <p className="text-center text-xs text-slate-600">
             By entering, you agree to the Vibe Code Manifesto.
           </p>
        </form>
      </div>
    </div>
  );
};
