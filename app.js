import { Menu } from './menu.js';
import { Cart } from './cart.js';
import { UI } from './ui.js';

const menuItems = [
  { name: 'Onion Capsicum Pizza', price: 99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Cheese Paneer Pizza', price: 119, category: 'Pizza', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Double Cheese Pizza', price: 129, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a776?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Cheese Corn Pizza', price: 129, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28fddf71692?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Aloo Tikki Burger', price: 49, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Cheese Burger', price: 59, category: 'Burger', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Plain Salted Fries', price: 39, category: 'Fries', image: 'https://images.unsplash.com/photo-1630384060421-2c64e5f5a53a?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Peri Peri Fries', price: 49, category: 'Fries', image: 'https://images.unsplash.com/photo-1599497489995-2b2c43f2f78c?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Veg Sandwich', price: 29, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Veg Mayo Sandwich', price: 49, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1606755287287-5e2051e7f7f0?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Cheese Paneer Sandwich', price: 59, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Tiffin Meal (Dal, Chawal, Sabji, 5 Chapati, Achar)', price: 80, category: 'Tiffin', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Pizza (Small Size) + Burger + Cold Drink', price: 159, category: 'Combo', image: 'https://images.unsplash.com/photo-1559304787-7a5c492e573c?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Pizza (Small Size) + Fries + Cold Drink', price: 159, category: 'Combo', image: 'https://images.unsplash.com/photo-1559304787-7a5c492e573c?auto=format&fit=crop&w=300&h=200&q=80' },
  { name: 'Burger + Fries + Cold Drink', price: 159, category: 'Combo', image: 'https://images.unsplash.com/photo-1559304787-7a5c492e573c?auto=format&fit=crop&w=300&h=200&q=80' },
];

class App {
  constructor() {
    this.menu = new Menu(menuItems);
    this.cart = new Cart();
    this.ui = new UI();
    this.init();
  }

  init() {
    this.ui.renderFilters(this.menu.getCategories());
    this.ui.renderMenu(this.menu.getItems());
    this.ui.updateCart(this.cart.getItems());
    this.bindEvents();
    this.ui.applyTheme();
  }

  bindEvents() {
    document.querySelector('.theme-toggle').addEventListener('click', () => this.ui.toggleTheme());
    document.querySelector('#search').addEventListener('input', this.ui.debounce(() => this.ui.searchItems(this.menu.getItems()), 300));
    document.querySelector('#order-form').addEventListener('submit', (e) => this.handleOrderSubmit(e));
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        const category = e.target.dataset.category;
        this.ui.filterMenu(category, this.menu.getItems());
      }
      if (e.target.classList.contains('category__header')) {
        this.ui.toggleCategory(e.target);
      }
      if (e.target.classList.contains('controls__button--add')) {
        const { name, price, image, category } = e.target.dataset;
        this.cart.addItem(name, parseFloat(price), image, category);
        this.ui.updateCart(this.cart.getItems());
        this.ui.updateMenuControls(this.menu.getItems(), this.cart.getItems());
        this.ui.showToast(`${name} added to cart`);
      }
      if (e.target.classList.contains('qty-controls__button')) {
        const { name, action } = e.target.dataset;
        if (action === 'increment') {
          const item = this.menu.getItems().find(i => i.name === name);
          this.cart.addItem(name, item.price, item.image, item.category);
        } else if (action === 'decrement') {
          this.cart.removeItem(name);
        }
        this.ui.updateCart(this.cart.getItems());
        this.ui.updateMenuControls(this.menu.getItems(), this.cart.getItems());
        this.ui.showToast(`${name} ${action === 'increment' ? 'added to' : 'removed from'} cart`);
      }
      if (e.target.classList.contains('remove-btn')) {
        const name = e.target.dataset.name;
        this.cart.removeAllItem(name);
        this.ui.updateCart(this.cart.getItems());
        this.ui.updateMenuControls(this.menu.getItems(), this.cart.getItems());
        this.ui.showToast(`${name} removed from cart`);
      }
      if (e.target.classList.contains('back-btn') || e.target.classList.contains('cart-toggle')) {
        const pageId = e.target.dataset.page || 'cart-page';
        this.ui.showPage(pageId, this.cart.getItems());
      }
    });
  }

  async handleOrderSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const submitButton = document.querySelector('.send-order');

    if (!name || !phone || !address || Object.keys(this.cart.getItems()).length === 0) {
      this.ui.showToast('Please fill all details and add items to your cart', 'error');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      this.ui.showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Placing Order...';

    try {
      const message = this.cart.generateOrderMessage(name, phone, address);
      const encoded = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/919982628634?text=${encoded}`;
      window.open(whatsappURL, '_blank');
      this.ui.showToast('Order sent successfully!');
      this.cart.clear();
      this.ui.updateCart(this.cart.getItems());
      this.ui.updateMenuControls(this.menu.getItems(), this.cart.getItems());
      document.getElementById('order-form').reset();
    } catch (error) {
      this.ui.showToast('Failed to send order. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Place Order via WhatsApp';
    }
  }
}

new App();
