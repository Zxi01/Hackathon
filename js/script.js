const musicToggleBtn = document.getElementById("music-toggle");
const musicIcon = musicToggleBtn.querySelector(".music-icon");
let isMusicPlaying = true; // Initially set to true since the music will start playing when the page loads
const backgroundMusic = new Audio("assets/audio/retro-music.mp3");

// Preload the audio and loop it for continuous play
backgroundMusic.loop = true;

// Play the background music as soon as the page loads
backgroundMusic.volume = 0.3;
backgroundMusic.play();

// Set initial icon to unmuted since music starts playing
musicIcon.src = "assets/images/pixel-unmuted.jpg";

musicToggleBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicIcon.src = "assets/images/pixel-mute.jpg";
    } else {
        backgroundMusic.play();
        musicIcon.src = "assets/images/pixel-unmuted.jpg";
    }
    isMusicPlaying = !isMusicPlaying;
});

// Background toggle logic for all pages
function applyBackgroundFromStorage() {
    const body = document.body;
    const savedMode = localStorage.getItem("bgMode");
    body.classList.remove("static-bg", "scrolling-bg");
    if (savedMode === "static") {
        body.classList.add("static-bg");
    } else {
        body.classList.add("scrolling-bg");
    }
}

function setupBackgroundToggle() {
    applyBackgroundFromStorage();
    const body = document.body;
    const toggleBtn = document.getElementById("toggle-background-btn");
    const mobileToggleBtn = document.getElementById(
        "mobile-toggle-background-btn"
    );
    function toggleBackground() {
        // Always re-read localStorage before toggling
        applyBackgroundFromStorage();
        if (body.classList.contains("scrolling-bg")) {
            body.classList.remove("scrolling-bg");
            body.classList.add("static-bg");
            localStorage.setItem("bgMode", "static");
        } else {
            body.classList.remove("static-bg");
            body.classList.add("scrolling-bg");
            localStorage.setItem("bgMode", "scrolling");
        }
        // Apply immediately for all open tabs/pages
        applyBackgroundFromStorage();
    }
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleBackground);
        toggleBtn.addEventListener(
            "touchstart",
            function (e) {
                e.preventDefault();
                toggleBackground();
            },
            { passive: false }
        );
    }
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener("click", toggleBackground);
        mobileToggleBtn.addEventListener(
            "touchstart",
            function (e) {
                e.preventDefault();
                toggleBackground();
            },
            { passive: false }
        );
    }
}

// Mobile burger menu functionality (shared for all pages)
function setupMobileBurgerMenu() {
    const howToBtn = document.getElementById("how-to-play-btn");
    const howToModal = document.getElementById("how-to-play-modal");
    const closeHowTo = document.getElementById("close-how-to-play");
    if (howToBtn && howToModal) {
        howToBtn.onclick = () => howToModal.classList.remove("hidden");
    }
    if (closeHowTo && howToModal) {
        closeHowTo.onclick = () => howToModal.classList.add("hidden");
    }
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenuDropdown = document.getElementById("mobile-menu-dropdown");
    const mobileHowToBtn = document.getElementById("mobile-how-to-play-btn");
    if (mobileMenuToggle && mobileMenuDropdown) {
        mobileMenuToggle.onclick = () => {
            mobileMenuDropdown.classList.toggle("hidden");
        };
    }
    if (mobileHowToBtn && howToModal && mobileMenuDropdown) {
        mobileHowToBtn.onclick = () => {
            howToModal.classList.remove("hidden");
            mobileMenuDropdown.classList.add("hidden");
        };
    }
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (
            mobileMenuToggle &&
            mobileMenuDropdown &&
            !mobileMenuToggle.contains(e.target) &&
            !mobileMenuDropdown.contains(e.target)
        ) {
            mobileMenuDropdown.classList.add("hidden");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupBackgroundToggle();
    setupMobileBurgerMenu();
});
