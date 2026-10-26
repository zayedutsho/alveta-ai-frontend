import { heroVariants } from '../content/hero-variants';

const workspace = document.querySelector<HTMLElement>('[data-hero-workspace]');
if (workspace) {
  const composer = workspace.querySelector<HTMLFormElement>('[data-composer]')!;
  const editable = JSON.parse(composer.dataset.variants || '[]') as {id: string; label: string; assistant: string; placeholder: string}[];
  const variants = heroVariants.map(variant => ({...variant, ...editable.find(item => item.id === variant.id)}));
  const prompt = composer.querySelector<HTMLTextAreaElement>('textarea')!;
  const buttons = [...workspace.querySelectorAll<HTMLButtonElement>('[data-hero-mode]')];
  const compare = composer.querySelector<HTMLElement>('.compare')!;
  const left = composer.querySelector<HTMLElement>('.tools-left')!;
  const right = composer.querySelector<HTMLElement>('.tools-right')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const drafts = new Map<string, string>();
  const ratios = new Map([['image', '1:1'], ['video', '16:9']]);
  let active = 'chat';
  let transitions: Animation[] = [];
  const lifecycle = new AbortController();
  const listenerOptions = { signal: lifecycle.signal };
  let timer: ReturnType<typeof setTimeout> | undefined;
  let inView = false;
  let pending = 0;
  let exiting = false;
  const panels = [...composer.querySelectorAll<HTMLElement>('.composer-header, .prompt-panel')];
  const canCycle = () => inView && !document.hidden && !reduced.matches
    && !composer.matches(':hover, :focus-within') && !lifecycle.signal.aborted;

  function cancelPending() {
    clearTimeout(timer);
    timer = undefined;
    pending++;
    if (exiting) {
      transitions.forEach(animation => animation.cancel());
      exiting = false;
    }
  }

  function schedule() {
    cancelPending();
    if (!canCycle()) return;
    // Fade out just before the next 3.5s boundary; switch at its midpoint.
    timer = setTimeout(async () => {
      timer = undefined;
      if (!canCycle()) return;
      const token = ++pending;
      exiting = true;
      transitions.forEach(animation => animation.cancel());
      transitions = panels.map(panel => panel.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-3px)' },
      ], { duration: 150, easing: 'ease-in', fill: 'forwards' }));
      try { await Promise.all(transitions.map(animation => animation.finished)); }
      catch { return; } // A visitor interaction cancelled the pending switch.
      if (token !== pending || !canCycle()) return;
      exiting = false;
      const index = variants.findIndex(variant => variant.id === active);
      select(variants[(index + 1) % variants.length]!.id, 150);
      schedule();
    }, 3500 - 150);
  }

  function manualSelect(id: string) {
    cancelPending();
    select(id);
    schedule();
  }
  const updateRatio = () => composer.querySelectorAll<HTMLButtonElement>('[data-aspect]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.aspect === ratios.get(active)));
  });

  function select(id: string, duration = 300) {
    const variant = variants.find(variant => variant.id === id);
    if (!variant || active === id) return;
    drafts.set(active, prompt.value);
    active = id;
    composer.dataset.mode = id;
    prompt.value = drafts.get(id) ?? '';
    prompt.placeholder = id === 'chat' ? composer.dataset.defaultPlaceholder! : variant.placeholder;
    composer.querySelector('[data-assistant-label]')!.textContent = variant.assistant;
    const generateLabel = id === 'chat' ? composer.dataset.defaultCta! : 'Generate';
    composer.querySelector('[data-generate-label]')!.textContent = generateLabel;
    composer.querySelector('.generate')!.setAttribute('aria-label', `${generateLabel} — sign up for ${variant.label}`);
    for (const button of buttons) {
      const selected = button.dataset.heroMode === id;
      button.setAttribute('aria-pressed', String(selected));
      button.parentElement!.classList.toggle('selected', selected);
      button.parentElement!.querySelector<HTMLElement>('.mode-pointer')!.hidden = !selected;
    }
    composer.querySelectorAll<HTMLElement>('[data-modes]').forEach(element => {
      element.hidden = !element.dataset.modes!.split(' ').includes(id);
    });
    const providers = [...composer.querySelectorAll<HTMLElement>('.provider')];
    providers.forEach(provider => provider.removeAttribute('data-last-provider'));
    providers.filter(provider => !provider.hidden).at(-1)?.setAttribute('data-last-provider', '');
    if (id === 'voice' || id === 'video') left.append(compare);
    else right.prepend(compare);
    updateRatio();
    transitions.forEach(animation => animation.cancel());
    transitions = reduced.matches ? [] : panels.map(element =>
      element.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration, easing: 'cubic-bezier(.22, 1, .36, 1)',
      }),
    );
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => manualSelect(button.dataset.heroMode!), listenerOptions);
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % buttons.length
        : event.key === 'ArrowLeft' ? (index - 1 + buttons.length) % buttons.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : -1;
      if (next < 0) return;
      event.preventDefault();
      buttons[next]!.focus();
      manualSelect(buttons[next]!.dataset.heroMode!);
    }, listenerOptions);
  });
  composer.querySelectorAll<HTMLButtonElement>('[data-aspect]').forEach(button => button.addEventListener('click', () => {
    ratios.set(active, button.dataset.aspect!);
    updateRatio();
  }, listenerOptions));
  reduced.addEventListener('change', () => {
    if (reduced.matches) transitions.forEach(animation => animation.cancel());
    schedule();
  }, listenerOptions);
  composer.addEventListener('pointerenter', schedule, listenerOptions);
  composer.addEventListener('pointerleave', schedule, listenerOptions);
  composer.addEventListener('focusin', schedule, listenerOptions);
  composer.addEventListener('focusout', () => queueMicrotask(schedule), listenerOptions);
  document.addEventListener('visibilitychange', schedule, listenerOptions);
  const visibility = new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    if (visible !== inView) { inView = visible; schedule(); }
  }, { threshold: 0 });
  visibility.observe(workspace);
  function dispose() {
    cancelPending();
    transitions.forEach(animation => animation.cancel());
    visibility.disconnect();
    lifecycle.abort();
  }
  window.addEventListener('pagehide', event => {
    if (event.persisted) cancelPending(); else dispose();
  }, listenerOptions);
  window.addEventListener('pageshow', schedule, listenerOptions);
  document.addEventListener('astro:before-swap', dispose, listenerOptions);
}
