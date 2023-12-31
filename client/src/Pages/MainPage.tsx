import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChatPage, HomePage, PeoplePage } from "../lazyComponents";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../Redux/Store";
import { Suspense, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ChatInterface, MessageInterface } from "../Types/chat";
import common, { TOAST_ACTION } from "../Constants/common";
import {
  initializeNotification,
  setFetchUserChatsAgain,
  setJoinVideoRoom,
  setNotification,
  setOpenVideoCall,
  setSelectedChat,
} from "../Redux/ChatSlice";
import { addNotification } from "../API/User";
import { fetchNotifications } from "../API/Message";
import { toast } from "react-toastify";
import { User } from "../Types/loginUser";
import { Button } from "@material-tailwind/react";
import HomePageLoading from "../Components/Skeletons/HomePageLoading";
import ChatPageLoading from "../Components/Skeletons/ChatPageLoading";
import PeoplePageLoading from "../Components/Skeletons/PeoplePageLoading";

let socket: Socket, selectedChatCompare: ChatInterface;

const MainPage = () => {
  const section = useParams().section || "home";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: StoreType) => state.auth.user);
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    if (section !== "home" && section !== "message" && section !== "people")
      navigate("/error");
  }, [navigate, section]);

  //people section is only available in mobile and medium screens
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    // Redirect if window is larger than medium breakpoint
    if (windowWidth > 959 && section === "people") {
      navigate("/error");
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth, navigate, section]);

  //for socket purpose
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const notification = useSelector(
    (state: StoreType) => state.chat.notification
  );

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
      socket.on("call-made", (callerInfo: User, chat: ChatInterface) => {
        toast.dismiss();
        toast.info(
          ({ closeToast }) => (
            <div>
              Incoming call from {callerInfo.name}
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  className="rounded-full text-black border-black"
                  onClick={() => answerCall(chat, closeToast as () => void)}
                >
                  Answer
                </Button>
                <Button
                  className="rounded-full bg-socioverse-500"
                  size="sm"
                  onClick={() => rejectCall(chat, closeToast as () => void)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ),
          {
            ...TOAST_ACTION,
            closeButton: false,
            autoClose: 15000,
          }
        );
      });
    }
  });

  const addNotif = async (messageId: string) => {
    await addNotification(messageId);
  };

  const answerCall = (chat: ChatInterface, closeToast: () => void) => {
    const callerId = chat.users.filter(
      (oneUser) => oneUser._id !== user?._id
    )[0]._id;
    socket.emit("call-accepted", callerId);
    dispatch(setSelectedChat(chat));
    dispatch(setJoinVideoRoom(true));
    if (location.pathname !== "/message") navigate("/message");
    dispatch(setOpenVideoCall(true));
    closeToast();
  };

  const rejectCall = (chat: ChatInterface, closeToast: () => void) => {
    handleCallRejection(chat);
    closeToast();
  };

  const handleCallRejection = (chat: ChatInterface) => {
    const callerId = chat.users.filter(
      (oneUser) => oneUser._id !== user?._id
    )[0]._id;
    socket.emit("call-rejected", callerId, user?.name);
  };

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
          {section === "home" && (
            <Suspense fallback={<HomePageLoading />}>
              <HomePage socket={socket} />
            </Suspense>
          )}
          {section === "message" && (
            <Suspense fallback={<ChatPageLoading />}>
              <ChatPage socket={socket} socketConnected={socketConnected} />
            </Suspense>
          )}
          {section === "people" && (
            <div className="block lg:hidden">
              <Suspense fallback={<PeoplePageLoading />}>
                <PeoplePage socket={socket} />
              </Suspense>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MainPage;
