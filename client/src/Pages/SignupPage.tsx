// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { signupUser, usernameAvailability } from "../API/Auth";
import { isAxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import LoginWithGoogleUtils from "../utils/LoginWithGoogleUtils";
import { ReactComponent as GoogleLogoSvg } from "../assets/GoogleLogoSvg.svg";

//importing types
import { AxiosErrorData } from "../Types/axiosErrorData";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const SignupPage = () => {

  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(3, "Name should be atleast 3 characters")
      .required("Name is required"),
    username: yup
      .string()
      .trim()
      .matches(/^\S+$/, "Username cannot contain whitespace characters")
      .min(3, "Username should be atleast 3 characters")
      .required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        originalValue = originalValue.trim();
      }
      return originalValue === "" ? null : value;
    })
    .required("Phone number is required")
    .max(9999999999, "Phone number must be 10 digits")
    .min(1000000000, "Phone number must be 10 digits")
    .typeError("Phone number must be a number"),
  
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try { 
        await toast.promise(
          signupUser({...values, phoneNumber: Number(values.phoneNumber)}),
          {
            pending: "Creating your account...", // Message shown while the promise is pending
            success: "Successfully created an account", // Message shown when the promise is resolved
            error: "Failed to create an account", // Message shown when the promise is rejected
          },
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
        // console.log(res.message);
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
      }
    },
  });

  //LoginWithGoogle is a imperative function for logging in with google
  const loginWithGoogle = async () => {
    await LoginWithGoogleUtils();
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  // const [availabilityMessage, setAvailabilityMessage] = useState("");
  // const [checkingUsername, setCheckingUsername] = useState(false);

  // const checkUsernameAvailability = () => {
  //   setCheckingUsername(true);

  //   usernameAvailability(formik.values.username)
  //     .then((res) => {
  //       setCheckingUsername(false);

  //       if (res.available) {
  //         setAvailabilityMessage("Username is available!");
  //       } else {
  //         setAvailabilityMessage("Username is already taken!");
  //       }
  //     })
  //     .catch((err) => {
  //       setCheckingUsername(false);

  //       console.error("Error checking username", err);
  //       setAvailabilityMessage("Error checking username. Please try again.");
  //     });
  // };
  return (
    <>
      <ToastContainer />
      <Card color="transparent" shadow={false} className="p-8 lg:p-10 md:shadow-xl">
        <div className="flex flex-col items-start">
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 text-center font-normal">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 transition-colors hover:text-blue-700"
            >
              Login
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
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 mt-[-1.25rem] text-sm">
                {formik.errors.name}
              </div>
            )}
            <Input
              size="lg"
              label="User Name"
              name="username"
              value={formik.values.username}
              onChange={(e) => {
                formik.handleChange(e);
                // checkUsernameAvailability();
                // setAvailabilityMessage(""); 
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 mt-[-1.25rem] text-sm">
                {formik.errors.username}
              </div>
            )}
            {/* {checkingUsername && <div>spinner</div>}

            {availabilityMessage && (
              <div
                className={`mt-[-1.25rem] text-sm ${
                  availabilityMessage.includes("available")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {availabilityMessage}
              </div>
            )} */}
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
            <Input
              type="tel"
              size="lg"
              label="Phone Number"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 mt-[-1.25rem] text-sm">
                {formik.errors.phoneNumber}
              </div>
            )}
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
              <div className="text-red-500 mt-[-1.25rem] text-sm">
                {formik.errors.password}
              </div>
            )}
            <Input
              type="password"
              size="lg"
              label="Confirm Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-red-500 mt-[-1.25rem] text-sm">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-blue-500"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth type="submit">
            Register
          </Button>
          <Button className="mt-5 !py-2.5 relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white font-semibold text-gray-700 transition-all duration-200 hover:shadow-red-100 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none" onClick={loginWithGoogle}>
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

export default SignupPage;
