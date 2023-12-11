import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../../../Types/axiosErrorData";
import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { TOAST_ACTION } from "../../../Constants/common";
import { ReactComponent as ProfileSvg } from "../../../assets/profileSvg.svg";
import { editProfile } from "../../../API/Profile";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../Redux/AuthSlice";

//importing types
import { User } from "../../../Types/loginUser";
import { StoreType } from "../../../Redux/Store";

const EditProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreType) => state.auth.user);
  const accessToken = useSelector((state: StoreType) => state.auth.accessToken);
  const [profileInfo, setProfileInfo] = useState<User | null>(null);

  useEffect(() => {
    setProfileInfo(userInfo);
    setIsLoading(false);
  }, [userInfo]);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name cannot be empty")
      .min(3, "Name should be atleast 3 characters"),
    username: yup
      .string()
      .required("Username cannot be empty")
      .min(3, "Username should be atleast 3 characters"),
    email: yup
      .string()
      .required("Email cannot be empty")
      .email("Invalid email"),
    phoneNumber: yup
      .number()
      .nullable()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
          originalValue = originalValue.trim();
        }
        return originalValue === "" ? null : value;
      })
      .max(9999999999, "Phone number must be 10 digits")
      .min(1000000000, "Phone number must be 10 digits")
      .typeError("Phone number must be a number"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profileInfo?.name || "",
      username: profileInfo?.username || "",
      email: profileInfo?.email || "",
      phoneNumber: profileInfo?.phoneNumber || "",
      bio: profileInfo?.bio || "",
      gender: profileInfo?.gender || "",
      city: profileInfo?.city || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {

        const updatedFields: { [key: string]: string | number } = {};

        const fieldsToCheck = [
          "name",
          "username",
          "email",
          "phoneNumber",
          "bio",
          "gender",
          "city",
        ];

        for (const field of fieldsToCheck) {
          if (
            values[field as keyof typeof values] !==
            profileInfo?.[field as keyof typeof profileInfo]
          ) {
            updatedFields[field] = values[field as keyof typeof values];
          }
        }

        if(Object.keys(updatedFields).length === 0){
          toast.error("No changes made!", TOAST_ACTION);
          return;
        }
        const result = await editProfile(updatedFields);
        toast.success("Profile updated successfully!", TOAST_ACTION);
        if (result) {
          dispatch(setCredentials({ result: result.user, accessToken }));
          setTimeout(() => {
            navigate(`/profile/${result.user._id}`);
          }, 2000)
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

  const handleGenderChange = (value: string | undefined) => {
    formik.setFieldValue("gender", value);
  };

  return (
    <>
      <ToastContainer />
      <Card
        color="transparent"
        shadow={false}
        className="p-8 lg:p-10 md:shadow-xl border"
      >
        <div className="flex items-start justify-center w-full gap-8">
          <div>
            <div className="flex flex-col items-start">
              <Typography variant="h4" color="blue-gray" className="text-xl md:text-2xl">
                Profile
              </Typography>

              <Typography color="gray" className="mt-1 text-center font-normal text-sm md:text-base">
                Edit your profile
              </Typography>
            </div>
            {!isLoading ? (
              <form
                className="mt-8 mb-2 w-[19rem] max-w-screen-lg md:w-96"
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
                    label="Username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 mt-[-1.25rem] text-sm">
                      {formik.errors.username}
                    </div>
                  )}

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

                  <div className="lg:w-96 w-full">
                    <Textarea
                      label="Bio"
                      name="bio"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="lg:w-96 w-full">
                    <Select
                      label="Select Gender"
                      size="lg"
                      name="gender"
                      value={formik.values.gender}
                      onChange={handleGenderChange}
                      onBlur={formik.handleBlur}
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Non-Binary">Non-Binary</Option>
                      <Option value="Prefer no to say">Prefer no to say</Option>
                    </Select>
                  </div>

                  <Input
                    size="lg"
                    label="City"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <Button type="submit" className="mt-6" fullWidth>
                  Submit
                </Button>
              </form>
            ) : (
              ""
            )}
          </div>
          <div className="w-96 h-96 hidden lg:block">
            <ProfileSvg />
          </div>
        </div>
      </Card>
    </>
  );
};

export default EditProfile;
