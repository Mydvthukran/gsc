// Firebase configuration and initialization
// Replace these placeholder values with your actual Firebase project credentials
// Go to: https://console.firebase.google.com -> Project Settings -> General -> Your Apps -> Firebase SDK snippet

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// ========================================
// REPLACE THESE WITH YOUR CREDENTIALS
// ========================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if Firebase is configured with real credentials
const isFirebaseConfigured = !firebaseConfig.apiKey.includes('YOUR_');

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
} else {
  console.log('Firebase not configured — running in demo mode. Replace credentials in src/utils/firebase.js');
}

// ---- Authentication Helpers ----

export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    console.log('Demo mode: Simulating Google Sign-In');
    return {
      user: {
        uid: 'demo-user-001',
        displayName: 'Demo User',
        email: 'demo@optichain.app',
        photoURL: null
      }
    };
  }
  return signInWithPopup(auth, googleProvider);
}

export async function logOut() {
  if (!auth) {
    console.log('Demo mode: Simulating sign-out');
    return;
  }
  return signOut(auth);
}

export function onAuthChange(callback) {
  if (!auth) {
    // Demo mode: simulate a logged-out state
    setTimeout(() => callback(null), 100);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ---- Firestore Helpers ----

export async function saveToFirestore(collectionName, docId, data) {
  if (!db) {
    console.log(`Demo mode: Would save to ${collectionName}/${docId}`, data);
    return;
  }
  return setDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function getCollection(collectionName) {
  if (!db) {
    console.log(`Demo mode: Would fetch ${collectionName}`);
    return [];
  }
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeToCollection(collectionName, callback, limitCount = 50) {
  if (!db) {
    console.log(`Demo mode: Would subscribe to ${collectionName}`);
    callback([]);
    return () => {};
  }
  const q = query(collection(db, collectionName), orderBy('updatedAt', 'desc'), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}

// Export instances for direct use if needed
export { app, auth, db, isFirebaseConfigured };
