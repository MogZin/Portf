const DEFAULT_PRODUCTS = [
  {
    id: 1,
    slug: 'air-max-270',
    brand: 'Nike',
    name: 'Air Max 270',
    price: 749.9,
    rating: 4.9,
    reviews: 248,
    category: 'lifestyle',
    tags: ['casual', 'respiravel', 'premium'],
    sizes: ['38', '39', '40', '42', '43'],
    stock: 7,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80'
    ],
    createdAt: '2026-03-01',
    description: 'Conforto máximo para uso urbano com estilo esportivo.'
  },
  {
    id: 2,
    slug: 'ultraboost-22',
    brand: 'Adidas',
    name: 'Ultraboost 22',
    price: 899.9,
    rating: 4.8,
    reviews: 186,
    category: 'corrida',
    tags: ['corrida', 'amortecimento'],
    sizes: ['39', '40', '41', '42'],
    stock: 2,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80'
    ],
    createdAt: '2026-03-15',
    description: 'Retorno de energia e performance para treinos longos.'
  },
  {
    id: 3,
    slug: 'old-skool-classic',
    brand: 'Vans',
    name: 'Old Skool Classic',
    price: 389.9,
    rating: 4.7,
    reviews: 412,
    category: 'skate',
    tags: ['casual', 'couro'],
    sizes: ['36', '37', '38', '39', '40', '41'],
    stock: 0,
    image: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=1200&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80'
    ],
    createdAt: '2026-02-10',
    description: 'Ícone do streetwear com visual atemporal.'
  },
  {
    id: 4,
    slug: 'gel-nimbus-25',
    brand: 'Asics',
    name: 'Gel-Nimbus 25',
    price: 1099.9,
    rating: 4.9,
    reviews: 163,
    category: 'corrida',
    tags: ['corrida', 'premium', 'respiravel'],
    sizes: ['40', '41', '42', '43'],
    stock: 15,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80'
    ],
    createdAt: '2026-04-01',
    description: 'Tênis de corrida de alta performance para longa distância.'
  }
];

const getProducts = () => JSON.parse(localStorage.getItem('vf_products') || 'null') || DEFAULT_PRODUCTS;
const saveProducts = (products) => localStorage.setItem('vf_products', JSON.stringify(products));
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const installment = (price, n = 12) => `${brl(price)} em até ${n}x de ${brl(price / n)}`;
const stockLabel = (s) => (s <= 0 ? 'Esgotado' : s <= 3 ? 'Últimas unidades' : 'Em estoque');

const state = {
  products: getProducts(),
  category: 'todos',
  brand: 'todas',
  tag: 'todas',
  size: 'todos',
  rating: 0,
  maxPrice: 1400,
  sortBy: 'recent'
};

const el = {
  filterCategory: document.getElementById('filter-category'),
  filterBrand: document.getElementById('filter-brand'),
  filterTag: document.getElementById('filter-tag'),
  filterSize: document.getElementById('filter-size'),
  filterRating: document.getElementById('filter-rating'),
  filterPrice: document.getElementById('filter-price'),
  priceValue: document.getElementById('price-value'),
  sortBy: document.getElementById('sort-by'),
  productsGrid: document.getElementById('products-grid'),
  noResults: document.getElementById('no-results'),
  productView: document.getElementById('product-view'),
  catalogView: document.getElementById('catalog-view'),
  adminList: document.getElementById('admin-list'),
  themeToggle: document.getElementById('theme-toggle'),
  scrollTop: document.getElementById('scroll-top'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightbox-image'),
  lightboxClose: document.getElementById('lightbox-close')
};

function uniqueBy(mapper) {
  return [...new Set(state.products.flatMap(mapper))];
}

function fillSelect(node, list, allValue, allLabel) {
  node.innerHTML = `<option value="${allValue}">${allLabel}</option>${list.map((item) => `<option value="${item}">${item}</option>`).join('')}`;
}

function renderSkeleton() {
  el.productsGrid.innerHTML = Array.from({ length: 6 }).map(() => `
    <article class="card">
      <div class="skeleton image"></div>
      <div class="skeleton line"></div>
      <div class="skeleton line"></div>
    </article>
  `).join('');
}

function filterAndSortProducts() {
  const list = state.products.filter((p) => {
    const c = state.category === 'todos' || p.category === state.category;
    const b = state.brand === 'todas' || p.brand === state.brand;
    const t = state.tag === 'todas' || p.tags.includes(state.tag);
    const s = state.size === 'todos' || p.sizes.includes(state.size);
    const r = p.rating >= state.rating;
    const pr = p.price <= state.maxPrice;
    return c && b && t && s && r && pr;
  });

  const sorter = {
    recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'rating-desc': (a, b) => b.rating - a.rating
  };

  return list.sort(sorter[state.sortBy]);
}

function renderCatalog() {
  const items = filterAndSortProducts();
  el.noResults.classList.toggle('hidden', items.length > 0);

  el.productsGrid.innerHTML = items.map((p) => `
    <article class="card product-card">
      <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" />
      <h3>${p.name}</h3>
      <p class="product-meta">${p.brand} • ${p.category} • ⭐ ${p.rating} (${p.reviews})</p>
      <p><strong>${brl(p.price)}</strong></p>
      <p class="installments">${installment(p.price)}</p>
      <p><span class="stock stock-${p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : 'ok'}">${stockLabel(p.stock)}</span></p>
      <p>${p.tags.map((tag) => `<span class="tag">#${tag}</span>`).join('')}</p>
      <button class="btn" data-open="${p.slug}">Ver produto</button>
    </article>
  `).join('');

  el.productsGrid.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => openProduct(button.dataset.open));
  });
}

function relatedProducts(current) {
  return state.products
    .filter((p) => p.slug !== current.slug && (p.category === current.category || p.brand === current.brand))
    .slice(0, 3);
}

function openProduct(slug) {
  const product = state.products.find((p) => p.slug === slug);
  el.catalogView.classList.add('hidden');
  el.productView.classList.remove('hidden');

  if (!product) {
    el.productView.innerHTML = `
      <section class="card"><h2>Produto não encontrado</h2><p>Tente outro item do catálogo.</p></section>
    `;
    return;
  }

  el.productView.innerHTML = `
    <section class="card product-layout">
      <div>
        <img id="main-image" class="product-image" src="${product.gallery[0]}" alt="${product.name}" />
        <div class="thumbs">${product.gallery.map((img) => `<img class="thumb" src="${img}" alt="${product.name}" />`).join('')}</div>
      </div>
      <div>
        <h2>${product.name}</h2>
        <p class="product-meta">${product.brand} • ⭐ ${product.rating} (${product.reviews})</p>
        <p><strong>${brl(product.price)}</strong></p>
        <p class="installments">${installment(product.price)}</p>
        <p><span class="stock stock-${product.stock <= 0 ? 'out' : product.stock <= 3 ? 'low' : 'ok'}">${stockLabel(product.stock)}</span></p>
        <p>${product.description}</p>
        <p>${product.tags.map((tag) => `<span class="tag">#${tag}</span>`).join('')}</p>
        <button class="btn" id="back-catalog">← Voltar ao catálogo</button>
      </div>
    </section>

    <section class="card">
      <h3>Quem viu, viu também</h3>
      <div class="products-grid">
        ${relatedProducts(product).map((p) => `
          <article class="card product-card">
            <img class="product-image" src="${p.image}" alt="${p.name}" />
            <h4>${p.name}</h4>
            <p>${brl(p.price)}</p>
            <button class="btn" data-open="${p.slug}">Ver produto</button>
          </article>
        `).join('')}
      </div>
    </section>
  `;

  const mainImage = document.getElementById('main-image');
  el.productView.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => { mainImage.src = thumb.src; });
  });

  mainImage.addEventListener('click', () => {
    el.lightboxImage.src = mainImage.src;
    el.lightbox.classList.remove('hidden');
  });

  document.getElementById('back-catalog').addEventListener('click', () => {
    el.productView.classList.add('hidden');
    el.catalogView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  el.productView.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => openProduct(button.dataset.open));
  });
}

function renderAdmin() {
  el.adminList.innerHTML = state.products.map((p) => `
    <article class="card">
      <strong>${p.name}</strong>
      <p class="product-meta">${p.brand} — ${stockLabel(p.stock)}</p>
      <input type="number" min="0" value="${p.stock}" data-stock-id="${p.id}" />
    </article>
  `).join('');

  el.adminList.querySelectorAll('[data-stock-id]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const id = Number(event.target.dataset.stockId);
      const stock = Number(event.target.value);
      state.products = state.products.map((p) => p.id === id ? { ...p, stock } : p);
      saveProducts(state.products);
      renderCatalog();
      renderAdmin();
    });
  });
}

function applyTheme() {
  const saved = localStorage.getItem('vf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  el.themeToggle.textContent = saved === 'dark' ? '🌙 Tema' : '☀️ Tema';
}

function setupFilters() {
  fillSelect(el.filterCategory, uniqueBy((p) => p.category), 'todos', 'Todas categorias');
  fillSelect(el.filterBrand, uniqueBy((p) => p.brand), 'todas', 'Todas marcas');
  fillSelect(el.filterTag, uniqueBy((p) => p.tags), 'todas', 'Todas tags');
  fillSelect(el.filterSize, uniqueBy((p) => p.sizes), 'todos', 'Todos tamanhos');
  el.filterRating.innerHTML = `
    <option value="0">Qualquer nota</option>
    <option value="4">4+ estrelas</option>
    <option value="4.5">4.5+ estrelas</option>
    <option value="4.8">4.8+ estrelas</option>
  `;
}

function bindEvents() {
  el.filterCategory.addEventListener('change', (e) => { state.category = e.target.value; renderCatalog(); });
  el.filterBrand.addEventListener('change', (e) => { state.brand = e.target.value; renderCatalog(); });
  el.filterTag.addEventListener('change', (e) => { state.tag = e.target.value; renderCatalog(); });
  el.filterSize.addEventListener('change', (e) => { state.size = e.target.value; renderCatalog(); });
  el.filterRating.addEventListener('change', (e) => { state.rating = Number(e.target.value); renderCatalog(); });
  el.filterPrice.addEventListener('input', (e) => {
    state.maxPrice = Number(e.target.value);
    el.priceValue.textContent = `Até ${brl(state.maxPrice)}`;
    renderCatalog();
  });
  el.sortBy.addEventListener('change', (e) => { state.sortBy = e.target.value; renderCatalog(); });

  el.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vf_theme', next);
    el.themeToggle.textContent = next === 'dark' ? '🌙 Tema' : '☀️ Tema';
  });

  window.addEventListener('scroll', () => {
    el.scrollTop.style.opacity = window.scrollY > 240 ? '1' : '0.35';
  });

  el.scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  el.lightboxClose.addEventListener('click', () => el.lightbox.classList.add('hidden'));
  el.lightbox.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') el.lightbox.classList.add('hidden');
  });
}

function init() {
  applyTheme();
  setupFilters();
  bindEvents();
  el.priceValue.textContent = `Até ${brl(state.maxPrice)}`;
  renderSkeleton();
  setTimeout(() => {
    renderCatalog();
    renderAdmin();
  }, 450);
}

init();
