const mongoose = require('mongoose');
const shortid = require('shortid')

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    shortId: {
        type: String,
        default: shortid.generate
    },

    cart: {

        items: [
            {
                product: {type: Object}
            }
        ],
        totalProductsCount: Number,
        subTotalPrice: Number,
        taxes: Number,
        deliveryFee: Number,
        totalPrice: Number

    },

    address: 
        {
            type: Object,
        }
    ,

    creator: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ,

    deliveryDate: String
}, {timestamps: true})


module.exports = mongoose.model('Order', orderSchema)