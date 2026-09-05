import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';
import path from 'path';

let appInitialized = false;

if (getApps().length === 0) {
  try {
    let serviceAccount: any = null;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", e);
      }
    } else {
      try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'firebase-service-account.json');
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          serviceAccount = JSON.parse(content);
        }
      } catch (e) {
        // Silently skip if service account file is not available in build environment
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      appInitialized = true;
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
  appInitialized = true;
}

export const db = (appInitialized && process.env.ENABLE_FIREBASE_FIRESTORE === 'true') ? getFirestore() : null;
export const messaging = appInitialized ? getMessaging() : null;
