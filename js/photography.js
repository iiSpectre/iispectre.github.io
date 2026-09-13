const track = document.getElementById("photographyTrack");
const prevButton = document.getElementById("photographyPrev");
const nextButton = document.getElementById("photographyNext");
const dotsContainer = document.getElementById("photographyDots");

const slides = document.querySelectorAll(".photography-slide");

let currentSlide = 0;


for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "photography-dot";
    dot.setAttribute(
        "aria-label",
        `Go to photograph ${i + 1}`
    );

    dot.addEventListener("click", () => {
        currentSlide = i;
        updatePhotography();
    });

    dotsContainer.appendChild(dot);
}


const dots = document.querySelectorAll(".photography-dot");


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
