const Product = require("../models/product");
const Category = require("../models/category");
const slugify = require("slugify");

exports.GetListProduct = (req, res, next) => {
  Product.find().then(function (pro) {
    res.render("admin/product/danh-sach", { product: pro, layout: false });
  });
};

exports.AddProduct = (req, res, next) => {
  if (req.body.productImages) var image = req.body.productImages[0].img;
  var product = new Product({
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
    category: req.body.categoryId,
  });
  product.save().then(function () {
    req.flash("succsess_msg", "Đã Thêm Thành Công");
  });
};

exports.GetProductById = async (req, res, next) => {
  await Product.findById(req.params.id).then(function (data) {
    console.log(data);
    Category.find().then(function (cate) {
      res.render("admin/product/sua", {
        errors: null,
        product: data,
        cate: cate,
        layout: false,
      });
    });
  });
};

exports.EditProductById = async (req, res, next) => {
  console.log(req.body);
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
    category: categoryId,
    description: description,
  };
  await Product.findByIdAndUpdate({ _id }, data, { new: true }, (error) => {
    if (error) {
      req.flash("hasErrors", "Lỗi khi sửa sản phẩm");
      console.log(error);
      return res.status(400);
    } else {
      req.flash("succsess_msg", "Sửa thành công");
      res.redirect("../danh-sach/");
      console.log("Sửa thành công");
      return res.status(200);
    }
  });
};

exports.DeleteProductById = async (req, res, next) => {
  await Product.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(error);
    } else {
      data.remove(function () {
        req.flash("succsess_msg", "Đã Xoá Thành Công");
        res.redirect("/admin/product/danh-sach");
      });
    }
  });
};
