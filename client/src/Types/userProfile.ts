import { MessageInterface } from "./chat";
import { User } from "./loginUser";

export interface UploadCoverPhotoResponse {
    status: string,
    message: string,
    coverPhoto: string,
}

export interface UploadProfilePhotoResponse {
    status: string, 
    message: string, 
    dp: string,
}

export interface GetUserInfoResponse {
    status: string,
    message: string,
    user: User
}

export interface GetOtherUserInfoResponse {
    status: string,
    message: string,
    otherUser: User,
}

export interface DeleteCoverPhotoResponse {
    status: string,
    message: string,
}

export interface DeleteProfilePhotoResponse {
    status: string,
    message: string,
}

export interface ChangePasswordResponse {
    status: string, 
    message: string,
}

export interface EditProfileResponse {
    status: string,
    message: string,
    user: User
}

export interface UserInfo {
    name?: string;
    username?: string;
    email?: string;
    phoneNumber?: number;
    bio?: string;
    gender?: string;
    city?: string;
    isAccountVerified?: boolean;
}

export interface GetRestOfUsersResponse {
    status: string,
    message: string,
    users: User[]
}

export interface GetFollowersResponse {
    status: string,
    message: string,
    followers: User[]
}
export interface GetFollowingResponse {
    status: string,
    message: string,
    following: User[]
}

export interface FollowUserResponse {
    success: boolean;
    message: string;
}

export interface GetSearchUsersInterface {
    status: string,
    message: string,
    users: User[]
}

export interface AddUsernameResponse {
    status: string, 
    message: string,
}

export interface FetchNotificationsResponse {
    status: string,
    message: string,
    notifications: MessageInterface[]
}

export interface GetSuggestionsResponse {
    status: string,
    message: string,
    suggestions: User[]
}