// import { useEffect, useState, memo } from "react";
// import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import ImageCropper from "./Crop/ImageCropper";
// import { useImageUploadMutation } from "../../utils/hooks/useImageUploadMutation";

// const EditCoverPhoto = memo(( { handleEditCoverPhoto, coverPhotoForEdit } : {handleEditCoverPhoto : any, coverPhotoForEdit: string} ) => {

//   const [open, setOpen] = useState<boolean>(false);

//   useEffect(() => {
//     if (coverPhotoForEdit) {
//       setOpen(true);
//     }
//     console.log("coverPhotoForEdit========= ", coverPhotoForEdit);
//   }, [coverPhotoForEdit]);

//   const uploadCoverPhotoMutation = useImageUploadMutation();

//   const getImage = (blob: Blob) => {
//     handleUploadCoverPhoto(blob);
//     handleOpen();
//     handleEditCoverPhoto(false)
//   };

//   const handleOpen = () => setOpen(!open);

//   const handleUploadCoverPhoto = async (coverPhoto: Blob) => {
//     console.log("blob====== ", coverPhoto);
//     if (coverPhoto) {
//       try {
//         const formData = new FormData();
//         console.log("formData", formData);

//         const reader = new FileReader();
//         reader.onload = (event) => {
//           if (event.target?.result) {
//             const filePart = event.target.result as ArrayBuffer;
//             const blobPart = new Blob([filePart], { type: coverPhoto.type });
//             formData.append("file", blobPart, "image.jpg");
//             uploadCoverPhotoMutation.mutate(formData);
//           }
//         };
//         reader.readAsArrayBuffer(coverPhoto);
//       } catch (error) {
//         console.error("Upload error:", error);
//       }
//     }
//   };


//   return (
//     <Dialog
//         open={open}
//         size="lg"
//         handler={handleOpen}
//         animate={{
//           mount: { scale: 1, y: 0 },
//           unmount: { scale: 0.9, y: -100 },
//         }}
//       >
//         <DialogHeader>
//           <div className="flex justify-between items-center w-full">
//             <div className="text-2xl">Cover Photo</div>
//             <div>
//               <AiOutlineCloseCircle
//                 className="text-3xl cursor-pointer"
//                 onClick={handleOpen}
//               />
//             </div>
//           </div>
//         </DialogHeader>
//         <DialogBody className="lg:m-4 m-2">
//           {coverPhotoForEdit ? (
//             <div className="w-auto lg:h-[28rem] h-96 ">
//               <ImageCropper
//                 image={coverPhotoForEdit}
//                 getImage={getImage}
//               />
//             </div>
//           ) : (
//             " "
//           )}
//         </DialogBody>
//       </Dialog>
//   );
// }
// )

// export default EditCoverPhoto;

