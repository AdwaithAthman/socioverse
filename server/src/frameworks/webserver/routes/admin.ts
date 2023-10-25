import express from "express";
import adminController from "../../../adapters/adminController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";

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
    )

    //routes
    router.post('/login', requestLimiter, controller.adminLogin);
    router.get('/refresh', controller.refreshAdminAccessToken);
    router.get('/getUsers', requireAdmin, controller.getUsers);
    router.post('/blockUser/:userId', requireAdmin, controller.blockUser);
    router.post('/unblockUser/:userId', requireAdmin, controller.unblockUser);

    return router;
}

export default adminRouter;