const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');


router.get('/test/:price/:sort', shopController.getProductTest);

router.get('/:price/:sort', shopController.getIndex);
router.get('/:category/:price/:sort', shopController.getProductByCategory);
router.get('/:prodId', shopController.getProduct);


router.post('/cart', isAuth, shopController.setCart);

module.exports = router;