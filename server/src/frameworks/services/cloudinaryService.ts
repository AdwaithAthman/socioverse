import {v2 as cloudinary} from 'cloudinary';
import configKeys from '../../config';

cloudinary.config({
    cloud_name: configKeys.CLOUDINARY_CLOUD_NAME,
    api_key: configKeys.CLOUDINARY_API_KEY,
    api_secret: configKeys.CLOUDINARY_API_SECRET,
  });

  
export const cloudinaryService = () => {
    
  async function handleUpload(file: string) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

  return { handleUpload }

}

  export type CloudinaryService = typeof cloudinaryService;
  export type CloudinaryServiceReturn = ReturnType<CloudinaryService>;
  