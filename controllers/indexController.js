const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.TrangChu = (req, res, next) => {
  Product.find()
    .limit(8)
    .lean()
    .then(function (product) {
      res.render("shop/index", { products: product, login: req.session.user ? true : false });
    });
};

exports.DanhMuc = (req, res, next) => {
  Product.find({}).limit(15).then(function (product) {
    Category.find({}).then(function (cate) {
      res.render("shop/san-pham", { products: product, cates: cate });
    });
  });
};

exports.TimSanPham = (req, res, next) => {
  var find = req.body.find;
  console.log(find);
  Category.find().then(function (cate) {
    Product.find({ name: new RegExp(find, "i") }, function (err, result) {
      //res.redirect("./san-pham")
      res.render("shop/san-pham", { products: result, cates: cate });
    });
  });
};

exports.ChiTiet = (req, res, next) => {
  Product.findOne({ slug: req.params.slug }).then(function (data) {
    console.log(data);
    res.render("shop/chi-tiet", { products: data });
  });
};

exports.LocSanPham = async (req, res, next) => {
  const slug = req.params.slug;
  const category = await Category.find({}).exec();
  const products = await Product.find({})
    .populate({ path: "category", select: "_id name slug" })
    .exec();
  const filterProducts = products.filter(
    (product) => product.category && product.category.slug === slug
  );
  res.render("shop/san-pham", { products: filterProducts, cates: category });
};

exports.ThanhToan = (req, res, next) => {
  if (!req.session.cart) {
    return res.render("shop/gio-hang", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.locals.cart = cart.getCart();
  res.render("shop/thanh-toan");
  console.log(res.locals.cart);
};

exports.GioHang = (req, res, next) => {
  var cart = req.session.cart;
  res.locals.cart = cart.getCart();
  res.locals.login = req.isAuthenticated();
  res.render("shop/gio-hang");
  console.log(cart);
};

exports.ThemGioHang = (req, res, next) => {
  const productId = req.body.id;
  const quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
  const size = req.body.size;
  const price = req.body.price;
  console.log(JSON.stringify(req.body));
  Product.findById(productId)
    .then((product) => {
      var cartItem = req.session.cart.add(
        product,
        productId,
        quantity,
        size,
        price
      );
      res.json(cartItem);
    })
    .catch((error) => next(error));
  console.log(
    `đã thêm sản phẩm vào giỏ hàng + ${req.body.price} + ${req.body.quantity} + ${req.body.size}`
  );
};

exports.XoaGioHang = (req, res, next) => {
  var productId = req.body.id;
  req.session.cart.remove(productId);
  res.json({
    totalQuantity: req.session.cart.totalQuantity,
    totalPrice: req.session.cart.totalPrice,
  });
};

exports.SuaGioHang = (req, res, next) => {
  var productId = req.body.id;
  var quantity = parseInt(req.body.quantity);
  var cartItem = req.session.cart.update(productId, quantity);
  res.json(cartItem);
};

exports.XoaTatCa = (req, res, next) => {
  req.session.cart.empty();
  res.sendStatus(204);
  res.end();
};
