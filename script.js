const PRODUCTS = [
  { id: 1, brand: 'Nike', name: 'Air Max 270', price: 749.9, oldPrice: 999.9, rating: 4.9, category: ['masculino', 'lifestyle'], tags: ['casual', 'respirável'], stock: 18, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', desc: 'Amortecimento Air para uso urbano com visual premium.' },
  { id: 2, brand: 'Adidas', name: 'Ultraboost 22', price: 899.9, oldPrice: null, rating: 4.8, category: ['corrida', 'masculino'], tags: ['corrida', 'espuma'], stock: 6, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', desc: 'Energia em cada passada com entressola BOOST.' },
  { id: 3, brand: 'Vans', name: 'Old Skool', price: 389.9, oldPrice: 459.9, rating: 4.7, category: ['lifestyle', 'feminino', 'masculino'], tags: ['casual', 'skate'], stock: 0, image: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800&q=80', desc: 'Ícone do skate com estilo atemporal.' },
  { id: 4, brand: 'Asics', name: 'Gel Nimbus 25', price: 1099.9, oldPrice: 1299.9, rating: 4.9, category: ['corrida', 'masculino'], tags: ['corrida', 'premium'], stock: 3, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', desc: 'Conforto máximo para corridas longas.' },
  { id: 5, brand: 'New Balance', name: '574 Core', price: 599.9, oldPrice: null, rating: 4.6, category: ['lifestyle', 'feminino'], tags: ['retro', 'casual'], stock: 12, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', desc: 'Silhueta clássica com toque contemporâneo.' }
];

const state = {
  selectedProduct: null,
  cart: [],
  filters: { category: 'todos', brand: 'todos', rating: 0, stock: 'todos', maxPrice: 2000, tag: '' },
  sort: 'recent'
};

const el = {
  productsGrid: document.getElementById('products-grid'),
  categoryFilter: document.getElementById('category-filter'),
  brandFilter: document.getElementById('brand-filter'),
  ratingFilter: document.getElementById('rating-filter'),
  stockFilter: document.getElementById('stock-filter'),
  priceFilter: document.getElementById('price-filter'),
  priceValue: document.getElementById('price-value'),
  tagSearch: document.getElementById('tag-search'),
  sortSelect: document.getElementById('sort-select'),
  modal: document.getElementById('product-modal'),
  overlay: document.getElementById('overlay'),
  cartPanel: document.getElementById('cart-panel'),
  cartItems: document.getElementById('cart-items'),
  cartBadge: document.getElementById('cart-badge'),
  cartTotal: document.getElementById('cart-total'),
  scrollTopBtn: document.getElementById('scroll-top'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightbox-image'),
  categoriesGrid: document.getElementById('categories-grid'),
  relatedGrid: document.getElementById('related-grid')
};

const formatBRL = n => `R$ ${n.toFixed(2).replace('.', ',')}`;
const installment = price => {
  const each = price / 12;
  return `em até 12x de ${formatBRL(each)}`;
};

function stockLabel(stock) {
  if (stock <= 0) return { text: 'Esgotado', cls: 'stock-out' };
  if (stock <= 5) return { text: 'Últimas unidades', cls: 'stock-low' };
  return { text: 'Em estoque', cls: 'stock-in' };
}

function skeletonLoading() {
  el.productsGrid.innerHTML = Array.from({ length: 6 }, () => '<div class="skeleton"></div>').join('');
}

function setBrands() {
  const brands = [...new Set(PRODUCTS.map(p => p.brand))];
  el.brandFilter.innerHTML += brands.map(b => `<option value="${b}">${b}</option>`).join('');
}

function renderCategories() {
  const all = PRODUCTS.flatMap(p => p.category);
  const counts = all.reduce((acc, c) => ((acc[c] = (acc[c] || 0) + 1), acc), {});
  el.categoriesGrid.innerHTML = Object.entries(counts)
    .map(([cat, count]) => `<div class="category-card"><strong>${cat}</strong><p class="muted">${count} produto(s)</p></div>`)
    .join('');
}

function applyFilters(products) {
  return products.filter(p => {
    const byCategory = state.filters.category === 'todos' || p.category.includes(state.filters.category);
    const byBrand = state.filters.brand === 'todos' || p.brand === state.filters.brand;
    const byRating = p.rating >= Number(state.filters.rating);
    const byStock = state.filters.stock === 'todos'
      || (state.filters.stock === 'in' && p.stock > 5)
      || (state.filters.stock === 'low' && p.stock > 0 && p.stock <= 5)
      || (state.filters.stock === 'out' && p.stock <= 0);
    const byPrice = p.price <= Number(state.filters.maxPrice);
    const byTag = !state.filters.tag || p.tags.some(tag => tag.toLowerCase().includes(state.filters.tag));
    return byCategory && byBrand && byRating && byStock && byPrice && byTag;
  });
}

function applySort(products) {
  const list = [...products];
  switch (state.sort) {
    case 'price-asc': return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'rating': return list.sort((a, b) => b.rating - a.rating);
    default: return list.sort((a, b) => b.id - a.id);
  }
}

function renderProducts() {
  skeletonLoading();
  setTimeout(() => {
    const filtered = applySort(applyFilters(PRODUCTS));
    if (!filtered.length) {
      el.productsGrid.innerHTML = '<p class="muted">Nenhum produto encontrado para os filtros atuais.</p>';
      return;
    }

    el.productsGrid.innerHTML = filtered.map(p => {
      const stock = stockLabel(p.stock);
      return `
      <article class="card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" class="card-image" />
        <div class="card-body">
          <p class="brand">${p.brand}</p>
          <h3>${p.name}</h3>
          <div class="price-row">
            <strong>${formatBRL(p.price)}</strong>
            ${p.oldPrice ? `<span class="old-price">${formatBRL(p.oldPrice)}</span>` : ''}
          </div>
          <p class="parcelas">${installment(p.price)}</p>
          <p class="stock-pill ${stock.cls}">${stock.text}</p>
          <p class="muted">⭐ ${p.rating}</p>
          <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <button class="btn add-btn" ${p.stock <= 0 ? 'disabled' : ''}>Adicionar</button>
        </div>
      </article>`;
    }).join('');

    bindProductEvents();
  }, 420);
}

function bindProductEvents() {
  document.querySelectorAll('.card').forEach(card => {
    const id = Number(card.dataset.id);
    const product = PRODUCTS.find(p => p.id === id);
    card.querySelector('.card-image').addEventListener('click', () => openLightbox(product.image));
    card.addEventListener('click', e => {
      if (e.target.classList.contains('add-btn')) {
        e.stopPropagation();
        addToCart(product);
        return;
      }
      openModal(product);
    });
  });
}

function openModal(product) {
  state.selectedProduct = product;
  document.getElementById('modal-image').src = product.image;
  document.getElementById('modal-title').textContent = `${product.brand} ${product.name}`;
  document.getElementById('modal-price').textContent = formatBRL(product.price);
  document.getElementById('modal-installments').textContent = installment(product.price);
  document.getElementById('modal-tags').innerHTML = product.tags.map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('modal-desc').textContent = product.desc;
  const stock = stockLabel(product.stock);
  const stockEl = document.getElementById('modal-stock');
  stockEl.className = `stock-pill ${stock.cls}`;
  stockEl.textContent = stock.text;
  showOverlay();
  el.modal.classList.add('show');
  renderRelated(product);
}

function closeModal() { el.modal.classList.remove('show'); hideOverlayIfNone(); }
function openLightbox(src) {
  el.lightboxImage.src = src;
  showOverlay();
  el.lightbox.classList.add('show');
}
function closeLightbox() { el.lightbox.classList.remove('show'); hideOverlayIfNone(); }

function renderRelated(product) {
  const related = PRODUCTS.filter(p => p.id !== product.id && p.category.some(c => product.category.includes(c))).slice(0, 4);
  el.relatedGrid.innerHTML = related.map(p => `<article class="card"><img src="${p.image}" alt="${p.name}" /><div class="card-body"><p class="brand">${p.brand}</p><strong>${p.name}</strong><p class="muted">${formatBRL(p.price)}</p></div></article>`).join('');
}

function addToCart(product) {
  if (product.stock <= 0) return;
  const existing = state.cart.find(i => i.id === product.id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  updateCartUI();
  const cartBtn = document.getElementById('cart-btn');
  cartBtn.classList.add('micro-bounce');
  setTimeout(() => cartBtn.classList.remove('micro-bounce'), 350);
}

function updateCartUI() {
  const qty = state.cart.reduce((a, i) => a + i.qty, 0);
  el.cartBadge.textContent = qty;
  const total = state.cart.reduce((a, i) => a + i.qty * i.price, 0);
  el.cartTotal.textContent = formatBRL(total);
  el.cartItems.innerHTML = state.cart.length
    ? state.cart.map(i => `<p>${i.name} x${i.qty} <strong>${formatBRL(i.price * i.qty)}</strong></p>`).join('')
    : '<p class="muted">Seu carrinho está vazio.</p>';
}

function showOverlay() { el.overlay.classList.add('show'); }
function hideOverlayIfNone() {
  if (!el.modal.classList.contains('show') && !el.lightbox.classList.contains('show') && !el.cartPanel.classList.contains('open')) {
    el.overlay.classList.remove('show');
  }
}

function bindEvents() {
  el.categoryFilter.addEventListener('change', e => { state.filters.category = e.target.value; renderProducts(); });
  el.brandFilter.addEventListener('change', e => { state.filters.brand = e.target.value; renderProducts(); });
  el.ratingFilter.addEventListener('change', e => { state.filters.rating = e.target.value; renderProducts(); });
  el.stockFilter.addEventListener('change', e => { state.filters.stock = e.target.value; renderProducts(); });
  el.priceFilter.addEventListener('input', e => { state.filters.maxPrice = e.target.value; el.priceValue.textContent = e.target.value; renderProducts(); });
  el.tagSearch.addEventListener('input', e => { state.filters.tag = e.target.value.toLowerCase().trim(); renderProducts(); });
  el.sortSelect.addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });

  document.getElementById('cart-btn').addEventListener('click', () => { showOverlay(); el.cartPanel.classList.add('open'); });
  document.getElementById('cart-close').addEventListener('click', () => { el.cartPanel.classList.remove('open'); hideOverlayIfNone(); });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-image').addEventListener('click', () => openLightbox(document.getElementById('modal-image').src));
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('modal-add').addEventListener('click', () => { if (state.selectedProduct) addToCart(state.selectedProduct); });
  el.overlay.addEventListener('click', () => {
    el.cartPanel.classList.remove('open');
    closeModal();
    closeLightbox();
    hideOverlayIfNone();
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 280) el.scrollTopBtn.classList.add('show');
    else el.scrollTopBtn.classList.remove('show');
  });
  el.scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    document.getElementById('theme-toggle').textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

setBrands();
renderCategories();
renderProducts();
bindEvents();
updateCartUI();
