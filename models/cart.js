"use strict";

module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQuantity = oldCart.totalQuantity || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.getTotalQuantity = () => {
      var quantity = 0;
      for (var id in this.items) {
          quantity += parseInt(this.items[id].quantity);
      }
      return quantity;
  };

  this.getTotalPrice = () => {
      var price = 0;
      for (var id in this.items) {
          price += parseFloat(this.items[id].total);
      }
      price = parseFloat(price).toFixed(2);
      return price;
  };

  //Phương thức thêm sản phẩm vào giỏ hàng
  //Nếu chưa có sản phẩm trong giỏ hàng thì thêm mới 
  this.add = (item, id, quantity, size, price) => {
      var storedItem = this.items[id];
      if (!storedItem) {
          this.items[id] = { item: item, quantity: 0, price: price, total: (price * quantity) , size : size};
          storedItem = this.items[id];
      }
      storedItem.price = parseFloat(storedItem.price);
      storedItem.quantity += parseInt(quantity);
      storedItem.total = parseFloat(storedItem.price * storedItem.quantity);
      this.totalQuantity = this.getTotalQuantity();
      this.totalPrice = this.getTotalPrice();
      return this.getCartItem(id);
  };

  this.remove = (id) => {
      var storedItem = this.items[id];
      if (storedItem) {
          delete this.items[id];
          this.totalQuantity = this.getTotalQuantity();
          this.totalPrice = this.getTotalPrice();
      }
  };

  this.update = (id, quantity) => {
      var storedItem = this.items[id];
      if (storedItem && quantity >= 1) {
          storedItem.quantity = quantity;
          storedItem.total = parseFloat(storedItem.price * storedItem.quantity);
          this.totalQuantity = this.getTotalQuantity();
          this.totalPrice = this.getTotalPrice();
      }
      return this.getCartItem(id);
  };

  this.empty = () => {
      this.items = {};
      this.totalQuantity = 0;
      this.totalPrice = 0;
  };

  this.generateArray = () => {
      var arr = [];
      for (var id in this.items) {
          this.items[id].price = parseFloat(this.items[id].price).toFixed(2);
          this.items[id].total = parseFloat(this.items[id].total).toFixed(2);
          arr.push(this.items[id]);
      }
      return arr;
  };

  this.getCart = function() {
      var cart = {
          items: this.generateArray(),
          totalQuantity: this.totalQuantity,
          totalPrice: this.totalPrice,
      };
      return cart;
  }

  this.getCartItem = function(id) {
      var cartItem = {
          item: this.items[id],
          totalQuantity: this.totalQuantity,
          totalPrice: this.totalPrice,
      }
      return cartItem;
  }
};