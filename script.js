const store = {
  name: 'VF SHOES',
  slogan: 'A melhor loja de tênis',
  whatsapp: '5511999999999'
};

const products = [
  {
    id: 'vf-1',
    name: 'Runner Carbon X',
    brand: 'VF Performance',
    category: 'Running',
    price: 799.9,
    sizes: [38, 39, 40, 41, 42, 43],
    image: 'https://picsum.photos/seed/vf-runner/800/600'
  },
  {
    id: 'vf-2',
    name: 'Street Mono Pro',
    brand: 'VF Urban',
    category: 'Lifestyle',
    price: 559.9,
    sizes: [37, 38, 39, 40, 41, 42],
    image: 'https://picsum.photos/seed/vf-street/800/600'
  },
  {
    id: 'vf-3',
    name: 'Aero Flow 2',
    brand: 'VF Performance',
    category: 'Running',
    price: 689.9,
    sizes: [38, 39, 40, 41, 42, 43, 44],
    image: 'https://picsum.photos/seed/vf-aero/800/600'
  },
  {
    id: 'vf-4',
    name: 'Court Silver',
    brand: 'VF Classic',
    category: 'Casual',
    price: 479.9,
    sizes: [36, 37, 38, 39, 40, 41],
    image: 'https://picsum.photos/seed/vf-court/800/600'
  },
  {
    id: 'vf-5',
    name: 'Neon Pace Ultra',
    brand: 'VF Performance',
    category: 'Running',
    price: 899.9,
    sizes: [39, 40, 41, 42, 43, 44],
    image: 'https://picsum.photos/seed/vf-neon/800/600'
  },
  {
    id: 'vf-6',
    name: 'Dust Gray Daily',
    brand: 'VF Urban',
    category: 'Lifestyle',
    price: 429.9,
    sizes: [37, 38, 39, 40, 41, 42],
    image: 'https://picsum.photos/seed/vf-dust/800/600'
  }
];

const state = {
  cart: [],
  search: '',
  brand: 'all',
  size: 'all'
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const template = $('#productTemplate');
const productGrid = $('#products');

const formatPrice = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const safeText = (value) => String(value).replace(/[<>\n\r\t]/g, ' ').trim();

const toast = (text) => {
  const t = $('#toast');
  t.textContent = safeText(text);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1700);
};

const openWhatsApp = (message) => {
  const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const filteredProducts = () =>
  products.filter((p) => {
    const bySearch = safeText(p.name).toLowerCase().includes(state.search.toLowerCase());
    const byBrand = state.brand === 'all' || p.brand === state.brand;
    const bySize = state.size === 'all' || p.sizes.includes(Number(state.size));
    return bySearch && byBrand && bySize;
  });

const addToCart = (product, size) => {
  const item = state.cart.find((i) => i.id === product.id && i.size === size);
  if (item) item.qty += 1;
  else {
    state.cart.push({ id: product.id, name: safeText(product.name), size, price: product.price, qty: 1 });
  }
  renderCart();
  toast('Adicionado ao carrinho de interesse.');
};

const removeFromCart = (id, size) => {
  state.cart = state.cart.filter((i) => !(i.id === id && i.size === size));
  renderCart();
};

const buyViaWhatsApp = (product, size) => {
  const msg = `Olá, tenho interesse no ${safeText(product.name)}, tamanho ${size}.`;
  openWhatsApp(msg);
};

const renderProducts = () => {
  productGrid.innerHTML = '';
  const list = filteredProducts();

  if (!list.length) {
    productGrid.innerHTML = '<p>Nenhum produto encontrado com os filtros selecionados.</p>';
    return;
  }

  list.forEach((product) => {
    const node = template.content.cloneNode(true);
    const image = node.querySelector('.product-image');
    const brand = node.querySelector('.product-brand');
    const name = node.querySelector('.product-name');
    const price = node.querySelector('.product-price');
    const sizeSelect = node.querySelector('.product-size');
    const addBtn = node.querySelector('.add-cart');
    const buyBtn = node.querySelector('.buy-wa');

    image.src = product.image;
    image.alt = `${safeText(product.name)} - ${safeText(product.brand)}`;
    brand.textContent = safeText(product.brand);
    name.textContent = safeText(product.name);
    price.textContent = `${formatPrice(product.price)} • ${safeText(product.category)}`;

    product.sizes.forEach((size) => {
      const option = document.createElement('option');
      option.value = String(size);
      option.textContent = String(size);
      sizeSelect.append(option);
    });

    addBtn.addEventListener('click', () => addToCart(product, Number(sizeSelect.value)));
    buyBtn.addEventListener('click', () => buyViaWhatsApp(product, Number(sizeSelect.value)));

    productGrid.append(node);
  });

  setupReveal();
};

const renderCart = () => {
  const box = $('#cartItems');
  const count = $('#cartCount');
  const total = $('#cartTotal');

  box.innerHTML = '';

  if (!state.cart.length) {
    box.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    state.cart.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'cart-item';
      card.innerHTML = `
        <strong>${item.name}</strong>
        <small>Tamanho: ${item.size}</small>
        <small>Quantidade: ${item.qty}</small>
        <small>Subtotal: ${formatPrice(item.price * item.qty)}</small>
      `;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remover';
      remove.addEventListener('click', () => removeFromCart(item.id, item.size));
      card.append(remove);
      box.append(card);
    });
  }

  const qty = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const sum = state.cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  count.textContent = String(qty);
  total.textContent = `Total estimado: ${formatPrice(sum)}`;
};

const openCart = (show) => {
  const panel = $('#cartPanel');
  panel.classList.toggle('open', show);
  panel.setAttribute('aria-hidden', String(!show));
};

const sendCartToWhats = () => {
  if (!state.cart.length) {
    toast('Adicione produtos antes de enviar o carrinho.');
    return;
  }

  const lines = [
    `Olá! Tenho interesse nestes modelos da ${store.name}:`,
    ...state.cart.map((item, i) => `${i + 1}. ${item.name} - Tamanho ${item.size} - Qtd ${item.qty}`)
  ];

  openWhatsApp(lines.join('\n'));
};

const fillFilters = () => {
  const brandFilter = $('#brandFilter');
  const sizeFilter = $('#sizeFilter');

  [...new Set(products.map((p) => p.brand))].forEach((brand) => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandFilter.append(option);
  });

  [...new Set(products.flatMap((p) => p.sizes))]
    .sort((a, b) => a - b)
    .forEach((size) => {
      const option = document.createElement('option');
      option.value = String(size);
      option.textContent = String(size);
      sizeFilter.append(option);
    });
};

const setupSlider = () => {
  const slides = Array.from($$('#testimonialSlider .slide'));
  let current = 0;

  const show = (index) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
  };

  $('#prevSlide').addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    show(current);
  });

  $('#nextSlide').addEventListener('click', () => {
    current = (current + 1) % slides.length;
    show(current);
  });

  setInterval(() => {
    current = (current + 1) % slides.length;
    show(current);
  }, 5000);
};

const setupReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    },
    { threshold: 0.1 }
  );

  $$('.reveal').forEach((item) => observer.observe(item));
};

const setupCounters = () => {
  const counters = $$('#stats strong[data-target]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target);
        const duration = 1200;
        const start = performance.now();

        const animate = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          el.textContent = String(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
};

const setupTheme = () => {
  const saved = localStorage.getItem('vf-theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  $('#themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('vf-theme', next);
  });
};

const setupSidebar = () => {
  $('#mobileMenuBtn').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
  });

  $$('#sidebar nav a').forEach((link) => {
    link.addEventListener('click', () => {
      $('#sidebar').classList.remove('open');
    });
  });
};

const setupScrollSpy = () => {
  const sections = $$('main section[id]');
  const links = $$('#sidebar nav a');
  const map = new Map(Array.from(links).map((l) => [l.getAttribute('href')?.slice(1), l]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        const link = map.get(entry.target.id);
        if (link) link.classList.add('active');
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
};

const setupBackToTop = () => {
  const btn = $('#backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 460);
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const setupEvents = () => {
  $('#searchInput').addEventListener('input', (e) => {
    state.search = safeText(e.target.value).slice(0, 40);
    renderProducts();
  });

  $('#brandFilter').addEventListener('change', (e) => {
    state.brand = e.target.value;
    renderProducts();
  });

  $('#sizeFilter').addEventListener('change', (e) => {
    state.size = e.target.value;
    renderProducts();
  });

  $('#openCart').addEventListener('click', () => openCart(true));
  $('#closeCart').addEventListener('click', () => openCart(false));
  $('#sendCartWhats').addEventListener('click', sendCartToWhats);

  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = safeText($('#newsletterEmail').value);
    if (!email.includes('@')) {
      toast('Digite um e-mail válido.');
      return;
    }
    toast('Inscrição realizada com sucesso!');
    $('#newsletterForm').reset();
  });
};

window.addEventListener('load', () => {
  setTimeout(() => $('#loader').classList.add('loader--hide'), 700);
});

fillFilters();
renderProducts();
renderCart();
setupSlider();
setupReveal();
setupCounters();
setupTheme();
setupSidebar();
setupScrollSpy();
setupBackToTop();
setupEvents();
