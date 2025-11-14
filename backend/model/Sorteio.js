const mongoose = require('mongoose');

const SorteioSchema = new mongoose.Schema({
    nome: {
        type: String,
        default: "Sorteio Amigo Secreto"
    },

    data: {
        type: Date,
        default: Date.now
    },

    emailsEnviados: { type: Boolean, default: false },

    participantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }],

    resultado: [{
        participante: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },
        tirou: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        }
    }],

    ativo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Sorteio", SorteioSchema);
