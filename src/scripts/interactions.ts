const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#navigation');
if (menu && nav) {
  menu.hidden = false;
  document.documentElement.classList.add('js');
  const close = () => {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      menu.getAttribute('aria-expanded') === 'true'
    ) {
      close();
      menu.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!(event.target as Element).closest('header')) close();
  });
  document.addEventListener('focusin', (event) => {
    if (!(event.target as Element).closest('header')) close();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', close);
}
const motion = document.querySelector<HTMLButtonElement>('.motion-toggle');
const art = document.querySelector<HTMLElement>('.hero-art');
if (motion && art) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const apply = (paused: boolean) => {
    art.classList.toggle('is-moving', !paused);
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? 'Replay movement' : 'Pause movement';
  };
  motion.hidden = false;
  apply(reduced.matches);
  motion.addEventListener('click', () =>
    apply(motion.getAttribute('aria-pressed') !== 'true'),
  );
  reduced.addEventListener('change', () => apply(reduced.matches));
}
document
  .querySelectorAll<HTMLButtonElement>('[data-copy]')
  .forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const status =
        button.parentElement?.querySelector<HTMLElement>('.copy-status');
      try {
        if (!button.dataset.copy) throw new Error('No address');
        await navigator.clipboard.writeText(button.dataset.copy);
        if (status) status.textContent = 'Address copied.';
      } catch {
        if (status)
          status.textContent =
            'Could not copy. Select and copy the full address shown above.';
      }
    });
  });

// Scroll the document itself: a sticky header is not a reliable anchor target.
document
  .querySelectorAll<HTMLAnchorElement>('[data-scroll-top]')
  .forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const target = new URL(link.href);
      if (target.pathname !== location.pathname) return;
      event.preventDefault();
      document.getElementById('top')?.focus({ preventScroll: true });
      window.scrollTo({
        top: 0,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
      history.replaceState(null, '', location.pathname + location.search);
    });
  });
// Reveal once, with no hidden content if JavaScript or reduced motion is in use.
if (
  !matchMedia('(prefers-reduced-motion: reduce)').matches &&
  'IntersectionObserver' in window
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('has-entered');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      '.section-heading, .benefit-grid article, .stage, .community-heading, .posters figure',
    )
    .forEach((el) => observer.observe(el));
}
