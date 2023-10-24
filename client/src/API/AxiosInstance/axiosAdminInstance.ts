import axios from "axios";
import CONSTANTS_COMMON from "../../Constants/common";
import store from "../../Redux/Store";
import { refreshAdminAccessToken } from "../Admin";
import { setAdminCredentials } from "../../Redux/AdminSlice";

const axiosAdminInstance = axios.create({
    baseURL: CONSTANTS_COMMON.API_BASE_URL,
    withCredentials: true,
});

export const axiosAdminRefreshInstance = axios.create({
    baseURL: CONSTANTS_COMMON.API_BASE_URL, 
    withCredentials: true,
})

axiosAdminInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = store.getState().admin;
        if (accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosAdminInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            try {
                const { accessToken } = await refreshAdminAccessToken();
                store.dispatch(setAdminCredentials({ accessToken }));
                originalRequest.headers.authorization = `Bearer ${accessToken}`;
                return axiosAdminInstance(originalRequest);
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosAdminInstance;