const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');



router.get('/:price/:sort', shopController.getIndex);
router.get('/:category/:price/:sort', shopController.getProductByCategory);
router.get('/:prodId', shopController.getProduct);


module.exports = router;