<script>
fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;

        const path = location.pathname === '/' ? '/index.html' : location.pathname;

        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.getAttribute('href') === path) {
                tab.classList.add('active');
            }

            tab.addEventListener('click', e => {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    location.href = tab.href;
                }, 300);
            });
        });
    });
</script>
