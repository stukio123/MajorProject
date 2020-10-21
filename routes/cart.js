var express = require('express');
var router = express.Router();

var Order = require('../models/order.js');
var Cart = require('../models/cart.js');


router.get('/', isLoggedIn, function(req, res, next) {
  res.redirect('/admin/cart/danh-sach', {layout: false});
});

router.get('/danh-sach', isLoggedIn, function(req, res, next) {
	Order.find().then(function(data){
	    res.render('admin/cart/danh-sach', {data: data, layout: false});
	});
  
});

router.get('/:id/xem-cart', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    Order.findById(id).then(function(result){
        res.render('admin/cart/view', {Order: result ,layout: false });
   });
});

router.get('/:id/thanh-toan-cart', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    Order.findById(id, function(err, data){
        data.st = 1;
        data.save();
        req.flash('succsess_msg', 'Đã Thanh Toán');
       res.redirect('/admin/cart/'+id+'/xem-cart');
    });
});


router.get('/:id/xoa-cart', isLoggedIn, function(req, res, next) {
    var id = req.params.id;
    Order.findOneAndRemove({_id: id}, function(err, offer){
        req.flash('succsess_msg', 'Đã Xoá Thành Công');
       res.redirect('/admin/cart/danh-sach'); 
    });
});

module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'Quản Trị' ){
      return next();
    } else
    res.redirect('/admin/login');
  };