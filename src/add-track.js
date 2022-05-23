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
    updateTracksQuery,
    updateGenresQuery
} from './db.js'

import {
    auth
} from './auth.js'

import {
    addAudioItem,
    appendAddTrack,
    removeAddTrack,
    currentGenre,
    resizeBookcase
} from './fill-bookcase.js'

import {
    storage
} from './storage.js'

import {
    ref, 
    uploadBytes 
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

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

function validTrackForm(){
    if (imageInput.files.length === 0) {
        alert("No image selected");
        return false;
    }
    if (audioInput.files.length === 0) {
        alert("No audio selected");
        return false;
    }
    if (!validImageFileType(imageInput.files[0])) {
        alert("Invalid image");
        return false;
    }
    if (audioInput.files[0].type != 'audio/mpeg') {
        alert("Invalid audio");
        return false;
    }
    if (audioNameInput.value.length === 0) {
        alert("Empty audio name");
        return false;
    }
    if (authorNameInput.value.length === 0) {
        alert("Empty author");
        return false;
    }
    return true
}

async function addTrack(){
    try {
        if (!validTrackForm()){
            return;
        }
    }
    catch (error) {
        console.log(error);
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

        genresQuery.forEach(async (doc) => {
            if (doc.data().genreName === currentGenre) {
                updateDoc(doc.ref, { count: doc.data().count += 1 });
                resizeBookcase(doc.data().count);
            }
        });
        await updateGenresQuery();

        removeAddTrack();
        let tracks = await getDocs(collection(db, "Tracks"));
        for (let i in tracks.docs){
            let doc = tracks.docs[i];
            if (doc.data().audioName === audioNameInput.value 
            && doc.data().authorName === authorNameInput.value 
            && doc.data().username === auth.currentUser.email) {
                addAudioItem(doc);
                updateTracksQuery();
                appendAddTrack();
                break;
            }
        }
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
}

btnAddTrack.addEventListener("click", addTrack);