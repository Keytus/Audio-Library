import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA-sLjm7J-viLBYpdz_tLatpj5JllNWwYo",
  authDomain: "audio-library-73d4b.firebaseapp.com",
  projectId: "audio-library-73d4b",
  storageBucket: "audio-library-73d4b.appspot.com",
  messagingSenderId: "639482604136",
  appId: "1:639482604136:web:6bec5633e46f70d147a9dd"
};

export const app = initializeApp(firebaseConfig);