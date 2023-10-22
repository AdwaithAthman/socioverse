import { OtpRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/otpRepositoryMongoDB";

export const otpDbRepository = (repository: ReturnType<OtpRepositoryMongoDB>) => {

    const saveNewOtp = async ({ email, otp }: { email: string, otp: number }) => await repository.saveNewOtp({ email, otp });

    const getLatestOtp = async (email: string) => await repository.getLatestOtp(email);

    return {
        saveNewOtp,
        getLatestOtp
    }
};

export type OtpDbInterface = typeof otpDbRepository;