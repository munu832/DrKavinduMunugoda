let youtubePlayers = [];
const videoIds = ['q-lVfEwMxHI', 'your_video_id_2', 'your_video_id_3']; // Replace with your YouTube video IDs

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

    setupPlayButtons(); // Call this here to ensure buttons are set up once players are ready
}

function onPlayerReady(event) {
    // Optionally, do something when the player is ready
}

function setupPlayButtons() {
    const playButtons = document.querySelectorAll(".more");
    playButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            createFullscreenOverlay(index);
        });
    });
}

function createFullscreenOverlay(playerIndex) {
    const overlay = document.getElementById('fullscreen-overlay');
    const videoContainer = document.getElementById('fullscreen-video-container');
    
    // Move YouTube player iframe into the fullscreen container
    videoContainer.appendChild(youtubePlayers[playerIndex].getIframe());

    // Display the overlay
    overlay.style.display = 'flex';

    // Start playing the video
    youtubePlayers[playerIndex].playVideo();
}

function closeFullscreen() {
    const overlay = document.getElementById('fullscreen-overlay');
    overlay.style.display = 'none';
    
    // Move YouTube player iframe back to its original position
    youtubePlayers.forEach((player, index) => {
        const playerDiv = document.getElementById(`youtube-player-${index}`);
        playerDiv.appendChild(player.getIframe());
    });

    // Stop the video playback
    youtubePlayers.forEach(player => player.pauseVideo());
}

// Load YouTube IFrame API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
