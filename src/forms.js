import {
    btnLoginForm,
    btnSignupForm,
    btnAuthMobile,
    btnNavPanel,
    btnAddTrack,
    btnAuthMobileLogin,
    btnAuthMobileSignUp,
    page
} from './ui.js'

let currentForm = null;
let isOpen = false;
let canClose = false;

export function openForm(formName) {
    closeCurrentForm()
    document.getElementById(formName).style.display = "flex";
    currentForm = formName;
    isOpen = true;
}

export function closeFrom(formName) {
    document.getElementById(formName).style.display = "none";
    currentForm = null;
    isOpen = false
    canClose = false
}

function closeCurrentForm() {
    if (isOpen) {
        if (canClose) {
            document.getElementById(currentForm).style.display = "none";
            isOpen = false;
            canClose = false;
        }
        else {
            canClose = true;
        }
    }
}

page.addEventListener("click", closeCurrentForm);
btnLoginForm.addEventListener("click", function () {
    openForm('loginForm');
});
btnSignupForm.addEventListener("click", function () {
    openForm('signUpForm');
});
btnAuthMobile.addEventListener("click", function () {
    openForm('loginSignUpForm');
});
btnNavPanel.addEventListener("click", function () {
    openForm('navPanel');
});
btnAddTrack.addEventListener("click", function () {
    closeFrom('addForm');
});
btnAuthMobileLogin.addEventListener("click", function () {
    openForm('loginForm');
});
btnAuthMobileSignUp.addEventListener("click", function () {
    openForm('signUpForm');
});

