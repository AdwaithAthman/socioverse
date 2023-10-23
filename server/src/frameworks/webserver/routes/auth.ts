import express from "express";
import authController from "../../../adapters/authController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { userRepositoryMongoDB } from "../../database/mongoDB/repositories/userRepositoryMongoDB";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { otpRepositoryMongoDB } from "../../database/mongoDB/repositories/otpRepositoryMongoDB";
import { otpDbRepository } from "../../../application/repositories/otpDbRepository";
import { mailSenderService } from "../../services/mailSenderService";
import { mailSenderServiceInterface } from "../../../application/services/mailSenderServiceInterface";
import checkUsernameAvailabilityMiddleware from "../middlewares/redisCheckUsernameAvailability";

//middleware
import requestLimiter from "../middlewares/requestLimiter";
import authMiddleware from "../middlewares/authMiddleware";

const authRouter = () => {
   const router = express();

   const controller = authController(
      authService,
      authServiceInterface,
      userRepositoryMongoDB,
      userDbRepository,
      otpRepositoryMongoDB,
      otpDbRepository,
      mailSenderService,
      mailSenderServiceInterface,
   )

   //routes
   router.post('/signup', controller.registerUser);
   router.post('/login', requestLimiter, controller.loginUser);
   router.post('/google_auth', controller.loginUsingGoogle);
   router.get('/refresh', controller.refreshAccessToken);
   router.delete('/logout', authMiddleware, controller.logoutUser)
   router.post('/send_otp', controller.sendOtpForEmailVerification);
   router.post('/verify_otp', controller.verifyOtpForEmailVerification);
   router.post('/resetPassword', controller.resetPassword)
   // router.get('/verify_token/:token', controller.verifyTokenForAuth);
   router.get('/checkUsernameAvailability/:username', checkUsernameAvailabilityMiddleware, controller.checkUsernameAvailability)


   return router
}

export default authRouter;