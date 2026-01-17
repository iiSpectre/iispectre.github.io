fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;

        const currentPage = location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('.tab').forEach(tab => {
            const tabPage = tab.getAttribute('href').split('/').pop();

            if (tabPage === currentPage) {
                tab.classList.add('active');
            }

            tab.addEventListener('click', e => {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = tab.href;
                }, 300);
            });
        });
    })
    .catch(err => console.error(err));
