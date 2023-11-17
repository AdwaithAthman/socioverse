import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../Redux/Store";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ChatInterface, MessageInterface } from "../Types/chat";
import common from "../Constants/common";
import { setFetchUserChatsAgain, setNotification } from "../Redux/ChatSlice";

let socket: Socket, selectedChatCompare: ChatInterface;

const MainPage = () => {
  const section = useParams().section || "home";
  const dispatch = useDispatch();

  const user = useSelector((state: StoreType) => state.auth.user);
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );

  //for socket purpose
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const notification = useSelector(
    (state: StoreType) => state.chat.notification
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
          if (
            !notification.some(
              (message) => message._id === newMessageRecieved._id
            )
          ) {
            dispatch(setNotification(newMessageRecieved));
            dispatch(setFetchUserChatsAgain(true));
          }
        }
      });
    }
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {section === "home" && <HomePage />}
          {section === "message" && <ChatPage socket={socket} socketConnected={socketConnected} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MainPage;
