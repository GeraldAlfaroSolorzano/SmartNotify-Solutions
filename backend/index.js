import "dotenv/config";

import { createServer } from "node:http";
import { Server } from "socket.io";

import app from "./app.js";
import { probarConexion } from "./config/database.js";

let port = Number(process.env.PORT);

if (!Number.isInteger(port)) {
    port = 3000;
}

const servidorHttp = createServer(app);

const io = new Server(servidorHttp, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: [
            "GET",
            "POST",
            "PUT"
        ]
    }
});

app.set("io", io);

io.on("connection", function manejarConexion(socket) {
    socket.on(
        "mensaje-chat",
        function recibirMensaje(mensaje) {
            if (!mensaje || typeof mensaje !== "object") {
                return;
            }

            if (
                mensaje.remitente !== "Cliente" &&
                mensaje.remitente !== "Tecnico"
            ) {
                return;
            }

            if (
                typeof mensaje.texto !== "string" ||
                mensaje.texto.trim() === ""
            ) {
                return;
            }

            io.emit(
                "mensaje-chat",
                {
                    remitente: mensaje.remitente,
                    texto: mensaje.texto.trim()
                }
            );
        }
    );

    socket.on(
        "tecnico-escribiendo",
        function recibirEstadoEscritura(estado) {
            if (typeof estado !== "boolean") {
                return;
            }

            socket.broadcast.emit(
                "tecnico-escribiendo",
                estado
            );
        }
    );
});

async function iniciarServidor() {
    try {
        await probarConexion();

        servidorHttp.listen(
            port,
            function servidorIniciado() {
                console.log(
                    `Servidor ejecutandose en http://localhost:${port}`
                );
            }
        );
    } catch (error) {
        console.error(error);
        console.error("No fue posible iniciar el servidor");

        process.exit(1);
    }
}

iniciarServidor();
