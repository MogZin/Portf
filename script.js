const store = {
  name: 'VF SHOES',
  whatsapp: '5511999999999'
};

const products = [
  { id: 'vf-1', name: 'Runner Carbon X', brand: 'VF Performance', category: 'Running', price: 799.9, sizes: [38, 39, 40, 41, 42, 43], image: 'https://picsum.photos/seed/vf-runner/900/700' },
  { id: 'vf-2', name: 'Street Mono Pro', brand: 'VF Urban', category: 'Lifestyle', price: 559.9, sizes: [37, 38, 39, 40, 41, 42], image: 'https://picsum.photos/seed/vf-street/900/700' },
  { id: 'vf-3', name: 'Aero Flow 2', brand: 'VF Performance', category: 'Running', price: 689.9, sizes: [38, 39, 40, 41, 42, 43, 44], image: 'https://picsum.photos/seed/vf-aero/900/700' },
  { id: 'vf-4', name: 'Court Silver', brand: 'VF Classic', category: 'Casual', price: 479.9, sizes: [36, 37, 38, 39, 40, 41], image: 'https://picsum.photos/seed/vf-court/900/700' },
  { id: 'vf-5', name: 'Neon Pace Ultra', brand: 'VF Performance', category: 'Running', price: 899.9, sizes: [39, 40, 41, 42, 43, 44], image: 'https://picsum.photos/seed/vf-neon/900/700' },
  { id: 'vf-6', name: 'Dust Gray Daily', brand: 'VF Urban', category: 'Lifestyle', price: 429.9, sizes: [37, 38, 39, 40, 41, 42], image: 'https://picsum.photos/seed/vf-dust/900/700' }
];

const state = { cart: [], search: '', brand: 'all', size: 'all' };

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const clean = (value) => String(value).replace(/[<>\n\r\t]/g, ' ').trim();

const showToast = (message) => {
  const t = $('#toast');
  t.textContent = clean(message);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1700);
};

const wa = (message) => {
  const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const filtered = () =>
  products.filter((p) => {
    const mSearch = clean(p.name).toLowerCase().includes(state.search.toLowerCase());
    const mBrand = state.brand === 'all' || p.brand === state.brand;
    const mSize = state.size === 'all' || p.sizes.includes(Number(state.size));
    return mSearch && mBrand && mSize;
  });

const renderProducts = () => {
  const grid = $('#products');
  const tpl = $('#productTemplate');
  grid.innerHTML = '';

  const list = filtered();
  if (!list.length) {
    grid.innerHTML = '<p>Nenhum produto encontrado com os filtros atuais.</p>';
    return;
  }

  list.forEach((product) => {
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('.product-image');
    const brand = node.querySelector('.product-brand');
    const name = node.querySelector('.product-name');
    const price = node.querySelector('.product-price');
    const size = node.querySelector('.product-size');
    const add = node.querySelector('.add-cart');
    const buy = node.querySelector('.buy-wa');

    img.src = product.image;
    img.alt = `${clean(product.name)} - ${clean(product.brand)}`;
    brand.textContent = clean(product.brand);
    name.textContent = clean(product.name);
    price.textContent = `${money(product.price)} • ${clean(product.category)}`;

    product.sizes.forEach((n) => {
      const opt = document.createElement('option');
      opt.value = String(n);
      opt.textContent = String(n);
      size.append(opt);
    });

    add.addEventListener('click', () => {
      const selected = Number(size.value);
      const existing = state.cart.find((i) => i.id === product.id && i.size === selected);
      if (existing) existing.qty += 1;
      else state.cart.push({ id: product.id, name: clean(product.name), size: selected, qty: 1, price: product.price });
      renderCart();
      showToast('Produto adicionado ao carrinho.');
    });

    buy.addEventListener('click', () => {
      const selected = Number(size.value);
      wa(`Olá, tenho interesse no ${clean(product.name)}, tamanho ${selected}.`);
    });

    grid.append(node);
  });

  setupReveal();
};

const renderHighlights = () => {
  const track = $('#highlightTrack');
  const tpl = $('#highlightTemplate');
  track.innerHTML = '';

  products.slice(0, 5).forEach((p) => {
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('.highlight-card__img');
    const name = node.querySelector('.highlight-card__name');
    const price = node.querySelector('.highlight-card__price');

    img.src = p.image;
    img.alt = clean(p.name);
    name.textContent = clean(p.name);
    price.textContent = money(p.price);

    track.append(node);
  });
};

const renderCart = () => {
  const box = $('#cartItems');
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
        <small>Subtotal: ${money(item.qty * item.price)}</small>
      `;

      const actions = document.createElement('div');
      actions.className = 'cart-item__actions';

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remover';
      remove.addEventListener('click', () => {
        state.cart = state.cart.filter((x) => !(x.id === item.id && x.size === item.size));
        renderCart();
      });

      const buyOne = document.createElement('button');
      buyOne.type = 'button';
      buyOne.className = 'buy-one';
      buyOne.textContent = 'Comprar este no Whats';
      buyOne.addEventListener('click', () => {
        wa(`Olá, tenho interesse no ${item.name}, tamanho ${item.size}.`);
      });

      actions.append(remove, buyOne);
      card.append(actions);
      box.append(card);
    });
  }

  const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
  const totalValue = state.cart.reduce((s, i) => s + i.qty * i.price, 0);
  $('#cartCount').textContent = String(totalQty);
  $('#cartTotal').textContent = `Total estimado: ${money(totalValue)}`;
};

const sendCartWhats = () => {
  if (!state.cart.length) {
    showToast('Adicione itens ao carrinho antes de comprar.');
    return;
  }

  const lines = [
    `Olá! Quero comprar estes modelos da ${store.name}:`,
    ...state.cart.map((item, i) => `${i + 1}. ${item.name} | Tam: ${item.size} | Qtd: ${item.qty}`)
  ];

  wa(lines.join('\n'));
};

const fillFilters = () => {
  const b = $('#brandFilter');
  const s = $('#sizeFilter');

  [...new Set(products.map((p) => p.brand))].forEach((brand) => {
    const o = document.createElement('option');
    o.value = brand;
    o.textContent = brand;
    b.append(o);
  });

  [...new Set(products.flatMap((p) => p.sizes))]
    .sort((a, bNum) => a - bNum)
    .forEach((size) => {
      const o = document.createElement('option');
      o.value = String(size);
      o.textContent = String(size);
      s.append(o);
    });
};

const setupSlider = () => {
  const slides = Array.from($$('#testimonialSlider .slide'));
  let current = 0;

  const show = (index) => slides.forEach((sl, i) => sl.classList.toggle('active', i === index));

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
  }, 4500);
};

const setupHighlightCarousel = () => {
  const track = $('#highlightTrack');
  $('#prevHighlight').addEventListener('click', () => track.scrollBy({ left: -260, behavior: 'smooth' }));
  $('#nextHighlight').addEventListener('click', () => track.scrollBy({ left: 260, behavior: 'smooth' }));
};

const setupCounters = () => {
  const counters = $$('#stats strong[data-target]');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target);
        const duration = 1200;
        const start = performance.now();

        const run = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          el.textContent = String(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(run);
        };

        requestAnimationFrame(run);
        obs.unobserve(el);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((c) => obs.observe(c));
};

const setupReveal = () => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('active');
      });
    },
    { threshold: 0.12 }
  );
  $$('.reveal').forEach((el) => obs.observe(el));
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
  $('#mobileMenuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

  $$('#sidebar nav a').forEach((a) => {
    a.addEventListener('click', () => $('#sidebar').classList.remove('open'));
  });
};

const setupScrollSpy = () => {
  const links = $$('#sidebar nav a');
  const sections = $$('main section[id]');
  const map = new Map(Array.from(links).map((l) => [l.getAttribute('href').slice(1), l]));

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        const link = map.get(entry.target.id);
        if (link) link.classList.add('active');
      });
    },
    { threshold: 0.42 }
  );

  sections.forEach((s) => obs.observe(s));
};

const setupBackTop = () => {
  const btn = $('#backToTop');
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const setupEvents = () => {
  $('#searchInput').addEventListener('input', (e) => {
    state.search = clean(e.target.value).slice(0, 40);
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

  $('#openCart').addEventListener('click', () => {
    $('#cartPanel').classList.add('open');
    $('#cartPanel').setAttribute('aria-hidden', 'false');
  });
  $('#closeCart').addEventListener('click', () => {
    $('#cartPanel').classList.remove('open');
    $('#cartPanel').setAttribute('aria-hidden', 'true');
  });
  $('#sendCartWhats').addEventListener('click', sendCartWhats);

  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = clean($('#newsletterEmail').value);
    if (!email.includes('@')) {
      showToast('Digite um e-mail válido.');
      return;
    }
    showToast('Inscrição realizada com sucesso!');
    $('#newsletterForm').reset();
  });
};

window.addEventListener('load', () => {
  setTimeout(() => $('#loader').classList.add('loader--hide'), 650);
});

fillFilters();
renderHighlights();
renderProducts();
renderCart();
setupSlider();
setupHighlightCarousel();
setupCounters();
setupReveal();
setupTheme();
setupSidebar();
setupScrollSpy();
setupBackTop();
setupEvents();
