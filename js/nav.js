fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;

        let currentPage = location.pathname.split('/').pop();
        if (!currentPage) currentPage = 'index.html';

        let navigating = false;

        document.querySelectorAll('.tab').forEach(tab => {
            const tabPage = tab.getAttribute('href').split('/').pop();

            if (tabPage === currentPage) {
                tab.classList.add('active');
            }

            tab.addEventListener('click', e => {
                if (navigating) return;
                navigating = true;

                e.preventDefault();
                document.body.classList.add('fade-out');

                setTimeout(() => {
                    window.location.href = tab.href;
                }, 300);
            });
        });
    })
    .catch(err => console.error(err));
