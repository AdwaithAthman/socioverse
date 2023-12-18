import { ToastOptions } from "react-toastify";

const CONSTANTS_COMMON = {
  API_BASE_URL: "https://socioverse.online",
  CLIENT_BASE_URL: "https://socioverse.online",
  DEFAULT_IMG: import.meta.env.VITE_DEFAULT_IMG!,
  ADMIN_LOGIN_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381015/socioverse%20stock/AdminLoginSvg_ain9jo.svg",
  AUTHENTICATION_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381022/socioverse%20stock/AuthenticationSvg_iirmb2.svg",
  CHAT_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381151/socioverse%20stock/ChatSvg_acpykg.svg",
  GOOGLE_LOGO_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381161/socioverse%20stock/GoogleLogoSvg_atvkrt.svg",
  LOADER_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381169/socioverse%20stock/Loader_dofs8c.svg",
  LOADER_PNG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381177/socioverse%20stock/LoaderPng_ahqjxq.png",
  LOGIN_ALERT_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381181/socioverse%20stock/LoginAlertSvg_yx47iz.svg",
  NO_DATA_AVAILABLE_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381193/socioverse%20stock/NoDataAvailable_jovfkq.svg",
  PROFILE_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381205/socioverse%20stock/profileSvg_mwpb71.svg",
  SETTING_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381215/socioverse%20stock/Settings_lv6rse.svg",
  ERROR_NOT_FOUND_SVG: "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381003/socioverse%20stock/404_nvavnv.svg"
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
