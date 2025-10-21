    
const musicToggleBtn = document.getElementById("music-toggle");
const musicIcon = document.querySelector(".music-icon");
let isMusicPlaying = false; // Initially set to false since the music will not play until user interaction
const backgroundMusic = new Audio("assets/audio/retro-music.mp3");

// Preload the audio and loop it for continuous play
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// Set initial icon to muted since music is not playing
musicIcon.src = "assets/images/pixel-mute.jpg";

musicToggleBtn.addEventListener("click", () => {
  if (isMusicPlaying) {
    backgroundMusic.pause();
    musicIcon.src = "assets/images/pixel-mute.jpg";
  } else {
    // Play the background music only on user interaction
    backgroundMusic.play();
    musicIcon.src = "assets/images/pixel-unmuted.jpg";
  }
  isMusicPlaying = !isMusicPlaying;
});