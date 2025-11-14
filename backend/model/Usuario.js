const mongoose = require('mongoose');

// Definir o schema: isso é tipo "descrever" o formato do documento
const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true
});

// Model do mongo (equivalente à classe)
const Usuario = mongoose.model("Usuario", UsuarioSchema);

module.exports = Usuario;