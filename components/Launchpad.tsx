
import React, { useState } from 'react';
import { X, Sparkles, Loader2, BrainCircuit, Target, Lightbulb } from 'lucide-react';
import { generateAppConcept, generateReverseEngineeredApp } from '../services/geminiService';
import { GeneratedAppConcept } from '../types';

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (concept: GeneratedAppConcept) => void;
}

type Mode = 'draft' | 'reverse';

export const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose, onDeploy }) => {
  const [mode, setMode] = useState<Mode>('draft');
  const [prompt, setPrompt] = useState('');
  const [sector, setSector] = useState('SaaS');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let concept;
      if (mode === 'draft') {
          if (!prompt.trim()) return;
          concept = await generateAppConcept(prompt);
      } else {
          concept = await generateReverseEngineeredApp(sector);
      }
      onDeploy(concept);
      setPrompt('');
    } catch (e) {
      console.error(e);
      alert("Failed to generate app. Check console/API Key.");
    } finally {
      setLoading(false);
    }
  };

  const sectors = ["Finance Data", "Real Estate", "Content Creation", "E-commerce", "Legal Tech", "Healthcare", "Developer Tools", "Marketing"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-6 border-b border-slate-800 relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
               <BrainCircuit size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Idea Architect</h2>
                <p className="text-slate-400 text-xs font-mono uppercase">AI-Powered Concept Generation</p>
             </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="p-2 bg-slate-950 border-b border-slate-800 flex">
            <button 
                onClick={() => setMode('draft')}
                className={`flex-1 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'draft' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Lightbulb size={14} /> Quick Draft
            </button>
            <button 
                onClick={() => setMode('reverse')}
                className={`flex-1 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'reverse' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Target size={14} /> Reverse Engineer
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {mode === 'draft' ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  The Vision
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Uber for dogs, Tinder for developers, AI toaster..."
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none font-mono text-sm mb-2"
                />
                <p className="text-xs text-slate-500">Describe your vague idea. Gemini will structure it into a blueprint.</p>
              </div>
          ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                 <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                    <h4 className="text-cyan-400 font-bold text-sm mb-1 flex items-center gap-2"><Target size={14}/> Value-First Engineering</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Select a sector. The AI will identify a high-value pain point and generate a <strong>complete 5-lesson curriculum</strong> detailing exactly how to build, monetize, and deploy the solution.
                    </p>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Target Sector
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {sectors.map(s => (
                            <button 
                                key={s}
                                onClick={() => setSector(s)}
                                className={`p-2 rounded border text-xs font-bold transition-all text-left ${
                                    sector === s 
                                    ? 'bg-cyan-500 text-slate-900 border-cyan-400' 
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || (mode === 'draft' && !prompt)}
            className={`w-full py-4 rounded-xl font-bold text-slate-950 flex items-center justify-center gap-2 transition-all ${
              loading 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{mode === 'reverse' ? 'DESIGNING CURRICULUM...' : 'DRAFTING BLUEPRINT...'}</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>{mode === 'reverse' ? 'REVERSE ENGINEER IDEA' : 'GENERATE BLUEPRINT'}</span>
              </>
            )}
          </button>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>MODEL: GEMINI-2.5-FLASH</span>
          <span>OUTPUT: {mode === 'reverse' ? 'BLUEPRINT + 5 MODULES' : 'BLUEPRINT'}</span>
        </div>
      </div>
    </div>
  );
};
