const express = require('express');

const SorteioControl = require('../controller/SorteioControl');

const SorteioMiddleware = require('../middleware/SorteioMiddleware');

module.exports = class SorteioRouter {

    constructor() {
        this._router = express.Router();

        this._sorteioControl = new SorteioControl();

        this._sorteioMiddleware = new SorteioMiddleware();
    }

    criarRotasSorteio() {
        this._router.get('/', this._sorteioControl.sorteio_read_all_control);
 
        this._router.get('/:idSorteio', this._sorteioControl.sorteio_read_by_id_control);
 
        this._router.post('/', this._sorteioMiddleware.validar_nomeSorteio, this._sorteioMiddleware.validar_participantes, this._sorteioControl.sorteio_create_control);

        this._router.delete('/:idSorteio', this._sorteioControl.sorteio_delete_control);
        
        this._router.put('/:idSorteio', this._sorteioMiddleware.validar_nomeSorteio, this._sorteioMiddleware.validar_participantes, this._sorteioControl.sorteio_update_control);
 
        this._router.post('/:idSorteio/gerar', this._sorteioControl.gerar_resultado_control);

        this._router.post('/:idSorteio/enviar-email', this._sorteioControl.mandar_email_control);

        return this._router;
    }

}