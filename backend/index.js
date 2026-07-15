import "dotenv/config";

import app from "./app.js";
import { probarConexion } from "./config/database.js";

let port = Number(process.env.PORT);

if (!port) {
    port = 3000;
}

async function iniciarServidor() {
    try {
        await probarConexion();

        app.listen(port, function servidorIniciado() {
            console.log(
                `Servidor ejecutandose en http://localhost:${port}`
            );
        });
    } catch (error) {
        console.error("No fue posible iniciar el servidor");

        process.exit(1);
    }
}

iniciarServidor();