import { google } from 'googleapis';
import { Readable } from 'stream';

export const uploadToDrive = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const { originalname, mimetype, buffer } = req.file;

    // ✅ converte o buffer em um stream legível
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    // autenticação com suas credenciais do .env
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
      },
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    const drive = google.drive({ version: 'v3', auth });

    // ✅ envia o arquivo para o Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: originalname,
        mimeType: mimetype,
      },
      media: {
        mimeType: mimetype,
        body: bufferStream,
      },
      fields: 'id, webViewLink, webContentLink'
    });

    res.status(200).json({
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
    });
  } catch (error) {
    console.error('Erro no uploadToDrive:', error);
    res.status(500).json({
      error: 'Falha ao enviar arquivo para o Google Drive',
      details: error.message,
    });
  }
};
