import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();

let port = Number(process.env.PORT);

if (!port) {
    port = 3000;
}

app.listen(port, function servidorIniciado() {
    console.log(
        `Servidor ejecutandose en http://localhost:${port}`
    );
});