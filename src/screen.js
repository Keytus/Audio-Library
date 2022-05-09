import {
    btnLoginForm,
    btnSignupForm,
    btnLogout,
    btnAuthMobile,
    btnLogoutMobile
} from './ui.js'

let lastWidth = window.innerWidth

window.addEventListener('resize', function () {
    if (window.innerWidth > 361 && lastWidth < 361) {
        lastWidth = window.innerWidth
        changeBtnDisplay()
    }
    else if (window.innerWidth < 361 && lastWidth > 361) {
        lastWidth = window.innerWidth
        changeBtnDisplay()
    }
}, true);

function changeBtnDisplay(){
    if (lastWidth > 361) {
        if (btnLogoutMobile.style.display === 'block') {
            btnLogout.style.display = "inline-block"
            btnLoginForm.style.display = "none"
            btnSignupForm.style.display = "none"
        }
        else {
            btnLogout.style.display = "none"
            btnLoginForm.style.display = "inline-block"
            btnSignupForm.style.display = "inline-block"
        }
        btnAuthMobile.style.display = "none"
        btnLogoutMobile.style.display = "none"
    }
    else {
        if (btnLogout.style.display === 'inline-block') {
            btnLogoutMobile.style.display = "block"
            btnAuthMobile.style.display = "none"
        }
        else {
            btnLogoutMobile.style.display = "none"
            btnAuthMobile.style.display = "block"
        }
        btnLoginForm.style.display = "none"
        btnSignupForm.style.display = "none"
        btnLogout.style.display = "none"
    }
}