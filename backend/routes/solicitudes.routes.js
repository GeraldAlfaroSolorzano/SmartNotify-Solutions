import { Router } from "express";

import {
    consultarSolicitud,
    listarSolicitudes,
    registrarSolicitud
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.get(
    "/",
    listarSolicitudes
);

router.get(
    "/consulta",
    consultarSolicitud
);

router.post(
    "/",
    registrarSolicitud
);

export default router;