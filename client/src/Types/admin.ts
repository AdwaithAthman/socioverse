export interface AdminLoginInterface {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    status: string,
    message: string,
    accessToken: string,
}