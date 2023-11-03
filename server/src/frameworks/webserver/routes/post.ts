import express from "express";
import { cloudinaryService } from "../../services/cloudinaryService";
import { cloudinaryServiceInterface } from "../../../application/services/cloudinaryServiceInterface";
import postController from "../../../adapters/postController";
import { postDbRepository } from "../../../application/repositories/postDbRepository";
import { postRepositoryMongoDB } from "../../database/mongoDB/repositories/postRepositoryMongoDB";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { commentDbRepository } from "../../../application/repositories/commentDbRepository";
import { commentRepositoryMongoDB } from "../../database/mongoDB/repositories/commentRepositoryMongoDB";

//middleware
import authMiddleware from "../middlewares/authMiddleware";
import uploadToMulter from "../middlewares/multer";

const postRouter = () => {
    const router = express.Router();

    const controller = postController(
        cloudinaryService,
        cloudinaryServiceInterface,
        postRepositoryMongoDB,
        postDbRepository,
        userRepositoryMongoDB,
        userDbRepository,
        commentRepositoryMongoDB,
        commentDbRepository,
    )
    
    //routes 
    router.post('/createPost', uploadToMulter.array('files', 5), authMiddleware, controller.createPost);
    router.get('/getPosts', authMiddleware, controller.getPosts);
    router.delete('/deletePost/:postId', authMiddleware, controller.deletePost)
    router.get('/getPostDetails/:postId', authMiddleware, controller.getPostDetails)
    router.post('/addComment', authMiddleware, controller.addComment)
    router.post('/addReply', authMiddleware, controller.addReply)
    router.get('/getComments/:postId', authMiddleware, controller.getComments)
    router.get('/getReplies/:commentId', authMiddleware, controller.getReplies)
    router.post('/likePost/:postId', authMiddleware, controller.likePost)
    router.post('/savePost/:postId', authMiddleware, controller.savePost)
    router.post('/reportPost', authMiddleware, controller.reportPost)
    router.patch('/editPost/:postId',uploadToMulter.none() ,authMiddleware, controller.editPost)
    router.put('/editComment/:commentId', authMiddleware, controller.editComment)
    router.delete('/deleteComment/:commentId', authMiddleware, controller.deleteComment)
    router.delete('/deleteReply', authMiddleware, controller.deleteReply)
    router.post('/reportComment/:commentId', authMiddleware, controller.reportComment)
    router.post('/reportReply', authMiddleware, controller.reportReply)
    router.get('/searchPosts', authMiddleware, controller.searchPosts)
    router.post('/likeComment', authMiddleware, controller.likeComment)
    router.post('/likeReply', authMiddleware, controller.likeReply)
    router.get('/getUserPosts', authMiddleware, controller.getUserPosts)
    router.get('/getOtherUserPosts/:userId', authMiddleware, controller.getOtherUserPosts)
    router.get('/getUserLikedPosts', authMiddleware, controller.getUserLikedPosts)
    router.get('/getUserSavedPosts', authMiddleware, controller.getUserSavedPosts)

    return router;
}

export default postRouter;