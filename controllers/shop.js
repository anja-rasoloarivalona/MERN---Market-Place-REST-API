const Product = require('../models/product');
const mongoose = require('mongoose');



exports.getIndex = (req, res, next) => {

    const currentPage = req.query.page || 1;
    const perPage = 5;
    let totalProducts;

    let price = req.params.price;
    let min = price.split('&&')[0]
    let max = price.split('&&')[1]
    let sort;
    if(req.params.sort === 'latest'){
        sort = {createdAt: -1}
    }
    if(req.params.sort === 'low_to_high'){
        sort = {price: 1}
    }
    if(req.params.sort === 'high_to_low'){
        sort = {price: -1}
    } 

    Product
    .find({
        price: {$gt: min, $lt: max}
    })
    .sort(sort)
    .countDocuments()
    .then( count => {
        totalProducts = count;
        return Product.find()
            .skip((currentPage - 1) * perPage) /*If 1st page , skip nothing - If 2nd page, skip (2 - 1) * 5 = 5 first products */
            .limit(perPage)
    })
    .then(products =>{
        res
            .status(200)
            .json({message: 'Fetched products successfully.', 
                   products: products,
                   totalProducts: totalProducts})
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.getProductByCategory = (req, res, next) => {
    let category = req.params.category;
    let price = req.params.price;
    let min = price.split('&&')[0];
    let max = price.split('&&')[1];

    console.log(category);

    const currentPage = req.query.page || 1;
    const perPage = 5;
    let totalProducts;

    let sort;
    if(req.params.sort === 'latest'){
        sort = {createdAt: -1}
    }
    if(req.params.sort === 'low_to_high'){
        sort = {price: 1}
    }
    if(req.params.sort === 'high_to_low'){
        sort = {price: -1}
    }

    
    Product
    .find(
        {category: category, price: {$gt: min, $lt: max} }
    )
    .sort(sort)
    .countDocuments()
    .then( count => {
        totalProducts = count;
        return Product.find({category: category, price: {$gt: min, $lt: max} })
            .skip((currentPage - 1) * perPage) /*If 1st page , skip nothing - If 2nd page, skip (2 - 1) * 5 = 5 first products */
            .limit(perPage)
    })
    .then(products =>{
        res
            .status(200)
            .json({message: 'Fetched products successfully.',
                 products: products,
                 totalProducts: totalProducts})
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.prodId;
    const ID = mongoose.Types.ObjectId(prodId);
    Product.findById(ID)
        .then(prod => {
            if(!prod){
                const error = new Error('Product not found')
                error.statusCode = 404;
                throw err
            }

            res.status(200).json({message:'Product fetched', product: prod})
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }

            next(err);
        })
}