const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    cart: {
        items: [
            {
                products: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                }
            }
        ],
        totalProductsCount: Number,
        subTotalPrice: Number,
        taxes: Number,
        deliveryFee: Number,
        totalPrice: Number

    },

    address: [
        {
            type: Schema.Types.ObjectId,
            ref: 'UserInfo'
        }
    ],

    creator: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    deliveryDate: String
}, {timestamps: true})


module.exports = mongoose.model('Order', orderSchema)