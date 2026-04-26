import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully:", response.url);

    fs.unlinkSync(localPath);
    return response;
  } catch (error) {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    console.error("File upload failed", error);
    return null;
  }
};

/**
 * Extracts the public ID from a Cloudinary URL and deletes the file.
 * e.g. https://res.cloudinary.com/xxx/image/upload/v17xxx/yyy.jpg → yyy
 */
const deleteFromCloudinary = async (url) => {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;

    // Extract the public_id: everything between /upload/vXXXXX/ and the file extension
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const withVersion = parts[1]; // e.g. v1234567890/filename.jpg
    const withoutVersion = withVersion.replace(/^v\d+\//, ""); // e.g. filename.jpg
    const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // e.g. filename

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
