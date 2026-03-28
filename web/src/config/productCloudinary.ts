import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.Cloud_Name, 
  api_key: process.env.Cloud_API_Key, 
  api_secret: process.env.Cloud_API_Secret
});

export const uploadOnCloudunary = async (file: Blob | null): Promise<string | null> => {
    if (!file) return null;
    try {
        let arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "fullecommerce/products" },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result?.secure_url || null);
                    }
                }
            )
            uploadStream.end(buffer);
        })
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const deleteFromCloudinary = async (publicUrl: string): Promise<boolean> => {
    try {
        // Extract public ID from the URL. Example URL:
        // https://res.cloudinary.com/dxyz/image/upload/v123/fullecommerce/products/xyz.jpg
        const urlParts = publicUrl.split('/');
        const fileWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileWithExtension.split('.')[0];
        // The folder prefix needs to be included in the publicId
        const publicId = `fullecommerce/products/${fileName}`;
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result?.result === 'ok');
                }
            });
        });
    } catch (error) {
        console.log("Delete error from Cloudinary", error);
        return false;
    }
}