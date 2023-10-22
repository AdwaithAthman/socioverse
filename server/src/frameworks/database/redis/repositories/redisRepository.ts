import { RedisClient } from "../../../../app";
import { promisify } from "util";

const redisRepository = (redisClient: RedisClient) => {
    //Promisify Redis methods to use async/await
    const getAsync = promisify(redisClient.get).bind(redisClient);
    const setAsync = promisify(redisClient.set).bind(redisClient);
    const sAddAsync = promisify(redisClient.sAdd).bind(redisClient);
    const sIsMemberAsync = promisify(redisClient.sIsMember).bind(redisClient);

    return {
        getAsync,
        setAsync,
        sAddAsync,
        sIsMemberAsync
    }
};

export default redisRepository;