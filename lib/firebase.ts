import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcH7M-008RntHA6e7UVn-RhVqKlOeEEKk",
  authDomain: "etsy-manager-pro.firebaseapp.com",
  projectId: "etsy-manager-pro",
  storageBucket: "etsy-manager-pro.firebasestorage.app",
  messagingSenderId: "377444646905",
  appId: "1:377444646905:web:f429d4ced2075d291d8728",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;