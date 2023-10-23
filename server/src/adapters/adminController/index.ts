import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterface';
import { handleAdminLogin } from '../../application/use-cases/admin/admin';

const adminController = (
    authServiceImpl: AuthService,
    authServiceInterface: AuthServiceInterface,
) => {

    const authService = authServiceInterface(authServiceImpl());

    const adminLogin = asyncHandler(async (req: Request, res: Response) => {
        const { email, password }: { email: string; password: string } = req.body;
        const {accessToken, refreshToken} = await handleAdminLogin(email, password, authService);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // use in HTTPS only
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            status: "success",
            message: "admin logged in",
            accessToken
        })
    });

    return {
        adminLogin,
    }
}

export default adminController;