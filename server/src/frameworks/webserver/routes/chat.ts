import { Router } from 'express';
import chatController from '../../../adapters/chatController';
import { chatRepositoryMongoDB } from '../../database/mongoDB/repositories/chatRepositoryMongoDB';
import { chatDbRepository } from '../../../application/repositories/chatDbRepository';
import { cloudinaryService } from "../../services/cloudinaryService";
import { cloudinaryServiceInterface } from "../../../application/services/cloudinaryServiceInterface";

//importing middlewares
import authMiddleware from '../middlewares/authMiddleware';
import uploadToMulter from '../middlewares/multer';

const chatRouter = () => {
    const router = Router();

    const controller = chatController(
        chatRepositoryMongoDB,
        chatDbRepository,
        cloudinaryService,
        cloudinaryServiceInterface
    );

    //routes
    router.post('/createOrAccessChat', authMiddleware, controller.createOrAccessChat);
    router.get('/fetchChats', authMiddleware, controller.fetchChats)
    router.post('/createGroup', authMiddleware, controller.createGroupChat);
    router.put('/renameGroup', authMiddleware, controller.renameGroupChat);
    router.put('/addToGroup', authMiddleware, controller.addToGroup); 
    router.delete('/removeFromGroup', authMiddleware, controller.removeFromGroup);
    router.patch('/updateGroup/:groupId', uploadToMulter.none(), authMiddleware, controller.updateGroup);
    router.delete('/groupRemove/:groupId', authMiddleware, controller.groupRemove)
    router.patch('/addGroupDp/:groupId', uploadToMulter.single('groupDp'), authMiddleware, controller.addGroupDp);

    return router;
}

export default chatRouter;