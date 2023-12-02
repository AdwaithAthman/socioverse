import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import { OtpDbInterface } from "../../repositories/otpDbRepository";
const otpGenerator = require("otp-generator");

//importing from types
import { HttpStatus } from "../../../types/httpStatus";
import { UserInterface } from "../../../types/userInterface";
import { MailSenderServiceInterface } from "../../services/mailSenderServiceInterface";

export const userRegister = async (
  user: UserInterface,
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const isExistingEmail = await dbUserRepository.getUserByEmail(user.email);
  if (isExistingEmail) {
    throw new AppError("Email already exists!", HttpStatus.UNAUTHORIZED);
  }

  const isExistingUsername = await dbUserRepository.getUserByUsername(
    user.username
  );
  if (isExistingUsername) {
    throw new AppError("Username already exists!", HttpStatus.UNAUTHORIZED);
  }

  const isExistingPhoneNumber = await dbUserRepository.getUserByPhoneNumber(
    user.phoneNumber
  );
  if (isExistingPhoneNumber) {
    throw new AppError("Phone number already exists!", HttpStatus.UNAUTHORIZED);
  }

  user.password = await authService.encryptPassword(user.password);
  await dbUserRepository.addUser(user);
};

export const userLogin = async (
  email: string,
  password: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const user = await dbUserRepository.getUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password!", HttpStatus.UNAUTHORIZED);
  }
  if (user.isBlock){
    throw new AppError("Your account has been blocked!", HttpStatus.UNAUTHORIZED);
  }
  const isPasswordCorrect = await authService.comparePassword(
    password,
    user?.password?.toString() || ""
  );
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password!", HttpStatus.UNAUTHORIZED);
  }
  const userDetails = {
    _id: user?._id.toString(),
    name: user?.name,
    username: user?.username,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    coverPhoto: user?.coverPhoto,
    dp: user?.dp,
    bio: user?.bio,
    gender: user?.gender,
    city: user?.city,
    followers: user?.followers,
    following: user?.following,
    isAccountVerified: user.isAccountVerified,
    isBlock: user.isBlock,
    notifications: user.notifications
  };
  const refreshToken = authService.generateRefreshToken({ userId: user._id.toString(), role: "client" });
  const accessToken = authService.generateAccessToken({ userId: user._id.toString(), role: "client" });
  await dbUserRepository.addRefreshTokenAndExpiry(email, refreshToken);
  return { userDetails, refreshToken, accessToken };
};

export const userLoginUsingGoogle = async (
  user: { name: string; email: string },
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  console.log("user google info= ", user)
  const isExistingEmail = await dbUserRepository.getUserByEmail(user.email);
  if (isExistingEmail) {
    if(isExistingEmail.isBlock){
      throw new AppError("Your account has been blocked!", HttpStatus.UNAUTHORIZED);
    }
    const refreshToken = authService.generateRefreshToken(
      { userId: isExistingEmail._id.toString(), role: "client" }
    );
    const accessToken = authService.generateAccessToken(
      { userId: isExistingEmail._id.toString(), role: "client" }
    );
    const userDetails = {
      _id: isExistingEmail._id.toString(),
      name: isExistingEmail.name,
      username: isExistingEmail.username,
      email: isExistingEmail.email,
      phoneNumber: isExistingEmail?.phoneNumber,
      coverPhoto: isExistingEmail?.coverPhoto,
      dp: isExistingEmail?.dp,
      bio: isExistingEmail?.bio,
      gender: isExistingEmail?.gender,
      city: isExistingEmail?.city,
      followers: isExistingEmail?.followers,
      following: isExistingEmail?.following,
      isAccountVerified: isExistingEmail.isAccountVerified,
      isGoogleSignIn: isExistingEmail.isGoogleSignIn,
      isBlock: isExistingEmail.isBlock,
      notifications: isExistingEmail.notifications
    };
    await dbUserRepository.addRefreshTokenAndExpiry(user.email, refreshToken);
    return { userDetails, refreshToken, accessToken };
  }
  const newUser = { name: user.name, email: user.email, isAccountVerified: true, isGoogleSignIn: true };
  const newUserData = await dbUserRepository.addUser(newUser);
  if (newUserData) {
    const refreshToken = authService.generateRefreshToken(
      {
        userId: newUserData._id.toString(),
        role: "client"
      }
    );
    const accessToken = authService.generateAccessToken(
      {
        userId: newUserData._id.toString(),
        role: "client"
      }
    );
    const userDetails = {
      _id: newUserData._id.toString(),
      name: newUserData.name,
      username: newUserData.username,
      email: newUserData.email,
      phoneNumber: newUserData?.phoneNumber,
      coverPhoto: newUserData?.coverPhoto,
      dp: newUserData?.dp,
      bio: newUserData?.bio,
      gender: newUserData?.gender,
      city: newUserData?.city,
      followers: newUserData?.followers,
      following: newUserData?.following,
      isAccountVerified: newUserData.isAccountVerified,
      isGoogleSignIn: true,
      isBlock: newUserData.isBlock,
      notifications: newUserData.notifications
    };
    await dbUserRepository.addRefreshTokenAndExpiry(
      newUserData.email,
      refreshToken
    );
    return { userDetails, refreshToken, accessToken };
  } else {
    throw new AppError(
      "Something went wrong!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const accessTokenRefresh = async (
  cookies: { refreshToken: string },
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (!cookies?.refreshToken) {
    throw new AppError("Invalid token1", HttpStatus.UNAUTHORIZED);
  }
  const refreshToken = cookies.refreshToken;
  const { userId, role } = authService.verifyRefreshToken(refreshToken.toString());
  if (!userId || role !== "client") {
    throw new AppError("Invalid token!", HttpStatus.UNAUTHORIZED);
  }
  const user = await dbUserRepository.getUserById(userId);
  if (!user?.refreshToken && !user?.refreshTokenExpiresAt) {
    throw new AppError("Invalid token!", HttpStatus.UNAUTHORIZED);
  }
  if (user) {
    const expiresAt = user.refreshTokenExpiresAt.getTime();
    if (Date.now() > expiresAt) {
      throw new AppError("Invalid token!", HttpStatus.UNAUTHORIZED);
    }
  }
  const newAccessToken = authService.generateAccessToken({ userId: userId, role: "client" });
  return newAccessToken;
};

export const tokenVerification = async (
  token: string,
  authService: ReturnType<AuthServiceInterface>
) => {
  const decodedToken = authService.verifyAccessToken(token);
  if (!decodedToken) {
    throw new AppError("Invalid token!", HttpStatus.UNAUTHORIZED);
  } else {
    return decodedToken;
  }
};

export const usernameAvailable = async (
  username: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  const isExistingUsername = await dbUserRepository.getUserByUsername(username);
  return isExistingUsername ? false : true;
};

export const handleLogoutUser = async (
  userId: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  await dbUserRepository.logoutUser(userId);
};

export const handleSendOtp = async (
  email: string,
  text: string,
  dbOtpRepository: ReturnType<OtpDbInterface>,
  mailSenderService: ReturnType<MailSenderServiceInterface>
) => {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await dbOtpRepository.saveNewOtp({ email, otp });
    if (text === "email-verification") {
      await mailSenderService.sendVerificationEmail(email, Number(otp))
    } else if (text === "forgot-password") {
      await mailSenderService.sendForgotPasswordEmail(email, Number(otp))
    }
  } catch (err) {
    console.log("Error in sending otp: ", err);
    throw new AppError(
      "Error in sending otp!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleOtpVerification = async (
  email: string,
  otp: string,
  text: string,
  dbOtpRepository: ReturnType<OtpDbInterface>,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  try {
    const otpObj = await dbOtpRepository.getLatestOtp(email);
    if (!otpObj) {
      throw new AppError("Invalid otp!", HttpStatus.UNAUTHORIZED);
    }
    if (otpObj.otp === otp && text === "email-verification") {
      const changeAccountStatus = await dbUserRepository.changeIsAccountVerified(email);
      return changeAccountStatus ? true : false;
    }
    else if (otpObj.otp === otp && text === "forgot-password") {
      return true;
    }
    else {
      return false;
    }
  } catch (err) {
    console.log("Error in verifying otp: ", err);
    throw new AppError(
      "Error in verifying otp!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleResetPassword = async (
  email: string,
  password: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  try {
    const user = await dbUserRepository.getUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid email!", HttpStatus.UNAUTHORIZED);
    }
    const newPassword = await authService.encryptPassword(password);
    await dbUserRepository.resetPassword(email, newPassword);
  }
  catch (err) {
    console.log("Error in resetting password: ", err);
    throw new AppError(
      "Error in resetting password!",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}