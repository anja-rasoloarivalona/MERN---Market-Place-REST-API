const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/:category/:prodId', shopController.getProduct);

router.get('/', shopController.getIndex);



module.exports = router;