const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('tracer').colorConsole();
const UserModel = require('./../models/user.model');
const tokenLib = require('./../libs/tokenLib');

exports.isAuthorised = (req, res, next) => {
    const token = req.query.authToken || req.params.authToken || req.body.authToken || req.header('authToken');
    if (token) {
        tokenLib.verifyToken(token)
        .then(response => {
            req.user = {
                userId: decoded.userId,
                email: decoded.email
            };
            next();
        })
        .catch(error => {
            logger.error(error);
            res.status(401).json({
                message: `Error while verifying Authtoken`
            });
        });
    } else {
        res.status(401).json({
            message: `No Auth token`
        })   
    }
}