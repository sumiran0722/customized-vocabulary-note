import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-R4j0o-Q5rZwdmLIU8cLtheI8rsIJahw",
  authDomain: "jini-c66ca.firebaseapp.com",
  projectId: "jini-c66ca",
  storageBucket: "jini-c66ca.appspot.com",
  messagingSenderId: "452497979741",
  appId: "1:452497979741:web:fabb6015ccb7fb307a10b4",
  measurementId: "G-2JQ3GCG4RJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
