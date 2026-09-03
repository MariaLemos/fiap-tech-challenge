import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { Platform } from "react-native";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | null = null;
let auth: FirebaseAuth.Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  const getReactNativePersistence = (
    FirebaseAuth as typeof FirebaseAuth & {
      getReactNativePersistence?: (storage: typeof AsyncStorage) => FirebaseAuth.Persistence;
    }
  ).getReactNativePersistence;

  try {
    auth =
      Platform.OS !== "web" && getReactNativePersistence
        ? FirebaseAuth.initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
          })
        : FirebaseAuth.getAuth(app);
  } catch {
    auth = FirebaseAuth.getAuth(app);
  }

  db = getFirestore(app);
  storage = getStorage(app);
}

export const firebaseAuth = auth;
export const firebaseDb = db;
export const firebaseStorage = storage;
