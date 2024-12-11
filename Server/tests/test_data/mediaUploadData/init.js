// Configuring cloudinary access
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url' // open-source package to extract publicId from url
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const PATH_TO_IMG = '/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_images/heatmap3.jpeg';
const PATH_TO_VID = '/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_videos/video1.mp4';


// Heatmap upload and deletion workflow
const image_upload_response = await cloudinary.uploader.upload(PATH_TO_IMG, {
    asset_folder: 'heatmaps',
    resource_type: 'image'
})
console.log(image_upload_response, "\n");
console.log("URL:", image_upload_response.url);
console.log("publicID: ", image_upload_response.public_id);
console.log("Extracted publicID: ", extractPublicId(image_upload_response.url));

const image_del_resp = await cloudinary.uploader.destroy(
    extractPublicId(response.url),
    { resource_type: 'image' }
)

console.log("Delete response: ", image_del_resp);

// Video upload and deletion workflow
const video_upload_response = await cloudinary.uploader.upload(PATH_TO_VID, {
    asset_folder: 'videos',
    resource_type: 'video'
})
console.log(video_upload_response, "\n");
console.log("URL:", video_upload_response.url);
console.log("publicID: ", video_upload_response.public_id);
console.log("Extracted publicID: ", extractPublicId(video_upload_response.url));

const video_del_resp = await cloudinary.uploader.destroy(
    extractPublicId(video_upload_response.url),
    { resource_type: 'video' }
)