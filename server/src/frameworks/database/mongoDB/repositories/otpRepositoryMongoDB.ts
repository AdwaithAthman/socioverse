import Otp from "../models/otpModel";

export const otpRepositoryMongoDB = () => {
    const saveNewOtp = async ({ email, otp }: { email: string, otp: number }) => {
        try {
            const otpObj = new Otp({ email, otp });
            const savedOtp = await otpObj.save();
            return savedOtp;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in saving otp!");
        }
    }

    const getLatestOtp = async (email: string) => {
        try{
            const otpObj = await Otp.findOne({ email }).sort({ createdAt: -1 });
            return otpObj;
        }
        catch(err){
            console.log(err);
            throw new Error ("Error in getting otp!");
        }
    }

    return {
        saveNewOtp,
        getLatestOtp,
    }
}

export type OtpRepositoryMongoDB = typeof otpRepositoryMongoDB;