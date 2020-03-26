const logger = require('pino')();


let recordError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = new Date();

    let errorResponse = {
        timeStamp: currentTime,
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    };

    logger.error(errorResponse);
    return errorResponse;
}

let recordInfo = (message, origin, level) => {
    let currentTime = new Date();

    let infoMessage = {
        timeStamp: currentTime,
        message: message,
        origin: origin,
        level: level
    };

    logger.info(infoMessage);
    return infoMessage;
}

module.exports = {
    error: recordError,
    info: recordInfo
}