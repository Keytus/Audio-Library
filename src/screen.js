import {
    btnLoginForm,
    btnSignupForm,
    btnLogout,
    btnAuthMobile,
    btnLogoutMobile
} from './ui.js'

import {
    auth
} from './auth.js'

export const mobileMaxWidth = 360;

window.addEventListener('resize', function () {
    setBtnDisplay();
}, true);

export function setBtnDisplay(){
    if (auth.currentUser != null){
        if (window.innerWidth > mobileMaxWidth){
            desktopBtnLogin();
        }
        else{
            modileBtnLogin();
        }
    }
    else{
        if (window.innerWidth > mobileMaxWidth){
            desktopBtnLogout();
        }
        else{
            modileBtnLogout();
        }
    }
}

function desktopBtnLogin(){
    btnLogout.style.display = "inline-block";
    btnLoginForm.style.display = "none";
    btnSignupForm.style.display = "none";
    btnAuthMobile.style.display = "none";
    btnLogoutMobile.style.display = "none";
}

function desktopBtnLogout(){
    btnLogout.style.display = "none";
    btnLoginForm.style.display = "inline-block";
    btnSignupForm.style.display = "inline-block";
    btnAuthMobile.style.display = "none";
    btnLogoutMobile.style.display = "none";
}

function modileBtnLogin(){
    btnLogoutMobile.style.display = "block";
    btnAuthMobile.style.display = "none";
    btnLoginForm.style.display = "none";
    btnSignupForm.style.display = "none";
    btnLogout.style.display = "none";
}

function modileBtnLogout(){
    btnLogoutMobile.style.display = "none";
    btnAuthMobile.style.display = "block";
    btnLoginForm.style.display = "none";
    btnSignupForm.style.display = "none";
    btnLogout.style.display = "none";
}