import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

import {
    auth
} from './auth.js'

import {
    navPanel,
    navPanelForm,
    audioItems
} from './ui.js'

import {
    genresQuery,
    tracksQuery
} from './db.js'

import {
    startPlayer
} from './play.js'

import {
    storage
} from './storage.js'

import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

export let currentGenre = null

async function fillBookcase(genre) {
    while (audioItems.firstChild) {
        audioItems.removeChild(audioItems.lastChild);
    }
    tracksQuery.forEach((doc) => {
        if (doc.data().genre === genre) {
            addAudioItem(doc)
        }
    });
    if (auth.currentUser != null) {
        appendAddTrack()
    }
}

export async function addAudioItem(doc) {
    let figureElem = document.createElement("figure");
    figureElem.classList.add('audio-item')

    figureElem.addEventListener("click", function () {
        startPlayer(doc);
    })

    let audioNameElem = document.createElement("marquee")
    let audioName = document.createTextNode(doc.data().audioName);
    audioNameElem.classList.add('audio-item__audio-name')
    audioNameElem.classList.add('audio-item__audio-name_font')
    audioNameElem.behavior = "scroll"
    audioNameElem.direction = "left"
    audioNameElem.scrollAmount = "1"
    audioNameElem.appendChild(audioName)
    figureElem.appendChild(audioNameElem)

    let authorNameElem = document.createElement("marquee")
    let authorName = document.createTextNode(doc.data().authorName);
    authorNameElem.classList.add('audio-item__author-name')
    authorNameElem.classList.add('audio-item__author-name_font')
    authorNameElem.behavior = "scroll"
    authorNameElem.direction = "left"
    authorNameElem.scrollAmount = "1"
    authorNameElem.appendChild(authorName)
    figureElem.appendChild(authorNameElem)

    let usernameElem = document.createElement("marquee")
    let username = document.createTextNode(doc.data().username)
    usernameElem.classList.add('audio-item__username')
    usernameElem.classList.add('audio-item__username_font')
    usernameElem.behavior = "scroll"
    usernameElem.direction = "left"
    usernameElem.scrollAmount = "1"
    usernameElem.appendChild(username)
    figureElem.appendChild(usernameElem)

    
    let audioImageElem = document.createElement("img")
    audioImageElem.alt = doc.data().audioName
    let spaceRef = ref(storage, doc.data().imagePath);
    getDownloadURL(spaceRef).then(downloadURL => {
        audioImageElem.src = downloadURL;
      })
    audioImageElem.classList.add('audio-item__image')
    figureElem.appendChild(audioImageElem)

    audioItems.appendChild(figureElem)
}

export function appendAddTrack() {
    if (document.getElementById("addTrack") == null && currentGenre != null) {
        let addItemElem = document.createElement("div");
        addItemElem.classList.add('audio-item')
        addItemElem.id = "addTrack"

        let addItemBtn = document.createElement("button");
        addItemBtn.addEventListener("click", function () {
            openForm('AddForm');
        })
        addItemBtn.classList.add('audio-item__add-button')

        addItemElem.appendChild(addItemBtn)

        audioItems.appendChild(addItemElem)
    }
}

export function removeAddTrack() {
    if (document.getElementById("addTrack") != null) {
        let element = document.getElementById("addTrack");
        element.parentNode.removeChild(element);
    }
}

genresQuery.forEach((doc) => {
    let liElem = document.createElement("li");
    let linkElem = document.createElement("a");
    let text = document.createTextNode(doc.data().genreName);
    linkElem.classList.add('navigation-panel-genres__item')
    linkElem.classList.add('navigation-panel-genres__item_font')
    linkElem.appendChild(text)
    liElem.append(linkElem)

    liElem.addEventListener("click", function () {
        currentGenre = doc.data().genreName
        fillBookcase(doc.data().genreName);
    })

    let linkElemCopy = liElem.cloneNode(true)

    linkElemCopy.addEventListener("click", function () {
        fillBookcase(doc.data().genreName);
    })

    navPanel.appendChild(liElem)
    navPanelForm.appendChild(linkElemCopy)
});

onAuthStateChanged(auth, user => {
    if (user) {
        appendAddTrack()
    }
    else {
        removeAddTrack()
    }
});

