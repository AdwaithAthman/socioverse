import { useEffect, useRef, useState } from "react";
import { ReactComponent as Loader } from "../../assets/Loader.svg";
import InputEmoji from "react-input-emoji";
import { toast } from "react-toastify";
import { TOAST_ACTION } from "../../Constants/common";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../Redux/Store";
import {
  getAllMessagesFromChat,
  sendMessage,
  sendMessageWithImg,
} from "../../API/Message";
import { ChatInterface, MessageInterface } from "../../Types/chat";
import classnames from "classnames";
import moment from "moment";
import io, { Socket } from "socket.io-client";
import common from "../../Constants/common";
import Lottie from "lottie-react";
import typingAnimation from "../../assets/animations/typing.json";
import "./index.css";
import { setFetchUserChatsAgain } from "../../Redux/ChatSlice";
import { groupByDate } from "../../utils/Config/chatMethods";
import { ImAttachment } from "react-icons/im";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { SendMessageResponse } from "../../Types/message";

let selectedChatCompare: ChatInterface;

const ChatBoxContent = ({
  socket,
  socketConnected,
}: {
  socket: Socket;
  socketConnected: boolean;
}) => {
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );

  const user = useSelector((state: StoreType) => state.auth.user);
  const [room, setRoom] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewMessage("");
    fetchMessages();
    selectedChatCompare = selectedChat as ChatInterface;
  }, [selectedChat]);

  //useEffects for handling socket events
  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageRecieved: MessageInterface) => {
        if (
          selectedChatCompare &&
          selectedChatCompare._id === newMessageRecieved.chat._id
        ) {
          setMessages([...messages, newMessageRecieved]);
          dispatch(setFetchUserChatsAgain(true));
        }
      });

      socket.on("typing", (room) => {
        setRoom(room);
        setIsTyping(true);
      });

      socket.on("stop typing", () => setIsTyping(false));
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await getAllMessagesFromChat(selectedChat._id);
      console.log("messages: ", response.messages);
      setMessages(response.messages);
      setLoading(false);
      if (socket) {
        console.log("joined room");
        socket.emit("join room", selectedChat._id);
      }
    } catch (error) {
      toast.dismiss();
      console.log("error fetching messages: ", error);
      toast.error("Error fetching messages", TOAST_ACTION);
    }
  };

  const handleSendMessage = async () => {
    try {
      socket.emit("stop typing", selectedChat?._id);
      setNewMessage("");
      let response: SendMessageResponse | null;
      if (img) {
        setImg(null);
        const formData = new FormData();
        formData.append("image", img);
        formData.append("chat", selectedChat?._id as string);
        if (newMessage) {
          formData.append("content", newMessage);
        }
        response = selectedChat && (await sendMessageWithImg(formData));
      } else {
        response =
          selectedChat && (await sendMessage(newMessage, selectedChat._id));
      }
      dispatch(setFetchUserChatsAgain(true));
      if (response && response.message) {
        const newMessage = response.message;
        response && socket.emit("new message", newMessage);
        response &&
          response.message &&
          setMessages((cur) => [...cur, newMessage]);
      }
    } catch (err) {
      console.log("error sending message: ", err);
      toast.dismiss();
      toast.error("Error sending message", TOAST_ACTION);
    }
  };

  let typingTimeout: NodeJS.Timeout;

  const typingHandler = (value: string) => {
    setNewMessage(value);

    //typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    const timerLength = 3000;

    // Clear the previous timeout
    clearTimeout(typingTimeout);

    // Set a new timeout
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat?._id);
      setTyping(false);
    }, timerLength);
  };

  // const typingHandler = (value: string) => {
  //   setNewMessage(value);
  //   if (!socketConnected) return;
  //   if (!typing) {
  //     setTyping(true);
  //     socket.emit("typing", selectedChat?._id);
  //   }
  //   const lastTypingTime = new Date().getTime();
  //   const timerLength = 3000;

  //   setTimeout(() => {
  //     const timeNow = new Date().getTime();
  //     const timeDiff = timeNow - lastTypingTime;
  //     if (timeDiff >= timerLength) {
  //       socket.emit("stop typing", selectedChat?._id);
  //       setTyping(false);
  //     }
  //   }, timerLength);
  // };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.dismiss();
      toast.error("Only image files are allowed", TOAST_ACTION);
      return;
    }
    setImg(file);
    // const formData = new FormData();
    // formData.append("image", file);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-between h-full">
          <Loader className="!bg-blue-gray-300/0 w-20 h-20" />
        </div>
      ) : (
        <>
          <div className="overflow-y-scroll flex flex-col h-full mt-4 no-scrollbar gap-2 w-full">
            {Object.entries(groupByDate(messages)).map(([date, messages]) => (
              <div key={`date+${date}`}>
                <div className="flex justify-center mt-8 mb-4">
                  <h1 className="bg-socioverse-100 rounded-xl px-2 py-1 text-xs font-thin text-blue-gray-900">
                    {date}
                  </h1>
                </div>
                <div className="flex flex-col gap-2">
                  {messages.map((message) => (
                    <div
                      key={`message+${date}+${message._id}`}
                      className={classnames(
                        "flex md:mx-4 mx-1 text-sm p-2",
                        { "justify-end": message.sender._id === user?._id },
                        { "justify-start": message.sender._id !== user?._id }
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        {selectedChat?.isGroupChat &&
                          user &&
                          message.sender._id !== user._id && (
                            <img
                              className="inline-block h-8 w-8 md:h-12 md:w-12 rounded-full"
                              src={
                                message.sender.dp
                                  ? message.sender.dp
                                  : common.DEFAULT_IMG
                              }
                              alt="user dp"
                            />
                          )}
                        <div
                          className={classnames(
                            "inline rounded-xl shadow-lg max-w-[25rem] break-words",
                            {
                              "bg-gray-100 text-black":
                                message.sender._id !== user?._id,
                            },
                            {
                              "bg-blue-gray-500/80 text-white":
                                message.sender._id === user?._id,
                            }
                          )}
                        >
                          {selectedChat?.isGroupChat &&
                            user &&
                            message.sender._id !== user._id && (
                              <h6 className="text-[0.65rem] font-thin text-left px-1 pt-1">
                                ~ {message.sender.name}
                              </h6>
                            )}
                          <div
                            className={classnames(
                              "flex flex-col",
                              {
                                "p-4":
                                  !selectedChat?.isGroupChat ||
                                  message.sender._id === user?._id,
                              },
                              {
                                "px-4 pb-2":
                                  selectedChat?.isGroupChat &&
                                  user &&
                                  message.sender._id !== user?._id,
                              }
                            )}
                          >
                            {
                              message.image && (
                                <img src={message.image} alt="image" className="mb-2 rounded-lg" />
                              )
                            }
                            <h1 className="text-sm my-1 font-normal text-left">
                              {message.content && message.content}
                            </h1>
                            <h6 className="text-[0.65rem] font-thin opacity-80 text-right">
                              {moment(message.createdAt).format("LT")}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-10 md:mx-4 mx-1">
              {isTyping && selectedChat?._id === room && (
                <div className="w-24">
                  <Lottie animationData={typingAnimation} loop={true} />
                </div>
              )}
            </div>
          </div>
          {img && (
            <div className="md:mx-4 mx-1 relative h-36 w-36 overflow-hidden">
              <img
                src={URL.createObjectURL(img)}
                alt="img"
                className="h-full w-full rounded-lg object-cover"
              />
              <AiOutlineCloseCircle
                className="text-xl cursor-pointer text-white hover:scale-105 absolute top-0 right-0 "
                onClick={() => setImg(null)}
              />
            </div>
          )}
          <div className=" md:mx-4 mx-1 md:mb-4 mb-2 flex items-center justify-between">
            <InputEmoji
              value={newMessage}
              onChange={typingHandler}
              cleanOnEnter
              onEnter={handleSendMessage}
              placeholder="Enter a message..."
              theme="auto"
              fontSize={14}
              fontFamily="sans-serif"
              keepOpened={true}
              searchMention={async (text) => {
                return ["no user"].filter((user) => user.includes(text));
              }}
            />
            <div className="mx-auto">
              <input
                type="file"
                accept="image/*"
                id="image-input"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image-input">
                <ImAttachment className="text-2xl text-[#858585] cursor-pointer hover:text-[#128b7e]" />
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatBoxContent;
