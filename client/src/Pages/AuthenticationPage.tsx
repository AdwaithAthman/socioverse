import { useLocation } from "react-router-dom";
import { ReactComponent as AuthenticationSvg } from "../assets/AuthenticationSvg.svg";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { motion, AnimatePresence } from "framer-motion";
import TokenCheckMiddleware from "../Middleware/tokenCheckMiddleware";
import ForgotPasswordPage from "./ForgotPasswordPage";

const AuthenticationPage = () => {
  const location = useLocation();
  return (
    <>
      <div className="container py-9 lg:py-0 mx-auto my-auto flex flex-col min-h-screen lg:flex-row gap-2 lg:gap-2 md:gap-5 items-center justify-center">
        <div className=" w-72 md:w-[50%] lg:h-[50%] flex flex-col items-center justify-center">
          <div className="lg:flex lg:gap-3">
          <h1 className="lg:text-4xl text-3xl font-extrabold text-center md:text-left inline">
              Welcome to
          </h1>
          <h1 className="lg:text-4xl text-3xl font-extrabold font-logo text-center text-socioverse-400 inline pl-3 lg:pl-0">
            SOCIOVERSE
          </h1>
          </div>
          <AuthenticationSvg path />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center lg:h-full"
          >
            <div className="flex items-center justify-center lg:h-screen">
              <TokenCheckMiddleware>
                <>
                  {location.pathname === "/login" && <LoginPage />}
                  {location.pathname === "/signup" && <SignupPage />}
                  {location.pathname === "/forgot-password" && <ForgotPasswordPage />}
                </>
              </TokenCheckMiddleware>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default AuthenticationPage;
