fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;

        document.querySelectorAll('.tab').forEach(tab => {
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
