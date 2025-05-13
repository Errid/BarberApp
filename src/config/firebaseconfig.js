// src/config/firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHSBzoX-rsm3_0Fdr2cwsXJm7xnBUWA0Y",
  authDomain: "barber-app-df059.firebaseapp.com",
  projectId: "barber-app-df059",
  storageBucket: "barber-app-df059.appspot.com",
  messagingSenderId: "355462308678",
  appId: "1:355462308678:web:d9a6d5c819963296147b47"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase
export const auth = firebase.auth();
export const db = firebase.firestore();
