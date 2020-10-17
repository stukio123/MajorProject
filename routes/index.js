const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const product = require("../models/product");

//Trang chủ
router.get("/", function (req, res, next) {
  Product.find()
    .limit(8)
    .lean()
    .then(function (product) {
      res.render("shop/index", { products: product });
    });
});

//Tìm sản phẩm ở trang chủ
router.post("/", function (req, res) {
  var find = req.body.find;
  console.log(find);
  Category.find().then(function (cate) {
    Product.find({ name: new RegExp(find, "i") }, function (err, result) {
      //res.redirect("./san-pham")
      res.render("shop/san-pham", { products: result, cates: cate });
    });
  });
});

//Trang Danh mục
router.get("/san-pham", function (req, res) {
  Product.find({}).then(function (product) {
    Category.find({}).then(function (cate) {
      res.render("shop/san-pham", { products: product, cates: cate });
    });
  });
});

router.post("/san-pham/", function (req, res) {
  var keyword = req.body.find;
  Category.find().then(function (cate) {
    Product.find({ name: new RegExp(keyword, "i") }, function (err, result) {
      res.render("shop/san-pham", { products: result, cates: cate });
    });
  });
});

//Trang chi tiết Sản phẩm
router.get("/chi-tiet/:slug", function (req, res) {
  Product.findOne({ slug: req.params.slug }).then(function (data) {
    console.log(data);
    res.render("shop/chi-tiet", { products: data });
  });
});

router.post("/cate/:name", function (req, res) {
  var keyword = req.body.find;
  Category.find().then(function (cate) {
    Product.find({ name: new RegExp(keyword, "i") }, function (err, result) {
      res.render("shop/san-pham", { product: result, cate: cate });
    });
  });
});

router.get("/them-vao-gio-hang/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById({ productId }, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    console.log(product);
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/gio-hang");
  });
});

router.post("/gio-hang", (req, res, next) => {
  const productId = req.body.id;
  const quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
  const size = req.body.size
  const price = req.body.price
  console.log(JSON.stringify(req.body))
  Product.findById(productId)
    .then((product) => {
      var cartItem = req.session.cart.add(product ,productId, quantity, size, price);
      res.json(cartItem);
    })
    .catch((error) => next(error));
  console.log(`đã thêm sản phẩm vào giỏ hàng + ${req.body.price} + ${req.body.quantity} + ${req.body.size}`);
});

//Thông tin giỏ hàng
router.get("/gio-hang", function (req, res, next) {
  var cart = req.session.cart
  res.locals.cart = cart.getCart()
  res.render("shop/gio-hang")
  console.log(cart)
});

//Sửa Giỏ Hàng
router.put("/gio-hang",(req,res)=>{
  var productId = req.body.id
  var quantity = parseInt(req.body.quantity)
  var cartItem = req.session.cart.update(productId, quantity)
  res.json(cartItem)
})

//Xóa sản phẩm
router.delete("/gio-hang",(req,res)=>{
  var productId = req.body.id
  req.session.cart.remove(productId)
  res.json({
    totalQuantity: req.session.cart.totalQuantity,
    totalPrice: req.session.cart.totalPrice
  })
})

router.delete("/gio-hang/all",(req,res)=>{
  req.session.cart.empty()
  res.sendStatus(204)
  res.end()
})

module.exports = router;
