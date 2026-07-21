import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

let appInitialized = false;

if (getApps().length === 0) {
  try {
    const serviceAccount = require('./firebase-service-account.json');
    initializeApp({
      credential: cert(serviceAccount),
    });
    appInitialized = true;
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
  appInitialized = true;
}

export const db = (appInitialized && process.env.ENABLE_FIREBASE_FIRESTORE === 'true') ? getFirestore() : null;
export const messaging = appInitialized ? getMessaging() : null;


