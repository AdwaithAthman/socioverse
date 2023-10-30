//importing types
import { User } from "./loginUser";
import { CommentInterface, PostDataInterface, ReplyInterface } from "./post";

export interface AdminLoginInterface {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    status: string,
    message: string,
    accessToken: string,
}

export interface GetUsersResponse {
    status: string,
    message: string,
    users: User[],
}

export interface GetAllPostsResponse {
    status: string,
    messsage: string,
    posts: PostDataInterface[],
}

export interface ReportInfoInterface {
    reports: {
        userId: string,
        label: string,
        user: {
            _id: string,
            name: string,
            username: string,
            email: string,
            dp?: string,
        }
    }
}

export interface GetReportInfoResponse {
    status: string,
    message: string,
    reportInfo: ReportInfoInterface[],
}

export interface GetAllCommentsResponse {
    status: string,
    message: string,
    comments: CommentInterface
}

export interface GetAllRepliesResponse {
    status: string,
    message: string,
    replies: ReplyInterface
}
