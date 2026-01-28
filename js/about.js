document.addEventListener('DOMContentLoaded', () => {
    const specifics = document.querySelector('.specifics');
    const toggle = document.getElementById('specificsToggle');
    const content = specifics?.querySelector('.specifics-content');

    if (toggle && specifics && content) {
        toggle.addEventListener('click', () => {
            const open = specifics.classList.toggle('open');
            content.style.height = open ? content.scrollHeight + 'px' : '0';
            content.style.opacity = open ? '1' : '0';
        });
    }

    const carousel = document.querySelector('.image-carousel');
    const track = document.querySelector('.image-track');
    if (!carousel || !track) return;

    let imgs = Array.from(track.children);

    imgs.forEach(img => track.appendChild(img.cloneNode(true)));
    imgs = Array.from(track.children);

    const GAP = 24;
    const IDLE_DELAY = 2500;
    const IDLE_MAX_SPEED = 70;
    const IDLE_ACCEL = 60;

    const state = {
        isDragging: false,
        startX: 0,
        currentX: 0,
        velocity: 0,
        lastX: 0,
        lastTime: 0,
        setWidth: 0,
        momentumRaf: null,
        idleRaf: null,
        idleSpeed: 0,
        lastInteraction: Date.now(),
        lastIdleTime: performance.now()
    };

    const calcWidth = () => {
        if (!imgs[0]) return;
        state.setWidth = (imgs.length / 2) * (imgs[0].offsetWidth + GAP);
    };

    window.addEventListener('load', calcWidth);
    window.addEventListener('resize', calcWidth);

    const wrap = () => {
        if (!state.setWidth) return;
        while (state.currentX < -state.setWidth) state.currentX += state.setWidth;
        while (state.currentX > 0) state.currentX -= state.setWidth;
    };

    const apply = () => {
        wrap();
        track.style.transform = `translateX(${state.currentX}px)`;

        const center = window.innerWidth / 2;
        imgs.forEach(img => {
            const r = img.getBoundingClientRect();
            const d = Math.abs(center - (r.left + r.width / 2));
            const s = Math.max(0.75, 1 - d / 500);
            img.style.transform = `scale(${s})`;
            img.style.opacity = s;
        });
    };

    const stopMomentum = () => {
        if (state.momentumRaf) cancelAnimationFrame(state.momentumRaf);
        state.momentumRaf = null;
    };

    const stopIdle = () => {
        if (state.idleRaf) cancelAnimationFrame(state.idleRaf);
        state.idleRaf = null;
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

        carousel.classList.add('dragging');
    };

    const dragMove = x => {
        if (!state.isDragging) return;

        const now = performance.now();
        const dt = now - state.lastTime;
        if (dt > 0) {
            state.velocity = (x - state.lastX) / dt;
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

        carousel.classList.remove('dragging');

        if (Math.abs(state.velocity) < 0.01) {
            state.velocity = 0.05 * (Math.random() > 0.5 ? 1 : -1);
        }

        startMomentum();
        startIdle();
    };

    const startMomentum = () => {
        const frame = () => {
            if (Math.abs(state.velocity) < 0.01) {
                state.momentumRaf = null;
                return;
            }

            state.currentX += state.velocity * 16;
            state.velocity *= 0.92;
            apply();

            state.momentumRaf = requestAnimationFrame(frame);
        };

        if (!state.momentumRaf) {
            state.momentumRaf = requestAnimationFrame(frame);
        }
    };

    const startIdle = () => {
        const frame = time => {
            const dt = (time - state.lastIdleTime) / 1000;
            state.lastIdleTime = time;

            if (!state.isDragging && Date.now() - state.lastInteraction > IDLE_DELAY) {
                state.idleSpeed = Math.min(IDLE_MAX_SPEED, state.idleSpeed + IDLE_ACCEL * dt);
                state.currentX -= state.idleSpeed * dt;
                apply();
            } else {
                state.idleSpeed = 0;
            }

            state.idleRaf = requestAnimationFrame(frame);
        };

        state.lastIdleTime = performance.now();
        state.idleRaf = requestAnimationFrame(frame);
    };

    carousel.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        if (!e.isPrimary) return;

        carousel.setPointerCapture(e.pointerId);
        startDrag(e.clientX);
    });

    carousel.addEventListener('pointermove', e => {
        if (!state.isDragging) return;
        dragMove(e.clientX);
    });

    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
    carousel.addEventListener('pointerleave', endDrag);

    calcWidth();
    apply();
    startIdle();
});
