import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "dgq9fa4cp",
  api_key: "418636474356555",
  api_secret: "qgp_NusL2jvbc-OKngw-bJC0Wbw",
});

console.log("api_key :", process.env.PORT);

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Handle specific Cloudinary-related errors
    if (error && error.message && error.message.includes("Cloudinary")) {
      console.error("Cloudinary Error Details:", error);
    }
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

// function to delete image 
const deleteImageFromCloudinary = async (url) => {
  try {
    const publicId = extractPublicIdFromUrl(url)

    if (publicId) {
      const deletedImage = await cloudinary.api.delete_resources([publicId])
      // console.log("deletedImage : ", deletedImage);

    }
  } catch (error) {
    console.log("error while deleting image", error);
  }
}

// function to delete video 
const deleteVideoFromCloudinary = async (videoUrl) => {
  try {
    const publicId = extractPublicIdFromUrl(videoUrl)
    // console.log("video publicId : ", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video"
    });

    // console.log("result : ", result);

    if (result.result == "ok") {
      // console.log(`Video with public ID ${publicId} deleted successfully.`);
    } else {
      console.error(`Failed to delete video with public ID ${publicId}. Result:`, result);
    }
  } catch (error) {
    console.error('Error deleting video:', error);
  }

}

// extract publiId from url
const extractPublicIdFromUrl = (url) => {
  const parts = url.split('/')
  const fileName = parts[parts.length - 1];

  // https://res.cloudinary.com/dgq9fa4cp/image/upload/v1707584145/sdkpzqbhumtxcq5b7qdh.png
  // this is publicId : sdkpzqbhumtxcq5b7qdh
  const publicId = fileName.split('.')[0];

  // console.log("publicId : ", publicId);
  return publicId;

}

export { uploadOnCloudinary, deleteImageFromCloudinary, deleteVideoFromCloudinary };
