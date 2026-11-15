import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dsjxrospe";
const apiKey = process.env.CLOUDINARY_API_KEY || "119583979624217";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "8xLgf6h2XmEBk54NE7yg2O7mFec";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder = "apextechera_agency"
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.warn("[Cloudinary] Upload failed:", error?.message);
            // Fallback: create base64 data url so dev is never blocked
            const base64 = `data:image/png;base64,${fileBuffer.toString("base64")}`;
            resolve({
              success: true,
              url: base64,
              error: error?.message || "Cloudinary API inactive. Stored as local media.",
            });
          } else {
            resolve({ success: true, url: result.secure_url });
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (err: any) {
    return {
      success: false,
      url: "",
      error: err.message,
    };
  }
}
