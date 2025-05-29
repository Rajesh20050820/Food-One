export class Menu {
  constructor(items) {
    this.items = items;
  }

  getItems(filter = 'All') {
    return filter === 'All' ? this.items : this.items.filter(item => item.category === filter);
  }

  getCategories() {
    return ['All', ...new Set(this.items.map(item => item.category))];
  }
}
