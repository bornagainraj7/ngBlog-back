const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('tracer').colorConsole();
const MONGODB_URI = "mongodb://127.0.0.1:27017/NgBlog";
const path = require('path');

const postRoutes = require('./app/routes/posts.routes');
const userRoutes = require('./app/routes/user.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/images', express.static(path.join('/images')));
app.use('/images', express.static(__dirname + '/images'));


// Set Headers for CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authToken, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});


// Route logger
app.use((req, res, next) => {
    console.log(req.method + " " + req.originalUrl);
    next();
});

const normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port
    }

    return false;
}



const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
    switch (error.code) {
        case 'EACCESS':
            logger.error(bind + ' requires elevated priveleges');
            process.exit(1);
            break;
        case 'EASSRINUSE' :
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default :
            throw error;
    }
}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
    logger.info('Listening on ' + bind);
    mongoose.connect( MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            logger.info("Database connected successfully");
        })
        .catch(err => logger.error(err));
}

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);


const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);


// global 404
// app.use(errorController.get404);


// Listening
// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
//     mongoose.connect(
//         MONGODB_URI, {
//         useCreateIndex: true,
//         useNewUrlParser: true
//     })
//     .then(() => {
//         console.log("Database connected successfully");
//     })
//     .catch(err => console.log(err));
// });
