import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import store, { StoreType } from "../Redux/Store";
import ChatBox from "../Components/Chat/ChatBox";
import MyChats from "../Components/Chat/MyChats";
import SideDrawer from "../Components/Chat/SideDrawer";
import { getUserInfo } from "../API/Profile";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";
import { setCredentials } from "../Redux/AuthSlice";
import { ToastContainer } from "react-toastify";

const ChatPage = () => {
  const user = useSelector((state: StoreType) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      const userData = userInfo();
      if (!userData) {
        navigate("/error");
      }
    }
  }, [navigate, user]);

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
    <div className="w-full">
      <ToastContainer />
      <SideDrawer userId={(user && user._id) as string} />
      <div className="flex justify-between w-full p-2">
        <MyChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
