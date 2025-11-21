
import React from 'react';
import { AppProject, AppCategory } from '../types';
import { Gamepad2, Briefcase, Hammer, TrendingUp, Activity, Rocket, ExternalLink, Eye, EyeOff, Trash2, Pencil, Bot, Database, Zap, PenTool, Map } from 'lucide-react';

interface AppCardProps {
  app: AppProject;
  onViewBlueprint: (app: AppProject) => void;
  onShipApp: (app: AppProject) => void;
  onDeleteApp: (appId: string) => void;
  onEditApp: (app: AppProject) => void;
  onToggleVisibility: (appId: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onViewBlueprint, onShipApp, onDeleteApp, onEditApp, onToggleVisibility }) => {
  const getIcon = (cat: AppCategory) => {
    switch (cat) {
      case AppCategory.GAME: return <Gamepad2 size={24} />;
      case AppCategory.SAAS: return <Briefcase size={24} />;
      case AppCategory.TOOL: return <Hammer size={24} />;
      case AppCategory.FINANCE: return <TrendingUp size={24} />;
      case AppCategory.AI_TOOL: return <Bot size={24} />;
      case AppCategory.DATA_TOOL: return <Database size={24} />;
      case AppCategory.AUTOMATION: return <Zap size={24} />;
      case AppCategory.CONTENT_GEN: return <PenTool size={24} />;
      default: return <Activity size={24} />;
    }
  };

  const getColor = (cat: AppCategory) => {
    switch (cat) {
      case AppCategory.GAME: return 'text-purple-400 border-purple-500/30 group-hover:border-purple-500/60 bg-purple-500/5';
      case AppCategory.SAAS: return 'text-blue-400 border-blue-500/30 group-hover:border-blue-500/60 bg-blue-500/5';
      case AppCategory.TOOL: return 'text-orange-400 border-orange-500/30 group-hover:border-orange-500/60 bg-orange-500/5';
      case AppCategory.FINANCE: return 'text-green-400 border-green-500/30 group-hover:border-green-500/60 bg-green-500/5';
      case AppCategory.AI_TOOL: return 'text-cyan-400 border-cyan-500/30 group-hover:border-cyan-500/60 bg-cyan-500/5';
      default: return 'text-slate-400 border-slate-700 group-hover:border-slate-500 bg-slate-800/30';
    }
  };

  const themeClass = getColor(app.category);

  return (
    <div className={`group relative p-5 rounded-xl border bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full ${themeClass.replace('text-', 'shadow-').replace('400', '500/10')} ${themeClass}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-slate-950 border border-slate-800 ${themeClass.split(' ')[0]}`}>
          {getIcon(app.category)}
        </div>
        <div className="flex items-center gap-1">
             {/* Visibility Toggle (Quick Access) */}
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(app.id); }}
                className={`p-1.5 rounded transition-colors ${app.isPublic ? 'text-cyan-400 hover:bg-cyan-900/30' : 'text-slate-600 hover:text-white hover:bg-slate-800'}`}
                title={app.isPublic ? "Publicly Visible" : "Hidden from Profile"}
            >
                {app.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>

             {/* Edit Action */}
             <button 
                onClick={(e) => { e.stopPropagation(); onEditApp(app); }}
                className="p-1.5 rounded text-slate-600 hover:text-white hover:bg-slate-900/50 transition-colors"
                title="Edit App Details"
            >
                <Pencil size={14} />
            </button>
             {/* Delete Action */}
            <button 
                onClick={(e) => { e.stopPropagation(); onDeleteApp(app.id); }}
                className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-slate-900/50 transition-colors"
                title="Delete App"
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
             <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors truncate">{app.name}</h3>
             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                app.status === 'Live' ? 'text-green-400 border-green-900 bg-green-900/20' : 
                app.status === 'Beta' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/20' : 
                app.status === 'Concept' ? 'text-cyan-400 border-cyan-900 bg-cyan-900/20' : 
                'text-slate-400 border-slate-800 bg-slate-800'
             }`}>
                {app.status}
             </span>
        </div>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 h-10 leading-tight">{app.description}</p>
      </div>

      {/* Actions */}
      <div className="space-y-2 mb-4">
        {app.status !== 'Live' ? (
             <button 
             onClick={() => onShipApp(app)}
             className="w-full py-2 rounded bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 hover:border-green-500/60 text-green-400 hover:text-green-300 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:bg-green-500/30"
           >
             <Rocket size={12} /> SHIP TO PROD
           </button>
        ) : (
            <a 
                href={app.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
                <ExternalLink size={12} /> OPEN APP
            </a>
        )}
        
        {app.blueprint && (
            <button 
                onClick={() => onViewBlueprint(app)}
                className="w-full py-2 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-center gap-2 group-hover:bg-slate-900"
            >
                <Map size={12} /> VIEW BLUEPRINT
            </button>
        )}
      </div>

      {/* Footer Data */}
      <div className="flex justify-between items-end pt-4 border-t border-slate-800/50 mt-auto">
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Category</span>
            <span className="text-xs text-slate-300 font-mono truncate max-w-[100px]">{app.category}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold">
                {app.status === 'Live' ? 'Actual MRR' : 'Potential MRR'}
            </span>
            <span className={`text-sm font-mono font-bold ${app.status === 'Live' ? 'text-white' : 'text-slate-500'}`}>
                ${app.status === 'Live' ? app.mrr.toLocaleString() : app.potentialMrr?.toLocaleString() || 0}
            </span>
        </div>
      </div>

      {/* Glow Effect Element */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
    </div>
  );
};
