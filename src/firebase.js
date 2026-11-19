import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNgfkaRukPh4jCI5MWHzGVbkNQTPXVfV0",
  authDomain: "polideportivo-demo.firebaseapp.com",
  projectId: "polideportivo-demo",
  appId: "1:752805328902:web:13866b649fe5fe5f15ab87",
};

const fb = initializeApp(firebaseConfig);
export const auth = getAuth(fb);
export const db = getFirestore(fb);
