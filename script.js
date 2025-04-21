async function getSong(playlist) {
    let a = await fetch(`http://127.0.0.1:3000/Spotify-Clone/songs/${playlist}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs
}

async function getAlbum() {
    let a = await fetch(`http://127.0.0.1:3000/Spotify-Clone/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let Album = [];
    let as = div.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        let folderName = element.href.split("/").filter(Boolean).pop();
        Album.push(folderName);
    }
    console.log(Album.slice(1));
    return Album.slice(1);

}
getAlbum();


async function getAlbumCoverImage(playlist) {
    let a = await fetch(`http://127.0.0.1:3000/Spotify-Clone/songs/${playlist}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let Album = [];
    let as = div.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        let folderName = element.href.split("/").filter(Boolean).pop();
        Album.push(folderName);
    }
    console.log(Album.slice(1));
    return Album.slice(1);

}
// getAlbumCoverImage("music");

function getDuration(song) {  // sending the song url
    return new Promise((resolve) => {
        const audio = new Audio(song);
        audio.addEventListener('loadedmetadata', () => {
            let duration = audio.duration;
            let mins = Math.floor(duration / 60);
            let secs = duration % 60;
            secs = Math.floor(secs);
            secs = secs < 10 ? '0' + secs : secs;
            duration = `${mins}:${secs}`;
            resolve(duration);
        });
    });
}

function getCurrentTime(song) {  // sending the song url
    return new Promise((resolve) => {
        const audio = new Audio(song);
        audio.addEventListener('loadedmetadata', () => {
            let duration = audio.currentTime;
            let mins = Math.floor(duration / 60);
            let secs = duration % 60;
            secs = Math.floor(secs);
            secs = secs < 10 ? '0' + secs : secs;
            duration = `${mins}:${secs}`;
            resolve(duration);
        });
    });
}

let globalAudio = new Audio();

function Controls(indexObj, songs, currentSong, currentSongName, className, idPrefix) {

    const previous = document.querySelector(".previous");

    previous.onclick = async () => {
        indexObj.value = (indexObj.value - 1 + songs.length) % songs.length;
        currentSong.src = songs[indexObj.value];
        currentSong.load();
        await currentSong.play();

        document.querySelectorAll(`.${className}`).forEach(card => card.classList.remove("playing"));
        document.querySelector(`#${idPrefix}${indexObj.value}`).classList.add("playing");
        document.querySelector(`#${idPrefix}${indexObj.value}`).scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        currentSongName = songs[indexObj.value].split("/songs/")[1].split(".mp3")[0];
        document.querySelector(".image > p").textContent = currentSongName;
    };

    const next = document.querySelector(".next");

    next.onclick = async () => {
        indexObj.value = (indexObj.value + 1) % songs.length;
        currentSong.src = songs[indexObj.value];
        currentSong.load();
        await currentSong.play();

        document.querySelectorAll(`.${className}`).forEach(row => row.classList.remove("playing"));
        document.querySelector(`#${idPrefix}${indexObj.value}`).classList.add("playing");
        document.querySelector(`#${idPrefix}${indexObj.value}`).scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        currentSongName = songs[indexObj.value].split("/songs/")[1].split(".mp3")[0];
        document.querySelector(".image > p").textContent = currentSongName;
    };

    let audio = currentSong;
    const toggle = document.getElementById("toggle");
    toggle.onclick = () => {
        if (audio.paused) {
            audio.play();
            toggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
            </svg>
            
            `;
        } else {
            audio.pause();
            toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#000000">
                        <path
                            d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                    </svg>

            `;
        }
    };
}

let Album_Name;

async function dynamicAlbum() {
    let Albums = await getAlbum();
    let Cards = document.querySelector(".cards");
    let card = "";

    Albums.forEach((album) => {
        card += `<div class="card flex" id="${album}">
                        <img src="http://127.0.0.1:3000/Spotify-Clone/songs/${album}/logo.png" class="albumCover"
                            alt="">
                        <button class="play-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                                <path fill="currentColor"
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                            </svg>
                        </button>
                        <p>${album}</p>
                    </div>`
    })
    Cards.innerHTML = card;
}

dynamicAlbum()


async function dynamicAlbumlist(Playlist) {

    document.querySelector(".expand").classList.remove("hidden")

    // creating album cover
    let Cover = document.querySelector(".cover-album");
    Cover.innerHTML = `<img src="http://127.0.0.1:3000/Spotify-Clone/songs/${Playlist}/logo.png" alt="cover_picture"></img>
    <p>${Playlist}</p>`

    // creating the list of musics inside the Playlist folder
    let songs = await getSong(`${Playlist}`);
    let songPlaylist = document.querySelector(".tracklist > tbody");
    let playlist = "";

    // Create an array of promises for all song durations
    const durationPromises = songs.map(song => getDuration(song));

    // Wait for all durations to be fetched
    const durations = await Promise.all(durationPromises);

    songs.forEach((song, index) => {
        playlist += `<tr class="albumsong" id="album-${index}">
                        <td class="number">${index + 1}</td>
                        <td class="album-logo"><img src="image/music.png" alt=""></td>
                        <td class="title">
                          <div class="title-info">
                            <span class="track-name">${(song.split("/songs/")[1]).split(".mp3")[0]}</span><br>
                            <span class="artist">Abhay</span>
                          </div>
                        </td>
                        <td class="duration">${durations[index]}</td>
                        </tr>`
    });
    songPlaylist.innerHTML = playlist
}



async function dynamicPlaylist(Playlist) {
    let songs = await getSong(`${Playlist}`);
    let SongUl = document.querySelector(".song-list");
    let html = "";
    songs.forEach((song, index) => {
        html += `<div class="song flex align-center" id ="playlist-${index}">
                        <svg width="8%" height="50%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
                            fill="#b3b3b3">
                            <path
                                d="M439.638 22.299v322.757c0 9.222 7.478 16.694 16.694 16.694s16.694-7.472 16.694-16.694V22.299h-33.388z" />
                            <path
                                d="M172.528 89.076v356.146c0 9.222 7.478 16.694 16.694 16.694s16.694-7.472 16.694-16.694V89.076h-33.388z" />
                            <path
                                d="M389.555 278.279c-27.379 0-51.641 10.573-66.777 26.822-10.573 11.13-16.694 24.93-16.694 39.955s6.121 28.826 16.694 39.955c15.136 16.249 39.399 26.822 66.777 26.822 46.076 0 83.472-29.939 83.472-66.777s-37.396-66.777-83.472-66.777z" />
                            <path
                                d="M466.57 3.601c-4.006-3.228-9.235-4.341-14.245-3.116L322.777 32.872l-137.561 34.39c-7.457 1.892-12.688 8.57-12.688 16.249v121.535l300.498-75.125V16.734c0-5.119-2.337-10.016-6.456-13.133z" />
                            <path
                                d="M473.026 16.734v113.188L322.777 167.54V32.872l129.548-32.387c5.009-1.224 10.239-0.111 14.245 3.116 4.119 3.117 6.456 8.014 6.456 13.133z" />
                            <path
                                d="M122.445 512c-46.029 0-83.472-29.954-83.472-66.777s37.443-66.777 83.472-66.777 83.472 29.954 83.472 66.777-37.443 66.777-83.472 66.777z" />
                        </svg>
                        <ul>
                            <li>${(song.split("/songs/")[1]).split(".mp3")[0]}</li>
                            <li>Abhay</li>
                        </ul>
                    </div>`;
    });
    SongUl.innerHTML = html;
}


async function initializePlayer() {
    // await dynamicAlbumlist("tones");
    await PlayOnClickdynamicAlbumlist("tones");

    await dynamicPlaylist("My_Playlist");
    await PlayOnClickdynamicPlaylist("My_Playlist");
}

initializePlayer();

async function PlayOnClickdynamicPlaylist(song) {
    let currentSong = new Audio();
    let songs = await getSong(`${song}`);

    let indexObj = { value: -1 };
    let currentSongName = "";

    const songDivs = document.querySelectorAll(".song");
    songDivs.forEach(div => {
        div.addEventListener("click", () => {
            globalAudio.pause();
            document.querySelectorAll(".tracklist > tbody > tr").forEach(tr => tr.classList.remove("playing"));

            const idParts = div.id.split('-');
            index = parseInt(idParts[1]);
            indexObj.value = index;

            currentSong.src = songs[index];
            globalAudio = currentSong;
            // currentSong.play();
            globalAudio.play()

            currentSongName = (songs[index].split("/songs/")[1]).split(".mp3")[0];
            // Update display with current song name
            document.querySelector(".image > p").textContent = currentSongName;

            toggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
            </svg>

            `;
            document.querySelectorAll(".song").forEach(card => card.classList.remove("playing"));
            div.classList.add("playing");
            Controls(indexObj, songs, currentSong, currentSongName, "song", "playlist-");

        });
    });

}



async function PlayOnClickdynamicAlbumlist(song) {
    let currentSong = new Audio();
    let songs = await getSong(`${song}`);
    console.log(songs.length);

    let indexObj = { value: -1 };
    let currentSongName = "";

    const AlbumSongRows = document.querySelectorAll(".tracklist > tbody > tr");
    console.log(AlbumSongRows.length);
    AlbumSongRows.forEach(row => {
        row.addEventListener("click", () => {
            globalAudio.pause()
            document.querySelectorAll(".song").forEach(card => card.classList.remove("playing"));

            const idParts = row.id.split('-');
            index = parseInt(idParts[1]);
            indexObj.value = index;

            currentSong.src = songs[index];
            globalAudio = currentSong;
            // currentSong.play();
            globalAudio.play()
            console.log("Click registerd for ", index)

            currentSongName = (songs[index].split("/songs/")[1]).split(".mp3")[0];
            // Update display with current song name
            document.querySelector(".image > p").textContent = currentSongName;

            toggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>
            </svg>

            `;
            document.querySelectorAll(".tracklist > tbody > tr").forEach(tr => tr.classList.remove("playing"));
            row.classList.add("playing");
            Controls(indexObj, songs, currentSong, currentSongName, "albumsong", "album-");

        });
    });

}




async function main() {

    const container = document.querySelector(".cards");

    container.addEventListener("click", async e => {
        const card = e.target.closest(".card");
        if (card) {
        await dynamicAlbumlist(`${card.id}`);
        document.querySelector(".Music-Type").classList.add("hidden");
        document.querySelector(".dynamic-text").innerHTML = "You may also like";

        document.querySelector(".tracklist > tbody").addEventListener("click", async (e) => {
            // const row = e.target.closest("tr.albumsong");
            // if (row) {
            //     // Your click handler code here
            //     const songs = await getSong(currentAlbumPlaylist); // You'll need to store the current playlist name
            //     const idParts = row.id.split('-');
            //     const index = parseInt(idParts[1]);
            //     // Rest of your code...
            // }
            await PlayOnClickdynamicPlaylist(e.target.closest(card.id));
            console.log("clicked")
        });
    }
    });

    document.getElementById("collapse-album").addEventListener("click",()=>{
        document.querySelector(".expand").classList.add("hidden")
        document.querySelector(".Music-Type").classList.remove("hidden");
        document.querySelector(".dynamic-text").innerHTML = "To get you started"

    });


    let audio = globalAudio;


    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;

        let mins = Math.floor(duration / 60);
        let secs = duration % 60;
        secs = Math.floor(secs);
        secs = secs < 10 ? '0' + secs : secs;
        duration = `${mins}:${secs}`;

        document.getElementById("duration").textContent = duration;
    });

    const progress = document.querySelector('.progress');


    audio.addEventListener("loadeddata", () => {
        setInterval(() => {
            let duration = audio.currentTime;
            let mins = Math.floor(duration / 60);
            let secs = duration % 60;
            secs = Math.floor(secs);
            secs = secs < 10 ? '0' + secs : secs;
            duration = `${mins}:${secs}`;
            document.getElementById("current-time").textContent = duration;
            const progressValue = (audio.currentTime / audio.duration) * 100;
            progress.value = progressValue;
        }, 1000);
    });

    // green seek bar
    audio.addEventListener("loadeddata", () => {
        setInterval(() => {
            const val = (progress.value - progress.min) / (progress.max - progress.min) * 100;
            progress.style.background = `linear-gradient(to right, #1db954 0%, #1db954 ${val}%, #555 ${val}%, #555 100%)`;
        }, 100);
    });

    // the audio time also updates when user interacts with the progress bar
    progress.addEventListener('input', function () {
        const newTime = (this.value / 100) * audio.duration;
        audio.currentTime = newTime;
    });

}
main();

const toggleSidebar = document.getElementById("toggle-sidebar");
const sidebar = document.querySelector(".left");

toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("left_minimize");
    sidebar.classList.toggle("left");
    document.getElementById("toggle-sidebar").classList.toggle("width");
    document.querySelector(".Your-library").classList.toggle("justify-center");
    document.querySelector(".song-list").classList.toggle("display-none");
    document.querySelector(".Playlists").classList.toggle("display-none");
    document.querySelector(".recents").classList.toggle("display-none");
    document.querySelector(".your-lib > div > p").classList.toggle("display-none");
    document.getElementById("toggle-sidebar").classList.toggle("justify-center");
    document.querySelector(".b1").classList.toggle("display-none");
    document.querySelector(".b2").classList.toggle("display-none");
    document.querySelector(".create").classList.toggle("display-none");
});

const menu = document.getElementById("menuToggle");
menu.addEventListener("click", () => {

    document.querySelector(".sidebar-content").classList.toggle("show");
    document.querySelector(".sidebar-content").classList.remove("hidden");
})

const cross = document.getElementById("cross");
cross.addEventListener("click", () => {

    document.querySelector(".sidebar-content").classList.remove("show");
})
