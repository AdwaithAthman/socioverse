import { useEffect } from "react";
import Home from "../Components/Home";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store, { StoreType } from "../Redux/Store";

//importing types
import { User } from "../Types/loginUser";
import { Socket } from "socket.io-client";
import { getUserInfo } from "../API/Profile";
import { setCredentials } from "../Redux/AuthSlice";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";

const HomePage = ({ socket }: { socket: Socket }) => {
  const user = useSelector((state: StoreType) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
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
      <Home user={user.user as User} socket={socket} />
    </>
  );
};

export default HomePage;
