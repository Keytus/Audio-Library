import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

import {
    app
} from './fb-initial.js'

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const genresQuery = await getDocs(collection(db, "Genres"));

export let tracksQuery = await getDocs(collection(db, "Tracks"));

export async function updateTracksQuery(){
    tracksQuery = await getDocs(collection(db, "Tracks"));
}
