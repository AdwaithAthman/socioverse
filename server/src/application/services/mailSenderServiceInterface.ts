import { MailSenderServiceReturn } from "../../frameworks/services/mailSenderService";

export const mailSenderServiceInterface = (service: MailSenderServiceReturn) => {

    const sendVerificationEmail = async (email: string, otp: number) => service.sendVerificationEmail(email, otp)

    const sendForgotPasswordEmail = async (email: string, otp: number) => service.sendForgotPasswordEmail(email, otp)

    return { 
        sendVerificationEmail, 
        sendForgotPasswordEmail 
    }
}

export type MailSenderServiceInterface = typeof mailSenderServiceInterface;