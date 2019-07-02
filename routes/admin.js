const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/add-product', adminController.addProduct);

router.put('/product/:prodId', adminController.updateProduct);

router.delete('/product/:prodId', adminController.deleteProduct);

module.exports = router;