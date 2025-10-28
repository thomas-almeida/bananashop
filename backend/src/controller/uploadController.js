import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de credenciais
const CREDENTIALS_PATH = path.resolve(__dirname, '../../../credentials.json');

// Carrega as credenciais do arquivo
let credentials;
try {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} catch (error) {
    console.error('Erro ao carregar o arquivo credentials.json:', error.message);
    throw new Error('Arquivo credentials.json não encontrado ou inválido');
}

// Configura a autenticação com a conta de serviço
const auth = new google.auth.GoogleAuth({
    credentials: {
        type: 'service_account',
        project_id: credentials.project_id,
        private_key_id: credentials.private_key_id,
        private_key: credentials.private_key,
        client_email: credentials.client_email,
        client_id: credentials.client_id,
        token_url: credentials.token_uri,
        universe_domain: credentials.universe_domain,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

// Inicializa a API do Drive com a autenticação da conta de serviço
const drive = google.drive({ version: 'v3', auth });

export const uploadToDrive = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const filePath = req.file.path;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const folderId = '14Hr2xNU2MRZLhW3xHVuzj37VMrQN5w3n'; // ID da pasta compartilhada

    // Define os metadados do arquivo
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    // Configura a mídia para upload
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath)
    };

    // Faz o upload do arquivo
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      supportsAllDrives: true, // Importante para pastas compartilhadas
      fields: 'id, name, webViewLink, webContentLink, webContentLink, thumbnailLink',
    });

    const fileId = response.data.id;

    // Configura as permissões para público
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });

    // Obtém os links atualizados
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink, thumbnailLink',
      supportsAllDrives: true,
    });

    // Remove o arquivo local
    fs.unlinkSync(filePath);

    // Retorna os dados do arquivo
    res.json({
      success: true,
      fileId: fileId,
      webViewLink: file.data.webViewLink || `https://drive.google.com/uc?export=view&id=${fileId}`,
      downloadLink: file.data.webContentLink || `https://drive.google.com/uc?export=download&id=${fileId}`,
      thumbnailLink: file.data.thumbnailLink
    });

  } catch (error) {
    console.error('Erro no upload para o Google Drive:', error);
    
    // Remove o arquivo temporário em caso de erro
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Erro ao fazer upload do arquivo',
      details: error.message 
    });
  }
};
