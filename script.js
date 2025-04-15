console.log("JavaScript..")

async function getSong() {
    let a = await fetch("http://127.0.0.1:3000/Spotify-Clone/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
            // .split("/songs/")[1]).split(".mp3")[0]
        }
    }
    return songs
}

async function main() {

    let songs = await getSong();
    console.log(songs);
    let audio = new Audio(songs[1]);


    let SongUl = document.querySelector(".song-list");
    let html = "";
    for (const song of songs) {
        html += `<div class="song flex align-center">
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
    }
    SongUl.innerHTML = html;

    document.getElementById("toggle").addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration);


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