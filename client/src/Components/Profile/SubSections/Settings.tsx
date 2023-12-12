import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../../../Types/axiosErrorData";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import common, { TOAST_ACTION } from "../../../Constants/common";
import { changePassword } from "../../../API/Profile";
import store from "../../../Redux/Store";

const Settings = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    oldPassword: yup
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
      .required("Current Password is required"),

    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .test(
        "password-validation",
        "Password must include alphanumeric values and symbols",
        (value) => {
          return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/.test(
            value || ""
          );
        }
      )
      .test(
        "not-equal-to-old",
        "New Password should be different from old password",
        function (value) {
          const oldPassword = this.resolve(yup.ref("oldPassword"));
          return value !== oldPassword;
        }
      )
      .required("New Password is required"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await changePassword(values);
        toast.success("Password changed successfully!", TOAST_ACTION);
        if (result) {
          navigate(`/profile/${store.getState().auth.user?._id}`);
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
      <Card
        color="transparent"
        shadow={false}
        className="p-8 lg:p-10 md:shadow-xl border"
      >
        <div className="flex items-center justify-center w-full gap-8">
          <div>
            <div className="flex flex-col items-start">
              <Typography variant="h4" color="blue-gray" className="text-xl md:text-2xl">
                Settings
              </Typography>

              <Typography color="gray" className="mt-1 text-center font-normal text-sm md:text-base">
                Change your password
              </Typography>
            </div>
            <form
              className="mt-8 mb-2 w-[19rem] max-w-screen-lg md:w-96"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  type="password"
                  size="lg"
                  label="Current Password"
                  name="oldPassword"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <div className="text-red-500 mt-[-1.1rem] text-sm">
                    {formik.errors.oldPassword}
                  </div>
                )}

                <Input
                  type="password"
                  size="lg"
                  label="New Password"
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <div className="text-red-500 mt-[-1.1rem] text-sm">
                    {formik.errors.newPassword}
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
                    <div className="text-red-500 mt-[-1.1rem] text-sm">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
              <Button type="submit" className="mt-6" fullWidth>
                Submit
              </Button>
            </form>
          </div>
          <div className="w-96 h-96 hidden lg:block">
            <img src={common.SETTING_SVG} alt="settings" className="w-full h-full" />
          </div>
        </div>
      </Card>
    </>
  );
};

export default Settings;
