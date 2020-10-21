const express = require("express");
const router = express.Router();

const {
  TrangChu,
  DanhMuc,
  TimSanPham,
  ChiTiet,
  LocSanPham,
  ThanhToan,
  GioHang,
  ThemGioHang,
  XoaGioHang,
  XoaTatCa,
  SuaGioHang,
} = require("../controllers/indexController");
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");

//Trang chủ
router.get("/", TrangChu);
//Trang Danh mục
router.get("/san-pham", DanhMuc);

//Tìm sản Phẩm ở trang chủ
router.post("/", TimSanPham);

//Tìm sản phẩm ở trang Sản Phẩm
router.post("/san-pham/", TimSanPham);

//Tìm sản phẩm ở trang Danh Mục
router.post("/cate/:name", TimSanPham);

//Trang chi tiết Sản phẩm
router.get("/chi-tiet/:slug", ChiTiet);

//Lọc sản phẩm theo Danh Mục
router.get("/cate/:slug", LocSanPham);

//Thêm sản phẩm vào giỏ hàng
router.post("/gio-hang", ThemGioHang);

//Trang thanh toán
router.get("/thanh-toan", isLoggedIn, ThanhToan);

//Thông tin giỏ hàng
router.get("/gio-hang", isLoggedIn, GioHang);

//Sửa Giỏ Hàng
router.put("/gio-hang", SuaGioHang);

//Xóa sản phẩm
router.delete("/gio-hang", XoaGioHang);

//Xóa tất cả sản phẩm
router.delete("/gio-hang/all", XoaTatCa);

// router.get("/them-vao-gio-hang/:id", function (req, res, next) {
//   var productId = req.params.id;
//   var cart = new Cart(req.session.cart ? req.session.cart : {});
//   Product.findById({ productId }, function (err, product) {
//     if (err) {
//       return res.redirect("/");
//     }
//     console.log(product);
//     cart.add(product, product.id);
//     req.session.cart = cart;
//     console.log(req.session.cart);
//     res.redirect("/gio-hang");
//   });
// });

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
