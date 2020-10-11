const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const slugify = require("slugify");

router.get("/", isLoggedIn, function (req, res) {
  res.redirect("/admin/product/danh-sach", { layout: false });
});

router.get("/danh-sach", isLoggedIn, function (req, res) {
  Product.find().then(function (pro) {
    res.render("admin/product/danh-sach", { product: pro, layout: false });
  });
});

router.get("/them-product", isLoggedIn, function (req, res) {
  Category.find().then(function (cate) {
    res.render("admin/product/them", {
      errors: null,
      cate: cate,
      layout: false,
    });
  });
});

router.post("/them-product", isLoggedIn, function (req, res) {
  if (req.body.productImages) var image = req.body.productImages[0].img;
  var pro = new Product({
    productImages: req.body.productImages,
    name: req.body.name,
    slug: slugify(req.body.name, {
      remove: /[*+~.()"!:@]\'\&\s/gm,
      lower: true,
      strict: true,
      replacement: "-",
      locale: "vi",
    }),
    brand: req.body.brand,
    description: req.body.description,
    attrs: req.body.attrs,
    mainImage: image,
    categoryId: req.body.categoryId,
  });
  pro.save().then(function () {
    req.flash("succsess_msg", "Đã Thêm Thành Công");
    res.redirect("/admin/product/them-product");
  });
});

router.get("/:id/xoa-product", isLoggedIn, function (req, res) {
  Product.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(error);
    } else {
      data.remove(function () {
        req.flash("succsess_msg", "Đã Xoá Thành Công");
        res.redirect("/admin/product/danh-sach");
      });
    }
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Quản Trị") {
    return next();
  } else res.redirect("/admin/login");
}
