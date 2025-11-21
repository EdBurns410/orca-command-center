
import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, CheckCircle, PlayCircle, GraduationCap, Star, ArrowRight, ChevronLeft, Crown, Headphones, PauseCircle, BrainCircuit, CheckSquare, RefreshCw, Send, Copy, Loader2, Maximize2, Minimize2, Award, MessageSquare } from 'lucide-react';
import { CourseNode, StoryScenario } from '../types';
import { getAiTutorHelp, generatePodcastAudio } from '../services/geminiService';

interface UniversityStudioProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: CourseNode[];
  onCompleteNode: (nodeId: string, xp: number, rep: number) => void;
  isPro: boolean;
  mode?: 'modal' | 'sidebar';
}

type LessonTab = 'content' | 'practice' | 'tasks' | 'quiz';

// --- Audio Helper Functions ---
const decodeAudioData = (base64String: string, audioContext: AudioContext): AudioBuffer => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const sampleRate = 24000;
  const numChannels = 1;
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const frameCount = dataInt16.length / numChannels;
  
  const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  
  return buffer;
};

export const UniversityStudio: React.FC<UniversityStudioProps> = ({ isOpen, onClose, curriculum, onCompleteNode, isPro, mode = 'modal' }) => {
  const [activeNode, setActiveNode] = useState<CourseNode | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Lesson State
  const [activeTab, setActiveTab] = useState<LessonTab>('content');
  
  // Podcast State (Gemini TTS)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, AudioBuffer>>({});

  // Story Mode State
  const [activeScenario, setActiveScenario] = useState<StoryScenario | null>(null);
  const [scenarioResult, setScenarioResult] = useState<{correct: boolean, feedback: string} | null>(null);

  // Task State
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Tutor State
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  useEffect(() => {
      stopAudio();
      setActiveTab('content');
      setCompletedTasks(new Set());
      setQuizAnswers([]);
      setQuizSubmitted(false);
      setQuizPassed(false);
      setTutorResponse('');
      setTutorQuestion('');
      setScenarioResult(null);
      
      if (activeNode?.storyScenarios && activeNode.storyScenarios.length > 0) {
          setActiveScenario(activeNode.storyScenarios[0]);
      } else {
          setActiveScenario(null);
      }
  }, [activeNode]);

  useEffect(() => {
      return () => stopAudio();
  }, []);

  // --- Podcast Logic (Gemini) ---
  const stopAudio = () => {
    if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch (e) {}
        audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleTogglePodcast = async () => {
      if (isPlaying) {
          stopAudio();
          return;
      }

      if (!activeNode) return;

      if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;

      if (audioCache[activeNode.id]) {
          playBuffer(audioCache[activeNode.id]);
          return;
      }

      setIsGeneratingAudio(true);
      try {
          const contentToSpeak = activeNode.content || activeNode.description;
          const base64Audio = await generatePodcastAudio(contentToSpeak, activeNode.title);
          const buffer = decodeAudioData(base64Audio, ctx);
          setAudioCache(prev => ({...prev, [activeNode.id]: buffer}));
          playBuffer(buffer);
      } catch (error) {
          console.error("Podcast generation failed", error);
      } finally {
          setIsGeneratingAudio(false);
      }
  };

  const playBuffer = (buffer: AudioBuffer) => {
      if (!audioContextRef.current) return;
      stopAudio();
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
  };

  // --- Tutor Logic ---
  const handleAskTutor = async () => {
      if (!tutorQuestion.trim() || !activeNode) return;
      setTutorLoading(true);
      try {
          const ans = await getAiTutorHelp(tutorQuestion, activeNode.content || activeNode.description);
          setTutorResponse(ans);
      } catch (e) {
          setTutorResponse("Error connecting to AI Tutor.");
      } finally {
          setTutorLoading(false);
      }
  };

  // --- Completion Logic ---
  const handleFinishQuiz = () => {
      if (!activeNode?.quiz) return;
      setQuizSubmitted(true);
      const isAllCorrect = activeNode.quiz.every((q, idx) => quizAnswers[idx] === q.correctIndex);
      if (isAllCorrect) setQuizPassed(true);
  };

  const handleRetryQuiz = () => {
      setQuizSubmitted(false);
      setQuizPassed(false);
      setQuizAnswers([]);
  };

  const handleCompleteLesson = () => {
      if (activeNode && quizPassed) {
          onCompleteNode(activeNode.id, activeNode.xpReward, activeNode.reputationReward);
          setActiveNode(null);
      }
  };

  if (!isOpen) return null;

  const totalXP = curriculum.reduce((acc, node) => node.status === 'completed' ? acc + node.xpReward : acc, 0);

  const containerClasses = mode === 'modal' || isFullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-0 md:p-4"
    : "w-full h-full border-l border-slate-800 bg-slate-950 flex flex-col relative"; 

  const innerClasses = mode === 'modal' || isFullScreen
    ? "w-full h-full max-w-[1600px] bg-slate-900 border border-purple-500/20 rounded-none md:rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.1)] flex flex-col overflow-hidden relative transition-all duration-300"
    : "flex-1 flex flex-col overflow-hidden";

  return (
    <div className={containerClasses}>
        <div className={innerClasses}>
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-500/20 bg-slate-950/80 shrink-0">
                <div className="flex items-center gap-3">
                    <GraduationCap className="text-purple-400" size={24} />
                    <div>
                        <h2 className="text-md font-bold text-white tracking-tight">VIBE CODE UNIVERSITY</h2>
                        <p className="text-purple-400 text-[10px] font-mono uppercase tracking-widest">Learning Management System</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold">
                        <Star size={12} fill="currentColor" />
                        {totalXP} XP
                     </div>
                     
                     {(mode === 'sidebar' && activeNode) && (
                        <button onClick={() => setIsFullScreen(!isFullScreen)} className="text-slate-500 hover:text-white p-1 transition-colors">
                           {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                     )}

                     <button onClick={onClose} className="text-slate-500 hover:text-white p-1">
                         <X size={20} />
                     </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Sidebar List (Desktop) */}
                {!activeNode ? (
                    <div className="w-full p-6 overflow-y-auto space-y-12 scrollbar-hide">
                        <CurriculumList curriculum={curriculum} isPro={isPro} onStart={setActiveNode} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col md:flex-row h-full animate-in fade-in duration-300">
                         
                         {isFullScreen && (
                            <div className="hidden lg:block w-80 border-r border-slate-800 bg-slate-950/50 p-4 overflow-y-auto">
                                <button onClick={() => setActiveNode(null)} className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                                    <ChevronLeft size={16} /> All Courses
                                </button>
                                <div className="space-y-2">
                                    {curriculum.map(node => (
                                        <div 
                                            key={node.id} 
                                            onClick={() => setActiveNode(node)}
                                            className={`p-3 rounded-lg cursor-pointer text-sm border transition-all ${
                                                activeNode.id === node.id 
                                                ? 'bg-purple-500/10 border-purple-500/40 text-white' 
                                                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                                            }`}
                                        >
                                            <div className="flex justify-between">
                                                <span>{node.title}</span>
                                                {node.status === 'completed' && <CheckCircle size={14} className="text-green-500" />}
                                                {node.status === 'locked' && <Lock size={14} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}

                         {/* Content Container */}
                         <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
                             
                             <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-4 shrink-0">
                                {!isFullScreen && (
                                    <button onClick={() => setActiveNode(null)} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold self-start">
                                        <ChevronLeft size={16} /> Back to Curriculum
                                    </button>
                                )}
                                <div className="flex justify-between items-end overflow-x-auto">
                                    <div className="flex gap-2 pb-2 md:pb-0">
                                        <TabBtn id="content" icon={<GraduationCap size={16}/>} label="Lecture" active={activeTab} onClick={setActiveTab} />
                                        <TabBtn id="tasks" icon={<CheckSquare size={16}/>} label="Action Plan" active={activeTab} onClick={setActiveTab} />
                                        <TabBtn id="practice" icon={<MessageSquare size={16}/>} label="Story Mode" active={activeTab} onClick={setActiveTab} />
                                        <TabBtn id="quiz" icon={<Star size={16}/>} label="Exam" active={activeTab} onClick={setActiveTab} />
                                    </div>
                                </div>
                             </div>

                             <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                                 <div className="max-w-4xl mx-auto pb-20">
                                    
                                    {/* TAB: CONTENT */}
                                    {activeTab === 'content' && (
                                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                                                            Module {activeNode.id}
                                                        </span>
                                                        <span className="text-slate-500 text-xs uppercase tracking-wider">{activeNode.category} Phase</span>
                                                    </div>
                                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{activeNode.title}</h1>
                                                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">{activeNode.description}</p>
                                                </div>
                                                
                                                <button 
                                                    onClick={handleTogglePodcast}
                                                    disabled={isGeneratingAudio}
                                                    className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all shrink-0 group ${
                                                        isPlaying 
                                                        ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                                                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-500 hover:bg-slate-800'
                                                    }`}
                                                >
                                                    {isGeneratingAudio ? (
                                                        <Loader2 size={20} className="animate-spin" />
                                                    ) : isPlaying ? (
                                                        <PauseCircle size={20} className="animate-pulse"/>
                                                    ) : (
                                                        <Headphones size={20} className="group-hover:text-purple-400 transition-colors" />
                                                    )}
                                                    <div className="flex flex-col items-start text-xs text-left">
                                                        <span className="font-bold uppercase tracking-wider text-sm">
                                                            {isGeneratingAudio ? 'Generating...' : isPlaying ? 'Pause Audio' : 'Play Podcast'}
                                                        </span>
                                                        <span className="opacity-70">AI Deep Dive (2 min)</span>
                                                    </div>
                                                </button>
                                            </div>
                                            
                                            <div className="w-full h-px bg-slate-800" />

                                            <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                                                {activeNode.content?.split('\n').map((line, i) => {
                                                    if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold text-purple-400 mt-10 mb-4 flex items-center gap-2"><span className="w-2 h-8 bg-purple-500 rounded-full inline-block mr-2"/>{line.replace('### ', '')}</h3>;
                                                    if (line.startsWith('**')) return <strong key={i} className="text-white block mt-6 mb-2 text-lg border-l-4 border-cyan-500 pl-4 bg-slate-900/50 py-2 rounded-r">{line.replace(/\*\*/g, '')}</strong>;
                                                    if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc mb-2 marker:text-cyan-500">{line.replace('- ', '')}</li>;
                                                    if (line.startsWith('1. ')) return <div key={i} className="flex gap-3 mb-3 ml-2"><span className="bg-slate-800 text-cyan-400 font-mono text-xs font-bold px-2 py-1 rounded h-fit mt-1">{line.substring(0, 2)}</span><p className="flex-1">{line.substring(3)}</p></div>;
                                                    if (line.trim() === '') return <br key={i} />;
                                                    return <p key={i} className="leading-relaxed mb-4 text-slate-300">{line}</p>
                                                })}
                                            </div>

                                            {/* AI Tutor */}
                                            <div className="mt-16 p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                                <div className="absolute top-0 right-0 p-12 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold uppercase tracking-widest text-xs">
                                                        <BrainCircuit size={16} /> AI Teaching Assistant
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <input 
                                                            type="text" 
                                                            value={tutorQuestion}
                                                            onChange={(e) => setTutorQuestion(e.target.value)}
                                                            placeholder="Ask for clarification or a code example..."
                                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                                                            onKeyDown={e => e.key === 'Enter' && handleAskTutor()}
                                                        />
                                                        <button 
                                                            onClick={handleAskTutor}
                                                            disabled={tutorLoading}
                                                            className="px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-colors"
                                                        >
                                                            {tutorLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                                        </button>
                                                    </div>
                                                    {tutorResponse && (
                                                        <div className="mt-6 p-6 bg-slate-950 rounded-xl border border-cyan-500/20 text-sm text-slate-200 leading-relaxed animate-in fade-in">
                                                            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs uppercase">
                                                                <BrainCircuit size={14} /> Vibe Tutor
                                                            </div>
                                                            {tutorResponse}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: PRACTICE (Story Mode) */}
                                    {activeTab === 'practice' && activeScenario && (
                                        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 animate-in zoom-in-95 duration-500">
                                            
                                            <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                                 <div className="absolute top-0 right-0 p-20 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                 
                                                 <div className="relative z-10">
                                                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold mb-6">
                                                         <BrainCircuit size={14} /> SCENARIO SIMULATION
                                                     </div>
                                                     
                                                     <h3 className="text-2xl font-bold text-white mb-4">{activeScenario.title}</h3>
                                                     <p className="text-lg text-slate-300 leading-relaxed mb-8">
                                                         {activeScenario.situation}
                                                     </p>

                                                     {scenarioResult && (
                                                         <div className={`mb-6 p-4 rounded-xl border ${scenarioResult.correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                             <strong className="block mb-1">{scenarioResult.correct ? 'Excellent Decision.' : 'Incorrect Approach.'}</strong>
                                                             {scenarioResult.feedback}
                                                         </div>
                                                     )}

                                                     <div className="space-y-3">
                                                         {activeScenario.options.map((option, idx) => (
                                                             <button
                                                                 key={idx}
                                                                 disabled={!!scenarioResult}
                                                                 onClick={() => setScenarioResult({ correct: option.isCorrect, feedback: option.feedback })}
                                                                 className={`w-full p-4 rounded-xl border text-left transition-all text-sm font-medium ${
                                                                     scenarioResult 
                                                                     ? option.isCorrect 
                                                                        ? 'bg-green-900/20 border-green-500/50 text-green-300'
                                                                        : 'bg-slate-950 border-slate-800 text-slate-500 opacity-50'
                                                                     : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/50 hover:bg-slate-800'
                                                                 }`}
                                                             >
                                                                 {option.text}
                                                             </button>
                                                         ))}
                                                     </div>
                                                 </div>
                                            </div>
                                            
                                            {scenarioResult?.correct && (
                                                <div className="flex items-center gap-2 text-green-400 animate-bounce">
                                                    <CheckCircle size={16} /> Scenario Complete
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {activeTab === 'practice' && !activeScenario && (
                                        <div className="text-center py-20 text-slate-500">
                                            <p>No scenarios available for this module.</p>
                                        </div>
                                    )}

                                    {/* TAB: TASKS */}
                                    {activeTab === 'tasks' && activeNode.tasks && (
                                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                            <div className="p-6 bg-gradient-to-r from-cyan-900/10 to-transparent border border-cyan-500/10 rounded-xl mb-8">
                                                <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2">Mission Objectives</h3>
                                                <p className="text-slate-400 text-sm">Complete these steps to master the module. Check them off as you go.</p>
                                            </div>
                                            <div className="grid gap-4">
                                                {activeNode.tasks.map((task) => (
                                                    <div 
                                                        key={task.id} 
                                                        onClick={() => {
                                                            const newSet = new Set(completedTasks);
                                                            if (newSet.has(task.id)) newSet.delete(task.id);
                                                            else newSet.add(task.id);
                                                            setCompletedTasks(newSet);
                                                        }}
                                                        className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-4 group ${
                                                            completedTasks.has(task.id)
                                                            ? 'bg-green-500/5 border-green-500/30'
                                                            : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                                        }`}
                                                    >
                                                        <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center transition-all ${
                                                            completedTasks.has(task.id) 
                                                            ? 'bg-green-500 text-slate-900' 
                                                            : 'bg-slate-950 border border-slate-700 group-hover:border-slate-500'
                                                        }`}>
                                                            {completedTasks.has(task.id) && <CheckCircle size={16} strokeWidth={3} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`font-medium ${completedTasks.has(task.id) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.text}</p>
                                                            {task.codeSnippet && (
                                                                <div className="mt-3 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-sm text-green-400 flex items-center justify-between group/code relative overflow-hidden">
                                                                    <code className="break-all relative z-10">{task.codeSnippet}</code>
                                                                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover/code:opacity-100 transition-opacity" />
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigator.clipboard.writeText(task.codeSnippet!);
                                                                        }}
                                                                        className="opacity-0 group-hover/code:opacity-100 p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all relative z-20"
                                                                    >
                                                                        <Copy size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: QUIZ */}
                                    {activeTab === 'quiz' && activeNode.quiz && (
                                        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-12">
                                                {activeNode.quiz.map((q, idx) => (
                                                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                                                        <h3 className="text-lg text-white font-bold mb-6 flex gap-4">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-slate-400 text-sm">{idx + 1}</span>
                                                            {q.question}
                                                        </h3>
                                                        <div className="grid gap-3">
                                                            {q.options.map((opt, optIdx) => (
                                                                <button
                                                                    key={optIdx}
                                                                    onClick={() => {
                                                                        if (quizSubmitted) return;
                                                                        const newAnswers = [...quizAnswers];
                                                                        newAnswers[idx] = optIdx;
                                                                        setQuizAnswers(newAnswers);
                                                                    }}
                                                                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex justify-between items-center ${
                                                                        quizSubmitted 
                                                                            ? optIdx === q.correctIndex 
                                                                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                                                                : quizAnswers[idx] === optIdx ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-slate-950 border-slate-800 text-slate-600 opacity-50'
                                                                            : quizAnswers[idx] === optIdx 
                                                                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                                                                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                                                                    }`}
                                                                >
                                                                    {opt}
                                                                    {quizSubmitted && optIdx === q.correctIndex && <CheckCircle size={18} />}
                                                                    {quizSubmitted && quizAnswers[idx] === optIdx && optIdx !== q.correctIndex && <X size={18} />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {quizSubmitted && (
                                                            <div className={`mt-6 text-sm p-4 rounded-xl border ${quizAnswers[idx] === q.correctIndex ? 'bg-green-900/20 border-green-900/50 text-green-300' : 'bg-red-900/20 border-red-900/50 text-red-300'}`}>
                                                                <strong className="block mb-1">{quizAnswers[idx] === q.correctIndex ? 'Correct Analysis.' : 'Incorrect.'}</strong> {q.explanation}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-center pt-8 pb-12">
                                                {!quizSubmitted ? (
                                                    <button 
                                                        onClick={handleFinishQuiz}
                                                        disabled={quizAnswers.length !== activeNode.quiz.length}
                                                        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
                                                    >
                                                        Submit Final Assessment
                                                    </button>
                                                ) : (
                                                    <div className="text-center w-full max-w-md animate-in zoom-in-90">
                                                        {quizPassed ? (
                                                            <div className="mb-4 flex flex-col items-center gap-6 bg-green-500/10 border border-green-500/30 p-8 rounded-3xl">
                                                                <div className="p-4 rounded-full bg-green-500 text-slate-900 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                                                    <Crown size={40} fill="currentColor" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-green-400 font-bold text-2xl mb-2">Module Mastered</h3>
                                                                    <p className="text-slate-400">You have demonstrated competence in this domain.</p>
                                                                </div>
                                                                <button onClick={handleCompleteLesson} className="w-full px-8 py-4 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all">
                                                                    Claim {activeNode.reputationReward} REP & Close
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="mb-4 flex flex-col items-center gap-6 bg-red-500/10 border border-red-500/30 p-8 rounded-3xl">
                                                                <div className="text-red-400 font-bold text-2xl">Assessment Failed</div>
                                                                <p className="text-slate-400 text-sm">Perfection is required. Review the material and try again.</p>
                                                                <button 
                                                                    onClick={handleRetryQuiz}
                                                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-600 w-full transition-all"
                                                                >
                                                                    <RefreshCw size={18} /> Retry Assessment
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const TabBtn = ({ id, icon, label, active, onClick }: any) => (
    <button 
        onClick={() => onClick(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
            active === id 
            ? 'bg-slate-950 border-cyan-500 text-cyan-400' 
            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
        }`}
    >
        {icon} <span className="inline">{label}</span>
    </button>
);

const CurriculumList = ({ curriculum, isPro, onStart }: any) => (
    <div className="max-w-5xl mx-auto space-y-16">
        {curriculum.some((n: CourseNode) => n.category === 'specialized') && (
            <div className="animate-in slide-in-from-left duration-500">
                <SectionTitle title="🎯 CUSTOM BLUEPRINTS" color="text-cyan-400" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {curriculum.filter((n: CourseNode) => n.category === 'specialized').map((node: CourseNode) => <NodeCard key={node.id} node={node} isPro={isPro} onStart={() => onStart(node)} />)}
                </div>
            </div>
        )}

        <div>
            <SectionTitle title="PHASE 1: FOUNDATION" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {curriculum.filter((n: CourseNode) => n.category === 'foundation').map((node: CourseNode) => <NodeCard key={node.id} node={node} isPro={isPro} onStart={() => onStart(node)} />)}
            </div>
        </div>

        <div>
            <SectionTitle title="PHASE 2: DEPLOYMENT" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {curriculum.filter((n: CourseNode) => n.category === 'growth').map((node: CourseNode) => <NodeCard key={node.id} node={node} isPro={isPro} onStart={() => onStart(node)} />)}
            </div>
        </div>
    </div>
);

const SectionTitle = ({ title, color = "text-purple-400" }: { title: string, color?: string }) => (
    <div className="flex items-center gap-4 mb-8 opacity-80">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
        <h3 className={`font-mono font-bold ${color} tracking-[0.3em] text-sm md:text-base whitespace-nowrap`}>{title}</h3>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700" />
    </div>
);

const NodeCard = ({ node, onStart, isPro }: { node: CourseNode, onStart: () => void, isPro: boolean }) => {
    const isLocked = node.status === 'locked';
    const isCompleted = node.status === 'completed';
    const isUnlocked = node.status === 'unlocked';
    const isGateKeep = node.isProOnly && !isPro;

    return (
        <div className={`group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full ${
            isLocked || isGateKeep
            ? 'bg-slate-950/50 border-slate-800 opacity-60' 
            : isCompleted
            ? 'bg-purple-900/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
            : 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-1'
        }`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${
                    isGateKeep ? 'bg-slate-800 text-yellow-500' :
                    isCompleted ? 'bg-purple-500 text-white' : isUnlocked ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-500'
                }`}>
                    {isGateKeep ? <Crown size={20} /> : isCompleted ? <CheckCircle size={20} /> : isLocked ? <Lock size={20} /> : <PlayCircle size={20} />}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                     <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        {node.xpReward} XP
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-purple-400">
                        <Award size={10} />
                        {node.reputationReward} REP
                    </div>
                </div>
            </div>
            
            <div className="flex-1 mb-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Lesson {node.id}</span>
                <h4 className={`text-lg font-bold mb-3 leading-tight ${isLocked ? 'text-slate-500' : 'text-white group-hover:text-cyan-400 transition-colors'}`}>{node.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{node.description}</p>
            </div>

            <button 
                onClick={onStart}
                disabled={isLocked && !isGateKeep} 
                className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 mt-auto ${
                    isGateKeep
                    ? 'bg-slate-900 text-yellow-500 border border-yellow-500/30 cursor-pointer hover:bg-yellow-500/10'
                    : isLocked 
                    ? 'bg-slate-950 text-slate-700 border border-slate-800 cursor-not-allowed'
                    : isCompleted
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg'
            }`}>
                {isGateKeep ? 'Pro Access Only' : isLocked ? 'Locked' : isCompleted ? 'Review' : 'Start'}
                {!isLocked && !isGateKeep && <ArrowRight size={12} />}
            </button>
        </div>
    );
};
