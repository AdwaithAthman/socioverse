import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import { ReactComponent as LoginAlertSvg } from "../../assets/LoginAlertSvg.svg";
import { useNavigate } from "react-router-dom";
import { setSharedPostId } from "../../Redux/PostSlice";
import { useDispatch } from "react-redux";

const NotLoggedInAlert = ({
  openAlert,
  handleOpenAlert,
  postId,
}: {
  openAlert: boolean;
  handleOpenAlert: () => void;
  postId: string;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <Dialog
      open={openAlert}
      size="md"
      handler={handleOpenAlert}
      dismiss={{
        enabled: false,
      }}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl">Login Alert</div>
          <div></div>
        </div>
      </DialogHeader>
      <DialogBody className="mx-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="text-md w-full border-2 p-4 rounded-lg bg-red-50 border-red-500">
            Inorder to view the post, user must be logged in.
          </div>
          <div className="w-96 h-96 mb-4 px-4 md:px-0">
            <LoginAlertSvg />
          </div>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto "
            onClick={() => {
              dispatch(setSharedPostId(postId));
              navigate("/login");
            }}
          >
            Login
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default NotLoggedInAlert;
