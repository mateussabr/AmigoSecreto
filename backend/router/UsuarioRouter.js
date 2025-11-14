const express = require('express');

const UsuarioControl = require('../controller/UsuarioControl');

const UsuarioMiddleware = require('../middleware/UsuarioMiddleware');

module.exports = class UsuarioRouter {

    constructor() {
        this._router = express.Router();

        this._usuarioControl = new UsuarioControl();

        this._usuarioMiddleware = new UsuarioMiddleware();
    }

    criarRotasUsuario() {
        this._router.get('/', this._usuarioControl.usuario_read_all_control);
 
        this._router.get('/:idUsuario', this._usuarioControl.usuario_read_by_id_control);
 
        this._router.post('/', this._usuarioMiddleware.validar_nomeUsuario,  this._usuarioMiddleware.validar_emailUsuario, this._usuarioControl.usuario_create_control);

        this._router.delete('/:idUsuario', this._usuarioControl.usuario_delete_control);
        
        this._router.put('/:idUsuario', this._usuarioMiddleware.validar_nomeUsuario, this._usuarioMiddleware.validar_emailUsuario, this._usuarioControl.usuario_update_control);
 
        return this._router;
    }

}