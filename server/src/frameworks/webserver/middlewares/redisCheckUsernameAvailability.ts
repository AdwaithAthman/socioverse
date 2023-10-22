import { Request, Response, NextFunction } from "express";
import redisRepository from "../../database/redis/repositories/redisRepository";
import { HttpStatus } from "../../../types/httpStatus";
import { redisClient } from "../../../app";


//redis caching middleware
const checkUsernameAvailabilityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    try {
        // Get the sIsMemberAsync method from the redisRepository
        const { sIsMemberAsync } = redisRepository(redisClient);

        // Check if the username exists in the allUsernames set in the cache
        const isUsernameAvailableInCache = !(await sIsMemberAsync("allUsernames", username));

        // If the username is in the cache, return the cached result
        if (!isUsernameAvailableInCache) {
            return res.json({
                status: "fail",
                available: false
            })
        }

        // If the username is not in the cache, proceed to the next middleware to check in the database
        next();
    }
    catch (err) {
        console.error("Error checking username availability in cache:", err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" })
    }
};

export default checkUsernameAvailabilityMiddleware;