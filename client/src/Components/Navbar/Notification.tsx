import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import classnames from "classnames";
import { AiOutlineCloseCircle } from "react-icons/ai";
import common from "../../Constants/common";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { MessageInterface } from "../../Types/chat";
import { deleteNotification, setSelectedChat } from "../../Redux/ChatSlice";
import { deleteNotificationFromDB } from "../../API/User";
import { useLocation, useNavigate } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";

const Notification = ({
  handleNotificationPanel,
  notificationPanelOpen,
}: {
  handleNotificationPanel: () => void;
  notificationPanelOpen: boolean;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useSelector(
    (state: StoreType) => state.chat.notification
  );

  const handleNotificationOnClick = async (notif: MessageInterface) => {
    dispatch(setSelectedChat(notif.chat));
    dispatch(deleteNotification(notif));
    await deleteNotificationFromDB(notif._id);
    closeNotificationPanel();
    if (location.pathname !== "/message") {
      navigate("/message");
    }
  };

  const handleCloseNotification = async (notif: MessageInterface) => {
    dispatch(deleteNotification(notif));
    await deleteNotificationFromDB(notif._id);
  };

  const closeNotificationPanel = () => {
    const bellButton = document.getElementById("bell-button");
    if (bellButton) {
      bellButton.click();
    }
  };

  return (
    <Popover
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 50 },
      }}
      placement="bottom-end"
      offset={20}
      dismiss={{ enabled: false }}
    >
      <PopoverHandler onClick={handleNotificationPanel}>
        <div className="relative">
          <div
            className={classnames(
              "flex justify-center items-center w-8 h-8 rounded-full hover:bg-blue-gray-100 transition duration-100 ease-in-out group hover:cursor-pointer",
              { "bg-blue-gray-100": notificationPanelOpen },
              { "bg-black": !notificationPanelOpen }
            )}
            id="bell-button"
          >
            <div
              className={classnames(
                "text-2xl transition duration-100 ease-in-out group-hover:text-socioverse-500",
                { "text-socioverse-500": notificationPanelOpen },
                { "text-blue-gray-500": !notificationPanelOpen }
              )}
            >
              <IoNotifications />
            </div>
          </div>
          {notification.length > 0 && (
            <span
              className="absolute bottom-5 left-5 inline-flex items-center justify-center px-1 py-1 mr-2 text-[0.5rem]
                         font-bold leading-none text-white bg-red-600 rounded-full"
            >
              {notification.length}
            </span>
          )}
        </div>
      </PopoverHandler>
      <PopoverContent
        className=" z-[999] w-[20rem] md:w-[26rem] max-h-[34rem] overflow-y-scroll 
                overflow-x-hidden no-scrollbar p-0 ml-12"
      >
        <div className="p-3 md:p-6 bg-black bg-opacity-20 flex flex-col gap-3 md:gap-5 justify-center">
          {notification.length > 0 ? (
            notification.map((notif) => (
              <div
                className="w-full rounded-lg border shadow-lg bg-white hover:scale-95 
                          transition duration-100 ease-in-out group"
                key={notif._id}
              >
                <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
                  <div className="flex items-start justify-between ">
                    <div
                      className="s) => setLimt-3 flex items-center space-x-2 cursor-pointer "
                      onClick={() => handleNotificationOnClick(notif)}
                    >
                      <img
                        className="inline-block h-8 w-8 md:h-12 md:w-12 rounded-full 
                                group-hover:scale-95 group-hover:p-[0.15rem] group-hover:ring group-hover:ring-blue-gray-500"
                        src={
                          notif.chat.isGroupChat
                            ? notif.chat.groupDp
                            : notif.sender.dp
                            ? notif.sender.dp
                            : common.DEFAULT_IMG
                        }
                        alt="dp"
                      />
                      <span className="flex flex-col">
                        <span
                          className={classnames(
                            "text-[14px] group-hover:font-bold group-hover:scale-95"
                          )}
                        >
                          {notif.chat.isGroupChat
                            ? notif.chat.chatName
                            : notif.sender.name}
                        </span>
                        <span
                          className={classnames(
                            "text-[11px] group-hover:font-bold group-hover:scale-95"
                          )}
                        >
                          New unread message!
                        </span>
                      </span>
                    </div>
                    <AiOutlineCloseCircle
                      className="h-5 w-5 hover:scale-110 hover:text-socioverse-400 z-40 cursor-pointer"
                      onClick={() => handleCloseNotification(notif)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full rounded-lg border shadow-lg bg-white">
              <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
                No new message.
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
