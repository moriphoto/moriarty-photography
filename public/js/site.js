const STILLS_BASE = 'https://moriphoto.github.io/moriarty-photography/stills/';

let works = [];
let current = 0;

async function loadWorks() {
  const res = await fetch('data/works.json');
  const data = await res.json();
  works = data.pieces || [];
  if (works.length) show(0);
  renderGrid();
}

function show(i) {
  current = (i + works.length) % works.length;
  const w = works[current];
  document.getElementById('hero').src = STILLS_BASE + w.src;
  document.getElementById('title').textContent = w.title || '';
  document.getElementById('note').textContent = w.note || '';
  document.getElementById('kicker').textContent = w.kicker || 'Photography';
  document.getElementById('counter').textContent = `${current + 1} / ${works.length}`;
  document.getElementById('viewer').style.display = 'block';
  document.getElementById('grid').classList.remove('open');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('open'));
}

function renderGrid() {
  const tiles = document.getElementById('tiles');
  tiles.innerHTML = works.map((w, i) => `
    <div class="tile" data-i="${i}">
      <img src="${STILLS_BASE}${w.src}" alt="${w.title}">
      <span>${w.title}</span>
    </div>
  `).join('');
  tiles.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', () => show(+t.dataset.i));
  });
}

document.getElementById('prev').addEventListener('click', () => show(current - 1));
document.getElementById('next').addEventListener('click', () => show(current + 1));

document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const nav = el.dataset.nav;
    document.getElementById('viewer').style.display = nav === 'work' || nav === 'grid' ? '' : 'none';
    document.getElementById('grid').classList.toggle('open', nav === 'grid');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('open'));
    if (nav === 'about' || nav === 'contact') {
      document.getElementById(nav).classList.add('open');
      document.getElementById('viewer').style.display = 'none';
    }
    if (nav === 'work') show(current);
  });
});

loadWorks();
