fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
        const placeholder = document.getElementById('nav-placeholder');
        placeholder.innerHTML = html;

        const nav = placeholder.querySelector('.tabs');
        const tabs = nav.querySelectorAll('.tab');
        const currentPage = location.pathname.split('/').pop() || 'index.html';

        let activeTab = null;

        tabs.forEach(tab => {
            const tabPage = tab.getAttribute('href').split('/').pop();
            if (tabPage === currentPage) activeTab = tab;

            tab.addEventListener('click', e => {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = tab.href; }, 300);
            });
        });

        const underline = document.createElement('div');
        underline.classList.add('underline');
        nav.appendChild(underline);

        function moveUnderline(tab) {
            if (!tab) return;
            const rect = tab.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            underline.style.width = `${rect.width}px`;
            underline.style.left = `${rect.left - navRect.left}px`;
        }

        moveUnderline(activeTab);

        tabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => moveUnderline(tab));
            tab.addEventListener('mouseleave', () => moveUnderline(activeTab));
        });

        window.addEventListener('resize', () => moveUnderline(activeTab));
    })
    .catch(err => console.error(err));
