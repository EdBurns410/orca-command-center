
import React, { useState } from 'react';
import { X, Rocket, Globe, Link, CloudLightning } from 'lucide-react';
import { AppProject } from '../types';

interface ShipTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppProject | null;
  onShip: (appId: string, url: string) => void;
}

export const ShipTerminal: React.FC<ShipTerminalProps> = ({ isOpen, onClose, app, onShip }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !app) return null;

  const handleDeploy = () => {
    if (!url) return;
    setLoading(true);
    // Simulate check
    setTimeout(() => {
        onShip(app.id, url);
        setLoading(false);
        setUrl('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-slate-900 border border-green-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.2)] overflow-hidden">
            <div className="bg-gradient-to-r from-green-900/20 to-slate-900 p-6 border-b border-slate-800 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded border border-green-500/30 text-green-400">
                        <Rocket size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">DEPLOYMENT TERMINAL</h2>
                        <p className="text-xs text-green-500 font-mono uppercase">Connect Live Instance</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-slate-950 p-4 rounded border border-slate-800">
                    <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Target App</span>
                    <span className="text-lg text-white font-bold">{app.name}</span>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <CloudLightning size={14} className="text-cyan-400" /> Google Cloud Run URL
                    </label>
                    <input 
                        type="url" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://app-name-xyz.a.run.app"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-green-400 font-mono text-sm focus:border-green-500 outline-none shadow-inner"
                    />
                    <div className="bg-cyan-900/20 border border-cyan-800 p-3 rounded text-xs text-cyan-200 leading-relaxed">
                        <strong>Need a URL?</strong> Complete <u>Module 301: Deploying to Cloud Run</u> in the University to learn how to generate this.
                    </div>
                </div>

                <button 
                    onClick={handleDeploy}
                    disabled={!url || loading}
                    className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        loading 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    }`}
                >
                    {loading ? 'Verifying Handshake...' : 'CONFIRM DEPLOYMENT'}
                </button>
            </div>
        </div>
    </div>
  );
};
