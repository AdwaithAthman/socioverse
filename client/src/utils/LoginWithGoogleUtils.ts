import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../API/FirebaseConfig";
import { loginUsingGoogle } from "../API/Auth";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";

const LoginWithGoogleUtils = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    // Get user from result
    const user = result.user;

    if (user) {
      const response = await loginUsingGoogle({
        name: user?.displayName as string,
        email: user?.email as string
      })
  
      return response;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const err: AxiosErrorData = error as AxiosErrorData;
      if (
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        const errorMessage = err.response.data.message;
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      console.log(error);
    }
    console.log("loginWithGoogle error", error)
  }
};

export default LoginWithGoogleUtils;
