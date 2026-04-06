import { currencyBRL, getProducts, installment, stockLabel } from './data.js';

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');
const products = getProducts();
const product = products.find((p) => p.slug === slug);

const root = document.getElementById('product-page');
const themeToggle = document.getElementById('theme-toggle');

function relatedProducts() {
  if (!product) return [];
  return products
    .filter((p) => p.slug !== product.slug && (p.category === product.category || p.brand === product.brand))
    .slice(0, 3);
}

function applyThemeFromStorage() {
  const saved = localStorage.getItem('vf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle.textContent = saved === 'dark' ? '🌙 Tema' : '☀️ Tema';
}

function renderNotFound() {
  root.innerHTML = `
    <section class="card">
      <h1>Produto não encontrado</h1>
      <p>Não localizamos este produto. Veja algumas sugestões:</p>
      <div class="products-grid">
        ${products.slice(0, 3).map((p) => `<a class="product-card card" href="product.html?slug=${p.slug}"><h3>${p.name}</h3><p>${currencyBRL(p.price)}</p></a>`).join('')}
      </div>
    </section>
  `;
}

function renderProduct() {
  root.innerHTML = `
    <section class="card product-layout">
      <div>
        <img class="product-main" id="main-image" src="${product.gallery[0]}" alt="${product.name}" />
        <div class="thumbs">${product.gallery.map((img) => `<img class="thumb" src="${img}" alt="${product.name}" />`).join('')}</div>
      </div>
      <div>
        <h1>${product.name}</h1>
        <p class="meta">${product.brand} • ⭐ ${product.rating} (${product.reviews})</p>
        <p><strong>${currencyBRL(product.price)}</strong></p>
        <p class="installments">${installment(product.price)}</p>
        <p class="stock stock-${product.stock <= 0 ? 'out' : product.stock <= 3 ? 'low' : 'ok'}">${stockLabel(product.stock)}</p>
        <p>${product.description}</p>
        <p class="tags">${product.tags.map((tag) => `<span>#${tag}</span>`).join(' ')}</p>
      </div>
    </section>

    <section class="card">
      <h2>Quem viu, viu também</h2>
      <div class="products-grid">
        ${relatedProducts().map((p) => `<a class="product-card card" href="product.html?slug=${p.slug}"><h3>${p.name}</h3><p>${currencyBRL(p.price)}</p></a>`).join('')}
      </div>
    </section>
  `;

  const mainImage = document.getElementById('main-image');
  const thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      mainImage.src = thumb.src;
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const close = document.getElementById('close-lightbox');
  mainImage.addEventListener('click', () => {
    lightboxImage.src = mainImage.src;
    lightbox.classList.remove('hidden');
  });
  close.addEventListener('click', () => lightbox.classList.add('hidden'));
  lightbox.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') lightbox.classList.add('hidden');
  });
}

applyThemeFromStorage();
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('vf_theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙 Tema' : '☀️ Tema';
});

if (!product) renderNotFound();
else renderProduct();
