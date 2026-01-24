document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.accomplishments-track');
    const slides = Array.from(document.querySelectorAll('.accomplishment-slide'));
    const dotsContainer = document.querySelector('.accomplishments-dots');
    const prevBtn = document.querySelector('.accomplishments-arrow.left');
    const nextBtn = document.querySelector('.accomplishments-arrow.right');

    if (!track || !slides.length) return;

    let index = 0;

    const dots = slides.map((_, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
        return dot;
    });

    const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) =>
            dot.classList.toggle('active', i === index)
        );
    };

    const goTo = i => {
        const total = slides.length;
        index = (i + total) % total;
        update();
    };

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    update();
});
