import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// tokens gerados pelo seu getToken.js
const TOKEN = {
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  scope: 'https://www.googleapis.com/auth/drive.file',
  token_type: 'Bearer',
  expiry_date: 1761622666372
};

// substitua pelo caminho do seu credentials.json (do Google Cloud)
const CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

// autenticação OAuth2
const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(TOKEN);

// inicializa a API do Drive
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

export const uploadToDrive = async (req, res) => {
  try {
    const filePath = req.file.path;

    const fileMetadata = {
      name: req.file.originalname,
      parents: ['14Hr2xNU2MRZLhW3xHVuzj37VMrQN5w3n'] // coloque o ID da pasta do seu Drive
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });

    // remove o arquivo local depois do upload
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      downloadLink: response.data.webContentLink
    });

  } catch (error) {
    console.error('Erro no upload:', error.message);
    res.status(500).json({ error: error.message });
  }
};
