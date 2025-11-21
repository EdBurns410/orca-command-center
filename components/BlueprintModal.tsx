
import React from 'react';
import { AppProject } from '../types';
import { X, Cpu, DollarSign, GraduationCap, Layers, ListChecks } from 'lucide-react';

interface BlueprintModalProps {
  app: AppProject | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToClass: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ app, isOpen, onClose, onGoToClass }) => {
  if (!isOpen || !app || !app.blueprint) return null;

  const handleGoClass = () => {
      onClose();
      onGoToClass();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">
                        Architecture Blueprint
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">VibeCode University</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{app.name}</h2>
                <p className="text-slate-400 text-sm font-mono mt-1">{app.description}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Blueprint Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-slate-900/50">
            
            {/* Tech Stack */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers size={64} />
                </div>
                <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Cpu size={16} /> Recommended Stack
                </h3>
                <p className="text-slate-200 font-mono text-lg">{app.blueprint.techStack}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MVP Features */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-purple-500/50 transition-colors">
                    <h3 className="text-purple-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ListChecks size={16} /> MVP Core Features
                    </h3>
                    <ul className="space-y-3">
                        {app.blueprint.coreFeatures.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Monetization */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-green-500/50 transition-colors flex flex-col">
                    <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <DollarSign size={16} /> Revenue Model
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1">
                        {app.blueprint.monetizationStrategy}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-700/50">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Projected Potential</span>
                        <span className="text-2xl font-mono font-bold text-white">${app.potentialMrr.toLocaleString()}/mo</span>
                    </div>
                </div>
            </div>

            {/* University Link */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-yellow-400">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Recommended Course Module</span>
                    <h4 className="text-white font-bold text-lg">{app.blueprint.uniModuleRef}</h4>
                </div>
                <button 
                    onClick={handleGoClass}
                    className="ml-auto px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                    GO TO CLASS
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
