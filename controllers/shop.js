const Product = require('../models/product');
const mongoose = require('mongoose');



exports.getIndex = (req, res, next) => {

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
    .then(products =>{
        res
            .status(200)
            .json({message: 'Fetched products successfully.', products: products})
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.getProductByCategory = (req, res, next) => {
    const category = req.params.category;
    Product
    .find({category: category})
    .sort({ createdAt: -1})
    .then(products =>{
        res
            .status(200)
            .json({message: 'Fetched products successfully.', products: products})
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