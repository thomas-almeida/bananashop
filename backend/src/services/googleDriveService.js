import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

// === CONFIGURAÇÃO DO GOOGLE DRIVE ===
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const driveService = google.drive({ version: 'v3', auth });

// === FUNÇÃO PARA FAZER UPLOAD ===
async function uploadToDrive(filePath, fileName, folderId) {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: req.file.mimetype, // usa o mimetype do arquivo enviado
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  return response.data;
}

// === CONTROLLER EXPRESS ===
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const folderId = '14Hr2xNU2MRZLhW3xHVuzj37VMrQN5w3n'; // coloque o ID da pasta do Google Drive
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    const fileData = await uploadToDrive(filePath, fileName, folderId);

    // remove o arquivo local depois do upload
    fs.unlinkSync(filePath);

    res.json({
      message: 'Upload realizado com sucesso!',
      fileId: fileData.id,
      viewLink: fileData.webViewLink,
      downloadLink: fileData.webContentLink,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload para o Google Drive' });
  }
};
