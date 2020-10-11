const {body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.validateSignupRequest = [
    body('firstName').notEmpty().withMessage('Họ và tên lót không được để trống'),
    body('lastName').notEmpty().withMessage('Tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({min: 8}).withMessage('Mật khẩu phải nhiều hơn 8 ký tự'),
    body('date_of_birth').isDate().withMessage('Ngày tháng năm sinh không hợp lệ')
]

exports.validateSighinRequest = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({min: 8}).withMessage('Mật khẩu phải nhiều hơn 8 ký tự')
]

exports.isRequestValidated = (req,res,next) => {
    const errors = validationResult(req)
    if(errors.array().length > 0){
        console.log( typeof errors.array().length)
        return res.status(400).json({error: errors.array()[0].msg})
    }
    next()
}

exports.userMiddleware = (req,res,next) => {
    console.log(req.user.role)
    if(req.user.role !== 'Khách Hàng')
        return res.status(400).json({message: 'User access denied'})
    next()
}
exports.adminMiddleware = (req,res,next) => {
    console.log(req.user.role)
    if(req.user.role !== 'Quản Trị')
        return res.status(400).json({message: 'Admin access denied'})
    next()
}