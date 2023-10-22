import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import configKeys from "../../config";

export const authService = () => {

    const encryptPassword = async(password: string) => {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        return password;
    }

    const comparePassword = (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    }

    const generateAccessToken = (payload: {userId: string, role: string}) => {
        const accessToken = jwt.sign( payload, configKeys.JWT_ACCESS_SECRET, {
            expiresIn: '15m'
        })
        return accessToken;
    }
    
    const generateRefreshToken = (payload: { userId: string, role: string}) => {
        const refreshToken = jwt.sign( payload, configKeys.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        })
        return refreshToken;
    }

    const verifyAccessToken = (token: string) => {
        const payload : { userId: string, role: string }=  jwt.verify(token,configKeys.JWT_ACCESS_SECRET) as { userId: string, role: string };
        return payload;
    }

    const verifyRefreshToken = (token: string) => {
        const payload : { userId: string, role: string }=  jwt.verify(token,configKeys.JWT_REFRESH_SECRET) as { userId : string, role: string };
        return payload;
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

export type AuthService = typeof authService;
export type AuthServiceReturn = ReturnType<AuthService>;