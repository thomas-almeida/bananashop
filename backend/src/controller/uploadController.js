import { google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_ACCESS_TOKEN,
} = process.env;

// 🔐 Configura o cliente OAuth2 com suas credenciais pessoais
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  access_token: GOOGLE_ACCESS_TOKEN,
  refresh_token: GOOGLE_REFRESH_TOKEN,
});

// Cria instância da API do Drive
const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadToDrive(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const buffer = req.file.buffer; // o multer deve estar em modo memoryStorage

    const response = drive.files.create({
      requestBody: {
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: req.file.mimetype,
        body: Buffer.from(buffer),
      },
      fields: "id, name, webViewLink, webContentLink",
    });

    res.json({
      success: true,
      file: response.data,
    });
  } catch (error) {
    console.error("Erro no upload para o Drive:", error);
    res.status(500).json({ error: "Erro ao enviar arquivo", details: error.message });
  }
};

