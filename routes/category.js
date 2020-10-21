const express = require("express");
const router = express.Router();
const { GetListCategory, AddCategory, EditCategory, DeleteCategory } = require("../controllers/categoryController.js");

const Cate = require("../models/category.js");

const createCategories = (categories, parentId = null) => {
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

router.get("/danh-sach", isLoggedIn, GetListCategory);

router.get("/them-cate", isLoggedIn, function (req, res, next) {
  Cate.find()
    .sort([["name", "asc"]])
    .then((cate) => {
      res.render("admin/cate/them-cate", { layout: false, cate: cate });
    });
});

router.post("/them-cate", isLoggedIn, AddCategory);

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

router.post("/:id/sua-cate", isLoggedIn, EditCategory);

router.get("/:id/xoa-cate", isLoggedIn, DeleteCategory);

module.exports = router;
// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Quản Trị") {
    return next();
  } else res.redirect("/");
}
