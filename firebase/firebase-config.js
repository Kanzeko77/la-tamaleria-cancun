// firebase-config.js
import firebase from 'firebase/app';
import 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Obtener la referencia a la base de datos de Firestore
const db = firebase.firestore();

export default db;