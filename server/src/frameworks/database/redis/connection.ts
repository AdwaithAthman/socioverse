import { createClient } from "redis";

const connection = () => {
    const createRedisClient = () => {
        const redisClient = createClient();
        redisClient.on('error', err => console.log("redisClient Error",err));
        redisClient.connect().then(() => {
            console.log("Redis connected Successfully")
        }).catch((err) => {
            console.log(err)
        })

        return redisClient
    };

    return {
        createRedisClient
    };
};

export default connection;