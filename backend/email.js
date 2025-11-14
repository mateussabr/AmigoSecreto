const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "abreufagundesmateus@gmail.com",
        pass: "gwjg shap xvvm qngs",
    },
});

async function enviarEmail(destinatario, assunto, mensagemHtml) {
    const info = await transporter.sendMail({
        from: "abreufagundesmateus@gmail.com",
        to: destinatario,
        subject: assunto,
        html: mensagemHtml,
    });

    console.log("Email enviado: " + info.messageId);
}

module.exports = { enviarEmail };
