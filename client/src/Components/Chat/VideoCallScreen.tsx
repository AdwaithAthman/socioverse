import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { StoreType } from "../../Redux/Store";
import { TOAST_ACTION } from "../../Constants/common";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import AgoraUIKit, { PropsInterface, layout } from "agora-react-uikit";
import { ChatInterface } from "../../Types/chat";
import { setJoinVideoRoom } from "../../Redux/ChatSlice";

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flex: 1,
  },
};

const VideoCallScreen = ({
  openVideoCall,
  handleOpenVideoCall,
  socket,
}: {
  openVideoCall: boolean;
  handleOpenVideoCall: () => void;
  socket: Socket;
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: StoreType) => state.auth.user);
  const chat: ChatInterface = useSelector(
    (state: StoreType) => state.chat.selectedChat
  ) as ChatInterface;
  const joinedVideoRoom = useSelector(
    (state: StoreType) => state.chat.joinedVideoRoom
  );
  const [videocall, setVideocall] = useState<boolean>(true);

  const timeoutIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (socket) {
      const handleCallingDone = () => {
        toast.dismiss();
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
          toast.error("Call timed out", TOAST_ACTION);
        }, 16000);
      };

      const handleCallCancelled = (user: string) => {
        toast.dismiss();
        clearTimeout(timeoutIdRef.current);
        toast.error(`${user} has cancelled the call`, TOAST_ACTION);
      };

      const handleCallAnswered = () => {
        toast.dismiss();
        clearTimeout(timeoutIdRef.current);
        const otherUser = chat.users.filter((u) => u._id !== user?._id)[0].name;
        toast.success(`${otherUser} has accepted the call`, TOAST_ACTION);
      };

      !joinedVideoRoom && handleCallingDone();
      socket.on("call-cancelled", handleCallCancelled);
      socket.on("call-answered", handleCallAnswered);

      return () => {
        clearTimeout(timeoutIdRef.current);
        socket.off("call-cancelled", handleCallCancelled);
        socket.off("call-answered", handleCallAnswered);
      };
    }
  }, [socket, chat.users]);

  const props: PropsInterface = {
    rtcProps: {
      appId: import.meta.env.VITE_AGORA_APP_ID as string,
      channel: chat._id,
      token: null, // pass in channel token if the app is in secure mode
      layout: layout.grid,
    },
    callbacks: {
      EndCall: () => {
        setVideocall(false);
        if (joinedVideoRoom) {
          dispatch(setJoinVideoRoom(false));
        }
        handleOpenVideoCall();
      },
    },
  };

  return (
    <Dialog
      open={openVideoCall}
      size="lg"
      handler={handleOpenVideoCall}
      dismiss={{
        enabled: false,
      }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <ToastContainer />
      <DialogHeader className="pb-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center justify-between gap-5 transition-transform duration-300 mx-1 px-2 pb-3 rounded-lg cursor-pointer hover:bg-gray-200 hover:scale-105">
            <div className="pt-2">
              <h1 className="lg:text-2xl text-lg font-extrabold font-logo text-center text-socioverse-400 inline">
                SOCIOVERSE
              </h1>
              <h1 className="text-blue-gray-500 text-sm lg:text-base ">
                Video Room
              </h1>
            </div>
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 mx-2 max-h-[36rem] overflow-hidden no-scrollbar">
        <div style={styles.container}>
          {videocall ? (
            <AgoraUIKit
              rtcProps={props.rtcProps}
              callbacks={props.callbacks}
              styleProps={{
                localBtnContainer: {
                  backgroundColor: "#ff764c",
                  borderRadius: "2rem",
                  margin: "0.5rem 0 0 0",
                },
                UIKitContainer: {
                  width: "24rem",
                  height: "24rem",
                  gap: "1rem",
                },
                gridVideoContainer: {
                  gap: "1rem",
                },
              }}
            />
          ) : null}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default VideoCallScreen;
