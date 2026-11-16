// true  = start at the bottom (base camp) and scroll UP to climb
// false = normal top-down page (hero at top, timeline reads downward)
const CLIMB_UP = true;

// true  = use photos from images/holds/hold-1.png ... hold-N.png when they exist
//         (level colors then don't apply to those holds)
// false = always draw the color-coded CSS holds
const USE_HOLD_PHOTOS = false;
const HOLD_IMAGE_COUNT = 7;

// Image placeholders: show a labeled block if an image file is missing
document.querySelectorAll('.ph img').forEach((img) => {
  const markMissing = () => img.parentElement.classList.add('missing');
  img.addEventListener('error', markMissing);
  if (img.complete && img.naturalWidth === 0) markMissing();
});

// ---------- Holds ----------
// Each .hold-row has data-holds (how many holds on that level). Lower levels have more
// holds; higher levels have fewer, and the holds shrink too, so the climb gets harder.
function mulberry32(seed) {            // small seeded random so the wall looks the same every load
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function probeHoldImages() {
  if (!USE_HOLD_PHOTOS) return Promise.resolve([]);
  const probes = [];
  for (let i = 1; i <= HOLD_IMAGE_COUNT; i++) {
    const src = `images/holds/hold-${i}.png`;
    probes.push(new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve(src);
      im.onerror = () => resolve(null);
      im.src = src;
    }));
  }
  return Promise.all(probes).then((list) => list.filter(Boolean));
}

function buildHolds(photos) {
  const rows = document.querySelectorAll('.hold-row');
  rows.forEach((row, idx) => {
    const layer = row.querySelector('.level-holds');
    if (!layer) return;
    const count = parseInt(row.dataset.holds, 10) || 4;
    const rand = mulberry32(idx * 977 + 13);
    const progress = rows.length > 1 ? idx / (rows.length - 1) : 0;
    const sizeScale = 1 - 0.45 * progress;      // 100% at the bottom -> 55% at the top
    const startLeft = rand() < 0.5;

    for (let i = 0; i < count; i++) {
      const hold = document.createElement('span');
      hold.className = 'hold shape-' + Math.floor(rand() * 4);

      // zigzag left/right across the wall
      const onLeft = (i % 2 === 0) === startLeft;
      const x = onLeft ? 0.14 + rand() * 0.30 : 0.56 + rand() * 0.30;
      const y = (i + 0.5) / count + (rand() - 0.5) * (0.5 / count);
      const w = (44 + rand() * 24) * sizeScale;
      const h = w * (0.72 + rand() * 0.4);

      hold.style.left = (x * 100) + '%';
      hold.style.top = (y * 100) + '%';
      hold.style.setProperty('--w', w.toFixed(1) + 'px');
      hold.style.setProperty('--h', h.toFixed(1) + 'px');
      hold.style.setProperty('--r', Math.round(rand() * 360 - 180) + 'deg');

      if (photos.length) {
        const img = document.createElement('img');
        img.src = photos[Math.floor(rand() * photos.length)];
        img.alt = '';
        hold.classList.add('has-img');
        hold.appendChild(img);
      }
      layer.appendChild(hold);
    }
  });
}

probeHoldImages().then(buildHolds);

// ---------- Cards fade in as they enter the viewport ----------
const cards = document.querySelectorAll('.card');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  cards.forEach((card) => observer.observe(card));
} else {
  cards.forEach((card) => card.classList.add('visible'));
}

// ---------- Climb-up mode: start scrolled to the bottom of the page ----------
if (CLIMB_UP) {
  document.body.classList.add('climb-up');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toBase = () => window.scrollTo(0, document.documentElement.scrollHeight);
  toBase();
  window.addEventListener('load', toBase);
}

// ---------- Navigation buttons ----------
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function atBase() {
  if (CLIMB_UP) {
    const fromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    return fromBottom < 60;
  }
  return window.scrollY < 60;
}

function updateButtons() {
  const base = atBase();
  startBtn.classList.toggle('show', base);     // landing page: offer "Start the climb"
  backBtn.classList.toggle('show', !base);     // anywhere else: offer "Base Camp"
}
window.addEventListener('scroll', updateButtons, { passive: true });
window.addEventListener('resize', updateButtons);
window.addEventListener('load', updateButtons);
updateButtons();

// Start the climb: scroll so the very bottom of the wall is at the bottom of the screen,
// which puts the skills section just out of view.
startBtn.addEventListener('click', () => {
  const rect = document.getElementById('wall').getBoundingClientRect();
  const top = CLIMB_UP
    ? rect.bottom + window.scrollY - window.innerHeight
    : rect.top + window.scrollY;
  window.scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
});

backBtn.addEventListener('click', () => {
  const top = CLIMB_UP ? document.documentElement.scrollHeight : 0;
  window.scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
});