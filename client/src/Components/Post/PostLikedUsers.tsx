import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";

//importing types
import { User } from "../../Types/loginUser";
import common from "../../Constants/common";

const PostLikedUsers = ({
  likedUsers,
  openLikedUsersDialog,
  handleOpenLikedUsersDialog,
}: {
  likedUsers: User[];
  openLikedUsersDialog: boolean;
  handleOpenLikedUsersDialog: () => void;
}) => {
  return (
    <Dialog
      open={openLikedUsersDialog}
      size="xs"
      handler={handleOpenLikedUsersDialog}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-semibold">Liked by</h1>
          <div>
            <AiOutlineCloseCircle
              className="text-3xl cursor-pointer"
              onClick={handleOpenLikedUsersDialog}
            />
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
        <div className="flex flex-col gap-2 ">
          {likedUsers.length > 0 ? (
            likedUsers.map((userProfile) => (
              <div
                className="flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg"
                key={userProfile._id}
              >
                <Link to={`/profile/${userProfile._id}`}>
                  <div className="mt-3 flex items-center space-x-2">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={
                        userProfile.dp
                          ? userProfile.dp
                          : common.DEFAULT_IMG
                      }
                      alt="user dp"
                    />
                    <span className="flex flex-col">
                      <span className="text-[14px] font-medium text-gray-900">
                        {userProfile?.name}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500">
                        {userProfile.username
                          ? `@${userProfile.username}`
                          : "@ -"}
                      </span>
                    </span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <em className="text-lg font-light">No likes yet</em>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter children={undefined}></DialogFooter>
    </Dialog>
  );
};

export default PostLikedUsers;
