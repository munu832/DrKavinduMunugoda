// YouTube player API script loading
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let youtubePlayers = [];
const videoIds = ['q-lVfEwMxHI', 'x-sdfghjkhg', 'x-sdfghjkbvc', 'dQw4w9WgXcQ']; // Replace with your actual video IDs

function onYouTubeIframeAPIReady() {
    videoIds.forEach((videoId, index) => {
        youtubePlayers[index] = new YT.Player(`youtube-player-${index}`, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    });
}

function onPlayerReady(event) {
    // Video is ready to play
}

function createFullscreenOverlay(playerIndex) {
    const overlay = document.createElement('div');
    overlay.id = 'fullscreen-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
        z-index: 1001;
    `;
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        youtubePlayers[playerIndex].pauseVideo();
        document.getElementById(`youtube-player-${playerIndex}`).appendChild(youtubePlayers[playerIndex].getIframe());
    });

    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);

    overlay.appendChild(youtubePlayers[playerIndex].getIframe());
    youtubePlayers[playerIndex].getIframe().style.cssText = `
        width: 90%;
        height: 90%;
    `;
    youtubePlayers[playerIndex].playVideo();
}

function setupPlayButtons() {
    const playButtons = document.querySelectorAll(".more");
    playButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            createFullscreenOverlay(index);
        });
    });
}

function setXOff(slider, value) {
    if (!slider) {
        slider = document.querySelector(".slider");
    }
    slider.style.setProperty("--x-off", `${value}%`);
}

function hookEvents() {
    const slider = document.querySelector(".slider");
    const navButtons = document.querySelectorAll(".nav .btn");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const items = document.querySelectorAll(".slide");
            setXOff(slider, 0);
            setTimeout(() => {
                if (btn.classList.contains("next")) {
                    slider.appendChild(items[0]);
                } else if (btn.classList.contains("prev")) {
                    slider.prepend(items[items.length - 1]);
                }
            }, 0);
        });
    });

    let sliding = false;
    let origX = 0;

    function slide(e) {
        if (!sliding) return;
        const val = e.touches[0].screenX - origX;
        setXOff(slider, Math.max(-50, Math.min(50, val)));
        if (Math.abs(val) > 50) {
            sliding = false;
            setXOff(slider, 0);
            if (val < 0) {
                document.querySelector(".next").click();
            } else {
                document.querySelector(".prev").click();
            }
        }
    }

    slider.addEventListener("touchmove", slide);
    slider.addEventListener("touchstart", (e) => {
        sliding = true;
        origX = e.touches[0].screenX;
    });
    slider.addEventListener("touchend", () => {
        sliding = false;
        setXOff(slider, 0);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            document.querySelector(".next").click();
        } else if (e.key === "ArrowLeft") {
            document.querySelector(".prev").click();
        } else if (e.key === " ") {
            document.querySelector(".slide:nth-child(2) .more").click();
        }
    });
}

function init() {
    hookEvents();
    setupPlayButtons();
}

window.addEventListener("load", init);
