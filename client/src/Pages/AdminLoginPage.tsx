import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import common, { TOAST_ACTION } from "../Constants/common";
import { isAxiosError } from "axios";
import { adminLogin, refreshAdminAccessToken } from "../API/Admin";
import { useEffect } from "react";
import { setAdminCredentials } from "../Redux/AdminSlice";

//importing types
import { AxiosErrorData } from "../Types/axiosErrorData";
import store, { StoreType } from "../Redux/Store";

const AdminLoginPage = () => {
  const isAuthenticated = useSelector(
    (state: StoreType) => state.admin.isAuthenticated
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      generateAccessToken();
    }
  }, [isAuthenticated, navigate]);

  const generateAccessToken = async () => {
    const { accessToken } = await refreshAdminAccessToken();
    if(accessToken){
      store.dispatch(setAdminCredentials({ accessToken }));
    }
  }

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await adminLogin(values);
        if (result) {
          toast.success("Successfully logged in...!", TOAST_ACTION);
          dispatch(setAdminCredentials(result));
          navigate("/admin");
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

  return (
    <>
      <ToastContainer />
      <div className="container py-9 lg:py-0 mx-auto my-auto flex flex-col min-h-screen lg:flex-row gap-2 lg:gap-2 md:gap-5 items-center justify-center">
        <div className=" w-72 md:w-[50%] lg:h-[50%] flex flex-col items-center justify-center">
          <div className="lg:flex lg:flex-col  lg:gap-3">
            <h1 className="lg:text-4xl text-3xl font-extrabold text-center md:text-left inline">
              Welcome to
            </h1>
            <h1 className="lg:text-4xl text-3xl font-extrabold font-logo text-center text-socioverse-400 inline pl-3 lg:pl-0">
              SOCIOVERSE Admin Panel
            </h1>
          </div>
          <div className="md:w-[30rem] md:h-[30rem]">
            <img src={common.ADMIN_LOGIN_SVG} alt="admin login svg" />
          </div>
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
              <Card
                color="transparent"
                shadow={false}
                className="p-8 lg:p-10 md:shadow-xl"
              >
                <div className="flex flex-col items-start">
                  <Typography variant="h4" color="blue-gray">
                    Login
                  </Typography>

                  <Typography
                    color="gray"
                    className="mt-1 text-center font-normal"
                  >
                    Login into Admin Panel
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
                    </div>
                  </div>
                  <Button type="submit" className="mt-6" fullWidth>
                    Login
                  </Button>
                </form>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminLoginPage;
