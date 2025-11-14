const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");   
const express = require('express');
const cors = require('cors');
const conexao = require('./database/conexao');
const UsuarioRouter = require('./router/UsuarioRouter');
const SorteioRouter = require('./router/SorteioRouter');

conexao()

const app = express();
const portaServico = 3000;

app.use(cors());
app.use(express.json());

const usuarioRoteador = new UsuarioRouter();
const sorteioRoteador = new SorteioRouter();

app.use('/usuarios', usuarioRoteador.criarRotasUsuario());
app.use('/sorteios',sorteioRoteador.criarRotasSorteio());


app.listen(portaServico, () => {    
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});

