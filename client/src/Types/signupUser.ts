export interface SignupUserInterface {
    name: string,
    username?: string,
    email: string,
    phoneNumber?: number,
    password: string
}

export interface SignupUserResponse {
    message?: string,
    status: string
}

export interface UsernameAvailabilityResponse {
    available: boolean,
    status: string
}