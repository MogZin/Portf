export const PRODUCTS = [
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

export const currencyBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const installment = (price, n = 12) => `${currencyBRL(price)} em até ${n}x de ${currencyBRL(price / n)}`;

export function stockLabel(stock) {
  if (stock <= 0) return 'Esgotado';
  if (stock <= 3) return 'Últimas unidades';
  return 'Em estoque';
}

export function getProducts() {
  const persisted = localStorage.getItem('vf_products');
  return persisted ? JSON.parse(persisted) : PRODUCTS;
}

export function saveProducts(products) {
  localStorage.setItem('vf_products', JSON.stringify(products));
}
