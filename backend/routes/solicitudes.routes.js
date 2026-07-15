import { Router } from "express";

import {
    registrarSolicitud
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.post(
    "/",
    registrarSolicitud
);

export default router;