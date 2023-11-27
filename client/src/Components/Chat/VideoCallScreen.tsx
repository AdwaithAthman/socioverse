import {
  Dialog,
  DialogBody,
  DialogHeader,
  useSelect,
} from "@material-tailwind/react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { StoreType } from "../../Redux/Store";
import common from "../../Constants/common";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import AgoraUIKit, { PropsInterface, layout } from "agora-react-uikit";
import { ChatInterface } from "../../Types/chat";

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flex: 1,
    // flexDirection: "row",
    // "@media (max-width: 768px)": {
    //   flexDirection: "column",
    // },
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
  const user = useSelector((state: StoreType) => state.auth.user);
  const chat: ChatInterface = useSelector(
    (state: StoreType) => state.chat.selectedChat
  ) as ChatInterface;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const otherUserVideo = useRef<HTMLVideoElement | null>(null);
  const [videocall, setVideocall] = useState<boolean>(true);

  const props: PropsInterface = {
    rtcProps: {
      appId: import.meta.env.VITE_AGORA_APP_ID as string,
      channel: chat._id,
      token: null, // pass in channel token if the app is in secure mode
      layout: layout.grid,
    },
    callbacks: {
      EndCall: () => setVideocall(false),
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
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center justify-between gap-5 transition-transform duration-300 mx-1 px-2 pb-3 rounded-lg cursor-pointer hover:bg-gray-200 hover:scale-105">
            <div className="mt-3 flex items-center space-x-2">
              {user && user.dp ? (
                <img
                  className="inline-block h-12 w-12 rounded-full"
                  src={user.dp}
                  alt="Profile Picture"
                />
              ) : (
                <img
                  className="inline-block h-12 w-12 rounded-full"
                  src={common.DEFAULT_IMG}
                  alt="Profile Picture"
                />
              )}
              <span className="flex flex-col">
                <span className="text-[14px] font-bold text-gray-900">
                  {user && user.name}
                </span>
                <span className="text-[11px] font-bold text-green-500">
                  @{user && user.username}
                </span>
              </span>
            </div>
          </div>
          <div>
            <AiOutlineCloseCircle
              className="text-3xl cursor-pointer"
              onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                e.stopPropagation();
                if (stream) {
                  stream.getTracks().forEach((track) => {
                    track.stop();
                  });
                  setStream(() => null);
                }
                handleOpenVideoCall();
              }}
            />
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[32rem] overflow-hidden no-scrollbar">
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
