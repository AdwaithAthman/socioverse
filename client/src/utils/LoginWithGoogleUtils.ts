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
    console.log("userData from google: ", user);

   
    if (user) {
      const response = await loginUsingGoogle({
        name: user?.displayName as string,
        email: user?.email as string
      })
  
      // await toast.promise(
      //   response,
      //   {
      //     pending: "Logging in.....", // Message shown while the promise is pending
      //     success: "Successfully Logged in", // Message shown when the promise is resolved
      //     error: "Failed to Login", // Message shown when the promise is rejected
      //   },
      //   {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   }
      // );
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
