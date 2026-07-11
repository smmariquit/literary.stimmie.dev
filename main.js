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
    navigateTo(paper.slug);
  });
  nav.appendChild(btn);
});

function navigateTo(slug) {
  const path = slug ? `/${slug}` : '/';
  history.pushState(null, '', path);
  render(slug);
}

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
    document.title = `${paper.title} | Literary`;

    // Extract excerpt for meta tags
    const temp = document.createElement('div');
    temp.innerHTML = paper.body;
    const text = temp.textContent || temp.innerText || '';
    const excerpt = text.trim().substring(0, 160) + (text.length > 160 ? '...' : '');
    
    const metaDesc = document.getElementById('meta-desc');
    const ogDesc = document.getElementById('og-desc');
    if (metaDesc) metaDesc.setAttribute('content', excerpt);
    if (ogDesc) ogDesc.setAttribute('content', excerpt);

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

  document.title = 'Literary | stimmie';

  const metaDesc = document.getElementById('meta-desc');
  const ogDesc = document.getElementById('og-desc');
  if (metaDesc) metaDesc.setAttribute('content', 'Writing by stimmie. Longform and shortform pieces.');
  if (ogDesc) ogDesc.setAttribute('content', 'Writing by stimmie. Longform and shortform pieces.');

  // Show the first paper by default
  if (papers.length > 0) {
    navigateTo(papers[0].slug);
  }
}

// Handle back/forward navigation
window.addEventListener('popstate', () => {
  const slug = slugFromPath();
  render(slug);
});

function slugFromPath() {
  const path = window.location.pathname;
  return path === '/' ? '' : path.replace(/^\//, '').replace(/\/$/, '');
}

// Initial render
const initialSlug = slugFromPath();
if (initialSlug) {
  render(initialSlug);
} else {
  renderLanding();
}
