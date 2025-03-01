// Firebase Configuration and Initialization
// Reemplaza los valores de configuración con los de tu proyecto de Firebase

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);

// Obtener las referencias de Firebase para Firestore
const db = firebase.firestore();
const auth = firebase.auth();

// Función de autenticación para inicio de sesión
function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Usuario autenticado', userCredential.user);
      window.location.href = "admin-dashboard.html"; // Redirigir al panel de administración
    })
    .catch(error => {
      alert('Error: ' + error.message);
    });
}

// Función de registro de usuario para administradores
function register(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Usuario registrado', userCredential.user);
    })
    .catch(error => {
      alert('Error: ' + error.message);
    });
}