const express = require("express")
const router = express.Router()
const Category = require("../models/category")
const Product = require("../models/product")

function createCategories(categories, parentId = null){

    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    }else{
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            children: createCategories(categories, cate._id)
        });
    }

    return categoryList;

};

router.get("/", async (req,res,next)=>{
    const categories = await Category.find({}).exec();
    const products = await Product.find().limit(10).populate({path: 'category', select: '_id name slug'}).exec();
    products.forEach(product => {
        if(product.category && product.category.name == 'Lifestyle')
        {
            console.log(product.slug)
        }
    })
    res.status(200).json({
        products
    })
})

module.exports = router