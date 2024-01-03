import { useEffect } from "react";
import Profile from "../Components/Profile";
import { useDispatch, useSelector } from "react-redux";
import store, { StoreType } from "../Redux/Store";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../API/Profile";
import { setCredentials } from "../Redux/AuthSlice";

const ProfilePage = () => {
  const user = useSelector((state: StoreType) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.isAuthenticated) {
      const userData = userInfo();
      if (!userData) {
        navigate("/error");
      }
    }
  }, [user]);

  const userInfo = async () => {
    try {
      const { user } = await getUserInfo();
      const { accessToken } = store.getState().auth;
      dispatch(setCredentials({ user, accessToken }));
      return user;
    } catch (error) {
      if (isAxiosError(error)) {
        const err: AxiosErrorData = error as AxiosErrorData;
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          navigate("/login");
        }
      }
    }
  };

  return (
    <>
      <Profile />
    </>
  );
};

export default ProfilePage;

