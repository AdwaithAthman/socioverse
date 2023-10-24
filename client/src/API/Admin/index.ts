import axiosAdminInstance, {
  axiosAdminRefreshInstance,
} from "../AxiosInstance/axiosAdminInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import { AdminLoginInterface, AdminLoginResponse } from "../../Types/admin";

export const adminLogin = async (
  payload: AdminLoginInterface
): Promise<AdminLoginResponse> => {
  const response = await axiosAdminRefreshInstance.post<AdminLoginResponse>(
    END_POINTS.ADMIN_LOGIN,
    payload
  );
  return response.data;
};

export const refreshAdminAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await axiosAdminRefreshInstance.get<{ accessToken: string }>(
    END_POINTS.REFRESH_ADMIN_TOKEN,
    { withCredentials: true }
  );
  return response.data;
};
