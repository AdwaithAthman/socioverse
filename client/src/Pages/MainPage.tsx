import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../Redux/Store";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ChatInterface, MessageInterface } from "../Types/chat";
import common, { TOAST_ACTION } from "../Constants/common";
import {
  initializeNotification,
  setFetchUserChatsAgain,
  setNotification,
} from "../Redux/ChatSlice";
import { addNotification } from "../API/User";
import { fetchNotifications } from "../API/Message";
import { ToastContainer, toast } from "react-toastify";
import { User } from "../Types/loginUser";
import { Button } from "@material-tailwind/react";

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
  const [callIsSent, setCallIsSent] = useState<boolean>(false);

  useEffect(() => {
    if (
      notification.length === 0 &&
      user &&
      user.notifications &&
      user.notifications.length > 0
    ) {
      fetchNotifs();
    }
  }, [user]);

  const fetchNotifs = async () => {
    const response =
      user && (await fetchNotifications(user.notifications as string[]));
    if (response) {
      dispatch(initializeNotification(response.notifications));
    }
  };

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
            addNotif(newMessageRecieved._id);
          }
        }
      });

      //for video call
      socket.on("call-made", (callerInfo: User) => {
        toast.dismiss();
        setCallIsSent(true);
        toast.info(
          ({ closeToast }) => (
            <div>
              Incoming call from {callerInfo.name}
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  className="rounded-full text-black border-black"
                  onClick={() =>
                    answerCall(callerInfo, closeToast as () => void)
                  }
                >
                  Answer
                </Button>
                <Button
                  className="rounded-full bg-socioverse-500"
                  size="sm"
                  onClick={() => rejectCall(closeToast as () => void)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ),
          {
            ...TOAST_ACTION,
            closeButton: false,
            onClose: () => {
              setCallIsSent(false);
            },
          }
        );
      });
    }
  });

  const addNotif = async (messageId: string) => {
    await addNotification(messageId);
  };

  const answerCall = (callerInfo: User, closeToast: () => void) => {
    setCallIsSent(false);
    closeToast();
  };

  const rejectCall = (closeToast: () => void) => {
    setCallIsSent(false);
    closeToast();
  };

  return (
    <>
      {callIsSent && <ToastContainer />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {section === "home" && <HomePage />}
          {section === "message" && (
            <ChatPage socket={socket} socketConnected={socketConnected} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MainPage;
