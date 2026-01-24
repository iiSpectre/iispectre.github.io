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

    imgs.forEach(img => {
        img.draggable = false;
    });
    track.addEventListener('dragstart', e => e.preventDefault());

    const state = {
        isDragging: false,
        startX: 0,
        currentX: 0,
        velocity: 0,
        lastX: 0,
        lastTime: 0,
        setWidth: 0,
        rafId: null,
        idleRafId: null,
        lastInteraction: Date.now(),
        idleSpeed: 0,
        lastIdleTime: performance.now()
    };

    const GAP = 24;
    const IDLE_DELAY = 2500;

    const IDLE_MAX_SPEED = 40;
    const IDLE_ACCEL = 60;

    const calcWidth = () => {
        if (!imgs[0]) return;
        state.setWidth = (imgs.length / 2) * (imgs[0].offsetWidth + GAP);
    };

    window.addEventListener('load', calcWidth);
    window.addEventListener('resize', calcWidth);

    const wrap = () => {
        if (!state.setWidth) return;
        state.currentX =
            ((state.currentX % state.setWidth) + state.setWidth) % state.setWidth -
            state.setWidth;
    };

    const apply = () => {
        wrap();
        track.style.transform = `translateX(${state.currentX}px)`;

        const center = window.innerWidth / 2;
        imgs.forEach(img => {
            const rect = img.getBoundingClientRect();
            const d = Math.abs(center - (rect.left + rect.width / 2));
            const s = Math.max(0.75, 1 - d / 500);
            img.style.transform = `scale(${s})`;
            img.style.opacity = s;
        });
    };

    const stopMomentum = () => {
        if (state.rafId) cancelAnimationFrame(state.rafId);
        state.rafId = null;
    };

    const stopIdle = () => {
        if (state.idleRafId) cancelAnimationFrame(state.idleRafId);
        state.idleRafId = null;
    };

    const startDrag = x => {
        state.isDragging = true;
        stopMomentum();
        stopIdle();

        state.idleSpeed = 0;
        state.startX = x - state.currentX;
        state.lastX = x;
        state.lastTime = performance.now();
        state.velocity = 0;
        state.lastInteraction = Date.now();
    };

    const dragMove = x => {
        if (!state.isDragging) return;

        const now = performance.now();
        const dt = now - state.lastTime;

        if (dt > 0) {
            state.velocity = Math.max(-1, Math.min(1, (x - state.lastX) / dt));
        }

        state.lastX = x;
        state.lastTime = now;
        state.currentX = x - state.startX;

        apply();
        state.lastInteraction = Date.now();
    };

    const endDrag = () => {
        if (!state.isDragging) return;
        state.isDragging = false;
        state.lastInteraction = Date.now();
        startMomentum();
        startIdle();
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

    const startIdle = () => {
        const frame = time => {
            const dt = (time - state.lastIdleTime) / 1000;
            state.lastIdleTime = time;

            if (
                !state.isDragging &&
                Date.now() - state.lastInteraction > IDLE_DELAY
            ) {
                state.idleSpeed = Math.min(
                    IDLE_MAX_SPEED,
                    state.idleSpeed + IDLE_ACCEL * dt
                );

                state.currentX -= state.idleSpeed * dt;
                apply();
            } else {
                state.idleSpeed = 0;
            }

            state.idleRafId = requestAnimationFrame(frame);
        };

        state.lastIdleTime = performance.now();
        state.idleRafId = requestAnimationFrame(frame);
    };

    track.addEventListener('mousedown', e => startDrag(e.clientX));
    window.addEventListener('mousemove', e => dragMove(e.clientX));
    window.addEventListener('mouseup', endDrag);

    track.addEventListener(
        'touchstart',
        e => startDrag(e.touches[0].clientX),
        { passive: true }
    );
    track.addEventListener(
        'touchmove',
        e => dragMove(e.touches[0].clientX),
        { passive: true }
    );
    track.addEventListener('touchend', endDrag);

    apply();
    startIdle();
});
