import React from 'react';
import { X, Circle, BookOpen, Globe, Server, DollarSign, Rocket, GraduationCap } from 'lucide-react';

interface MasterplanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterplanModal: React.FC<MasterplanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 md:p-10">
        <div className="w-full max-w-5xl h-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <BookOpen className="text-purple-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 tracking-widest">ORCA PROTOCOL</h2>
                        <p className="text-xs text-slate-500 font-mono uppercase">Master Strategic Roadmap // VibeCode Studios</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-transparent hover:border-slate-700">
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-slate-900/50">
                {/* Introduction */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2 text-sm tracking-widest">
                            <Rocket size={16} /> MISSION OBJECTIVE
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                            Build a high-fidelity AI App Development Studio & University. 
                            Three revenue channels: 
                            <span className="text-white font-bold"> Portfolio Apps</span>, 
                            <span className="text-white font-bold"> ORCA University</span>, 
                            <span className="text-white font-bold"> Consultancy</span>.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Part 1 */}
                        <Section title="PART 1 • BUSINESS FOUNDATION" icon={<Globe size={18} />}>
                           <Task title="Task 1: Finalise Brand Identity" desc="Logo, Palette, Tagline, SEO Positioning." />
                           <Task title="Task 2: Build Umbrella Website" desc="Home, Portfolio, Tools, University, Blog, Login." />
                        </Section>

                        {/* Part 2 */}
                        <Section title="PART 2 • TECH INFRASTRUCTURE" icon={<Server size={18} />}>
                           <Task title="Task 3: Firebase Setup" desc="Hosting, Auth, Custom Domain." />
                           <Task title="Task 4: Auth Middleware" desc="Connect Cloud Run to Firebase Auth." />
                           <Task title="Task 5: Stripe Subscriptions" desc="Free/Pro tiers, Webhooks, Invoices." />
                           <Task title="Task 6: User Dashboards" desc="App directory, billing, course progress." />
                        </Section>

                        {/* Part 3 */}
                        <Section title="PART 3 • SAAS CONVERSION" icon={<DollarSign size={18} />}>
                           <Task title="Task 7: Standardise Repos" desc="Boilerplate for Landing Page + API + Auth + Stripe." />
                           <Task title="Task 8: Launch First 3 Apps" desc="Productivity Tool, Biz Automation, Personal Tool." />
                        </Section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                         {/* Part 4 */}
                        <Section title="PART 4 • ORCA UNIVERSITY" icon={<GraduationCap size={18} />}>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    "Intro to Vibe Coding", "Build First AI App", "Deploy Cloud Run", 
                                    "Add Authentication", "Add Monetisation", "Micro-SaaS Engine",
                                    "Launch Your App", "Grow Portfolio", "Personal AI Empire"
                                ].map((m, i) => (
                                    <Module key={i} num={i + 1} title={m} />
                                ))}
                            </div>
                           <div className="space-y-3">
                               <Task title="Task 9: Course Landing Page" desc="High-converting copy, curriculum breakdown." />
                               <Task title="Task 10: Platform Build" desc="Firebase/Stripe custom build or Teachable." />
                               <Task title="Task 11: AI Podcasts" desc="Audio learning for each module." />
                           </div>
                        </Section>

                        {/* Part 5 */}
                        <Section title="PART 5 • DEPLOYMENT" icon={<Rocket size={18} />}>
                           <Task title="Task 13: Public Launch" desc="TikTok, LinkedIn, YouTube, ProductHunt." />
                           <Task title="Task 14-17" desc="Publish Apps, Publish University, Affiliate Links, Community." />
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Helper Components
const Section = ({ title, icon, children }: any) => (
    <div className="group">
        <div className="flex items-center gap-3 text-purple-400 border-b border-slate-800 pb-3 mb-4">
            <div className="p-1.5 bg-slate-950 rounded border border-slate-800 group-hover:border-purple-500/50 transition-colors">
                {icon}
            </div>
            <h4 className="font-bold tracking-wider text-sm">{title}</h4>
        </div>
        <div className="space-y-4 pl-2">
            {children}
        </div>
    </div>
);

const Task = ({ title, desc }: any) => (
    <div className="flex items-start gap-3">
        <div className="mt-1.5 text-slate-700">
            <Circle size={10} fill="currentColor" />
        </div>
        <div>
            <h5 className="text-slate-300 font-mono text-xs font-bold uppercase mb-0.5">{title}</h5>
            <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

const Module = ({ num, title }: any) => (
    <div className="bg-slate-950 border border-slate-800 p-2 rounded hover:border-cyan-500/30 transition-colors">
        <span className="text-[10px] text-slate-600 font-bold block">MOD {num}</span>
        <span className="text-xs text-slate-400 font-medium line-clamp-1">{title}</span>
    </div>
);
