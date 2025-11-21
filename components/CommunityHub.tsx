
import React from 'react';
import { X, Users, Trophy, MessageSquare, UserPlus } from 'lucide-react';
import { COMMUNITY_LEADERBOARD } from '../constants';
import { UserProfile } from '../types';

interface CommunityHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ isOpen, onClose, currentUser }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20 text-purple-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">The Syndicate</h2>
                        <p className="text-xs text-purple-500 font-mono uppercase">Global Leaderboard & Network</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Leaderboard */}
                <div className="flex-1 p-6 overflow-y-auto border-r border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-500" /> Top Architects
                    </h3>
                    
                    <div className="space-y-3">
                        {COMMUNITY_LEADERBOARD.map((user, index) => (
                            <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-purple-500/30 transition-colors group">
                                <div className="font-mono text-slate-500 font-bold w-6">#{index + 1}</div>
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700">
                                    {user.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold">{user.username}</span>
                                        {user.isOnline && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" title="Online" />}
                                    </div>
                                    <div className="text-xs text-slate-500">{user.title} • {user.shippedApps} Apps Shipped</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-purple-400 font-bold">{user.reputation} REP</div>
                                </div>
                                <button className="p-2 rounded-full bg-slate-900 text-slate-500 hover:text-white hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all">
                                    <UserPlus size={16} />
                                </button>
                            </div>
                        ))}
                        
                        {/* Current User Rank (Mock) */}
                         <div className="mt-8 pt-6 border-t border-slate-800">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                <div className="font-mono text-cyan-500 font-bold w-6">#99</div>
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xl border border-cyan-500">
                                    😎
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-bold">{currentUser.username} (You)</div>
                                    <div className="text-xs text-cyan-300">Rank Pending... Ship more apps!</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-cyan-400 font-bold">{currentUser.reputation} REP</div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="w-full md:w-1/3 bg-slate-950 p-6 overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <MessageSquare size={16} /> Live Wire
                    </h3>
                    
                    <div className="space-y-6">
                        <ActivityItem 
                            user="SaaS_Queen" 
                            action="deployed" 
                            target="InvoiceGenius" 
                            time="2m ago" 
                            color="text-green-400"
                        />
                         <ActivityItem 
                            user="0xBuilder" 
                            action="earned badge" 
                            target="Cloud Native" 
                            time="5m ago" 
                            color="text-yellow-400"
                        />
                         <ActivityItem 
                            user="Newbie_One" 
                            action="joined" 
                            target="The University" 
                            time="12m ago" 
                            color="text-purple-400"
                        />
                        <ActivityItem 
                            user="AlgoRithm" 
                            action="hit $1k MRR" 
                            target="PredictorBot" 
                            time="45m ago" 
                            color="text-cyan-400"
                        />
                    </div>

                    <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
                        <p className="text-slate-400 text-xs mb-3">Invite friends to earn 500 REP</p>
                        <button className="w-full py-2 bg-white text-slate-950 font-bold rounded text-xs hover:bg-cyan-400 transition-colors">
                            COPY INVITE LINK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const ActivityItem = ({ user, action, target, time, color }: any) => (
    <div className="flex gap-3">
        <div className="w-1 h-full bg-slate-800 rounded-full relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-600 rounded-full" />
        </div>
        <div className="pb-4">
            <p className="text-sm text-slate-300">
                <span className="font-bold text-white">{user}</span> {action} <span className={`font-bold ${color}`}>{target}</span>
            </p>
            <span className="text-[10px] text-slate-600 font-mono">{time}</span>
        </div>
    </div>
);
