import AppError from "../../../utils/appError";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import configKeys from "../../../config";
import { HttpStatus } from "../../../types/httpStatus";

export const handleAdminLogin = async (
    email: string,
    password: string,
    authService: ReturnType<AuthServiceInterface>
) => {
    try {
        const adminCredentials = {
            email: configKeys.ADMIN_EMAIL,
            password: configKeys.ADMIN_PASSWORD
        }
        if (email === adminCredentials.email && password === adminCredentials.password) {
            console.log("admin login is working properly")
            const payload = {
                userId: "admin",
                role: "admin"
            }
            const refreshToken = authService.generateRefreshToken(payload);
            const accessToken = authService.generateAccessToken(payload);
            return { accessToken, refreshToken };
        } else {
            throw new AppError("Invalid email or password!", HttpStatus.UNAUTHORIZED);
        }
    }
    catch (err) {
        console.log(err)
        throw new AppError("Invalid email or password!", HttpStatus.UNAUTHORIZED);
    }
}

export const handleRefreshAdminAccessToken = async (
    cookies: { adminRefreshToken: string },
    authService: ReturnType<AuthServiceInterface>
) => {
    try {
        const { adminRefreshToken } = cookies;
        if (!adminRefreshToken) {
            throw new AppError("No refresh token found!", HttpStatus.UNAUTHORIZED);
        }
        const payload = authService.verifyRefreshToken(adminRefreshToken);
        const accessToken = authService.generateAccessToken(payload);
        return accessToken;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Invalid refresh token!", HttpStatus.UNAUTHORIZED);
    }
}