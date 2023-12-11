import axios from "axios";
import CONSTANTS_COMMON, { TOAST_ACTION } from "../../Constants/common";
import store from "../../Redux/Store";
import { logoutUser, refreshAccessToken } from "../Auth";
import { logout, setCredentials } from "../../Redux/AuthSlice";
import { toast } from "react-toastify";

const axiosUserInstance = axios.create({
  baseURL: CONSTANTS_COMMON.API_BASE_URL,
  withCredentials: true,
});

export const axiosRefreshInstance = axios.create({
  baseURL: CONSTANTS_COMMON.API_BASE_URL,
  withCredentials: true,
});

axiosUserInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosUserInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      try {
        if (error.response.data.message === "User is blocked") {
          await logoutUser();
          toast.dismiss();
          toast.error(
            "Your account has been blocked. Please contact admin.",
            TOAST_ACTION
          );
          store.dispatch(logout());
        }
        const { accessToken } = await refreshAccessToken();
        store.dispatch(setCredentials({ accessToken }));
        originalRequest.headers.authorization = `Bearer ${accessToken}`;
        return axiosUserInstance(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosUserInstance;
