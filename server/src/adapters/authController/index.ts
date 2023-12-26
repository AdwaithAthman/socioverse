import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";
import { OtpDbInterface } from "../../application/repositories/otpDbRepository";
import { OtpRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/otpRepositoryMongoDB";
import redisRepository from "../../frameworks/database/redis/redisRepository";
import { redisClient } from "../../app";
import { MailSenderService } from "../../frameworks/services/mailSenderService";
import { MailSenderServiceInterface } from "../../application/services/mailSenderServiceInterface";

//use-cases import
import {
  userRegister,
  userLogin,
  userLoginUsingGoogle,
  accessTokenRefresh,
  handleLogoutUser,
  handleSendOtp,
  handleOtpVerification,
  handleResetPassword,
} from "../../application/use-cases/auth/userAuth";

//importing Types
import { UserInterface } from "../../types/userInterface";
import { HttpStatus } from "../../types/httpStatus";

const authController = (
  authServiceImpl: AuthService,
  authServiceInterface: AuthServiceInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB,
  userDbRepositoryInterface: UserDbInterface,
  otpDbRepositoryImpl: OtpRepositoryMongoDB,
  otpDbRepositoryInterface: OtpDbInterface,
  mailSenderServiceImpl: MailSenderService,
  mailSenderServiceInterface: MailSenderServiceInterface
) => {
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const dbOtpRepository = otpDbRepositoryInterface(otpDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());
  const mailSenderService = mailSenderServiceInterface(mailSenderServiceImpl());

  const redisRepositoryImpl = redisRepository(redisClient);
  // const { setAsync, sIsMemberAsync, sAddAsync, getAsync } = redisRepositoryImpl;

  const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user: UserInterface = req.body;
    await userRegister(user, dbUserRepository, authService);
    res.json({
      status: "success",
      message: "user verified",
    });
  });

  const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const { userDetails, refreshToken, accessToken } = await userLogin(
      email,
      password,
      dbUserRepository,
      authService
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // use in HTTPS only
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      status: "success",
      message: "user verified",
      user: userDetails,
      accessToken,
    });
  });

  const loginUsingGoogle = asyncHandler(async (req: Request, res: Response) => {
    const user = req.body;
    const { userDetails, refreshToken, accessToken } =
      await userLoginUsingGoogle(user, dbUserRepository, authService);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // use in HTTPS only
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      status: "success",
      message: "user verified",
      user: userDetails,
      accessToken,
    });
  });

  const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
      const cookies = req.cookies;
      const accessToken = await accessTokenRefresh(
        cookies,
        dbUserRepository,
        authService
      );
      res.json({ accessToken });
    }
  );

  const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
    await handleLogoutUser(userId, dbUserRepository);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      //secure: true, // use in HTTPS only
      sameSite: "none",
    });
    res.json({ status: "success", message: "Cookie Cleared" });
  });

  const sendOtpForEmailVerification = asyncHandler( async(req: Request, res: Response) => {
    const { email, text }: {email: string, text: string} = req.body;
    await handleSendOtp (email, text, dbOtpRepository, mailSenderService)
    res.json({
      status: "success",
      message: "otp sent",
    })
  });

  const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    await handleResetPassword (email, password, dbUserRepository, authService);
    res.json({
      status: "success",
      message: "password reset",
    })
  });

  const verifyOtpForEmailVerification = asyncHandler( async(req: Request, res: Response) => {
    const { email, otp, text }: {email: string, otp: string, text: string} = req.body;
    const isOtpValid = await handleOtpVerification(email, otp, text, dbOtpRepository, dbUserRepository);
    if (isOtpValid) {
      res.json({
        status: "success",
        message: "otp verified",
      })
    }
    else {
      res.json({
        status: "fail",
        message: "otp not verified",
      })
    }
  })

  return {
    registerUser,
    loginUser,
    loginUsingGoogle,
    refreshAccessToken,
    logoutUser,
    sendOtpForEmailVerification,
    verifyOtpForEmailVerification,
    resetPassword,
  };
};

export default authController;
