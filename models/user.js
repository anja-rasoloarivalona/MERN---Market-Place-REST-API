const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email : {
        type : String,
        require: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],

    cart: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'            
                }
            }
        ],

        totalProductsCount: Number,
        subTotalPrice: Number,
        taxes: Number,
        totalPrice: Number,
        taxRate: {
            type: Number,
            value: 0.15
        }
    }
});

userSchema.methods.addProductToCart = function(product) {

    let productsInCart = this.cart.items;
    let totalProductsCount = productsInCart.length;
    let subTotalPrice = this.cart.subTotalPrice;
    let taxes = this.cart.taxes;
    let totalPrice = this.cart.totalPrice;
    let taxRate = this.cart.taxRate.value;

    productsInCart.push({
        product: product._id
    })


    subTotalPrice = subTotalPrice + product.price;
    taxes = subTotalPrice * taxRate;
    totalPrice = subTotalPrice + taxes;

    let updatedCart = {
        items: productsInCart,
        totalProductsCount: totalProductsCount,
        subTotalPrice: subTotalPrice,
        taxes: taxes,
        totalPrice: totalPrice,
        taxRate: taxRate
    }

    this.cart = updatedCart;

    return this.save()
}

userSchema.methods.setProductToCart = function(products){


    let updatedProductsInCart = products;
    let updatedCartItems = [];
    


    let totalProductsCount = products.length;
    let subTotalPrice = 0;
    let taxes = 0;
    let totalPrice = 0;
    let taxRate = 0.15;

    



    updatedProductsInCart.forEach(i => {
        subTotalPrice = subTotalPrice + i.price;
        updatedCartItems = [...updatedCartItems, {product: i._id}]
    })

    taxes = subTotalPrice * taxRate;
    totalPrice = subTotalPrice + taxes;

    let updatedCart = {
        items: updatedCartItems,

        totalProductsCount: totalProductsCount,
        subTotalPrice: subTotalPrice,
        taxes: taxes,
        totalPrice: totalPrice,
        taxRate: taxRate
    }

    this.cart = updatedCart;

    return this.save();

}

module.exports = mongoose.model('User', userSchema)