// Configuring cloudinary access
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url' // open-source package to extract publicId from url
dotenv.config();
cloudinary.config({
    cloud_name: "dhvimkgc4",
    api_key: 875227854865192,
    api_secret: "rXYdLtTiWyKFtfxt5WdjJQBHSQU"
})

const response = await cloudinary.uploader.upload('/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_images/heatmap2.jpeg', {
    asset_folder: 'heatmaps',
    resource_type: 'image'})
console.log(response, "\n");
console.log("URL:", response.url);
console.log("publicID: ", response.public_id);
console.log("Extracted publicID: ",extractPublicId(response.url));
