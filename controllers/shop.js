const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    res.status(200).json({
        products: [{
            _id: '1',
            title: "First Product",
            price: '12',
            description: 'This is the first product'
        }]
    })
}