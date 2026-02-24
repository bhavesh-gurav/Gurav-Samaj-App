import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdhJAVLQhyQNMKjveiYqeKQ8Dx1Pcl_oc",
    authDomain: "gurav-samaj-app.firebaseapp.com",
    projectId: "gurav-samaj-app",
    storageBucket: "gurav-samaj-app.firebasestorage.app",
    messagingSenderId: "479696448812",
    appId: "1:479696448812:web:cc97f563edf106beda1089"
};

let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
