import sendMail from "../../utils/sendEmail";

export const mailSenderService = () => {

    const sendVerificationEmail = async (email: string, otp: number) => {
        try {
            const mailResponse = await sendMail(email, "Socioverse - Email Verification", `<h1>OTP for email verification is ${otp}</h1>`);
            console.log("Verification email sent successfully: ", mailResponse);
        }
        catch (err) {
            console.log("Error in sending verification email: ", err)
            throw err;
        }
    }

    const sendForgotPasswordEmail = async (email: string, otp: number) => {
        try {
            const mailResponse = await sendMail(email, "Socioverse - Forgot Password", `<h1>OTP for reseting password is ${otp}</h1>`);
            console.log("Forgot Password Email sent successfully: ", mailResponse);
        }
        catch (err) {
            console.log("Error in sending verification email: ", err)
            throw err;
        }
    }

    return {
        sendVerificationEmail,
        sendForgotPasswordEmail,
    }
}

export type MailSenderService = typeof mailSenderService;
export type MailSenderServiceReturn = ReturnType<MailSenderService>;

