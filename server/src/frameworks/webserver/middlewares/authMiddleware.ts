import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import configKeys from "../../../config";
import { HttpStatus } from "../../../types/httpStatus";
import User from "../../database/mongoDB/models/userModel";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.header('authorization')?.split(' ')[1];
        token = token?.replaceAll('"', '');
        if (token) {
            const decryptedToken = jwt.verify(token, configKeys.JWT_ACCESS_SECRET) as JwtPayload;
            req.body.userId = decryptedToken.userId;
            const user = await User.findOne({ _id: decryptedToken.userId, isBlock: true });
            if (user && req.path !== '/logout') {
                res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "User is blocked" });
            }
            else {
                next();
            }
        }
        else {
            res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Token not found" });
        }
    }
    catch (error: any) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: error.message });
    }
}

export default authMiddleware;