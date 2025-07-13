import ImageKit from "imagekit";
import { randomUUID as uuidv4 } from "crypto";
import envConfig from "../envConfig";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: envConfig.imagekit.publicKey,
  privateKey: envConfig.imagekit.privateKey,
  urlEndpoint: envConfig.imagekit.urlEndpoint,
});

// Types
type UploadOptions = {
  file: Buffer | string; // Buffer (for server uploads) or Base64 (for client)
  folder?: string;
  notifyOnError?: boolean;
};

type DeleteOptions = {
  fileId: string;
  notifyOnError?: boolean;
};

type UploadResponse = {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  metadata?: Record<string, any>;
  error?: string;
};

type DeleteResponse = {
  success: boolean;
  error?: string;
};

export const uploadToImagekit = async (
  options: UploadOptions
): Promise<UploadResponse> => {
  const { file, folder, notifyOnError = true } = options;
  try {
    const uniqueFileName = `${uuidv4()}`;
    console.log({ filename: uniqueFileName });

    const uploadResponse = await imagekit.upload({
      file,
      fileName: uniqueFileName,
      folder: folder || "/uploads", // Default folder
    });

    return {
      success: true,
      fileId: uploadResponse.fileId,
      fileUrl: uploadResponse.url,
      metadata: {
        width: uploadResponse.width,
        height: uploadResponse.height,
        size: uploadResponse.size,
        fileType: uploadResponse.fileType,
      },
    };
  } catch (error: any) {
    console.error("[ImageKit] Upload Error:", error.message);

    if (notifyOnError) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteFromImagekit = async (
  options: DeleteOptions
): Promise<DeleteResponse> => {
  const { fileId, notifyOnError = true } = options;
  try {
    await imagekit.deleteFile(fileId);

    return { success: true };
  } catch (error: any) {
    console.error("[ImageKit] Delete Error:", error.message);

    if (notifyOnError) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }

    return {
      success: false,
      error: error.message,
    };
  }
};
