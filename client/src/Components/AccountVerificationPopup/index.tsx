import { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import * as yup from "yup";
import { useFormik } from "formik";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../../Types/axiosErrorData";
import { ToastContainer, toast } from "react-toastify";
import { TOAST_ACTION } from "../../Constants/common";
import classnames from "classnames";
import { sendOtp, verifyOtp } from "../../API/Auth";
import store from "../../Redux/Store";

const AccountVerificationPopup = ({
  handleAccountVerifyPopup,
  accountVerifyPopupOpen,
  setIsAccountVerified,
}: {
  handleAccountVerifyPopup: () => void;
  accountVerifyPopupOpen: boolean;
  setIsAccountVerified: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [sendOtpDone, setSendOtpDone] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const email = store.getState().auth.user?.email;
  const validationSchema = yup.object().shape({
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
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (value) => {
      try {
        const response = email &&  (await verifyOtp(email, value.otp, "email-verification"));
        if (response && response.status === "success") {
          toast.success("Account verified successfully", {...TOAST_ACTION, position: "bottom-left"});
          setIsAccountVerified(true);
          handleAccountVerifyPopup();
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
      const response = email && (await sendOtp(email, "email-verification"));
      if (response && response?.status === "success") {
        toast.success("OTP sent successfully", TOAST_ACTION);
      }
      setSendOtpDone(true);
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
    finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <Dialog
      open={accountVerifyPopupOpen}
      size="md"
      handler={handleAccountVerifyPopup}
      dismiss={{
        enabled: false,
      }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <ToastContainer />
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl">Email Verification</div>
          <div></div>
        </div>
      </DialogHeader>
      <DialogBody className="mx-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="text-md mb-10 border-2 p-4 rounded-lg bg-green-50 border-green-500">
            We have sent an otp to your email address. Please enter the otp in
            the below field to verify your email address.
          </div>
          <div className="flex items-start gap-5">
            <div className="w-[20rem]">
              <div className="flex flex-col gap-1">
                <form onSubmit={formik.handleSubmit}>
                  <Input
                    type="password"
                    label="OTP"
                    name="otp"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div
                    className={classnames(
                      "flex",
                      { "justify-end": !formik.errors.otp },
                      { "justify-between": formik.errors.otp }
                    )}
                  >
                    <div className="text-red-500 mt-[0.5rem] text-sm inline">
                      {formik.touched.otp && formik.errors.otp}
                    </div>
                    <Button variant="text" type="submit">
                      Verify
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            {!sendOtpDone ? (
              <Button
                size="lg"
                className="bg-socioverse-500 hover:scale-105 text-white px-4 py-2 rounded-lg"
                disabled={isSendingOtp}
                onClick={handleSendOtp}
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-socioverse-500 hover:scale-105 text-white px-4 py-2 rounded-lg"
                disabled={isSendingOtp}
                onClick={handleSendOtp}
              >
                {isSendingOtp ? "Resending OTP..." : "Resend OTP"}
              </Button>
            )}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default AccountVerificationPopup;
