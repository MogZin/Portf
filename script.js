const config = {
  storeName: 'VF SHOES',
  whatsappNumber: '5511999999999'
};

const products = [
  {
    id: 'vf-001',
    name: 'VF Street Alpha',
    category: 'Lifestyle',
    price: 699.9,
    rating: 4.9,
    description: 'Design urbano premium com conforto para uso diário.',
    sizes: [37, 38, 39, 40, 41, 42, 43],
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%23111111"/><stop offset="1" stop-color="%23292929"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="48%" fill="%23ffffff" text-anchor="middle" font-size="44" font-family="Arial">VF Street Alpha</text><text x="50%" y="58%" fill="%23d5b06b" text-anchor="middle" font-size="24" font-family="Arial">Lifestyle</text></svg>'
  },
  {
    id: 'vf-002',
    name: 'VF Runner Pro',
    category: 'Running',
    price: 879.9,
    rating: 4.8,
    description: 'Leve, estável e com amortecimento para corridas intensas.',
    sizes: [38, 39, 40, 41, 42, 43, 44],
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%230f0f0f"/><stop offset="1" stop-color="%23222222"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="48%" fill="%23ffffff" text-anchor="middle" font-size="44" font-family="Arial">VF Runner Pro</text><text x="50%" y="58%" fill="%23d5b06b" text-anchor="middle" font-size="24" font-family="Arial">Running</text></svg>'
  },
  {
    id: 'vf-003',
    name: 'VF Court Legacy',
    category: 'Court',
    price: 629.9,
    rating: 4.7,
    description: 'Visual clássico com acabamento refinado e sola aderente.',
    sizes: [36, 37, 38, 39, 40, 41, 42],
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%23161616"/><stop offset="1" stop-color="%232b2b2b"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="48%" fill="%23ffffff" text-anchor="middle" font-size="44" font-family="Arial">VF Court Legacy</text><text x="50%" y="58%" fill="%23d5b06b" text-anchor="middle" font-size="24" font-family="Arial">Court</text></svg>'
  },
  {
    id: 'vf-004',
    name: 'VF Urban Elevate',
    category: 'Lifestyle',
    price: 749.9,
    rating: 4.9,
    description: 'Sofisticação em camurça e couro para presença marcante.',
    sizes: [37, 38, 39, 40, 41, 42],
    image:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%23101010"/><stop offset="1" stop-color="%23303030"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="48%" fill="%23ffffff" text-anchor="middle" font-size="44" font-family="Arial">VF Urban Elevate</text><text x="50%" y="58%" fill="%23d5b06b" text-anchor="middle" font-size="24" font-family="Arial">Lifestyle</text></svg>'
  }
];

const appState = {
  cart: [],
  search: '',
  category: 'all',
  sort: 'featured',
  favorites: new Set(JSON.parse(localStorage.getItem('vf-favorites') || '[]'))
};

const byId = (id) => document.querySelector(id);
const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const clean = (value) => String(value).replace(/[\n\r\t]/g, ' ').replace(/[<>]/g, '').trim();

const productsContainer = byId('#products');
const template = byId('#productTemplate');
const cartPanel = byId('#cartPanel');
const wishlistPanel = byId('#wishlistPanel');
const toast = byId('#toast');

const showToast = (message) => {
  toast.textContent = clean(message);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1700);
};

const filteredProducts = () => {
  const list = products.filter((product) => {
    const q = appState.search.toLowerCase();
    const matchName = clean(product.name).toLowerCase().includes(q);
    const matchCategory = appState.category === 'all' || product.category === appState.category;
    return matchName && matchCategory;
  });

  switch (appState.sort) {
    case 'low':
      return list.sort((a, b) => a.price - b.price);
    case 'high':
      return list.sort((a, b) => b.price - a.price);
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    default:
      return list;
  }
};

const toggleFavorite = (id) => {
  if (appState.favorites.has(id)) {
    appState.favorites.delete(id);
    showToast('Removido dos favoritos.');
  } else {
    appState.favorites.add(id);
    showToast('Adicionado aos favoritos!');
  }

  localStorage.setItem('vf-favorites', JSON.stringify(Array.from(appState.favorites)));
  renderProducts();
  renderWishlist();
};

const openQuickView = (product) => {
  byId('#quickImg').src = product.image;
  byId('#quickImg').alt = `${clean(product.name)} - ${clean(product.category)}`;
  byId('#quickName').textContent = clean(product.name);
  byId('#quickPrice').textContent = `${money(product.price)} • ⭐ ${product.rating}`;
  byId('#quickDescription').textContent = clean(product.description);
  byId('#quickView').showModal();
};

const buildWhatsMessage = (items) => {
  if (!items.length) {
    return `Olá! Quero conhecer os modelos da ${config.storeName}.`;
  }

  const lines = [
    `Olá! Tenho interesse nesses modelos da ${config.storeName}:`,
    ...items.map(
      (item, index) =>
        `${index + 1}. Modelo: ${item.name} | Tamanho: ${item.size} | Qtd: ${item.qty} | Preço: ${money(item.price)}`
    )
  ];

  return lines.join('\n');
};

const redirectToWhats = (message) => {
  const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const addToCart = (product, size) => {
  const existing = appState.cart.find((item) => item.id === product.id && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({
      id: product.id,
      name: clean(product.name),
      price: product.price,
      size,
      qty: 1
    });
  }

  renderCart();
  togglePanel(cartPanel, true);
  showToast('Item adicionado ao carrinho.');
};

const removeCartItem = (id, size) => {
  const index = appState.cart.findIndex((item) => item.id === id && item.size === size);
  if (index >= 0) appState.cart.splice(index, 1);
  renderCart();
};

const renderProducts = () => {
  productsContainer.innerHTML = '';
  const list = filteredProducts();

  if (!list.length) {
    productsContainer.innerHTML = '<p>Nenhum modelo encontrado com esse filtro.</p>';
    return;
  }

  list.forEach((product) => {
    const node = template.content.cloneNode(true);
    const image = node.querySelector('.card__image');
    const name = node.querySelector('.card__name');
    const category = node.querySelector('.card__category');
    const price = node.querySelector('.card__price');
    const size = node.querySelector('.card__size');
    const add = node.querySelector('.add');
    const details = node.querySelector('.details');
    const buy = node.querySelector('.buy-whatsapp');
    const wish = node.querySelector('.wish');

    image.src = product.image;
    image.alt = `${clean(product.name)} - ${clean(product.category)}`;
    name.textContent = clean(product.name);
    category.textContent = clean(product.category);
    price.textContent = `${money(product.price)} • ⭐ ${product.rating}`;

    product.sizes.forEach((n) => {
      const option = document.createElement('option');
      option.value = String(n);
      option.textContent = String(n);
      size.append(option);
    });

    if (appState.favorites.has(product.id)) {
      wish.classList.add('active');
      wish.textContent = '♥';
    }

    wish.addEventListener('click', () => toggleFavorite(product.id));
    add.addEventListener('click', () => addToCart(product, Number(size.value)));
    details.addEventListener('click', () => openQuickView(product));
    buy.addEventListener('click', () => {
      const text = buildWhatsMessage([{ ...product, size: Number(size.value), qty: 1 }]);
      redirectToWhats(text);
    });

    productsContainer.append(node);
  });

  byId('#favCount').textContent = String(appState.favorites.size);
};

const renderCart = () => {
  const cartItems = byId('#cartItems');
  const cartCount = byId('#cartCount');
  const totalElement = byId('#cartTotal');

  cartItems.innerHTML = '';

  if (!appState.cart.length) {
    cartItems.innerHTML = '<p>Seu carrinho está vazio no momento.</p>';
  } else {
    appState.cart.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'row-card';
      card.innerHTML = `
        <strong>${item.name}</strong>
        <small>Tamanho: ${item.size}</small>
        <small>Quantidade: ${item.qty}</small>
        <small>Subtotal: ${money(item.qty * item.price)}</small>
      `;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove';
      remove.textContent = 'Remover';
      remove.addEventListener('click', () => removeCartItem(item.id, item.size));

      card.append(remove);
      cartItems.append(card);
    });
  }

  const totalQty = appState.cart.reduce((sum, i) => sum + i.qty, 0);
  const totalValue = appState.cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  cartCount.textContent = String(totalQty);
  totalElement.textContent = `Total: ${money(totalValue)}`;
};

const renderWishlist = () => {
  const box = byId('#wishlistItems');
  const favProducts = products.filter((p) => appState.favorites.has(p.id));

  box.innerHTML = '';
  if (!favProducts.length) {
    box.innerHTML = '<p>Sem favoritos por enquanto.</p>';
    return;
  }

  favProducts.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'row-card';
    card.innerHTML = `<strong>${clean(product.name)}</strong><small>${clean(product.category)} • ${money(product.price)}</small>`;
    box.append(card);
  });
};

const togglePanel = (panel, open) => {
  const shouldOpen = typeof open === 'boolean' ? open : !panel.classList.contains('open');
  panel.classList.toggle('open', shouldOpen);
  panel.setAttribute('aria-hidden', String(!shouldOpen));
};

const fillCategories = () => {
  const categories = [...new Set(products.map((p) => p.category))];
  const filter = byId('#categoryFilter');

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filter.append(option);
  });
};

byId('#searchInput').addEventListener('input', (event) => {
  appState.search = clean(event.target.value).slice(0, 40);
  renderProducts();
});

byId('#categoryFilter').addEventListener('change', (event) => {
  appState.category = event.target.value;
  renderProducts();
});

byId('#sortFilter').addEventListener('change', (event) => {
  appState.sort = event.target.value;
  renderProducts();
});

byId('#openCart').addEventListener('click', () => togglePanel(cartPanel, true));
byId('#closeCart').addEventListener('click', () => togglePanel(cartPanel, false));

byId('#openWishlist').addEventListener('click', () => {
  renderWishlist();
  togglePanel(wishlistPanel, true);
});
byId('#closeWishlist').addEventListener('click', () => togglePanel(wishlistPanel, false));

byId('#sendWhats').addEventListener('click', () => {
  const message = buildWhatsMessage(appState.cart);
  redirectToWhats(message);
});

byId('#closeQuickView').addEventListener('click', () => byId('#quickView').close());

window.addEventListener('load', () => {
  setTimeout(() => byId('#loader').classList.add('loader--hide'), 850);
});

fillCategories();
renderProducts();
renderCart();
renderWishlist();
