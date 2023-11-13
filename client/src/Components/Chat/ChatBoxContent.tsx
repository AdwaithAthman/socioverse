import { useEffect, useState } from "react";
import { ReactComponent as Loader } from "../../assets/Loader.svg";
import InputEmoji from "react-input-emoji";
import { toast } from "react-toastify";
import { TOAST_ACTION } from "../../Constants/common";
import { useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { getAllMessagesFromChat, sendMessage } from "../../API/Message";
import { MessageInterface } from "../../Types/chat";
import classnames from "classnames";
import moment from "moment";

const ChatBoxContent = () => {
  const selectedChat = useSelector(
    (state: StoreType) => state.chat.selectedChat
  );
  const user = useSelector((state: StoreType) => state.auth.user);

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await getAllMessagesFromChat(selectedChat._id);
      console.log("messages: ", response.messages);
      setMessages(response.messages);
      setLoading(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Error fetching messages", TOAST_ACTION);
    }
  };

  const handleSendMessage = async () => {
    try {
      setNewMessage("");
      const response =
        selectedChat && (await sendMessage(newMessage, selectedChat._id));
      console.log("send message response: ", response);
      response && setMessages((cur) => [...cur, response.message]);
    } catch (err) {
      toast.dismiss();
      toast.error("Error sending message", TOAST_ACTION);
    }
  };

  const typingHandler = (value: string) => {
    setNewMessage(value);

    //typing indicator logic
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
                <div
                  className={classnames(
                    "inline p-4 rounded-xl shadow-lg max-w-[25rem] break-words",
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
                  <div className="flex flex-col">
                    <h1 className="text-sm mb-1 font-normal text-left">
                      {message.content}
                    </h1>
                    <h6 className="text-[0.65rem] font-thin opacity-80 text-right">
                      {moment(message.createdAt).format("LT")}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
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
