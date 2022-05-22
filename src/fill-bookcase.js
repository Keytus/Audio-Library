import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

import {
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import {
    auth
} from './auth.js'

import {
    navPanelGenres,
    audioItems,
    bookcase,
    footer
} from './ui.js'

import {
    genresQuery,
    tracksQuery,
    updateTracksQuery,
    updateGenresQuery
} from './db.js'

import {
    startPlayer
} from './play.js'

import {
    storage
} from './storage.js'

import {
    openForm
} from './forms.js'

import {
    mobileMaxWidth
} from './screen.js'


import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

export let currentGenre = null;
let pressTimer;
let isDelete = false;
const headerHeight = 50;
const genreHeaderHeight = 60;
const desktopBookcaseDefaultSize = 20;
const desktopBookshelfSize = 5;
const desktopBookshelfHeight = 200;
const mobileBookcaseDefaultSize = 8;
const mobileBookshelfSize = 2;
const mobileBookshelfHeight = 140;

async function fillBookcase(genre) {
    while (audioItems.firstChild) {
        audioItems.removeChild(audioItems.lastChild);
    }
    tracksQuery.forEach((doc) => {
        if (doc.data().genre === genre) {
            addAudioItem(doc);
        }
    });
    if (auth.currentUser != null) {
        appendAddTrack();
    }
}

async function deleteTrack(doc) {
    isDelete = confirm("Delete track?");
    if (isDelete) {
        deleteDoc(doc.ref);
        genresQuery.forEach(async (genre) => {
            if (genre.data().genreName === currentGenre) {
                updateDoc(genre.ref, { count: genre.data().count -= 1 });
            }
        });
        await updateGenresQuery();
        await updateTracksQuery();
        fillBookcase(currentGenre);
    }
}

export async function addAudioItem(doc) {
    let figureElem = document.createElement("figure");
    figureElem.classList.add('audio-item');

    figureElem.addEventListener("mouseup", function () {
        clearTimeout(pressTimer);
        return false;
    });

    figureElem.addEventListener("mousedown", function () {
        pressTimer = window.setTimeout(function () {
            deleteTrack(doc);
        }, 2000);
        return false;
    });

    figureElem.addEventListener("click", function () {
        if (!isDelete) {
            startPlayer(doc);
        }
    })

    let audioNameElem = document.createElement("marquee");
    let audioName = document.createTextNode(doc.data().audioName);
    audioNameElem.classList.add('audio-item__audio-name');
    audioNameElem.classList.add('audio-item__audio-name_font');
    audioNameElem.behavior = "scroll";
    audioNameElem.direction = "left";
    audioNameElem.scrollAmount = "1";
    audioNameElem.appendChild(audioName);
    figureElem.appendChild(audioNameElem);

    let authorNameElem = document.createElement("marquee");
    let authorName = document.createTextNode(doc.data().authorName);
    authorNameElem.classList.add('audio-item__author-name');
    authorNameElem.classList.add('audio-item__author-name_font');
    authorNameElem.behavior = "scroll";
    authorNameElem.direction = "left";
    authorNameElem.scrollAmount = "1";
    authorNameElem.appendChild(authorName);
    figureElem.appendChild(authorNameElem);

    let usernameElem = document.createElement("marquee");
    let username = document.createTextNode(doc.data().username);
    usernameElem.classList.add('audio-item__username');
    usernameElem.classList.add('audio-item__username_font');
    usernameElem.behavior = "scroll";
    usernameElem.direction = "left";
    usernameElem.scrollAmount = "1";
    usernameElem.appendChild(username);
    figureElem.appendChild(usernameElem);


    let audioImageElem = document.createElement("img");
    audioImageElem.alt = doc.data().audioName;
    let spaceRef = ref(storage, doc.data().imagePath);
    getDownloadURL(spaceRef).then(downloadURL => {
        audioImageElem.src = downloadURL;
    });
    audioImageElem.classList.add('audio-item__image');
    figureElem.appendChild(audioImageElem);

    audioItems.appendChild(figureElem);
}

export function appendAddTrack() {
    if (document.getElementById("addTrack") == null && currentGenre != null) {
        let addItemElem = document.createElement("div");
        addItemElem.classList.add('audio-item');
        addItemElem.id = "addTrack";

        let addItemBtn = document.createElement("button");
        addItemBtn.addEventListener("click", function () {
            openForm('addForm');
        })
        addItemBtn.classList.add('audio-item__add-button');
        addItemElem.appendChild(addItemBtn);

        audioItems.appendChild(addItemElem);
    }
}

export function removeAddTrack() {
    if (document.getElementById("addTrack") != null) {
        let element = document.getElementById("addTrack");
        element.parentNode.removeChild(element);
    }
}

export function resizeBookcase(trackCount) {
    let bookshelfCount;
    let newBookcaseHeight;
    if (window.innerWidth > mobileMaxWidth) {
        if (trackCount >= desktopBookcaseDefaultSize) {
            bookshelfCount = Math.ceil(trackCount / desktopBookshelfSize);
            newBookcaseHeight = bookshelfCount * desktopBookshelfHeight;
        }
    }
    else {
        if (trackCount >= mobileBookcaseDefaultSize) {
            bookshelfCount = Math.ceil(trackCount / mobileBookshelfSize);
            newBookcaseHeight = bookshelfCount * mobileBookshelfHeight;
        }
    }
    bookcase.style.height = newBookcaseHeight + "px";
    navPanelGenres.style.minHeight = newBookcaseHeight - genreHeaderHeight + "px";
    footer.style.height = footer.parentElement.clientWidth - (headerHeight + newBookcaseHeight);
}

genresQuery.forEach((doc) => {
    let liElem = document.createElement("li");
    let linkElem = document.createElement("a");
    let text = document.createTextNode(doc.data().genreName);
    linkElem.classList.add('navigation-panel-genres__item');
    linkElem.classList.add('navigation-panel-genres__item_font');
    linkElem.appendChild(text);
    liElem.append(linkElem);

    liElem.addEventListener("click", function () {
        currentGenre = doc.data().genreName;
        resizeBookcase(doc.data().count);
        fillBookcase(doc.data().genreName);
    })

    navPanelGenres.appendChild(liElem);
});

onAuthStateChanged(auth, user => {
    if (user) {
        appendAddTrack();
    }
    else {
        removeAddTrack();
    }
});

