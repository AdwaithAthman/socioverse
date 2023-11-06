import { Router } from 'express';
import chatController from '../../../adapters/chatController';
import { chatRepositoryMongoDB } from '../../database/mongoDB/repositories/chatRepositoryMongoDB';
import { chatDbRepository } from '../../../application/repositories/chatDbRepository';

//importing middlewares
import authMiddleware from '../middlewares/authMiddleware';

const chatRouter = () => {
    const router = Router();

    const controller = chatController(
        chatRepositoryMongoDB,
        chatDbRepository,
    );

    //routes
    router.post('/createOrAccessChat', authMiddleware, controller.createOrAccessChat);
    router.get('/fetchChats', authMiddleware, controller.fetchChats)
    router.post('/createGroup', authMiddleware, controller.createGroupChat);
    router.put('/renameGroup', authMiddleware, controller.renameGroupChat);
    router.put('/addToGroup', authMiddleware, controller.addToGroup); 
    router.delete('/removeFromGroup', authMiddleware, controller.removeFromGroup);

    return router;
}

export default chatRouter;