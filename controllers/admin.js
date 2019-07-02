
const Product = require('../models/product');

exports.addProduct = (req, res, next) => { //same as Create Post
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description
    })
    product.save() //mongoose method : save on the database
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product created successfully',
            post: result
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.updateProduct = (req, res, next) => {
    const prodId = req.params.prodId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;

    Product.findById(prodId)
        .then(product => {
            if(!product) {
                const error = new Error('Product not found')
                error.statusCode = 404;
                throw error;
            }
            product.title = title;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then( resultOfSave => {
            res.status(200).json({messsage: 'Product updated', product: resultOfSave})
        })
        .catch(err => {
            console.log(err)
        })
}