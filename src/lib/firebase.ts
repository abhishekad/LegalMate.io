
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// For debugging: Log the API key value that is being accessed
console.log('[DEBUG] Attempting to use Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('[DEBUG] Attempting to use Firebase Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('[DEBUG] Attempting to use Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
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
            (window as any).recaptchaVerifierInstance.render().then((widgetId: any) => {
              if (typeof grecaptcha !== 'undefined' && grecaptcha.reset && widgetId) {
                grecaptcha.reset(widgetId);
              }
            }).catch((renderError: any) => {
                console.error("Error re-rendering recaptcha on expiry:", renderError);
            });
          }
        },
      });
    }
    return (window as any).recaptchaVerifierInstance;
  }
  return null;
};


export { app, auth, initializeRecaptchaVerifier };

