const express = require("express");
const router = express.Router();
const slugify = require("slugify");

const Cate = require("../models/category.js");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      _children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}

router.get("/", isLoggedIn, function (req, res, next) {
  res.redirect("/admin/cate/danh-sach", { layout: false });
});

router.get("/danh-sach", isLoggedIn, function (req, res, next) {
  Cate.find()
    .sort([["name", "asc"]])
    .then(function (categories) {
      //let CreateCategory = createCategories(cate)
      //let CreateCategory = cate
      let list = []
      //console.log(categories)
      // for(let cate in categories)
      // {
      //   list.push({
      //     _id: cate._id,
      //     name: cate.name,
      //     slug: cate.slug,
      //     parentId: cate.parentId,
      //     _parent: categories.filter(cat => cat._id == cate._parentId)
      //   })
      // }
      categories.forEach(cate => {
        list.push({
          _id: cate._id,
          name: cate.name,
          slug: cate.slug,
          parentId: cate.parentId,
          _parent: categories.filter(cat => cat._id === cate._parentId)
        })
      })
      console.log(list)
      
      res.render("admin/cate/danh-sach", { layout: false, cate: list });
    });
});

router.get("/them-cate", isLoggedIn, function (req, res, next) {
  Cate.find()
    .sort([["name", "asc"]])
    .then((cate) => {
      res.render("admin/cate/them-cate", { layout: false, cate: cate });
    });
});

router.post("/them-cate", isLoggedIn, function (req, res, next) {
  var cate = new Cate({
    name: req.body.name,
    slug: slugify(req.body.name, {
      remove: /[*+~.()'"!:@]\s/g,
      replacement: "-",
      locale: "vi",
    }),
  });
  cate.save().then(function () {
    req.flash("succsess_msg", "Đã Thêm Thành Công");
    res.redirect("/admin/cate/them-cate");
  });
});

router.get("/:id/sua-cate", isLoggedIn, function (req, res, next) {
  Cate.find()
    .sort([["name", "asc"]])
    .then((cate) => {
      Cate.findById(req.params.id, function (err, data) {
        res.render("admin/cate/sua-cate", {
          errors: null,
          data: data,
          category: cate,
          layout: false,
        });
      });
    });
});

router.post("/:id/sua-cate", isLoggedIn, function (req, res, next) {
  Cate.findById(req.params.id, function (err, data) {
    const { name, parentId } = req.body;
    data = {
      name: name,
      slug: slugify(req.body.name, {
        remove: /[*+~.()'"!:@]\s/g,
        replacement: "-",
        locale: "vi",
      }),
      parentId: parentId,
    };
    data.save();
    req.flash("succsess_msg", "Đã Sửa Thành Công");
    res.redirect("/admin/cate/danh-sach");
  });
});

router.get("/:id/xoa-cate", isLoggedIn, function (req, res, next) {
  Cate.findById(req.params.id).remove(function () {
    req.flash("succsess_msg", "Đã Xoá Thành Công");
    res.redirect("/admin/cate/danh-sach");
  });
});

module.exports = router;
// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Quản Trị") {
    return next();
  } else res.redirect("/admin/login");
}
