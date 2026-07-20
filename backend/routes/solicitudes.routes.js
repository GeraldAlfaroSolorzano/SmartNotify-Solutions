import { Router } from "express";

import {
    actualizarEstadoSolicitud,
    actualizarInformacionSolicitud,
    cancelarSolicitud,
    cancelarSolicitudCorreo,
    confirmarSolucion,
    confirmarSolucionCorreo,
    consultarSolicitud,
    listarSolicitudes,
    mostrarFormularioCorreo,
    mostrarVistaSolicitud,
    procesarFormularioCorreo,
    registrarSolicitud
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.get(
    "/",
    listarSolicitudes
);

router.post(
    "/",
    registrarSolicitud
);

router.get(
    "/:id/vista",
    mostrarVistaSolicitud
);

router.get(
    "/:id/formulario",
    mostrarFormularioCorreo
);

router.post(
    "/:id/formulario",
    procesarFormularioCorreo
);

router.get(
    "/:id/cancelar-correo",
    cancelarSolicitudCorreo
);

router.get(
    "/:id/confirmar-correo",
    confirmarSolucionCorreo
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

router.get(
    "/:id",
    consultarSolicitud
);

export default router;
