const jwt = require('jsonwebtoken');
const secretKey = '8)m3Ve12y1r4nd0mP455w012d'; //someveryrandomPassword
const logger = require('tracer').colorConsole();


exports.generateToken = (data) => {
    return new Promise((resolve, reject) => {
        try{

            let claims = {
                jwtId: Date.now(),
                issueDate: new Date(),
                userId: data._id,
                email: data.email,
            };
            let expiry = {
                expiresIn: '24h'
            };
            const token = jwt.sign(claims, secretKey, expiry);
            resolve(token);
        } catch(err) {
            logger.error(err);
            reject(err);
        }

    });
}

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, secretKey);
            resolve(decoded);
        } catch(error) {
            logger.error(error);
            reject(error);
        }
    });
    
}
