import Product from "../db/models/Products.js";
import Store from "../db/models/Store.js";
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);

export const importProductsFromCSV = async (req, res) => {
    try {
        const { storeId } = req.params;
        
        // Verifica se a loja existe
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const results = [];
        const errors = [];
        let successCount = 0;
        let errorCount = 0;

        // Processa o arquivo CSV
        await pipelineAsync(
            createReadStream(req.file.path),
            csv({
                mapHeaders: ({ header }) => header.trim(),
                mapValues: ({ value }) => value.trim()
            })
            .on('data', (data) => results.push(data))
            .on('error', (error) => {
                console.error('Error processing CSV:', error);
                errors.push('Error processing CSV file');
            })
        );

        // Processa cada linha do CSV
        for (const [index, row] of results.entries()) {
            try {
                // Valida os campos obrigatórios
                if (!row.name || !row.price || !row.description) {
                    errors.push(`Linha ${index + 2}: Nome, preço e descrição são obrigatórios`);
                    errorCount++;
                    continue;
                }

                // Prepara as imagens, garantindo que o campo 'image' seja o primeiro item do array
                let images = [];
                if (row.image) {
                    images.push(row.image.trim());
                }
                if (row.images) {
                    // Adiciona as imagens adicionais, removendo duplicatas
                    const additionalImages = row.images.split(',')
                        .map(img => img.trim())
                        .filter(img => img && !images.includes(img));
                    images = [...images, ...additionalImages];
                }

                // Cria o produto
                const product = new Product({
                    name: row.name,
                    price: parseFloat(row.price) || 0,
                    description: row.description,
                    brand: row.brand || "",
                    images: images,
                    category: row.category || "",
                    inStorage: parseInt(row.inStorage) || 0,
                    store: storeId
                });

                // Define o publicLink
                product.publicLink = `${process.env.PUBLIC_BASEURL}/produto/${product._id}`;
                
                // Salva o produto
                await product.save();

                // Adiciona o produto à loja
                store.products.push(product._id);
                await store.save();

                successCount++;
            } catch (error) {
                console.error(`Error processing row ${index + 2}:`, error);
                errors.push(`Linha ${index + 2}: ${error.message}`);
                errorCount++;
            }
        }

        return res.status(201).json({
            message: `Importação concluída. ${successCount} produtos importados com sucesso.`,
            successCount,
            errorCount,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error("Error importing products:", error);
        return res.status(500).json({
            message: "Error importing products",
            error: error.message
        });
    }
};
