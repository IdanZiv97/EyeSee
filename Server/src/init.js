import uuidv4 from 'uuid';
import fetch from 'node-fetch';

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

cloudinary.uploader.upload('/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_images/heatmap1.jpeg', {
    asset_folder: 'heatmaps',
    resource_type: 'image'})
  .then(console.log);