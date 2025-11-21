
import React from 'react';
import { ArrowRight, CheckCircle, Terminal, DollarSign, Layout, Users } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-y-auto">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
          <Terminal className="text-cyan-400" />
          ORCA<span className="text-slate-600">protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Login
          </button>
          <button 
            onClick={onLogin}
            className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-full text-sm hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          THE VIBE CODE UNIVERSITY IS OPEN
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 max-w-5xl mx-auto leading-tight">
          Build AI Apps. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Earn Revenue. Get Hired.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          The only platform that guides you from "Hello World" to a money-making portfolio. 
          Follow our personalized AI blueprints to ship real apps, track your revenue, 
          and build an undeniable reputation that gets you hired by top tech companies.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={onLogin}
            className="px-8 py-4 bg-white text-slate-950 font-bold rounded-xl text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
          >
            Start Building Now <ArrowRight size={18} />
          </button>
          <div className="text-slate-500 text-sm font-mono flex items-center gap-2">
             <CheckCircle size={14} className="text-green-500" /> 100% Project Based Learning
          </div>
        </div>
      </header>

      {/* Value Prop Grid */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Layout className="text-purple-400" size={32} />}
            title="Build Your App Portfolio"
            desc="Don't just watch tutorials. Use our reverse-engineering tools to identify real market needs, generate AI blueprints, and ship functional apps that solve actual problems."
          />
          <FeatureCard 
            icon={<DollarSign className="text-cyan-400" size={32} />}
            title="Money Making Machines"
            desc="Turn code into cash. We teach you how to integrate Stripe, gate features, and structure your app as a Micro-SaaS to generate monthly recurring revenue."
          />
          <FeatureCard 
            icon={<Users className="text-green-400" size={32} />}
            title="Build Reputation & Get Hired"
            desc="Your Public Profile acts as a verified resume. Recruiters can see your shipped apps, your revenue, and your code quality. Stop sending PDF resumes."
          />
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The ORCA Protocol</h2>
          <p className="text-slate-400">How we turn Junior Devs into High-Paid Architects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <Step number="01" title="Reverse Engineer" desc="Select a sector. Our AI identifies pain points and generates a full app blueprint + custom course for you." />
            <Step number="02" title="Learn & Build" desc="Follow the step-by-step curriculum to build your app using React, Cloud Run, and Gemini." />
            <Step number="03" title="Ship & Earn" desc="Deploy to the cloud, turn on payments, and start generating revenue." />
            <Step number="04" title="Get Hired" desc="Your Public Profile updates automatically. Recruiters see your verified skills and reputation." />
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">Auditor</h3>
            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle size={16} className="text-slate-600" /> Access to AI Command Center</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle size={16} className="text-slate-600" /> 3 Foundation Modules</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle size={16} className="text-slate-600" /> Build up to 2 Apps</li>
            </ul>
            <button onClick={onLogin} className="w-full py-3 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors">
              Start Free Trial
            </button>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/80 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
             <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-bl-xl">CAREER ACCELERATOR</div>
            <h3 className="text-xl font-bold text-white mb-2">Architect</h3>
            <div className="text-4xl font-bold text-white mb-6">$9<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white"><CheckCircle size={16} className="text-cyan-400" /> <strong>Verified Public Profile</strong> (For Recruiters)</li>
              <li className="flex items-center gap-3 text-white"><CheckCircle size={16} className="text-cyan-400" /> Advanced Cloud & Monetization Courses</li>
              <li className="flex items-center gap-3 text-white"><CheckCircle size={16} className="text-cyan-400" /> Unlimited App Portfolio</li>
              <li className="flex items-center gap-3 text-white"><CheckCircle size={16} className="text-cyan-400" /> AI Blueprint Generator</li>
            </ul>
            <button onClick={onLogin} className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors">
              Join the University
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-600 text-sm">
        © 2024 Vibe Code University. Built for the Builders.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors h-full flex flex-col">
    <div className="mb-4 p-3 bg-slate-900 w-fit rounded-xl border border-slate-800">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm flex-1">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }: any) => (
    <div className="p-4">
        <div className="text-4xl font-bold text-slate-800 mb-2">{number}</div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-slate-400">{desc}</p>
    </div>
);
