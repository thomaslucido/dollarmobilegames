/* GameKit: the small shared layer every Dollar Arcade game uses.
   Back button, safe areas, best score, haptics, pause on background, canvas sizing. */
(function () {
  const KIT = {};
  let slug = 'game';
  let pausedHandlers = [];
  let resumedHandlers = [];

  const cap = () => (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ? window.Capacitor : null;

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, String(val));
    } catch (e) { return null; }
  }

  KIT.init = function (opts) {
    slug = (opts && opts.slug) || 'game';
    document.documentElement.style.setProperty('--safe-top', 'env(safe-area-inset-top, 0px)');
    document.documentElement.style.setProperty('--safe-bottom', 'env(safe-area-inset-bottom, 0px)');
    if (!(opts && opts.noBack)) addBack(opts && opts.backColor);
    document.addEventListener('visibilitychange', () => {
      (document.hidden ? pausedHandlers : resumedHandlers).forEach((f) => { try { f(); } catch (e) {} });
    });
    // stop iOS rubber-banding and double-tap zoom
    document.addEventListener('touchmove', (e) => { if (e.target === document.body || e.target.tagName === 'CANVAS') e.preventDefault(); }, { passive: false });
    document.addEventListener('dblclick', (e) => e.preventDefault());
    return KIT;
  };

  function addBack(color) {
    const b = document.createElement('button');
    b.id = 'gk-back';
    b.setAttribute('aria-label', 'Back to arcade');
    b.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
    b.style.cssText = 'position:fixed;z-index:1000;left:12px;top:calc(env(safe-area-inset-top,0px) + 10px);width:40px;height:40px;border-radius:20px;border:0;' +
      'background:rgba(0,0,0,.28);color:' + (color || '#fff') + ';display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;';
    b.addEventListener('click', (e) => { e.stopPropagation(); KIT.exit(); });
    b.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
    document.body.appendChild(b);
  }

  KIT.exit = function () { window.location.href = '../../index.html'; };
  KIT.best = function () { return Number(store('da.best.' + slug) || 0); };
  KIT.saveBest = function (n) { if (n > KIT.best()) { store('da.best.' + slug, n); return true; } return false; };
  KIT.get = function (k, d) { const v = store('da.' + slug + '.' + k); return v === null ? d : JSON.parse(v); };
  KIT.set = function (k, v) { store('da.' + slug + '.' + k, JSON.stringify(v)); };
  KIT.onPause = function (f) { pausedHandlers.push(f); };
  KIT.onResume = function (f) { resumedHandlers.push(f); };

  KIT.buzz = function (style) {
    const c = cap();
    try {
      if (c && c.Plugins && c.Plugins.Haptics) c.Plugins.Haptics.impact({ style: (style || 'light').toUpperCase() });
      else if (navigator.vibrate) navigator.vibrate(style === 'heavy' ? 30 : 10);
    } catch (e) {}
  };

  /* Size a canvas to the window at device pixel ratio. Returns {w,h,dpr} in CSS pixels;
     calls onResize again whenever the window changes. */
  KIT.fitCanvas = function (canvas, onResize) {
    const ctx = canvas.getContext('2d');
    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (onResize) onResize({ w, h, dpr });
    }
    window.addEventListener('resize', fit);
    fit();
    return ctx;
  };

  /* Tiny WebAudio blip synth. Muted until the first user gesture. */
  let actx = null;
  KIT.sound = function (freq, dur, type, vol) {
    try {
      if (!actx) return;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq || 440;
      g.gain.setValueAtTime(vol || 0.08, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.1));
      o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + (dur || 0.1));
    } catch (e) {}
  };
  const unlock = () => { try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} };
  window.addEventListener('pointerdown', unlock, { once: true });

  window.GameKit = KIT;
})();
