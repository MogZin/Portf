import { getProducts, saveProducts, stockLabel } from './data.js';

let products = getProducts();
const root = document.getElementById('admin-products');

function render() {
  root.innerHTML = products.map((p) => `
    <div class="card" style="margin-bottom:12px;">
      <strong>${p.name}</strong>
      <p>${p.brand} — Estoque: <span>${p.stock} (${stockLabel(p.stock)})</span></p>
      <input type="number" min="0" value="${p.stock}" data-id="${p.id}" class="stock-input" />
    </div>
  `).join('');

  document.querySelectorAll('.stock-input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id);
      const stock = Number(e.target.value);
      products = products.map((p) => (p.id === id ? { ...p, stock } : p));
      saveProducts(products);
      render();
    });
  });
}

render();
