const { enviarEmail } = require("../email");
const Sorteio = require('../model/Sorteio');

module.exports = class SorteioControl {

    async sorteio_create_control(req, res) {
        try {
            const dados = req.body;
            const sorteio = await Sorteio.create(dados);
            return res.status(201).json(sorteio);
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    // =======================
    // GERAR RESULTADO
    // =======================
    async gerar_resultado_control(req, res) {
        try {
            const { idSorteio } = req.params;

            const sorteio = await Sorteio.findById(idSorteio).populate("participantes");
            if (!sorteio) return res.status(404).json({ erro: "Sorteio não encontrado" });

            const participantes = [...sorteio.participantes];

            if (participantes.length < 2) {
                return res.status(400).json({ erro: "Precisa de pelo menos 2 participantes" });
            }

            // Função segura para embaralhar
            function embaralharSemRepeticao(lista) {
                let embaralhado = [...lista];
                let tentativas = 0;

                while (tentativas < 20) {
                    embaralhado = embaralhado.sort(() => Math.random() - 0.5);

                    let ok = true;
                    for (let i = 0; i < lista.length; i++) {
                        if (lista[i]._id.equals(embaralhado[i]._id)) {
                            ok = false;
                            break;
                        }
                    }

                    if (ok) return embaralhado;
                    tentativas++;
                }

                throw new Error("Falha ao gerar sorteio sem auto-sorteio");
            }

            const embaralhado = embaralharSemRepeticao(participantes);

            const resultado = participantes.map((p, i) => ({
                participante: p._id,
                tirou: embaralhado[i]._id
            }));

            sorteio.resultado = resultado;
            await sorteio.save();

            res.json(sorteio);

        } catch (err) {
            console.log("ERRO AO GERAR:", err);
            res.status(500).json({ erro: "Erro interno ao gerar sorteio" });
        }
    }

    // =======================
    // UPDATE
    // =======================
    async sorteio_update_control(req, res) {
        try {
            const id = req.params.idSorteio;
            const dados = req.body;

            const sorteioAtualizado = await Sorteio.findByIdAndUpdate(id, dados, { new: true });

            return res.json({
                status: !!sorteioAtualizado,
                msg: "Sorteio atualizado com sucesso",
                sorteio: sorteioAtualizado
            });

        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    // =======================
    // DELETE
    // =======================
    async sorteio_delete_control(req, res) {
        try {
            const id = req.params.idSorteio;
            const deletado = await Sorteio.findByIdAndDelete(id);

            return res.json({
                status: !!deletado,
                msg: deletado ? "Sorteio excluído" : "Sorteio não encontrado"
            });

        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    // =======================
    // LISTA TODOS
    // =======================
    async sorteio_read_all_control(req, res) {
        const sorteios = await Sorteio.find()
            .populate("participantes")
            .populate("resultado.participante")
            .populate("resultado.tirou");

        return res.json(sorteios);
    }

    // =======================
    // LER POR ID
    // =======================
async sorteio_read_by_id_control(req, res) {
  try {
    const id = req.params.idSorteio;

    const sorteio = await Sorteio.findById(id)
      .populate("participantes")                       // popula participantes (array)
      .populate("resultado.participante")
      .populate("resultado.tirou");

    if (!sorteio) {
      return res.status(404).json({ erro: "Sorteio não encontrado" });
    }

    // Retorna o objeto sorteio já populado — cliente acessa res.data.resultado
    return res.json(sorteio);
  } catch (err) {
    console.error("Erro ao buscar sorteio por id:", err);
    return res.status(500).json({ erro: err.message });
  }
}

async mandar_email_control(req, res) {
    try {
        const sorteio = await Sorteio.findById(req.params.idSorteio)
            .populate("participantes")
            .populate("resultado.participante")
            .populate("resultado.tirou");

        if (!sorteio) return res.status(404).json({ erro: "Sorteio não encontrado" });

        const participantes = sorteio.participantes;
        const resultados = sorteio.resultado;

        for (const participante of participantes) {
            if (!participante.email) continue;

            const resultadoDoCara = resultados.find(r =>
                r.participante._id.toString() === participante._id.toString()
            );

            if (!resultadoDoCara) continue;

            const mensagem = `
                <h2>Amigo Secreto 🎁</h2>
                <p>Você tirou <strong>${resultadoDoCara.tirou.nome}</strong>!</p>
                <p>Boa sorte e divirta-se!</p>
            `;

            await enviarEmail(
                participante.email,
                "Seu Amigo Secreto",
                mensagem
            );
        }

        res.json({ status: "E-mails enviados com sucesso!" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao enviar emails" });
    }
}
};
