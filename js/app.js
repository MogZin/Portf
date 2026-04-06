import { currencyBRL, getProducts, installment, stockLabel } from './data.js';

const state = {
  products: getProducts(),
  maxPrice: 1400,
  category: 'todos',
  brand: 'todas',
  tag: 'todas',
  size: 'todos',
  minRating: 0,
  sortBy: 'recent'
};

const el = {
  grid: document.getElementById('products-grid'),
  noResults: document.getElementById('no-results'),
  filterCategory: document.getElementById('filter-category'),
  filterBrand: document.getElementById('filter-brand'),
  filterTag: document.getElementById('filter-tag'),
  filterSize: document.getElementById('filter-size'),
  filterRating: document.getElementById('filter-rating'),
  filterPrice: document.getElementById('filter-price'),
  priceValue: document.getElementById('price-value'),
  sortBy: document.getElementById('sort-by'),
  themeToggle: document.getElementById('theme-toggle'),
  scrollTop: document.getElementById('scroll-top')
};

function uniqueValues(mapper) {
  return [...new Set(state.products.flatMap(mapper))];
}

function populateSelect(node, options, allLabel) {
  node.innerHTML = `<option value="${allLabel.value}">${allLabel.label}</option>` +
    options.map((v) => `<option value="${v}">${v}</option>`).join('');
}

function renderSkeletons() {
  el.grid.innerHTML = Array.from({ length: 6 }).map(() => `
    <article class="product-card card skeleton">
      <div class="skeleton-box image"></div>
      <div class="skeleton-box line"></div>
      <div class="skeleton-box line short"></div>
    </article>
  `).join('');
}

function applyThemeFromStorage() {
  const saved = localStorage.getItem('vf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  el.themeToggle.textContent = saved === 'dark' ? '🌙 Tema' : '☀️ Tema';
}

function setupFilters() {
  populateSelect(el.filterCategory, uniqueValues((p) => p.category), { value: 'todos', label: 'Todas categorias' });
  populateSelect(el.filterBrand, uniqueValues((p) => p.brand), { value: 'todas', label: 'Todas marcas' });
  populateSelect(el.filterTag, uniqueValues((p) => p.tags), { value: 'todas', label: 'Todas tags' });
  populateSelect(el.filterSize, uniqueValues((p) => p.sizes), { value: 'todos', label: 'Todos tamanhos' });
  el.filterRating.innerHTML = `
    <option value="0">Qualquer nota</option>
    <option value="4">4+ estrelas</option>
    <option value="4.5">4.5+ estrelas</option>
    <option value="4.8">4.8+ estrelas</option>
  `;
}

function filteredProducts() {
  const result = state.products.filter((p) => {
    const byCategory = state.category === 'todos' || p.category === state.category;
    const byBrand = state.brand === 'todas' || p.brand === state.brand;
    const byTag = state.tag === 'todas' || p.tags.includes(state.tag);
    const bySize = state.size === 'todos' || p.sizes.includes(state.size);
    const byRating = p.rating >= state.minRating;
    const byPrice = p.price <= state.maxPrice;
    return byCategory && byBrand && byTag && bySize && byRating && byPrice;
  });

  const sorters = {
    recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'rating-desc': (a, b) => b.rating - a.rating
  };

  return result.sort(sorters[state.sortBy]);
}

function cardTemplate(p) {
  return `
  <article class="product-card card micro">
    <img src="${p.image}" alt="${p.name}" loading="lazy" />
    <span class="stock stock-${p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : 'ok'}">${stockLabel(p.stock)}</span>
    <h3>${p.name}</h3>
    <p class="meta">${p.brand} • ${p.category} • ⭐ ${p.rating} (${p.reviews})</p>
    <p><strong>${currencyBRL(p.price)}</strong></p>
    <p class="installments">${installment(p.price)}</p>
    <p class="tags">${p.tags.map((tag) => `<span>#${tag}</span>`).join(' ')}</p>
    <a class="btn" href="product.html?slug=${p.slug}">Ver produto</a>
  </article>`;
}

function renderProducts() {
  const products = filteredProducts();
  el.noResults.classList.toggle('hidden', products.length > 0);
  el.grid.innerHTML = products.map(cardTemplate).join('');
}

function bindEvents() {
  el.filterCategory.addEventListener('change', (e) => { state.category = e.target.value; renderProducts(); });
  el.filterBrand.addEventListener('change', (e) => { state.brand = e.target.value; renderProducts(); });
  el.filterTag.addEventListener('change', (e) => { state.tag = e.target.value; renderProducts(); });
  el.filterSize.addEventListener('change', (e) => { state.size = e.target.value; renderProducts(); });
  el.filterRating.addEventListener('change', (e) => { state.minRating = Number(e.target.value); renderProducts(); });
  el.filterPrice.addEventListener('input', (e) => {
    state.maxPrice = Number(e.target.value);
    el.priceValue.textContent = `Até ${currencyBRL(state.maxPrice)}`;
    renderProducts();
  });
  el.sortBy.addEventListener('change', (e) => { state.sortBy = e.target.value; renderProducts(); });

  el.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vf_theme', next);
    el.themeToggle.textContent = next === 'dark' ? '🌙 Tema' : '☀️ Tema';
  });

  window.addEventListener('scroll', () => {
    el.scrollTop.classList.toggle('visible', window.scrollY > 300);
  });

  el.scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function init() {
  applyThemeFromStorage();
  setupFilters();
  bindEvents();
  el.priceValue.textContent = `Até ${currencyBRL(state.maxPrice)}`;
  renderSkeletons();
  setTimeout(renderProducts, 400);
}

init();
