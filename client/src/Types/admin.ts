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

export interface GetAllReportedCommentsResponse {
    status: string,
    message: string,
    reportedComments: CommentInterface[],
}

export interface GetAllReportedRepliesResponse {
    status: string,
    message: string,
    reportedReplies: ReplyInterface[],
}

export interface GetCommentReportedUsers {
    status: string,
    message: string,
    reportedUsers: User[],
}

export interface GetAllReportedRepliesResponse {
    status: string,
    message: string,
    reportedReplies: ReplyInterface[],
}

export interface GetReplyReportedUsers {
    status: string,
    message: string,
    reportedUsers: User[],
}

export interface MonthlyUsersInterface {
    month: number,
    users: number,
    count: number,
}

export interface GetMonthlyUsersResponse {
    status: string,
    message: string,
    monthlyUserSignups: MonthlyUsersInterface[]
}

export interface MonthlyPostsInterface {
    month: number,
    users: number,
    count: number,
}

export interface GetMonthlyPostsResponse {
    status: string,
    message: string,
    monthlyPosts: MonthlyPostsInterface[],
}