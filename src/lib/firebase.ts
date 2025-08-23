
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCf_lZafZ-z6dV-VPx6JXeYL37JEFHYkOY",
  authDomain: "futo-clearance-portal.firebaseapp.com",
  projectId: "futo-clearance-portal",
  storageBucket: "futo-clearance-portal.appspot.com",
  messagingSenderId: "546044918552",
  appId: "1:546044918552:web:c3572fb1ff6495af463c6d"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, app };
