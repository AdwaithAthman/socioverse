import axios from "axios";
import CONSTANTS_COMMON from "../Constants/common";
import store from "../Redux/Store";
import { refreshAccessToken } from "./Auth";
import { setCredentials } from "../Redux/AuthSlice";

const axiosUserInstance = axios.create({
    baseURL: CONSTANTS_COMMON.API_BASE_URL,
    withCredentials: true,
});

export const axiosRefreshInstance = axios.create({
    baseURL: CONSTANTS_COMMON.API_BASE_URL, 
    withCredentials: true,
})

axiosUserInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = store.getState().auth;
        if (accessToken) {
            console.log("accessToken= ", accessToken);
            config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosUserInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        console.log("error.config= ", error.config)
        console.log("error.response === ",error.response);
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            try {
                const { accessToken } = await refreshAccessToken();
                store.dispatch(setCredentials({ accessToken }));
                originalRequest.headers.authorization = `Bearer ${accessToken}`;
                return axiosUserInstance(originalRequest);
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosUserInstance;