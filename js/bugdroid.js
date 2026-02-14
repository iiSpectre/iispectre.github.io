document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.bugdroid-track');
    const images = Array.from(track.querySelectorAll('img'));
    const dotsContainer = document.querySelector('.bugdroid-dots');
    const prevBtn = document.querySelector('.bugdroid-arrow.left');
    const nextBtn = document.querySelector('.bugdroid-arrow.right');

    if (!track || !images.length) return;

    let index = 0;

    const dots = images.map((_, i) => {
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
        const total = images.length;
        index = (i + total) % total;
        update();
    };

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    update();
});
