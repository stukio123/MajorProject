const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const addressSchema = new mongoose.Schema({
    street: {type: String},
    district: {type: String},
    ward: {type: String},
    city: {type: String}
})

const usersSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 32
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 32
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hash_password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Khách Hàng','Quản Trị','Nhân Viên'],
        default: 'Khách Hàng'
    },
    address: [addressSchema],
    tel: { type: String},
    avatar: {type: String},
    dat_of_birth: {type: Date}
},{timestamps: true})


usersSchema.virtual('password').set(function(password){
    this.hash_password = bcrypt.hashSync(password,10)
})

usersSchema.virtual('fullName').get(function(){
    return `${this.lastName} ${this.firstName}`
})

usersSchema.virtual('Addresses').get(function(){
    return `${this.street}, ${this.ward}, ${this.district},${this.City}`
})

usersSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password,this.hash_password)
    },
    encryptPassword: function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null)
    },
    isAdmin: function(role){
        return role === 'Quản Trị' ? true : false
    }
}

module.exports = mongoose.model('Users',usersSchema)