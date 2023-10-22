import { CloudinaryServiceReturn } from '../../frameworks/services/cloudinaryService';

export const cloudinaryServiceInterface = ( service: CloudinaryServiceReturn ) => {

    const handleUpload = async( file: string ) => service.handleUpload(file)

    return { handleUpload }
}

export type CloudinaryServiceInterface = typeof cloudinaryServiceInterface;