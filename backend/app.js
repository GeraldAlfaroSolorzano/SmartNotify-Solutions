import express from "express";

const app = express();

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

export default app;