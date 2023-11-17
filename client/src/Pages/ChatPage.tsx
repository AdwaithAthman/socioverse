import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import store, { StoreType } from "../Redux/Store";
import ChatBox from "../Components/Chat/ChatBox";
import MyChats from "../Components/Chat/MyChats";
import { getUserInfo } from "../API/Profile";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";
import { setCredentials } from "../Redux/AuthSlice";
import { ToastContainer } from "react-toastify";
import classnames from "classnames";
import { Socket } from "socket.io-client";

const ChatPage = ({
  socket,
  socketConnected,
}: {
  socket: Socket;
  socketConnected: boolean;
}) => {
  const user = useSelector((state: StoreType) => state.auth.user);
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
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
      <div className="flex justify-between items-center w-full h-full p-2 gap-5">
        <div
          className={classnames(
            "md:block md:w-4/12 h-full bg-white border border-blue-gray-500 rounded-xl",
            { "w-full": !selectedChat },
            { hidden: selectedChat }
          )}
        >
          <MyChats userId={(user && user._id) as string} />
        </div>
        <div
          className={classnames(
            "md:block md:w-8/12 h-full bg-white border border-blue-gray-500 rounded-xl",
            { "w-full block": selectedChat },
            { hidden: !selectedChat }
          )}
        >
          <ChatBox socket={socket} socketConnected={socketConnected} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
