import { createClient } from "redis";
import configKeys from "../../../config";

const connection = () => {
    const createRedisClient = () => {
        const redisClient = createClient(configKeys.REDIS_URL || {url: 'redis://localhost:6379'});
        redisClient.on('error', err => console.log("redisClient Error", err));
        redisClient.connect().then(() => {
            console.log("Redis connected Successfully");
        }).catch((err) => {
            console.log(err);
        });

        return redisClient;
    };

    return {
        createRedisClient
    };
};

export default connection;