import { Document, Schema, model } from "mongoose";
import sendVerificationEmail from "../../../../utils/sendEmail";

interface OtpInterface extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

const otpSchema = new Schema<OtpInterface>({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    }
})

// otpSchema.pre("save", async function (next) {
//     if(this.isNew){
//         await sendVerificationEmail(this.email, Number(this.otp))
//     }
//     next();
// })

const Otp = model<OtpInterface>("Otp", otpSchema);

export default Otp;
