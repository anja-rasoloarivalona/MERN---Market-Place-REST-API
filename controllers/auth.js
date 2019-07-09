const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
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

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let userAskingLogin;

    User.findOne({email : email})
        .then(user => {
            if(!user) {
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401;
                throw error;
            }
            userAskingLogin = user;
            return bcrypt.compare(password, user.password); /* Return true or false */
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            /* We reach this line if user is found and password is correct */

            const token = jwt.sign({
                email: userAskingLogin.email,
                userId: userAskingLogin._id.toString()
                },
                'PkItj7221YGJbcsaYIL90!lmfds?mPdlf21l32nfe9',
                {expiresIn: '1h'}
            );
            res.status(200).json({token: token, userId: userAskingLogin._id.toString()})
        })
        .catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err)
        });
};

