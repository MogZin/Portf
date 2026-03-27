const config = {
  storeName: 'VF SHOES',
  whatsappNumber: '5511999999999'
};

const makeArt = (title, subtitle, c1, c2) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="46%" fill="%23ffffff" text-anchor="middle" font-size="42" font-family="Arial">${title}</text><text x="50%" y="58%" fill="%23dcb876" text-anchor="middle" font-size="22" font-family="Arial">${subtitle}</text></svg>`;

const products = [
  {
    id: 'vf-001',
    name: 'VF Neon Pace',
    category: 'Running',
    price: 849.9,
    rating: 4.9,
    discount: '-17%',
    description: 'Super leve para corridas intensas e treinos diários.',
    sizes: [38, 39, 40, 41, 42, 43, 44],
    images: [
      makeArt('VF Neon Pace', 'Running', '%23121212', '%23272727'),
      makeArt('VF Neon Pace', 'Lateral', '%230f1318', '%23333f49'),
      makeArt('VF Neon Pace', 'Detalhes', '%2314120f', '%23392f22')
    ]
  },
  {
    id: 'vf-002',
    name: 'VF Speed Aero',
    category: 'Corrida',
    price: 729.9,
    rating: 4.8,
    discount: '-11%',
    description: 'Amortecimento responsivo e design aerodinâmico.',
    sizes: [37, 38, 39, 40, 41, 42, 43],
    images: [
      makeArt('VF Speed Aero', 'Performance', '%23101010', '%23242424'),
      makeArt('VF Speed Aero', 'Upper Mesh', '%230f161f', '%232c3f54'),
      makeArt('VF Speed Aero', 'Solado Grip', '%23171612', '%233b2f21')
    ]
  },
  {
    id: 'vf-003',
    name: 'VF Flow Max',
    category: 'Lifestyle',
    price: 639.9,
    rating: 4.7,
    discount: '-9%',
    description: 'Estilo street sofisticado para qualquer ocasião.',
    sizes: [36, 37, 38, 39, 40, 41, 42],
    images: [
      makeArt('VF Flow Max', 'Lifestyle', '%23161616', '%232d2d2d'),
      makeArt('VF Flow Max', 'Premium Touch', '%23141310', '%233f3428'),
      makeArt('VF Flow Max', 'Urban Mood', '%2310171b', '%232d3e44')
    ]
  },
  {
    id: 'vf-004',
    name: 'VF Run Max',
    category: 'Running',
    price: 819.9,
    rating: 4.9,
    discount: '-20%',
    description: 'Conforto absoluto para longas distâncias.',
    sizes: [38, 39, 40, 41, 42, 43],
    images: [
      makeArt('VF Run Max', 'Distance', '%23111111', '%23303030'),
      makeArt('VF Run Max', 'Carbon Feel', '%23131a22', '%232e4158'),
      makeArt('VF Run Max', 'Energy Foam', '%23171410', '%233b2d23')
    ]
  },
  {
    id: 'vf-005',
    name: 'VF Street Bold',
    category: 'Lifestyle',
    price: 589.9,
    rating: 4.6,
    discount: '-8%',
    description: 'Visual robusto e moderno para destacar seu look.',
    sizes: [37, 38, 39, 40, 41, 42],
    images: [
      makeArt('VF Street Bold', 'Streetwear', '%23181818', '%23313131'),
      makeArt('VF Street Bold', 'Premium Stitch', '%23151714', '%23363739'),
      makeArt('VF Street Bold', 'Classic DNA', '%23141812', '%233e3328')
    ]
  },
  {
    id: 'vf-006',
    name: 'VF Drift Run',
    category: 'Corrida',
    price: 769.9,
    rating: 4.8,
    discount: '-14%',
    description: 'Equilíbrio perfeito entre estabilidade e velocidade.',
    sizes: [38, 39, 40, 41, 42, 43, 44],
    images: [
      makeArt('VF Drift Run', 'Pro Move', '%23121212', '%23262626'),
      makeArt('VF Drift Run', 'Support Frame', '%23101920', '%23293f54'),
      makeArt('VF Drift Run', 'Race Ready', '%23161412', '%23353025')
    ]
  }
];

const collections = [
  { title: 'Esportivos', desc: 'Para performance máxima.', image: makeArt('Coleção Sport', 'VF SHOES', '%23101010', '%232a2a2a') },
  { title: 'Corrida', desc: 'Tecnologia e leveza.', image: makeArt('Coleção Run', 'VF SHOES', '%2310151f', '%23273a4d') },
  { title: 'Casual Premium', desc: 'Estilo e conforto diário.', image: makeArt('Coleção Casual', 'VF SHOES', '%23140f0d', '%23382f24') },
  { title: 'Streetwear', desc: 'Visual urbano diferenciado.', image: makeArt('Coleção Street', 'VF SHOES', '%23121416', '%23323e45') }
];

const appState = {
  cart: [],
  search: '',
  category: 'all',
  sort: 'featured',
  favorites: new Set(JSON.parse(localStorage.getItem('vf-favorites') || '[]'))
};

const byId = (id) => document.querySelector(id);
const money = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const clean = (v) => String(v).replace(/[\n\r\t]/g, ' ').replace(/[<>]/g, '').trim();

const productsContainer = byId('#products');
const template = byId('#productTemplate');
const collectionTemplate = byId('#collectionTemplate');
const cartPanel = byId('#cartPanel');
const wishlistPanel = byId('#wishlistPanel');
const toast = byId('#toast');

const showToast = (message) => {
  toast.textContent = clean(message);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
};

const filteredProducts = () => {
  const list = products.filter((product) => {
    const query = appState.search.toLowerCase();
    const matchName = clean(product.name).toLowerCase().includes(query);
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
    showToast('Removido dos favoritos');
  } else {
    appState.favorites.add(id);
    showToast('Adicionado aos favoritos');
  }

  localStorage.setItem('vf-favorites', JSON.stringify(Array.from(appState.favorites)));
  renderProducts();
  renderWishlist();
};

const buildWhatsMessage = (items) => {
  if (!items.length) return `Olá! Quero conhecer os modelos da ${config.storeName}.`;
  return [
    `Olá! Tenho interesse nesses modelos da ${config.storeName}:`,
    ...items.map(
      (item, i) =>
        `${i + 1}. Modelo: ${item.name} | Tamanho: ${item.size} | Qtd: ${item.qty} | Preço: ${money(item.price)}`
    )
  ].join('\n');
};

const redirectToWhats = (message) => {
  const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const togglePanel = (panel, open) => {
  const isOpen = typeof open === 'boolean' ? open : !panel.classList.contains('open');
  panel.classList.toggle('open', isOpen);
  panel.setAttribute('aria-hidden', String(!isOpen));
};

const addToCart = (product, size) => {
  const existing = appState.cart.find((item) => item.id === product.id && item.size === size);
  if (existing) existing.qty += 1;
  else appState.cart.push({ id: product.id, name: clean(product.name), size, qty: 1, price: product.price });

  renderCart();
  togglePanel(cartPanel, true);
  showToast('Item adicionado ao carrinho');
};

const renderProductThumbs = (holder, images, mainImage) => {
  holder.innerHTML = '';
  images.forEach((img, index) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.style.backgroundImage = `url('${img}')`;
    thumb.setAttribute('aria-label', `Ver imagem ${index + 1}`);
    thumb.addEventListener('click', () => {
      mainImage.src = img;
    });
    holder.append(thumb);
  });
};

const openQuickView = (product) => {
  byId('#quickImg').src = product.images[0];
  byId('#quickName').textContent = clean(product.name);
  byId('#quickPrice').textContent = `${money(product.price)} • ⭐ ${product.rating} • ${product.discount}`;
  byId('#quickDescription').textContent = clean(product.description);

  const quickThumbs = byId('#quickThumbs');
  quickThumbs.innerHTML = '';
  product.images.forEach((img, idx) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.backgroundImage = `url('${img}')`;
    button.setAttribute('aria-label', `Imagem ${idx + 1}`);
    button.addEventListener('click', () => (byId('#quickImg').src = img));
    quickThumbs.append(button);
  });

  byId('#quickView').showModal();
};

const renderProducts = () => {
  productsContainer.innerHTML = '';
  const list = filteredProducts();

  if (!list.length) {
    productsContainer.innerHTML = '<p>Nenhum modelo encontrado.</p>';
    return;
  }

  list.forEach((product) => {
    const node = template.content.cloneNode(true);
    const image = node.querySelector('.card__image');
    const thumbs = node.querySelector('.card__thumbs');
    const discount = node.querySelector('.badge-discount');
    const name = node.querySelector('.card__name');
    const category = node.querySelector('.card__category');
    const price = node.querySelector('.card__price');
    const sizeSelect = node.querySelector('.card__size');
    const wish = node.querySelector('.wish');
    const add = node.querySelector('.add');
    const details = node.querySelector('.details');
    const buy = node.querySelector('.buy-whatsapp');

    image.src = product.images[0];
    image.alt = `${clean(product.name)} em destaque`;
    discount.textContent = clean(product.discount);
    name.textContent = clean(product.name);
    category.textContent = clean(product.category);
    price.textContent = `${money(product.price)} • ⭐ ${product.rating}`;

    product.sizes.forEach((size) => {
      const option = document.createElement('option');
      option.value = String(size);
      option.textContent = String(size);
      sizeSelect.append(option);
    });

    renderProductThumbs(thumbs, product.images, image);

    if (appState.favorites.has(product.id)) {
      wish.classList.add('active');
      wish.textContent = '♥';
    }

    wish.addEventListener('click', () => toggleFavorite(product.id));
    add.addEventListener('click', () => addToCart(product, Number(sizeSelect.value)));
    details.addEventListener('click', () => openQuickView(product));
    buy.addEventListener('click', () => {
      const message = buildWhatsMessage([{ name: clean(product.name), price: product.price, size: Number(sizeSelect.value), qty: 1 }]);
      redirectToWhats(message);
    });

    productsContainer.append(node);
  });

  byId('#favCount').textContent = String(appState.favorites.size);
  setupReveal();
};

const renderCart = () => {
  const box = byId('#cartItems');
  box.innerHTML = '';

  if (!appState.cart.length) {
    box.innerHTML = '<p>Seu carrinho está vazio no momento.</p>';
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
      remove.addEventListener('click', () => {
        appState.cart = appState.cart.filter((x) => !(x.id === item.id && x.size === item.size));
        renderCart();
      });

      card.append(remove);
      box.append(card);
    });
  }

  const qty = appState.cart.reduce((sum, item) => sum + item.qty, 0);
  const total = appState.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  byId('#cartCount').textContent = String(qty);
  byId('#cartTotal').textContent = `Total: ${money(total)}`;
};

const renderWishlist = () => {
  const box = byId('#wishlistItems');
  const favs = products.filter((p) => appState.favorites.has(p.id));
  box.innerHTML = '';

  if (!favs.length) {
    box.innerHTML = '<p>Sem favoritos por enquanto.</p>';
    return;
  }

  favs.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'row-card';
    row.innerHTML = `<strong>${clean(item.name)}</strong><small>${clean(item.category)} • ${money(item.price)}</small>`;
    box.append(row);
  });
};

const renderCollections = () => {
  const track = byId('#collectionTrack');
  track.innerHTML = '';

  collections.forEach((collection) => {
    const node = collectionTemplate.content.cloneNode(true);
    const image = node.querySelector('.collection-card__image');
    const title = node.querySelector('.collection-card__title');
    const desc = node.querySelector('.collection-card__desc');

    image.src = collection.image;
    image.alt = clean(collection.title);
    title.textContent = clean(collection.title);
    desc.textContent = clean(collection.desc);
    track.append(node);
  });
};

const fillCategories = () => {
  const categories = [...new Set(products.map((p) => p.category))];
  const select = byId('#categoryFilter');
  categories.forEach((c) => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    select.append(option);
  });
};

const setupReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
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

byId('#sendWhats').addEventListener('click', () => redirectToWhats(buildWhatsMessage(appState.cart)));
byId('#closeQuickView').addEventListener('click', () => byId('#quickView').close());

byId('#goProducts').addEventListener('click', () => byId('#productsSection').scrollIntoView({ behavior: 'smooth' }));
byId('#goCollections').addEventListener('click', () => byId('#collectionsSection').scrollIntoView({ behavior: 'smooth' }));

byId('#prevCollection').addEventListener('click', () => {
  byId('#collectionTrack').scrollBy({ left: -260, behavior: 'smooth' });
});
byId('#nextCollection').addEventListener('click', () => {
  byId('#collectionTrack').scrollBy({ left: 260, behavior: 'smooth' });
});

window.addEventListener('load', () => {
  setTimeout(() => byId('#loader').classList.add('loader--hide'), 850);
});

fillCategories();
renderProducts();
renderCart();
renderWishlist();
renderCollections();
setupReveal();
