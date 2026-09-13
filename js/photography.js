const track = document.getElementById("photographyTrack");
const prevButton = document.getElementById("photographyPrev");
const nextButton = document.getElementById("photographyNext");
const dotsContainer = document.getElementById("photographyDots");

const slides = document.querySelectorAll(".photography-slide");

let currentSlide = 0;


slides.forEach((_, index) => {
    const dot = document.createElement("span");

    dot.setAttribute(
        "aria-label",
        `Go to photograph ${index + 1}`
    );

    dot.addEventListener("click", () => {
        currentSlide = index;
        updatePhotography();
    });

    dotsContainer.appendChild(dot);
});


const dots = dotsContainer.querySelectorAll("span");


function updatePhotography() {
    track.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle(
            "active",
            index === currentSlide
        );
    });
}


prevButton.addEventListener("click", () => {
    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    updatePhotography();
});


nextButton.addEventListener("click", () => {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    updatePhotography();
});


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        prevButton.click();
    }

    if (event.key === "ArrowRight") {
        nextButton.click();
    }
});


updatePhotography();
