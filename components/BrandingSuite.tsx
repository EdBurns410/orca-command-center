
import React, { useState } from 'react';
import { X, User, Palette, Globe, Eye, EyeOff, Save, Tag, Grid, Briefcase, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { PortfolioSettings, AppProject, AppCategory } from '../types';

interface BrandingSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PortfolioSettings;
  apps: AppProject[];
  onSaveSettings: (newSettings: PortfolioSettings) => void;
  onToggleVisibility: (appId: string) => void;
  onUpdateAppCategory: (appId: string, category: AppCategory) => void;
}

export const BrandingSuite: React.FC<BrandingSuiteProps> = ({ 
  isOpen, onClose, settings, apps, onSaveSettings, onToggleVisibility, onUpdateAppCategory
}) => {
  const [form, setForm] = useState<PortfolioSettings>(settings);
  const [activeTab, setActiveTab] = useState<'identity' | 'portfolio' | 'socials'>('identity');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(form);
    onClose();
  };

  const categories = Object.values(AppCategory);

  const updateSocial = (key: keyof NonNullable<PortfolioSettings['socials']>, value: string) => {
      setForm(prev => ({
          ...prev,
          socials: {
              ...prev.socials,
              [key]: value
          }
      }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
        <div className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar / Preview */}
            <div className="w-full md:w-1/3 bg-slate-950 border-r border-slate-800 p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
                
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Live Profile Preview</h3>

                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex-1 flex flex-col items-center text-center shadow-2xl relative">
                     {/* Umbrella Brand Image Simulation */}
                     <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent rounded-t-xl h-32 pointer-events-none" />
                     
                     <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-purple-500 flex items-center justify-center text-5xl mb-4 shadow-[0_0_30px_rgba(168,85,247,0.3)] relative z-10">
                        {form.logoEmoji}
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-1 tracking-tight relative z-10">{form.companyName}</h2>
                     <div className="flex items-center gap-2 mb-4 relative z-10">
                        <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">VERIFIED ARCHITECT</span>
                        <span className="text-slate-500 text-xs">@{form.founderName}</span>
                     </div>
                     
                     <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-4 border-t border-b border-slate-800 py-4 w-full">
                        {form.bio}
                     </p>
                     
                     <div className="w-full space-y-3">
                        <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                             <div className="flex flex-col items-start">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Portfolio</span>
                                <span className="text-white font-bold">{apps.filter(a => a.isPublic).length} Public Apps</span>
                             </div>
                             <Globe size={16} className="text-cyan-500" />
                        </div>
                     </div>

                     <div className="mt-auto pt-6 flex gap-3 justify-center w-full border-t border-slate-800/50">
                        {form.socials?.twitter && <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400"><Twitter size={14}/></div>}
                        {form.socials?.github && <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400"><Github size={14}/></div>}
                        {form.socials?.website && <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400"><Globe size={14}/></div>}
                     </div>
                </div>
            </div>

            {/* Main Management Area */}
            <div className="flex-1 flex flex-col bg-slate-900">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase size={20} className="text-cyan-400" />
                            Command Center
                        </h2>
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button 
                                onClick={() => setActiveTab('identity')}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'identity' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Identity
                            </button>
                            <button 
                                onClick={() => setActiveTab('socials')}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'socials' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Socials
                            </button>
                            <button 
                                onClick={() => setActiveTab('portfolio')}
                                className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'portfolio' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Portfolio
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-900">
                    
                    {activeTab === 'identity' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                                    <User size={16} /> Brand Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 font-bold">Umbrella Company Name</label>
                                        <input 
                                            type="text" 
                                            value={form.companyName}
                                            onChange={e => setForm({...form, companyName: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 font-bold">Founder Alias</label>
                                        <input 
                                            type="text" 
                                            value={form.founderName}
                                            onChange={e => setForm({...form, founderName: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 font-bold">Logo Emoji</label>
                                        <input 
                                            type="text" 
                                            value={form.logoEmoji}
                                            onChange={e => setForm({...form, logoEmoji: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-2xl text-center text-white focus:border-cyan-500 outline-none transition-colors"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500 font-bold">Mission Statement / Bio</label>
                                        <textarea 
                                            value={form.bio}
                                            onChange={e => setForm({...form, bio: e.target.value})}
                                            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none resize-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'socials' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                                <Globe size={16} /> Public Connectors
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold flex items-center gap-2"><Twitter size={12}/> Twitter / X URL</label>
                                    <input 
                                        type="text" 
                                        value={form.socials?.twitter || ''}
                                        onChange={e => updateSocial('twitter', e.target.value)}
                                        placeholder="https://x.com/username"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold flex items-center gap-2"><Github size={12}/> GitHub URL</label>
                                    <input 
                                        type="text" 
                                        value={form.socials?.github || ''}
                                        onChange={e => updateSocial('github', e.target.value)}
                                        placeholder="https://github.com/username"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold flex items-center gap-2"><Linkedin size={12}/> LinkedIn URL</label>
                                    <input 
                                        type="text" 
                                        value={form.socials?.linkedin || ''}
                                        onChange={e => updateSocial('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold flex items-center gap-2"><Globe size={12}/> Personal Website</label>
                                    <input 
                                        type="text" 
                                        value={form.socials?.website || ''}
                                        onChange={e => updateSocial('website', e.target.value)}
                                        placeholder="https://mywebsite.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 col-span-full">
                                    <label className="text-xs text-slate-500 font-bold flex items-center gap-2"><Mail size={12}/> Public Email (for 'Hire Me')</label>
                                    <input 
                                        type="email" 
                                        value={form.socials?.email || ''}
                                        onChange={e => updateSocial('email', e.target.value)}
                                        placeholder="contact@domain.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Grid size={16} /> Public Portfolio Management
                                </h3>
                                <span className="text-xs text-slate-500">{apps.length} Total Apps</span>
                            </div>

                            <div className="grid gap-4">
                                {apps.length === 0 && <p className="text-slate-500 text-center py-10 italic">No apps to manage yet. Go build something!</p>}
                                
                                {apps.map(app => (
                                    <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-600 transition-all gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-3 h-3 rounded-full shrink-0 ${app.status === 'Live' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-600'}`} />
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{app.name}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">{app.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            {/* Category Tagging */}
                                            <div className="relative group w-40">
                                                <select 
                                                    value={app.category}
                                                    onChange={(e) => onUpdateAppCategory(app.id, e.target.value as AppCategory)}
                                                    className="w-full appearance-none bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:border-purple-500 outline-none cursor-pointer hover:bg-slate-800"
                                                >
                                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <Tag size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                            </div>

                                            {/* Visibility Toggle */}
                                            <button 
                                                onClick={() => onToggleVisibility(app.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 md:flex-none justify-center ${
                                                    app.isPublic 
                                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20' 
                                                    : 'bg-slate-900 text-slate-500 border border-slate-700 hover:border-slate-500 hover:text-slate-300'
                                                }`}
                                            >
                                                {app.isPublic ? <><Eye size={14} /> PUBLIC</> : <><EyeOff size={14} /> HIDDEN</>}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20"
                    >
                        <Save size={18} />
                        SAVE CONFIGURATION
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
