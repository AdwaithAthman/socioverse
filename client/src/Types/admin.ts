//importing types
import { User } from "./loginUser";

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