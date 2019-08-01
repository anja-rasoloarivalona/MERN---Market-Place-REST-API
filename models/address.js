const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },

    address1: {
        type: String,
        required: true
    },

    address2: {
        type: String,
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    zip: {
        type: String,
        required: true
    },

    email : {
        type : String,
        require: true
    },

    phoneNumber: {
        type: String,
        require: true
    },
    
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

} , {timestamps: true})


module.exports = mongoose.model('UserInfo', addressSchema )