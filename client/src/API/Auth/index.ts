import axiosUserInstance, { axiosRefreshInstance } from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import { LoginUserInterface, LoginUserResponse } from "../../Types/loginUser";
import { SignupUserInterface } from "../../Types/signupUser";
import { SignupUserResponse } from "../../Types/signupUser";
import { UsernameAvailabilityResponse } from "../../Types/signupUser";
import {
  GoogleLoginInterface,
  LogoutResponse,
  SendOtpResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from "../../Types/loginUser";

export const loginUser = async (
  payload: LoginUserInterface
): Promise<LoginUserResponse> => {
  const response = await axiosRefreshInstance.post<LoginUserResponse>(
    END_POINTS.LOGIN_USER,
    payload
  );
  return response.data;
};

export const signupUser = async (
  payload: SignupUserInterface
): Promise<SignupUserResponse> => {
  const response = await axiosRefreshInstance.post<SignupUserResponse>(
    END_POINTS.SIGNUP_USER,
    payload
  );
  return response.data;
};

export const loginUsingGoogle = async (
  payload: GoogleLoginInterface
): Promise<LoginUserResponse> => {
  const response = await axiosRefreshInstance.post<LoginUserResponse>(
    END_POINTS.LOGIN_GOOGLE,
    payload
  );
  return response.data;
};

export const refreshAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await axiosRefreshInstance.get<{ accessToken: string }>(
    END_POINTS.REFRESH_TOKEN,
    { withCredentials: true }
  );
  return response.data;
};

export const usernameAvailability = async (
  params: string
): Promise<UsernameAvailabilityResponse> => {
  const response = await axiosUserInstance.get<UsernameAvailabilityResponse>(
    END_POINTS.USERNAME_AVAILABILITY + params
  );
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await axiosUserInstance.delete<LogoutResponse>(
    END_POINTS.LOGOUT_USER
  );
  return response.data;
};

export const sendOtp = async (email: string, text: string): Promise<SendOtpResponse> => {
  const response = await axiosUserInstance.post<SendOtpResponse>(
    END_POINTS.SEND_OTP,
    { email, text }
  );
  return response.data;
};

export const verifyOtp = async (email: string, otp: string, text: string): Promise<VerifyOtpResponse> => {
  const response = await axiosUserInstance.post<VerifyOtpResponse>(
    END_POINTS.VERIFY_OTP,
    { email, otp, text }
  );
  return response.data;
};

export const resetPassword = async ({ email, password} : { email: string, password: string }): Promise<ResetPasswordResponse> => {
  const response = await axiosUserInstance.post<ResetPasswordResponse>(
    END_POINTS.RESET_PASSWORD,
    { email, password }
  );
  return response.data;
}

