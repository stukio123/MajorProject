var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/", isLoggedIn, function (req, res, next) {
  res.render("admin/main/index", { layout: false });
});

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  req.session.user = null;
  req.flash("succsess_msg", "Bạn đã đăng xuất");
  req.session.destroy(); 
  res.redirect("/");
});


module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Quản Trị") {
    return next();
  } else res.redirect("/");
}

function notisLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    if (req.isAuthenticated() && req.user.role !== "Quản Trị") {
      return next();
    } else {
      res.redirect("/admin");
    }
  }
}
