let currentForm = null;
let isOpen = false;
let canClose = false;

function openForm(formName) {
    closeCurrentForm()
    document.getElementById(formName).style.display = "flex";
    currentForm = formName;
    isOpen = true;
}

function closeFrom(formName) {
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