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
import { Socket, io } from "socket.io-client";
import { ChatInterface, MessageInterface } from "../Types/chat";
import common from "../Constants/common";
import { setFetchUserChatsAgain, setNotification } from "../Redux/ChatSlice";

let socket: Socket, selectedChatCompare: ChatInterface;

const ChatPage = () => {
  const user = useSelector((state: StoreType) => state.auth.user);
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //for socket purpose
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const notification = useSelector(
    (state: StoreType) => state.chat.notification
  );
  //
  const fetchUserChatsAgain = useSelector(
    (state: StoreType) => state.chat.fetchUserChatsAgain
  );

  //socket io connection
  useEffect(() => {
    socket = io(common.API_BASE_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.off("connected");
      socket.off("setup");
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      const userData = userInfo();
      if (!userData) {
        navigate("/error");
      }
    }
  }, [navigate, user]);

  useEffect(() => {
    selectedChatCompare = selectedChat as ChatInterface;
  }, [selectedChat]);

  // useEffects for handling socket events
  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageRecieved: MessageInterface) => {
        console.log("new message recieved1: ", newMessageRecieved);
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          //show notification
          if(!notification.some((message) => message._id === newMessageRecieved._id)) {
            dispatch(setNotification(newMessageRecieved));
            dispatch(setFetchUserChatsAgain(true));
          }
        }
      });
    }
  });

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

  useEffect(() => {
    console.log("fetchUserChatsAgain", fetchUserChatsAgain);
  });

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
