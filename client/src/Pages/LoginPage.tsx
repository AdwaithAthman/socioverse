import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";
import LoginWithGoogleUtils from "../utils/LoginWithGoogleUtils";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../Redux/AuthSlice";
import { loginUser } from "../API/Auth";
import { ReactComponent as GoogleLogoSvg } from "../assets/GoogleLogoSvg.svg";
import { TOAST_ACTION } from "../Constants/common";

import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { StoreType } from "../Redux/Store";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sharedPostId = useSelector(
    (state: StoreType) => state.post.sharedPostId
  );

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .test(
        "password-validation",
        "Password must include alphanumeric values and symbols",
        (value) => {
          // Check if password includes at least one alphabet, one number, and one symbol
          return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/.test(
            value || ""
          );
        }
      )
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await loginUser(values);
        console.log(result);
        if (result) {
          toast.success("Successfully logged in...!", TOAST_ACTION);
          dispatch(setCredentials(result));
          if (sharedPostId) {
            navigate(`/share/${sharedPostId}`);
          } else {
            navigate("/");
          }
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
            toast.error(errorMessage, TOAST_ACTION);
          }
          console.log(error);
        }
      }
    },
  });

  //LoginWithGoogle is a imperative function for logging in with google
  const loginWithGoogle = async () => {
    const result = await LoginWithGoogleUtils();
    if (result) {
      dispatch(setCredentials(result));
      if (sharedPostId) {
        navigate(`/share/${sharedPostId}`);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Card
        color="transparent"
        shadow={false}
        className="p-8 lg:p-10 md:shadow-xl"
      >
        <div className="flex flex-col items-start">
          <Typography variant="h4" color="blue-gray">
            Login
          </Typography>

          <Typography color="gray" className="mt-1 text-center font-normal">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-500 transition-colors hover:text-blue-700"
            >
              Sign Up
            </Link>
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Input
              size="lg"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-[-1.25rem] text-sm">
                {formik.errors.email}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                size="lg"
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 mt-[-0.10rem] text-sm">
                  {formik.errors.password}
                </div>
              )}
              <Link to="/forgot-password">
                <Typography
                  color="gray"
                  className=" font-normal text-right text-sm"
                >
                  Forgot Password?
                </Typography>
              </Link>
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Login
          </Button>
          <Button
            className="mt-5 !py-2.5 relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white font-semibold text-gray-700 transition-all duration-200 hover:shadow-red-100 hover:bg-gray-100
             hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
            onClick={loginWithGoogle}
          >
            <span className="mr-2 inline-block">
              <GoogleLogoSvg />
            </span>
            Login with Google
          </Button>
        </form>
      </Card>
    </>
  );
};

export default LoginPage;
