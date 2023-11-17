import { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ReactQuillComponent from "./ReactQuill";
import common, { TOAST_ACTION } from "../../Constants/common";
import { toast, ToastContainer } from "react-toastify";
import { editPost } from "../../API/Post";
import { Link } from "react-router-dom";

//importing types
import { PostDataInterface } from "../../Types/post";

const EditPostDialogBox = ({
  open,
  handleOpen,
  post,
  setPostEdited,
}: {
  open: boolean;
  handleOpen: () => void;
  post: PostDataInterface;
  setPostEdited: React.Dispatch<React.SetStateAction<PostDataInterface | null>>;
}) => {
  const [textValue, setTextValue] = useState<string>(post.description || "");
  const [hashTagValue, setHashTagValue] = useState<string>(post.hashtags || "");
  const [data, setData] = useState<FormData>(new FormData());

  const handlePostEditSubmit = async () => {
    data.append("description", textValue);
    data.append("hashtags", hashTagValue);
    if (!textValue && !hashTagValue) {
      toast.dismiss();
      toast.error("All the fields cannot be empty!", TOAST_ACTION);
    } else {
      try {
        const response = await editPost(post._id, data);
        if (response.status === "success") {
          toast.dismiss();
          toast.success("Post updated successfully", {
            ...TOAST_ACTION,
            position: "bottom-left",
          });
          setPostEdited(response.editedPost);
        } else {
          toast.dismiss();
          toast.error("Updation failed!", {
            ...TOAST_ACTION,
            position: "bottom-left",
          });
        }
        handleOpen();
      } catch (error) {
        toast.dismiss();
        toast.error("Upload failed!", {
          ...TOAST_ACTION,
          position: "bottom-left",
        });
      }
    }
    setData(new FormData());
  };

  return (
    <>
      <Dialog
        open={open}
        size="md"
        handler={handleOpen}
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
          <Link to={`/profile/${post.userId}`}>
            <div className="flex items-center justify-between gap-5 transition-transform duration-300 mx-1 px-2 pb-3 rounded-lg cursor-pointer hover:bg-gray-200 hover:scale-105">
              <div className="mt-3 flex items-center space-x-2">
               {post.user.dp ? (
                 <img
                 className="inline-block h-12 w-12 rounded-full"
                 src={post.user.dp}
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
                   {post.user.name}
                  </span>
                  <span className="text-[11px] font-bold text-green-500">
                    Post to Connections
                  </span>
                </span>
              </div>
            </div>
            </Link>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                  e.stopPropagation();
                  handleOpen();                
                }}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll no-scrollbar">
          <div className="w-full mb-12">
            <ReactQuillComponent
              textValue={textValue}
              setTextValue={setTextValue}
            />
          </div>
          <div className="w-full">
            <Input
              label="Hashtags"
              value={hashTagValue}
              onChange={(e) => setHashTagValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                  setHashTagValue(hashTagValue + " ");
                }
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="float-left mx-4 mb-4 flex justify-between items-center w-full">
            <div></div>
            <Button
              size="sm"
              className="rounded-full bg-socioverse-500"
              onClick={handlePostEditSubmit}
            >
              Update
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditPostDialogBox;
