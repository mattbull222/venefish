import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The .replace handles the newline characters in the string
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin Initialised Successfully");
  } catch (error: any) {
    console.error("Firebase Admin Initialization Error:", error.stack);
  }
}

const adminDb = admin.firestore();
export { adminDb };