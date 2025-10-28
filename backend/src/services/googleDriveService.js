import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { google } from 'googleapis';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === CONFIGURAÇÃO DO GOOGLE DRIVE ===
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const driveService = google.drive({ version: 'v3', auth });

// === FUNÇÃO PARA FAZER UPLOAD ===
async function uploadToDrive(filePath, fileName, folderId, mimeType) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    // Upload the file to the shared drive
    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      supportsAllDrives: true,  // Important for shared drives
      fields: 'id, name, webViewLink, webContentLink, webContentLink, thumbnailLink',
    });

    const fileId = response.data.id;

    // Set the file to be publicly accessible
    await driveService.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });

    // Get the file with updated permissions
    const file = await driveService.files.get({
      fileId: fileId,
      fields: 'id, name, webViewLink, webContentLink, thumbnailLink',
      supportsAllDrives: true,
    });

    return file.data;
  } catch (error) {
    console.error('Error in uploadToDrive:', error);
    throw error;
  }
}

// === CONTROLLER EXPRESS ===
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const folderId = '14Hr2xNU2MRZLhW3xHVuzj37VMrQN5w3n'; // coloque o ID da pasta do Google Drive
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    const fileData = await uploadToDrive(filePath, fileName, folderId, req.file.mimetype);

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
