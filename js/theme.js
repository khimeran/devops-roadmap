(function () {
  const STORAGE = { theme: 'dr-theme', palette: 'dr-palette' };
  const THEMES = ['dark', 'light'];
  const PALETTES = [
    { id: 'teal',   label: 'Teal',   swatch: '#0d9488' },
    { id: 'sky',    label: 'Sky',    swatch: '#0ea5e9' },
    { id: 'violet', label: 'Violet', swatch: '#8b5cf6' },
  ];

  function readStored(key, fallback, allowed) {
    try {
      const v = localStorage.getItem(key);
      return v && allowed.includes(v) ? v : fallback;
    } catch (_) { return fallback; }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE.theme, theme); } catch (_) {}
  }
  function applyPalette(palette) {
    document.documentElement.setAttribute('data-palette', palette);
    try { localStorage.setItem(STORAGE.palette, palette); } catch (_) {}
  }

  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }
  function currentPalette() { return document.documentElement.getAttribute('data-palette') || 'teal'; }

  function mountSwitcher(host) {
    if (!host || host.dataset.themeMounted) return;
    host.dataset.themeMounted = '1';

    const themeGroup = document.createElement('div');
    themeGroup.className = 'theme-switch__group';
    themeGroup.setAttribute('role', 'group');
    themeGroup.setAttribute('aria-label', 'Тема');
    THEMES.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-switch__btn';
      btn.dataset.theme = t;
      btn.title = t === 'dark' ? 'Тёмная тема' : 'Светлая тема';
      btn.setAttribute('aria-label', btn.title);
      btn.textContent = t === 'dark' ? '☾' : '☀';
      btn.addEventListener('click', () => { applyTheme(t); syncPressed(); });
      themeGroup.appendChild(btn);
    });

    const paletteGroup = document.createElement('div');
    paletteGroup.className = 'theme-switch__group';
    paletteGroup.setAttribute('role', 'group');
    paletteGroup.setAttribute('aria-label', 'Цветовая палитра');
    PALETTES.forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-switch__btn theme-switch__btn--palette';
      btn.dataset.palette = p.id;
      btn.title = p.label;
      btn.setAttribute('aria-label', `Палитра ${p.label}`);
      btn.style.setProperty('--swatch', p.swatch);
      btn.textContent = p.label[0];
      btn.addEventListener('click', () => { applyPalette(p.id); syncPressed(); });
      paletteGroup.appendChild(btn);
    });

    host.appendChild(themeGroup);
    host.appendChild(paletteGroup);

    function syncPressed() {
      const t = currentTheme();
      const p = currentPalette();
      themeGroup.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.theme === t));
      });
      paletteGroup.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.palette === p));
      });
    }
    syncPressed();
  }

  function init() {
    const theme = readStored(STORAGE.theme, 'dark', THEMES);
    const palette = readStored(STORAGE.palette, 'teal', PALETTES.map((p) => p.id));
    applyTheme(theme);
    applyPalette(palette);

    const host = document.querySelector('[data-theme-switch]');
    if (host) mountSwitcher(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
