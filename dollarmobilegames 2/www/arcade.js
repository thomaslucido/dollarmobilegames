/* Web preview shelf: lists every game in games.json. Each game ships to the App Store as its own app. */
(function () {
  const shelf = document.getElementById('shelf');
  const isNew = (g) => (Date.now() - new Date(g.added + 'T12:00:00').getTime()) < 8 * 864e5;
  const LABEL = { submitted: 'On the App Store', queued: 'Coming Sunday' };
  fetch('games.json').then((r) => r.json()).then((list) => {
    list.slice().sort((a, b) => (b.added || '').localeCompare(a.added || '')).forEach((g) => {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = 'games/' + g.slug + '/index.html';
      card.innerHTML = '<img alt="" src="games/' + g.slug + '/icon.svg"><div class="meta"><div class="name"></div><div class="tag"></div></div><span class="btn">Play</span>';
      card.querySelector('.name').textContent = g.name;
      if (isNew(g)) card.querySelector('.name').insertAdjacentHTML('beforeend', '<span class="new">NEW</span>');
      card.querySelector('.tag').textContent = g.tagline + (LABEL[g.status] ? ' ' + LABEL[g.status] + '.' : '');
      shelf.appendChild(card);
    });
  });
})();
