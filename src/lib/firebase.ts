import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "gym-hiit-app.firebaseapp.com",
  projectId: "gym-hiit-app",
  storageBucket: "gym-hiit-app.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c441d5c4c2e2e8dd36a671"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);