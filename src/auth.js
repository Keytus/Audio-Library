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
  loginUsername,
  loginPassword,
  sigupUsername,
  sigupPassword,
  sigupPasswordRepeat,
  btnLogin,
  btnSignup,
  btnLoginForm,
  btnSignupForm,
  btnLogout,
  btnAuthMobile,
  btnLogoutMobile
} from './ui.js'

export const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (user != null) {
    if (window.innerWidth > 361) {
      btnLoginForm.style.display = "none"
      btnSignupForm.style.display = "none"
      btnLogout.style.display = "inline-block"
      btnAuthMobile.style.display = "none"
      btnLogoutMobile.style.display = "none"
    }
    else {
      btnLoginForm.style.display = "none"
      btnSignupForm.style.display = "none"
      btnLogout.style.display = "none"
      btnAuthMobile.style.display = "none"
      btnLogoutMobile.style.display = "block"
    }
    console.log('logged in')
  }
  else {
    if (window.innerWidth > 361) {
      btnLoginForm.style.display = "inline-block"
      btnSignupForm.style.display = "inline-block"
      btnLogout.style.display = "none"
      btnAuthMobile.style.display = "none"
      btnLogoutMobile.style.display = "none"
    }
    else {
      btnLoginForm.style.display = "none"
      btnSignupForm.style.display = "none"
      btnLogout.style.display = "none"
      btnAuthMobile.style.display = "block"
      btnLogoutMobile.style.display = "none"
    }

    console.log('No user');
  }
});

// Login using email/password
const loginEmailPassword = async () => {
  const username = loginUsername.value
  const pwd = loginPassword.value

  try {
    await signInWithEmailAndPassword(auth, username, pwd)
    console.log(`${username} login`)
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
  }
}

const createAccount = async () => {
  const email = sigupUsername.value
  const password = sigupPassword.value
  const password_repeat = sigupPasswordRepeat.value

  try {
    if (password != password_repeat) {
      throw new Error("Passwords not match");;
    }
    await createUserWithEmailAndPassword(auth, email, password)
    console.log(`${email} sign up`)
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
        console.log(`There was an error: ${error}`)
        console.log(`${error.message}`)
    }
  }
}

const logoutAccount = async () => {
  try {
    await auth.signOut()
    console.log(`logout`)
  }
  catch (error) {
    console.log(`There was an error: ${error}`)
  }
}

btnLogin.addEventListener("click", loginEmailPassword)
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logoutAccount)
btnLogoutMobile.addEventListener("click", logoutAccount)
