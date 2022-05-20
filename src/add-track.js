import {
    collection,
    addDoc,
    updateDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import {
    audioNameInput,
    authorNameInput,
    imageInput,
    audioInput,
    btnAddTrack
} from './ui.js'

import {
    db,
    genresQuery,
    updateTracksQuery
} from './db.js'

import {
    auth
} from './auth.js'

import {
    addAudioItem,
    appendAddTrack,
    removeAddTrack,
    currentGenre
} from './fill-bookcase.js'

import {
    storage
} from './storage.js'

import {ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

function validImageFileType(file) {
    let validImageTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ]
    for (var i = 0; i < validImageTypes.length; i++) {
        if (file.type === validImageTypes[i]) {
            return true;
        }
    }
    return false;
}

async function addTrack() {

    try {
        if (imageInput.files.length == 0) {
            alert("No image selected")
            return
        }
        if (audioInput.files.length == 0) {
            alert("No audio selected")
            return
        }
        if (!validImageFileType(imageInput.files[0])) {
            alert("Invalid image")
            return
        }
        if (audioInput.files[0].type != 'audio/mpeg') {
            alert("Invalid audio")
            return
        }
        if (audioNameInput.value.length == 0) {
            alert("Empty audio name")
            return
        }
        if (authorNameInput.value.length == 0) {
            alert("Empty author")
            return
        }
    }
    catch (error) {
        console.log(error)
    }

    let storageRef = ref(storage, "audio/"+audioInput.files[0].name);
    await uploadBytes(storageRef, audioInput.files[0]).then((snapshot) => {
        console.log('Uploaded audio');
    });

    storageRef = ref(storage, "images/"+imageInput.files[0].name);
    await uploadBytes(storageRef, imageInput.files[0]).then((snapshot) => {
        console.log('Uploaded image');
    });


    try {
        let docRef = addDoc(collection(db, "Tracks"), {
            audioName: audioNameInput.value,
            audioPath: "/audio/" + audioInput.files[0].name,
            authorName: authorNameInput.value,
            genre: currentGenre,
            imagePath: "/images/" + imageInput.files[0].name,
            username: auth.currentUser.email
        });
        console.log("Document written with ID: ", docRef.id);

        genresQuery.forEach((doc) => {
            if (doc.data().genreName === currentGenre) {
                updateDoc(doc.ref, { count: doc.data().count += 1 })
            }
        });

        removeAddTrack()
        let tracks = await getDocs(collection(db, "Tracks"));
        tracks.forEach((doc) => {
            if (doc.data().audioName === audioNameInput.value) {
                addAudioItem(doc)
                updateTracksQuery()
            }
        });
        appendAddTrack()
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
}


btnAddTrack.addEventListener("click", addTrack)