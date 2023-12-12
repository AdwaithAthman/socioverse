import { useMutation } from "@tanstack/react-query";
import { uploadCoverPhoto } from "../../API/Profile";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setCredentials } from "../../Redux/AuthSlice";

//importing types
import { StoreType } from "../../Redux/Store";

export const useCoverPhotoUploadMutation = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreType) => state.auth.user);
  const accessToken = useSelector((state: StoreType) => state.auth.accessToken);
  return useMutation(async (formData: FormData) => {
    console.log("file useMutation= ", formData)
    const coverPhotoData = await uploadCoverPhoto(formData);
    return coverPhotoData;
  }, {
    onSuccess: (coverPhotoData) => {
      dispatch(setCredentials({ user: { ...userInfo, coverPhoto: coverPhotoData.coverPhoto }, accessToken }))
    }
  }
  );
};
