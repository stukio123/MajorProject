const express = require("express");
const router = express.Router();

const { GetListUser, GetOneUserById, EditOneUserById, DeleteOneUserById } = require("../controllers/userAdminController")

router.get("/", isLoggedIn, GetListUser);

router.get("/danh-sach", isLoggedIn, GetListUser);

router.get("/:id/sua-user", isLoggedIn, GetOneUserById);

router.post("/:id/sua-user", isLoggedIn, EditOneUserById);

router.get("/:id/xoa-user", isLoggedIn, DeleteOneUserById);

module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Quản Trị") {
    return next();
  } else res.redirect("/admin/login");
}
