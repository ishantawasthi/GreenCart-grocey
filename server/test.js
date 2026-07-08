import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const buffer = fs.readFileSync('./test-image.jpg');

new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  ).end(buffer);
})
.then(r => console.log('SUCCESS:', r.secure_url))
.catch(e => console.log('FAIL:', e.message, e.http_code));