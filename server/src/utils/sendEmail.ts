
import nodemailer from 'nodemailer';
import configKeys from "../config";

const sendMail = async (email: string, title: string, body: string) => {
    try{
        //Create a Transporter to send emails
        let transporter = nodemailer.createTransport({
            host: configKeys.MAIL_HOST,
            port: Number(configKeys.MAIL_PORT),
            secure: true,
            auth: {
                user: configKeys.MAIL_USERNAME,
                pass: configKeys.MAIL_PASSWORD,
            }
        });

        //Send emails to users
        let info = await transporter.sendMail({
            from: configKeys.MAIL_USERNAME,
            to: email,
            subject: title,
            html: body,
        });
        console.log("Email info: ", info);
        return info;

    }
    catch(err){
        console.log(err);
    }
}

export default sendMail;