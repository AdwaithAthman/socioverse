import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { addUsername } from "../../API/Profile";
import { TOAST_ACTION } from "../../Constants/common";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../../Types/axiosErrorData";

const UsernameInputPopup = ({
  handleUsernameInputPopup,
  usernameInputPopupOpen,
  setIsUsernameAvailable,
}: {
  handleUsernameInputPopup: () => void;
  usernameInputPopupOpen: boolean;
  setIsUsernameAvailable: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .matches(/^\S+$/, "Username cannot contain whitespace characters")
      .min(3, "Username should be atleast 3 characters")
      .required("Username is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (value) => {
      try {
        const response = await addUsername(value.username);
        if (response.status === "success") {
          setIsUsernameAvailable(true);
          toast.success("Username added successfully", {
            ...TOAST_ACTION,
            position: "bottom-left",
          });
          setIsUsernameAvailable(true);
          handleUsernameInputPopup();
        } else {
          toast.error(response.message, TOAST_ACTION);
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
  return (
    <Dialog
      open={usernameInputPopupOpen}
      size="md"
      handler={handleUsernameInputPopup}
      dismiss={{
        enabled: false,
      }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl">User Info</div>
          <div></div>
        </div>
      </DialogHeader>
      <ToastContainer />
      <DialogBody className="mx-4 mb-8">
        <div className="flex flex-col">
          <div className="text-md mb-6 border-2 p-4 rounded-lg bg-green-50 border-green-500">
            Enter your username to continue, it should be unique!
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex items-start gap-5 justify-center"
          >
            <div className="w-[20rem]">
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  label="Username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 mt-[0.5rem] text-sm inline">
                    {formik.errors.username}
                  </div>
                )}
              </div>
            </div>
            <Button
              size="lg"
              className="bg-socioverse-500 hover:scale-105 text-white px-4 py-2 rounded-lg"
              disabled={!formik.values.username}
              type="submit"
            >
              Continue
            </Button>
          </form>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default UsernameInputPopup;
