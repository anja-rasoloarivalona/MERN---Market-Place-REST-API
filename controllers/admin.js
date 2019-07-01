
const Product = require('../models/product');

exports.AddProduct = (req, res, next) => { //same as Create Post
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