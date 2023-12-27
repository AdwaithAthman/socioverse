import express from "express";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import userController from "../../../adapters/userController";
import { redisRepository } from "../../database/redis/redisRepository";
import { redisDbRepository } from "../../../application/repositories/redisDbRepository";

//Middleware
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = () => {
    const router = express();
    
    const controller = userController(
        userRepositoryMongoDB,
        userDbRepository,
        redisRepository,
        redisDbRepository
    )

    //routes
    router.post('/followUser', authMiddleware, controller.followUser);
    router.post('/unfollowUser', authMiddleware, controller.unfollowUser)
    router.get('/getRestOfUsers', authMiddleware, controller.getRestOfUsers);
    router.get('/getRestOfAllUsers', authMiddleware, controller.getRestOfAllUsers);
    router.get('/getFollowers/:userId', authMiddleware, controller.getFollowers);
    router.get('/getFollowing/:userId', authMiddleware, controller.getFollowing);
    router.get('/getSuggestions', authMiddleware, controller.getSuggestions);
    router.post('/addNotification', authMiddleware, controller.addNotification);
    router.delete('/deleteNotification/:messageId', authMiddleware, controller.deleteNotification);

    return router;
}

export default userRouter;