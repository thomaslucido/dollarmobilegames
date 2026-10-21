/* Dollar Arcade shelf: lists games from games.json and handles $0.99 unlocks via Apple IAP.
   On the web (no native bridge) every game is playable as a preview. */
(function () {
  const OWNED_KEY = 'da.owned';
  const shelf = document.getElementById('shelf');
  const toastEl = document.getElementById('toast');
  const native = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const IAP = native && window.Capacitor.Plugins ? window.Capacitor.Plugins.NativePurchases : null;

  let games = [];
  let prices = {};
  let owned = new Set(readOwned());

  function readOwned() { try { return JSON.parse(localStorage.getItem(OWNED_KEY) || '[]'); } catch (e) { return []; } }
  function saveOwned() { try { localStorage.setItem(OWNED_KEY, JSON.stringify([...owned])); } catch (e) {} }
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('on'), 2600); }

  const unlocked = (g) => g.free || !native || owned.has(g.productId);
  const isNew = (g) => (Date.now() - new Date(g.added + 'T12:00:00').getTime()) < 8 * 864e5;

  function render() {
    shelf.innerHTML = '';
    games.forEach((g) => {
      const card = document.createElement('div');
      card.className = 'card';
      const open = unlocked(g);
      const label = open ? 'Play' : (prices[g.productId] || '$0.99');
      card.innerHTML =
        '<img alt="" src="games/' + g.slug + '/icon.svg">' +
        '<div class="meta"><div class="name"></div><div class="tag"></div></div>' +
        '<button class="btn ' + (open ? '' : 'buy') + '">' + label + '</button>';
      card.querySelector('.name').textContent = g.name;
      if (isNew(g)) card.querySelector('.name').insertAdjacentHTML('beforeend', '<span class="new">NEW</span>');
      card.querySelector('.tag').textContent = g.free ? g.tagline + ' Free.' : g.tagline;
      const btn = card.querySelector('.btn');
      const go = (e) => { e.stopPropagation(); open ? play(g) : buy(g, btn); };
      btn.addEventListener('click', go);
      card.addEventListener('click', go);
      shelf.appendChild(card);
    });
    document.getElementById('mode').textContent = (native || /shot/.test(location.search)) ? '' : 'Web preview: every game is playable here.';
  }

  function play(g) { window.location.href = 'games/' + g.slug + '/index.html'; }

  async function buy(g, btn) {
    if (!IAP) return play(g);
    btn.disabled = true; btn.textContent = '...';
    try {
      const tx = await IAP.purchaseProduct({ productIdentifier: g.productId, quantity: 1 });
      if (tx && tx.productIdentifier) { owned.add(tx.productIdentifier); saveOwned(); toast(g.name + ' unlocked. Have fun!'); }
    } catch (e) {
      const msg = String((e && (e.message || e.code)) || e);
      if (!/cancel/i.test(msg)) toast('Purchase did not go through. Please try again.');
    }
    render();
  }

  async function syncOwned() {
    if (!IAP) return;
    try {
      const { purchases } = await IAP.getPurchases();
      const ids = (purchases || []).map((p) => p.productIdentifier).filter(Boolean);
      owned = new Set(ids); saveOwned();
    } catch (e) { /* keep cached set offline */ }
  }

  async function loadPrices() {
    if (!IAP) return;
    const ids = games.filter((g) => !g.free && g.productId).map((g) => g.productId);
    if (!ids.length) return;
    try {
      const { products } = await IAP.getProducts({ productIdentifiers: ids });
      (products || []).forEach((p) => { prices[p.identifier || p.productIdentifier] = p.priceString; });
    } catch (e) {}
  }

  document.getElementById('restore').addEventListener('click', async () => {
    if (!IAP) return toast('Purchases restore inside the iPhone app.');
    try { await IAP.restorePurchases(); await syncOwned(); render(); toast('Purchases restored.'); }
    catch (e) { toast('Could not reach the App Store. Try again in a moment.'); }
  });

  fetch('games.json').then((r) => r.json()).then(async (list) => {
    // newest first, free starter pinned to the top
    games = list.slice().sort((a, b) => (b.free - a.free) || (b.added || '').localeCompare(a.added || ''));
    render();
    await syncOwned(); await loadPrices(); render();
  });
})();
