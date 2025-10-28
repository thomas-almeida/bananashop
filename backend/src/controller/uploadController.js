import { uploadFile } from '../services/googleDriveService.js';
import multer from 'multer';
import path from 'path';

// Configuração do multer para upload temporário
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Tipo de arquivo não suportado. Apenas imagens são permitidas.');
        error.code = 'LIMIT_FILE_TYPES';
        return cb(error, false);
    }
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

/**
 * Controlador para upload de imagens
 */
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo enviado.'
            });
        }

        // Faz o upload da imagem para o Google Drive
        const imageUrl = await uploadFile(req.file);

        return res.status(200).json({
            success: true,
            message: 'Imagem enviada com sucesso!',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        
        let errorMessage = 'Erro ao fazer upload da imagem';
        if (error.code === 'LIMIT_FILE_SIZE') {
            errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 5MB';
        } else if (error.code === 'LIMIT_FILE_TYPES') {
            errorMessage = error.message;
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
