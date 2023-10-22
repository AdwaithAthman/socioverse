import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { useFormik } from "formik";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { TOAST_ACTION } from "../../Constants/common";
import { sendOtp, verifyOtp } from "../../API/Auth";

//importing types
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../../Types/axiosErrorData";

const MailInput = ({
  setProceed,
  setEmail,
}: {
  setProceed: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [sendOtpDone, setSendOtpDone] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    otp: yup
      .string()
      .required("OTP is required")
      .test(
        "len",
        "OTP must be exactly 6 digits",
        (val) => val?.toString().length === 6
      )
      .test("format", "OTP must contain only numbers", (val) =>
        /^\d+$/.test(val || "")
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await verifyOtp(
          values.email,
          values.otp,
          "forgot-password"
        );
        if (response.status === "success") {
          toast.success(
            "Account verified successfully, Click Proceed",
            TOAST_ACTION
          );
          setIsVerified(true);
        } else {
          toast.error("Invalid OTP, try again!", TOAST_ACTION);
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
        }
      }
    },
  });

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      console.log("email for sendOtp: ", formik.values.email);
      const response =
        formik.values.email &&
        (await sendOtp(formik.values.email, "forgot-password"));
      console.log(response);
      if (response && response?.status === "success") {
        toast.success("OTP sent successfully", TOAST_ACTION);
      }
      setSendOtpDone(true);
    } catch (error) {
      console.log("error: ", error);
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
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleProceed = () => {
    setEmail(formik.values.email);
    setIsVerified(false);
    setProceed(true);
  }

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
            Forgot Password
          </Typography>

          <Typography color="gray" className="mt-1 text-center font-normal">
            Enter your email address to reset your password
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-4 flex flex-col gap-6">
            <div>
              <div className="relative flex w-full max-w-[24rem]">
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-20"
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                {!sendOtpDone ? (
                  <Button
                    size="sm"
                    color={formik.values.email ? "red" : "blue-gray"}
                    disabled={!formik.values.email || isSendingOtp}
                    className="!absolute right-1 top-1 rounded"
                    onClick={handleSendOtp}
                  >
                    {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    color={formik.values.email ? "red" : "blue-gray"}
                    disabled={!formik.values.email || isSendingOtp}
                    className="!absolute right-1 top-1 rounded"
                    onClick={handleSendOtp}
                  >
                    {isSendingOtp ? "Resending OTP..." : "Resend OTP"}
                  </Button>
                )}
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 mb-[0.5rem] text-sm inline">
                  {formik.touched.email && formik.errors.email}
                </div>
              )}
            </div>
            <div>
              <div className="relative flex w-full max-w-[24rem]">
                <Input
                  type="password"
                  label="OTP"
                  name="otp"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-20"
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                <Button
                  size="sm"
                  color={formik.values.otp ? "red" : "blue-gray"}
                  disabled={!formik.values.otp}
                  className="!absolute right-1 top-1 rounded"
                  type="submit"
                >
                  Verify
                </Button>
              </div>
              {formik.touched.otp && formik.errors.otp && (
                <div className="text-red-500 mt-[0.5rem] text-sm inline">
                  {formik.touched.otp && formik.errors.otp}
                </div>
              )}
            </div>
          </div>
          <Button className="mt-6" fullWidth disabled={!isVerified} onClick={handleProceed}>
            Proceed
          </Button>
        </form>
      </Card>
    </>
  );
};

export default MailInput;
