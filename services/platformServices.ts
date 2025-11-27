
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updatePassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

import { UserProfile, PortfolioSettings, AppProject, CourseNode } from "../types";
import { DEFAULT_PORTFOLIO, UNIVERSITY_CURRICULUM } from "../constants";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAKwogpO2vVlggKNwJAZPPZi_1nB31Xskc",
  authDomain: "orca-command-center.firebaseapp.com",
  projectId: "orca-command-center",
  storageBucket: "orca-command-center.firebasestorage.app",
  messagingSenderId: "30780095732",
  appId: "1:30780095732:web:677b93504292a6290732a1",
  measurementId: "G-K0XJCGM8X7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// --- AUTH SERVICE ---
export const AuthService = {
  // Sign Up
  register: async (email: string, password: string): Promise<UserProfile> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create initial user profile in Firestore
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      username: email.split('@')[0], // Default username
      isPro: false, // Default to free
      joinedAt: Date.now(),
      reputation: 0,
      title: 'Script Kiddie',
      shippedApps: 0,
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
    };

    await DatabaseService.createUserDocument(newUserProfile);
    return newUserProfile;
  },

  // Login
  login: async (email: string, password: string): Promise<UserProfile> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await DatabaseService.getUserProfile(userCredential.user.uid);
    // If for some reason profile doesn't exist (legacy auth), create it
    if (!profile) {
        const newUserProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          emailVerified: userCredential.user.emailVerified,
          username: email.split('@')[0],
          isPro: false,
          joinedAt: Date.now(),
          reputation: 0,
          title: 'Script Kiddie',
          shippedApps: 0,
          photoURL: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userCredential.user.uid}`
        };
        await DatabaseService.createUserDocument(newUserProfile);
        return newUserProfile;
    }
    return { ...profile, emailVerified: userCredential.user.emailVerified };
  },

  // Google Login
  loginWithGoogle: async (): Promise<UserProfile> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if profile exists, if not create it
    let profile = await DatabaseService.getUserProfile(user.uid);
    if (!profile) {
      profile = {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified,
        username: user.displayName ? user.displayName.replace(/\s+/g, '_').toLowerCase() : user.email?.split('@')[0] || 'Anon',
        isPro: false,
        joinedAt: Date.now(),
        reputation: 0,
        title: 'Script Kiddie',
        shippedApps: 0,
        photoURL: user.photoURL || undefined
      };
      await DatabaseService.createUserDocument(profile);
    }
    return { ...profile, emailVerified: user.emailVerified };
  },

  // Logout
  logout: async () => {
    await signOut(auth);
  },

  // Password Reset
  sendPasswordReset: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  // Update Password
  updateUserPassword: async (newPassword: string) => {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
    } else {
      throw new Error("No user logged in");
    }
  },

  // Verify Email
  sendVerificationEmail: async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  },

  // Auth State Listener
  observeUser: (callback: (user: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await DatabaseService.getUserProfile(firebaseUser.uid);
        // If profile missing (race condition on creation), fallback to basic data
        if (profile) {
            callback({
                ...profile,
                emailVerified: firebaseUser.emailVerified
            });
        } else {
             // Temporary basic profile until DB fetch or creation syncs
            callback({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                emailVerified: firebaseUser.emailVerified,
                username: firebaseUser.displayName || 'Explorer',
                isPro: false,
                joinedAt: Date.now(),
                reputation: 0,
                title: 'Loading...',
                shippedApps: 0
            });
        }
      } else {
        callback(null);
      }
    });
  }
};

// --- DATABASE SERVICE (FIRESTORE) ---
export const DatabaseService = {
  // Initialize User Data
  createUserDocument: async (profile: UserProfile) => {
    const userRef = doc(db, "users", profile.uid);
    const portfolioRef = doc(db, `users/${profile.uid}/data`, "portfolio");
    const curriculumRef = doc(db, `users/${profile.uid}/data`, "curriculum");

    await Promise.all([
        setDoc(userRef, profile, { merge: true }),
        // Initialize default portfolio if not exists
        setDoc(portfolioRef, { ...DEFAULT_PORTFOLIO, founderName: profile.username }, { merge: true }),
        // Initialize default curriculum
        setDoc(curriculumRef, { nodes: UNIVERSITY_CURRICULUM }, { merge: true })
    ]);
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  },

  updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
    await updateDoc(doc(db, "users", uid), data);
  },

  // Apps
  getApps: async (userId: string): Promise<AppProject[]> => {
    const appsRef = collection(db, `users/${userId}/apps`);
    const snapshot = await getDocs(appsRef);
    const apps = snapshot.docs.map(doc => doc.data() as AppProject);
    // Sort by createdAt descending
    return apps.sort((a, b) => b.createdAt - a.createdAt);
  },

  saveApps: async (userId: string, apps: AppProject[]) => {
    // Loop and save. For production, batch writes or only saving changed is better.
    for (const app of apps) {
        await setDoc(doc(db, `users/${userId}/apps`, app.id), app);
    }
  },

  deleteApp: async (userId: string, appId: string) => {
      await deleteDoc(doc(db, `users/${userId}/apps`, appId));
  },

  // Portfolio Settings
  getPortfolio: async (userId: string): Promise<PortfolioSettings> => {
    const snap = await getDoc(doc(db, `users/${userId}/data`, "portfolio"));
    return snap.exists() ? snap.data() as PortfolioSettings : DEFAULT_PORTFOLIO;
  },

  savePortfolio: async (userId: string, settings: PortfolioSettings) => {
    await setDoc(doc(db, `users/${userId}/data`, "portfolio"), settings);
  },

  // Curriculum
  getCurriculum: async (userId: string): Promise<CourseNode[]> => {
    const snap = await getDoc(doc(db, `users/${userId}/data`, "curriculum"));
    if (snap.exists()) {
        const data = snap.data();
        // Merge with latest CURRICULUM constant to ensure new content updates appear for existing users
        const userNodes = data.nodes as CourseNode[];
        return userNodes;
    }
    return UNIVERSITY_CURRICULUM;
  },

  saveCurriculum: async (userId: string, nodes: CourseNode[]) => {
    await setDoc(doc(db, `users/${userId}/data`, "curriculum"), { nodes });
  },

  // Public Profile
  getPublicProfile: async (username: string): Promise<{user: UserProfile, apps: AppProject[], portfolio: PortfolioSettings} | null> => {
     // Query users collection where username == username
     const q = query(collection(db, "users"), where("username", "==", username));
     const querySnapshot = await getDocs(q);
     
     if (!querySnapshot.empty) {
         const userDoc = querySnapshot.docs[0];
         const user = userDoc.data() as UserProfile;
         
         // Parallel fetch
         const [apps, portfolio] = await Promise.all([
             DatabaseService.getApps(user.uid),
             DatabaseService.getPortfolio(user.uid)
         ]);
         
         return { user, apps, portfolio };
     }
     return null; 
  }
};

// --- STORAGE SERVICE ---
export const StorageService = {
    uploadProfileImage: async (userId: string, file: File): Promise<string> => {
        const storageRef = ref(storage, `users/${userId}/profile_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    }
};

// --- PAYMENT SERVICE (Mock for now) ---
export const PaymentService = {
  createCheckoutSession: async (userId: string, priceId: string) => {
    console.log(`[Stripe] Creating session for ${userId} item ${priceId}`);
    return { url: window.location.href }; 
  },

  subscribeToCreator: async (creatorId: string, amount: number) => {
    console.log(`[Stripe Connect] Transferring $${amount} to ${creatorId}`);
    return { success: true };
  }
};

// --- EMAIL SERVICE (Mock) ---
export const EmailService = {
  sendContactEmail: async (toEmail: string, fromEmail: string, message: string) => {
    console.log(`[SendGrid] Sending email to ${toEmail} from ${fromEmail}: ${message}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
};
