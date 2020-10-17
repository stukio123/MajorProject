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
  });
});

router.get("/:id/sua-product", function (req, res) {
  Product.findById(req.params.id).then(function (data) {
    Category.find().then(function (cate) {
      res.render("admin/product/sua", {
        errors: null,
        product: data,
        cate: cate,
        layout: false,
      });
    });
  });
});

router.post("/:id/sua-product", function (req, res) {
  const {
    name,
    brand,
    productImages,
    attrs,
    categoryId,
    description,
  } = req.body;
  const _id = req.params.id;
  const img = productImages[0].img;
  let data = {
    name: name,
    brand: brand,
    slug: slugify(req.body.name, {
      remove: /[*+~.()"!:@]\'\&\s/gm,
      lower: true,
      strict: true,
      replacement: "-",
      locale: "vi",
    }),
    attrs: attrs,
    productImages: productImages,
    mainImage: img,
    categoryId: categoryId,
    description: description,
  };
  Product.findByIdAndUpdate({ _id }, data, { new: true }, (error) => {
    if (error) {
      req.flash("hasErrors", "Lỗi khi sửa sản phẩm");
      console.log(error);
    } else {
      req.flash("succsess_msg", "Sửa thành công");
      console.log("Sửa thành công")
    }
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
