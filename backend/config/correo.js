import "dotenv/config";

import nodemailer from "nodemailer";
import QRCode from "qrcode";

const variablesCorreo = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM"
];

for (const variable of variablesCorreo) {
    if (!process.env[variable]) {
        throw new Error(
            `Falta la variable de entorno ${variable}.`
        );
    }
}

const puertoCorreo = Number(process.env.SMTP_PORT);

if (!Number.isInteger(puertoCorreo)) {
    throw new Error("SMTP_PORT debe ser un numero entero.");
}

let conexionSegura = false;

if (process.env.SMTP_SECURE === "true") {
    conexionSegura = true;
}

const transportador = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: puertoCorreo,
    secure: conexionSegura,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s/g, "")
    }
});

export async function generarQR(url) {
    return QRCode.toBuffer(url, {
        width: 240,
        margin: 2
    });
}

export async function enviarCorreo(
    destinatario,
    asunto,
    contenidoHtml,
    adjuntos = []
) {
    return transportador.sendMail({
        from: process.env.SMTP_FROM,
        to: destinatario,
        subject: asunto,
        html: contenidoHtml,
        attachments: adjuntos
    });
}
