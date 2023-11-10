import { Router } from "express";
import messageController from "../../../adapters/messageController";
import { chatRepositoryMongoDB } from "../../database/mongoDB/repositories/chatRepositoryMongoDB";
import { chatDbRepository } from "../../../application/repositories/chatDbRepository";
import { messageRepositoryMongoDB } from "../../database/mongoDB/repositories/messageRepositoryMongoDB";
import { messageDbRepository } from "../../../application/repositories/messageDbRepository";

//importing middlewares
import authMiddleware from "../middlewares/authMiddleware";

const messageRouter = () => {
    const router = Router();

    const controller = messageController(
        chatRepositoryMongoDB, 
        chatDbRepository,
        messageRepositoryMongoDB,
        messageDbRepository,
        );

    //routes
    router.post("/", authMiddleware, controller.sendMessage);

    return router;
};

export default messageRouter;
