const mongoose = require('mongoose');


async function conexao() {
 
  try {
    await mongoose.connect("mongodb+srv://dbUser:dbUser123@cluster0.ocygqzc.mongodb.net/amigo_secreto?retryWrites=true&w=majority");
    console.log("MongoDB conectado com sucesso!");
  } catch (erro) {
    console.error("Erro ao conectar ao Mongo:", erro);
  }
}

module.exports = conexao;