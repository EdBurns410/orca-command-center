
import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { AppCard } from './components/AppCard';
import { OracleChat } from './components/OracleChat';
import { Launchpad } from './components/Launchpad';
import { UniversityStudio } from './components/UniversityStudio';
import { BlueprintModal } from './components/BlueprintModal';
import { BrandingSuite } from './components/BrandingSuite';
import { ShipTerminal } from './components/ShipTerminal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { EditAppModal } from './components/EditAppModal';
import { PublicProfile } from './components/PublicProfile';
import { CommunityHub } from './components/CommunityHub';
import { INITIAL_APPS, DEFAULT_PORTFOLIO, UNIVERSITY_CURRICULUM } from './constants';
import { AppProject, ChatMessage, GeneratedAppConcept, AppCategory, PortfolioSettings, CourseNode, UserProfile } from './types';
import { Plus, GraduationCap, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // --- State Initialization with Persistence ---
  const [user, setUser] = useState<UserProfile | null>(() => {
     const saved = localStorage.getItem('orca_user');
     return saved ? JSON.parse(saved) : null;
  });

  const [apps, setApps] = useState<AppProject[]>(() => {
      const saved = localStorage.getItem('orca_apps');
      return saved ? JSON.parse(saved) : INITIAL_APPS;
  });

  const [portfolio, setPortfolio] = useState<PortfolioSettings>(() => {
      const saved = localStorage.getItem('orca_portfolio');
      return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIO;
  });

  const [curriculum, setCurriculum] = useState<CourseNode[]>(() => {
      const saved = localStorage.getItem('orca_curriculum');
      return saved ? JSON.parse(saved) : UNIVERSITY_CURRICULUM;
  });
  
  // --- Persistence Effects ---
  useEffect(() => { 
    if (user) localStorage.setItem('orca_user', JSON.stringify(user)); 
    else localStorage.removeItem('orca_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('orca_apps', JSON.stringify(apps)); }, [apps]);
  useEffect(() => { localStorage.setItem('orca_portfolio', JSON.stringify(portfolio)); }, [portfolio]);
  useEffect(() => { localStorage.setItem('orca_curriculum', JSON.stringify(curriculum)); }, [curriculum]);


  // --- UI State ---
  const [viewMode, setViewMode] = useState<'business' | 'public'>('business');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isUniversityOpen, setIsUniversityOpen] = useState(false);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  
  // Action targets
  const [shipTargetApp, setShipTargetApp] = useState<AppProject | null>(null);
  const [blueprintTargetApp, setBlueprintTargetApp] = useState<AppProject | null>(null);
  const [editTargetApp, setEditTargetApp] = useState<AppProject | null>(null);
  
  const [systemMessages, setSystemMessages] = useState<ChatMessage[]>([]);

  const totalProjectedMRR = useMemo(() => {
      return apps.reduce((sum, app) => {
          const actual = app.mrr || 0;
          const pipeline = app.status === 'Concept' || app.status === 'Dev' ? (app.potentialMrr || 0) : 0;
          return sum + actual + pipeline; 
      }, 0);
  }, [apps]);

  // --- Auth Logic ---
  const handleLogin = (username: string, isPro: boolean) => {
     // Initialize new user with default rep
     const newUser: UserProfile = { 
         username, 
         isPro, 
         joinedAt: Date.now(),
         reputation: 0,
         title: 'Script Kiddie' 
    };
     setUser(newUser);
     setPortfolio(prev => ({ ...prev, founderName: username }));
     setIsAuthOpen(false);
  };

  // --- Actions ---

  const handleDeployConcept = (concept: GeneratedAppConcept) => {
    const newApp: AppProject = {
      id: `gen-${Date.now()}`,
      name: concept.name,
      description: concept.desc,
      category: concept.category as AppCategory,
      mrr: 0,
      potentialMrr: concept.potentialMrr,
      status: 'Concept',
      createdAt: Date.now(),
      isPublic: false,
      blueprint: concept.blueprint,
      linkedCourseId: concept.customCurriculum?.[0]?.id // Link to first module
    };

    setApps(prev => [newApp, ...prev]);

    // If it was reverse engineered, add the CUSTOM CURRICULUM
    if (concept.customCurriculum && concept.customCurriculum.length > 0) {
        setCurriculum(prev => [...prev, ...concept.customCurriculum!]);
        triggerSystemMessage(`🎓 Full Custom Curriculum Generated for ${concept.name}`, 'system');
    }

    setIsLaunchpadOpen(false);
    triggerSystemMessage(`🚨 NEW CONCEPT DRAFTED: ${concept.name}`);
    
    setTimeout(() => {
      triggerSystemMessage(concept.hypeComment, 'ai');
    }, 1500);
  };

  const handleShipApp = (appId: string, url: string) => {
    setApps(prev => prev.map(app => {
        if (app.id === appId) {
            return { ...app, status: 'Live', url: url, mrr: 100 }; // Give them first $100 MRR for shipping
        }
        return app;
    }));
    setShipTargetApp(null);
    triggerSystemMessage(`🚀 APP DEPLOYED: ${url}`, 'system');
    
    // Award massive rep for shipping
    if (user) {
        setUser({ ...user, reputation: user.reputation + 200 });
    }

    setTimeout(() => triggerSystemMessage("First customers incoming! MRR update detected.", 'ai'), 2000);
  };

  const handleSaveAppDetails = (updatedApp: AppProject) => {
      setApps(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
      triggerSystemMessage(`📝 App metadata updated for ${updatedApp.name}`);
  };

  const handleUpdateAppCategory = (appId: string, category: AppCategory) => {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, category } : a));
  };

  const handleDeleteApp = (appId: string) => {
      if (window.confirm("Are you sure you want to delete this app blueprint?")) {
        setApps(prev => prev.filter(app => app.id !== appId));
        triggerSystemMessage("🗑️ Blueprint deleted from database.", 'system');
      }
  };

  const handleToggleVisibility = (appId: string) => {
      setApps(prev => prev.map(app => app.id === appId ? { ...app, isPublic: !app.isPublic } : app));
  };

  const handleCompleteNode = (nodeId: string, xp: number, rep: number) => {
      // Update Curriculum Status
      setCurriculum(prev => {
          const currentIndex = prev.findIndex(n => n.id === nodeId);
          const nextIndex = currentIndex + 1;
          
          return prev.map((node, index) => {
              if (node.id === nodeId) return { ...node, status: 'completed' };
              if (index === nextIndex && node.status === 'locked') return { ...node, status: 'unlocked' };
              return node;
          });
      });

      // Update User Stats
      if (user) {
          setUser(prev => prev ? ({ ...prev, reputation: prev.reputation + rep }) : null);
      }

      triggerSystemMessage(`🎓 Lesson Completed! +${rep} Reputation Gained.`, 'system');
  };

  const handleGoToClass = () => {
      setBlueprintTargetApp(null);
      setIsUniversityOpen(true);
  };

  const triggerSystemMessage = (text: string, sender: 'system' | 'ai' = 'system') => {
    const msg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender,
        text,
        timestamp: Date.now()
    };
    setSystemMessages(prev => [...prev, msg]);
  };

  // --- Render Logic ---

  if (!user) {
     return (
        <>
          <LandingPage onLogin={() => setIsAuthOpen(true)} />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
        </>
     );
  }

  // --- PUBLIC VIEW ---
  if (viewMode === 'public') {
      return (
          <>
            <div className="fixed top-4 right-4 z-50 bg-slate-950 rounded-lg p-1 border border-slate-800 shadow-xl">
                <button 
                    onClick={() => setViewMode('business')}
                    className="px-4 py-2 bg-cyan-600 text-white font-bold rounded text-sm hover:bg-cyan-500"
                >
                    Back to Ops
                </button>
            </div>
            <PublicProfile user={user} portfolio={portfolio} apps={apps} />
          </>
      );
  }

  // --- BUSINESS VIEW ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="relative z-10 flex flex-col h-full">
        
        <DashboardHeader 
          totalMRR={totalProjectedMRR} 
          appCount={apps.length}
          reputation={user.reputation} 
          portfolio={portfolio}
          viewMode={viewMode}
          onToggleView={() => setViewMode(prev => prev === 'business' ? 'public' : 'business')}
          onOpenUniversity={() => setIsUniversityOpen(true)}
          onOpenBranding={() => setIsBrandingOpen(true)}
          onOpenCommunity={() => setIsCommunityOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Dashboard Area */}
          <main className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300 ${isUniversityOpen ? 'md:w-1/2' : 'w-full'}`}>
            
            {/* Action Banner */}
            <div 
              onClick={() => setIsLaunchpadOpen(true)}
              className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 cursor-pointer group transition-transform hover:scale-[1.01]"
            >
              <div className="bg-slate-900 rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10">
                   <h2 className="text-2xl font-bold text-white mb-1">Draft New Blueprint</h2>
                   <p className="text-slate-400">Consult the Architect AI to validate your next idea.</p>
                 </div>
                 <div className="relative z-10 bg-white text-slate-900 p-3 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:rotate-90 transition-transform duration-500">
                   <Plus size={24} />
                 </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              Active Portfolio
            </h3>

            {/* ZERO STATE vs GRID */}
            {apps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                        <GraduationCap size={32} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Portfolio Empty</h2>
                    <p className="text-slate-400 max-w-md text-center mb-8">
                        You haven't built any apps yet. Start by entering the University to learn the method, or draft your first blueprint.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsUniversityOpen(true)}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                        >
                            <GraduationCap size={18} /> Go to Class
                        </button>
                        <button 
                            onClick={() => setIsLaunchpadOpen(true)}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 flex items-center gap-2"
                        >
                            Launchpad <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`grid grid-cols-1 gap-6 pb-20 ${isUniversityOpen ? 'xl:grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                {apps.map(app => (
                    <AppCard 
                        key={app.id} 
                        app={app} 
                        onViewBlueprint={(a) => setBlueprintTargetApp(a)}
                        onShipApp={(a) => setShipTargetApp(a)}
                        onDeleteApp={handleDeleteApp}
                        onEditApp={(a) => setEditTargetApp(a)}
                        onToggleVisibility={handleToggleVisibility}
                    />
                ))}
                </div>
            )}
          </main>

          {/* University Split Panel */}
          {isUniversityOpen && (
              <div className="hidden md:block w-[45%] border-l border-slate-800 z-30 bg-slate-950 shadow-2xl relative">
                  <UniversityStudio 
                    isOpen={true}
                    onClose={() => setIsUniversityOpen(false)}
                    curriculum={curriculum}
                    onCompleteNode={handleCompleteNode}
                    isPro={user.isPro}
                    mode="sidebar"
                  />
              </div>
          )}

          {/* Right Sidebar (Oracle Chat) - Hidden if University is open to prevent crowding */}
          {!isUniversityOpen && (
            <aside className="hidden lg:flex w-80 h-full border-l border-slate-800 flex-col z-20 bg-slate-950">
                <OracleChat externalMessages={systemMessages} />
            </aside>
          )}

        </div>
      </div>

      {/* Modals */}
      
      {/* Mobile University Modal */}
      <div className="md:hidden">
        <UniversityStudio 
            isOpen={isUniversityOpen}
            onClose={() => setIsUniversityOpen(false)}
            curriculum={curriculum}
            onCompleteNode={handleCompleteNode}
            isPro={user.isPro}
            mode="modal"
        />
      </div>

      <Launchpad 
        isOpen={isLaunchpadOpen} 
        onClose={() => setIsLaunchpadOpen(false)} 
        onDeploy={handleDeployConcept} 
      />

      <BrandingSuite 
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        settings={portfolio}
        apps={apps}
        onSaveSettings={setPortfolio}
        onToggleVisibility={handleToggleVisibility}
        onUpdateAppCategory={handleUpdateAppCategory}
      />

      <CommunityHub 
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        currentUser={user}
      />

      <BlueprintModal 
        isOpen={!!blueprintTargetApp}
        app={blueprintTargetApp}
        onClose={() => setBlueprintTargetApp(null)}
        onGoToClass={handleGoToClass}
      />

      <ShipTerminal 
        isOpen={!!shipTargetApp}
        app={shipTargetApp}
        onClose={() => setShipTargetApp(null)}
        onShip={handleShipApp}
      />

      <EditAppModal 
        isOpen={!!editTargetApp}
        app={editTargetApp}
        onClose={() => setEditTargetApp(null)}
        onSave={handleSaveAppDetails}
      />
    </div>
  );
};

export default App;
