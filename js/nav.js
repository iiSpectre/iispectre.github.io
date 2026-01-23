fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;

        const tabs = document.querySelectorAll('.tab');
        const indicator = document.querySelector('.tab-indicator');

        let currentPage = location.pathname.split('/').pop();
        if (!currentPage) currentPage = 'index.html';

        let navigating = false;

        function moveIndicator(tab, instant = false) {
            if (!indicator || !tab) return;

            const rect = tab.getBoundingClientRect();
            const parentRect = tab.parentElement.getBoundingClientRect();

            if (instant) {
                indicator.style.transition = 'none';
            }

            indicator.style.width = `${rect.width}px`;
            indicator.style.transform =
                `translateX(${rect.left - parentRect.left}px)`;
            indicator.style.opacity = '1';

            if (instant) {
                indicator.offsetHeight;

                indicator.style.transition =
                    'transform 0.35s ease, width 0.35s ease';
            }
        }

        tabs.forEach(tab => {
            const tabPage = tab
                .getAttribute('href')
                .split('/')
                .pop();

            if (tabPage === currentPage) {
                tab.classList.add('active');
                requestAnimationFrame(() => moveIndicator(tab, true));
            }

            tab.addEventListener('click', e => {
                if (navigating) return;
                navigating = true;

                e.preventDefault();

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                moveIndicator(tab);

                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = tab.href;
                }, 300);
            });
        });

        window.addEventListener('resize', () => {
            const active = document.querySelector('.tab.active');
            if (active) moveIndicator(active);
        });
    })
    .catch(err => console.error(err));

fetch('/partials/socials.html')
    .then(res => res.text())
    .then(html => {
        const el = document.getElementById('socials-placeholder');
        if (el) el.innerHTML = html;
    })
    .catch(console.error);
