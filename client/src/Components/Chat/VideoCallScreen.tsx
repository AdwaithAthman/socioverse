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

const VideoCallScreen = ({
  openVideoCall,
  handleOpenVideoCall,
}: {
  openVideoCall: boolean;
  handleOpenVideoCall: () => void;
}) => {
  const user = useSelector((state: StoreType) => state.auth.user);
  return (
    <Dialog
      open={openVideoCall}
      size="md"
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
                handleOpenVideoCall();
              }}
            />
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-96 overflow-hidden no-scrollbar">
        Hello guys how's this video call screen
      </DialogBody>
    </Dialog>
  );
};

export default VideoCallScreen;
