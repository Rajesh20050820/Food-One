export class UI {
  constructor() {
    this.menuContainer = document.getElementById('menu');
    this.cartList = document.getElementById('cart-list');
    this.billSummary = document.getElementById('bill-summary');
    this.filterButtons = document.getElementById('filter-buttons');
  }

  renderMenu(items, filter = 'All') {
    this.menuContainer.innerHTML = '';
    const categories = [...new Set(items.map(item => item.category))];
    categories.forEach(category => {
      if (filter !== 'All' && filter !== category) return;
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category';
      categoryDiv.innerHTML = `<h2 class="category__header" role="button" tabindex="0" aria-expanded="true">${category}</h2>`;
      const itemsDiv = document.createElement('div');
      itemsDiv.className = 'menu-items';
      items
        .filter(item => item.category === category)
        .forEach(item => {
          const div = document.createElement('div');
          div.className = 'item';
          div.setAttribute('data-name', item.name.toLowerCase());
          div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item__image" loading="lazy">
            <div class="item__details">
              <h3 class="item__title">${item.name}</h3>
              <div class="item__price">₹${item.price.toFixed(2)}</div>
              <div class="item__total" id="total-${item.name.replace(/\s+/g, '-')}" aria-live="polite"></div>
            </div>
            <div class="controls" id="controls-${item.name.replace(/\s+/g, '-')}" role="region">
              <button class="controls__button controls__button--add" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-category="${item.category}" aria-label="Add ${item.name} to cart">Add</button>
            </div>
          `;
          itemsDiv.appendChild(div);
        });
      categoryDiv.appendChild(itemsDiv);
      this.menuContainer.appendChild(categoryDiv);
    });
  }

  renderFilters(categories) {
    this.filterButtons.innerHTML = categories.map(category => `
      <button class="filter-btn ${category === 'All' ? 'filter-btn--active' : ''}" data-category="${category}">${category}</button>
    `).join('');
  }

  filterMenu(category, items) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('filter-btn--active'));
    document.querySelector(`.filter-btn[data-category="${category}"]`).classList.add('filter-btn--active');
    this.renderMenu(items, category);
    this.updateMenuControls(items, this.getCartItems());
  }

  toggleCategory(header) {
    const categoryDiv = header.parentElement;
    categoryDiv.classList.toggle('category--collapsed');
    header.setAttribute('aria-expanded', !categoryDiv.classList.contains('category--collapsed'));
  }

  updateCart(cartItems) {
    this.cartList.innerHTML = Object.keys(cartItems).length === 0 ? '<p class="empty-cart">Your cart is empty</p>' : '';
    let subtotal = 0;
    for (let name in cartItems) {
      const item = cartItems[name];
      const li = document.createElement('div');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${item.image}" alt="${name}" class="cart-item__image" loading="lazy">
        <div class="cart-item__details">
          <span class="cart-item__name">${name}</span>
          <span class="cart-item__price">₹${(item.qty * item.price).toFixed(2)}</span>
        </div>
        <div class="cart-item__actions">
          <div class="qty-controls">
            <button class="qty-controls__button" data-name="${name}" data-action="decrement" aria-label="Decrease quantity of ${name}">-</button>
            <span class="qty-controls__count">${item.qty}</span>
            <button class="qty-controls__button" data-name="${name}" data-action="increment" aria-label="Increase quantity of ${name}">+</button>
          </div>
          <button class="remove-btn" data-name="${name}" aria-label="Remove ${name} from cart">Remove</button>
        </div>
      `;
      this.cartList.appendChild(li);
      subtotal += item.qty * item.price;
    }

    const tax = subtotal * 0.05;
    const deliveryCharge = subtotal >= 100 ? 0 : 20;
    const total = subtotal + tax + deliveryCharge;
    this.billSummary.innerHTML = `
      <div class="bill-summary__item"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
      <div class="bill-summary__item"><span>Tax (5%)</span><span>₹${tax.toFixed(2)}</span></div>
      <div class="bill-summary__item"><span>Delivery Charge</span><span>₹${deliveryCharge.toFixed(2)}</span></div>
      <div class="bill-summary__total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
    `;
  }

  updateMenuControls(menuItems, cartItems) {
    menuItems.forEach(item => {
      const name = item.name;
      const controls = document.getElementById(`controls-${name.replace(/\s+/g, '-')}`);
      const totalSpan = document.getElementById(`total-${name.replace(/\s+/g, '-')}`);
      if (controls && totalSpan) {
        if (cartItems[name] && cartItems[name].qty > 0) {
          controls.innerHTML = `
            <div class="qty-controls">
              <button class="qty-controls__button" data-name="${name}" data-action="decrement" aria-label="Decrease quantity of ${name}">-</button>
              <span class="qty-controls__count">${cartItems[name].qty}</span>
              <button class="qty-controls__button" data-name="${name}" data-action="increment" aria-label="Increase quantity of ${name}">+</button>
            </div>
          `;
          totalSpan.textContent = `Total: ₹${(cartItems[name].qty * cartItems[name].price).toFixed(2)}`;
        } else {
          controls.innerHTML = `<button class="controls__button controls__button--add" data-name="${name}" data-price="${item.price}" data-image="${item.image}" data-category="${item.category}" aria-label="Add ${name} to cart">Add</button>`;
          totalSpan.textContent = '';
        }
      }
    });
  }

  showPage(pageId, cartItems) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('page--active'));
    document.getElementById(pageId).classList.add('page--active');
    if (pageId === 'cart-page') {
      this.updateCart(cartItems);
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  }

  applyTheme() {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  searchItems(items) {
    const query = document.getElementById('search').value.toLowerCase().trim();
    const allItems = document.querySelectorAll('.item');
    let hasResults = false;

    allItems.forEach(item => {
      const itemName = item.getAttribute('data-name');
      if (itemName.includes(query)) {
        item.style.display = 'block';
        hasResults = true;
      } else {
        item.style.display = 'none';
      }
    });

    document.querySelectorAll('.category').forEach(category => {
      const itemsInCategory = category.querySelectorAll('.menu-items .item');
      let categoryHasVisibleItems = false;
      itemsInCategory.forEach(item => {
        if (item.style.display !== 'none') {
          categoryHasVisibleItems = true;
        }
      });
      if (query && categoryHasVisibleItems) {
        category.style.display = 'block';
        category.classList.remove('category--collapsed');
      } else if (query && !categoryHasVisibleItems) {
        category.style.display = 'none';
      } else {
        category.style.display = 'block';
      }
    });

    if (query) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('filter-btn--active'));
      document.querySelector('.filter-btn[data-category="All"]').classList.add('filter-btn--active');
    }
  }

  showToast(message, type = 'success', duration = 2500) {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast--error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }
}
