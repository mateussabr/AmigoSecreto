const express = require('express');

const Usuario = require('../model/Usuario');

module.exports = class UsuarioControl {
    async usuario_create_control(request, response) {
        try {
            const dados = request.body;
            const usuario = await Usuario.create(dados);
            return response.status(201).json(usuario);
        } catch (erro) {
            return response.status(500).json({ erro: erro.message });
        }
    }

    async usuario_update_control(req, res) {
        try {
            const id = req.params.idUsuario;
            const dados = req.body;

            const usuario = await Usuario.findByIdAndUpdate(id, dados, { new: true });

            return res.json({
                status: true,
                msg: "Usuário atualizado com sucesso",
                usuario
            });
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }
    
   
   async usuario_delete_control(req, res) {
    try {
            const id = req.params.idUsuario;

            const deletado = await Usuario.findByIdAndDelete(id);

            return res.json({
                status: !!deletado,
                msg: deletado ? "Usuário excluído" : "Usuário não encontrado"
            });
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    async usuario_read_all_control(req, res) {
        const usuarios = await Usuario.find();
        return res.json(usuarios);
    }


    async usuario_read_by_id_control(req, res) {
        const usuario = await Usuario.findById(req.params.idUsuario);
        return res.json({
            status: !!usuario,
            usuario
        });
    }

};