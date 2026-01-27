fetch('/partials/nav.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('nav-placeholder').innerHTML = html;

    const tabs = document.querySelectorAll('.tab');
    const indicator = document.querySelector('.tab-indicator');

    if (!tabs.length || !indicator) return;

    let currentPage = location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'index.html';

    let navigating = false;

    function moveIndicator(tab, instant = false) {
      if (!indicator || !tab) return;

      const rect = tab.getBoundingClientRect();
      const parentRect = document.querySelector('.tabs').getBoundingClientRect();

      if (instant) indicator.style.transition = 'none';

      indicator.style.width = `${rect.width}px`;
      indicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
      indicator.style.opacity = '1';

      if (instant) {
        indicator.offsetHeight;
        indicator.style.transition = 'transform 0.35s ease, width 0.35s ease';
      }
    }

    requestAnimationFrame(() => {
      let activeTab = null;
      let foundCurrentPageTab = false;

      tabs.forEach(tab => {
        const tabPage = tab.getAttribute('href').split('/').pop() || 'index.html';

        if (tabPage === currentPage) {
          tab.classList.add('active');
          activeTab = tab;
          foundCurrentPageTab = true;
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

      if (foundCurrentPageTab && activeTab) {
        moveIndicator(activeTab, true);
      } else {
        indicator.style.opacity = '0';
        indicator.style.width = '0';
      }
    });

    window.addEventListener('resize', () => {
      const active = document.querySelector('.tab.active');
      if (active) moveIndicator(active);
    });
  })
  .catch(err => console.error(err));

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('socials-placeholder');
  if (!el) return;

  fetch('/partials/socials.html')
    .then(res => res.text())
    .then(html => {
      el.innerHTML = html;
    })
    .catch(console.error);
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('fade-out');
});
