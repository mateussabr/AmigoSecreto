const mongoose = require('mongoose');

module.exports = class SorteioMiddleware {

    validar_nomeSorteio(request, response, next) {
        const nome = request.body.nome;

        if (!nome || nome.trim().length === 0) {
            return response.status(400).json({
                status: false,
                msg: "O nome do sorteio é obrigatório."
            });
        }

        if (nome.length < 6) {
            return response.status(400).json({
                status: false,
                msg: "O nome do sorteio deve ter pelo menos 6 caracteres."
            });
        }

        next();
    }

    validar_participantes(request, response, next) {
    const participantes = request.body.participantes;

    // Se não vier nada, simplesmente deixa passar
    if (!participantes || participantes.length === 0) {
        return next();
    }

    // Validar ObjectId
    for (const id of participantes) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                status: false,
                msg: `O ID (${id}) não é válido.`
            });
        }
    }

    const setIds = new Set(participantes);
    if (setIds.size !== participantes.length) {
        return response.status(400).json({
            status: false,
            msg: "A lista de participantes contém IDs duplicados."
        });
    }

    next();
}
}
