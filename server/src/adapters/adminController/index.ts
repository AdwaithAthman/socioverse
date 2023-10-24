import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterface';

import { handleAdminLogin, handleRefreshAdminAccessToken } from '../../application/use-cases/admin/admin';

const adminController = (
    authServiceImpl: AuthService,
    authServiceInterface: AuthServiceInterface,
) => {

    const authService = authServiceInterface(authServiceImpl());

    const adminLogin = asyncHandler(async (req: Request, res: Response) => {
        const { email, password }: { email: string; password: string } = req.body;
        const {accessToken, refreshToken} = await handleAdminLogin(email, password, authService);
        res.cookie("adminRefreshToken", refreshToken, {
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

    const refreshAdminAccessToken = asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies;
        const accessToken = await handleRefreshAdminAccessToken(cookies, authService);
        res.json({ accessToken });
    });

    return {
        adminLogin,
        refreshAdminAccessToken,
    }
}

export default adminController;