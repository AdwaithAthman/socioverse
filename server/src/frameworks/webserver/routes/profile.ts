import express from "express";
import { cloudinaryService } from "../../services/cloudinaryService";
import { cloudinaryServiceInterface } from "../../../application/services/cloudinaryServiceInterface";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import checkUsernameAvailabilityMiddleware from "../middlewares/redisCheckUsernameAvailability";
import profileController from "../../../adapters/profileController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";

//Middleware
import authMiddleware from "../middlewares/authMiddleware";
import uploadToMulter from "../middlewares/multer";

const profileRouter = () => {
    const router = express();

    const controller = profileController(
        cloudinaryService,
        cloudinaryServiceInterface,
        userRepositoryMongoDB,
        userDbRepository,
        authService,
        authServiceInterface
    )

    //routes
    router.post('/uploadCoverPhoto', uploadToMulter.single('file'), authMiddleware, controller.uploadCoverPhoto);
    router.post('/uploadProfilePhoto', uploadToMulter.single('file'), authMiddleware, controller.uploadProfilePhoto);
    router.get('/getUserInfo', authMiddleware, controller.getUserInfo);
    router.get('/getOtherUserInfo/:id', authMiddleware, controller.getOtherUserInfo);
    router.delete('/deleteCoverPhoto', authMiddleware, controller.deleteCoverPhoto);
    router.delete('/deleteProfilePhoto', authMiddleware, controller.deleteProfilePhoto);
    router.patch('/changePassword', authMiddleware, controller.changePassword);
    router.patch('/editProfile', authMiddleware, controller.editProfile);
    router.get('/searchUsers', authMiddleware, controller.searchUsers);
    router.patch('/addUsername', authMiddleware, controller.addUsername);

    return router;
}

export default profileRouter;