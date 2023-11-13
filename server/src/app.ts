import express, { Request, Application, NextFunction, Response } from 'express';
import http from 'http';
import connectDB from './frameworks/database/mongoDB/connection';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandlingMiddleware';
import AppError from './utils/appError';
import serverConfig from './frameworks/webserver/server';
import connection from './frameworks/database/redis/connection';
import { Server } from "socket.io";
import configKeys from './config';

const app: Application = express();
const server = http.createServer(app);

//connecting mongoDB
connectDB();

//connecting to redis
export const redisClient = connection().createRedisClient();

//socket.io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: configKeys.CLIENT_URL,
        methods: ["GET", "POST"],
    }
})

io.on('connection', (socket) => {
    console.log("connected to socket.io");
})

expressConfig(app);

// routes for each endpoint
routes(app);

//middleware for error handling
app.use(errorHandlingMiddleware)

//catch 404 and forward to error handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Not Found', 404));
});

serverConfig(server).startServer();

export type RedisClient = typeof redisClient;