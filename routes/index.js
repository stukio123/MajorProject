const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Category = require("../models/category")

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
  Category.find().then(function (cate) {
    Product.find({ name: { $regex: find } }, function (err, result) {
      console.log(result);
      res.render("shop/san-pham", { product: result, cate: cate });
    });
  });
});

//Trang Danh mục
router.get('/san-pham', function (req, res) {
	Product.find({}).then(function(product){
		Category.find({}).then(function(cate){
			res.render('shop/san-pham',{products: product, cates: cate});
		});
	});
});

//Trang chi tiết Sản phẩm
router.get("/chi-tiet/:slug", function (req, res) {
  Product.findOne({slug: req.params.slug}).then(function (data) {
    console.log(data);
    res.render("shop/chi-tiet", { products: data });
  });
});

module.exports = router;
