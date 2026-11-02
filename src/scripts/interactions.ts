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
