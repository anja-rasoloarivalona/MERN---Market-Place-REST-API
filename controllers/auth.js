const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then( encryptedPassword => {
            const user = new User({
                email: email,
                name: name,
                password: encryptedPassword
            });

           return user.save()
        })
        .then( result => {
            res.status(201).json({message: 'User Created', userId: result._id})
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}