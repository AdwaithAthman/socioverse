import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { HiHashtag } from "react-icons/hi";
import ReactQuillComponent from "./ReactQuill";
import { FiCamera } from "react-icons/fi";
import classnames from "classnames";
import ImageCropper from "../../Crop/ImageCropper";
import { useSelector } from "react-redux";
import { usePostUploadMutation } from "../../../utils/hooks/usePostUploadMutation";
import { TOAST_ACTION } from "../../../Constants/common";
import { toast, ToastContainer } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  deleteTempPostImage,
  resetTempPostImage,
  setTempPostImage,
} from "../../../Redux/PostSlice";

//importing types
import { StoreType } from "../../../Redux/Store";
import { PostDataInterface } from "../../../Types/post";
import { Link } from "react-router-dom";

interface SelectedImages {
  blob: Blob;
  image: string;
}

const PostDialogBox = ({
  open,
  handleOpen,
  setIsLastPage,
  setPostCreated,
}: {
  open: boolean;
  handleOpen: () => void;
  setIsLastPage: React.Dispatch<React.SetStateAction<boolean>>;
  setPostCreated: React.Dispatch<
    React.SetStateAction<PostDataInterface | null>
  >;
}) => {
  const user = useSelector((state: StoreType) => state.auth.user);
  const [hashtagInputOpen, setHashtagInputOpen] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string | null>(null);
  const [hashTagValue, setHashTagValue] = useState<string | null>(null);
  const [imageCropperOpen, setImageCropperOpen] = useState<boolean>(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [data, setData] = useState<FormData>(new FormData());
  const [selectedImages, setSelectedImages] = useState<SelectedImages[]>([]);
  const tempPostImage = useSelector((state: StoreType) => state.post.image);

  const dispatch = useDispatch();

  const handleHashTagInputOpen = () => setHashtagInputOpen(!hashtagInputOpen);
  const handleImageCropperOpen = () => setImageCropperOpen(!imageCropperOpen);

  const uploadPost = usePostUploadMutation();

  const handleUploadPostImage = async (blobArray: Blob[], data: FormData) => {
    if (blobArray.length > 0) {
      try {
        blobArray.forEach((blob, index) => {
          data.append("files", blob, `image${index}.jpg`);
        });
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const getImage = (blob: Blob) => {
    setSelectedImages((prev) => [
      ...prev,
      { blob, image: URL.createObjectURL(blob) },
    ]);
    handleImageCropperOpen();
  };

  const handlePostImageToCrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setImgFile(selectedFile);
        setImageCropperOpen(true);
      } else {
        toast.warn("Only image files are allowed!", TOAST_ACTION);
      }
    }
  };

  const handlePostSubmit = async () => {
    if (tempPostImage && tempPostImage.length > 0) {
      const blobArray = selectedImages.map((img) => img.blob);
      await handleUploadPostImage(blobArray, data);
      // formData && setData(formData);
    }
    textValue && data.append("description", textValue);
    hashTagValue && data.append("hashtags", hashTagValue);
    if (
      !textValue &&
      !hashTagValue &&
      (!tempPostImage || tempPostImage.length === 0)
    ) {
      toast.dismiss();
      toast.error("All the fields cannot be empty!", TOAST_ACTION);
    } else {
      try {
        console.log("req.files content: ", data.get("files"));
        const response = uploadPost.mutateAsync(data);
        toast.promise(
          response,
          {
            pending: "Uploading the post...",
            success: "Post uploaded successfully",
            error: "Upload failed!",
          },
          { ...TOAST_ACTION, position: "bottom-left", closeButton: false }
        );
        if (await (response || uploadPost.isSuccess)) {
          setIsLastPage(false);
          toast.dismiss();
          setPostCreated((await response).post);
        } else {
          toast.dismiss();
        }
        handleOpen();
        setHashTagValue(null);
        setTextValue(null);
        setImgFile(null);
        dispatch(resetTempPostImage());
        setSelectedImages([]);
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

  const handleDeleteTempPostImage = (image: string) => {
    dispatch(deleteTempPostImage(image));
    setSelectedImages((prev) => prev.filter((img) => img.image !== image));
  };

  console.log("tempPostImage: ", tempPostImage);

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
            <div className="flex items-center justify-between gap-5 transition-transform duration-300 mx-1 px-2 pb-3 rounded-lg cursor-pointer hover:bg-gray-200 hover:scale-105">
              {user && (
                <Link to={`/profile/${user._id}`}>
                  <div className="mt-3 flex items-center space-x-2">
                    <img
                      className="inline-block h-12 w-12 rounded-full"
                      src={
                        user.dp
                          ? user.dp
                          : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                      }
                      alt="user dp"
                    />
                    <span className="flex flex-col">
                      <span className="text-[14px] font-bold text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-[11px] font-bold text-green-500">
                        Post to Connections
                      </span>
                    </span>
                  </div>
                </Link>
              )}
            </div>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={handleOpen}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll">
          <div className="w-full mb-12">
            <ReactQuillComponent
              textValue={textValue}
              setTextValue={setTextValue}
            />
          </div>
          {hashtagInputOpen && (
            <div className="w-full">
              <Input
                label="Hashtags"
                value={hashTagValue || ""}
                onChange={(e) => setHashTagValue(e.target.value)}
              />
            </div>
          )}
          {tempPostImage && tempPostImage.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="border border-black/20 py-10 flex flex-col gap-5">
                {tempPostImage.map((image, index) => (
                  <div
                    className="h-[19rem] w-full relative"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                    key={index}
                  >
                    <div className="absolute flex gap-3 bottom-3 right-16">
                      <div className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group opacity-70 hover:opacity-100">
                        <RiDeleteBin6Line
                          className="text-xl text-white group-hover:text-red-500"
                          onClick={() => handleDeleteTempPostImage(image)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {tempPostImage.length === 5 && (
                <em className="text-sm font-light text-right pr-1">
                  * Max of 5 images are allowed!
                </em>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <div className="float-left mx-4 mb-4 flex justify-between items-center w-full">
            <div className="flex justify-between items-center gap-3 mx-2">
              <div
                className={classnames(
                  "flex justify-center items-center border-2 w-8 h-8 rounded-full cursor-pointer hover:border-socioverse-500 group",
                  { "border-socioverse-500": hashtagInputOpen },
                  { "border-black": !hashtagInputOpen }
                )}
                onClick={handleHashTagInputOpen}
              >
                <HiHashtag
                  className={classnames(
                    "text-2xl group-hover:text-socioverse-500",
                    { "text-socioverse-500": hashtagInputOpen },
                    { "text-black": !hashtagInputOpen }
                  )}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                id="image-input"
                className="hidden"
                onChange={handlePostImageToCrop}
                disabled={tempPostImage?.length === 5}
              />
              <label
                htmlFor="image-input"
                className="flex justify-center items-center text-black border-black border-2 w-8 h-8 rounded-full cursor-pointer hover:border-socioverse-500 group"
              >
                <FiCamera className="text-xl group-hover:text-socioverse-500" />
              </label>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-socioverse-500"
              onClick={handlePostSubmit}
            >
              Post
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* image cropper dialog */}
      <Dialog
        open={imageCropperOpen}
        size="lg"
        handler={handleImageCropperOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl">Image</div>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={handleImageCropperOpen}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="lg:m-4 m-2">
          {imgFile ? (
            <div className="w-auto lg:h-[28rem] h-96 ">
              <ImageCropper
                image={URL.createObjectURL(imgFile)}
                getImage={getImage}
                aspectRatio={1.5 / 1}
              />
            </div>
          ) : (
            " "
          )}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default PostDialogBox;
