
export interface AppBlueprint {
  techStack: string;
  coreFeatures: string[];
  monetizationStrategy: string;
  uniModuleRef: string;
}

export interface PortfolioSettings {
  companyName: string;
  founderName: string;
  bio: string;
  logoEmoji: string;
  accentColor: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
}

export interface UserProfile {
  username: string;
  isPro: boolean;
  joinedAt: number;
  reputation: number;
  title: string;
}

export interface CommunityUser {
  id: string;
  username: string;
  reputation: number;
  title: string;
  avatar: string;
  shippedApps: number;
  isOnline: boolean;
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  mrr: number;
  potentialMrr: number;
  status: 'Live' | 'Beta' | 'Dev' | 'Concept';
  createdAt: number;
  blueprint?: AppBlueprint;
  url?: string;
  isPublic: boolean;
  linkedCourseId?: string;
}

export enum AppCategory {
  SAAS = 'SaaS Product',
  GAME = 'Indie Game',
  TOOL = 'Dev Tool',
  FINANCE = 'Fintech',
  AI_TOOL = 'AI Tool',
  DATA_TOOL = 'Data Tool',
  AUTOMATION = 'Automation',
  CONTENT_GEN = 'Content Gen'
}

// New Interfaces for Story Mode and Deep Curriculum
export interface StoryOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface StoryScenario {
  title: string;
  situation: string;
  options: StoryOption[];
}

export interface TaskItem {
  id: string;
  text: string;
  codeSnippet?: string; // This will hold the Prompt to copy
}

export interface CourseNode {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  reputationReward: number;
  status: 'locked' | 'unlocked' | 'completed';
  category: 'foundation' | 'build' | 'growth' | 'specialized';
  isProOnly?: boolean;
  content?: string; 
  podcastScript?: string;
  tasks?: TaskItem[];
  storyScenarios?: StoryScenario[]; // Replaces simple flashcards
  quiz?: QuizQuestion[];
}

export interface GeneratedAppConcept {
  name: string;
  desc: string;
  category: string;
  potentialMrr: number;
  hypeComment: string;
  blueprint: AppBlueprint;
  customCurriculum?: CourseNode[]; // Returns a full array of modules
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system' | 'community';
  text: string;
  timestamp: number;
  isHype?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}
