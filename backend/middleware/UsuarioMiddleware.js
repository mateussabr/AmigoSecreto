const Usuario = require('../model/Usuario');

module.exports = class UsuarioMiddleware {
    validar_nomeUsuario(request, response, next) {
   
        const nomeUsuario = request.body.nome;

        if (nomeUsuario.length < 3) {
            const objResposta = {
                status: false,
                msg: "O nome deve ter pelo menos 3 caracteres"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
    
    validar_emailUsuario(req, res, next) {
        const email = req.body.email;
        
        if (!email || typeof email !== 'string' || email.length < 3) {
            return res.status(400).json({
                status: false,
                msg: 'Email inválido'
            });
        }
        
        next();
    }   
}