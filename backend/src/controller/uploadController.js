import multer from "multer";
import cloudinary from "../config/cloundinary.js";

const storage = multer.memoryStorage()
export const upload = multer({ storage: storage })

export async function uploadImage(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      })
    }

    // Upload para o Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' }, // Pasta no Cloudinary
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      stream.end(req.file.buffer);
    });

    // Retorna a URL pública
    res.json({
      message: 'Upload realizado com sucesso!',
      imageUrl: result.secure_url
    });


  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      message: "Error uploading image",
      error: error.message
    });
  }
}
