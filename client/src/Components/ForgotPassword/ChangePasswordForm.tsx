import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { resetPassword } from "../../API/Auth";
import { TOAST_ACTION } from "../../Constants/common";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
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
      .required("New Password is required"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = resetPassword({email, password: values.confirmPassword})
      toast.promise(response, {
        pending: "Resetting Password...",
        success: "Password has been Successfully",
        error: "Something went wrong",
      }, TOAST_ACTION)
      if ( ((await response).status) === "success"){
        setTimeout(() => {
            navigate("/login");
          }, 2000);
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
              <Typography variant="h4" color="blue-gray">
                Forgot Password
              </Typography>

              <Typography color="gray" className="mt-1 text-center font-normal">
                Reset your password
              </Typography>
            </div>
            <form
              className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4 flex flex-col gap-6">
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
        </div>
      </Card>
    </>
  );
};

export default ChangePasswordForm;
