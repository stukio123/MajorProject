const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const {
  GetListProduct,
  AddProduct,
  GetProductById,
  EditProductById,
  DeleteProductById,
} = require("../controllers/productController");

router.get("/", isLoggedIn, function (req, res) {
  res.redirect("/admin/product/danh-sach", { layout: false });
});

router.get("/danh-sach", isLoggedIn, GetListProduct);

router.get("/them-product", isLoggedIn, function (req, res) {
  Category.find().then(function (cate) {
    res.render("admin/product/them", {
      errors: null,
      cate: cate,
      layout: false,
    });
  });
});

router.post("/them-product", isLoggedIn, AddProduct);

router.get("/:id/sua-product", isLoggedIn , GetProductById);

router.post("/:id/sua-product", isLoggedIn, EditProductById);

router.get("/:id/xoa-product", isLoggedIn, DeleteProductById);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Quản Trị") {
    return next();
  } else res.redirect("/admin/login");
}
