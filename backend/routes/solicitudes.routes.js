import { Router } from "express";

import {
    actualizarEstadoSolicitud,
    actualizarInformacionSolicitud,
    cancelarSolicitud,
    confirmarSolucion,
    conectarSse,
    consultarSolicitud,
    listarSolicitudes,
    registrarSolicitud
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.get(
    "/eventos",
    conectarSse
);

router.get(
    "/",
    listarSolicitudes
);

router.get(
    "/:id",
    consultarSolicitud
);

router.post(
    "/",
    registrarSolicitud
);

router.put(
    "/:id/informacion",
    actualizarInformacionSolicitud
);

router.put(
    "/:id/estado",
    actualizarEstadoSolicitud
);

router.put(
    "/:id/cancelar",
    cancelarSolicitud
);

router.put(
    "/:id/confirmar",
    confirmarSolucion
);

export default router;