import { useCallback, useEffect, useState } from "react";
import { AiFillPicture } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ImageCropper from "../Crop/ImageCropper";
import { useCoverPhotoUploadMutation } from "../../utils/hooks/useCoverPhotoUploadMutation";
import { TOAST_ACTION } from "../../Constants/common";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";

const MyDropzone = () => {
  const [img, setImg] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const uploadCoverPhotoMutation = useCoverPhotoUploadMutation();

  useEffect(() => {
    toast.dismiss();
    uploadCoverPhotoMutation.isLoading
      ? toast.warn("Uploading...", TOAST_ACTION)
      : uploadCoverPhotoMutation.isSuccess
      ? toast.success("Cover photo updated successfully", TOAST_ACTION)
      : uploadCoverPhotoMutation.isError
      ? toast.error("Updation failed!", TOAST_ACTION)
      : "";
  }, [
    uploadCoverPhotoMutation.isLoading,
    uploadCoverPhotoMutation.isSuccess,
    uploadCoverPhotoMutation.isError,
  ]);

  const handleUploadCoverPhoto = async (coverPhoto: Blob) => {
    console.log("blob====== ", coverPhoto);
    if (coverPhoto) {
      try {
        const formData = new FormData();
        console.log("formData", formData);

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const filePart = event.target.result as ArrayBuffer;
            const blobPart = new Blob([filePart], { type: coverPhoto.type });
            formData.append("file", blobPart, "image.jpg");
            console.log("profilepicFormData", formData.get("file"))
            uploadCoverPhotoMutation.mutate(formData);
          }
        };
        reader.readAsArrayBuffer(coverPhoto);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const getImage = (blob: Blob) => {
    handleUploadCoverPhoto(blob);
    handleOpen();
  };

  const handleOpen = () => setOpen(!open);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("accepted files", acceptedFiles);
      console.log(acceptedFiles?.length);
      if (acceptedFiles?.length === 0) {
        toast.error("Invalid action!", TOAST_ACTION);
      } else {
        setImg(acceptedFiles[0]);
        console.log("objectUrl", URL.createObjectURL(acceptedFiles[0]));
        console.log("image", img);
        setOpen(true);
      }
    },
    [img]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/*": [] },
  });

  return (
    <>
      <ToastContainer />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {!isDragActive && (
          <div className=" h-44 md:h-60 lg:h-80 px-1 cursor-pointer rounded-lg w-full bg-white lg:border-4 border-2 border-gray-500 border-dashed flex items-center justify-center gap-10">
            <AiFillPicture className="lg:text-9xl text-6xl text-gray-500" />
            <div className="flex flex-col justify-center items-start">
              <h1 className="lg:text-[1.125rem] text-base">
                Drag the image here or click to select the file
              </h1>
              <p className="text-gray-500 font-light lg:text-base text-sm">
                Multiple files are not allowed
              </p>
            </div>
          </div>
        )}
      </div>
      <Dialog
        open={open}
        size="lg"
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <div className="text-2xl">Cover Photo</div>
            <div>
              <AiOutlineCloseCircle
                className="text-3xl cursor-pointer"
                onClick={handleOpen}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="lg:m-4 m-2">
          {img ? (
            <div className="w-auto lg:h-[28rem] h-96 ">
              {/* <CropImage image={URL.createObjectURL(img)} onConfirm={onConfirm} /> */}
              <ImageCropper
                image={URL.createObjectURL(img)}
                getImage={getImage}
                aspectRatio = {4/1}
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

export default MyDropzone;
