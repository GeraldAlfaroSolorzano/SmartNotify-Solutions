import {
    actualizarEstado,
    actualizarInformacion,
    cancelarSolicitud as cancelarSolicitudModelo,
    confirmarSolucion as confirmarSolucionModelo,
    crearSolicitud,
    obtenerSolicitudPorId,
    obtenerSolicitudes
} from "../models/solicitudes.model.js";

export async function listarSolicitudes(req, res) {
    try {
        const solicitudes = await obtenerSolicitudes();

        return res.status(200).json({
            success: true,
            data: solicitudes
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible consultar las solicitudes."
        });
    }
}

export async function consultarSolicitud(req, res) {
    try {
        const solicitud = await obtenerSolicitudPorId(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible consultar la solicitud."
        });
    }
}

export async function registrarSolicitud(req, res) {
    try {
        const solicitud = await crearSolicitud(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Solicitud registrada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible registrar la solicitud."
        });
    }
}

export async function actualizarInformacionSolicitud(
    req,
    res
) {
    try {
        const solicitud = await actualizarInformacion(
            req.params.id,
            req.body.informacionAdicional
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Informacion actualizada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible actualizar la informacion."
        });
    }
}

export async function actualizarEstadoSolicitud(
    req,
    res
) {
    try {
        const solicitud = await actualizarEstado(
            req.params.id,
            req.body.estado
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        const io = req.app.get("io");

        io.emit(
            "estado-solicitud",
            solicitud
        );

        return res.status(200).json({
            success: true,
            message: "Estado actualizado correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible actualizar el estado."
        });
    }
}

export async function cancelarSolicitud(req, res) {
    try {
        const solicitud = await cancelarSolicitudModelo(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        const io = req.app.get("io");

        io.emit(
            "estado-solicitud",
            solicitud
        );

        return res.status(200).json({
            success: true,
            message: "Solicitud cancelada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible cancelar la solicitud."
        });
    }
}

export async function confirmarSolucion(req, res) {
    try {
        const solicitud = await confirmarSolucionModelo(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Solucion confirmada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible confirmar la solucion."
        });
    }
}