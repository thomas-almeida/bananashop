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
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const filePath = path.resolve(file.path);

    // 📤 Envia o arquivo para o Drive
    const response = drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // opcional: pasta de destino
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(filePath),
      },
      fields: "id, name, webViewLink, webContentLink",
    });

    // 🧹 Remove o arquivo local após upload
    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      file: response.data,
    });
  } catch (error) {
    console.error("Erro ao enviar para o Google Drive:", error.message);
    return res.status(500).json({
      error: "Falha ao enviar arquivo para o Google Drive",
      details: error.message,
    });
  }
};
