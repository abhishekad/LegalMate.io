
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// For debugging: Log the values that are being accessed
console.log('[DEBUG] Firebase Init: NEXT_PUBLIC_FIREBASE_API_KEY =', apiKey);
console.log('[DEBUG] Firebase Init: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =', authDomain);
console.log('[DEBUG] Firebase Init: NEXT_PUBLIC_FIREBASE_PROJECT_ID =', projectId);

if (!apiKey || !authDomain || !projectId) {
  const missingVars = [];
  if (!apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY (current value: " + apiKey + ")");
  if (!authDomain) missingVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (current value: " + authDomain + ")");
  if (!projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID (current value: " + projectId + ")");

  throw new Error(
    `Critical Firebase configuration variables are missing or undefined: [${missingVars.join(', ')}]. \n` +
    "ACTION REQUIRED: \n" +
    "1. Check Firebase Studio's UI: Look for a section like 'Environment Variables', 'Secrets', or 'Configuration' in your Firebase Studio project settings. This is the MOST LIKELY place to define these for your Studio's development server. \n" +
    "2. Define All Required Keys: Ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, and other NEXT_PUBLIC_FIREBASE_... keys (like STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID) are correctly set there with values from your Firebase project (You can find these in Firebase Console > Project settings (gear icon) > General tab > Your apps > Web app > Config). \n" +
    "3. Restart Studio Server: After setting/updating variables in Firebase Studio, you MUST restart or refresh/redeploy your development server/instance through the Studio's interface for changes to apply. \n" +
    "4. If Studio uses .env.local: If Firebase Studio is expected to use a .env.local file (check Studio's documentation), ensure it's in your project root, correctly formatted (e.g., NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY), and you've restarted the server. However, Studio's UI for env vars often takes precedence. \n" +
    "This error originates from the checks in src/lib/firebase.ts."
  );
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// Function to initialize RecaptchaVerifier (must be called on client-side)
const initializeRecaptchaVerifier = (containerId: string) => {
  if (typeof window !== 'undefined') {
    // Ensure it runs only on the client
    // Check if verifier already exists to avoid re-creation
    if (!(window as any).recaptchaVerifierInstance) {
      (window as any).recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // console.log('reCAPTCHA expired');
          if ((window as any).recaptchaVerifierInstance) {
             // Attempt to clear the verifier and re-render.
            try {
                const verifier = (window as any).recaptchaVerifierInstance as RecaptchaVerifier;
                verifier.clear(); // Clear the verifier first
                // Nullify the instance so it gets re-created on next call
                (window as any).recaptchaVerifierInstance = null;
                const recaptchaContainer = document.getElementById(containerId);
                if (recaptchaContainer) {
                    recaptchaContainer.innerHTML = ''; // Clear out the DOM element
                }

            } catch (clearError) {
                console.error("Error clearing or re-rendering recaptcha verifier on expiry:", clearError);
            }
          }
        },
      });
    }
    return (window as any).recaptchaVerifierInstance;
  }
  return null;
};


export { app, auth, initializeRecaptchaVerifier };
