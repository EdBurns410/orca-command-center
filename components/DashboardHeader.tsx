
import React, { useEffect, useState } from 'react';
import { DollarSign, Award, GraduationCap, Users, Eye, Briefcase, Edit2 } from 'lucide-react';
import { PortfolioSettings } from '../types';

interface DashboardHeaderProps {
  totalMRR: number;
  appCount: number;
  reputation: number;
  portfolio: PortfolioSettings;
  viewMode: 'business' | 'public';
  onToggleView: () => void;
  onOpenUniversity: () => void;
  onOpenBranding: () => void;
  onOpenCommunity: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  totalMRR, appCount, reputation, portfolio, viewMode, onToggleView, onOpenUniversity, onOpenBranding, onOpenCommunity 
}) => {
  const [displayMRR, setDisplayMRR] = useState(0);

  // Animate the number counting up
  useEffect(() => {
    let start = displayMRR;
    const end = totalMRR;
    if (start === end) return;

    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const nextValue = Math.floor(start + (end - start) * ease);
      setDisplayMRR(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalMRR]);

  // Calculate Level based on app count and reputation
  const level = Math.floor((appCount * 10 + reputation) / 50) + 1;
  const rank = reputation > 1000 ? "Unicorn" : reputation > 500 ? "Founder" : reputation > 200 ? "Builder" : "Script Kiddie";

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20 gap-4 md:gap-0">
      
      {/* User Profile / Branding */}
      <div 
        className="flex items-center gap-4 w-full md:w-auto justify-start cursor-pointer group p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700 relative" 
        onClick={onOpenBranding}
        title="Open Branding Suite"
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-shadow">
            {portfolio.logoEmoji}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-[10px] font-bold px-1.5 rounded-full border border-slate-900">
            Lvl {level}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              {portfolio.companyName}
              <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-slate-500" />
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
             <Award size={12} className="text-yellow-500" />
             <span>{rank} | Rep: {reputation}</span>
          </div>
        </div>
        
        {/* Tooltip hint */}
        <div className="absolute left-0 -bottom-8 bg-slate-900 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Manage Public Brand
        </div>
      </div>

      {/* View Switcher (Desktop) */}
      <div className="hidden md:flex bg-slate-950 rounded-lg p-1 border border-slate-800">
         <button 
            onClick={() => viewMode === 'public' && onToggleView()}
            className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'business' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
         >
            <Briefcase size={14} /> Ops View
         </button>
         <button 
            onClick={() => viewMode === 'business' && onToggleView()}
            className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'public' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
         >
            <Eye size={14} /> Public View
         </button>
      </div>

      {/* Right Section: Actions & MRR */}
      <div className="flex items-center justify-between w-full md:w-auto md:gap-6">
        <div className="flex gap-2">
             <button 
                onClick={onOpenCommunity}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all group"
                title="Community Hub"
            >
                <Users size={16} className="text-slate-400 group-hover:text-white" />
            </button>
            <button 
                onClick={onOpenUniversity}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all group"
            >
                <GraduationCap size={16} className="text-purple-400 group-hover:text-purple-300" />
                <span className="hidden md:inline text-xs font-bold text-purple-400 group-hover:text-purple-300 tracking-wider">UNIVERSITY</span>
            </button>
        </div>

        <div className="flex flex-col items-end border-l border-slate-800 pl-6 ml-2">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Projected MRR</span>
            <div className="flex items-center gap-2 text-green-400 text-3xl font-mono font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
            <DollarSign size={24} className="animate-pulse-slow" />
            <span>{displayMRR.toLocaleString()}</span>
            </div>
        </div>
      </div>
    </header>
  );
};
