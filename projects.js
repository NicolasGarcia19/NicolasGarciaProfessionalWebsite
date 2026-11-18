// Builds both Projects pages from projects-data.js:
//   projects.html -> the grid of project cards
//   project.html  -> one project page (climb or basic template)
(function () {
  'use strict';

  const projects = window.PROJECTS || [];

  // Same difficulty colors as the main wall: easiest -> hardest.
  const GRADES = [
    { bg: '#e3c53a', fg: '#1f1c1a' },
    { bg: '#6bb04a', fg: '#1f1c1a' },
    { bg: '#3a9ad0', fg: '#1f1c1a' },
    { bg: '#7a62c8', fg: '#ffffff' },
    { bg: '#d9772f', fg: '#1f1c1a' },
    { bg: '#c0453a', fg: '#ffffff' },
    { bg: '#2a2a2e', fg: '#ffffff' }
  ];
  const gradeAt = (i, n) => GRADES[n > 1 ? Math.round((i / (n - 1)) * (GRADES.length - 1)) : 0];

  // ---------- helpers ----------
  function el(tag, attrs, kids) {
    const node = document.createElement(tag);
    Object.keys(attrs || {}).forEach((k) => {
      const v = attrs[k];
      if (v === false || v == null) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach((c) => { if (c) node.appendChild(c); });
    return node;
  }

  // Image with a labeled gray placeholder when the file is missing
  function photo(src, label, extraClass, alt) {
    const name = label || (src ? src.split('/').pop() : 'image');
    const ph = el('div', { class: 'ph' + (extraClass ? ' ' + extraClass : ''), 'data-label': name });
    if (src) {
      const img = el('img', { src: src, alt: alt || '' });
      img.addEventListener('error', () => ph.classList.add('missing'));
      ph.appendChild(img);
    } else {
      ph.classList.add('missing');
    }
    return ph;
  }

  function mulberry32(seed) {          // seeded random so each wall looks the same every load
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedFrom(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // ---------- projects.html: card grid ----------
  const grid = document.getElementById('projectGrid');
  if (grid) {
    projects.forEach((p) => {
      const card = el('a', { class: 'project', href: 'project.html?p=' + encodeURIComponent(p.slug) });
      card.appendChild(photo(p.image, null, null, ''));
      card.appendChild(el('h3', { text: p.title }));
      card.appendChild(el('p', { text: p.summary }));
      grid.appendChild(card);
    });
  }

  // ---------- project.html: one project ----------
  const root = document.getElementById('projectRoot');
  if (root) renderProject(root);

  function renderProject(root) {
    const slug = new URLSearchParams(location.search).get('p');
    const idx = projects.findIndex((p) => p.slug === slug);

    const nav = el('div', { class: 'proj-nav' }, [
      el('a', { class: 'btn primary', href: 'projects.html', text: '← All projects' }),
      el('a', { class: 'btn', href: 'index.html', text: 'Back to the climb' })
    ]);
    root.appendChild(nav);

    if (idx < 0) {
      root.appendChild(el('h1', { text: 'Project not found' }));
      root.appendChild(el('p', { class: 'lead', text: 'That project link doesn\'t match anything. Pick a project from the list.' }));
      return;
    }

    const p = projects[idx];
    document.title = p.title + ' | Nicolas Garcia';

    // header
    const head = el('header', { class: 'proj-head' }, [
      el('h1', { text: p.title }),
      el('p', { class: 'lead', text: p.intro || p.summary || '' })
    ]);
    if (p.tags && p.tags.length) {
      const tags = el('ul', { class: 'badges proj-tags' });
      p.tags.forEach((t) => tags.appendChild(el('li', { text: t })));
      head.appendChild(tags);
    }
    if (p.links && p.links.length) {
      const links = el('div', { class: 'buttons' });
      p.links.forEach((l) => links.appendChild(el('a', { class: 'btn', href: l.href, target: '_blank', rel: 'noopener', text: l.label })));
      head.appendChild(links);
    }
    root.appendChild(head);
    root.appendChild(photo(p.image, null, 'proj-hero', p.title));

    // body
    root.appendChild(p.template === 'climb' ? renderClimb(p) : renderBasic(p));

    // previous / next project
    const prev = projects[idx - 1], next = projects[idx + 1];
    const pager = el('nav', { class: 'proj-pager', 'aria-label': 'More projects' });
    pager.appendChild(prev ? el('a', { class: 'btn', href: 'project.html?p=' + encodeURIComponent(prev.slug), text: '← ' + prev.title }) : el('span'));
    pager.appendChild(next ? el('a', { class: 'btn', href: 'project.html?p=' + encodeURIComponent(next.slug), text: next.title + ' →' }) : el('span'));
    root.appendChild(pager);
  }

  // ---------- Template 1: horizontal climb ----------
  function renderClimb(p) {
    const steps = p.steps || [];
    const sec = el('section', { class: 'climb', 'aria-labelledby': 'climbHeading' });
    sec.appendChild(el('h2', { id: 'climbHeading', text: p.climbTitle || 'The climb' }));
    sec.appendChild(el('p', { class: 'climb-hint', text: p.climbHint || 'Each hold is a step in how this project came together. Hover over a hold, or tap it, to see how I got there.' }));
    if (!steps.length) return sec;

    sec.appendChild(el('div', { class: 'traverse-legend', 'aria-hidden': 'true' }, [
      el('span', { text: 'Start' }), el('span', { class: 'line' }), el('span', { text: 'Finish' })
    ]));
    const wall = el('div', { class: 'traverse' });
    const detail = el('div', { class: 'traverse-detail', 'aria-live': 'polite' });
    sec.appendChild(wall);
    sec.appendChild(detail);

    const rand = mulberry32(seedFrom(p.slug));
    const n = steps.length;
    const holds = [], pops = [];

    steps.forEach((s, i) => {
      const t = n > 1 ? i / (n - 1) : 0.5;
      const x = 9 + t * 82;                                              // left -> right
      const y = Math.min(82, Math.max(18, 74 - t * 48 + (rand() - 0.5) * 16)); // low -> high
      const g = gradeAt(i, n);
      const w = 58 + rand() * 14;
      const h = w * (0.74 + rand() * 0.34);

      const hold = el('button', {
        type: 'button',
        class: 'step-hold shape-' + Math.floor(rand() * 4),
        'aria-controls': 'pop-' + i,
        'aria-label': 'Step ' + (i + 1) + ': ' + s.title
      }, [el('span', { text: String(i + 1) })]);
      hold.style.setProperty('--hx', x.toFixed(1) + '%');
      hold.style.setProperty('--hy', y.toFixed(1) + '%');
      hold.style.setProperty('--w', w.toFixed(1) + 'px');
      hold.style.setProperty('--h', h.toFixed(1) + 'px');
      hold.style.setProperty('--r', Math.round(rand() * 40 - 20) + 'deg');
      hold.style.setProperty('--bg', g.bg);
      hold.style.setProperty('--fg', g.fg);
      wall.appendChild(hold);
      holds.push(hold);

      const pop = el('article', { class: 'pop', id: 'pop-' + i, hidden: true });
      pop.style.setProperty('--x', x.toFixed(1) + '%');
      pop.style.setProperty('--lc', g.bg);
      if (s.image) pop.appendChild(photo(s.image, null, 'pop-img', s.title));
      pop.appendChild(el('div', { class: 'pop-head' }, [
        el('span', { class: 'pop-step', text: 'Step ' + (i + 1) }),
        s.stat ? el('span', { class: 'stat', text: s.stat }) : null
      ]));
      pop.appendChild(el('h3', { text: s.title }));
      pop.appendChild(el('p', { text: s.text }));
      detail.appendChild(pop);
      pops.push(pop);

      // Last hovered hold stays selected, so you can move the mouse down to read.
      hold.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activate(i); });
      hold.addEventListener('click', () => activate(i));
      hold.addEventListener('focus', () => activate(i));
      hold.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && holds[i + 1]) { e.preventDefault(); holds[i + 1].focus(); }
        if (e.key === 'ArrowLeft' && holds[i - 1]) { e.preventDefault(); holds[i - 1].focus(); }
      });
    });

    function activate(i) {
      holds.forEach((h, j) => {
        h.classList.toggle('active', j === i);
        h.setAttribute('aria-expanded', String(j === i));
      });
      pops.forEach((pp, j) => { pp.hidden = j !== i; });
    }

    // Reserve room for the tallest step so the page below doesn't jump around.
    function fitDetail() {
      detail.style.minHeight = '0px';
      let max = 0;
      pops.forEach((pp) => {
        const wasHidden = pp.hidden;
        pp.hidden = false;
        pp.style.animation = 'none';
        max = Math.max(max, pp.offsetHeight);
        pp.hidden = wasHidden;
        pp.style.animation = '';
      });
      detail.style.minHeight = max + 'px';
    }

    // The element must be in the page before it can be measured.
    requestAnimationFrame(() => { fitDetail(); activate(0); });
    window.addEventListener('load', fitDetail);
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitDetail, 150); });

    return sec;
  }

  // ---------- Template 2: basic page (route info, images, pitch tabs) ----------
  function renderBasic(p) {
    const frag = document.createDocumentFragment();

    // Route info (key facts)
    if (p.facts && p.facts.length) {
      const sec = el('section', { 'aria-labelledby': 'factsHeading' });
      sec.appendChild(el('h2', { id: 'factsHeading', text: 'Route info' }));
      const dl = el('dl', { class: 'facts' });
      p.facts.forEach((f) => dl.appendChild(el('div', { class: 'fact' }, [el('dt', { text: f.label }), el('dd', { text: f.value })])));
      sec.appendChild(dl);
      frag.appendChild(sec);
    }

    // Images (click to enlarge)
    if (p.images && p.images.length) {
      const sec = el('section', { 'aria-labelledby': 'galleryHeading' });
      sec.appendChild(el('h2', { id: 'galleryHeading', text: 'Gallery' }));
      sec.appendChild(el('p', { class: 'climb-hint', text: 'Click an image to enlarge it.' }));
      const shots = el('div', { class: 'shots' });
      p.images.forEach((im) => {
        const btn = el('button', { type: 'button', class: 'shot', 'aria-label': 'Enlarge image' + (im.caption ? ': ' + im.caption : '') }, [
          photo(im.src, null, 'shot-img', im.caption || '')
        ]);
        btn.addEventListener('click', () => openLightbox(im));
        shots.appendChild(el('figure', { class: 'shot-fig' }, [btn, im.caption ? el('figcaption', { text: im.caption }) : null]));
      });
      sec.appendChild(shots);
      frag.appendChild(sec);
    }

    // Pitches: a multi-pitch route you climb one section at a time
    if (p.pitches && p.pitches.length) {
      const pitches = p.pitches, n = pitches.length;
      const sec = el('section', { 'aria-labelledby': 'routeHeading' });
      sec.appendChild(el('h2', { id: 'routeHeading', text: p.routeTitle || 'The route' }));
      sec.appendChild(el('p', { class: 'climb-hint', text: p.routeHint || 'Long climbs are split into pitches. Select a pitch to read that part of the story.' }));

      const wrap = el('div', { class: 'pitch-wrap' });
      const route = el('div', { class: 'pitch-route', role: 'tablist', 'aria-orientation': 'vertical', 'aria-label': 'Pitches' });
      const panel = el('div', { class: 'pitch-panel', role: 'tabpanel', id: 'pitch-panel', tabindex: '0' });

      const tabs = pitches.map((pt, i) => {
        const g = gradeAt(i, n);
        const dot = el('span', { class: 'dot', text: String(i + 1) });
        dot.style.setProperty('--bg', g.bg);
        dot.style.setProperty('--fg', g.fg);
        const tab = el('button', { type: 'button', class: 'pitch-tab', role: 'tab', id: 'pitch-tab-' + i, 'aria-controls': 'pitch-panel' }, [
          el('span', { class: 'seg up' }), el('span', { class: 'seg down' }), dot,
          el('span', { class: 'pitch-label' }, [el('small', { text: 'Pitch ' + (i + 1) }), el('strong', { text: pt.title })])
        ]);
        tab.addEventListener('click', () => select(i));
        tab.addEventListener('keydown', (e) => {
          let d = 0;
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') d = 1;      // up the route
          else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') d = -1;
          else return;
          e.preventDefault();
          const j = Math.min(n - 1, Math.max(0, i + d));
          select(j);
          tabs[j].focus();
        });
        route.appendChild(tab);
        return tab;
      });

      function select(i) {
        tabs.forEach((t, j) => {
          t.setAttribute('aria-selected', String(j === i));
          t.tabIndex = j === i ? 0 : -1;
          t.classList.toggle('current', j === i);
          t.classList.toggle('done-up', j < i);       // rope above the climber's dot... filled once passed
          t.classList.toggle('done-down', j <= i);    // rope below the dot, filled up to the climber
        });
        panel.setAttribute('aria-labelledby', 'pitch-tab-' + i);
        panel.replaceChildren(el('h3', { text: pitches[i].title }));
        [].concat(pitches[i].text || []).forEach((para) => panel.appendChild(el('p', { text: para })));
      }
      select(0);

      wrap.appendChild(route);
      wrap.appendChild(panel);
      sec.appendChild(wrap);
      frag.appendChild(sec);
    }
    return frag;
  }

  // Lightbox for enlarged images
  let lightbox;
  function openLightbox(im) {
    if (!lightbox) {
      lightbox = el('dialog', { class: 'lightbox', 'aria-label': 'Enlarged image' });
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
      document.body.appendChild(lightbox);
    }
    const close = el('button', { type: 'button', class: 'btn lightbox-close', text: 'Close' });
    close.addEventListener('click', () => lightbox.close());
    lightbox.replaceChildren(el('div', { class: 'lb-inner' }, [
      photo(im.src, null, 'lightbox-img', im.caption || ''),
      im.caption ? el('p', { class: 'lightbox-cap', text: im.caption }) : null,
      close
    ]));
    lightbox.showModal();
  }
})();
