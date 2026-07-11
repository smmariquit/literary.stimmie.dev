import papers from './papers.js';

const nav = document.getElementById('paper-nav');
const titleEl = document.getElementById('paper-title');
const metaEl = document.getElementById('paper-meta');
const bodyEl = document.getElementById('paper-body');
const articleEl = document.getElementById('paper');

// Build nav buttons
papers.forEach((paper) => {
  const btn = document.createElement('button');
  btn.textContent = paper.title;
  btn.setAttribute('data-slug', paper.slug);
  btn.addEventListener('click', () => {
    window.location.hash = paper.slug;
  });
  nav.appendChild(btn);
});

function render(slug) {
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) {
    renderLanding();
    return;
  }

  // Brief fade
  articleEl.classList.add('loading');

  requestAnimationFrame(() => {
    titleEl.textContent = paper.title;
    metaEl.textContent = `stimmie · ${paper.date} · ${paper.form}`;
    bodyEl.innerHTML = paper.body;

    // Update nav active state
    nav.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.slug === slug);
    });

    // Update page title
    document.title = `${paper.title} — Literary`;

    // Scroll to top of reader
    window.scrollTo({ top: 0, behavior: 'instant' });

    requestAnimationFrame(() => {
      articleEl.classList.remove('loading');
    });
  });
}

function renderLanding() {
  titleEl.textContent = '';
  metaEl.textContent = '';
  bodyEl.innerHTML = '';

  nav.querySelectorAll('button').forEach((btn) => {
    btn.classList.remove('active');
  });

  document.title = 'Literary — stimmie';

  // Show the first paper by default
  if (papers.length > 0) {
    window.location.hash = papers[0].slug;
  }
}

// Route on hash change
window.addEventListener('hashchange', () => {
  render(window.location.hash.slice(1));
});

// Initial render
const initialSlug = window.location.hash.slice(1);
if (initialSlug) {
  render(initialSlug);
} else {
  renderLanding();
}
