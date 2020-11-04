const User = require("../models/user.js");

exports.GetListUser = (req, res, next) => {
  User.find().then((data) => {
    console.log(data);
    res.render("admin/user/danh-sach", { us: data, layout: false });
  });
};

exports.GetOneUserById = (req, res, next) => {
  var id = req.params.id;
  User.findById(id).then((user) => {
    res.render("admin/user/sua-user", { user: user, layout: false });
  });
};

exports.EditOneUserById = (req, res, next) => {
  User.findById(req.params.id, function (err, data) {
    data.role = req.body.role;
    data.save();
    req.flash("succsess_msg", "Đã Sửa Thành Công");
    res.redirect("/admin/user/danh-sach");
  });
};

exports.DeleteOneUserById = (req, res, next) => {
  var id = req.params.id;
  User.findOneAndRemove({ _id: id }, function (err, offer) {
    req.flash("succsess_msg", "Đã Xoá Thành Công");
    res.redirect("/admin/user/danh-sach");
  });
};
