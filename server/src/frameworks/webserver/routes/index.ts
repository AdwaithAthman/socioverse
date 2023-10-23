import { Application } from "express";
import authRouter from "./auth";
import profileRouter from "./profile";
import userRouter from "./user";
import postRouter from "./post";
import adminRouter from "./admin";

const routes = (app: Application) => {
    
    app.use('/api/auth', authRouter());
    app.use('/api/profile', profileRouter());
    app.use('/api/user', userRouter());
    app.use('/api/post', postRouter());
    app.use('/api/admin', adminRouter());
}

export default routes;