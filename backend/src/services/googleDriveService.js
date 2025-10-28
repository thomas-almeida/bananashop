import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Caminho para o arquivo de credenciais na raiz do projeto backend
const CREDENTIALS_PATH = path.resolve(process.cwd(), 'credentials.json');
let credentials;

// Carrega as credenciais do arquivo credentials.json
console.log('Caminho para o arquivo de credenciais:', CREDENTIALS_PATH);

try {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} catch (error) {
    console.error('Erro ao carregar o arquivo credentials.json:', error.message);
    throw new Error('Arquivo credentials.json não encontrado ou inválido na raiz do projeto backend');
}

// Configura a autenticação com Google Auth usando conta de serviço
const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

// Configura o serviço do Google Drive
const drive = google.drive({ version: 'v3', auth });

/**
 * Faz upload de um arquivo para o Google Drive
 * @param {Object} file - Arquivo enviado pelo multer
 * @param {string} folderId - ID da pasta no Google Drive (opcional)
 * @returns {Promise<string>} - URL pública do arquivo
 */
export const uploadFile = async (file, folderId = "1c2uGUjwQ3Q5Qv_K8Yf5Z_6-bLnTdfL_L") => {
    try {
        // Define as permissões do arquivo
        const fileMetadata = {
            name: `${Date.now()}-${file.originalname}`,
            mimeType: file.mimetype,
            parents: folderId ? [folderId] : []
        };

        const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path)
        };

        // Faz o upload do arquivo
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink,webContentLink'
        });

        // Configura as permissões para público
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Obtém a URL pública do arquivo
        const fileId = response.data.id;
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink,webContentLink,thumbnailLink'
        });

        // Remove o arquivo temporário
        fs.unlinkSync(file.path);

        // Retorna a URL de visualização ou o link de download
        return result.data.webViewLink || `https://drive.google.com/uc?export=view&id=${fileId}`;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        // Remove o arquivo temporário em caso de erro
        if (file && file.path) {
            fs.unlinkSync(file.path);
        }
        throw new Error('Failed to upload file to Google Drive');
    }
};

/**
 * Deleta um arquivo do Google Drive
 * @param {string} fileId - ID do arquivo no Google Drive
 */
export const deleteFile = async (fileId) => {
    try {
        await drive.files.delete({
            fileId: fileId
        });
    } catch (error) {
        console.error('Error deleting file from Google Drive:', error);
        throw new Error('Failed to delete file from Google Drive');
    }
};
