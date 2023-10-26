import express from "express";
import adminController from "../../../adapters/adminController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { postDbRepository } from "../../../application/repositories/postDbRepository";
import { postRepositoryMongoDB } from "../../database/mongoDB/repositories/postRepositoryMongoDB";

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
    )

    //routes
    router.post('/login', requestLimiter, controller.adminLogin);
    router.get('/refresh', controller.refreshAdminAccessToken);
    router.get('/getUsers', requireAdmin, controller.getUsers);
    router.post('/blockUser/:userId', requireAdmin, controller.blockUser);
    router.post('/unblockUser/:userId', requireAdmin, controller.unblockUser);
    router.get('/getAllPosts', requireAdmin, controller.getAllPosts)
    router.get('/getReportInfo/:postId', requireAdmin, controller.getReportInfo)
    // router.post('/blockPost/:postId', requireAdmin, controller.blockPost);
    // router.post('/unblockPost/:postId', requireAdmin, controller.unblockPost);

    return router;
}

export default adminRouter;