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

function setupBackgroundToggle() {
    applyBackgroundFromStorage();
    const body = document.body;
    const toggleLink = document.getElementById("toggle-background-btn");
    const mobileToggleLink = document.getElementById(
        "mobile-toggle-background-btn"
    );

    function updateToggleText() {
        const mode = body.classList.contains("static-bg") ? "Off" : "On";
        if (toggleLink) toggleLink.textContent = `Background Toggle: ${mode}`;
        if (mobileToggleLink)
            mobileToggleLink.textContent = `Background Toggle: ${mode}`;
    }

    function toggleBackground(e) {
        if (e) e.preventDefault(); // Prevent default link behavior
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

        updateToggleText();
        applyBackgroundFromStorage();
    }

    // Initialize text on page load
    updateToggleText();

    // Event listeners
    if (toggleLink) {
        toggleLink.addEventListener("click", toggleBackground);
        toggleLink.addEventListener(
            "touchstart",
            function (e) {
                e.preventDefault();
                toggleBackground();
            },
            { passive: false }
        );
    }

    if (mobileToggleLink) {
        mobileToggleLink.addEventListener("click", toggleBackground);
        mobileToggleLink.addEventListener(
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

    // Offcanvas sound toggle link functionality
    try {
        const desktopToggle = document.getElementById("music-toggle");
        const offcanvas = document.getElementById("offcanvasExample");
        if (desktopToggle && offcanvas) {
            const candidates = offcanvas.querySelectorAll("a, button");
            candidates.forEach((el) => {
                const txt = (el.textContent || "").trim().toLowerCase();
                if (txt.includes("sound toggle")) {
                    el.addEventListener("click", (e) => {
                        e.preventDefault();
                        desktopToggle.click();
                    });
                    el.addEventListener(
                        "touchstart",
                        (e) => {
                            e.preventDefault();
                            desktopToggle.click();
                        },
                        { passive: false }
                    );
                }
            });
        }
    } catch (err) {
        // defensive: ignore
    }

    // Also delegate offcanvas 'Background Toggle' entries to the desktop background toggle
    try {
        const desktopBgToggle = document.getElementById(
            "toggle-background-btn"
        );
        const offcanvas = document.getElementById("offcanvasExample");
        if (desktopBgToggle && offcanvas) {
            const candidates = offcanvas.querySelectorAll("a, button");
            candidates.forEach((el) => {
                const txt = (el.textContent || "").trim().toLowerCase();
                if (
                    txt.includes("background toggle") ||
                    txt.includes("background")
                ) {
                    el.addEventListener("click", (e) => {
                        e.preventDefault();
                        desktopBgToggle.click();
                    });
                    el.addEventListener(
                        "touchstart",
                        (e) => {
                            e.preventDefault();
                            desktopBgToggle.click();
                        },
                        { passive: false }
                    );
                }
            });
        }
    } catch (err) {
        // ignore
    }
});
