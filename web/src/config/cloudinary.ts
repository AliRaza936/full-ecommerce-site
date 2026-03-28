
import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({ 
  cloud_name:process.env.Cloud_Name, 
  api_key: process.env.Cloud_API_Key, 
  api_secret: process.env.Cloud_API_Secret
});

const uploadOnCloudunary = async(file:Blob):Promise<string | null >=>{
    if(!file) return null;
    try {
        let arrayBuffer = await file.arrayBuffer();
        let buffer  = Buffer.from(arrayBuffer);
        return new Promise((resolve,reject)=>{
            const uploadSteam = cloudinary.uploader.upload_stream(
                {resource_type:"auto", folder:"fullecommerce/profile"},
                (error, result) => {
                    if(error){
                        reject(error);
                    }else{
                        resolve(result?.secure_url || null);
                    }
                }
            )
            uploadSteam.end(buffer);
        })

    } catch (error) {
        console.log(error)
        return null;
    }
}
export default uploadOnCloudunary;