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

const response = await cloudinary.uploader.upload('/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_images/heatmap3.jpeg', {
    asset_folder: 'heatmaps',
    resource_type: 'image'
})
console.log(response, "\n");
console.log("URL:", response.url);
console.log("publicID: ", response.public_id);
console.log("Extracted publicID: ", extractPublicId(response.url));

const del_resp = await cloudinary.uploader.destroy(
    extractPublicId(response.url),
    { resource_type: 'image' }
)

console.log("Delete response: ", del_resp);

