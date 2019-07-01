const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.find()
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