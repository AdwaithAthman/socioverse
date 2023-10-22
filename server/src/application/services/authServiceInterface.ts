import { AuthServiceReturn } from "../../frameworks/services/authService";

export const authServiceInterface = (service: AuthServiceReturn) => {

    const encryptPassword = async (password: string) => {
        return await service.encryptPassword(password);
    }

    const comparePassword = (password: string, hashedPassword: string) => {
        return service.comparePassword(password,hashedPassword);
    }

    const generateAccessToken = (payload: { userId: string, role: string}) => {
        return service.generateAccessToken(payload);
    }

    const generateRefreshToken = (payload: { userId: string, role: string}) => {
        return service.generateRefreshToken(payload);
    }

    const verifyAccessToken = (token: string) => {
        return service.verifyAccessToken(token);
    }

    const verifyRefreshToken = (token: string) => {
        return service.verifyRefreshToken(token);
    }

    return {
        encryptPassword,
        comparePassword,
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken
    }
}

export type AuthServiceInterface = typeof authServiceInterface;