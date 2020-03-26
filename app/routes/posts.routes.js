const express = require('express');
const router = express.Router();
const multer = require('multer');
const logger = require('tracer').colorConsole();

const PostModel = require('./../models/post.model');

const authMiddleware = require('./../middlewares/auth.middleware');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid file mime type');
        if (isValid) {
            error = null;
        }
        callback(error, './images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        const filename = `${name}-${Date.now()}.${ext}`;
        callback(null, filename);
    }
})


router.post('', authMiddleware.isAuthorised, multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: `${url}/images/${req.file.filename}`,
    });
    // logger.info(post);
    post.save()
    .then(result => {
        logger.info(result);
        res.status(201).json({
            message: 'Post created',
            data: {
                id: result._id,
                title: result.title,
                content: result.content,
                imagePath: result.imagePath,
            }
        });
    })
    .catch(error => {
        logger.error(error);
    });
    
});


router.get('', (req, res, next) => {
    const pageSize = parseInt(req.query.pagesize);
    const currentPage = parseInt(req.query.page);
    const query = PostModel.find().lean();
    let postData;
    if (pageSize && currentPage) {
        query
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    query
    .then(data => {
        postData = data;
        return PostModel.countDocuments();
        
    })
    .then(count => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            data: postData,
            count
        });
    })
    .catch(err=> {
        logger.error(err); 
    });
});

router.get('/:id', (req, res, next) => {
    logger.info();
    const postId = req.params.id;
    PostModel.findById(postId)
    .then(post => {
        if (post) {

            res.status(200).json({
                data: post,
                message: 'Post retrieved successfully'
            });
        } else {
            res.status(404).json({
                data: null,
                message: 'Post not found'
            });
        }
    })
});

router.put('/:id', authMiddleware.isAuthorised, multer({ storage: storage }).single('image'), (req, res, next) => {
    const postId = req.params.id;
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = `${req.protocol}://${req.get('host')}`;
        imagePath = `${url}/images/${req.file.filename}`;
    }

    const post = new PostModel({
        _id: postId,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    PostModel.updateOne({_id: postId}, post)
    .then(result => {
        logger.info(result);
        res.status(201).json({
            message: 'Post updated successfully',
            data: {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
            }
        });
    })
    .catch(error => logger.error(error));
});



router.delete('/:id', authMiddleware.isAuthorised, (req, res, next) => {
    const postId = req.params.id;
    PostModel.deleteOne({_id: postId})
    .then(result => {
        logger.info(result);
        res.status(201).json({
            message: 'Post deleted successfully'
        });
    })
    .catch(err => {
        logger.error(err);
    });
});


module.exports = router;