import express from "express";
import adminController from "../../../adapters/adminController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { postDbRepository } from "../../../application/repositories/postDbRepository";
import { postRepositoryMongoDB } from "../../database/mongoDB/repositories/postRepositoryMongoDB";
import { commentDbRepository } from "../../../application/repositories/commentDbRepository";
import { commentRepositoryMongoDB } from "../../database/mongoDB/repositories/commentRepositoryMongoDB";

//middlewares
import requireAdmin from "../middlewares/requireAdmin";
import requestLimiter from "../middlewares/requestLimiter";

const adminRouter = () => {
    const router = express();

    const controller = adminController(
        authService,
        authServiceInterface,
        userRepositoryMongoDB,
        userDbRepository,
        postRepositoryMongoDB,
        postDbRepository,
        commentRepositoryMongoDB,
        commentDbRepository,
    )

    //routes
    router.post('/login', requestLimiter, controller.adminLogin);
    router.get('/refresh', controller.refreshAdminAccessToken);
    router.get('/getUsers', requireAdmin, controller.getUsers);
    router.get('/getAllUsersCount', requireAdmin, controller.getAllUsersCount);
    router.get('/getBlockedUsersCount', requireAdmin, controller.getBlockedUsersCount);
    router.post('/blockUser/:userId', requireAdmin, controller.blockUser);
    router.post('/unblockUser/:userId', requireAdmin, controller.unblockUser);
    router.get('/getAllPosts', requireAdmin, controller.getAllPosts);
    router.get('/getAllPostsCount', requireAdmin, controller.getAllPostsCount);
    router.get('/getAllReportedCommentsCount', requireAdmin, controller.getAllReportedCommentsCount);
    router.get('/getAllReportedRepliesCount', requireAdmin, controller.getAllReportedRepliesCount);
    router.get('/getReportInfo/:postId', requireAdmin, controller.getReportInfo);
    router.post('/blockPost/:postId', requireAdmin, controller.blockPost);
    router.post('/unblockPost/:postId', requireAdmin, controller.unblockPost);
    router.get('/getAllReportedComments', requireAdmin, controller.getAllReportedComments);
    router.get('/getCommentReportedUsers/:commentId', requireAdmin, controller.getCommentReportedUsers);
    router.post('/blockComment/:commentId', requireAdmin, controller.blockComment);
    router.post('/unblockComment/:commentId', requireAdmin, controller.unblockComment);
    router.get('/getAllReportedReplies', requireAdmin, controller.getAllReportedReplies);
    router.get('/getReplyReportedUsers', requireAdmin, controller.getReplyReportedUsers);
    router.post('/blockReply', requireAdmin, controller.blockReply);
    router.post('/unblockReply', requireAdmin, controller.unblockReply);
    router.get('/getMonthlyUserSignups', requireAdmin, controller.getMonthlyUserSignups);
    router.get('/getMonthlyPosts', requireAdmin, controller.getMonthlyPosts);
    router.delete('/logout', requireAdmin, controller.logoutAdmin)
    router.get('/getUsersCountOnSearch', requireAdmin, controller.getUsersCountOnSearch);
    router.get('/getUsersOnSearch', requireAdmin, controller.getUsersOnSearch);
    router.get('/getPostsCountOnSearch', requireAdmin, controller.getPostsCountOnSearch);
    router.get('/getPostsOnSearch', requireAdmin, controller.getPostsOnSearch);
    router.get('/getReportedCommentsCountOnSearch', requireAdmin, controller.getReportedCommentsCountOnSearch);
    router.get('/getReportedCommentsOnSearch', requireAdmin, controller.getReportedCommentsOnSearch);
    router.get('/getReportedRepliesCountOnSearch', requireAdmin, controller.getReportedRepliesCountOnSearch);
    router.get('/getReportedRepliesOnSearch', requireAdmin, controller.getReportedRepliesOnSearch);

    return router;
}

export default adminRouter;