export class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || {};
  }

  addItem(name, price, image, category) {
    if (!this.items[name]) {
      this.items[name] = { qty: 0, price, image, category };
    }
    this.items[name].qty++;
    this.save();
  }

  removeItem(name) {
    if (this.items[name] && this.items[name].qty > 0) {
      this.items[name].qty--;
      if (this.items[name].qty === 0) {
        delete this.items[name];
      }
      this.save();
    }
  }

  removeAllItem(name) {
    if (this.items[name]) {
      delete this.items[name];
      this.save();
    }
  }

  clear() {
    this.items = {};
    this.save();
  }

  getItems() {
    return this.items;
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  generateOrderMessage(name, phone, address) {
    let message = `*New Order from Aapki Rasoi*\n*Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n*Order Summary:*\n`;
    let subtotal = 0;
    for (let item in this.items) {
      message += `${item} x ${this.items[item].qty} = ₹${(this.items[item].qty * this.items[item].price).toFixed(2)}\n`;
      subtotal += this.items[item].qty * this.items[item].price;
    }
    const tax = subtotal * 0.05;
    const deliveryCharge = subtotal >= 100 ? 0 : 20;
    const total = subtotal + tax + deliveryCharge;
    message += `\n*Bill Details:*\nSubtotal: ₹${subtotal.toFixed(2)}\nTax (5%): ₹${tax.toFixed(2)}\nDelivery Charge: ₹${deliveryCharge.toFixed(2)}\nTotal: ₹${total.toFixed(2)}`;
    return message;
  }
}
