import axiosUserInstance from "../AxiosInstance/axiosUserInstance";
import END_POINTS from "../../Constants/endpoints";

//importing types
import {
  DeleteCoverPhotoResponse,
  DeleteProfilePhotoResponse,
  UploadCoverPhotoResponse,
  UploadProfilePhotoResponse,
  ChangePasswordResponse,
  EditProfileResponse,
  UserInfo,
  GetUserInfoResponse,
  GetOtherUserInfoResponse,
  GetSearchUsersInterface,
  AddUsernameResponse,
} from "../../Types/userProfile";

export const uploadCoverPhoto = async (
  formData: FormData
): Promise<UploadCoverPhotoResponse> => {
  const response = await axiosUserInstance.post<UploadCoverPhotoResponse>(
    END_POINTS.UPLOAD_COVER_PHOTO,
    formData,
    {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    }
  );
  return response.data;
};

export const uploadProfilePhoto = async (
  formData: FormData
): Promise<UploadProfilePhotoResponse> => {
  const response = await axiosUserInstance.post<UploadProfilePhotoResponse>(
    END_POINTS.UPLOAD_PROFILE_PHOTO,
    formData,
    {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    }
  );
  return response.data;
};

export const getUserInfo = async (): Promise<GetUserInfoResponse> => {
  const response = await axiosUserInstance.get<GetUserInfoResponse>(
    END_POINTS.GET_USER_INFO
  );
  return response.data;
};

export const getOtherUserInfo = async (
  id: string
): Promise<GetOtherUserInfoResponse> => {
  const response = await axiosUserInstance.get<GetOtherUserInfoResponse>(
    `${END_POINTS.GET_OTHER_USER_INFO}/${id}`
  );
  return response.data;
};

export const deleteCoverPhoto = async (): Promise<DeleteCoverPhotoResponse> => {
  const response = await axiosUserInstance.delete<DeleteCoverPhotoResponse>(
    END_POINTS.DELETE_COVER_PHOTO
  );
  return response.data;
};

export const deleteProfilePhoto =
  async (): Promise<DeleteProfilePhotoResponse> => {
    const response = await axiosUserInstance.delete<DeleteProfilePhotoResponse>(
      END_POINTS.DELETE_PROFILE_PHOTO
    );
    return response.data;
  };

export const changePassword = async (password: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ChangePasswordResponse> => {
  const response = await axiosUserInstance.patch<ChangePasswordResponse>(
    END_POINTS.CHANGE_PASSWORD,
    password
  );
  return response.data;
};

export const editProfile = async (
  userInfo: UserInfo
): Promise<EditProfileResponse> => {
  const response = await axiosUserInstance.patch<EditProfileResponse>(
    END_POINTS.EDIT_PROFILE,
    userInfo
  );
  return response.data;
};

export const searchUsers = async (
  searchQuery: string
): Promise<GetSearchUsersInterface> => {
  const encodedSearchQuery = encodeURIComponent(searchQuery);
  const response = await axiosUserInstance.get<GetSearchUsersInterface>(
    `${END_POINTS.SEARCH_USERS}?searchQuery=${encodedSearchQuery}`
  );
  return response.data;
};

export const addUsername = async (
  username: string
): Promise<AddUsernameResponse> => {
  const response = await axiosUserInstance.patch<AddUsernameResponse>(
    END_POINTS.ADD_USERNAME,
    { username }
  );
  return response.data;
};
