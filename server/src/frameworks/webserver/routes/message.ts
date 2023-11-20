import { Router } from "express";
import messageController from "../../../adapters/messageController";
import { chatRepositoryMongoDB } from "../../database/mongoDB/repositories/chatRepositoryMongoDB";
import { chatDbRepository } from "../../../application/repositories/chatDbRepository";
import { messageRepositoryMongoDB } from "../../database/mongoDB/repositories/messageRepositoryMongoDB";
import { messageDbRepository } from "../../../application/repositories/messageDbRepository";
import { cloudinaryService } from "../../services/cloudinaryService";
import { cloudinaryServiceInterface } from "../../../application/services/cloudinaryServiceInterface";

//importing middlewares
import authMiddleware from "../middlewares/authMiddleware";
import uploadToMulter from "../middlewares/multer";

const messageRouter = () => {
    const router = Router();

    const controller = messageController(
        chatRepositoryMongoDB, 
        chatDbRepository,
        messageRepositoryMongoDB,
        messageDbRepository,
        cloudinaryService,
        cloudinaryServiceInterface,
        );

    //routes
    router.post("/sendMessage", authMiddleware, controller.sendMessage);
    router.post("/sendMessageWithImg", uploadToMulter.single('image'), authMiddleware, controller.sendMessageWithImg);
    router.get('/getAllMessagesFromChat/:chatId', authMiddleware, controller.getAllMessagesFromChat)
    router.get('/fetchNotifications', authMiddleware, controller.fetchNotifications);

    return router;
};

export default messageRouter;
