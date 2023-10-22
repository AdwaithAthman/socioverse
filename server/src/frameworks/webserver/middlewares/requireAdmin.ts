import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import configKeys from '../../../config';

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.header('authorization')?.split(' ')[1];
    accessToken = accessToken?.replaceAll('"', '');
    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not found' });
    }
    try {
        const decryptedToken = jwt.verify(accessToken, configKeys.JWT_ACCESS_SECRET) as JwtPayload;
        if (decryptedToken.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.body.userId = decryptedToken.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid access token' });
    }
}

export default requireAdmin;