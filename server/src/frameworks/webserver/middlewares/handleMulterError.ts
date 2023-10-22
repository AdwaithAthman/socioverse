import { Request, Response, NextFunction } from 'express';
import Multer, { MulterError } from 'multer';

const handleMulterError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof MulterError) {
        res.status(400).json({message: err.message})
    } else {
        next(err);
    }
}

export default handleMulterError;