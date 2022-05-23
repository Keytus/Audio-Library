import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

import {
  app
} from './fb-initial.js'

import {
  setBtnDisplay
} from './screen.js'

import {
  loginUsername,
  loginPassword,
  sigupUsername,
  sigupPassword,
  sigupPasswordRepeat,
  btnLogin,
  btnSignup,
  btnLogout,
  btnLogoutMobile
} from './ui.js'

import {
  closeFrom
} from './forms.js'

export const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  setBtnDisplay();
});

// Login using email/password
const loginEmailPassword = async () => {
  const username = loginUsername.value;
  const pwd = loginPassword.value;

  try {
    await signInWithEmailAndPassword(auth, username, pwd)
    console.log(`${username} login`)
    return true;
  }
  catch (error) {
    switch (error.message) {
      case 'Firebase: Error (auth/invalid-email).':
        alert(`Invalid email`)
        break
      case 'Firebase: Error (auth/wrong-password).':
        alert(`Wrong password`)
        break
      default:
        console.log(`There was an error: ${error}`)
    }
    return false;
  }
}

const createAccount = async () => {
  const email = sigupUsername.value;
  const password = sigupPassword.value;
  const password_repeat = sigupPasswordRepeat.value;

  try {
    if (password != password_repeat) {
      throw new Error("Passwords not match");
    }
    await createUserWithEmailAndPassword(auth, email, password);
    console.log(`${email} sign up`);
    return true;
  }
  catch (error) {
    switch (error.message) {
      case 'Firebase: Error (auth/invalid-email).':
        alert(`Invalid email`)
        break
      case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
        alert(`Password should be at least 6 characters.`)
        break
      case 'Passwords not match':
        alert(`Passwords not match`)
        break
      case 'Firebase: Error (auth/email-already-in-use).':
        alert(`Email already used`)
        break
      default:
        console.log(`There was an error: ${error}`);
        console.log(`${error.message}`);
    }
    return false;
  }
}

const logoutAccount = async () => {
  try {
    await auth.signOut();
    console.log(`logout`);
  }
  catch (error) {
    console.log(`There was an error: ${error}`);
  }
}

btnLogin.addEventListener("click", function () {
  if(loginEmailPassword()){
    closeFrom('loginForm');
  }
});
btnSignup.addEventListener("click", function () {
  if(createAccount()){
    closeFrom('signUpForm');
  }
});

btnLogout.addEventListener("click", logoutAccount);
btnLogoutMobile.addEventListener("click", logoutAccount);
