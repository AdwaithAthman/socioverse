import express from "express";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import userController from "../../../adapters/userController";

//Middleware
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = () => {
    const router = express();
    
    const controller = userController(
        userRepositoryMongoDB,
        userDbRepository,
    )

    //routes
    router.post('/followUser', authMiddleware, controller.followUser);
    router.post('/unfollowUser', authMiddleware, controller.unfollowUser)
    router.get('/getRestOfUsers', authMiddleware, controller.getRestOfUsers);
    router.get('/getRestOfAllUsers', authMiddleware, controller.getRestOfAllUsers);
    router.get('/getFollowers', authMiddleware, controller.getFollowers);
    router.get('/getFollowing', authMiddleware, controller.getFollowing);
    router.post('/addNotification', authMiddleware, controller.addNotification);
    router.delete('/deleteNotification/:messageId', authMiddleware, controller.deleteNotification);

    return router;
}

export default userRouter;