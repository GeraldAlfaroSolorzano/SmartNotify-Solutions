import cors from "cors";
import express from "express";

import solicitudesRoutes from "./routes/solicitudes.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get("/api", function obtenerEstadoServidor(req, res) {
    return res.status(200).json({
        success: true,
        message: "Servidor funcionando correctamente"
    });
});

app.use(
    "/api/solicitudes",
    solicitudesRoutes
);

export default app;