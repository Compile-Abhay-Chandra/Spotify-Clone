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
        }
    }
    return songs
}

getSong

async function main() {
    let songs = await getSong();
    console.log(songs);
    let audio = new Audio(songs[0]);

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
            progress = progressValue;
        }, 1000);
    });



    // green seek bar code
    
    progress.addEventListener('input', function () {
        const val = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = `linear-gradient(to right, #1db954 0%, #1db954 ${val}%, #555 ${val}%, #555 100%)`;
    });
}
main();


