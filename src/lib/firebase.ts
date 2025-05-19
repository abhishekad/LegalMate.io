
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// For debugging: Log the API key value that is being accessed
console.log('[DEBUG] Firebase Init: NEXT_PUBLIC_FIREBASE_API_KEY =', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('[DEBUG] Firebase Init: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('[DEBUG] Firebase Init: NEXT_PUBLIC_FIREBASE_PROJECT_ID =', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!apiKey) {
  throw new Error(
    "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing. " +
    "Please ensure it is set in your .env.local file and the server has been restarted. " +
    "The value currently received by the application is: " + apiKey
  );
}
if (!authDomain) {
  // Optional: Add similar checks for other critical config values if needed
  console.warn(
    "Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing. " +
    "This might lead to issues. Please check your .env.local file."
  );
}
if (!projectId) {
  console.warn(
    "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing. " +
    "This might lead to issues. Please check your .env.local file."
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
                // Optionally, try to re-render, though often just clearing and re-creating on next attempt is safer.
                // verifier.render().catch((renderError: any) => {
                //    console.error("Error re-rendering recaptcha on expiry:", renderError);
                // });
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
