const express = require('express');
const router = express.Router();
const multer = require('multer');
const logger = require('tracer').colorConsole();
const PostModel = require('./../models/post.model');



exports.createPost = (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: `${url}/images/${req.file.filename}`,
        creator: req.user.userId
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
                creator: req.user.userId
            }
        });
    })
    .catch(error => {
        logger.error(error);
        res.status(500).json({
            message: 'Unable to create post',
            data: null
        });
    });
    
}


exports.updatePost = (req, res, next) => {
    const postId = req.params.id;
    let imagePath = req.body.imagePath;
    const query = { _id: postId, creator: req.user.userId }

    if (req.file) {
        const url = `${req.protocol}://${req.get('host')}`;
        imagePath = `${url}/images/${req.file.filename}`;
    }

    const post = new PostModel({
        _id: postId,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.user.userId,
    });
    PostModel.updateOne(query, post)
    .then(result => {
        // logger.info(result);
        if ( result.n > 0 ) {
            return res.status(201).json({
                message: 'Post updated successfully',
                data: {
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    imagePath: post.imagePath,
                }
            });
        }
        res.status(401).json({
            message: 'Not Authorised',
            data: null
        });
        
    })
    .catch(error => {
        logger.error(error);
        res.status(500).json({
            message: 'Unable to update post',
            data: null
        });
    });
}


exports.getAllPosts = (req, res, next) => {
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
        res.status(500).json({
            message: 'Unable to get posts',
            data: null
        });
    });
}


exports.getSinglePost = (req, res, next) => {
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
    .catch(err=> {
        logger.error(err);
        res.status(500).json({
            message: 'Unable to get post',
            data: null
        });
    });
}



exports.deletePost = (req, res, next) => {
    const postId = req.params.id;
    const query = { _id: postId, creator: req.user.userId };

    PostModel.deleteOne(query)
    .then(result => {
        logger.info(result);
        if (result.n > 0) {
            return res.status(201).json({
                message: 'Post deleted successfully'
            });
        }
        res.status(401).json({
            message: 'Not Authorized'
        });
    })
    .catch(err => {
        logger.error(err);
        res.status(500).json({
            message: 'Unable to delete post',
            data: null
        });
    });
}
