import { RedisClient } from "../../../../app";

const DEFAULT_EXPIRATION = 1800;

const redisRepository = (redisClient: RedisClient) => {
  const stringCache = async (key: string, cb: Function) => {
    const cachedData = await redisClient.get(key);
    if (cachedData != null) return JSON.parse(cachedData);
    const freshData = await cb();
    redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
    return freshData;
  };

  const setCache = async (key: string, cb: Function) => {
    const cachedData = await redisClient.sMembers(key);
    if (cachedData.length > 0)
      return cachedData.map((data) => JSON.parse(data));
    const freshData = await cb();
    const serializedData = freshData.map((data: any) => JSON.stringify(data));
    redisClient.sAdd(key, serializedData);
    redisClient.expire(key, DEFAULT_EXPIRATION);
    return freshData;
  };

  const hashCache = async (key: string, cb: Function) => {
    const cachedData = await redisClient.hGetAll(key);
    if (Object.keys(cachedData).length > 0) {
      Object.keys(cachedData).forEach((field) => {
        cachedData[field] = JSON.parse(cachedData[field]);
      });
      return cachedData;
    }
    const freshData = await cb();
    for (const field of Object.keys(freshData)) {
      redisClient.hSet(key, field, JSON.stringify(freshData[field]));
    }
    redisClient.expire(key, DEFAULT_EXPIRATION);
    return freshData;
  };

  const deleteCache = async (key: string) => {
    await redisClient.del(key);
  };

  return {
    stringCache,
    setCache,
    hashCache,
    deleteCache,
  };
};

export default redisRepository;
