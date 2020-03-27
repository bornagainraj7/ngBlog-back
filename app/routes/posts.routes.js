const express = require('express');
const router = express.Router();
const PostController = require('./../controllers/post.controller');
const multerMiddleware = require('./../middlewares/multer.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');




router.post('', authMiddleware.isAuthorised, multerMiddleware, PostController.createPost);


router.put('/:id', authMiddleware.isAuthorised, multerMiddleware, PostController.updatePost);


router.get('', PostController.getAllPosts);


router.get('/:id', PostController.getSinglePost);


router.delete('/:id', authMiddleware.isAuthorised, PostController.deletePost);


module.exports = router;