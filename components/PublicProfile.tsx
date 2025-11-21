
import React from 'react';
import { PortfolioSettings, AppProject, UserProfile } from '../types';
import { Globe, Twitter, Github, Award, ExternalLink, Briefcase, Calendar, Linkedin } from 'lucide-react';

interface PublicProfileProps {
  user: UserProfile;
  portfolio: PortfolioSettings;
  apps: AppProject[];
}

export const PublicProfile: React.FC<PublicProfileProps> = ({ user, portfolio, apps }) => {
  const publicApps = apps.filter(app => app.isPublic);
  const totalRevenue = publicApps.reduce((sum, app) => sum + (app.status === 'Live' ? app.mrr : 0), 0);

  const handleHireClick = () => {
    if (portfolio.socials?.email) {
        window.location.href = `mailto:${portfolio.socials.email}?subject=Inquiry from Orca Profile`;
    } else {
        alert("This architect hasn't made their email public yet.");
    }
  };

  const SocialButton = ({ href, icon }: { href?: string, icon: React.ReactNode }) => {
      if (!href) return null;
      return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 transition-all"
        >
            {icon}
        </a>
      );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-y-auto">
      {/* Profile Header */}
      <div className="relative h-64 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-slate-950 border-4 border-slate-900 shadow-2xl flex items-center justify-center text-6xl relative z-10">
                {portfolio.logoEmoji}
            </div>
            <div className="mt-4 text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">{portfolio.companyName}</h1>
                <p className="text-slate-400 font-mono text-sm">@{portfolio.founderName}</p>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        
        {/* Bio / Stats */}
        <div className="text-center mb-12">
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed italic">"{portfolio.bio}"</p>
            
            <div className="flex justify-center gap-8 mt-8">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{user.reputation}</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Reputation</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-cyan-400">{publicApps.length}</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Shipped Apps</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Monthly Revenue</span>
                </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
                <button 
                    onClick={handleHireClick}
                    className="px-6 py-2 bg-white text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-colors flex items-center gap-2"
                >
                    <Briefcase size={16} /> Hire Me
                </button>
                
                <SocialButton href={portfolio.socials?.twitter} icon={<Twitter size={20} />} />
                <SocialButton href={portfolio.socials?.github} icon={<Github size={20} />} />
                <SocialButton href={portfolio.socials?.linkedin} icon={<Linkedin size={20} />} />
                <SocialButton href={portfolio.socials?.website} icon={<Globe size={20} />} />
            </div>
        </div>

        {/* Portfolio Grid */}
        <div className="space-y-8">
            <h2 className="text-center text-sm font-bold text-slate-500 uppercase tracking-[0.3em]">Public Portfolio</h2>
            
            {publicApps.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <p className="text-slate-500">This developer hasn't published any apps yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publicApps.map(app => (
                        <div key={app.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
                            <div className="absolute top-4 right-4 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase">
                                {app.category}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                            <p className="text-slate-400 text-sm mb-6 h-10 line-clamp-2">{app.description}</p>
                            
                            {app.url && (
                                <a 
                                    href={app.url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-slate-950 border border-slate-800 text-slate-300 font-bold rounded-lg flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-500 transition-all"
                                >
                                    Launch App <ExternalLink size={16} />
                                </a>
                            )}

                            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    Shipped {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                                {app.status === 'Live' && (
                                    <div className="flex items-center gap-1 text-green-500">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Live
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-slate-900 text-center">
            <div className="inline-flex items-center gap-2 text-slate-600 font-mono text-xs">
                <Award size={12} /> Verified VibeCode Architect
            </div>
        </div>
      </div>
    </div>
  );
};
