import {
    btnPlay,
    playerForm,
    playerImage,
    playerAudioName,
    playerAuthorName,
    seekSlider,
    volumeSlider,
    currentTime,
    totalTime,
    btnDownload
} from './ui.js'

import {
    storage
} from './storage.js'

import {
    openForm
} from './forms.js'

import {
    auth
} from './auth.js'

import {
    ref,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

let isPlaying = false;
let updateTimer;
let closeInterval;

let currentTrack = document.createElement('audio');
let trackName = null;
let trackURL = null;

seekSlider.addEventListener("change", seekTo);
volumeSlider.addEventListener("change", setVolume);


function download(filename, downloadURL) {
    let element = document.createElement('a');
    element.setAttribute('href', downloadURL);
    element.setAttribute('download', filename);
    element.setAttribute('target', "_blank");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


export function startPlayer(trackDoc) {
    clearInterval(updateTimer);
    resetValues()

    if (auth.currentUser === null) {
        btnDownload.style.display = "none";
    }
    else {
        btnDownload.style.display = "inherit";
    }

    playerImage.alt = trackDoc.data().audioName
    let spaceRef = ref(storage, trackDoc.data().imagePath);
    getDownloadURL(spaceRef).then(downloadURL => {
        playerImage.src = downloadURL;
    })

    playerAudioName.textContent = trackDoc.data().audioName;

    playerAuthorName.textContent = trackDoc.data().authorName;

    spaceRef = ref(storage, trackDoc.data().audioPath);
    getDownloadURL(spaceRef).then(downloadURL => {
        trackName = trackDoc.data().audioName;
        trackURL = downloadURL;
        currentTrack.src = downloadURL;
    })

    currentTrack.load();
    setVolume();

    updateTimer = setInterval(seekUpdate, 1000);
    closeInterval = setInterval((() => {
        if (playerForm.style.display === "none" && isPlaying) {
            pauseTrack()
            clearInterval(closeInterval)
        }
    }), 500);

    openForm('playerForm');
}

function playPauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    currentTrack.play();
    isPlaying = true;
    btnPlay.style.backgroundImage = "url(static/stop.png)";
}

function pauseTrack() {
    currentTrack.pause();
    isPlaying = false;
    btnPlay.style.backgroundImage = "url(static/play.png)";
}

function resetValues() {
    currentTime.textContent = "00:00";
    totalTime.textContent = "00:00";
    seekSlider.value = 0;
}

function seekTo() {
    currentTrack.currentTime = currentTrack.duration * (seekSlider.value / 100);
}

function setVolume() {
    currentTrack.volume = volumeSlider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(currentTrack.duration) && isPlaying) {
        seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);

        seekSlider.value = seekPosition;

        let currentMinutes = Math.floor(currentTrack.currentTime / 60);
        let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(currentTrack.duration / 60);
        let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        currentTime.textContent = currentMinutes + ":" + currentSeconds;
        totalTime.textContent = durationMinutes + ":" + durationSeconds;
    }
}

btnDownload.addEventListener("click", function () {
    download(trackName, trackURL);
});
btnPlay.addEventListener("click", playPauseTrack)