import { RedisRepository } from "../../frameworks/database/redis/redisRepository";

export const redisDbRepository = (repository: ReturnType<RedisRepository>) => {

    const stringCache = async (key: string, cb: Function) => await repository.stringCache(key, cb);
    
    const setCache = async (key: string, cb: Function) => await repository.setCache(key, cb);

    const hashCache = async (key: string, cb: Function) => await repository.hashCache(key, cb);

    const deleteCache = async (key: string) => await repository.deleteCache(key);

    return {
        stringCache,
        setCache,
        hashCache,
        deleteCache
    }

}

export type RedisDbInterface = typeof redisDbRepository;