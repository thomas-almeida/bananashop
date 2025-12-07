import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    normalizedName: { type: String, required: true, index: true },
    description: { type: String, required: true },
    igNickname: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    image: { type: String, default: "" },
    publicLink: { type: String, default: "" },
    views: { type: Number, default: 0 },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

// Middleware para normalizar o nome antes de salvar
StoreSchema.pre('save', function(next) {
    if (this.isModified('name') || this.isNew) {
        this.normalizedName = this.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais e espaços
    }
    next();
});

const Store = mongoose.model("Store", StoreSchema);

export default Store;

