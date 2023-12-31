import dotenv from 'dotenv';
dotenv.config();

const configKeys = {
PORT: process.env.PORT,
IP_ADDRESS: parseInt(process.env.IP_ADDRESS as string) as number,
CLIENT_URL: process.env.CLIENT_URL as string,
MONGO_URL: process.env.MONGO_URL as string,
JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
MAIL_HOST: process.env.MAIL_HOST as string,
MAIL_PORT: process.env.MAIL_PORT as string,
MAIL_USERNAME: process.env.MAIL_USERNAME as string,
MAIL_PASSWORD: process.env.MAIL_PASSWORD as string,
ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
REDIS_URL: {
    password: process.env.REDIS_PASSWORD as string,
    socket: {
        host: process.env.REDIS_HOST as string,
        port: parseInt(process.env.REDIS_PORT as string) as number
    }
}
}

export default configKeys;