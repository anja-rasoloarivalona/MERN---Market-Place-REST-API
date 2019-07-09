const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  
  Product.find({ creator: req.userId})
  .then(products => {
    res 
      .status(200)
      .json({message: 'Fetched amdin products', products: products})
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode= 500;
    }
    next(err)
  })

}

exports.addProduct = (req, res, next) => {

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const price = req.body.price;
  const category = req.body.category;
  const description = req.body.description;
  let creator;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    category: category,
    creator: req.userId
  });
  product
    .save()
    .then(result => {
     return User.findById(req.userId)
    })
    .then( user => {
      creator = user;
      user.products.push(product);
      return user.save();     
    }) 
    .then( result => {
      res.status(201).json({
        message: 'Post created successfully!',
        product: product,
        creator: {_id: creator._id, name: creator.name}
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.updateProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const category = req.body.category;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      if(product.creator.toString() !== req.userId){
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== product.imageUrl) {
        clearImage(product.imageUrl);
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      product.category = category;

      return product.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Product updated!', product: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if(product.creator.toString() !== req.userId){
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
      }
      clearImage(product.imageUrl);
      return Product.findByIdAndRemove(prodId);
    })
    .then(result => {
    return User.findById(req.userId)  
    })
    .then( user => {
      user.products.pull(prodId);
      return user.save()
     
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Product Deleted' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
