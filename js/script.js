const musicToggleBtn = document.getElementById("music-toggle");
const musicIcon = document.querySelector(".music-icon");
let isMusicPlaying = false; // Initially set to false since the music will not play until user interaction
const backgroundMusic = new Audio("assets/audio/retro-music.mp3");

// Preload the audio and loop it for continuous play
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// Set initial icon to muted since music is not playing
musicIcon.src = "assets/images/soundOfIcon.png";

musicToggleBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicIcon.src = "assets/images/soundOfIcon.png";
    } else {
        backgroundMusic.play();
        musicIcon.src = "assets/images/soundOnIcon.png";
    }
    isMusicPlaying = !isMusicPlaying;
});
//how to play modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("start-game-modal");
    const startBtn = document.getElementById("start-btn");
    const homeBtn = document.querySelector(".home-btn");

    // Show modal when page loads
    modal.style.display = "flex";

    // Close modal and start game
    startBtn.addEventListener("click", () => {
        modal.style.display = "none";
        // You can call your game start function here if needed
    });

    // Go to main menu
    homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
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

// Enhanced background toggle with proper synchronization
function setupBackgroundToggle() {
    applyBackgroundFromStorage();
    const body = document.body;
    const desktopToggle = document.getElementById("toggle-background-btn");
    const mobileToggle = document.getElementById("mobile-background-toggle");

    function updateAllBackgroundToggles() {
        const mode = body.classList.contains("static-bg") ? "Off" : "On";
        if (desktopToggle) desktopToggle.textContent = `Background Toggle: ${mode}`;
        if (mobileToggle) mobileToggle.textContent = `Background Toggle: ${mode}`;
    }

    function toggleBackground(e) {
        if (e) e.preventDefault();
        
        // Apply current state first
        applyBackgroundFromStorage();

        // Toggle the state
        if (body.classList.contains("scrolling-bg")) {
            body.classList.remove("scrolling-bg");
            body.classList.add("static-bg");
            localStorage.setItem("bgMode", "static");
        } else {
            body.classList.remove("static-bg");
            body.classList.add("scrolling-bg");
            localStorage.setItem("bgMode", "scrolling");
        }

        // Update both toggles immediately
        updateAllBackgroundToggles();
        applyBackgroundFromStorage();
    }

    // Initialize both toggles on page load
    updateAllBackgroundToggles();

    // Add event listeners to both desktop and mobile toggles
    if (desktopToggle) {
        desktopToggle.addEventListener("click", toggleBackground);
        desktopToggle.addEventListener("touchstart", function (e) {
            e.preventDefault();
            toggleBackground();
        }, { passive: false });
    }

    if (mobileToggle) {
        mobileToggle.addEventListener("click", toggleBackground);
        mobileToggle.addEventListener("touchstart", function (e) {
            e.preventDefault();
            toggleBackground();
        }, { passive: false });
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

// Enhanced music toggle with proper synchronization
function setupMusicToggle() {
    const desktopMusicBtn = document.getElementById("music-toggle");
    const mobileMusicBtn = document.getElementById("mobile-music-toggle");
    const musicIcon = document.querySelector(".music-icon");
    
    // Get initial state from localStorage or default to false (off)
    let isMusicPlaying = localStorage.getItem("music-playing") === "true";
    
    function updateAllMusicToggles() {
        const mode = isMusicPlaying ? "On" : "Off";
        if (mobileMusicBtn) {
            mobileMusicBtn.textContent = `Sound Toggle: ${mode}`;
        }
        if (musicIcon) {
            musicIcon.src = isMusicPlaying ? "assets/images/soundOnIcon.png" : "assets/images/soundOfIcon.png";
        }
    }

    function toggleMusic(e) {
        if (e) e.preventDefault();
        
        if (isMusicPlaying) {
            backgroundMusic.pause();
            isMusicPlaying = false;
        } else {
            backgroundMusic.play().catch(err => {
                console.log("Audio play failed:", err);
                isMusicPlaying = false; // Reset if play fails
            });
            isMusicPlaying = true;
        }
        
        // Save state to localStorage
        localStorage.setItem("music-playing", isMusicPlaying.toString());
        
        // Update both desktop and mobile displays
        updateAllMusicToggles();
    }

    // Initialize both toggles on page load
    updateAllMusicToggles();
    
    // Restore music state if it was playing
    if (isMusicPlaying) {
        backgroundMusic.play().catch(err => {
            console.log("Audio auto-play failed:", err);
            isMusicPlaying = false;
            localStorage.setItem("music-playing", "false");
            updateAllMusicToggles();
        });
    }

    // Add event listeners to both desktop and mobile toggles
    if (desktopMusicBtn) {
        desktopMusicBtn.addEventListener("click", toggleMusic);
    }

    if (mobileMusicBtn) {
        mobileMusicBtn.addEventListener("click", toggleMusic);
        mobileMusicBtn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            toggleMusic();
        }, { passive: false });
    }
}

// Initialize both toggles when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    setupBackgroundToggle();
    setupMusicToggle();
    setupMobileBurgerMenu(); // Keep your existing burger menu setup
});
