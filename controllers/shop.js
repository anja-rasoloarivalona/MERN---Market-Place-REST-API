const Product = require('../models/product');
const mongoose = require('mongoose');



exports.getIndex = (req, res, next) => {

    const currentPage = req.query.page || 1;
    const perPage = 10;
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

    let priceMax;
    let priceMin;

    Product
    .find({
        price: {$gte: min, $lte: max}
    })   
    .countDocuments()
    .then( count => {
        totalProducts = count;
        return Product
                .find()
                .sort({price: 1})        
    })
    .then(products => {
        priceMin = products[0].price;
        priceMax = products[products.length - 1].price;
        return Product
                .find({price: {$gte: min, $lte: max}})
                .sort(sort)
                .skip((currentPage - 1) * perPage) /*If 1st page , skip nothing - If 2nd page, skip (2 - 1) * 5 = 5 first products */
                .limit(perPage)
    })
    .then(products =>{
        console.log('price min', priceMin)
        console.log('price max', priceMax)
        res
            .status(200)
            .json({message: 'Fetched products successfully.', 
                   products: products,
                   totalProducts: totalProducts,
                   priceMin: priceMin,
                   priceMax: priceMax})
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
    let productsFound = [];

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
    };

    Product
    .countDocuments({category: category, price: {$gte: min, $lte: max} })
    .then( count => {
        totalProducts = count;
        return Product
            .find({category: category, price: {$gte: min, $lte: max} })
            .sort(sort)
            .skip((currentPage - 1) * perPage) /*If 1st page , skip nothing - If 2nd page, skip (2 - 1) * 5 = 5 first products */
            .limit(perPage)
    })
    .then(products =>{
        productsFound = products;

       return  Product
                .find({category: category})
                .sort({price: 1})  
          
    })
    .then( products => {
        res
        .status(200)
        .json({message: 'Fetched products successfully.',
             products: productsFound,
             totalProducts: totalProducts,
             minPrice: products[0].price,
             maxPrice: products[products.length - 1].price })
             next() 
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