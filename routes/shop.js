const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/address', isAuth, shopController.getAddress);
router.get('/order', isAuth, shopController.getOrder);

router.get('/test/:price/:sort', shopController.getProductTest);

router.get('/:price/:sort', shopController.getIndex);
router.get('/:category/:price/:sort', shopController.getProductByCategory);
router.get('/:prodId', shopController.getProduct);




router.post('/cart/order', isAuth, shopController.postOrder);

router.post('/cart', isAuth, shopController.setCart);

router.post('/cart/add-userInfo', isAuth, shopController.addUserInfo);




router.post('/cart/add-product/:prodId', isAuth, shopController.addProductToCart);
router.post('/cart/delete-product/:prodId', isAuth, shopController.deleteProductInCart);
router.delete('/cart', isAuth, shopController.clearProductsInCart)
module.exports = router;