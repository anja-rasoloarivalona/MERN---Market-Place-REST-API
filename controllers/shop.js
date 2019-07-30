const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getProductTest = (req, res, next) => {

    let category = req.query.category;

  


    let price = req.params.price;
    let priceReq;
    let totalProducts;

    const currentPage = req.query.page || 1;
    const perPage = 10;

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


    if(!price.includes('undefined')){
        priceReq = { price: {$gte: price.split('&&')[0], $lte: price.split('&&')[1]} }
    } else {
        priceReq = { price: {$gte: 0}}
    }

    let find = priceReq;

    if(!category.includes('undefined')  && category != ''){
        console.log('cat going', category);
        find = {...find, category: category};

    } else {
        console.log('cat fucked');
    }

   // ({category: category, price: {$gte: min, $lte: max} })
    

    Product
    .find(find)
    .sort({ price : 1})
    .then( products => {
        priceMin = products[0].price;
        priceMax = products[products.length - 1].price;

        console.log(products.length);

        return Product
                .find(find)
                .countDocuments()      
    })
    .then( count => {
        totalProducts = count;
        return Product
                .find(find)
                .sort(sort)
                .skip((currentPage - 1) * perPage) 
                .limit(perPage)
    })
    .then( products => {
        res
        .status(200)
        .json({message: 'Fetched products successfully.', 
               products: products,
               priceMin: priceMin,
               priceMax: priceMax,
               totalProducts: totalProducts})
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.setCart = (req, res, next) => {

    console.log('set happenned');
    
    let products = req.query.products;
    let userId = req.query.userId;
    let user;
    let productsIds = [];

    products.forEach(product => {
        let id = product._id.toString()
        productsIds = [...productsIds,  mongoose.Types.ObjectId(id) ];

    })

    console.log('post cart', products);
    User
    .findById(userId)
    .then(user => {
        console.log(user);
        user = user;

      return  Product.find({
            '_id': { $in: productsIds}
        })
    })
    .then( products => {
        console.log(products);
        return user.setProductToCart(products)
    })
    .then( result => {
        console.log(result)
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

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