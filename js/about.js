document.addEventListener('DOMContentLoaded', () => {
    const specifics = document.querySelector('.specifics');
    const toggle = document.getElementById('specificsToggle');
    const content = specifics.querySelector('.specifics-content');

    toggle.addEventListener('click', () => {
        const open = specifics.classList.toggle('open');
        content.style.height = open ? content.scrollHeight + 'px' : '0';
        content.style.opacity = open ? '1' : '0';
    });

    const track = document.querySelector('.image-track');
    let imgs = Array.from(track.children);

    imgs.forEach(img => track.appendChild(img.cloneNode(true)));
    imgs = Array.from(track.children);

    let state = {
        isDragging: false,
        startX: 0,
        currentX: 0,
        velocity: 0,
        lastX: 0,
        lastTime: 0,
        setWidth: 0,
        rafId: null
    };

    const GAP = 24;

    const calcWidth = () => {
        if (!imgs[0]) return;
        state.setWidth = (imgs.length / 2) * (imgs[0].offsetWidth + GAP);
    };
    window.addEventListener('load', calcWidth);
    window.addEventListener('resize', calcWidth);

    const wrap = () => {
        if (!state.setWidth) return;
        state.currentX = ((state.currentX % state.setWidth) + state.setWidth) % state.setWidth - state.setWidth;
    };

    const apply = () => {
        wrap();
        track.style.transform = `translateX(${state.currentX}px)`;
        const center = window.innerWidth / 2;
        imgs.forEach(img => {
            const rect = img.getBoundingClientRect();
            const distance = Math.abs(center - (rect.left + rect.width / 2));
            const scale = Math.max(0.75, 1 - distance / 500);
            img.style.transform = `scale(${scale})`;
            img.style.opacity = scale;
        });
    };

    const stopMomentum = () => {
        if (state.rafId) cancelAnimationFrame(state.rafId);
        state.rafId = null;
    };

    const startDrag = x => {
        state.isDragging = true;
        stopMomentum();
        state.startX = x - state.currentX;
        state.lastX = x;
        state.lastTime = performance.now();
        state.velocity = 0;
    };

    const dragMove = x => {
        if (!state.isDragging) return;
        const now = performance.now();
        const dt = now - state.lastTime;
        if (dt > 0) state.velocity = Math.max(-1, Math.min(1, (x - state.lastX) / dt));
        state.lastX = x;
        state.lastTime = now;
        state.currentX = x - state.startX;
        apply();
    };

    const endDrag = () => {
        if (!state.isDragging) return;
        state.isDragging = false;
        startMomentum();
    };

    const startMomentum = () => {
        const frame = () => {
            if (Math.abs(state.velocity) < 0.002) {
                state.rafId = null;
                return;
            }
            state.currentX += state.velocity * 16;
            state.velocity *= 0.95;
            apply();
            state.rafId = requestAnimationFrame(frame);
        };
        if (!state.rafId) state.rafId = requestAnimationFrame(frame);
    };

    track.addEventListener('mousedown', e => startDrag(e.clientX));
    window.addEventListener('mousemove', e => dragMove(e.clientX));
    window.addEventListener('mouseup', endDrag);

    track.addEventListener('touchstart', e => startDrag(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', e => dragMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', endDrag);

    apply();
});
