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
    <div className="w-full h-[80vh] lg:h-[85vh] ">
         {/* <SideDrawer userId={(user && user._id) as string} /> */}
      <ToastContainer />
      <div className="flex justify-between items-center w-full h-full p-2">
        <div className="w-full md:w-5/12 h-full bg-white border border-blue-gray-500 rounded-lg">
        <MyChats userId={(user && user._id) as string} />
        </div>
        <div className="hidden md:block md:w-7/12 h-full bg-white border-y border-r border-blue-gray-500 rounded-lg">
        <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
