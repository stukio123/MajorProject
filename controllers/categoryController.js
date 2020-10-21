const slugify = require("slugify");
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

exports.GetListCategory = async (req, res, next) => {
  await Cate.find()
    .sort([["name", "asc"]])
    .then(function (categories) {
      res.render("admin/cate/danh-sach", { layout: false, cate: categories });
    });
};

exports.AddCategory = async (req, res, next) => {
  let parent = undefined;
  if (req.body.parentId) parent = req.body.parentId;
  var cate = new Cate({
    name: req.body.name,
    slug: slugify(req.body.name, {
      remove: /[*+~.()'"!:@]\s/g,
      replacement: "-",
      locale: "vi",
    }),
    parentId: parent,
  });
  await cate
    .save()
    .then(() => {
      req.flash("succsess_msg", "Đã Thêm Thành Công");
      res.redirect("/admin/cate/danh-sach");
    })
    .catch((error) => {
      req.flash("hasErrors", "Thêm Thất bại\n" + error);
      res.redirect("/admin/cate/them-cate");
    });
};

exports.EditCategory = async (req, res, next) => {
  await Cate.findById(req.params.id, function (err, data) {
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
    data
      .save()
      .then(() => {
        req.flash("succsess_msg", "Đã Sửa Thành Công");
        res.redirect("/admin/cate/danh-sach");
      })
      .catch((error) => {
        req.flash("succsess_msg", "Đã Sửa Thành Công");
        res.redirect(`/admin/cate/${req.params.id}/sua-cate`);
      });
  });
};

exports.DeleteCategory = async (req, res, next) => {
  await Cate.findById(req.params.id).remove(() => {
    req.flash("succsess_msg", "Đã Xoá Thành Công");
    res.redirect("/admin/cate/danh-sach");
  });
};
