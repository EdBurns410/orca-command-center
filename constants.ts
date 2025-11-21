
import { AppProject, PortfolioSettings, CourseNode, CommunityUser } from './types';

export const DEFAULT_PORTFOLIO: PortfolioSettings = {
  companyName: "VibeCode Studios",
  founderName: "Anon_Dev",
  bio: "Building the future, one prompt at a time.",
  logoEmoji: "⚡",
  accentColor: "cyan",
  socials: {
    twitter: "",
    github: "",
    linkedin: "",
    website: "",
    email: ""
  }
};

export const UNIVERSITY_CURRICULUM: CourseNode[] = [
  // --- PHASE 0: MINDSET ---
  { 
    id: '000', 
    title: "The Vibe Protocol", 
    description: "Stop coding from scratch. Start Vibe Coding. The philosophy of AI-First Architecture.", 
    xpReward: 150, 
    reputationReward: 25,
    status: 'unlocked', 
    category: 'foundation',
    isProOnly: false,
    content: `### The Paradigm Shift
Old Way: \`npx create-react-app\`, configure Webpack, debug CSS, deploy to Vercel.
**The Vibe Way:** Open AI Studio, Prompt, Deploy to Google Cloud.

### The Solvent
1.  **Identify Friction:** Find a manual task.
2.  **Prompt the Solvent:** Use Gemini 3 Pro Preview to write the full app.
3.  **Deploy & Scale:** One-click deploy to Cloud Run.

**Your Goal:** Don't write code. Architect solutions.`,
    tasks: [
      { id: 't1', text: "Go to https://aistudio.google.com/apps" },
      { id: 't2', text: "Select 'Gemini 3.0 Pro Preview' in the model dropdown" }
    ],
    storyScenarios: [
      {
        title: "The Client Request",
        situation: "A client needs a landing page. They ask you to use Next.js and Tailwind.",
        options: [
            { text: "Spend 3 hours setting up the repo and dependencies.", isCorrect: false, feedback: "Too slow. You are thinking like a coder, not an architect." },
            { text: "Open AI Studio, prompt: 'Build a high-converting landing page using React/Tailwind in a single file', then deploy.", isCorrect: true, feedback: "Correct. Speed wins. The tool doesn't matter, the result does." },
            { text: "Hire a freelancer.", isCorrect: false, feedback: "You gave away your margin." }
        ]
      }
    ],
    quiz: [
      {
        question: "What is the primary tool for Vibe Coding?",
        options: ["VS Code", "Google AI Studio", "Terminal", "StackOverflow"],
        correctIndex: 1,
        explanation: "AI Studio is your IDE, compiler, and deployment engine in one."
      }
    ]
  },

  // --- PHASE 1: FOUNDATION ---
  { 
    id: '101', 
    title: "The Architect's Environment", 
    description: "Navigating Google AI Studio & The Deployment Rocket.", 
    xpReward: 100, 
    reputationReward: 10,
    status: 'locked', 
    category: 'foundation',
    isProOnly: false,
    content: `### The Cockpit
We use **Google AI Studio** (formerly MakerSuite) to build and deploy.

### The Workflow
1.  **Prompting:** You don't write code. You write *specifications* (Prompts).
2.  **Previewing:** The AI generates a functional React app in the right pane.
3.  **Deploying:** The "Rocket Icon" in the top right pushes your code to Google Cloud Run.

### No Local Environment
Delete Node.js. Delete Git. You don't need them for the V0.1.`,
    tasks: [
      { id: 't1', text: "Copy this prompt:", codeSnippet: "Create a modern React dashboard for a crypto tracker using Tailwind CSS. Use Lucide icons. Mock data." },
      { id: 't2', text: "Paste into AI Studio and hit Run." }
    ],
    storyScenarios: [
        {
            title: "The Blank Screen",
            situation: "You want to build a To-Do list app. You open AI Studio.",
            options: [
                { text: "Start typing 'import React from react...'", isCorrect: false, feedback: "Stop. You are doing manual labor." },
                { text: "Type: 'Create a To-Do list app with add/delete functionality and persistent local storage.'", isCorrect: true, feedback: "Correct. Let the model do the heavy lifting." }
            ]
        }
    ],
    quiz: [
      {
        question: "Where do you deploy your app in AI Studio?",
        options: ["Terminal command", "The Rocket Icon (Top Right)", "Download ZIP and upload to FTP", "You can't"],
        correctIndex: 1,
        explanation: "The Rocket Icon initiates the Cloud Run deployment sequence."
      }
    ]
  },
  
  // --- PHASE 3: DEPLOYMENT ---
  { 
    id: '301', 
    title: "Ship to Production", 
    description: "Cloud Run, Billing Setup, and Orca Integration.", 
    xpReward: 1000, 
    reputationReward: 100,
    status: 'locked', 
    category: 'growth',
    isProOnly: true,
    content: `### The Deployment Sequence
Turning a prompt into a URL.

### Step-by-Step
1.  **Toolbar:** Click the **Rocket Icon** (Deploy) in AI Studio.
2.  **Project:** Select "Create New Project" (or import existing). Name it relevant to your app.
3.  **Billing:** If prompted, you MUST link a Billing Account.
    *   Go to: [Google Cloud Billing](https://console.cloud.google.com/billing/)
    *   Add a card (Google gives $300 free credit usually).
    *   Return to AI Studio and refresh.
4.  **Redeploy:** Click Deploy again. Wait 2-3 minutes.
5.  **The URL:** You will get a link ending in \`.run.app\`.
6.  **Ship:** Copy that URL, come back to ORCA, and click "Ship to Prod".`,
    tasks: [
        { id: 't1', text: "Set up Billing at console.cloud.google.com/billing" },
        { id: 't2', text: "Deploy App in AI Studio and copy the .run.app URL" }
    ],
    storyScenarios: [
        {
            title: "Deployment Stalled",
            situation: "You clicked deploy, but it says 'Billing Account Required'.",
            options: [
                { text: "Give up.", isCorrect: false, feedback: "Never." },
                { text: "Go to Cloud Console, link your credit card, and retry.", isCorrect: true, feedback: "Correct. Cloud Run is an enterprise service, it needs a billing account (even for the free tier)." }
            ]
        }
    ],
    quiz: [
        {
            question: "What is the domain extension for a Google Cloud Run app?",
            options: [".com", ".run.app", ".google.com", ".vercel.app"],
            correctIndex: 1,
            explanation: "Google Cloud Run services always end in .run.app by default."
        }
    ]
  },

  // --- PHASE 4: MONETIZATION ---
  { 
    id: '401', 
    title: "The Paywall Logic", 
    description: "Prompting for Profit. Injecting Stripe.", 
    xpReward: 600, 
    reputationReward: 50,
    status: 'locked', 
    category: 'growth',
    isProOnly: true,
    content: `### The Checkpoint
You need to prompt the AI to build a gate.

### The Prompt Strategy
Don't write the Stripe integration. Prompt it:
*"Refactor the app to hide the 'Export' feature. Add a 'Upgrade to Pro' button. When clicked, open this Stripe Payment Link: [YOUR_LINK]."*

### The Logic
1.  **Create Link:** Go to Stripe Dashboard -> Products -> Create Payment Link.
2.  **Inject:** Give the URL to Gemini.
3.  **Verify:** Ensure the button redirects correctly.`,
    tasks: [
      { id: 't1', text: "Create a Stripe Payment Link" },
      { id: 't2', text: "Prompt Gemini: 'Add a Pro button that links to [URL]'" }
    ],
    storyScenarios: [
        {
            title: "The Feature Gate",
            situation: "You want to charge for the 'Dark Mode' feature.",
            options: [
                { text: "Prompt: 'Make dark mode cost $5.'", isCorrect: false, feedback: "Too vague. The AI can't process payments magically." },
                { text: "Prompt: 'Disable the Dark Mode toggle. Replace it with a button that opens my Stripe Link.'", isCorrect: true, feedback: "Correct. Simple redirect logic is the easiest MVP monetization." }
            ]
        }
    ],
    quiz: [
      {
        question: "What is the fastest way to monetize a Vibe App?",
        options: ["Build a full cart system", "Stripe Payment Links", "Crypto wallet integration", "AdSense"],
        correctIndex: 1,
        explanation: "Payment Links require zero backend code. Just a URL redirect."
      }
    ]
  },
];

// NEW USERS START WITH 0 APPS
export const INITIAL_APPS: AppProject[] = [];

export const COMMUNITY_LEADERBOARD: CommunityUser[] = [
  { id: 'u1', username: '0xBuilder', reputation: 2450, title: 'Unicorn', avatar: '🦄', shippedApps: 12, isOnline: true },
  { id: 'u2', username: 'SaaS_Queen', reputation: 1890, title: 'Founder', avatar: '👑', shippedApps: 8, isOnline: false },
  { id: 'u3', username: 'AlgoRithm', reputation: 1200, title: 'Architect', avatar: '🤖', shippedApps: 5, isOnline: true },
  { id: 'u4', username: 'BasedDev', reputation: 950, title: 'Builder', avatar: '🛹', shippedApps: 3, isOnline: true },
  { id: 'u5', username: 'Newbie_One', reputation: 120, title: 'Script Kiddie', avatar: '🥚', shippedApps: 1, isOnline: false },
];

export const BOT_CHATTER = [
  "Just shipped v2 to prod!",
  "Crypto is crashing... buying the dip.",
  "Anyone used the new Vibe API yet?",
  "My MRR just hit $500 LFG!",
  "Refactoring legacy code is pain.",
  "Coffee count: 5 cups.",
  "Deployment failed. Rolling back.",
  "Who is awake? Grinding hours.",
  "AI took my bug fixing job lol."
];

export const SYSTEM_INSTRUCTION_GENERATOR = `
You are the Dean of "Vibe Code University".
The user will give you a vague app idea.
Generate a structured JSON Blueprint.
You must provide:
1. Startup name.
2. Punchy description.
3. Simulated "Potential MRR" (500-15000).
4. "Blueprint" object (techStack, coreFeatures, monetizationStrategy, uniModuleRef).
5. A hype comment.
Tone: High-energy, "Indie Hacker" vibes.
`;

export const SYSTEM_INSTRUCTION_REVERSE_ENGINEER = `
You are a "Vibe Coding" Instructor.
The user will provide a "Sector" (e.g., "Real Estate").
Your goal is to create a NO-CODE ACTION PLAN using Google AI Studio.

Output JSON only.

Structure:
1. Identify a "Bleeding Neck" problem in the sector.
2. Propose a "Solution App".
3. Generate a 'customCurriculum': An ARRAY of 5 distinct 'CourseNode' objects.

**CRITICAL INSTRUCTION: The curriculum must be NO-CODE. Do not tell them to use VS Code, Git, or NPM.**

The 5 Modules MUST be exactly this flow:

**Module 1: The Concept & Setup**
- Content: Explain the app idea. Tell them to open [Google AI Studio](https://aistudio.google.com/apps?source=).
- Task 1 Text: "Open AI Studio"
- Task 2 Text: "Copy the System Prompt below"
- Task 2 CodeSnippet: "Act as a Senior React Developer. Build a single-file React app for [App Idea]. Use Tailwind CSS for styling. Use Lucide React for icons. The app should have [Feature 1] and [Feature 2]."

**Module 2: The Interface Build**
- Content: Explain how to iterate in AI Studio.
- Task 1 Text: "Paste the prompt into AI Studio and click Run."
- Task 2 Text: "Ask for refinements"
- Task 2 CodeSnippet: "Make the UI more modern. Use a dark theme with [Color] accents. Add a 'Simulate' button that shows fake data."

**Module 3: The Logic (Vibe Coding)**
- Content: Adding specific logic without writing code.
- Task 1 Text: "Copy the Logic Prompt"
- Task 1 CodeSnippet: "Add functionality to [Specific Feature]. When the user clicks X, calculate Y. Save the history to local storage so it persists on refresh."

**Module 4: Monetization (Stripe)**
- Content: How to gate the value.
- Task 1 Text: "Create a Stripe Payment Link"
- Task 2 Text: "Copy the Paywall Prompt"
- Task 2 CodeSnippet: "Add a 'Go Pro' button in the top right. When clicked, open this link: [Insert Your Stripe Link]. Hide the [Premium Feature] until they click it."

**Module 5: Cloud Deployment**
- Content: The "Ship" phase.
    1. Click the **Rocket Icon** (Deploy) in AI Studio top right.
    2. Select 'Create New Project' -> Name it '[App Name]'.
    3. If asked, click link to **Cloud Console Billing** and add a card.
    4. Refresh and click Deploy.
    5. Copy the resulting \`.run.app\` URL.
- Task 1 Text: "Deploy to Cloud Run via Rocket Icon"
- Task 2 Text: "Paste the .run.app URL into Orca's 'Ship to Prod' terminal."

Each CourseNode MUST have:
- 'storyScenarios': 1 realistic scenario about architectural decisions in AI Studio.
- 'quiz': 1 question about the specific step.
`;

export const SYSTEM_INSTRUCTION_CHAT = `
You are 'VibeArchitect', a senior developer AI.
Role: Supportive co-founder. Use internet slang (ship it, lfg, based).
Constraint: Keep responses under 20 words.
`;

export const SYSTEM_INSTRUCTION_TUTOR = `
You are an expert AI Tutor for Vibe Code University.
Explain concepts clearly.
Context: Google AI Studio, Gemini Models, Cloud Run.
Tone: Educational, precise, yet encouraging.
`;
