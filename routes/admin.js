const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', isAuth, adminController.addProduct);

router.put('/product/:prodId', isAuth, adminController.updateProduct);

router.delete('/product/:prodId', isAuth, adminController.deleteProduct);

module.exports = router;