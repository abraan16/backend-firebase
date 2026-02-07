
import admin from 'firebase-admin';

// Cargar la variable de entorno
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

try {
  const serviceAccount = JSON.parse(serviceAccountString);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
    if (error.code === 'app/duplicate-app') {
        console.log('Firebase app already initialized.');
    } else {
        console.error('Error initializing Firebase Admin:', error);
        throw error;
    }
}

const db = admin.firestore();
export default db;
