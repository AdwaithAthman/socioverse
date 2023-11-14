import { useEffect, useRef, useState } from "react";
import { ReactComponent as Loader } from "../../assets/Loader.svg";
import InputEmoji from "react-input-emoji";
import { toast } from "react-toastify";
import { TOAST_ACTION } from "../../Constants/common";
import { useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { getAllMessagesFromChat, sendMessage } from "../../API/Message";
import { ChatInterface, MessageInterface } from "../../Types/chat";
import classnames from "classnames";
import moment from "moment";
import io, { Socket } from "socket.io-client";
import common from "../../Constants/common";

let socket: Socket, selectedChatCompare: ChatInterface;

const ChatBoxContent = () => {
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const user = useSelector((state: StoreType) => state.auth.user);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  //socket io connection
  useEffect(() => {
    socket = io(common.API_BASE_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    

    return () => {
      socket.off("connected");
      socket.off("setup");
      // socket.off("typing");
      // socket.off("stop typing");
    };
  }, []);

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    setNewMessage("");
    fetchMessages();
    selectedChatCompare = selectedChat as ChatInterface;
  }, [selectedChat]);


//useEffects for handling socket events
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: MessageInterface) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //show notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });

    socket.on("typing", (room) => {
      setRoom(room);
      setIsTyping(true);
    });

    socket.on("stop typing", () => setIsTyping(false));
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
      const response =
        selectedChat && (await sendMessage(newMessage, selectedChat._id));
      console.log("send message response: ", response);
      response && socket.emit("new message", response.message);
      response && setMessages((cur) => [...cur, response.message]);
    } catch (err) {
      console.log("error sending message: ", err);
      toast.dismiss();
      toast.error("Error sending message", TOAST_ACTION);
    }
  };

  const typingHandler = (value: string) => {
    setNewMessage(value);

    //typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    console.log("typing status outside setTimeout:", typing)

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      console.log("typing status of typing:", typing)
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
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
            {messages.map((message) => (
              <div
                key={message._id}
                className={classnames(
                  "flex mx-4 text-sm p-2",
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
                            : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
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
                      <h1 className="text-sm my-1 font-normal text-left">
                        {message.content}
                      </h1>
                      <h6 className="text-[0.65rem] font-thin opacity-80 text-right">
                        {moment(message.createdAt).format("LT")}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-10">
              {isTyping && selectedChat?._id === room && (
                <div>Loading ....</div>
              )}
            </div>
          </div>
          <div className=" mx-4 mb-4">
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
          </div>
        </>
      )}
    </>
  );
};

export default ChatBoxContent;
