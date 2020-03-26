const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();

const UserModel = require('./../models/user.model');
const bcrypt = require('bcryptjs');

const tokenLib = require('./../libs/tokenLib');


router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10)
    .then(hash => {
        const user = new UserModel({
            email,
            password: hash
        });

        return user.save();
    })
    .then(user => {
        delete user.password;
        logger.info(user);
        res.status(201).json({
            data: user,
            message: "User Created"
        });
    })
    .catch(error => {
        logger.error(error);
        res.status(500).json({
            data: error,
            message: "Server Error Occurred"
        });
    });
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let userData = null;

    UserModel.findOne({ email })
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'User doesn\'t exists'
            });
        }
        userData = user;
        return bcrypt.compare(password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: 'Password doesn\'t matched'
            });
        }
        return tokenLib.generateToken(userData);

    })
    .then(token => {
        return res.status(200).json({
            data: token,
            message: 'Logged in successfully'
        })
    })
    .catch(error => {
        logger.error(error);
        return res.status(500).json({
            message: 'Error occurred'
        });
    })
});

module.exports = router;