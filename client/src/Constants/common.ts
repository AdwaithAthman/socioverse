import { ToastOptions } from "react-toastify";

const CONSTANTS_COMMON = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  CLIENT_BASE_URL: import.meta.env.VITE_CLIENT_BASE_URL,
  DEFAULT_IMG: import.meta.env.VITE_DEFAULT_IMG,
};

export const TOAST_ACTION: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export default CONSTANTS_COMMON;
